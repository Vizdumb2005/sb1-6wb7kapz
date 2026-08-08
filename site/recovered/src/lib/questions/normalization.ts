// ============================================================
// Normalization: 2NF, 3NF, BCNF Testing
// ============================================================

import { Question, MCQQuestion, MSQQuestion, NumericSAQuestion } from '../types';

export const allNormalizationQuestions: Question[] = [
  // ---- Q1: 3NF with prime RHS (Exam) ----
  {
    id: 'norm-3nf-prime-rhs',
    moduleId: 'normalization',
    subskill: '3nf-testing',
    format: 'mcq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'Given R(A, B, C, D) with F = {AB -> C, C -> B}, where AB is the only candidate key, what is the highest normal form of R?',
    hints: [
      { level: 1, text: 'First identify prime attributes. They are A and B (from candidate key AB).' },
      { level: 2, text: 'For BCNF, every non-trivial FD must have a superkey on the LHS. C -> B violates BCNF because C is not a superkey.' },
      { level: 3, text: 'For 3NF, the exception allows non-superkey determinants if the RHS is prime. In C -> B, B is prime. So 3NF is satisfied.' },
    ],
    fullExplanation: `Step 1: Candidate key = AB. Prime attributes = {A, B}. Non-prime = {C, D}.
Step 2: Check BCNF for each non-trivial FD:
- AB -> C: AB is a superkey. OK.
- C -> B: C is NOT a superkey. Violates BCNF.
Step 3: Since BCNF is violated, check 3NF. The 3NF rule allows C -> B because B is a prime attribute (part of candidate key AB). So 3NF is satisfied.
Step 4: Is 2NF relevant? The candidate key AB is composite. Is there a partial dependency of a non-prime attribute on a proper subset of AB? A+ = {A}, B+ = {A, B, C} (via B+ adds C? No, B alone: no FD has B alone on LHS). Actually B+ = {B}. So no partial dependency on non-prime attributes. 2NF is satisfied.
Highest normal form: 3NF.`,
    commonMisconception: 'Immediately saying BCNF because you see only two FDs. You must check whether every determinant is a superkey for BCNF.',
    options: [
      { id: 'a', text: '1NF', isCorrect: false, explanation: '2NF and 3NF are both satisfied.' },
      { id: 'b', text: '2NF', isCorrect: false, explanation: '3NF is also satisfied.' },
      { id: 'c', text: '3NF', isCorrect: true, explanation: 'Correct. C -> B violates BCNF but satisfies 3NF because B is prime.' },
      { id: 'd', text: 'BCNF', isCorrect: false, explanation: 'C is not a superkey, so C -> B violates BCNF.' },
    ],
  } as MCQQuestion,

  // ---- Q2: BCNF testing (Exam) ----
  {
    id: 'norm-bcnf-simple',
    moduleId: 'normalization',
    subskill: 'bcnf-testing',
    format: 'mcq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    askConfidence: true,
    stem: 'Given R(A, B, C, D) with F = {A -> B, A -> C, A -> D}, where A is the only candidate key, what is the highest normal form?',
    hints: [
      { level: 1, text: 'Check each FD: is the LHS a superkey?' },
      { level: 2, text: 'A is the candidate key (hence a superkey). Every FD has A on the LHS. So every determinant is a superkey.' },
      { level: 3, text: 'Since every non-trivial FD has a superkey determinant, the relation is in BCNF (and therefore also 3NF and 2NF).' },
    ],
    fullExplanation: `Candidate key: A. Prime attributes: {A}.
Check each non-trivial FD:
- A -> B: A is a superkey. OK.
- A -> C: A is a superkey. OK.
- A -> D: A is a superkey. OK.

All non-trivial FDs have a superkey on the LHS. Therefore R is in BCNF.
Since BCNF implies 3NF implies 2NF implies 1NF, the highest normal form is BCNF.`,
    commonMisconception: 'Thinking that having multiple FDs from the same key means a lower normal form. The normal form depends on whether non-key determinants exist, not on the number of FDs.',
    options: [
      { id: 'a', text: '2NF', isCorrect: false, explanation: '3NF and BCNF are both satisfied.' },
      { id: 'b', text: '3NF', isCorrect: false, explanation: 'BCNF is also satisfied.' },
      { id: 'c', text: 'BCNF', isCorrect: true, explanation: 'Correct. Every non-trivial FD has A (a superkey) on the LHS.' },
      { id: 'd', text: '1NF', isCorrect: false, explanation: 'All higher forms are satisfied.' },
    ],
  } as MCQQuestion,

  // ---- Q3: 2NF partial dependency (Exam) ----
  {
    id: 'norm-2nf-partial',
    moduleId: 'normalization',
    subskill: '2nf-testing',
    format: 'mcq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'Given R(A, B, C, D) with F = {AB -> C, A -> D}, where AB is the candidate key, what is the highest normal form?',
    hints: [
      { level: 1, text: 'The candidate key AB is composite. For 2NF, check for partial dependencies of non-prime attributes on a proper subset of the key.' },
      { level: 2, text: 'Non-prime attributes are C and D. A -> D is a partial dependency: A is a proper subset of AB, and D is non-prime.' },
      { level: 3, text: 'Since a non-prime attribute D depends on a proper subset A of the candidate key AB, 2NF is violated. The relation is in 1NF only.' },
    ],
    fullExplanation: `Candidate key: AB. Prime attributes: {A, B}. Non-prime: {C, D}.

For 2NF: No non-prime attribute should depend on a proper subset of any candidate key.
- A -> D: A is a proper subset of AB, and D is non-prime. This is a partial dependency. 2NF is violated.

Since 2NF is not satisfied, the highest normal form is 1NF.`,
    commonMisconception: 'Thinking that A -> D is fine because A is part of the key. In 2NF, a non-prime attribute must depend on the ENTIRE candidate key, not just a part.',
    options: [
      { id: 'a', text: '1NF', isCorrect: true, explanation: 'Correct. A -> D is a partial dependency of non-prime D on part of key AB.' },
      { id: 'b', text: '2NF', isCorrect: false, explanation: 'A -> D violates 2NF.' },
      { id: 'c', text: '3NF', isCorrect: false, explanation: '2NF must hold before 3NF can hold.' },
      { id: 'd', text: 'BCNF', isCorrect: false, explanation: 'The relation is not even in 2NF.' },
    ],
  } as MCQQuestion,

  // ---- Q4: 3NF vs BCNF MSQ (Challenge) ----
  {
    id: 'norm-3nf-vs-bcnf-msq',
    moduleId: 'normalization',
    subskill: 'bcnf-testing',
    format: 'msq',
    difficulty: 'Challenge',
    source: 'PYQ-inspired',
    stem: 'Given R(A, B, C) with F = {A -> B, B -> C}, where A is the only candidate key. Which of the following statements are true? Select all that apply.',
    hints: [
      { level: 1, text: 'Prime attributes: A (only key attribute). Non-prime: B, C.' },
      { level: 2, text: 'B -> C: B is not a superkey. For BCNF this fails. For 3NF, C must be prime for the exception. C is NOT prime. So 3NF also fails.' },
      { level: 3, text: 'A -> B is fine (A is a superkey). B -> C violates both BCNF and 3NF. The highest NF is 2NF since no partial dependency exists (key A is single-attribute, so 2NF is trivially satisfied).' },
    ],
    fullExplanation: `Candidate key: A. Prime: {A}. Non-prime: {B, C}.

Check each FD:
- A -> B: A is superkey. Fine for all NFs.
- B -> C: B is NOT a superkey.
  - BCNF: violates (determinant not superkey).
  - 3NF: C is not prime, so the 3NF exception does not apply. Violates 3NF.
  - 2NF: A is single-attribute, so no partial dependency possible. 2NF holds.

Highest normal form: 2NF.

True statements:
- R is in 2NF (yes, trivially because the key is single-attribute)
- R is NOT in 3NF
- R is NOT in BCNF
- B -> C violates both 3NF and BCNF`,
    commonMisconception: 'Assuming that 3NF always holds when 2NF holds. 3NF has an additional constraint: non-superkey determinants are only allowed when the RHS is prime.',
    options: [
      { id: 'a', text: 'R is in 2NF', isCorrect: true, explanation: 'Correct. A is a single-attribute candidate key, so no partial dependency is possible.' },
      { id: 'b', text: 'R is in 3NF', isCorrect: false, explanation: 'B -> C violates 3NF because B is not a superkey and C is not prime.' },
      { id: 'c', text: 'R is in BCNF', isCorrect: false, explanation: 'B -> C violates BCNF because B is not a superkey.' },
      { id: 'd', text: 'B -> C is the violating dependency', isCorrect: true, explanation: 'Correct. This is the FD that breaks 3NF and BCNF.' },
    ],
  } as MSQQuestion,

  // ---- Q5: BCNF with two keys (Challenge) ----
  {
    id: 'norm-bcnf-two-keys',
    moduleId: 'normalization',
    subskill: 'bcnf-testing',
    format: 'mcq',
    difficulty: 'Challenge',
    source: 'PYQ-inspired',
    askConfidence: true,
    stem: 'Given R(A, B, C) with F = {A -> B, B -> A, A -> C}, candidate keys are A and B. What is the highest normal form?',
    hints: [
      { level: 1, text: 'Prime attributes: A and B (both in candidate keys). Check each FD for BCNF.' },
      { level: 2, text: 'A -> B: A is a superkey. A -> C: A is a superkey. B -> A: B is a superkey. All LHS are superkeys.' },
      { level: 3, text: 'Every non-trivial FD has a superkey on the LHS. R is in BCNF.' },
    ],
    fullExplanation: `Candidate keys: A and B. Prime attributes: {A, B}. Non-prime: {C}.

Check each non-trivial FD:
- A -> B: A is a superkey. OK for BCNF.
- B -> A: B is a superkey. OK for BCNF.
- A -> C: A is a superkey. OK for BCNF.

All determinants are superkeys. R is in BCNF.`,
    commonMisconception: 'Thinking that having A -> B and B -> A (a cycle) means a lower normal form. Cycles do not violate BCNF as long as both sides are superkeys.',
    options: [
      { id: 'a', text: '2NF', isCorrect: false, explanation: 'BCNF is achieved.' },
      { id: 'b', text: '3NF', isCorrect: false, explanation: 'BCNF is achieved.' },
      { id: 'c', text: 'BCNF', isCorrect: true, explanation: 'Correct. Every non-trivial FD has a superkey determinant.' },
      { id: 'd', text: '1NF', isCorrect: false, explanation: 'Much higher normal forms are satisfied.' },
    ],
  } as MCQQuestion,

  // ---- Q6: 3NF with composite key (Exam) ----
  {
    id: 'norm-3nf-composite',
    moduleId: 'normalization',
    subskill: '3nf-testing',
    format: 'mcq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'Given R(A, B, C, D) with F = {AB -> CD, C -> A}, candidate keys are AB and BC. What is the highest normal form?',
    hints: [
      { level: 1, text: 'Prime attributes: A, B, C (union of all candidate key attributes). Non-prime: {D}. Check C -> A.' },
      { level: 2, text: 'C -> A: C is NOT a superkey (C+ = {C, A}, does not reach B or D). For 3NF, is A prime? Yes, A is prime. So the 3NF exception applies.' },
      { level: 3, text: 'BCNF fails because C is not a superkey. 3NF holds because the RHS A is prime. No partial dependency of D on a subset of AB or BC. Highest NF: 3NF.' },
    ],
    fullExplanation: `Candidate keys: AB, BC. Prime attributes: {A, B, C}. Non-prime: {D}.

Check BCNF:
- AB -> CD: AB is a superkey. OK.
- C -> A: C is NOT a superkey. BCNF violated.

Check 3NF for C -> A: A is a prime attribute, so the 3NF exception applies. 3NF satisfied.

Check 2NF: D is non-prime. Does D depend on a proper subset of any candidate key? AB -> CD gives D via the full key. C -> A does not involve D. So no partial dependency. 2NF satisfied.

Highest normal form: 3NF.`,
    commonMisconception: 'Forgetting that A is prime because it appears in both candidate keys. This is crucial for the 3NF exception.',
    options: [
      { id: 'a', text: '2NF', isCorrect: false, explanation: '3NF is satisfied via the prime-attribute exception.' },
      { id: 'b', text: '3NF', isCorrect: true, explanation: 'Correct. C -> A violates BCNF but satisfies 3NF because A is prime.' },
      { id: 'c', text: 'BCNF', isCorrect: false, explanation: 'C is not a superkey, so C -> A violates BCNF.' },
      { id: 'd', text: '1NF', isCorrect: false, explanation: '2NF and 3NF are both satisfied.' },
    ],
  } as MCQQuestion,

  // ---- Q7: 2NF only - clear violation (Foundation) ----
  {
    id: 'norm-2nf-only',
    moduleId: 'normalization',
    subskill: '2nf-testing',
    format: 'mcq',
    difficulty: 'Foundation',
    source: 'PYQ-inspired',
    stem: 'Given R(A, B, C, D) with F = {AB -> CD, A -> B, B -> C}, where AB is the candidate key. Which normal form does R satisfy?',
    hints: [
      { level: 1, text: 'Candidate key AB is composite. Prime attributes: {A, B}. Non-prime: {C, D}.' },
      { level: 2, text: 'A -> B: A is a proper subset of key AB, but B is prime, so this does not violate 2NF. B -> C: B is a proper subset of key AB, and C is non-prime. This IS a partial dependency violation.' },
      { level: 3, text: 'B -> C violates 2NF (non-prime C partially depends on B, a subset of key AB). R is in 1NF only.' },
    ],
    fullExplanation: `Candidate key: AB. Prime: {A, B}. Non-prime: {C, D}.

2NF check (partial dependencies of non-prime on proper subset of key):
- A -> B: B is prime. Not a 2NF violation (2NF only cares about non-prime RHS).
- B -> C: B is a proper subset of AB, and C is non-prime. 2NF VIOLATED.
- AB -> CD: full key dependency. Fine.

Since 2NF is violated, highest normal form is 1NF.`,
    commonMisconception: 'Thinking A -> B causes the 2NF violation. In 2NF, we only check partial dependencies where the RHS is non-prime. B is prime, so A -> B is not a 2NF issue.',
    options: [
      { id: 'a', text: '1NF', isCorrect: true, explanation: 'Correct. B -> C is a partial dependency of non-prime C on a subset of key AB.' },
      { id: 'b', text: '2NF', isCorrect: false, explanation: 'B -> C violates 2NF.' },
      { id: 'c', text: '3NF', isCorrect: false, explanation: '2NF does not even hold.' },
      { id: 'd', text: 'BCNF', isCorrect: false, explanation: 'The relation is not even in 2NF.' },
    ],
  } as MCQQuestion,

  // ---- Q8: Identify violating FD (Exam) ----
  {
    id: 'norm-identify-violator',
    moduleId: 'normalization',
    subskill: 'bcnf-testing',
    format: 'mcq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'Given R(A, B, C, D, E) with F = {AB -> C, C -> D, D -> E}, candidate key is AB. Which FD prevents R from being in BCNF?',
    hints: [
      { level: 1, text: 'Check each FD: is the LHS a superkey? AB is a superkey.' },
      { level: 2, text: 'C -> D: is C a superkey? C+ = {C, D, E}, missing A and B. C is not a superkey. This violates BCNF.' },
      { level: 3, text: 'C -> D and D -> E both have non-superkey LHS, but the first one encountered in the chain (C -> D) is the one that prevents BCNF.' },
    ],
    fullExplanation: `Candidate key: AB.

Check each FD:
- AB -> C: AB is a superkey. OK for BCNF.
- C -> D: C+ = {C, D, E}. C is NOT a superkey. VIOLATES BCNF.
- D -> E: D+ = {D, E}. D is NOT a superkey. Also violates BCNF.

Both C -> D and D -> E violate BCNF. The one that first appears in the dependency chain (and the one whose LHS is not derivable from the key) is C -> D. This is typically cited as the primary BCNF violator.`,
    commonMisconception: 'Picking AB -> C as the violator. AB is the candidate key, so it satisfies BCNF. The problem is with non-key determinants C and D.',
    options: [
      { id: 'a', text: 'AB -> C', isCorrect: false, explanation: 'AB is a superkey. This FD satisfies BCNF.' },
      { id: 'b', text: 'C -> D', isCorrect: true, explanation: 'Correct. C is not a superkey, so this violates BCNF.' },
      { id: 'c', text: 'D -> E', isCorrect: false, explanation: 'While D -> E also violates BCNF, C -> D is the primary violator that breaks the chain.' },
      { id: 'd', text: 'None; R is in BCNF', isCorrect: false, explanation: 'Multiple FDs have non-superkey determinants.' },
    ],
  } as MCQQuestion,

  // ---- Q9: BCNF with trivial dependency (Foundation) ----
  {
    id: 'norm-bcnf-trivial',
    moduleId: 'normalization',
    subskill: 'bcnf-testing',
    format: 'mcq',
    difficulty: 'Foundation',
    source: 'PYQ-inspired',
    stem: 'R(A, B, C) has F = {AB -> C, A -> A}. Candidate key is AB. What is the highest normal form?',
    hints: [
      { level: 1, text: 'A -> A is a trivial FD (the RHS is a subset of the LHS). Trivial FDs do not affect normal form testing.' },
      { level: 2, text: 'The only non-trivial FD is AB -> C, and AB is a superkey.' },
      { level: 3, text: 'Since the only non-trivial FD has a superkey determinant, R is in BCNF.' },
    ],
    fullExplanation: `Candidate key: AB.

FDs:
- A -> A: Trivial (A is a subset of A). Ignored for normal form testing.
- AB -> C: AB is a superkey. OK for BCNF.

The only non-trivial FD has a superkey on the LHS. R is in BCNF.`,
    commonMisconception: 'Thinking A -> A creates a problem. Trivial FDs (where the RHS is a subset of the LHS) are always satisfied and never violate any normal form.',
    options: [
      { id: 'a', text: '2NF', isCorrect: false, explanation: 'BCNF is satisfied.' },
      { id: 'b', text: '3NF', isCorrect: false, explanation: 'BCNF is satisfied.' },
      { id: 'c', text: 'BCNF', isCorrect: true, explanation: 'Correct. The only non-trivial FD (AB -> C) has a superkey LHS.' },
      { id: 'd', text: '1NF', isCorrect: false, explanation: 'All higher normal forms are satisfied.' },
    ],
  } as MCQQuestion,

  // ---- Q10: 3NF multiple candidate keys (Challenge) ----
  {
    id: 'norm-3nf-multi-keys',
    moduleId: 'normalization',
    subskill: '3nf-testing',
    format: 'msq',
    difficulty: 'Challenge',
    source: 'PYQ-inspired',
    askConfidence: true,
    stem: 'Given R(A, B, C, D) with F = {A -> B, B -> A, C -> D, D -> C}, candidate keys are A, B, C, D. Which statements are true?',
    hints: [
      { level: 1, text: 'Prime attributes: all of A, B, C, D (every attribute is in some candidate key). There are no non-prime attributes.' },
      { level: 2, text: 'Check BCNF: A is a superkey, B is a superkey, C is a superkey, D is a superkey. All determinants are superkeys.' },
      { level: 3, text: 'All FDs have superkey LHS. R is in BCNF. Since every attribute is prime, 3NF is also trivially satisfied even if it were needed.' },
    ],
    fullExplanation: `Candidate keys: A, B, C, D. Prime attributes: {A, B, C, D}. Non-prime: none.

Check BCNF:
- A -> B: A is a superkey. OK.
- B -> A: B is a superkey. OK.
- C -> D: C is a superkey. OK.
- D -> C: D is a superkey. OK.

All non-trivial FDs have superkey determinants. R is in BCNF.

Since all attributes are prime, even if BCNF were not met, the 3NF exception would apply to every FD. But BCNF is directly satisfied.

True statements:
- R is in BCNF
- R is in 3NF
- Every attribute is prime
- There are no non-prime attributes`,
    commonMisconception: 'Thinking C -> D or D -> C might violate some normal form because they involve different attribute groups. But C and D are both superkeys, so all FDs are fine.',
    options: [
      { id: 'a', text: 'R is in BCNF', isCorrect: true, explanation: 'All determinants are superkeys.' },
      { id: 'b', text: 'R is in 3NF but not BCNF', isCorrect: false, explanation: 'BCNF is satisfied, so this is false.' },
      { id: 'c', text: 'Every attribute is prime', isCorrect: true, explanation: 'All four attributes appear in at least one candidate key.' },
      { id: 'd', text: 'C -> D violates BCNF', isCorrect: false, explanation: 'C is a superkey, so C -> D satisfies BCNF.' },
    ],
  } as MSQQuestion,

  // ---- Q11: 2NF edge case - single attribute key (Foundation) ----
  {
    id: 'norm-2nf-single-key',
    moduleId: 'normalization',
    subskill: '2nf-testing',
    format: 'mcq',
    difficulty: 'Foundation',
    source: 'PYQ-inspired',
    stem: 'R(A, B, C) has candidate key A and F = {A -> B, A -> C}. Which is the highest normal form?',
    hints: [
      { level: 1, text: 'Since the candidate key A is a single attribute, there can be no partial dependency (no proper subset of A exists).' },
      { level: 2, text: 'A is a superkey for all FDs. Check BCNF: all determinants are superkeys.' },
      { level: 3, text: 'R is in BCNF. With a single-attribute key, 2NF is always satisfied, and here BCNF is also met.' },
    ],
    fullExplanation: `Candidate key: A (single attribute).

Since the key is a single attribute, no proper subset of the key exists. Therefore no partial dependency is possible. 2NF is automatically satisfied.

For 3NF and BCNF: both A -> B and A -> C have A (a superkey) on the LHS. Both satisfied.

Highest normal form: BCNF.`,
    commonMisconception: 'Thinking that 2NF needs explicit checking even with a single-attribute key. With a single-attribute candidate key, 2NF is trivially satisfied because there is no proper subset to cause a partial dependency.',
    options: [
      { id: 'a', text: '2NF', isCorrect: false, explanation: 'BCNF is also satisfied.' },
      { id: 'b', text: '3NF', isCorrect: false, explanation: 'BCNF is also satisfied.' },
      { id: 'c', text: 'BCNF', isCorrect: true, explanation: 'Correct. All determinants are superkeys.' },
      { id: 'd', text: '1NF', isCorrect: false, explanation: 'All higher normal forms are satisfied.' },
    ],
  } as MCQQuestion,
];
