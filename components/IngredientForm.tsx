
import React, { useState } from 'react';
import { IngredientEntity, IngredientCategory, StorageLocation } from '../types';
import { X, Save, Calendar, ShoppingBag, CheckCircle2, Circle } from 'lucide-react';

interface Props {
  initialIngredient?: IngredientEntity | null;
  onClose: () => void;
  onSave: (ingredient: IngredientEntity) => void;
}

const CATEGORIES: IngredientCategory[] = ['Produce', 'Meat', 'Dairy', 'Pantry', 'Frozen', 'Bakery', 'Other'];
const LOCATIONS: StorageLocation[] = ['Fridge', 'Pantry', 'Freezer', 'Counter'];

export const IngredientForm: React.FC<Props> = ({ initialIngredient, onClose, onSave }) => {
  const [name, setName] = useState(initialIngredient?.name || '');
  const [quantity, setQuantity] = useState(initialIngredient?.quantity || 1);
  const [unit, setUnit] = useState(initialIngredient?.unit || 'pcs');
  const [category, setCategory] = useState<IngredientCategory>(initialIngredient?.category || 'Pantry');
  const [location, setLocation] = useState<StorageLocation>(initialIngredient?.location || 'Pantry');
  const [brand, setBrand] = useState(initialIngredient?.brand || '');
  const [store, setStore] = useState(initialIngredient?.store || '');
  const [notes, setNotes] = useState(initialIngredient?.notes || '');
  const [inStock, setInStock] = useState(initialIngredient?.inStock ?? true);
  const [dateBought, setDateBought] = useState(initialIngredient?.dateBought || new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState(initialIngredient?.expiryDate || '');

  const handleSave = () => {
    if (!name) return alert('Name is required');
    onSave({
      id: initialIngredient?.id || Math.random().toString(36).substr(2, 9),
      name,
      nameNormalized: name.toLowerCase().trim(),
      inStock,
      category,
      location,
      brand,
      store: store || 'General',
      notes,
      quantity,
      unit,
      updatedAt: Date.now(),
      dateBought: inStock ? dateBought : undefined,
      expiryDate: inStock ? expiryDate : undefined
    });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 dark:bg-black/90 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white dark:bg-[#121212] w-full max-w-lg h-[92vh] sm:h-auto overflow-hidden flex flex-col rounded-t-[3rem] sm:rounded-[3rem] border-t border-slate-200 dark:border-white/10 shadow-2xl">
        <div className="p-8 flex justify-between items-center border-b border-slate-100 dark:border-white/5 shrink-0">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">{initialIngredient ? 'Edit Ingredient' : 'New Ingredient'}</h2>
          <button onClick={onClose} className="p-2 bg-slate-100 dark:bg-white/5 rounded-full text-slate-500"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar pb-32">
          {/* Stock Toggle */}
          <button 
            onClick={() => setInStock(!inStock)}
            className={`w-full p-6 rounded-[2rem] flex items-center justify-between border-2 transition-all ${
              inStock 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' 
              : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500'
            }`}
          >
            <div className="flex items-center gap-4">
              {inStock ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              <div className="text-left">
                <p className="font-black uppercase tracking-widest text-[10px]">Stock Status</p>
                <p className="font-bold text-lg">{inStock ? 'Currently In Stock' : 'Add to Grocery List'}</p>
              </div>
            </div>
            {!inStock && <ShoppingBag className="opacity-50" />}
          </button>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Ingredient Name</label>
            <input 
              value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Fresh Milk"
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-emerald-500/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Quantity</label>
              <input 
                type="text" value={quantity} onChange={e => setQuantity(e.target.value)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Unit</label>
              <input 
                value={unit} onChange={e => setUnit(e.target.value)}
                placeholder="pcs, ml, lbs"
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white font-bold"
              />
            </div>
          </div>

          {inStock && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Date Bought</label>
                <input 
                  type="date" value={dateBought} onChange={e => setDateBought(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white font-bold text-sm"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Expiration Date</label>
                <input 
                  type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white font-bold text-sm"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Store / Supermarket</label>
            <input 
              value={store} onChange={e => setStore(e.target.value)}
              placeholder="e.g. Trader Joe's, Whole Foods"
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white font-bold"
            />
            {!inStock && <p className="text-[10px] text-emerald-600 font-bold mt-2 uppercase tracking-widest">This item will be grouped by this store in your list</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Category</label>
              <select 
                value={category} onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white font-bold appearance-none"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Storage Location</label>
              <select 
                value={location} onChange={e => setLocation(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-slate-900 dark:text-white font-bold appearance-none"
              >
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-[#121212] border-t border-slate-100 dark:border-white/5 shrink-0">
          <button 
            onClick={handleSave}
            className="w-full bg-emerald-600 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Save size={18} /> {initialIngredient ? 'Update Ingredient' : 'Add Ingredient'}
          </button>
        </div>
      </div>
    </div>
  );
};
