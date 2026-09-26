'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { ROADMAP_DAYS } from '@/data/roadmap';
import { PROBLEMS_DATA } from '@/data/problems';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Filter,
  Code2,
  Sparkles,
  Bookmark,
  ChevronDown,
  Layers
} from 'lucide-react';

export const RoadmapHub: React.FC = () => {
  const { isSolved, isBookmarked, language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'solved' | 'unsolved' | 'bookmarked'>('all');
  const [expandedDay, setExpandedDay] = useState<number | null>(1); // Day 1 expanded by default

  const phases = [
    { num: 1, title: 'Phase 1: Foundations & Linear Memory (Days 1-7)' },
    { num: 2, title: 'Phase 2: Sequential & Non-Linear Access (Days 8-14)' },
    { num: 3, title: 'Phase 3: Recursive & Graph Exploration (Days 15-20)' },
    { num: 4, title: 'Phase 4: Dynamic Programming & Capstone (Days 21-30)' }
  ];

  const filteredDays = ROADMAP_DAYS.filter(day => {
    // Phase filter
    if (selectedPhase !== 'all' && day.phaseNumber !== selectedPhase) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesTitle = day.title.toLowerCase().includes(q);
      const matchesSummary = day.summary.toLowerCase().includes(q);
      const matchesConcepts = day.coreConcepts.some(c => c.toLowerCase().includes(q));
      if (!matchesTitle && !matchesSummary && !matchesConcepts) {
        return false;
      }
    }

    // Status filter
    if (statusFilter === 'solved') {
      const allSolved = day.problemIds.length > 0 && day.problemIds.every(id => isSolved(id));
      if (!allSolved) return false;
    } else if (statusFilter === 'unsolved') {
      const hasUnsolved = day.problemIds.some(id => !isSolved(id));
      if (!hasUnsolved) return false;
    } else if (statusFilter === 'bookmarked') {
      const hasBookmarked = day.problemIds.some(id => isBookmarked(id));
      if (!hasBookmarked) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search concepts, topics (e.g. DP, Two Pointers)..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 placeholder:text-zinc-500"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto text-xs">
            {(['all', 'unsolved', 'solved', 'bookmarked'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Phase Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-zinc-800/80 text-xs">
          <button
            onClick={() => setSelectedPhase('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              selectedPhase === 'all'
                ? 'bg-zinc-800 text-white border border-zinc-700'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            All Phases (1-4)
          </button>
          {phases.map(p => (
            <button
              key={p.num}
              onClick={() => setSelectedPhase(p.num)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                selectedPhase === p.num
                  ? 'bg-zinc-800 text-indigo-400 border border-indigo-500/40 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Phase {p.num}
            </button>
          ))}
        </div>
      </div>

      {/* Structured Timeline Day Cards */}
      <div className="space-y-4">
        {filteredDays.length === 0 ? (
          <div className="p-12 text-center bg-zinc-900/40 rounded-2xl border border-zinc-800 text-zinc-500 text-sm">
            No roadmap days match your search and filter criteria.
          </div>
        ) : (
          filteredDays.map(day => {
            const isExpanded = expandedDay === day.day;
            const problems = day.problemIds.map(id => PROBLEMS_DATA.find(p => p.id === id)).filter(Boolean);
            const allSolved = problems.length > 0 && problems.every(p => p && isSolved(p.id));

            return (
              <div
                key={day.day}
                id={`day-${day.day}`}
                className={`bg-zinc-900/70 border rounded-2xl transition-all duration-200 overflow-hidden shadow-md ${
                  allSolved ? 'border-emerald-500/30' : 'border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Header Row */}
                <div
                  onClick={() => setExpandedDay(isExpanded ? null : day.day)}
                  className="p-5 flex items-start justify-between cursor-pointer select-none group"
                >
                  <div className="flex items-start space-x-4">
                    {/* Day Number Box */}
                    <div
                      className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono font-bold shrink-0 transition-transform group-hover:scale-105 ${
                        allSolved
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                          : 'bg-zinc-950 text-indigo-400 border border-zinc-800'
                      }`}
                    >
                      <span className="text-[10px] text-zinc-500 uppercase leading-none">Day</span>
                      <span className="text-lg leading-tight">{day.day}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400 font-mono">
                          Phase {day.phaseNumber}
                        </span>
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {day.title}
                        </h3>
                        {allSolved && (
                          <span className="flex items-center space-x-1 text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Completed</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                        {day.summary}
                      </p>
                    </div>
                  </div>

                  {/* Right: Est Time & Chevron */}
                  <div className="flex items-center space-x-3 shrink-0 ml-4">
                    <span className="hidden sm:flex items-center space-x-1 text-xs text-zinc-500 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{day.estimatedMinutes}m</span>
                    </span>
                    <div className="p-1 rounded-lg text-zinc-400 group-hover:text-white transition-colors">
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-indigo-400' : ''
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-zinc-800/80 space-y-4 animate-fadeIn">
                    {/* Core Concepts Badges */}
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                        Core Conceptual Competencies
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {day.coreConcepts.map((concept, cIdx) => (
                          <span
                            key={cIdx}
                            className="text-xs px-2.5 py-1 rounded-lg bg-zinc-950 text-zinc-300 border border-zinc-800 font-mono"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Key C++ vs Python Differences */}
                    <div className="bg-zinc-950/70 p-3.5 rounded-xl border border-zinc-800/80 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5 font-bold text-blue-400 font-mono">
                          <Code2 className="w-3.5 h-3.5" />
                          <span>C++ Mechanics</span>
                        </div>
                        <p className="text-zinc-400 leading-relaxed">
                          {day.languageHighlights.cpp}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center space-x-1.5 font-bold text-amber-400 font-mono">
                          <Code2 className="w-3.5 h-3.5" />
                          <span>Python Mechanics</span>
                        </div>
                        <p className="text-zinc-400 leading-relaxed">
                          {day.languageHighlights.python}
                        </p>
                      </div>
                    </div>

                    {/* Associated Practice Problems */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        Practice Challenges for Day {day.day}
                      </span>

                      <div className="space-y-2">
                        {problems.map(prob => {
                          if (!prob) return null;
                          const probSolved = isSolved(prob.id);
                          const probBookmarked = isBookmarked(prob.id);

                          return (
                            <div
                              key={prob.id}
                              className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                    probSolved
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : 'bg-zinc-800 text-zinc-600'
                                  }`}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </div>

                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-bold text-sm text-zinc-200">
                                      {prob.title}
                                    </span>
                                    <span
                                      className={`text-[10px] px-2 py-0.2 rounded-full font-semibold border ${
                                        prob.difficulty === 'Easy'
                                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                                          : prob.difficulty === 'Medium'
                                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                                          : 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                                      }`}
                                    >
                                      {prob.difficulty}
                                    </span>
                                    {probBookmarked && (
                                      <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                    )}
                                  </div>
                                  <span className="text-[11px] text-zinc-500">
                                    Target: {prob.bigOTarget.time} Time | {prob.bigOTarget.space} Space
                                  </span>
                                </div>
                              </div>

                              <Link
                                href={`/workspace/${prob.id}`}
                                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-sm transition-colors"
                              >
                                <span>{probSolved ? 'Practice Again' : 'Solve Challenge'}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
