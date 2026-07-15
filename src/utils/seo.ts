import { AdminSettings, Product } from '../types';

/**
 * Dynamically updates document metadata, Open Graph social tags, and Schema.org structured data
 * for search engine crawling and optimized social shares.
 */
export function updateSEO(view: string, settings: AdminSettings, product?: Product) {
  if (typeof document === 'undefined') return;

  // 1. Determine Title, Description, and Keywords
  let title = settings.metaTitle || settings.websiteName || 'Hat Bazar';
  let description = settings.metaDescription || 'একটি প্রিমিয়াম ডিজিটাল প্রোডাক্ট মার্কেটপ্লেস';
  let keywords = settings.keywords || 'plugins, themes, ebook, courses, software';
  let ogImage = settings.ogImage || 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&q=80';
  const url = window.location.href;

  if (view === 'product-details' && product) {
    title = `${product.name} - ${settings.websiteName || 'Hat Bazar'}`;
    description = product.shortDescription || product.description.slice(0, 155) + '...';
    if (product.tags && product.tags.length > 0) {
      keywords = product.tags.join(', ');
    }
    ogImage = product.imageUrl;
  } else if (view === 'products') {
    title = `সকল ডিজিটাল প্রোডাক্টস - ${settings.websiteName || 'Hat Bazar'}`;
    description = 'Hat Bazar থেকে আমাদের সেরা ও ভেরিফাইড থিমস, প্লাগিনস, পিডিফ বই ও প্রিমিয়াম কোর্সসমূহ সংগ্রহ করুন।';
  } else if (view === 'checkout') {
    title = `চেকআউট - পেমেন্ট করুন - ${settings.websiteName || 'Hat Bazar'}`;
    description = 'নিরাপদে বিকাশ এবং নগদের মাধ্যমে পেমেন্ট সম্পন্ন করে সাথে সাথে আপনার ডিজিটাল ফাইল ডাউনলোড করুন।';
  } else if (view === 'login') {
    title = `লগইন ও রেজিস্ট্রেশন - ${settings.websiteName || 'Hat Bazar'}`;
    description = 'আপনার ড্যাশবোর্ডে লগইন করে আপনার সকল ক্রয়কৃত অর্ডারের হিস্টোরি এবং ফাইল ডাউনলোড লিংক অ্যাক্সেস করুন।';
  } else if (view === 'dashboard') {
    title = `কাস্টমার ড্যাশবোর্ড - ${settings.websiteName || 'Hat Bazar'}`;
    description = 'আপনার ক্রয়কৃত প্রিমিয়াম প্রোডাক্টসমূহের ইনস্ট্যান্ট ডাউনলোড লিংক এবং লাইফটাইম আপডেটস।';
  } else if (view === 'admin') {
    title = `অ্যাডমিন কন্ট্রোল প্যানেল - ${settings.websiteName || 'Hat Bazar'}`;
  } else if (view === 'support') {
    title = `সহায়তা কেন্দ্র ও কাস্টমার সাপোর্ট - ${settings.websiteName || 'Hat Bazar'}`;
  }

  // 2. Set document standard tags
  document.title = title;

  // Set standard Meta tags
  updateMetaTag('description', description);
  updateMetaTag('keywords', keywords);

  // Set Open Graph social tags
  updateMetaTag('og:title', title, 'property');
  updateMetaTag('og:description', description, 'property');
  updateMetaTag('og:image', ogImage, 'property');
  updateMetaTag('og:url', url, 'property');
  updateMetaTag('og:type', view === 'product-details' ? 'product' : 'website', 'property');

  // Set Twitter Card social tags
  updateMetaTag('twitter:card', 'summary_large_image');
  updateMetaTag('twitter:title', title);
  updateMetaTag('twitter:description', description);
  updateMetaTag('twitter:image', ogImage);

  // 3. Set Canonical Link Tag
  let canonicalLink = document.querySelector('link[rel="canonical"]');
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.setAttribute('href', url);

  // 4. Inject Schema.org Structured Data (LD+JSON)
  updateSchemaMarkup(view, settings, product);
}

/**
 * Helper to update or create a meta tag.
 */
function updateMetaTag(name: string, content: string, attrName: 'name' | 'property' = 'name') {
  let element = document.querySelector(`meta[${attrName}="${name}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, name);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Generates and injects LD+JSON Structured Data to improve Rich Snippets indexing.
 */
function updateSchemaMarkup(view: string, settings: AdminSettings, product?: Product) {
  // Remove existing dynamic schemas to avoid duplicate stacking
  const existingSchema = document.getElementById('hb-dynamic-schema');
  if (existingSchema) {
    existingSchema.remove();
  }

  let schemaData: any = null;

  if (view === 'product-details' && product) {
    // Product schema
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      'name': product.name,
      'image': [product.imageUrl, ...(product.galleryImages || [])],
      'description': product.shortDescription || product.description.slice(0, 200),
      'sku': product.id,
      'mpn': product.id,
      'brand': {
        '@type': 'Brand',
        'name': settings.websiteName || 'Hat Bazar'
      },
      'offers': {
        '@type': 'Offer',
        'url': window.location.href,
        'priceCurrency': 'BDT',
        'price': product.discountPrice || product.price,
        'priceValidUntil': new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        'itemCondition': 'https://schema.org/NewCondition',
        'availability': 'https://schema.org/InStock',
        'seller': {
          '@type': 'Organization',
          'name': settings.websiteName || 'Hat Bazar'
        }
      },
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': product.rating || '5.0',
        'reviewCount': product.reviewsCount || '12'
      }
    };
  } else {
    // Website & Organization schema
    schemaData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': settings.websiteName || 'Hat Bazar',
      'url': window.location.origin,
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': `${window.location.origin}/#products?search={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    };
  }

  if (schemaData) {
    const script = document.createElement('script');
    script.id = 'hb-dynamic-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);
  }
}
