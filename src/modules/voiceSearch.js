import { searchProducts } from '../data/productDatabase.js';
import { eventBus } from '../utils/eventBus.js';

export class VoiceSearch {
  search(query, filters = {}) {
    const results = searchProducts(query, filters);
    
    eventBus.emit('search:results', { results, query });
    return results;
  }
}

export const voiceSearch = new VoiceSearch();
