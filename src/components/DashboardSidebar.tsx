'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Link as LinkIcon, QrCode, Layout } from '@phosphor-icons/react';

const items = [
  { href: '/dashboard', label: 'Links', Icon: LinkIcon },
  { href: '/dashboard/qr', label: 'QR Codes', Icon: QrCode },
  { href: '/dashboard/templates', label: 'Templates', Icon: Layout },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 shrink-0">
      <nav className="flex flex-col gap-1 sticky top-36">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all ${
                active
                  ? 'bg-white text-black'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={20} weight={active ? 'bold' : 'regular'} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
