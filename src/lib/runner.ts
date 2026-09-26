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
  overallStatus: 'Pass' | 'Compile Error' | 'TLE' | 'Wrong Answer';
}

// Client-side execution evaluator with VS Code-grade status badges
export const executeCodeSimulation = async (
  options: RunCodeOptions
): Promise<RunCodeResult> => {
  const { problemId, language, code, customTestCases } = options;
  const results: TestResultItem[] = [];
  const runtimeLogs: string[] = [];

  const trimmed = code.trim();
  if (!trimmed) {
    return {
      success: false,
      allPassed: false,
      totalTests: 0,
      passedTests: 0,
      results: [],
      compileOutput: `Error: No code provided. Code buffer is empty.`,
      runtimeLogs: [`[Error] Translation unit is empty.`],
      overallStatus: 'Compile Error'
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
        compileOutput: `error: expected class-name before '{' token\n1 | class Solution is required for evaluation harness.\nCompilation terminated with exit code 1.`,
        runtimeLogs: [`[Compiler Error] Missing 'class Solution' definition.`],
        overallStatus: 'Compile Error'
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
        compileOutput: `fatal error: unmatched curly braces '{ }' in translation unit.\nBalance difference: ${braceCount}\nCompilation terminated with exit status 1.`,
        runtimeLogs: [`[Compiler Error] Unbalanced curly braces detected.`],
        overallStatus: 'Compile Error'
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
        compileOutput: `IndentationError/SyntaxError: 'class Solution:' block is expected at module level.`,
        runtimeLogs: [`[Interpreter Error] Missing 'class Solution:' definition.`],
        overallStatus: 'Compile Error'
      };
    }
  }

  // Detect potential infinite loop for TLE simulation
  const hasInfiniteLoop =
    code.includes('while True:') && !code.includes('break') ||
    code.includes('while (true)') && !code.includes('break') ||
    code.includes('while(1)') && !code.includes('break');

  if (hasInfiniteLoop) {
    const tests = customTestCases || [];
    return {
      success: false,
      allPassed: false,
      totalTests: tests.length,
      passedTests: 0,
      results: tests.map(t => ({
        testCaseId: t.id,
        status: 'TLE',
        passed: false,
        input: t.input,
        expectedOutput: t.expectedOutput,
        actualOutput: 'Time Limit Exceeded (> 2000ms)',
        executionTimeMs: 2000,
        error: 'Execution exceeded standard 2.0s time limit.'
      })),
      compileOutput: `Time Limit Exceeded: Process terminated after 2000ms execution timeout without returning.`,
      runtimeLogs: [`[TLE] Execution timed out at 2000.00ms. Check loop termination conditions.`],
      overallStatus: 'TLE'
    };
  }

  runtimeLogs.push(`[Compiler] Build Target: x86_64-${language === 'cpp' ? 'gcc-13 -O3 -std=c++20' : 'cpython-3.11'}`);
  runtimeLogs.push(`[Runtime] Sandboxed execution container initialized.`);

  const testsToRun = customTestCases && customTestCases.length > 0 ? customTestCases : [];
  let passedTests = 0;
  let hasTLE = false;

  for (const test of testsToRun) {
    const startTime = performance.now();
    await new Promise(r => setTimeout(r, 45));
    const executionTimeMs = parseFloat((performance.now() - startTime + Math.random() * 2).toFixed(2));

    let actualOutput = test.expectedOutput;
    let passed = true;
    let errorMsg: string | undefined = undefined;
    let status: 'Pass' | 'Compile Error' | 'TLE' | 'Wrong Answer' = 'Pass';

    const hasReturn = code.includes('return');
    if (!hasReturn) {
      actualOutput = language === 'cpp' ? '{}' : 'None';
      passed = false;
      errorMsg = 'Function finished without returning any value.';
      status = 'Wrong Answer';
    } else {
      if (problemId === 'two-sum') {
        const hasLogic = code.includes('unordered_map') || code.includes('dict') || code.includes('seen') || code.includes('target -');
        if (!hasLogic) {
          passed = false;
          actualOutput = '[]';
          status = 'Wrong Answer';
        }
      } else if (problemId === 'valid-parentheses') {
        const hasStack = code.includes('stack') || code.includes('pop') || code.includes('st.');
        if (!hasStack) {
          passed = false;
          actualOutput = 'false';
          status = 'Wrong Answer';
        }
      }
    }

    if (passed) {
      passedTests++;
      runtimeLogs.push(`[Test ${test.id}] Input: ${test.input.slice(0, 32)}... -> PASS (${executionTimeMs} ms)`);
    } else {
      runtimeLogs.push(`[Test ${test.id}] Input: ${test.input.slice(0, 32)}... -> WRONG ANSWER`);
    }

    results.push({
      testCaseId: test.id,
      status,
      passed,
      input: test.input,
      expectedOutput: test.expectedOutput,
      actualOutput,
      executionTimeMs,
      error: errorMsg
    });
  }

  const allPassed = passedTests === testsToRun.length && testsToRun.length > 0;
  const overallStatus = allPassed ? 'Pass' : 'Wrong Answer';

  return {
    success: true,
    allPassed,
    totalTests: testsToRun.length,
    passedTests,
    results,
    compileOutput: allPassed
      ? `Compilation and execution finished successfully with exit code 0.\nMemory consumption: 14.2 MB (within 256MB limit).`
      : `Test suite finished with ${passedTests}/${testsToRun.length} passed test cases.`,
    runtimeLogs,
    overallStatus
  };
};
