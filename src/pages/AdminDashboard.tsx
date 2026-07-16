import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useAdminSettings } from '../context/AdminSettingsContext';
import { Product, Order, UserProfile, Review, Coupon, Banner, Category, ActivityLog } from '../types';
import { AdminStats } from '../components/AdminStats';
import { AdminProducts } from '../components/AdminProducts';
import { AdminOrders } from '../components/AdminOrders';
import { AdminSettings } from '../components/AdminSettings';
import { AdminExtras } from '../components/AdminExtras';
import { Loading } from '../components/Loading';

// Firestore direct helper imports
import {
  getAllUsersFromFirestore,
  updateUserStatusInFirestore,
  getAllReviewsFromFirestore,
  deleteReviewFromFirestore,
  approveReviewInFirestore,
  getCouponsFromFirestore,
  saveCouponToFirestore,
  deleteCouponFromFirestore,
  getBannersFromFirestore,
  saveBannerToFirestore,
  deleteBannerFromFirestore,
  getCategoriesFromFirestore,
  saveCategoryToFirestore,
  deleteCategoryFromFirestore,
  getActivityLogsFromFirestore,
  addActivityLogToFirestore,
} from '../lib/firestoreService';

import {
  Users, ShoppingBag, ShieldCheck, Clock, Trash2, Plus, Settings, Eye, HelpCircle,
  Save, RotateCcw, Palette, Edit, Check, AlertCircle, FileText, ArrowLeftRight,
  MessageSquare, Wallet, Phone, Mail, Link, Search, FileDown, EyeOff, LayoutTemplate,
  Star, RefreshCw, Layers, ShieldAlert, BadgePercent, Database, ChevronRight, Menu, X,
  LogOut, Globe, Terminal
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: 'pending' | 'approved' | 'rejected' | 'completed', customUrl?: string) => void;
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onNavigate,
}) => {
  const { user, logout } = useAuth();
  const { getAccentBgClass, getAccentHoverBgClass, getAccentTextClass } = useTheme();
  const { settings } = useAdminSettings();

  // Active Menu Router
  const [activeTab, setActiveTab] = useState<'stats' | 'products' | 'orders' | 'customers' | 'reviews' | 'banners' | 'settings' | 'coupons' | 'backup' | 'categories' | 'reports' | 'logs'>('stats');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Firestore DB States
  const [usersList, setUsersList] = useState<UserProfile[]>([]);
  const [reviewsList, setReviewsList] = useState<(Review & { productId: string; productName: string })[]>([]);
  const [couponsList, setCouponsList] = useState<Coupon[]>([]);
  const [bannersList, setBannersList] = useState<Banner[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [activityLogsList, setActivityLogsList] = useState<ActivityLog[]>([]);
  const [loadingDb, setLoadingDb] = useState(true);

  // Load Extra Firestore Collections
  const loadAllDbData = async () => {
    setLoadingDb(true);
    try {
      const [u, r, c, b, cats, logs] = await Promise.all([
        getAllUsersFromFirestore(),
        getAllReviewsFromFirestore(products),
        getCouponsFromFirestore(),
        getBannersFromFirestore(),
        getCategoriesFromFirestore(),
        getActivityLogsFromFirestore(),
      ]);
      setUsersList(u);
      setReviewsList(r);
      setCouponsList(c);
      setBannersList(b);
      setCategoriesList(cats);
      setActivityLogsList(logs);
    } catch (err) {
      console.error('Error loading Firestore collections in Admin Dashboard:', err);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    loadAllDbData();
  }, [products]);

  // Authorization Shield
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center animate-fade-in text-xs">
        <div className="max-w-md w-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-xl space-y-5">
          <ShieldAlert className="h-16 w-16 text-rose-500 mx-auto animate-bounce" />
          <h2 className="font-sans text-xl font-black text-slate-900 dark:text-white">অননুমোদিত প্রবেশাধিকার!</h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            দুঃখিত, এই ড্যাশবোর্ডটি শুধুমাত্র Hat Bazar-এর অনুমোদিত অ্যাডমিনদের ব্যবহারের জন্য সংরক্ষিত। আপনার সাধারণ গ্রাহক অ্যাকাউন্ট থেকে এটি এক্সেসযোগ্য নয়।
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => onNavigate('home')}
              className={`w-full py-3 rounded-xl font-bold text-white shadow-md active:scale-95 transition-all ${getAccentBgClass()} ${getAccentHoverBgClass()}`}
            >
              হোমপেজে ফিরে যান
            </button>
            <button
              onClick={logout}
              className="w-full py-3 rounded-xl font-bold text-rose-500 border border-rose-200 dark:border-rose-900 hover:bg-rose-50 dark:hover:bg-rose-950/20 active:scale-95 transition-all"
            >
              লগ আউট করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Sidebar Menu Items Definition (10 requested categories styled elegantly)
  const menuItems = [
    { id: 'stats', label: 'ড্যাশবোর্ড', icon: LayoutTemplate },
    { id: 'products', label: 'প্রোডাক্ট ম্যানেজমেন্ট', icon: ShoppingBag },
    { id: 'categories', label: 'ক্যাটাগরি ম্যানেজমেন্ট', icon: Layers },
    { id: 'orders', label: 'অর্ডার অনুমোদন', icon: Clock },
    { id: 'customers', label: 'কাস্টমার ডাটাবেজ', icon: Users },
    { id: 'reviews', label: 'রিভিউ মডারেশন', icon: MessageSquare },
    { id: 'banners', label: 'ব্যানার সেটিংস', icon: LayoutTemplate },
    { id: 'settings', label: 'ওয়েবসাইট সেটিংস', icon: Settings },
    { id: 'coupons', label: 'কুপন ডিসকাউন্ট', icon: BadgePercent },
    { id: 'reports', label: 'সেলস রিপোর্ট ও অ্যানালিটিক্স', icon: FileText },
    { id: 'logs', label: 'অ্যাক্টিভিটি লগ', icon: Terminal },
    { id: 'backup', label: 'ব্যাকআপ ও সিস্টেম', icon: Database },
  ] as const;

  // Real-time Automated Activity Log helper
  const logAdminAction = async (action: string, details: string) => {
    try {
      const newLog: ActivityLog = {
        id: 'log-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now(),
        adminEmail: user?.email || 'rashedislamvk11@gmail.com',
        action,
        details,
        timestamp: new Date().toISOString()
      };
      await addActivityLogToFirestore(newLog);
      setActivityLogsList((prev) => [newLog, ...prev]);
    } catch (err) {
      console.error("Error logging admin action:", err);
    }
  };

  // Sync state mutation handlers (propagated to modular ekstra components)
  const handleUpdateUser = async (uid: string, blocked: boolean, role?: 'admin' | 'user') => {
    try {
      await updateUserStatusInFirestore(uid, blocked, role);
      setUsersList((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, blocked, ...(role && { role }) } : u))
      );
      logAdminAction(
        'কাস্টমার আপডেট',
        `ক্রেতা আইডি ${uid}-কে ${blocked ? 'ব্লক' : 'আনব্লক'} করা হয়েছে${role ? `, রোল পরিবর্তন: ${role}` : ''}`
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteReview = async (pId: string, rId: string) => {
    try {
      await deleteReviewFromFirestore(pId, rId);
      setReviewsList((prev) => prev.filter((r) => r.id !== rId));
      logAdminAction('রিভিউ ডিলিট', `প্রোডাক্ট আইডি ${pId} এর রিভিউ (${rId}) ডিলেট করা হয়েছে`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveReview = async (pId: string, rId: string) => {
    try {
      await approveReviewInFirestore(pId, rId);
      setReviewsList((prev) =>
        prev.map((r) => (r.id === rId ? { ...r, approved: true } : r))
      );
      logAdminAction('রিভিউ অনুমোদন', `রিভিউ আইডি ${rId} অনুমোদন করা হয়েছে`);
    } catch (e) {
      console.error('Failed to approve review:', e);
    }
  };

  const handleSaveCoupon = async (c: Coupon) => {
    try {
      await saveCouponToFirestore(c);
      setCouponsList((prev) => {
        const idx = prev.findIndex((item) => item.id === c.id);
        if (idx >= 0) {
          const list = [...prev];
          list[idx] = c;
          return list;
        }
        return [...prev, c];
      });
      logAdminAction('কুপন সংরক্ষণ', `কুপন কোড: ${c.code}, ডিসকাউন্ট: ${c.discountValue}${c.discountType === 'percent' ? '%' : ' BDT'}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCoupon = async (cId: string) => {
    try {
      await deleteCouponFromFirestore(cId);
      setCouponsList((prev) => prev.filter((c) => c.id !== cId));
      logAdminAction('কুপন ডিলিট', `কুপন আইডি ${cId} মুছে ফেলা হয়েছে`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveBanner = async (b: Banner) => {
    try {
      await saveBannerToFirestore(b);
      setBannersList((prev) => {
        const idx = prev.findIndex((item) => item.id === b.id);
        if (idx >= 0) {
          const list = [...prev];
          list[idx] = b;
          return list;
        }
        return [...prev, b];
      });
      logAdminAction('ব্যানার সংরক্ষণ', `ব্যানার টাইটেল: ${b.title}`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteBanner = async (bId: string) => {
    try {
      await deleteBannerFromFirestore(bId);
      setBannersList((prev) => prev.filter((b) => b.id !== bId));
      logAdminAction('ব্যানার ডিলিট', `ব্যানার আইডি ${bId} মুছে ফেলা হয়েছে`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveCategory = async (cat: Category) => {
    try {
      await saveCategoryToFirestore(cat);
      setCategoriesList((prev) => {
        const idx = prev.findIndex((item) => item.id === cat.id);
        if (idx >= 0) {
          const list = [...prev];
          list[idx] = cat;
          return list;
        }
        return [...prev, cat];
      });
      logAdminAction('ক্যাটাগরি সংরক্ষণ', `ক্যাটাগরি: ${cat.name_bn} (${cat.name_en})`);
    } catch (e) {
      console.error("Error saving category in AdminDashboard:", e);
    }
  };

  const handleDeleteCategory = async (catId: string) => {
    try {
      await deleteCategoryFromFirestore(catId);
      setCategoriesList((prev) => prev.filter((c) => c.id !== catId));
      logAdminAction('ক্যাটাগরি ডিলিট', `ক্যাটাগরি আইডি ${catId} মুছে ফেলা হয়েছে`);
    } catch (e) {
      console.error("Error deleting category in AdminDashboard:", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row text-xs">
      
      {/* MOBILE HEADER RESPONSIVE TOGGLE */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 border-b border-slate-150 dark:border-slate-850 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-rose-500" />
          <span className="font-sans font-black text-rose-500 text-sm">HAT BAZAR ADMIN</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
        >
          {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* LEFT SIDEBAR NAVIGATION (With Glassmorphism Styling) */}
      <aside className={`fixed md:sticky top-[61px] md:top-0 left-0 h-[calc(100vh-61px)] md:h-screen w-64 border-r border-slate-150 dark:border-slate-850 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md p-5 flex flex-col justify-between z-30 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="space-y-6">
          
          {/* Brand identity logo */}
          <div className="hidden md:flex items-center gap-2.5 border-b border-slate-150 dark:border-slate-850/60 pb-4">
            <div className="p-2 bg-rose-500/10 rounded-xl">
              <ShieldCheck className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <h2 className="font-sans font-black text-rose-500 text-sm leading-none">HAT BAZAR</h2>
              <span className="text-[10px] text-slate-400 font-bold block mt-1 uppercase tracking-wider">অ্যাডমিন কন্ট্রোল</span>
            </div>
          </div>

          {/* Admin Profiler card */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-150 dark:border-slate-850 flex items-center gap-3">
            <img
              src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.email}`}
              alt="Admin"
              className="h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-slate-800 bg-white"
              referrerPolicy="no-referrer"
            />
            <div className="truncate">
              <p className="font-bold text-slate-800 dark:text-slate-100 truncate">{user.displayName}</p>
              <span className="inline-flex items-center gap-1 text-[8px] bg-rose-500/10 text-rose-500 rounded px-1.5 py-0.5 font-bold uppercase tracking-wider mt-0.5">
                <ShieldCheck className="h-2.5 w-2.5" />
                সুপার অ্যাডমিন
              </span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold transition-all text-[11px] ${
                    activeTab === item.id
                      ? `${getAccentBgClass()} text-white shadow-sm scale-[1.02]`
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className={`h-3 w-3 opacity-60 transition-transform ${activeTab === item.id ? 'translate-x-0.5' : ''}`} />
                </button>
              );
            })}
          </nav>

        </div>

        {/* Footer actions inside Sidebar */}
        <div className="space-y-2 border-t border-slate-150 dark:border-slate-850/60 pt-4">
          <button
            onClick={() => onNavigate('home')}
            className="w-full py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-900 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Globe className="h-4 w-4" />
            <span>বাজার ফ্রন্টএন্ড দেখুন</span>
          </button>
          
          <button
            onClick={logout}
            className="w-full py-2 rounded-xl text-rose-500 font-bold hover:bg-rose-50 dark:hover:bg-rose-950/15 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>লগ আউট করুন</span>
          </button>
        </div>

      </aside>

      {/* MAIN RIGHT PANEL INTERACTIVE AREA */}
      <main className="flex-1 p-5 md:p-8 space-y-6 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* Title Header banner */}
        <div className="border-b border-slate-150 dark:border-slate-800 pb-5 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h1 className="font-sans text-xl md:text-2xl font-black text-rose-500 flex items-center gap-2">
              Hat Bazar অ্যাডমিন কন্ট্রোল প্যানেল
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
              {menuItems.find((m) => m.id === activeTab)?.label} সেকশন নিয়ন্ত্রণ
            </p>
          </div>
          
          {loadingDb && (
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
              <RefreshCw className="h-3 w-3 animate-spin text-rose-500" />
              ডাটাবেজ রিফ্রেশ হচ্ছে...
            </div>
          )}
        </div>

        {/* RENDER DYNAMIC COMPONENT PANEL WITH FIRESTORE SYNC AND ROBUST IMPLEMENTATION */}
        {loadingDb ? (
          <div className="h-96 flex items-center justify-center">
            <Loading message="হাতিয়ার ডাটাবেজ লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন..." />
          </div>
        ) : (
          <>
            {activeTab === 'stats' && (
              <AdminStats
                products={products}
                orders={orders}
                users={usersList}
                reviews={reviewsList}
                onViewOrder={(ord) => {
                  setActiveTab('orders');
                }}
              />
            )}

            {activeTab === 'products' && (
              <AdminProducts
                products={products}
                categories={categoriesList}
                onAddProduct={async (prod) => {
                  await onAddProduct(prod);
                  logAdminAction('নতুন প্রোডাক্ট', `প্রোডাক্ট যোগ করা হয়েছে: ${prod.name}`);
                }}
                onUpdateProduct={async (prod) => {
                  await onUpdateProduct(prod);
                  logAdminAction('প্রোডাক্ট আপডেট', `প্রোডাক্ট তথ্য পরিবর্তন: ${prod.name}`);
                }}
                onDeleteProduct={async (id) => {
                  await onDeleteProduct(id);
                  logAdminAction('প্রোডাক্ট ডিলিট', `প্রোডাক্ট ডিলিট করা হয়েছে: আইডি ${id}`);
                }}
              />
            )}

            {activeTab === 'orders' && (
              <AdminOrders
                orders={orders}
                onUpdateOrderStatus={async (orderId, status, url) => {
                  await onUpdateOrderStatus(orderId, status, url);
                  logAdminAction('অর্ডার আপডেট', `অর্ডার ${orderId} এর স্ট্যাটাস পরিবর্তন: ${status}${url ? ` (ডাউনলোড লিংক আপডেট করা হয়েছে)` : ''}`);
                }}
              />
            )}

            {activeTab === 'settings' && (
              <AdminSettings />
            )}

            {(activeTab === 'customers' || activeTab === 'reviews' || activeTab === 'banners' || activeTab === 'coupons' || activeTab === 'backup' || activeTab === 'categories' || activeTab === 'reports' || activeTab === 'logs') && (
              <AdminExtras
                tab={activeTab}
                users={usersList}
                reviews={reviewsList}
                coupons={couponsList}
                banners={bannersList}
                categories={categoriesList}
                activityLogs={activityLogsList}
                products={products}
                orders={orders}
                onUpdateUser={handleUpdateUser}
                onDeleteReview={handleDeleteReview}
                onApproveReview={handleApproveReview}
                onSaveCoupon={handleSaveCoupon}
                onDeleteCoupon={handleDeleteCoupon}
                onSaveBanner={handleSaveBanner}
                onDeleteBanner={handleDeleteBanner}
                onSaveCategory={handleSaveCategory}
                onDeleteCategory={handleDeleteCategory}
                onReloadExtras={loadAllDbData}
              />
            )}
          </>
        )}

      </main>

    </div>
  );
};
