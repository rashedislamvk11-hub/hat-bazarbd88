import React, { useState, useEffect } from 'react';
import { Product, Review, Order } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getReviewsFromFirestore, saveReviewToFirestore } from '../lib/firestoreService';
import { formatPrice, toBanglaNumber, getCategoryBanglaName } from '../utils/helpers';
import { 
  ArrowLeft, Star, ShoppingCart, Check, Download, Info, ShieldCheck, 
  Tag, Share2, Clipboard, MessageSquare, Send, ThumbsUp, Plus, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProductDetailsProps {
  productId: string;
  products: Product[];
  orders: Order[];
  onBack: () => void;
  onNavigate: (view: string) => void;
  onViewProduct: (id: string) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  productId,
  products,
  orders,
  onBack,
  onNavigate,
  onViewProduct
}) => {
  const { getAccentBgClass, getAccentTextClass, getAccentBorderClass, getAccentHoverBgClass } = useTheme();
  const { addToCart, cartItems } = useCart();

  const product = products.find((p) => p.id === productId);

  if (!product) {
    return (
      <div className="py-16 text-center space-y-4">
        <h2 className="font-sans text-xl font-bold text-slate-900 dark:text-white">প্রোডাক্টটি খুঁজে পাওয়া যায়নি!</h2>
        <button onClick={onBack} className="text-sm font-bold text-rose-500 hover:underline">
          সকল প্রোডাক্টস-এ ফিরে যান
        </button>
      </div>
    );
  }

  // Gallery image selection
  const [activeImage, setActiveImage] = useState<string>(product.imageUrl);

  // Sharing states
  const [shareCopied, setShareCopied] = useState(false);

  // Auth context
  const { user } = useAuth();

  // Local state for reviews
  const [reviews, setReviews] = useState<Review[]>([]);

  // Default initial reviews if none exist in DB
  const defaultReviews: Review[] = [
    {
      id: 'rev-1',
      userId: 'user-1',
      userName: 'আরিফুল ইসলাম',
      rating: 5,
      comment: 'খুব চমৎকার প্লাগইন! ইনস্টলেশন অত্যন্ত সহজ ছিল এবং ডাউনলোড স্পিডও ভালো পেয়েছি। লাইফটাইম আপডেটের প্রতিশ্রুতি ভালো লেগেছে।',
      createdAt: '2026-07-10T12:00:00Z'
    },
    {
      id: 'rev-2',
      userId: 'user-2',
      userName: 'তসলিমা আক্তার',
      rating: 4,
      comment: 'ভিডিও কোর্সটি আসলেই বেশ কাজের। জটিল বিষয়গুলো খুবই সহজ ভাষায় বোঝানো হয়েছে। অ্যাডমিন ভাইয়ের সাহায্য অনেক পেয়েছি। ধন্যবাদ Hat Bazar!',
      createdAt: '2026-07-12T15:30:00Z'
    }
  ];

  // Load reviews from firestore on mount
  useEffect(() => {
    async function loadReviews() {
      try {
        const dbReviews = await getReviewsFromFirestore(product.id);
        if (dbReviews && dbReviews.length > 0) {
          setReviews(dbReviews);
        } else {
          setReviews(defaultReviews);
        }
      } catch (e) {
        console.error("Failed to load reviews:", e);
        setReviews(defaultReviews);
      }
    }
    loadReviews();
  }, [product.id]);

  // Review submission states
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewOrderId, setReviewOrderId] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Pre-populate reviewer name if authenticated user exists
  useEffect(() => {
    if (user && user.displayName) {
      setReviewName(user.displayName);
    } else {
      setReviewName('');
    }
  }, [user]);

  // Check if already in cart
  const isAlreadyInCart = cartItems.some((item) => item.product.id === product.id);

  // Get related products (same category, excluding current product)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  // Gallery images list (combining main image and any extra gallery images)
  const allGalleryImages = [product.imageUrl, ...(product.galleryImages || [])];

  const handleShareClick = () => {
    const fakeProductUrl = `${window.location.origin}/products/${product.id}`;
    navigator.clipboard.writeText(fakeProductUrl).then(() => {
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    }).catch(() => {
      // Fallback
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 3000);
    });
  };

  const handleBuyNow = () => {
    if (!isAlreadyInCart) {
      addToCart(product);
    }
    onNavigate('checkout');
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment || !reviewOrderId) {
      alert('অনুগ্রহ করে নাম, মন্তব্য এবং সঠিক অর্ডার আইডি প্রদান করুন!');
      return;
    }

    // Verify buyer status: order contains this product and matches entered order ID
    const matchedOrder = orders.find((o) => {
      const orderIdClean = o.id.trim().toLowerCase();
      const inputIdClean = reviewOrderId.trim().toLowerCase();
      const matchesId = orderIdClean === inputIdClean || 
                        orderIdClean.replace('hb-ord-', '') === inputIdClean ||
                        orderIdClean === 'hb-ord-' + inputIdClean;
      if (!matchesId) return false;
      return o.items.some((item) => item.productId === product.id);
    });

    if (!matchedOrder) {
      alert('ভুল অর্ডার আইডি! অনুগ্রহ করে পণ্যটি ক্রয়ের সময় প্রাপ্ত সঠিক অর্ডার আইডি (যেমন: HB-ORD-XXXXXX) ব্যবহার করুন। শুধুমাত্র এই প্রোডাক্টের ভেরিফাইড ক্রেতারা রিভিউ প্রদান করতে পারেন।');
      return;
    }

    const newReview: Review = {
      id: 'rev-' + Date.now(),
      userId: user?.uid || 'anonymous',
      userName: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      createdAt: new Date().toISOString(),
      orderId: matchedOrder.id,
      approved: false // Admin approval is mandatory before publishing
    };

    try {
      await saveReviewToFirestore(product.id, newReview);
      setReviews([newReview, ...reviews]);
      setReviewComment('');
      setReviewOrderId('');
      setReviewRating(5);
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 5000);
    } catch (e) {
      console.error("Failed to post review to Firestore:", e);
      // fallback save locally
      setReviews([newReview, ...reviews]);
      setReviewComment('');
      setReviewOrderId('');
      setReviewRating(5);
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 5000);
    }
  };

  // Calculate dynamic rating and reviews count (excluding those flagged pending approval)
  const approvedReviews = reviews.filter((r) => r.approved !== false);
  const totalRatingPoints = approvedReviews.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating = approvedReviews.length > 0 ? (totalRatingPoints / approvedReviews.length).toFixed(1) : '5.0';

  // Choose display price (discounted or original)
  const finalPrice = product.discountPrice || product.price;
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <div className="space-y-12 pb-16 font-sans">
      
      {/* Back navigation & Share action */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          পেছনে ফিরে যান
        </button>

        <button
          onClick={handleShareClick}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 backdrop-blur-sm hover:text-emerald-500 hover:border-emerald-500/30 transition-all active:scale-95 relative"
        >
          {shareCopied ? (
            <>
              <Check className="h-4 w-4 text-emerald-500 animate-scale" />
              <span className="text-emerald-500">লিংক কপি হয়েছে!</span>
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 text-slate-400" />
              <span>শেয়ার করুন</span>
            </>
          )}
        </button>
      </div>

      {/* Main product showcase */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Side: Product Images, Gallery, Reviews & Descriptions */}
        <div className="lg:col-span-7 space-y-7">
          
          {/* Showcase Main Image and Gallery list */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40 p-4 backdrop-blur-md space-y-4">
            <div className="overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-100 dark:border-slate-900 aspect-video flex items-center justify-center">
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover shadow-inner hover:scale-102 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Gallery thumbnails */}
            {allGalleryImages.length > 1 && (
              <div className="flex flex-wrap gap-2.5 pt-1">
                {allGalleryImages.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(imgUrl)}
                    className={`h-12 w-20 rounded-lg overflow-hidden border-2 bg-white dark:bg-slate-900 transition-all ${
                      activeImage === imgUrl 
                        ? 'border-rose-500 scale-105' 
                        : 'border-slate-200/60 dark:border-slate-800 hover:border-slate-400'
                    }`}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`Gallery view ${index + 1}`} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Description & Overview */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-6 backdrop-blur-md space-y-4">
            <h2 className="font-sans text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              প্রোডাক্টের বিস্তারিত বিবরণ
            </h2>
            <p className="text-xs md:text-sm leading-relaxed text-slate-600 dark:text-slate-300 whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Bullet Features list */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-6 backdrop-blur-md space-y-4">
            <h2 className="font-sans text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              মূল বৈশিষ্ট্যসমূহ
            </h2>
            <ul className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
              {product.features.map((feat, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 ${getAccentTextClass()}`}>
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <span className="leading-snug">{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Review Section */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-6 backdrop-blur-md space-y-6">
            <h2 className="font-sans text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between">
              <span>ক্রেতাদের মতামত ও রিভিউসমূহ ({toBanglaNumber(approvedReviews.length)} টি)</span>
              <span className="flex items-center gap-1 text-amber-500 text-sm">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-black font-sans">{toBanglaNumber(averageRating)}</span>/৫.০
              </span>
            </h2>

            {/* Existing reviews list */}
            <div className="space-y-4.5 divide-y divide-slate-100 dark:divide-slate-800/60">
              {approvedReviews.map((rev) => (
                <div key={rev.id} className="pt-4.5 first:pt-0 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      {rev.userName}
                      <span className="inline-flex items-center gap-0.5 rounded bg-emerald-500/10 px-1.5 py-0.2 text-[8px] font-bold text-emerald-600 border border-emerald-500/10">
                        <ShieldCheck className="h-2.5 w-2.5 animate-pulse" />
                        Verified Buyer
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(rev.createdAt).toLocaleDateString('bn-BD')}
                    </span>
                  </div>
                  
                  {/* Rating Stars */}
                  <div className="flex gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <Star 
                        key={idx} 
                        className={`h-3 w-3 ${idx < rev.rating ? 'fill-current text-amber-400' : 'text-slate-200 dark:text-slate-800'}`} 
                      />
                    ))}
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed pt-0.5">
                    {rev.comment}
                  </p>
                </div>
              ))}
              {approvedReviews.length === 0 && (
                <p className="text-slate-400 py-3 text-center text-xs">এই প্রোডাক্টটির এখনো কোনো অনুমোদিত রিভিউ নেই।</p>
              )}
            </div>

            {/* Write a review form */}
            <form onSubmit={handleAddReview} className="p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850 space-y-4">
              <h3 className="text-xs font-black text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="h-4 w-4 text-rose-500" />
                একটি নতুন রিভিউ লিখুন
              </h3>

              {reviewSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/35 border border-emerald-500/20 text-[11px] leading-relaxed font-bold">
                  আপনার রিভিউটি সফলভাবে জমা হয়েছে এবং এটি মডারেশনের জন্য প্রক্রিয়াধীন রয়েছে। অ্যাডমিন অনুমোদন করার পর এটি ওয়েবসাইটে প্রদর্শিত হবে।
                </div>
              )}

              <div className="space-y-3.5 text-xs">
                
                {/* Notice Badge */}
                <div className="rounded-xl bg-amber-500/5 p-3 border border-amber-500/10 text-[10px] text-slate-500 dark:text-slate-400 flex gap-2">
                  <ShieldAlert className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>
                    শুধুমাত্র এই ডিজিটাল প্রোডাক্টটি ক্রয়কারী ভেরিফাইড গ্রাহকগণ সঠিক অর্ডারের ট্র্যাকিং আইডি দিয়ে রিভিউ প্রদান করতে পারবেন। রিভিউ প্রকাশের আগে অ্যাডমিন মডারেশন করা হবে।
                  </span>
                </div>

                {/* Rating selection stars */}
                <div className="space-y-1">
                  <label className="text-slate-500 block font-bold">আপনার রেটিং দিন:</label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setReviewRating(starVal)}
                        className="text-amber-400 focus:outline-none transition-transform hover:scale-110"
                        title={`${starVal} স্টার`}
                      >
                        <Star className={`h-5 w-5 ${starVal <= reviewRating ? 'fill-current text-amber-400' : 'text-slate-300 dark:text-slate-850'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order ID verification (Verified Buyer constraint) */}
                <div className="space-y-1">
                  <label className="text-slate-500 block font-bold">ক্রয়কৃত অর্ডারের ট্র্যাকিং আইডি *</label>
                  <input
                    type="text"
                    required
                    value={reviewOrderId}
                    onChange={(e) => setReviewOrderId(e.target.value)}
                    placeholder="যেমন: HB-ORD-117283"
                    className="w-full rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs focus:outline-none focus:border-slate-400 text-slate-950 dark:text-white font-mono"
                  />
                </div>

                {/* Name */}
                <div className="space-y-1">
                  <label className="text-slate-500 block font-bold">আপনার নাম:</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="যেমন: সাকিব হাসান"
                    className="w-full rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs focus:outline-none focus:border-slate-400 text-slate-950 dark:text-white"
                  />
                </div>

                {/* Comment comment */}
                <div className="space-y-1">
                  <label className="text-slate-500 block font-bold">আপনার মন্তব্য ও অভিজ্ঞতা:</label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="পণ্যটি কেমন ছিল? কাজের দক্ষতা কেমন বাড়িয়েছে?"
                    className="w-full rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 px-3.5 py-2 text-xs focus:outline-none focus:border-slate-400 text-slate-950 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl font-bold text-white shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer ${getAccentBgClass()} ${getAccentHoverBgClass()}`}
                >
                  <Send className="h-3.5 w-3.5" />
                  রিভিউ জমা দিন (ভেরিফিকেশনের জন্য)
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Buying Widget, Specials & Tech Details */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Pricing & Buying Widget */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/60 dark:bg-slate-900/50 p-6 shadow-xl backdrop-blur-md space-y-5">
            <div>
              <span className="rounded-full bg-slate-950 dark:bg-slate-800 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider font-sans">
                {getCategoryBanglaName(product.category)}
              </span>
              <h1 className="mt-3 font-sans text-base md:text-lg font-black leading-snug text-slate-950 dark:text-white">
                {product.name}
              </h1>
              {product.shortDescription && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-2">
                  {product.shortDescription}
                </p>
              )}
            </div>

            {/* Ratings & sales counts */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-slate-100 dark:border-slate-850 py-3.5 text-xs">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span className="font-extrabold font-sans">{toBanglaNumber(averageRating)}</span>
                <span className="text-slate-400">({toBanglaNumber(reviews.length)} টি রিভিউ)</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <span className="font-medium text-slate-500 dark:text-slate-400">
                <span className={`font-bold ${getAccentTextClass()}`}>{toBanglaNumber(product.salesCount + (reviews.length - 2))}</span> বার বিক্রিত
              </span>
            </div>

            {/* Price section supporting Discount */}
            <div className="space-y-1 bg-amber-500/5 dark:bg-amber-500/10 p-4 rounded-xl border border-amber-500/15 dark:border-amber-500/20">
              <div className="flex items-baseline justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">লাইসেন্স বা কোর্স ফি:</span>
                <div className="text-right">
                  {hasDiscount && (
                    <div className="text-[11px] text-slate-400 line-through font-sans mb-0.5">
                      {formatPrice(product.price)}
                    </div>
                  )}
                  <span className={`text-xl md:text-2xl font-black ${getAccentTextClass()}`}>
                    {formatPrice(finalPrice)}
                  </span>
                </div>
              </div>
              {hasDiscount && (
                <div className="flex items-center justify-between text-[10px] text-emerald-500 font-bold pt-1.5 border-t border-dashed border-amber-500/15 dark:border-amber-500/30">
                  <span>সর্বমোট সেভিংস:</span>
                  <span>{toBanglaNumber(discountPercent)}% ছাড় (৳{toBanglaNumber(product.price - product.discountPrice!)} সাশ্রয়)</span>
                </div>
              )}
            </div>

            {/* Dual CTAs: "Buy Now" and "Add to Cart" */}
            <div className="space-y-2.5">
              <button
                onClick={handleBuyNow}
                className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all duration-300 hover:scale-102 active:scale-98 shadow-md cursor-pointer ${getAccentBgClass()} ${getAccentHoverBgClass()} text-white`}
              >
                <ShoppingCart className="h-4.5 w-4.5" />
                <span>সরাসরি কিনুন (Buy Now)</span>
              </button>

              <button
                onClick={() => addToCart(product)}
                disabled={isAlreadyInCart}
                className={`w-full py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all active:scale-[0.98] cursor-pointer ${
                  isAlreadyInCart
                    ? 'bg-slate-150/40 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border-slate-200 dark:border-slate-800'
                    : 'border-slate-200 hover:border-slate-400 text-slate-700 dark:text-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                }`}
              >
                {isAlreadyInCart ? (
                  <>
                    <Check className="h-4.5 w-4.5 text-emerald-500" />
                    <span>কার্টে যোগ করা হয়েছে</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4.5 w-4.5 text-slate-500" />
                    <span>কার্টে যোগ করুন</span>
                  </>
                )}
              </button>
            </div>

            {/* Trust Badges inside Buying Panel */}
            <div className="pt-2 space-y-2.5 text-[10px] text-slate-400 dark:text-slate-500 pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>পেমেন্ট অনুমোদনের সাথে সাথে ইনস্ট্যান্ট ডাউনলোড ফাইল</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>ম্যালওয়্যার ও ভাইরাস মুক্ত সম্পূর্ণ অরিজিনাল লাইসেন্স ফাইল</span>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-850 space-y-2">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block uppercase tracking-wider">সোশ্যাল মিডিয়াতে শেয়ার করুন:</span>
              <div className="flex gap-2">
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/products/${product.id}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-50 hover:text-white transition-all font-bold text-center text-[10px] flex items-center justify-center gap-1.5 active:scale-95 border border-blue-500/10 cursor-pointer"
                >
                  Facebook
                </a>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Hat Bazar-এর অসাধারণ প্রিমিয়াম প্রোডাক্টটি দেখুন: ${product.name} - ${window.location.origin}/products/${product.id}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all font-bold text-center text-[10px] flex items-center justify-center gap-1.5 active:scale-95 border border-emerald-500/10 cursor-pointer"
                >
                  WhatsApp
                </a>
                <a
                  href={`https://telegram.me/share/url?url=${encodeURIComponent(`${window.location.origin}/products/${product.id}`)}&text=${encodeURIComponent(product.name)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 rounded-xl bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white transition-all font-bold text-center text-[10px] flex items-center justify-center gap-1.5 active:scale-95 border border-sky-500/10 cursor-pointer"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>

          {/* Technical Specs Details */}
          <div className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 p-6 backdrop-blur-md space-y-4">
            <h3 className="font-sans text-xs font-bold text-slate-950 dark:text-white uppercase tracking-wider">
              প্রোডাক্ট ইনফরমেশন (Technical Specs)
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400 dark:text-slate-500">সংস্করণ (Version)</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{product.version || 'v1.0.0'}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400 dark:text-slate-500">ফাইল সাইজ (Size)</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{product.fileSize || '১০.৫ MB'}</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400 dark:text-slate-500">ডেলিভারি মেথড</span>
                <span className="font-semibold text-emerald-500">ইনস্ট্যান্ট ডাউনলোড</span>
              </div>
              <div className="flex justify-between py-2.5">
                <span className="text-slate-400 dark:text-slate-500">আপডেট পলিসি</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">আজীবন ফ্রি আপডেট</span>
              </div>
              {product.tags && product.tags.length > 0 && (
                <div className="py-3">
                  <span className="text-slate-400 dark:text-slate-500 block mb-2">ট্যাগসমূহ</span>
                  <div className="flex flex-wrap gap-1.5">
                    {product.tags.map((t, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 rounded bg-slate-50 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-sans text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                        <Tag className="h-2.5 w-2.5" />
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="font-sans text-base md:text-lg font-black text-slate-950 dark:text-white">
              সম্পর্কিত অন্যান্য প্রোডাক্টস
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              এই ক্যাটাগরির আরও কিছু দুর্দান্ত ডিজিটাল প্রোডাক্ট আপনার জন্য নিচে দেওয়া হলো
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedProducts.map((p) => (
              <div 
                key={p.id} 
                onClick={() => {
                  onViewProduct(p.id);
                  setActiveImage(p.imageUrl);
                }} 
                className="cursor-pointer group space-y-2 border border-slate-100/70 dark:border-slate-800/60 p-3 rounded-xl bg-white/20 dark:bg-slate-900/10 hover:border-slate-300 transition-all hover:scale-101"
              >
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-104 transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="font-sans text-xs font-bold leading-tight text-slate-900 dark:text-slate-100 line-clamp-1">
                  {p.name}
                </h3>
                <span className={`text-xs font-extrabold mt-1 block ${getAccentTextClass()}`}>
                  {formatPrice(p.discountPrice || p.price)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
