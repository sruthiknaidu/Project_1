'use client';

import React, { useState } from 'react';
import { Problem, ProgrammingLanguage } from '@/types';
import { useApp } from '@/context/AppContext';
import {
  FileText,
  Code2,
  BookOpen,
  Edit3,
  Bookmark,
  CheckCircle2,
  Clock,
  Zap,
  AlertTriangle,
  Copy,
  Check
} from 'lucide-react';

interface ProblemDescriptionPanelProps {
  problem: Problem;
}

export const ProblemDescriptionPanel: React.FC<ProblemDescriptionPanelProps> = ({ problem }) => {
  const { isSolved, isBookmarked, toggleBookmark, getNotes, saveNotes, language } = useApp();
  const [activeTab, setActiveTab] = useState<'statement' | 'languageDiff' | 'notes' | 'editorial'>('statement');
  const [notesContent, setNotesContent] = useState<string>(() => getNotes(problem.id));
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const solved = isSolved(problem.id);
  const bookmarked = isBookmarked(problem.id);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNotesContent(val);
    saveNotes(problem.id, val);
  };

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const difficultyColors = {
    Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    Hard: 'text-rose-400 bg-rose-500/10 border-rose-500/30'
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 select-text overflow-hidden">
      {/* Top Header / Meta Bar */}
      <div className="px-4 py-3 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400">
            Day {problem.day}
          </span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${difficultyColors[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
          <span className="text-xs text-zinc-400 hidden sm:inline-block">
            {problem.category}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {solved && (
            <span className="flex items-center space-x-1 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Solved</span>
            </span>
          )}

          <button
            onClick={() => toggleBookmark(problem.id)}
            className={`p-1.5 rounded-lg border transition-colors ${
              bookmarked
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                : 'text-zinc-500 hover:text-zinc-300 border-zinc-800 hover:bg-zinc-800'
            }`}
            title={bookmarked ? 'Bookmarked' : 'Add to bookmarks'}
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center px-2 bg-zinc-900/40 border-b border-zinc-800 text-xs font-medium">
        <button
          onClick={() => setActiveTab('statement')}
          className={`flex items-center space-x-1.5 px-3 py-2.5 border-b-2 transition-all ${
            activeTab === 'statement'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Statement</span>
        </button>

        <button
          onClick={() => setActiveTab('languageDiff')}
          className={`flex items-center space-x-1.5 px-3 py-2.5 border-b-2 transition-all ${
            activeTab === 'languageDiff'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>C++ vs Python</span>
        </button>

        <button
          onClick={() => setActiveTab('editorial')}
          className={`flex items-center space-x-1.5 px-3 py-2.5 border-b-2 transition-all ${
            activeTab === 'editorial'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Editorial</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`flex items-center space-x-1.5 px-3 py-2.5 border-b-2 transition-all ${
            activeTab === 'notes'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Notes</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar text-zinc-300 text-sm leading-relaxed">
        {/* TAB 1: Problem Statement */}
        {activeTab === 'statement' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight mb-2">
                {problem.title}
              </h1>
              <div className="flex items-center space-x-4 text-xs text-zinc-400 font-mono">
                <span className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Est: {problem.timeEstimateMinutes} mins</span>
                </span>
                <span className="flex items-center space-x-1 text-indigo-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Target: {problem.bigOTarget.time} Time, {problem.bigOTarget.space} Space</span>
                </span>
              </div>
            </div>

            {/* Description Body */}
            <div className="whitespace-pre-line text-zinc-300 text-sm">
              {problem.description}
            </div>

            {/* Examples */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Examples
              </h3>
              {problem.examples.map((ex, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-900/60 rounded-xl p-3.5 border border-zinc-800 space-y-2 relative group"
                >
                  <button
                    onClick={() => copyToClipboard(ex.input, idx)}
                    className="absolute top-3 right-3 p-1 rounded bg-zinc-800 text-zinc-400 hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Copy input"
                  >
                    {copiedIndex === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <div className="font-mono text-xs">
                    <span className="text-zinc-500">Input: </span>
                    <span className="text-emerald-300">{ex.input}</span>
                  </div>

                  <div className="font-mono text-xs">
                    <span className="text-zinc-500">Output: </span>
                    <span className="text-indigo-300">{ex.output}</span>
                  </div>

                  {ex.explanation && (
                    <div className="text-xs text-zinc-400 pt-1 border-t border-zinc-800/80">
                      <span className="font-semibold text-zinc-300">Explanation: </span>
                      {ex.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Constraints */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Constraints
              </h3>
              <ul className="list-disc list-inside space-y-1 font-mono text-xs text-zinc-400 bg-zinc-900/30 p-3 rounded-lg border border-zinc-800/80">
                {problem.constraints.map((c, idx) => (
                  <li key={idx} className="text-zinc-300">{c}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: Language Deep-Dive (C++ vs Python) */}
        {activeTab === 'languageDiff' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-base font-bold text-white mb-1">
                C++ STL vs. Python Internals
              </h2>
              <p className="text-xs text-zinc-400">
                Understanding how compiler memory allocation, hardware cache lines, and built-in standard libraries differ.
              </p>
            </div>

            {/* Side-by-side Explanations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-zinc-900/50 p-3.5 rounded-xl border border-blue-900/30">
                <div className="flex items-center space-x-2 mb-2 font-bold text-blue-400 text-xs uppercase tracking-wider">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>C++ Implementation Mechanics</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {problem.languageComparison.cppExplanation}
                </p>
              </div>

              <div className="bg-zinc-900/50 p-3.5 rounded-xl border border-amber-900/30">
                <div className="flex items-center space-x-2 mb-2 font-bold text-amber-400 text-xs uppercase tracking-wider">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Python Implementation Mechanics</span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {problem.languageComparison.pythonExplanation}
                </p>
              </div>
            </div>

            {/* Memory & Cache Deep Dive */}
            <div className="bg-zinc-900/70 p-4 rounded-xl border border-purple-900/30">
              <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <span>Memory Footprint & Cache Locality Comparison</span>
              </h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {problem.languageComparison.memoryComparison}
              </p>
            </div>

            {/* Key STL vs Builtin Comparison Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                STL vs. Python Builtins
              </h4>
              <div className="overflow-x-auto rounded-lg border border-zinc-800">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-zinc-900 text-zinc-400 border-b border-zinc-800">
                    <tr>
                      <th className="p-2.5">Feature</th>
                      <th className="p-2.5 text-blue-400">C++</th>
                      <th className="p-2.5 text-amber-400">Python</th>
                      <th className="p-2.5 text-zinc-400">Complexity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 bg-zinc-950">
                    {problem.languageComparison.keyStlVsBuiltin.map((row, idx) => (
                      <tr key={idx} className="hover:bg-zinc-900/40">
                        <td className="p-2.5 font-sans font-semibold text-zinc-300">{row.feature}</td>
                        <td className="p-2.5 text-blue-300">{row.cpp}</td>
                        <td className="p-2.5 text-amber-300">{row.python}</td>
                        <td className="p-2.5 font-sans text-zinc-400">{row.complexityNotes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Common Pitfalls */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Common Traps & Anti-Patterns</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-zinc-300 bg-rose-950/20 p-3 rounded-lg border border-rose-900/30">
                {problem.languageComparison.pitfalls.map((pitfall, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{pitfall}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 3: Curated Editorial */}
        {activeTab === 'editorial' && (
          <div className="space-y-5">
            <div>
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold">
                Official Editorial
              </span>
              <h2 className="text-lg font-bold text-white">
                {problem.editorial.approach}
              </h2>
            </div>

            {/* Complexity Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-zinc-900/40 p-3 rounded-xl border border-zinc-800">
              <div>
                <span className="font-bold text-zinc-300">Time Complexity:</span>
                <p className="text-zinc-400 mt-0.5">{problem.editorial.complexityAnalysis.time}</p>
              </div>
              <div>
                <span className="font-bold text-zinc-300">Space Complexity:</span>
                <p className="text-zinc-400 mt-0.5">{problem.editorial.complexityAnalysis.space}</p>
              </div>
            </div>

            {/* C++ Solution */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-400 font-mono">C++ Solution</span>
                <button
                  onClick={() => copyToClipboard(problem.editorial.cppSolution, 100)}
                  className="flex items-center space-x-1 text-zinc-400 hover:text-zinc-200"
                >
                  {copiedIndex === 100 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto">
                <code>{problem.editorial.cppSolution}</code>
              </pre>
            </div>

            {/* Python Solution */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 font-mono">Python Solution</span>
                <button
                  onClick={() => copyToClipboard(problem.editorial.pythonSolution, 101)}
                  className="flex items-center space-x-1 text-zinc-400 hover:text-zinc-200"
                >
                  {copiedIndex === 101 ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>
              <pre className="p-3 bg-zinc-950 rounded-lg border border-zinc-800 font-mono text-xs text-zinc-300 overflow-x-auto">
                <code>{problem.editorial.pythonSolution}</code>
              </pre>
            </div>
          </div>
        )}

        {/* TAB 4: Personal Notes */}
        {activeTab === 'notes' && (
          <div className="space-y-3 h-full flex flex-col">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Personal Solution Notes & Learnings
              </h3>
              <span className="text-[10px] text-emerald-400 font-mono">
                Auto-saved to LocalStorage
              </span>
            </div>
            <textarea
              value={notesContent}
              onChange={handleNotesChange}
              placeholder="Record your algorithmic takeaways, edge case reminders, or interview observations here..."
              className="w-full flex-1 min-h-[300px] p-3.5 bg-zinc-900/60 border border-zinc-800 rounded-xl font-mono text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 custom-scrollbar resize-none"
            />
          </div>
        )}
      </div>
    </div>
  );
};
