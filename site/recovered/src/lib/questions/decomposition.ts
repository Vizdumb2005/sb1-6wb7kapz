// ============================================================
// Lossless Decomposition, Dependency Preservation, Minimal Cover
// ============================================================

import { Question, MCQQuestion, MSQQuestion, NumericSAQuestion } from '../types';

export const allDecompositionQuestions: Question[] = [
  // ---- Q1: Lossless join test (Exam) ----
  {
    id: 'decomp-lossless-basic',
    moduleId: 'lossless-decomposition',
    subskill: 'lossless-join-test',
    format: 'mcq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'R(A, B, C, D, E) with F = {A -> B, B -> C, CD -> E}. Decompose into R1(A, B, C) and R2(A, D, E). Is the decomposition lossless?',
    hints: [
      { level: 1, text: 'For lossless join, check if (R1 intersection R2) determines R1 or R2 under F.' },
      { level: 2, text: 'R1 intersection R2 = {A}. Compute A+ under F: A gives B, then C via B->C, but not D or E directly. Wait, recheck: A -> B -> C, so A+ = {A, B, C}. A+ contains all of R1. So A -> R1.' },
      { level: 3, text: 'Since (R1 intersection R2) = {A} determines R1 (A+ contains A, B, C), the decomposition IS lossless.' },
    ],
    fullExplanation: `For binary decomposition into R1(A,B,C) and R2(A,D,E):
Step 1: Compute intersection = R1 intersection R2 = {A}.
Step 2: Compute A+ under F:
- Start: {A}
- A -> B: add B. Now {A, B}
- B -> C: add C. Now {A, B, C}
- CD -> E: need both C and D. D not in set. Cannot fire.
A+ = {A, B, C}.
Step 3: A+ contains all attributes of R1 (A, B, C). So A -> R1.
Conclusion: The decomposition is lossless.`,
    commonMisconception: 'Computing A+ incorrectly or stopping after A -> B. Always chain through all applicable FDs.',
    options: [
      { id: 'a', text: 'Yes, because A determines R1', isCorrect: true, explanation: 'Correct. A+ = {A, B, C} which covers all of R1.' },
      { id: 'b', text: 'No, because A does not determine R2', isCorrect: false, explanation: 'Lossless requires the intersection to determine R1 OR R2, not both.' },
      { id: 'c', text: 'No, because CD -> E is lost', isCorrect: false, explanation: 'Dependency preservation is a separate property from lossless join.' },
      { id: 'd', text: 'Cannot be determined from the given information', isCorrect: false, explanation: 'The FD set is sufficient to test lossless join.' },
    ],
  } as MCQQuestion,

  // ---- Q2: Dependency preservation (Exam) ----
  {
    id: 'decomp-dep-preserve',
    moduleId: 'lossless-decomposition',
    subskill: 'dependency-preservation-test',
    format: 'mcq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    askConfidence: true,
    stem: 'R(A, B, C, D, E) with F = {A -> B, B -> C, CD -> E}. Decompose into R1(A, B, C) and R2(A, D, E). Is the decomposition dependency-preserving?',
    hints: [
      { level: 1, text: 'Project each FD onto the decomposed relations. If every FD (or an equivalent one) is preserved in at least one relation, it is dependency-preserving.' },
      { level: 2, text: 'A -> B fits in R1 (A, B in R1). B -> C fits in R1. But CD -> E requires C (in R1) and D (in R2) and E (in R2) -- it spans both relations.' },
      { level: 3, text: 'CD -> E cannot be checked in R1 alone (D, E missing) or R2 alone (C missing). The union of projected FDs cannot derive CD -> E. Not dependency-preserving.' },
    ],
    fullExplanation: `Project FDs onto decomposed relations:
- R1(A, B, C): A -> B (fits), B -> C (fits). Projected: {A -> B, B -> C}.
- R2(A, D, E): No FD from F fits entirely in {A, D, E}. Projected: {}.

Union of projections: {A -> B, B -> C}.

Can we derive CD -> E from {A -> B, B -> C}? No, because C does not appear on any LHS of the projected FDs, so D and E are unreachable.

The dependency CD -> E is lost. The decomposition is NOT dependency-preserving.`,
    commonMisconception: 'Conflating lossless with dependency-preserving. A decomposition can be lossless but not dependency-preserving. These are independent properties.',
    options: [
      { id: 'a', text: 'Yes, all FDs are preserved', isCorrect: false, explanation: 'CD -> E is lost because it spans both R1 and R2.' },
      { id: 'b', text: 'No, CD -> E is not preserved', isCorrect: true, explanation: 'Correct. CD -> E requires attributes from both relations and cannot be checked in either alone.' },
      { id: 'c', text: 'No, A -> B is not preserved', isCorrect: false, explanation: 'A -> B is preserved in R1.' },
      { id: 'd', text: 'Yes, because the union of projections covers all attributes', isCorrect: false, explanation: 'Covering all attributes is not the same as preserving all FDs.' },
    ],
  } as MCQQuestion,

  // ---- Q3: Lossless + preservation combined MSQ (Challenge) ----
  {
    id: 'decomp-combined-msq',
    moduleId: 'lossless-decomposition',
    subskill: 'lossless-join-test',
    format: 'msq',
    difficulty: 'Challenge',
    source: 'PYQ-inspired',
    stem: 'R(A, B, C, D) with F = {A -> BCD, B -> C}. Decompose into R1(A, B) and R2(B, C, D). Select all true statements.',
    hints: [
      { level: 1, text: 'Lossless test: R1 intersection R2 = {B}. Does B determine R1 or R2? B+ = {B, C}. B+ contains R1 = {A, B}? No, A is missing.' },
      { level: 2, text: 'B+ = {B, C}. This does not contain all of R1 (missing A) nor all of R2 (missing D). So the decomposition is NOT lossless.' },
      { level: 3, text: 'Dependency preservation: A -> BCD spans both (A in R1, BCD spans both). B -> C fits in R2. So B -> C is preserved but A -> BCD is lost. Neither property fully holds.' },
    ],
    fullExplanation: `Lossless test:
Intersection = R1 intersection R2 = {B}.
B+ = {B} -> add C (via B -> C) -> {B, C}. No more FDs fire.
B+ = {B, C}.
Does B+ contain R1 = {A, B}? No (missing A).
Does B+ contain R2 = {B, C, D}? No (missing D).
NOT lossless.

Dependency preservation:
- A -> BCD: A in R1, but BCD spans R1 and R2. Not preserved in any single relation.
- B -> C: fits entirely in R2. Preserved.
NOT dependency-preserving (A -> BCD is lost).`,
    commonMisconception: 'Assuming that since B appears in both relations, the decomposition must be lossless. The intersection must FUNCTIONALLY DETERMINE one entire side, not just be a common attribute.',
    options: [
      { id: 'a', text: 'The decomposition is lossless', isCorrect: false, explanation: 'B+ = {B, C} does not cover R1 or R2 entirely.' },
      { id: 'b', text: 'The decomposition is dependency-preserving', isCorrect: false, explanation: 'A -> BCD is lost.' },
      { id: 'c', text: 'B -> C is preserved in R2', isCorrect: true, explanation: 'Correct. B and C are both in R2.' },
      { id: 'd', text: 'R2 is in BCNF', isCorrect: true, explanation: 'Correct. In R2(B,C,D) with projected FD B->C, B is a key for R2 (B+ in R2 = {B,C,D}). The only non-trivial FD has a superkey LHS.' },
    ],
  } as MSQQuestion,

  // ---- Q4: Minimal cover - remove redundant FD (Exam) ----
  {
    id: 'decomp-minimal-cover-redundant',
    moduleId: 'lossless-decomposition',
    subskill: 'minimal-cover-computation',
    format: 'mcq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'Given F = {A -> B, B -> C, A -> C}, which FD is redundant (can be removed without changing F+)?',
    hints: [
      { level: 1, text: 'Try removing each FD one at a time and check if it can be derived from the remaining ones.' },
      { level: 2, text: 'Remove A -> C: Can we derive A -> C from {A -> B, B -> C}? Yes, by transitivity: A -> B and B -> C gives A -> C.' },
      { level: 3, text: 'A -> C is redundant. The minimal cover includes {A -> B, B -> C}.' },
    ],
    fullExplanation: `Test each FD for redundancy:

1. Remove A -> B: Remaining = {B -> C, A -> C}. Can we derive A -> B? A+ with remaining = {A, C}. B is not in A+. Cannot derive. A -> B is NOT redundant.

2. Remove B -> C: Remaining = {A -> B, A -> C}. Can we derive B -> C? B+ with remaining = {B}. Cannot derive. B -> C is NOT redundant.

3. Remove A -> C: Remaining = {A -> B, B -> C}. Can we derive A -> C? A+ with remaining = {A, B, C} (A -> B -> C by transitivity). A -> C follows. A -> C IS redundant.

Minimal cover (after removing redundancy): {A -> B, B -> C}.`,
    commonMisconception: 'Removing A -> B thinking it is redundant because A -> C exists. But A -> B cannot be derived from the other FDs.',
    options: [
      { id: 'a', text: 'A -> B', isCorrect: false, explanation: 'Cannot be derived from {B -> C, A -> C}.' },
      { id: 'b', text: 'B -> C', isCorrect: false, explanation: 'Cannot be derived from {A -> B, A -> C}.' },
      { id: 'c', text: 'A -> C', isCorrect: true, explanation: 'Correct. A -> C follows by transitivity from A -> B and B -> C.' },
      { id: 'd', text: 'None; all are needed', isCorrect: false, explanation: 'A -> C is derivable from the others.' },
    ],
  } as MCQQuestion,

  // ---- Q5: Minimal cover - extraneous attribute (Challenge) ----
  {
    id: 'decomp-minimal-extraneous',
    moduleId: 'lossless-decomposition',
    subskill: 'minimal-cover-computation',
    format: 'mcq',
    difficulty: 'Challenge',
    source: 'PYQ-inspired',
    stem: 'Given F = {A -> BC, B -> C, A -> B, AB -> D}, which attribute is extraneous in the FD AB -> D?',
    hints: [
      { level: 1, text: 'To test if B is extraneous in AB -> D: remove B and check if A -> D follows from the remaining FDs.' },
      { level: 2, text: 'Remove AB -> D. Check A+ with {A -> BC, B -> C, A -> B}: A+ = {A, B, C}. Does A determine D? No, D is not in A+. Now check with AB -> D replaced by A -> D: A+ = {A, B, C, D}. This is stronger.' },
      { level: 3, text: 'Actually, the correct test: with F - {AB -> D} = {A -> BC, B -> C, A -> B}, compute (A)+ = {A, B, C}. D is not in A+. So A -> D does not follow from the remaining FDs. But test B: B+ = {B, C}. D not in B+. So neither A nor B alone can determine D from the remaining FDs. However, with A -> B in the set, AB -> D can be simplified. Since A -> B holds, whenever AB -> D holds, A -> D also holds (because B is already determined by A). So B is extraneous.' },
    ],
    fullExplanation: `To check if B is extraneous in AB -> D:
Consider F with AB -> D replaced by A -> D: {A -> BC, B -> C, A -> B, A -> D}.
Compute the closure of the original FD set F: A+ = {A, B, C, D}.
Compute the closure with A -> D replacing AB -> D: same result. So the replacement is equivalent, meaning B is extraneous.

Alternative check: Since A -> B is already in F, the LHS AB is equivalent to just A. So B adds nothing new to the determinant. B is extraneous.

After removing B and also removing redundant FDs:
- A -> BC can stay or be split to A -> B and A -> C
- A -> B is implied by A -> BC
- B -> C is implied by A -> B -> C (via A -> BC)? No, B -> C must hold independently.

A minimal cover: {A -> B, B -> C, A -> D}.`,
    commonMisconception: 'Thinking no attribute is extraneous because neither A nor B alone can determine D. The key insight is that A -> B already exists, making B redundant on the LHS of AB -> D.',
    options: [
      { id: 'a', text: 'A', isCorrect: false, explanation: 'Without A, B+ = {B, C}, which does not include D.' },
      { id: 'b', text: 'B', isCorrect: true, explanation: 'Correct. Since A -> B holds, B is redundant in AB -> D.' },
      { id: 'c', text: 'Both A and B', isCorrect: false, explanation: 'At least one of them must remain.' },
      { id: 'd', text: 'Neither; no attribute is extraneous', isCorrect: false, explanation: 'B is extraneous because A -> B already holds.' },
    ],
  } as MCQQuestion,

  // ---- Q6: Lossless join - not lossless (Foundation) ----
  {
    id: 'decomp-not-lossless',
    moduleId: 'lossless-decomposition',
    subskill: 'lossless-join-test',
    format: 'mcq',
    difficulty: 'Foundation',
    source: 'PYQ-inspired',
    stem: 'R(A, B, C) with F = {A -> B, C -> B}. Decompose into R1(A, B) and R2(B, C). Is the decomposition lossless?',
    hints: [
      { level: 1, text: 'Intersection = R1 intersection R2 = {B}. Does B determine R1 or R2?' },
      { level: 2, text: 'B+ = {B}. No FD has B alone on the LHS. B+ does not contain R1 = {A, B} or R2 = {B, C}.' },
      { level: 3, text: 'Since B+ = {B}, the intersection does not determine either side. The decomposition is NOT lossless.' },
    ],
    fullExplanation: `Lossless test:
Intersection = {B}.
Compute B+ under F = {A -> B, C -> B}:
- No FD has B alone on the LHS.
B+ = {B}.

B+ does not contain all of R1 (missing A) and does not contain all of R2 (missing C).

The decomposition is NOT lossless.`,
    commonMisconception: 'Thinking that having a common attribute B guarantees lossless join. The common attribute must FUNCTIONALLY DETERMINE one entire relation.',
    options: [
      { id: 'a', text: 'Yes, because B is common to both relations', isCorrect: false, explanation: 'Having a common attribute is necessary but not sufficient. The intersection must determine one side.' },
      { id: 'b', text: 'No, because B does not determine R1 or R2', isCorrect: true, explanation: 'Correct. B+ = {B} which does not cover either relation.' },
      { id: 'c', text: 'Yes, because the union of R1 and R2 equals R', isCorrect: false, explanation: 'The union being equal to R is necessary but not sufficient for lossless join.' },
      { id: 'd', text: 'Cannot determine without knowing the instances', isCorrect: false, explanation: 'Lossless join is tested using the FD set, not instances.' },
    ],
  } as MCQQuestion,

  // ---- Q7: Minimal cover - split RHS (Exam) ----
  {
    id: 'decomp-minimal-split-rhs',
    moduleId: 'lossless-decomposition',
    subskill: 'minimal-cover-computation',
    format: 'mcq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'Given F = {AB -> CDE, C -> D}, which of the following is part of computing the minimal cover?',
    hints: [
      { level: 1, text: 'The first step of finding a minimal cover is to split all RHS that have multiple attributes.' },
      { level: 2, text: 'AB -> CDE should be split into AB -> C, AB -> D, and AB -> E.' },
      { level: 3, text: 'After splitting, check for extraneous LHS attributes and redundant FDs. Splitting the RHS is always the first step.' },
    ],
    fullExplanation: `Step 1 of minimal cover computation: Split RHS of multi-attribute FDs.
AB -> CDE splits into:
- AB -> C
- AB -> D
- AB -> E

C -> D already has a single attribute on RHS.

After splitting: {AB -> C, AB -> D, AB -> E, C -> D}

Further steps would check:
- Is D extraneous in AB -> D? Since C -> D exists, check (AB)+ with {AB -> C, AB -> E, C -> D}: AB+ = {A, B, C, E, D}. Now AB -> D follows from AB -> C then C -> D. So AB -> D is redundant and can be removed.

One minimal cover: {AB -> C, AB -> E, C -> D}.`,
    commonMisconception: 'Skipping the RHS-splitting step and directly looking for redundant FDs. The algorithm is: split RHS first, then remove extraneous LHS attributes, then remove redundant FDs.',
    options: [
      { id: 'a', text: 'Split AB -> CDE into AB -> C, AB -> D, AB -> E', isCorrect: true, explanation: 'Correct. Splitting multi-attribute RHS is the first step.' },
      { id: 'b', text: 'Remove AB -> CDE entirely', isCorrect: false, explanation: 'You split first, then check for redundancy of individual split FDs.' },
      { id: 'c', text: 'Split C -> D into C -> D (no change needed)', isCorrect: false, explanation: 'C -> D already has a single attribute on RHS; no splitting needed.' },
      { id: 'd', text: 'Merge AB -> CDE with C -> D', isCorrect: false, explanation: 'Merging FDs is not a step in the minimal cover algorithm.' },
    ],
  } as MCQQuestion,

  // ---- Q8: Dependency preservation - preserved (Exam) ----
  {
    id: 'decomp-dep-preserved-yes',
    moduleId: 'lossless-decomposition',
    subskill: 'dependency-preservation-test',
    format: 'mcq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    askConfidence: true,
    stem: 'R(A, B, C) with F = {A -> B, B -> C}. Decompose into R1(A, B) and R2(B, C). Is the decomposition dependency-preserving?',
    hints: [
      { level: 1, text: 'Project each FD: A -> B uses attributes in R1 only. B -> C uses attributes in R2 only.' },
      { level: 2, text: 'A -> B is preserved in R1. B -> C is preserved in R2. Both original FDs are preserved.' },
      { level: 3, text: 'Since every original FD is preserved in at least one decomposed relation, the decomposition is dependency-preserving.' },
    ],
    fullExplanation: `Project FDs:
- A -> B: A and B are both in R1(A, B). Preserved in R1.
- B -> C: B and C are both in R2(B, C). Preserved in R2.

All original FDs are preserved. The decomposition IS dependency-preserving.

Bonus: Is it lossless? Intersection = {B}. B+ = {B, C} (via B -> C). B+ contains all of R2. So it is also lossless.`,
    commonMisconception: 'Thinking that A -> C must be explicitly preserved. A -> C is not in the original FD set; it is only derivable. Only the original FDs need to be preserved.',
    options: [
      { id: 'a', text: 'Yes, both FDs are preserved', isCorrect: true, explanation: 'Correct. Each FD fits entirely within one decomposed relation.' },
      { id: 'b', text: 'No, A -> C is lost', isCorrect: false, explanation: 'A -> C is not an original FD; it is derivable and does not need explicit preservation.' },
      { id: 'c', text: 'No, the FDs span both relations', isCorrect: false, explanation: 'A -> B fits in R1 and B -> C fits in R2.' },
      { id: 'd', text: 'Cannot be determined', isCorrect: false, explanation: 'The projection is straightforward.' },
    ],
  } as MCQQuestion,

  // ---- Q9: Minimal cover - count (Challenge) ----
  {
    id: 'decomp-minimal-count',
    moduleId: 'lossless-decomposition',
    subskill: 'minimal-cover-computation',
    format: 'numeric-sa',
    difficulty: 'Challenge',
    source: 'PYQ-inspired',
    stem: 'What is the minimum number of FDs in a canonical (minimal) cover of F = {A -> BC, A -> B, B -> C, A -> D}?',
    hints: [
      { level: 1, text: 'Step 1: Split RHS. A -> BC becomes A -> B and A -> C. Now F = {A -> B, A -> C, A -> B (dup), B -> C, A -> D}.' },
      { level: 2, text: 'Step 2: Remove duplicates. Remove extra A -> B. Now {A -> B, A -> C, B -> C, A -> D}. Step 3: Remove redundant FDs. A -> C follows from A -> B and B -> C. Remove A -> C. Now {A -> B, B -> C, A -> D}.' },
      { level: 3, text: 'Check remaining: 3 FDs. Can any be removed? A -> B: needed (B -> C and A -> D cannot derive it). B -> C: needed. A -> D: needed. Minimal cover has 3 FDs.' },
    ],
    fullExplanation: `Step 1 - Split RHS:
A -> BC becomes A -> B, A -> C.
Now: {A -> B, A -> B, A -> C, B -> C, A -> D}

Step 2 - Remove duplicates:
{A -> B, A -> C, B -> C, A -> D}

Step 3 - Remove redundant FDs:
Test A -> C: with {A -> B, B -> C, A -> D}, A+ = {A, B, C, D}. A -> C follows. Remove it.
Remaining: {A -> B, B -> C, A -> D}

Test A -> B: with {B -> C, A -> D}, A+ = {A, D}. B not in A+. Keep.
Test B -> C: with {A -> B, A -> D}, B+ = {B}. C not in B+. Keep.
Test A -> D: with {A -> B, B -> C}, A+ = {A, B, C}. D not in A+. Keep.

Minimal cover: {A -> B, B -> C, A -> D} -- 3 FDs.

No extraneous LHS attributes (all LHS are single attributes).`,
    commonMisconception: 'Forgetting to split A -> BC first, or not checking all FDs for redundancy. The split step can reveal redundancy.',
    correctAnswer: 3,
    unit: 'FDs',
    expectedFormat: 'integer',
  } as NumericSAQuestion,
];
