'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { ROADMAP_DAYS } from '@/data/roadmap';
import { SettingsModal } from '@/components/modals/SettingsModal';
import {
  Code,
  Flame,
  Moon,
  Sun,
  Settings,
  ChevronDown,
  Layers,
  Cpu,
  Trophy,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    streak,
    completionPercentage,
    solvedCount,
    totalProblemsCount,
    geminiApiKey
  } = useApp();

  const router = useRouter();
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDaySelectorOpen, setIsDaySelectorOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleSelectDay = (dayNum: number) => {
    setIsDaySelectorOpen(false);
    const day = ROADMAP_DAYS.find(d => d.day === dayNum);
    if (day && day.problemIds.length > 0) {
      router.push(`/workspace/${day.problemIds[0]}`);
    } else {
      router.push(`/#day-${dayNum}`);
    }
  };

  return (
    <>
      <header className="h-14 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800 text-zinc-100 flex items-center justify-between px-4 sm:px-6 z-40 select-none">
        {/* Left: Brand Logo & Links */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Code className="w-4 h-4 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-white flex items-center space-x-1.5">
                <span>CodeMap</span>
                <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                  DSA
                </span>
              </span>
              <span className="text-[10px] text-zinc-400 -mt-0.5 font-mono">
                C++ & Python Roadmap
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center space-x-1 text-xs font-medium">
            <Link
              href="/dashboard"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === '/' || pathname === '/dashboard'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              Dashboard
            </Link>

            <Link
              href="/visualizer"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
                pathname === '/visualizer'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>Memory Sandbox</span>
            </Link>

            <Link
              href="/problems"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
                pathname === '/problems'
                  ? 'bg-zinc-800 text-white font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span>Problems Hub</span>
            </Link>
          </nav>
        </div>

        {/* Center / Right: Day-by-Day Selector, Language Toggle, Streak, Theme, Settings */}
        <div className="flex items-center space-x-3">
          {/* Day-by-Day Course Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setIsDaySelectorOpen(!isDaySelectorOpen)}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-medium text-zinc-300 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Jump to Day</span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            {isDaySelectorOpen && (
              <div className="absolute top-full mt-1.5 right-0 w-64 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-2 z-50 max-h-72 overflow-y-auto custom-scrollbar">
                <div className="px-3 py-1 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  30-Day Curriculum
                </div>
                {ROADMAP_DAYS.map(d => (
                  <button
                    key={d.day}
                    onClick={() => handleSelectDay(d.day)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-zinc-800 flex items-center justify-between text-zinc-300 transition-colors"
                  >
                    <span className="font-medium truncate mr-2">
                      <span className="font-mono text-indigo-400 font-bold mr-1.5">D{d.day}</span>
                      {d.title}
                    </span>
                    <span className="text-[10px] text-zinc-500 shrink-0 font-mono">
                      {d.estimatedMinutes}m
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Global Language Toggle (C++ / Python) */}
          <div className="flex items-center bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
            <button
              onClick={() => setLanguage('cpp')}
              className={`px-2 py-1 text-xs font-mono font-bold rounded-md transition-all ${
                language === 'cpp'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Set active language to C++"
            >
              C++
            </button>
            <button
              onClick={() => setLanguage('python')}
              className={`px-2 py-1 text-xs font-mono font-bold rounded-md transition-all ${
                language === 'python'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
              title="Set active language to Python"
            >
              Python
            </button>
          </div>

          {/* Daily Streak Counter with Flame */}
          <div
            className="flex items-center space-x-1 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-xs font-bold"
            title={`${streak.currentStreak}-Day Streak! Maximum: ${streak.maxStreak} days`}
          >
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{streak.currentStreak}d</span>
          </div>

          {/* Overall Course Completion Badge */}
          <div
            className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-xs font-semibold"
            title={`${solvedCount} of ${totalProblemsCount} problems solved`}
          >
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            <span>{completionPercentage}% Done</span>
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>

          {/* Settings & API Key modal trigger */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`p-1.5 rounded-lg border transition-colors relative ${
              geminiApiKey
                ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
                : 'text-zinc-400 border-zinc-800 hover:bg-zinc-800'
            }`}
            title="Settings & Gemini AI Configuration"
          >
            <Settings className="w-4 h-4" />
            {geminiApiKey && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500" />
            )}
          </button>
        </div>
      </header>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
};
