
import React, { useState, useEffect } from 'react';
import { Recipe, IngredientEntity, RecipeCoverage } from '../types';
import { generateMealImage } from '../services/geminiService';
import { X, Clock, ChefHat, Flame, Share2, Heart, Edit3, ChevronRight, PlusCircle, Sparkles, AlertCircle, Trash2 } from 'lucide-react';

interface Props {
  recipe: Recipe;
  coverage?: RecipeCoverage;
  onClose: () => void;
  onIngredientClick: (entity: IngredientEntity) => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddToPlan: () => void;
}

export const RecipeDetail: React.FC<Props> = ({ 
  recipe, coverage, onClose, onIngredientClick, onEdit, onDelete, onAddToPlan 
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      setLoadingImage(true);
      const url = await generateMealImage(recipe.name);
      setImageUrl(url);
      setLoadingImage(false);
    };
    fetchImage();
  }, [recipe.name]);

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 dark:bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#121212] rounded-t-[3rem] sm:rounded-[3rem] w-full max-w-2xl h-[94vh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border-t border-slate-200 dark:border-white/10 transition-colors">
        
        <div className="relative h-64 sm:h-80 bg-slate-200 dark:bg-slate-900 overflow-hidden shrink-0">
          {loadingImage ? (
            <div className="w-full h-full animate-pulse flex items-center justify-center">
              <span className="text-slate-400 dark:text-slate-600 font-black text-xs uppercase tracking-[0.4em]">Visualizing...</span>
            </div>
          ) : imageUrl ? (
            <img src={imageUrl} alt={recipe.name} className="w-full h-full object-cover dark:opacity-80" />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-800">No Image</div>
          )}
          
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
            <button onClick={onClose} className="bg-white/40 dark:bg-black/40 backdrop-blur-md p-2 rounded-full text-slate-900 dark:text-white border border-white/20"><X size={24} /></button>
            <div className="flex gap-2">
              <button onClick={onEdit} className="bg-white/40 dark:bg-black/40 backdrop-blur-md p-2 rounded-full text-slate-900 dark:text-white border border-white/20"><Edit3 size={20} /></button>
              <button onClick={onDelete} className="bg-white/40 dark:bg-black/40 backdrop-blur-md p-2 rounded-full text-red-500 border border-white/20"><Trash2 size={20} /></button>
            </div>
          </div>
        </div>

        <div className="p-8 overflow-y-auto no-scrollbar pb-32 flex-1">
          <div className="mb-8">
            <div className="flex items-start justify-between mb-2">
               <h2 className="text-4xl font-black text-slate-900 dark:text-white leading-tight tracking-tight">{recipe.name}</h2>
               {coverage?.isCookable && (
                 <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                   <Sparkles size={12} /> Cookable
                 </div>
               )}
            </div>
            <div className="flex flex-wrap gap-4 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1.5"><Clock size={14} className="text-emerald-500" /> {recipe.cookingTime} min</span>
              <span className="flex items-center gap-1.5"><ChefHat size={14} className="text-blue-500" /> {recipe.difficulty}</span>
            </div>
          </div>

          <div className="space-y-12">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-3">Ingredients</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, idx) => {
                  const isMatched = !!coverage?.matchedEntities[ing.name];
                  return (
                    <li key={idx} onClick={() => onIngredientClick(isMatched ? coverage!.matchedEntities[ing.name] : { name: ing.name } as any)} className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer border ${isMatched ? 'bg-emerald-50/30 dark:bg-emerald-500/5 border-emerald-500/10' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-transparent'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${isMatched ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="font-bold">{ing.name}</span>
                      </div>
                      <span className="text-slate-400 text-xs font-bold">{ing.amount} {ing.unit}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 border-b border-slate-100 dark:border-white/5 pb-3">Preparation</h3>
              <ol className="space-y-6">
                {recipe.instructions.map((step, idx) => (
                  <li key={idx} className="flex gap-6"><span className="text-emerald-500 font-black text-2xl shrink-0 w-8">{idx + 1}</span><p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{step}</p></li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/90 dark:bg-black/90 backdrop-blur-2xl border-t border-slate-200 dark:border-white/10 shrink-0">
          <button onClick={onAddToPlan} className="w-full bg-slate-900 dark:bg-white text-white dark:text-black py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
            <PlusCircle size={20} /> Add to Meal Plan
          </button>
        </div>
      </div>
    </div>
  );
};
