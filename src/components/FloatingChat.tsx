import React, { useState } from 'react';
import { useAdminSettings } from '../context/AdminSettingsContext';
import { useTheme } from '../context/ThemeContext';
import { 
  MessageCircle, X, Send, Phone, Mail, MessageSquare, Check, ShieldCheck 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const FloatingChat: React.FC = () => {
  const { settings } = useAdminSettings();
  const { getAccentBgClass, getAccentTextClass, getAccentBorderClass, getAccentHoverBgClass } = useTheme();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'user' | 'bot'; text: string; time: string }[]>([
    { 
      sender: 'bot', 
      text: 'আসসালামু আলাইকুম! Hat Bazar-এ আপনাকে স্বাগতম। পেমেন্ট ভেরিফিকেশন, অর্ডার ট্র্যাকিং বা যেকোনো টেকনিক্যাল সাপোর্টের জন্য নিচে লিখুন অথবা সরাসরি আমাদের সাথে যোগাযোগ করুন।', 
      time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const whatsappNumber = settings.contactPhone || '01711112233';
  const telegramUrl = settings.telegramLink || 'https://t.me/hatbazar_support';
  const supportEmail = settings.contactEmail || 'support@hatbazar.com';

  const formatWhatsAppUrl = () => {
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    const formatted = cleanNumber.startsWith('88') ? cleanNumber : '88' + cleanNumber;
    const defaultText = encodeURIComponent('আসসালামু আলাইকুম, আমি Hat Bazar থেকে সাপোর্ট নিতে চাচ্ছি।');
    return `https://wa.me/${formatted}?text=${defaultText}`;
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = {
      sender: 'user' as const,
      text: inputMessage,
      time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const originalInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    // Dynamic responses based on context or simple helpful auto-replies
    setTimeout(() => {
      setIsTyping(false);
      let replyText = 'আপনার বার্তাটি সফলভাবে জমা হয়েছে। আমাদের একজন সাপোর্ট রিপ্রেজেন্টেটিভ খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন। যেকোনো জরুরি প্রয়োজনে নিচের সরাসরি যোগাযোগ বাটনে ক্লিক করুন।';
      
      const lowerText = originalInput.toLowerCase();
      if (lowerText.includes('payment') || lowerText.includes('পেমেন্ট') || lowerText.includes('টাকা') || lowerText.includes('বিকাশ')) {
        replyText = 'পেমেন্ট সংক্রান্ত কোনো বিষয় হলে অনুগ্রহ করে সফল অর্ডারের ট্র্যাকিং আইডি ও বিকাশ/রকেট ট্রানজেকশন আইডিসহ সরাসরি হোয়াটসঅ্যাপ-এ যোগাযোগ করুন। এতে দ্রুত সমস্যার সমাধান পাওয়া যাবে।';
      } else if (lowerText.includes('order') || lowerText.includes('অর্ডার') || lowerText.includes('ডাউনলোড') || lowerText.includes('ফাইল')) {
        replyText = 'অর্ডার বা ফাইল ডাউনলোড সংক্রান্ত বিষয় হলে আপনি সাইটের "ডাউনলোড ও অর্ডার ট্র্যাকিং" মেনু থেকে অর্ডার আইডি দিয়ে সরাসরি ডাউনলোড লিংক পেতে পারেন। অন্যথায় হোয়াটসঅ্যাপ বা ইমেইলে যোগাযোগ করুন।';
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: replyText,
          time: new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      
      {/* 1. CHAT WINDOW CONTAINER WITH GLASSMORPHISM AND ANIMATIONS */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-[340px] sm:w-[370px] h-[500px] rounded-3xl border border-slate-150 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden text-xs"
          >
            {/* Header section */}
            <div className={`p-4.5 text-white flex items-center justify-between ${getAccentBgClass()}`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm">
                    HB
                  </div>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-slate-900 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-xs flex items-center gap-1">
                    Hat Bazar লাইভ সাপোর্ট
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
                  </h3>
                  <p className="text-[10px] text-white/80">সরাসরি আমাদের সাপোর্ট এজেন্টের সাথে কথা বলুন</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Quick Contact Bar */}
            <div className="bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-850 p-2.5 flex justify-around items-center text-[10px] text-slate-500 dark:text-slate-400 font-bold">
              <a 
                href={formatWhatsAppUrl()} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-1.5 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                হোয়াটসঅ্যাপ
              </a>
              <span className="text-slate-300">|</span>
              <a 
                href={telegramUrl} 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-1.5 hover:text-sky-500 dark:hover:text-sky-400 transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-sky-500 inline-block" />
                টেলিগ্রাম
              </a>
              <span className="text-slate-300">|</span>
              <a 
                href={`mailto:${supportEmail}`} 
                className="flex items-center gap-1.5 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-rose-500 inline-block" />
                ইমেইল সাপোর্ট
              </a>
            </div>

            {/* Message Thread container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[82%] p-3 rounded-2xl leading-relaxed text-xs ${
                    msg.sender === 'user'
                      ? `${getAccentBgClass()} text-white rounded-br-none`
                      : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-bl-none shadow-sm'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1 font-mono">{msg.time}</span>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex flex-col items-start">
                  <div className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-bl-none text-slate-400 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input submission form */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="আপনার সমস্যার কথা বিস্তারিত এখানে লিখুন..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-white placeholder-slate-400 focus:outline-none focus:border-slate-300"
              />
              <button
                type="submit"
                className={`p-2.5 rounded-xl text-white font-bold active:scale-95 transition-all cursor-pointer ${getAccentBgClass()} ${getAccentHoverBgClass()}`}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. FLOATING TRIGGER BUTTON */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`h-14 w-14 rounded-full text-white shadow-2xl flex items-center justify-center cursor-pointer relative group border border-white/10 ${getAccentBgClass()} ${getAccentHoverBgClass()}`}
        title="লাইভ সাপোর্ট এবং যোগাযোগ"
      >
        <span className="absolute inset-0 rounded-full bg-inherit animate-ping opacity-25 group-hover:animate-none" />
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>

    </div>
  );
};
