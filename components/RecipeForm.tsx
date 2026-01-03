
import React, { useState, useRef, useEffect } from 'react';
import { Recipe, Ingredient, IngredientCategory, IngredientEntity } from '../types';
import { X, Plus, Trash2, Save, Search, Sparkles, Tag, CheckCircle2, AlertCircle, ShoppingBag, MapPin, Store, ChevronDown, Layers, Link2, Wand2 } from 'lucide-react';

interface Props {
  initialRecipe?: Recipe | null;
  ingredientLibrary: IngredientEntity[];
  onClose: () => void;
  onSave: (recipe: Recipe) => void;
}

const UNIT_OPTIONS = [
  'piece',
  'cup',
  'serve',
  'slice',
  'bottle',
  'pack',
  'g',
  'kg',
  'ml',
  'l',
  'lb',
  'oz',
  'clove',
  'pinch'
];

export const RecipeForm: React.FC<Props> = ({ initialRecipe, ingredientLibrary, onClose, onSave }) => {
  const [name, setName] = useState(initialRecipe?.name || '');
  const [type, setType] = useState<Recipe['type']>(initialRecipe?.type || 'Dinner');
  const [cookingTime, setCookingTime] = useState(initialRecipe?.cookingTime || 30);
  const [difficulty, setDifficulty] = useState<Recipe['difficulty']>(initialRecipe?.difficulty || 'Medium');
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialRecipe?.ingredients || []);
  const [instructions, setInstructions] = useState<string[]>(initialRecipe?.instructions || []);

  const [activeSearchIdx, setActiveSearchIdx] = useState<number | null>(null);
  const [showImportInput, setShowImportInput] = useState(false);
  const [importUrl, setImportUrl] = useState('');

  const handleAddIngredient = () => {
    setIngredients([{ 
      name: '', 
      amount: 1, 
      unit: 'piece', 
      category: 'Pantry', 
      nameNormalized: '',
      inStock: false,
      availableQuantity: 0,
      servesPerUnit: 1,
      store: ''
    }, ...ingredients]);
  };

  const handleUpdateIngredient = (index: number, field: keyof Ingredient, value: any) => {
    const next = [...ingredients];
    next[index] = { ...next[index], [field]: value };
    
    if (field === 'name') {
      next[index].nameNormalized = (value as string).toLowerCase().trim();
    }
    
    setIngredients(next);
  };

  const handleSelectSuggestion = (index: number, suggestion: IngredientEntity) => {
    const next = [...ingredients];
    const matchedUnit = UNIT_OPTIONS.includes(suggestion.unit) ? suggestion.unit : 'piece';
    
    next[index] = {
      ...next[index],
      name: suggestion.name,
      nameNormalized: suggestion.nameNormalized,
      unit: matchedUnit,
      category: suggestion.category,
      ingredientId: suggestion.id,
      inStock: suggestion.inStock,
      availableQuantity: suggestion.quantity,
      servesPerUnit: suggestion.servesPerUnit || 1,
      store: suggestion.store || ''
    };
    setIngredients(next);
    setActiveSearchIdx(null);
  };

  const handleAddStep = () => setInstructions([...instructions, '']);
  const handleDeleteStep = (index: number) => setInstructions(instructions.filter((_, i) => i !== index));

  const handleExtract = async () => {
    if (!importUrl) return;
    alert('Processing URL... Gemini would normally parse steps and ingredients from this link.');
    setShowImportInput(false);
    setImportUrl('');
  };

  const handleSave = () => {
    if (!name) return alert('Recipe name is required');
    if (ingredients.length === 0) return alert('Please add at least one ingredient');
    
    onSave({
      id: initialRecipe?.id || Math.random().toString(36).substr(2, 9),
      name,
      nameNormalized: name.toLowerCase().trim(),
      description: '',
      type,
      cookingTime,
      difficulty,
      ingredients: ingredients.map(ing => ({
        ...ing,
        nameNormalized: ing.name.toLowerCase().trim()
      })),
      instructions,
      nutrition: initialRecipe?.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0 }
    });
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 dark:bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#121212] w-full max-w-2xl h-[95vh] sm:h-auto sm:max-h-[95vh] rounded-t-[3rem] sm:rounded-[3rem] flex flex-col overflow-hidden border-t border-slate-200 dark:border-white/10 shadow-2xl transition-colors">
        
        <div className="p-8 flex justify-between items-center border-b border-slate-100 dark:border-white/5 shrink-0">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tight">Kitchen OS</h2>
          </div>
          <button onClick={onClose} className="p-3 bg-slate-100 dark:bg-white/5 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-16 no-scrollbar pb-32">
          {/* Header Info */}
          <section className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.05em] text-slate-400">Recipe Title</label>
              <input 
                value={name} onChange={e => setName(e.target.value)}
                placeholder="e.g. Truffle Mushroom Risotto"
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-5 text-lg font-black text-slate-900 dark:text-white focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.05em] text-slate-400">Meal Type</label>
                <div className="relative">
                  <select 
                    value={type} onChange={e => setType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white appearance-none cursor-pointer outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  >
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.05em] text-slate-400">Time (min)</label>
                <input 
                  type="number" 
                  value={cookingTime === 0 ? '' : cookingTime} 
                  onChange={e => setCookingTime(e.target.value === '' ? 0 : parseInt(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-4 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                />
              </div>
            </div>
          </section>

          {/* Smart Ingredients List */}
          <section className="space-y-8">
            <div className="flex justify-between items-end">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Ingredients</h3>
              <button 
                onClick={handleAddIngredient} 
                className="bg-emerald-500/10 text-emerald-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-500 hover:text-white transition-all active:scale-95 shadow-sm"
              >
                <Plus size={14} /> Add
              </button>
            </div>
            
            <div className="space-y-12">
              {ingredients.map((ing, idx) => {
                const searchResults = activeSearchIdx === idx && ing.name.length > 0
                  ? ingredientLibrary.filter(item => 
                      item.nameNormalized.includes(ing.name.toLowerCase().trim())
                    ).slice(0, 5)
                  : [];

                const totalServesAvailable = (ing.availableQuantity || 0) * (ing.servesPerUnit || 1);
                const recipeNeed = ing.amount || 0;
                const remainingServes = totalServesAvailable - recipeNeed;
                const isEnough = (ing.inStock && remainingServes >= 0);
                const autoBuyCount = Math.ceil(Math.abs(remainingServes) / (ing.servesPerUnit || 1)) || 1;

                return (
                  <div key={idx} className="bg-white dark:bg-[#181818] rounded-[2.5rem] border border-slate-100 dark:border-white/5 overflow-hidden shadow-lg animate-in slide-in-from-top-4 duration-300">
                    <div className="p-6 space-y-5">
                      <div className="flex gap-3 items-center">
                        <div className="flex-1 relative">
                          <label className="text-[9px] font-black uppercase tracking-[0.05em] text-slate-400 mb-1.5 block">Resource Name</label>
                          <input 
                            placeholder="e.g. Greek Yogurt" 
                            value={ing.name} 
                            onFocus={() => setActiveSearchIdx(idx)}
                            onBlur={() => setTimeout(() => setActiveSearchIdx(null), 250)}
                            onChange={e => handleUpdateIngredient(idx, 'name', e.target.value)}
                            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-xl p-3.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                          />
                          
                          {searchResults.length > 0 && activeSearchIdx === idx && (
                            <div className="absolute top-full left-0 right-0 mt-2 z-[90] bg-white dark:bg-[#1c1c1c] border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl">
                              {searchResults.map(suggestion => (
                                <button
                                  key={suggestion.id}
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => handleSelectSuggestion(idx, suggestion)}
                                  className="w-full flex items-center gap-3 p-4 hover:bg-emerald-500/10 text-left transition-all border-b border-slate-50 dark:border-white/5 last:border-0"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                    <Tag size={14} />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{suggestion.name}</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{suggestion.category} • {suggestion.unit}</p>
                                  </div>
                                  {suggestion.inStock && <CheckCircle2 size={12} className="text-emerald-500" />}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <button 
                          onClick={() => setIngredients(ingredients.filter((_, i) => i !== idx))}
                          className="p-3.5 text-slate-300 dark:text-slate-700 hover:text-red-500 transition-colors flex items-center justify-center h-12 self-end"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>

                      <div className="flex gap-3">
                        <div className="w-24 shrink-0 space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-[0.05em] text-slate-400">Needs</label>
                          <input 
                            type="number"
                            placeholder="1" 
                            step="any"
                            value={ing.amount === 0 ? '' : ing.amount} 
                            onChange={e => handleUpdateIngredient(idx, 'amount', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-xl p-3.5 text-sm font-bold text-slate-900 dark:text-white text-center outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                          />
                        </div>
                        
                        <div className="flex-1 space-y-1.5 relative">
                          <label className="text-[9px] font-black uppercase tracking-[0.05em] text-slate-400">Container Type</label>
                          <div className="relative">
                            <select 
                              value={ing.unit} 
                              onChange={e => handleUpdateIngredient(idx, 'unit', e.target.value)}
                              className="w-full bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-xl p-3.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 appearance-none cursor-pointer pr-10 transition-all"
                            >
                              {UNIT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        {(ing.unit === 'bottle' || ing.unit === 'pack' || ing.unit === 'cup' || ing.unit === 'piece') && (
                          <div className="w-24 shrink-0 space-y-1.5 animate-in slide-in-from-right-1">
                            <label className="text-[9px] font-black uppercase tracking-[0.05em] text-slate-400">Yield/Unit</label>
                            <div className="relative">
                              <input 
                                type="number" step="any"
                                value={ing.servesPerUnit === 0 ? '' : ing.servesPerUnit}
                                onChange={e => handleUpdateIngredient(idx, 'servesPerUnit', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                                className="w-full bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-xl p-3.5 text-[10px] font-black text-slate-900 dark:text-white text-center outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="bg-slate-50 dark:bg-black/10 p-4 rounded-3xl space-y-5 border border-slate-100 dark:border-white/5 transition-all">
                        <div className="flex bg-white dark:bg-white/5 p-1.5 rounded-2xl border border-slate-100 dark:border-white/10 transition-colors">
                          <button 
                            onClick={() => handleUpdateIngredient(idx, 'inStock', true)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${ing.inStock ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20' : 'text-slate-400'}`}
                          >
                            <CheckCircle2 size={14} /> In Stock
                          </button>
                          <button 
                            onClick={() => handleUpdateIngredient(idx, 'inStock', false)}
                            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${!ing.inStock ? 'bg-amber-500 text-white shadow-xl shadow-amber-500/20' : 'text-slate-400'}`}
                          >
                            <div className="flex items-center gap-2">
                              <ShoppingBag size={14} /> 
                              <span>Out of Stock</span>
                            </div>
                            {!ing.inStock && (
                              <span className="text-[8px] font-black opacity-90 tracking-wider">(Auto-Buy {autoBuyCount} {ing.unit})</span>
                            )}
                          </button>
                        </div>

                        {ing.inStock && (
                          <div className="animate-in slide-in-from-top-1 space-y-4">
                            <div className="flex gap-4 items-end">
                              <div className="flex-1 space-y-1.5">
                                <label className="text-[9px] font-black uppercase tracking-[0.05em] text-slate-400">Available units</label>
                                <div className="relative">
                                  <input 
                                    type="number" step="any"
                                    value={ing.availableQuantity === 0 ? '' : ing.availableQuantity}
                                    onChange={e => handleUpdateIngredient(idx, 'availableQuantity', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                                    className="w-full bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                                  />
                                </div>
                              </div>
                              
                              <div className="flex-[1.5] space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400/80">Usage Tracker</label>
                                <div className="flex gap-1.5 h-12 bg-white dark:bg-black/40 rounded-xl border border-slate-200 dark:border-white/10 p-2 items-stretch">
                                  {[...Array(5)].map((_, segIdx) => {
                                    const capacity = Math.max(totalServesAvailable, recipeNeed, 1);
                                    const servesPerSegment = capacity / 5;
                                    const segmentStart = segIdx * servesPerSegment;
                                    const segmentEnd = (segIdx + 1) * servesPerSegment;

                                    let bgStyle: React.CSSProperties = {};
                                    let bgClass = 'bg-slate-100 dark:bg-white/5';
                                    
                                    if (totalServesAvailable > segmentStart) {
                                      if (remainingServes >= segmentEnd) {
                                        bgClass = 'bg-emerald-500';
                                      } 
                                      else {
                                        bgClass = 'bg-red-500/30 animate-pulse';
                                        bgStyle = {
                                          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.08) 5px, rgba(255,255,255,0.08) 10px)'
                                        };
                                      }
                                    }

                                    return (
                                      <div 
                                        key={segIdx} 
                                        style={bgStyle}
                                        className={`flex-1 rounded-md transition-all duration-500 ${bgClass}`} 
                                      />
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center px-1">
                               <p className="text-[10px] font-bold text-slate-400 tracking-tight">Yield Available: {totalServesAvailable.toFixed(1)} Portions</p>
                               <div className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${isEnough ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                                 {isEnough ? `Stock Safe` : `Deficit: ${Math.abs(remainingServes).toFixed(1)}`}
                               </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-[0.05em] text-slate-400">Preferred Store</label>
                        <div className="relative h-12 flex items-center">
                          <input 
                            placeholder="e.g. Whole Foods"
                            value={ing.store}
                            onChange={e => handleUpdateIngredient(idx, 'store', e.target.value)}
                            className="w-full h-full bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-white/10 rounded-xl p-3.5 pl-11 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700"
                          />
                          <Store size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Cooking Steps Section */}
          <section className="space-y-6">
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-4">Steps</h3>
            
            <div className="flex flex-wrap gap-3 mb-8">
              <button 
                onClick={() => setShowImportInput(!showImportInput)}
                className="bg-slate-100 dark:bg-white/5 text-slate-500 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 dark:hover:bg-white/10 transition-all shadow-sm"
              >
                <Link2 size={14} /> Import from link
              </button>
              <button 
                onClick={handleAddStep} 
                className="bg-emerald-500/10 text-emerald-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-500 hover:text-white transition-all active:scale-95 shadow-sm"
              >
                <Plus size={14} /> Add Step
              </button>
            </div>

            {showImportInput && (
              <div className="bg-slate-50 dark:bg-black/20 p-6 rounded-[2rem] border border-slate-100 dark:border-white/5 animate-in slide-in-from-top-2 duration-300 mb-8">
                <label className="text-[9px] font-black uppercase tracking-[0.05em] text-slate-400 mb-2 block">Source URL</label>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    placeholder="Paste recipe URL here (e.g., YouTube, Blog...)"
                    className="flex-1 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  />
                  <button 
                    onClick={handleExtract}
                    className="bg-slate-900 dark:bg-white text-white dark:text-black px-6 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all"
                  >
                    <Wand2 size={14} /> Extract
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {instructions.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-white/5 rounded-[3rem]">
                   <p className="text-slate-400 text-sm font-medium leading-relaxed">No steps added yet.<br/>Add a step manually or import from a link.</p>
                </div>
              ) : (
                instructions.map((step, idx) => (
                  <div key={idx} className="group/step relative flex gap-5 items-start animate-in slide-in-from-left duration-300 bg-white dark:bg-[#181818] p-7 rounded-[2.5rem] border border-slate-50 dark:border-white/5 shadow-sm">
                    <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-xs shrink-0 shadow-lg">
                      {idx + 1}
                    </div>
                    <textarea 
                      value={step} onChange={e => {
                        const next = [...instructions];
                        next[idx] = e.target.value;
                        setInstructions(next);
                      }}
                      placeholder="Describe this step..."
                      className="flex-1 bg-transparent border-none p-0 text-sm font-medium text-slate-900 dark:text-white resize-none h-28 focus:ring-0 outline-none transition-all leading-relaxed"
                    />
                    <button 
                      onClick={() => handleDeleteStep(idx)}
                      className="absolute -top-3 -right-3 p-3 bg-white dark:bg-slate-800 rounded-full text-slate-300 hover:text-red-500 shadow-xl opacity-0 group-hover/step:opacity-100 transition-all border border-slate-100 dark:border-white/10 hover:scale-110"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="p-8 bg-white/60 dark:bg-[#121212]/60 backdrop-blur-3xl border-t border-slate-100 dark:border-white/5 shrink-0 z-10 sticky bottom-0 flex justify-center">
          <button 
            onClick={handleSave}
            className="w-full max-w-sm bg-slate-900 dark:bg-white text-white dark:text-black py-5 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl flex items-center justify-center gap-3 active:scale-[0.97] transition-all border-b-4 border-slate-800 dark:border-slate-300"
          >
            <Layers size={20} /> Save to Recipe Collection
          </button>
        </div>
      </div>
    </div>
  );
};
