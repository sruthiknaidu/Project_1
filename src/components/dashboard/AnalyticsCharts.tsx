'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PROBLEMS_DATA } from '@/data/problems';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { BarChart3, TrendingUp, Compass, PieChart as PieIcon } from 'lucide-react';

export const AnalyticsCharts: React.FC = () => {
  const { dailyActivity, solvedProblems } = useApp();
  const [activeChartTab, setActiveChartTab] = useState<'activity' | 'mastery' | 'difficulty'>('activity');

  // Generate 14-day chronological activity data
  const activityData = [];
  const today = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateKey = d.toISOString().split('T')[0];
    const item = dailyActivity[dateKey] || { count: 0, minutes: 0 };
    activityData.push({
      date: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      solved: item.count,
      minutes: item.minutes
    });
  }

  // Calculate conceptual mastery per topic
  const categories = [
    'Arrays & Hashing',
    'Two Pointers',
    'Linked Lists',
    'Stacks',
    'Binary Search',
    'Trees',
    'Heaps & Priority Queues',
    'Dynamic Programming'
  ];

  const masteryData = categories.map(cat => {
    const totalInCat = PROBLEMS_DATA.filter(p => p.category.includes(cat) || cat.includes(p.category)).length || 1;
    const solvedInCat = PROBLEMS_DATA.filter(
      p => (p.category.includes(cat) || cat.includes(p.category)) && !!solvedProblems[p.id]
    ).length;
    const masteryPercent = Math.min(100, Math.round((solvedInCat / totalInCat) * 100) + (solvedInCat > 0 ? 20 : 0));

    return {
      topic: cat.replace(' & Priority Queues', '').replace(' & Hashing', ''),
      mastery: masteryPercent,
      fullMark: 100
    };
  });

  // Calculate difficulty breakdown
  const difficultyCounts = { Easy: 0, Medium: 0, Hard: 0 };
  Object.keys(solvedProblems).forEach(id => {
    const prob = PROBLEMS_DATA.find(p => p.id === id);
    if (prob) {
      difficultyCounts[prob.difficulty]++;
    }
  });

  const difficultyData = [
    { name: 'Easy', value: difficultyCounts.Easy || 2, color: '#10b981' },
    { name: 'Medium', value: difficultyCounts.Medium || 1, color: '#f59e0b' },
    { name: 'Hard', value: difficultyCounts.Hard || 0, color: '#ef4444' }
  ];

  return (
    <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Chart Selector Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Interactive Analytics & Mastery
          </h3>
        </div>

        <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveChartTab('activity')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeChartTab === 'activity'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Study Velocity</span>
          </button>

          <button
            onClick={() => setActiveChartTab('mastery')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeChartTab === 'mastery'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Topic Mastery</span>
          </button>

          <button
            onClick={() => setActiveChartTab('difficulty')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-all ${
              activeChartTab === 'difficulty'
                ? 'bg-zinc-800 text-white font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>Difficulty</span>
          </button>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div className="h-64 w-full">
        {activeChartTab === 'activity' && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" stroke="#71717a" fontSize={11} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#09090b',
                  borderColor: '#27272a',
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: '#e4e4e7'
                }}
              />
              <Area
                type="monotone"
                dataKey="minutes"
                name="Minutes Spent"
                stroke="#6366f1"
                fillOpacity={1}
                fill="url(#colorMinutes)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="solved"
                name="Problems Solved"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorSolved)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}

        {activeChartTab === 'mastery' && (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={masteryData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
              <PolarGrid stroke="#27272a" />
              <PolarAngleAxis dataKey="topic" stroke="#a1a1aa" fontSize={11} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#52525b" fontSize={10} />
              <Radar
                name="Topic Mastery %"
                dataKey="mastery"
                stroke="#8b5cf6"
                fill="#8b5cf6"
                fillOpacity={0.35}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#09090b',
                  borderColor: '#27272a',
                  borderRadius: '10px',
                  fontSize: '12px',
                  color: '#e4e4e7'
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        )}

        {activeChartTab === 'difficulty' && (
          <div className="flex items-center justify-around h-full">
            <div className="h-full w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#09090b',
                      borderColor: '#27272a',
                      borderRadius: '10px',
                      fontSize: '12px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3 text-xs font-medium">
              {difficultyData.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-zinc-300">{item.name}:</span>
                  <span className="font-bold text-white font-mono">{item.value} solved</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
