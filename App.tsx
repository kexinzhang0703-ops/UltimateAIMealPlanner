import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, 
  Calendar, 
  BookOpen, 
  Carrot, 
  ShoppingCart, 
  Plus,
  Search,
  Clock,
  PlusCircle,
  Sparkles,
  UtensilsCrossed,
  ArrowRight,
  Layers,
  Box,
  Zap,
  ChevronRight,
  LayoutGrid
} from 'lucide-react';
import { WeeklyPlan, Recipe, DayPlan, IngredientEntity, AppView, Ingredient } from './types';
import { RecipeDetail } from './components/RecipeDetail';
import { IngredientDetail } from './components/IngredientDetail';
import { RecipeForm } from './components/RecipeForm';
import { SlotPicker } from './components/SlotPicker';
import { IngredientForm } from './components/IngredientForm';
import { GroceryList } from './components/GroceryList';

const normalizeIngredientName = (name: string): string => {
  if (!name) return '';
  return name
    .toLowerCase()
    .trim()
    .replace(/[.,()]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/tomatoes$/, 'tomato')
    .replace(/potatoes$/, 'potato')
    .replace(/ies$/, 'y')
    .replace(/s$/, (match, offset, str) => (str.endsWith('ss') || str.endsWith('us') ? 's' : ''));
};

const INITIAL_INVENTORY: IngredientEntity[] = [
  { id: 'inv_1', name: 'Avocado', nameNormalized: normalizeIngredientName('Avocado'), inStock: true, category: 'Produce', quantity: 2, unit: 'pcs', location: 'Counter', brand: 'Hass', store: 'Whole Foods', updatedAt: Date.now() },
  { id: 'inv_2', name: 'Sourdough Bread', nameNormalized: normalizeIngredientName('Sourdough'), inStock: false, category: 'Bakery', quantity: 0, unit: 'loaf', location: 'Pantry', store: 'Local Bakery', updatedAt: Date.now() },
];

const INITIAL_RECIPES: Recipe[] = [
  { id: '1', name: 'Avocado Toast', nameNormalized: normalizeIngredientName('Avocado Toast'), description: 'Creamy avocado on sourdough.', cookingTime: 10, type: 'Breakfast', difficulty: 'Easy', instructions: ['Toast bread', 'Mash avocado'], ingredients: [{ name: 'Avocado', nameNormalized: normalizeIngredientName('Avocado'), amount: 1, unit: 'whole', category: 'Produce', inStock: true, availableQuantity: 2, servesPerUnit: 1 }, { name: 'Sourdough', nameNormalized: normalizeIngredientName('Sourdough'), amount: 2, unit: 'slices', category: 'Bakery', inStock: false }], nutrition: { calories: 350, protein: 8, carbs: 40, fat: 18 } },
];

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('dashboard');
  const [plan, setPlan] = useState<WeeklyPlan>({ days: [] });
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [inventory, setInventory] = useState<IngredientEntity[]>(INITIAL_INVENTORY);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientEntity | null>(null);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [showIngredientForm, setShowIngredientForm] = useState(false);
  const [showSlotPicker, setShowSlotPicker] = useState(false);

  const missingItemsCount = inventory.filter(item => !item.inStock).length;

  const handleToggleStock = (id: string) => {
    setInventory(prev => prev.map(item => 
      item.id === id ? { ...item, inStock: !item.inStock, updatedAt: Date.now() } : item
    ));
  };

  const handleQuickAddItem = (name: string) => {
    const newId = 'inv_' + Math.random().toString(36).substr(2, 9);
    const newItem: IngredientEntity = {
      id: newId,
      name,
      nameNormalized: normalizeIngredientName(name),
      inStock: false,
      category: 'Pantry',
      quantity: 0,
      unit: 'pcs',
      updatedAt: Date.now()
    };
    setInventory(prev => [...prev, newItem]);
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => r.nameNormalized.includes(searchQuery.toLowerCase()));
  }, [recipes, searchQuery]);

  const renderDashboard = () => (
    <div className="space-y-8 pt-8 animate-in fade-in duration-500 pb-20">
      <header className="space-y-1 mb-2 px-2">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Kitchen OS</h1>
        <p className="text-slate-500 font-medium">What to eat today?</p>
      </header>

      {/* 4-Card Grid System */}
      <section className="grid grid-cols-2 gap-4">
        {/* Card 1: Weekly Plan (Top Left) */}
        <button 
          onClick={() => setView('planner')}
          className="bg-[#121212] p-6 rounded-[2.5rem] flex flex-col items-start gap-4 aspect-square shadow-xl active:scale-95 transition-all text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#0a231b] flex items-center justify-center text-emerald-500">
            <Calendar size={24} />
          </div>
          <div className="mt-auto">
            <h3 className="text-lg font-black text-white leading-tight">Weekly Plan</h3>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">VIEW SCHEDULE</p>
          </div>
        </button>

        {/* Card 2: New Recipe (Top Right) */}
        <button 
          onClick={() => setShowRecipeForm(true)}
          className="bg-[#121212] p-6 rounded-[2.5rem] flex flex-col items-start gap-4 aspect-square shadow-xl active:scale-95 transition-all text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#0d162b] flex items-center justify-center text-blue-500">
            <UtensilsCrossed size={24} />
          </div>
          <div className="mt-auto">
            <h3 className="text-lg font-black text-white leading-tight">New Recipe</h3>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">MANUAL ADD</p>
          </div>
        </button>

        {/* Card 3: Inventory (Bottom Left) */}
        <button 
          onClick={() => setView('ingredients')}
          className="bg-[#121212] p-6 rounded-[2.5rem] flex flex-col items-start gap-4 aspect-square shadow-xl active:scale-95 transition-all text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-[#1d0e2e] flex items-center justify-center text-purple-500">
            <Box size={24} />
          </div>
          <div className="mt-auto">
            <h3 className="text-lg font-black text-white leading-tight">Inventory</h3>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mt-1">ADD INGREDIENTS</p>
          </div>
        </button>

        {/* Card 4: AI Planner (Bottom Right - High Contrast) */}
        <button 
          onClick={() => setView('planner')}
          className="bg-white p-6 rounded-[2.5rem] flex flex-col items-start gap-4 aspect-square shadow-xl active:scale-95 transition-all text-left group"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white">
            <Sparkles size={24} />
          </div>
          <div className="mt-auto">
            <h3 className="text-lg font-black text-black leading-tight">AI Planner</h3>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 mt-1">FULL 7-DAY PLAN</p>
          </div>
        </button>
      </section>

      {/* Large Bottom Banner: Grocery List */}
      <section>
        <button 
          onClick={() => setView('grocery')}
          className="w-full bg-[#059669] p-7 rounded-[3rem] flex items-center justify-between shadow-2xl shadow-emerald-500/20 active:scale-[0.98] transition-all text-left group"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <LayoutGrid size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white leading-tight tracking-tight">Grocery List</h3>
              <p className="text-[11px] font-bold text-white/90 mt-1">{missingItemsCount} missing items need restock</p>
            </div>
          </div>
          <ArrowRight size={28} className="text-white group-hover:translate-x-2 transition-transform" />
        </button>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black pb-32">
      <div className="max-w-2xl mx-auto px-6">
        {view === 'dashboard' && renderDashboard()}
        
        {view === 'planner' && (
          <div className="pt-8 space-y-6 animate-in fade-in duration-300">
             <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Meal Plan</h1>
             <div className="py-20 text-center bg-white dark:bg-[#121212] rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-sm">
               <Sparkles size={48} className="mx-auto text-emerald-500 mb-6" />
               <p className="text-slate-500 font-medium">Generate your optimized plan with AI</p>
               <button className="mt-8 bg-emerald-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all">Start 7-Day Plan</button>
             </div>
          </div>
        )}

        {view === 'recipes' && (
          <div className="pt-8 space-y-8 animate-in fade-in duration-300">
             <div className="flex justify-between items-center px-1">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Recipes</h1>
                <button onClick={() => setShowRecipeForm(true)} className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg active:scale-95 transition-all"><Plus size={24} /></button>
             </div>
             <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search your library..."
                  className="w-full bg-white dark:bg-[#121212] border border-slate-100 dark:border-white/5 rounded-[1.5rem] py-4 pl-12 pr-4 font-medium focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                />
             </div>
             <div className="grid grid-cols-1 gap-4 pb-20">
                {filteredRecipes.map(recipe => (
                  <div key={recipe.id} onClick={() => setSelectedRecipe(recipe)} className="bg-white dark:bg-[#121212] p-6 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-sm active:scale-[0.98] transition-all cursor-pointer">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{recipe.name}</h3>
                    <div className="flex gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <span className="flex items-center gap-1"><Clock size={12} /> {recipe.cookingTime}m</span>
                       <span className="flex items-center gap-1"><Layers size={12} /> {recipe.type}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {view === 'grocery' && (
          <GroceryList 
            inventory={inventory} 
            onToggleStock={handleToggleStock} 
            onAddItem={handleQuickAddItem}
          />
        )}

        {view === 'ingredients' && (
          <div className="pt-8 space-y-8 animate-in fade-in duration-300">
             <div className="flex justify-between items-center px-1">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Pantry</h1>
                <button onClick={() => setShowIngredientForm(true)} className="bg-emerald-600 text-white p-3 rounded-2xl shadow-lg active:scale-95 transition-all"><Plus size={24} /></button>
             </div>
             <div className="grid grid-cols-1 gap-3 pb-20">
               {inventory.map(item => (
                 <div key={item.id} onClick={() => setSelectedIngredient(item)} className="bg-white dark:bg-[#121212] p-5 rounded-3xl border border-slate-100 dark:border-white/5 flex items-center justify-between shadow-sm cursor-pointer active:scale-[0.99] transition-all">
                   <div className="flex items-center gap-4">
                     <div className={`w-3 h-3 rounded-full ${item.inStock ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-red-500 shadow-sm shadow-red-500/50'}`} />
                     <div>
                       <p className="font-bold text-slate-900 dark:text-white">{item.name}</p>
                       <p className="text-[10px] font-black uppercase text-slate-400">{item.category} • {item.quantity} {item.unit}</p>
                     </div>
                   </div>
                   <ChevronRight size={16} className="text-slate-300" />
                 </div>
               ))}
             </div>
          </div>
        )}
      </div>

      {/* Synchronized Navigation Labels */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-black/80 backdrop-blur-2xl border border-slate-200/50 dark:border-white/10 px-3 py-2 rounded-[2.5rem] shadow-2xl flex items-center gap-1 z-50 transition-all ios-tab-shadow">
        {[
          { icon: Home, view: 'dashboard', label: 'HOME' },
          { icon: Zap, view: 'planner', label: 'PLAN' },
          { icon: BookOpen, view: 'recipes', label: 'RECIPES' },
          { icon: Carrot, view: 'ingredients', label: 'PANTRY' },
          { icon: ShoppingCart, view: 'grocery', label: 'LIST' },
        ].map((item, idx) => (
          <button 
            key={idx} 
            onClick={() => setView(item.view as any)}
            className={`flex flex-col items-center gap-1 px-5 py-3 rounded-[1.5rem] transition-all active:scale-90 ${view === item.view ? 'bg-slate-900 dark:bg-white text-white dark:text-black shadow-lg' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <item.icon size={20} />
            <span className="text-[8px] font-black uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>

      {selectedRecipe && (
        <RecipeDetail 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)}
          onEdit={() => { setShowRecipeForm(true); setSelectedRecipe(null); }}
          onDelete={() => setRecipes(prev => prev.filter(r => r.id !== selectedRecipe.id))}
          onAddToPlan={() => setShowSlotPicker(true)}
          onIngredientClick={(ing) => { setSelectedIngredient(ing); }}
        />
      )}

      {showRecipeForm && (
        <RecipeForm 
          initialRecipe={selectedRecipe}
          ingredientLibrary={inventory}
          onClose={() => setShowRecipeForm(false)}
          onSave={(recipe) => {
            setRecipes(prev => {
              const idx = prev.findIndex(r => r.id === recipe.id);
              if (idx > -1) {
                const next = [...prev];
                next[idx] = recipe;
                return next;
              }
              return [...prev, recipe];
            });
            setShowRecipeForm(false);
          }}
        />
      )}

      {selectedIngredient && (
        <IngredientDetail 
          ingredient={selectedIngredient}
          onClose={() => setSelectedIngredient(null)}
          onUpdate={(updated) => {
            setInventory(prev => prev.map(item => item.id === updated.id ? updated : item));
            setSelectedIngredient(updated);
          }}
          onEdit={() => setShowIngredientForm(true)}
        />
      )}

      {showIngredientForm && (
        <IngredientForm 
          initialIngredient={selectedIngredient}
          onClose={() => setShowIngredientForm(false)}
          onSave={(ing) => {
            setInventory(prev => {
              const idx = prev.findIndex(i => i.id === ing.id);
              if (idx > -1) {
                const next = [...prev];
                next[idx] = ing;
                return next;
              }
              return [...prev, ing];
            });
            setShowIngredientForm(false);
            setSelectedIngredient(null);
          }}
        />
      )}

      {showSlotPicker && (
        <SlotPicker 
          onClose={() => setShowSlotPicker(false)}
          onConfirm={(day, slot) => {
            alert(`Added to ${day} ${slot}!`);
            setShowSlotPicker(false);
          }}
        />
      )}
    </div>
  );
};

export default App;
