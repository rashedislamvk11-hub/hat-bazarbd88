import { 
  collection, 
  getDocs, 
  getDoc,
  setDoc, 
  doc, 
  deleteDoc, 
  updateDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, app, isMockConfig, OperationType, handleFirestoreError } from './firebase';
import { Product, Order, UserProfile, Category, AdminSettings, Review, Coupon, Banner, ActivityLog } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, DEFAULT_ADMIN_SETTINGS } from '../data/mockData';

// Collection name
const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const USERS_COLLECTION = 'users';
const REVIEWS_COLLECTION = 'reviews';
const CATEGORIES_COLLECTION = 'categories';
const SETTINGS_COLLECTION = 'settings';
const COUPONS_COLLECTION = 'coupons';
const BANNERS_COLLECTION = 'banners';

// Storage initialization
const storage = !isMockConfig && app ? getStorage(app) : null;

/**
 * Fetch all products from Firestore or fallback to localStorage / mockData
 */
export async function getProductsFromFirestore(): Promise<Product[]> {
  if (isMockConfig || !db) {
    // Sandbox / Mock fallback
    const saved = localStorage.getItem('hb-persistent-products');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_PRODUCTS;
      }
    }
    // Seed localStorage if empty
    localStorage.setItem('hb-persistent-products', JSON.stringify(INITIAL_PRODUCTS));
    return INITIAL_PRODUCTS;
  }

  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef);
    const querySnapshot = await getDocs(q);
    const productsList: Product[] = [];
    
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      productsList.push({
        id: docSnap.id,
        name: data.name || '',
        description: data.description || '',
        shortDescription: data.shortDescription || '',
        price: Number(data.price) || 0,
        discountPrice: data.discountPrice ? Number(data.discountPrice) : undefined,
        category: data.category || 'tools',
        imageUrl: data.imageUrl || '',
        galleryImages: data.galleryImages || [],
        downloadUrl: data.downloadUrl || '',
        fileSize: data.fileSize || '0 MB',
        version: data.version || 'v1.0.0',
        rating: Number(data.rating) || 5.0,
        reviewsCount: Number(data.reviewsCount) || 0,
        salesCount: Number(data.salesCount) || 0,
        tags: data.tags || [],
        features: data.features || [],
        productType: data.productType || 'zip',
        status: data.status || 'published',
        isFeatured: data.isFeatured ?? false,
        isPopular: data.isPopular ?? false,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString(),
      });
    });

    // If Firestore is completely empty, we can optionally pre-seed it or return empty
    if (productsList.length === 0) {
      // Seed first time for convenience
      console.log("Firestore empty, seeding with initial mock products...");
      for (const p of INITIAL_PRODUCTS) {
        await saveProductToFirestore(p);
      }
      return INITIAL_PRODUCTS;
    }

    return productsList;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, PRODUCTS_COLLECTION);
    return [];
  }
}

/**
 * Save a new product or update an existing product in Firestore / localStorage
 */
export async function saveProductToFirestore(product: Product): Promise<void> {
  if (isMockConfig || !db) {
    // Sandbox / Mock fallback
    const saved = localStorage.getItem('hb-persistent-products');
    let productsList: Product[] = saved ? JSON.parse(saved) : [...INITIAL_PRODUCTS];
    
    const index = productsList.findIndex(p => p.id === product.id);
    if (index >= 0) {
      productsList[index] = { ...product, updatedAt: new Date().toISOString() };
    } else {
      productsList = [{ ...product, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...productsList];
    }
    
    try {
      localStorage.setItem('hb-persistent-products', JSON.stringify(productsList));
    } catch (e) {
      console.warn("localStorage quota exceeded! Attempting to clear logs to make room...");
      localStorage.removeItem('hb-activity-logs'); // Clear non-critical activity logs to free up quota
      try {
        localStorage.setItem('hb-persistent-products', JSON.stringify(productsList));
      } catch (retryErr) {
        throw new Error("ব্রাউজার লোকাল স্টোরেজ মেমরি পূর্ণ হয়ে গিয়েছে! অনুগ্রহ করে অপেক্ষাকৃত ছোট সাইজের ছবি ব্যবহার করুন অথবা ব্রাউজারের ক্যাশ (Cache) পরিষ্কার করে পুনরায় চেষ্টা করুন।");
      }
    }
    return;
  }

  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, product.id);
    const dataToSave = {
      ...product,
      updatedAt: new Date().toISOString(),
      createdAt: product.createdAt || new Date().toISOString()
    };
    await setDoc(productRef, dataToSave, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PRODUCTS_COLLECTION}/${product.id}`);
  }
}

/**
 * Delete a product from Firestore / localStorage
 */
export async function deleteProductFromFirestore(id: string): Promise<void> {
  if (isMockConfig || !db) {
    // Sandbox / Mock fallback
    const saved = localStorage.getItem('hb-persistent-products');
    if (saved) {
      let productsList: Product[] = JSON.parse(saved);
      productsList = productsList.filter(p => p.id !== id);
      localStorage.setItem('hb-persistent-products', JSON.stringify(productsList));
    }
    return;
  }

  try {
    const productRef = doc(db, PRODUCTS_COLLECTION, id);
    await deleteDoc(productRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${id}`);
  }
}

/**
 * Utility to compress an image file using HTML5 Canvas on client-side
 * down to maximum 800px dimension and 0.6 JPEG quality to keep base64 extremely small (~20-50KB)
 */
function compressImageToTinyBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxW = 800;
        const maxH = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxW) {
            height = Math.round((height * maxW) / width);
            width = maxW;
          }
        } else {
          if (height > maxH) {
            width = Math.round((width * maxH) / height);
            height = maxH;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          resolve(dataUrl);
        } else {
          resolve(e.target?.result as string || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80');
        }
      };
      img.onerror = () => {
        resolve(e.target?.result as string || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80');
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      resolve('https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80');
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image to Firebase Storage and return its Download URL, 
 * or return simulated compressed data URL if in Mock/Sandbox mode.
 */
export async function uploadProductImage(file: File): Promise<string> {
  if (isMockConfig || !storage) {
    // High-fidelity client-side file reading with CANVAS COMPRESSION to prevent localStorage quota issues!
    try {
      return await compressImageToTinyBase64(file);
    } catch (err) {
      console.error("Image compression failed, falling back to raw data url", err);
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            resolve('https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80');
          }
        };
        reader.onerror = () => {
          reject(new Error("File reading failed"));
        };
        reader.readAsDataURL(file);
      });
    }
  }

  try {
    const fileExtension = file.name.split('.').pop();
    const fileName = `products/${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExtension}`;
    const storageRef = ref(storage, fileName);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return downloadUrl;
  } catch (error) {
    console.error("Firebase Storage Upload Error:", error);
    throw new Error("ফাইল আপলোড করতে ব্যর্থ হয়েছে: " + (error instanceof Error ? error.message : String(error)));
  }
}

/**
 * Fetch all orders from Firestore or fallback to localStorage
 */
export async function getOrdersFromFirestore(): Promise<Order[]> {
  if (isMockConfig || !db) {
    const saved = localStorage.getItem('hb-persistent-orders');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const ordersList: Order[] = [];

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      ordersList.push({
        id: docSnap.id,
        userId: data.userId || '',
        userName: data.userName || '',
        userEmail: data.userEmail || '',
        userPhone: data.userPhone || '',
        userWhatsApp: data.userWhatsApp || '',
        items: data.items || [],
        totalAmount: Number(data.totalAmount) || 0,
        paymentMethod: data.paymentMethod || 'bkash',
        paymentNumber: data.paymentNumber || '',
        transactionId: data.transactionId || '',
        paymentScreenshotUrl: data.paymentScreenshotUrl || '',
        status: data.status || 'pending',
        createdAt: data.createdAt || new Date().toISOString(),
        approvedAt: data.approvedAt || undefined,
        downloadUrl: data.downloadUrl || undefined,
        additionalNote: data.additionalNote || '',
      });
    });

    return ordersList;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, ORDERS_COLLECTION);
    return [];
  }
}

/**
 * Save a new order to Firestore or localStorage
 */
export async function saveOrderToFirestore(order: Order): Promise<void> {
  if (isMockConfig || !db) {
    const saved = localStorage.getItem('hb-persistent-orders');
    let ordersList: Order[] = saved ? JSON.parse(saved) : [];
    
    // Add or update
    const index = ordersList.findIndex(o => o.id === order.id);
    if (index >= 0) {
      ordersList[index] = order;
    } else {
      ordersList = [order, ...ordersList];
    }
    localStorage.setItem('hb-persistent-orders', JSON.stringify(ordersList));
    return;
  }

  try {
    const orderRef = doc(db, ORDERS_COLLECTION, order.id);
    await setDoc(orderRef, order);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${ORDERS_COLLECTION}/${order.id}`);
    throw error;
  }
}

/**
 * Update order status, approvedAt date, and download url in Firestore or localStorage
 */
export async function updateOrderStatusInFirestore(
  orderId: string, 
  status: 'pending' | 'approved' | 'rejected' | 'completed',
  approvedAt?: string,
  downloadUrl?: string
): Promise<void> {
  if (isMockConfig || !db) {
    const saved = localStorage.getItem('hb-persistent-orders');
    if (saved) {
      try {
        const ordersList: Order[] = JSON.parse(saved);
        const index = ordersList.findIndex(o => o.id === orderId);
        if (index >= 0) {
          ordersList[index] = { 
            ...ordersList[index], 
            status,
            ...(approvedAt && { approvedAt }),
            ...(downloadUrl && { downloadUrl })
          };
          localStorage.setItem('hb-persistent-orders', JSON.stringify(ordersList));
        }
      } catch (e) {
        console.error("Local storage order status update error:", e);
      }
    }
    return;
  }

  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderId);
    const updates: Record<string, any> = { status };
    if (approvedAt) updates.approvedAt = approvedAt;
    if (downloadUrl) updates.downloadUrl = downloadUrl;
    
    await updateDoc(orderRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${ORDERS_COLLECTION}/${orderId}`);
    throw error;
  }
}

/**
 * Fetch a user profile from Firestore or fallback to localStorage
 */
export async function getUserProfileFromFirestore(uid: string): Promise<UserProfile | null> {
  if (isMockConfig || !db) {
    const customUsersRaw = localStorage.getItem('hb-simulated-registered-users');
    if (customUsersRaw) {
      try {
        const list: UserProfile[] = JSON.parse(customUsersRaw);
        const found = list.find(u => u.uid === uid);
        if (found) return found;
      } catch (e) {
        console.error("Failed to parse simulated users", e);
      }
    }
    return null;
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        uid: docSnap.id,
        email: data.email || '',
        displayName: data.displayName || '',
        photoURL: data.photoURL || undefined,
        phone: data.phone || undefined,
        whatsApp: data.whatsApp || undefined,
        role: data.role || 'user',
        createdAt: data.createdAt || new Date().toISOString(),
      };
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${USERS_COLLECTION}/${uid}`);
    return null;
  }
}

/**
 * Save or update a user profile in Firestore or localStorage
 */
export async function saveUserProfileToFirestore(profile: UserProfile): Promise<void> {
  if (isMockConfig || !db) {
    const customUsersRaw = localStorage.getItem('hb-simulated-registered-users') || '[]';
    try {
      let list: UserProfile[] = JSON.parse(customUsersRaw);
      const idx = list.findIndex(u => u.uid === profile.uid);
      if (idx >= 0) {
        list[idx] = profile;
      } else {
        list.push(profile);
      }
      localStorage.setItem('hb-simulated-registered-users', JSON.stringify(list));
      
      // If updating the currently logged-in user, also update 'hb-current-user'
      const currentUserRaw = localStorage.getItem('hb-current-user');
      if (currentUserRaw) {
        const cur = JSON.parse(currentUserRaw) as UserProfile;
        if (cur.uid === profile.uid) {
          localStorage.setItem('hb-current-user', JSON.stringify(profile));
        }
      }
    } catch (e) {
      console.error("Failed to save simulated user profile", e);
    }
    return;
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, profile.uid);
    await setDoc(userRef, {
      uid: profile.uid,
      email: profile.email,
      displayName: profile.displayName,
      photoURL: profile.photoURL || '',
      phone: profile.phone || '',
      whatsApp: profile.whatsApp || '',
      role: profile.role,
      createdAt: profile.createdAt,
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${USERS_COLLECTION}/${profile.uid}`);
    throw error;
  }
}

/**
 * Fetch product categories from Firestore or fallback to localStorage / mockData
 */
export async function getCategoriesFromFirestore(): Promise<Category[]> {
  if (isMockConfig || !db) {
    const saved = localStorage.getItem('hb-persistent-categories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_CATEGORIES;
      }
    }
    localStorage.setItem('hb-persistent-categories', JSON.stringify(INITIAL_CATEGORIES));
    return INITIAL_CATEGORIES;
  }

  try {
    const categoriesRef = collection(db, CATEGORIES_COLLECTION);
    const querySnapshot = await getDocs(categoriesRef);
    const list: Category[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        name: data.name || '',
        slug: data.slug || docSnap.id,
        icon: data.icon || 'Cpu',
        description: data.description || '',
      });
    });

    if (list.length === 0) {
      console.log("Categories empty, seeding INITIAL_CATEGORIES to Firestore...");
      for (const cat of INITIAL_CATEGORIES) {
        await saveCategoryToFirestore(cat);
      }
      return INITIAL_CATEGORIES;
    }
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, CATEGORIES_COLLECTION);
    return INITIAL_CATEGORIES;
  }
}

/**
 * Save a category to Firestore or localStorage
 */
export async function saveCategoryToFirestore(category: Category): Promise<void> {
  if (isMockConfig || !db) {
    const saved = localStorage.getItem('hb-persistent-categories');
    let list: Category[] = saved ? JSON.parse(saved) : [...INITIAL_CATEGORIES];
    const idx = list.findIndex(c => c.id === category.id);
    if (idx >= 0) {
      list[idx] = category;
    } else {
      list.push(category);
    }
    localStorage.setItem('hb-persistent-categories', JSON.stringify(list));
    return;
  }

  try {
    const catRef = doc(db, CATEGORIES_COLLECTION, category.id);
    await setDoc(catRef, category, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${CATEGORIES_COLLECTION}/${category.id}`);
    throw error;
  }
}

/**
 * Delete a category from Firestore or localStorage
 */
export async function deleteCategoryFromFirestore(id: string): Promise<void> {
  if (isMockConfig || !db) {
    const saved = localStorage.getItem('hb-persistent-categories');
    if (saved) {
      try {
        let list: Category[] = JSON.parse(saved);
        list = list.filter(c => c.id !== id);
        localStorage.setItem('hb-persistent-categories', JSON.stringify(list));
      } catch (e) {
        console.error("Local storage category delete error:", e);
      }
    }
    return;
  }

  try {
    const catRef = doc(db, CATEGORIES_COLLECTION, id);
    await deleteDoc(catRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${CATEGORIES_COLLECTION}/${id}`);
    throw error;
  }
}

/**
 * Fetch admin/website settings from Firestore or fallback to DEFAULT_ADMIN_SETTINGS
 */
export async function getSettingsFromFirestore(): Promise<AdminSettings | null> {
  if (isMockConfig || !db) {
    const saved = localStorage.getItem('hb-admin-settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_ADMIN_SETTINGS;
      }
    }
    return DEFAULT_ADMIN_SETTINGS;
  }

  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, 'general');
    const docSnap = await getDoc(settingsRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        websiteName: data.websiteName || DEFAULT_ADMIN_SETTINGS.websiteName,
        websiteLogo: data.websiteLogo || DEFAULT_ADMIN_SETTINGS.websiteLogo,
        accentColor: data.accentColor || DEFAULT_ADMIN_SETTINGS.accentColor,
        contactEmail: data.contactEmail || DEFAULT_ADMIN_SETTINGS.contactEmail,
        contactPhone: data.contactPhone || DEFAULT_ADMIN_SETTINGS.contactPhone,
        facebookLink: data.facebookLink || DEFAULT_ADMIN_SETTINGS.facebookLink,
        telegramLink: data.telegramLink || DEFAULT_ADMIN_SETTINGS.telegramLink,
        whatsAppLink: data.whatsAppLink || DEFAULT_ADMIN_SETTINGS.whatsAppLink,
        aboutText: data.aboutText || DEFAULT_ADMIN_SETTINGS.aboutText,
      };
    } else {
      // Seed default settings on first load
      await saveSettingsToFirestore(DEFAULT_ADMIN_SETTINGS);
      return DEFAULT_ADMIN_SETTINGS;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `${SETTINGS_COLLECTION}/general`);
    return DEFAULT_ADMIN_SETTINGS;
  }
}

/**
 * Save settings to Firestore or localStorage
 */
export async function saveSettingsToFirestore(settings: AdminSettings): Promise<void> {
  if (isMockConfig || !db) {
    localStorage.setItem('hb-admin-settings', JSON.stringify(settings));
    return;
  }

  try {
    const settingsRef = doc(db, SETTINGS_COLLECTION, 'general');
    await setDoc(settingsRef, settings, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${SETTINGS_COLLECTION}/general`);
    throw error;
  }
}

/**
 * Fetch reviews for a specific product
 */
export async function getReviewsFromFirestore(productId: string): Promise<Review[]> {
  const cacheKey = `hb-persistent-reviews-${productId}`;
  if (isMockConfig || !db) {
    const saved = localStorage.getItem(cacheKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  }

  try {
    // We query the reviews collection under products/{productId}/reviews or reviews collection with productId field.
    // Let's store inside the subcollection: products/{productId}/reviews
    const reviewsRef = collection(db, PRODUCTS_COLLECTION, productId, REVIEWS_COLLECTION);
    const q = query(reviewsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const list: Review[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        userId: data.userId || '',
        userName: data.userName || '',
        rating: Number(data.rating) || 5,
        comment: data.comment || '',
        createdAt: data.createdAt || new Date().toISOString(),
        orderId: data.orderId || undefined,
        approved: data.approved !== false, // default to approved=true for older database records
      });
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, `${PRODUCTS_COLLECTION}/${productId}/${REVIEWS_COLLECTION}`);
    return [];
  }
}

/**
 * Save a review for a specific product
 */
export async function saveReviewToFirestore(productId: string, review: Review): Promise<void> {
  const cacheKey = `hb-persistent-reviews-${productId}`;
  if (isMockConfig || !db) {
    const saved = localStorage.getItem(cacheKey);
    const list: Review[] = saved ? JSON.parse(saved) : [];
    list.unshift(review);
    localStorage.setItem(cacheKey, JSON.stringify(list));
    return;
  }

  try {
    const reviewRef = doc(db, PRODUCTS_COLLECTION, productId, REVIEWS_COLLECTION, review.id);
    await setDoc(reviewRef, {
      id: review.id,
      userId: review.userId,
      userName: review.userName,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      orderId: review.orderId || '',
      approved: review.approved ?? false,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PRODUCTS_COLLECTION}/${productId}/${REVIEWS_COLLECTION}/${review.id}`);
    throw error;
  }
}

/**
 * Approve a review in Firestore or localStorage
 */
export async function approveReviewInFirestore(productId: string, reviewId: string): Promise<void> {
  const cacheKey = `hb-persistent-reviews-${productId}`;
  if (isMockConfig || !db) {
    const saved = localStorage.getItem(cacheKey);
    if (saved) {
      try {
        const list: Review[] = JSON.parse(saved);
        const idx = list.findIndex(r => r.id === reviewId);
        if (idx >= 0) {
          list[idx].approved = true;
          localStorage.setItem(cacheKey, JSON.stringify(list));
        }
      } catch (e) {}
    }
    return;
  }

  try {
    const reviewRef = doc(db, PRODUCTS_COLLECTION, productId, REVIEWS_COLLECTION, reviewId);
    await updateDoc(reviewRef, { approved: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${PRODUCTS_COLLECTION}/${productId}/${REVIEWS_COLLECTION}/${reviewId}`);
    throw error;
  }
}

/**
 * Fetch all registered users
 */
export async function getAllUsersFromFirestore(): Promise<UserProfile[]> {
  const defaultUsers: UserProfile[] = [
    {
      uid: 'admin-uid-123',
      email: 'admin@hatbazar.com',
      displayName: 'আলমগীর কবীর (অ্যাডমিন)',
      phone: '01711112233',
      whatsApp: '01711112233',
      role: 'admin',
      blocked: false,
      createdAt: '2026-01-10T10:00:00Z'
    },
    {
      uid: 'user-uid-456',
      email: 'user@hatbazar.com',
      displayName: 'সাকিব হাসান (গ্রাহক)',
      phone: '01712345678',
      whatsApp: '01712345678',
      role: 'user',
      blocked: false,
      createdAt: '2026-03-15T12:30:00Z'
    }
  ];

  if (isMockConfig || !db) {
    const saved = localStorage.getItem('hb-simulated-registered-users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultUsers;
      }
    }
    localStorage.setItem('hb-simulated-registered-users', JSON.stringify(defaultUsers));
    return defaultUsers;
  }

  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const querySnapshot = await getDocs(usersRef);
    const list: UserProfile[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        uid: docSnap.id,
        email: data.email || '',
        displayName: data.displayName || '',
        photoURL: data.photoURL || undefined,
        phone: data.phone || undefined,
        whatsApp: data.whatsApp || undefined,
        role: data.role || 'user',
        blocked: data.blocked || false,
        createdAt: data.createdAt || new Date().toISOString(),
      });
    });
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, USERS_COLLECTION);
    return defaultUsers;
  }
}

/**
 * Update user status (blocked/unblocked) or role in Firestore
 */
export async function updateUserStatusInFirestore(uid: string, blocked: boolean, role?: 'admin' | 'user'): Promise<void> {
  if (isMockConfig || !db) {
    const saved = localStorage.getItem('hb-simulated-registered-users');
    if (saved) {
      try {
        const list: UserProfile[] = JSON.parse(saved);
        const idx = list.findIndex(u => u.uid === uid);
        if (idx >= 0) {
          list[idx].blocked = blocked;
          if (role) list[idx].role = role;
          localStorage.setItem('hb-simulated-registered-users', JSON.stringify(list));
        }
      } catch (e) {
        console.error("Failed to update user in mock DB", e);
      }
    }
    return;
  }

  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    const updates: any = { blocked };
    if (role) updates.role = role;
    await updateDoc(userRef, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${USERS_COLLECTION}/${uid}`);
    throw error;
  }
}

/**
 * Fetch all reviews across all products
 */
export async function getAllReviewsFromFirestore(productsList: Product[]): Promise<(Review & { productId: string; productName: string })[]> {
  if (isMockConfig || !db) {
    // Collect from localStorage for each product
    const all: (Review & { productId: string; productName: string })[] = [];
    for (const p of productsList) {
      const saved = localStorage.getItem(`hb-persistent-reviews-${p.id}`);
      if (saved) {
        try {
          const list: Review[] = JSON.parse(saved);
          list.forEach(r => {
            all.push({ ...r, productId: p.id, productName: p.name });
          });
        } catch (e) {}
      }
    }
    // Return mock reviews if absolutely none found
    if (all.length === 0) {
      return [
        {
          id: 'rev-1',
          userId: 'user-1',
          userName: 'আরিফুল ইসলাম',
          rating: 5,
          comment: 'খুব চমৎকার প্লাগইন! ইনস্টলেশন অত্যন্ত সহজ ছিল এবং ডাউনলোড স্পিডও ভালো পেয়েছি। লাইফটাইম আপডেটের প্রতিশ্রুতি ভালো লেগেছে।',
          createdAt: '2026-06-12T14:30:00Z',
          productId: productsList[0]?.id || 'prod-1',
          productName: productsList[0]?.name || 'ডিজিটাল প্রোডাক্ট'
        },
        {
          id: 'rev-2',
          userId: 'user-2',
          userName: 'তসলিমা আক্তার',
          rating: 4,
          comment: 'ভিডিও কোর্সটি আসলেই বেশ কাজের। জটিল বিষয়গুলো খুবই সহজ ভাষায় বোঝানো হয়েছে। অ্যাডমিন ভাইয়ের সাহায্য অনেক পেয়েছি। ধন্যবাদ Hat Bazar!',
          createdAt: '2026-07-01T09:15:00Z',
          productId: productsList[1]?.id || 'prod-2',
          productName: productsList[1]?.name || 'প্রিমিয়াম কোর্স'
        }
      ];
    }
    return all;
  }

  try {
    const all: (Review & { productId: string; productName: string })[] = [];
    for (const p of productsList) {
      const reviewsRef = collection(db, PRODUCTS_COLLECTION, p.id, REVIEWS_COLLECTION);
      const querySnapshot = await getDocs(reviewsRef);
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        all.push({
          id: docSnap.id,
          userId: data.userId || '',
          userName: data.userName || '',
          rating: Number(data.rating) || 5,
          comment: data.comment || '',
          createdAt: data.createdAt || new Date().toISOString(),
          orderId: data.orderId || undefined,
          approved: data.approved !== false, // default to approved=true for older database records
          productId: p.id,
          productName: p.name
        });
      });
    }
    return all;
  } catch (error) {
    console.error("Failed to query reviews across products:", error);
    return [];
  }
}

/**
 * Delete a review from Firestore or fallback
 */
export async function deleteReviewFromFirestore(productId: string, reviewId: string): Promise<void> {
  const cacheKey = `hb-persistent-reviews-${productId}`;
  if (isMockConfig || !db) {
    const saved = localStorage.getItem(cacheKey);
    if (saved) {
      try {
        const list: Review[] = JSON.parse(saved);
        const filtered = list.filter(r => r.id !== reviewId);
        localStorage.setItem(cacheKey, JSON.stringify(filtered));
      } catch (e) {}
    }
    return;
  }

  try {
    const reviewRef = doc(db, PRODUCTS_COLLECTION, productId, REVIEWS_COLLECTION, reviewId);
    await deleteDoc(reviewRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${PRODUCTS_COLLECTION}/${productId}/${REVIEWS_COLLECTION}/${reviewId}`);
    throw error;
  }
}

/**
 * Fetch all coupons
 */
export async function getCouponsFromFirestore(): Promise<Coupon[]> {
  const defaultCoupons: Coupon[] = [
    { id: 'cp-1', code: 'HATBAZAR10', discountPercent: 10, expiryDate: '2027-12-31', active: true },
    { id: 'cp-2', code: 'FREE50', discountPercent: 50, expiryDate: '2026-09-30', active: false }
  ];

  if (isMockConfig || !db) {
    const saved = localStorage.getItem('hb-coupons');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultCoupons;
      }
    }
    localStorage.setItem('hb-coupons', JSON.stringify(defaultCoupons));
    return defaultCoupons;
  }

  try {
    const couponsRef = collection(db, COUPONS_COLLECTION);
    const querySnapshot = await getDocs(couponsRef);
    const list: Coupon[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        code: data.code || '',
        discountPercent: Number(data.discountPercent) || 0,
        expiryDate: data.expiryDate || '',
        active: data.active !== false,
      });
    });
    if (list.length === 0) {
      for (const cp of defaultCoupons) {
        await saveCouponToFirestore(cp);
      }
      return defaultCoupons;
    }
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, COUPONS_COLLECTION);
    return defaultCoupons;
  }
}

/**
 * Save/Update coupon
 */
export async function saveCouponToFirestore(coupon: Coupon): Promise<void> {
  if (isMockConfig || !db) {
    const saved = localStorage.getItem('hb-coupons');
    let list: Coupon[] = saved ? JSON.parse(saved) : [];
    const idx = list.findIndex(c => c.id === coupon.id);
    if (idx >= 0) {
      list[idx] = coupon;
    } else {
      list.push(coupon);
    }
    localStorage.setItem('hb-coupons', JSON.stringify(list));
    return;
  }

  try {
    const couponRef = doc(db, COUPONS_COLLECTION, coupon.id);
    await setDoc(couponRef, coupon, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COUPONS_COLLECTION}/${coupon.id}`);
    throw error;
  }
}

/**
 * Delete a coupon
 */
export async function deleteCouponFromFirestore(couponId: string): Promise<void> {
  if (isMockConfig || !db) {
    const saved = localStorage.getItem('hb-coupons');
    if (saved) {
      try {
        const list: Coupon[] = JSON.parse(saved);
        const filtered = list.filter(c => c.id !== couponId);
        localStorage.setItem('hb-coupons', JSON.stringify(filtered));
      } catch (e) {}
    }
    return;
  }

  try {
    const couponRef = doc(db, COUPONS_COLLECTION, couponId);
    await deleteDoc(couponRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COUPONS_COLLECTION}/${couponId}`);
    throw error;
  }
}

/**
 * Fetch all banners
 */
export async function getBannersFromFirestore(): Promise<Banner[]> {
  const defaultBanners: Banner[] = [
    { 
      id: 'bn-1', 
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80', 
      title: 'প্রিমিয়াম ডিজিটাল প্রোডাক্ট প্যাক', 
      subtitle: 'ডেভেলপার এবং ডিজাইনারদের জন্য লাইফটাইম ফ্রি আপডেটসহ আকর্ষণীয় ডিল!', 
      linkUrl: '#products', 
      active: true 
    }
  ];

  if (isMockConfig || !db) {
    const saved = localStorage.getItem('hb-banners');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultBanners;
      }
    }
    localStorage.setItem('hb-banners', JSON.stringify(defaultBanners));
    return defaultBanners;
  }

  try {
    const bannersRef = collection(db, BANNERS_COLLECTION);
    const querySnapshot = await getDocs(bannersRef);
    const list: Banner[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        imageUrl: data.imageUrl || '',
        title: data.title || '',
        subtitle: data.subtitle || '',
        linkUrl: data.linkUrl || '',
        active: data.active !== false,
      });
    });
    if (list.length === 0) {
      for (const bn of defaultBanners) {
        await saveBannerToFirestore(bn);
      }
      return defaultBanners;
    }
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, BANNERS_COLLECTION);
    return defaultBanners;
  }
}

/**
 * Save/Update banner
 */
export async function saveBannerToFirestore(banner: Banner): Promise<void> {
  if (isMockConfig || !db) {
    const saved = localStorage.getItem('hb-banners');
    let list: Banner[] = saved ? JSON.parse(saved) : [];
    const idx = list.findIndex(b => b.id === banner.id);
    if (idx >= 0) {
      list[idx] = banner;
    } else {
      list.push(banner);
    }
    localStorage.setItem('hb-banners', JSON.stringify(list));
    return;
  }

  try {
    const bannerRef = doc(db, BANNERS_COLLECTION, banner.id);
    await setDoc(bannerRef, banner, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${BANNERS_COLLECTION}/${banner.id}`);
    throw error;
  }
}

/**
 * Delete a banner
 */
export async function deleteBannerFromFirestore(bannerId: string): Promise<void> {
  if (isMockConfig || !db) {
    const saved = localStorage.getItem('hb-banners');
    if (saved) {
      try {
        const list: Banner[] = JSON.parse(saved);
        const filtered = list.filter(b => b.id !== bannerId);
        localStorage.setItem('hb-banners', JSON.stringify(filtered));
      } catch (e) {}
    }
    return;
  }

  try {
    const bannerRef = doc(db, BANNERS_COLLECTION, bannerId);
    await deleteDoc(bannerRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${BANNERS_COLLECTION}/${bannerId}`);
    throw error;
  }
}

/**
 * Activity Log Collections & Helpers
 */
const ACTIVITY_LOGS_COLLECTION = 'activity_logs';

const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-1',
    adminEmail: 'rashedislamvk11@gmail.com',
    action: 'System Initialization',
    details: 'Digital product marketplace launched successfully. Security rules deployed.',
    timestamp: '2026-07-15T00:00:00.000Z'
  },
  {
    id: 'log-2',
    adminEmail: 'rashedislamvk11@gmail.com',
    action: 'Admin Account Sync',
    details: 'Default super-administrator account rashedislamvk11@gmail.com created and granted role: admin.',
    timestamp: '2026-07-15T01:10:00.000Z'
  },
  {
    id: 'log-3',
    adminEmail: 'rashedislamvk11@gmail.com',
    action: 'Payment Method Config',
    details: 'Bkash, Nagad and Rocket merchant numbers updated in website payment settings.',
    timestamp: '2026-07-15T02:05:00.000Z'
  }
];

export async function getActivityLogsFromFirestore(): Promise<ActivityLog[]> {
  if (isMockConfig || !db) {
    const saved = localStorage.getItem('hb-activity-logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_ACTIVITY_LOGS;
      }
    }
    localStorage.setItem('hb-activity-logs', JSON.stringify(INITIAL_ACTIVITY_LOGS));
    return INITIAL_ACTIVITY_LOGS;
  }

  try {
    const logsRef = collection(db, ACTIVITY_LOGS_COLLECTION);
    const querySnapshot = await getDocs(logsRef);
    const list: ActivityLog[] = [];
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        adminEmail: data.adminEmail || '',
        action: data.action || '',
        details: data.details || '',
        timestamp: data.timestamp || new Date().toISOString(),
      });
    });

    // Sort by timestamp desc
    list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (list.length === 0) {
      for (const log of INITIAL_ACTIVITY_LOGS) {
        await addActivityLogToFirestore(log);
      }
      return INITIAL_ACTIVITY_LOGS;
    }
    return list;
  } catch (error) {
    console.error("Error reading activity logs:", error);
    return INITIAL_ACTIVITY_LOGS;
  }
}

export async function addActivityLogToFirestore(log: ActivityLog): Promise<void> {
  if (isMockConfig || !db) {
    const saved = localStorage.getItem('hb-activity-logs');
    const list: ActivityLog[] = saved ? JSON.parse(saved) : [...INITIAL_ACTIVITY_LOGS];
    list.unshift(log); // Prepend to show newest first
    localStorage.setItem('hb-activity-logs', JSON.stringify(list));
    return;
  }

  try {
    const logRef = doc(db, ACTIVITY_LOGS_COLLECTION, log.id);
    await setDoc(logRef, log);
  } catch (error) {
    console.error("Error writing activity log:", error);
  }
}
