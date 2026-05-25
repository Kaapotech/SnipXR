import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Link from 'next/link';
import { Zap, AlertTriangle } from 'lucide-react';
import db from '@/lib/db';
import { parseBrowser, parseDevice } from '@/lib/ua-parser';
import PageRenderer from '@/components/page-templates/PageRenderer';
import { PageLink, PageColors, BorderStyle } from '@/components/page-templates/types';

interface Props {
  params: Promise<{ code: string }>;
}

export default async function RedirectPage({ params }: Props) {
  const { code } = await params;

  // 1. Check if it's a bio page
  const page = await db.page.findUnique({ where: { slug: code } });
  if (page && page.published) {
    const links = (page.links as PageLink[]) ?? [];
    const colors = (page.colors as Partial<PageColors>) ?? {};
    return (
      <PageRenderer
        templateId={page.templateId}
        data={{
          name: page.name,
          bio: page.bio,
          avatarUrl: page.avatarUrl,
          links,
          borderStyle: (page.borderStyle as BorderStyle) ?? 'full',
          colors,
          showJoinButton: page.showJoinButton,
        }}
      />
    );
  }

  // 2. Check if it's a short link
  let targetUrl: string | null = null;

  try {
    const linkData = await db.link.findUnique({
      where: { shortCode: code }
    });

    if (linkData && (!linkData.expiresAt || linkData.expiresAt > new Date())) {
      const headersList = await headers();
      const ua = headersList.get('user-agent') ?? '';
      const country = headersList.get('x-vercel-ip-country') ?? 'Unknown';
      const browser = parseBrowser(ua);
      const device = parseDevice(ua);

      await Promise.all([
        db.link.update({
          where: { id: linkData.id },
          data: { clicks: { increment: 1 } }
        }),
        db.clickEvent.create({
          data: {
            linkId: linkData.id,
            country,
            browser,
            device,
          }
        })
      ]);

      targetUrl = linkData.originalUrl;
    }
  } catch {
    // DB error — afișăm pagina de not found
  }

  if (targetUrl) {
    redirect(targetUrl);
  }

  // 3. Not found
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-4">
      <div className="bg-dark-gray border border-white/10 p-12 rounded-3xl max-w-md w-full text-center shadow-2xl animate-fade-in">
        <div className="bg-red-500/10 p-4 rounded-2xl inline-block mb-6">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>

        <h1 className="text-3xl font-black mb-4">Link Expired or Not Found</h1>
        <p className="text-gray-400 mb-8 leading-relaxed">
          The link you&apos;re looking for (<code>{code}</code>) doesn&apos;t exist or has been removed from our system.
        </p>

        <Link
          href="/"
          className="bg-white text-black font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-all active:scale-95"
        >
          <Zap className="w-4 h-4 fill-black" />
          Create your own link
        </Link>
      </div>

      <div className="mt-8 text-gray-600 text-sm">
        &copy; 2026 SnipXR - Premium Link Management
      </div>
    </div>
  );
}
