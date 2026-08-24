import { eventBus } from '../utils/eventBus.js';
import { storage } from '../utils/storage.js';
import { categorizeItem } from '../data/productDatabase.js';

export class ShoppingList {
  constructor() {
    this.items = storage.get('voice_cart_items', []);
    this.history = storage.get('voice_cart_history', {});
    this.historyMeta = storage.get('voice_cart_history_meta', {});
  }

  _generateId() {
    return typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  _save() {
    storage.set('voice_cart_items', this.items);
    storage.set('voice_cart_history', this.history);
    storage.set('voice_cart_history_meta', this.historyMeta);
  }

  addItem(name, quantity = 1, unit = null) {
    const category = categorizeItem(name);
    const item = {
      id: this._generateId(),
      name,
      quantity,
      unit,
      category,
      checked: false,
      addedAt: Date.now()
    };
    
    this.items.push(item);
    
    // update history
    const lowerName = name.toLowerCase();
    this.history[lowerName] = (this.history[lowerName] || 0) + 1;
    this.historyMeta[lowerName] = {
      count: this.history[lowerName],
      lastAdded: Date.now(),
      category
    };
    
    this._save();
    
    eventBus.emit('list:item-added', { item });
    eventBus.emit('list:updated', this.items);
    
    return item;
  }

  swapItem(id, newName, quantity = 1, unit = null) {
    const index = this.items.findIndex(i => i.id === id);
    if (index > -1) {
      const oldItem = this.items[index];
      const category = categorizeItem(newName);
      const newItem = {
        id: oldItem.id,
        name: newName,
        quantity: quantity || oldItem.quantity || 1,
        unit: unit !== null ? unit : oldItem.unit,
        category,
        checked: false,
        addedAt: Date.now()
      };
      this.items[index] = newItem;
      
      const lowerName = newName.toLowerCase();
      this.history[lowerName] = (this.history[lowerName] || 0) + 1;
      this.historyMeta[lowerName] = {
        count: this.history[lowerName],
        lastAdded: Date.now(),
        category
      };
      
      this._save();
      eventBus.emit('list:item-swapped', { oldItem, newItem });
      eventBus.emit('list:updated', this.items);
      return newItem;
    }
    return null;
  }

  removeItem(id) {
    const index = this.items.findIndex(i => i.id === id);
    if (index > -1) {
      const item = this.items[index];
      this.items.splice(index, 1);
      this._save();
      
      eventBus.emit('list:item-removed', { item });
      eventBus.emit('list:updated', this.items);
      return item;
    }
    return null;
  }

  toggleItem(id) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.checked = !item.checked;
      this._save();
      
      eventBus.emit('list:item-checked', { item });
      eventBus.emit('list:updated', this.items);
    }
  }

  updateQuantity(id, quantity) {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.quantity = quantity;
      this._save();
      eventBus.emit('list:updated', this.items);
    }
  }

  getItems() {
    return [...this.items];
  }

  getItemsByCategory() {
    const grouped = {};
    this.items.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    
    // sort inside categories
    Object.keys(grouped).forEach(cat => {
      grouped[cat].sort((a, b) => a.name.localeCompare(b.name));
    });
    
    return grouped;
  }

  clearList() {
    this.items = [];
    this._save();
    eventBus.emit('list:cleared');
    eventBus.emit('list:updated', this.items);
  }

  clearChecked() {
    this.items = this.items.filter(i => !i.checked);
    this._save();
    eventBus.emit('list:updated', this.items);
  }

  findItemByName(name) {
    const lowerName = name.toLowerCase();
    return this.items.find(i => i.name.toLowerCase().includes(lowerName));
  }

  getHistory() {
    return { ...this.history };
  }

  getHistoryMeta() {
    return { ...this.historyMeta };
  }
}

export const shoppingList = new ShoppingList();
