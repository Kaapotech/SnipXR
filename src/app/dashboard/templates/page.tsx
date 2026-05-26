import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { Layout, ArrowRight, Globe, Eye, EyeSlash, Trash, ArrowCounterClockwise } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { deletePageAction, togglePublishAction, renewPageAction } from './actions';

const TEMPLATE_NAMES: Record<number, string> = {
  1: 'Dark Minimal',
  2: 'Yellow Brand',
  3: 'Glass Frost',
  4: 'Gradient Purple',
  5: 'Neon Glow',
  6: 'Clean Light',
};

export default async function DashboardTemplatesPage() {
  const session = await getServerSession(authOptions);

  const pages = await db.page.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <header className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter mb-2">Templates</h1>
          <p className="text-gray-400">Manage your published pages.</p>
        </div>
        <Link
          href="/templates/create"
          className="flex items-center gap-2 bg-brand-yellow text-black font-bold px-5 py-3 rounded-2xl hover:bg-brand-yellow/90 transition-all active:scale-95 shrink-0"
        >
          New page <ArrowRight size={16} weight="bold" />
        </Link>
      </header>

      {pages.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-3xl p-20 text-center">
          <div className="p-4 bg-brand-yellow/10 rounded-2xl w-fit mx-auto mb-4">
            <Layout size={40} weight="bold" className="text-brand-yellow" />
          </div>
          <p className="text-gray-400 mb-6">You haven't created any pages yet.</p>
          <Link
            href="/templates/create"
            className="inline-flex items-center gap-2 bg-brand-yellow text-black font-bold px-6 py-3 rounded-2xl hover:bg-brand-yellow/90 transition-all"
          >
            Create your first page <ArrowRight size={16} weight="bold" />
          </Link>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-xs uppercase tracking-widest border-b border-white/10 bg-[#111111]">
                  <th className="px-6 py-4 font-bold">Name</th>
                  <th className="px-6 py-4 font-bold">URL</th>
                  <th className="px-6 py-4 font-bold">Template</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Created</th>
                  <th className="px-6 py-4 font-bold">Expires</th>
                  <th className="px-6 py-4 font-bold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-bold text-white">{page.name}</td>
                    <td className="px-6 py-4">
                      <a
                        href={`/${page.slug}`}
                        target="_blank"
                        className="text-brand-yellow font-bold hover:underline flex items-center gap-1"
                      >
                        <Globe size={14} />
                        snipxr.com/{page.slug}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {TEMPLATE_NAMES[page.templateId] ?? `Template ${page.templateId}`}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        page.published
                          ? 'bg-green-500/15 text-green-400'
                          : 'bg-gray-500/15 text-gray-400'
                      }`}>
                        {page.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(page.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {page.expiresAt ? (
                        page.expiresAt < new Date() ? (
                          <span className="text-red-400">Expired</span>
                        ) : (
                          <span className="text-gray-400">{new Date(page.expiresAt).toLocaleDateString()}</span>
                        )
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {(!page.expiresAt || page.expiresAt > new Date()) && (
                          <form action={renewPageAction.bind(null, page.id)}>
                            <button
                              type="submit"
                              className="p-2 rounded-xl text-gray-500 hover:text-green-400 hover:bg-green-400/10 transition-colors"
                              title="Renew 30 days"
                            >
                              <ArrowCounterClockwise size={16} />
                            </button>
                          </form>
                        )}
                        <form action={togglePublishAction.bind(null, page.id, !page.published)}>
                          <button
                            type="submit"
                            className="p-2 rounded-xl text-gray-500 hover:text-brand-yellow hover:bg-brand-yellow/10 transition-colors"
                            title={page.published ? 'Unpublish' : 'Publish'}
                          >
                            {page.published ? <EyeSlash size={16} /> : <Eye size={16} />}
                          </button>
                        </form>
                        <form action={deletePageAction.bind(null, page.id)}>
                          <button
                            type="submit"
                            className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                            title="Delete page"
                          >
                            <Trash size={16} />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
