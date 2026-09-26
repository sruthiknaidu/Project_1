import { RoadmapDay } from '@/types';

export const ROADMAP_DAYS: RoadmapDay[] = [
  // Phase 1: Foundations & Linear Memory (Days 1 - 7)
  {
    day: 1,
    phase: 'Foundations & Linear Memory',
    phaseNumber: 1,
    title: 'Time & Space Complexity & Memory Models',
    summary: 'Master asymptotic Big-O notations, Stack vs Heap memory allocation, pointer references in C++ vs PyObject references in Python.',
    estimatedMinutes: 45,
    coreConcepts: ['Big-O Analysis', 'Stack vs Heap', 'std::vector dynamic growth', 'PyObject memory structure', 'Hash Tables'],
    languageHighlights: {
      cpp: 'std::vector allocates contiguous heap memory; std::unordered_map uses bucket chaining with std::hash.',
      python: 'All variables are PyObject pointers on the heap; dict uses open addressing with quadratic probing.'
    },
    problemIds: ['two-sum']
  },
  {
    day: 2,
    phase: 'Foundations & Linear Memory',
    phaseNumber: 1,
    title: 'Arrays & Dynamic Sizing Mechanics',
    summary: 'Understand amortized O(1) appending, CPU cache lines, capacity doubling strategies, and one-pass sliding minimums.',
    estimatedMinutes: 40,
    coreConcepts: ['Amortized Analysis', 'CPU Cache Locality', 'Capacity vs Size', 'One-Pass Greedy Scanning'],
    languageHighlights: {
      cpp: 'std::vector growth factor is 2.0 (GCC/Clang) or 1.5 (MSVC); continuous memory gives optimal L1 cache hits.',
      python: 'list growth pattern is 0, 4, 8, 16, 24, 32... (~1.125 factor) storing pointer arrays.'
    },
    problemIds: ['best-time-to-buy-and-sell-stock']
  },
  {
    day: 3,
    phase: 'Foundations & Linear Memory',
    phaseNumber: 1,
    title: 'Two Pointers Pattern (Bidirectional & Fast/Slow)',
    summary: 'In-place array manipulations without allocating extra memory; shrinking search boundaries symmetrically.',
    estimatedMinutes: 45,
    coreConcepts: ['Left/Right Convergence', 'In-Place Partitioning', 'Sorted Array Properties', 'Constant O(1) Space'],
    languageHighlights: {
      cpp: 'Iterating with indices vs std::vector<int>::iterator; passing vectors by const reference (const vector<int>&) to avoid O(N) copy.',
      python: 'Tuple swapping (left, right = 0, len - 1); slice operations create new lists and must be avoided for O(1) space.'
    },
    problemIds: ['two-sum-ii-input-array-is-sorted']
  },
  {
    day: 4,
    phase: 'Foundations & Linear Memory',
    phaseNumber: 1,
    title: 'Sliding Window (Fixed & Variable Sized)',
    summary: 'Maintain running subarray state efficiently; expand with right pointer, shrink with left pointer.',
    estimatedMinutes: 50,
    coreConcepts: ['Window Invariant', 'Shrinking Condition', 'Frequency Count Hash Map', 'Subarray Problems'],
    languageHighlights: {
      cpp: 'std::array<int, 128> or std::vector<int> count(128, 0) for ASCII characters is faster than unordered_map.',
      python: 'collections.Counter or dict with get(c, 0) for tracking window character counts.'
    },
    problemIds: ['two-sum-ii-input-array-is-sorted']
  },
  {
    day: 5,
    phase: 'Foundations & Linear Memory',
    phaseNumber: 1,
    title: 'Prefix Sums & Hashing Patterns',
    summary: 'Transform range sum queries from O(N) to O(1); count subarrays matching target sums using prefix sum hash maps.',
    estimatedMinutes: 45,
    coreConcepts: ['Prefix Sum Array', 'Zero-index Offset', 'Cumulative Frequency', 'Hash Map Complements'],
    languageHighlights: {
      cpp: 'std::partial_sum in <numeric> computes prefix sums; unordered_map<int, int> count occurrences.',
      python: 'itertools.accumulate computes prefix sums in a generator.'
    },
    problemIds: ['two-sum']
  },
  {
    day: 6,
    phase: 'Foundations & Linear Memory',
    phaseNumber: 1,
    title: 'Fast & Slow Pointers (Floyd\'s Cycle Detection)',
    summary: 'Detect cycles in linear data structures without extra memory; find middle of linked lists and mathematical proofs.',
    estimatedMinutes: 45,
    coreConcepts: ['Floyd\'s Tortoise & Hare', 'Modular Arithmetic Proof', 'Middle Element Finding', 'O(1) Space Detection'],
    languageHighlights: {
      cpp: 'Raw pointers ListNode* fast = head; check fast && fast->next to prevent null dereference segmentation fault.',
      python: 'while fast and fast.next: allows clean short-circuit truthiness evaluation.'
    },
    problemIds: ['reverse-linked-list']
  },
  {
    day: 7,
    phase: 'Foundations & Linear Memory',
    phaseNumber: 1,
    title: 'Singly & Doubly Linked Lists & Memory Ownership',
    summary: 'Manipulate heap-allocated nodes, pointer redirection, dummy head sentinel nodes, and RAII / garbage collection.',
    estimatedMinutes: 50,
    coreConcepts: ['Sentinel / Dummy Nodes', 'Pointer Reversal', 'Memory Leaks vs Garbage Collection', 'Cache Misses'],
    languageHighlights: {
      cpp: 'Raw pointers vs std::unique_ptr; manual delete vs RAII memory deallocation; each node causes a cache miss.',
      python: 'Node objects managed by reference counting; cyclic references handled by generational garbage collector.'
    },
    problemIds: ['reverse-linked-list']
  },

  // Phase 2: Sequential & Non-Linear Access (Days 8 - 14)
  {
    day: 8,
    phase: 'Sequential & Non-Linear Access',
    phaseNumber: 2,
    title: 'Stacks & Monotonic Stack Pattern',
    summary: 'LIFO evaluation, bracket validation, and finding Next Greater / Smaller Elements in linear time.',
    estimatedMinutes: 45,
    coreConcepts: ['LIFO Property', 'Monotonic Increasing/Decreasing Stacks', 'Parentheses Parsing', 'O(N) Amortized Pops'],
    languageHighlights: {
      cpp: 'std::stack wraps std::deque by default; std::vector with push_back and pop_back is often faster.',
      python: 'list.append() and list.pop() provide optimal O(1) stack operations.'
    },
    problemIds: ['valid-parentheses']
  },
  {
    day: 9,
    phase: 'Sequential & Non-Linear Access',
    phaseNumber: 2,
    title: 'Queues, Deques & Monotonic Deque',
    summary: 'FIFO buffer operations, sliding window maximums, and circular buffer architectures.',
    estimatedMinutes: 50,
    coreConcepts: ['FIFO Property', 'std::deque Chunked Array', 'collections.deque Doubly-Linked List', 'Sliding Window Max'],
    languageHighlights: {
      cpp: 'std::deque uses a central array of pointers to fixed-size pages (512 bytes each), avoiding full buffer reallocations.',
      python: 'collections.deque is a doubly-linked list of blocks with O(1) pops and appends from either side.'
    },
    problemIds: ['valid-parentheses']
  },
  {
    day: 10,
    phase: 'Sequential & Non-Linear Access',
    phaseNumber: 2,
    title: 'Binary Search Fundamentals & Boundary Conditions',
    summary: 'Logarithmic search space elimination, integer overflow prevention, and bisect insertion predicates.',
    estimatedMinutes: 40,
    coreConcepts: ['Interval Bisecting', 'Integer Overflow Prevention', 'Loop Invariants (low <= high)', 'Insertion Index'],
    languageHighlights: {
      cpp: 'mid = low + (high - low) / 2 prevents 32-bit int overflow; std::lower_bound and std::upper_bound in <algorithm>.',
      python: '(low + high) // 2 does not overflow due to arbitrary precision; bisect module offers bisect_left / right.'
    },
    problemIds: ['binary-search']
  },
  {
    day: 11,
    phase: 'Sequential & Non-Linear Access',
    phaseNumber: 2,
    title: 'Binary Search on Solution Space (Search on Answer)',
    summary: 'Apply binary search to monotonic feasibility predicates: Koko Eating Bananas, Capacity To Ship Packages.',
    estimatedMinutes: 50,
    coreConcepts: ['Monotonic Predicate Function', 'Discrete Feasibility Range', 'Upper/Lower Bound Minimization'],
    languageHighlights: {
      cpp: 'Lambda functions for predicates: auto canEatAll = [&](int speed) -> bool { ... };',
      python: 'Helper functions or closures with math.ceil() for day/time allocations.'
    },
    problemIds: ['binary-search']
  },
  {
    day: 12,
    phase: 'Sequential & Non-Linear Access',
    phaseNumber: 2,
    title: 'Binary Trees & Traversals (DFS vs BFS)',
    summary: 'Tree node representations, Pre-order, In-order, Post-order DFS traversals, and Queue-based BFS level order.',
    estimatedMinutes: 50,
    coreConcepts: ['Hierarchical Data Structures', 'Call Stack Frames', 'Level-Order BFS Queue', 'Tree Depth and Height'],
    languageHighlights: {
      cpp: 'std::swap on tree pointers; pass-by-reference for accumulating traversal vectors without deep copies.',
      python: 'Recursive DFS with default mutable argument hazard avoidance; collections.deque for BFS.'
    },
    problemIds: ['invert-binary-tree']
  },
  {
    day: 13,
    phase: 'Sequential & Non-Linear Access',
    phaseNumber: 2,
    title: 'Binary Search Trees (BST Properties & Inorder Invariant)',
    summary: 'BST validation, inorder sorted property, lowest common ancestor, and BST node deletion.',
    estimatedMinutes: 50,
    coreConcepts: ['BST Inorder Monotonicity', 'Range Bounds (-inf, +inf)', 'LCA in BST', 'O(H) Search Time'],
    languageHighlights: {
      cpp: 'std::numeric_limits<long long>::min() for BST boundary validation.',
      python: 'float("-inf") and float("inf") for clean recursive boundary validation.'
    },
    problemIds: ['invert-binary-tree']
  },
  {
    day: 14,
    phase: 'Sequential & Non-Linear Access',
    phaseNumber: 2,
    title: 'Heaps & Priority Queues (Min vs Max Heaps)',
    summary: 'Binary heap array representation, sink/swim sift operations, and maintaining Top-K elements.',
    estimatedMinutes: 55,
    coreConcepts: ['Binary Heap Array Indices (2i+1, 2i+2)', 'Max-Heap vs Min-Heap', 'Top-K Pattern', 'O(N log K) Complexity'],
    languageHighlights: {
      cpp: 'std::priority_queue is max-heap by default; use std::greater<int> for min-heap.',
      python: 'heapq is min-heap by default; negate values (-x) to simulate a max-heap.'
    },
    problemIds: ['kth-largest-element-in-an-array']
  },

  // Phase 3: Recursive & Graph Exploration (Days 15 - 20)
  {
    day: 15,
    phase: 'Recursive & Graph Exploration',
    phaseNumber: 3,
    title: 'Backtracking & Combinatorial Subsets',
    summary: 'Decision trees, recursion call stack frames, state push, recurse, and state pop / backtrack mechanics.',
    estimatedMinutes: 50,
    coreConcepts: ['State Space Tree', 'Choice / Explore / Unchoose', 'Pass-by-Reference Backtracking', 'Combination Generation'],
    languageHighlights: {
      cpp: 'Mutate a single std::vector<int>& path by calling push_back and pop_back; push copy to results: res.push_back(path).',
      python: 'path.append(x) then path.pop(); append copy using res.append(path[:]) or path.copy().'
    },
    problemIds: ['two-sum']
  },
  {
    day: 16,
    phase: 'Recursive & Graph Exploration',
    phaseNumber: 3,
    title: 'Backtracking with Constraints & Pruning',
    summary: 'Pruning invalid branches early, skipping duplicate elements with sorting, and N-Queens constraint grids.',
    estimatedMinutes: 55,
    coreConcepts: ['Branch & Bound Pruning', 'Duplicate Element Skipping (i > start && nums[i] == nums[i-1])', 'Bitmask Row Checking'],
    languageHighlights: {
      cpp: 'Sort initial vector with std::sort; early return on sum > target cuts branching factor exponentially.',
      python: 'nums.sort(); early loop break on sorted array.'
    },
    problemIds: ['two-sum']
  },
  {
    day: 17,
    phase: 'Recursive & Graph Exploration',
    phaseNumber: 3,
    title: 'Graph Representations & BFS Traversal',
    summary: 'Adjacency list vs matrix, visited sets, level-order grid exploration, and connected components.',
    estimatedMinutes: 55,
    coreConcepts: ['Adjacency List', 'Breadth-First Search (Queue)', 'Visited Tracking', 'Grid 4-Directional Vectors (dx, dy)'],
    languageHighlights: {
      cpp: 'std::vector<std::vector<int>> adj; direction arrays const int dr[] = {-1, 0, 1, 0}, dc[] = {0, 1, 0, -1}.',
      python: 'collections.defaultdict(list); directions [(0, 1), (1, 0), (0, -1), (-1, 0)].'
    },
    problemIds: ['binary-search']
  },
  {
    day: 18,
    phase: 'Recursive & Graph Exploration',
    phaseNumber: 3,
    title: 'Graph DFS & Topological Sorting',
    summary: 'Directed Acyclic Graphs (DAG), cycle detection with 3-color states, and Kahn\'s in-degree BFS algorithm.',
    estimatedMinutes: 60,
    coreConcepts: ['DAG Properties', 'In-degree Array', 'Kahn\'s Algorithm', '3-State Visited (Unvisited, Visiting, Visited)'],
    languageHighlights: {
      cpp: 'std::vector<int> inDegree(n, 0); queue<int> zeroInDegree; push to order when inDegree becomes 0.',
      python: 'in_degree = [0] * n; collections.deque([i for i in range(n) if in_degree[i] == 0]).'
    },
    problemIds: ['binary-search']
  },
  {
    day: 19,
    phase: 'Recursive & Graph Exploration',
    phaseNumber: 3,
    title: 'Shortest Path Algorithms (Dijkstra & BFS Weight 1)',
    summary: 'Priority queue-based single-source shortest path for non-negative edge weights; relaxation conditions.',
    estimatedMinutes: 60,
    coreConcepts: ['Greedy Edge Relaxation', 'Dijkstra Priority Queue (dist, node)', 'Unweighted vs Weighted Graphs', 'O(E log V)'],
    languageHighlights: {
      cpp: 'std::priority_queue<pair<int, int>, vector<pair<int, int>>, greater<>> stores {distance, node}.',
      python: 'heapq.heappush(pq, (dist, node)) naturally sorts by distance tuple key.'
    },
    problemIds: ['kth-largest-element-in-an-array']
  },
  {
    day: 20,
    phase: 'Recursive & Graph Exploration',
    phaseNumber: 3,
    title: 'Disjoint Set Union (Union-Find with Rank & Path Compression)',
    summary: 'Near O(1) amortized set merging and connectivity queries; Kruskal\'s Minimum Spanning Tree and cycle checks.',
    estimatedMinutes: 50,
    coreConcepts: ['Union by Rank / Size', 'Recursive Path Compression', 'Inverse Ackermann α(N)', 'Dynamic Connectivity'],
    languageHighlights: {
      cpp: 'int find(int i) { return parent[i] == i ? i : parent[i] = find(parent[i]); } (Path compression).',
      python: 'def find(self, i): if self.parent[i] != i: self.parent[i] = self.find(self.parent[i])'
    },
    problemIds: ['binary-search']
  },

  // Phase 4: Dynamic Programming & Capstone (Days 21 - 30)
  {
    day: 21,
    phase: 'Dynamic Programming & Capstone',
    phaseNumber: 4,
    title: 'Dynamic Programming Foundations (Memoization vs Tabulation)',
    summary: 'Identify overlapping subproblems and optimal substructure; convert recursive trees to rolling DP arrays.',
    estimatedMinutes: 45,
    coreConcepts: ['Overlapping Subproblems', 'Top-Down Memoization', 'Bottom-Up Tabulation', 'Space Optimization from O(N) to O(1)'],
    languageHighlights: {
      cpp: 'Pass memo table by reference or use static array std::vector<int> memo(n+1, -1).',
      python: '@functools.lru_cache(None) decorator automatically memoizes recursive functions in C.'
    },
    problemIds: ['climbing-stairs']
  },
  {
    day: 22,
    phase: 'Dynamic Programming & Capstone',
    phaseNumber: 4,
    title: '1D Dynamic Programming (Unbounded & Choice Patterns)',
    summary: 'Coin Change, House Robber, and Longest Increasing Subsequence; optimal state transition definitions.',
    estimatedMinutes: 55,
    coreConcepts: ['1D DP State Definition', 'Infinity Sentinel Bounds', 'Take vs Skip Transition', 'Unbounded Knapsack Form'],
    languageHighlights: {
      cpp: 'Initialize with amount + 1 rather than INT_MAX to prevent 32-bit arithmetic overflow.',
      python: 'dp = [amount + 1] * (amount + 1) creates list of size amount + 1.'
    },
    problemIds: ['coin-change']
  },
  {
    day: 23,
    phase: 'Dynamic Programming & Capstone',
    phaseNumber: 4,
    title: '2D Dynamic Programming (Grid Paths & Alignment)',
    summary: 'Unique Paths and Longest Common Subsequence; row-by-row state propagation and space rolling.',
    estimatedMinutes: 55,
    coreConcepts: ['2D DP Table (M x N)', 'Grid Boundary Conditions', 'Space Optimization to Single Row O(N)', 'String Alignment'],
    languageHighlights: {
      cpp: 'Flatten 2D vector to 1D vector: dp[j] = dp[j] + dp[j-1] for optimal cache memory line usage.',
      python: 'prev_row and curr_row list swaps avoid full matrix allocations.'
    },
    problemIds: ['coin-change']
  },
  {
    day: 24,
    phase: 'Dynamic Programming & Capstone',
    phaseNumber: 4,
    title: '0/1 Knapsack & Subset Sum Equivalence',
    summary: 'Classic 0/1 Knapsack formulation; iterating backwards on 1D DP array to prevent multiple item reuses.',
    estimatedMinutes: 55,
    coreConcepts: ['0/1 Knapsack Invariant', 'Reverse Iteration Trick', 'Target Sum Transformation', 'Boolean DP Arrays'],
    languageHighlights: {
      cpp: 'for (int j = target; j >= num; --j) dp[j] = dp[j] || dp[j - num];',
      python: 'for j in range(target, num - 1, -1): dp[j] = dp[j] or dp[j - num]'
    },
    problemIds: ['coin-change']
  },
  {
    day: 25,
    phase: 'Dynamic Programming & Capstone',
    phaseNumber: 4,
    title: 'Tries (Prefix Trees) & Word Dictionaries',
    summary: 'Multiway tree for efficient string prefix lookups; fixed pointer arrays vs hash map child nodes.',
    estimatedMinutes: 50,
    coreConcepts: ['TrieNode Struct', 'Child Array children[26]', 'isEndOfWord Flag', 'Prefix Matching in O(L)'],
    languageHighlights: {
      cpp: 'TrieNode* children[26] = {}; memset to nullptr; fast index calculation char - \'a\'.',
      python: 'Nested dictionaries self.root = {} or custom TrieNode class.'
    },
    problemIds: ['valid-parentheses']
  },
  {
    day: 26,
    phase: 'Dynamic Programming & Capstone',
    phaseNumber: 4,
    title: 'Greedy Algorithms & Interval Scheduling',
    summary: 'Local optimal choices yielding global optima; sorting intervals by start vs end time, merging overlaps.',
    estimatedMinutes: 45,
    coreConcepts: ['Greedy Choice Property', 'Interval Sorting', 'Overlap Detection (curr.start <= prev.end)', 'In-Place Merging'],
    languageHighlights: {
      cpp: 'std::sort with lambda comparator: std::sort(intervals.begin(), intervals.end());',
      python: 'intervals.sort(key=lambda x: x[0]) performs Timsort in O(N log N).'
    },
    problemIds: ['best-time-to-buy-and-sell-stock']
  },
  {
    day: 27,
    phase: 'Dynamic Programming & Capstone',
    phaseNumber: 4,
    title: 'Bit Manipulation & Bitmasks',
    summary: 'XOR properties (x ^ x = 0), clearing lowest set bit (n & (n - 1)), two\'s complement, and subset bitmasks.',
    estimatedMinutes: 40,
    coreConcepts: ['Bitwise Operators (&, |, ^, ~, <<, >>)', 'XOR Cancellation Invariant', 'Brian Kernighan\'s Algorithm', 'Bitmask Representation'],
    languageHighlights: {
      cpp: '__builtin_popcount(x) executes hardware CPU POPCNT instruction in 1 cycle.',
      python: 'bin(x).count("1") or x.bit_count() in Python 3.10+.'
    },
    problemIds: ['two-sum']
  },
  {
    day: 28,
    phase: 'Dynamic Programming & Capstone',
    phaseNumber: 4,
    title: 'String Algorithms & Rolling Hash (Rabin-Karp)',
    summary: 'Polynomial rolling hash for linear substring search; handling hash collisions with double modulus.',
    estimatedMinutes: 50,
    coreConcepts: ['Polynomial Rolling Hash', 'Sliding Window Hash Updates', 'Modular Arithmetic & Collisions', 'KMP Prefix Function'],
    languageHighlights: {
      cpp: 'unsigned long long arithmetic automatically wraps around 2^64 (free modulo); std::string_view for zero-copy slicing.',
      python: 'Slicing s[i:i+k] creates a copy; rolling hash avoids string allocations.'
    },
    problemIds: ['valid-parentheses']
  },
  {
    day: 29,
    phase: 'Dynamic Programming & Capstone',
    phaseNumber: 4,
    title: 'Advanced Systems Memory & LRU Cache Architecture',
    summary: 'Design an O(1) Least Recently Used cache combining doubly-linked lists with hash maps; move semantics and cache locality.',
    estimatedMinutes: 60,
    coreConcepts: ['Composite Data Structures', 'Doubly Linked List + Hash Map', 'O(1) Get and Put', 'C++ std::move Semantics'],
    languageHighlights: {
      cpp: 'std::list<pair<int, int>> combined with unordered_map<int, list::iterator>; std::move eliminates copying overhead.',
      python: 'collections.OrderedDict implements LRU in C; custom Node + dict demonstrates internal mechanics.'
    },
    problemIds: ['reverse-linked-list']
  },
  {
    day: 30,
    phase: 'Dynamic Programming & Capstone',
    phaseNumber: 4,
    title: 'Tech Interview Simulation & Capstone Evaluation',
    summary: 'Timed multi-problem interview gauntlet; Trapping Rain Water, algorithmic trade-off discussions, and final certification.',
    estimatedMinutes: 75,
    coreConcepts: ['Full Interview Communication Framework', 'Two Pointers Trapping Water', 'Monotonic Stack Alternative', 'Space/Time Rigor'],
    languageHighlights: {
      cpp: 'Complete implementation clean code without macros or magic numbers; defensive edge-case assertions.',
      python: 'Idiomatic Pythonic patterns; clean type annotations with typing.List, Optional, Tuple.'
    },
    problemIds: ['best-time-to-buy-and-sell-stock', 'two-sum-ii-input-array-is-sorted']
  }
];

export const getRoadmapDay = (dayNumber: number): RoadmapDay | undefined => {
  return ROADMAP_DAYS.find(d => d.day === dayNumber);
};
