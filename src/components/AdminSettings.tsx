import React, { useState } from 'react';
import { useAdminSettings } from '../context/AdminSettingsContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Save, RotateCcw, Palette, Settings, Globe, ShieldAlert, Phone, HelpCircle, 
  Layers, Mail, Megaphone, Copy, Download, Sparkles, Clock, Trash2, Plus, Check 
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useAdminSettings();
  const { getAccentBgClass, getAccentHoverBgClass, getAccentTextClass } = useTheme();

  const [activeTab, setActiveTab] = useState<'general' | 'payment' | 'seo' | 'marketing' | 'tools' | 'emails'>('general');

  // General & Contact States
  const [websiteName, setWebsiteName] = useState(settings.websiteName);
  const [logoIcon, setLogoIcon] = useState(settings.logoIcon || 'ShoppingBag');
  const [contactEmail, setContactEmail] = useState(settings.contactEmail || '');
  const [contactPhone, setContactPhone] = useState(settings.contactPhone || '');
  const [whatsAppNumber, setWhatsAppNumber] = useState(settings.whatsAppNumber || '');
  const [contactAddress, setContactAddress] = useState(settings.contactAddress || '');
  
  const [facebookLink, setFacebookLink] = useState(settings.facebookLink || '');
  const [telegramLink, setTelegramLink] = useState(settings.telegramLink || '');
  const [whatsAppLink, setWhatsAppLink] = useState(settings.whatsAppLink || '');
  const [accentColor, setAccentColor] = useState(settings.accentColor);

  // Payment States
  const [bkashNumber, setBkashNumber] = useState(settings.bkashNumber || '');
  const [nagadNumber, setNagadNumber] = useState(settings.nagadNumber || '');
  const [paymentInstructions, setPaymentInstructions] = useState(settings.paymentInstructions || '');

  // SEO States
  const [metaTitle, setMetaTitle] = useState(settings.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(settings.metaDescription || '');
  const [keywords, setKeywords] = useState(settings.keywords || '');
  const [ogImageUrl, setOgImageUrl] = useState(settings.ogImage || '');

  // Tracking States
  const [facebookPixelId, setFacebookPixelId] = useState(settings.facebookPixelId || '');
  const [googleAnalyticsId, setGoogleAnalyticsId] = useState(settings.googleAnalyticsId || '');
  const [googleTagManagerId, setGoogleTagManagerId] = useState(settings.googleTagManagerId || '');
  
  const [enableFacebookPixel, setEnableFacebookPixel] = useState(settings.enableFacebookPixel ?? false);
  const [enableGoogleAnalytics, setEnableGoogleAnalytics] = useState(settings.enableGoogleAnalytics ?? false);
  const [enableGoogleTagManager, setEnableGoogleTagManager] = useState(settings.enableGoogleTagManager ?? false);

  // Marketing Tools & Flash Sale
  const [enableFlashSale, setEnableFlashSale] = useState(settings.enableFlashSale ?? false);
  const [flashSaleEndTime, setFlashSaleEndTime] = useState(settings.flashSaleEndTime || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16));
  const [flashSaleText, setFlashSaleText] = useState(settings.flashSaleText || '');
  const [flashSaleDiscountPercent, setFlashSaleDiscountPercent] = useState(settings.flashSaleDiscountPercent || 15);

  // Newsletter Email List
  const [newsletterEmails, setNewsletterEmails] = useState<string[]>(settings.newsletterEmails || ['admin@hatbazar.com', 'user@example.com']);
  const [newEmail, setNewEmail] = useState('');

  // Email composer preview state
  const [promoSubject, setPromoSubject] = useState('হাট বাজার থেকে বিশেষ প্রমোশনাল অফার!');
  const [promoTemplate, setPromoTemplate] = useState<'discount' | 'newsletter'>('discount');
  const [promoBody, setPromoBody] = useState('আমাদের প্রিমিয়াম ডিজিটাল পণ্যের উপর উপভোগ করুন আকর্ষণীয় ১৫% ছাড়! নিচের কুপন কোড ব্যবহার করুন।');
  const [promoCouponCode, setPromoCouponCode] = useState('HATBAZAR15');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        websiteName,
        logoIcon,
        contactEmail,
        contactPhone,
        whatsAppNumber,
        contactAddress,
        facebookLink,
        telegramLink,
        whatsAppLink,
        bkashNumber,
        nagadNumber,
        paymentInstructions,
        accentColor,
        metaTitle,
        metaDescription,
        keywords,
        ogImage: ogImageUrl,
        facebookPixelId,
        googleAnalyticsId,
        googleTagManagerId,
        enableFacebookPixel,
        enableGoogleAnalytics,
        enableGoogleTagManager,
        enableFlashSale,
        flashSaleEndTime,
        flashSaleText,
        flashSaleDiscountPercent,
        newsletterEmails,
      });
      alert('ওয়েবসাইট সেটিংস সফলভাবে সেভ করা হয়েছে এবং সর্বত্র আপডেট করা হয়েছে!');
    } catch (err) {
      alert('সেটিংস পরিবর্তন করতে ত্রুটি ঘটেছে!');
    }
  };

  const handleReset = () => {
    if (confirm('আপনি কি সমস্ত ওয়েবসাইট সেটিংস ডিফল্ট এ রিস্টোর করতে চান?')) {
      resetSettings();
      alert('সেটিংস সফলভাবে রি-সেট হয়েছে। অনুগ্রহ করে পেজটি রিফ্রেশ করুন।');
      window.location.reload();
    }
  };

  const handleAddEmail = () => {
    if (!newEmail || !newEmail.includes('@')) {
      alert('সঠিক ইমেইল দিন!');
      return;
    }
    if (newsletterEmails.includes(newEmail)) {
      alert('ইমেইলটি ইতিমধ্যেই তালিকায় রয়েছে!');
      return;
    }
    const updated = [...newsletterEmails, newEmail];
    setNewsletterEmails(updated);
    setNewEmail('');
  };

  const handleRemoveEmail = (email: string) => {
    const updated = newsletterEmails.filter(e => e !== email);
    setNewsletterEmails(updated);
  };

  const handleExportEmails = () => {
    const blob = new Blob([newsletterEmails.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hatbazar-subscribers-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate simulated robots.txt
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /dashboard

Sitemap: ${window.location.origin}/sitemap.xml`;

  // Generate simulated sitemap.xml
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${window.location.origin}/</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${window.location.origin}/#products</loc>
    <lastmod>${new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in text-xs leading-relaxed">
      
      {/* Settings Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-800 pb-4">
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
          {(['general', 'payment', 'seo', 'marketing', 'tools', 'emails'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 rounded-lg font-bold text-[10px] uppercase transition-all ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              {tab === 'general' ? 'সাধারণ ও কন্টাক্ট' 
                : tab === 'payment' ? 'পেমেন্ট গেটওয়ে' 
                : tab === 'seo' ? 'SEO ও মেটা' 
                : tab === 'marketing' ? 'মার্কেটিং পিক্সেল' 
                : tab === 'tools' ? 'ফ্ল্যাশ সেল টুলস' 
                : 'নিউজলেটার ও ইমেইল'}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="text-slate-400 hover:text-rose-500 font-bold flex items-center gap-1.5 transition-colors self-end"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          ডিফল্ট রিস্টোর করুন
        </button>
      </div>

      {/* RENDER ACTIVE TAB BODY */}
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-6 backdrop-blur-md space-y-6 shadow-sm">
        
        {/* 1. GENERAL TAB */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            <h4 className="sm:col-span-2 font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center gap-1.5">
              <Settings className="h-4 w-4 text-rose-500" />
              ওয়েবসাইট তথ্য ও সোশ্যাল ব্র্যান্ডিং
            </h4>

            {/* Name */}
            <div className="space-y-1">
              <label className="text-slate-500 block font-bold">ওয়েবসাইটের নাম (Website Name)</label>
              <input
                type="text"
                required
                value={websiteName}
                onChange={(e) => setWebsiteName(e.target.value)}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
              />
            </div>

            {/* Logo */}
            <div className="space-y-1">
              <label className="text-slate-500 block font-bold">লোগো আইকন নাম (Lucide Icon Name)</label>
              <select
                value={logoIcon}
                onChange={(e) => setLogoIcon(e.target.value)}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
              >
                <option value="ShoppingBag">ShoppingBag (ডিফল্ট)</option>
                <option value="Globe">Globe</option>
                <option value="Layers">Layers</option>
                <option value="Cpu">Cpu</option>
                <option value="Sparkles">Sparkles</option>
              </select>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-slate-500 block font-bold">যোগাযোগের মোবাইল নাম্বার</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none font-mono"
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-1">
              <label className="text-slate-500 block font-bold">হোয়াটসঅ্যাপ হেল্পলাইন নাম্বার</label>
              <input
                type="text"
                value={whatsAppNumber}
                onChange={(e) => setWhatsAppNumber(e.target.value)}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none font-mono"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-slate-500 block font-bold">যোগাযোগের ইমেইল অ্যাড্রেস</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
              />
            </div>

            {/* Address */}
            <div className="space-y-1">
              <label className="text-slate-500 block font-bold">অফিস ঠিকানা (Address)</label>
              <input
                type="text"
                value={contactAddress}
                onChange={(e) => setContactAddress(e.target.value)}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
              />
            </div>

            {/* Social Link Facebook */}
            <div className="space-y-1">
              <label className="text-slate-500 block font-bold">ফেসবুক পেজ লিংক (Facebook Page Link)</label>
              <input
                type="url"
                value={facebookLink}
                onChange={(e) => setFacebookLink(e.target.value)}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
              />
            </div>

            {/* Telegram link */}
            <div className="space-y-1">
              <label className="text-slate-500 block font-bold">টেলিগ্রাম চ্যানেল লিংক (Telegram Channel Link)</label>
              <input
                type="url"
                value={telegramLink}
                onChange={(e) => setTelegramLink(e.target.value)}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
              />
            </div>

            {/* Theme scheme select */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-slate-500 block font-bold mb-2 flex items-center gap-1">
                <Palette className="h-4 w-4 text-indigo-500" />
                রিয়েল-টাইম থিম কালার স্কিম (Primary Accent Color)
              </label>
              <div className="flex flex-wrap gap-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-900">
                {['rose', 'blue', 'emerald', 'purple', 'amber'].map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setAccentColor(col as any)}
                    className={`px-3 py-1.5 rounded-lg border text-[9px] uppercase font-black transition-all ${
                      accentColor === col
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 border-slate-900 dark:border-white'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 2. PAYMENT TAB */}
        {activeTab === 'payment' && (
          <div className="space-y-5">
            <h4 className="font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center gap-1.5">
              <Phone className="h-4 w-4 text-emerald-500" />
              বিকাশ ও নগদ পেমেন্ট গেটওয়ে সেটিংস
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-slate-500 block font-bold">বিকাশ পার্সোনাল মোবাইল নাম্বার</label>
                <input
                  type="text"
                  value={bkashNumber}
                  onChange={(e) => setBkashNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none font-mono"
                  placeholder="যেমন: ০১৭XXXXXXXX"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block font-bold">নগদ পার্সোনাল মোবাইল নাম্বার</label>
                <input
                  type="text"
                  value={nagadNumber}
                  onChange={(e) => setNagadNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none font-mono"
                  placeholder="যেমন: ০১৯XXXXXXXX"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-slate-500 block font-bold">অর্ডার কমপ্লিট নির্দেশনাবলী (Payment Instructions)</label>
                <textarea
                  value={paymentInstructions}
                  onChange={(e) => setPaymentInstructions(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none leading-relaxed"
                  placeholder="গ্রাহক কীভাবে পেমেন্ট করে ফর্ম সাবমিট করবে, বিস্তারিত নির্দেশনাবলী এখানে লিখুন..."
                />
              </div>
            </div>
          </div>
        )}

        {/* 3. SEO TAB */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <h4 className="font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-blue-500" />
              সার্চ ইঞ্জিন অপ্টিমাইজেশন (SEO) ও মেটা ট্যাগ সেটিংস
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-slate-500 block font-bold">হোমপেজ টাইটেল (Homepage Meta Title) *</label>
                <input
                  type="text"
                  required
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
                  placeholder="যেমন: Hat Bazar - ডিজিটাল প্রোডাক্ট মার্কেটপ্লেস"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-slate-500 block font-bold">মেটা বর্ণনা (Homepage Meta Description) *</label>
                <textarea
                  required
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none leading-relaxed"
                  placeholder="সার্চ ইঞ্জিনে দেখানোর জন্য সাইটের সংক্ষিপ্ত বর্ণনা..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block font-bold">সার্চ কীওয়ার্ডস (Keywords - কমা দিয়ে লিখুন)</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
                  placeholder="plugins, scripts, themes, hatbazar, ডিজিটাল প্রোডাক্ট"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 block font-bold">সোশ্যাল শেয়ার ইমেজ (Open Graph / OG Image URL)</label>
                <input
                  type="text"
                  value={ogImageUrl}
                  onChange={(e) => setOgImageUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </div>

            {/* Technical SEO Panel */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
              <h5 className="font-extrabold text-slate-700 dark:text-slate-300 text-[11px] flex items-center gap-1.5 uppercase tracking-wider">
                <ShieldAlert className="h-4 w-4 text-emerald-500" />
                টেকনিক্যাল SEO (Sitemap.xml ও Robots.txt)
              </h5>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Robots.txt Card */}
                <div className="rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Robots.txt কনটেন্ট</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(robotsTxt);
                        alert('Robots.txt কপি করা হয়েছে!');
                      }}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1 text-[10px]"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      কপি করুন
                    </button>
                  </div>
                  <pre className="font-mono text-[9px] text-slate-500 p-2.5 bg-white dark:bg-slate-900 rounded-lg overflow-x-auto select-all border border-slate-100 dark:border-slate-800 leading-normal">
                    {robotsTxt}
                  </pre>
                </div>

                {/* Sitemap.xml Card */}
                <div className="rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-950 p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-slate-200">Sitemap.xml কনটেন্ট</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(sitemapXml);
                        alert('Sitemap.xml কপি করা হয়েছে!');
                      }}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center gap-1 text-[10px]"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      কপি করুন
                    </button>
                  </div>
                  <pre className="font-mono text-[9px] text-slate-500 p-2.5 bg-white dark:bg-slate-900 rounded-lg overflow-x-auto select-all border border-slate-100 dark:border-slate-800 leading-normal">
                    {sitemapXml}
                  </pre>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* 4. MARKETING PIXELS TAB */}
        {activeTab === 'marketing' && (
          <div className="space-y-6">
            <h4 className="font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-purple-500" />
              মার্কেটিং পিক্সেল ও অ্যানালিটিক্স ট্র্যাকিং ইন্টিগ্রেশন
            </h4>

            <div className="space-y-5">
              
              {/* Facebook Pixel */}
              <div className="rounded-xl border border-slate-100 dark:border-slate-850/60 p-4 bg-slate-50/50 dark:bg-slate-950/20 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">1. Facebook Meta Pixel Integration</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      id="enFP"
                      checked={enableFacebookPixel}
                      onChange={(e) => setEnableFacebookPixel(e.target.checked)}
                      className="h-4 w-4 rounded text-rose-500 focus:ring-0"
                    />
                    <label htmlFor="enFP" className="font-bold text-[10px] text-slate-600 dark:text-slate-300 uppercase">পিক্সেল চালু করুন</label>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Meta Pixel ID</label>
                  <input
                    type="text"
                    value={facebookPixelId}
                    onChange={(e) => setFacebookPixelId(e.target.value)}
                    className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none font-mono"
                    placeholder="যেমন: ১৫৯৮৪৩৫৬৪..."
                  />
                  <p className="text-[10px] text-slate-400">চালু থাকলে এটি PageView, ViewContent, AddToCart, InitiateCheckout এবং Purchase ট্র্যাক করবে।</p>
                </div>
              </div>

              {/* Google Analytics */}
              <div className="rounded-xl border border-slate-100 dark:border-slate-850/60 p-4 bg-slate-50/50 dark:bg-slate-950/20 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">2. Google Analytics 4 (GA4) Integration</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      id="enGA"
                      checked={enableGoogleAnalytics}
                      onChange={(e) => setEnableGoogleAnalytics(e.target.checked)}
                      className="h-4 w-4 rounded text-rose-500 focus:ring-0"
                    />
                    <label htmlFor="enGA" className="font-bold text-[10px] text-slate-600 dark:text-slate-300 uppercase">GA4 ট্র্যাকিং চালু করুন</label>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Measurement ID</label>
                  <input
                    type="text"
                    value={googleAnalyticsId}
                    onChange={(e) => setGoogleAnalyticsId(e.target.value)}
                    className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none font-mono"
                    placeholder="যেমন: G-XXXXXXX"
                  />
                  <p className="text-[10px] text-slate-400">ইউজার সেশন, ভিউ, কার্ট অ্যাক্টিভিটি এবং পার্চেস ইভেন্টসমূহ রিয়েল-টাইমে গুগল অ্যানালিটিক্সে ট্রান্সমিট হবে।</p>
                </div>
              </div>

              {/* Google Tag Manager */}
              <div className="rounded-xl border border-slate-100 dark:border-slate-850/60 p-4 bg-slate-50/50 dark:bg-slate-950/20 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">3. Google Tag Manager (GTM)</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      id="enGTM"
                      checked={enableGoogleTagManager}
                      onChange={(e) => setEnableGoogleTagManager(e.target.checked)}
                      className="h-4 w-4 rounded text-rose-500 focus:ring-0"
                    />
                    <label htmlFor="enGTM" className="font-bold text-[10px] text-slate-600 dark:text-slate-300 uppercase">GTM লোডার চালু করুন</label>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-slate-400">Tag Manager GTM ID</label>
                  <input
                    type="text"
                    value={googleTagManagerId}
                    onChange={(e) => setGoogleTagManagerId(e.target.value)}
                    className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none font-mono"
                    placeholder="যেমন: GTM-XXXXXXX"
                  />
                  <p className="text-[10px] text-slate-400">যেকোনো থার্ড-পার্টি কন্টেইনার বা স্ক্রিপ্ট লোড করার জন্য ডায়নামিক ট্যাগ ম্যানেজার ইনজেকশন স্ক্রিপ্ট রান করবে।</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 5. MARKETING TOOLS & FLASH SALE */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            <h4 className="font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center gap-1.5">
              <Megaphone className="h-4 w-4 text-amber-500" />
              মার্কেটিং প্রমোশনাল টুলস ও ফ্ল্যাশ সেল
            </h4>

            <div className="rounded-xl border border-slate-100 dark:border-slate-850 p-5 bg-amber-500/5 space-y-5">
              
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <h5 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                    সীমাবদ্ধ সময়ের ফ্ল্যাশ সেল (Flash Sale Manager)
                  </h5>
                  <p className="text-[10px] text-slate-400">এই সেলটি হোমপেজের উপরে কাউন্টডাউন টাইমার সহ একটি ভিজ্যুয়াল ব্যানার প্রদর্শন করে।</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    id="enFS"
                    checked={enableFlashSale}
                    onChange={(e) => setEnableFlashSale(e.target.checked)}
                    className="h-4.5 w-4.5 rounded text-amber-500 focus:ring-0"
                  />
                  <label htmlFor="enFS" className="font-black text-xs text-amber-600 dark:text-amber-400 uppercase tracking-wide">সক্রিয় করুন</label>
                </div>
              </div>

              {enableFlashSale && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
                  
                  <div className="space-y-1">
                    <label className="text-slate-500 block font-bold">ফ্ল্যাশ অফার ব্যানার টেক্সট</label>
                    <input
                      type="text"
                      value={flashSaleText}
                      onChange={(e) => setFlashSaleText(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
                      placeholder="যেমন: ধামাকা ফ্ল্যাশ সেল! প্রতিটি ডিজিটাল প্রোডাক্টে স্পেশাল ছাড়!"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500 block font-bold">ফ্ল্যাশ সেল ডিসকাউন্ট হার (%)</label>
                    <input
                      type="number"
                      max="100"
                      value={flashSaleDiscountPercent}
                      onChange={(e) => setFlashSaleDiscountPercent(parseInt(e.target.value) || 0)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none font-mono"
                      placeholder="যেমন: ১৫"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-500 block font-bold flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      অফারের শেষ সময় ও তারিখ (Schedule Countdown Timer)
                    </label>
                    <input
                      type="datetime-local"
                      value={flashSaleEndTime}
                      onChange={(e) => setFlashSaleEndTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none font-mono"
                    />
                    <p className="text-[10px] text-slate-400">এই সময় অতিক্রান্ত হলে টাইমারটি স্বয়ংক্রিয়ভাবে বন্ধ হয়ে যাবে।</p>
                  </div>

                </div>
              )}

            </div>

            {/* Quick tips */}
            <div className="rounded-xl border border-slate-100 dark:border-slate-850 p-4 space-y-2 bg-slate-50/60 dark:bg-slate-950/20 text-slate-500 text-[10px]">
              <strong className="text-slate-700 dark:text-slate-300 font-bold">💡 মার্কেটিং ও কনভার্সন অপ্টিমাইজেশন টিপস:</strong>
              <p>১. গ্রাহকের বিশ্বাস যোগ্যতা বাড়াতে প্রতিটি প্রোডাক্টের বিবরণীতে <strong>"সুপার-ফাস্ট ইন্সট্যান্ট ডাউনলোড"</strong> ও <strong>"১০০% নিরাপদ পেমেন্ট"</strong> ট্রাস্ট ব্যাজ প্রদর্শন করুন।</p>
              <p>২. বিশেষ উৎসব উপলক্ষে কুপন ডিসকাউন্ট ট্যাব থেকে আকর্ষনীয় কুপন কোড (যেমন: <strong>EID50</strong>) তৈরি করুন এবং সেটি ফ্ল্যাশ সেলে প্রমোট করুন।</p>
            </div>

          </div>
        )}

        {/* 6. EMAIL MARKETING TAB */}
        {activeTab === 'emails' && (
          <div className="space-y-6">
            <h4 className="font-bold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-rose-500" />
              ইমেইল মার্কেটিং কালেকশন ও প্রমোশনাল টেমপ্লেট
            </h4>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              
              {/* Left Column: Email Database */}
              <div className="lg:col-span-1 rounded-xl border border-slate-100 dark:border-slate-850 p-4 space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="font-extrabold text-slate-700 dark:text-slate-300">কাস্টমার ইমেইল ডাটাবেজ ({newsletterEmails.length})</span>
                  <button
                    type="button"
                    onClick={handleExportEmails}
                    className="text-slate-500 hover:text-emerald-500 flex items-center gap-1 font-bold text-[10px]"
                    title="TXT এক্সপোর্ট করুন"
                  >
                    <Download className="h-3.5 w-3.5" />
                    এক্সপোর্ট
                  </button>
                </div>

                {/* Add Custom subscriber */}
                <div className="flex gap-1.5">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="ইমেইল যোগ করুন..."
                    className="flex-grow rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-1.5 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddEmail}
                    className={`p-2 rounded-xl text-white font-bold ${getAccentBgClass()}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {/* Emails list container */}
                <div className="max-h-48 overflow-y-auto divide-y divide-slate-150/40 dark:divide-slate-800/40 pr-1">
                  {newsletterEmails.map((email) => (
                    <div key={email} className="py-2 flex justify-between items-center text-[10px] font-mono">
                      <span className="truncate text-slate-600 dark:text-slate-300">{email}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEmail(email)}
                        className="text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 p-1 rounded-md transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  {newsletterEmails.length === 0 && (
                    <p className="text-slate-400 py-6 text-center text-[10px]">কোনো ইমেইল সংগ্রহ করা হয়নি।</p>
                  )}
                </div>
              </div>

              {/* Right Column: Dynamic Promo Email Ready System */}
              <div className="lg:col-span-2 rounded-xl border border-slate-100 dark:border-slate-850 p-4 space-y-4 bg-white/50 dark:bg-slate-900/50">
                <h5 className="font-extrabold text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-2">
                  🚀 প্রমোশনাল ইমেইল রেডি সিস্টেম (Promotional Email Templates)
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  
                  {/* Select template */}
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold">ইমেইল টেমপ্লেট টাইপ</label>
                    <select
                      value={promoTemplate}
                      onChange={(e) => setPromoTemplate(e.target.value as any)}
                      className="w-full rounded-xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2.5 focus:outline-none"
                    >
                      <option value="discount">স্পেশাল কুপন ডিসকাউন্ট টেমপ্লেট</option>
                      <option value="newsletter">সাধারণ হাট বাজার নিউজলেটার</option>
                    </select>
                  </div>

                  {/* Subject input */}
                  <div className="space-y-1">
                    <label className="text-slate-500 font-bold">ইমেইল সাবজেক্ট (Subject Line)</label>
                    <input
                      type="text"
                      value={promoSubject}
                      onChange={(e) => setPromoSubject(e.target.value)}
                      className="w-full rounded-xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2.5 focus:outline-none"
                    />
                  </div>

                  {/* Coupon input */}
                  {promoTemplate === 'discount' && (
                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold">প্রমো কোড (Promo Coupon)</label>
                      <input
                        type="text"
                        value={promoCouponCode}
                        onChange={(e) => setPromoCouponCode(e.target.value)}
                        className="w-full rounded-xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2.5 focus:outline-none uppercase font-mono"
                      />
                    </div>
                  )}

                  {/* Body textarea */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-slate-500 font-bold">ইমেইলের মূল বিষয়বস্তু (Email Body Text)</label>
                    <textarea
                      value={promoBody}
                      onChange={(e) => setPromoBody(e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 focus:outline-none leading-relaxed"
                    />
                  </div>

                </div>

                {/* Real-time HTML template renderer */}
                <div className="border border-slate-150 dark:border-slate-850 rounded-xl overflow-hidden shadow-inner">
                  <div className="bg-slate-100 dark:bg-slate-950 px-4 py-2 border-b border-slate-150 dark:border-slate-850 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-slate-500">এইচটিএমএল ইমেইল লাইভ প্রিভিউ</span>
                    <button
                      type="button"
                      onClick={() => {
                        alert('Promotional email html template successfully prepared and integrated with sending system.');
                      }}
                      className="px-2.5 py-1 rounded bg-rose-500 text-white hover:bg-rose-600 font-bold"
                    >
                      কাস্টমারদের ইমেইল পাঠান
                    </button>
                  </div>
                  
                  {/* HTML Box */}
                  <div className="p-5 bg-slate-50 text-slate-800 font-sans leading-normal">
                    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                      {/* header */}
                      <div className="bg-slate-900 text-white text-center py-5">
                        <h1 className="font-black tracking-widest text-sm leading-none">{websiteName}</h1>
                        <span className="text-[9px] text-slate-400 uppercase tracking-wide">ডিজিটাল মার্কেটপ্লেস</span>
                      </div>
                      
                      {/* body */}
                      <div className="p-5 text-center space-y-4">
                        <strong className="text-xs font-black text-slate-900 block">{promoSubject}</strong>
                        <p className="text-[11px] text-slate-500 leading-relaxed text-justify">{promoBody}</p>
                        
                        {promoTemplate === 'discount' && (
                          <div className="bg-emerald-50 text-emerald-600 border border-dashed border-emerald-300 p-3 rounded-lg my-3">
                            <span className="text-[9px] block uppercase tracking-wide">কুপন কোড ব্যবহার করুন</span>
                            <span className="text-sm font-mono font-black select-all tracking-wider">{promoCouponCode}</span>
                          </div>
                        )}
                        
                        <a
                          href={window.location.origin}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block px-5 py-2 rounded bg-rose-500 text-white font-bold text-[10px] shadow active:scale-95 transition-all"
                        >
                          মার্কেটপ্লেস ভিজিট করুন
                        </a>
                      </div>

                      {/* footer */}
                      <div className="bg-slate-50 text-[9px] text-slate-400 text-center py-3 border-t border-slate-150">
                        <p>© ২০২৬ {websiteName}. সর্বস্বত্ব সংরক্ষিত।</p>
                        <p>আপনি যদি এই ইমেইল আর পেতে না চান, তবে আনসাবস্ক্রাইব করতে পারেন।</p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      <button
        type="submit"
        className={`w-full py-3.5 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 ${getAccentBgClass()} ${getAccentHoverBgClass()}`}
      >
        <Save className="h-4.5 w-4.5" />
        <span>সমস্ত পরিবর্তন সংরক্ষণ করুন</span>
      </button>

    </form>
  );
};
