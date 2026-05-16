import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { codes } = await request.json();
  if (!Array.isArray(codes) || codes.length === 0) {
    return NextResponse.json({ claimed: 0 });
  }

  const result = await db.link.updateMany({
    where: {
      shortCode: { in: codes },
      userId: null,
    },
    data: { userId: session.user.id },
  });

  return NextResponse.json({ claimed: result.count });
}
