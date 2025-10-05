'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Chrome as Home, Search, TrendingUp, Star, Award } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Odkryj' },
  { href: '/search', icon: Search, label: 'Szukaj' },
  { href: '/popular', icon: Award, label: 'Top' },
  { href: '/trending', icon: TrendingUp, label: 'Popularne' },
  { href: '/favorites', icon: Star, label: 'Ulubione' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors min-w-[44px] ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
