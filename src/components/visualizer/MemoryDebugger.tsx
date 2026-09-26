'use client';

import React, { useState, useEffect } from 'react';
import { VisualizerStep, ProgrammingLanguage } from '@/types';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Layers, Database, Cpu, ArrowRight } from 'lucide-react';

interface MemoryDebuggerProps {
  steps?: VisualizerStep[];
  defaultLanguage?: ProgrammingLanguage;
}

export const MemoryDebugger: React.FC<MemoryDebuggerProps> = ({
  steps = [],
  defaultLanguage = 'cpp'
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1500); // ms per step
  const [activeModel, setActiveModel] = useState<'cpp' | 'python'>(defaultLanguage);

  useEffect(() => {
    setActiveModel(defaultLanguage);
  }, [defaultLanguage]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && steps.length > 0) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, steps.length, playbackSpeed]);

  if (!steps || steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-zinc-900/60 rounded-xl border border-zinc-800 text-zinc-400">
        <Cpu className="w-10 h-10 mb-3 text-zinc-500 animate-pulse" />
        <p className="font-semibold text-zinc-300">Memory Visualizer</p>
        <p className="text-xs text-zinc-500 mt-1 max-w-xs">
          Interactive memory model visualization will step through execution as you run the algorithm.
        </p>
      </div>
    );
  }

  const currentStep = steps[currentStepIndex] || steps[0];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950 text-zinc-100 rounded-xl border border-zinc-800 overflow-hidden shadow-2xl">
      {/* Top Header & Model Switcher */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/90 border-b border-zinc-800">
        <div className="flex items-center space-x-2">
          <Cpu className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            Memory & Structure Debugger
          </span>
          <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-mono">
            Step {currentStepIndex + 1}/{steps.length}
          </span>
        </div>

        {/* Model Mode Toggle: C++ Memory vs Python Object Graph */}
        <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-800">
          <button
            onClick={() => setActiveModel('cpp')}
            className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeModel === 'cpp'
                ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>C++ Stack/Heap</span>
          </button>
          <button
            onClick={() => setActiveModel('python')}
            className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              activeModel === 'python'
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <span>Python PyObjects</span>
          </button>
        </div>
      </div>

      {/* Step Description Banner */}
      <div className="bg-zinc-900/40 px-4 py-2.5 border-b border-zinc-800/80 text-xs text-zinc-300 font-mono flex items-start space-x-2">
        <span className="text-emerald-400 font-bold shrink-0">[{currentStep.stepIndex}]</span>
        <span>{currentStep.description}</span>
      </div>

      {/* Main Visual Workspace: Data Structure + Memory Model */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        {/* Graphical Data Structure View */}
        <div className="bg-zinc-900/60 p-4 rounded-xl border border-zinc-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Logical Data Structure ({currentStep.dsState.type})</span>
            </span>
          </div>

          {/* Array Visualization with Pointer Markers */}
          {currentStep.dsState.type === 'array' && Array.isArray(currentStep.dsState.data) && (
            <div className="flex flex-col items-center py-2">
              <div className="flex items-end gap-2 overflow-x-auto p-2">
                {currentStep.dsState.data.map((val: any, idx: number) => {
                  const isHighlighted = currentStep.dsState.highlightedIndices?.includes(idx);
                  const matchingPointers = currentStep.dsState.pointers?.filter(p => p.index === idx) || [];

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      {/* Pointer Badges */}
                      <div className="h-6 flex items-center gap-1 mb-1">
                        {matchingPointers.map((p, pIdx) => (
                          <span
                            key={pIdx}
                            style={{ backgroundColor: p.color }}
                            className="text-[10px] font-bold text-white px-1.5 py-0.5 rounded shadow-sm animate-bounce"
                          >
                            {p.name}
                          </span>
                        ))}
                      </div>

                      {/* Array Element Box */}
                      <div
                        className={`w-12 h-12 flex items-center justify-center font-mono font-bold text-sm rounded-lg border transition-all duration-300 ${
                          isHighlighted
                            ? 'bg-indigo-600/30 border-indigo-400 text-indigo-200 shadow-lg shadow-indigo-500/20 scale-105'
                            : 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:border-zinc-500'
                        }`}
                      >
                        {val}
                      </div>

                      {/* Index Label */}
                      <span className="text-[10px] text-zinc-500 font-mono mt-1">
                        [{idx}]
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Linked List Visualization */}
          {currentStep.dsState.type === 'linked-list' && Array.isArray(currentStep.dsState.data) && (
            <div className="flex items-center justify-center py-4 overflow-x-auto">
              {currentStep.dsState.data.map((val: any, idx: number) => {
                const pointersAtNode = currentStep.dsState.pointers?.filter(p => p.index === idx) || [];
                return (
                  <div key={idx} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className="h-5 flex items-center gap-1 mb-1">
                        {pointersAtNode.map((p, pIdx) => (
                          <span
                            key={pIdx}
                            style={{ backgroundColor: p.color }}
                            className="text-[9px] font-bold text-white px-1 py-0.2 rounded"
                          >
                            {p.name}
                          </span>
                        ))}
                      </div>
                      <div className="flex rounded-lg border border-zinc-700 overflow-hidden bg-zinc-900">
                        <div className="px-3 py-2 font-mono text-sm font-bold text-emerald-400 bg-zinc-800/80">
                          {val}
                        </div>
                        <div className="px-2 py-2 text-[10px] font-mono text-zinc-400 flex items-center justify-center border-l border-zinc-700">
                          next•
                        </div>
                      </div>
                    </div>
                    {idx < currentStep.dsState.data.length - 1 && (
                      <ArrowRight className="w-5 h-5 mx-2 text-zinc-500 shrink-0" />
                    )}
                  </div>
                );
              })}
              <ArrowRight className="w-5 h-5 mx-2 text-zinc-600 shrink-0" />
              <span className="text-xs font-mono text-zinc-500 italic">nullptr</span>
            </div>
          )}
        </div>

        {/* C++ MEMORY MODEL: Stack vs Heap */}
        {activeModel === 'cpp' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* C++ Stack Frames */}
            <div className="bg-zinc-900/40 p-3.5 rounded-xl border border-blue-900/30">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  Call Stack (Automatic Storage)
                </h4>
              </div>

              <div className="space-y-3">
                {currentStep.cppMemory.stackFrames.map((frame, fIdx) => (
                  <div key={fIdx} className="bg-zinc-950/80 rounded-lg p-2.5 border border-zinc-800">
                    <div className="text-[11px] font-mono font-bold text-zinc-400 border-b border-zinc-800 pb-1 mb-2">
                      Frame: {frame.functionName}
                    </div>
                    <div className="space-y-1.5 font-mono text-xs">
                      {frame.variables.map((v, vIdx) => (
                        <div
                          key={vIdx}
                          className="flex items-center justify-between bg-zinc-900/80 px-2 py-1 rounded text-[11px]"
                        >
                          <div className="flex items-center space-x-1.5">
                            <span className="text-zinc-500 text-[10px]">{v.address}</span>
                            <span className="text-blue-400">{v.type}</span>
                            <span className="text-zinc-200 font-semibold">{v.name}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-emerald-400">
                            <span>= {v.value}</span>
                            {v.pointsTo && (
                              <span className="text-[10px] text-amber-400 font-mono">
                                ➔ {v.pointsTo}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* C++ Dynamic Heap Memory */}
            <div className="bg-zinc-900/40 p-3.5 rounded-xl border border-purple-900/30">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
                  Heap Storage (Dynamic Allocations)
                </h4>
              </div>

              {currentStep.cppMemory.heapBlocks.length === 0 ? (
                <div className="text-center py-6 text-zinc-500 text-xs italic font-mono">
                  No active heap allocations in this step.
                </div>
              ) : (
                <div className="space-y-2">
                  {currentStep.cppMemory.heapBlocks.map((block, bIdx) => (
                    <div
                      key={bIdx}
                      className="bg-zinc-950/80 rounded-lg p-2.5 border border-purple-500/20 text-xs font-mono"
                    >
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-1 border-b border-zinc-800">
                        <span className="text-purple-400 font-bold">{block.address}</span>
                        <span className="text-zinc-500">{block.type} ({block.size})</span>
                      </div>
                      <div className="mt-1.5 text-zinc-300 text-[11px] break-all">
                        {typeof block.data === 'string' ? block.data : JSON.stringify(block.data)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PYTHON MEMORY MODEL: Namespaces & PyObject References */}
        {activeModel === 'python' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Python Namespaces */}
            <div className="bg-zinc-900/40 p-3.5 rounded-xl border border-amber-900/30">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Namespace Bindings (Variables)
                </h4>
              </div>

              <div className="space-y-2">
                {currentStep.pythonMemory.namespaces.map((ns, nsIdx) => (
                  <div key={nsIdx} className="bg-zinc-950/80 rounded-lg p-2.5 border border-zinc-800">
                    <div className="text-[11px] font-mono font-bold text-zinc-400 border-b border-zinc-800 pb-1 mb-2">
                      Scope: {ns.scope}
                    </div>
                    <div className="space-y-1 font-mono text-xs">
                      {ns.bindings.map((b, bIdx) => (
                        <div
                          key={bIdx}
                          className="flex items-center justify-between bg-zinc-900/80 px-2 py-1 rounded text-[11px]"
                        >
                          <span className="text-amber-300 font-bold">{b.variableName}</span>
                          <span className="text-zinc-400 flex items-center space-x-1">
                            <span>➔</span>
                            <span className="text-cyan-400 font-mono text-[10px]">
                              {b.targetObjectId}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PyObject Heap */}
            <div className="bg-zinc-900/40 p-3.5 rounded-xl border border-cyan-900/30">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                  PyObject Heap (Objects & RefCounts)
                </h4>
              </div>

              <div className="space-y-2">
                {currentStep.pythonMemory.objects.map((obj, oIdx) => (
                  <div
                    key={oIdx}
                    className="bg-zinc-950/80 rounded-lg p-2.5 border border-cyan-500/20 text-xs font-mono"
                  >
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 pb-1 border-b border-zinc-800">
                      <span className="text-cyan-400 font-bold">{obj.id}</span>
                      <span className="text-emerald-400 text-[10px]">
                        ob_refcnt: {obj.refCount} | type: {obj.type}
                      </span>
                    </div>
                    <div className="mt-1 text-zinc-200 text-[11px]">
                      val: {Array.isArray(obj.value) ? `[${obj.value.join(', ')}]` : obj.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Playback Control Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/90 border-t border-zinc-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 transition-colors"
            title="Step Back"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow-lg shadow-emerald-600/30"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>

          <button
            onClick={handleNext}
            disabled={currentStepIndex === steps.length - 1}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-300 transition-colors"
            title="Step Forward"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Step Slider */}
        <div className="flex items-center space-x-3 flex-1 max-w-xs mx-4">
          <input
            type="range"
            min={0}
            max={steps.length - 1}
            value={currentStepIndex}
            onChange={e => setCurrentStepIndex(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        {/* Playback speed selector */}
        <div className="flex items-center space-x-1 text-xs">
          <span className="text-zinc-500 text-[11px] mr-1">Speed:</span>
          {[2000, 1200, 600].map((speed, sIdx) => {
            const label = sIdx === 0 ? '0.5x' : sIdx === 1 ? '1x' : '2x';
            return (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                  playbackSpeed === speed
                    ? 'bg-zinc-700 text-emerald-400'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
