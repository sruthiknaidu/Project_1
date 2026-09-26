/**
 * Judge0-CE via RapidAPI — real code execution backend.
 * All env vars are NEXT_PUBLIC_ so they're readable on the client if needed,
 * but this module can also be imported from server routes.
 */

export interface ExecutionResult {
  success: boolean;
  stdout: string;
  stderr: string;
  compileOutput: string;
  exitCode: number | null;
  time: string | null;
  memory: number | null;
  statusDescription: string;
}

// Judge0 language IDs
const LANGUAGE_IDS: Record<'cpp' | 'python', number> = {
  cpp: 75,    // C++ (GCC 7.4.0)
  python: 71, // Python (3.8.1)
};

const JUDGE0_URL = process.env.NEXT_PUBLIC_JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_HOST = process.env.NEXT_PUBLIC_JUDGE0_HOST || 'judge0-ce.p.rapidapi.com';
const JUDGE0_KEY = process.env.NEXT_PUBLIC_JUDGE0_API_KEY || '';

const HEADERS = {
  'content-type': 'application/json',
  'X-RapidAPI-Host': JUDGE0_HOST,
  'X-RapidAPI-Key': JUDGE0_KEY,
};

/** Submit code to Judge0 and return the submission token. */
async function submitCode(
  code: string,
  language: 'cpp' | 'python',
  stdin: string = ''
): Promise<string> {
  if (!JUDGE0_KEY) {
    throw new Error('NEXT_PUBLIC_JUDGE0_API_KEY is not set. Configure it in .env.local.');
  }

  const body = JSON.stringify({
    source_code: btoa(unescape(encodeURIComponent(code))), // base64 encode
    language_id: LANGUAGE_IDS[language],
    stdin: btoa(unescape(encodeURIComponent(stdin))),
    base64_encoded: true,
    wait: false,
  });

  const response = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=true&wait=false`, {
    method: 'POST',
    headers: HEADERS,
    body,
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Judge0 submission failed (${response.status}): ${errText}`);
  }

  const data = await response.json();
  if (!data.token) {
    throw new Error('Judge0 did not return a submission token.');
  }
  return data.token as string;
}

/** Poll Judge0 for submission result (status_id 1=queued, 2=processing, >=3=done). */
export async function pollSubmissionStatus(token: string): Promise<ExecutionResult> {
  const MAX_POLLS = 20;
  const POLL_INTERVAL_MS = 1000;

  for (let i = 0; i < MAX_POLLS; i++) {
    await new Promise(resolve => setTimeout(resolve, POLL_INTERVAL_MS));

    const response = await fetch(
      `${JUDGE0_URL}/submissions/${token}?base64_encoded=true&fields=stdout,stderr,compile_output,exit_code,time,memory,status`,
      { method: 'GET', headers: HEADERS }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Judge0 poll failed (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const statusId: number = data.status?.id ?? 0;

    // Still queued or processing
    if (statusId <= 2) continue;

    const decode = (b64: string | null): string => {
      if (!b64) return '';
      try {
        return decodeURIComponent(escape(atob(b64)));
      } catch {
        return b64;
      }
    };

    const stdout = decode(data.stdout);
    const stderr = decode(data.stderr);
    const compileOutput = decode(data.compile_output);
    const statusDescription: string = data.status?.description ?? 'Unknown';
    const exitCode: number | null = data.exit_code ?? null;

    // Status IDs: 3=Accepted, 4=Wrong Answer, 5=TLE, 6=Compile Error, 7-12=Runtime Errors
    const success = statusId === 3;

    return {
      success,
      stdout,
      stderr,
      compileOutput,
      exitCode,
      time: data.time ?? null,
      memory: data.memory ?? null,
      statusDescription,
    };
  }

  return {
    success: false,
    stdout: '',
    stderr: '',
    compileOutput: '',
    exitCode: null,
    time: null,
    memory: null,
    statusDescription: 'Timed out waiting for Judge0 result',
  };
}

/**
 * Full execute-and-poll cycle.
 * @param code   Source code string
 * @param language  'cpp' | 'python'
 * @param stdin  Optional standard input
 */
export async function executeCode(
  code: string,
  language: 'cpp' | 'python',
  stdin: string = ''
): Promise<ExecutionResult> {
  const token = await submitCode(code, language, stdin);
  return pollSubmissionStatus(token);
}
