'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ProgrammingLanguage, ThemeMode, UserProgress } from '@/types';
import { PROBLEMS_DATA } from '@/data/problems';

interface AppContextType {
  language: ProgrammingLanguage;
  setLanguage: (lang: ProgrammingLanguage) => void;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  solvedProblems: UserProgress['solvedProblems'];
  bookmarkedProblems: string[];
  markProblemSolved: (problemId: string, language: ProgrammingLanguage, minutesSpent?: number) => void;
  toggleBookmark: (problemId: string) => void;
  saveCodeBuffer: (problemId: string, lang: ProgrammingLanguage, code: string) => void;
  getCodeBuffer: (problemId: string, lang: ProgrammingLanguage) => string | undefined;
  saveNotes: (problemId: string, content: string) => void;
  getNotes: (problemId: string) => string;
  streak: UserProgress['streak'];
  dailyActivity: UserProgress['dailyActivity'];
  geminiApiKey: string;
  setGeminiApiKey: (key: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  resetAllProgress: () => void;
  exportData: () => string;
  importData: (jsonStr: string) => boolean;
  completionPercentage: number;
  solvedCount: number;
  totalProblemsCount: number;
  isSolved: (problemId: string) => boolean;
  isBookmarked: (problemId: string) => boolean;
}

const STORAGE_KEY = 'codemap_dsa_state_v1';

// Seed initial realistic activity data for a student so the heat-map and streak start engagingly
const getInitialProgress = (): UserProgress => {
  const today = new Date();
  const getIsoDate = (daysAgo: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  const seedActivity: UserProgress['dailyActivity'] = {};
  // 7 days of consecutive activity to provide a 7-Day streak
  for (let i = 6; i >= 0; i--) {
    const dateStr = getIsoDate(i);
    seedActivity[dateStr] = {
      count: Math.floor(Math.random() * 3) + 1,
      minutes: (Math.floor(Math.random() * 3) + 1) * 35
    };
  }

  return {
    solvedProblems: {
      'two-sum': {
        solvedAt: getIsoDate(6),
        language: 'cpp'
      },
      'best-time-to-buy-and-sell-stock': {
        solvedAt: getIsoDate(4),
        language: 'python'
      }
    },
    bookmarkedProblems: ['two-sum-ii-input-array-is-sorted'],
    codeBuffers: {},
    notes: {
      'two-sum': {
        content: 'Remember that complement checking before inserting prevents the number from matching with its own index.',
        updatedAt: getIsoDate(6)
      }
    },
    streak: {
      currentStreak: 7,
      maxStreak: 12,
      lastActiveDate: getIsoDate(0),
      totalActiveDays: 14
    },
    dailyActivity: seedActivity,
    settings: {
      language: 'cpp',
      theme: 'dark',
      geminiApiKey: '',
      fontSize: 14
    }
  };
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<UserProgress>(getInitialProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as UserProgress;
        setProgress(parsed);
      } else {
        const initial = getInitialProgress();
        setProgress(initial);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      }
    } catch (e) {
      console.error('Failed to load progress from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to LocalStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Failed to save progress to localStorage', e);
    }
  }, [progress, isLoaded]);

  // Synchronize theme with HTML document class
  useEffect(() => {
    const root = document.documentElement;
    if (progress.settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [progress.settings.theme]);

  const setLanguage = (language: ProgrammingLanguage) => {
    setProgress(prev => ({
      ...prev,
      settings: { ...prev.settings, language }
    }));
  };

  const setTheme = (theme: ThemeMode) => {
    setProgress(prev => ({
      ...prev,
      settings: { ...prev.settings, theme }
    }));
  };

  const setGeminiApiKey = (geminiApiKey: string) => {
    setProgress(prev => ({
      ...prev,
      settings: { ...prev.settings, geminiApiKey }
    }));
  };

  const setFontSize = (fontSize: number) => {
    setProgress(prev => ({
      ...prev,
      settings: { ...prev.settings, fontSize }
    }));
  };

  const markProblemSolved = (problemId: string, lang: ProgrammingLanguage, minutesSpent = 30) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    setProgress(prev => {
      const alreadySolved = !!prev.solvedProblems[problemId];
      const newSolved = {
        ...prev.solvedProblems,
        [problemId]: {
          solvedAt: todayStr,
          language: lang
        }
      };

      // Activity logging
      const todayActivity = prev.dailyActivity[todayStr] || { count: 0, minutes: 0 };
      const newDailyActivity = {
        ...prev.dailyActivity,
        [todayStr]: {
          count: todayActivity.count + (alreadySolved ? 0 : 1),
          minutes: todayActivity.minutes + minutesSpent
        }
      };

      // Streak calculation
      let { currentStreak, maxStreak, lastActiveDate, totalActiveDays } = prev.streak;
      if (lastActiveDate !== todayStr) {
        if (lastActiveDate === yesterdayStr) {
          currentStreak += 1;
        } else if (!lastActiveDate) {
          currentStreak = 1;
        } else {
          currentStreak = 1;
        }
        totalActiveDays += 1;
        lastActiveDate = todayStr;
      }
      if (currentStreak > maxStreak) {
        maxStreak = currentStreak;
      }

      return {
        ...prev,
        solvedProblems: newSolved,
        dailyActivity: newDailyActivity,
        streak: { currentStreak, maxStreak, lastActiveDate, totalActiveDays }
      };
    });
  };

  const toggleBookmark = (problemId: string) => {
    setProgress(prev => {
      const exists = prev.bookmarkedProblems.includes(problemId);
      const newBookmarks = exists
        ? prev.bookmarkedProblems.filter(id => id !== problemId)
        : [...prev.bookmarkedProblems, problemId];
      return { ...prev, bookmarkedProblems: newBookmarks };
    });
  };

  const saveCodeBuffer = (problemId: string, lang: ProgrammingLanguage, code: string) => {
    const key = `${problemId}_${lang}`;
    setProgress(prev => ({
      ...prev,
      codeBuffers: {
        ...prev.codeBuffers,
        [key]: code
      }
    }));
  };

  const getCodeBuffer = (problemId: string, lang: ProgrammingLanguage): string | undefined => {
    return progress.codeBuffers[`${problemId}_${lang}`];
  };

  const saveNotes = (problemId: string, content: string) => {
    const todayStr = new Date().toISOString();
    setProgress(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [problemId]: { content, updatedAt: todayStr }
      }
    }));
  };

  const getNotes = (problemId: string): string => {
    return progress.notes[problemId]?.content || '';
  };

  const resetAllProgress = () => {
    const fresh = getInitialProgress();
    fresh.solvedProblems = {};
    fresh.streak = { currentStreak: 0, maxStreak: 0, lastActiveDate: '', totalActiveDays: 0 };
    fresh.dailyActivity = {};
    fresh.notes = {};
    fresh.codeBuffers = {};
    fresh.bookmarkedProblems = [];
    setProgress(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  };

  const exportData = (): string => {
    return JSON.stringify(progress, null, 2);
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr) as UserProgress;
      if (parsed.solvedProblems && parsed.streak && parsed.settings) {
        setProgress(parsed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const solvedCount = Object.keys(progress.solvedProblems).length;
  const totalProblemsCount = PROBLEMS_DATA.length;
  const completionPercentage = totalProblemsCount > 0 ? Math.round((solvedCount / totalProblemsCount) * 100) : 0;

  const isSolved = (problemId: string) => !!progress.solvedProblems[problemId];
  const isBookmarked = (problemId: string) => progress.bookmarkedProblems.includes(problemId);

  return (
    <AppContext.Provider
      value={{
        language: progress.settings.language,
        setLanguage,
        theme: progress.settings.theme,
        setTheme,
        solvedProblems: progress.solvedProblems,
        bookmarkedProblems: progress.bookmarkedProblems,
        markProblemSolved,
        toggleBookmark,
        saveCodeBuffer,
        getCodeBuffer,
        saveNotes,
        getNotes,
        streak: progress.streak,
        dailyActivity: progress.dailyActivity,
        geminiApiKey: progress.settings.geminiApiKey,
        setGeminiApiKey,
        fontSize: progress.settings.fontSize,
        setFontSize,
        resetAllProgress,
        exportData,
        importData,
        completionPercentage,
        solvedCount,
        totalProblemsCount,
        isSolved,
        isBookmarked
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
