// diet generator service using chefgpt api

interface DietPlan {
  meals: Meal[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface Meal {
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string;
  imageUrl?: string;
}

// api keys
const CHEFGPT_API_KEY = '4e3494f1-066d-4337-a08e-ce3be7315042';
const CHEFGPT_API_ENDPOINT = 'https://api.chefgpt.nutrition/v1/generate';

export async function generateDietPlan(
  preferences: {
    dietType: string;
    calorieTarget: number;
    allergies: string[];
    goals: string[];
    excludeIngredients: string[];
  }
): Promise<DietPlan> {
  try {
    // in a production environment, this would be a real api call to chefgpt
    console.log('Generating diet plan with ChefGPT API key:', CHEFGPT_API_KEY);
    console.log('Using real food images for diet plans');
    
    // simulate api delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // generate a realistic diet plan based on preferences
    const dietPlan = generateMockDietPlan(preferences);
    
    // in a real implementation, we would call the ai image generation service for each meal
    // for now, we're using the dynamic urls generated in the generatemeal function
    
    return dietPlan;
  } catch (error) {
    console.error('Error generating diet plan:', error);
    throw new Error('Failed to generate diet plan. Please try again later.');
  }
}

// mock function to generate a realistic diet plan
function generateMockDietPlan(preferences: any): DietPlan {
  const { dietType, calorieTarget, goals } = preferences;
  
  // adjust macros based on diet type and goals
  let proteinPercentage = 0.3;
  let carbsPercentage = 0.4;
  let fatPercentage = 0.3;
  
  if (dietType === 'keto') {
    proteinPercentage = 0.25;
    carbsPercentage = 0.05;
    fatPercentage = 0.7;
  } else if (dietType === 'low-carb') {
    proteinPercentage = 0.35;
    carbsPercentage = 0.2;
    fatPercentage = 0.45;
  } else if (dietType === 'high-protein') {
    proteinPercentage = 0.4;
    carbsPercentage = 0.3;
    fatPercentage = 0.3;
  }
  
  if (goals.includes('muscle gain')) {
    proteinPercentage += 0.05;
    carbsPercentage += 0.05;
    fatPercentage -= 0.1;
  } else if (goals.includes('weight loss')) {
    proteinPercentage += 0.05;
    carbsPercentage -= 0.1;
    fatPercentage += 0.05;
  }
  
  // calculate macros in grams
  const totalCalories = calorieTarget;
  const proteinCalories = totalCalories * proteinPercentage;
  const carbsCalories = totalCalories * carbsPercentage;
  const fatCalories = totalCalories * fatPercentage;
  
  const proteinGrams = Math.round(proteinCalories / 4);
  const carbsGrams = Math.round(carbsCalories / 4);
  const fatGrams = Math.round(fatCalories / 9);
  
  // generate meals
  const breakfast = generateMeal('breakfast', dietType, totalCalories * 0.25, preferences);
  const lunch = generateMeal('lunch', dietType, totalCalories * 0.35, preferences);
  const dinner = generateMeal('dinner', dietType, totalCalories * 0.3, preferences);
  const snack = generateMeal('snack', dietType, totalCalories * 0.1, preferences);
  
  return {
    meals: [breakfast, lunch, dinner, snack],
    calories: totalCalories,
    protein: proteinGrams,
    carbs: carbsGrams,
    fat: fatGrams
  };
}



// get a real food image based on meal name
function getFoodImage(mealName: string): string {
  // map meal names to specific high-quality food images
  const mealImageMap: Record<string, string> = {
    // Breakfast
    'Greek Yogurt Parfait': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'Avocado Toast with Poached Eggs': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'Protein Smoothie Bowl': 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    
    // Lunch
    'Quinoa Salad with Grilled Chicken': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'Turkey and Avocado Wrap': 'https://images.unsplash.com/photo-1509722747041-616f39b57569?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'Salmon Buddha Bowl': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    
    // Dinner
    'Baked Cod with Roasted Vegetables': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'Turkey Meatballs with Zucchini Noodles': 'https://images.unsplash.com/photo-1529042410759-befb1204b468?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'Tofu Stir-Fry with Brown Rice': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    
    // Snacks
    'Apple with Almond Butter': 'https://images.unsplash.com/photo-1479894720049-e239d8e4d61c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'Greek Yogurt with Berries': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
    'Protein Energy Balls': 'https://images.unsplash.com/photo-1490567674331-7fc3e9f3e021?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80'
  };
  
  // return the specific image for this meal if available
  if (mealImageMap[mealName]) {
    return mealImageMap[mealName];
  }
  
  // if no specific image is mapped, create a deterministic but varied image url
  const hash = mealName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageId = hash % 30 + 1; // Get a number between 1-30
  
  // use unsplash with specific search terms based on meal type
  let searchTerm = '';
  
  if (mealName.toLowerCase().includes('smoothie') || mealName.toLowerCase().includes('bowl')) {
    searchTerm = 'smoothie,bowl,breakfast';
  } 
  else if (mealName.toLowerCase().includes('salad')) {
    searchTerm = 'salad,fresh,healthy';
  }
  else if (mealName.toLowerCase().includes('toast') || mealName.toLowerCase().includes('sandwich') || mealName.toLowerCase().includes('wrap')) {
    searchTerm = 'sandwich,breakfast,food';
  }
  else if (mealName.toLowerCase().includes('chicken') || mealName.toLowerCase().includes('turkey')) {
    searchTerm = 'chicken,protein,dinner';
  }
  else if (mealName.toLowerCase().includes('fish') || mealName.toLowerCase().includes('salmon') || mealName.toLowerCase().includes('cod')) {
    searchTerm = 'fish,seafood,dinner';
  }
  else if (mealName.toLowerCase().includes('yogurt') || mealName.toLowerCase().includes('parfait')) {
    searchTerm = 'yogurt,breakfast,healthy';
  }
  else {
    searchTerm = 'food,meal,healthy';
  }
  
  return `https://source.unsplash.com/featured/512x512/?${encodeURIComponent(searchTerm)}&sig=${imageId}`;
}

// generate a realistic meal based on type and preferences
function generateMeal(
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  dietType: string,
  calories: number,
  preferences: any
): Meal {
  const { allergies, excludeIngredients } = preferences;
  
  // Calculate macros
  const protein = Math.round((calories * 0.3) / 4);
  const carbs = Math.round((calories * 0.4) / 4);
  const fat = Math.round((calories * 0.3) / 9);
  
  // define meal options based on type and diet
  const mealOptions: Record<string, any[]> = {
    breakfast: [
      {
        name: 'Greek Yogurt Parfait',
        ingredients: ['Greek yogurt', 'mixed berries', 'honey', 'granola', 'chia seeds'],
        instructions: 'Layer Greek yogurt with berries, drizzle with honey, and top with granola and chia seeds.',
        imageUrl: ''
      },
      {
        name: 'Avocado Toast with Poached Eggs',
        ingredients: ['whole grain bread', 'avocado', 'eggs', 'cherry tomatoes', 'microgreens', 'salt', 'pepper'],
        instructions: 'Toast bread, spread mashed avocado, top with poached eggs, sliced tomatoes, and microgreens. Season with salt and pepper.',
        imageUrl: ''
      },
      {
        name: 'Protein Smoothie Bowl',
        ingredients: ['protein powder', 'frozen banana', 'almond milk', 'mixed berries', 'almond butter', 'granola'],
        instructions: 'Blend protein powder, frozen banana, almond milk, and almond butter. Pour into a bowl and top with berries and granola.',
        imageUrl: ''
      }
    ],
    lunch: [
      {
        name: 'Quinoa Salad with Grilled Chicken',
        ingredients: ['quinoa', 'grilled chicken breast', 'cucumber', 'cherry tomatoes', 'feta cheese', 'red onion', 'olive oil', 'lemon juice'],
        instructions: 'Combine cooked quinoa with diced cucumber, halved cherry tomatoes, crumbled feta, and sliced red onion. Top with grilled chicken and dress with olive oil and lemon juice.',
        imageUrl: ''
      },
      {
        name: 'Turkey and Avocado Wrap',
        ingredients: ['whole grain wrap', 'turkey slices', 'avocado', 'lettuce', 'tomato', 'hummus'],
        instructions: 'Spread hummus on wrap, layer with turkey, sliced avocado, lettuce, and tomato. Roll up and slice in half.',
        imageUrl: ''
      },
      {
        name: 'Salmon Buddha Bowl',
        ingredients: ['brown rice', 'grilled salmon', 'roasted sweet potatoes', 'broccoli', 'avocado', 'sesame seeds', 'soy sauce'],
        instructions: 'Arrange brown rice, grilled salmon, roasted sweet potatoes, steamed broccoli, and sliced avocado in a bowl. Sprinkle with sesame seeds and drizzle with soy sauce.',
        imageUrl: ''
      }
    ],
    dinner: [
      {
        name: 'Baked Cod with Roasted Vegetables',
        ingredients: ['cod fillet', 'zucchini', 'bell peppers', 'cherry tomatoes', 'olive oil', 'garlic', 'lemon', 'herbs'],
        instructions: 'Place cod on a baking sheet with chopped vegetables. Drizzle with olive oil, minced garlic, and herbs. Bake at 400°F for 15-20 minutes. Serve with lemon wedges.',
        imageUrl: ''
      },
      {
        name: 'Turkey Meatballs with Zucchini Noodles',
        ingredients: ['ground turkey', 'zucchini', 'egg', 'almond flour', 'marinara sauce', 'parmesan cheese', 'basil'],
        instructions: 'Mix ground turkey with egg and almond flour, form into meatballs, and bake at 375°F for 20 minutes. Spiralize zucchini into noodles, sauté briefly, and top with meatballs, marinara sauce, parmesan, and basil.',
        imageUrl: ''
      },
      {
        name: 'Tofu Stir-Fry with Brown Rice',
        ingredients: ['firm tofu', 'broccoli', 'bell peppers', 'carrots', 'snap peas', 'brown rice', 'soy sauce', 'ginger', 'garlic'],
        instructions: 'Press and cube tofu. Stir-fry with chopped vegetables, minced ginger, and garlic. Add soy sauce and serve over brown rice.',
        imageUrl: ''
      }
    ],
    snack: [
      {
        name: 'Apple with Almond Butter',
        ingredients: ['apple', 'almond butter'],
        instructions: 'Slice apple and serve with a tablespoon of almond butter for dipping.',
        imageUrl: ''
      },
      {
        name: 'Greek Yogurt with Berries',
        ingredients: ['Greek yogurt', 'mixed berries', 'honey'],
        instructions: 'Top Greek yogurt with mixed berries and a drizzle of honey.',
        imageUrl: ''
      },
      {
        name: 'Protein Energy Balls',
        ingredients: ['oats', 'protein powder', 'peanut butter', 'honey', 'dark chocolate chips', 'chia seeds'],
        instructions: 'Mix all ingredients, roll into balls, and refrigerate for at least 30 minutes before serving.',
        imageUrl: ''
      }
    ]
  };
  
  // Filter out options with allergens or excluded ingredients
  const filteredOptions = mealOptions[type].filter(meal => {
    const hasAllergen = allergies.some(allergen => 
      meal.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(allergen.toLowerCase())
      )
    );
    
    const hasExcluded = excludeIngredients.some(excluded => 
      meal.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(excluded.toLowerCase())
      )
    );
    
    return !hasAllergen && !hasExcluded;
  });
  
  // Select a random meal from filtered options
  const selectedMeal = filteredOptions.length > 0 
    ? filteredOptions[Math.floor(Math.random() * filteredOptions.length)]
    : mealOptions[type][Math.floor(Math.random() * mealOptions[type].length)];
  
  // Get a real food image for this meal
  const imageUrl = getFoodImage(selectedMeal.name);
  
  return {
    name: selectedMeal.name,
    type,
    calories: Math.round(calories),
    protein,
    carbs,
    fat,
    ingredients: selectedMeal.ingredients,
    instructions: selectedMeal.instructions,
    imageUrl: imageUrl // use dynamically generated image url
  };
}

// function to get diet types
export function getDietTypes() {
  return [
    { id: 'balanced', name: 'Balanced' },
    { id: 'high-protein', name: 'High Protein' },
    { id: 'low-carb', name: 'Low Carb' },
    { id: 'keto', name: 'Ketogenic' },
    { id: 'vegetarian', name: 'Vegetarian' },
    { id: 'vegan', name: 'Vegan' },
    { id: 'paleo', name: 'Paleo' },
    { id: 'mediterranean', name: 'Mediterranean' }
  ];
}

// function to get common health goals
export function getHealthGoals() {
  return [
    { id: 'weight-loss', name: 'Weight Loss' },
    { id: 'muscle-gain', name: 'Muscle Gain' },
    { id: 'maintenance', name: 'Maintenance' },
    { id: 'energy', name: 'Energy Boost' },
    { id: 'heart-health', name: 'Heart Health' },
    { id: 'diabetes', name: 'Diabetes Management' },
    { id: 'immune-support', name: 'Immune Support' }
  ];
}

// function to get common allergies
export function getAllergies() {
  return [
    { id: 'dairy', name: 'Dairy' },
    { id: 'gluten', name: 'Gluten' },
    { id: 'nuts', name: 'Nuts' },
    { id: 'shellfish', name: 'Shellfish' },
    { id: 'soy', name: 'Soy' },
    { id: 'eggs', name: 'Eggs' }
  ];
}
