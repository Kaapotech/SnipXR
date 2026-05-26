import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { Link as LinkIcon, CursorClick, Calendar, Trash } from "@phosphor-icons/react/dist/ssr";
import { deleteLink } from "./actions";
import DashboardCharts from "@/components/DashboardCharts";

function aggregate(values: (string | null)[]): { name: string; value: number }[] {
  const freq: Record<string, number> = {};
  for (const v of values) {
    if (v) freq[v] = (freq[v] ?? 0) + 1;
  }
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const resetDateStr = resetDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  const allClickEvents: { country: string | null; browser: string | null; device: string | null }[] = [];

  const [links, linksThisMonth] = await Promise.all([
    db.link.findMany({
      where: { userId: session!.user.id, hidden: false },
      orderBy: { createdAt: "desc" },
      include: {
        clickEvents: {
          select: { country: true, browser: true, device: true },
        },
      },
    }),
    db.link.count({ where: { userId: session!.user.id, createdAt: { gte: startOfMonth } } }),
  ]);

  for (const link of links) allClickEvents.push(...link.clickEvents);

  const clicksPerLink = links
    .filter(l => l.clicks > 0)
    .map(l => ({ name: l.shortCode, value: l.clicks }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
  const countries = aggregate(allClickEvents.map(e => e.country));
  const browsers  = aggregate(allClickEvents.map(e => e.browser));
  const devices   = aggregate(allClickEvents.map(e => e.device));

  return (
    <div>
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter mb-2">Welcome back, {session!.user.name || session!.user.email?.split('@')[0]}!</h1>
        <p className="text-gray-400">Manage your shortened links and track their performance.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-brand-blue/20 rounded-2xl">
              <LinkIcon size={24} className="text-brand-blue" />
            </div>
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total Links</span>
          </div>
          <div className="text-3xl font-black">{links.length}</div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-brand-magenta/20 rounded-2xl">
              <CursorClick size={24} className="text-brand-magenta" />
            </div>
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total Clicks</span>
          </div>
          <div className="text-3xl font-black">
            {links.reduce((acc: number, link) => acc + link.clicks, 0)}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-brand-yellow/20 rounded-2xl">
              <Calendar size={24} className="text-brand-yellow" />
            </div>
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Member Since</span>
          </div>
          <div className="text-3xl font-black text-lg">
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-brand-blue/20 rounded-2xl">
              <LinkIcon size={24} className="text-brand-blue" />
            </div>
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Links This Month</span>
          </div>
          <div className={`text-3xl font-black ${linksThisMonth >= 15 ? 'text-red-400' : 'text-white'}`}>
            {linksThisMonth} <span className="text-gray-500 text-lg font-normal">/ 15</span>
          </div>
          <p className="text-xs text-gray-600 mt-3">Resets on {resetDateStr}</p>
        </div>

      </div>

      <hr className="border-white/10 mb-10" />

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold">Your Recent Links</h2>
        </div>

        {links.length === 0 ? (
          <div className="p-20 text-center">
            <p className="text-gray-500 mb-6">You haven't created any links yet.</p>
            <a href="/" className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all">Create your first link</a>
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-[420px]">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-xs uppercase tracking-widest border-b border-white/10 sticky top-0 bg-[#111111] z-10">
                  <th className="px-6 py-4 font-bold">Original URL</th>
                  <th className="px-6 py-4 font-bold">Short Link</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Expires</th>
                  <th className="px-6 py-4 font-bold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 max-w-xs truncate text-gray-400 text-sm">
                      {link.originalUrl}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`/${link.shortCode}`}
                        target="_blank"
                        className="text-brand-blue font-bold hover:underline"
                      >
                        snipxr.com/{link.shortCode}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm">
                      {new Date(link.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {link.expiresAt ? (
                        link.expiresAt < new Date() ? (
                          <span className="text-red-400">Expired</span>
                        ) : (
                          <span className="text-gray-400">{new Date(link.expiresAt).toLocaleDateString()}</span>
                        )
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <form action={deleteLink.bind(null, link.id)}>
                        <button
                          type="submit"
                          className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          title="Delete link"
                        >
                          <Trash size={16} />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-16" />
      <DashboardCharts
        clicksPerLink={clicksPerLink}
        countries={countries}
        browsers={browsers}
        devices={devices}
      />
    </div>
  );
}
