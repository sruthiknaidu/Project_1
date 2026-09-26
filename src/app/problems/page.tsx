'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { PROBLEMS_DATA } from '@/data/problems';
import { useApp } from '@/context/AppContext';
import {
  Search,
  BookOpen,
  CheckCircle2,
  Bookmark,
  Clock,
  ArrowRight,
  Filter,
  Zap
} from 'lucide-react';

export default function ProblemsPage() {
  const { isSolved, isBookmarked, toggleBookmark } = useApp();
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = Array.from(new Set(PROBLEMS_DATA.map(p => p.category)));

  const filteredProblems = PROBLEMS_DATA.filter(p => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (selectedDifficulty !== 'all' && p.difficulty !== selectedDifficulty) {
      return false;
    }
    if (selectedCategory !== 'all' && p.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="pb-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Full Practice Problem Catalog</span>
            </span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Core Data Structures & Algorithms Challenges
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Curated problems specifically structured for top tech interview preparation in C++ and Python.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search problem title or topic..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Difficulty Filter */}
            <select
              value={selectedDifficulty}
              onChange={e => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="all">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-zinc-300 focus:outline-none focus:border-indigo-500 font-medium"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Problem Table / Grid */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/90 text-zinc-400 font-mono border-b border-zinc-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Status</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Day</th>
                  <th className="py-3 px-4">Target Complexity</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans">
                {filteredProblems.map(p => {
                  const solved = isSolved(p.id);
                  const bookmarked = isBookmarked(p.id);

                  return (
                    <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors group">
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center">
                          {solved ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-zinc-700" />
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-zinc-200">
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/workspace/${p.id}`}
                            className="hover:text-indigo-400 transition-colors"
                          >
                            {p.title}
                          </Link>
                          <button
                            onClick={() => toggleBookmark(p.id)}
                            className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                              bookmarked ? 'opacity-100 text-amber-400' : 'text-zinc-600 hover:text-zinc-400'
                            }`}
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-zinc-400">
                        {p.category}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                            p.difficulty === 'Easy'
                              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                              : p.difficulty === 'Medium'
                              ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                              : 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                          }`}
                        >
                          {p.difficulty}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-zinc-400">
                        Day {p.day}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-zinc-400">
                        <span className="text-indigo-400">{p.bigOTarget.time}</span> /{' '}
                        <span className="text-purple-400">{p.bigOTarget.space}</span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/workspace/${p.id}`}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-indigo-600 text-zinc-300 hover:text-white font-medium text-xs transition-colors"
                        >
                          <span>Solve</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
