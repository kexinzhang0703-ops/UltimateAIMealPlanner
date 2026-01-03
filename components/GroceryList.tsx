import React, { useState } from 'react';
import { IngredientEntity } from '../types';
import { ShoppingCart, CheckCircle, Circle, MapPin, Store, Plus, Tag } from 'lucide-react';

interface Props {
  inventory: IngredientEntity[];
  onToggleStock: (id: string) => void;
  onAddItem: (name: string) => void;
}

export const GroceryList: React.FC<Props> = ({ inventory, onToggleStock, onAddItem }) => {
  const [quickAddName, setQuickAddName] = useState('');
  
  const missingItems = inventory.filter(item => !item.inStock || (item.neededQuantity && item.neededQuantity > 0));
  
  // Group by store
  const storeGroups = missingItems.reduce((acc, item) => {
    const store = item.store || 'General';
    if (!acc[store]) acc[store] = [];
    acc[store].push(item);
    return acc;
  }, {} as Record<string, IngredientEntity[]>);

  const handleQuickAdd = () => {
    if (quickAddName.trim()) {
      onAddItem(quickAddName.trim());
      setQuickAddName('');
    }
  };

  return (
    <div className="pb-40 animate-in fade-in duration-300 min-h-screen">
      <div className="mb-10 pt-8 px-1">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Grocery List</h1>
        <p className="text-slate-500 font-medium mt-1">{missingItems.length} items to purchase</p>
      </div>

      <div className="space-y-12">
        {missingItems.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-20">
            <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <ShoppingCart size={40} className="text-slate-300" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">List is empty</h2>
            <p className="text-slate-400 text-sm text-center font-medium">All items are in stock!</p>
          </div>
        ) : (
          (Object.entries(storeGroups) as [string, IngredientEntity[]][]).map(([storeName, items]) => (
            <div key={storeName} className="space-y-5">
              <div className="flex items-center gap-3 px-2">
                <div className="bg-emerald-500/10 p-2.5 rounded-xl text-emerald-600">
                  <Store size={18} />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{storeName}</h3>
                <div className="flex-1 h-px bg-slate-100 dark:bg-white/5 ml-2" />
              </div>

              <div className="space-y-3">
                {items.map(item => {
                  const isPartial = item.inStock && (item.neededQuantity || 0) > 0;
                  const buyQty = item.neededQuantity || item.quantity || 1;
                  
                  return (
                    <div 
                      key={item.id}
                      onClick={() => onToggleStock(item.id)}
                      className="bg-white dark:bg-[#121212] h-20 p-5 rounded-[2.5rem] flex items-center justify-between border border-slate-100 dark:border-white/5 shadow-sm active:scale-[0.98] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-7 h-7 rounded-full border-2 border-slate-200 dark:border-white/10 flex items-center justify-center group-hover:border-emerald-500 transition-colors">
                          <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 scale-0 group-active:scale-100 transition-transform" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{item.name}</h4>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                            Buy: {buyQty} {item.unit} {isPartial ? `(Have ${item.quantity})` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="text-[9px] font-black text-slate-400 bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-slate-100 dark:border-white/5">
                        <Tag size={10} /> {item.category}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}

        {/* Minimalist Quick-Add Row at the very bottom of the list */}
        <div className="pt-10">
          <div className="bg-white dark:bg-[#121212] h-16 px-6 rounded-[1.8rem] flex items-center border border-dashed border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100 transition-all cursor-text group focus-within:opacity-100 focus-within:border-emerald-500/50 shadow-sm">
            <Plus size={18} className="text-slate-400 mr-4 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text"
              value={quickAddName}
              onChange={(e) => setQuickAddName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleQuickAdd();
              }}
              placeholder="Add an item to the list..."
              className="flex-1 bg-transparent border-none outline-none font-bold text-slate-600 dark:text-slate-300 placeholder:text-slate-400 text-sm"
            />
            {quickAddName.trim() && (
              <button 
                onClick={handleQuickAdd}
                className="bg-slate-900 dark:bg-white text-white dark:text-black px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-right-2 shadow-lg"
              >
                Add
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-16 px-2">
        <button 
          onClick={() => window.print()}
          className="w-full bg-slate-100 dark:bg-[#121212] text-slate-500 dark:text-slate-400 py-4 rounded-[1.8rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-white/5 transition-all border border-slate-200 dark:border-white/5"
        >
          Export / Print List
        </button>
      </div>
    </div>
  );
};
