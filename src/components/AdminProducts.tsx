import React, { useState } from 'react';
import { Product } from '../types';
import { useTheme } from '../context/ThemeContext';
import { formatPrice, toBanglaNumber, getCategoryBanglaName } from '../utils/helpers';
import { ImageUploader, GalleryUploader } from './ImageUploader';
import { Search, Plus, Trash2, Edit, Save, ArrowLeft, Check, PlayCircle, Terminal, BookOpen, Layout, Cpu, Sparkles } from 'lucide-react';

interface AdminProductsProps {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
}) => {
  const { getAccentBgClass, getAccentHoverBgClass, getAccentTextClass } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [description, setDescription] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [category, setCategory] = useState('courses');
  const [imageUrl, setImageUrl] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [version, setVersion] = useState('');
  const [productType, setProductType] = useState('zip');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPopular, setIsPopular] = useState(false);
  const [featuresInput, setFeaturesInput] = useState('');

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setPrice(p.price.toString());
    setDiscountPrice(p.discountPrice?.toString() || '');
    setDescription(p.description);
    setShortDescription(p.shortDescription || '');
    setCategory(p.category);
    setImageUrl(p.imageUrl);
    setGalleryImages(p.galleryImages || []);
    setDownloadUrl(p.downloadUrl);
    setFileSize(p.fileSize || '');
    setVersion(p.version || '');
    setProductType(p.productType || 'zip');
    setStatus(p.status || 'published');
    setIsFeatured(p.isFeatured || false);
    setIsPopular(p.isPopular || false);
    setFeaturesInput(p.features ? p.features.join('\n') : '');
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setEditingProduct(null);
    clearForm();
    setIsFormOpen(false);
  };

  const clearForm = () => {
    setName('');
    setPrice('');
    setDiscountPrice('');
    setDescription('');
    setShortDescription('');
    setCategory('courses');
    setImageUrl('');
    setGalleryImages([]);
    setDownloadUrl('');
    setFileSize('');
    setVersion('');
    setProductType('zip');
    setStatus('published');
    setIsFeatured(false);
    setIsPopular(false);
    setFeaturesInput('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !downloadUrl || !imageUrl) {
      alert('অনুগ্রহ করে প্রধান বিষয়গুলো (নাম, মূল্য, ডাউনলোড এবং ছবি) পূরণ করুন!');
      return;
    }

    setIsSaving(true);

    const priceNum = parseFloat(price);
    const discPriceNum = discountPrice ? parseFloat(discountPrice) : undefined;
    const featuresList = featuresInput
      ? featuresInput.split('\n').filter(f => f.trim() !== '')
      : ['১০০% কাজ করবে', 'লাইফটাইম আপডেট'];

    try {
      if (editingProduct) {
        const updated: Product = {
          ...editingProduct,
          name,
          description,
          shortDescription,
          price: priceNum,
          discountPrice: discPriceNum,
          category,
          imageUrl,
          galleryImages,
          downloadUrl,
          fileSize: fileSize || '১০.৫ MB',
          version: version || 'v1.0.0',
          productType,
          status,
          isFeatured,
          isPopular,
          features: featuresList,
          updatedAt: new Date().toISOString()
        };
        await onUpdateProduct(updated);
        alert('প্রোডাক্টটি সফলভাবে আপডেট করা হয়েছে!');
      } else {
        const created: Product = {
          id: 'prod-' + Date.now(),
          name,
          description: description || 'এটি একটি চমৎকার ডিজিটাল সম্পদ যা আপনার কাজকে সহজ করবে।',
          shortDescription,
          price: priceNum,
          discountPrice: discPriceNum,
          category,
          imageUrl,
          galleryImages,
          downloadUrl,
          fileSize: fileSize || '১০ MB',
          version: version || 'v1.0.0',
          rating: 5.0,
          reviewsCount: 0,
          salesCount: 0,
          tags: ['Digital', 'Asset'],
          features: featuresList,
          productType,
          status,
          isFeatured,
          isPopular,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await onAddProduct(created);
        alert('প্রোডাক্টটি সফলভাবে যুক্ত করা হয়েছে!');
      }
      handleCancel();
    } catch (err: any) {
      console.error("Error saving product:", err);
      alert(`প্রোডাক্ট সংরক্ষণ করতে ব্যর্থ হয়েছে!\nভুল: ${err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    getCategoryBanglaName(p.category).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header section */}
      <div className="flex justify-between items-center">
        <h3 className="font-sans text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          প্রোডাক্ট ক্যাটালগ ম্যানেজমেন্ট
        </h3>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition-all ${getAccentBgClass()} ${getAccentHoverBgClass()}`}
          >
            <Plus className="h-4 w-4" />
            <span>নতুন প্রোডাক্ট যোগ করুন</span>
          </button>
        )}
      </div>

      {isFormOpen ? (
        /* PRODUCT ADD/EDIT FORM */
        <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-6 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Edit className="h-4.5 w-4.5" />
              {editingProduct ? 'প্রোডাক্ট এডিট করুন' : 'নতুন প্রোডাক্ট যুক্ত করুন'}
            </h4>
            <button
              type="button"
              onClick={handleCancel}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              ফিরে যান
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Title */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-slate-500 font-bold">প্রোডাক্টের নাম *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
                placeholder="যেমন: ওয়ার্ডপ্রেস এলিমেন্টর প্রো প্লাগইন"
              />
            </div>

            {/* Category */}
            <div className="space-y-1">
              <label className="text-slate-500 font-bold">ক্যাটেগরি *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
              >
                <option value="courses">কোর্স</option>
                <option value="software">সফটওয়্যার</option>
                <option value="ebooks">ই-বুক</option>
                <option value="templates">টেমপ্লেট</option>
                <option value="tools">ডিজিটাল টুলস</option>
                <option value="ai-products">AI প্রোডাক্ট</option>
              </select>
            </div>

            {/* Product Type */}
            <div className="space-y-1">
              <label className="text-slate-500 font-bold">ফাইল টাইপ (যেমন: ZIP, PDF, MP4)</label>
              <input
                type="text"
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
                placeholder="যেমন: zip, pdf, exe"
              />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label className="text-slate-500 font-bold">বিক্রয় মূল্য (৳) *</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
                placeholder="যেমন: ৪৫০"
              />
            </div>

            {/* Discount Price */}
            <div className="space-y-1">
              <label className="text-slate-500 font-bold">আসল মূল্য বা ডিসকাউন্ট ছাড়া মূল্য (৳)</label>
              <input
                type="number"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
                placeholder="যেমন: ১২০০"
              />
            </div>

            {/* Download Link */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-slate-500 font-bold">ডিজিটাল ডাউনলোড লিংক * (গুগল ড্রাইভ/মেগা লিংক)</label>
              <input
                type="text"
                required
                value={downloadUrl}
                onChange={(e) => setDownloadUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
                placeholder="যেমন: https://drive.google.com/file/d/..."
              />
            </div>

            {/* Image Uploader */}
            <ImageUploader
              label="প্রোডাক্ট ইমেজ (প্রধান ছবি) *"
              imageUrl={imageUrl}
              onImageUploaded={setImageUrl}
              onClear={() => setImageUrl('')}
            />

            {/* Gallery Image Uploader */}
            <GalleryUploader
              label="অতিরিক্ত গ্যালারি ইমেজসমূহ (ঐচ্ছিক)"
              images={galleryImages}
              onImagesChanged={setGalleryImages}
            />

            {/* File Size */}
            <div className="space-y-1">
              <label className="text-slate-500 font-bold">ফাইল সাইজ (File Size)</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
                placeholder="যেমন: ২৫.৪ MB"
              />
            </div>

            {/* Version */}
            <div className="space-y-1">
              <label className="text-slate-500 font-bold">ভার্সন (Version)</label>
              <input
                type="text"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
                placeholder="যেমন: v3.2.1"
              />
            </div>

            {/* Short Description */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-slate-500 font-bold">সংক্ষিপ্ত বিবরণ (Short Description)</label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none"
                placeholder="যেমন: খুব চমৎকার এবং প্রফেশনাল ওয়ার্ডপ্রেস প্লাগইন থিম সহ ফ্রি।"
              />
            </div>

            {/* Description */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-slate-500 font-bold">বিস্তারিত বিবরণ (Description)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 leading-relaxed focus:outline-none"
                placeholder="প্রোডাক্ট সম্পর্কে বিস্তারিত কন্টেন্ট এখানে লিখুন..."
              />
            </div>

            {/* Features list */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-slate-500 font-bold">বৈশিষ্ট্যসমূহ (Features - প্রতি লাইনে একটি করে লিখুন)</label>
              <textarea
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-2.5 focus:outline-none font-mono"
                placeholder="১০০% কাজ করে&#10;লাইফটাইম আপডেট&#10;প্রিমিয়াম ড্যাশবোর্ড সাপোর্ট"
              />
            </div>

            {/* Publish Status & Badges */}
            <div className="space-y-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-900 sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <span className="text-slate-500 block font-bold">স্ট্যাটাস</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('published')}
                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold ${
                      status === 'published'
                        ? 'bg-emerald-500 text-white border-emerald-500'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    প্রকাশ করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('draft')}
                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold ${
                      status === 'draft'
                        ? 'bg-amber-500 text-white border-amber-500'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    খসড়া (Draft)
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4.5">
                <input
                  type="checkbox"
                  id="feat"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="h-4 w-4 rounded text-emerald-500"
                />
                <label htmlFor="feat" className="font-bold text-slate-700 dark:text-slate-300">ফিচার্ড প্রোডাক্ট</label>
              </div>

              <div className="flex items-center gap-2 mt-4.5">
                <input
                  type="checkbox"
                  id="pop"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="h-4 w-4 rounded text-emerald-500"
                />
                <label htmlFor="pop" className="font-bold text-slate-700 dark:text-slate-300">জনপ্রিয় প্রোডাক্ট</label>
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={isSaving}
            className={`w-full py-3.5 rounded-xl text-xs font-bold text-white shadow-md active:scale-95 transition-all flex items-center justify-center gap-1.5 ${
              isSaving
                ? 'opacity-70 cursor-not-allowed bg-slate-500'
                : `${getAccentBgClass()} ${getAccentHoverBgClass()}`
            }`}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                <span>সংরক্ষণ করা হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন...</span>
              </span>
            ) : (
              <>
                <Save className="h-4.5 w-4.5" />
                <span>প্রোডাক্ট ক্যাটালগে সংরক্ষণ করুন</span>
              </>
            )}
          </button>
        </form>
      ) : (
        /* PRODUCTS LIST & SEARCH DISPLAY */
        <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-6 backdrop-blur-md space-y-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="প্রোডাক্টের নাম বা ক্যাটেগরি দিয়ে খুঁজুন..."
              className="w-full rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950/50 px-4 py-2.5 pl-10 text-xs focus:outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            {filteredProducts.length > 0 ? (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-850 text-slate-400">
                    <th className="py-3 px-2 font-bold">প্রোডাক্ট বিবরণ</th>
                    <th className="py-3 px-2 font-bold">ক্যাটেগরি</th>
                    <th className="py-3 px-2 font-bold">মূল্য</th>
                    <th className="py-3 px-2 font-bold">অবস্থা</th>
                    <th className="py-3 px-2 font-bold text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850/60">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-colors">
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-3">
                          <img 
                            src={p.imageUrl} 
                            alt={p.name} 
                            className="h-10 w-10 rounded-lg object-cover bg-slate-100"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-[200px]">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">ID: {p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-2 font-semibold text-slate-500">
                        {getCategoryBanglaName(p.category)}
                      </td>
                      <td className="py-3.5 px-2">
                        <p className={`font-bold font-sans ${getAccentTextClass()}`}>{formatPrice(p.price)}</p>
                        {p.discountPrice && (
                          <p className="text-[10px] text-slate-400 line-through font-sans">{formatPrice(p.discountPrice)}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-bold ${
                          p.status === 'draft'
                            ? 'bg-amber-500/10 text-amber-600'
                            : 'bg-emerald-500/10 text-emerald-600'
                        }`}>
                          {p.status === 'draft' ? 'খসড়া' : 'প্রকাশিত'}
                        </span>
                      </td>
                      <td className="py-3.5 px-2">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEdit(p)}
                            className="rounded-lg p-2 text-slate-400 hover:text-emerald-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 active:scale-95 transition-all"
                            title="এডিট করুন"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`আপনি কি নিশ্চিতভাবে "${p.name}" প্রোডাক্টটি ক্যাটালগ থেকে সম্পূর্ণ ডিলিট করতে চান?`)) {
                                onDeleteProduct(p.id);
                              }
                            }}
                            className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 active:scale-95 transition-all"
                            title="ডিলিট করুন"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-slate-400 py-8 text-center">কোনো প্রোডাক্ট খুঁজে পাওয়া যায়নি।</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
