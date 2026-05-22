import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

const USER_LINK_LIMIT = 15;

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { codes } = await request.json();
  if (!Array.isArray(codes) || codes.length === 0) {
    return NextResponse.json({ claimed: 0 });
  }

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const usedThisMonth = await db.link.count({
    where: { userId: session.user.id, createdAt: { gte: startOfMonth } },
  });

  const remaining = USER_LINK_LIMIT - usedThisMonth;
  if (remaining <= 0) {
    return NextResponse.json({ claimed: 0 });
  }

  // Găsim linkurile anonime care pot fi claimed, limitat la sloturile rămase
  const claimable = await db.link.findMany({
    where: { shortCode: { in: codes }, userId: null },
    select: { id: true },
    take: remaining,
  });

  if (claimable.length === 0) {
    return NextResponse.json({ claimed: 0 });
  }

  const result = await db.link.updateMany({
    where: { id: { in: claimable.map((l) => l.id) } },
    data: { userId: session.user.id },
  });

  return NextResponse.json({ claimed: result.count });
}
