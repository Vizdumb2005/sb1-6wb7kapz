// ============================================================
// BST: Construction, Height, Search Paths, Insertion Order, Leaves
// ============================================================

import { Question, MCQQuestion, MSQQuestion, NumericSAQuestion } from '../types';

export const allBstQuestions: Question[] = [
  // ---- Q1: BST height from insertion order (Exam) ----
  {
    id: 'bst-height-insertion',
    moduleId: 'bst',
    subskill: 'bst-height',
    format: 'numeric-sa',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    askConfidence: true,
    stem: 'Insert 40, 20, 60, 10, 30, 50, 70, 25, 35 into an empty BST (root at level 0). What is the height (in edges) of the tree?',
    hints: [
      { level: 1, text: 'Build the BST by inserting one value at a time. Go left for smaller, right for larger.' },
      { level: 2, text: '40 at level 0. 20 and 60 at level 1. 10, 30, 50, 70 at level 2. 25 and 35 go under 30 at level 3.' },
      { level: 3, text: 'The deepest nodes (25, 35) are at level 3. Height in edges = 3.' },
    ],
    fullExplanation: `Building the BST step by step:
- Insert 40: root (level 0)
- Insert 20: left of 40 (level 1)
- Insert 60: right of 40 (level 1)
- Insert 10: left of 20 (level 2)
- Insert 30: right of 20 (level 2)
- Insert 50: left of 60 (level 2)
- Insert 70: right of 60 (level 2)
- Insert 25: left of 30 (level 3)
- Insert 35: right of 30 (level 3)

The deepest nodes are 25 and 35 at level 3.
Height (in edges) = 3.`,
    commonMisconception: 'Counting levels instead of edges, or misplacing 25 and 35. 25 goes left of 30 (not left of 20), and 35 goes right of 30.',
    correctAnswer: 3,
    unit: 'edges',
    expectedFormat: 'integer',
  } as NumericSAQuestion,

  // ---- Q2: BST leaf node sum (Exam) ----
  {
    id: 'bst-leaf-sum',
    moduleId: 'bst',
    subskill: 'bst-leaf-nodes',
    format: 'numeric-sa',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'Insert 40, 20, 60, 10, 30, 50, 70, 25, 35 into an empty BST. What is the sum of all leaf node values?',
    hints: [
      { level: 1, text: 'Build the tree and identify which nodes have no children (leaf nodes).' },
      { level: 2, text: 'Leaves are nodes with no left or right child: 10, 25, 35, 50, 70.' },
      { level: 3, text: 'Sum = 10 + 25 + 35 + 50 + 70 = 190.' },
    ],
    fullExplanation: `From the BST construction:
- 40 has children 20 and 60 (not a leaf)
- 20 has children 10 and 30 (not a leaf)
- 60 has children 50 and 70 (not a leaf)
- 10 has no children (LEAF)
- 30 has children 25 and 35 (not a leaf)
- 50 has no children (LEAF)
- 70 has no children (LEAF)
- 25 has no children (LEAF)
- 35 has no children (LEAF)

Leaf nodes: 10, 25, 35, 50, 70
Sum = 10 + 25 + 35 + 50 + 70 = 190`,
    commonMisconception: 'Forgetting to recheck leaves after all insertions. After inserting 25 and 35 under 30, node 30 is no longer a leaf.',
    correctAnswer: 190,
    unit: '',
    expectedFormat: 'integer',
  } as NumericSAQuestion,

  // ---- Q3: BST subtree membership (Foundation) ----
  {
    id: 'bst-subtree',
    moduleId: 'bst',
    subskill: 'bst-construction',
    format: 'mcq',
    difficulty: 'Foundation',
    source: 'PYQ-inspired',
    stem: 'Insert 40, 20, 60, 10, 30, 50, 70, 25, 35 into an empty BST. In which subtree of the root is node 25 located?',
    hints: [
      { level: 1, text: 'Start at root 40. Is 25 less than or greater than 40?' },
      { level: 2, text: '25 < 40, so go left to 20. 25 > 20, so go right to 30. 25 < 30, so go left. 25 is placed there.' },
      { level: 3, text: '25 is in the left subtree of 40 (via 20 -> 30 -> left).' },
    ],
    fullExplanation: `Starting at root 40:
- 25 < 40: go to left child 20
- 25 > 20: go to right child 30
- 25 < 30: go to left child 25

25 is in the left subtree of the root 40.
More specifically, 25 is in the right subtree of 20.`,
    commonMisconception: 'Saying 25 is in the right subtree of 20 but thinking it is also in the right subtree of 40. The overall position from root is LEFT.',
    options: [
      { id: 'a', text: 'Left subtree of 40', isCorrect: true, explanation: 'Correct. 25 < 40, so it is in the left subtree.' },
      { id: 'b', text: 'Right subtree of 40', isCorrect: false, explanation: '25 < 40, so it goes left, not right.' },
      { id: 'c', text: 'Left subtree of 20', isCorrect: false, explanation: '25 > 20, so it goes right of 20.' },
      { id: 'd', text: 'Right subtree of 30', isCorrect: false, explanation: '25 < 30, so it goes left of 30.' },
    ],
  } as MCQQuestion,

  // ---- Q4: BST level of a node (Exam) ----
  {
    id: 'bst-node-level',
    moduleId: 'bst',
    subskill: 'bst-height',
    format: 'mcq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'Insert 40, 20, 60, 10, 30, 50, 70, 25, 35 into an empty BST (root at level 0). At which level is node 50?',
    hints: [
      { level: 1, text: 'Trace from root to 50, counting each edge.' },
      { level: 2, text: '40 (level 0) -> right to 60 (level 1) -> left to 50 (level 2).' },
      { level: 3, text: '50 is at level 2.' },
    ],
    fullExplanation: `Tracing from root:
- Level 0: 40 (root)
- 50 > 40: go right
- Level 1: 60
- 50 < 60: go left
- Level 2: 50

Node 50 is at level 2.`,
    commonMisconception: 'Thinking 50 is at level 1 because it is inserted early. The level depends on the comparison path, not the insertion order.',
    options: [
      { id: 'a', text: 'Level 0', isCorrect: false, explanation: 'Level 0 is the root (40) only.' },
      { id: 'b', text: 'Level 1', isCorrect: false, explanation: 'Level 1 contains 20 and 60.' },
      { id: 'c', text: 'Level 2', isCorrect: true, explanation: 'Correct. 50 is the left child of 60.' },
      { id: 'd', text: 'Level 3', isCorrect: false, explanation: 'Level 3 contains 25 and 35.' },
    ],
  } as MCQQuestion,

  // ---- Q5: BST min/max height difference (Challenge) ----
  {
    id: 'bst-min-max-height',
    moduleId: 'bst',
    subskill: 'bst-height',
    format: 'numeric-sa',
    difficulty: 'Challenge',
    source: 'PYQ-inspired',
    stem: 'What is the difference between the maximum possible height and the minimum possible height (both in edges) of a BST with 7 nodes?',
    hints: [
      { level: 1, text: 'Maximum height occurs in a skewed (completely unbalanced) tree. Minimum height occurs in a perfectly balanced tree.' },
      { level: 2, text: 'Max height = 7 - 1 = 6 edges (a chain). Min height = ceil(log2(7+1)) - 1 = ceil(3) - 1 = 3 - 1 = 2 edges.' },
      { level: 3, text: 'Difference = 6 - 2 = 4.' },
    ],
    fullExplanation: `For n = 7 nodes:

Maximum height (skewed tree): n - 1 = 7 - 1 = 6 edges. This happens when nodes are inserted in sorted order, forming a single chain.

Minimum height (balanced tree): ceil(log2(n + 1)) - 1 = ceil(log2(8)) - 1 = ceil(3) - 1 = 2 edges. This happens with a complete binary tree.

Difference = 6 - 2 = 4.`,
    commonMisconception: 'Using floor instead of ceil for minimum height, or forgetting to subtract 1. The formula for minimum edge-height is ceil(log2(n+1)) - 1.',
    correctAnswer: 4,
    unit: 'edges',
    expectedFormat: 'integer',
  } as NumericSAQuestion,

  // ---- Q6: BST insertion order MSQ (Challenge) ----
  {
    id: 'bst-insertion-order-msq',
    moduleId: 'bst',
    subskill: 'bst-insertion-order',
    format: 'msq',
    difficulty: 'Challenge',
    source: 'PYQ-inspired',
    stem: 'Which of the following insertion sequences into an empty BST produce the same tree structure as inserting 5, 3, 7, 2, 4, 6, 8? Select all that apply.',
    hints: [
      { level: 1, text: 'The key insight is that the root must be 5, and the relative ordering within each subtree must be preserved.' },
      { level: 2, text: 'The root is determined by the first element inserted. Any sequence that inserts 5 first, then 3 before 2 and 4 (but in any order relative to right subtree), and 7 before 6 and 8, can produce the same tree.' },
      { level: 3, text: 'Check each option: the root must be 5, and the left and right subtrees must get their elements in orders that produce the same substructures.' },
    ],
    fullExplanation: `The target tree has root 5, left subtree from {3,2,4} and right subtree from {7,6,8}.

For the same tree structure:
- 5 must be inserted first (it becomes root).
- In the left subtree (3,2,4): 3 must come before 2 and 4 (so 3 is the root of that subtree).
- In the right subtree (7,6,8): 7 must come before 6 and 8.
- The interleaving between left and right subtree insertions does not matter.

Check options (assuming a representative set):
- 5, 3, 2, 4, 7, 6, 8: root=5, 3 before 2,4, 7 before 6,8. Same tree.
- 5, 7, 3, 6, 2, 8, 4: root=5, 3 before 2,4, 7 before 6,8. Same tree.
- 3, 5, 7, 2, 4, 6, 8: root=3, different tree. NOT same.
- 5, 3, 7, 4, 2, 6, 8: root=5, 3 before 4 and 2 (yes), 7 before 6,8 (yes). Same tree.`,
    commonMisconception: 'Thinking the insertion order must be exactly the same. The key requirement is that each subtree root is inserted before its children, but left and right subtrees can be interleaved freely.',
    options: [
      { id: 'a', text: '5, 3, 2, 4, 7, 6, 8', isCorrect: true, explanation: 'Root 5 first. Left: 3 before 2,4. Right: 7 before 6,8. Same tree.' },
      { id: 'b', text: '3, 5, 7, 2, 4, 6, 8', isCorrect: false, explanation: 'Root becomes 3 (not 5). Different tree.' },
      { id: 'c', text: '5, 7, 3, 6, 2, 8, 4', isCorrect: true, explanation: 'Root 5 first. Left and right subtrees get correct relative ordering. Same tree.' },
      { id: 'd', text: '5, 3, 7, 4, 2, 6, 8', isCorrect: true, explanation: 'Root 5 first. 4 before 2 is fine (4 goes right of 3, 2 goes left of 3). Same tree.' },
    ],
  } as MSQQuestion,

  // ---- Q7: BST search path (Challenge) ----
  {
    id: 'bst-search-path',
    moduleId: 'bst',
    subskill: 'bst-search-paths',
    format: 'msq',
    difficulty: 'Challenge',
    source: 'PYQ-inspired',
    stem: 'When searching for 42 in a BST, which probe sequences can be valid? Select all that apply.',
    hints: [
      { level: 1, text: 'Track the allowed range (lower bound, upper bound) after each probe. The target must stay within range.' },
      { level: 2, text: 'If current node > target, target is in the left subtree (new upper bound = current node). If current node < target, target is in the right subtree (new lower bound = current node).' },
      { level: 3, text: 'Check each option by verifying that 42 stays within the valid range at every step.' },
    ],
    fullExplanation: `Track bounds for target 42 after each probe:

Option A: 60, 35, 50, 41, 42
- After 60 (>42): upper bound = 60. Range (neg, 60)
- After 35 (<42): lower bound = 35. Range (35, 60)
- After 50 (>42): upper bound = 50. Range (35, 50)
- After 41 (<42): lower bound = 41. Range (41, 50)
- 42 in range (41, 50). VALID.

Option B: 30, 50, 45, 40, 42
- After 30 (<42): lower bound = 30. Range (30, pos)
- After 50 (>42): upper bound = 50. Range (30, 50)
- After 45 (>42): upper bound = 45. Range (30, 45)
- After 40 (<42): lower bound = 40. Range (40, 45)
- 42 in range (40, 45). VALID.

Option C: 70, 30, 55, 38, 44, 42
- After 70 (>42): Range (neg, 70)
- After 30 (<42): Range (30, 70)
- After 55 (>42): Range (30, 55)
- After 38 (<42): Range (38, 55)
- After 44 (>42): Range (38, 44). But 44 > 42, so 44 must be in left subtree... 42 < 44, so go left. Range (38, 44)
- 42 in range (38, 44). VALID.

Option D: 20, 60, 35, 50, 42
- After 20 (<42): Range (20, pos)
- After 60 (>42): Range (20, 60)
- After 35 (<42): Range (35, 60)
- After 50 (>42): Range (35, 50)
- 42 in range (35, 50). VALID.

All four sequences are valid BST search paths for 42.`,
    commonMisconception: 'Rejecting valid paths because they do not match a specific tree you imagined. A valid search path only needs to maintain consistent bounds, not match a particular tree shape.',
    options: [
      { id: 'a', text: '60, 35, 50, 41, 42', isCorrect: true, explanation: 'Valid. Bounds stay consistent at every step.' },
      { id: 'b', text: '30, 50, 45, 40, 42', isCorrect: true, explanation: 'Valid. 42 remains within bounds.' },
      { id: 'c', text: '70, 30, 55, 38, 44, 42', isCorrect: true, explanation: 'Valid. The bounds are maintained throughout.' },
      { id: 'd', text: '20, 60, 35, 50, 42', isCorrect: true, explanation: 'Valid. Bounds are consistent.' },
    ],
  } as MSQQuestion,

  // ---- Q8: BST count leaf nodes (Foundation) ----
  {
    id: 'bst-count-leaves',
    moduleId: 'bst',
    subskill: 'bst-leaf-nodes',
    format: 'numeric-sa',
    difficulty: 'Foundation',
    source: 'PYQ-inspired',
    stem: 'Insert 10, 5, 15, 3, 7, 12, 20 into an empty BST. How many leaf nodes does the tree have?',
    hints: [
      { level: 1, text: 'Build the BST and identify nodes with no children.' },
      { level: 2, text: '10 is root. Left: 5 -> 3, 7. Right: 15 -> 12, 20. Leaves: 3, 7, 12, 20.' },
      { level: 3, text: '4 leaf nodes.' },
    ],
    fullExplanation: `Building the BST:
- 10 (root)
- 5 (left of 10)
- 15 (right of 10)
- 3 (left of 5)
- 7 (right of 5)
- 12 (left of 15)
- 20 (right of 15)

Leaf nodes (no children): 3, 7, 12, 20.
Count = 4.`,
    commonMisconception: 'Counting internal nodes (5, 15) as leaves. A leaf must have NO children.',
    correctAnswer: 4,
    unit: 'leaves',
    expectedFormat: 'integer',
  } as NumericSAQuestion,

  // ---- Q9: BST max nodes at given height (Exam) ----
  {
    id: 'bst-max-nodes-height',
    moduleId: 'bst',
    subskill: 'bst-height',
    format: 'numeric-sa',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'What is the maximum number of nodes in a binary tree with height 3 (root at level 0, height measured in edges)?',
    hints: [
      { level: 1, text: 'A binary tree of height h has levels 0 through h. The maximum nodes at level i is 2^i.' },
      { level: 2, text: 'Total max nodes = 2^0 + 2^1 + 2^2 + 2^3 = 1 + 2 + 4 + 8 = 15. Or use formula: 2^(h+1) - 1 = 2^4 - 1 = 15.' },
      { level: 3, text: 'Maximum nodes = 15.' },
    ],
    fullExplanation: `For a binary tree of height h (in edges), levels range from 0 to h.

Maximum nodes = sum from i=0 to h of 2^i = 2^(h+1) - 1

For h = 3: 2^4 - 1 = 16 - 1 = 15.

This is a complete binary tree with all levels fully filled.`,
    commonMisconception: 'Using h instead of h+1 in the formula, giving 2^3 - 1 = 7. A height-3 tree has 4 levels (0,1,2,3), not 3.',
    correctAnswer: 15,
    unit: 'nodes',
    expectedFormat: 'integer',
  } as NumericSAQuestion,
];
