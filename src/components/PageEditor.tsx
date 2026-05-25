'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash, ArrowLeft, ArrowRight, FloppyDisk, Eye, EyeSlash, CheckCircle, X } from '@phosphor-icons/react';
import { PageLink, BorderStyle, PageColors } from './page-templates/types';
import PageRenderer from './page-templates/PageRenderer';

const TEMPLATE_NAMES = ['Dark Minimal', 'Yellow Brand', 'Glass Frost', 'Gradient Purple', 'Neon Glow', 'Clean Light'];
const TEMPLATE_PREVIEWS = ['bg-[#0a0a0a]', 'bg-[#111]', 'bg-[#1a1a2e]', 'bg-gradient-to-br from-purple-600 to-pink-500', 'bg-black', 'bg-gray-100'];
const TEMPLATE_ACCENTS = ['bg-white', 'bg-[#FFD600]', 'bg-blue-400', 'bg-white', 'bg-[#00E5FF]', 'bg-gray-800'];

const TEMPLATE_DEFAULT_COLORS: PageColors[] = [
  { bg: '#0a0a0a', text: '#ffffff', button: '#ffffff',  buttonText: '#000000' }, // Dark Minimal
  { bg: '#111111', text: '#ffffff', button: '#FFD600',  buttonText: '#000000' }, // Yellow Brand
  { bg: '#1a1a2e', text: '#ffffff', button: '#ffffff',  buttonText: '#1a1a2e' }, // Glass Frost
  { bg: '#7c3aed', text: '#ffffff', button: '#ffffff',  buttonText: '#7c3aed' }, // Gradient Purple
  { bg: '#000000', text: '#ffffff', button: '#00E5FF',  buttonText: '#000000' }, // Neon Glow
  { bg: '#f9fafb', text: '#111827', button: '#111827',  buttonText: '#ffffff' }, // Clean Light
];

const STEPS = [
  { id: 0, label: 'Template' },
  { id: 1, label: 'Profile' },
  { id: 2, label: 'Links' },
  { id: 3, label: 'Buttons' },
  { id: 4, label: 'Colors' },
  { id: 5, label: 'Slug' },
];

const BORDER_OPTIONS: { id: BorderStyle; label: string; preview: string }[] = [
  { id: 'sharp',  label: 'Square',         preview: 'rounded-none' },
  { id: 'slight', label: 'Slightly rounded', preview: 'rounded-lg' },
  { id: 'medium', label: 'Rounded',         preview: 'rounded-2xl' },
  { id: 'full',   label: 'Pill',            preview: 'rounded-full' },
];

type PlatformDef = { id: string; label: string; bg: string; icon: string };

const PLATFORMS: PlatformDef[] = [
  { id: 'instagram', label: 'Instagram', bg: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', icon: '📸' },
  { id: 'whatsapp',  label: 'WhatsApp',  bg: '#25D366', icon: '💬' },
  { id: 'tiktok',   label: 'TikTok',    bg: '#010101', icon: '🎵' },
  { id: 'youtube',  label: 'YouTube',   bg: '#FF0000', icon: '▶️' },
  { id: 'twitter',  label: 'X / Twitter', bg: '#000', icon: '𝕏' },
  { id: 'facebook', label: 'Facebook',  bg: '#1877F2', icon: '🔵' },
  { id: 'linkedin', label: 'LinkedIn',  bg: '#0A66C2', icon: '💼' },
  { id: 'github',   label: 'GitHub',    bg: '#24292e', icon: '🐙' },
  { id: 'spotify',  label: 'Spotify',   bg: '#1DB954', icon: '🎧' },
  { id: 'twitch',   label: 'Twitch',    bg: '#9146FF', icon: '🎮' },
  { id: 'website',  label: 'Website',   bg: '#374151', icon: '🌐' },
  { id: 'email',    label: 'Email',     bg: '#FFD600', icon: '✉️' },
];

const COLOR_PRESETS = {
  bg:     ['#0a0a0a', '#111111', '#1a1a2e', '#ffffff', '#f9fafb', '#1e1b4b', '#064e3b', '#7c3aed'],
  text:   ['#ffffff', '#f3f4f6', '#000000', '#111827', '#fbbf24', '#a78bfa', '#34d399', '#f87171'],
  button: ['#ffffff', '#FFD600', '#000000', '#111827', '#7c3aed', '#ec4899', '#00E5FF', '#25D366'],
  buttonText: ['#000000', '#ffffff', '#111827', '#fbbf24'],
};

function PlatformPicker({ onSelect, onClose }: { onSelect: (p: PlatformDef) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <h3 className="font-bold text-white text-sm">Choose a platform</h3>
          <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-white transition-colors">
            <X size={18} weight="bold" />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 p-5">
          {PLATFORMS.map(p => (
            <button key={p.id} onClick={() => onSelect(p)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/5 active:scale-95 transition-all group"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg" style={{ background: p.bg }}>
                {p.icon}
              </div>
              <span className="text-xs text-gray-400 group-hover:text-white transition-colors font-medium">{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ColorRow({ label, field, value, onChange }: { label: string; field: keyof typeof COLOR_PRESETS; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs text-gray-400 mb-2 block font-bold">{label}</label>
      <div className="flex items-center gap-2 flex-wrap">
        {COLOR_PRESETS[field].map(c => (
          <button key={c} onClick={() => onChange(c)}
            className="w-8 h-8 rounded-xl border-2 transition-all hover:scale-110 active:scale-95"
            style={{ background: c, borderColor: value === c ? '#FFD600' : 'transparent' }}
          />
        ))}
        <input type="color" value={value} onChange={e => onChange(e.target.value)}
          className="w-8 h-8 rounded-xl cursor-pointer border-0 bg-transparent p-0"
          title="Custom color"
        />
      </div>
    </div>
  );
}

export default function PageEditor() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [templateId, setTemplateId] = useState(1);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [slug, setSlug] = useState('');
  const [links, setLinks] = useState<PageLink[]>([]);
  const [borderStyle, setBorderStyle] = useState<BorderStyle>('full');
  const [colors, setColors] = useState<Partial<PageColors>>(TEMPLATE_DEFAULT_COLORS[0]);
  const [showJoinButton, setShowJoinButton] = useState(true);

  const handleSelectTemplate = useCallback((id: number) => {
    setTemplateId(id);
    setColors(TEMPLATE_DEFAULT_COLORS[id - 1]);
  }, []);
  const [showPlatformPicker, setShowPlatformPicker] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const setColor = useCallback((field: keyof PageColors, value: string) => {
    setColors(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSelectPlatform = useCallback((p: PlatformDef) => {
    setLinks(prev => [...prev, { title: '', url: '', platform: p.id }]);
    setShowPlatformPicker(false);
  }, []);

  const removeLink = useCallback((i: number) => setLinks(prev => prev.filter((_, idx) => idx !== i)), []);

  const updateLink = useCallback((i: number, field: keyof PageLink, value: string) => {
    setLinks(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l));
  }, []);

  const handleSave = async () => {
    setError('');
    if (!name.trim()) { setError('Name is required.'); setStep(1); return; }
    if (!slug.trim()) { setError('Slug is required.'); setStep(5); return; }

    setSaving(true);
    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ templateId, name, bio, avatarUrl, slug, links, borderStyle, colors, showJoinButton }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) { setError(data.error ?? 'Failed to save.'); return; }
    router.push('/templates');
  };

  const previewData = { name: name || 'Your name', bio, avatarUrl, links, borderStyle, colors, showJoinButton };

  return (
    <>
      {showPlatformPicker && <PlatformPicker onSelect={handleSelectPlatform} onClose={() => setShowPlatformPicker(false)} />}

      <div className="h-[calc(100vh-80px)] flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#0a0a0a]">
          <button onClick={() => router.push('/templates')} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} weight="bold" /> Back
          </button>

          {/* Steps */}
          <div className="hidden lg:flex items-center gap-0.5">
            {STEPS.map((s, i) => (
              <button key={s.id} onClick={() => setStep(s.id)} className="flex items-center gap-0.5">
                <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all ${step === s.id ? 'bg-brand-yellow text-black' : 'text-gray-500 hover:text-gray-300'}`}>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${step === s.id ? 'bg-black/20' : 'bg-white/10'}`}>{i + 1}</span>
                  {s.label}
                </div>
                {i < STEPS.length - 1 && <div className="w-3 h-px bg-white/10" />}
              </button>
            ))}
          </div>
          <span className="lg:hidden text-xs text-gray-500">{STEPS[step].label} ({step + 1}/{STEPS.length})</span>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowPreview(p => !p)} className="md:hidden flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-white/10 px-3 py-1.5 rounded-full transition-colors">
              {showPreview ? <EyeSlash size={14} /> : <Eye size={14} />}
              {showPreview ? 'Editor' : 'Preview'}
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 bg-brand-yellow text-black font-bold px-4 py-2 rounded-xl text-sm hover:bg-brand-yellow/90 transition-all disabled:opacity-50 active:scale-95">
              <FloppyDisk size={16} weight="bold" />
              {saving ? 'Saving...' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Editor panel */}
          <div className={`w-full md:w-[420px] flex-shrink-0 flex flex-col bg-[#0f0f0f] border-r border-white/10 ${showPreview ? 'hidden md:flex' : 'flex'}`}>
            <div className="flex-1 overflow-y-auto p-6">

              {/* Step 0 — Template */}
              {step === 0 && (
                <div>
                  <h2 className="text-lg font-black text-white mb-1">Choose a template</h2>
                  <p className="text-gray-500 text-sm mb-6">The base style of your page.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {TEMPLATE_NAMES.map((tname, i) => (
                      <button key={i} onClick={() => handleSelectTemplate(i + 1)}
                        className={`relative rounded-2xl overflow-hidden border-2 transition-all ${templateId === i + 1 ? 'border-brand-yellow scale-[1.02]' : 'border-white/10 hover:border-white/30'}`}>
                        <div className={`h-24 ${TEMPLATE_PREVIEWS[i]} flex flex-col items-center justify-center gap-1.5 p-3`}>
                          <div className="w-6 h-6 rounded-full bg-white/20" />
                          <div className="w-12 h-1.5 rounded-full bg-white/30" />
                          <div className={`w-16 h-4 rounded-lg ${TEMPLATE_ACCENTS[i]} opacity-80`} />
                          <div className={`w-16 h-4 rounded-lg ${TEMPLATE_ACCENTS[i]} opacity-40`} />
                        </div>
                        <div className="flex items-center justify-between px-3 py-2 bg-black/60">
                          <span className="text-xs font-bold text-white">{tname}</span>
                          {templateId === i + 1 && <CheckCircle size={14} weight="fill" className="text-brand-yellow" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1 — Profil */}
              {step === 1 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-black text-white mb-1">Your Profile</h2>
                  <p className="text-gray-500 text-sm mb-2">The information displayed on your page.</p>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block font-bold">Display name *</label>
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-yellow/50 transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block font-bold">Bio</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Short description..." rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-yellow/50 transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block font-bold">Profile picture URL <span className="text-gray-600 font-normal">(optional)</span></label>
                    <input value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} placeholder="https://..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-brand-yellow/50 transition-colors" />
                    {avatarUrl && (
                      <div className="mt-3 flex items-center gap-3">
                        <img src={avatarUrl} alt="preview" className="w-12 h-12 rounded-full object-cover border border-white/10" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        <span className="text-xs text-gray-500">Photo preview</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2 — Linkuri */}
              {step === 2 && (
                <div>
                  <h2 className="text-lg font-black text-white mb-1">Social Media & Links</h2>
                  <p className="text-gray-500 text-sm mb-6">Add any link you want to appear on your page.</p>
                  <div className="flex flex-col gap-3">
                    {links.map((link, i) => {
                      const platform = PLATFORMS.find(p => p.id === link.platform);
                      return (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: platform?.bg ?? '#374151' }}>{platform?.icon}</div>
                              <span className="text-xs font-bold text-white">{platform?.label}</span>
                            </div>
                            <button onClick={() => removeLink(i)} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors rounded-lg hover:bg-red-400/10">
                              <Trash size={15} />
                            </button>
                          </div>
                          <input value={link.title} onChange={e => updateLink(i, 'title', e.target.value)} placeholder={`Button label (e.g. ${platform?.label})`}
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-brand-yellow/40 transition-colors" />
                          <input value={link.url} onChange={e => updateLink(i, 'url', e.target.value)} placeholder="https://..."
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder-gray-600 focus:outline-none focus:border-brand-yellow/40 transition-colors" />
                        </div>
                      );
                    })}
                    <button onClick={() => setShowPlatformPicker(true)}
                      className="w-full py-4 rounded-2xl border-2 border-dashed border-white/10 text-gray-500 hover:border-brand-yellow/40 hover:text-brand-yellow transition-all text-sm font-bold flex items-center justify-center gap-2">
                      <Plus size={16} weight="bold" /> Add link
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3 — Stil butoane */}
              {step === 3 && (
                <div>
                  <h2 className="text-lg font-black text-white mb-1">Stilul butoanelor</h2>
                  <p className="text-gray-500 text-sm mb-6">Choose the corner shape of your link buttons.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {BORDER_OPTIONS.map(opt => (
                      <button key={opt.id} onClick={() => setBorderStyle(opt.id)}
                        className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 transition-all ${borderStyle === opt.id ? 'border-brand-yellow bg-brand-yellow/5' : 'border-white/10 hover:border-white/30'}`}>
                        <div className={`w-full h-10 bg-white/20 ${opt.preview}`} />
                        <span className="text-xs font-bold text-white">{opt.label}</span>
                        {borderStyle === opt.id && <CheckCircle size={16} weight="fill" className="text-brand-yellow" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4 — Culori */}
              {step === 4 && (
                <div className="flex flex-col gap-6">
                  <h2 className="text-lg font-black text-white mb-1">Colors</h2>
                  <p className="text-gray-500 text-sm -mt-4">Customize your page colors.</p>
                  <ColorRow label="Background" field="bg" value={colors.bg ?? '#0a0a0a'} onChange={v => setColor('bg', v)} />
                  <ColorRow label="Text" field="text" value={colors.text ?? '#ffffff'} onChange={v => setColor('text', v)} />
                  <ColorRow label="Buttons" field="button" value={colors.button ?? '#ffffff'} onChange={v => setColor('button', v)} />
                  <ColorRow label="Button text" field="buttonText" value={colors.buttonText ?? '#000000'} onChange={v => setColor('buttonText', v)} />

                  <div className="pt-2 border-t border-white/10">
                    <p className="text-xs text-gray-400 mb-3 font-bold">"Join on SnipXR" Button</p>
                    <button
                      onClick={() => setShowJoinButton(v => !v)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${showJoinButton ? 'bg-brand-yellow' : 'bg-white/10'}`}
                    >
                      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${showJoinButton ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                    <p className="text-xs text-gray-600 mt-2">{showJoinButton ? 'Visible on page' : 'Hidden'}</p>
                  </div>
                </div>
              )}

              {/* Step 5 — Slug */}
              {step === 5 && (
                <div className="flex flex-col gap-4">
                  <h2 className="text-lg font-black text-white mb-1">Your page URL</h2>
                  <p className="text-gray-500 text-sm mb-2">This will be your page's public link.</p>
                  <div>
                    <label className="text-xs text-gray-400 mb-1.5 block font-bold">Slug *</label>
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-brand-yellow/50 transition-colors">
                      <span className="text-gray-500 text-sm pl-4 whitespace-nowrap">snipxr.com/</span>
                      <input value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))} placeholder="username"
                        className="flex-1 bg-transparent px-2 py-3 text-white text-sm placeholder-gray-600 focus:outline-none" />
                    </div>
                    <p className="text-gray-600 text-xs mt-2">Lowercase letters, numbers, - and _ only</p>
                  </div>
                  {slug && (
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                      <p className="text-xs text-gray-500 mb-1">Your page will be available at:</p>
                      <p className="text-brand-yellow font-bold text-sm break-all">snipxr.com/{slug}</p>
                    </div>
                  )}
                  {error && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="border-t border-white/10 px-6 py-4 flex items-center justify-between bg-[#0a0a0a]">
              <button onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-bold">
                <ArrowLeft size={16} weight="bold" /> Back
              </button>
              <span className="text-xs text-gray-600">{step + 1} / {STEPS.length}</span>
              {step < STEPS.length - 1 ? (
                <button onClick={() => setStep(s => s + 1)} className="flex items-center gap-2 text-sm text-brand-yellow font-bold hover:text-brand-yellow/80 transition-colors">
                  Continue <ArrowRight size={16} weight="bold" />
                </button>
              ) : (
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 bg-brand-yellow text-black font-bold px-5 py-2 rounded-xl text-sm hover:bg-brand-yellow/90 transition-all disabled:opacity-50 active:scale-95">
                  <FloppyDisk size={16} weight="bold" />
                  {saving ? 'Saving...' : 'Publish'}
                </button>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className={`flex-1 overflow-hidden relative ${showPreview ? 'block' : 'hidden md:block'}`}>
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-black/60 backdrop-blur border border-white/10 rounded-full px-4 py-1.5 text-xs text-gray-400 pointer-events-none">
              Live preview
            </div>
            <div className="w-full h-full overflow-y-auto">
              <PageRenderer templateId={templateId} data={previewData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
