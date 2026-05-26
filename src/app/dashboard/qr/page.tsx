import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import db from '@/lib/db';
import { QrCode, Trash, DownloadSimple } from '@phosphor-icons/react/dist/ssr';
import { deleteQrAction } from './actions';

export default async function DashboardQRPage() {
  const session = await getServerSession(authOptions);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const resetDateStr = resetDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  const QR_LIMITS: Record<string, number> = { free: 5, pro: 20, advanced: Infinity };
  const plan = session!.user.plan ?? 'free';
  const qrLimit = QR_LIMITS[plan] ?? 5;

  const [qrCodes, qrThisMonth] = await Promise.all([
    db.qrUsage.findMany({
      where: { userId: session!.user.id, hidden: false },
      orderBy: { createdAt: 'desc' },
    }),
    db.qrUsage.count({ where: { userId: session!.user.id, createdAt: { gte: startOfMonth } } }),
  ]);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-4xl font-black tracking-tighter mb-2">QR Codes</h1>
        <p className="text-gray-400">Manage your downloaded QR codes.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-brand-magenta/20 rounded-2xl">
              <QrCode size={24} className="text-brand-magenta" />
            </div>
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Total QR Codes</span>
          </div>
          <div className="text-3xl font-black">{qrCodes.length}</div>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-brand-magenta/20 rounded-2xl">
              <DownloadSimple size={24} className="text-brand-magenta" />
            </div>
            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">Downloads This Month</span>
          </div>
          <div className={`text-3xl font-black ${qrThisMonth >= qrLimit ? 'text-red-400' : 'text-white'}`}>
            {qrThisMonth}{' '}
            <span className="text-gray-500 text-lg font-normal">
              / {qrLimit === Infinity ? '∞' : qrLimit}
            </span>
          </div>
          <p className="text-xs text-gray-600 mt-3">Resets on {resetDateStr}</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold">Your QR Codes</h2>
        </div>

        {qrCodes.length === 0 ? (
          <div className="p-16 text-center">
            <div className="p-4 bg-brand-magenta/10 rounded-2xl w-fit mx-auto mb-4">
              <QrCode size={36} weight="bold" className="text-brand-magenta" />
            </div>
            <p className="text-gray-500">No QR codes downloaded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto overflow-y-auto max-h-[420px]">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-500 text-xs uppercase tracking-widest border-b border-white/10 sticky top-0 bg-[#111111] z-10">
                  <th className="px-6 py-4 font-bold">Content</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Expires</th>
                  <th className="px-6 py-4 font-bold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {qrCodes.map((qr) => (
                  <tr key={qr.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-gray-300 text-sm max-w-sm truncate">
                      {qr.content ?? <span className="text-gray-600 italic">—</span>}
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-sm whitespace-nowrap">
                      {new Date(qr.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {qr.expiresAt ? (
                        qr.expiresAt < new Date() ? (
                          <span className="text-red-400">Expired</span>
                        ) : (
                          <span className="text-gray-400">{new Date(qr.expiresAt).toLocaleDateString()}</span>
                        )
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <form action={deleteQrAction.bind(null, qr.id)}>
                        <button
                          type="submit"
                          className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                          title="Delete"
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
    </div>
  );
}
