import { Problem } from '@/types';

export const PROBLEMS_DATA: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays & Hashing',
    day: 1,
    timeEstimateMinutes: 30,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return *indices of the two numbers such that they add up to \`target\`*.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
      },
      {
        input: 'nums = [3, 3], target = 6',
        output: '[0, 1]'
      }
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    bigOTarget: {
      time: 'O(N)',
      space: 'O(N)',
      explanation: 'Single-pass hash table lookup achieves linear time at the cost of O(N) auxiliary space.'
    },
    languageComparison: {
      cppExplanation: `In C++, use \`std::unordered_map<int, int>\`. It uses separate chaining under the hood with buckets. Lookup and insertion are amortized O(1). Be mindful of rehashing overhead if capacity is exceeded. Use \`.find()\` or \`.count()\` to check key existence before accessing.`,
      pythonExplanation: `In Python, use a standard \`dict\`. Python dictionaries use compact open addressing with quadratic probing, offering exceptional cache locality and speed. Key existence is checked simply with \`complement in num_map\`.`,
      memoryComparison: `C++ \`std::vector<int>\` stores 32-bit integers contiguously in heap memory with virtually zero per-element overhead (4 bytes/element). Python's \`list\` is an array of pointers to \`PyLongObject\` structs, consuming ~28 bytes per integer plus pointer overhead (~8 bytes).`,
      keyStlVsBuiltin: [
        {
          feature: 'Hash Table',
          cpp: 'std::unordered_map<int, int> map;',
          python: 'num_map = {}',
          complexityNotes: 'Both amortized O(1) average lookup; O(N) worst-case on hash collisions.'
        },
        {
          feature: 'Key Lookup',
          cpp: 'if (map.find(comp) != map.end())',
          python: 'if comp in num_map:',
          complexityNotes: 'C++ iterator check vs Python __contains__ operator.'
        },
        {
          feature: 'Return Type',
          cpp: 'return {map[comp], i}; (std::vector<int>)',
          python: 'return [num_map[comp], i] (list)',
          complexityNotes: 'Initializer list initialization in C++11 vs Python list literal.'
        }
      ],
      pitfalls: [
        'C++: Using map[key] directly creates a default entry if key does not exist; always check with find() or count() first.',
        'Python: Using dict[key] raises KeyError if not found.',
        'Reusing the exact same index twice: ensure you do not pair an element with itself.'
      ]
    },
    starterCode: {
      cpp: `#include <vector>
#include <unordered_map>
#include <iostream>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        // Your code here
        std::unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
      python: `from typing import List

class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Your code here
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i
        return []`
    },
    testCases: [
      {
        id: 1,
        input: 'nums = [2, 7, 11, 15], target = 9',
        expectedOutput: '[0, 1]'
      },
      {
        id: 2,
        input: 'nums = [3, 2, 4], target = 6',
        expectedOutput: '[1, 2]'
      },
      {
        id: 3,
        input: 'nums = [3, 3], target = 6',
        expectedOutput: '[0, 1]'
      },
      {
        id: 4,
        input: 'nums = [-1, -2, -3, -4, -5], target = -8',
        expectedOutput: '[2, 4]',
        isHidden: true
      }
    ],
    hints: [
      {
        level: 1,
        title: 'Conceptual Guidance',
        explanation: 'Think about how you can check previously seen numbers in O(1) time without nested scanning.',
        leadingQuestion: 'What data structure allows fast key lookups to remember where we saw each number?'
      },
      {
        level: 2,
        title: 'Strategy & Invariant',
        explanation: 'For any number x, the number required to reach target is (target - x). As you iterate from left to right, check if (target - x) is already recorded in a hash map.',
        leadingQuestion: 'What should be the key, and what should be the value in your hash map?'
      },
      {
        level: 3,
        title: 'Syntax Scaffolding',
        explanation: 'Store {num: index} in a hash map (unordered_map in C++, dict in Python). If complement is found, return [map[complement], currentIndex]. Otherwise store current num and proceed.',
        leadingQuestion: 'Did you remember to check the map before inserting the current number so you avoid matching an element with itself?'
      }
    ],
    editorial: {
      approach: 'Single-Pass Hash Table',
      cppSolution: `class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& nums, int target) {
        std::unordered_map<int, int> hash;
        for (int i = 0; i < nums.size(); ++i) {
            int complement = target - nums[i];
            auto it = hash.find(complement);
            if (it != hash.end()) {
                return {it->second, i};
            }
            hash[nums[i]] = i;
        }
        return {};
    }
};`,
      pythonSolution: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, val in enumerate(nums):
            complement = target - val
            if complement in seen:
                return [seen[complement], i]
            seen[val] = i
        return []`,
      complexityAnalysis: {
        time: 'O(N): We traverse the list containing N elements exactly once. Each hash table lookup costs O(1) on average.',
        space: 'O(N): The hash table stores up to N key-value pairs.'
      }
    },
    visualizerSteps: [
      {
        stepIndex: 1,
        description: 'Initialize hash map: seen = {}. Inspect index 0: nums[0] = 2.',
        activeVariables: { i: 0, num: 2, complement: 7, found: false },
        cppMemory: {
          stackFrames: [
            {
              functionName: 'twoSum(nums, target=9)',
              variables: [
                { name: 'target', type: 'int', address: '0x7ffd01', value: '9' },
                { name: 'i', type: 'int', address: '0x7ffd05', value: '0' },
                { name: 'complement', type: 'int', address: '0x7ffd09', value: '7' },
                { name: 'seen', type: 'std::unordered_map<int, int>', address: '0x7ffd10', value: 'size=0, buckets=8', pointsTo: '0x10a000' }
              ]
            }
          ],
          heapBlocks: [
            { address: '0x10a000', type: 'bucket_array', size: '64 bytes', data: '[empty, empty, empty, ...]' }
          ]
        },
        pythonMemory: {
          namespaces: [
            {
              scope: 'local: twoSum',
              bindings: [
                { variableName: 'nums', targetObjectId: 'obj_nums' },
                { variableName: 'seen', targetObjectId: 'obj_dict' },
                { variableName: 'i', targetObjectId: 'obj_0' },
                { variableName: 'complement', targetObjectId: 'obj_7' }
              ]
            }
          ],
          objects: [
            { id: 'obj_nums', type: 'list', value: ['2', '7', '11', '15'], refCount: 1 },
            { id: 'obj_dict', type: 'dict', value: '{}', refCount: 1 },
            { id: 'obj_7', type: 'int', value: '7', refCount: 1 }
          ]
        },
        dsState: {
          type: 'array',
          data: [2, 7, 11, 15],
          pointers: [{ name: 'i', index: 0, color: '#3b82f6' }],
          highlightedIndices: [0]
        }
      },
      {
        stepIndex: 2,
        description: 'Complement 7 not in seen. Add 2 -> 0 to hash table. seen = {2: 0}. Move to index 1.',
        activeVariables: { i: 1, num: 7, complement: 2, found: true },
        cppMemory: {
          stackFrames: [
            {
              functionName: 'twoSum(nums, target=9)',
              variables: [
                { name: 'target', type: 'int', address: '0x7ffd01', value: '9' },
                { name: 'i', type: 'int', address: '0x7ffd05', value: '1' },
                { name: 'complement', type: 'int', address: '0x7ffd09', value: '2' },
                { name: 'seen', type: 'std::unordered_map<int, int>', address: '0x7ffd10', value: 'size=1', pointsTo: '0x10a000' }
              ]
            }
          ],
          heapBlocks: [
            { address: '0x10a000', type: 'hash_node', size: '24 bytes', data: '{key: 2, val: 0, next: nullptr}' }
          ]
        },
        pythonMemory: {
          namespaces: [
            {
              scope: 'local: twoSum',
              bindings: [
                { variableName: 'nums', targetObjectId: 'obj_nums' },
                { variableName: 'seen', targetObjectId: 'obj_dict' },
                { variableName: 'i', targetObjectId: 'obj_1' },
                { variableName: 'complement', targetObjectId: 'obj_2' }
              ]
            }
          ],
          objects: [
            { id: 'obj_dict', type: 'dict', value: '{2: 0}', refCount: 1 }
          ]
        },
        dsState: {
          type: 'array',
          data: [2, 7, 11, 15],
          pointers: [{ name: 'i', index: 1, color: '#10b981' }],
          highlightedIndices: [0, 1]
        }
      },
      {
        stepIndex: 3,
        description: 'Found complement 2 in seen at index 0! Return [0, 1].',
        activeVariables: { i: 1, complement: 2, matchIndex: 0, result: '[0, 1]' },
        cppMemory: {
          stackFrames: [
            {
              functionName: 'twoSum(nums, target=9)',
              variables: [
                { name: 'return_val', type: 'std::vector<int>', address: '0x7ffd20', value: '[0, 1]' }
              ]
            }
          ],
          heapBlocks: []
        },
        pythonMemory: {
          namespaces: [
            {
              scope: 'local: twoSum',
              bindings: [{ variableName: 'return', targetObjectId: 'obj_res' }]
            }
          ],
          objects: [
            { id: 'obj_res', type: 'list', value: ['0', '1'], refCount: 1 }
          ]
        },
        dsState: {
          type: 'array',
          data: [2, 7, 11, 15],
          pointers: [
            { name: 'match', index: 0, color: '#10b981' },
            { name: 'current', index: 1, color: '#6366f1' }
          ],
          highlightedIndices: [0, 1]
        }
      }
    ]
  },
  {
    id: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: 'Arrays & Sliding Window',
    day: 2,
    timeEstimateMinutes: 30,
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i-th\` day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return *the maximum profit you can achieve from this transaction*. If you cannot achieve any profit, return \`0\`.`,
    examples: [
      {
        input: 'prices = [7, 1, 5, 3, 6, 4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6 - 1 = 5. Note buying on day 2 and selling on day 1 is not allowed.'
      },
      {
        input: 'prices = [7, 6, 4, 3, 1]',
        output: '0',
        explanation: 'In this case, no transactions are done and the max profit = 0.'
      }
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4'
    ],
    bigOTarget: {
      time: 'O(N)',
      space: 'O(1)',
      explanation: 'Single pass keeping track of the minimum buy price and maximum recorded profit in constant extra space.'
    },
    languageComparison: {
      cppExplanation: `In C++, track \`minPrice = INT_MAX\` and \`maxProfit = 0\` as primitives on the stack. \`std::min\` and \`std::max\` in \`<algorithm>\` compile down to fast conditional move instructions (\`cmov\`).`,
      pythonExplanation: `In Python, initialize \`min_price = float('inf')\` and \`max_profit = 0\`. Python's \`min()\` and \`max()\` functions are builtins written in C.`,
      memoryComparison: `C++ stores \`minPrice\` and \`maxProfit\` as two 32-bit registers/stack variables (8 bytes total). In Python, variable names point to float and int PyObjects on the heap.`,
      keyStlVsBuiltin: [
        {
          feature: 'Infinity Representation',
          cpp: 'INT_MAX (#include <climits>) or std::numeric_limits<int>::max()',
          python: 'float("inf")',
          complexityNotes: 'C++ integer limits avoid floating-point comparisons.'
        },
        {
          feature: 'Min/Max Updates',
          cpp: 'maxProfit = std::max(maxProfit, price - minPrice);',
          python: 'max_profit = max(max_profit, price - min_price)',
          complexityNotes: 'Both execute in O(1).'
        }
      ],
      pitfalls: [
        'Selling before buying: remember you can only sell in the future, so the loop must flow chronologically.',
        'Negative profit: ensure initial max profit is 0, not a negative number.'
      ]
    },
    starterCode: {
      cpp: `#include <vector>
#include <algorithm>
#include <climits>

class Solution {
public:
    int maxProfit(std::vector<int>& prices) {
        int minPrice = INT_MAX;
        int maxProfit = 0;
        for (int price : prices) {
            if (price < minPrice) {
                minPrice = price;
            } else {
                maxProfit = std::max(maxProfit, price - minPrice);
            }
        }
        return maxProfit;
    }
};`,
      python: `from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        min_price = float('inf')
        max_profit = 0
        for price in prices:
            if price < min_price:
                min_price = price
            else:
                max_profit = max(max_profit, price - min_price)
        return max_profit`
    },
    testCases: [
      {
        id: 1,
        input: 'prices = [7, 1, 5, 3, 6, 4]',
        expectedOutput: '5'
      },
      {
        id: 2,
        input: 'prices = [7, 6, 4, 3, 1]',
        expectedOutput: '0'
      },
      {
        id: 3,
        input: 'prices = [2, 4, 1]',
        expectedOutput: '2'
      }
    ],
    hints: [
      {
        level: 1,
        title: 'Intuition',
        explanation: 'If you want to sell today, which day should you have bought on? The day with the cheapest price prior to today!',
        leadingQuestion: 'Can we maintain the lowest price we have seen so far in a single variable?'
      },
      {
        level: 2,
        title: 'Strategy & Invariant',
        explanation: 'Maintain two scalar variables: minPrice (lowest price seen so far) and maxProfit (highest profit found). For each price, compute (price - minPrice) and update maxProfit.',
        leadingQuestion: 'What should happen if the current price is strictly lower than minPrice?'
      },
      {
        level: 3,
        title: 'Scaffolding',
        explanation: 'Loop through prices. If price < minPrice, update minPrice. Else, maxProfit = max(maxProfit, price - minPrice). Return maxProfit.',
        leadingQuestion: 'Are you using any extra array? Notice O(1) space is sufficient!'
      }
    ],
    editorial: {
      approach: 'One-Pass Greedy / Sliding Minimum',
      cppSolution: `class Solution {
public:
    int maxProfit(std::vector<int>& prices) {
        int minPrice = INT_MAX;
        int maxProfit = 0;
        for (int p : prices) {
            if (p < minPrice) minPrice = p;
            else maxProfit = std::max(maxProfit, p - minPrice);
        }
        return maxProfit;
    }
};`,
      pythonSolution: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        min_price = float('inf')
        max_profit = 0
        for p in prices:
            if p < min_price:
                min_price = p
            elif p - min_price > max_profit:
                max_profit = p - min_price
        return max_profit`,
      complexityAnalysis: {
        time: 'O(N): Single pass through the prices array.',
        space: 'O(1): Only two primitive variables.'
      }
    },
    visualizerSteps: [
      {
        stepIndex: 1,
        description: 'Day 0: price = 7. minPrice = 7, maxProfit = 0.',
        activeVariables: { day: 0, price: 7, minPrice: 7, maxProfit: 0 },
        cppMemory: {
          stackFrames: [
            {
              functionName: 'maxProfit',
              variables: [
                { name: 'minPrice', type: 'int', address: '0x7ffe04', value: '7' },
                { name: 'maxProfit', type: 'int', address: '0x7ffe08', value: '0' }
              ]
            }
          ],
          heapBlocks: []
        },
        pythonMemory: {
          namespaces: [
            {
              scope: 'local: maxProfit',
              bindings: [
                { variableName: 'min_price', targetObjectId: 'obj_7' },
                { variableName: 'max_profit', targetObjectId: 'obj_0' }
              ]
            }
          ],
          objects: [
            { id: 'obj_7', type: 'int', value: '7', refCount: 2 },
            { id: 'obj_0', type: 'int', value: '0', refCount: 1 }
          ]
        },
        dsState: {
          type: 'array',
          data: [7, 1, 5, 3, 6, 4],
          pointers: [{ name: 'minPrice', index: 0, color: '#ef4444' }],
          highlightedIndices: [0]
        }
      },
      {
        stepIndex: 2,
        description: 'Day 1: price = 1. price < minPrice (1 < 7). New lowest buy point: minPrice = 1.',
        activeVariables: { day: 1, price: 1, minPrice: 1, maxProfit: 0 },
        cppMemory: {
          stackFrames: [
            {
              functionName: 'maxProfit',
              variables: [
                { name: 'minPrice', type: 'int', address: '0x7ffe04', value: '1' },
                { name: 'maxProfit', type: 'int', address: '0x7ffe08', value: '0' }
              ]
            }
          ],
          heapBlocks: []
        },
        pythonMemory: {
          namespaces: [
            {
              scope: 'local: maxProfit',
              bindings: [
                { variableName: 'min_price', targetObjectId: 'obj_1' },
                { variableName: 'max_profit', targetObjectId: 'obj_0' }
              ]
            }
          ],
          objects: [
            { id: 'obj_1', type: 'int', value: '1', refCount: 2 }
          ]
        },
        dsState: {
          type: 'array',
          data: [7, 1, 5, 3, 6, 4],
          pointers: [{ name: 'minPrice', index: 1, color: '#ef4444' }],
          highlightedIndices: [1]
        }
      },
      {
        stepIndex: 3,
        description: 'Day 4: price = 6. Potential profit = 6 - 1 = 5. New maxProfit = 5!',
        activeVariables: { day: 4, price: 6, minPrice: 1, maxProfit: 5 },
        cppMemory: {
          stackFrames: [
            {
              functionName: 'maxProfit',
              variables: [
                { name: 'minPrice', type: 'int', address: '0x7ffe04', value: '1' },
                { name: 'maxProfit', type: 'int', address: '0x7ffe08', value: '5' }
              ]
            }
          ],
          heapBlocks: []
        },
        pythonMemory: {
          namespaces: [
            {
              scope: 'local: maxProfit',
              bindings: [
                { variableName: 'min_price', targetObjectId: 'obj_1' },
                { variableName: 'max_profit', targetObjectId: 'obj_5' }
              ]
            }
          ],
          objects: [
            { id: 'obj_5', type: 'int', value: '5', refCount: 1 }
          ]
        },
        dsState: {
          type: 'array',
          data: [7, 1, 5, 3, 6, 4],
          pointers: [
            { name: 'buy', index: 1, color: '#10b981' },
            { name: 'sell', index: 4, color: '#6366f1' }
          ],
          highlightedIndices: [1, 4]
        }
      }
    ]
  },
  {
    id: 'two-sum-ii-input-array-is-sorted',
    title: 'Two Sum II - Input Array Is Sorted',
    difficulty: 'Medium',
    category: 'Two Pointers',
    day: 3,
    timeEstimateMinutes: 35,
    description: `Given a **1-indexed** array of integers \`numbers\` that is already **sorted in non-decreasing order**, find two numbers such that they add up to a specific \`target\` number.

Return the indices of the two numbers, \`index1\` and \`index2\`, added by one as an integer array \`[index1, index2]\` of length 2.

The tests are generated such that there is **exactly one solution**. You **may not** use the same element twice.

Your solution must use only **constant O(1) extra space**.`,
    examples: [
      {
        input: 'numbers = [2, 7, 11, 15], target = 9',
        output: '[1, 2]',
        explanation: 'The sum of 2 and 7 is 9. Therefore, index1 = 1, index2 = 2. We return [1, 2].'
      },
      {
        input: 'numbers = [2, 3, 4], target = 6',
        output: '[1, 3]',
        explanation: 'The sum of 2 and 4 is 6. Therefore index1 = 1, index2 = 3. We return [1, 3].'
      },
      {
        input: 'numbers = [-1, 0], target = -1',
        output: '[1, 2]'
      }
    ],
    constraints: [
      '2 <= numbers.length <= 3 * 10^4',
      '-1000 <= numbers[i] <= 1000',
      'numbers is sorted in non-decreasing order.',
      '-1000 <= target <= 1000',
      'The tests are generated such that there is exactly one solution.'
    ],
    bigOTarget: {
      time: 'O(N)',
      space: 'O(1)',
      explanation: 'Shrinking left and right pointers towards each other based on sum comparison.'
    },
    languageComparison: {
      cppExplanation: `Use two index variables \`int left = 0, right = numbers.size() - 1;\`. Since the array is passed by \`const std::vector<int>&\`, no copy is made and elements are accessed with \`numbers[left]\` in O(1).`,
      pythonExplanation: `Use \`left, right = 0, len(numbers) - 1\`. While \`left < right\`, calculate \`curr_sum = numbers[left] + numbers[right]\`.`,
      memoryComparison: `In C++, left and right are stored in CPU registers. Zero heap allocation is performed. In Python, integer objects are referenced.`,
      keyStlVsBuiltin: [
        {
          feature: 'Pointer Initialization',
          cpp: 'int left = 0, right = numbers.size() - 1;',
          python: 'left, right = 0, len(numbers) - 1',
          complexityNotes: 'O(1) initialization'
        },
        {
          feature: 'Return Format',
          cpp: 'return {left + 1, right + 1};',
          python: 'return [left + 1, right + 1]',
          complexityNotes: '1-indexed conversion'
        }
      ],
      pitfalls: [
        'Notice the problem asks for 1-indexed output! Remember to add 1 to both left and right.',
        'Do not use an auxiliary hash map here because the problem explicitly requires O(1) extra space.'
      ]
    },
    starterCode: {
      cpp: `#include <vector>

class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& numbers, int target) {
        int left = 0;
        int right = numbers.size() - 1;
        while (left < right) {
            int sum = numbers[left] + numbers[right];
            if (sum == target) {
                return {left + 1, right + 1};
            } else if (sum < target) {
                left++;
            } else {
                right--;
            }
        }
        return {};
    }
};`,
      python: `from typing import List

class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        left = 0
        right = len(numbers) - 1
        while left < right:
            curr_sum = numbers[left] + numbers[right]
            if curr_sum == target:
                return [left + 1, right + 1]
            elif curr_sum < target:
                left += 1
            else:
                right -= 1
        return []`
    },
    testCases: [
      {
        id: 1,
        input: 'numbers = [2, 7, 11, 15], target = 9',
        expectedOutput: '[1, 2]'
      },
      {
        id: 2,
        input: 'numbers = [2, 3, 4], target = 6',
        expectedOutput: '[1, 3]'
      },
      {
        id: 3,
        input: 'numbers = [-1, 0], target = -1',
        expectedOutput: '[1, 2]'
      }
    ],
    hints: [
      {
        level: 1,
        title: 'Two Pointers Intuition',
        explanation: 'Because the array is already sorted, if your current sum is too small, how can you increase it? If too large, how can you decrease it?',
        leadingQuestion: 'Where should your two pointers start?'
      },
      {
        level: 2,
        title: 'Shrinking Search Space',
        explanation: 'Start left at index 0 and right at index n-1. If numbers[left] + numbers[right] > target, decreasing right is the only way to lower the sum.',
        leadingQuestion: 'What if sum < target?'
      },
      {
        level: 3,
        title: 'Scaffolding',
        explanation: 'Execute a while loop with condition (left < right). Return {left + 1, right + 1} once sum == target.',
        leadingQuestion: 'Did you remember the 1-based indexing required by the output?'
      }
    ],
    editorial: {
      approach: 'Two Pointers (Bidirectional Convergence)',
      cppSolution: `class Solution {
public:
    std::vector<int> twoSum(std::vector<int>& numbers, int target) {
        int l = 0, r = numbers.size() - 1;
        while (l < r) {
            int s = numbers[l] + numbers[r];
            if (s == target) return {l + 1, r + 1};
            if (s < target) l++;
            else r--;
        }
        return {};
    }
};`,
      pythonSolution: `class Solution:
    def twoSum(self, numbers: List[int], target: int) -> List[int]:
        l, r = 0, len(numbers) - 1
        while l < r:
            s = numbers[l] + numbers[r]
            if s == target:
                return [l + 1, r + 1]
            if s < target:
                l += 1
            else:
                r -= 1
        return []`,
      complexityAnalysis: {
        time: 'O(N): Each step moves either left forward or right backward by 1, visiting at most N elements.',
        space: 'O(1): Two integer variables.'
      }
    }
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    category: 'Linked Lists',
    day: 7,
    timeEstimateMinutes: 30,
    description: `Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.`,
    examples: [
      {
        input: 'head = [1, 2, 3, 4, 5]',
        output: '[5, 4, 3, 2, 1]',
        explanation: 'The direction of all next pointers is reversed.'
      },
      {
        input: 'head = [1, 2]',
        output: '[2, 1]'
      },
      {
        input: 'head = []',
        output: '[]'
      }
    ],
    constraints: [
      'The number of nodes in the list is the range [0, 5000].',
      '-5000 <= Node.val <= 5000'
    ],
    bigOTarget: {
      time: 'O(N)',
      space: 'O(1)',
      explanation: 'Iterative 3-pointer pointer redirection operates in a single pass with O(1) auxiliary space.'
    },
    languageComparison: {
      cppExplanation: `In C++, linked list nodes are allocated on the heap via \`ListNode* node = new ListNode(val)\`. Reversing the list requires mutating raw pointers (\`curr->next = prev\`). Avoid memory leaks by ensuring references aren't orphaned before assigning next.`,
      pythonExplanation: `In Python, nodes are instances of \`ListNode\`. Modifying \`curr.next = prev\` updates the reference. Python's garbage collector automatically handles unreferenced nodes via reference counting and cyclic GC.`,
      memoryComparison: `In C++, \`ListNode\` has an \`int val\` (4 bytes) and \`ListNode* next\` (8 bytes), padding to 16 bytes per node. In Python, each \`ListNode\` instance has a \`__dict__\` or \`__slots__\` overhead, consuming ~56 bytes per node.`,
      keyStlVsBuiltin: [
        {
          feature: 'Pointer Reversal',
          cpp: 'ListNode* nextTemp = curr->next; curr->next = prev; prev = curr; curr = nextTemp;',
          python: 'next_temp = curr.next; curr.next = prev; prev = curr; curr = next_temp',
          complexityNotes: 'O(1) pointer updates'
        }
      ],
      pitfalls: [
        'Losing the next node: always save curr->next in a temporary variable before changing curr->next to prev.',
        'Forgetting that the old head now points to nullptr / None.'
      ]
    },
    starterCode: {
      cpp: `/**
 * Definition for singly-linked list.
 * struct ListNode {
 *     int val;
 *     ListNode *next;
 *     ListNode() : val(0), next(nullptr) {}
 *     ListNode(int x) : val(x), next(nullptr) {}
 *     ListNode(int x, ListNode *next) : val(x), next(next) {}
 * };
 */
class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr != nullptr) {
            ListNode* nextTemp = curr->next;
            curr->next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
};`,
      python: `# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next
class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = None
        curr = head
        while curr:
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        return prev`
    },
    testCases: [
      {
        id: 1,
        input: 'head = [1, 2, 3, 4, 5]',
        expectedOutput: '[5, 4, 3, 2, 1]'
      },
      {
        id: 2,
        input: 'head = [1, 2]',
        expectedOutput: '[2, 1]'
      },
      {
        id: 3,
        input: 'head = []',
        expectedOutput: '[]'
      }
    ],
    hints: [
      {
        level: 1,
        title: 'Pointer Direction',
        explanation: 'Imagine you are standing at node A pointing to node B. You want node A to point backwards to whatever was before A.',
        leadingQuestion: 'Before you point backwards, what will happen to the rest of the list if you do not remember where B is?'
      },
      {
        level: 2,
        title: 'Three Pointers Pattern',
        explanation: 'You need three pointer handles: prev (what is behind curr), curr (current node), and nextTemp (what is in front of curr).',
        leadingQuestion: 'What should prev be initialized to so the original head ends with null/None?'
      },
      {
        level: 3,
        title: 'Scaffolding',
        explanation: '1. nextTemp = curr.next; 2. curr.next = prev; 3. prev = curr; 4. curr = nextTemp. Loop until curr is null. Return prev.',
        leadingQuestion: 'Why do we return prev instead of curr at the end?'
      }
    ],
    editorial: {
      approach: 'Iterative 3-Pointer Inversion',
      cppSolution: `class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        ListNode* curr = head;
        while (curr) {
            ListNode* nxt = curr->next;
            curr->next = prev;
            prev = curr;
            curr = nxt;
        }
        return prev;
    }
};`,
      pythonSolution: `class Solution:
    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:
        prev = None
        curr = head
        while curr:
            nxt = curr.next
            curr.next = prev
            prev = curr
            curr = nxt
        return prev`,
      complexityAnalysis: {
        time: 'O(N): Traverses all N nodes of the list once.',
        space: 'O(1): In-place pointer modifications.'
      }
    },
    visualizerSteps: [
      {
        stepIndex: 1,
        description: 'Initial state: prev = nullptr, curr = node(1).',
        activeVariables: { prev: 'nullptr', curr: 1, 'curr.next': 2 },
        cppMemory: {
          stackFrames: [
            {
              functionName: 'reverseList',
              variables: [
                { name: 'prev', type: 'ListNode*', address: '0x7ffd00', value: 'nullptr' },
                { name: 'curr', type: 'ListNode*', address: '0x7ffd08', value: '0x2001', pointsTo: '0x2001' }
              ]
            }
          ],
          heapBlocks: [
            { address: '0x2001', type: 'ListNode', size: '16 bytes', data: '{val: 1, next: 0x2002}' },
            { address: '0x2002', type: 'ListNode', size: '16 bytes', data: '{val: 2, next: 0x2003}' },
            { address: '0x2003', type: 'ListNode', size: '16 bytes', data: '{val: 3, next: nullptr}' }
          ]
        },
        pythonMemory: {
          namespaces: [
            {
              scope: 'local: reverseList',
              bindings: [
                { variableName: 'prev', targetObjectId: 'obj_none' },
                { variableName: 'curr', targetObjectId: 'node_1' }
              ]
            }
          ],
          objects: [
            { id: 'node_1', type: 'ListNode', value: 'val=1, next->node_2', refCount: 2 }
          ]
        },
        dsState: {
          type: 'linked-list',
          data: [1, 2, 3],
          pointers: [
            { name: 'prev', nodeId: 'null', color: '#6b7280' },
            { name: 'curr', index: 0, color: '#3b82f6' }
          ]
        }
      },
      {
        stepIndex: 2,
        description: 'Save nextTemp = node(2). Redirect node(1).next -> nullptr. Advance prev to node(1), curr to node(2).',
        activeVariables: { prev: 1, curr: 2, 'curr.next': 3 },
        cppMemory: {
          stackFrames: [
            {
              functionName: 'reverseList',
              variables: [
                { name: 'prev', type: 'ListNode*', address: '0x7ffd00', value: '0x2001', pointsTo: '0x2001' },
                { name: 'curr', type: 'ListNode*', address: '0x7ffd08', value: '0x2002', pointsTo: '0x2002' }
              ]
            }
          ],
          heapBlocks: [
            { address: '0x2001', type: 'ListNode', size: '16 bytes', data: '{val: 1, next: nullptr}' },
            { address: '0x2002', type: 'ListNode', size: '16 bytes', data: '{val: 2, next: 0x2003}' }
          ]
        },
        pythonMemory: {
          namespaces: [
            {
              scope: 'local: reverseList',
              bindings: [
                { variableName: 'prev', targetObjectId: 'node_1' },
                { variableName: 'curr', targetObjectId: 'node_2' }
              ]
            }
          ],
          objects: [
            { id: 'node_1', type: 'ListNode', value: 'val=1, next->None', refCount: 2 }
          ]
        },
        dsState: {
          type: 'linked-list',
          data: [1, 2, 3],
          pointers: [
            { name: 'prev', index: 0, color: '#10b981' },
            { name: 'curr', index: 1, color: '#3b82f6' }
          ]
        }
      }
    ]
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stacks',
    day: 8,
    timeEstimateMinutes: 30,
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      },
      {
        input: 's = "([])"',
        output: 'true'
      }
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    bigOTarget: {
      time: 'O(N)',
      space: 'O(N)',
      explanation: 'Pushing opening brackets onto a stack and popping to match closing brackets.'
    },
    languageComparison: {
      cppExplanation: `In C++, use \`std::stack<char>\` or \`std::string\` as a lightweight stack. \`std::stack\` is a container adaptor wrapping \`std::deque\` by default. Operations \`push()\`, \`pop()\`, \`top()\` are O(1).`,
      pythonExplanation: `In Python, use a standard \`list\` as a stack. Methods \`append()\` and \`pop()\` operate in O(1) amortized time at the tail of the list.`,
      memoryComparison: `C++ \`std::stack<char>\` with \`std::deque\` allocates 512-byte contiguous memory blocks. A \`std::string\` stack stores bytes contiguously on the stack for SSO (Small String Optimization, <= 15 chars). Python lists allocate pointers to character PyObjects.`,
      keyStlVsBuiltin: [
        {
          feature: 'Stack Implementation',
          cpp: 'std::stack<char> st; or std::vector<char> st;',
          python: 'stack = []',
          complexityNotes: 'Push/Pop are amortized O(1)'
        },
        {
          feature: 'Top Element Peek',
          cpp: 'char top = st.top();',
          python: 'top = stack[-1]',
          complexityNotes: 'Always check if stack is empty before peeking!'
        }
      ],
      pitfalls: [
        'Calling top() or pop() on an empty stack: causes undefined behavior in C++ and IndexError in Python.',
        'Forgetting to verify if the stack is completely empty at the very end of processing.'
      ]
    },
    starterCode: {
      cpp: `#include <string>
#include <stack>
#include <unordered_map>

class Solution {
public:
    bool isValid(std::string s) {
        std::stack<char> st;
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') {
                st.push(c);
            } else {
                if (st.empty()) return false;
                char top = st.top();
                st.pop();
                if (c == ')' && top != '(') return false;
                if (c == '}' && top != '{') return false;
                if (c == ']' && top != '[') return false;
            }
        }
        return st.empty();
    }
};`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {')': '(', '}': '{', ']': '['}
        for char in s:
            if char in mapping:
                top = stack.pop() if stack else '#'
                if mapping[char] != top:
                    return False
            else:
                stack.append(char)
        return not stack`
    },
    testCases: [
      {
        id: 1,
        input: 's = "()"',
        expectedOutput: 'true'
      },
      {
        id: 2,
        input: 's = "()[]{}"',
        expectedOutput: 'true'
      },
      {
        id: 3,
        input: 's = "(]"',
        expectedOutput: 'false'
      },
      {
        id: 4,
        input: 's = "([)]"',
        expectedOutput: 'false',
        isHidden: true
      }
    ],
    hints: [
      {
        level: 1,
        title: 'LIFO Property',
        explanation: 'Which open bracket should be closed first? The one that was opened most recently!',
        leadingQuestion: 'Which data structure enforces Last-In-First-Out (LIFO)?'
      },
      {
        level: 2,
        title: 'Matching Strategy',
        explanation: 'Every time you see an open bracket, push it to a stack. When you see a closing bracket, the top of the stack must match its pair.',
        leadingQuestion: 'What does it mean if the stack is already empty when you encounter a closing bracket?'
      },
      {
        level: 3,
        title: 'Clean Implementation',
        explanation: 'Map each closing bracket to its corresponding opening bracket. If char is a closing bracket, pop from stack; if stack is empty or top does not match, return false. At the end, return stack.empty().',
        leadingQuestion: 'Can an odd-length string ever be valid?'
      }
    ],
    editorial: {
      approach: 'Stack-based LIFO Validation',
      cppSolution: `class Solution {
public:
    bool isValid(std::string s) {
        if (s.length() % 2 != 0) return false;
        std::stack<char> st;
        for (char c : s) {
            if (c == '(') st.push(')');
            else if (c == '{') st.push('}');
            else if (c == '[') st.push(']');
            else {
                if (st.empty() || st.top() != c) return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`,
      pythonSolution: `class Solution:
    def isValid(self, s: str) -> bool:
        if len(s) % 2 != 0:
            return False
        stack = []
        pairs = {')': '(', '}': '{', ']': '['}
        for c in s:
            if c in pairs:
                if not stack or stack[-1] != pairs[c]:
                    return False
                stack.pop()
            else:
                stack.append(c)
        return len(stack) == 0`,
      complexityAnalysis: {
        time: 'O(N): Each character is pushed and popped at most once.',
        space: 'O(N): In the worst case (e.g. all open brackets "((((("), stack holds N characters.'
      }
    }
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    category: 'Binary Search',
    day: 10,
    timeEstimateMinutes: 25,
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    examples: [
      {
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4.'
      },
      {
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1.'
      }
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All the integers in nums are unique.',
      'nums is sorted in ascending order.'
    ],
    bigOTarget: {
      time: 'O(log N)',
      space: 'O(1)',
      explanation: 'Repeatedly bisects search interval in half until element is found or bounds cross.'
    },
    languageComparison: {
      cppExplanation: `In C++, calculate midpoint with \`int mid = low + (high - low) / 2;\` to avoid 32-bit signed integer overflow. In the STL, \`std::binary_search\`, \`std::lower_bound\`, and \`std::upper_bound\` provide battle-tested implementations.`,
      pythonExplanation: `In Python, integers have arbitrary precision so \`(low + high) // 2\` does not overflow. The standard library provides the \`bisect\` module (\`bisect_left\`, \`bisect_right\`).`,
      memoryComparison: `C++ uses CPU registers for \`low\`, \`high\`, and \`mid\`. Zero memory allocations. Python integers are immutable PyLongObject structs on the heap.`,
      keyStlVsBuiltin: [
        {
          feature: 'Midpoint Calculation',
          cpp: 'int mid = low + (high - low) / 2;',
          python: 'mid = (low + high) // 2',
          complexityNotes: 'C++ prevents overflow with large indices.'
        },
        {
          feature: 'Standard Library Helper',
          cpp: 'auto it = std::lower_bound(nums.begin(), nums.end(), target);',
          python: 'import bisect; idx = bisect.bisect_left(nums, target)',
          complexityNotes: 'Both find insertion point in O(log N).'
        }
      ],
      pitfalls: [
        'Integer overflow: Writing (low + high) / 2 in C++ or Java can overflow if low + high > 2^31 - 1.',
        'Off-by-one infinite loop: Ensure mid is adjusted with low = mid + 1 and high = mid - 1.'
      ]
    },
    starterCode: {
      cpp: `#include <vector>

class Solution {
public:
    int search(std::vector<int>& nums, int target) {
        int low = 0;
        int high = nums.size() - 1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }
};`,
      python: `from typing import List

class Solution:
    def search(self, nums: List[int], target: int) -> int:
        low = 0
        high = len(nums) - 1
        while low <= high:
            mid = (low + high) // 2
            if nums[mid] == target:
                return mid
            elif nums[mid] < target:
                low = mid + 1
            else:
                high = mid - 1
        return -1`
    },
    testCases: [
      {
        id: 1,
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
        expectedOutput: '4'
      },
      {
        id: 2,
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2',
        expectedOutput: '-1'
      },
      {
        id: 3,
        input: 'nums = [5], target = 5',
        expectedOutput: '0'
      }
    ],
    hints: [
      {
        level: 1,
        title: 'Divide and Conquer',
        explanation: 'Because the array is sorted, comparing target with the middle element lets you discard half of the entire remaining array in one check.',
        leadingQuestion: 'What are your initial low and high pointers?'
      },
      {
        level: 2,
        title: 'Boundary Invariant',
        explanation: 'Keep low <= high. If nums[mid] < target, target must reside strictly in the right half, so low = mid + 1.',
        leadingQuestion: 'What should high be set to if nums[mid] > target?'
      },
      {
        level: 3,
        title: 'Overflow & Termination',
        explanation: 'In C++, write mid = low + (high - low) / 2. Return mid if matched. If the while loop terminates without matching, return -1.',
        leadingQuestion: 'Why is the loop condition <= rather than <?'
      }
    ],
    editorial: {
      approach: 'Classic Binary Search',
      cppSolution: `class Solution {
public:
    int search(std::vector<int>& nums, int target) {
        int l = 0, r = nums.size() - 1;
        while (l <= r) {
            int m = l + (r - l) / 2;
            if (nums[m] == target) return m;
            if (nums[m] < target) l = m + 1;
            else r = m - 1;
        }
        return -1;
    }
};`,
      pythonSolution: `class Solution:
    def search(self, nums: List[int], target: int) -> int:
        l, r = 0, len(nums) - 1
        while l <= r:
            m = (l + r) // 2
            if nums[m] == target:
                return m
            elif nums[m] < target:
                l = m + 1
            else:
                r = m - 1
        return -1`,
      complexityAnalysis: {
        time: 'O(log N): Search space is halved at each iteration.',
        space: 'O(1): Constant auxiliary space.'
      }
    }
  },
  {
    id: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    category: 'Trees',
    day: 12,
    timeEstimateMinutes: 25,
    description: `Given the \`root\` of a binary tree, invert the tree, and return *its root*.`,
    examples: [
      {
        input: 'root = [4, 2, 7, 1, 3, 6, 9]',
        output: '[4, 7, 2, 9, 6, 3, 1]',
        explanation: 'Every left child and right child are swapped at each level.'
      },
      {
        input: 'root = [2, 1, 3]',
        output: '[2, 3, 1]'
      },
      {
        input: 'root = []',
        output: '[]'
      }
    ],
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100'
    ],
    bigOTarget: {
      time: 'O(N)',
      space: 'O(H)',
      explanation: 'Visits every node once; call stack depth equals tree height H (O(log N) balanced, O(N) skewed).'
    },
    languageComparison: {
      cppExplanation: `In C++, \`std::swap(root->left, root->right)\` swaps two 64-bit pointers in place. Followed by recursive calls \`invertTree(root->left)\` and \`invertTree(root->right)\`.`,
      pythonExplanation: `In Python, parallel assignment allows \`root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)\` cleanly in one line!`,
      memoryComparison: `In C++, each recursive frame on the call stack requires ~32-48 bytes of stack memory. In Python, each function frame object consumes ~150 bytes, subject to \`sys.getrecursionlimit()\` (default 1000).`,
      keyStlVsBuiltin: [
        {
          feature: 'Pointer Swap',
          cpp: 'std::swap(root->left, root->right);',
          python: 'root.left, root.right = root.right, root.left',
          complexityNotes: 'O(1) in-place exchange'
        }
      ],
      pitfalls: [
        'Base case: forgetting to check if root is null / None causes crash on leaf children.',
        'Swapping after traversing: if you swap root.left and root.right before traversing, make sure you traverse the new positions properly.'
      ]
    },
    starterCode: {
      cpp: `/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode() : val(0), left(nullptr), right(nullptr) {}
 *     TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
 *     TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
 * };
 */
#include <algorithm>

class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (!root) return nullptr;
        std::swap(root->left, root->right);
        invertTree(root->left);
        invertTree(root->right);
        return root;
    }
};`,
      python: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right
class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root:
            return None
        root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
        return root`
    },
    testCases: [
      {
        id: 1,
        input: 'root = [4, 2, 7, 1, 3, 6, 9]',
        expectedOutput: '[4, 7, 2, 9, 6, 3, 1]'
      },
      {
        id: 2,
        input: 'root = [2, 1, 3]',
        expectedOutput: '[2, 3, 1]'
      },
      {
        id: 3,
        input: 'root = []',
        expectedOutput: '[]'
      }
    ],
    hints: [
      {
        level: 1,
        title: 'Recursive Subproblem',
        explanation: 'To invert a tree, swap the root\'s left and right children, then recursively invert both subtrees.',
        leadingQuestion: 'What is the simplest possible tree you can receive (the base case)?'
      },
      {
        level: 2,
        title: 'Base Case & Swap Order',
        explanation: 'If root is null, return null. Swap root->left and root->right, then call invertTree on both children.',
        leadingQuestion: 'Can this also be implemented iteratively with a Queue (BFS)?'
      },
      {
        level: 3,
        title: 'Scaffolding',
        explanation: 'Recursive: if (!root) return nullptr; swap(root->left, root->right); invertTree(root->left); invertTree(root->right); return root;',
        leadingQuestion: 'Does the order of pre-order vs post-order traversal matter for swapping?'
      }
    ],
    editorial: {
      approach: 'Recursive Depth-First Traversal',
      cppSolution: `class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (!root) return nullptr;
        TreeNode* temp = root->left;
        root->left = invertTree(root->right);
        root->right = invertTree(temp);
        return root;
    }
};`,
      pythonSolution: `class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        if not root:
            return None
        root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)
        return root`,
      complexityAnalysis: {
        time: 'O(N): Traverses every node in the binary tree exactly once.',
        space: 'O(H): Call stack depth bounded by tree height H.'
      }
    }
  },
  {
    id: 'kth-largest-element-in-an-array',
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    category: 'Heaps & Priority Queues',
    day: 14,
    timeEstimateMinutes: 40,
    description: `Given an integer array \`nums\` and an integer \`k\`, return the \`k-th\` largest element in the array.

Note that it is the \`k-th\` largest element in the sorted order, not the \`k-th\` distinct element.

Can you solve it without sorting?`,
    examples: [
      {
        input: 'nums = [3, 2, 1, 5, 6, 4], k = 2',
        output: '5',
        explanation: 'The 2nd largest element is 5.'
      },
      {
        input: 'nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4',
        output: '4',
        explanation: 'The 4th largest element is 4.'
      }
    ],
    constraints: [
      '1 <= k <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4'
    ],
    bigOTarget: {
      time: 'O(N log K)',
      space: 'O(K)',
      explanation: 'Maintains a min-heap of size K. Each insertion/pop takes O(log K) for N elements.'
    },
    languageComparison: {
      cppExplanation: `In C++, \`std::priority_queue<int>\` is a **max-heap** by default! To make it a min-heap of size K, declare: \`std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;\`. Alternatively, use \`std::nth_element\` for average O(N) Quickselect.`,
      pythonExplanation: `In Python, the \`heapq\` module implements a **min-heap** by default! Push each item with \`heapq.heappush(heap, x)\`, and if length exceeds k, call \`heapq.heappop(heap)\`. The root \`heap[0]\` is the k-th largest.`,
      memoryComparison: `C++ \`std::priority_queue\` uses a contiguous \`std::vector\` buffer, maximizing cache line utilization. Python's \`heapq\` operates in-place on a Python list of PyObjects.`,
      keyStlVsBuiltin: [
        {
          feature: 'Min-Heap Declaration',
          cpp: 'std::priority_queue<int, std::vector<int>, std::greater<int>> pq;',
          python: 'import heapq; heap = []',
          complexityNotes: 'C++ max-heap by default vs Python min-heap by default!'
        },
        {
          feature: 'Heap Push & Pop',
          cpp: 'pq.push(x); if (pq.size() > k) pq.pop();',
          python: 'heapq.heappush(heap, x); if len(heap) > k: heapq.heappop(heap)',
          complexityNotes: 'O(log K) per operation.'
        }
      ],
      pitfalls: [
        'C++ max-heap vs min-heap confusion: Remember std::greater<int> creates a MIN-heap.',
        'Python heapq is min-heap: Python has no max-heap builtin, so negative numbers (-x) are used for max-heap behavior.'
      ]
    },
    starterCode: {
      cpp: `#include <vector>
#include <queue>

class Solution {
public:
    int findKthLargest(std::vector<int>& nums, int k) {
        std::priority_queue<int, std::vector<int>, std::greater<int>> minHeap;
        for (int num : nums) {
            minHeap.push(num);
            if (minHeap.size() > k) {
                minHeap.pop();
            }
        }
        return minHeap.top();
    }
};`,
      python: `import heapq
from typing import List

class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        min_heap = []
        for num in nums:
            heapq.heappush(min_heap, num)
            if len(min_heap) > k:
                heapq.heappop(min_heap)
        return min_heap[0]`
    },
    testCases: [
      {
        id: 1,
        input: 'nums = [3, 2, 1, 5, 6, 4], k = 2',
        expectedOutput: '5'
      },
      {
        id: 2,
        input: 'nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4',
        expectedOutput: '4'
      }
    ],
    hints: [
      {
        level: 1,
        title: 'Heap Invariant',
        explanation: 'If you keep only the K largest elements seen so far in a container, which one will be the smallest among those K?',
        leadingQuestion: 'The smallest among the K largest is the k-th largest overall! What heap helps here?'
      },
      {
        level: 2,
        title: 'Min-Heap Sizing',
        explanation: 'Use a min-heap capped at size K. When an element is added and heap size becomes K+1, pop the minimum. Only the top K survive.',
        leadingQuestion: 'What element will be at the root of the min-heap at the end?'
      },
      {
        level: 3,
        title: 'Scaffolding',
        explanation: 'Loop through nums: push(num); if size > k: pop(). Return heap.top() / heap[0].',
        leadingQuestion: 'Why is min-heap of size K faster than sorting the entire array?'
      }
    ],
    editorial: {
      approach: 'Min-Heap of Size K',
      cppSolution: `class Solution {
public:
    int findKthLargest(std::vector<int>& nums, int k) {
        std::priority_queue<int, std::vector<int>, std::greater<int>> pq;
        for (int n : nums) {
            pq.push(n);
            if (pq.size() > k) pq.pop();
        }
        return pq.top();
    }
};`,
      pythonSolution: `class Solution:
    def findKthLargest(self, nums: List[int], k: int) -> int:
        return heapq.nlargest(k, nums)[-1]`,
      complexityAnalysis: {
        time: 'O(N log K): Heap operations on size K for N elements.',
        space: 'O(K): Heap stores at most K elements.'
      }
    }
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    day: 21,
    timeEstimateMinutes: 25,
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      {
        input: 'n = 2',
        output: '2',
        explanation: 'There are two ways to climb to the top: 1. 1 step + 1 step, 2. 2 steps.'
      },
      {
        input: 'n = 3',
        output: '3',
        explanation: 'There are three ways: 1. 1+1+1, 2. 1+2, 3. 2+1.'
      }
    ],
    constraints: [
      '1 <= n <= 45'
    ],
    bigOTarget: {
      time: 'O(N)',
      space: 'O(1)',
      explanation: 'Fibonacci recurrence dp[i] = dp[i-1] + dp[i-2] optimized with two rolling state variables.'
    },
    languageComparison: {
      cppExplanation: `In C++, rolling variables \`int a = 1, b = 2;\` stay purely inside CPU registers, executing in sub-nanosecond time.`,
      pythonExplanation: `In Python, multiple assignment \`a, b = b, a + b\` allows concise, branchless state updates.`,
      memoryComparison: `C++ requires 8 bytes of stack storage for two integers. Python requires 28-byte int objects.`,
      keyStlVsBuiltin: [
        {
          feature: 'Rolling State',
          cpp: 'int c = a + b; a = b; b = c;',
          python: 'a, b = b, a + b',
          complexityNotes: 'Constant space O(1)'
        }
      ],
      pitfalls: [
        'Off-by-one: check n = 1 and n = 2 edge cases.',
        'Recursive without memoization causes O(2^N) exponential time explosion.'
      ]
    },
    starterCode: {
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1;
        int prev1 = 2;
        for (int i = 3; i <= n; ++i) {
            int curr = prev1 + prev2;
            prev2 = prev1;
            prev1 = curr;
        }
        return prev1;
    }
};`,
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        prev2, prev1 = 1, 2
        for _ in range(3, n + 1):
            curr = prev1 + prev2
            prev2, prev1 = prev1, curr
        return prev1`
    },
    testCases: [
      {
        id: 1,
        input: 'n = 2',
        expectedOutput: '2'
      },
      {
        id: 2,
        input: 'n = 3',
        expectedOutput: '3'
      },
      {
        id: 3,
        input: 'n = 5',
        expectedOutput: '8'
      }
    ],
    hints: [
      {
        level: 1,
        title: 'Decision Overlap',
        explanation: 'To reach step i, you could have come from step (i-1) by taking 1 step, or from step (i-2) by taking 2 steps.',
        leadingQuestion: 'Does this recurrence look familiar to the Fibonacci sequence?'
      },
      {
        level: 2,
        title: 'State Transition',
        explanation: 'ways(i) = ways(i-1) + ways(i-2). Base cases: ways(1) = 1, ways(2) = 2.',
        leadingQuestion: 'Do you need to store the entire array of size N, or just the last two values?'
      },
      {
        level: 3,
        title: 'Scaffolding',
        explanation: 'Initialize a = 1, b = 2. For loop from 3 to n: c = a + b, a = b, b = c. Return b.',
        leadingQuestion: 'What if n == 1?'
      }
    ],
    editorial: {
      approach: 'Bottom-Up Dynamic Programming (Space-Optimized)',
      cppSolution: `class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int a = 1, b = 2;
        for (int i = 3; i <= n; ++i) {
            int next = a + b;
            a = b;
            b = next;
        }
        return b;
    }
};`,
      pythonSolution: `class Solution:
    def climbStairs(self, n: int) -> int:
        if n <= 2:
            return n
        a, b = 1, 2
        for _ in range(3, n + 1):
            a, b = b, a + b
        return b`,
      complexityAnalysis: {
        time: 'O(N): Single loop running (N - 2) times.',
        space: 'O(1): Two state tracking variables.'
      }
    }
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    day: 22,
    timeEstimateMinutes: 45,
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      {
        input: 'coins = [1, 2, 5], amount = 11',
        output: '3',
        explanation: '11 = 5 + 5 + 1 (3 coins total).'
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1',
        explanation: 'Cannot make 3 using only denomination 2.'
      },
      {
        input: 'coins = [1], amount = 0',
        output: '0'
      }
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4'
    ],
    bigOTarget: {
      time: 'O(Amount * len(Coins))',
      space: 'O(Amount)',
      explanation: '1D DP tabulation array of size (amount + 1), checking each coin denomination.'
    },
    languageComparison: {
      cppExplanation: `In C++, initialize \`std::vector<int> dp(amount + 1, amount + 1)\`. Initializing with \`amount + 1\` acts as infinity without causing integer overflow upon \`dp[i - coin] + 1\`.`,
      pythonExplanation: `In Python, \`dp = [float('inf')] * (amount + 1)\` or \`[amount + 1] * (amount + 1)\`.`,
      memoryComparison: `C++ vector allocates (amount + 1) * 4 bytes contiguously on the heap. For amount = 10,000, this is ~40KB of memory fitting comfortably in L1/L2 cache. Python creates a list of references.`,
      keyStlVsBuiltin: [
        {
          feature: 'DP Initialization',
          cpp: 'std::vector<int> dp(amount + 1, amount + 1); dp[0] = 0;',
          python: 'dp = [amount + 1] * (amount + 1); dp[0] = 0',
          complexityNotes: 'O(Amount) setup'
        }
      ],
      pitfalls: [
        'Using INT_MAX in C++: INT_MAX + 1 overflows to INT_MIN (undefined behavior); use amount + 1 instead.',
        'Coin value > amount: ensure coin <= current amount before looking up dp[i - coin].'
      ]
    },
    starterCode: {
      cpp: `#include <vector>
#include <algorithm>

class Solution {
public:
    int coinChange(std::vector<int>& coins, int amount) {
        std::vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; ++i) {
            for (int coin : coins) {
                if (i - coin >= 0) {
                    dp[i] = std::min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
      python: `from typing import List

class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        dp = [amount + 1] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for coin in coins:
                if i - coin >= 0:
                    dp[i] = min(dp[i], dp[i - coin] + 1)
        return dp[amount] if dp[amount] <= amount else -1`
    },
    testCases: [
      {
        id: 1,
        input: 'coins = [1, 2, 5], amount = 11',
        expectedOutput: '3'
      },
      {
        id: 2,
        input: 'coins = [2], amount = 3',
        expectedOutput: '-1'
      },
      {
        id: 3,
        input: 'coins = [1], amount = 0',
        expectedOutput: '0'
      }
    ],
    hints: [
      {
        level: 1,
        title: 'Unbounded Knapsack Intuition',
        explanation: 'To make amount A, if you use coin C, the remaining amount is (A - C). The minimum coins for A is 1 + min coins for (A - C).',
        leadingQuestion: 'What is the base case: how many coins to make amount 0?'
      },
      {
        level: 2,
        title: 'Tabulation State',
        explanation: 'Let dp[i] be the minimum coins needed to make amount i. dp[i] = min over all coins: dp[i - coin] + 1.',
        leadingQuestion: 'What sentinel value should you initialize the dp array with to represent infinity?'
      },
      {
        level: 3,
        title: 'Scaffolding',
        explanation: 'Initialize dp table of size amount + 1 with amount + 1. Set dp[0] = 0. Loop i from 1 to amount, and inner loop through coins. If dp[amount] > amount, return -1, else dp[amount].',
        leadingQuestion: 'Why is amount + 1 a safe proxy for infinity?'
      }
    ],
    editorial: {
      approach: 'Bottom-Up 1D Dynamic Programming',
      cppSolution: `class Solution {
public:
    int coinChange(std::vector<int>& coins, int amount) {
        std::vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; ++i) {
            for (int c : coins) {
                if (i >= c) dp[i] = std::min(dp[i], dp[i - c] + 1);
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
      pythonSolution: `class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        dp = [amount + 1] * (amount + 1)
        dp[0] = 0
        for i in range(1, amount + 1):
            for c in coins:
                if i >= c:
                    dp[i] = min(dp[i], dp[i - c] + 1)
        return dp[amount] if dp[amount] <= amount else -1`,
      complexityAnalysis: {
        time: 'O(Amount * len(Coins)): Double loop computing each sub-amount.',
        space: 'O(Amount): Vector / list of length amount + 1.'
      }
    }
  }
];

export const getProblemById = (id: string): Problem | undefined => {
  return PROBLEMS_DATA.find(p => p.id === id);
};
