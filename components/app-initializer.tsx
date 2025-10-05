'use client';

import { useEffect, useState } from 'react';
import { SplashScreen } from './splash-screen';
import { WelcomeScreen } from './welcome-screen';

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome screen before
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');

    // Show splash screen for 2 seconds
    const splashTimer = setTimeout(() => {
      setShowSplash(false);

      // Show welcome screen only if user hasn't seen it before
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      } else {
        setIsInitialized(true);
      }
    }, 2000);

    return () => clearTimeout(splashTimer);
  }, []);

  const handleWelcomeComplete = () => {
    // Mark that user has seen the welcome screen
    localStorage.setItem('hasSeenWelcome', 'true');
    setShowWelcome(false);
    setIsInitialized(true);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (showWelcome) {
    return <WelcomeScreen onComplete={handleWelcomeComplete} />;
  }

  if (!isInitialized) {
    return null;
  }

  return <>{children}</>;
}