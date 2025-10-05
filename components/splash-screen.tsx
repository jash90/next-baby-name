'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export function SplashScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 5;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center space-y-8">
        {/* Logo/Icon */}
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-2xl">
            <Image
              src="/icons/icon-192x192.png"
              alt="Brajanusz Logo"
              width={192}
              height={192}
              className='rounded-md'
            />
          </div>
        </div>

        {/* App Name */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground">Brajanusz</h1>
          <p className="mt-2 text-lg text-muted-foreground">Odkryj idealne imię</p>
        </div>

        {/* Loading Bar */}
        <div className="w-64">
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Ładowanie... {progress}%
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
        <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl dark:bg-primary/10" />
        <div className="absolute top-1/2 left-1/3 h-40 w-40 rounded-full bg-primary/3 blur-2xl dark:bg-primary/5" />
      </div>
    </div>
  );
}