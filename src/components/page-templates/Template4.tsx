// Template 4 — Gradient Purple
import { PageData, PLATFORMS, BORDER_RADIUS } from './types';

export default function Template4({ data }: { data: PageData }) {
  const br = BORDER_RADIUS[data.borderStyle ?? 'full'];
  const bgColor = data.colors?.bg ?? 'linear-gradient(160deg,#7c3aed,#a855f7,#ec4899)';
  const textColor = data.colors?.text ?? '#ffffff';
  const btnColor = data.colors?.button ?? 'rgba(255,255,255,0.2)';
  const btnText = data.colors?.buttonText ?? '#7c3aed'; // white button → purple text

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: bgColor }}>
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        {data.avatarUrl ? (
          <img src={data.avatarUrl} alt={data.name} className="w-24 h-24 object-cover rounded-full" style={{ boxShadow: '0 0 0 4px rgba(255,255,255,0.3)' }} />
        ) : (
          <div className="w-24 h-24 flex items-center justify-center text-3xl font-black rounded-full" style={{ background: 'rgba(255,255,255,0.25)', color: textColor }}>
            {data.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="text-center">
          <h1 className="text-2xl font-black drop-shadow" style={{ color: textColor }}>{data.name}</h1>
          {data.bio && <p className="text-sm mt-2 leading-relaxed opacity-80" style={{ color: textColor }}>{data.bio}</p>}
        </div>
        <div className="w-full flex flex-col gap-3">
          {data.links.map((link, i) => {
            const platform = PLATFORMS.find(p => p.id === link.platform);
            return (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                className="w-full py-4 px-6 font-bold text-center transition-all hover:opacity-80 active:scale-95"
                style={{ background: btnColor, color: btnText, borderRadius: br, border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}
              >
                {link.title || platform?.label || link.url}
              </a>
            );
          })}
        </div>
        {data.showJoinButton !== false && (
          <a href="https://snipxr.com" target="_blank" rel="noopener noreferrer"
            className="mt-2 px-6 py-3 text-sm font-bold transition-all hover:opacity-80 active:scale-95"
            style={{ background: btnColor, color: btnText, borderRadius: br, border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }}
          >
            Join {data.name} on SnipXR
          </a>
        )}
        <p className="text-xs opacity-30" style={{ color: textColor }}>powered by SnipXR</p>
      </div>
    </div>
  );
}
