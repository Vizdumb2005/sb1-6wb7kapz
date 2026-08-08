// ============================================================
// FD Closures, Keys & Prime Attributes
// ============================================================

import { Question, MCQQuestion, MSQQuestion, NumericSAQuestion } from '../types';

export const allFdQuestions: Question[] = [
  // ---- WORKED EXAMPLE ----
  {
    id: 'fd-worked-closure',
    moduleId: 'fd-closures-keys',
    subskill: 'closure-computation',
    format: 'mcq',
    difficulty: 'Foundation',
    source: 'worked-example',
    stem: 'Given R(A, B, C, D, E) with F = {A -> BC, C -> D, BD -> E}, what is the closure of {A}?',
    hints: [
      { level: 1, text: 'Start with result = {A}. Check each FD: if the LHS is a subset of result, add the RHS.' },
      { level: 2, text: 'A gives B and C (via A -> BC). Now result = {A, B, C}. Then C gives D (via C -> D). Now result = {A, B, C, D}.' },
      { level: 3, text: 'With {A, B, C, D}, BD is a subset, so add E. Final closure = {A, B, C, D, E}.' },
    ],
    fullExplanation: `Step-by-step closure of {A}:
1. Start: result = {A}
2. A -> BC: A is in result, so add B, C. result = {A, B, C}
3. C -> D: C is in result, so add D. result = {A, B, C, D}
4. BD -> E: both B and D are in result, so add E. result = {A, B, C, D, E}
5. No more attributes to add. A+ = {A, B, C, D, E} = all attributes, so A is a superkey.`,
    commonMisconception: 'Stopping early after adding BC and forgetting to check C -> D and BD -> E. You must keep scanning all FDs until no new attributes are added.',
    options: [
      { id: 'a', text: '{A, B, C}', isCorrect: false, explanation: 'This is incomplete. You stopped before applying C -> D.' },
      { id: 'b', text: '{A, B, C, D}', isCorrect: false, explanation: 'You stopped before applying BD -> E.' },
      { id: 'c', text: '{A, B, C, D, E}', isCorrect: true, explanation: 'Correct. After chaining through all FDs, the closure includes every attribute.' },
      { id: 'd', text: '{A, B, C, E}', isCorrect: false, explanation: 'D was not obtained. C -> D must be applied.' },
    ],
  } as MCQQuestion,

  // ---- GUIDED #1 ----
  {
    id: 'fd-guided-candidate-key',
    moduleId: 'fd-closures-keys',
    subskill: 'candidate-key-finding',
    format: 'mcq',
    difficulty: 'Foundation',
    source: 'guided',
    stem: 'Given R(A, B, C, D, E, F) with F = {A -> BC, C -> D, BD -> E, E -> F}, which of the following is a candidate key?',
    hints: [
      { level: 1, text: 'First find attributes that never appear on any RHS. Those must be in every candidate key.' },
      { level: 2, text: 'A never appears on any RHS. Compute A+ to see if it covers all attributes.' },
      { level: 3, text: 'A+ = {A} -> add B,C -> add D -> add E -> add F. A alone determines everything, so A is a candidate key.' },
    ],
    fullExplanation: `Step 1: Identify attributes not on any RHS. Scanning all FDs, A never appears on the right side. So A must be in every candidate key.
Step 2: Compute A+:
- Start: {A}
- A -> BC: add B, C. Now {A, B, C}
- C -> D: add D. Now {A, B, C, D}
- BD -> E: add E. Now {A, B, C, D, E}
- E -> F: add F. Now {A, B, C, D, E, F}
Step 3: A is a superkey. Since no proper subset of {A} exists (it is a single attribute), A is minimal. Therefore A is the only candidate key.`,
    commonMisconception: 'Thinking that AB or AC might also be candidate keys. While they are superkeys, they are not minimal because A alone suffices.',
    options: [
      { id: 'a', text: 'AB', isCorrect: false, explanation: 'AB is a superkey but not minimal since A alone is a superkey.' },
      { id: 'b', text: 'A', isCorrect: true, explanation: 'Correct. A alone determines all attributes and is minimal.' },
      { id: 'c', text: 'BD', isCorrect: false, explanation: 'B+ = {B}, D+ = {D}, neither reaches all attributes.' },
      { id: 'd', text: 'CE', isCorrect: false, explanation: 'CE+ does not include A or B, so it cannot be a superkey.' },
    ],
  } as MCQQuestion,

  // ---- GUIDED #2 ----
  {
    id: 'fd-guided-superkey-count',
    moduleId: 'fd-closures-keys',
    subskill: 'superkey-counting',
    format: 'numeric-sa',
    difficulty: 'Exam',
    source: 'guided',
    stem: 'Given R(A, B, C, D, E, F) with F = {A -> BC, C -> D, BD -> E, E -> F}, where A is the only candidate key, how many superkeys does R have?',
    hints: [
      { level: 1, text: 'Every superkey must contain the candidate key A.' },
      { level: 2, text: 'The remaining attributes are B, C, D, E, F (5 attributes). Any subset of these can be combined with A to form a superkey.' },
      { level: 3, text: 'Number of superkeys = 2^(n-k) = 2^(6-1) = 2^5 = 32.' },
    ],
    fullExplanation: `The candidate key is A (1 attribute). The relation has 6 attributes.
Every superkey must contain A. The remaining 5 attributes (B, C, D, E, F) can be included or excluded freely.
Number of subsets of {B, C, D, E, F} = 2^5 = 32.
Therefore, there are 32 superkeys.`,
    commonMisconception: 'Counting 2^6 = 64 by including sets without A. A superkey must contain a candidate key, so A must be present in every superkey.',
    correctAnswer: 32,
    unit: 'superkeys',
    expectedFormat: 'integer',
  } as NumericSAQuestion,

  // ---- INDEPENDENT #1 ----
  {
    id: 'fd-ind-closure-bd',
    moduleId: 'fd-closures-keys',
    subskill: 'closure-computation',
    format: 'mcq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'Given R(A, B, C, D, E) with F = {AB -> C, C -> D, D -> E}, what is the closure of {B}?',
    hints: [
      { level: 1, text: 'Start with {B}. Check every FD to see if its LHS is a subset of {B}.' },
      { level: 2, text: 'No FD has just B on the left side. AB -> C requires A, which is not in {B}.' },
      { level: 3, text: 'Since no FD LHS is contained in {B}, the closure stays as {B}.' },
    ],
    fullExplanation: `Starting with {B}:
- AB -> C: needs A and B. A is not in {B}, so this does not apply.
- C -> D: needs C, which is not in {B}.
- D -> E: needs D, which is not in {B}.
No FD can fire. Therefore B+ = {B}.`,
    commonMisconception: 'Assuming B -> C transitively or guessing based on the FD set structure. Always follow the algorithm mechanically.',
    options: [
      { id: 'a', text: '{B, C, D, E}', isCorrect: false, explanation: 'No FD has B alone on the LHS.' },
      { id: 'b', text: '{B}', isCorrect: true, explanation: 'Correct. No FD fires from {B} alone.' },
      { id: 'c', text: '{B, C}', isCorrect: false, explanation: 'AB -> C requires A, not just B.' },
      { id: 'd', text: '{A, B, C, D, E}', isCorrect: false, explanation: 'This would require A to be in the starting set.' },
    ],
  } as MCQQuestion,

  // ---- INDEPENDENT #2 ----
  {
    id: 'fd-ind-candidate-key-multiple',
    moduleId: 'fd-closures-keys',
    subskill: 'candidate-key-finding',
    format: 'msq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'Given R(A, B, C, D) with F = {A -> B, B -> C, C -> D}, which of the following are candidate keys? Select all that apply.',
    hints: [
      { level: 1, text: 'Check which attribute(s) never appear on any RHS. That attribute must be in every candidate key.' },
      { level: 2, text: 'A never appears on any RHS. Since A -> B -> C -> D, A+ = {A, B, C, D}. So A is a candidate key.' },
      { level: 3, text: 'Is there any other candidate key? Since A is the only attribute not on any RHS, every key must contain A. And A alone works. So A is the only candidate key.' },
    ],
    fullExplanation: `Step 1: A never appears on the RHS of any FD. So A must be in every candidate key.
Step 2: A+ = {A} -> {A,B} -> {A,B,C} -> {A,B,C,D}. A is a superkey.
Step 3: Since {A} has no proper non-empty subset, it is minimal. A is the only candidate key.
Note: AB, AC, AD, ABC, ABD, ACD, ABCD are all superkeys but NOT candidate keys because they are not minimal.`,
    commonMisconception: 'Selecting AB as a candidate key. AB is a superkey but not minimal since A alone suffices. A candidate key must be minimal.',
    options: [
      { id: 'a', text: 'A', isCorrect: true, explanation: 'A alone determines all attributes and is minimal.' },
      { id: 'b', text: 'AB', isCorrect: false, explanation: 'Superkey but not minimal. A alone works.' },
      { id: 'c', text: 'AC', isCorrect: false, explanation: 'Superkey but not minimal.' },
      { id: 'd', text: 'AD', isCorrect: false, explanation: 'Superkey but not minimal.' },
    ],
  } as MSQQuestion,

  // ---- INDEPENDENT #3 ----
  {
    id: 'fd-ind-superkey-count-two-keys',
    moduleId: 'fd-closures-keys',
    subskill: 'superkey-counting',
    format: 'numeric-sa',
    difficulty: 'Challenge',
    source: 'PYQ-inspired',
    askConfidence: true,
    stem: 'Given R(A, B, C, D) with F = {AB -> CD, C -> B, D -> A}, the candidate keys are AB and CD. How many distinct superkeys does R have?',
    hints: [
      { level: 1, text: 'A superkey is any set containing at least one candidate key. List all subsets of {A,B,C,D} that contain AB or CD.' },
      { level: 2, text: 'Supersets of AB: any set containing both A and B. Supersets of CD: any set containing both C and D. Use inclusion-exclusion to avoid double-counting sets containing both AB and CD.' },
      { level: 3, text: 'Sets containing AB: 2^2 = 4 (choose from {C,D} freely). Sets containing CD: 2^2 = 4. Sets containing both AB and CD: 1 (ABCD itself). Total = 4 + 4 - 1 = 7.' },
    ],
    fullExplanation: `Candidate keys: AB and CD.
Superkeys containing AB: {AB, ABC, ABD, ABCD} = 4 sets.
Superkeys containing CD: {CD, ACD, BCD, ABCD} = 4 sets.
ABCD is counted in both groups, so by inclusion-exclusion: 4 + 4 - 1 = 7 superkeys.

The 7 superkeys are: AB, CD, ABC, ABD, ACD, BCD, ABCD.`,
    commonMisconception: 'Simply computing 2^2 + 2^2 = 8 without subtracting the overlap ABCD. When there are multiple candidate keys, their supersets can overlap.',
    correctAnswer: 7,
    unit: 'superkeys',
    expectedFormat: 'integer',
  } as NumericSAQuestion,

  // ---- INDEPENDENT #4 ----
  {
    id: 'fd-ind-prime-attributes',
    moduleId: 'fd-closures-keys',
    subskill: 'prime-attribute-identification',
    format: 'msq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'Given R(A, B, C, D, E) with F = {AB -> CDE, C -> D} and candidate key AB, which attributes are prime? Select all that apply.',
    hints: [
      { level: 1, text: 'A prime attribute is one that is part of at least one candidate key.' },
      { level: 2, text: 'The only candidate key is AB. The attributes in it are A and B.' },
      { level: 3, text: 'A and B are prime. C, D, E are non-prime.' },
    ],
    fullExplanation: `The candidate key is AB. Prime attributes are those belonging to at least one candidate key.
Since AB is the only candidate key, the prime attributes are A and B.
C, D, and E are non-prime attributes because they do not appear in any candidate key.

Note: Even though C appears on the LHS of an FD (C -> D), that does not make it prime. Only membership in a candidate key matters.`,
    commonMisconception: 'Thinking that C is prime because it appears on the LHS of C -> D. Being a determinant does not make an attribute prime; only being part of a candidate key does.',
    options: [
      { id: 'a', text: 'A', isCorrect: true, explanation: 'A is part of candidate key AB, so it is prime.' },
      { id: 'b', text: 'B', isCorrect: true, explanation: 'B is part of candidate key AB, so it is prime.' },
      { id: 'c', text: 'C', isCorrect: false, explanation: 'C is not part of any candidate key.' },
      { id: 'd', text: 'D', isCorrect: false, explanation: 'D is not part of any candidate key.' },
      { id: 'e', text: 'E', isCorrect: false, explanation: 'E is not part of any candidate key.' },
    ],
  } as MSQQuestion,

  // ---- INDEPENDENT #5 ----
  {
    id: 'fd-ind-prime-two-keys',
    moduleId: 'fd-closures-keys',
    subskill: 'prime-attribute-identification',
    format: 'mcq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'Given R(A, B, C, D, E) with candidate keys AC and BC, how many prime attributes are there?',
    hints: [
      { level: 1, text: 'Prime attributes are those that appear in at least one candidate key.' },
      { level: 2, text: 'Key AC contributes A and C. Key BC contributes B and C. The union is {A, B, C}.' },
      { level: 3, text: 'The prime attributes are A, B, and C. That is 3 prime attributes.' },
    ],
    fullExplanation: `Candidate key AC gives prime attributes: A, C.
Candidate key BC gives prime attributes: B, C.
Union of all prime attributes = {A, B, C}.
Count = 3.

D and E are non-prime attributes.`,
    commonMisconception: 'Counting C twice because it appears in both keys. The question asks for the number of distinct prime attributes, not the total membership count.',
    options: [
      { id: 'a', text: '2', isCorrect: false, explanation: 'This would miss one of the three distinct prime attributes.' },
      { id: 'b', text: '3', isCorrect: true, explanation: 'Correct. A, B, and C are the three distinct prime attributes.' },
      { id: 'c', text: '4', isCorrect: false, explanation: 'Only 3 attributes appear across both candidate keys.' },
      { id: 'd', text: '5', isCorrect: false, explanation: 'D and E are non-prime.' },
    ],
  } as MCQQuestion,

  // ---- INDEPENDENT #6 ----
  {
    id: 'fd-ind-closure-chain',
    moduleId: 'fd-closures-keys',
    subskill: 'closure-computation',
    format: 'numeric-sa',
    difficulty: 'Foundation',
    source: 'PYQ-inspired',
    stem: 'Given R(A, B, C, D, E, F, G) with F = {A -> B, B -> C, C -> D, D -> E, E -> F, F -> G}, how many attributes are in the closure of {A}?',
    hints: [
      { level: 1, text: 'This is a pure chain. Start with {A} and follow the FDs one by one.' },
      { level: 2, text: 'A gives B, B gives C, C gives D, D gives E, E gives F, F gives G. Each step adds one attribute.' },
      { level: 3, text: 'The closure is {A, B, C, D, E, F, G}, which is all 7 attributes.' },
    ],
    fullExplanation: `Starting with {A}:
A -> B: add B. Now {A, B}
B -> C: add C. Now {A, B, C}
C -> D: add D. Now {A, B, C, D}
D -> E: add E. Now {A, B, C, D, E}
E -> F: add F. Now {A, B, C, D, E, F}
F -> G: add G. Now {A, B, C, D, E, F, G}

No more FDs to apply. The closure has 7 attributes (all of them).`,
    commonMisconception: 'Missing the last step in the chain. Always continue until no new attributes can be added.',
    correctAnswer: 7,
    unit: 'attributes',
    expectedFormat: 'integer',
  } as NumericSAQuestion,

  // ---- INDEPENDENT #7 ----
  {
    id: 'fd-ind-superkey-not-key',
    moduleId: 'fd-closures-keys',
    subskill: 'candidate-key-finding',
    format: 'mcq',
    difficulty: 'Challenge',
    source: 'PYQ-inspired',
    askConfidence: true,
    stem: 'Given R(W, X, Y, Z) with F = {WX -> Y, Y -> Z}, which of the following is a superkey but NOT a candidate key?',
    hints: [
      { level: 1, text: 'First find the candidate keys. Which attributes never appear on any RHS?' },
      { level: 2, text: 'W and X never appear on the RHS. WX+ = {W, X, Y, Z}, so WX is a candidate key. Since W and X are mandatory, WX is the only candidate key.' },
      { level: 3, text: 'Any superset of WX is a superkey but not a candidate key. WXY contains WX plus extra attribute Y, so it is a superkey but not minimal.' },
    ],
    fullExplanation: `Attributes not on any RHS: W, X. So every candidate key must contain {W, X}.
WX+ = {W, X, Y, Z}, so WX is a superkey and is minimal. WX is the only candidate key.

Now check options:
- WX is a candidate key (and also a superkey), so not the answer.
- WXY = WX union {Y}. Since WX is already a superkey, WXY is also a superkey but not minimal. This is a superkey but NOT a candidate key.
- W alone: W+ = {W}, not a superkey.
- YZ alone: YZ+ = {Y, Z}, not a superkey.`,
    commonMisconception: 'Confusing superkey with candidate key. Every candidate key is a superkey, but not every superkey is a candidate key. The key distinction is minimality.',
    options: [
      { id: 'a', text: 'WX', isCorrect: false, explanation: 'WX is a candidate key, not just a superkey.' },
      { id: 'b', text: 'WXY', isCorrect: true, explanation: 'Correct. WXY is a superkey (contains WX) but not minimal, so not a candidate key.' },
      { id: 'c', text: 'W', isCorrect: false, explanation: 'W+ = {W}, which is not a superkey.' },
      { id: 'd', text: 'YZ', isCorrect: false, explanation: 'YZ+ = {Y, Z}, not a superkey.' },
    ],
  } as MCQQuestion,

  // ---- INDEPENDENT #8 ----
  {
    id: 'fd-ind-closure-partial',
    moduleId: 'fd-closures-keys',
    subskill: 'closure-computation',
    format: 'mcq',
    difficulty: 'Foundation',
    source: 'PYQ-inspired',
    stem: 'Given R(P, Q, R, S) with F = {P -> Q, R -> S}, what is (PR)+?',
    hints: [
      { level: 1, text: 'Start with {P, R}. Check each FD.' },
      { level: 2, text: 'P -> Q: P is in {P, R}, so add Q. R -> S: R is in {P, R}, so add S.' },
      { level: 3, text: 'Result = {P, Q, R, S} = all attributes.' },
    ],
    fullExplanation: `Starting with {P, R}:
P -> Q: P is in the set, so add Q. Now {P, Q, R}
R -> S: R is in the set, so add S. Now {P, Q, R, S}

No more FDs apply. (PR)+ = {P, Q, R, S}. This means PR is a superkey.`,
    commonMisconception: 'Thinking P and R must be combined into PR on the LHS of some FD. The closure algorithm checks each FD independently.',
    options: [
      { id: 'a', text: '{P, Q, R}', isCorrect: false, explanation: 'You missed R -> S.' },
      { id: 'b', text: '{P, Q, R, S}', isCorrect: true, explanation: 'Correct. Both FDs fire from {P, R}.' },
      { id: 'c', text: '{P, R, S}', isCorrect: false, explanation: 'You missed P -> Q.' },
      { id: 'd', text: '{P, R}', isCorrect: false, explanation: 'Both FDs should fire and add Q and S.' },
    ],
  } as MCQQuestion,

  // ---- INDEPENDENT #9 ----
  {
    id: 'fd-ind-superkey-count-msq',
    moduleId: 'fd-closures-keys',
    subskill: 'superkey-counting',
    format: 'numeric-sa',
    difficulty: 'Challenge',
    source: 'PYQ-inspired',
    askConfidence: true,
    stem: 'R has 5 attributes (A, B, C, D, E) with one candidate key AB. How many superkeys contain exactly 3 attributes?',
    hints: [
      { level: 1, text: 'Every superkey must contain AB. For a 3-attribute superkey, you need AB plus exactly one more attribute.' },
      { level: 2, text: 'The extra attribute can be any of {C, D, E}. That gives 3 choices.' },
      { level: 3, text: 'The 3-attribute superkeys are ABC, ABD, ABE. Answer: 3.' },
    ],
    fullExplanation: `Every superkey must contain the candidate key AB.
For a superkey with exactly 3 attributes, we need AB plus one additional attribute from {C, D, E}.
Number of ways to choose 1 from 3 = C(3,1) = 3.
The superkeys are: ABC, ABD, ABE.`,
    commonMisconception: 'Using C(5,3) = 10 which counts all 3-attribute subsets, not just those containing AB.',
    correctAnswer: 3,
    unit: 'superkeys',
    expectedFormat: 'integer',
  } as NumericSAQuestion,

  // ---- INDEPENDENT #10 ----
  {
    id: 'fd-ind-candidate-key-compound',
    moduleId: 'fd-closures-keys',
    subskill: 'candidate-key-finding',
    format: 'mcq',
    difficulty: 'Challenge',
    source: 'PYQ-inspired',
    stem: 'Given R(A, B, C, D, E) with F = {A -> B, BC -> D, D -> E}, what is the candidate key?',
    hints: [
      { level: 1, text: 'Find attributes never on any RHS: A and C. Both must be in every candidate key.' },
      { level: 2, text: 'Compute AC+: {A,C} -> add B (via A->B) -> {A,B,C} -> add D (via BC->D) -> {A,B,C,D} -> add E (via D->E) -> {A,B,C,D,E}. AC is a superkey.' },
      { level: 3, text: 'AC is minimal (A and C are both mandatory). Is there a smaller key? No, because both A and C are required. So AC is the only candidate key.' },
    ],
    fullExplanation: `Step 1: Attributes not on any RHS = {A, C}. Every candidate key must include both.
Step 2: Compute AC+:
- Start: {A, C}
- A -> B: add B. Now {A, B, C}
- BC -> D: add D. Now {A, B, C, D}
- D -> E: add E. Now {A, B, C, D, E}
Step 3: AC is a superkey and minimal (both A and C are mandatory). AC is the only candidate key.`,
    commonMisconception: 'Trying A alone (A+ = {A, B}, missing C, D, E) or C alone (C+ = {C}, no FD fires). Both A and C are needed.',
    options: [
      { id: 'a', text: 'A', isCorrect: false, explanation: 'A+ = {A, B}, does not reach C, D, E.' },
      { id: 'b', text: 'AC', isCorrect: true, explanation: 'Correct. AC+ covers all attributes and is minimal.' },
      { id: 'c', text: 'ABC', isCorrect: false, explanation: 'Superkey but not minimal. AC alone suffices.' },
      { id: 'd', text: 'BC', isCorrect: false, explanation: 'BC+ = {B, C, D, E}, missing A.' },
    ],
  } as MCQQuestion,
];
