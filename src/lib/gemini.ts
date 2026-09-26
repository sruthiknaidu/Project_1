import { GoogleGenAI } from '@google/genai';

export type HintLevel = 'conceptual' | 'algorithmic' | 'syntax';

export interface PromptPayload {
  code: string;
  language: 'cpp' | 'python';
  problemContext: string;
  errorContext?: string;
}

const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_PROMPTS = {
  hint: `You are an expert, supportive, and strictly Socratic Computer Science Teaching Assistant. Your goal is to guide students to discover the optimal solution on their own.
CRITICAL RULES:
1. NEVER provide full code blocks, complete functions, or copy-pasteable snippets of the solution.
2. NEVER explicitly name the absolute optimized algorithm in your first response (e.g., do not say "You need to use Tarjan's algorithm"). Guide them to it.
3. If the student asks for code, decline politely and instead offer pseudo-logic or a small 2-3 line example of basic language syntax.
4. Tailor C++ hints to pointers, STL containers, and memory management. Tailor Python hints to idiomatic patterns, list comprehensions, and built-in structures.
5. Always end your response with a thought-provoking leading question that nudges the student toward the next step.`,

  debugger: `You are an expert C++ and Python memory debugger and crash analyst. Your role is to help students understand runtime errors, segmentation faults, and logic bugs.
CRITICAL RULES:
1. Explain the root cause of the error in simple, educational terms.
2. Point to the specific line or pattern causing the issue without rewriting the student's full solution.
3. For C++, explain memory implications (stack overflow, dangling pointers, out-of-bounds access).
4. For Python, explain object references, mutable default arguments, and scope issues.
5. Suggest a corrective direction using pseudocode or a 1-2 line illustrative snippet only.`,
};

const hintLevelMap: Record<HintLevel, number> = {
  conceptual: 1,
  algorithmic: 2,
  syntax: 3,
};

const hintTierLabels: Record<HintLevel, string> = {
  conceptual: 'Conceptual Guidance',
  algorithmic: 'Algorithmic Strategy',
  syntax: 'Syntax Scaffolding',
};

/**
 * Server-side Socratic hint generator.
 * MUST only be called from API routes (server context).
 * NEVER import this function in client components directly.
 */
export async function generateSocraticHint(
  payload: PromptPayload,
  level: HintLevel
): Promise<{ hintLevel: number; title: string; explanation: string; leadingQuestion: string }> {
  const levelNum = hintLevelMap[level];

  if (!ai) {
    // Graceful fallback if GEMINI_API_KEY is not set
    return {
      hintLevel: levelNum,
      title: hintTierLabels[level],
      explanation:
        'Think carefully about the problem constraints. Can you find a data structure that allows O(1) average-time lookups?',
      leadingQuestion:
        level === 'conceptual'
          ? 'What data structure allows fast key lookups in both C++ and Python?'
          : level === 'algorithmic'
          ? 'How can you use a single pass through the array to build and query your auxiliary structure simultaneously?'
          : 'In C++, how does std::unordered_map::find() differ from operator[] for safe lookups?',
    };
  }

  const prompt = `Problem context:
${payload.problemContext}

Language: ${payload.language.toUpperCase()}
Hint Tier: ${levelNum} (1=Conceptual, 2=Algorithmic, 3=Syntax Scaffolding)

Student's current code:
\`\`\`${payload.language}
${payload.code || '// (empty)'}
\`\`\`

Return ONLY a JSON object with this exact shape — no markdown fences:
{
  "hintLevel": ${levelNum},
  "title": "Short tier title",
  "explanation": "Scaffolding guidance without revealing the direct solution or full code",
  "leadingQuestion": "A thought-provoking question guiding the student to their next step"
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPTS.hint,
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    const parsed = JSON.parse(text);
    return {
      hintLevel: parsed.hintLevel ?? levelNum,
      title: parsed.title ?? hintTierLabels[level],
      explanation: parsed.explanation ?? 'Reflect on the data structure choices available to you.',
      leadingQuestion: parsed.leadingQuestion ?? 'What invariant must hold at each step of your algorithm?',
    };
  } catch (err) {
    console.error('[gemini.ts] generateSocraticHint failed:', err);
    throw new Error('Gemini hint generation failed');
  }
}

/**
 * Server-side error explainer (crash log analyst).
 * MUST only be called from API routes (server context).
 */
export async function explainError(
  payload: PromptPayload
): Promise<{ title: string; rootCause: string; correctiveDirection: string; memoryNote: string }> {
  if (!ai) {
    return {
      title: 'Runtime Error Detected',
      rootCause: 'Could not contact Gemini API. Check that GEMINI_API_KEY is set in .env.local.',
      correctiveDirection: 'Inspect the stack trace above and verify your loop bounds and pointer access patterns.',
      memoryNote:
        payload.language === 'cpp'
          ? 'In C++, accessing an out-of-bounds index on a std::vector or raw array causes undefined behavior.'
          : 'In Python, IndexError occurs when accessing a list index that does not exist.',
    };
  }

  const prompt = `Language: ${payload.language.toUpperCase()}

Problem context:
${payload.problemContext}

Student's code:
\`\`\`${payload.language}
${payload.code || '// (empty)'}
\`\`\`

Error / crash output:
${payload.errorContext || 'No error message provided — analyze potential bugs from the code alone.'}

Return ONLY a JSON object with this exact shape — no markdown fences:
{
  "title": "Short error classification (e.g. 'Index Out of Bounds')",
  "rootCause": "1-2 sentence explanation of what caused the error",
  "correctiveDirection": "Concrete corrective direction using pseudocode or 1-2 illustrative lines only — no full solution",
  "memoryNote": "Language-specific memory/reference note (C++ stack/heap/pointer, or Python reference/scope)"
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PROMPTS.debugger,
        temperature: 0.1,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text?.trim() || '';
    const parsed = JSON.parse(text);
    return {
      title: parsed.title ?? 'Runtime Error',
      rootCause: parsed.rootCause ?? 'An unexpected runtime error occurred.',
      correctiveDirection: parsed.correctiveDirection ?? 'Review loop bounds and null-pointer guards.',
      memoryNote: parsed.memoryNote ?? '',
    };
  } catch (err) {
    console.error('[gemini.ts] explainError failed:', err);
    throw new Error('Gemini error explanation failed');
  }
}

// ─── Legacy recommendation helpers (server-only, kept for the /api/ai recommend route) ───

import { PROBLEMS_DATA } from '@/data/problems';
import { ROADMAP_DAYS } from '@/data/roadmap';
import { SmartRecommendationResponse } from '@/types';

export async function generateSmartRecommendation(params: {
  solvedTags: string[];
  failedTags?: string[];
  solvedProblemIds: string[];
  currentStreak: number;
}): Promise<SmartRecommendationResponse> {
  const { solvedTags, failedTags, solvedProblemIds, currentStreak } = params;

  if (ai) {
    try {
      const prompt = `You are an AI Curriculum Architect for a university DSA Platform.
Student Progress:
- Solved Topic Tags: [${solvedTags.join(', ')}]
- Failed / Struggling Tags: [${(failedTags || []).join(', ')}]
- Solved Problem Count: ${solvedProblemIds.length}
- Current Active Streak: ${currentStreak} Days

Available Course Problems:
${PROBLEMS_DATA.map(p => `- ID: ${p.id}, Title: "${p.title}", Topic: "${p.category}", Difficulty: ${p.difficulty}, Day: ${p.day}`).join('\n')}

Recommend:
1. The next optimal learning topic/module.
2. A pedagogical rationale (2 sentences, reference C++/Python memory concepts).
3. Exactly 2 target practice problems from the list that are not yet mastered.

Return ONLY a JSON object — no markdown fences:
{
  "recommendedTopic": "Topic Name",
  "reason": "2-sentence rationale",
  "targetProblems": [
    { "id": "...", "title": "...", "difficulty": "Easy|Medium|Hard", "category": "...", "day": 1, "reason": "..." }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json', temperature: 0.3 },
      });

      const text = response.text?.trim() || '';
      const parsed = JSON.parse(text);
      if (parsed.recommendedTopic && parsed.targetProblems?.length > 0) {
        return parsed as SmartRecommendationResponse;
      }
    } catch (err) {
      console.warn('[gemini.ts] generateSmartRecommendation failed, using adaptive fallback:', err);
    }
  }

  // Adaptive fallback
  const unsolvedProblems = PROBLEMS_DATA.filter(p => !solvedProblemIds.includes(p.id));
  const candidatePool = unsolvedProblems.length >= 2 ? unsolvedProblems : PROBLEMS_DATA;

  let recommendedTopic = 'Two Pointers & In-Place Memory Mutation';
  let reason = `With your ${currentStreak}-day active streak and foundation in Arrays, advancing to Two Pointers reinforces in-place array manipulation with constant O(1) space in both C++ and Python.`;

  if (solvedTags.includes('Two Pointers') && !solvedTags.includes('Linked Lists')) {
    recommendedTopic = 'Linked Lists & Dynamic Memory Pointers';
    reason =
      'Now that you have mastered contiguous array traversal, exploring Linked Lists will solidify your understanding of heap pointer allocation in C++ vs PyObject references in Python.';
  } else if (solvedTags.includes('Linked Lists') && !solvedTags.includes('Stacks')) {
    recommendedTopic = 'Stacks & Monotonic Evaluation';
    reason =
      'Building upon sequential structures, Monotonic Stacks will teach you how to evaluate nested brackets and nearest greater elements in amortized O(N) time.';
  } else if (solvedTags.includes('Stacks') && !solvedTags.includes('Binary Search')) {
    recommendedTopic = 'Binary Search & Boundary Invariants';
    reason =
      'Logarithmic search space pruning is an interview essential. Focus on mid calculation overflow prevention in C++ and Python bisect mechanics.';
  } else if (solvedTags.includes('Binary Search') && !solvedTags.includes('Dynamic Programming')) {
    recommendedTopic = 'Dynamic Programming Foundations';
    reason =
      'Transition from recursive search trees to rolling array DP, mastering space optimization from O(N) to O(1) in CPU cache lines.';
  }

  const targets = candidatePool.slice(0, 2).map((p, idx) => ({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    category: p.category,
    day: p.day,
    reason:
      idx === 0
        ? `Reinforces core patterns in ${p.category} with targeted constraints.`
        : `Broadens your algorithmic muscle with ${p.difficulty} edge cases.`,
  }));

  return { recommendedTopic, reason, targetProblems: targets };
}
