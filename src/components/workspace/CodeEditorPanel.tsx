'use client';

import React, { useState, useEffect } from 'react';
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
  Check,
  XCircle,
  Clock,
  Sparkles,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  Flame,
  Code
} from 'lucide-react';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-[#0f172a] text-zinc-500 font-mono text-xs">
      Loading Monaco Editor...
    </div>
  )
});

interface CodeEditorPanelProps {
  problem: Problem;
  onCodeChange?: (code: string) => void;
  onSuccessfulExecution?: (code: string) => void;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  problem,
  onCodeChange,
  onSuccessfulExecution
}) => {
  const {
    language,
    setLanguage,
    theme,
    getCodeBuffer,
    saveCodeBuffer,
    markProblemSolved,
    fontSize
  } = useApp();

  const [code, setCode] = useState<string>(() => {
    return getCodeBuffer(problem.id, language) || problem.starterCode[language];
  });

  const [consoleOpen, setConsoleOpen] = useState(true);
  const [consoleTab, setConsoleTab] = useState<'tests' | 'custom' | 'terminal'>('tests');
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customInputText, setCustomInputText] = useState('nums = [2, 7, 11, 15], target = 9');
  const [testResults, setTestResults] = useState<TestResultItem[]>([]);
  const [selectedTestCaseIdx, setSelectedTestCaseIdx] = useState(0);
  const [compilerLogs, setCompilerLogs] = useState<string>('Sandboxed x86_64 environment ready. Select "Run Code" or "Submit Solution".');
  const [overallStatus, setOverallStatus] = useState<'Pass' | 'Compile Error' | 'TLE' | 'Wrong Answer' | null>(null);

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

  const runEvaluation = async (isSubmission = false) => {
    if (isSubmission) setIsSubmitting(true);
    else setIsRunning(true);

    setConsoleOpen(true);
    setConsoleTab('tests');

    const result = await executeCodeSimulation({
      problemId: problem.id,
      language,
      code,
      customTestCases: problem.testCases
    });

    setTestResults(result.results);
    setOverallStatus(result.overallStatus);
    setCompilerLogs(result.compileOutput + '\n' + result.runtimeLogs.join('\n'));
    setSelectedTestCaseIdx(0);

    if (isSubmission) setIsSubmitting(false);
    else setIsRunning(false);

    if (result.allPassed) {
      if (isSubmission) {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
        markProblemSolved(problem.id, language, problem.timeEstimateMinutes);
      }
      if (onSuccessfulExecution) {
        onSuccessfulExecution(code);
      }
    }
  };

  // Render status badge conforming to user spec
  const renderStatusBadge = (status: 'Pass' | 'Compile Error' | 'TLE' | 'Wrong Answer') => {
    switch (status) {
      case 'Pass':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shadow-emerald-500/20">
            <Check className="w-3 h-3 stroke-[3]" />
            <span>Pass</span>
          </span>
        );
      case 'Compile Error':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm shadow-rose-500/20">
            <XCircle className="w-3 h-3 stroke-[3]" />
            <span>Compile Error</span>
          </span>
        );
      case 'TLE':
        return (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-sm shadow-amber-500/20">
            <AlertTriangle className="w-3 h-3 stroke-[3]" />
            <span>TLE</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <XCircle className="w-3 h-3" />
            <span>Wrong Answer</span>
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] border-r border-slate-800 overflow-hidden font-sans">
      {/* Top Editor Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-xs">
        {/* Language Selector */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setLanguage('cpp')}
              className={`px-3 py-1 font-mono font-semibold rounded-md transition-all ${
                language === 'cpp'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              C++ 20
            </button>
            <button
              onClick={() => setLanguage('python')}
              className={`px-3 py-1 font-mono font-semibold rounded-md transition-all ${
                language === 'python'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
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
            className="flex items-center space-x-1 px-2.5 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
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
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
            bracketPairColorization: { enabled: true },
            padding: { top: 12, bottom: 12 }
          }}
        />
      </div>

      {/* VS Code-Style Bottom Terminal Console */}
      {consoleOpen && (
        <div className="h-60 bg-[#090d16] border-t border-slate-800 flex flex-col transition-all duration-200 shadow-2xl">
          {/* Terminal Tab Bar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setConsoleTab('tests')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded font-medium transition-colors ${
                  consoleTab === 'tests'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Test Cases</span>
                {overallStatus && renderStatusBadge(overallStatus)}
              </button>

              <button
                onClick={() => setConsoleTab('terminal')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded font-medium transition-colors ${
                  consoleTab === 'terminal'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                <span>Terminal Output</span>
              </button>
            </div>

            <button
              onClick={() => setConsoleOpen(false)}
              className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
              title="Collapse Console"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Terminal Body */}
          <div className="flex-1 overflow-y-auto p-3.5 text-xs font-mono custom-scrollbar">
            {consoleTab === 'tests' && (
              <div className="space-y-3">
                {testResults.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center py-6 space-y-1">
                    <Terminal className="w-6 h-6 text-slate-600 mb-1" />
                    <span>Terminal idle. Click "Run Code" or "Submit Solution" to trigger sandbox tests.</span>
                  </div>
                ) : (
                  <div>
                    {/* Test Case Selection Badges */}
                    <div className="flex items-center gap-2 mb-3 overflow-x-auto pb-1">
                      {testResults.map((tr, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedTestCaseIdx(idx)}
                          className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                            selectedTestCaseIdx === idx
                              ? 'bg-slate-800 text-white border border-slate-700 font-bold'
                              : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800'
                          }`}
                        >
                          {tr.status === 'Pass' && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                          {tr.status === 'Compile Error' && <span className="w-2 h-2 rounded-full bg-rose-500" />}
                          {tr.status === 'TLE' && <span className="w-2 h-2 rounded-full bg-amber-400" />}
                          {tr.status === 'Wrong Answer' && <span className="w-2 h-2 rounded-full bg-rose-500" />}
                          <span>Case {idx + 1}</span>
                        </button>
                      ))}
                    </div>

                    {/* Active Test Case Execution Details */}
                    {testResults[selectedTestCaseIdx] && (
                      <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between text-slate-400 pb-1.5 border-b border-slate-800">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-slate-300">Status:</span>
                            {renderStatusBadge(testResults[selectedTestCaseIdx].status)}
                          </div>
                          <span className="text-slate-500 flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <span>{testResults[selectedTestCaseIdx].executionTimeMs} ms</span>
                          </span>
                        </div>

                        <div>
                          <div className="text-slate-500 text-[11px] mb-1">Input:</div>
                          <div className="text-slate-200 bg-[#090d16] p-2 rounded-lg border border-slate-800/80">
                            {testResults[selectedTestCaseIdx].input}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="text-slate-500 text-[11px] mb-1">Expected:</div>
                            <div className="text-emerald-300 bg-[#090d16] p-2 rounded-lg border border-emerald-900/30">
                              {testResults[selectedTestCaseIdx].expectedOutput}
                            </div>
                          </div>
                          <div>
                            <div className="text-slate-500 text-[11px] mb-1">Actual Output:</div>
                            <div
                              className={`bg-[#090d16] p-2 rounded-lg border ${
                                testResults[selectedTestCaseIdx].passed
                                  ? 'text-indigo-300 border-indigo-900/30'
                                  : 'text-rose-300 border-rose-900/30'
                              }`}
                            >
                              {testResults[selectedTestCaseIdx].actualOutput}
                            </div>
                          </div>
                        </div>

                        {testResults[selectedTestCaseIdx].error && (
                          <div className="text-rose-400 text-[11px] bg-rose-950/20 p-2 rounded border border-rose-900/30">
                            {testResults[selectedTestCaseIdx].error}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {consoleTab === 'terminal' && (
              <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed text-[11px]">
                {compilerLogs}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Sticky Execution Control Footer Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-t border-slate-800 text-xs">
        <button
          onClick={() => setConsoleOpen(!consoleOpen)}
          className="flex items-center space-x-1.5 text-slate-400 hover:text-slate-200 font-mono"
        >
          <Terminal className="w-3.5 h-3.5 text-slate-400" />
          <span>Terminal Console</span>
          {consoleOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>

        <div className="flex items-center space-x-2">
          {/* Run Code Button */}
          <button
            onClick={() => runEvaluation(false)}
            disabled={isRunning || isSubmitting}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white font-medium rounded-lg border border-slate-700 transition-colors shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isRunning ? 'Running...' : 'Run Code'}</span>
          </button>

          {/* Submit Solution Button */}
          <button
            onClick={() => runEvaluation(true)}
            disabled={isRunning || isSubmitting}
            className="flex items-center space-x-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg transition-all shadow-md shadow-emerald-600/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Evaluating...' : 'Submit Solution'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
