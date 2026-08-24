import { storage } from './storage.js';
import { CATEGORY_FALLBACK_IMAGES } from '../data/productDatabase.js';

export async function fetchAndApplyProductImage(imgElement, productName, categoryKey = 'OTHER') {
  if (!imgElement || !productName) return;

  const cleanName = productName.toLowerCase().trim();
  const cacheKey = `off_img_${cleanName}`;
  const cachedUrl = storage.get(cacheKey, null);

  if (cachedUrl) {
    imgElement.src = cachedUrl;
    return;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const url = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(cleanName)}&search_simple=1&action=process&json=1&page_size=3`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.products && data.products.length > 0) {
        const productWithImg = data.products.find(p => p.image_front_small_url || p.image_front_url || p.image_small_url || p.image_url);
        if (productWithImg) {
          const imgUrl = productWithImg.image_front_small_url || productWithImg.image_front_url || productWithImg.image_small_url || productWithImg.image_url;
          storage.set(cacheKey, imgUrl);
          imgElement.src = imgUrl;
          return;
        }
      }
    }
  } catch (err) {
    // Network or timeout abort - keep initial image gracefully
  }
}
