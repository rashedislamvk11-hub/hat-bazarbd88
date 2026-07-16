import React from 'react';
import { Product } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { formatPrice, toBanglaNumber, getCategoryBanglaName } from '../utils/helpers';
import { Star, ShoppingCart, Info, Percent, Check } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
  onViewDetails: (productId: string) => void;
  onBuyNow?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails, onBuyNow }) => {
  const { getAccentBgClass, getAccentTextClass, getAccentHoverBgClass } = useTheme();
  const { addToCart, cartItems } = useCart();

  const isAlreadyInCart = cartItems.some((item) => item.product.id === product.id);

  // Discount calculation
  const hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
  const finalPrice = hasDiscount ? product.discountPrice! : product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-md hover:shadow-xl dark:shadow-slate-950/15 transition-all duration-300"
    >
      {/* Product Image Panel */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-104 transition-transform duration-500"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 rounded-full bg-slate-950/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white shadow-sm font-sans uppercase">
          {getCategoryBanglaName(product.category)}
        </span>

        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-3 right-3 rounded-lg bg-rose-500 text-[10px] font-black text-white px-2 py-1 shadow-sm flex items-center gap-0.5 animate-pulse">
            <Percent className="h-3 w-3 stroke-[3]" />
            {toBanglaNumber(discountPercent)}% ছাড়
          </span>
        )}
      </div>

      {/* Product Body */}
      <div className="flex flex-1 flex-col p-5 space-y-2.5">
        
        {/* Product Name */}
        <h3 
          onClick={() => onViewDetails(product.id)}
          className="font-sans text-sm md:text-base font-bold leading-snug text-slate-950 dark:text-slate-50 group-hover:text-rose-500 dark:group-hover:text-rose-400 cursor-pointer line-clamp-1 transition-colors"
        >
          {product.name}
        </h3>

        {/* Rating Stars line */}
        <div className="flex items-center gap-1 text-amber-500 text-[11px]">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star 
                key={idx} 
                className={`h-3.5 w-3.5 ${idx < Math.round(product.rating) ? 'fill-current text-amber-400' : 'text-slate-200 dark:text-slate-800'}`} 
              />
            ))}
          </div>
          <span className="font-extrabold ml-1 text-slate-800 dark:text-slate-200">{toBanglaNumber(product.rating)}</span>
          <span className="text-[10px] text-slate-400 dark:text-slate-500">
            ({toBanglaNumber(product.reviewsCount)} টি রিভিউ)
          </span>
        </div>

        {/* Short description / line clamp */}
        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1">
          {product.shortDescription || product.description}
        </p>

        {/* Product specs row (version, size) */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 dark:text-slate-500 py-1.5 border-t border-dashed border-slate-100 dark:border-slate-850">
          <span>ভার্সন: {product.version || 'v1.0.0'}</span>
          <span>সাইজ: {product.fileSize || '১০.৫ MB'}</span>
        </div>

        {/* Pricing & Call To Action (CTA) row */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          
          {/* Price Container */}
          <div className="flex flex-col bg-amber-50 dark:bg-amber-950/20 px-3 py-1.5 rounded-xl border border-amber-200/60 dark:border-amber-900/30 text-amber-600 dark:text-amber-400 shadow-sm shrink-0 font-sans">
            {hasDiscount && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 line-through leading-none mb-1 font-bold">
                {formatPrice(product.price)}
              </span>
            )}
            <span className="text-base sm:text-lg font-black leading-none">
              {formatPrice(finalPrice)}
            </span>
          </div>

          {/* Buttons: Details, Add to Cart, Buy Now */}
          <div className="flex flex-1 items-center gap-1.5 justify-end">
            {/* View details button */}
            <button
              onClick={() => onViewDetails(product.id)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors border border-slate-100 dark:border-slate-750"
              title="বিস্তারিত দেখুন"
            >
              <Info className="h-4 w-4" />
            </button>

            {/* Add to cart icon button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              disabled={isAlreadyInCart}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all active:scale-95 border ${
                isAlreadyInCart
                  ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 dark:bg-emerald-950/20 dark:border-emerald-500/20'
                  : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-750'
              }`}
              title={isAlreadyInCart ? 'কার্টে যুক্ত করা হয়েছে' : 'কার্টে যোগ করুন'}
            >
              {isAlreadyInCart ? (
                <Check className="h-4 w-4 stroke-[3]" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
            </button>

            {/* Instant checkout button: "এখনি কিনুন" */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (!isAlreadyInCart) {
                  addToCart(product);
                }
                if (onBuyNow) {
                  onBuyNow();
                }
              }}
              className={`flex-grow sm:flex-grow-0 flex h-9 items-center justify-center gap-1 px-3.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${getAccentBgClass()} ${getAccentHoverBgClass()} text-white shadow-sm`}
            >
              <span>এখনি কিনুন</span>
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
};
