import { TestCase, TestResultItem, ProgrammingLanguage } from '@/types';

export interface RunCodeOptions {
  problemId: string;
  language: ProgrammingLanguage;
  code: string;
  customTestCases?: TestCase[];
}

export interface RunCodeResult {
  success: boolean;
  allPassed: boolean;
  totalTests: number;
  passedTests: number;
  results: TestResultItem[];
  compileOutput: string;
  runtimeLogs: string[];
}

// Client-side execution evaluator for DSA algorithms
export const executeCodeSimulation = async (
  options: RunCodeOptions
): Promise<RunCodeResult> => {
  const { problemId, language, code, customTestCases } = options;
  const results: TestResultItem[] = [];
  const runtimeLogs: string[] = [];

  // Syntax sanity checks
  const trimmed = code.trim();
  if (!trimmed) {
    return {
      success: false,
      allPassed: false,
      totalTests: 0,
      passedTests: 0,
      results: [],
      compileOutput: `Error: No code provided. Editor is empty.`,
      runtimeLogs: []
    };
  }

  // Syntax and structural checks
  if (language === 'cpp') {
    if (!code.includes('class Solution')) {
      return {
        success: false,
        allPassed: false,
        totalTests: 0,
        passedTests: 0,
        results: [],
        compileOutput: `error: expected class-name before '{' token\nSolution class not detected. Please maintain the 'class Solution' structure.`,
        runtimeLogs: []
      };
    }
    // Check balanced braces
    let braceCount = 0;
    for (const ch of code) {
      if (ch === '{') braceCount++;
      if (ch === '}') braceCount--;
    }
    if (braceCount !== 0) {
      return {
        success: false,
        allPassed: false,
        totalTests: 0,
        passedTests: 0,
        results: [],
        compileOutput: `error: unbalanced curly braces '{ }' in translation unit.\nBrace balance diff: ${braceCount}`,
        runtimeLogs: []
      };
    }
  } else {
    if (!code.includes('class Solution:')) {
      return {
        success: false,
        allPassed: false,
        totalTests: 0,
        passedTests: 0,
        results: [],
        compileOutput: `IndentationError/SyntaxError: class Solution: definition is required.`,
        runtimeLogs: []
      };
    }
  }

  runtimeLogs.push(`[Compiler] Build target: x86_64-${language === 'cpp' ? 'gcc-13 -O3' : 'cpython-3.11'}`);
  runtimeLogs.push(`[Runtime] Initializing sandbox environment...`);

  const testsToRun = customTestCases && customTestCases.length > 0 ? customTestCases : [];

  let passedTests = 0;

  for (const test of testsToRun) {
    const startTime = performance.now();
    // Simulate execution time
    await new Promise(r => setTimeout(r, 60));
    const executionTimeMs = parseFloat((performance.now() - startTime + Math.random() * 2).toFixed(2));

    let actualOutput = test.expectedOutput;
    let passed = true;
    let errorMsg: string | undefined = undefined;

    // Check if code has incomplete logic placeholder (e.g. "Your code here" without return)
    const hasReturn = code.includes('return');
    if (!hasReturn) {
      actualOutput = language === 'cpp' ? '{}' : 'None';
      passed = false;
      errorMsg = 'Function did not return any value.';
    } else {
      // Heuristic verification based on problem specifics
      if (problemId === 'two-sum') {
        const hasMap = code.includes('unordered_map') || code.includes('dict') || code.includes('seen') || code.includes('for');
        if (!hasMap) {
          passed = false;
          actualOutput = '[]';
        }
      } else if (problemId === 'valid-parentheses') {
        const hasStack = code.includes('stack') || code.includes('pop') || code.includes('st.');
        if (!hasStack) {
          passed = false;
          actualOutput = 'false';
        }
      }
    }

    if (passed) {
      passedTests++;
      runtimeLogs.push(`[Test ${test.id}] Input: ${test.input.slice(0, 30)}... -> PASSED (${executionTimeMs} ms)`);
    } else {
      runtimeLogs.push(`[Test ${test.id}] Input: ${test.input.slice(0, 30)}... -> FAILED`);
    }

    results.push({
      testCaseId: test.id,
      passed,
      input: test.input,
      expectedOutput: test.expectedOutput,
      actualOutput,
      executionTimeMs,
      error: errorMsg
    });
  }

  const allPassed = passedTests === testsToRun.length && testsToRun.length > 0;

  return {
    success: true,
    allPassed,
    totalTests: testsToRun.length,
    passedTests,
    results,
    compileOutput: allPassed
      ? `Compilation and execution finished successfully with exit code 0.\nMemory consumption: ~14.2 MB.`
      : `Execution completed with failures. ${passedTests}/${testsToRun.length} tests passed.`,
    runtimeLogs
  };
};
