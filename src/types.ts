export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription?: string; // Short Description
  price: number;
  discountPrice?: number; // Discount Price
  category: string; // e.g. 'theme', 'plugin', 'ebook', 'course', 'software'
  imageUrl: string;
  galleryImages?: string[]; // Multiple Product Images
  downloadUrl: string; // URL to mock or real download
  fileSize: string; // e.g. '12.5 MB'
  version: string; // e.g. 'v1.4.2'
  rating: number;
  reviewsCount: number;
  salesCount: number;
  tags: string[];
  features: string[];
  productType?: string; // e.g. 'course', 'software', 'ebook', etc.
  status?: 'published' | 'draft'; // Product Status
  isFeatured?: boolean; // Featured Product
  isPopular?: boolean; // Popular Product
  createdAt?: string; // Created Date
  updatedAt?: string; // Updated Date
}

export interface Category {
  id: string;
  name: string; // Bangla name
  icon: string; // Name of Lucide icon
  slug: string;
  description: string;
  name_en?: string;
  name_bn?: string;
  active?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  phone?: string;
  whatsApp?: string;
  role: 'admin' | 'user';
  blocked?: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  userWhatsApp: string;
  items: {
    productId: string;
    name: string;
    price: number;
    downloadUrl: string;
    imageUrl: string;
  }[];
  totalAmount: number;
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'card';
  paymentNumber: string; // sender number
  transactionId: string;
  paymentScreenshotUrl?: string;
  screenshotUrl?: string; // root-level copy
  productName?: string; // flattened display
  whatsApp?: string; // optional field
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  approvedAt?: string;
  downloadUrl?: string; // root-level download link
  additionalNote?: string;
}

export interface AdminSettings {
  websiteName: string;
  websiteLogo: string; // Icon name e.g. 'ShoppingBag'
  accentColor: 'emerald' | 'blue' | 'purple' | 'rose' | 'amber';
  contactEmail: string;
  contactPhone: string;
  facebookLink: string;
  telegramLink: string;
  whatsAppLink: string;
  aboutText: string;
  // Extended settings
  favicon?: string;
  contactAddress?: string;
  whatsAppNumber?: string;
  bkashNumber?: string;
  nagadNumber?: string;
  paymentInstructions?: string;
  paymentLogos?: string[];
  secondaryColor?: string;
  darkMode?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogImage?: string;
  facebookPixelId?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  enableFacebookPixel?: boolean;
  enableGoogleAnalytics?: boolean;
  enableGoogleTagManager?: boolean;
  // Flash Sale
  enableFlashSale?: boolean;
  flashSaleEndTime?: string;
  flashSaleText?: string;
  flashSaleDiscountPercent?: number;
  // Email list
  newsletterEmails?: string[];
}

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  expiryDate: string;
  active: boolean;
  discountValue?: number;
  discountType?: 'percent' | 'flat';
}

export interface Banner {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  linkUrl: string;
  active: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  approved?: boolean;
  orderId?: string;
}

export interface ActivityLog {
  id: string;
  adminEmail: string;
  action: string;
  details: string;
  timestamp: string;
}

