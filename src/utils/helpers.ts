const banglaDigits: { [key: string]: string } = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

export const toBanglaNumber = (num: number | string): string => {
  if (num === undefined || num === null) return '';
  const str = num.toString();
  return str
    .split('')
    .map((char) => banglaDigits[char] || char)
    .join('');
};

export const formatPrice = (price: number): string => {
  // Format with thousands separators first, then convert characters
  const formatted = price.toLocaleString('en-US');
  return `৳ ${toBanglaNumber(formatted)}`;
};

export const getCategoryBanglaName = (catId: string): string => {
  try {
    const saved = localStorage.getItem('hb-persistent-categories');
    if (saved) {
      const list = JSON.parse(saved);
      const found = list.find((c: any) => c.id === catId || c.slug === catId);
      if (found) return found.name;
    }
  } catch (e) {
    console.error("Error reading categories from localStorage in helpers:", e);
  }

  switch (catId) {
    case 'themes': return 'ওয়ার্ডপ্রেস থিম';
    case 'plugins': return 'প্লাগইন ও স্ক্রিপ্ট';
    case 'ebooks': return 'ই-বুক';
    case 'courses': return 'কোর্স';
    case 'software': return 'সফটওয়্যার';
    case 'templates': return 'টেমপ্লেট';
    case 'tools': return 'ডিজিটাল টুলস';
    case 'ai-products': return 'AI প্রোডাক্ট';
    default: return 'ডিজিটাল';
  }
};
