// Template 5 — Neon Glow
import { PageData, PLATFORMS, BORDER_RADIUS } from './types';

const NEON_COLORS = ['#00E5FF', '#E040FB', '#FFD600', '#69DB7C', '#FF6B6B', '#4F8EF7', '#FFA94D', '#A9E34B'];

export default function Template5({ data }: { data: PageData }) {
  const br = BORDER_RADIUS[data.borderStyle ?? 'full'];
  const bgColor = data.colors?.bg ?? '#000000';
  const textColor = data.colors?.text ?? '#ffffff';
  const btnText = data.colors?.buttonText ?? '#000000'; // neon button → black text

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: bgColor }}>
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        {data.avatarUrl ? (
          <img src={data.avatarUrl} alt={data.name} className="w-24 h-24 object-cover rounded-full" style={{ boxShadow: '0 0 24px #00E5FF88' }} />
        ) : (
          <div className="w-24 h-24 flex items-center justify-center text-3xl font-black rounded-full border-2" style={{ background: 'black', borderColor: '#00E5FF', color: '#00E5FF', boxShadow: '0 0 24px #00E5FF55' }}>
            {data.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="text-center">
          <h1 className="text-2xl font-black" style={{ color: textColor, textShadow: `0 0 20px ${data.colors?.button ?? '#00E5FF'}88` }}>{data.name}</h1>
          {data.bio && <p className="text-sm mt-2 leading-relaxed opacity-60" style={{ color: textColor }}>{data.bio}</p>}
        </div>
        <div className="w-full flex flex-col gap-3">
          {data.links.map((link, i) => {
            const platform = PLATFORMS.find(p => p.id === link.platform);
            const color = data.colors?.button ?? NEON_COLORS[i % NEON_COLORS.length];
            return (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                className="w-full py-4 px-6 font-bold text-center transition-all active:scale-95"
                style={{ background: 'black', color: data.colors?.button ? btnText : color, border: `2px solid ${color}`, borderRadius: br, boxShadow: `0 0 12px ${color}44` }}
              >
                {link.title || platform?.label || link.url}
              </a>
            );
          })}
        </div>
        {data.showJoinButton !== false && (
          <a href="https://snipxr.com" target="_blank" rel="noopener noreferrer"
            className="mt-2 px-6 py-3 text-sm font-bold transition-all active:scale-95"
            style={{ background: 'black', color: data.colors?.button ?? '#00E5FF', border: `2px solid ${data.colors?.button ?? '#00E5FF'}`, borderRadius: br, boxShadow: `0 0 12px ${data.colors?.button ?? '#00E5FF'}44` }}
          >
            Join {data.name} on SnipXR
          </a>
        )}
        <p className="text-xs opacity-20" style={{ color: textColor }}>powered by SnipXR</p>
      </div>
    </div>
  );
}
