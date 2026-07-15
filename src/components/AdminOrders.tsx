import React, { useState } from 'react';
import { Order } from '../types';
import { useTheme } from '../context/ThemeContext';
import { formatPrice, toBanglaNumber } from '../utils/helpers';
import { Search, Eye, CheckCircle2, XCircle, Clock, Trash, FileText, Check, ShieldAlert, ArrowLeft, Download, EyeOff, Copy, MessageSquare } from 'lucide-react';

interface AdminOrdersProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: 'pending' | 'approved' | 'rejected' | 'completed', customUrl?: string) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  onUpdateOrderStatus,
}) => {
  const { getAccentBgClass, getAccentHoverBgClass, getAccentTextClass } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'completed'>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [customDownloadUrl, setCustomDownloadUrl] = useState('');
  const [isScreenshotModalOpen, setIsScreenshotModalOpen] = useState(false);

  const handleSelectOrder = (o: Order) => {
    setSelectedOrder(o);
    setCustomDownloadUrl(o.downloadUrl || '');
  };

  const getWhatsAppMessageUrl = (order: Order) => {
    if (!order) return '';
    const phone = order.userPhone.replace(/\D/g, ''); // strip non-numeric
    // Ensure proper Bangladesh country code if missing
    const formattedPhone = phone.startsWith('88') ? phone : (phone.startsWith('01') ? '88' + phone : phone);
    
    const message = `প্রিয় ${order.userName},
আপনার অর্ডারটি সফলভাবে অনুমোদিত (Approved) হয়েছে! 🎉

🛍️ অর্ডারকৃত প্রোডাক্ট: ${order.productName}
💳 পরিশোধিত মূল্য: ৳${order.totalAmount} টাকা
🔗 আপনার প্রোডাক্ট ডাউনলোড লিংক: ${order.downloadUrl || customDownloadUrl || 'আপনার Hat Bazar লাইব্রেরিতে যুক্ত করা হয়েছে।'}

ধন্যবাদ,
Hat Bazar সাপোর্ট টিম।`;
    
    return `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(message)}`;
  };

  const handleUpdateStatus = (status: 'pending' | 'approved' | 'rejected' | 'completed') => {
    if (!selectedOrder) return;
    onUpdateOrderStatus(selectedOrder.id, status, customDownloadUrl);
    setSelectedOrder({
      ...selectedOrder,
      status,
      downloadUrl: customDownloadUrl
    });
    
    if (status === 'approved') {
      alert(`অর্ডার স্ট্যাটাস সফলভাবে 'Approved' করা হয়েছে!\n\nগ্রাহকের জন্য স্বয়ংক্রিয় হোয়াটসঅ্যাপ মেসেজ জенারেট হয়েছে। নিচের 'WhatsApp মেসেজ পাঠান' বাটনে চাপ দিয়ে মেসেজটি পাঠিয়ে দিন।`);
    } else {
      alert(`অর্ডার স্ট্যাটাস সফলভাবে '${status}' এ পরিবর্তন করা হয়েছে!`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Transaction ID কপি করা হয়েছে!');
  };

  // Filtering
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.userPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (o.transactionId && o.transactionId.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = activeFilter === 'all' ? true : o.status === activeFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in text-xs">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="font-sans text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          অর্ডার ও পেমেন্ট অনুমোদন উইন্ডো
        </h3>

        {/* Tab filters */}
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          {(['all', 'pending', 'approved', 'rejected', 'completed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase transition-all ${
                activeFilter === filter
                  ? 'bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
            >
              {filter === 'all' ? 'সব' : filter === 'pending' ? 'অপেক্ষমান' : filter === 'approved' ? 'অনুমোদিত' : filter === 'rejected' ? 'বাতিল' : 'সম্পন্ন'}
            </button>
          ))}
        </div>
      </div>

      {selectedOrder ? (
        /* ORDER DETAILS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          
          {/* Main info panel */}
          <div className="md:col-span-2 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-6 backdrop-blur-md space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h4 className="font-sans font-bold text-slate-950 dark:text-white text-sm">
                  অর্ডার বিস্তারিত বিবরণ
                </h4>
                <p className="text-[10px] text-slate-400 font-mono">ID: {selectedOrder.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                ফিরে যান
              </button>
            </div>

            {/* Customer & Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Customer Column */}
              <div className="space-y-3">
                <h5 className="font-bold text-rose-500 uppercase tracking-wide text-[10px]">গ্রাহকের বিবরণ</h5>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl space-y-2 border border-slate-100 dark:border-slate-900 leading-relaxed">
                  <p><span className="text-slate-400">নাম:</span> <strong>{selectedOrder.userName}</strong></p>
                  <p><span className="text-slate-400">ইমেইল:</span> <strong>{selectedOrder.userEmail}</strong></p>
                  <p><span className="text-slate-400">মোবাইল:</span> <strong>{selectedOrder.userPhone}</strong></p>
                  {selectedOrder.whatsApp && (
                    <p><span className="text-slate-400">WhatsApp:</span> <strong>{selectedOrder.whatsApp}</strong></p>
                  )}
                  <p><span className="text-slate-400">অর্ডার তারিখ:</span> <strong>{new Date(selectedOrder.createdAt).toLocaleString('bn-BD')}</strong></p>
                </div>
              </div>

              {/* Order Column */}
              <div className="space-y-3">
                <h5 className="font-bold text-rose-500 uppercase tracking-wide text-[10px]">পেমেন্ট ও প্রোডাক্ট বিবরণ</h5>
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl space-y-2 border border-slate-100 dark:border-slate-900 leading-relaxed">
                  <p><span className="text-slate-400">পণ্য:</span> <strong>{selectedOrder.productName}</strong></p>
                  <p><span className="text-slate-400">পরিমাণ:</span> <strong>{formatPrice(selectedOrder.totalAmount)}</strong></p>
                  <p><span className="text-slate-400">মেথড:</span> <strong className="uppercase">{selectedOrder.paymentMethod}</strong></p>
                  <p><span className="text-slate-400">রিসিভার নাম্বার:</span> <strong>{selectedOrder.paymentNumber}</strong></p>
                  {selectedOrder.transactionId && (
                    <p className="flex items-center gap-1">
                      <span className="text-slate-400">Transaction ID:</span>
                      <strong className="font-mono text-emerald-500">{selectedOrder.transactionId}</strong>
                      <button onClick={() => copyToClipboard(selectedOrder.transactionId || '')} className="text-slate-400 hover:text-slate-600">
                        <Copy className="h-3 w-3" />
                      </button>
                    </p>
                  )}
                </div>
              </div>

            </div>

            {/* Custom Download Url Configuration */}
            <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-900">
              <label className="font-bold text-slate-700 dark:text-slate-300 block">কাস্টম ডাউনলোড লিংক পরিবর্তন (ঐচ্ছিক)</label>
              <input
                type="text"
                value={customDownloadUrl}
                onChange={(e) => setCustomDownloadUrl(e.target.value)}
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs focus:outline-none"
                placeholder="ডিফল্ট লিংক ওভাররাইড করতে এখানে কোনো আলাদা ডাউনলোড লিংক দিন..."
              />
              <p className="text-[10px] text-slate-400">ফাঁকা রাখলে প্রোডাক্ট ক্যাটালগের ডিফল্ট ডাউনলোড লিংক ব্যবহার হবে।</p>
            </div>

            {/* Actions Status controllers */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-500 block uppercase tracking-wider text-[10px]">অর্ডার স্ট্যাটাস পরিবর্তন করুন</h5>
              <div className="flex flex-wrap gap-2.5">
                <button
                  onClick={() => handleUpdateStatus('approved')}
                  disabled={selectedOrder.status === 'approved'}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/40 text-white font-bold rounded-xl shadow transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  অনুমোদন দিন (Approve)
                </button>
                
                <button
                  onClick={() => handleUpdateStatus('completed')}
                  disabled={selectedOrder.status === 'completed'}
                  className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/40 text-white font-bold rounded-xl shadow transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Check className="h-4 w-4" />
                  সম্পন্ন করুন (Complete)
                </button>

                <button
                  onClick={() => handleUpdateStatus('rejected')}
                  disabled={selectedOrder.status === 'rejected'}
                  className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-500/40 text-white font-bold rounded-xl shadow transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <XCircle className="h-4 w-4" />
                  বাতিল করুন (Reject)
                </button>

                <button
                  onClick={() => handleUpdateStatus('pending')}
                  disabled={selectedOrder.status === 'pending'}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/40 text-white font-bold rounded-xl shadow transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Clock className="h-4 w-4" />
                  অপেক্ষমান রাখুন (Hold)
                </button>
              </div>
              
              {(selectedOrder.status === 'approved' || selectedOrder.status === 'completed') && (
                <div className="mt-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/5 space-y-2 animate-fade-in">
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>✨ হোয়াটসঅ্যাপ অটোমেশন (WhatsApp Automation Active)</span>
                  </p>
                  <p className="text-[10px] text-slate-450 dark:text-slate-400">
                    এই পেমেন্টটি অনুমোদিত হওয়ায় গ্রাহকের জন্য একটি স্বয়ংক্রিয় ডাউনলোড লিংক সম্বলিত হোয়াটসঅ্যাপ নোটিফিকেশন মেসেজ জেনারেট করা হয়েছে। গ্রাহকের ইনবক্সে মেসেজটি পাঠাতে নিচের বাটনে ক্লিক করুন:
                  </p>
                  <a
                    href={getWhatsAppMessageUrl(selectedOrder)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow active:scale-95 transition-all text-[11px]"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>WhatsApp মেসেজ পাঠান (অটোমেটেড)</span>
                  </a>
                </div>
              )}
            </div>

          </div>

          {/* Screenshot Column panel */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-5 backdrop-blur-md space-y-4 shadow-sm flex flex-col justify-between">
            <div>
              <h5 className="font-bold text-slate-700 dark:text-slate-300 mb-3 text-[11px] uppercase tracking-wide">পেমেন্ট স্ক্রিনশট প্রুফ</h5>
              
              {selectedOrder.screenshotUrl ? (
                <div 
                  onClick={() => setIsScreenshotModalOpen(true)}
                  className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 cursor-pointer group aspect-video relative bg-slate-100"
                >
                  <img
                    src={selectedOrder.screenshotUrl}
                    alt="Proof of Payment"
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <span className="text-[10px] text-white bg-black/60 px-2 py-1 rounded-md font-bold">ক্লিক করে বড় করুন</span>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-slate-200 dark:border-slate-800 p-8 rounded-xl text-center text-slate-400">
                  <p>কোনো স্ক্রিনশট প্রমাণ আপলোড করা হয়নি।</p>
                </div>
              )}
            </div>

            <div className="text-[10px] text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3.5 rounded-lg border border-slate-100 dark:border-slate-900 mt-4">
              <p className="font-bold mb-1 flex items-center gap-1 text-slate-500">
                <ShieldAlert className="h-3.5 w-3.5 text-rose-500" />
                অ্যাডমিন নোটিশ:
              </p>
              অর্ডার অনুমোদনের সাথে সাথে গ্রাহকের ইমেইলে ডাউনলোড লিংক স্বয়ংক্রিয়ভাবে পৌঁছে যাবে এবং তার Hat Bazar অ্যাকাউন্ট লাইব্রেরিতে প্রোডাক্টটি আনলক হবে।
            </div>
          </div>

          {/* Screenshot zoom Modal */}
          {isScreenshotModalOpen && selectedOrder.screenshotUrl && (
            <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
              <div className="relative max-w-3xl w-full rounded-2xl overflow-hidden bg-slate-900/90 border border-slate-800 p-2">
                <button
                  onClick={() => setIsScreenshotModalOpen(false)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2.5 rounded-full transition-colors z-10 font-bold"
                >
                  ✕
                </button>
                <img
                  src={selectedOrder.screenshotUrl}
                  alt="Expanded proof"
                  className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          )}

        </div>
      ) : (
        /* LIST VIEW */
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-6 backdrop-blur-md space-y-4 shadow-sm">
          <div className="relative">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="অর্ডার আইডি, গ্রাহকের নাম, মোবাইল নম্বর বা TrxID দিয়ে খুঁজুন..."
              className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950/50 px-4 py-2.5 pl-10 text-xs focus:outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            {filteredOrders.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400">
                    <th className="py-3 px-2 font-bold">অর্ডার আইডি</th>
                    <th className="py-3 px-2 font-bold">গ্রাহক</th>
                    <th className="py-3 px-2 font-bold">প্রোডাক্ট</th>
                    <th className="py-3 px-2 font-bold">পরিমাণ</th>
                    <th className="py-3 px-2 font-bold">পেমেন্ট পদ্ধতি</th>
                    <th className="py-3 px-2 font-bold">স্ট্যাটাস</th>
                    <th className="py-3 px-2 font-bold text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="py-3.5 px-2 font-mono text-[10px] text-slate-400">
                        {o.id}
                      </td>
                      <td className="py-3.5 px-2">
                        <p className="font-bold text-slate-800 dark:text-slate-200">{o.userName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{o.userPhone}</p>
                      </td>
                      <td className="py-3.5 px-2 font-bold text-slate-600 dark:text-slate-300 max-w-[150px] truncate">
                        {o.productName}
                      </td>
                      <td className="py-3.5 px-2 font-bold font-sans text-slate-900 dark:text-white">
                        {formatPrice(o.totalAmount)}
                      </td>
                      <td className="py-3.5 px-2 font-bold uppercase text-slate-500">
                        {o.paymentMethod}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-bold ${
                          o.status === 'approved' || o.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-600'
                            : o.status === 'rejected'
                            ? 'bg-rose-500/10 text-rose-600'
                            : 'bg-amber-500/10 text-amber-600 animate-pulse'
                        }`}>
                          {o.status === 'approved' ? 'অনুমোদিত' : o.status === 'rejected' ? 'বাতিল' : o.status === 'completed' ? 'সম্পন্ন' : 'অপেক্ষমান'}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 text-center">
                        <button
                          onClick={() => handleSelectOrder(o)}
                          className="rounded-lg p-2 text-slate-400 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 active:scale-95 transition-all inline-flex items-center gap-1 font-bold"
                        >
                          <Eye className="h-4 w-4" />
                          <span>পর্যালোচনা</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-slate-400 py-8 text-center">কোনো অর্ডার পাওয়া যায়নি।</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
