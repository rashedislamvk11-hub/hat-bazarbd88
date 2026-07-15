import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';
type AccentColor = 'emerald' | 'blue' | 'purple' | 'rose' | 'amber';

interface ThemeContextType {
  theme: Theme;
  accentColor: AccentColor;
  toggleTheme: () => void;
  setAccentColor: (color: AccentColor) => void;
  getAccentBgClass: () => string;
  getAccentTextClass: () => string;
  getAccentBorderClass: () => string;
  getAccentHoverBgClass: () => string;
  getAccentRingClass: () => string;
  getAccentGradientClass: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('hb-theme');
    return (saved as Theme) || 'dark'; // Premium marketplaces look gorgeous in dark mode by default
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    const saved = localStorage.getItem('hb-accent');
    return (saved as AccentColor) || 'emerald';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('hb-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setAccentColor = (color: AccentColor) => {
    setAccentColorState(color);
    localStorage.setItem('hb-accent', color);
  };

  // Color class helper getters to keep components super clean
  const getAccentBgClass = () => {
    switch (accentColor) {
      case 'emerald': return 'bg-emerald-600 dark:bg-emerald-500';
      case 'blue': return 'bg-blue-600 dark:bg-blue-500';
      case 'purple': return 'bg-purple-600 dark:bg-purple-500';
      case 'rose': return 'bg-rose-600 dark:bg-rose-500';
      case 'amber': return 'bg-amber-600 dark:bg-amber-500';
      default: return 'bg-emerald-600 dark:bg-emerald-500';
    }
  };

  const getAccentTextClass = () => {
    switch (accentColor) {
      case 'emerald': return 'text-emerald-600 dark:text-emerald-400';
      case 'blue': return 'text-blue-600 dark:text-blue-400';
      case 'purple': return 'text-purple-600 dark:text-purple-400';
      case 'rose': return 'text-rose-600 dark:text-rose-400';
      case 'amber': return 'text-amber-600 dark:text-amber-400';
      default: return 'text-emerald-600 dark:text-emerald-400';
    }
  };

  const getAccentBorderClass = () => {
    switch (accentColor) {
      case 'emerald': return 'border-emerald-600 dark:border-emerald-500';
      case 'blue': return 'border-blue-600 dark:border-blue-500';
      case 'purple': return 'border-purple-600 dark:border-purple-500';
      case 'rose': return 'border-rose-600 dark:border-rose-500';
      case 'amber': return 'border-amber-600 dark:border-amber-500';
      default: return 'border-emerald-600 dark:border-emerald-500';
    }
  };

  const getAccentHoverBgClass = () => {
    switch (accentColor) {
      case 'emerald': return 'hover:bg-emerald-700 dark:hover:bg-emerald-600';
      case 'blue': return 'hover:bg-blue-700 dark:hover:bg-blue-600';
      case 'purple': return 'hover:bg-purple-700 dark:hover:bg-purple-600';
      case 'rose': return 'hover:bg-rose-700 dark:hover:bg-rose-600';
      case 'amber': return 'hover:bg-amber-700 dark:hover:bg-amber-600';
      default: return 'hover:bg-emerald-700 dark:hover:bg-emerald-600';
    }
  };

  const getAccentRingClass = () => {
    switch (accentColor) {
      case 'emerald': return 'focus:ring-emerald-500';
      case 'blue': return 'focus:ring-blue-500';
      case 'purple': return 'focus:ring-purple-500';
      case 'rose': return 'focus:ring-rose-500';
      case 'amber': return 'focus:ring-amber-500';
      default: return 'focus:ring-emerald-500';
    }
  };

  const getAccentGradientClass = () => {
    switch (accentColor) {
      case 'emerald': return 'from-emerald-600 to-teal-500 dark:from-emerald-500 dark:to-teal-400';
      case 'blue': return 'from-blue-600 to-indigo-500 dark:from-blue-500 dark:to-indigo-400';
      case 'purple': return 'from-purple-600 to-fuchsia-500 dark:from-purple-500 dark:to-fuchsia-400';
      case 'rose': return 'from-rose-600 to-pink-500 dark:from-rose-500 dark:to-pink-400';
      case 'amber': return 'from-amber-600 to-orange-500 dark:from-amber-500 dark:to-orange-400';
      default: return 'from-emerald-600 to-teal-500 dark:from-emerald-500 dark:to-teal-400';
    }
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      accentColor,
      toggleTheme,
      setAccentColor,
      getAccentBgClass,
      getAccentTextClass,
      getAccentBorderClass,
      getAccentHoverBgClass,
      getAccentRingClass,
      getAccentGradientClass
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
