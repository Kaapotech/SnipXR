import { NextResponse } from 'next/server';
import db from '@/lib/db';

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
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    if (!isValidUrl(url)) {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Generăm un cod unic de 6 caractere
    let code = Math.random().toString(36).substring(2, 8);
    
    // Verificăm dacă codul există deja (rar, dar posibil)
    let exists = await db.link.findUnique({ where: { shortCode: code } });
    while (exists) {
      code = Math.random().toString(36).substring(2, 8);
      exists = await db.link.findUnique({ where: { shortCode: code } });
    }

    // Salvăm în baza de date
    const newLink = await db.link.create({
      data: {
        originalUrl: url,
        shortCode: code,
      }
    });

    const domain = process.env.NEXT_PUBLIC_BASE_URL || 'https://snipxr.com';
    const shortUrl = `${domain}/${code}`;

    return NextResponse.json({ shortUrl, code: newLink.shortCode });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
