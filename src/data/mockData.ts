import { Product, Category, AdminSettings } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'courses',
    name: 'কোর্স',
    slug: 'courses',
    icon: 'PlayCircle',
    description: 'সহজ বাংলায় প্রফেশনাল ওয়েব ডিজাইন, ডেভেলপমেন্ট এবং ফ্রিল্যান্সিং কোর্স।'
  },
  {
    id: 'software',
    name: 'সফটওয়্যার',
    slug: 'software',
    icon: 'Terminal',
    description: 'দৈনন্দিন কাজ এবং হিসাব-নিকাশ সহজ করার প্রিমিয়াম সফটওয়্যার।'
  },
  {
    id: 'ebooks',
    name: 'ই-বুক',
    slug: 'ebooks',
    icon: 'BookOpen',
    description: 'দক্ষতা উন্নয়ন এবং ফ্রিল্যান্সিং বিষয়ক তথ্যবহুল বাংলা ই-বুক।'
  },
  {
    id: 'templates',
    name: 'টেমপ্লেট',
    slug: 'templates',
    icon: 'Layout',
    description: 'আধুনিক, রেসপনসিভ এবং এসইও অপ্টিমাইজড ওয়েবসাইট ও ডিজাইন টেমপ্লেটসমূহ।'
  },
  {
    id: 'tools',
    name: 'ডিজিটাল টুলস',
    slug: 'tools',
    icon: 'Cpu',
    description: 'আপনার কাজের গতি এবং দক্ষতা বাড়াতে আকর্ষণীয় ওয়েব ও এসইও টুলস।'
  },
  {
    id: 'ai-products',
    name: 'AI প্রোডাক্ট',
    slug: 'ai-products',
    icon: 'Sparkles',
    description: 'আধুনিক কৃত্রিম বুদ্ধিমত্তা সম্পন্ন বাংলা কন্টেন্ট রাইটিং ও ইমেজ জেনারেটর।'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'হাট থিম - প্রিমিয়াম বাংলা ই-কমার্স ওয়ার্ডপ্রেস থিম',
    description: 'হাট থিম একটি সম্পূর্ণ রেসপনসিভ এবং অত্যন্ত দ্রুতগতির ওয়ার্ডপ্রেস থিম যা বিশেষভাবে বাংলাদেশি ই-কমার্স ও এফ-কমার্স (ফেসবুক বিজনেস) স্টোরের জন্য ডিজাইন করা হয়েছে। এটিটিতে রয়েছে বিল্ট-ইন বিকাশ, নগদ ও রকেট পেমেন্ট পেজ ডিজাইন এবং সম্পূর্ণ কার্ট ও চেকআউট ম্যানেজমেন্ট সিস্টেম। কোনো কোডিং জ্ঞান ছাড়াই আপনি একটি প্রফেশনাল অনলাইন শপ তৈরি করতে পারবেন।',
    price: 1450,
    category: 'templates',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://example.com/downloads/hat-theme-v1.4.2.zip',
    fileSize: '14.8 MB',
    version: 'v1.4.2',
    rating: 4.8,
    reviewsCount: 34,
    salesCount: 124,
    tags: ['WordPress', 'Theme', 'E-commerce', 'Bangla'],
    features: [
      '১০০% রেসপনসিভ ও মোবাইল-ফ্রেন্ডলি ডিজাইন',
      'বিল্ট-ইন বাংলা ভাষা সাপোর্ট',
      'আল্ট্রা-ফাস্ট লোডিং স্পিড (৯৮% গুগল পেজস্পিড স্কোর)',
      'সহজ এলিমেন্টর পেজ বিল্ডার সাপোর্ট',
      'বিকাশ, রকেট, নগদ আইকন ও লেআউট রেডি',
      'লাইফটাইম ফ্রি আপডেট এবং টেকনিক্যাল সাপোর্ট'
    ]
  },
  {
    id: 'prod-2',
    name: 'woocommerce বিকাশ-নগদ-রকেট অটোমেটেড পেমেন্ট গেটওয়ে প্লাগইন',
    description: 'এই প্লাগইনটির সাহায্যে আপনি আপনার ওয়ার্ডপ্রেস WooCommerce স্টোরে সরাসরি বিকাশ, নগদ ও রকেট দিয়ে পেমেন্ট গ্রহণ করতে পারবেন। গ্রাহক যখন পেমেন্ট করবে, প্লাগইনটি ট্রানজেকশন আইডি চেক করে অর্ডারটি অটোমেটিক "কমপ্লিট" স্ট্যাটাসে নিয়ে যাবে। এটি ব্যবহার করা অত্যন্ত সহজ এবং নিরাপদ।',
    price: 850,
    category: 'tools',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://example.com/downloads/bkash-nagad-rocket-gateway-v2.1.zip',
    fileSize: '2.5 MB',
    version: 'v2.1.0',
    rating: 4.9,
    reviewsCount: 56,
    salesCount: 310,
    tags: ['WooCommerce', 'Plugin', 'bKash', 'Nagad', 'Payment'],
    features: [
      'সম্পূর্ণ অটোমেটিক ট্রানজেকশন আইডি ভেরিফিকেশন',
      'ম্যানুয়াল ও অটোমেটিক উভয় পেমেন্ট মোড সাপোর্ট',
      'গ্রাহকের জন্য অত্যন্ত আকর্ষণীয় পেমেন্ট উইন্ডো',
      'অর্ডার কমপ্লিশনের সাথে সাথে এসএমএস নোটিফিকেশন সিস্টেম',
      'কোনো অতিরিক্ত ট্রানজেকশন ফি বা চার্জ নেই',
      'সহজ সেটিংস ইন্টারফেস'
    ]
  },
  {
    id: 'prod-3',
    name: 'জিরো থেকে ফ্রিল্যান্সিং গাইডবুক (প্রফেশনাল বাংলা ই-বুক)',
    description: 'নতুনদের জন্য বিশেষভাবে রচিত এই ই-বুকটিতে ফ্রিল্যান্সিং ক্যারিয়ার শুরুর প্রতিটি ধাপ নিখুঁতভাবে ব্যাখ্যা করা হয়েছে। কীভাবে কাজ শিখবেন, কোন ক্যাটাগরিতে কাজ বেশি, আপওয়ার্ক এবং ফাইবারে কীভাবে আকর্ষণীয় প্রোফাইল ও গিগ তৈরি করবেন এবং বায়ারের সাথে কীভাবে সফলভাবে চ্যাট করবেন - সবকিছুই রয়েছে এই একটি বইয়ে। বাস্তব অভিজ্ঞতার আলোকে লেখা এই বই আপনাকে সঠিক গাইডলাইন দেবে।',
    price: 320,
    category: 'ebooks',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://example.com/downloads/freelancing-guidebook-2026.pdf',
    fileSize: '12.2 MB',
    version: '২০২৬ এডিশন',
    rating: 4.7,
    reviewsCount: 88,
    salesCount: 450,
    tags: ['Freelancing', 'eBook', 'Bangla Guide', 'Fiverr', 'Upwork'],
    features: [
      'সম্পূর্ণ বাংলা ভাষায় লিখিত সহজপাঠ্য বিষয়বস্তু',
      'ফাইবারে অর্ডার পাওয়ার গোপন ট্রিকস ও টিপস',
      'কভার লেটার বা কাজের আবেদনের আকর্ষণীয় টেমপ্লেটসমূহ',
      'পাইওনিয়ার ও ব্যাংকের মাধ্যমে টাকা তোলার বিস্তারিত গাইডলাইন',
      'সহজে পাঠযোগ্য হাই-কোয়ালিটি পিডিএফ ফাইল',
      'বইটির সাথে ৩টি বোনাস চেকলিস্ট ফাইল একদম ফ্রি'
    ]
  },
  {
    id: 'prod-4',
    name: 'অ্যাডভান্সড রিঅ্যাক্ট (React) ও টাইপস্ক্রিপ্ট মাস্টারক্লাস',
    description: 'আধুনিক ওয়েব ডেভেলপমেন্টের অন্যতম জনপ্রিয় ফ্রেমওয়ার্ক React এবং TypeScript-এর এই সম্পূর্ণ বাংলা কোর্সের মাধ্যমে নিজেকে একজন দক্ষ ফ্রন্টএন্ড ডেভেলপার হিসেবে গড়ে তুলুন। বেসিক থেকে শুরু করে স্টেট ম্যানেজমেন্ট (Redux/Zustand), কাস্টম হুকস, পারফরম্যান্স অপ্টিমাইজেশন এবং লাইভ রিয়েল-ওয়ার্ল্ড প্রজেক্ট তৈরির মাধ্যমে প্রফেশনাল লেভেলের কাজ শেখানো হয়েছে।',
    price: 2490,
    category: 'courses',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://example.com/downloads/react-typescript-masterclass.txt',
    fileSize: 'সম্পূর্ণ অনলাইন কোর্স',
    version: 'v3.0 (২০২৬)',
    rating: 4.9,
    reviewsCount: 112,
    salesCount: 220,
    tags: ['React', 'TypeScript', 'Course', 'Web Development'],
    features: [
      '৪৫+ ঘণ্টার হাই-কোয়ালিটি রেকর্ড করা ভিডিও লেকচার',
      '৫টি প্রফেশনাল মেগা প্রজেক্ট সোর্স কোডসহ',
      'ডেডিকেটেড ডিসকর্ড সাপোর্ট গ্রুপ (২৪/৭ সাপোর্ট)',
      'টাইপস্ক্রিপ্টের খুঁটিনাটি এবং ইংরেজি-স্ট্যান্ডার্ড কোডিং',
      'কোর্স শেষে আকর্ষণীয় সার্টিফিকেট',
      'চাকরি ও ফ্রিল্যান্সিং ইন্টারভিউ প্রস্তুতির বিশেষ সেশন'
    ]
  },
  {
    id: 'prod-5',
    name: 'স্মার্ট হিসাব - বাংলা ইনভয়েসিং ও কাস্টমার ম্যানেজমেন্ট সফটওয়্যার',
    description: 'আপনার ব্যবসা প্রতিষ্ঠানের প্রতিদিনের কেনা-বেচা, স্টক বা ইনভেন্টরি, কাস্টমার প্রোফাইল এবং লাভ-ক্ষতির হিসাব রাখার জন্য চমৎকার একটি অফলাইন ও অনলাইন ডেস্কটপ অ্যাপ্লিকেশন। এটি ব্যবহার করা খুবই সহজ, সম্পূর্ণ বাংলায় হওয়ায় যে কেউ সহজেই ডাটা এন্ট্রি করতে পারবে এবং এক ক্লিকে যেকোনো কাস্টমারের জন্য আকর্ষণীয় ইনভয়েস বা রসিদ প্রিন্ট করতে পারবেন।',
    price: 1950,
    category: 'software',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://example.com/downloads/smart-hisab-setup-v3.2.msi',
    fileSize: '35.4 MB',
    version: 'v3.2.4',
    rating: 4.6,
    reviewsCount: 21,
    salesCount: 85,
    tags: ['Software', 'POS', 'Invoice', 'Business', 'Bangla ERP'],
    features: [
      'উইন্ডোজ এবং ম্যাকওএস উভয় ডিভাইসে ব্যবহারের সুবিধা',
      'বারকোড স্ক্যানার এবং থার্মাল প্রিন্টার সাপোর্ট',
      'মাসিক ও বাৎসরিক লাভ-ক্ষতির স্বয়ংক্রিয় গ্রাফিক্যাল রিপোর্ট',
      'বকেয়া টাকা আদায়ের জন্য কাস্টমারভিত্তিক স্বয়ংক্রিয় নোটিফিকেশন',
      'সম্পূর্ণ অফলাইন মোড (কোনো ইন্টারনেট সংযোগ ছাড়া চলে)',
      '১ বছরের সম্পূর্ণ ডাটা রিস্টোর গ্যারান্টি এবং ডেমো সাপোর্ট'
    ]
  },
  {
    id: 'prod-6',
    name: 'লারাবেল (Laravel) মাল্টি-ভেন্ডর ব্লগ ও নিউজ পোর্টাল স্ক্রিপ্ট',
    description: 'একটি প্রফেশনাল মাল্টি-ইউজার ব্লগ এবং নিউজপেপার ওয়েবসাইট তৈরি করার সম্পূর্ণ পিএইচপি স্ক্রিপ্ট। এতে শক্তিশালী অ্যাডমিন প্যানেল, রাইটার ড্যাশবোর্ড, ক্যাটাগরি ম্যানেজমেন্ট, ড্রাফটিং সিস্টেম এবং গুগল অ্যাডসেন্স বসানোর আকর্ষণীয় স্লট রয়েছে। এসইও ফ্রেন্ডলি ইউআরএল এবং সোশ্যাল মিডিয়া শেয়ারিং অপশন বিল্ট-ইন রয়েছে।',
    price: 1200,
    category: 'templates',
    imageUrl: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://example.com/downloads/laravel-news-portal-v1.8.zip',
    fileSize: '18.9 MB',
    version: 'v1.8.0',
    rating: 4.7,
    reviewsCount: 19,
    salesCount: 64,
    tags: ['Laravel', 'PHP Script', 'Blog', 'News Portal'],
    features: [
      'অত্যন্ত সুরক্ষিত লারাবেল ১০ সিকিউরিটি আর্কিটেকচার',
      'মাল্টি-ল্যাঙ্গুয়েজ (বাংলা ও ইংরেজি) সাপোর্ট',
      'সহজ ড্র্যাগ-অ্যান্ড-ড্রপ মেনু ও ক্যাটাগরি বিল্ডার',
      'বিজ্ঞাপন বা ব্যানার বসানোর জন্য বিল্ট-ইন অ্যাড ম্যানেজার',
      'অ্যাডভান্সড রিচ টেক্সট এডিটর এবং মিডিয়া লাইব্রেরি',
      'সহজ ডাটাবেজ ইনস্টলেশন উইজার্ড'
    ]
  },
  {
    id: 'prod-7',
    name: 'বাংলা এআই রাইটার সহকারী (AI Writer Pro) SaaS স্ক্রিপ্ট',
    description: 'আপনার নিজের এআই কন্টেন্ট জেনারেশন ব্যবসা শুরু করুন। এই স্ক্রিপ্টটির সাহায্যে ব্যবহারকারীরা বাংলা ও ইংরেজিতে ব্লগ পোস্ট, সোশ্যাল মিডিয়া ক্যাপশন, ইমেইল এবং বিজ্ঞাপনের কন্টেন্ট খুব সহজেই তৈরি করতে পারবেন। এতে রয়েছে বিকাশ, নগদ পেমেন্ট গেটওয়ে এবং সাবস্ক্রিপশন প্ল্যানিং সিস্টেম।',
    price: 1850,
    category: 'ai-products',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://example.com/downloads/bangla-ai-writer-v1.0.zip',
    fileSize: '24.5 MB',
    version: 'v1.0.1',
    rating: 4.8,
    reviewsCount: 12,
    salesCount: 42,
    tags: ['AI', 'SaaS', 'Laravel', 'OpenAI', 'Bangla AI'],
    features: [
      'সম্পূর্ণ বাংলা ল্যাঙ্গুয়েজ মডেল অপ্টিমাইজড প্রম্পট',
      'বিকাশ, নগদ ও রকেট সাবস্ক্রিপশন গেটওয়ে ইন্টিগ্রেশন',
      '৩টি ভিন্ন কন্টেন্ট টোন এবং ২০+ রেডিমেড টেমপ্লেট',
      'ওপেনএআই (OpenAI) এবং জেমিনি (Gemini) API সাপোর্ট',
      'অ্যাডভান্সড ড্যাশবোর্ড ও মেম্বারশিপ টায়ার সিস্টেম',
      'সহজ ও আকর্ষণীয় ইউজার ইন্টারফেস'
    ]
  },
  {
    id: 'prod-8',
    name: 'ডিজিটাল মার্কেটিং ও এসইও (SEO) সুপার প্যাক টুলস',
    description: 'ডিজিটাল মার্কেটার এবং এসইও প্রফেশনালদের জন্য একটি কমপ্লিট সলিউশন। এই প্যাকে রয়েছে কীওয়ার্ড রিসার্চ, ব্যাকলিংক অ্যানালাইসিস, এবং কন্টেন্ট অপ্টিমাইজেশন করার জন্য ৫০টিরও বেশি প্রিমিয়াম প্রো-লেভেল ডিজিটাল টুলসের কালেকশন।',
    price: 690,
    category: 'tools',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    downloadUrl: 'https://example.com/downloads/seo-superpack-2026.zip',
    fileSize: '8.4 MB',
    version: '২০২৬ এডিশন',
    rating: 4.5,
    reviewsCount: 28,
    salesCount: 110,
    tags: ['SEO', 'Marketing', 'Tools', 'Keyword Research'],
    features: [
      '৫০+ হাই-পারফর্মিং এসইও এবং অডিট ফাইল ও গাইড',
      'সহজ এক্সেল ও ওয়েব ড্যাশবোর্ড ট্র্যাকার শিট',
      'সোশ্যাল মিডিয়া শিডিউলিং ক্যালেন্ডার ও চেকলিস্ট',
      'বিজ্ঞাপন অপ্টিমাইজেশনের স্পেশাল চিট শিট',
      'লাইফটাইম ফ্রি আপডেট এবং নতুন টুলস এডিশন',
      'সহজে ব্যবহারযোগ্য ফাইল এবং ইনস্ট্যান্ট সাপোর্ট'
    ]
  }
];

export const DEFAULT_ADMIN_SETTINGS: AdminSettings = {
  websiteName: 'হাট বাজার',
  websiteLogo: 'ShoppingBag',
  accentColor: 'emerald',
  contactEmail: 'support@hatbazar.com',
  contactPhone: '০১৯৮৭-৬৫৪৩২১',
  facebookLink: 'https://facebook.com/hatbazar.digital',
  telegramLink: 'https://t.me/hatbazar_digital',
  whatsAppLink: 'https://wa.me/8801987654321',
  aboutText: 'হাট বাজার বাংলাদেশের একটি স্বনামধন্য ও প্রিমিয়াম ডিজিটাল প্রোডাক্ট মার্কেটপ্লেস। আমাদের লক্ষ্য হলো ডেভেলপার, ডিজাইনার এবং ফ্রিল্যান্সারদের জন্য সহজে হাই-কোয়ালিটি থিম, প্লাগইন, বই এবং সফটওয়্যার ক্রয়-বিক্রয়ের বিশ্বস্ত মাধ্যম গড়ে তোলা।',
  facebookPixelId: '',
  googleAnalyticsId: '',
  googleTagManagerId: '',
  enableFacebookPixel: false,
  enableGoogleAnalytics: false,
  enableGoogleTagManager: false,
  enableFlashSale: true,
  flashSaleEndTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
  flashSaleText: 'ধামাকা ফ্ল্যাশ সেল! প্রতিটি ডিজিটাল প্রোডাক্টে স্পেশাল ছাড়!',
  flashSaleDiscountPercent: 15,
  newsletterEmails: ['test@example.com']
};
