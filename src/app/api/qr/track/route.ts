import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

const QR_LIMIT = 5;

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json(
      { allowed: false, error: "You must be logged in to download QR codes." },
      { status: 401 }
    );
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const count = await db.qrUsage.count({
    where: { userId: session.user.id, createdAt: { gte: startOfMonth } },
  });

  if (count >= QR_LIMIT) {
    return NextResponse.json(
      { allowed: false, error: "You've reached your 5 QR downloads/month limit.", limitReached: true },
      { status: 403 }
    );
  }

  await db.qrUsage.create({ data: { userId: session.user.id } });

  return NextResponse.json({ allowed: true, remaining: QR_LIMIT - count - 1 });
}
