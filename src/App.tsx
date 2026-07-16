import React, { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AdminSettingsProvider, useAdminSettings } from './context/AdminSettingsContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { initTracking, trackPageView, trackViewContent } from './utils/tracking';
import { updateSEO } from './utils/seo';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FloatingChat } from './components/FloatingChat';
import { AdminPinModal } from './components/AdminPinModal';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetails } from './pages/ProductDetails';
import { Checkout } from './pages/Checkout';
import { Login } from './pages/Login';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Support } from './pages/Support';

import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './data/mockData';
import { Product, Order, Category } from './types';
import { formatPrice, toBanglaNumber, getCategoryBanglaName } from './utils/helpers';
import { getProductsFromFirestore, saveProductToFirestore, deleteProductFromFirestore, getOrdersFromFirestore, updateOrderStatusInFirestore, getCategoriesFromFirestore } from './lib/firestoreService';
import { ShoppingBag, X, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Seeding standard test orders so dashboards are beautiful and instantly interactive
const INITIAL_ORDERS: Order[] = [
  {
    id: 'HB-ORD-582910',
    userId: 'user-uid-456', // সাকিব হাসান (কাস্টমার)
    userName: 'সাকিব হাসান',
    userEmail: 'user@hatbazar.com',
    userPhone: '01712345678',
    userWhatsApp: '01712345678',
    items: [
      {
        productId: 'prod-3',
        name: 'জিরো থেকে ফ্রিল্যান্সিং গাইডবুক (প্রফেশনল বাংলা ই-বুক)',
        price: 320,
        downloadUrl: 'https://example.com/downloads/freelancing-guidebook-2026.pdf',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop',
      }
    ],
    totalAmount: 320,
    paymentMethod: 'bkash',
    paymentNumber: '01712345678',
    transactionId: '8N9X8W7Y2A',
    status: 'approved',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
  },
  {
    id: 'HB-ORD-117283',
    userId: 'guest-uid-999',
    userName: 'তাহমিদ আহমেদ',
    userEmail: 'tahmid@gmail.com',
    userPhone: '01898765432',
    userWhatsApp: '01898765432',
    items: [
      {
        productId: 'prod-2',
        name: 'woocommerce বিকাশ-নগদ-রকেট অটোমেটেড পেমেন্ট গেটওয়ে প্লাগইন',
        price: 850,
        downloadUrl: 'https://example.com/downloads/bkash-nagad-rocket-gateway-v2.1.zip',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
      }
    ],
    totalAmount: 850,
    paymentMethod: 'nagad',
    paymentNumber: '01898765432',
    transactionId: '9K4J5L2M1O',
    status: 'pending',
    createdAt: new Date().toISOString(), // Just now
  }
];

function MainAppContent() {
  const { getAccentBgClass, getAccentTextClass, getAccentHoverBgClass } = useTheme();
  const { user, isAdmin } = useAuth();
  const { cartItems, removeFromCart, cartTotal, clearCart } = useCart();
  const { settings } = useAdminSettings();

  // Page Routing State
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [supportTab, setSupportTab] = useState<'faq' | 'contact' | 'privacy' | 'terms' | 'refund'>('faq');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  // Database lists stored in localStorage for full interactive persistence!
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('hb-persistent-orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_ORDERS;
      }
    }
    return INITIAL_ORDERS;
  });

  // Initialize tracking scripts
  useEffect(() => {
    initTracking();
  }, [settings]);

  // Track page view event and update dynamic SEO headers & JSON-LD schema
  useEffect(() => {
    trackPageView(currentView);
    const activeProduct = currentView === 'product-details' ? products.find(p => p.id === selectedProductId) : undefined;
    updateSEO(currentView, settings, activeProduct);
  }, [currentView, selectedProductId, settings, products]);

  // Load products, orders, and categories from Firestore whenever view changes
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getProductsFromFirestore();
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (e) {
        console.error("Error loading products from Firestore:", e);
      }

      try {
        const cats = await getCategoriesFromFirestore();
        if (cats && cats.length > 0) {
          setCategories(cats);
        }
      } catch (e) {
        console.error("Error loading categories from Firestore:", e);
      }

      try {
        const oData = await getOrdersFromFirestore();
        if (oData && oData.length > 0) {
          setOrders(oData);
        }
      } catch (e) {
        console.error("Error loading orders from Firestore:", e);
      }
    };
    loadData();
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('hb-persistent-orders', JSON.stringify(orders));
  }, [orders]);

  // Handle support policies hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#privacy') {
        setSupportTab('privacy');
        setCurrentView('support');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#terms') {
        setSupportTab('terms');
        setCurrentView('support');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#refund') {
        setSupportTab('refund');
        setCurrentView('support');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#faq') {
        setSupportTab('faq');
        setCurrentView('support');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#contact') {
        setSupportTab('contact');
        setCurrentView('support');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#dashboard' || hash === '#order' || hash === '#tracking') {
        setCurrentView('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Run once on load if user opened with a hash

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle routing state changes
  const handleNavigate = (view: string, filterCategory?: string) => {
    setCurrentView(view);
    if (filterCategory) {
      setCategoryFilter(filterCategory);
    } else if (view === 'products') {
      setCategoryFilter(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewProductDetails = (id: string) => {
    setSelectedProductId(id);
    setCurrentView('product-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Track ViewContent event
    const prod = products.find(p => p.id === id);
    if (prod) {
      trackViewContent(prod);
    }
  };

  // State modification events
  const handleAddProduct = async (newProduct: Product) => {
    try {
      await saveProductToFirestore(newProduct);
      setProducts((prev) => [newProduct, ...prev]);
    } catch (e) {
      console.error("Error saving product:", e);
      throw e;
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      await saveProductToFirestore(updatedProduct);
      setProducts((prev) => prev.map((p) => p.id === updatedProduct.id ? updatedProduct : p));
    } catch (e) {
      console.error("Error updating product:", e);
      throw e;
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProductFromFirestore(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error("Error deleting product:", e);
    }
  };

  const handleAddOrder = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
  };

  const handleUpdateOrderStatus = async (
    orderId: string, 
    status: 'pending' | 'approved' | 'rejected' | 'completed',
    customDownloadUrl?: string
  ) => {
    const approvedAt = status === 'approved' ? new Date().toISOString() : undefined;
    try {
      await updateOrderStatusInFirestore(orderId, status, approvedAt, customDownloadUrl);
      setOrders((prev) =>
        prev.map((ord) => {
          if (ord.id === orderId) {
            return {
              ...ord,
              status,
              ...(approvedAt && { approvedAt }),
              ...(customDownloadUrl && { downloadUrl: customDownloadUrl }),
            };
          }
          return ord;
        })
      );
    } catch (e) {
      console.error("Error updating order status in App.tsx:", e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300 selection:bg-emerald-500/20">
      
      {/* Dynamic Header Component */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenPinModal={() => setIsPinModalOpen(true)}
      />

      {/* Main Content Body */}
      <main className="flex-grow mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + selectedProductId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {currentView === 'home' && (
              <Home
                products={products}
                categories={categories}
                onNavigate={handleNavigate}
                onViewProduct={handleViewProductDetails}
              />
            )}

            {currentView === 'products' && (
              <Products
                products={products}
                categories={categories}
                onViewProduct={handleViewProductDetails}
                selectedCategoryFilter={categoryFilter}
                onClearCategoryFilter={() => setCategoryFilter(null)}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'product-details' && (
              <ProductDetails
                productId={selectedProductId}
                products={products}
                orders={orders}
                onBack={() => handleNavigate('products')}
                onNavigate={handleNavigate}
                onViewProduct={handleViewProductDetails}
              />
            )}

            {currentView === 'checkout' && (
              <Checkout
                onNavigate={handleNavigate}
                onAddOrder={handleAddOrder}
              />
            )}

            {currentView === 'login' && (
              <Login
                onBack={() => handleNavigate('home')}
              />
            )}

            {currentView === 'dashboard' && (
              <UserDashboard
                orders={orders}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'admin' && isAdmin && (
              <AdminDashboard
                products={products}
                orders={orders}
                onAddProduct={handleAddProduct}
                onUpdateProduct={handleUpdateProduct}
                onDeleteProduct={handleDeleteProduct}
                onUpdateOrderStatus={handleUpdateOrderStatus}
              />
            )}

            {currentView === 'support' && (
              <Support
                initialTab={supportTab}
                onNavigate={handleNavigate}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Dynamic Footer Component */}
      <Footer onOpenPinModal={() => setIsPinModalOpen(true)} />

      {/* Admin Verification Passcode Modal */}
      <AdminPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={() => handleNavigate('admin')}
      />

      {/* Floating Chat & Support Assistance */}
      <FloatingChat />

      {/* Sliding Shopping Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />

            <div className="pointer-events-none absolute inset-y-0 right-0 flex max-w-full pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.35 }}
                className="pointer-events-auto w-screen max-w-md"
              >
                <div className="flex h-full flex-col overflow-y-scroll border-l border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-2xl p-6 space-y-6">
                  
                  {/* Cart Drawer Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h2 className="text-base font-bold text-slate-950 dark:text-white flex items-center gap-2">
                      <ShoppingBag className={`h-5 w-5 ${getAccentTextClass()}`} />
                      শপিং কার্ট
                    </h2>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Cart List */}
                  <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850">
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <div key={item.product.id} className="flex py-4.5 gap-4">
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="h-14 w-20 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-grow min-w-0 space-y-1">
                            <h4 className="font-sans text-xs font-bold text-slate-950 dark:text-white line-clamp-1">
                              {item.product.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-sans block uppercase">
                              {getCategoryBanglaName(item.product.category)}
                            </p>
                            <span className={`text-xs font-black block ${getAccentTextClass()}`}>
                              {formatPrice(item.product.price)}
                            </span>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="rounded-xl p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 self-center active:scale-95 transition-all"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="py-16 text-center text-slate-400 space-y-2">
                        <ShoppingBag className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-800" />
                        <p className="text-xs">আপনার কার্টটি সম্পূর্ণ খালি রয়েছে!</p>
                      </div>
                    )}
                  </div>

                  {/* Cart Footer Calculations */}
                  {cartItems.length > 0 && (
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-5 space-y-4">
                      <div className="flex items-center justify-between text-xs font-sans">
                        <span className="text-slate-500">মোট পণ্যসংখ্যা:</span>
                        <span className="font-bold">{toBanglaNumber(cartItems.length)} টি</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs text-slate-500 font-sans">সর্বমোট মূল্য (Subtotal):</span>
                        <span className={`text-lg font-black ${getAccentTextClass()}`}>
                          {formatPrice(cartTotal)}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setIsCartOpen(false);
                          handleNavigate('checkout');
                        }}
                        className={`w-full py-3.5 rounded-xl font-bold text-xs text-white shadow-lg flex items-center justify-center gap-1.5 active:scale-95 transition-all ${getAccentBgClass()} ${getAccentHoverBgClass()}`}
                      >
                        চেকআউট-এ যান
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AdminSettingsProvider>
        <AuthProvider>
          <CartProvider>
            <MainAppContent />
          </CartProvider>
        </AuthProvider>
      </AdminSettingsProvider>
    </ThemeProvider>
  );
}
