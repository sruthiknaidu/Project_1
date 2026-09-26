'use client';

import React, { use, useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { getProblemById, PROBLEMS_DATA } from '@/data/problems';
import { ProblemDescriptionPanel } from '@/components/workspace/ProblemDescriptionPanel';
import { CodeEditorPanel } from '@/components/workspace/CodeEditorPanel';
import { AIAssistantPanel } from '@/components/workspace/AIAssistantPanel';
import { Navbar } from '@/components/layout/Navbar';
import { ChevronLeft, ChevronRight, PanelLeftClose, PanelRightClose, Maximize2 } from 'lucide-react';

interface WorkspacePageProps {
  params: Promise<{
    problemId: string;
  }>;
}

export default function WorkspacePage({ params }: WorkspacePageProps) {
  const resolvedParams = use(params);
  const problem = getProblemById(resolvedParams.problemId);
  const router = useRouter();

  const [currentCode, setCurrentCode] = useState<string>('');
  const [leftPanelVisible, setLeftPanelVisible] = useState(true);
  const [rightPanelVisible, setRightPanelVisible] = useState(true);

  if (!problem) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Problem Not Found</h2>
          <p className="text-zinc-400 mb-6 text-sm">
            Could not find a problem with ID "{resolvedParams.problemId}".
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-medium text-sm transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Find previous and next problems for quick navigation
  const currentIndex = PROBLEMS_DATA.findIndex(p => p.id === problem.id);
  const prevProblem = currentIndex > 0 ? PROBLEMS_DATA[currentIndex - 1] : null;
  const nextProblem = currentIndex < PROBLEMS_DATA.length - 1 ? PROBLEMS_DATA[currentIndex + 1] : null;

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <Navbar />

      {/* Sub-header Navigation Bar for Workspace */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-zinc-900 border-b border-zinc-800 text-xs">
        <div className="flex items-center space-x-2">
          {prevProblem && (
            <button
              onClick={() => router.push(`/workspace/${prevProblem.id}`)}
              className="flex items-center space-x-1 text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-zinc-800 transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prev: {prevProblem.title}</span>
            </button>
          )}

          <span className="text-zinc-500 font-mono font-bold">
            [{currentIndex + 1} / {PROBLEMS_DATA.length}]
          </span>

          {nextProblem && (
            <button
              onClick={() => router.push(`/workspace/${nextProblem.id}`)}
              className="flex items-center space-x-1 text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-zinc-800 transition-colors"
            >
              <span className="hidden sm:inline">Next: {nextProblem.title}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Panel Visibility Quick Toggles */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setLeftPanelVisible(!leftPanelVisible)}
            className={`p-1.5 rounded transition-colors ${
              leftPanelVisible ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-400'
            }`}
            title={leftPanelVisible ? 'Hide Problem Panel' : 'Show Problem Panel'}
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>

          <button
            onClick={() => setRightPanelVisible(!rightPanelVisible)}
            className={`p-1.5 rounded transition-colors ${
              rightPanelVisible ? 'text-zinc-300 hover:bg-zinc-800' : 'text-zinc-600 hover:text-zinc-400'
            }`}
            title={rightPanelVisible ? 'Hide AI & Visualizer Panel' : 'Show AI & Visualizer Panel'}
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Three-Panel Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* PANEL 1: Left Problem Description & Language Deep Dive */}
        {leftPanelVisible && (
          <div className="w-full md:w-[32%] lg:w-[30%] h-full shrink-0 flex flex-col border-r border-zinc-800">
            <ProblemDescriptionPanel problem={problem} />
          </div>
        )}

        {/* PANEL 2: Center Monaco Editor & Console */}
        <div className="flex-1 h-full flex flex-col min-w-[340px]">
          <CodeEditorPanel
            problem={problem}
            onCodeChange={code => setCurrentCode(code)}
          />
        </div>

        {/* PANEL 3: Right AI Co-Pilot & Memory Debugger */}
        {rightPanelVisible && (
          <div className="w-full md:w-[35%] lg:w-[33%] h-full shrink-0 flex flex-col border-l border-zinc-800">
            <AIAssistantPanel
              problem={problem}
              currentCode={currentCode}
            />
          </div>
        )}
      </div>
    </div>
  );
}
