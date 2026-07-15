import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useAdminSettings } from '../context/AdminSettingsContext';
import { formatPrice, toBanglaNumber, getCategoryBanglaName } from '../utils/helpers';
import { Order } from '../types';
import { saveOrderToFirestore } from '../lib/firestoreService';
import { ImageUploader } from '../components/ImageUploader';
import { trackInitiateCheckout, trackPurchase } from '../utils/tracking';
import { 
  ArrowLeft, Wallet, Send, CheckCircle2, AlertCircle, ShoppingBag, 
  Phone, MessageSquare, ShieldCheck, CreditCard, ChevronRight, Check
} from 'lucide-react';
import { motion } from 'motion/react';

interface CheckoutProps {
  onNavigate: (view: string) => void;
  onAddOrder: (order: Order) => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ onNavigate, onAddOrder }) => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const { getAccentBgClass, getAccentTextClass, getAccentHoverBgClass } = useTheme();
  const { settings } = useAdminSettings();

  // Customer Info States
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');

  // Payment States
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [senderNumber, setSenderNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [additionalNote, setAdditionalNote] = useState('');
  
  // Submission & Success States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState('');

  // Track Checkout Initialized on mount
  useEffect(() => {
    if (cartItems.length > 0) {
      trackInitiateCheckout(cartItems, cartTotal);
    }
  }, []);

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div className="py-16 text-center space-y-4 font-sans">
        <div className="flex justify-center">
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-900 p-4 text-slate-400 border border-slate-100 dark:border-slate-800">
            <ShoppingBag className="h-10 w-10 text-rose-500" />
          </div>
        </div>
        <h2 className="font-sans text-xl font-bold text-slate-900 dark:text-white">আপনার কার্ট খালি রয়েছে!</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">চেকআউট করার পূর্বে অনুগ্রহ করে অন্তত একটি ডিজিটাল পণ্য কার্টে যুক্ত করুন।</p>
        <button
          onClick={() => onNavigate('products')}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-md ${getAccentBgClass()} ${getAccentHoverBgClass()} transition-all`}
        >
          প্রোডাক্টস ব্রাউজ করুন
        </button>
      </div>
    );
  }

  const getMethodBanglaName = () => {
    if (paymentMethod === 'bkash') return 'বিকাশ (bKash)';
    if (paymentMethod === 'nagad') return 'নগদ (Nagad)';
    return 'মোবাইল ব্যাংকিং';
  };

  const getPaymentNumber = () => {
    // Provide dedicated personal numbers or fall back to admin contact
    if (paymentMethod === 'bkash') return settings.bkashNumber || '০১৭৮২-১১২২৩৩ (বিকাশ পার্সোনাল)';
    if (paymentMethod === 'nagad') return settings.nagadNumber || '০১৯৭৭-৪৪৫৫৬৬ (নগদ পার্সোনাল)';
    return settings.contactPhone;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email || !senderNumber || !transactionId || !whatsappNumber) {
      alert('অনুগ্রহ করে সমস্ত প্রয়োজনীয় তথ্যগুলো পূরণ করুন!');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderId = 'HB-ORD-' + Math.floor(100000 + Math.random() * 900000);
      
      const newOrder: Order = {
        id: orderId,
        userId: user?.uid || 'guest-uid-' + Math.random().toString(36).substring(2, 7),
        userName: fullName,
        userEmail: email,
        userPhone: phone,
        userWhatsApp: whatsappNumber,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          downloadUrl: item.product.downloadUrl,
          imageUrl: item.product.imageUrl,
        })),
        totalAmount: cartTotal,
        paymentMethod: paymentMethod,
        paymentNumber: senderNumber,
        transactionId: transactionId.trim().toUpperCase(),
        paymentScreenshotUrl: screenshotUrl || undefined,
        status: 'pending',
        createdAt: new Date().toISOString(),
        additionalNote: additionalNote || undefined,
      };

      // Save to Firestore (supports real Firebase and fallback simulation)
      await saveOrderToFirestore(newOrder);

      // Track Purchase event
      trackPurchase(newOrder);

      // Add order to root state
      onAddOrder(newOrder);
      
      setCreatedOrderId(orderId);
      setIsSuccess(true);
      clearCart();
    } catch (err) {
      console.error("Order submission error:", err);
      alert("অর্ডার সাবমিট করতে সমস্যা হয়েছে! অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-xl mx-auto rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-8 text-center space-y-6 shadow-2xl transition-all duration-300 font-sans">
        <div className="flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500 animate-bounce">
            <CheckCircle2 className="h-10 w-10 stroke-[2.5]" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="font-sans text-2xl font-black text-slate-950 dark:text-white">
            ধন্যবাদ! অর্ডারটি সফলভাবে জমা হয়েছে।
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            আমরা আপনার পেমেন্ট যাচাই করছি। আমাদের সাপোর্ট টিম কিছুক্ষণের মধ্যেই আপনার ট্রানজেকশন তথ্য মিলিয়ে পেমেন্ট অনুমোদন করবে। অনুমোদন সম্পন্ন হওয়ার পর আপনি ফাইলটি সরাসরি ডাউনলোড করতে পারবেন।
          </p>
        </div>

        {/* Order Details box */}
        <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-5 border border-slate-100 dark:border-slate-800 text-left text-xs space-y-3">
          <div className="flex justify-between">
            <span className="text-slate-400">অর্ডার আইডি:</span>
            <span className="font-mono font-bold text-rose-500 dark:text-rose-400">{createdOrderId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">গ্রাহকের নাম:</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">পেমেন্ট মেথড:</span>
            <span className="font-bold text-slate-700 dark:text-slate-300">{getMethodBanglaName()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">প্রেরক মোবাইল নাম্বার:</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">{toBanglaNumber(senderNumber)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">ট্রানজেকশন আইডি (TrxID):</span>
            <span className="font-mono font-bold text-emerald-500 uppercase tracking-wider">{transactionId.toUpperCase()}</span>
          </div>
          {screenshotUrl && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-slate-400 block mb-1.5">পেমেন্ট স্ক্রিনশট:</span>
              <img 
                src={screenshotUrl} 
                alt="Payment Screenshot" 
                className="h-20 w-32 object-cover rounded-lg border border-slate-200 dark:border-slate-800"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
          <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2.5 text-sm">
            <span className="font-bold text-slate-600 dark:text-slate-400">মোট পরিশোধিত পরিমাণ:</span>
            <span className={`font-black ${getAccentTextClass()}`}>{formatPrice(cartTotal)}</span>
          </div>
        </div>

        {/* WhatsApp Contact Action */}
        <div className="pt-2">
          <a
            href={`https://wa.me/${settings.whatsAppNumber || '8801712345678'}?text=${encodeURIComponent(
              `হ্যালো Hat Bazar, আমি একটি অর্ডার করেছি। আমার অর্ডার আইডি: ${createdOrderId}। পেমেন্ট পদ্ধতি: ${paymentMethod.toUpperCase()}। আমি টাকা পাঠিয়েছি, দয়া করে আমার পেমেন্ট যাচাই করে অর্ডারটি অনুমোদন করুন।`
            )}`}
            target="_blank"
            rel="noreferrer"
            className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <MessageSquare className="h-4.5 w-4.5 stroke-[2.5]" />
            WhatsApp-এ যোগাযোগ করুন (অর্ডার অনুমোদন দ্রুত করতে)
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`w-full py-3 rounded-xl text-xs font-bold text-white shadow-md ${getAccentBgClass()} ${getAccentHoverBgClass()} transition-all`}
          >
            অর্ডার ট্র্যাক ও ফাইল ডাউনলোড করুন
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="w-full py-3 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
          >
            হোম পেজে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16 font-sans">
      
      {/* Header back navigate */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onNavigate('products')}
          className="rounded-xl border border-slate-100 dark:border-slate-800 p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div className="space-y-0.5">
          <h1 className="font-sans text-xl md:text-2xl font-black text-slate-950 dark:text-white">নিরাপদ চেকআউট পেজ</h1>
          <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">ডিজিটাল ক্যাটালগ থেকে পছন্দকৃত পণ্য ক্রয় সম্পন্ন করতে নিচের তথ্যগুলো প্রদান করুন</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Form Panel */}
        <form onSubmit={handleSubmitOrder} className="lg:col-span-7 space-y-6">
          
          {/* Customer Details Form */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-6 space-y-4 shadow-sm">
            <h2 className="font-sans text-base font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 text-xs font-bold">১</span>
              গ্রাহকের তথ্য (Customer Information)
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">সম্পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs font-medium text-slate-950 dark:text-white focus:ring-1 focus:ring-rose-500 focus:outline-none transition-all"
                  placeholder="যেমন: সাকিব হাসান"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">ইমেইল এড্রেস * (এখানেই আপনার ফাইল এক্সেস পাবেন)</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs font-medium text-slate-950 dark:text-white focus:ring-1 focus:ring-rose-500 focus:outline-none transition-all"
                  placeholder="যেমন: sakib@gmail.com"
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Phone className="h-3 w-3" />
                  মোবাইল নাম্বার *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs font-mono text-slate-950 dark:text-white focus:ring-1 focus:ring-rose-500 focus:outline-none transition-all"
                  placeholder="যেমন: ০১৭XXXXXXXX"
                />
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3 text-emerald-500" />
                  হোয়াটসঅ্যাপ নাম্বার * (ভবিষ্যৎ আপডেট ও সাপোর্ট পেতে)
                </label>
                <input
                  type="tel"
                  required
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs font-mono text-slate-950 dark:text-white focus:ring-1 focus:ring-rose-500 focus:outline-none transition-all"
                  placeholder="যেমন: ০১৭XXXXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selector & Verification */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-6 space-y-5 shadow-sm">
            <h2 className="font-sans text-base font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500 text-xs font-bold">২</span>
              পেমেন্ট মাধ্যম নির্বাচন ও পেমেন্ট ফর্ম
            </h2>

            {/* Custom Designed Logo Buttons */}
            <div className="grid grid-cols-2 gap-4">
              {/* bKash Button */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`group relative flex items-center gap-3 rounded-2xl border p-4.5 transition-all duration-300 ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-500 bg-pink-500/5 shadow-md shadow-pink-500/5'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-pink-300'
                }`}
              >
                <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center font-black text-sm text-white transition-all ${
                  paymentMethod === 'bkash' ? 'bg-pink-600 scale-105' : 'bg-slate-400 group-hover:bg-pink-500'
                }`}>
                  বিকাশ
                </div>
                <div className="text-left">
                  <span className="text-[11px] font-black block text-slate-800 dark:text-white">bKash Personal</span>
                  <span className="text-[9px] text-slate-400 font-sans uppercase">Instant Verification</span>
                </div>
                {paymentMethod === 'bkash' && (
                  <span className="absolute top-2 right-2 bg-pink-500 text-white rounded-full p-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                )}
              </button>

              {/* Nagad Button */}
              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`group relative flex items-center gap-3 rounded-2xl border p-4.5 transition-all duration-300 ${
                  paymentMethod === 'nagad'
                    ? 'border-orange-500 bg-orange-500/5 shadow-md shadow-orange-500/5'
                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-orange-300'
                }`}
              >
                <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center font-black text-sm text-white transition-all ${
                  paymentMethod === 'nagad' ? 'bg-orange-600 scale-105' : 'bg-slate-400 group-hover:bg-orange-500'
                }`}>
                  নগদ
                </div>
                <div className="text-left">
                  <span className="text-[11px] font-black block text-slate-800 dark:text-white">Nagad Personal</span>
                  <span className="text-[9px] text-slate-400 font-sans uppercase">Instant Verification</span>
                </div>
                {paymentMethod === 'nagad' && (
                  <span className="absolute top-2 right-2 bg-orange-500 text-white rounded-full p-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </span>
                )}
              </button>
            </div>

            {/* Payment instructions */}
            <div className="rounded-xl border border-dashed border-rose-500/20 bg-rose-500/5 p-4.5 text-xs space-y-3">
              <h3 className="font-bold flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                <Wallet className="h-4.5 w-4.5" />
                {getMethodBanglaName()} পেমেন্ট নির্দেশিকা:
              </h3>
              
              <ul className="list-decimal pl-4.5 space-y-1.5 text-slate-600 dark:text-slate-300 leading-relaxed">
                <li>
                  প্রথমে আপনার মোবাইল ব্যাংকিং অ্যাপে যান এবং <b>"Send Money"</b> অপশন সিলেক্ট করুন।
                </li>
                <li>
                  প্রাপক মোবাইল নাম্বার বক্সে আমাদের এই পার্সোনাল নাম্বারটি টাইপ করুন: <b className="text-sm font-mono tracking-wider text-rose-500 dark:text-rose-400">{getPaymentNumber()}</b>
                </li>
                <li>
                  মোট পেমেন্টের পরিমাণ সেন্ড মানি করুন: <b className="text-sm text-rose-500 dark:text-rose-400">{formatPrice(cartTotal)}</b>
                </li>
                <li>
                  টাকা সফলভাবে পাঠানোর পর আপনি যে মোবাইল নাম্বার থেকে টাকা পাঠিয়েছেন (Sender) এবং ফিরতি এসএমএস-এ প্রাপ্ত ট্রানজেকশন আইডি <b>(Transaction ID / TrxID)</b> টি নিচের ফর্মে ইনপুট করুন।
                </li>
                <li>
                  সহজ ট্র্যাকিংয়ের জন্য আপনার মোবাইল স্ক্রিনে প্রাপ্ত পেমেন্ট রসিদটির স্ক্রিনশট নিয়ে নিচে আপলোড করতে পারেন।
                </li>
              </ul>
            </div>

            {/* Form Inputs for verification */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-1.5">
              {/* Sender mobile number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">যে নাম্বার থেকে টাকা পাঠিয়েছেন *</label>
                <input
                  type="tel"
                  required
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs font-mono text-slate-950 dark:text-white focus:ring-1 focus:ring-rose-500 focus:outline-none transition-all"
                  placeholder="যেমন: ০১৭XXXXXXXX"
                />
              </div>

              {/* Transaction ID */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">পেমেন্ট ট্রানজেকশন আইডি (TrxID) *</label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs font-mono font-bold text-slate-950 dark:text-white placeholder:font-normal placeholder:text-slate-400 uppercase focus:ring-1 focus:ring-rose-500 focus:outline-none transition-all"
                  placeholder="যেমন: 8N9X8W7Y2Z"
                />
              </div>
            </div>

            {/* Payment screenshot upload (highly polished!) */}
            <div className="pt-2">
              <ImageUploader 
                label="পেমেন্ট রসিদের স্ক্রিনশট (Payment Screenshot) - প্রমাণ স্বরূপ"
                imageUrl={screenshotUrl}
                onImageUploaded={(url) => setScreenshotUrl(url)}
                onClear={() => setScreenshotUrl('')}
              />
            </div>

            {/* Optional note */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">অতিরিক্ত নোট / নির্দেশাবলী (ঐচ্ছিক)</label>
              <textarea
                value={additionalNote}
                onChange={(e) => setAdditionalNote(e.target.value)}
                rows={2}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 text-xs text-slate-950 dark:text-white focus:ring-1 focus:ring-rose-500 focus:outline-none transition-all"
                placeholder="যেমন: কোনো নির্দিষ্ট তথ্য থাকলে এখানে লিখতে পারেন..."
              />
            </div>

          </div>
        </form>

        {/* Right Product Summary Panel */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Order Summary Box */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md p-6 space-y-5 shadow-lg">
            <h2 className="font-sans text-sm font-bold text-slate-950 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
              <span>ক্রয়কৃত পণ্যের বিবরণ (Selected Products)</span>
              <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-[10px] font-black text-slate-600 dark:text-slate-300">
                {toBanglaNumber(cartItems.length)} টি পণ্য
              </span>
            </h2>

            {/* Products List */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[250px] overflow-y-auto pr-1">
              {cartItems.map((item) => {
                const isDiscounted = !!item.product.discountPrice && item.product.discountPrice < item.product.price;
                const finalProductPrice = isDiscounted ? item.product.discountPrice! : item.product.price;

                return (
                  <div key={item.product.id} className="flex items-center gap-3.5 py-3.5 text-xs">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="h-11 w-16 rounded-lg object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <h4 className="font-sans font-bold text-slate-900 dark:text-white line-clamp-1">{item.product.name}</h4>
                      <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400">
                        <span>ক্যাটাগরি: {getCategoryBanglaName(item.product.category)}</span>
                        <span>•</span>
                        <span>ভার্সন: {item.product.version || 'v1.0.0'}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {isDiscounted && (
                        <span className="text-[9px] text-slate-400 line-through block">
                          {formatPrice(item.product.price)}
                        </span>
                      )}
                      <span className={`font-black text-xs block ${getAccentTextClass()}`}>
                        {formatPrice(finalProductPrice)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Calculations widget */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-4.5 space-y-3 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>মোট পণ্যমূল্য:</span>
                <span className="font-bold">{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400">
                <span>সার্ভিস বা ট্রানজেকশন ফি:</span>
                <span className="font-bold text-emerald-500">৳ ০ (ফ্রি)</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-4 text-sm">
                <span className="font-bold text-slate-850 dark:text-slate-350">সর্বমোট পরিশোধযোগ্য মূল্য:</span>
                <span className={`text-base font-black ${getAccentTextClass()}`}>
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            {/* Submit checkout triggers */}
            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || !fullName || !phone || !email || !senderNumber || !transactionId || !whatsappNumber}
              className={`w-full py-4 rounded-xl text-xs font-bold text-white shadow-lg active:scale-95 transition-all duration-300 flex items-center justify-center gap-1.5 ${
                isSubmitting || !fullName || !phone || !email || !senderNumber || !transactionId || !whatsappNumber
                  ? 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none border border-slate-100 dark:border-slate-750'
                  : `${getAccentBgClass()} ${getAccentHoverBgClass()}`
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>অর্ডার ভেরিফাই করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>অর্ডার নিশ্চিত করুন (টাকা পাঠিয়েছি)</span>
                </>
              )}
            </button>

            {/* Secure payment indicator */}
            <div className="rounded-xl bg-slate-50 dark:bg-slate-950 p-3.5 border border-slate-100 dark:border-slate-800 space-y-1.5">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-bold">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                ১০০% নিরাপদ ও সুরক্ষিত পোর্টাল
              </p>
              <p className="text-[9px] text-slate-400 leading-relaxed">
                পেমেন্ট সম্পূর্ণ হওয়ার পর অ্যাডমিন প্যানেল ট্রানজেকশন ID এবং স্ক্রিনশট ম্যানুয়ালি ভেরিফাই করে অনুমোদন করবে। অর্ডার সম্পন্ন হলে আপনার রেজিস্টার্ড ইমেইলে ফাইল ডাউনলোডের এক্সেস চলে যাবে।
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
