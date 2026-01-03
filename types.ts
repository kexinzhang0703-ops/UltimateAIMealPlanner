
export type IngredientCategory = 'Produce' | 'Meat' | 'Dairy' | 'Pantry' | 'Frozen' | 'Bakery' | 'Other';
export type StorageLocation = 'Fridge' | 'Pantry' | 'Freezer' | 'Counter';

export interface IngredientEntity {
  id: string;
  name: string;
  nameNormalized: string;
  inStock: boolean;
  category: IngredientCategory;
  dateBought?: string;
  expiryDate?: string;
  unit: string;
  quantity: number; // Available quantity
  neededQuantity?: number; // Quantity to buy
  servesPerUnit?: number; // How many "serves" or "portions" in one unit
  brand?: string;
  store?: string;
  location?: StorageLocation;
  notes?: string;
  updatedAt: number;
}

export interface Ingredient {
  ingredientId?: string; // Reference to the global IngredientEntity
  name: string;
  nameNormalized: string;
  amount: number; // Required quantity for the recipe
  unit: string;
  category: string;
  inStock?: boolean;
  availableQuantity?: number;
  servesPerUnit?: number; // Conversion factor for depletion
  store?: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  id: string;
  name: string;
  nameNormalized: string;
  description: string;
  instructions: string[];
  ingredients: Ingredient[];
  nutrition: Nutrition;
  cookingTime: number; 
  difficulty: 'Easy' | 'Medium' | 'Hard';
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
}

export interface RecipeCoverage {
  matchedCount: number;
  totalRequired: number;
  coverageRatio: number;
  missingIngredients: string[];
  isCookable: boolean;
  matchedEntities: Record<string, IngredientEntity>;
}

export interface DayPlan {
  day: string;
  date: string;
  meals: {
    breakfast?: Recipe;
    lunch?: Recipe;
    dinner?: Recipe;
    snack?: Recipe;
  };
}

export interface WeeklyPlan {
  days: DayPlan[];
}

export interface UserPreferences {
  dietary: string;
  allergies: string[];
  servings: number;
  budget: string;
  goal: string;
}

export type AppView = 'dashboard' | 'planner' | 'recipes' | 'ingredients' | 'grocery' | 'more';
