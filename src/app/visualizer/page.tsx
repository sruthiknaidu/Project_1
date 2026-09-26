'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { MemoryDebugger } from '@/components/visualizer/MemoryDebugger';
import { PROBLEMS_DATA } from '@/data/problems';
import { VisualizerStep, ProgrammingLanguage } from '@/types';
import {
  Cpu,
  Layers,
  Sparkles,
  Play,
  RotateCcw,
  Code2,
  Database,
  ArrowRight,
  Info
} from 'lucide-react';

export default function VisualizerSandboxPage() {
  const [selectedProblemId, setSelectedProblemId] = useState<string>('two-sum');
  const [selectedLanguage, setSelectedLanguage] = useState<ProgrammingLanguage>('cpp');

  const activeProblem = PROBLEMS_DATA.find(p => p.id === selectedProblemId) || PROBLEMS_DATA[0];
  const steps: VisualizerStep[] = activeProblem.visualizerSteps || [];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5" />
                <span>Interactive Memory Sandbox</span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mt-1">
              C++ Stack/Heap vs. Python Object Graph Debugger
            </h1>
            <p className="text-xs text-zinc-400 max-w-2xl mt-1">
              Observe how data structures are physically organized in memory: raw pointers and contiguous cache lines in C++ vs. heap-allocated PyObjects and reference counts in Python.
            </p>
          </div>

          {/* Scenario Selectors */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-zinc-500 font-semibold">Algorithm:</span>
            <select
              value={selectedProblemId}
              onChange={e => setSelectedProblemId(e.target.value)}
              className="px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 text-xs font-semibold focus:outline-none focus:border-cyan-500"
            >
              {PROBLEMS_DATA.map(p => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Educational Comparison Callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-zinc-900/60 p-4 rounded-2xl border border-blue-900/30 space-y-1.5">
            <div className="flex items-center space-x-2 text-blue-400 font-bold uppercase tracking-wider">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>C++ Memory Architecture</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Variables live on the <strong>Call Stack</strong> (automatic storage) or <strong>Heap</strong> (dynamic storage). <code>std::vector</code> allocates contiguous memory buffers in heap space with an L1 cache hit rate near 100%. Pointers directly store 64-bit virtual memory addresses.
            </p>
          </div>

          <div className="bg-zinc-900/60 p-4 rounded-2xl border border-amber-900/30 space-y-1.5">
            <div className="flex items-center space-x-2 text-amber-400 font-bold uppercase tracking-wider">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Python PyObject Architecture</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              Every variable is a reference/pointer to a <code>PyObject</code> struct on the heap containing an <code>ob_refcnt</code> (reference count) and <code>ob_type</code> pointer. A Python list is an array of pointers to individual objects.
            </p>
          </div>
        </div>

        {/* Main Debugger Canvas */}
        <div className="h-[580px] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
          <MemoryDebugger
            steps={steps}
            defaultLanguage={selectedLanguage}
          />
        </div>
      </main>
    </div>
  );
}
