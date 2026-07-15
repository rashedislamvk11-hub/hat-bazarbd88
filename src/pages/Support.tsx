import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAdminSettings } from '../context/AdminSettingsContext';
import { 
  HelpCircle, Phone, Mail, ShieldAlert, FileText, RefreshCw, Send,
  ChevronDown, MessageSquare, Compass, ShieldCheck, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SupportProps {
  initialTab?: 'faq' | 'contact' | 'privacy' | 'terms' | 'refund';
  onNavigate: (view: string) => void;
}

export const Support: React.FC<SupportProps> = ({ 
  initialTab = 'faq',
  onNavigate 
}) => {
  const { getAccentBgClass, getAccentHoverBgClass, getAccentTextClass, getAccentBorderClass } = useTheme();
  const { settings } = useAdminSettings();

  const [activeTab, setActiveTab] = useState<'faq' | 'contact' | 'privacy' | 'terms' | 'refund'>(initialTab);
  
  // FAQ Collapsible States
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Contact Form States
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSuccess(true);
    setContactName('');
    setContactEmail('');
    setContactMessage('');
    setTimeout(() => setContactSuccess(false), 5000);
  };

  const supportTabs = [
    { id: 'faq', label: 'সচরাচর জিজ্ঞাসা (FAQ)', icon: HelpCircle },
    { id: 'contact', label: 'যোগাযোগ (Contact)', icon: Phone },
    { id: 'privacy', label: 'গোপনীয়তা নীতি', icon: ShieldAlert },
    { id: 'terms', label: 'শর্তাবলী ও নীতিমালা', icon: FileText },
    { id: 'refund', label: 'রিফান্ড পলিসি', icon: RefreshCw },
  ] as const;

  const faqs = [
    {
      q: 'ডিজিটাল পণ্য কেনার পর কিভাবে ডাউনলোড করব?',
      a: 'পণ্য সফলভাবে ক্রয়ের পর এবং পেমেন্ট অনুমোদন সম্পন্ন হলে, আপনি স্ক্রিনে একটি ট্র্যাকিং আইডি ও অর্ডার কনফার্মেশন পাবেন। এছাড়াও সরাসরি "ডাউনলোড ও অর্ডার ট্র্যাকিং" পেজে গিয়ে আপনার সঠিক ট্র্যাকিং আইডি প্রদান করে মুহূর্তেই পণ্যটির জিপ (ZIP) বা মেইন সোর্স ফাইল সরাসরি ডাউনলোড করতে পারবেন।'
    },
    {
      q: 'পেমেন্ট করার কতক্ষণ পর অর্ডার কনফার্ম হবে?',
      a: 'সাধারণত আমাদের সিস্টেম ১ থেকে ১৫ মিনিটের মধ্যে আপনার ট্রানজেকশন তথ্য যাচাই করে অর্ডার অনুমোদন করে দেয়। অর্ডার অনুমোদিত হওয়ার সাথে সাথে আপনার ট্র্যাকিং আইডিতে ডাউনলোড লিংক অ্যাক্টিভেট হয়ে যাবে।'
    },
    {
      q: 'বিকাশ বা রকেটে পেমেন্ট করার ক্ষেত্রে কোন বাড়তি চার্জ আছে কি?',
      a: 'না, Hat Bazar থেকে পণ্য কেনার জন্য আপনার কোনো প্রকার বাড়তি ক্যাশ-আউট বা সেন্ড মানি চার্জের প্রয়োজন নেই। পণ্যের নির্ধারিত মূল্যই শুধুমাত্র পরিশোধ করতে হবে।'
    },
    {
      q: 'কোনো ফাইল ডাউনলোড করতে সমস্যা হলে কি করব?',
      a: 'যদি কোনো ফাইলের লিংক কাজ না করে বা ডাউনলোড ব্যাহত হয়, তবে আপনি তাৎক্ষণিকভাবে আমাদের ফ্লোটিং লাইভ সাপোর্ট বা হোয়াটসঅ্যাপ নম্বরে যোগাযোগ করতে পারেন। আমাদের টেকনিক্যাল টিম ২৪ ঘণ্টার মধ্যে আপনার সমস্যার সমাধান বা সরাসরি ফাইলটি ইমেইল করে দেবে।'
    },
    {
      q: 'কেনার পর ফাইলটি কি আজীবন ডাউনলোড করা যাবে?',
      a: 'হ্যাঁ, আমাদের প্রতিটি ডিজিটাল ফাইলের সাথে লাইফটাইম অ্যাক্সেস ও ফ্রি আপডেট পাবেন। একবার সফলভাবে ক্রয় করলে আপনার ট্র্যাকিং আইডির মাধ্যমে যেকোনো সময় নতুন সংস্করণ সহ ফাইলটি ডাউনলোড করতে পারবেন।'
    }
  ];

  return (
    <div className="space-y-10 pb-16 animate-fade-in font-sans text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
      
      {/* 1. Header Banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3.5 pt-4">
        <h1 className="text-xl md:text-2xl font-black text-rose-500">গ্রাহক সহায়তা ও নির্দেশিকা</h1>
        <p className="text-slate-400 leading-relaxed">
          আমাদের সেবা সম্পর্কিত তথ্য, ক্রয় নীতিমালা, শর্তাবলী এবং যেকোনো অভিযোগ বা অনুসন্ধানের জন্য নিবেদিত গ্রাহক সহায়তা পেজ।
        </p>
      </div>

      {/* 2. Tabs Switcher Menu */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-5">
        {supportTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all text-xs active:scale-95 cursor-pointer border ${
                activeTab === tab.id
                  ? `${getAccentBgClass()} text-white border-transparent shadow-md`
                  : 'bg-white dark:bg-slate-900 border-slate-150 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Render Active Tab Views */}
      <div className="max-w-3xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-6 sm:p-8 backdrop-blur-md shadow-xl"
          >
            
            {/* TAB: FAQ */}
            {activeTab === 'faq' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-3">
                  <h2 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-2">
                    <HelpCircle className="h-4.5 w-4.5 text-rose-500" />
                    সচরাচর জিজ্ঞাসিত প্রশ্নসমূহ (FAQs)
                  </h2>
                </div>
                
                <div className="space-y-3">
                  {faqs.map((faq, idx) => (
                    <div 
                      key={idx} 
                      className="border border-slate-100 dark:border-slate-850 rounded-2xl overflow-hidden bg-white/60 dark:bg-slate-950/25 transition-all"
                    >
                      <button
                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                        className="w-full px-5 py-4 text-left font-bold text-slate-850 dark:text-slate-200 flex items-center justify-between gap-4"
                      >
                        <span className="text-xs leading-relaxed">{faq.q}</span>
                        <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-350 shrink-0 ${openFaq === idx ? 'rotate-180 text-rose-500' : ''}`} />
                      </button>
                      
                      <AnimatePresence initial={false}>
                        {openFaq === idx && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 pt-1.5 text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-850 leading-relaxed">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: CONTACT */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-3">
                  <h2 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-2">
                    <Phone className="h-4.5 w-4.5 text-rose-500" />
                    যোগাযোগ এবং অভিযোগ বক্স
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Contact Details */}
                  <div className="space-y-5">
                    <p className="text-slate-400 leading-relaxed">
                      আমাদের সেবা সংক্রান্ত যেকোনো প্রশ্ন বা অভিযোগের জন্য নিচের তথ্যাদি ব্যবহার করতে পারেন অথবা সরাসরি মেসেজ পাঠান।
                    </p>

                    <div className="space-y-3.5">
                      <div className="flex items-center gap-3.5 bg-slate-50/50 dark:bg-slate-950/20 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-850">
                        <Phone className={`h-5 w-5 ${getAccentTextClass()}`} />
                        <div>
                          <p className="font-bold text-slate-400 text-[10px] uppercase">হেল্পলাইন নম্বর</p>
                          <p className="text-slate-850 dark:text-slate-200 font-bold font-sans mt-0.5">{settings.contactPhone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3.5 bg-slate-50/50 dark:bg-slate-950/20 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-850">
                        <Mail className={`h-5 w-5 ${getAccentTextClass()}`} />
                        <div>
                          <p className="font-bold text-slate-400 text-[10px] uppercase">ইমেইল ঠিকানা</p>
                          <p className="text-slate-850 dark:text-slate-200 font-bold font-sans mt-0.5">{settings.contactEmail}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3.5 bg-slate-50/50 dark:bg-slate-950/20 p-4.5 rounded-2xl border border-slate-100 dark:border-slate-850">
                        <Compass className={`h-5 w-5 ${getAccentTextClass()}`} />
                        <div>
                          <p className="font-bold text-slate-400 text-[10px] uppercase">হেড অফিস</p>
                          <p className="text-slate-850 dark:text-slate-200 font-bold mt-0.5">ঢাকা, বাংলাদেশ</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Message Form */}
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    {contactSuccess && (
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/35 border border-emerald-500/20 text-xs font-bold flex items-center gap-2">
                        <CheckCircle className="h-4.5 w-4.5 text-emerald-500 shrink-0 animate-scale" />
                        <span>আপনার মেসেজটি সফলভাবে পাঠানো হয়েছে!</span>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold">আপনার নাম</label>
                      <input
                        type="text"
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="যেমন: সাকিব হাসান"
                        className="w-full rounded-xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-950 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold">ইমেইল ঠিকানা</label>
                      <input
                        type="email"
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="যেমন: sakib@example.com"
                        className="w-full rounded-xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-950 dark:text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-500 font-bold">আপনার বার্তাটি লিখুন</label>
                      <textarea
                        required
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="আপনার অভিযোগ, মতামত অথবা জিজ্ঞাসাটি বিস্তারিত লিখুন..."
                        className="w-full rounded-xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2.5 text-slate-950 dark:text-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className={`w-full py-3 rounded-xl font-bold text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${getAccentBgClass()} ${getAccentHoverBgClass()}`}
                    >
                      <Send className="h-4 w-4" />
                      মেসেজ পাঠান
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB: PRIVACY POLICY */}
            {activeTab === 'privacy' && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-3">
                  <h2 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-2">
                    <ShieldAlert className="h-4.5 w-4.5 text-rose-500" />
                    গোপনীয়তা নীতি (Privacy Policy)
                  </h2>
                </div>

                <div className="space-y-4.5 text-slate-500 dark:text-slate-400">
                  <p>
                    Hat Bazar-এ আপনার গোপনীয়তা রক্ষা করা আমাদের একটি অন্যতম প্রধান দায়িত্ব। আমাদের প্ল্যাটফর্ম ব্যবহার করার মাধ্যমে আপনি নিম্নলিখিত গোপনীয়তা নীতি মেনে নিচ্ছেন:
                  </p>
                  
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">১. ব্যক্তিগত তথ্য সংগ্রহ ও ব্যবহার:</h4>
                    <p>
                      আমরা কোনো ব্যবহারকারীর পাসওয়ার্ড বা অপ্রয়োজনীয় সংবেদনশীল তথ্য সংরক্ষণ করি না। গেস্ট চেকআউট করার সময় শুধুমাত্র আপনার অর্ডার নিশ্চিতকরণ, ট্র্যাকিং তথ্য প্রেরণ ও কাস্টমার সাপোর্টের প্রয়োজনে আপনার নাম, মোবাইল নম্বর, WhatsApp নম্বর এবং ইমেইল সংগ্রহ করা হয়।
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">২. পেমেন্ট ভেরিফিকেশন:</h4>
                    <p>
                      আপনার প্রদানকৃত ট্রানজেকশন আইডি এবং মোবাইল নম্বর শুধুমাত্র আমাদের অ্যাকাউন্টস প্যানেলে পেমেন্ট সত্যতা যাচাইয়ের জন্য ব্যবহৃত হয়। কোনো তৃতীয় পক্ষের সাথে এই সংবেদনশীল তথ্য শেয়ার করা হয় না।
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">৩. কুকিজ (Cookies) ব্যবহার:</h4>
                    <p>
                      আপনার ব্রাউজিং অভিজ্ঞতার উন্নয়ন এবং কার্ট আইটেম ও সেশন সম্পর্কিত তথ্য মনে রাখার জন্য আমরা সাময়িক কুকিজ বা ব্রাউজার লোকালস্টোরেজ ব্যবহার করে থাকি।
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">৪. পলিসি পরিবর্তন:</h4>
                    <p>
                      আমাদের গোপনীয়তা নীতি যেকোনো সময় পরিবর্তন করার অধিকার আমরা সংরক্ষণ করি। যেকোনো গুরুত্বপূর্ণ পরিবর্তনের তথ্য ওয়েবসাইটে তাৎক্ষণিকভাবে প্রকাশ করা হবে।
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: TERMS */}
            {activeTab === 'terms' && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-3">
                  <h2 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-2">
                    <FileText className="h-4.5 w-4.5 text-rose-500" />
                    শর্তাবলী ও নীতিমালা (Terms & Conditions)
                  </h2>
                </div>

                <div className="space-y-4.5 text-slate-500 dark:text-slate-400">
                  <p>
                    Hat Bazar থেকে যেকোনো ডিজিটাল কোর্স বা ফাইল ক্রয়ের পূর্বে অনুগ্রহ করে নিম্নোক্ত শর্তাবলী মনোযোগ সহকারে পড়ুন:
                  </p>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">১. লাইসেন্স ও ডাউনলোড ফাইল ব্যবহারের অধিকার:</h4>
                    <p>
                      আমাদের ওয়েবসাইট থেকে ক্রয়কৃত পণ্য শুধুমাত্র আপনার ব্যক্তিগত ব্যবহারের জন্য প্রযোজ্য। আপনি পণ্যটি কোনো বাণিজ্যিক উদ্দেশ্যে পুনঃবিক্রয়, ডিস্ট্রিবিউশন বা অননুমোদিত শেয়ার করতে পারবেন না। এই শর্ত অমান্য করলে কাস্টমার আইডি বাতিল ও আইনি পদক্ষেপ নেওয়া হতে পারে।
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">২. পেমেন্ট এবং অর্ডার প্রসেস:</h4>
                    <p>
                      গ্রাহককে অবশ্যই সঠিক ও নির্ভুল মোবাইল নম্বর, ট্রানজেকশন আইডি প্রদান করে চেকআউট সম্পন্ন করতে হবে। ভুল তথ্য প্রদান করলে ফাইল এক্সেস পেতে বিলম্ব হতে পারে।
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">৩. সোর্স কোড ও পণ্য সংশোধন:</h4>
                    <p>
                      ডিজিটাল ফাইলের গুণগত মান এবং কার্যকারিতা বজায় রাখতে যেকোনো পণ্যের মূল্য, ফিচার বা কন্টেন্ট যেকোনো সময় পরিবর্তন, পরিমার্জন বা সাইট থেকে সাময়িক অপসারণের অধিকার Hat Bazar সংরক্ষণ করে।
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: REFUND POLICY */}
            {activeTab === 'refund' && (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-3">
                  <h2 className="text-sm font-black text-slate-950 dark:text-white flex items-center gap-2">
                    <RefreshCw className="h-4.5 w-4.5 text-rose-500 animate-spin-hover" />
                    রিফান্ড পলিসি (Refund Policy)
                  </h2>
                </div>

                <div className="space-y-4.5 text-slate-500 dark:text-slate-400">
                  <p>
                    ডিজিটাল পণ্যের প্রকৃতি ডাউনলোডেবল হওয়ার কারণে এর রিফান্ড নীতি কিছুটা ভিন্ন হয়ে থাকে:
                  </p>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">১. ডাউনলোড ফাইল ডিফেক্ট (ডাউনলোড সমস্যা):</h4>
                    <p>
                      ফাইলের কোনো প্রকার ত্রুটি, ক্র্যাশ বা অকেজো লিংকের ক্ষেত্রে আমরা সর্ব প্রথম ২৪ ঘণ্টার মধ্যে সমাধান করে নতুন ফাইল ইমেইলে পাঠিয়ে থাকি। যদি আমাদের টিম ফাইলটি সম্পূর্ণ সচল বা পুনরুদ্ধার করে দিতে ব্যর্থ হয়, শুধুমাত্র সেক্ষেত্রেই আপনি রিফান্ড দাবি করতে পারবেন।
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">২. অযোগ্য রিফান্ড ক্ষেত্রসমূহ:</h4>
                    <p>
                      "ভুলবশত কিনেছি", "আমার এখন আর প্রয়োজন নেই", বা "পছন্দ হয়নি" - এই জাতীয় ডিজিটাল ডাউনলোড বহির্ভূত যৌক্তিক কারণ রিফান্ডের আওতাভুক্ত হবে না।
                    </p>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">৩. রিফান্ড প্রসেস টাইম:</h4>
                    <p>
                      সঠিক অভিযোগ যাচাই সাপেক্ষে পেমেন্ট রিফান্ড অনুমোদন করা হলে পরবর্তী ৩ কার্যদিবসের মধ্যে আপনার বিকাশ বা রকেট ওয়ালেটে মূল রিফান্ডকৃত টাকা পৌঁছে দেওয়া হবে।
                    </p>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
};
