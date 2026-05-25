import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link as LinkIcon, CursorClick, Calendar, Trash } from "@phosphor-icons/react/dist/ssr";
import { deleteLink } from "./actions";

function mostCommon(values: (string | null)[]): string {
  const filtered = values.filter(Boolean) as string[];
  if (!filtered.length) return "—";
  const freq: Record<string, number> = {};
  for (const v of filtered) freq[v] = (freq[v] ?? 0) + 1;
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
}

const COUNTRY_FLAGS: Record<string, string> = {
  RO: "🇷🇴", US: "🇺🇸", GB: "🇬🇧", DE: "🇩🇪", FR: "🇫🇷",
  IT: "🇮🇹", ES: "🇪🇸", NL: "🇳🇱", CA: "🇨🇦", AU: "🇦🇺",
  JP: "🇯🇵", CN: "🇨🇳", BR: "🇧🇷", IN: "🇮🇳", KR: "🇰🇷",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const resetDateStr = resetDate.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });

  const [links, linksThisMonth, qrThisMonth] = await Promise.all([
    db.link.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
      include: {
        clickEvents: {
          select: { country: true, browser: true, device: true },
        },
      },
    }),
    db.link.count({ where: { userId: session.user.id, createdAt: { gte: startOfMonth } } }),
    db.qrUsage.count({ where: { userId: session.user.id, createdAt: { gte: startOfMonth } } }),
  ]);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />

      <div className="flex-grow pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl font-black tracking-tighter mb-2">Welcome back, {session.user.name || session.user.email?.split('@')[0]}!</h1>
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
              <p className="text-xs text-gray-600 mt-3">Reset pe {resetDateStr}</p>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-brand-magenta/20 rounded-2xl">
                  <CursorClick size={24} className="text-brand-magenta" />
                </div>
                <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">QR Downloads</span>
              </div>
              <div className={`text-3xl font-black ${qrThisMonth >= 5 ? 'text-red-400' : 'text-white'}`}>
                {qrThisMonth} <span className="text-gray-500 text-lg font-normal">/ 5</span>
              </div>
              <p className="text-xs text-gray-600 mt-3">Reset pe {resetDateStr}</p>
            </div>
          </div>

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
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase tracking-widest border-b border-white/10">
                      <th className="px-6 py-4 font-bold">Original URL</th>
                      <th className="px-6 py-4 font-bold">Short Link</th>
                      <th className="px-6 py-4 font-bold">Clicks</th>
                      <th className="px-6 py-4 font-bold">Country</th>
                      <th className="px-6 py-4 font-bold">Browser</th>
                      <th className="px-6 py-4 font-bold">Device</th>
                      <th className="px-6 py-4 font-bold">Date</th>
                      <th className="px-6 py-4 font-bold">Expires</th>
                      <th className="px-6 py-4 font-bold"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {links.map((link) => {
                      const topCountry = mostCommon(link.clickEvents.map(c => c.country));
                      const topBrowser = mostCommon(link.clickEvents.map(c => c.browser));
                      const topDevice  = mostCommon(link.clickEvents.map(c => c.device));
                      const flag = COUNTRY_FLAGS[topCountry] ?? "";

                      return (
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
                          <td className="px-6 py-4">
                            <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold">
                              {link.clicks}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {topCountry === "—" ? (
                              <span className="text-gray-600">—</span>
                            ) : (
                              <span>{flag} {topCountry}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {topBrowser === "—" ? <span className="text-gray-600">—</span> : topBrowser}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-300">
                            {topDevice === "—" ? <span className="text-gray-600">—</span> : topDevice}
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
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
