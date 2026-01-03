
import React, { useState } from 'react';
import { X, Calendar, Check } from 'lucide-react';

interface Props {
  onClose: () => void;
  onConfirm: (day: string, slot: string) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SLOTS = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

export const SlotPicker: React.FC<Props> = ({ onClose, onConfirm }) => {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedSlot, setSelectedSlot] = useState('Dinner');

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#121212] w-full max-w-sm rounded-[3rem] p-8 shadow-2xl border border-slate-200 dark:border-white/10">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Add to Plan</h3>
          <button onClick={onClose} className="p-2 text-slate-400"><X size={20} /></button>
        </div>

        <div className="space-y-8">
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Select Day</label>
            <div className="grid grid-cols-4 gap-2">
              {DAYS.map(day => (
                <button 
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`py-2 px-1 rounded-xl text-[10px] font-black uppercase tracking-tighter border transition-all ${
                    selectedDay === day 
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white' 
                    : 'bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-100 dark:border-transparent'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Select Slot</label>
            <div className="grid grid-cols-2 gap-3">
              {SLOTS.map(slot => (
                <button 
                  key={slot}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-4 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all ${
                    selectedSlot === slot 
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20' 
                    : 'bg-slate-50 dark:bg-white/5 text-slate-500 border-slate-100 dark:border-transparent'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={() => onConfirm(selectedDay, selectedSlot)}
          className="w-full bg-slate-900 dark:bg-white text-white dark:text-black mt-10 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Check size={18} /> Confirm Plan
        </button>
      </div>
    </div>
  );
};
