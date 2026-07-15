import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface LoadingProps {
  fullPage?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ fullPage = false }) => {
  const { getAccentTextClass } = useTheme();

  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50/80 dark:bg-slate-950/85 backdrop-blur-md">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-transparent dark:border-slate-800"></div>
          <div className={`absolute h-8 w-8 animate-ping rounded-full opacity-75 ${getAccentTextClass()}`}></div>
        </div>
        <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300 animate-pulse font-sans">
          লোডিং হচ্ছে, দয়া করে অপেক্ষা করুন...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="h-10 w-10 animate-spin rounded-full border-3 border-slate-200 border-t-transparent dark:border-slate-800"></div>
    </div>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-4">
      <div className="aspect-video w-full rounded-xl bg-slate-200 dark:bg-slate-800"></div>
      <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800"></div>
      <div className="h-3 w-full rounded bg-slate-200 dark:bg-slate-800"></div>
      <div className="h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-800"></div>
      <div className="flex items-center justify-between pt-4">
        <div className="h-6 w-1/3 rounded bg-slate-200 dark:bg-slate-800"></div>
        <div className="h-8 w-1/4 rounded-xl bg-slate-200 dark:bg-slate-800"></div>
      </div>
    </div>
  );
};
