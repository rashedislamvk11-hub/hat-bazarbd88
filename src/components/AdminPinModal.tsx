import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, X, ShieldAlert, KeyRound } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPinModal: React.FC<AdminPinModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { unlockAdminWithPin } = useAuth();
  const { getAccentBgClass, getAccentTextClass } = useTheme();
  
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setError('');
      setSuccess(false);
      // Focus the input when modal opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (pin.length !== 6) {
      setError('দয়া করে ৬ ডিজিটের পিন কোড দিন');
      return;
    }

    const isCorrect = unlockAdminWithPin(pin);
    if (isCorrect) {
      setSuccess(true);
      setError('');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1200);
    } else {
      setError('ভুল পিন কোড! আবার চেষ্টা করুন।');
      setPin('');
      inputRef.current?.focus();
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (val.length <= 6) {
      setPin(val);
      if (error) setError('');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-2xl z-10 text-center"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-xl p-1.5 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-700 dark:hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="space-y-5 pt-3">
            {/* Header Icon */}
            <div className="flex justify-center">
              {success ? (
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1, rotate: 360 }}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                >
                  <ShieldCheck className="h-9 w-9 animate-bounce" />
                </motion.div>
              ) : error ? (
                <motion.div
                  animate={{ x: [0, -10, 10, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                  className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                >
                  <ShieldAlert className="h-9 w-9" />
                </motion.div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300">
                  <KeyRound className="h-8 w-8" />
                </div>
              )}
            </div>

            {/* Heading */}
            <div className="space-y-1">
              <h3 className="font-sans text-xl font-black text-slate-950 dark:text-white">
                {success ? 'অ্যাডমিন প্যানেল আনলকড!' : 'অ্যাডমিন ভেরিফিকেশন'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {success 
                  ? 'আপনার পরিচয় সফলভাবে যাচাই করা হয়েছে।' 
                  : 'অ্যাডমিন প্যানেলে প্রবেশ করতে আপনার ৬ ডিজিটের পিন কোড দিন।'
                }
              </p>
            </div>

            {/* PIN inputs */}
            {!success && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative flex justify-center">
                  <input
                    ref={inputRef}
                    type="password"
                    maxLength={6}
                    value={pin}
                    onChange={handlePinChange}
                    className="sr-only"
                    autoComplete="off"
                  />
                  
                  {/* Styled visual code boxes */}
                  <div className="flex justify-center gap-3" onClick={() => inputRef.current?.focus()}>
                    {Array.from({ length: 6 }).map((_, idx) => {
                      const char = pin[idx];
                      const isFocused = pin.length === idx;
                      return (
                        <div
                          key={idx}
                          className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl border text-lg font-black transition-all ${
                            char 
                              ? 'border-emerald-500 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400' 
                              : isFocused 
                                ? 'border-slate-400 ring-2 ring-slate-100 dark:ring-slate-900 bg-slate-50/50 dark:bg-slate-900/50' 
                                : 'border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10'
                          }`}
                        >
                          {char ? '●' : ''}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Error text */}
                {error && (
                  <p className="text-xs font-bold text-rose-500 flex items-center justify-center gap-1">
                    <ShieldAlert className="h-3.5 w-3.5" />
                    {error}
                  </p>
                )}

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={pin.length !== 6}
                  className={`w-full py-3 rounded-2xl text-xs font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${getAccentBgClass()}`}
                >
                  প্যানেল আনলক করুন
                </button>
              </form>
            )}

            {success && (
              <div className="py-2">
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  সরাসরি অ্যাডমিন ড্যাশবোর্ডে রিডাইরেক্ট করা হচ্ছে...
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
