'use client';

import React, { useState } from 'react';
import {
  Problem,
  ProgrammingLanguage,
  SocraticHintResponse,
  CodeReviewResponse,
  ChatMessage
} from '@/types';
import { useApp } from '@/context/AppContext';
import { MemoryDebugger } from '@/components/visualizer/MemoryDebugger';
import { getSocraticHint, getCodeReview, chatWithSocraticTA } from '@/lib/gemini';
import {
  Lightbulb,
  Cpu,
  BarChart2,
  Send,
  Sparkles,
  Lock,
  Unlock,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  Bot,
  User,
  ArrowRight,
  ShieldCheck,
  Code2
} from 'lucide-react';

interface AIAssistantPanelProps {
  problem: Problem;
  currentCode: string;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ problem, currentCode }) => {
  const { language, geminiApiKey } = useApp();
  const [activeTab, setActiveTab] = useState<'hints' | 'visualizer' | 'review'>('hints');

  // Hint Drawer State (AI Feature 2)
  const [unlockedLevel, setUnlockedLevel] = useState<number>(0);
  const [hintsList, setHintsList] = useState<SocraticHintResponse[]>([]);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  // Socratic Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Welcome! I'm your Socratic TA for "${problem.title}". I'll guide your algorithm design without spoiling full code solutions. Ask me about pointer logic, time trade-offs, or C++ vs Python idioms!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Code Review State (AI Feature 3)
  const [reviewResult, setReviewResult] = useState<CodeReviewResponse | null>(null);
  const [isLoadingReview, setIsLoadingReview] = useState(false);

  const handleRequestNextHint = async () => {
    const nextLevel = (unlockedLevel + 1) as 1 | 2 | 3;
    if (nextLevel > 3) return;

    setIsLoadingHint(true);
    try {
      const hint = await getSocraticHint({
        problemId: problem.id,
        problemTitle: problem.title,
        problemDescription: problem.description,
        language,
        codeBuffer: currentCode,
        hintLevel: nextLevel,
        apiKey: geminiApiKey
      });

      setHintsList(prev => [...prev, hint]);
      setUnlockedLevel(nextLevel);
    } catch (e) {
      console.error('Failed to get Socratic hint', e);
    } finally {
      setIsLoadingHint(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSendingMessage) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsSendingMessage(true);

    try {
      const reply = await chatWithSocraticTA({
        problemTitle: problem.title,
        problemDescription: problem.description,
        language,
        codeBuffer: currentCode,
        message: userText,
        history: chatMessages.slice(-4),
        apiKey: geminiApiKey
      });

      const aiMsg: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Socratic chat error', err);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const handleAnalyzeComplexity = async () => {
    setIsLoadingReview(true);
    try {
      const review = await getCodeReview({
        problemId: problem.id,
        problemTitle: problem.title,
        problemDescription: problem.description,
        constraints: problem.constraints,
        language,
        codeBuffer: currentCode,
        apiKey: geminiApiKey
      });
      setReviewResult(review);
    } catch (e) {
      console.error('Complexity review error', e);
    } finally {
      setIsLoadingReview(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-100 overflow-hidden font-sans">
      {/* Tab Navigation */}
      <div className="flex items-center px-2 bg-slate-900/90 border-b border-slate-800 text-xs font-medium">
        <button
          onClick={() => setActiveTab('hints')}
          className={`flex items-center space-x-1.5 px-3 py-2.5 border-b-2 transition-all ${
            activeTab === 'hints'
              ? 'border-emerald-500 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Socratic TA & Hints</span>
        </button>

        <button
          onClick={() => setActiveTab('visualizer')}
          className={`flex items-center space-x-1.5 px-3 py-2.5 border-b-2 transition-all ${
            activeTab === 'visualizer'
              ? 'border-emerald-500 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          <span>Memory Debugger</span>
        </button>

        <button
          onClick={() => setActiveTab('review')}
          className={`flex items-center space-x-1.5 px-3 py-2.5 border-b-2 transition-all ${
            activeTab === 'review'
              ? 'border-emerald-500 text-emerald-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Complexity Review</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {/* TAB 1: SOCRATIC AI TA & HINTS (AI Feature 2) */}
        {activeTab === 'hints' && (
          <div className="flex flex-col h-full">
            {/* Progressive Hint Drawer */}
            <div className="p-4 border-b border-slate-800/80 bg-slate-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Socratic Progressive Hint Engine</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Scaffolding support designed to build problem-solving intuition without revealing full code.
                  </p>
                </div>

                {unlockedLevel < 3 ? (
                  <button
                    onClick={handleRequestNextHint}
                    disabled={isLoadingHint}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-sm shadow-emerald-600/30"
                  >
                    <Unlock className="w-3 h-3" />
                    <span>{isLoadingHint ? 'Generating...' : `Unlock Tier ${unlockedLevel + 1}`}</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-400 font-mono flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>All 3 tiers unlocked</span>
                  </span>
                )}
              </div>

              {/* Unlocked Hint Cards */}
              {hintsList.length === 0 ? (
                <div className="p-3.5 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-500">
                  No hints unlocked yet. Click "Unlock Tier 1" for conceptual intuition.
                </div>
              ) : (
                <div className="space-y-2.5 max-h-52 overflow-y-auto custom-scrollbar">
                  {hintsList.map((h, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/20 space-y-2 text-xs font-sans animate-fadeIn shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400 font-mono text-[11px]">
                          [Tier {h.hintLevel}] {h.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono uppercase">
                          {h.hintLevel === 1 ? 'Intuition' : h.hintLevel === 2 ? 'Strategy' : 'Syntax Scaffolding'}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed text-xs">{h.explanation}</p>
                      <div className="pt-1.5 border-t border-slate-800 text-amber-300/95 flex items-start space-x-1.5 font-medium text-xs">
                        <HelpCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                        <span>{h.leadingQuestion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Socratic Chat Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar text-xs">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5 text-emerald-300">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-3 rounded-xl leading-relaxed whitespace-pre-wrap ${
                      msg.sender === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    <div>{msg.text}</div>
                    <div className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {msg.timestamp}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-indigo-600/40 border border-indigo-400/40 flex items-center justify-center shrink-0 mt-0.5 text-indigo-200">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isSendingMessage && (
                <div className="flex items-center space-x-2 text-xs text-slate-500">
                  <Bot className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Socratic TA is thinking...</span>
                </div>
              )}
            </div>

            {/* Socratic Chat Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Ask Socratic TA a guiding question..."
                className="flex-1 bg-[#090d16] border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSendingMessage}
                className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: MEMORY DEBUGGER */}
        {activeTab === 'visualizer' && (
          <div className="h-full p-2">
            <MemoryDebugger
              steps={problem.visualizerSteps || []}
              defaultLanguage={language}
            />
          </div>
        )}

        {/* TAB 3: AUTOMATED COMPLEXITY & CODE REVIEW (AI Feature 3) */}
        {activeTab === 'review' && (
          <div className="h-full overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                  <BarChart2 className="w-4 h-4 text-indigo-400" />
                  <span>Automated Complexity & Code Reviewer</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Evaluates Big O asymptotic complexity, memory bounds, and language idioms.
                </p>
              </div>

              <button
                onClick={handleAnalyzeComplexity}
                disabled={isLoadingReview}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-indigo-600/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLoadingReview ? 'Analyzing...' : 'Analyze Code'}</span>
              </button>
            </div>

            {!reviewResult ? (
              <div className="p-8 rounded-2xl border border-dashed border-slate-800 text-center text-slate-500 text-xs space-y-2">
                <BarChart2 className="w-8 h-8 mx-auto text-slate-600" />
                <p>Click "Analyze Code" to generate Big O analysis and language-specific best practices.</p>
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                {/* Result Card Matching Feature 3 Output Structure */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 uppercase">Complexity Profile</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                        reviewResult.passesConstraints
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      }`}
                    >
                      {reviewResult.passesConstraints ? 'Passes Constraints ✓' : 'Exceeds Constraints ✗'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                    <div className="bg-[#090d16] p-3 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase font-mono">Time Complexity</div>
                      <div className="text-lg font-black font-mono text-indigo-400 mt-0.5">
                        {reviewResult.timeComplexity}
                      </div>
                    </div>

                    <div className="bg-[#090d16] p-3 rounded-lg border border-slate-800">
                      <div className="text-[10px] text-slate-500 uppercase font-mono">Space Complexity</div>
                      <div className="text-lg font-black font-mono text-purple-400 mt-0.5">
                        {reviewResult.spaceComplexity}
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800 text-xs text-slate-300">
                    <span className="font-bold text-white">Summary: </span>
                    {reviewResult.summary}
                  </div>
                </div>

                {/* C++ Specific Best Practice Tips */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-blue-900/30 space-y-1.5 text-xs">
                  <div className="flex items-center space-x-1.5 text-blue-400 font-bold uppercase tracking-wider text-[11px]">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>C++ Best Practice Tips</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {reviewResult.cPlusPlusTips}
                  </p>
                </div>

                {/* Python Specific Best Practice Tips */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-amber-900/30 space-y-1.5 text-xs">
                  <div className="flex items-center space-x-1.5 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                    <Code2 className="w-3.5 h-3.5" />
                    <span>Python Best Practice Tips</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {reviewResult.pythonTips}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
