import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { INITIAL_CATEGORIES } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import { useAdminSettings } from '../context/AdminSettingsContext';
import { ProductCard } from '../components/ProductCard';
import { formatPrice, toBanglaNumber, getCategoryBanglaName } from '../utils/helpers';
import { 
  ShieldCheck, 
  Zap, 
  Download, 
  Headphones, 
  ArrowRight, 
  Sparkles, 
  Star, 
  PlayCircle, 
  Terminal, 
  BookOpen, 
  Layout, 
  Cpu, 
  Lock, 
  ChevronDown, 
  ChevronUp, 
  Mail, 
  TrendingUp, 
  Plus, 
  Gift, 
  Users 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HomeProps {
  products: Product[];
  onNavigate: (view: string, filterCategory?: string) => void;
  onViewProduct: (productId: string) => void;
}

export const Home: React.FC<HomeProps> = ({ products, onNavigate, onViewProduct }) => {
  const { 
    getAccentBgClass, 
    getAccentTextClass, 
    getAccentHoverBgClass, 
    getAccentGradientClass,
    getAccentBorderClass
  } = useTheme();

  const { settings, updateSettings } = useAdminSettings();

  // Newsletter subscription state
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Flash Sale Countdown Logic
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    if (!settings.enableFlashSale || !settings.flashSaleEndTime) {
      setTimeLeft(null);
      return;
    }

    const calculateTime = () => {
      const difference = +new Date(settings.flashSaleEndTime) - +new Date();
      if (difference <= 0) {
        setTimeLeft(null);
        return false;
      } else {
        setTimeLeft({
          d: Math.floor(difference / (1000 * 60 * 60 * 24)),
          h: Math.floor((difference / (1000 * 60 * 60)) % 24),
          m: Math.floor((difference / 1000 / 60) % 60),
          s: Math.floor((difference / 1000) % 60)
        });
        return true;
      }
    };

    const active = calculateTime();
    if (!active) return;

    const timer = setInterval(() => {
      const ok = calculateTime();
      if (!ok) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.enableFlashSale, settings.flashSaleEndTime]);

  // FAQ interactive state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Dynamic category product counter
  const getProductCount = (categoryId: string) => {
    return products.filter(p => p.category === categoryId).length;
  };

  // 1. Featured Products (High rating)
  const featuredProducts = [...products]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  // 2. Popular Products (High sales)
  const popularProducts = [...products]
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 3);

  // 3. New Arrivals (Latest items)
  const newArrivals = [...products]
    .slice()
    .reverse()
    .slice(0, 3);

  // Trust/Why Choose Us features
  const features = [
    {
      icon: Zap,
      title: 'ইনস্ট্যান্ট ডেলিভারি',
      desc: 'পেমেন্ট অনুমোদিত হওয়ার সাথে সাথে আপনার ড্যাশবোর্ডে ফাইল ডাউনলোডের লিংক পেয়ে যাবেন।'
    },
    {
      icon: ShieldCheck,
      title: '১০০% অরিজিনাল ফাইল',
      desc: 'আমাদের সমস্ত থিম, প্লাগইন ও ডিজিটাল প্রোডাক্টসমূহ ম্যালওয়্যার মুক্ত ও সরাসরি ডেভেলপার থেকে সংগৃহীত।'
    },
    {
      icon: Lock,
      title: 'নিরাপদ পেমেন্ট গেটওয়ে',
      desc: 'বিকাশ, রকেট ও নগদের মাধ্যমে সম্পূর্ণ স্বয়ংক্রিয় ও নিরাপদ পদ্ধতিতে পেমেন্ট করার সুবিধা।'
    },
    {
      icon: Headphones,
      title: '২৪/৭ বিশ্বস্ত কাস্টমার সাপোর্ট',
      desc: 'যেকোনো কারিগরি সাহায্য বা প্রোডাক্ট ইন্সটলেশনের জন্য আমাদের ডেডিকেটেড টিম রয়েছে আপনার পাশে।'
    }
  ];

  // Customer Reviews
  const reviews = [
    {
      name: 'হাসান আল বান্না',
      role: 'ওয়েব ডিজাইনার ও ডেভেলপার',
      avatarText: 'হা',
      comment: 'হাট বাজার থেকে নেওয়া থিম ও অটোমেটেড পেমেন্ট প্লাগইনটি আমার বিজনেসকে অনেক সহজ করে দিয়েছে। সবচেয়ে বড় বিষয় হলো কাস্টমার সার্ভিস ও দ্রুত রেসপন্স। পেমেন্ট সম্পন্ন করার কয়েক সেকেন্ডের মধ্যেই প্রোডাক্ট ড্যাশবোর্ডে চলে এসেছে!',
      rating: 5,
      date: '২ দিন আগে'
    },
    {
      name: 'ফারহানা ইয়াসমিন',
      role: 'ইউটিউবার ও উদ্যোক্তা',
      avatarText: 'ফা',
      comment: 'এখানকার রিঅ্যাক্ট ও টাইপস্ক্রিপ্ট মাস্টারক্লাস কোর্সটি করে আমি প্রথম কোনো প্রিমিয়াম কোয়ালিটি বাংলা টিউটোরিয়াল পেলাম। প্রফেশনাল গাইডবুকও চমৎকার। ডিজিটাল জিনিসপত্র কেনার জন্য বাংলাদেশের সেরা প্ল্যাটফর্ম!',
      rating: 5,
      date: '১ সপ্তাহ আগে'
    },
    {
      name: 'মাহমুদুল হাসান',
      role: 'ফুল-স্ট্যাক ফ্রিল্যান্সার',
      avatarText: 'মা',
      comment: 'হাট থিম ব্যবহার করে আমি ৫টি ক্লায়েন্টের ই-কমার্স সাইট বানিয়েছি। প্রতিবারই স্পিড স্কোর দারুণ এসেছে। এআই রাইটার স্ক্রিপ্টও অসাধারণ কন্টেন্ট লেখে। আমি হাট বাজারের নিয়মিত ক্রেতা ও ভক্ত!',
      rating: 5,
      date: '৩ সপ্তাহ আগে'
    }
  ];

  // FAQ Questions
  const faqs = [
    {
      q: 'কিভাবে প্রোডাক্ট কিনবো এবং ইনস্ট্যান্ট ডাউনলোড করবো?',
      a: 'আপনার পছন্দের পণ্যটি কার্ট-এ যুক্ত করে "চেকআউট" অপশনে যান। এরপর বিকাশ, নগদ বা রকেটের মাধ্যমে পেমেন্ট করে ট্রানজেকশন আইডি ইনপুট করুন। পেমেন্ট সাবমিট করার সাথে সাথেই এডমিন প্যানেল থেকে সেটি রিভিউ হবে এবং এপ্রুভ হওয়ার সাথে সাথে "আমার ড্যাশবোর্ড"-এ ডাউনলোড লিংক একটিভ হয়ে যাবে।'
    },
    {
      q: 'পেমেন্ট ভেরিফিকেশন হতে সর্বোচ্চ কত সময় লাগতে পারে?',
      a: 'সাধারণত আমাদের পেমেন্ট ভেরিফিকেশন সিস্টেম সম্পূর্ণ অটোমেটেড বা সেমি-অটোমেটেড হওয়ায় পেমেন্ট সম্পন্ন করার ৫ থেকে ১৫ মিনিটের মধ্যেই অর্ডার এপ্রুভ হয়ে যায়। কোনো বিশেষ কারণে দেরি হলে আমাদের হেল্পলাইন বা লাইভ সাপোর্টে নক করতে পারেন।'
    },
    {
      q: 'ডিজিটাল প্রোডাক্টগুলোর আপডেট কি পরবর্তীতে ফ্রীতে পাওয়া যাবে?',
      a: 'হ্যাঁ, হাট বাজার থেকে কেনা প্রতিটি প্রিমিয়াম থিম, প্লাগইন, টেমপ্লেট ও এআই সফটওয়্যারের লাইফটাইম ফ্রি আপডেট পাবেন। নতুন কোনো ভার্সন রিলিজ হলেই সেটি আপনার ড্যাশবোর্ডের ডাউনলোড লিংকে অটোমেটিক যুক্ত হয়ে যাবে।'
    },
    {
      q: 'যদি কোনো প্রোডাক্ট কাজ না করে তবে কি রিফান্ড পাবো?',
      a: 'আমাদের প্রতিটি প্রোডাক্ট সম্পূর্ণ ভেরিফাইড এবং কার্যকারিতা প্রমাণিত। তবুও যদি আপনার সিস্টেমে কোনো টেকনিক্যাল ত্রুটি বা ফাইল ও কাজ না করার ঘটনা ঘটে এবং আমাদের সাপোর্ট টিম সেটি ২৪ ঘণ্টার মধ্যে সমাধান করতে না পারে, তবে আমাদের ৭ দিনের রিফান্ড পলিসি অনুযায়ী আপনার পেমেন্ট রিফান্ড করে দেওয়া হবে।'
    }
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      const trimmedEmail = email.trim().toLowerCase();
      const currentList = settings.newsletterEmails || [];
      if (!currentList.includes(trimmedEmail)) {
        const updatedList = [...currentList, trimmedEmail];
        try {
          await updateSettings({
            ...settings,
            newsletterEmails: updatedList
          });
        } catch (err) {
          console.error("Error saving newsletter email:", err);
        }
      }
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
    }
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'PlayCircle': return <PlayCircle className="h-6 w-6" />;
      case 'Terminal': return <Terminal className="h-6 w-6" />;
      case 'BookOpen': return <BookOpen className="h-6 w-6" />;
      case 'Layout': return <Layout className="h-6 w-6" />;
      case 'Cpu': return <Cpu className="h-6 w-6" />;
      case 'Sparkles': return <Sparkles className="h-6 w-6" />;
      default: return <Cpu className="h-6 w-6" />;
    }
  };

  return (
    <div className="space-y-12 pb-16 font-sans">
      
      {/* FLASH SALE COUNTDOWN BANNER */}
      {settings.enableFlashSale && timeLeft && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 dark:from-amber-500/5 dark:via-rose-500/5 dark:to-amber-500/5 p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-md backdrop-blur-md"
        >
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 dark:bg-amber-500/10">
              <Zap className="h-5 w-5 animate-bounce" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex flex-wrap items-center gap-1.5 justify-center md:justify-start">
                <span className="inline-block px-2 py-0.5 rounded bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">ফ্ল্যাশ সেল</span>
                <span>{settings.flashSaleText || `ধামাকা ফ্ল্যাশ সেল! প্রতিটি প্রিমিয়াম ডিজিটাল পণ্যে স্পেশাল ${toBanglaNumber(settings.flashSaleDiscountPercent || 15)}% অফার!`}</span>
              </h4>
              <p className="text-[10px] text-slate-400">অফারটি শেষ হওয়ার পূর্বেই এখনই আপনার পছন্দের ফাইলটি ফ্রী লাইফটাইম আপডেট সহ সংগ্রহ করুন!</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Countdown timer UI */}
            <div className="flex gap-2 text-center text-xs font-mono">
              <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-lg p-2 min-w-[45px]">
                <span className="block font-black text-slate-900 dark:text-white text-sm">{toBanglaNumber(timeLeft.d)}</span>
                <span className="text-[8px] text-slate-400">দিন</span>
              </div>
              <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-lg p-2 min-w-[45px]">
                <span className="block font-black text-slate-900 dark:text-white text-sm">{toBanglaNumber(timeLeft.h)}</span>
                <span className="text-[8px] text-slate-400">ঘণ্টা</span>
              </div>
              <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-lg p-2 min-w-[45px]">
                <span className="block font-black text-slate-900 dark:text-white text-sm">{toBanglaNumber(timeLeft.m)}</span>
                <span className="text-[8px] text-slate-400">মিনিট</span>
              </div>
              <div className="bg-white dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-lg p-2 min-w-[45px]">
                <span className="block font-black text-rose-500 dark:text-rose-400 text-sm animate-pulse">{toBanglaNumber(timeLeft.s)}</span>
                <span className="text-[8px] text-slate-400">সেকেন্ড</span>
              </div>
            </div>

            <button
              onClick={() => {
                const el = document.getElementById('featured-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`hidden sm:flex px-4 py-2 rounded-xl text-[10px] font-black text-white shadow-md active:scale-95 transition-all bg-amber-500 hover:bg-amber-600 gap-1 items-center`}
            >
              <Gift className="h-3.5 w-3.5" />
              অফারটি লুফে নিন
            </button>
          </div>
        </motion.div>
      )}

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl px-6 py-16 md:py-28 lg:px-16 text-center shadow-xl">
        {/* Glow effect balls */}
        <div className="absolute top-[-10%] left-[20%] w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] -z-10 dark:bg-emerald-500/5"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-96 h-96 rounded-full bg-violet-500/10 blur-[120px] -z-10 dark:bg-violet-500/5"></div>
        
        <div className="mx-auto max-w-4xl space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            <Sparkles className={`h-4 w-4 animate-pulse ${getAccentTextClass()}`} />
            <span>বাংলাদেশের সর্ববৃহৎ ডিজিটাল মার্কেটপ্লেস</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight text-slate-950 dark:text-white font-sans tracking-tight"
          >
            আপনার অনলাইন সফলতার জন্য{' '}
            <span className={`block sm:inline bg-gradient-to-r bg-clip-text text-transparent ${getAccentGradientClass()}`}>
              প্রিমিয়াম ডিজিটাল পণ্য
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm sm:text-lg leading-relaxed text-slate-600 dark:text-slate-300 max-w-2xl mx-auto"
          >
            সহজ উপায়ে প্রফেশনাল ওয়ার্ডপ্রেস থিম, প্লাগইন, পিএইচপি স্ক্রিপ্ট, মোবাইল ও ডেস্কটপ সফটওয়্যার, বাংলা ই-বুক এবং টেকনিক্যাল কোর্স কিনুন। সরাসরি বিকাশ, রকেট বা নগদে নিরাপদ পেমেন্ট করুন।
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => onNavigate('products')}
              className={`flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold text-white shadow-xl hover:shadow-2xl active:scale-95 transition-all duration-300 ${getAccentBgClass()} ${getAccentHoverBgClass()}`}
            >
              <Download className="h-5 w-5" />
              প্রোডাক্টস ব্রাউজ করুন
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold border-2 border-slate-200 dark:border-slate-800 bg-white/20 dark:bg-slate-950/20 text-slate-800 dark:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700 active:scale-95 transition-all duration-300 backdrop-blur-sm"
            >
              আমার ড্যাশবোর্ড
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>

          {/* Trust stats row */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 md:pt-12 border-t border-slate-100 dark:border-slate-800 max-w-3xl mx-auto text-center"
          >
            <div className="space-y-1">
              <p className={`text-xl sm:text-2xl font-black ${getAccentTextClass()}`}>
                {toBanglaNumber('১০,০০০')}+
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">সন্তুষ্ট গ্রাহক</p>
            </div>
            <div className="space-y-1">
              <p className={`text-xl sm:text-2xl font-black ${getAccentTextClass()}`}>
                {toBanglaNumber(products.length)}+
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">ডিজিটাল কন্টেন্ট</p>
            </div>
            <div className="space-y-1">
              <p className={`text-xl sm:text-2xl font-black ${getAccentTextClass()}`}>
                {toBanglaNumber('১৫০,০০০')}+
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">সফল ডাউনলোড</p>
            </div>
            <div className="space-y-1">
              <p className={`text-xl sm:text-2xl font-black ${getAccentTextClass()}`}>
                {toBanglaNumber('৯৯.৮')}%
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">ডেলিভারি রেট</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. PRODUCT CATEGORIES SECTION */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
              <TrendingUp className="h-4.5 w-4.5" />
              <span>সহজে অনুসন্ধান</span>
            </div>
            <h2 className="font-sans text-2xl md:text-3xl font-black text-slate-950 dark:text-white">
              ক্যাটাগরি অনুযায়ী ব্রাউজ করুন
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              আপনার পছন্দের ক্যাটাগরি এবং ক্যাটাগরির ভেতরে থাকা অনন্য ডিজিটাল পণ্যসমূহ খুঁজে নিন
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className={`self-start sm:self-auto flex items-center gap-1.5 text-xs font-black hover:gap-2.5 transition-all duration-300 ${getAccentTextClass()}`}
          >
            সকল ক্যাটাগরি দেখুন <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INITIAL_CATEGORIES.map((category) => {
            const count = getProductCount(category.id);
            return (
              <motion.div
                key={category.id}
                onClick={() => onNavigate('products', category.id)}
                whileHover={{ y: -5 }}
                className="group flex cursor-pointer items-start gap-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 p-5 backdrop-blur-md hover:border-emerald-500/30 hover:bg-slate-50 dark:hover:bg-slate-900/60 shadow-sm transition-all duration-300"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-500/10 ${getAccentTextClass()} transition-colors`}>
                  {getCategoryIcon(category.icon)}
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-sans text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors truncate">
                      {category.name}
                    </h3>
                    <span className="shrink-0 rounded-full bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                      {toBanglaNumber(count)} টি প্রোডাক্ট
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS SECTION */}
      <section id="featured-section" className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
              <Sparkles className="h-4.5 w-4.5" />
              <span>সেরা বাছাই</span>
            </div>
            <h2 className="font-sans text-2xl md:text-3xl font-black text-slate-950 dark:text-white">
              আমাদের প্রিমিয়াম ফিচার্ড প্রোডাক্ট
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              উচ্চ রেটিং প্রাপ্ত এবং আমাদের মডারেটরদের দ্বারা বিশেষভাবে প্রস্তাবিত ডিজিটাল পণ্যসমূহ
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className={`self-start sm:self-auto flex items-center gap-1.5 text-xs font-black hover:gap-2.5 transition-all duration-300 ${getAccentTextClass()}`}
          >
            সব প্রোডাক্ট দেখুন <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewProduct}
              onBuyNow={() => onNavigate('checkout')}
            />
          ))}
        </div>
      </section>

      {/* 4. POPULAR PRODUCTS SECTION */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
              <TrendingUp className="h-4.5 w-4.5" />
              <span>বেস্ট সেলিং</span>
            </div>
            <h2 className="font-sans text-2xl md:text-3xl font-black text-slate-950 dark:text-white">
              গ্রাহকদের জনপ্রিয় পছন্দের তালিকায়
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              সবচেয়ে বেশি বার বিক্রিত এবং ক্রেতাদের ইতিবাচক সাড়া পাওয়া ডিজিটাল পণ্যসমূহ
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className={`self-start sm:self-auto flex items-center gap-1.5 text-xs font-black hover:gap-2.5 transition-all duration-300 ${getAccentTextClass()}`}
          >
            সব দেখুন <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewProduct}
              onBuyNow={() => onNavigate('checkout')}
            />
          ))}
        </div>
      </section>

      {/* 5. NEW ARRIVALS SECTION */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
              <Sparkles className="h-4.5 w-4.5 animate-bounce" />
              <span>নতুন কন্টেন্ট</span>
            </div>
            <h2 className="font-sans text-2xl md:text-3xl font-black text-slate-950 dark:text-white">
              নতুন যুক্ত হওয়া পণ্যসমূহ
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
              হাট বাজারে সদ্য যোগ করা লেটেস্ট আপডেট সমৃদ্ধ সেরা মানের থিম, বই এবং কোর্সসমূহ
            </p>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className={`self-start sm:self-auto flex items-center gap-1.5 text-xs font-black hover:gap-2.5 transition-all duration-300 ${getAccentTextClass()}`}
          >
            সব নতুন পণ্য দেখুন <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewProduct}
              onBuyNow={() => onNavigate('checkout')}
            />
          ))}
        </div>
      </section>

      {/* 6. WHY CHOOSE US SECTION */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            <ShieldCheck className="h-4.5 w-4.5" />
            <span>আমাদের বৈশিষ্ট্য</span>
          </div>
          <h2 className="font-sans text-2xl md:text-3xl font-black text-slate-950 dark:text-white">
            কেন আপনি হাট বাজারকে বেছে নিবেন?
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            আমরা নিশ্চিত করি সর্বোচ্চ গ্রাহক নিরাপত্তা ও নিখুঁত প্রিমিয়াম কোয়ালিটি ডিজিটাল ফাইল ডেলিভারি
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -6, scale: 1.01 }}
                className="flex flex-col items-center text-center gap-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 p-6 backdrop-blur-md shadow-sm transition-all duration-300"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 ${getAccentTextClass()}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-sans text-base font-bold text-slate-950 dark:text-white">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS SECTION */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            <Users className="h-4.5 w-4.5" />
            <span>গ্রাহক সন্তুষ্টি</span>
          </div>
          <h2 className="font-sans text-2xl md:text-3xl font-black text-slate-950 dark:text-white">
            আমাদের কাস্টমারদের মূল্যবান রিভিউ
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            দেশ সেরা ডেভেলপার, ব্লগার ও কাস্টমাররা আমাদের প্ল্যাটফর্ম সম্পর্কে যা বলছেন
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 p-6 backdrop-blur-md shadow-lg space-y-4 hover:border-emerald-500/20 transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(r.rating)].map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 fill-current text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {r.date}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300 italic">
                  "{r.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3.5">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-sm text-white ${getAccentBgClass()}`}>
                  {r.avatarText}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-sans text-sm font-bold text-slate-950 dark:text-white truncate">
                    {r.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                    {r.role}
                  </p>
                </div>
                <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold`} title="ভেরিফাইড ক্রেতা">
                  ✓
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
            <Zap className="h-4.5 w-4.5" />
            <span>জিজ্ঞাসিত প্রশ্ন</span>
          </div>
          <h2 className="font-sans text-2xl md:text-3xl font-black text-slate-950 dark:text-white">
            সচরাচর জিজ্ঞাসিত প্রশ্নাবলী (FAQ)
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            হাট বাজার থেকে কেনাকাটা এবং ব্যবহারের ক্ষেত্রে যেকোনো সাধারণ প্রশ্নের উত্তরসমূহ
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index} 
                className="rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 overflow-hidden backdrop-blur-sm transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left font-sans text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className={`h-5 w-5 shrink-0 ${getAccentTextClass()}`} />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" />
                  )}
                </button>
                
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-5 pt-0 border-t border-slate-50 dark:border-slate-900 text-xs md:text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. NEWSLETTER SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-500/10 dark:border-slate-800 bg-gradient-to-br from-slate-950 to-slate-900 text-white px-6 py-12 md:py-20 lg:px-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px] -z-10"></div>
        
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
            <Mail className="h-6 w-6 animate-pulse" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black font-sans tracking-tight">
            বিশেষ ছাড় ও নতুন প্রোডাক্টের নোটিফিকেশন পান
          </h2>
          
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
            আমাদের সাপ্তাহিক নিউজলেটার সাবস্ক্রাইব করে নতুন বাংলা ওয়ার্ডপ্রেস থিম, প্রফেশনাল প্লাগইন এবং কোর্স রিলিজের খবরসহ ১০% ডিসকাউন্ট কুপন ইনস্ট্যান্ট ইনবক্সে বুঝে নিন।
          </p>
          
          <div className="pt-2 max-w-md mx-auto">
            <AnimatePresence mode="wait">
              {!isSubscribed ? (
                <motion.form 
                  key="form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={handleNewsletterSubmit}
                  className="flex flex-col sm:flex-row gap-2"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="আপনার ইমেইল এড্রেস লিখুন"
                    className="flex-grow px-5 py-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs sm:text-sm transition-all font-sans"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm transition-all duration-300 active:scale-95 shrink-0"
                  >
                    সাবস্ক্রাইব করুন
                  </button>
                </motion.form>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-4 text-emerald-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-2"
                >
                  <Sparkles className="h-5 w-5 animate-spin" />
                  <span>ধন্যবাদ! আপনি সফলভাবে নিউজলেটারে সাবস্ক্রাইব করেছেন। ডিসকাউন্ট কোড পাঠানো হয়েছে!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

    </div>
  );
};
