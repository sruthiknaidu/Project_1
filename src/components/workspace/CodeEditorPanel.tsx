'use client';

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Problem, ProgrammingLanguage, TestCase, TestResultItem } from '@/types';
import { useApp } from '@/context/AppContext';
import { executeCodeSimulation } from '@/lib/runner';
import confetti from 'canvas-confetti';
import {
  Play,
  CheckCircle2,
  RotateCcw,
  Terminal,
  Maximize2,
  Minimize2,
  Check,
  XCircle,
  Clock,
  Sparkles,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-zinc-950 text-zinc-500 font-mono text-xs">
      Loading Monaco Editor...
    </div>
  )
});

interface CodeEditorPanelProps {
  problem: Problem;
  onCodeChange?: (code: string) => void;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({ problem, onCodeChange }) => {
  const {
    language,
    setLanguage,
    theme,
    getCodeBuffer,
    saveCodeBuffer,
    markProblemSolved,
    fontSize
  } = useApp();

  // Initialize code from LocalStorage or starterCode
  const [code, setCode] = useState<string>(() => {
    return getCodeBuffer(problem.id, language) || problem.starterCode[language];
  });

  const [consoleOpen, setConsoleOpen] = useState(true);
  const [consoleTab, setConsoleTab] = useState<'tests' | 'custom' | 'terminal'>('tests');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customInput, setCustomInput] = useState('nums = [2, 7, 11, 15], target = 9');
  const [testResults, setTestResults] = useState<TestResultItem[]>([]);
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState(0);
  const [compilerLogs, setCompilerLogs] = useState<string>('Ready to compile and run.');
  const [allPassed, setAllPassed] = useState<boolean | null>(null);

  // Sync code buffer when language changes
  useEffect(() => {
    const existing = getCodeBuffer(problem.id, language);
    const initial = existing || problem.starterCode[language];
    setCode(initial);
    if (onCodeChange) onCodeChange(initial);
  }, [language, problem.id]);

  const handleEditorChange = (value: string | undefined) => {
    const updated = value || '';
    setCode(updated);
    saveCodeBuffer(problem.id, language, updated);
    if (onCodeChange) onCodeChange(updated);
  };

  const handleResetCode = () => {
    if (window.confirm('Reset code to initial template? Any unsaved edits will be discarded.')) {
      const initial = problem.starterCode[language];
      setCode(initial);
      saveCodeBuffer(problem.id, language, initial);
      if (onCodeChange) onCodeChange(initial);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setConsoleOpen(true);
    setConsoleTab('tests');

    const result = await executeCodeSimulation({
      problemId: problem.id,
      language,
      code,
      customTestCases: problem.testCases
    });

    setTestResults(result.results);
    setAllPassed(result.allPassed);
    setCompilerLogs(result.compileOutput + '\n' + result.runtimeLogs.join('\n'));
    setSelectedTestCaseIdx(0);
    setIsRunning(false);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setConsoleOpen(true);
    setConsoleTab('tests');

    const result = await executeCodeSimulation({
      problemId: problem.id,
      language,
      code,
      customTestCases: problem.testCases
    });

    setTestResults(result.results);
    setAllPassed(result.allPassed);
    setCompilerLogs(result.compileOutput + '\n' + result.runtimeLogs.join('\n'));
    setSelectedTestCaseIdx(0);
    setIsSubmitting(false);

    if (result.allPassed) {
      // Fire celebration confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      markProblemSolved(problem.id, language, problem.timeEstimateMinutes);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 border-r border-zinc-800 overflow-hidden">
      {/* Top Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/90 border-b border-zinc-800 text-xs">
        {/* Language Selector */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            <button
              onClick={() => setLanguage('cpp')}
              className={`px-2.5 py-1 font-mono font-semibold rounded-md transition-all ${
                language === 'cpp'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              C++ 20
            </button>
            <button
              onClick={() => setLanguage('python')}
              className={`px-2.5 py-1 font-mono font-semibold rounded-md transition-all ${
                language === 'python'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Python 3.11
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleResetCode}
            className="flex items-center space-x-1 px-2.5 py-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
            title="Reset code to initial template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Center Monaco Editor Container */}
      <div className="flex-1 relative min-h-[220px]">
        <MonacoEditor
          height="100%"
          language={language === 'cpp' ? 'cpp' : 'python'}
          value={code}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          onChange={handleEditorChange}
          options={{
            fontSize: fontSize || 14,
            lineNumbers: 'on',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            fontFamily: 'var(--font-geist-mono), Courier New, monospace',
            bracketPairColorization: { enabled: true },
            padding: { top: 12, bottom: 12 }
          }}
        />
      </div>

      {/* Collapsible Console / Execution Drawer */}
      {consoleOpen && (
        <div className="h-56 bg-zinc-950 border-t border-zinc-800 flex flex-col transition-all duration-200">
          {/* Console Header / Tabs */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900 border-b border-zinc-800 text-xs">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setConsoleTab('tests')}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded font-medium transition-colors ${
                  consoleTab === 'tests'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Test Cases</span>
                {allPassed !== null && (
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      allPassed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {allPassed ? 'Passed' : 'Failed'}
                  </span>
                )}
              </button>

              <button
                onClick={() => setConsoleTab('terminal')}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded font-medium transition-colors ${
                  consoleTab === 'terminal'
                    ? 'bg-zinc-800 text-white font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                <span>Terminal Output</span>
              </button>
            </div>

            <button
              onClick={() => setConsoleOpen(false)}
              className="p-1 text-zinc-400 hover:text-zinc-200 rounded hover:bg-zinc-800"
              title="Collapse Console"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Console Body */}
          <div className="flex-1 overflow-y-auto p-3 text-xs custom-scrollbar">
            {consoleTab === 'tests' && (
              <div className="space-y-3">
                {testResults.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-zinc-500 font-mono text-center py-6">
                    Click "Run Code" or "Submit Solution" to evaluate test cases.
                  </div>
                ) : (
                  <div>
                    {/* Case Pills */}
                    <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
                      {testResults.map((tr, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedTestCaseIdx(idx)}
                          className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg font-mono text-xs transition-all ${
                            selectedTestCaseIdx === idx
                              ? 'bg-zinc-800 text-white border border-zinc-700 font-bold'
                              : 'bg-zinc-900/80 text-zinc-400 hover:bg-zinc-800'
                          }`}
                        >
                          {tr.passed ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <XCircle className="w-3 h-3 text-rose-400" />
                          )}
                          <span>Case {idx + 1}</span>
                        </button>
                      ))}
                    </div>

                    {/* Selected Test Case Details */}
                    {testResults[selectedTestCaseIdx] && (
                      <div className="bg-zinc-900/70 p-3 rounded-lg border border-zinc-800 space-y-2 font-mono text-xs">
                        <div className="flex items-center justify-between text-zinc-400 pb-1 border-b border-zinc-800/80">
                          <span className="font-bold">
                            Status: {testResults[selectedTestCaseIdx].passed ? (
                              <span className="text-emerald-400">PASSED</span>
                            ) : (
                              <span className="text-rose-400">FAILED</span>
                            )}
                          </span>
                          <span className="text-zinc-500 flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{testResults[selectedTestCaseIdx].executionTimeMs} ms</span>
                          </span>
                        </div>

                        <div>
                          <div className="text-zinc-500 mb-0.5">Input:</div>
                          <div className="text-zinc-200 bg-zinc-950 p-1.5 rounded">
                            {testResults[selectedTestCaseIdx].input}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="text-zinc-500 mb-0.5">Expected:</div>
                            <div className="text-emerald-300 bg-zinc-950 p-1.5 rounded">
                              {testResults[selectedTestCaseIdx].expectedOutput}
                            </div>
                          </div>
                          <div>
                            <div className="text-zinc-500 mb-0.5">Output:</div>
                            <div className={`bg-zinc-950 p-1.5 rounded ${testResults[selectedTestCaseIdx].passed ? 'text-indigo-300' : 'text-rose-300'}`}>
                              {testResults[selectedTestCaseIdx].actualOutput}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {consoleTab === 'terminal' && (
              <pre className="font-mono text-zinc-300 whitespace-pre-wrap leading-relaxed">
                {compilerLogs}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Sticky Execution Control Footer Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-t border-zinc-800 text-xs">
        <button
          onClick={() => setConsoleOpen(!consoleOpen)}
          className="flex items-center space-x-1 text-zinc-400 hover:text-zinc-200 font-mono"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>Console</span>
          {consoleOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center space-x-2">
          {/* Run Code Button */}
          <button
            onClick={handleRun}
            disabled={isRunning || isSubmitting}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white font-medium rounded-lg border border-zinc-700 transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          {/* Submit Solution Button */}
          <button
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg transition-all shadow-md shadow-emerald-600/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Evaluating...' : 'Submit'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
