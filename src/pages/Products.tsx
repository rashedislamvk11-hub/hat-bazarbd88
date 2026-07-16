import React, { useState, useEffect } from 'react';
import { Product, Category } from '../types';
import { INITIAL_CATEGORIES } from '../data/mockData';
import { useTheme } from '../context/ThemeContext';
import { ProductCard } from '../components/ProductCard';
import { toBanglaNumber } from '../utils/helpers';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw } from 'lucide-react';

interface ProductsProps {
  products: Product[];
  categories: Category[];
  onViewProduct: (productId: string) => void;
  selectedCategoryFilter?: string | null;
  onClearCategoryFilter?: () => void;
  onNavigate: (view: string) => void;
}

export const Products: React.FC<ProductsProps> = ({
  products,
  categories,
  onViewProduct,
  selectedCategoryFilter = null,
  onClearCategoryFilter,
  onNavigate
}) => {
  const { getAccentBgClass, getAccentTextClass, getAccentBorderClass, getAccentHoverBgClass } = useTheme();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular'); // popular, rating, price-asc, price-desc

  // Sync external category filter from Home page clicks
  useEffect(() => {
    if (selectedCategoryFilter) {
      setActiveCategory(selectedCategoryFilter);
    }
  }, [selectedCategoryFilter]);

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    if (onClearCategoryFilter && catId !== selectedCategoryFilter) {
      onClearCategoryFilter();
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
    setSortBy('popular');
    if (onClearCategoryFilter) {
      onClearCategoryFilter();
    }
  };

  // Filter products based on query and active category
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = activeCategory === 'all' || product.category === activeCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.salesCount - a.salesCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      return 0;
    });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Title Header */}
      <div className="space-y-1">
        <h1 className="font-sans text-2xl md:text-3xl font-black text-slate-950 dark:text-white">
          ডিজিটাল প্রোডাক্ট কালেকশন
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          আমাদের ভেরিফাইড এবং প্রিমিয়াম কালেকশন থেকে আপনার প্রয়োজনীয় ডিজিটাল প্রোডাক্টটি নির্বাচন করুন।
        </p>
      </div>

      {/* Control Panel: Search & Sorting */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Search Input */}
        <div className="relative lg:col-span-2">
          <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="প্রোডাক্টের নাম, কীওয়ার্ড বা ট্যাগ দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 py-3.5 pr-4 pl-12 text-sm font-medium text-slate-900 dark:text-white backdrop-blur-md placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        {/* Sorting Dropdown */}
        <div className="relative">
          <ArrowUpDown className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full appearance-none rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 py-3.5 pr-10 pl-12 text-sm font-bold text-slate-700 dark:text-slate-200 backdrop-blur-md focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            <option value="popular">জনপ্রিয়তা অনুযায়ী (বেস্ট সেলিং)</option>
            <option value="rating">রেটিং অনুযায়ী (সর্বোচ্চ রেটেড)</option>
            <option value="price-asc">মূল্য: কম থেকে বেশি</option>
            <option value="price-desc">মূল্য: বেশি থেকে কম</option>
          </select>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-5">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeCategory === 'all'
              ? `${getAccentBgClass()} text-white shadow-md shadow-emerald-500/10`
              : 'bg-white/50 border border-slate-100 text-slate-600 hover:bg-slate-50 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
          }`}
        >
          সব প্রোডাক্টস
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-4.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === cat.id
                ? `${getAccentBgClass()} text-white shadow-md shadow-emerald-500/10`
                : 'bg-white/50 border border-slate-100 text-slate-600 hover:bg-slate-50 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewProduct}
              onBuyNow={() => onNavigate('checkout')}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-900/20 py-16 text-center backdrop-blur-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-400">
            <Search className="h-6 w-6" />
          </div>
          <h3 className="mt-4 font-sans text-base font-bold text-slate-900 dark:text-white">
            দুঃখিত, কোনো প্রোডাক্ট পাওয়া যায়নি!
          </h3>
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500 max-w-sm">
            আপনার অনুসন্ধান বা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন অথবা নিচের বাটনে চাপ দিয়ে রিসেট করুন।
          </p>
          <button
            onClick={handleResetFilters}
            className={`mt-5 flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold rounded-xl text-white shadow-md transition-all ${getAccentBgClass()} ${getAccentHoverBgClass()}`}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            রিসেট ফিল্টার
          </button>
        </div>
      )}

      {/* Stats footer indicator */}
      {filteredProducts.length > 0 && (
        <p className="text-center text-xs font-sans text-slate-400 dark:text-slate-500">
          মোট <span className={`font-bold ${getAccentTextClass()}`}>{toBanglaNumber(filteredProducts.length)}</span> টি ডিজিটাল প্রোডাক্ট প্রদর্শিত হচ্ছে
        </p>
      )}

    </div>
  );
};
