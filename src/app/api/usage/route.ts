import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { redis, getClientIp } from "@/lib/rate-limit";

const ANON_LINK_LIMIT = 3;
const USER_LINK_LIMIT = 5;
const QR_LIMIT = 3;

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (session?.user?.id) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [linksUsed, qrUsed] = await Promise.all([
      db.link.count({ where: { userId: session.user.id, createdAt: { gte: startOfMonth } } }),
      db.qrUsage.count({ where: { userId: session.user.id, createdAt: { gte: startOfMonth } } }),
    ]);

    return NextResponse.json({
      links: { used: linksUsed, limit: USER_LINK_LIMIT },
      qr: { used: qrUsed, limit: QR_LIMIT },
    });
  }

  // Anonim — doar linkuri, tracked în Redis
  const ip = getClientIp(request);
  const linksUsed = await redis.get<number>(`anon:links:${ip}`) ?? 0;

  return NextResponse.json({
    links: { used: linksUsed, limit: ANON_LINK_LIMIT },
    qr: null,
  });
}
