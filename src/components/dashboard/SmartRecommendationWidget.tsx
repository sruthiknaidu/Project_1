'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { PROBLEMS_DATA } from '@/data/problems';
import { SmartRecommendationResponse } from '@/types';
import { getSmartDailyRecommendation } from '@/lib/gemini';
import {
  Sparkles,
  Compass,
  ArrowRight,
  Flame,
  CheckCircle2,
  RefreshCw,
  Target,
  Brain
} from 'lucide-react';

export const SmartRecommendationWidget: React.FC = () => {
  const { solvedProblems, streak, geminiApiKey } = useApp();
  const [recommendation, setRecommendation] = useState<SmartRecommendationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Compute solved problem tags
  const solvedProblemIds = Object.keys(solvedProblems);
  const solvedTags = Array.from(
    new Set(
      solvedProblemIds
        .map(id => PROBLEMS_DATA.find(p => p.id === id)?.category)
        .filter(Boolean) as string[]
    )
  );

  const fetchRecommendation = async () => {
    setIsLoading(true);
    try {
      const result = await getSmartDailyRecommendation({
        solvedTags,
        solvedProblemIds,
        currentStreak: streak.currentStreak,
        apiKey: geminiApiKey
      });
      setRecommendation(result);
    } catch (e) {
      console.error('Failed to get recommendation', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendation();
  }, [solvedProblemIds.length, streak.currentStreak]);

  if (!recommendation && isLoading) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 flex items-center justify-center space-x-2">
        <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
        <span className="text-xs font-mono">Analyzing streak and progress to calculate next optimal topic...</span>
      </div>
    );
  }

  if (!recommendation) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/95 to-indigo-950/30 border border-slate-800 p-6 shadow-xl space-y-4">
      {/* Decorative neon glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1">
                <span>AI Recommendation Engine</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                Feature 4
              </span>
            </div>
            <h3 className="text-base font-black text-white">
              Next Optimal Module: {recommendation.recommendedTopic}
            </h3>
          </div>
        </div>

        <button
          onClick={fetchRecommendation}
          disabled={isLoading}
          className="flex items-center space-x-1 px-2.5 py-1 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          title="Recalculate recommendations"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
          <span className="text-[11px]">Refresh</span>
        </button>
      </div>

      {/* Rationale */}
      <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
        {recommendation.reason}
      </p>

      {/* 2 Target Practice Problems */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
          <Target className="w-3.5 h-3.5 text-indigo-400" />
          <span>Target Practice Challenges</span>
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendation.targetProblems.map(p => {
            const isCompleted = solvedProblemIds.includes(p.id);

            return (
              <div
                key={p.id}
                className="bg-[#090d16] border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 flex flex-col justify-between space-y-3 transition-colors group"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-indigo-400 font-bold">
                      Day {p.day} • {p.category}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.2 rounded-full font-semibold border ${
                        p.difficulty === 'Easy'
                          ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                          : p.difficulty === 'Medium'
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                          : 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                      }`}
                    >
                      {p.difficulty}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {p.reason}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                    {isCompleted ? (
                      <span className="text-emerald-400 flex items-center space-x-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mastered</span>
                      </span>
                    ) : (
                      <span>Unsolved</span>
                    )}
                  </span>

                  <Link
                    href={`/workspace/${p.id}`}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition-all"
                  >
                    <span>Practice Now</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
