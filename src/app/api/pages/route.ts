import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const pages = await db.page.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(pages);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { slug, templateId, name, bio, avatarUrl, links, borderStyle, colors, showJoinButton } = body;

  if (!slug || !name || !templateId) {
    return NextResponse.json({ error: 'slug, name and templateId are required.' }, { status: 400 });
  }

  const slugClean = slug.toLowerCase().replace(/[^a-z0-9-_]/g, '');
  if (!slugClean) return NextResponse.json({ error: 'Invalid slug.' }, { status: 400 });

  // Check slug not taken by a Link or another Page
  const [existingLink, existingPage] = await Promise.all([
    db.link.findUnique({ where: { shortCode: slugClean } }),
    db.page.findUnique({ where: { slug: slugClean } }),
  ]);
  if (existingLink || existingPage) {
    return NextResponse.json({ error: 'This slug is already taken.' }, { status: 409 });
  }

  const page = await db.page.create({
    data: {
      userId: session.user.id,
      slug: slugClean,
      templateId: Number(templateId),
      name,
      bio: bio || null,
      avatarUrl: avatarUrl || null,
      links: links ?? [],
      borderStyle: borderStyle ?? 'full',
      colors: colors ?? {},
      showJoinButton: showJoinButton !== false,
    },
  });

  return NextResponse.json(page, { status: 201 });
}
