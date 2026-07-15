import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useAdminSettings } from '../context/AdminSettingsContext';
import { Order } from '../types';
import { formatPrice, toBanglaNumber } from '../utils/helpers';
import { 
  Search, Download, Calendar, ShoppingBag, AlertCircle, MessageSquare, 
  CheckCircle2, Clock, XCircle, ArrowRight, ShieldCheck, HelpCircle
} from 'lucide-react';

interface UserDashboardProps {
  orders: Order[];
  onNavigate: (view: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ orders, onNavigate }) => {
  const { user } = useAuth();
  const { getAccentBgClass, getAccentTextClass, getAccentHoverBgClass } = useTheme();
  const { settings } = useAdminSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [trackedOrders, setTrackedOrders] = useState<Order[]>([]);

  // Auto-populated orders if there's a logged-in user
  const loggedInOrders = user ? orders.filter((o) => o.userId === user.uid || o.userEmail === user.email) : [];

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    // Filter matching orders: ID matches, phone matches, WhatsApp matches, or email matches
    const matched = orders.filter((o) => {
      return (
        o.id.toLowerCase() === query ||
        o.id.replace('hb-ord-', '').toLowerCase() === query ||
        o.userPhone.includes(query) ||
        o.userWhatsApp.includes(query) ||
        o.userEmail.toLowerCase() === query
      );
    });

    setTrackedOrders(matched);
    setHasSearched(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setTrackedOrders([]);
    setHasSearched(false);
  };

  const activeDisplayOrders = hasSearched ? trackedOrders : loggedInOrders;

  return (
    <div className="space-y-10 pb-16 font-sans">
      
      {/* Title & Description */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h1 className="font-sans text-2xl md:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
          অর্ডার ট্র্যাকিং ও ডাউনলোড পোর্টাল
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          কোনো লগইন বা রেজিস্ট্রেশন ছাড়াই শুধুমাত্র আপনার <b>অর্ডার আইডি</b> অথবা <b>মোবাইল নম্বর</b> দিয়ে ইনস্ট্যান্ট অর্ডার ট্র্যাক করুন এবং অনুমোদিত ফাইলগুলো ডাউনলোড করুন।
        </p>
      </div>

      {/* Modern Search Engine Section */}
      <div className="max-w-2xl mx-auto rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 p-6 shadow-xl backdrop-blur-md">
        <form onSubmit={handleTrackOrder} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1">
              আপনার তথ্য দিন (অর্ডার আইডি / মোবাইল / হোয়াটসঅ্যাপ):
            </label>
            <div className="relative flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="যেমন: HB-ORD-117283 অথবা 017XXXXXXXX"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-white dark:bg-slate-950 text-sm font-medium text-slate-950 dark:text-white placeholder:text-slate-400 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold"
                  >
                    মুছে ফেলুন
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className={`px-7 py-3.5 rounded-2xl text-xs font-bold text-white shadow-lg active:scale-95 transition-all shrink-0 flex items-center justify-center gap-1.5 ${
                  searchQuery.trim()
                    ? `${getAccentBgClass()} ${getAccentHoverBgClass()}`
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none'
                }`}
              >
                <Search className="h-4 w-4 stroke-[2.5]" />
                অর্ডার ট্র্যাক করুন
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              ১০০% নিরাপদ ও সুরক্ষিত ট্র্যাকিং
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5 text-blue-500" />
              পেমেন্ট যাচাই করতে ২-১০ মিনিট সময় লাগতে পারে
            </span>
          </div>
        </form>
      </div>

      {/* Output Results */}
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* If no search has happened and no logged-in account, show guidelines */}
        {!hasSearched && loggedInOrders.length === 0 && (
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-8 backdrop-blur-md text-center max-w-xl mx-auto space-y-4">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <ShoppingBag className="h-6 w-6 animate-pulse" />
              </div>
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">ফাইল ডাউনলোড করার নিয়মাবলি:</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed text-left">
              ১. আপনার পছন্দমতো পণ্য শপিং কার্টে যুক্ত করে চেকআউট করুন।<br />
              ২. বিকাশ বা নগদে টাকা পাঠিয়ে সেন্ডার নাম্বার ও ট্রানজেকশন আইডি দিয়ে অর্ডার সাবমিট করুন।<br />
              ৩. অর্ডারের সাথে সাথেই একটি ইউনিক <b>অর্ডার আইডি (Order ID)</b> পাবেন।<br />
              ৪. পেমেন্ট ম্যানুয়ালি ভেরিফাইড হলে অর্ডারটি অনুমোদিত হবে এবং সাথে সাথে উপরে অর্ডার আইডি দিয়ে ট্র্যাক করে ফাইলটি ডাউনলোড করে নিতে পারবেন।
            </p>
          </div>
        )}

        {/* Display tracked/matched orders */}
        {activeDisplayOrders.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
              <span>ট্র্যাককৃত অর্ডার সমূহের তালিকা ({toBanglaNumber(activeDisplayOrders.length)} টি)</span>
              {hasSearched && (
                <button
                  onClick={handleClearSearch}
                  className="text-xs text-rose-500 hover:underline font-bold"
                >
                  সার্চ ক্লিয়ার করুন
                </button>
              )}
            </h2>

            <div className="grid grid-cols-1 gap-6">
              {activeDisplayOrders.map((order) => {
                const isApproved = order.status === 'approved' || order.status === 'completed';
                const isPending = order.status === 'pending';
                const isRejected = order.status === 'rejected';

                return (
                  <div 
                    key={order.id} 
                    className="rounded-3xl border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 p-6 backdrop-blur-md shadow-lg space-y-6"
                  >
                    
                    {/* Order Meta Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 text-xs">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-slate-400">অর্ডার আইডি:</span>
                          <span className="font-mono font-black text-rose-500 dark:text-rose-400">{order.id}</span>
                          
                          {/* Order Status Badge */}
                          <span className={`rounded-full px-3 py-0.5 font-bold text-[10px] flex items-center gap-1 ${
                            isApproved
                              ? 'bg-emerald-500/15 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                              : isRejected
                              ? 'bg-rose-500/15 text-rose-600'
                              : 'bg-amber-500/15 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 animate-pulse'
                          }`}>
                            {isApproved && (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                                অনুমোদিত (Approved)
                              </>
                            )}
                            {isRejected && (
                              <>
                                <XCircle className="h-3.5 w-3.5" />
                                বাতিল (Rejected)
                              </>
                            )}
                            {isPending && (
                              <>
                                <Clock className="h-3.5 w-3.5" />
                                যাচাই করা হচ্ছে
                              </>
                            )}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          অর্ডারের তারিখ: {toBanglaNumber(new Date(order.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }))}
                        </div>
                      </div>

                      <div className="text-left sm:text-right">
                        <span className="text-slate-400 block text-[10px]">মোট মূল্য</span>
                        <span className={`font-black text-sm md:text-base ${getAccentTextClass()}`}>
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Order Details Body */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      
                      {/* Products list of this order */}
                      <div className="md:col-span-7 space-y-3.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ক্রয়কৃত পণ্যের ক্যাটালগ:</span>
                        <div className="space-y-3">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex gap-3.5 text-xs items-center bg-slate-50 dark:bg-slate-950/50 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-900/50">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-10 w-14 rounded-lg object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-grow min-w-0">
                                <h4 className="font-sans font-bold text-slate-900 dark:text-white line-clamp-1 leading-snug">
                                  {item.name}
                                </h4>
                                <span className={`font-black text-[11px] block ${getAccentTextClass()}`}>
                                  {formatPrice(item.price)}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Download Link or verification information */}
                      <div className="md:col-span-5 space-y-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ডাউনলোড ও অ্যাকশন:</span>
                        
                        {isApproved ? (
                          <div className="rounded-2xl bg-emerald-500/5 p-4 border border-emerald-500/20 space-y-3">
                            <div className="space-y-1 text-center sm:text-left">
                              <h4 className="text-xs font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 justify-center sm:justify-start">
                                <CheckCircle2 className="h-4 w-4 stroke-[2.5]" />
                                পেমেন্ট যাচাই সম্পূর্ণ হয়েছে!
                              </h4>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                                নিচে দেওয়া বাটনটি ক্লিক করে ফাইলটি সরাসরি ডাউনলোড করে নিন।
                              </p>
                            </div>

                            <div className="space-y-2">
                              {order.items.map((item, idx) => {
                                const finalUrl = order.downloadUrl || item.downloadUrl;
                                return (
                                  <a
                                    key={idx}
                                    href={finalUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`w-full py-3 rounded-xl text-xs font-bold text-white shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all ${getAccentBgClass()} ${getAccentHoverBgClass()}`}
                                  >
                                    <Download className="h-4 w-4" />
                                    ফাইল-{idx + 1} ডাউনলোড করুন
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        ) : isPending ? (
                          <div className="rounded-2xl bg-amber-500/5 p-4 border border-amber-500/20 space-y-3">
                            <div className="space-y-1">
                              <h4 className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1.5 animate-pulse">
                                <Clock className="h-4 w-4" />
                                পেমেন্ট যাচাই প্রক্রিয়াধীন...
                              </h4>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                                পেমেন্ট সম্পন্ন হয়েছে কিনা তা যাচাই করা হচ্ছে। ট্রানজেকশন ও সেন্ডার নাম্বার ভেরিফাইড হলে সাথে সাথে ফাইলটি ডাউনলোডের যোগ্য হবে। দ্রুত অনুমোদনের জন্য নিচে হোয়াটসঅ্যাপ বাটন চাপুন।
                              </p>
                            </div>

                            <a
                              href={`https://wa.me/${settings.whatsAppNumber || '8801712345678'}?text=${encodeURIComponent(
                                `হ্যালো Hat Bazar, আমি আমার অর্ডার আইডি: ${order.id} এর পেমেন্ট অনুমোদন করতে চাই। আমার বিকাশ/নগদ ট্রানজেকশন ID: ${order.transactionId}। দয়া করে একটু চেক করুন।`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full py-2.5 rounded-xl text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                            >
                              <MessageSquare className="h-3.5 w-3.5" />
                              WhatsApp অনুমোদন রিকোয়েস্ট
                            </a>
                          </div>
                        ) : (
                          <div className="rounded-2xl bg-rose-500/5 p-4 border border-rose-500/20 space-y-2">
                            <h4 className="text-xs font-black text-rose-600 flex items-center gap-1.5">
                              <AlertCircle className="h-4 w-4" />
                              অর্ডারটি বাতিল করা হয়েছে!
                            </h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                              ভুল ট্রানজেকশন আইডি বা অন্য কোনো সমস্যার কারণে অর্ডারটি বাতিল হতে পারে। বিস্তারিত জানতে দয়া করে সাপোর্ট সেন্টারে বা হোয়াটসঅ্যাপে যোগাযোগ করুন।
                            </p>
                          </div>
                        )}

                        {/* Customer Summary Fields */}
                        <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 p-4 border border-slate-100 dark:border-slate-850 space-y-2 text-[11px]">
                          <div className="flex justify-between">
                            <span className="text-slate-400">পেমেন্ট পদ্ধতি:</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300 uppercase">{order.paymentMethod}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">ট্রানজেকশন ID:</span>
                            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{order.transactionId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">গ্রাহকের নাম:</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">{order.userName}</span>
                          </div>
                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Matched but list is empty and user pressed search */}
        {hasSearched && trackedOrders.length === 0 && (
          <div className="rounded-2xl border border-rose-100 dark:border-rose-950/30 bg-rose-500/5 p-8 text-center max-w-xl mx-auto space-y-4">
            <div className="flex justify-center">
              <div className="h-12 w-12 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <AlertCircle className="h-6 w-6" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400">কোনো তথ্য পাওয়া যায়নি!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                দুঃখিত, আপনার ইনপুটকৃত সার্চ কুয়েরি <b className="font-mono">"{searchQuery}"</b> এর সাথে মিল রয়েছে এমন কোনো অর্ডার ক্যাটালগে পাওয়া যায়নি।
              </p>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              অনুগ্রহ করে ট্রানজেকশন সম্পূর্ণ হওয়ার পর প্রাপ্ত অর্ডার আইডি (যেমন: <b>HB-ORD-117283</b>) অথবা চেকআউট করার সময় ব্যবহৃত মোবাইল নাম্বারটি সঠিকভাবে টাইপ করে পুনরায় চেষ্টা করুন।
            </p>
          </div>
        )}

      </div>

    </div>
  );
};
