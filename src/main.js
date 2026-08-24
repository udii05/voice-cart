/**
 * VoiceCart — Smart Voice Shopping Assistant
 * Main application bootstrap
 */

import { eventBus } from './utils/eventBus.js';
import { storage } from './utils/storage.js';
import { initApp } from './ui/app.js';
import { initSearchOverlay } from './ui/searchOverlay.js';
import { initToasts } from './ui/feedbackToast.js';
import { initLanguageSelector } from './ui/languageSelector.js';
import { nlpParser } from './modules/nlpParser.js';
import { shoppingList } from './modules/shoppingList.js';
import { suggestionsEngine } from './modules/suggestions.js';
import { voiceRecognition } from './modules/voiceRecognition.js';
import { speechSynthesizer } from './modules/speechSynthesis.js';
import { voiceSearch } from './modules/voiceSearch.js';
import { CATEGORIES } from './data/productDatabase.js';
import { getTranslation } from './data/translations.js';

// ── Bootstrap ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize UI Shell
  initApp();

  // 2. Initialize standalone UI components
  initSearchOverlay();
  initToasts();
  initLanguageSelector();

  // 3. Load saved language preference
  const savedLang = storage.get('voice_cart_language', 'en-US');
  if (voiceRecognition.isSupported) {
    voiceRecognition.setLanguage(savedLang);
  }
  speechSynthesizer.setLanguage(savedLang);

  // 4. Set up the Voice → NLP → Action pipeline
  setupCommandPipeline();

  // 5. Trigger initial suggestions
  eventBus.emit('suggestions:updated');

  // 6. Trigger initial list render
  eventBus.emit('list:updated', shoppingList.getItems());

  console.log('🛒 VoiceCart initialized');
});

// ── Command Processing Pipeline ─────────────────────────────────
function setupCommandPipeline() {
  eventBus.on('voice:result', ({ transcript, isFinal, confidence }) => {
    if (!isFinal) return; // Only process final results

    const command = nlpParser.parse(transcript);
    
    if (command.intent === 'UNKNOWN') {
      // If NLP couldn't determine intent, try adding as items (fallback)
      if (transcript.trim().length > 0) {
        command.intent = 'ADD_ITEM';
        if (command.items.length === 0) {
          command.items = [{ name: transcript.trim(), quantity: 1, unit: null }];
        }
      } else {
        return;
      }
    }

    processCommand(command);
  });
}

function processCommand(command) {
  switch (command.intent) {
    case 'ADD_ITEM':
      handleAddItems(command);
      break;

    case 'REMOVE_ITEM':
      handleRemoveItems(command);
      break;

    case 'CHECK_ITEM':
      handleCheckItems(command);
      break;

    case 'CLEAR_LIST':
      handleClearList();
      break;

    case 'READ_LIST':
      handleReadList();
      break;

    case 'SEARCH_ITEM':
      handleSearch(command);
      break;

    case 'RECOMMEND_ITEMS':
      handleRecommendItems(command);
      break;

    case 'SEASONAL_RECOMMENDATIONS':
      handleSeasonalRecommendations(command);
      break;

    case 'SUBSTITUTE_ITEM':
      handleSubstituteItem(command);
      break;

    case 'HELP':
      handleHelp();
      break;

    default:
      eventBus.emit('toast:show', {
        message: `I didn't understand that. Try "Add milk" or say "Help" for commands.`,
        type: 'info'
      });
  }

  eventBus.emit('command:parsed', { command });
}

// ── Command Handlers ────────────────────────────────────────────

function handleAddItems(command) {
  if (command.items.length === 0) {
    eventBus.emit('toast:show', {
      message: 'What would you like to add?',
      type: 'info'
    });
    return;
  }

  command.items.forEach(({ name, quantity, unit }) => {
    // Check if item already exists
    const existing = shoppingList.findItemByName(name);
    if (existing) {
      // Update quantity instead of duplicating
      const newQty = existing.quantity + quantity;
      shoppingList.updateQuantity(existing.id, newQty);
      eventBus.emit('toast:show', {
        message: `Updated ${name} to ${newQty}${unit ? ' ' + unit : ''}`,
        type: 'success'
      });
    } else {
      const item = shoppingList.addItem(name, quantity, unit);
      const unitStr = unit ? ` ${unit} of` : '';
      const qtyStr = quantity > 1 ? `${quantity}${unitStr} ` : '';
      
      eventBus.emit('toast:show', {
        message: `Added ${qtyStr}${name} to your list`,
        type: 'success',
        undoAction: () => {
          shoppingList.removeItem(item.id);
          eventBus.emit('toast:show', { message: `Removed ${name}`, type: 'info' });
        }
      });

      // Get suggestions for the added item
      const itemSuggestions = suggestionsEngine.getSuggestionsForItem(name);
      if (itemSuggestions.length > 0) {
        eventBus.emit('list:item-added', { item, suggestions: itemSuggestions });
      }
    }
  });

  // Refresh suggestions
  eventBus.emit('suggestions:updated');

  // Voice confirmation
  if (command.items.length === 1) {
    const { name, quantity, unit } = command.items[0];
    const unitStr = unit ? ` ${unit} of` : '';
    const qtyStr = quantity > 1 ? `${quantity}${unitStr} ` : '';
    speechSynthesizer.speak(`Added ${qtyStr}${name} to your list`);
  } else {
    speechSynthesizer.speak(`Added ${command.items.length} items to your list`);
  }
}

function handleRemoveItems(command) {
  if (command.items.length === 0) {
    eventBus.emit('toast:show', {
      message: 'What would you like to remove?',
      type: 'info'
    });
    return;
  }

  command.items.forEach(({ name }) => {
    const item = shoppingList.findItemByName(name);
    if (item) {
      const removedItem = shoppingList.removeItem(item.id);
      eventBus.emit('toast:show', {
        message: `Removed ${item.name} from your list`,
        type: 'success',
        undoAction: () => {
          shoppingList.addItem(removedItem.name, removedItem.quantity, removedItem.unit);
        }
      });
      speechSynthesizer.speak(`Removed ${item.name} from your list`);
    } else {
      eventBus.emit('toast:show', {
        message: `${name} is not on your list`,
        type: 'error'
      });
    }
  });

  eventBus.emit('suggestions:updated');
}

function handleCheckItems(command) {
  if (command.items.length === 0) {
    eventBus.emit('toast:show', {
      message: 'What item did you get?',
      type: 'info'
    });
    return;
  }

  command.items.forEach(({ name }) => {
    const item = shoppingList.findItemByName(name);
    if (item) {
      shoppingList.toggleItem(item.id);
      const status = item.checked ? 'unchecked' : 'checked off';
      eventBus.emit('toast:show', {
        message: `${status.charAt(0).toUpperCase() + status.slice(1)} ${item.name}`,
        type: 'success'
      });
      speechSynthesizer.speak(`${status} ${item.name}`);
    } else {
      eventBus.emit('toast:show', {
        message: `${name} is not on your list`,
        type: 'error'
      });
    }
  });
}

function handleClearList() {
  const items = shoppingList.getItems();
  if (items.length === 0) {
    eventBus.emit('toast:show', {
      message: 'Your list is already empty',
      type: 'info'
    });
    return;
  }

  const backup = [...items];
  shoppingList.clearList();

  eventBus.emit('toast:show', {
    message: `Cleared ${backup.length} items from your list`,
    type: 'success',
    undoAction: () => {
      backup.forEach(item => {
        shoppingList.addItem(item.name, item.quantity, item.unit);
      });
      eventBus.emit('toast:show', { message: 'List restored', type: 'success' });
    }
  });

  speechSynthesizer.speak('Shopping list cleared');
  eventBus.emit('suggestions:updated');
}

function handleReadList() {
  const items = shoppingList.getItems();

  if (items.length === 0) {
    speechSynthesizer.speak('Your shopping list is empty. Try adding some items.');
    eventBus.emit('toast:show', {
      message: 'Your list is empty',
      type: 'info'
    });
    return;
  }

  const unchecked = items.filter(i => !i.checked);
  const checked = items.filter(i => i.checked);

  let speech = `You have ${items.length} items on your list. `;

  if (unchecked.length > 0) {
    const names = unchecked.slice(0, 8).map(i => {
      const qty = i.quantity > 1 ? `${i.quantity} ` : '';
      return `${qty}${i.name}`;
    });
    speech += `Still needed: ${names.join(', ')}. `;
    if (unchecked.length > 8) {
      speech += `And ${unchecked.length - 8} more. `;
    }
  }

  if (checked.length > 0) {
    speech += `${checked.length} items already checked off.`;
  }

  speechSynthesizer.speak(speech);
  eventBus.emit('toast:show', {
    message: `📋 ${unchecked.length} remaining, ${checked.length} done`,
    type: 'info'
  });
}

function handleSearch(command) {
  if (command.items.length === 0 && !command.maxPrice) {
    eventBus.emit('toast:show', {
      message: 'What are you looking for?',
      type: 'info'
    });
    return;
  }

  const query = command.items.length > 0 ? command.items[0].name : '';
  const filters = {};
  if (command.maxPrice) filters.maxPrice = command.maxPrice;

  const results = voiceSearch.search(query, filters);

  if (results.length === 0) {
    eventBus.emit('toast:show', {
      message: `No results found for "${query}"`,
      type: 'info'
    });
    speechSynthesizer.speak(`I couldn't find any results for ${query}`);
  } else {
    const priceNote = command.maxPrice ? ` under $${command.maxPrice}` : '';
    speechSynthesizer.speak(`Found ${results.length} results for ${query}${priceNote}`);
  }
}

function handleHelp() {
  const currentLang = storage.get('voice_cart_language', 'en-US');
  const toastMsg = getTranslation('helpToast', currentLang);
  const speechMsg = getTranslation('helpSpeech', currentLang);

  eventBus.emit('toast:show', {
    message: toastMsg,
    type: 'info'
  });

  speechSynthesizer.speak(speechMsg);
}

function handleRecommendItems(command) {
  eventBus.emit('recommendations:switch-tab', 'restock');
  const restock = suggestionsEngine.getRestockRecommendations(3);
  if (restock.length > 0) {
    const itemNames = restock.map(r => r.name).join(', ');
    const msg = `Based on your previous orders, you might be running low on ${itemNames}.`;
    eventBus.emit('toast:show', { message: `⚡ ${msg}`, type: 'info' });
    speechSynthesizer.speak(msg);
  } else {
    speechSynthesizer.speak('You are all stocked up on your usual essentials!');
  }
}

function handleSeasonalRecommendations(command) {
  eventBus.emit('recommendations:switch-tab', 'seasonal');
  const seasonal = suggestionsEngine.getSeasonalAndSale(3);
  if (seasonal.length > 0) {
    const itemNames = seasonal.map(s => s.name).join(', ');
    const msg = `Here are fresh seasonal picks and deals: ${itemNames}.`;
    eventBus.emit('toast:show', { message: `🌱 ${msg}`, type: 'info' });
    speechSynthesizer.speak(msg);
  } else {
    speechSynthesizer.speak('Explore our fresh seasonal harvest produce in the catalog!');
  }
}

function handleSubstituteItem(command) {
  const raw = command.raw || '';
  
  // Check for swap pattern: "swap milk with/for almond milk" or "replace milk with almond milk"
  const swapMatch = raw.match(/(?:swap|replace)\s+([a-zA-Z\s]+?)\s+(?:with|for)\s+([a-zA-Z\s]+)/i);
  if (swapMatch) {
    const oldName = swapMatch[1].trim();
    const newName = swapMatch[2].trim();
    const existing = shoppingList.findItemByName(oldName);
    
    if (existing) {
      shoppingList.swapItem(existing.id, newName);
      const msg = `Swapped ${existing.name} with ${newName}`;
      eventBus.emit('toast:show', { message: `🔄 ${msg}`, type: 'success' });
      speechSynthesizer.speak(msg);
      eventBus.emit('suggestions:updated');
      return;
    }
  }

  // Check for inquiry pattern: "substitute for milk" or "alternative to butter"
  const subInquiry = raw.match(/(?:substitute for|alternative to|instead of)\s+([a-zA-Z\s]+)/i);
  const targetItem = subInquiry ? subInquiry[1].trim() : (command.items[0]?.name || '');

  if (targetItem) {
    const subs = suggestionsEngine.getSubstitutes(targetItem);
    if (subs.length > 0) {
      eventBus.emit('recommendations:switch-tab', 'substitutes');
      const subNames = subs.slice(0, 3).map(s => s.name).join(', ');
      const msg = `Great alternatives for ${targetItem} include ${subNames}.`;
      eventBus.emit('toast:show', { message: `🌱 ${msg}`, type: 'info' });
      speechSynthesizer.speak(msg);
      return;
    }
  }

  eventBus.emit('recommendations:switch-tab', 'substitutes');
  speechSynthesizer.speak('Here are popular healthy and dietary swaps for your cart.');
}
