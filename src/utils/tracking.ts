import { AdminSettings, Product, CartItem, Order } from '../types';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
    gtag?: any;
    dataLayer?: any[];
    gtmLoaded?: boolean;
  }
}

// Get latest settings on-demand from localStorage to ensure up-to-date tracking status
function getTrackingConfig(): AdminSettings | null {
  const saved = localStorage.getItem('hb-admin-settings');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  }
  return null;
}

/**
 * Dynamically injects tracking scripts into the page header if enabled in settings.
 */
export function initTracking() {
  const config = getTrackingConfig();
  if (!config) return;

  // 1. Google Tag Manager (GTM)
  if (config.googleTagManagerId && config.enableGoogleTagManager) {
    const gtmId = config.googleTagManagerId.trim();
    if (gtmId && !window.gtmLoaded) {
      window.gtmLoaded = true;
      (function (w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        const f = d.getElementsByTagName(s)[0];
        const j = d.createElement(s) as HTMLScriptElement;
        const dl = l !== 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        if (f && f.parentNode) {
          f.parentNode.insertBefore(j, f);
        } else {
          document.head.appendChild(j);
        }
      })(window, document, 'script', 'dataLayer', gtmId);
      console.log(`[Tracking] Google Tag Manager (${gtmId}) loaded.`);
    }
  }

  // 2. Google Analytics 4 (GA4)
  if (config.googleAnalyticsId && config.enableGoogleAnalytics) {
    const gaId = config.googleAnalyticsId.trim();
    if (gaId) {
      if (!document.getElementById('ga-script')) {
        const script = document.createElement('script');
        script.id = 'ga-script';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function (...args: any[]) {
          window.dataLayer?.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', gaId, { page_path: window.location.pathname });
        console.log(`[Tracking] Google Analytics 4 (${gaId}) loaded.`);
      }
    }
  }

  // 3. Facebook Meta Pixel
  if (config.facebookPixelId && config.enableFacebookPixel) {
    const pixelId = config.facebookPixelId.trim();
    if (pixelId && !window.fbq) {
      (function (f: any, b: Document, e: string, v: string, n?: any, t?: any, s?: any) {
        if (f.fbq) return;
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        };
        if (!f._fbq) f._fbq = n;
        n.push = n;
        n.loaded = !0;
        n.version = '2.0';
        n.queue = [];
        t = b.createElement(e);
        t.async = !0;
        t.src = v;
        s = b.getElementsByTagName(e)[0];
        if (s && s.parentNode) {
          s.parentNode.insertBefore(t, s);
        } else {
          b.head.appendChild(t);
        }
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

      window.fbq('init', pixelId);
      window.fbq('track', 'PageView');
      console.log(`[Tracking] Meta Pixel (${pixelId}) loaded.`);
    }
  }
}

/**
 * Tracks generic page views
 */
export function trackPageView(url: string) {
  const config = getTrackingConfig();
  if (!config) return;

  // Track in GA4
  if (config.enableGoogleAnalytics && window.gtag && config.googleAnalyticsId) {
    window.gtag('config', config.googleAnalyticsId, { page_path: url });
  }

  // Track in Meta Pixel
  if (config.enableFacebookPixel && window.fbq) {
    window.fbq('track', 'PageView');
  }
}

/**
 * Tracks Product View (ViewContent)
 */
export function trackViewContent(product: Product) {
  const config = getTrackingConfig();
  if (!config) return;

  const eventData = {
    content_name: product.name,
    content_category: product.category,
    content_ids: [product.id],
    content_type: 'product',
    value: product.discountPrice || product.price,
    currency: 'BDT'
  };

  // GA4 product view
  if (config.enableGoogleAnalytics && window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'BDT',
      value: eventData.value,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: eventData.value
      }]
    });
  }

  // Meta Pixel ViewContent
  if (config.enableFacebookPixel && window.fbq) {
    window.fbq('track', 'ViewContent', eventData);
  }
  console.log('[Tracking] Event: ViewContent', eventData);
}

/**
 * Tracks Add to Cart / Buy Button
 */
export function trackAddToCart(product: Product) {
  const config = getTrackingConfig();
  if (!config) return;

  const price = product.discountPrice || product.price;
  const eventData = {
    content_name: product.name,
    content_category: product.category,
    content_ids: [product.id],
    content_type: 'product',
    value: price,
    currency: 'BDT'
  };

  // GA4 AddToCart
  if (config.enableGoogleAnalytics && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'BDT',
      value: price,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: price
      }]
    });
  }

  // Meta Pixel AddToCart
  if (config.enableFacebookPixel && window.fbq) {
    window.fbq('track', 'AddToCart', eventData);
  }
  console.log('[Tracking] Event: AddToCart', eventData);
}

/**
 * Tracks Checkout Initialized
 */
export function trackInitiateCheckout(items: CartItem[], total: number) {
  const config = getTrackingConfig();
  if (!config) return;

  const eventData = {
    content_ids: items.map(item => item.product.id),
    contents: items.map(item => ({
      id: item.product.id,
      quantity: item.quantity,
      price: item.product.discountPrice || item.product.price
    })),
    value: total,
    currency: 'BDT',
    num_items: items.reduce((sum, item) => sum + item.quantity, 0)
  };

  // GA4 InitiateCheckout
  if (config.enableGoogleAnalytics && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'BDT',
      value: total,
      items: items.map(item => ({
        item_id: item.product.id,
        item_name: item.product.name,
        item_category: item.product.category,
        price: item.product.discountPrice || item.product.price,
        quantity: item.quantity
      }))
    });
  }

  // Meta Pixel InitiateCheckout
  if (config.enableFacebookPixel && window.fbq) {
    window.fbq('track', 'InitiateCheckout', eventData);
  }
  console.log('[Tracking] Event: InitiateCheckout', eventData);
}

/**
 * Tracks Completed Purchase
 */
export function trackPurchase(order: Order) {
  const config = getTrackingConfig();
  if (!config) return;

  const eventData = {
    content_ids: order.items.map(item => item.productId),
    contents: order.items.map(item => ({
      id: item.productId,
      name: item.name,
      price: item.price
    })),
    value: order.totalAmount,
    currency: 'BDT',
    order_id: order.id
  };

  // GA4 Purchase
  if (config.enableGoogleAnalytics && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: order.id,
      value: order.totalAmount,
      currency: 'BDT',
      items: order.items.map(item => ({
        item_id: item.productId,
        item_name: item.name,
        price: item.price
      }))
    });
  }

  // Meta Pixel Purchase
  if (config.enableFacebookPixel && window.fbq) {
    window.fbq('track', 'Purchase', eventData);
  }
  console.log('[Tracking] Event: Purchase', eventData);
}
