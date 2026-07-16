import React, { useState } from 'react';
import { useAuth, SIMULATED_USERS } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogIn, UserPlus, Key, Mail, Shield, User, ArrowRight, Phone, MessageSquare, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ onBack }) => {
  const { login, register, resetPassword } = useAuth();
  const { getAccentBgClass, getAccentTextClass, getAccentHoverBgClass } = useTheme();

  const [isRegister, setIsRegister] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleManualAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!email || (isRegister && (!name || !phone)) || (!isRegister && !password)) {
      setErrorMsg('অনুগ্রহ করে সমস্ত প্রয়োজনীয় ঘরগুলো পূরণ করুন!');
      setLoading(false);
      return;
    }

    try {
      if (isRegister) {
        await register(name, email, password, phone, whatsApp || phone);
        setSuccessMsg('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!');
        setTimeout(() => {
          onBack();
        }, 1000);
      } else {
        await login(email, password);
        onBack();
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'প্রক্রিয়াটি সম্পন্ন করতে ব্যর্থ হয়েছে। পুনরায় চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!resetEmail) {
      setErrorMsg('অনুগ্রহ করে আপনার ইমেইল এড্রেস প্রদান করুন!');
      setLoading(false);
      return;
    }

    try {
      await resetPassword(resetEmail);
      setSuccessMsg('পাসওয়ার্ড রিসেট করার লিংক আপনার ইমেইলে পাঠানো হয়েছে।');
    } catch (err: any) {
      setErrorMsg(err?.message || 'ইমেইল পাঠাতে ব্যর্থ হয়েছে। অনুগ্রহ করে সঠিক ইমেইল দিন।');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (simulatedEmail: string) => {
    setErrorMsg('');
    setLoading(true);
    try {
      await login(simulatedEmail, 'password123');
      onBack();
    } catch (err) {
      setErrorMsg('ডেমো লগইন করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      
      {/* Auth Panel card */}
      <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 p-8 shadow-2xl backdrop-blur-md space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-1.5">
          <h2 className="font-sans text-xl md:text-2xl font-black text-slate-950 dark:text-white">
            {isForgotPassword 
              ? 'পাসওয়ার্ড পুনরুদ্ধার করুন' 
              : isRegister 
              ? 'নতুন অ্যাকাউন্ট তৈরি করুন' 
              : 'অ্যাকাউন্টে লগইন করুন'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isForgotPassword 
              ? 'আপনার ইমেইল অ্যাড্রেস দিয়ে পাসওয়ার্ড রিসেট লিংক পান' 
              : isRegister 
              ? 'হাট বাজারে যুক্ত হয়ে প্রিমিয়াম প্রোডাক্ট অর্ডার করুন' 
              : 'প্রোডাক্ট ডাউনলোড এবং অর্ডার ট্র্যাকিং করতে লগইন করুন'}
          </p>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="rounded-xl bg-rose-50 dark:bg-rose-950/20 px-4 py-3 border border-rose-200/50 text-xs text-rose-600 dark:text-rose-400 font-medium animate-fade-in">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Success message */}
        {successMsg && (
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 px-4 py-3 border border-emerald-200/50 text-xs text-emerald-600 dark:text-emerald-400 font-medium animate-fade-in">
            ✓ {successMsg}
          </div>
        )}

        {isForgotPassword ? (
          /* Forgot Password Form */
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">আপনার রেজিস্টার্ড ইমেইল *</label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 pl-10 text-xs font-medium text-slate-950 dark:text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="যেমন: user@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all duration-300 ${getAccentBgClass()} ${getAccentHoverBgClass()}`}
            >
              <span>{loading ? 'প্রক্রিয়াধীন...' : 'রিসেট লিংক পাঠান'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsForgotPassword(false);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="w-full py-2 text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-white flex items-center justify-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>লগইন পেজে ফিরে যান</span>
            </button>
          </form>
        ) : (
          /* Login & Registration Form */
          <form onSubmit={handleManualAuth} className="space-y-4">
            
            {isRegister && (
              <>
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">আপনার সম্পূর্ণ নাম *</label>
                  <div className="relative">
                    <User className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 pl-10 text-xs font-medium text-slate-950 dark:text-white focus:border-emerald-500 focus:outline-none"
                      placeholder="যেমন: সাকিব হাসান"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">মোবাইল নম্বর *</label>
                  <div className="relative">
                    <Phone className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 pl-10 text-xs font-medium text-slate-950 dark:text-white focus:border-emerald-500 focus:outline-none"
                      placeholder="যেমন: 017XXXXXXXX"
                    />
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">হোয়াটসঅ্যাপ নম্বর (ঐচ্ছিক)</label>
                  <div className="relative">
                    <MessageSquare className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={whatsApp}
                      onChange={(e) => setWhatsApp(e.target.value)}
                      className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 pl-10 text-xs font-medium text-slate-950 dark:text-white focus:border-emerald-500 focus:outline-none"
                      placeholder="যেমন: 017XXXXXXXX"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">ইমেইল এড্রেস *</label>
              <div className="relative">
                <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 pl-10 text-xs font-medium text-slate-950 dark:text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="যেমন: user@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400">পাসওয়ার্ড *</label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    className="text-[10px] font-bold text-slate-400 hover:text-emerald-500 transition-colors"
                  >
                    পাসওয়ার্ড ভুলে গেছেন?
                  </button>
                )}
              </div>
              <div className="relative">
                <Key className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 pl-10 text-xs font-medium text-slate-950 dark:text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="কমপক্ষে ৬টি ক্যারেক্টার"
                />
              </div>
            </div>

            {/* Submit Trigger */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 rounded-xl text-xs font-bold text-white shadow-lg flex items-center justify-center gap-1.5 active:scale-[0.98] transition-all duration-300 ${getAccentBgClass()} ${getAccentHoverBgClass()}`}
            >
              {isRegister ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
              <span>{loading ? 'প্রক্রিয়াধীন...' : isRegister ? 'অ্যাকাউন্ট তৈরি করুন' : 'লগইন করুন'}</span>
            </button>
          </form>
        )}

        {/* Switch mode trigger */}
        {!isForgotPassword && (
          <div className="text-center">
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            >
              {isRegister ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন' : 'অ্যাকাউন্ট নেই? নতুন তৈরি করুন'}
            </button>
          </div>
        )}

        {/* Quick Demo Access Panels for sandboxed testing */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-3">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider text-center">
            টেস্টিং করার জন্য ডেমো প্রোফাইল
          </span>

          <div className="grid grid-cols-1 gap-2.5">
            {/* Standard User profile access */}
            <button
              onClick={() => handleQuickLogin('user@hatbazar.com')}
              className="flex items-center justify-between rounded-xl border border-emerald-100 dark:border-emerald-950/20 bg-emerald-50/10 dark:bg-emerald-950/5 p-3 text-left transition-all active:scale-[0.98] hover:bg-emerald-50/20"
            >
              <div className="flex items-center gap-2 text-xs">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-white font-bold">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-600 dark:text-emerald-400">{SIMULATED_USERS[2].displayName}</h4>
                  <p className="text-[9px] text-slate-400 font-mono">ইমেইল: user@hatbazar.com</p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-emerald-500" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
