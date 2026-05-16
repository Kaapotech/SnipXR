import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { shortenLimiter, getClientIp } from "@/lib/rate-limit";

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

    // Generăm un cod unic de 6 caractere
    let code = Math.random().toString(36).substring(2, 8);
    
    // Verificăm dacă codul există deja
    let exists = await db.link.findUnique({ where: { shortCode: code } });
    while (exists) {
      code = Math.random().toString(36).substring(2, 8);
      exists = await db.link.findUnique({ where: { shortCode: code } });
    }

    // Salvăm în baza de date, asociind userId dacă utilizatorul este logat
    const newLink = await db.link.create({
      data: {
        originalUrl: url,
        shortCode: code,
        userId: session?.user?.id || null, // Dacă e logat, salvăm ID-ul
      }
    });

    const origin = new URL(request.url).origin;
    const shortUrl = `${origin}/${code}`;

    return NextResponse.json({ shortUrl, code: newLink.shortCode });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
