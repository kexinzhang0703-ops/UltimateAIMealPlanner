
import React from 'react';
import { IngredientEntity } from '../types';
import { X, Calendar, MapPin, Tag, Info, CheckCircle2, Circle, Edit3, ShoppingBag } from 'lucide-react';

interface Props {
  ingredient: IngredientEntity;
  onClose: () => void;
  onUpdate: (updated: IngredientEntity) => void;
  onEdit: () => void;
}

export const IngredientDetail: React.FC<Props> = ({ ingredient, onClose, onUpdate, onEdit }) => {
  const toggleStock = () => {
    onUpdate({
      ...ingredient,
      inStock: !ingredient.inStock,
      dateBought: !ingredient.inStock ? new Date().toISOString().split('T')[0] : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 dark:bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#121212] rounded-t-[3rem] sm:rounded-[3rem] w-full max-w-lg h-[85vh] sm:h-auto overflow-hidden flex flex-col shadow-2xl border-t border-slate-200 dark:border-white/10">
        <div className="p-8 overflow-y-auto no-scrollbar pb-24">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <button 
                  onClick={toggleStock}
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    ingredient.inStock 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-500' 
                    : 'bg-slate-200 dark:bg-white/5 text-slate-500'
                  }`}
                >
                  {ingredient.inStock ? 'In Stock' : 'Mark In Stock'}
                </button>
                <span className="bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {ingredient.category}
                </span>
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{ingredient.name}</h2>
            </div>
            <button onClick={onClose} className="bg-slate-100 dark:bg-white/5 p-2 rounded-full text-slate-900 dark:text-white">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-50 dark:bg-[#1c1c1c] p-5 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-transparent">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Tag size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity & Brand</p>
                <p className="text-slate-900 dark:text-white font-bold">{ingredient.quantity} {ingredient.unit} {ingredient.brand ? `• ${ingredient.brand}` : ''}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#1c1c1c] p-5 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-transparent">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                <ShoppingBag size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Preferred Store</p>
                <p className="text-slate-900 dark:text-white font-bold">{ingredient.store || 'Any Store'}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#1c1c1c] p-5 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-transparent">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600">
                <MapPin size={20} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                <p className="text-slate-900 dark:text-white font-bold">{ingredient.location || 'Kitchen'}</p>
              </div>
            </div>

            {ingredient.inStock && (
              <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2">
                <div className="bg-slate-50 dark:bg-[#1c1c1c] p-5 rounded-2xl border border-slate-100 dark:border-transparent">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bought On</p>
                  <p className="text-slate-900 dark:text-white font-bold text-sm">{ingredient.dateBought || 'Today'}</p>
                </div>
                <div className="bg-slate-50 dark:bg-[#1c1c1c] p-5 rounded-2xl border border-slate-100 dark:border-transparent">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Expires On</p>
                  <p className="text-slate-900 dark:text-white font-bold text-sm">{ingredient.expiryDate || 'N/A'}</p>
                </div>
              </div>
            )}

            <div className="bg-slate-50 dark:bg-[#1c1c1c] p-5 rounded-2xl border border-slate-100 dark:border-transparent">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Inventory Notes</p>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {ingredient.notes || 'No specific notes for this item.'}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-slate-200 dark:border-white/10 flex gap-3">
          <button 
            onClick={onEdit}
            className="flex-1 bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Edit3 size={16} /> Edit Ingredient
          </button>
          <button 
            onClick={toggleStock}
            className={`px-6 py-4 rounded-2xl flex items-center justify-center transition-all ${
              ingredient.inStock 
              ? 'bg-red-50 dark:bg-red-500/10 text-red-600' 
              : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600'
            }`}
          >
            {ingredient.inStock ? 'Remove' : 'Restock'}
          </button>
        </div>
      </div>
    </div>
  );
};
