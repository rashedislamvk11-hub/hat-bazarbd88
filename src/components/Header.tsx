import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useAdminSettings } from '../context/AdminSettingsContext';
import { toBanglaNumber } from '../utils/helpers';
import { Menu, X, Sun, Moon, Palette, ShoppingCart, ShoppingBag, LogIn, User, ShieldAlert, LogOut, Settings } from 'lucide-react';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenCart: () => void;
  onOpenPinModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, onOpenCart, onOpenPinModal }) => {
  const { theme, toggleTheme, accentColor, setAccentColor, getAccentTextClass, getAccentBgClass } = useTheme();
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const { settings } = useAdminSettings();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  
  // Secret logo click tracking for Admin PIN prompt
  const [logoClicks, setLogoClicks] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Dynamic Lucide Icon resolution
  const LogoIcon = (LucideIcons as any)[settings.websiteLogo] || LucideIcons.ShoppingBag;

  const navItems = [
    { id: 'home', label: 'হোম' },
    { id: 'products', label: 'সকল প্রোডাক্ট' },
    { id: 'dashboard', label: 'ডাউনলোড ও অর্ডার ট্র্যাকিং' },
    { id: 'support', label: 'হেল্প ও সাপোর্ট' },
  ];

  // Dynamic colors list
  const colors: { id: 'emerald' | 'blue' | 'purple' | 'rose' | 'amber'; name: string; class: string }[] = [
    { id: 'emerald', name: 'সবুজ', class: 'bg-emerald-500' },
    { id: 'blue', name: 'নীল', class: 'bg-blue-500' },
    { id: 'purple', name: 'বেগুনী', class: 'bg-purple-500' },
    { id: 'rose', name: 'গোলাপী', class: 'bg-rose-500' },
    { id: 'amber', name: 'হলুদ', class: 'bg-amber-500' },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    handleNavClick('home');
    if (!onOpenPinModal) return;

    const now = Date.now();
    if (now - lastClickTime < 1500) {
      const newClicks = logoClicks + 1;
      setLogoClicks(newClicks);
      if (newClicks >= 5) {
        onOpenPinModal();
        setLogoClicks(0);
      }
    } else {
      setLogoClicks(1);
    }
    setLastClickTime(now);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo Section */}
          <div 
            onClick={handleLogoClick} 
            className="flex cursor-pointer items-center gap-2.5 active:scale-95 transition-transform"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${getAccentBgClass()} text-white shadow-md shadow-emerald-500/15`}>
              <LogoIcon className="h-5.5 w-5.5" />
            </div>
            <span className="font-sans text-lg md:text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">
              {settings.websiteName}
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive 
                      ? `${getAccentTextClass()} bg-slate-50 dark:bg-slate-900/60 font-bold` 
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-50/50 dark:hover:bg-slate-900/30'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className={`absolute bottom-0 left-4 right-4 h-0.5 rounded-full ${getAccentBgClass()}`} />
                  )}
                </button>
              );
            })}

            {/* Admin Nav if authorized */}
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-extrabold border-2 border-dashed transition-all ${
                  currentView === 'admin'
                    ? 'border-rose-500 text-rose-500 bg-rose-50/50 dark:bg-rose-950/20'
                    : 'border-slate-200 hover:border-slate-400 text-slate-700 hover:text-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                <ShieldAlert className="h-4 w-4" />
                অ্যাডমিন প্যানেল
              </button>
            )}
          </nav>

          {/* Utilities (Search, Color Picker, Dark Mode, Cart, User) */}
          <div className="flex items-center gap-1 sm:gap-2">
            
            {/* Color Accent Picker */}
            <div className="relative">
              <button
                onClick={() => setPaletteOpen(!paletteOpen)}
                className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
                title="রঙ পরিবর্তন করুন"
              >
                <Palette className="h-5 w-5" />
              </button>
              {paletteOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 shadow-xl">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 block mb-2 font-sans">থিম অ্যাকসেন্ট রঙ:</span>
                  <div className="flex flex-wrap gap-2.5">
                    {colors.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setAccentColor(c.id);
                          setPaletteOpen(false);
                        }}
                        className={`h-7 w-7 rounded-full ${c.class} cursor-pointer hover:scale-110 active:scale-95 transition-all ring-offset-2 dark:ring-offset-slate-900 ${
                          accentColor === c.id ? 'ring-2 ring-slate-800 dark:ring-white scale-105' : ''
                        }`}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
              title="থিম পরিবর্তন"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
              title="কার্ট"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className={`absolute top-1 right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] font-black text-white ${getAccentBgClass()} animate-pulse`}>
                  {toBanglaNumber(cartCount)}
                </span>
              )}
            </button>

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`flex items-center gap-1.5 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors border ${
                    isAdmin ? 'border-rose-400/40 bg-rose-50/10' : 'border-slate-100 dark:border-slate-800'
                  }`}
                >
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${isAdmin ? 'bg-rose-500 text-white' : `${getAccentBgClass()} text-white`} text-xs font-bold`}>
                    {user.displayName.charAt(0)}
                  </div>
                  <span className="hidden lg:block text-xs font-bold text-slate-700 dark:text-slate-300 pr-1 max-w-[100px] truncate">
                    {user.displayName.split(' ')[0]}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl">
                    <div className="border-b border-slate-100 dark:border-slate-800 px-4.5 py-3">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.displayName}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
                      <span className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isAdmin ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {isAdmin ? 'অ্যাডমিনিস্ট্রেটর' : 'নিবন্ধিত গ্রাহক'}
                      </span>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <button
                        onClick={() => {
                          handleNavClick('dashboard');
                          setProfileOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <User className="h-4 w-4" />
                        আমার প্রোফাইল
                      </button>

                      <button
                        onClick={() => {
                          handleNavClick('dashboard');
                          setProfileOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <ShoppingBag className="h-4 w-4" />
                        আমার অর্ডার ও ডাউনলোড
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            handleNavClick('admin');
                            setProfileOpen(false);
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs text-rose-600 hover:bg-rose-50/50 dark:text-rose-400 dark:hover:bg-rose-950/20 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          অ্যাডমিন ড্যাশবোর্ড
                        </button>
                      )}

                      <button
                        onClick={() => {
                          logout();
                          setProfileOpen(false);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        লগ আউট
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md shadow-emerald-500/10 hover:scale-[1.02] transition-all active:scale-[0.98] ${getAccentBgClass()}`}
              >
                <LogIn className="h-4 w-4" />
                <span>লগইন / রেজিস্টার</span>
              </button>
            )}

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl p-2.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 md:hidden transition-colors"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-2 shadow-inner">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex w-full items-center px-4 py-3 rounded-xl text-sm font-semibold ${
                currentView === item.id 
                  ? `${getAccentBgClass()} text-white` 
                  : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}

          {isAdmin && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex w-full items-center gap-2 px-4 py-3 rounded-xl text-sm font-extrabold ${
                currentView === 'admin'
                  ? 'bg-rose-600 text-white'
                  : 'border border-dashed border-rose-400 text-rose-500 hover:bg-rose-50/50'
              }`}
            >
              <ShieldAlert className="h-4.5 w-4.5" />
              অ্যাডমিন প্যানেল
            </button>
          )}

          {!user && (
            <button
              onClick={() => handleNavClick('login')}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
            >
              <LogIn className="h-4.5 w-4.5" />
              লগইন / রেজিস্টার করুন
            </button>
          )}
        </div>
      )}
    </header>
  );
};
export { LucideIcons };
