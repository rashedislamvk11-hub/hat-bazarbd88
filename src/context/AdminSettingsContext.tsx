import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminSettings } from '../types';
import { DEFAULT_ADMIN_SETTINGS } from '../data/mockData';
import { useTheme } from './ThemeContext';
import { getSettingsFromFirestore, saveSettingsToFirestore } from '../lib/firestoreService';

interface AdminSettingsContextType {
  settings: AdminSettings;
  updateSettings: (newSettings: Partial<AdminSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
  loading: boolean;
}

const AdminSettingsContext = createContext<AdminSettingsContextType | undefined>(undefined);

export const AdminSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { setAccentColor } = useTheme();
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('hb-admin-settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_ADMIN_SETTINGS;
      }
    }
    return DEFAULT_ADMIN_SETTINGS;
  });

  // Load from Firestore on mount
  useEffect(() => {
    async function fetchSettings() {
      try {
        const dbSettings = await getSettingsFromFirestore();
        if (dbSettings) {
          setSettings(dbSettings);
          localStorage.setItem('hb-admin-settings', JSON.stringify(dbSettings));
        }
      } catch (err) {
        console.error("Failed to load settings from Firestore, using localStorage/default:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  // Keep theme accent color in sync when settings load
  useEffect(() => {
    if (settings.accentColor) {
      setAccentColor(settings.accentColor);
    }
  }, [settings.accentColor, setAccentColor]);

  const updateSettings = async (newSettings: Partial<AdminSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('hb-admin-settings', JSON.stringify(updated));
    if (newSettings.accentColor) {
      setAccentColor(newSettings.accentColor);
    }
    try {
      await saveSettingsToFirestore(updated);
    } catch (err) {
      console.error("Failed to save settings to Firestore:", err);
    }
  };

  const resetSettings = async () => {
    setSettings(DEFAULT_ADMIN_SETTINGS);
    localStorage.setItem('hb-admin-settings', JSON.stringify(DEFAULT_ADMIN_SETTINGS));
    setAccentColor(DEFAULT_ADMIN_SETTINGS.accentColor);
    try {
      await saveSettingsToFirestore(DEFAULT_ADMIN_SETTINGS);
    } catch (err) {
      console.error("Failed to reset settings in Firestore:", err);
    }
  };

  return (
    <AdminSettingsContext.Provider value={{ settings, updateSettings, resetSettings, loading }}>
      {children}
    </AdminSettingsContext.Provider>
  );
};

export const useAdminSettings = () => {
  const context = useContext(AdminSettingsContext);
  if (!context) throw new Error('useAdminSettings must be used within an AdminSettingsProvider');
  return context;
};
