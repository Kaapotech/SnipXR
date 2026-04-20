import { NextResponse } from 'next/server';

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
    const code = Math.random().toString(36).substring(2, 8);
    
    // În producție, ar trebui să folosești o variabilă de mediu (ENV) pentru domeniu
    // Ex: const domain = process.env.NEXT_PUBLIC_BASE_URL || 'https://snipxr.com';
    const domain = 'https://snipxr.com';
    const shortUrl = `${domain}/${code}`;

    // TODO: Aici trebuie integrată baza de date (Prisma/Supabase)
    // await db.link.create({ data: { code, originalUrl: url } });

    return NextResponse.json({ shortUrl, code });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
