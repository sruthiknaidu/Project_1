export type ProgrammingLanguage = 'cpp' | 'python';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type ThemeMode = 'dark' | 'light';

export interface TestCase {
  id: number;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface BigOTarget {
  time: string;
  space: string;
  explanation: string;
}

export interface LanguageComparison {
  cppExplanation: string;
  pythonExplanation: string;
  memoryComparison: string;
  keyStlVsBuiltin: {
    feature: string;
    cpp: string;
    python: string;
    complexityNotes: string;
  }[];
  pitfalls: string[];
}

export interface ProblemHint {
  level: 1 | 2 | 3;
  title: string;
  explanation: string;
  leadingQuestion: string;
}

export interface VisualizerStep {
  stepIndex: number;
  description: string;
  codeLineHighlight?: number;
  activeVariables: { [key: string]: string | number | boolean };
  // C++ Memory Model
  cppMemory: {
    stackFrames: {
      functionName: string;
      variables: {
        name: string;
        type: string;
        address: string;
        value: string;
        pointsTo?: string;
        isReference?: boolean;
      }[];
    }[];
    heapBlocks: {
      address: string;
      type: string;
      size: string;
      data: string | string[];
      allocatedBy?: string;
    }[];
  };
  // Python Memory Model
  pythonMemory: {
    namespaces: {
      scope: string;
      bindings: {
        variableName: string;
        targetObjectId: string;
      }[];
    }[];
    objects: {
      id: string;
      type: string;
      value: string | string[];
      refCount: number;
      elements?: { index: number; targetObjectId: string }[];
    }[];
  };
  // Data Structure state for graphical rendering
  dsState: {
    type: 'array' | 'linked-list' | 'tree' | 'stack';
    data: any;
    pointers?: { name: string; index?: number; nodeId?: string; color: string }[];
    highlightedIndices?: number[];
  };
}

export interface Problem {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: string;
  day: number;
  timeEstimateMinutes: number;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  bigOTarget: BigOTarget;
  languageComparison: LanguageComparison;
  starterCode: {
    cpp: string;
    python: string;
  };
  testCases: TestCase[];
  hints: ProblemHint[];
  editorial: {
    approach: string;
    cppSolution: string;
    pythonSolution: string;
    complexityAnalysis: {
      time: string;
      space: string;
    };
  };
  visualizerSteps?: VisualizerStep[];
}

export interface RoadmapDay {
  day: number;
  phase: string;
  phaseNumber: number;
  title: string;
  summary: string;
  estimatedMinutes: number;
  coreConcepts: string[];
  languageHighlights: {
    cpp: string;
    python: string;
  };
  problemIds: string[];
}

export interface UserProgress {
  solvedProblems: {
    [problemId: string]: {
      solvedAt: string;
      language: ProgrammingLanguage;
    };
  };
  bookmarkedProblems: string[];
  codeBuffers: {
    [key: string]: string; // key: `${problemId}_${language}`
  };
  notes: {
    [problemId: string]: {
      content: string;
      updatedAt: string;
    };
  };
  streak: {
    currentStreak: number;
    maxStreak: number;
    lastActiveDate: string;
    totalActiveDays: number;
  };
  dailyActivity: {
    [dateKey: string]: { // format: YYYY-MM-DD
      count: number;
      minutes: number;
    };
  };
  settings: {
    language: ProgrammingLanguage;
    theme: ThemeMode;
    geminiApiKey: string;
    fontSize: number;
  };
}

export interface SocraticHintResponse {
  hintLevel: number;
  title: string;
  explanation: string;
  leadingQuestion: string;
}

export interface CodeReviewResponse {
  timeComplexity: string;
  spaceComplexity: string;
  timeExplanation: string;
  spaceExplanation: string;
  rating: 'Optimal' | 'Suboptimal' | 'Needs Work';
  suggestions: string[];
  memoryOptimizations: string[];
  cleanCodeFeedback: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export interface TestResultItem {
  testCaseId: number;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  executionTimeMs: number;
  error?: string;
}
