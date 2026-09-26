import { GoogleGenAI } from '@google/genai';
import { SocraticHintResponse, CodeReviewResponse, ProgrammingLanguage } from '@/types';
import { PROBLEMS_DATA } from '@/data/problems';

interface HintRequestParams {
  problemId: string;
  problemTitle: string;
  problemDescription: string;
  language: ProgrammingLanguage;
  codeBuffer: string;
  hintLevel: 1 | 2 | 3;
  apiKey?: string;
}

interface CodeReviewParams {
  problemId: string;
  problemTitle: string;
  problemDescription: string;
  language: ProgrammingLanguage;
  codeBuffer: string;
  apiKey?: string;
}

interface ChatParams {
  problemTitle: string;
  problemDescription: string;
  language: ProgrammingLanguage;
  codeBuffer: string;
  message: string;
  history: { sender: 'user' | 'assistant'; text: string }[];
  apiKey?: string;
}

export const getSocraticHint = async (params: HintRequestParams): Promise<SocraticHintResponse> => {
  const { problemId, problemTitle, problemDescription, language, codeBuffer, hintLevel, apiKey } = params;
  const effectiveKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (effectiveKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: effectiveKey });
      const prompt = `You are a world-class Socratic Teaching Assistant for Data Structures & Algorithms.
Your student is working on the problem: "${problemTitle}".
Language: ${language.toUpperCase()}

Problem Description:
${problemDescription}

Student's Current Code Buffer:
\`\`\`${language}
${codeBuffer || '// Empty code buffer'}
\`\`\`

Request: Generate a Tier ${hintLevel} Socratic Hint.
- Tier 1: Pure Intuition. High-level mental model without mentioning specific data structure implementations or syntax.
- Tier 2: Strategy & Invariants. Which algorithmic paradigm or data structure fits best, and why.
- Tier 3: Syntax & Scaffolding. Specific C++ STL or Python idioms, edge case traps, or loop invariants, but DO NOT provide the full solution code.

Strictly return a JSON object adhering to this schema:
{
  "hintLevel": ${hintLevel},
  "title": "Brief 2-4 word Title",
  "explanation": "1-3 sentences of targeted guidance",
  "leadingQuestion": "A thought-provoking question that prompts the student to think of the next step"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text?.trim() || '';
      if (responseText) {
        const parsed = JSON.parse(responseText);
        return {
          hintLevel: parsed.hintLevel || hintLevel,
          title: parsed.title || `Tier ${hintLevel} Guidance`,
          explanation: parsed.explanation || 'Reflect on the problem invariants.',
          leadingQuestion: parsed.leadingQuestion || 'What step comes next?'
        };
      }
    } catch (e) {
      console.warn('Gemini API call failed, falling back to curated hints:', e);
    }
  }

  // Fallback: Use curated problem dataset hint
  const problem = PROBLEMS_DATA.find(p => p.id === problemId);
  if (problem && problem.hints) {
    const hint = problem.hints.find(h => h.level === hintLevel) || problem.hints[0];
    return {
      hintLevel: hint.level,
      title: hint.title,
      explanation: hint.explanation,
      leadingQuestion: hint.leadingQuestion
    };
  }

  // Generic fallback
  const genericHints: Record<1 | 2 | 3, SocraticHintResponse> = {
    1: {
      hintLevel: 1,
      title: 'Conceptual Intuition',
      explanation: 'Break the problem down into inputs and desired outputs. What subproblem repeats?',
      leadingQuestion: 'Can you solve this by hand for a small example array with 3 elements?'
    },
    2: {
      hintLevel: 2,
      title: 'Algorithmic Strategy',
      explanation: 'Consider whether sorting the array or using a hash map can reduce nested iterations from O(N^2) to O(N).',
      leadingQuestion: 'Which data structure gives you O(1) lookup times for previous elements?'
    },
    3: {
      hintLevel: 3,
      title: 'Syntax Scaffolding',
      explanation: language === 'cpp'
        ? 'In C++, initialize std::unordered_map<int, int> to store values and their indices.'
        : 'In Python, use a dictionary {val: idx} and check with `if comp in seen:`.',
      leadingQuestion: 'Have you verified edge cases such as empty inputs or negative values?'
    }
  };

  return genericHints[hintLevel];
};

export const getCodeReview = async (params: CodeReviewParams): Promise<CodeReviewResponse> => {
  const { problemId, problemTitle, problemDescription, language, codeBuffer, apiKey } = params;
  const effectiveKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (effectiveKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: effectiveKey });
      const prompt = `You are a Senior Staff Software Engineer and Tech Interviewer evaluating a DSA candidate's solution for "${problemTitle}".
Language: ${language.toUpperCase()}

Problem:
${problemDescription}

Candidate's Code:
\`\`\`${language}
${codeBuffer}
\`\`\`

Perform an automated Big-O complexity analysis and code review.
Strictly return a JSON object with this format:
{
  "timeComplexity": "e.g. O(N)",
  "spaceComplexity": "e.g. O(1) or O(N)",
  "timeExplanation": "Brief justification of loops or recursion",
  "spaceExplanation": "Brief justification of auxiliary data structures",
  "rating": "Optimal" or "Suboptimal" or "Needs Work",
  "suggestions": ["suggestion 1", "suggestion 2"],
  "memoryOptimizations": ["C++ or Python specific memory tip 1"],
  "cleanCodeFeedback": ["clean code tip 1"]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text?.trim() || '';
      if (responseText) {
        return JSON.parse(responseText);
      }
    } catch (e) {
      console.warn('Gemini review failed, falling back to static analyzer:', e);
    }
  }

  // Fallback: Static algorithmic heuristic review
  const problem = PROBLEMS_DATA.find(p => p.id === problemId);
  const code = codeBuffer.toLowerCase();

  // Basic heuristic detection
  const hasNestedLoops = (code.match(/for\s*\(/g) || []).length > 1 || (code.match(/for\s+[a-z]+\s+in/g) || []).length > 1;
  const hasMapOrDict = code.includes('unordered_map') || code.includes('map') || code.includes('dict') || code.includes('{}');
  const targetTime = problem?.bigOTarget.time || 'O(N)';
  const targetSpace = problem?.bigOTarget.space || 'O(N)';

  let detectedTime = targetTime;
  let detectedSpace = targetSpace;
  let rating: 'Optimal' | 'Suboptimal' | 'Needs Work' = 'Optimal';

  if (hasNestedLoops && !targetTime.includes('N^2')) {
    detectedTime = 'O(N^2)';
    detectedSpace = 'O(1)';
    rating = 'Suboptimal';
  } else if (hasMapOrDict && targetSpace === 'O(1)') {
    detectedSpace = 'O(N)';
  }

  const memoryTips: string[] = [];
  const cleanCode: string[] = [];

  if (language === 'cpp') {
    if (!codeBuffer.includes('const') && codeBuffer.includes('vector<int>&')) {
      memoryTips.push('Pass input vectors by `const std::vector<int>&` to explicitly guarantee immutability.');
    } else {
      memoryTips.push('Efficient heap layout: std::vector maintains contiguous cache locality in CPU L1/L2 caches.');
    }
    cleanCode.push('Good practice: Avoid namespace pollution by using explicit `std::` prefixes.');
    cleanCode.push('Use range-based for loops `for (const auto& item : items)` where index arithmetic is not required.');
  } else {
    memoryTips.push('Python list append/pop operations are O(1) amortized, but slicing creates a shallow copy.');
    cleanCode.push('Use `enumerate()` for idiomatic index and element unpacking.');
    cleanCode.push('Type hints (`List[int]`, `Optional[ListNode]`) improve readability and static IDE analysis.');
  }

  return {
    timeComplexity: detectedTime,
    spaceComplexity: detectedSpace,
    timeExplanation: rating === 'Optimal'
      ? `Matches target ${targetTime}. Traverses data elements with linear scan or optimal data structure.`
      : `Suboptimal loop nesting observed, leading to ${detectedTime}.`,
    spaceExplanation: `Auxiliary memory allocated: ${detectedSpace}.`,
    rating,
    suggestions: rating === 'Optimal'
      ? ['Great job! Your complexity matches the optimal interview standard.']
      : ['Consider replacing the nested scan with a hash set or hash map to drop complexity to O(N).'],
    memoryOptimizations: memoryTips,
    cleanCodeFeedback: cleanCode
  };
};

export const chatWithSocraticTA = async (params: ChatParams): Promise<string> => {
  const { problemTitle, problemDescription, language, codeBuffer, message, history, apiKey } = params;
  const effectiveKey = apiKey || process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (effectiveKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: effectiveKey });
      const prompt = `You are a friendly, encouraging Socratic DSA Teaching Assistant for college students and tech interview candidates.
Active Problem: "${problemTitle}"
Language: ${language.toUpperCase()}

Problem:
${problemDescription}

Student's Code:
\`\`\`${language}
${codeBuffer}
\`\`\`

Conversation History:
${history.map(h => `${h.sender === 'user' ? 'Student' : 'TA'}: ${h.text}`).join('\n')}

Student's New Question:
"${message}"

Instructions:
1. Act as a Socratic guide. NEVER write the complete final code or directly give away the full solution.
2. Ask guided questions and highlight conceptual connections (e.g. C++ STL vs Python internals, pointers, complexity).
3. Keep response concise, friendly, and under 3 short paragraphs.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      return response.text?.trim() || "What approach are you leaning towards for this problem?";
    } catch (e) {
      console.warn('Gemini chat failed, fallback response used:', e);
    }
  }

  // Fallback Socratic reply
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes('hint') || lowerMsg.includes('stuck') || lowerMsg.includes('help')) {
    return `You're on the right track! Take a close look at the problem constraints. When checking previous elements, what data structure lets you look up whether an element was already seen in $O(1)$ time?`;
  }
  if (lowerMsg.includes('time') || lowerMsg.includes('complexity') || lowerMsg.includes('big o')) {
    return `Think about how many times your code visits each element. If there's a loop inside another loop, it often yields $O(N^2)$. How could we pre-record items to solve it in a single $O(N)$ pass?`;
  }
  if (lowerMsg.includes('difference') || lowerMsg.includes('c++') || lowerMsg.includes('python')) {
    return language === 'cpp'
      ? `In C++, \`std::unordered_map\` uses hash buckets with chaining. Remember that accessing an absent key with \`map[key]\` will silently default-construct it! Always check with \`.find()\` first.`
      : `In Python, dictionaries use compact hash tables with open addressing. Lookups with \`key in dict\` are $O(1)$ average!`;
  }
  return `That's a thoughtful question. What do you think would happen if we tested this against an edge case like an array with only two elements?`;
};
