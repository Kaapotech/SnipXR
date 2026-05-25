export type PageLink = {
  title: string;
  url: string;
  platform: string;
};

export type BorderStyle = 'sharp' | 'slight' | 'medium' | 'full';

export type PageColors = {
  bg: string;
  text: string;
  button: string;
  buttonText: string;
};

export type PageData = {
  name: string;
  bio?: string | null;
  avatarUrl?: string | null;
  links: PageLink[];
  borderStyle?: BorderStyle;
  colors?: Partial<PageColors>;
  showJoinButton?: boolean;
};

export const BORDER_RADIUS: Record<BorderStyle, string> = {
  sharp:  '0px',
  slight: '8px',
  medium: '16px',
  full:   '9999px',
};

export const PLATFORMS: { id: string; label: string; color: string }[] = [
  { id: 'instagram', label: 'Instagram', color: '#E1306C' },
  { id: 'tiktok',    label: 'TikTok',    color: '#69C9D0' },
  { id: 'youtube',   label: 'YouTube',   color: '#FF0000' },
  { id: 'twitter',   label: 'X / Twitter', color: '#1DA1F2' },
  { id: 'facebook',  label: 'Facebook',  color: '#1877F2' },
  { id: 'whatsapp',  label: 'WhatsApp',  color: '#25D366' },
  { id: 'linkedin',  label: 'LinkedIn',  color: '#0A66C2' },
  { id: 'github',    label: 'GitHub',    color: '#6e40c9' },
  { id: 'spotify',   label: 'Spotify',   color: '#1DB954' },
  { id: 'twitch',    label: 'Twitch',    color: '#9146FF' },
  { id: 'website',   label: 'Website',   color: '#9ca3af' },
  { id: 'email',     label: 'Email',     color: '#FFD600' },
];
