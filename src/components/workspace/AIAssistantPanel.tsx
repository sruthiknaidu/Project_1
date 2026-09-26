'use client';

import React, { useState } from 'react';
import { Problem, ProgrammingLanguage, SocraticHintResponse, CodeReviewResponse, ChatMessage } from '@/types';
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
  ArrowRight
} from 'lucide-react';

interface AIAssistantPanelProps {
  problem: Problem;
  currentCode: string;
}

export const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({ problem, currentCode }) => {
  const { language, geminiApiKey } = useApp();
  const [activeTab, setActiveTab] = useState<'hints' | 'visualizer' | 'review'>('hints');

  // Hint Drawer State
  const [unlockedLevel, setUnlockedLevel] = useState<number>(0);
  const [hintsList, setHintsList] = useState<SocraticHintResponse[]>([]);
  const [isLoadingHint, setIsLoadingHint] = useState(false);

  // Socratic Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Hello! I'm your Socratic TA for ${problem.title}. I can guide your thinking, clarify C++ vs Python trade-offs, and help you discover the optimal algorithm without spoiling the solution. Ask me anything!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Code Review State
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
      console.error('Failed to get hint', e);
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
      console.error('Chat error', err);
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
        language,
        codeBuffer: currentCode,
        apiKey: geminiApiKey
      });
      setReviewResult(review);
    } catch (e) {
      console.error('Code review error', e);
    } finally {
      setIsLoadingReview(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex items-center px-2 bg-zinc-900/90 border-b border-zinc-800 text-xs font-medium">
        <button
          onClick={() => setActiveTab('hints')}
          className={`flex items-center space-x-1.5 px-3 py-2.5 border-b-2 transition-all ${
            activeTab === 'hints'
              ? 'border-emerald-500 text-emerald-400 font-semibold'
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
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
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
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
              : 'border-transparent text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Complexity Review</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {/* TAB 1: SOCRATIC AI TA & HINTS */}
        {activeTab === 'hints' && (
          <div className="flex flex-col h-full">
            {/* Progressive Hint Drawer */}
            <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Progressive Socratic Hints</span>
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Tiered guidance designed to preserve your interview problem-solving muscle.
                  </p>
                </div>

                {unlockedLevel < 3 ? (
                  <button
                    onClick={handleRequestNextHint}
                    disabled={isLoadingHint}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors shadow-sm"
                  >
                    <Unlock className="w-3 h-3" />
                    <span>{isLoadingHint ? 'Thinking...' : `Unlock Hint ${unlockedLevel + 1}`}</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-emerald-400 font-mono flex items-center space-x-1">
                    <CheckCircle className="w-3 h-3" />
                    <span>All hints unlocked</span>
                  </span>
                )}
              </div>

              {/* Unlocked Hint Cards */}
              {hintsList.length === 0 ? (
                <div className="p-3 rounded-lg border border-dashed border-zinc-800 text-center text-xs text-zinc-500">
                  No hints unlocked yet. Click "Unlock Hint 1" when you want an intuition nudge!
                </div>
              ) : (
                <div className="space-y-2.5 max-h-48 overflow-y-auto custom-scrollbar">
                  {hintsList.map((h, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-zinc-900 border border-emerald-500/20 space-y-1.5 text-xs font-sans animate-fadeIn"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400">
                          Tier {h.hintLevel}: {h.title}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-mono">
                          {h.hintLevel === 1 ? 'Intuition' : h.hintLevel === 2 ? 'Strategy' : 'Scaffolding'}
                        </span>
                      </div>
                      <p className="text-zinc-300 leading-relaxed">{h.explanation}</p>
                      <div className="pt-1 border-t border-zinc-800 text-amber-300/90 flex items-start space-x-1.5 font-medium">
                        <HelpCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span>{h.leadingQuestion}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Socratic Chat Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {chatMessages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2 text-xs ${
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
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-200 rounded-bl-none'
                    }`}
                  >
                    <div>{msg.text}</div>
                    <div className={`text-[9px] mt-1 text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-zinc-500'}`}>
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
                <div className="flex items-center space-x-2 text-xs text-zinc-500">
                  <Bot className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>Socratic TA is thinking...</span>
                </div>
              )}
            </div>

            {/* Socratic Chat Input Box */}
            <form onSubmit={handleSendMessage} className="p-3 bg-zinc-900 border-t border-zinc-800 flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                placeholder="Ask Socratic TA (e.g. Why would a stack be better here?)"
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSendingMessage}
                className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-colors"
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

        {/* TAB 3: COMPLEXITY & CODE REVIEW */}
        {activeTab === 'review' && (
          <div className="h-full overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Automated Big-O & Quality Review
                </h3>
                <p className="text-xs text-zinc-400">
                  Deep analysis of time/space complexity and C++/Python idioms.
                </p>
              </div>

              <button
                onClick={handleAnalyzeComplexity}
                disabled={isLoadingReview}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLoadingReview ? 'Analyzing...' : 'Analyze My Code'}</span>
              </button>
            </div>

            {!reviewResult ? (
              <div className="p-8 rounded-xl border border-dashed border-zinc-800 text-center text-zinc-500 text-xs">
                <BarChart2 className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                Click "Analyze My Code" to evaluate the algorithmic complexity and clean-code quality of your solution.
              </div>
            ) : (
              <div className="space-y-4 animate-fadeIn">
                {/* Big-O Rating Summary */}
                <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-zinc-400 uppercase">Estimated Complexity</span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                        reviewResult.rating === 'Optimal'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : reviewResult.rating === 'Suboptimal'
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      }`}
                    >
                      {reviewResult.rating}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-800">
                    <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                      <div className="text-[11px] text-zinc-500">Time Complexity</div>
                      <div className="text-base font-bold font-mono text-indigo-400">{reviewResult.timeComplexity}</div>
                      <div className="text-[11px] text-zinc-400 mt-1">{reviewResult.timeExplanation}</div>
                    </div>

                    <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                      <div className="text-[11px] text-zinc-500">Space Complexity</div>
                      <div className="text-base font-bold font-mono text-purple-400">{reviewResult.spaceComplexity}</div>
                      <div className="text-[11px] text-zinc-400 mt-1">{reviewResult.spaceExplanation}</div>
                    </div>
                  </div>
                </div>

                {/* Algorithmic Suggestions */}
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Algorithmic Feedback
                  </h4>
                  <ul className="space-y-1 text-xs text-zinc-300">
                    {reviewResult.suggestions.map((s, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Memory & Language Optimization */}
                <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {language.toUpperCase()} Memory & Performance Tips
                  </h4>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {reviewResult.memoryOptimizations.map((tip, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
