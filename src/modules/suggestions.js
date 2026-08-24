import { eventBus } from '../utils/eventBus.js';
import { shoppingList } from './shoppingList.js';
import { SEASONAL, SUBSTITUTES, COMPLEMENTARY, CATEGORIES, PRODUCTS } from '../data/productDatabase.js';

// Dietary and wellness explanations for popular substitutions
const SUBSTITUTE_REASONS = {
  'almond milk': 'Low-calorie, dairy-free plant milk',
  'oat milk': 'Creamy fiber-rich dairy alternative',
  'soy milk': 'High-protein plant-based staple',
  'coconut milk': 'Naturally sweet dairy-free swap',
  'olive oil': 'Heart-healthy monounsaturated fat',
  'coconut oil': 'Rich vegan cooking oil',
  'margarine': 'Plant-based butter substitute',
  'flax eggs': 'Vegan egg substitute for baking',
  'applesauce': 'Moisture-rich oil/egg alternative in baking',
  'stevia': 'Zero-calorie natural herbal sweetener',
  'honey': 'Antioxidant-rich unrefined sweetener',
  'maple syrup': 'Pure natural mineral sweetener',
  'almond flour': 'Gluten-free, low-carb baking flour',
  'oat flour': 'Whole-grain gluten-free alternative',
  'quinoa': 'Complete protein & high-fiber grain',
  'cauliflower rice': 'Low-carb, keto vegetable swap',
  'zucchini noodles': 'Fresh vegetable pasta alternative',
  'whole wheat pasta': 'High-fiber complex carbohydrate',
  'tortillas': 'Versatile wrap alternative to sliced bread',
  'pita': 'Mediterranean pocket bread alternative',
  'sourdough': 'Slow-fermented prebiotic artisan bread',
  'greek yogurt': 'High-protein creamy substitute for sour cream',
  'cottage cheese': 'Low-fat calcium-dense substitute',
  'ground turkey': 'Lean low-fat poultry alternative to beef',
  'tofu': 'Clean plant-based protein staple',
  'turkey bacon': 'Lower-sodium, lean bacon substitute',
  'sparkling water': 'Zero-sugar refreshing alternative to soda',
  'almond butter': 'Vitamin E rich alternative to peanut butter',
  'sweet potato': 'Nutrient-dense vitamin A root swap'
};

// Sale items catalog
const SALE_ITEMS = [
  { name: 'avocados', discount: '25% OFF', reason: 'Weekly Flash Deal', originalPrice: 1.99, salePrice: 1.49, badge: '🔥 SALE' },
  { name: 'strawberries', discount: '20% OFF', reason: 'Fresh Farm Pick', originalPrice: 4.49, salePrice: 3.49, badge: '🍓 SALE' },
  { name: 'sourdough', discount: '15% OFF', reason: 'Daily Bakery Special', originalPrice: 4.99, salePrice: 4.19, badge: '🥖 SALE' },
  { name: 'olive oil', discount: '$2.00 OFF', reason: 'Pantry Essential Deal', originalPrice: 8.99, salePrice: 6.99, badge: '🏷️ DEAL' },
  { name: 'greek yogurt', discount: 'Buy 2 Get 1', reason: 'Dairy Aisle Promo', originalPrice: 1.49, salePrice: 1.19, badge: '🥛 PROMO' },
  { name: 'organic milk', discount: '15% OFF', reason: 'Organic Farm Rebate', originalPrice: 4.49, salePrice: 3.79, badge: '🌱 ORGANIC' }
];

export class SuggestionsEngine {

  /**
   * Feature 1: Product Recommendations (History & Reorder Intelligence)
   * Suggests items the user is likely running low on based on past frequencies.
   */
  getRestockRecommendations(limit = 6) {
    const history = shoppingList.getHistory();
    const historyMeta = shoppingList.getHistoryMeta ? shoppingList.getHistoryMeta() : {};
    const currentItems = shoppingList.getItems().map(i => i.name.toLowerCase());
    
    let candidates = Object.entries(history)
      .filter(([name]) => !currentItems.some(ci => ci.includes(name) || name.includes(ci)))
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => {
        const meta = historyMeta[name];
        let reason = `Running low? Added ${count} times before`;
        
        if (meta?.lastAdded) {
          const daysAgo = Math.max(1, Math.floor((Date.now() - meta.lastAdded) / (1000 * 60 * 60 * 24)));
          reason = `Running low? Last added ${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`;
        }
        
        return {
          name,
          type: 'restock',
          badge: '⚡ RESTOCK',
          reason,
          count
        };
      });

    // If history is small, supplement with household pantry staples
    if (candidates.length < limit) {
      const stapleDefaults = [
        { name: 'bread', reason: 'Running low on bread? Household staple', badge: '⚡ STAPLE' },
        { name: 'milk', reason: 'Time to restock milk? Frequently needed', badge: '⚡ STAPLE' },
        { name: 'eggs', reason: 'Low on eggs? 94% reorder rate', badge: '⚡ STAPLE' },
        { name: 'bananas', reason: 'Fresh bananas restock recommendation', badge: '⚡ STAPLE' },
        { name: 'butter', reason: 'Running low on butter? Kitchen essential', badge: '⚡ STAPLE' },
        { name: 'apples', reason: 'Fresh fruit restock recommendation', badge: '⚡ STAPLE' }
      ];

      stapleDefaults.forEach(s => {
        if (!currentItems.some(ci => ci.includes(s.name) || s.name.includes(ci)) &&
            !candidates.some(c => c.name.toLowerCase() === s.name.toLowerCase())) {
          candidates.push({
            name: s.name,
            type: 'restock',
            badge: s.badge,
            reason: s.reason,
            count: 1
          });
        }
      });
    }

    return candidates.slice(0, limit);
  }

  /**
   * Feature 2: Seasonal Recommendations (In-Season Harvest & Sale Deals)
   */
  getSeasonalAndSale(limit = 6) {
    const currentItems = shoppingList.getItems().map(i => i.name.toLowerCase());
    const month = new Date().getMonth() + 1; // 1-12
    let seasonKey = 'summer';
    
    for (const [key, data] of Object.entries(SEASONAL)) {
      if (data.months.includes(month)) {
        seasonKey = key;
        break;
      }
    }
    
    const seasonalItems = SEASONAL[seasonKey]?.items || ['strawberries', 'tomatoes', 'cucumber', 'watermelon'];
    
    const seasonList = seasonalItems
      .filter(name => !currentItems.some(ci => ci.includes(name) || name.includes(ci)))
      .map(name => ({
        name,
        type: 'seasonal',
        badge: `🌱 ${seasonKey.toUpperCase()} HARVEST`,
        reason: `Peak fresh & in-season this month`
      }));

    const saleList = SALE_ITEMS
      .filter(item => !currentItems.some(ci => ci.includes(item.name) || item.name.includes(ci)))
      .map(item => ({
        name: item.name,
        type: 'sale',
        badge: item.badge,
        discount: item.discount,
        reason: `${item.discount} — ${item.reason}`
      }));

    // Interleave seasonal + sale items
    const combined = [];
    const maxLen = Math.max(seasonList.length, saleList.length);
    for (let i = 0; i < maxLen; i++) {
      if (saleList[i]) combined.push(saleList[i]);
      if (seasonList[i]) combined.push(seasonList[i]);
    }

    return combined.slice(0, limit);
  }

  /**
   * Feature 3: Smart Substitutes & Dietary Alternatives Engine
   * Suggests healthier/dietary swaps for items currently in the cart or specified item.
   */
  getSubstitutesForCurrentList() {
    const currentList = shoppingList.getItems();
    const suggestions = [];

    currentList.forEach(item => {
      const lowerName = item.name.toLowerCase().trim();
      
      // Match against product or key substitute entries
      let matchedKey = Object.keys(SUBSTITUTES).find(k => lowerName.includes(k) || k.includes(lowerName));
      
      if (matchedKey && SUBSTITUTES[matchedKey]) {
        const altNames = SUBSTITUTES[matchedKey];
        altNames.forEach(altName => {
          // Make sure the alternative isn't already in cart
          if (!currentList.some(ci => ci.name.toLowerCase().includes(altName) || altName.includes(ci.name.toLowerCase()))) {
            suggestions.push({
              originalItem: item,
              originalName: item.name,
              name: altName,
              type: 'substitute',
              badge: '🔄 SMART SWAP',
              reason: SUBSTITUTE_REASONS[altName] || `Healthier alternative to ${item.name}`
            });
          }
        });
      }
    });

    // If cart is empty or has no substitute matches, provide popular smart swaps
    if (suggestions.length === 0) {
      const generalSwaps = [
        { originalName: 'regular milk', name: 'oat milk', reason: 'Plant-based, lactose-free & creamy', badge: '🌾 PLANT-BASED' },
        { originalName: 'butter', name: 'olive oil', reason: 'Heart-healthy monounsaturated alternative', badge: '🥑 HEALTHY FAT' },
        { originalName: 'white bread', name: 'sourdough', reason: 'Slow-fermented artisan sourdough', badge: '🥖 ARTISAN SWAP' },
        { originalName: 'sugar', name: 'raw honey', reason: 'Natural antioxidant-dense unrefined sweetener', badge: '🍯 NATURAL' },
        { originalName: 'ground beef', name: 'ground turkey', reason: 'Lean high-protein low-fat alternative', badge: '💪 LEAN PROTEIN' },
        { originalName: 'regular rice', name: 'quinoa', reason: 'Complete amino-acid protein grain', badge: '🌱 SUPERFOOD' }
      ];

      return generalSwaps.map(s => ({
        ...s,
        type: 'substitute'
      }));
    }

    return suggestions.slice(0, 6);
  }

  getSubstitutes(itemName) {
    const lowerName = itemName.toLowerCase().trim();
    let matchedKey = Object.keys(SUBSTITUTES).find(k => lowerName.includes(k) || k.includes(lowerName)) || lowerName;
    const subs = SUBSTITUTES[matchedKey] || [];
    
    return subs.map(name => ({
      name,
      originalName: itemName,
      type: 'substitute',
      badge: '🔄 ALTERNATIVE',
      reason: SUBSTITUTE_REASONS[name] || `Try instead of ${itemName}`
    }));
  }

  getComplementary(itemName) {
    const currentItems = shoppingList.getItems().map(i => i.name.toLowerCase());
    const lowerName = itemName.toLowerCase().trim();
    let matchedKey = Object.keys(COMPLEMENTARY).find(k => lowerName.includes(k) || k.includes(lowerName)) || lowerName;
    const comps = COMPLEMENTARY[matchedKey] || [];
    
    return comps
      .filter(name => !currentItems.some(ci => ci.includes(name) || name.includes(ci)))
      .map(name => ({
        name,
        type: 'complementary',
        badge: '✨ PAIRING',
        reason: `Goes great with ${itemName}`
      }));
  }

  getAllSuggestions() {
    const restock = this.getRestockRecommendations(4);
    const seasonal = this.getSeasonalAndSale(4);
    const substitutes = this.getSubstitutesForCurrentList().slice(0, 4);
    
    const combined = [...restock, ...seasonal, ...substitutes];
    
    // deduplicate by name
    const seen = new Set();
    return combined.filter(item => {
      if (seen.has(item.name.toLowerCase())) return false;
      seen.add(item.name.toLowerCase());
      return true;
    }).slice(0, 12);
  }
}

export const suggestionsEngine = new SuggestionsEngine();

