// ============================================================
// LRU Buffer Management: Simulation and Hit/Miss Counting
// ============================================================

import { Question, MCQQuestion, MSQQuestion, NumericSAQuestion } from '../types';

export const allLruQuestions: Question[] = [
  // ---- Q1: Classic LRU trace - total misses (Exam) ----
  {
    id: 'lru-misses-classic',
    moduleId: 'lru-buffer',
    subskill: 'lru-simulation',
    format: 'numeric-sa',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    askConfidence: true,
    stem: 'A buffer has 3 frames and starts empty. Request sequence: 2, 1, 4, 2, 5, 1, 2, 4, 5, 1. How many page faults (misses) occur?',
    hints: [
      { level: 1, text: 'Simulate step by step. On a miss with a full buffer, evict the LRU (leftmost in the LRU-to-MRU order).' },
      { level: 2, text: 'Trace: 2(M), 1(M), 4(M), 2(H), 5(M,evict2), 1(H), 2(M,evict4), 4(M,evict1), 5(H), 1(M,evict2). Count the misses.' },
      { level: 3, text: 'Misses at positions: 2, 1, 4, 5, 2, 4, 1 = 8 misses.' },
    ],
    fullExplanation: `Buffer size = 3, initially empty. LRU order shown as [LRU ... MRU]:

Request 2: miss. Buffer: [2]
Request 1: miss. Buffer: [2, 1]
Request 4: miss. Buffer: [2, 1, 4]
Request 2: hit. Move 2 to MRU. Buffer: [1, 4, 2]
Request 5: miss. Evict LRU (1). Buffer: [4, 2, 5]
Request 1: miss. Evict LRU (4). Buffer: [2, 5, 1]
Request 2: hit. Move 2 to MRU. Buffer: [5, 1, 2]
Request 4: miss. Evict LRU (5). Buffer: [1, 2, 4]
Request 5: miss. Evict LRU (1). Buffer: [2, 4, 5]
Request 1: miss. Evict LRU (2). Buffer: [4, 5, 1]

Misses: 8 (requests 2, 1, 4, 5, 1, 2, 4, 5, 1 -- wait let me recount)

Miss positions: 2(M), 1(M), 4(M), 2(H), 5(M), 1(M), 2(M), 4(M), 5(H), 1(M)
Total misses = 8`,
    commonMisconception: 'Forgetting to move a hit block to the MRU position. In LRU, every access (hit or miss) updates the recency.',
    correctAnswer: 8,
    unit: 'misses',
    expectedFormat: 'integer',
  } as NumericSAQuestion,

  // ---- Q2: Hits count (Exam) ----
  {
    id: 'lru-hits-classic',
    moduleId: 'lru-buffer',
    subskill: 'hit-miss-counting',
    format: 'numeric-sa',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'A buffer has 3 frames, starts empty. Request sequence: 2, 1, 4, 2, 5, 1, 2, 4, 5, 1. How many hits occur?',
    hints: [
      { level: 1, text: 'Build the full LRU table first. A hit occurs when the requested block is already in the buffer.' },
      { level: 2, text: 'Hits occur when the block is found: request 2 (4th position, 2 is in buffer), request 5 (9th position). That is 2 hits.' },
      { level: 3, text: 'Total requests = 10. Misses = 8. Hits = 10 - 8 = 2.' },
    ],
    fullExplanation: `From the simulation (same as previous question):
- Request 2 (4th): 2 is in buffer. HIT.
- Request 5 (9th): 5 is in buffer. HIT.

All other requests are misses.
Total hits = 2.`,
    commonMisconception: 'Thinking that a request that was recently evicted counts as a hit. A hit only occurs if the block is currently in the buffer.',
    correctAnswer: 2,
    unit: 'hits',
    expectedFormat: 'integer',
  } as NumericSAQuestion,

  // ---- Q3: Misses minus hits (Challenge) ----
  {
    id: 'lru-misses-minus-hits',
    moduleId: 'lru-buffer',
    subskill: 'hit-miss-counting',
    format: 'numeric-sa',
    difficulty: 'Challenge',
    source: 'PYQ-inspired',
    stem: 'A buffer has 3 frames, starts empty. Requests: 2, 1, 4, 2, 5, 1, 2, 4, 5, 1. What is misses minus hits?',
    hints: [
      { level: 1, text: 'You can compute misses - hits directly without finding each separately if you know the pattern.' },
      { level: 2, text: 'Misses = 8, Hits = 2. The difference is 8 - 2 = 6.' },
      { level: 3, text: 'Alternatively: misses - hits = (total - 2*hits) = 10 - 4 = 6.' },
    ],
    fullExplanation: `From the full simulation:
Misses = 8
Hits = 2
Misses - Hits = 8 - 2 = 6`,
    commonMisconception: 'Computing hits - misses instead of misses - hits. The order matters for the sign of the answer.',
    correctAnswer: 6,
    unit: '',
    expectedFormat: 'integer',
  } as NumericSAQuestion,

  // ---- Q4: LRU with 2 frames (Foundation) ----
  {
    id: 'lru-2-frames',
    moduleId: 'lru-buffer',
    subskill: 'lru-simulation',
    format: 'numeric-sa',
    difficulty: 'Foundation',
    source: 'PYQ-inspired',
    stem: 'A buffer has 2 frames, starts empty. Request sequence: 1, 2, 3, 1, 2, 3, 4. How many misses occur?',
    hints: [
      { level: 1, text: 'With only 2 frames, the buffer fills quickly. Simulate step by step.' },
      { level: 2, text: '1(M), 2(M), 3(M,evict1), 1(M,evict2), 2(M,evict3), 3(M,evict1), 4(M,evict2). Every request is a miss!' },
      { level: 3, text: 'All 7 requests are misses. This is a classic thrashing pattern with too few frames.' },
    ],
    fullExplanation: `Buffer size = 2, initially empty:

Request 1: miss. Buffer: [1]
Request 2: miss. Buffer: [1, 2]
Request 3: miss. Evict 1. Buffer: [2, 3]
Request 1: miss. Evict 2. Buffer: [3, 1]
Request 2: miss. Evict 3. Buffer: [1, 2]
Request 3: miss. Evict 1. Buffer: [2, 3]
Request 4: miss. Evict 2. Buffer: [3, 4]

Every single request misses. This is Belady-like thrashing: the repeating pattern 1,2,3 exceeds the 2-frame capacity.
Total misses = 7`,
    commonMisconception: 'Assuming that since 1 and 2 repeat, there must be some hits. With only 2 frames, the 3-element cycle prevents any hits.',
    correctAnswer: 7,
    unit: 'misses',
    expectedFormat: 'integer',
  } as NumericSAQuestion,

  // ---- Q5: LRU hit identification (Exam) ----
  {
    id: 'lru-hit-positions',
    moduleId: 'lru-buffer',
    subskill: 'hit-miss-counting',
    format: 'mcq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'A buffer has 3 frames, starts empty. Requests: 3, 1, 4, 1, 5, 3, 4, 1, 5. At which request positions (1-indexed) do hits occur?',
    hints: [
      { level: 1, text: 'Build the buffer state after each request and check if the requested block is already present.' },
      { level: 2, text: 'After filling [3,1,4], request 1 hits. After that, 5 evicts 3, then 3 evicts 4, then 4 evicts 1, etc. No more hits.' },
      { level: 3, text: 'Only position 4 is a hit. Every other request either fills the buffer or evicts a block that is needed again later.' },
    ],
    fullExplanation: `Buffer size = 3:

Pos 1, req 3: miss. Buffer: [3]
Pos 2, req 1: miss. Buffer: [3, 1]
Pos 3, req 4: miss. Buffer: [3, 1, 4]
Pos 4, req 1: HIT. Move to MRU. Buffer: [3, 4, 1]
Pos 5, req 5: miss. Evict LRU (3). Buffer: [4, 1, 5]
Pos 6, req 3: miss. Evict LRU (4). Buffer: [1, 5, 3]
Pos 7, req 4: miss. Evict LRU (1). Buffer: [5, 3, 4]
Pos 8, req 1: miss. Evict LRU (5). Buffer: [3, 4, 1]
Pos 9, req 5: miss. Evict LRU (3). Buffer: [4, 1, 5]

Only 1 hit at position 4. After that, the constant evictions push out every block before it is requested again.`,
    commonMisconception: 'Assuming position 8 or 9 would be hits because 1 and 5 appeared earlier. They were evicted in between.',
    options: [
      { id: 'a', text: 'Positions 4 and 8', isCorrect: false, explanation: 'Position 8 is a miss (1 was evicted at position 7).' },
      { id: 'b', text: 'Position 4 only', isCorrect: true, explanation: 'Correct. Only the 4th request (value 1) finds the block already in buffer.' },
      { id: 'c', text: 'Positions 4, 8, and 9', isCorrect: false, explanation: 'Positions 8 and 9 are misses.' },
      { id: 'd', text: 'No hits', isCorrect: false, explanation: 'Position 4 is a hit.' },
    ],
  } as MCQQuestion,

  // ---- Q6: LRU 4 frames (Foundation) ----
  {
    id: 'lru-4-frames',
    moduleId: 'lru-buffer',
    subskill: 'lru-simulation',
    format: 'numeric-sa',
    difficulty: 'Foundation',
    source: 'PYQ-inspired',
    stem: 'A buffer has 4 frames, starts empty. Requests: 1, 2, 3, 4, 1, 2, 5. How many misses occur?',
    hints: [
      { level: 1, text: 'With 4 frames and only 5 distinct values, most requests should be hits after the buffer fills.' },
      { level: 2, text: '1(M), 2(M), 3(M), 4(M), 1(H), 2(H), 5(M). Total: 5 misses, 2 hits.' },
      { level: 3, text: 'The buffer fills after 4 requests. Then 1 and 2 are still in buffer. Only 5 causes a miss.' },
    ],
    fullExplanation: `Buffer size = 4:

Request 1: miss. Buffer: [1]
Request 2: miss. Buffer: [1, 2]
Request 3: miss. Buffer: [1, 2, 3]
Request 4: miss. Buffer: [1, 2, 3, 4]
Request 1: HIT. Buffer: [2, 3, 4, 1]
Request 2: HIT. Buffer: [3, 4, 1, 2]
Request 5: miss. Evict 3. Buffer: [4, 1, 2, 5]

Misses = 5`,
    commonMisconception: 'Forgetting that after filling the buffer, recently accessed blocks (1, 2) are still present and accessible.',
    correctAnswer: 5,
    unit: 'misses',
    expectedFormat: 'integer',
  } as NumericSAQuestion,

  // ---- Q7: LRU evict identification (Exam) ----
  {
    id: 'lru-which-evicted',
    moduleId: 'lru-buffer',
    subskill: 'lru-simulation',
    format: 'mcq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'Buffer has 3 frames. After requests 5, 3, 8, the buffer contains [5, 3, 8] (LRU to MRU). The next request is for block 2. Which block is evicted?',
    hints: [
      { level: 1, text: 'On a miss, LRU evicts the least recently used block.' },
      { level: 2, text: 'The LRU block is the leftmost one: 5.' },
      { level: 3, text: '5 is evicted. New buffer: [3, 8, 2].' },
    ],
    fullExplanation: `The buffer state [5, 3, 8] is ordered from LRU (left) to MRU (right).

Request 2 is a miss (not in buffer). The LRU block is 5 (leftmost).
Evict 5, add 2 as MRU.
New buffer: [3, 8, 2]`,
    commonMisconception: 'Evicting 8 (the MRU) instead of 5 (the LRU). LRU always evicts the LEAST recently used, which is the leftmost in the LRU-to-MRU order.',
    options: [
      { id: 'a', text: '5', isCorrect: true, explanation: 'Correct. 5 is the LRU (least recently used) block.' },
      { id: 'b', text: '3', isCorrect: false, explanation: '3 is the middle block, not the LRU.' },
      { id: 'c', text: '8', isCorrect: false, explanation: '8 is the MRU (most recently used), not the LRU.' },
      { id: 'd', text: '2', isCorrect: false, explanation: '2 is the incoming block, not an existing one.' },
    ],
  } as MCQQuestion,

  // ---- Q8: LRU hit rate percentage (Challenge) ----
  {
    id: 'lru-hit-rate',
    moduleId: 'lru-buffer',
    subskill: 'hit-miss-counting',
    format: 'numeric-sa',
    difficulty: 'Challenge',
    source: 'PYQ-inspired',
    askConfidence: true,
    stem: 'Buffer has 3 frames, starts empty. Requests: 1, 2, 3, 1, 2, 3, 1, 2, 3. What is the hit rate as a percentage (integer)?',
    hints: [
      { level: 1, text: 'With 3 frames and only 3 distinct blocks, after the buffer fills, every block stays cached.' },
      { level: 2, text: 'First 3 requests are misses. After that, 1, 2, 3 cycle and each is already in the buffer.' },
      { level: 3, text: '3 misses + 6 hits = 9 total. Hit rate = 6/9 = 66.67%, rounded to 67%.' },
    ],
    fullExplanation: `Buffer size = 3, 3 distinct blocks in a repeating cycle:

Request 1: miss. Buffer [1]
Request 2: miss. Buffer [1, 2]
Request 3: miss. Buffer [1, 2, 3]
Request 1: HIT. Move to MRU. Buffer [2, 3, 1]
Request 2: HIT. Move to MRU. Buffer [3, 1, 2]
Request 3: HIT. Move to MRU. Buffer [1, 2, 3]
Request 1: HIT. Buffer [2, 3, 1]
Request 2: HIT. Buffer [3, 1, 2]
Request 3: HIT. Buffer [1, 2, 3]

With exactly 3 frames and 3 distinct blocks, after the initial 3 cold misses, every request is a hit.
6 hits out of 9 = 66.67%. Rounded to nearest integer: 67%.`,
    commonMisconception: 'Thinking the 3-element cycle causes thrashing with 3 frames. With exactly 3 frames and 3 distinct blocks, LRU keeps all blocks and gets hits after the initial cold misses.',
    correctAnswer: 67,
    unit: '%',
    expectedFormat: 'integer',
  } as NumericSAQuestion,
];
