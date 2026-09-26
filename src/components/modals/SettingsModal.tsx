'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  X,
  Key,
  Database,
  Trash2,
  Download,
  Upload,
  Check,
  AlertTriangle,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    geminiApiKey,
    setGeminiApiKey,
    fontSize,
    setFontSize,
    resetAllProgress,
    exportData,
    importData
  } = useApp();

  const [inputKey, setInputKey] = useState(geminiApiKey);
  const [importJson, setImportJson] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const [importNotice, setImportNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveApiKey = () => {
    setGeminiApiKey(inputKey.trim());
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleExport = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codemap-dsa-progress-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importJson.trim()) return;
    const success = importData(importJson.trim());
    if (success) {
      setImportNotice('Successfully imported progress data!');
      setImportJson('');
      setTimeout(() => setImportNotice(null), 3000);
    } else {
      setImportNotice('Failed to import: Invalid JSON structure.');
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress, streaks, notes, and code buffers? This cannot be undone.')) {
      resetAllProgress();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-scaleUp">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Platform Settings & AI Key</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar text-xs">
          {/* Gemini API Key Section */}
          <div className="space-y-3 bg-zinc-950/70 p-4 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between">
              <label className="font-bold text-zinc-200 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Gemini API Key</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 text-[11px]"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Power real-time AI code reviews, Socratic hints, and interactive discussions. Your key is stored <strong>locally in your browser LocalStorage</strong> and never transferred to any third-party server.
            </p>

            <div className="flex items-center space-x-2">
              <input
                type="password"
                value={inputKey}
                onChange={e => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors flex items-center space-x-1"
              >
                {savedNotice ? <Check className="w-3.5 h-3.5" /> : <span>Save</span>}
              </button>
            </div>

            {savedNotice && (
              <div className="text-emerald-400 font-medium text-[11px] flex items-center space-x-1">
                <Check className="w-3 h-3" />
                <span>API key saved successfully!</span>
              </div>
            )}

            {!geminiApiKey && (
              <div className="text-zinc-500 text-[10px] italic">
                Tip: If no key is entered, CodeMap DSA seamlessly uses its built-in offline Socratic hint and complexity analysis engine!
              </div>
            )}
          </div>

          {/* Editor Font Size */}
          <div className="space-y-2">
            <label className="font-bold text-zinc-300 uppercase tracking-wider text-[11px]">
              Editor Font Size: {fontSize}px
            </label>
            <input
              type="range"
              min={12}
              max={20}
              value={fontSize}
              onChange={e => setFontSize(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Data Backup & Restore */}
          <div className="space-y-3 bg-zinc-950/70 p-4 rounded-xl border border-zinc-800">
            <h3 className="font-bold text-zinc-200 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              <span>Data Backup & Portability</span>
            </h3>
            <p className="text-zinc-400 text-[11px]">
              Export your progress, notes, solutions, and daily streak as a JSON file, or restore from a backup.
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-zinc-800">
              <textarea
                value={importJson}
                onChange={e => setImportJson(e.target.value)}
                placeholder="Paste backup JSON string to restore..."
                className="w-full h-16 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono text-[10px] focus:outline-none focus:border-indigo-500 resize-none"
              />
              <button
                onClick={handleImport}
                disabled={!importJson.trim()}
                className="w-full py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 transition-colors flex items-center justify-center space-x-1"
              >
                <Upload className="w-3 h-3" />
                <span>Restore Backup</span>
              </button>
              {importNotice && (
                <div className={`text-[11px] ${importNotice.includes('Success') ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {importNotice}
                </div>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="space-y-2 pt-2 border-t border-zinc-800">
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-rose-950/30 hover:bg-rose-950/60 text-rose-400 border border-rose-900/30 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset All Progress & Streaks</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
