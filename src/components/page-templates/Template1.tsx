// Template 1 — Dark Minimal
import { PageData, PLATFORMS, BORDER_RADIUS } from './types';

export default function Template1({ data }: { data: PageData }) {
  const br = BORDER_RADIUS[data.borderStyle ?? 'full'];
  const bgColor = data.colors?.bg ?? '#0a0a0a';
  const textColor = data.colors?.text ?? '#ffffff';
  const btnColor = data.colors?.button ?? '#ffffff';
  const btnText = data.colors?.buttonText ?? '#000000'; // white button → black text

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16" style={{ background: bgColor }}>
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        {data.avatarUrl ? (
          <img src={data.avatarUrl} alt={data.name} className="w-24 h-24 object-cover rounded-full border-2 border-white/10" />
        ) : (
          <div className="w-24 h-24 flex items-center justify-center text-3xl font-black rounded-full" style={{ background: btnColor, color: btnText }}>
            {data.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="text-center">
          <h1 className="text-2xl font-black" style={{ color: textColor }}>{data.name}</h1>
          {data.bio && <p className="text-sm mt-2 leading-relaxed opacity-60" style={{ color: textColor }}>{data.bio}</p>}
        </div>
        <div className="w-full flex flex-col gap-3">
          {data.links.map((link, i) => {
            const platform = PLATFORMS.find(p => p.id === link.platform);
            return (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                className="w-full py-4 px-6 font-bold text-center transition-all hover:opacity-80 active:scale-95"
                style={{ background: btnColor, color: btnText, borderRadius: br }}
              >
                {link.title || platform?.label || link.url}
              </a>
            );
          })}
        </div>
        {data.showJoinButton !== false && (
          <a href="https://snipxr.com" target="_blank" rel="noopener noreferrer"
            className="mt-2 px-6 py-3 text-sm font-bold transition-all hover:opacity-80 active:scale-95"
            style={{ background: btnColor, color: btnText, borderRadius: br }}
          >
            Join {data.name} on SnipXR
          </a>
        )}
        <p className="text-xs opacity-20" style={{ color: textColor }}>powered by SnipXR</p>
      </div>
    </div>
  );
}
