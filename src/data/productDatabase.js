export const CATEGORIES = {
  PRODUCE: { name: 'Produce', icon: '🍎', color: '#4CAF50' },
  DAIRY: { name: 'Dairy & Eggs', icon: '🥛', color: '#42A5F5' },
  BAKERY: { name: 'Bakery', icon: '🍞', color: '#FF9800' },
  MEAT: { name: 'Meat & Seafood', icon: '🥩', color: '#EF5350' },
  PANTRY: { name: 'Pantry', icon: '🥫', color: '#8D6E63' },
  BEVERAGES: { name: 'Beverages', icon: '☕', color: '#26C6DA' },
  SNACKS: { name: 'Snacks & Sweets', icon: '🍪', color: '#AB47BC' },
  FROZEN: { name: 'Frozen', icon: '🧊', color: '#29B6F6' },
  HOUSEHOLD: { name: 'Household', icon: '🧹', color: '#78909C' },
  PERSONAL_CARE: { name: 'Personal Care', icon: '🧼', color: '#26A69A' },
  OTHER: { name: 'Other', icon: '🛒', color: '#9E9E9E' }
};

export const PRODUCTS = [
  // Produce (30)
  { name: 'apples', category: 'PRODUCE', keywords: ['apple', 'fruit'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'bananas', category: 'PRODUCE', keywords: ['banana', 'fruit'], price: 1.99, seasonal: null, substitutes: [] },
  { name: 'oranges', category: 'PRODUCE', keywords: ['orange', 'fruit'], price: 4.99, seasonal: {months:[12,1,2]}, substitutes: [] },
  { name: 'strawberries', category: 'PRODUCE', keywords: ['strawberry', 'berry'], price: 3.49, seasonal: {months:[3,4,5]}, substitutes: [] },
  { name: 'blueberries', category: 'PRODUCE', keywords: ['blueberry', 'berry'], price: 4.49, seasonal: null, substitutes: [] },
  { name: 'grapes', category: 'PRODUCE', keywords: ['grape', 'fruit'], price: 5.99, seasonal: null, substitutes: [] },
  { name: 'watermelon', category: 'PRODUCE', keywords: ['melon', 'fruit'], price: 6.99, seasonal: {months:[6,7,8]}, substitutes: [] },
  { name: 'mango', category: 'PRODUCE', keywords: ['mango', 'fruit'], price: 2.50, seasonal: {months:[6,7,8]}, substitutes: [] },
  { name: 'pineapple', category: 'PRODUCE', keywords: ['pineapple', 'fruit'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'avocado', category: 'PRODUCE', keywords: ['avocado', 'vegetable'], price: 1.50, seasonal: null, substitutes: [] },
  { name: 'tomatoes', category: 'PRODUCE', keywords: ['tomato', 'vegetable'], price: 2.99, seasonal: {months:[6,7,8]}, substitutes: [] },
  { name: 'potatoes', category: 'PRODUCE', keywords: ['potato', 'root'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'onions', category: 'PRODUCE', keywords: ['onion', 'vegetable'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'garlic', category: 'PRODUCE', keywords: ['garlic', 'vegetable'], price: 0.99, seasonal: null, substitutes: [] },
  { name: 'carrots', category: 'PRODUCE', keywords: ['carrot', 'vegetable'], price: 1.99, seasonal: null, substitutes: [] },
  { name: 'broccoli', category: 'PRODUCE', keywords: ['broccoli', 'vegetable'], price: 2.49, seasonal: null, substitutes: [] },
  { name: 'spinach', category: 'PRODUCE', keywords: ['spinach', 'greens'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'lettuce', category: 'PRODUCE', keywords: ['lettuce', 'greens'], price: 1.99, seasonal: null, substitutes: [] },
  { name: 'cucumber', category: 'PRODUCE', keywords: ['cucumber', 'vegetable'], price: 1.50, seasonal: {months:[6,7,8]}, substitutes: [] },
  { name: 'bell pepper', category: 'PRODUCE', keywords: ['pepper', 'vegetable'], price: 1.99, seasonal: null, substitutes: [] },
  { name: 'mushrooms', category: 'PRODUCE', keywords: ['mushroom', 'fungi'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'corn', category: 'PRODUCE', keywords: ['corn', 'vegetable'], price: 0.99, seasonal: {months:[6,7,8]}, substitutes: [] },
  { name: 'celery', category: 'PRODUCE', keywords: ['celery', 'vegetable'], price: 1.99, seasonal: null, substitutes: [] },
  { name: 'sweet potato', category: 'PRODUCE', keywords: ['sweet potato', 'root'], price: 3.99, seasonal: {months:[9,10,11]}, substitutes: [] },
  { name: 'zucchini', category: 'PRODUCE', keywords: ['zucchini', 'vegetable'], price: 1.99, seasonal: {months:[6,7,8]}, substitutes: [] },
  { name: 'lemon', category: 'PRODUCE', keywords: ['lemon', 'citrus'], price: 0.79, seasonal: null, substitutes: [] },
  { name: 'lime', category: 'PRODUCE', keywords: ['lime', 'citrus'], price: 0.59, seasonal: null, substitutes: [] },
  { name: 'ginger', category: 'PRODUCE', keywords: ['ginger', 'root'], price: 1.99, seasonal: null, substitutes: [] },
  { name: 'kale', category: 'PRODUCE', keywords: ['kale', 'greens'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'cauliflower', category: 'PRODUCE', keywords: ['cauliflower', 'vegetable'], price: 3.49, seasonal: null, substitutes: [] },

  // Dairy (20)
  { name: 'milk', category: 'DAIRY', keywords: ['milk', 'dairy'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'eggs', category: 'DAIRY', keywords: ['eggs', 'dairy'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'butter', category: 'DAIRY', keywords: ['butter', 'dairy'], price: 3.49, seasonal: null, substitutes: [] },
  { name: 'cheese', category: 'DAIRY', keywords: ['cheese', 'dairy'], price: 5.99, seasonal: null, substitutes: [] },
  { name: 'yogurt', category: 'DAIRY', keywords: ['yogurt', 'dairy'], price: 1.29, seasonal: null, substitutes: [] },
  { name: 'cream cheese', category: 'DAIRY', keywords: ['cream cheese', 'dairy'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'sour cream', category: 'DAIRY', keywords: ['sour cream', 'dairy'], price: 2.49, seasonal: null, substitutes: [] },
  { name: 'cheddar', category: 'DAIRY', keywords: ['cheddar', 'cheese'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'mozzarella', category: 'DAIRY', keywords: ['mozzarella', 'cheese'], price: 4.49, seasonal: null, substitutes: [] },
  { name: 'parmesan', category: 'DAIRY', keywords: ['parmesan', 'cheese'], price: 6.99, seasonal: null, substitutes: [] },
  { name: 'cottage cheese', category: 'DAIRY', keywords: ['cottage cheese', 'dairy'], price: 3.49, seasonal: null, substitutes: [] },
  { name: 'heavy cream', category: 'DAIRY', keywords: ['heavy cream', 'dairy'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'almond milk', category: 'DAIRY', keywords: ['almond milk', 'dairy alternative'], price: 3.49, seasonal: null, substitutes: [] },
  { name: 'oat milk', category: 'DAIRY', keywords: ['oat milk', 'dairy alternative'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'whipping cream', category: 'DAIRY', keywords: ['whipping cream', 'dairy'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'soy milk', category: 'DAIRY', keywords: ['soy milk', 'dairy alternative'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'ghee', category: 'DAIRY', keywords: ['ghee', 'butter'], price: 8.99, seasonal: null, substitutes: [] },
  { name: 'provolone', category: 'DAIRY', keywords: ['provolone', 'cheese'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'swiss cheese', category: 'DAIRY', keywords: ['swiss cheese', 'cheese'], price: 5.49, seasonal: null, substitutes: [] },
  { name: 'ricotta', category: 'DAIRY', keywords: ['ricotta', 'cheese'], price: 3.99, seasonal: null, substitutes: [] },

  // Bakery (20)
  { name: 'bread', category: 'BAKERY', keywords: ['bread', 'loaf'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'bagels', category: 'BAKERY', keywords: ['bagel', 'bread'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'tortillas', category: 'BAKERY', keywords: ['tortilla', 'wrap'], price: 2.49, seasonal: null, substitutes: [] },
  { name: 'pita', category: 'BAKERY', keywords: ['pita', 'bread'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'croissants', category: 'BAKERY', keywords: ['croissant', 'pastry'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'baguette', category: 'BAKERY', keywords: ['baguette', 'bread'], price: 2.50, seasonal: null, substitutes: [] },
  { name: 'rolls', category: 'BAKERY', keywords: ['roll', 'bread'], price: 3.49, seasonal: null, substitutes: [] },
  { name: 'english muffins', category: 'BAKERY', keywords: ['muffin', 'bread'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'sourdough', category: 'BAKERY', keywords: ['sourdough', 'bread'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'ciabatta', category: 'BAKERY', keywords: ['ciabatta', 'bread'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'hamburger buns', category: 'BAKERY', keywords: ['bun', 'bread'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'hot dog buns', category: 'BAKERY', keywords: ['bun', 'bread'], price: 2.49, seasonal: null, substitutes: [] },
  { name: 'muffins', category: 'BAKERY', keywords: ['muffin', 'pastry'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'donuts', category: 'BAKERY', keywords: ['donut', 'pastry'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'pie', category: 'BAKERY', keywords: ['pie', 'dessert'], price: 6.99, seasonal: null, substitutes: [] },
  { name: 'cake', category: 'BAKERY', keywords: ['cake', 'dessert'], price: 15.99, seasonal: null, substitutes: [] },
  { name: 'brownies', category: 'BAKERY', keywords: ['brownie', 'dessert'], price: 5.99, seasonal: null, substitutes: [] },
  { name: 'cookies', category: 'BAKERY', keywords: ['cookie', 'dessert'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'garlic bread', category: 'BAKERY', keywords: ['garlic bread', 'bread'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'naan', category: 'BAKERY', keywords: ['naan', 'bread'], price: 3.49, seasonal: null, substitutes: [] },

  // Meat (20)
  { name: 'chicken breast', category: 'MEAT', keywords: ['chicken', 'poultry'], price: 7.99, seasonal: null, substitutes: [] },
  { name: 'ground beef', category: 'MEAT', keywords: ['beef', 'meat'], price: 6.99, seasonal: null, substitutes: [] },
  { name: 'salmon', category: 'MEAT', keywords: ['salmon', 'fish'], price: 12.99, seasonal: null, substitutes: [] },
  { name: 'bacon', category: 'MEAT', keywords: ['bacon', 'pork'], price: 5.99, seasonal: null, substitutes: [] },
  { name: 'pork chops', category: 'MEAT', keywords: ['pork', 'meat'], price: 8.99, seasonal: null, substitutes: [] },
  { name: 'shrimp', category: 'MEAT', keywords: ['shrimp', 'seafood'], price: 10.99, seasonal: null, substitutes: [] },
  { name: 'turkey', category: 'MEAT', keywords: ['turkey', 'poultry'], price: 9.99, seasonal: null, substitutes: [] },
  { name: 'sausage', category: 'MEAT', keywords: ['sausage', 'meat'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'steak', category: 'MEAT', keywords: ['steak', 'beef'], price: 14.99, seasonal: null, substitutes: [] },
  { name: 'tuna', category: 'MEAT', keywords: ['tuna', 'fish'], price: 6.99, seasonal: null, substitutes: [] },
  { name: 'lamb', category: 'MEAT', keywords: ['lamb', 'meat'], price: 16.99, seasonal: null, substitutes: [] },
  { name: 'deli meat', category: 'MEAT', keywords: ['deli', 'meat'], price: 5.99, seasonal: null, substitutes: [] },
  { name: 'hot dogs', category: 'MEAT', keywords: ['hot dog', 'meat'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'ground turkey', category: 'MEAT', keywords: ['turkey', 'meat'], price: 5.99, seasonal: null, substitutes: [] },
  { name: 'chicken wings', category: 'MEAT', keywords: ['chicken', 'poultry'], price: 6.99, seasonal: null, substitutes: [] },
  { name: 'chicken thighs', category: 'MEAT', keywords: ['chicken', 'poultry'], price: 5.99, seasonal: null, substitutes: [] },
  { name: 'tilapia', category: 'MEAT', keywords: ['tilapia', 'fish'], price: 7.99, seasonal: null, substitutes: [] },
  { name: 'cod', category: 'MEAT', keywords: ['cod', 'fish'], price: 9.99, seasonal: null, substitutes: [] },
  { name: 'prosciutto', category: 'MEAT', keywords: ['prosciutto', 'pork'], price: 8.99, seasonal: null, substitutes: [] },
  { name: 'salami', category: 'MEAT', keywords: ['salami', 'meat'], price: 6.99, seasonal: null, substitutes: [] },

  // Pantry (30)
  { name: 'rice', category: 'PANTRY', keywords: ['rice', 'grain'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'pasta', category: 'PANTRY', keywords: ['pasta', 'grain'], price: 1.99, seasonal: null, substitutes: [] },
  { name: 'spaghetti', category: 'PANTRY', keywords: ['spaghetti', 'pasta'], price: 1.99, seasonal: null, substitutes: [] },
  { name: 'flour', category: 'PANTRY', keywords: ['flour', 'baking'], price: 3.49, seasonal: null, substitutes: [] },
  { name: 'sugar', category: 'PANTRY', keywords: ['sugar', 'baking'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'olive oil', category: 'PANTRY', keywords: ['olive oil', 'oil'], price: 8.99, seasonal: null, substitutes: [] },
  { name: 'vegetable oil', category: 'PANTRY', keywords: ['vegetable oil', 'oil'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'canned beans', category: 'PANTRY', keywords: ['beans', 'canned'], price: 1.29, seasonal: null, substitutes: [] },
  { name: 'canned tomatoes', category: 'PANTRY', keywords: ['tomatoes', 'canned'], price: 1.49, seasonal: null, substitutes: [] },
  { name: 'peanut butter', category: 'PANTRY', keywords: ['peanut butter', 'spread'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'jelly', category: 'PANTRY', keywords: ['jelly', 'spread'], price: 3.49, seasonal: null, substitutes: [] },
  { name: 'honey', category: 'PANTRY', keywords: ['honey', 'sweetener'], price: 5.99, seasonal: null, substitutes: [] },
  { name: 'cereal', category: 'PANTRY', keywords: ['cereal', 'breakfast'], price: 4.49, seasonal: null, substitutes: [] },
  { name: 'oats', category: 'PANTRY', keywords: ['oats', 'grain'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'salt', category: 'PANTRY', keywords: ['salt', 'spice'], price: 1.99, seasonal: null, substitutes: [] },
  { name: 'pepper', category: 'PANTRY', keywords: ['pepper', 'spice'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'tomato sauce', category: 'PANTRY', keywords: ['tomato sauce', 'sauce'], price: 2.49, seasonal: null, substitutes: [] },
  { name: 'soy sauce', category: 'PANTRY', keywords: ['soy sauce', 'sauce'], price: 3.49, seasonal: null, substitutes: [] },
  { name: 'vinegar', category: 'PANTRY', keywords: ['vinegar', 'condiment'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'baking powder', category: 'PANTRY', keywords: ['baking powder', 'baking'], price: 1.99, seasonal: null, substitutes: [] },
  { name: 'baking soda', category: 'PANTRY', keywords: ['baking soda', 'baking'], price: 1.49, seasonal: null, substitutes: [] },
  { name: 'maple syrup', category: 'PANTRY', keywords: ['maple syrup', 'sweetener'], price: 7.99, seasonal: null, substitutes: [] },
  { name: 'ketchup', category: 'PANTRY', keywords: ['ketchup', 'condiment'], price: 3.49, seasonal: null, substitutes: [] },
  { name: 'mustard', category: 'PANTRY', keywords: ['mustard', 'condiment'], price: 2.49, seasonal: null, substitutes: [] },
  { name: 'mayonnaise', category: 'PANTRY', keywords: ['mayonnaise', 'condiment'], price: 4.49, seasonal: null, substitutes: [] },
  { name: 'salsa', category: 'PANTRY', keywords: ['salsa', 'sauce'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'broth', category: 'PANTRY', keywords: ['broth', 'soup'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'coconut oil', category: 'PANTRY', keywords: ['coconut oil', 'oil'], price: 6.99, seasonal: null, substitutes: [] },
  { name: 'lentils', category: 'PANTRY', keywords: ['lentils', 'grain'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'quinoa', category: 'PANTRY', keywords: ['quinoa', 'grain'], price: 5.99, seasonal: null, substitutes: [] },

  // Beverages (20)
  { name: 'coffee', category: 'BEVERAGES', keywords: ['coffee', 'drink'], price: 7.99, seasonal: null, substitutes: [] },
  { name: 'tea', category: 'BEVERAGES', keywords: ['tea', 'drink'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'orange juice', category: 'BEVERAGES', keywords: ['orange juice', 'juice'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'apple juice', category: 'BEVERAGES', keywords: ['apple juice', 'juice'], price: 3.49, seasonal: null, substitutes: [] },
  { name: 'water', category: 'BEVERAGES', keywords: ['water', 'drink'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'sparkling water', category: 'BEVERAGES', keywords: ['sparkling water', 'drink'], price: 5.99, seasonal: null, substitutes: [] },
  { name: 'soda', category: 'BEVERAGES', keywords: ['soda', 'drink'], price: 5.49, seasonal: null, substitutes: [] },
  { name: 'beer', category: 'BEVERAGES', keywords: ['beer', 'alcohol'], price: 9.99, seasonal: null, substitutes: [] },
  { name: 'wine', category: 'BEVERAGES', keywords: ['wine', 'alcohol'], price: 12.99, seasonal: null, substitutes: [] },
  { name: 'coconut water', category: 'BEVERAGES', keywords: ['coconut water', 'drink'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'lemonade', category: 'BEVERAGES', keywords: ['lemonade', 'drink'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'sports drink', category: 'BEVERAGES', keywords: ['sports drink', 'drink'], price: 1.99, seasonal: null, substitutes: [] },
  { name: 'energy drink', category: 'BEVERAGES', keywords: ['energy drink', 'drink'], price: 2.49, seasonal: null, substitutes: [] },
  { name: 'kombucha', category: 'BEVERAGES', keywords: ['kombucha', 'drink'], price: 3.49, seasonal: null, substitutes: [] },
  { name: 'cranberry juice', category: 'BEVERAGES', keywords: ['cranberry juice', 'juice'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'grape juice', category: 'BEVERAGES', keywords: ['grape juice', 'juice'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'iced tea', category: 'BEVERAGES', keywords: ['iced tea', 'drink'], price: 2.49, seasonal: null, substitutes: [] },
  { name: 'hot chocolate', category: 'BEVERAGES', keywords: ['hot chocolate', 'drink'], price: 4.99, seasonal: {months:[12,1,2]}, substitutes: [] },
  { name: 'champagne', category: 'BEVERAGES', keywords: ['champagne', 'alcohol'], price: 19.99, seasonal: null, substitutes: [] },
  { name: 'whiskey', category: 'BEVERAGES', keywords: ['whiskey', 'alcohol'], price: 29.99, seasonal: null, substitutes: [] },

  // Snacks (20)
  { name: 'chips', category: 'SNACKS', keywords: ['chips', 'snack'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'crackers', category: 'SNACKS', keywords: ['crackers', 'snack'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'nuts', category: 'SNACKS', keywords: ['nuts', 'snack'], price: 6.99, seasonal: null, substitutes: [] },
  { name: 'almonds', category: 'SNACKS', keywords: ['almonds', 'snack'], price: 7.99, seasonal: null, substitutes: [] },
  { name: 'chocolate', category: 'SNACKS', keywords: ['chocolate', 'candy'], price: 2.49, seasonal: null, substitutes: [] },
  { name: 'popcorn', category: 'SNACKS', keywords: ['popcorn', 'snack'], price: 3.49, seasonal: null, substitutes: [] },
  { name: 'pretzels', category: 'SNACKS', keywords: ['pretzels', 'snack'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'granola bars', category: 'SNACKS', keywords: ['granola bars', 'snack'], price: 4.49, seasonal: null, substitutes: [] },
  { name: 'trail mix', category: 'SNACKS', keywords: ['trail mix', 'snack'], price: 5.99, seasonal: null, substitutes: [] },
  { name: 'dried fruit', category: 'SNACKS', keywords: ['dried fruit', 'snack'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'candy', category: 'SNACKS', keywords: ['candy', 'snack'], price: 1.99, seasonal: null, substitutes: [] },
  { name: 'gummy bears', category: 'SNACKS', keywords: ['gummy bears', 'candy'], price: 2.49, seasonal: null, substitutes: [] },
  { name: 'dark chocolate', category: 'SNACKS', keywords: ['dark chocolate', 'candy'], price: 3.49, seasonal: null, substitutes: [] },
  { name: 'beef jerky', category: 'SNACKS', keywords: ['beef jerky', 'snack'], price: 6.99, seasonal: null, substitutes: [] },
  { name: 'marshmallows', category: 'SNACKS', keywords: ['marshmallows', 'candy'], price: 1.99, seasonal: null, substitutes: [] },
  { name: 'peanuts', category: 'SNACKS', keywords: ['peanuts', 'snack'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'cashews', category: 'SNACKS', keywords: ['cashews', 'snack'], price: 8.99, seasonal: null, substitutes: [] },
  { name: 'walnuts', category: 'SNACKS', keywords: ['walnuts', 'snack'], price: 7.99, seasonal: null, substitutes: [] },
  { name: 'fruit snacks', category: 'SNACKS', keywords: ['fruit snacks', 'snack'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'pudding', category: 'SNACKS', keywords: ['pudding', 'snack'], price: 2.99, seasonal: null, substitutes: [] },

  // Frozen (20)
  { name: 'ice cream', category: 'FROZEN', keywords: ['ice cream', 'dessert'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'frozen pizza', category: 'FROZEN', keywords: ['pizza', 'frozen'], price: 5.99, seasonal: null, substitutes: [] },
  { name: 'frozen vegetables', category: 'FROZEN', keywords: ['vegetables', 'frozen'], price: 2.49, seasonal: null, substitutes: [] },
  { name: 'frozen berries', category: 'FROZEN', keywords: ['berries', 'frozen'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'frozen waffles', category: 'FROZEN', keywords: ['waffles', 'frozen'], price: 3.49, seasonal: null, substitutes: [] },
  { name: 'frozen french fries', category: 'FROZEN', keywords: ['french fries', 'frozen'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'frozen chicken nuggets', category: 'FROZEN', keywords: ['chicken nuggets', 'frozen'], price: 6.99, seasonal: null, substitutes: [] },
  { name: 'frozen burritos', category: 'FROZEN', keywords: ['burritos', 'frozen'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'popsicles', category: 'FROZEN', keywords: ['popsicles', 'frozen'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'frozen meals', category: 'FROZEN', keywords: ['meals', 'frozen'], price: 4.49, seasonal: null, substitutes: [] },
  { name: 'hash browns', category: 'FROZEN', keywords: ['hash browns', 'frozen'], price: 3.49, seasonal: null, substitutes: [] },
  { name: 'frozen spinach', category: 'FROZEN', keywords: ['spinach', 'frozen'], price: 1.99, seasonal: null, substitutes: [] },
  { name: 'frozen corn', category: 'FROZEN', keywords: ['corn', 'frozen'], price: 1.99, seasonal: null, substitutes: [] },
  { name: 'frozen peas', category: 'FROZEN', keywords: ['peas', 'frozen'], price: 1.99, seasonal: null, substitutes: [] },
  { name: 'frozen shrimp', category: 'FROZEN', keywords: ['shrimp', 'frozen'], price: 9.99, seasonal: null, substitutes: [] },
  { name: 'fish sticks', category: 'FROZEN', keywords: ['fish sticks', 'frozen'], price: 5.49, seasonal: null, substitutes: [] },
  { name: 'frozen pie', category: 'FROZEN', keywords: ['pie', 'frozen'], price: 6.99, seasonal: null, substitutes: [] },
  { name: 'frozen dough', category: 'FROZEN', keywords: ['dough', 'frozen'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'edamame', category: 'FROZEN', keywords: ['edamame', 'frozen'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'sorbet', category: 'FROZEN', keywords: ['sorbet', 'frozen'], price: 4.49, seasonal: null, substitutes: [] },

  // Household (10)
  { name: 'paper towels', category: 'HOUSEHOLD', keywords: ['paper', 'cleaning'], price: 6.99, seasonal: null, substitutes: [] },
  { name: 'toilet paper', category: 'HOUSEHOLD', keywords: ['paper', 'bathroom'], price: 8.99, seasonal: null, substitutes: [] },
  { name: 'dish soap', category: 'HOUSEHOLD', keywords: ['soap', 'cleaning'], price: 3.49, seasonal: null, substitutes: [] },
  { name: 'laundry detergent', category: 'HOUSEHOLD', keywords: ['detergent', 'cleaning'], price: 12.99, seasonal: null, substitutes: [] },
  { name: 'trash bags', category: 'HOUSEHOLD', keywords: ['bags', 'cleaning'], price: 7.99, seasonal: null, substitutes: [] },
  { name: 'sponges', category: 'HOUSEHOLD', keywords: ['sponges', 'cleaning'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'aluminum foil', category: 'HOUSEHOLD', keywords: ['foil', 'kitchen'], price: 4.49, seasonal: null, substitutes: [] },
  { name: 'plastic wrap', category: 'HOUSEHOLD', keywords: ['wrap', 'kitchen'], price: 3.49, seasonal: null, substitutes: [] },
  { name: 'napkins', category: 'HOUSEHOLD', keywords: ['napkins', 'paper'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'cleaning spray', category: 'HOUSEHOLD', keywords: ['spray', 'cleaning'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'bleach', category: 'HOUSEHOLD', keywords: ['bleach', 'cleaning'], price: 3.99, seasonal: null, substitutes: [] },
  
  // Personal Care (10)
  { name: 'shampoo', category: 'PERSONAL_CARE', keywords: ['shampoo', 'hair'], price: 5.99, seasonal: null, substitutes: [] },
  { name: 'conditioner', category: 'PERSONAL_CARE', keywords: ['conditioner', 'hair'], price: 5.99, seasonal: null, substitutes: [] },
  { name: 'body wash', category: 'PERSONAL_CARE', keywords: ['body wash', 'bath'], price: 6.49, seasonal: null, substitutes: [] },
  { name: 'toothpaste', category: 'PERSONAL_CARE', keywords: ['toothpaste', 'dental'], price: 3.99, seasonal: null, substitutes: [] },
  { name: 'toothbrush', category: 'PERSONAL_CARE', keywords: ['toothbrush', 'dental'], price: 2.99, seasonal: null, substitutes: [] },
  { name: 'deodorant', category: 'PERSONAL_CARE', keywords: ['deodorant', 'body'], price: 4.99, seasonal: null, substitutes: [] },
  { name: 'soap', category: 'PERSONAL_CARE', keywords: ['soap', 'bath'], price: 2.49, seasonal: null, substitutes: [] },
  { name: 'lotion', category: 'PERSONAL_CARE', keywords: ['lotion', 'skin'], price: 7.99, seasonal: null, substitutes: [] },
  { name: 'sunscreen', category: 'PERSONAL_CARE', keywords: ['sunscreen', 'skin'], price: 8.99, seasonal: {months:[6,7,8]}, substitutes: [] },
  { name: 'floss', category: 'PERSONAL_CARE', keywords: ['floss', 'dental'], price: 1.99, seasonal: null, substitutes: [] },
  { name: 'razor', category: 'PERSONAL_CARE', keywords: ['razor', 'shaving'], price: 9.99, seasonal: null, substitutes: [] },
  { name: 'vitamins', category: 'PERSONAL_CARE', keywords: ['vitamins', 'health'], price: 12.99, seasonal: null, substitutes: [] },
  { name: 'band-aids', category: 'PERSONAL_CARE', keywords: ['band-aids', 'health'], price: 3.49, seasonal: null, substitutes: [] }
];

export const SUBSTITUTES = {
  'milk': ['almond milk', 'oat milk', 'soy milk', 'coconut milk'],
  'butter': ['margarine', 'coconut oil', 'olive oil'],
  'eggs': ['egg substitute', 'flax eggs', 'applesauce'],
  'sugar': ['stevia', 'honey', 'maple syrup', 'agave nectar'],
  'flour': ['almond flour', 'coconut flour', 'oat flour'],
  'rice': ['quinoa', 'couscous', 'cauliflower rice'],
  'pasta': ['zucchini noodles', 'rice noodles', 'whole wheat pasta'],
  'bread': ['tortillas', 'pita', 'lettuce wraps'],
  'cream cheese': ['greek yogurt', 'cottage cheese', 'hummus'],
  'sour cream': ['greek yogurt', 'cottage cheese'],
  'ground beef': ['ground turkey', 'plant-based meat', 'ground chicken'],
  'chicken breast': ['tofu', 'tempeh', 'turkey breast'],
  'bacon': ['turkey bacon', 'tempeh bacon', 'coconut bacon'],
  'cheese': ['nutritional yeast', 'vegan cheese', 'cottage cheese'],
  'yogurt': ['coconut yogurt', 'almond yogurt', 'kefir'],
  'ice cream': ['frozen yogurt', 'sorbet', 'nice cream'],
  'chocolate': ['carob', 'dark chocolate', 'cacao nibs'],
  'chips': ['veggie chips', 'rice cakes', 'popcorn'],
  'soda': ['sparkling water', 'kombucha', 'iced tea'],
  'coffee': ['chicory', 'matcha', 'herbal tea'],
  'mayo': ['avocado', 'hummus', 'greek yogurt'],
  'ketchup': ['salsa', 'tomato paste', 'bbq sauce'],
  'soy sauce': ['coconut aminos', 'tamari', 'fish sauce'],
  'peanut butter': ['almond butter', 'sunflower butter', 'cashew butter'],
  'heavy cream': ['coconut cream', 'cashew cream', 'evaporated milk'],
  'white rice': ['brown rice', 'quinoa', 'bulgur'],
  'potato': ['sweet potato', 'cauliflower', 'turnip'],
  'lettuce': ['spinach', 'kale', 'arugula'],
  'tomato sauce': ['pesto', 'alfredo sauce', 'salsa'],
  'orange juice': ['grapefruit juice', 'tangerine juice', 'mango juice']
};

export const COMPLEMENTARY = {
  'pasta': ['tomato sauce', 'parmesan', 'garlic'],
  'bread': ['butter', 'jam', 'peanut butter'],
  'eggs': ['bacon', 'bread', 'cheese'],
  'coffee': ['milk', 'sugar', 'cream'],
  'chips': ['salsa', 'guacamole', 'sour cream'],
  'rice': ['soy sauce', 'chicken breast', 'vegetables'],
  'tortillas': ['cheese', 'salsa', 'ground beef'],
  'hamburger buns': ['ground beef', 'ketchup', 'lettuce'],
  'hot dogs': ['hot dog buns', 'ketchup', 'mustard'],
  'cereal': ['milk', 'bananas', 'blueberries'],
  'pancake mix': ['maple syrup', 'butter', 'blueberries'],
  'steak': ['potatoes', 'butter', 'garlic'],
  'salmon': ['lemon', 'rice', 'broccoli'],
  'chicken breast': ['rice', 'broccoli', 'soy sauce'],
  'spaghetti': ['tomato sauce', 'ground beef', 'parmesan'],
  'bagels': ['cream cheese', 'smoked salmon', 'capers'],
  'tacos': ['salsa', 'sour cream', 'cheese'],
  'pizza dough': ['mozzarella', 'tomato sauce', 'pepperoni'],
  'wine': ['cheese', 'crackers', 'grapes'],
  'beer': ['chips', 'nuts', 'pretzels']
};

export const SEASONAL = {
  spring: { months: [3,4,5], items: ['asparagus','strawberries','peas','artichokes','radishes','spring onions'] },
  summer: { months: [6,7,8], items: ['watermelon','corn','tomatoes','peaches','berries','zucchini','cucumber','mango'] },
  fall: { months: [9,10,11], items: ['pumpkin','apples','sweet potato','cranberries','squash','pears','figs'] },
  winter: { months: [12,1,2], items: ['oranges','grapefruit','pomegranate','hot chocolate','clementines','turnips'] }
};

const levenshtein = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, 
        matrix[j - 1][i] + 1, 
        matrix[j - 1][i - 1] + indicator 
      );
    }
  }
  return matrix[b.length][a.length];
};

export function categorizeItem(name) {
  const lowerName = name.toLowerCase().trim();
  
  // exact match
  const exact = PRODUCTS.find(p => p.name.toLowerCase() === lowerName);
  if (exact) return exact.category;

  // includes multi-word match
  for (const product of PRODUCTS) {
    if (lowerName.includes(product.name.toLowerCase())) {
      return product.category;
    }
  }

  // word-by-word matching
  const words = lowerName.split(' ');
  for (const word of words) {
    for (const product of PRODUCTS) {
      if (product.name.toLowerCase().includes(word)) {
        return product.category;
      }
    }
  }

  // fuzzy matching
  for (const product of PRODUCTS) {
    if (levenshtein(product.name.toLowerCase(), lowerName) <= 2) {
      return product.category;
    }
  }

  return 'OTHER';
}

export function searchProducts(query, options = {}) {
  const lowerQuery = query ? query.toLowerCase().trim() : '';
  let results = PRODUCTS.filter(p => p.name.toLowerCase().includes(lowerQuery) || p.keywords.some(k => k.toLowerCase().includes(lowerQuery)));
  
  if (options.category) {
    results = results.filter(p => p.category === options.category);
  }
  
  if (options.maxPrice) {
    results = results.filter(p => p.price <= options.maxPrice);
  }
  
  results.sort((a, b) => {
    const aDist = levenshtein(a.name.toLowerCase(), lowerQuery);
    const bDist = levenshtein(b.name.toLowerCase(), lowerQuery);
    return aDist - bDist;
  });
  
  if (options.limit) {
    return results.slice(0, options.limit);
  }
  
  return results;
}

export const PRODUCT_IMAGES = {
  // Produce
  'apples': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=400&q=80',
  'bananas': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80',
  'oranges': 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=400&q=80',
  'strawberries': 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=400&q=80',
  'blueberries': 'https://images.unsplash.com/photo-1498557850523-fd3d118b962e?auto=format&fit=crop&w=400&q=80',
  'grapes': 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=400&q=80',
  'watermelon': 'https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=400&q=80',
  'mango': 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=400&q=80',
  'pineapple': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?auto=format&fit=crop&w=400&q=80',
  'avocado': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400&q=80',
  'tomatoes': 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
  'potatoes': 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=400&q=80',
  'onions': 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=400&q=80',
  'garlic': 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?auto=format&fit=crop&w=400&q=80',
  'carrots': 'https://images.unsplash.com/photo-1598170845058-128a2b634890?auto=format&fit=crop&w=400&q=80',
  'broccoli': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=400&q=80',
  'spinach': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=400&q=80',
  'lettuce': 'https://images.unsplash.com/photo-1556801712-76c8eb07ebd1?auto=format&fit=crop&w=400&q=80',
  'cucumber': 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=400&q=80',
  'bell pepper': 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=400&q=80',
  'mushrooms': 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  'corn': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=400&q=80',
  'celery': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80',
  'sweet potato': 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80',
  'zucchini': 'https://images.unsplash.com/photo-1590402494682-cd3fb53b1f70?auto=format&fit=crop&w=400&q=80',
  'lemon': 'https://images.unsplash.com/photo-1534531141161-e4160499e0c7?auto=format&fit=crop&w=400&q=80',
  'lime': 'https://images.unsplash.com/photo-1541857916-f2882a8848d7?auto=format&fit=crop&w=400&q=80',
  'ginger': 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=400&q=80',
  'kale': 'https://images.unsplash.com/photo-1524179091865-bf000d0d184a?auto=format&fit=crop&w=400&q=80',
  'cauliflower': 'https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=400&q=80',

  // Dairy
  'milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',
  'eggs': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80',
  'butter': 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=400&q=80',
  'cheese': 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=400&q=80',
  'yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400&q=80',
  'cream cheese': 'https://images.unsplash.com/photo-1559561853-08451507cbe7?auto=format&fit=crop&w=400&q=80',
  'sour cream': 'https://images.unsplash.com/photo-1576186726580-a816e8b12896?auto=format&fit=crop&w=400&q=80',
  'cheddar': 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=400&q=80',
  'mozzarella': 'https://images.unsplash.com/photo-1626078436894-358043657788?auto=format&fit=crop&w=400&q=80',
  'parmesan': 'https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=400&q=80',
  'cottage cheese': 'https://images.unsplash.com/photo-1528751014936-863e6e7a319c?auto=format&fit=crop&w=400&q=80',
  'heavy cream': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=400&q=80',
  'almond milk': 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?auto=format&fit=crop&w=400&q=80',
  'oat milk': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=400&q=80',

  // Bakery
  'bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
  'bagels': 'https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=400&q=80',
  'tortillas': 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80',
  'pita': 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=400&q=80',
  'croissants': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=400&q=80',
  'baguette': 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=400&q=80',
  'rolls': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
  'english muffins': 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=400&q=80',
  'sourdough': 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?auto=format&fit=crop&w=400&q=80',

  // Meat & Seafood
  'chicken breast': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80',
  'ground beef': 'https://images.unsplash.com/photo-1588168333986-5078d3ae3976?auto=format&fit=crop&w=400&q=80',
  'salmon': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=400&q=80',
  'bacon': 'https://images.unsplash.com/photo-1528607929212-2636ec44253e?auto=format&fit=crop&w=400&q=80',
  'pork chops': 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=400&q=80',
  'shrimp': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=400&q=80',
  'turkey': 'https://images.unsplash.com/photo-1574672280600-4accfa5b6f98?auto=format&fit=crop&w=400&q=80',
  'sausage': 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=400&q=80',
  'steak': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
  'tuna': 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?auto=format&fit=crop&w=400&q=80',
  'lamb': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=400&q=80',

  // Pantry & Staples
  'rice': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80',
  'pasta': 'https://images.unsplash.com/photo-1621996346565-e3d5d6281270?auto=format&fit=crop&w=400&q=80',
  'spaghetti': 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&w=400&q=80',
  'olive oil': 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=400&q=80',
  'coffee': 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=400&q=80',
  'tea': 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
  'orange juice': 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=400&q=80',
  'water': 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=400&q=80',
  'sparkling water': 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=400&q=80',
  'chips': 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=400&q=80',
  'chocolate': 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=400&q=80',
  'nuts': 'https://images.unsplash.com/photo-1536591375315-1b862799d35f?auto=format&fit=crop&w=400&q=80',
  'almonds': 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=80',
  'tofu': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
  'chia seeds': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
  'honey': 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=400&q=80',
  'peanut butter': 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=400&q=80',
  'avocado': 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=400&q=80',
  'ice cream': 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=400&q=80',
  'frozen pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
  'toothpaste': 'https://images.unsplash.com/photo-1559598467-f8b76c8155d0?auto=format&fit=crop&w=400&q=80',
  'shampoo': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=400&q=80'
};

export const CATEGORY_FALLBACK_IMAGES = {
  PRODUCE: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=400&q=80',
  DAIRY: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80',
  BAKERY: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
  MEAT: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80',
  PANTRY: 'https://images.unsplash.com/photo-1584473457406-6df3a637210c?auto=format&fit=crop&w=400&q=80',
  BEVERAGES: 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=400&q=80',
  SNACKS: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=400&q=80',
  FROZEN: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=400&q=80',
  HOUSEHOLD: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=400&q=80',
  PERSONAL_CARE: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
  OTHER: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80'
};

export function getProductImage(productName, categoryKey = 'OTHER') {
  const clean = productName ? productName.toLowerCase().trim() : '';
  
  if (PRODUCT_IMAGES[clean]) {
    return PRODUCT_IMAGES[clean];
  }

  for (const [key, url] of Object.entries(PRODUCT_IMAGES)) {
    if (clean.includes(key) || key.includes(clean)) {
      return url;
    }
  }

  return CATEGORY_FALLBACK_IMAGES[categoryKey] || CATEGORY_FALLBACK_IMAGES.OTHER;
}

