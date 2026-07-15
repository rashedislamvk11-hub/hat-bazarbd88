import React from 'react';
import { useAdminSettings } from '../context/AdminSettingsContext';
import { useTheme } from '../context/ThemeContext';
import { Facebook, Send, MessageSquare, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useAdminSettings();
  const { getAccentTextClass } = useTheme();

  return (
    <footer className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 font-sans transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 lg:gap-16">
          
          {/* About Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider uppercase text-slate-900 dark:text-white">
              আমাদের সম্পর্কে
            </h3>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {settings.aboutText}
            </p>
          </div>

          {/* Contact Details Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider uppercase text-slate-900 dark:text-white">
              যোগাযোগ করুন
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-center gap-3">
                <Phone className={`h-4.5 w-4.5 ${getAccentTextClass()}`} />
                <a href={`tel:${settings.contactPhone}`} className="hover:text-slate-950 dark:hover:text-white transition-colors">
                  {settings.contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className={`h-4.5 w-4.5 ${getAccentTextClass()}`} />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-slate-950 dark:hover:text-white transition-colors">
                  {settings.contactEmail}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className={`h-4.5 w-4.5 ${getAccentTextClass()}`} />
                <span>ঢাকা, বাংলাদেশ</span>
              </li>
            </ul>
          </div>

          {/* Social Links Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider uppercase text-slate-900 dark:text-white">
              যুক্ত থাকুন আমাদের সাথে
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              সোশ্যাল মিডিয়ায় আমাদের সাথে যুক্ত হয়ে নতুন নতুন আপডেট, কুপন কোড এবং বিশেষ অফারসমূহ সবার আগে পান।
            </p>
            <div className="flex items-center gap-3.5 pt-2">
              {settings.facebookLink && (
                <a
                  href={settings.facebookLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 hover:bg-blue-50 dark:bg-slate-900 dark:hover:bg-blue-950/30 text-slate-400 hover:text-blue-600 transition-all duration-300 active:scale-95 border border-slate-100 dark:border-slate-800"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings.telegramLink && (
                <a
                  href={settings.telegramLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 hover:bg-sky-50 dark:bg-slate-900 dark:hover:bg-sky-950/30 text-slate-400 hover:text-sky-500 transition-all duration-300 active:scale-95 border border-slate-100 dark:border-slate-800"
                >
                  <Send className="h-5 w-5" />
                </a>
              )}
              {settings.whatsAppLink && (
                <a
                  href={settings.whatsAppLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 hover:bg-emerald-50 dark:bg-slate-900 dark:hover:bg-emerald-950/30 text-slate-400 hover:text-emerald-500 transition-all duration-300 active:scale-95 border border-slate-100 dark:border-slate-800"
                >
                  <MessageSquare className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="mt-12 border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400 dark:text-slate-500">
          <p>© ২০২৬ {settings.websiteName}। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-5">
            <a href="#order" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">ডাউনলোড ও অর্ডার ট্র্যাকিং</a>
            <a href="#privacy" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">গোপনীয়তা নীতি</a>
            <a href="#terms" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">শর্তাবলী</a>
            <a href="#refund" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">রিফান্ড পলিসি</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
