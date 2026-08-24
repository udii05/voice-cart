export class NLPParser {
  parse(transcript) {
    let raw = transcript.toLowerCase();
    
    let intent = 'UNKNOWN';
    let maxPrice = null;
    let items = [];
    
    const priceRegex = /(?:under|below|less than|cheaper than)\s+\$?(\d+(?:\.\d{1,2})?)/i;
    const priceMatch = raw.match(priceRegex);
    if (priceMatch) {
      maxPrice = parseFloat(priceMatch[1]);
      raw = raw.replace(priceRegex, '').trim();
    }
    
    if (/(substitute for|alternative to|instead of|replace\b|swap\b)/i.test(raw)) {
       intent = 'SUBSTITUTE_ITEM';
    } else if (/(what should i buy|do i need anything|recommend items|recommendations|what am i low on|running low|suggest groceries|suggest items|what do i need to restock)\b/i.test(raw)) {
       intent = 'RECOMMEND_ITEMS';
    } else if (/(what's in season|what is in season|seasonal produce|seasonal items|seasonal recommendations|what's on sale|what is on sale|show sales|discounts|deals)\b/i.test(raw)) {
       intent = 'SEASONAL_RECOMMENDATIONS';
    } else if (/(add|i need|i want to buy|put|buy|get me|get)\b/i.test(raw) && !/(remove|delete|take off|drop|check off|mark|cross off)\b/i.test(raw)) {
       intent = 'ADD_ITEM';
    } else if (/(remove|delete|take off|drop)\b/i.test(raw)) {
       intent = 'REMOVE_ITEM';
    } else if (/(check off|mark|cross off|got|bought)\b/i.test(raw)) {
       intent = 'CHECK_ITEM';
    } else if (/(clear my list|clear the list|empty list|delete all|start over)\b/i.test(raw)) {
       intent = 'CLEAR_LIST';
    } else if (/(what's on my list|read my list|show my list|what do i need)\b/i.test(raw)) {
       intent = 'READ_LIST';
    } else if (/(find|search for|search|look for|show me)\b/i.test(raw)) {
       intent = 'SEARCH_ITEM';
    } else if (/(help|what can i say|commands)\b/i.test(raw)) {
       intent = 'HELP';
    } else if (raw.trim().length > 0) {
       // Natural grocery item mention defaults to ADD_ITEM
       intent = 'ADD_ITEM';
    }
    
    if (['ADD_ITEM', 'REMOVE_ITEM', 'CHECK_ITEM', 'SEARCH_ITEM'].includes(intent)) {
      let cleaned = raw.replace(/\b(add|i need|i want to buy|put|buy|get me|get|remove|delete|take off|drop|check off|mark|cross off|got|bought|find|search for|search|look for|show me|please|from my list|to my list|on my list|to the list|in the cart|in my cart|to cart|the)\b/gi, '').trim();
      
      let itemStrings = cleaned.split(/(?:\band\b|,)/).map(s => s.trim()).filter(s => s.length > 0);
      
      itemStrings.forEach(str => {
        let quantity = 1;
        let unit = null;
        let name = str;
        
        const qtys = {'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5, 'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10, 'eleven': 11, 'twelve': 12, 'a': 1, 'an': 1, 'dozen': 12, 'half': 0.5};
        const qtyRegex = new RegExp(`^(\\d+|${Object.keys(qtys).join('|')})\\s+`, 'i');
        const m = name.match(qtyRegex);
        if (m) {
          quantity = isNaN(parseInt(m[1])) ? (qtys[m[1].toLowerCase()] || 1) : parseInt(m[1]);
          name = name.replace(qtyRegex, '').trim();
        }
        
        const units = ['bottles', 'bottle', 'bags', 'bag', 'boxes', 'box', 'cans', 'can', 'packs', 'pack', 'cartons', 'carton', 'kg', 'lbs', 'pounds', 'pound', 'ounces', 'ounce', 'liters', 'liter', 'gallons', 'gallon', 'bunches', 'bunch', 'heads', 'head', 'pieces', 'piece', 'loaves', 'loaf', 'jars', 'jar', 'rolls', 'roll'];
        const unitRegex = new RegExp(`^(${units.join('|')})\\s+(?:of\\s+)?`, 'i');
        const um = name.match(unitRegex);
        if (um) {
          unit = um[1].toLowerCase();
          name = name.replace(unitRegex, '').trim();
        }
        
        if (name) {
          items.push({ name, quantity, unit });
        }
      });
    }

    return {
      intent,
      items,
      maxPrice,
      raw
    };
  }
}

export const nlpParser = new NLPParser();
