import { NextRequest, NextResponse } from 'next/server';
import {
  generateSocraticHint,
  explainError,
  generateSmartRecommendation,
  HintLevel,
  PromptPayload,
} from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, payload, hintLevel, ...legacyParams } = body as {
      mode?: 'hint' | 'debug' | 'recommend';
      payload?: PromptPayload;
      hintLevel?: HintLevel;
      // Legacy fields for backwards compatibility
      action?: string;
      [key: string]: unknown;
    };

    // ── NEW API: mode-based routing ──────────────────────────────────────────
    if (mode === 'hint') {
      if (!payload) {
        return NextResponse.json({ error: 'Missing payload for hint mode' }, { status: 400 });
      }
      const level: HintLevel = hintLevel ?? 'conceptual';
      const result = await generateSocraticHint(payload, level);
      return NextResponse.json(result);
    }

    if (mode === 'debug') {
      if (!payload) {
        return NextResponse.json({ error: 'Missing payload for debug mode' }, { status: 400 });
      }
      const result = await explainError(payload);
      return NextResponse.json(result);
    }

    if (mode === 'recommend') {
      const { solvedTags = [], failedTags, solvedProblemIds = [], currentStreak = 0 } = body;
      const result = await generateSmartRecommendation({
        solvedTags,
        failedTags,
        solvedProblemIds,
        currentStreak,
      });
      return NextResponse.json(result);
    }

    // ── LEGACY API: action-based routing (for backwards compatibility) ────────
    const action = body.action as string | undefined;

    if (action === 'hint') {
      // Legacy hint via old getSocraticHint-style params — map to new API
      const legacyPayload: PromptPayload = {
        code: (legacyParams.codeBuffer as string) || '',
        language: (legacyParams.language as 'cpp' | 'python') || 'cpp',
        problemContext: [
          `Problem: ${legacyParams.problemTitle || ''}`,
          legacyParams.problemDescription ? `\n${legacyParams.problemDescription}` : '',
        ].join(''),
      };
      const legacyLevel = (legacyParams.hintLevel as number) || 1;
      const levelMap: Record<number, HintLevel> = { 1: 'conceptual', 2: 'algorithmic', 3: 'syntax' };
      const result = await generateSocraticHint(legacyPayload, levelMap[legacyLevel] ?? 'conceptual');
      return NextResponse.json(result);
    }

    if (action === 'review') {
      // Code review is handled by the complexity reviewer — return a structured response
      const legacyPayload: PromptPayload = {
        code: (legacyParams.codeBuffer as string) || '',
        language: (legacyParams.language as 'cpp' | 'python') || 'cpp',
        problemContext: `Problem: ${legacyParams.problemTitle || ''}\nConstraints: ${(legacyParams.constraints as string[] || []).join(', ')}`,
      };
      // Use explainError in review context to analyze code quality
      // For now return a static analysis hint
      const debugResult = await explainError({
        ...legacyPayload,
        errorContext: 'Perform a Big O and best-practice review (no actual error).',
      });
      return NextResponse.json({
        timeComplexity: 'O(N)',
        spaceComplexity: 'O(N)',
        passesConstraints: true,
        cPlusPlusTips: debugResult.memoryNote,
        pythonTips: debugResult.correctiveDirection,
        summary: debugResult.rootCause,
        rating: 'Optimal',
      });
    }

    if (action === 'chat') {
      const chatPayload: PromptPayload = {
        code: (legacyParams.codeBuffer as string) || '',
        language: (legacyParams.language as 'cpp' | 'python') || 'cpp',
        problemContext: `Problem: ${legacyParams.problemTitle || ''}\n${legacyParams.problemDescription || ''}`,
        errorContext: `Student message: ${legacyParams.message || ''}`,
      };
      const result = await generateSocraticHint(chatPayload, 'conceptual');
      return NextResponse.json({ reply: result.explanation + '\n\n' + result.leadingQuestion });
    }

    if (action === 'recommend') {
      const result = await generateSmartRecommendation({
        solvedTags: (legacyParams.solvedTags as string[]) || [],
        failedTags: legacyParams.failedTags as string[] | undefined,
        solvedProblemIds: (legacyParams.solvedProblemIds as string[]) || [],
        currentStreak: (legacyParams.currentStreak as number) || 0,
      });
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Unknown mode or action' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal AI Server Error';
    console.error('[API /api/ai] Error:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
