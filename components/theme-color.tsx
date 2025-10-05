'use client';

import { useTheme } from 'next-themes';
import { useEffect } from 'react';

export function ThemeColor() {
  const { theme, systemTheme } = useTheme();

  useEffect(() => {
    // Get the resolved theme (considering system theme)
    const currentTheme = theme === 'system' ? systemTheme : theme;

    // Set theme-color based on the current theme
    const themeColor = currentTheme === 'dark' ? '#0f172a' : '#ffffff';

    // Update or create theme-color meta tag
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');

    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', themeColor);
    } else {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.setAttribute('name', 'theme-color');
      metaThemeColor.setAttribute('content', themeColor);
      document.head.appendChild(metaThemeColor);
    }
  }, [theme, systemTheme]);

  return null;
}