'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { StreakHeatmap } from '@/components/dashboard/StreakHeatmap';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { RoadmapHub } from '@/components/dashboard/RoadmapHub';
import { PROBLEMS_DATA } from '@/data/problems';
import { ROADMAP_DAYS } from '@/data/roadmap';
import {
  Play,
  Sparkles,
  Trophy,
  Flame,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Code
} from 'lucide-react';

export default function DashboardPage() {
  const {
    streak,
    completionPercentage,
    solvedCount,
    totalProblemsCount,
    isSolved,
    language
  } = useApp();

  // Find the next recommended problem to solve
  const nextUnsolvedProblem = PROBLEMS_DATA.find(p => !isSolved(p.id)) || PROBLEMS_DATA[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero SaaS Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-950/40 border border-zinc-800 p-6 sm:p-8 shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>30-Day Developer DSA Accelerator</span>
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                  {language.toUpperCase()} Track
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                Master Data Structures & Algorithms in{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                  C++ & Python
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                Step-by-step interview roadmap from Day 1 to course completion. Features Socratic AI mentorship, live C++ Stack/Heap vs Python PyObject memory visualizer, and local-first progress tracking.
              </p>

              {/* Progress Bar in Hero */}
              <div className="pt-2 space-y-1.5 max-w-md">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">Roadmap Progress</span>
                  <span className="text-emerald-400 font-bold">{completionPercentage}% Completed</span>
                </div>
                <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Action Card: Continue Learning */}
            <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl p-5 shadow-xl w-full lg:w-80 shrink-0 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Recommended Next Step
              </span>

              {nextUnsolvedProblem ? (
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-indigo-400 font-mono">
                      Day {nextUnsolvedProblem.day}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full font-semibold border ${
                        nextUnsolvedProblem.difficulty === 'Easy'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                          : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                      }`}
                    >
                      {nextUnsolvedProblem.difficulty}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-base">
                    {nextUnsolvedProblem.title}
                  </h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                    {nextUnsolvedProblem.description.slice(0, 100)}...
                  </p>

                  <Link
                    href={`/workspace/${nextUnsolvedProblem.id}`}
                    className="mt-4 w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Launch Workspace</span>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4 text-xs text-emerald-400 font-semibold">
                  🎉 Congratulations! You have completed all course problems!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Streak Heatmap & Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StreakHeatmap />
          <AnalyticsCharts />
        </div>

        {/* Section 3: 30-Day Structured Roadmap Hub */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                <span>Developer Curriculum & Practice Roadmap</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Systematic daily progression with comparative C++ STL vs Python insights.
              </p>
            </div>
          </div>

          <RoadmapHub />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-zinc-800 bg-zinc-950 py-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Code className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-zinc-400">CodeMap DSA</span>
            <span>— Interactive C++ & Python SaaS Platform</span>
          </div>
          <div>Zero backend • Stored locally in browser LocalStorage • Powered by Gemini AI</div>
        </div>
      </footer>
    </div>
  );
}
