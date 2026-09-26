'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Flame, Calendar, Award, Clock } from 'lucide-react';

export const StreakHeatmap: React.FC = () => {
  const { streak, dailyActivity, solvedCount } = useApp();

  // Generate the last 14 weeks (98 days)
  const days: { dateStr: string; dayOfWeek: number; count: number; minutes: number }[] = [];
  const today = new Date();

  for (let i = 97; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const activity = dailyActivity[dateStr] || { count: 0, minutes: 0 };
    days.push({
      dateStr,
      dayOfWeek: d.getDay(),
      count: activity.count,
      minutes: activity.minutes
    });
  }

  // Calculate total study minutes
  const totalMinutes = Object.values(dailyActivity).reduce((acc, curr) => acc + curr.minutes, 0);

  const getHeatColor = (count: number) => {
    if (count === 0) return 'bg-zinc-900 border-zinc-800';
    if (count === 1) return 'bg-emerald-900/60 border-emerald-700/50';
    if (count === 2) return 'bg-emerald-700 border-emerald-500';
    return 'bg-emerald-400 border-emerald-300 shadow-sm shadow-emerald-400/40';
  };

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Top Banner: Streak Metrics */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Flame className="w-7 h-7 text-white fill-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-black text-white tracking-tight">
                {streak.currentStreak}-Day Streak
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                Active 🔥
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Personal Best: <strong className="text-zinc-200">{streak.maxStreak} days</strong> | Keep coding daily to maintain momentum!
            </p>
          </div>
        </div>

        {/* Quick Stat Badges */}
        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-zinc-950/80 px-3 py-2 rounded-xl border border-zinc-800 flex items-center space-x-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <div>
              <div className="text-[10px] text-zinc-500">Solved</div>
              <div className="font-bold text-zinc-100">{solvedCount} Problems</div>
            </div>
          </div>

          <div className="bg-zinc-950/80 px-3 py-2 rounded-xl border border-zinc-800 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-indigo-400" />
            <div>
              <div className="text-[10px] text-zinc-500">Study Time</div>
              <div className="font-bold text-zinc-100">{Math.round(totalMinutes / 60)} hrs {totalMinutes % 60}m</div>
            </div>
          </div>

          <div className="bg-zinc-950/80 px-3 py-2 rounded-xl border border-zinc-800 flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            <div>
              <div className="text-[10px] text-zinc-500">Active Days</div>
              <div className="font-bold text-zinc-100">{streak.totalActiveDays} Days</div>
            </div>
          </div>
        </div>
      </div>

      {/* GitHub-style Heatmap Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span className="font-semibold text-zinc-300">Daily Activity Heat-Map</span>
          <div className="flex items-center space-x-1.5 text-[11px] text-zinc-500">
            <span>Less</span>
            <div className="w-2.5 h-2.5 rounded-sm bg-zinc-900 border border-zinc-800" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-900/60 border border-emerald-700/50" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-700 border border-emerald-500" />
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400 border border-emerald-300" />
            <span>More</span>
          </div>
        </div>

        {/* Heatmap cells */}
        <div className="overflow-x-auto pb-1">
          <div className="grid grid-flow-col grid-rows-7 gap-1.5 w-max">
            {days.map((d, idx) => (
              <div
                key={idx}
                title={`${d.dateStr}: ${d.count} solved, ${d.minutes} mins`}
                className={`w-3.5 h-3.5 rounded-sm border transition-transform hover:scale-125 cursor-pointer ${getHeatColor(d.count)}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
