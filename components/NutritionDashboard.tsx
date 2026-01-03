
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { WeeklyPlan } from '../types';

interface Props {
  plan: WeeklyPlan;
}

export const NutritionDashboard: React.FC<Props> = ({ plan }) => {
  const chartData = plan.days.map(d => ({
    name: d.day.slice(0, 3),
    calories: (d.meals.breakfast?.nutrition.calories || 0) + (d.meals.lunch?.nutrition.calories || 0) + (d.meals.dinner?.nutrition.calories || 0),
    protein: (d.meals.breakfast?.nutrition.protein || 0) + (d.meals.lunch?.nutrition.protein || 0) + (d.meals.dinner?.nutrition.protein || 0),
    carbs: (d.meals.breakfast?.nutrition.carbs || 0) + (d.meals.lunch?.nutrition.carbs || 0) + (d.meals.dinner?.nutrition.carbs || 0),
    fat: (d.meals.breakfast?.nutrition.fat || 0) + (d.meals.lunch?.nutrition.fat || 0) + (d.meals.dinner?.nutrition.fat || 0),
  }));

  const totalNutrition = chartData.reduce((acc, curr) => ({
    protein: acc.protein + curr.protein,
    carbs: acc.carbs + curr.carbs,
    fat: acc.fat + curr.fat,
  }), { protein: 0, carbs: 0, fat: 0 });

  const macroData = [
    { name: 'Protein', value: totalNutrition.protein, color: '#3B82F6' },
    { name: 'Carbs', value: totalNutrition.carbs, color: '#10B981' },
    { name: 'Fat', value: totalNutrition.fat, color: '#F59E0B' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Macro Distribution</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            {macroData.map(m => (
              <div key={m.name} className="flex items-center text-xs">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: m.color }} />
                <span className="text-slate-500 font-medium">{m.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Weekly Calorie Trend</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="calories" fill="#10B981" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-emerald-600 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between shadow-lg">
        <div className="mb-6 md:mb-0">
          <h2 className="text-2xl font-bold mb-2">Nutritional Goal Track</h2>
          <p className="opacity-90 max-w-md">Your current plan is optimized for muscle gain with an average of 2,400 kcal per day.</p>
        </div>
        <div className="flex gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold">85%</div>
            <div className="text-xs uppercase tracking-widest opacity-75 font-semibold">Protein Target</div>
          </div>
          <div className="text-center border-l border-white/20 pl-8">
            <div className="text-4xl font-bold">12.5k</div>
            <div className="text-xs uppercase tracking-widest opacity-75 font-semibold">Weekly Calories</div>
          </div>
        </div>
      </div>
    </div>
  );
};
