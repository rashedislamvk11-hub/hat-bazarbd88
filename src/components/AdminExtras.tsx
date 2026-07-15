import React, { useState } from 'react';
import { UserProfile, Review, Coupon, Banner, Product, Category, ActivityLog } from '../types';
import { useTheme } from '../context/ThemeContext';
import { toBanglaNumber, formatPrice } from '../utils/helpers';
import { 
  Users, Trash2, Edit, Save, Plus, Check, Search, ShieldAlert, AlertCircle, 
  MessageSquare, Star, Image as ImageIcon, Tag, CheckSquare, XCircle, 
  Database, Download, Terminal, BadgePercent, Power, RefreshCw, Layers, FileText,
  TrendingUp, BarChart3, Activity, PieChart, Filter
} from 'lucide-react';

interface AdminExtrasProps {
  tab: 'customers' | 'reviews' | 'banners' | 'coupons' | 'backup' | 'categories' | 'reports' | 'logs';
  users: UserProfile[];
  reviews: (Review & { productId: string; productName: string })[];
  coupons: Coupon[];
  banners: Banner[];
  categories?: Category[];
  activityLogs?: ActivityLog[];
  products: Product[];
  orders: any[];
  onUpdateUser: (uid: string, blocked: boolean, role?: 'admin' | 'user') => void;
  onDeleteReview: (productId: string, reviewId: string) => void;
  onApproveReview?: (productId: string, reviewId: string) => void;
  onSaveCoupon: (c: Coupon) => void;
  onDeleteCoupon: (id: string) => void;
  onSaveBanner: (b: Banner) => void;
  onDeleteBanner: (id: string) => void;
  onSaveCategory?: (cat: Category) => void;
  onDeleteCategory?: (id: string) => void;
  onReloadExtras: () => void;
}

export const AdminExtras: React.FC<AdminExtrasProps> = ({
  tab,
  users,
  reviews,
  coupons,
  banners,
  categories = [],
  activityLogs = [],
  products,
  orders,
  onUpdateUser,
  onDeleteReview,
  onApproveReview,
  onSaveCoupon,
  onDeleteCoupon,
  onSaveBanner,
  onDeleteBanner,
  onSaveCategory,
  onDeleteCategory,
  onReloadExtras,
}) => {
  const { getAccentBgClass, getAccentHoverBgClass, getAccentTextClass } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [isCouponFormOpen, setIsCouponFormOpen] = useState(false);
  const [isBannerFormOpen, setIsBannerFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Coupon Form States
  const [couponId, setCouponId] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('');
  const [couponExpiry, setCouponExpiry] = useState('');
  const [couponActive, setCouponActive] = useState(true);

  // Banner Form States
  const [bannerId, setBannerId] = useState('');
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [bannerLinkUrl, setBannerLinkUrl] = useState('');
  const [bannerActive, setBannerActive] = useState(true);

  // Category Form States
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [categoryNameEn, setCategoryNameEn] = useState('');
  const [categoryNameBn, setCategoryNameBn] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('📦');
  const [categoryActive, setCategoryActive] = useState(true);

  // Users Block Handler
  const handleToggleBlock = (u: UserProfile) => {
    const isBlocked = !u.blocked;
    onUpdateUser(u.uid, isBlocked);
    alert(`ইউজার '${u.displayName}' কে সফলভাবে ${isBlocked ? 'ব্লক' : 'আনব্লক'} করা হয়েছে!`);
  };

  // Promote/Demote User Role Handler
  const handleToggleRole = (u: UserProfile) => {
    const nextRole = u.role === 'admin' ? 'user' : 'admin';
    if (confirm(`আপনি কি নিশ্চিতভাবে ইউজার "${u.displayName}" এর রোল '${nextRole}' এ পরিবর্তন করতে চান?`)) {
      onUpdateUser(u.uid, !!u.blocked, nextRole);
      alert(`রোল সফলভাবে '${nextRole}' করা হয়েছে!`);
    }
  };

  // Save Coupon Submit
  const handleSaveCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode || !couponDiscount || !couponExpiry) {
      alert('অনুগ্রহ করে সব তথ্য দিন!');
      return;
    }
    setIsSaving(true);
    try {
      const c: Coupon = {
        id: couponId || 'cp-' + Date.now(),
        code: couponCode.toUpperCase().trim(),
        discountPercent: parseInt(couponDiscount),
        expiryDate: couponExpiry,
        active: couponActive
      };
      await onSaveCoupon(c);
      alert('কুপন সফলভাবে সংরক্ষণ করা হয়েছে!');
      setIsCouponFormOpen(false);
      clearCouponForm();
    } catch (err: any) {
      console.error("Error saving coupon:", err);
      alert(`কুপন সংরক্ষণ করতে ব্যর্থ হয়েছে!\nভুল: ${err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCoupon = (c: Coupon) => {
    setCouponId(c.id);
    setCouponCode(c.code);
    setCouponDiscount(c.discountPercent.toString());
    setCouponExpiry(c.expiryDate);
    setCouponActive(c.active);
    setIsCouponFormOpen(true);
  };

  const clearCouponForm = () => {
    setCouponId('');
    setCouponCode('');
    setCouponDiscount('');
    setCouponExpiry('');
    setCouponActive(true);
  };

  // Save Banner Submit
  const handleSaveBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerImageUrl || !bannerTitle) {
      alert('অনুগ্রহ করে ব্যানার ছবি ও টাইটেল দিন!');
      return;
    }
    setIsSaving(true);
    try {
      const b: Banner = {
        id: bannerId || 'bn-' + Date.now(),
        imageUrl: bannerImageUrl,
        title: bannerTitle,
        subtitle: bannerSubtitle,
        linkUrl: bannerLinkUrl || '#',
        active: bannerActive
      };
      await onSaveBanner(b);
      alert('ব্যানার সফলভাবে সংরক্ষণ করা হয়েছে!');
      setIsBannerFormOpen(false);
      clearBannerForm();
    } catch (err: any) {
      console.error("Error saving banner:", err);
      alert(`ব্যানার সংরক্ষণ করতে ব্যর্থ হয়েছে!\nভুল: ${err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditBanner = (b: Banner) => {
    setBannerId(b.id);
    setBannerTitle(b.title);
    setBannerSubtitle(b.subtitle || '');
    setBannerImageUrl(b.imageUrl);
    setBannerLinkUrl(b.linkUrl || '');
    setBannerActive(b.active);
    setIsBannerFormOpen(true);
  };

  const clearBannerForm = () => {
    setBannerId('');
    setBannerTitle('');
    setBannerSubtitle('');
    setBannerImageUrl('');
    setBannerLinkUrl('');
    setBannerActive(true);
  };

  // Save Category Submit
  const handleSaveCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryNameEn || !categoryNameBn) {
      alert('অনুগ্রহ করে ক্যাটাগরির ইংরেজি ও বাংলা নাম দিন!');
      return;
    }
    setIsSaving(true);
    try {
      const cat: Category = {
        id: categoryId || 'cat-' + Date.now(),
        name: categoryNameBn.trim(),
        slug: categoryNameEn.toLowerCase().trim(),
        description: categoryNameBn.trim(),
        name_en: categoryNameEn.toLowerCase().trim(),
        name_bn: categoryNameBn.trim(),
        icon: categoryIcon || '📦',
        active: categoryActive
      };
      if (onSaveCategory) {
        await onSaveCategory(cat);
        alert('ক্যাটাগরি সফলভাবে সংরক্ষণ করা হয়েছে!');
        setIsCategoryFormOpen(false);
        clearCategoryForm();
      }
    } catch (err: any) {
      console.error("Error saving category:", err);
      alert(`ক্যাটাগরি সংরক্ষণ করতে ব্যর্থ হয়েছে!\nভুল: ${err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditCategory = (cat: Category) => {
    setCategoryId(cat.id);
    setCategoryNameEn(cat.name_en || cat.slug || '');
    setCategoryNameBn(cat.name_bn || cat.name || '');
    setCategoryIcon(cat.icon || '📦');
    setCategoryActive(cat.active !== false);
    setIsCategoryFormOpen(true);
  };

  const clearCategoryForm = () => {
    setCategoryId('');
    setCategoryNameEn('');
    setCategoryNameBn('');
    setCategoryIcon('📦');
    setCategoryActive(true);
  };

  // Export site Backup data
  const handleExportBackup = () => {
    const backupData = {
      exportedAt: new Date().toISOString(),
      products,
      orders,
      users,
      reviews,
      coupons,
      banners
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hatbazar-marketplace-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('ড্যাশবোর্ড ব্যাকআপ ফাইল (.json) সফলভাবে ডাউনলোড সম্পন্ন হয়েছে!');
  };

  return (
    <div className="space-y-6 animate-fade-in text-xs leading-relaxed">
      
      {/* 1. CUSTOMERS MANAGEMENT */}
      {tab === 'customers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-sans text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Users className="h-4.5 w-4.5 text-rose-500" />
              কাস্টমার ও ইউজার ডাটাবেজ
            </h3>
            <button onClick={onReloadExtras} className="text-slate-400 hover:text-slate-600 transition-all flex items-center gap-1">
              <RefreshCw className="h-3.5 w-3.5 animate-spin-hover" />
              রিলোড
            </button>
          </div>

          <div className="relative">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নাম, ইমেইল অথবা ফোন নাম্বার দিয়ে খুঁজুন..."
              className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950/50 px-4 py-2.5 pl-10 focus:outline-none"
            />
          </div>

          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-6 backdrop-blur-md overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400">
                  <th className="py-3 px-2 font-bold">নাম ও ইমেইল</th>
                  <th className="py-3 px-2 font-bold">মোবাইল নম্বর</th>
                  <th className="py-3 px-2 font-bold">রোল</th>
                  <th className="py-3 px-2 font-bold">যোগদান তারিখ</th>
                  <th className="py-3 px-2 font-bold text-center">ব্লক স্ট্যাটাস</th>
                  <th className="py-3 px-2 font-bold text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60">
                {users.filter(u => 
                  u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  (u.phone && u.phone.includes(searchQuery))
                ).map((u) => (
                  <tr key={u.uid} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="py-3.5 px-2">
                      <p className="font-bold text-slate-850 dark:text-slate-200">{u.displayName}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{u.email}</p>
                    </td>
                    <td className="py-3.5 px-2 font-semibold text-slate-500 font-mono">
                      {u.phone || 'দেওয়া হয়নি'}
                    </td>
                    <td className="py-3.5 px-2">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide ${
                        u.role === 'admin' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                      }`}>
                        {u.role === 'admin' ? 'অ্যাডমিন' : 'গ্রাহক'}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 font-mono text-slate-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('bn-BD') : '---'}
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide ${
                        u.blocked ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-600'
                      }`}>
                        {u.blocked ? 'ব্লকড' : 'সক্রিয়'}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleToggleBlock(u)}
                          className={`px-2 py-1 rounded text-[9px] font-bold border transition-colors ${
                            u.blocked
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white'
                              : 'bg-rose-500/10 border-rose-500 text-rose-500 hover:bg-rose-500 hover:text-white'
                          }`}
                        >
                          {u.blocked ? 'আনব্লক' : 'ব্লক করুন'}
                        </button>
                        <button
                          onClick={() => handleToggleRole(u)}
                          className="px-2 py-1 rounded text-[9px] font-bold border border-slate-200 text-slate-500 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          রোল পরিবর্তন
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. REVIEWS MODERATION */}
      {tab === 'reviews' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-sans text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="h-4.5 w-4.5 text-rose-500" />
              গ্রাহক রিভিউ ও রেটিং মডারেশন
            </h3>
            <button onClick={onReloadExtras} className="text-slate-400 hover:text-slate-600 transition-all flex items-center gap-1">
              <RefreshCw className="h-3.5 w-3.5 animate-spin-hover" />
              রিলোড
            </button>
          </div>

          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-6 backdrop-blur-md space-y-4 shadow-sm">
            {reviews.length > 0 ? (
              <div className="divide-y divide-slate-100 dark:divide-slate-850/60">
                {reviews.map((r) => (
                  <div key={r.id} className="py-4 flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs leading-relaxed">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-850 dark:text-slate-150">{r.userName}</strong>
                        <div className="flex text-amber-500">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-500" />
                          ))}
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                          r.approved 
                            ? 'bg-emerald-500/10 text-emerald-600' 
                            : 'bg-amber-500/10 text-amber-600 animate-pulse'
                        }`}>
                          {r.approved ? 'অনুমোদিত' : 'অনুমোদন পেন্ডিং'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        প্রোডাক্ট: <strong className={getAccentTextClass()}>{r.productName}</strong>
                      </p>
                      <p className="text-slate-600 dark:text-slate-350 italic">"{r.comment}"</p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(r.createdAt).toLocaleDateString('bn-BD')}
                      </span>
                      
                      {!r.approved && onApproveReview && (
                        <button
                          onClick={() => {
                            onApproveReview(r.productId, r.id);
                            alert('রিভিউটি সফলভাবে অনুমোদন করা হয়েছে!');
                          }}
                          className="rounded-lg px-2.5 py-1 text-[10px] bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 transition-all flex items-center gap-1 font-bold shadow-sm shadow-emerald-500/10"
                          title="অনুমোদন দিন"
                        >
                          <Check className="h-3 w-3 stroke-[2.5]" />
                          অনুমোদন করুন
                        </button>
                      )}

                      <button
                        onClick={() => {
                          if (confirm('আপনি কি নিশ্চিতভাবে এই রিভিউটি মুছে ফেলতে চান?')) {
                            onDeleteReview(r.productId, r.id);
                            alert('রিভিউটি সফলভাবে মুছে ফেলা হয়েছে!');
                          }
                        }}
                        className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 active:scale-95 transition-all"
                        title="রিভিউ ডিলিট করুন"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 py-6 text-center">এখনো কোনো রিভিউ গ্রাহক প্রদান করেনি।</p>
            )}
          </div>
        </div>
      )}

      {/* 3. HERO BANNER CONFIGURATION */}
      {tab === 'banners' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-sans text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="h-4.5 w-4.5 text-rose-500" />
              হিরো সেকশন ব্যানার কনফিগারেশন
            </h3>
            {!isBannerFormOpen && (
              <button
                onClick={() => setIsBannerFormOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold text-white shadow active:scale-95 transition-all ${getAccentBgClass()} ${getAccentHoverBgClass()}`}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>নতুন ব্যানার যুক্ত করুন</span>
              </button>
            )}
          </div>

          {isBannerFormOpen && (
            <form onSubmit={handleSaveBannerSubmit} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-5 backdrop-blur-md space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-white text-xs border-b border-slate-100 dark:border-slate-800 pb-2">ব্যানার ডিটেইলস ফরম</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold">ব্যানার টাইটেল *</label>
                  <input
                    type="text"
                    required
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
                    placeholder="যেমন: প্রিমিয়াম থিম ৫০% ছাড়ে!"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold">ব্যানার সাব-টাইটেল</label>
                  <input
                    type="text"
                    value={bannerSubtitle}
                    onChange={(e) => setBannerSubtitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
                    placeholder="যেমন: আজকের দিনের জন্য স্পেশাল অফার!"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-500 font-bold">ব্যানার ইমেজ URL (Unsplash বা অন্য ইমেজ সোর্স) *</label>
                  <input
                    type="text"
                    required
                    value={bannerImageUrl}
                    onChange={(e) => setBannerImageUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold">ব্যানার বাটন লিংক URL (CTA Link)</label>
                  <input
                    type="text"
                    value={bannerLinkUrl}
                    onChange={(e) => setBannerLinkUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
                    placeholder="যেমন: #products"
                  />
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <input
                    type="checkbox"
                    id="banAct"
                    checked={bannerActive}
                    onChange={(e) => setBannerActive(e.target.checked)}
                    className="h-4 w-4 rounded text-emerald-500"
                  />
                  <label htmlFor="banAct" className="font-bold text-slate-700 dark:text-slate-300">ব্যানারটি সক্রিয় করুন</label>
                </div>
              </div>
              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => { setIsBannerFormOpen(false); clearBannerForm(); }}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-500"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-4 py-2.5 rounded-lg text-white font-bold flex items-center gap-1.5 active:scale-95 transition-all ${
                    isSaving
                      ? 'opacity-70 cursor-not-allowed bg-slate-500'
                      : `${getAccentBgClass()} ${getAccentHoverBgClass()}`
                  }`}
                >
                  {isSaving ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    'সংরক্ষণ করুন'
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-6 backdrop-blur-md space-y-4 shadow-sm">
            {banners.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((b) => (
                  <div key={b.id} className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-950 relative p-4 flex flex-col justify-between gap-3 leading-relaxed">
                    <div className="flex items-start gap-3">
                      <img
                        src={b.imageUrl}
                        alt={b.title}
                        className="h-14 w-20 rounded object-cover bg-slate-100"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <strong className="font-bold text-slate-900 dark:text-white line-clamp-1">{b.title}</strong>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{b.subtitle}</p>
                        <p className="text-[9px] font-mono text-slate-500">CTA: {b.linkUrl}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 dark:border-slate-900">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold ${
                        b.active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {b.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleEditBanner(b)} className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-emerald-500">
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button onClick={() => { if(confirm('ডিলিট করতে চান?')) onDeleteBanner(b.id); }} className="p-1.5 rounded bg-rose-50/20 border border-rose-200 text-rose-500 hover:bg-rose-500 hover:text-white">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 py-6 text-center">কোনো প্রমোশনাল ব্যানার তৈরি করা হয়নি।</p>
            )}
          </div>
        </div>
      )}

      {/* 4. COUPON PROMO DISCOUNTS */}
      {tab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-sans text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <BadgePercent className="h-4.5 w-4.5 text-rose-500" />
              ডিসকাউন্ট প্রমোশনাল কুপন সিস্টেম
            </h3>
            {!isCouponFormOpen && (
              <button
                onClick={() => setIsCouponFormOpen(true)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold text-white shadow active:scale-95 transition-all ${getAccentBgClass()} ${getAccentHoverBgClass()}`}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>নতুন কুপন যুক্ত করুন</span>
              </button>
            )}
          </div>

          {isCouponFormOpen && (
            <form onSubmit={handleSaveCouponSubmit} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-5 backdrop-blur-md space-y-4">
              <h4 className="font-bold text-slate-800 dark:text-white text-xs border-b border-slate-100 dark:border-slate-800 pb-2">কুপন ফরম সেটিংস</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold">কুপন কোড (Coupon Code) *</label>
                  <input
                    type="text"
                    required
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none uppercase font-mono"
                    placeholder="যেমন: HATBAZAR20"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold">ডিসকাউন্ট শতকরা হার (%) *</label>
                  <input
                    type="number"
                    required
                    max="100"
                    value={couponDiscount}
                    onChange={(e) => setCouponDiscount(e.target.value)}
                    className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none font-mono"
                    placeholder="যেমন: ২০"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-slate-500 font-bold">মেয়াদ শেষ হবার তারিখ (Expiry Date) *</label>
                  <input
                    type="date"
                    required
                    value={couponExpiry}
                    onChange={(e) => setCouponExpiry(e.target.value)}
                    className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none font-mono"
                  />
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <input
                    type="checkbox"
                    id="coupAct"
                    checked={couponActive}
                    onChange={(e) => setCouponActive(e.target.checked)}
                    className="h-4 w-4 rounded text-emerald-500"
                  />
                  <label htmlFor="coupAct" className="font-bold text-slate-700 dark:text-slate-300">কুপনটি সক্রিয় রাখুন</label>
                </div>
              </div>
              <div className="flex justify-end gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => { setIsCouponFormOpen(false); clearCouponForm(); }}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-500"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-4 py-2.5 rounded-lg text-white font-bold flex items-center gap-1.5 active:scale-95 transition-all ${
                    isSaving
                      ? 'opacity-70 cursor-not-allowed bg-slate-500'
                      : `${getAccentBgClass()} ${getAccentHoverBgClass()}`
                  }`}
                >
                  {isSaving ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    'সংরক্ষণ করুন'
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-6 backdrop-blur-md overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400">
                  <th className="py-3 px-2 font-bold">কুপন কোড</th>
                  <th className="py-3 px-2 font-bold">ডিসকাউন্ট (%)</th>
                  <th className="py-3 px-2 font-bold">মেয়াদ শেষ তারিখ</th>
                  <th className="py-3 px-2 font-bold text-center">স্ট্যাটাস</th>
                  <th className="py-3 px-2 font-bold text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="py-3.5 px-2 font-mono font-extrabold text-slate-850 dark:text-slate-200 tracking-wider">
                      {c.code}
                    </td>
                    <td className="py-3.5 px-2 font-sans font-bold text-emerald-500">
                      {toBanglaNumber(c.discountPercent)}%
                    </td>
                    <td className="py-3.5 px-2 font-mono text-slate-400">
                      {c.expiryDate}
                    </td>
                    <td className="py-3.5 px-2 text-center">
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide ${
                        c.active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {c.active ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                      </span>
                    </td>
                    <td className="py-3.5 px-2">
                      <div className="flex items-center justify-center gap-1.5">
                        <button onClick={() => handleEditCoupon(c)} className="rounded p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-900">
                          <Edit className="h-4.5 w-4.5" />
                        </button>
                        <button onClick={() => { if(confirm('মুছে ফেলতে চান?')) onDeleteCoupon(c.id); }} className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/25">
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. BACKUP & DATA MANAGEMENT */}
      {tab === 'backup' && (
        <div className="space-y-5">
          <h3 className="font-sans text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <Database className="h-4.5 w-4.5 text-rose-500" />
            সিস্টেম হেলথ ও সম্পূর্ণ ডাটাবেজ ব্যাকআপ
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            
            {/* Health Card */}
            <div className="md:col-span-2 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-5 backdrop-blur-md space-y-4">
              <h4 className="font-bold text-slate-700 dark:text-slate-300">ডাটাবেজ কানেকশন স্ট্যাটাস</h4>
              <div className="space-y-3 font-mono leading-loose bg-slate-950 text-emerald-500 p-4 rounded-xl border border-emerald-500/10 shadow-inner">
                <p>&gt; firebase.app.initialized = true</p>
                <p>&gt; firestore.firestore_connected = SUCCESS</p>
                <p>&gt; products.catalog_size = {products.length} records</p>
                <p>&gt; orders.transaction_log = {orders.length} orders</p>
                <p>&gt; user_profile.subscribers = {users.length} members</p>
                <p>&gt; coupons.active_promo = {coupons.length} coupons</p>
                <p>&gt; banners.promo_rails = {banners.length} banners</p>
              </div>
            </div>

            {/* Quick backup button card */}
            <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-5 backdrop-blur-md flex flex-col justify-between shadow-sm">
              <div className="space-y-2 leading-relaxed text-slate-500">
                <h4 className="font-bold text-slate-700 dark:text-slate-300">ওয়ান-ক্লিক এক্সপোর্ট ব্যাকআপ</h4>
                <p className="text-[10px]">আপনার সম্পূর্ণ Hat Bazar ডাটাবেজ এক ক্লিকে ডাউনলোড করে কম্পিউটার ব্যাকআপ সংরক্ষণ করে রাখুন।</p>
              </div>
              <button
                onClick={handleExportBackup}
                className={`w-full py-3.5 mt-4 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 ${getAccentBgClass()} ${getAccentHoverBgClass()}`}
              >
                <Download className="h-4.5 w-4.5" />
                <span>ব্যাকআপ ডাউনলোড করুন (.json)</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 6. CATEGORY MANAGEMENT */}
      {tab === 'categories' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-sans text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="h-4.5 w-4.5 text-rose-500" />
              ক্যাটাগরি ম্যানেজমেন্ট (Category Management)
            </h3>
            <button
              onClick={() => {
                clearCategoryForm();
                setIsCategoryFormOpen(!isCategoryFormOpen);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold text-white shadow flex items-center gap-1.5 ${getAccentBgClass()} ${getAccentHoverBgClass()}`}
            >
              {isCategoryFormOpen ? <XCircle className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{isCategoryFormOpen ? 'ফর্ম বন্ধ করুন' : 'নতুন ক্যাটাগরি তৈরি করুন'}</span>
            </button>
          </div>

          {/* Form Dropdown Panel */}
          {isCategoryFormOpen && (
            <form onSubmit={handleSaveCategorySubmit} className="rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 animate-fade-in shadow-md">
              <h4 className="font-sans font-bold text-slate-850 dark:text-white text-xs border-b border-slate-100 dark:border-slate-800 pb-2.5">
                {categoryId ? 'ক্যাটাগরি তথ্য এডিট করুন' : 'নতুন ক্যাটাগরি তথ্য দিন'}
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[9px]">ক্যাটাগরি আইকন (Emoji/Unicode)</label>
                  <input
                    type="text"
                    value={categoryIcon}
                    onChange={(e) => setCategoryIcon(e.target.value)}
                    placeholder="যেমন: 💻, 🎨, 📚"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 outline-none font-bold text-center text-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[9px]">ইংরেজি নাম (URL Key - unique)</label>
                  <input
                    type="text"
                    value={categoryNameEn}
                    onChange={(e) => setCategoryNameEn(e.target.value)}
                    placeholder="যেমন: software, graphics"
                    disabled={!!categoryId}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[9px]">বাংলা নাম (Display Title)</label>
                  <input
                    type="text"
                    value={categoryNameBn}
                    onChange={(e) => setCategoryNameBn(e.target.value)}
                    placeholder="যেমন: সফটওয়্যার, গ্রাফিক্স ডিজাইন"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2.5 outline-none font-sans font-bold"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <span className="block text-slate-400 font-bold mb-1.5 uppercase tracking-wider text-[9px]">ক্যাটাগরি স্ট্যাটাস</span>
                  <label className="flex items-center gap-2 cursor-pointer py-2">
                    <input
                      type="checkbox"
                      checked={categoryActive}
                      onChange={(e) => setCategoryActive(e.target.checked)}
                      className="rounded border-slate-200 text-rose-500 focus:ring-rose-500 h-4 w-4"
                    />
                    <span className="font-bold text-slate-700 dark:text-slate-300">সক্রিয় রয়েছে</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsCategoryFormOpen(false); clearCategoryForm(); }}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 font-bold text-slate-500"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className={`px-5 py-2 rounded-xl text-white font-bold shadow flex items-center gap-1.5 active:scale-95 transition-all ${
                    isSaving
                      ? 'opacity-70 cursor-not-allowed bg-slate-500'
                      : `${getAccentBgClass()} ${getAccentHoverBgClass()}`
                  }`}
                >
                  {isSaving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4.5 w-4.5" />
                      <span>তথ্য সংরক্ষণ করুন</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Categories Table */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-5 backdrop-blur-md shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">বিদ্যমান ক্যাটাগরি তালিকা</span>
              <div className="relative max-w-xs w-full">
                <input
                  type="text"
                  placeholder="ক্যাটাগরি খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-1.5 pl-8 pr-3.5 outline-none text-[11px]"
                />
                <Search className="absolute left-2.5 top-2 h-4.5 w-4.5 text-slate-400" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[9px] font-bold">
                    <th className="pb-3 px-2">আইকন</th>
                    <th className="pb-3 px-2">ইংরেজি নাম</th>
                    <th className="pb-3 px-2">বাংলা নাম</th>
                    <th className="pb-3 px-2 text-center">স্ট্যাটাস</th>
                    <th className="pb-3 px-2 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {categories
                    .filter(c => c.name_bn.toLowerCase().includes(searchQuery.toLowerCase()) || c.name_en.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors">
                        <td className="py-3.5 px-2 text-lg">{c.icon || '📦'}</td>
                        <td className="py-3.5 px-2 font-mono font-bold text-slate-850 dark:text-slate-200">{c.name_en}</td>
                        <td className="py-3.5 px-2 font-sans font-bold text-slate-850 dark:text-slate-200">{c.name_bn}</td>
                        <td className="py-3.5 px-2 text-center">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide ${
                            c.active !== false ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-500'
                          }`}>
                            {c.active !== false ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                          </span>
                        </td>
                        <td className="py-3.5 px-2">
                          <div className="flex items-center justify-center gap-1.5">
                            <button onClick={() => handleEditCategory(c)} className="rounded p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-900">
                              <Edit className="h-4.5 w-4.5" />
                            </button>
                            <button 
                              onClick={() => { 
                                if(confirm('আপনি কি নিশ্চিতভাবে এই ক্যাটাগরি মুছে ফেলতে চান?')) {
                                  if (onDeleteCategory) onDeleteCategory(c.id);
                                }
                              }} 
                              className="rounded p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/25"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 7. SALES REPORTS & ANALYTICS */}
      {tab === 'reports' && (() => {
        const approvedOrders = orders.filter((o) => o.status === 'approved' || o.status === 'completed');
        const pendingOrders = orders.filter((o) => o.status === 'pending');
        const totalRevenue = approvedOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);
        const pendingRevenue = pendingOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);

        // Calculate sales per payment method dynamically
        const paymentStats: Record<string, number> = {};
        approvedOrders.forEach(o => {
          const method = o.paymentMethod || 'bKash';
          paymentStats[method] = (paymentStats[method] || 0) + o.totalAmount;
        });

        // Calculate category revenue dynamically
        const categoryStats: Record<string, number> = {};
        const categoryCount: Record<string, number> = {};
        approvedOrders.forEach(o => {
          // Find the product of the order to fetch category
          const prod = products.find(p => p.name === o.productName);
          const categoryKey = prod ? prod.category : 'অন্যান্য';
          categoryStats[categoryKey] = (categoryStats[categoryKey] || 0) + o.totalAmount;
          categoryCount[categoryKey] = (categoryCount[categoryKey] || 0) + 1;
        });

        const handleExportSalesReportCSV = () => {
          let csvContent = "data:text/csv;charset=utf-8,";
          csvContent += "Order ID,Customer Name,Phone,Product,Amount,Payment Method,Transaction ID,Date\n";
          approvedOrders.forEach(o => {
            csvContent += `"${o.id}","${o.userName}","${o.userPhone}","${o.productName}",${o.totalAmount},"${o.paymentMethod || 'bKash'}","${o.transactionId || ''}","${o.createdAt}"\n`;
          });
          const encodedUri = encodeURI(csvContent);
          const link = document.createElement("a");
          link.setAttribute("href", encodedUri);
          link.setAttribute("download", `Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        };

        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h3 className="font-sans text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="h-4.5 w-4.5 text-rose-500" />
                সেলস রিপোর্ট ও অটোমেটেড অ্যানালিটিক্স
              </h3>
              <button
                onClick={handleExportSalesReportCSV}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 transition-all`}
              >
                <Download className="h-4 w-4" />
                <span>সেলস রিপোর্ট এক্সপোর্ট করুন (.csv)</span>
              </button>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-4.5 backdrop-blur-md shadow-sm">
                <span className="text-[9px] text-slate-450 font-bold block uppercase">অনুমোদিত মোট বেচাকেনা</span>
                <span className="font-sans text-base md:text-xl font-black text-emerald-500 mt-1 block">
                  {formatPrice(totalRevenue)}
                </span>
                <span className="text-[8px] text-slate-400 mt-0.5 block font-bold">সফল ট্রানজেকশন</span>
              </div>
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-4.5 backdrop-blur-md shadow-sm">
                <span className="text-[9px] text-slate-450 font-bold block uppercase">অপেক্ষমান পেমেন্ট মূল্য</span>
                <span className="font-sans text-base md:text-xl font-black text-amber-500 mt-1 block">
                  {formatPrice(pendingRevenue)}
                </span>
                <span className="text-[8px] text-slate-400 mt-0.5 block font-bold">মোট {toBanglaNumber(pendingOrders.length)} টি অর্ডার রিভিউতে</span>
              </div>
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-4.5 backdrop-blur-md shadow-sm">
                <span className="text-[9px] text-slate-450 font-bold block uppercase">মোট অনুমোদিত অর্ডার</span>
                <span className="font-sans text-base md:text-xl font-black text-slate-900 dark:text-white mt-1 block">
                  {toBanglaNumber(approvedOrders.length)} টি
                </span>
                <span className="text-[8px] text-slate-400 mt-0.5 block font-bold">ডেলিভারি সম্পন্ন</span>
              </div>
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-4.5 backdrop-blur-md shadow-sm">
                <span className="text-[9px] text-slate-450 font-bold block uppercase">গড় অর্ডার মূল্য</span>
                <span className="font-sans text-base md:text-xl font-black text-slate-900 dark:text-white mt-1 block">
                  {formatPrice(approvedOrders.length > 0 ? Math.round(totalRevenue / approvedOrders.length) : 0)}
                </span>
                <span className="text-[8px] text-slate-400 mt-0.5 block font-bold">প্রতি গ্রাহক গড়</span>
              </div>
            </div>

            {/* Advanced charts table breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category Performance */}
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-5 backdrop-blur-md shadow-sm space-y-4">
                <h4 className="font-bold text-slate-750 dark:text-white text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <PieChart className="h-4 w-4 text-indigo-500" />
                  ক্যাটাগরি ভিত্তিক মোট সেলস
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {Object.entries(categoryStats).length > 0 ? (
                    Object.entries(categoryStats).map(([cat, amount]) => (
                      <div key={cat} className="py-2.5 flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 block uppercase font-mono text-[10px]">{cat}</span>
                          <span className="text-[9px] text-slate-400 font-bold">মোট অর্ডার: {toBanglaNumber(categoryCount[cat] || 0)} টি</span>
                        </div>
                        <span className="font-sans font-bold text-slate-900 dark:text-white">{formatPrice(amount)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="py-5 text-center text-slate-400">কোনো অনুমোদিত ট্রানজেকশন হিস্ট্রি পাওয়া যায়নি</div>
                  )}
                </div>
              </div>

              {/* Payment Methods Breakdown */}
              <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-5 backdrop-blur-md shadow-sm space-y-4">
                <h4 className="font-bold text-slate-755 dark:text-white text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  পেমেন্ট গেটওয়ে চ্যানেল সেলস
                </h4>
                <div className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {['bKash', 'Nagad', 'Rocket'].map((method) => {
                    const amount = paymentStats[method] || 0;
                    const percent = totalRevenue > 0 ? Math.round((amount / totalRevenue) * 100) : 0;
                    return (
                      <div key={method} className="py-3 flex flex-col gap-1.5">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-slate-800 dark:text-slate-200">{method}</span>
                          <span className="text-slate-900 dark:text-white">{formatPrice(amount)} ({toBanglaNumber(percent)}%)</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full bg-slate-150 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 8. ADMINISTRATIVE ACTIVITY LOGS */}
      {tab === 'logs' && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h3 className="font-sans text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="h-4.5 w-4.5 text-rose-500" />
              অ্যাডমিন অ্যাক্টিভিটি অডিট লগ (Activity Logs)
            </h3>
            <div className="relative max-w-xs w-full">
              <input
                type="text"
                placeholder="অ্যাকশন লগ সার্চ করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 py-1.5 pl-8 pr-3.5 outline-none text-[11px]"
              />
              <Search className="absolute left-2.5 top-2 h-4.5 w-4.5 text-slate-400" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-5 backdrop-blur-md shadow-sm">
            <div className="overflow-x-auto text-[10px] md:text-xs">
              <table className="w-full text-left font-sans">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase tracking-wider text-[9px] font-black pb-3">
                    <th className="pb-2.5 px-2">তারিখ ও সময়</th>
                    <th className="pb-2.5 px-2">অ্যাডমিন</th>
                    <th className="pb-2.5 px-2">অ্যাকশন ক্যাটাগরি</th>
                    <th className="pb-2.5 px-2">বিস্তারিত বিবরণ</th>
                  </tr>
                </thead>
                <tbody className="font-mono divide-y divide-slate-100 dark:divide-slate-800/40">
                  {activityLogs
                    .filter(l => l.action.toLowerCase().includes(searchQuery.toLowerCase()) || l.details.toLowerCase().includes(searchQuery.toLowerCase()) || l.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors py-3">
                        <td className="py-3 px-2 text-slate-400 whitespace-nowrap">
                          {new Date(l.timestamp).toLocaleString('bn-BD', { hour12: true })}
                        </td>
                        <td className="py-3 px-2 text-rose-500 font-bold whitespace-nowrap">{l.adminEmail}</td>
                        <td className="py-3 px-2 whitespace-nowrap">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold">
                            {l.action}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-slate-800 dark:text-slate-200 leading-relaxed font-sans">{l.details}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {activityLogs.length === 0 && (
                <div className="py-8 text-center text-slate-400">কোনো অ্যাক্টিভিটি লগ ডাটা পাওয়া যায়নি</div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
