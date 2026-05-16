import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { shortenLimiter, getClientIp, redis } from "@/lib/rate-limit";

const ANON_LINK_LIMIT = 3;
const USER_LINK_LIMIT = 5;

// Funcție utilă pentru validarea URL-urilor pe server
function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const { success } = await shortenLimiter.limit(getClientIp(request));
  if (!success) return new Response(
    JSON.stringify({ error: "Too many requests. Please try again later." }),
    { status: 429, headers: { "Content-Type": "application/json" } }
  );

  try {
    const session = await getServerSession(authOptions);
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    if (!isValidUrl(url)) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    if (session?.user?.id) {
      // Logat: max 5 linkuri pe luna
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const count = await db.link.count({
        where: { userId: session.user.id, createdAt: { gte: startOfMonth } },
      });

      if (count >= USER_LINK_LIMIT) {
        return NextResponse.json(
          { error: "You've reached your 5 links/month limit.", limitReached: true },
          { status: 403 }
        );
      }
    } else {
      // Anonim: max 3 linkuri total
      const ip = getClientIp(request);
      const key = `anon:links:${ip}`;
      const count = await redis.get<number>(key) ?? 0;

      if (count >= ANON_LINK_LIMIT) {
        return NextResponse.json(
          { error: "You've reached the 3-link limit. Create a free account to get more.", limitReached: true, requiresAccount: true },
          { status: 403 }
        );
      }
    }

    // Generăm un cod unic de 6 caractere cu retry pe conflict
    let newLink;
    while (true) {
      const code = Math.random().toString(36).substring(2, 8);
      try {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        newLink = await db.link.create({
          data: {
            originalUrl: url,
            shortCode: code,
            userId: session?.user?.id || null,
            expiresAt,
          },
        });
        break;
      } catch (e: any) {
        if (e.code !== 'P2002') throw e;
        // cod duplicat — reincercam cu un cod nou
      }
    }

    if (!session?.user?.id) {
      const ip = getClientIp(request);
      const key = `anon:links:${ip}`;
      await redis.incr(key);
    }

    const origin = new URL(request.url).origin;
    const shortUrl = `${origin}/${newLink.shortCode}`;

    return NextResponse.json({ shortUrl, code: newLink.shortCode });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
