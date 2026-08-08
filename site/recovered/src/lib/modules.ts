// ============================================================
// DBMS Quiz 2 Prep — Module Definitions
// ============================================================

import { ModuleDef } from './types';

export const modules: ModuleDef[] = [
  {
    id: 'fd-closures-keys',
    title: 'Functional Dependencies, Closures, Keys & Superkeys',
    shortTitle: 'FD, Closures & Keys',
    priority: 'P0',
    description: 'Attribute closure, candidate keys, superkeys, prime attributes, and superkey counting.',
    whyItMatters: 'This topic appears in virtually every Quiz 2 paper, often as a full comprehension block. Expect 2–4 questions on closures, keys, and superkey counts.',
    objectives: [
      'I can compute the attribute closure X⁺ for any attribute set X under a given FD set.',
      'I can identify all candidate keys using the mandatory-attribute strategy.',
      'I can distinguish candidate keys from superkeys.',
      'I can count superkeys using the 2^(n−k) formula, accounting for overlapping candidate keys.',
      'I can identify prime attributes from candidate keys.',
    ],
    subskills: ['closure-computation', 'candidate-key-finding', 'superkey-counting', 'prime-attribute-identification'],
  },
  {
    id: 'normalization',
    title: 'Normalization: 1NF, 2NF, 3NF & BCNF',
    shortTitle: 'Normalization',
    priority: 'P0',
    description: 'Identifying the highest normal form of a relation using candidate keys, prime attributes, and FD analysis.',
    whyItMatters: 'Normal-form classification is one of the most stable recurring question types. Nearly every paper has at least one MCQ/MSQ asking for the highest NF.',
    objectives: [
      'I can list all candidate keys and prime attributes for a relation.',
      'I can test each non-trivial FD against BCNF and 3NF conditions.',
      'I can explain why a relation is or is not in BCNF, 3NF, 2NF, or 1NF.',
      'I can distinguish the 3NF exception (RHS is prime) from BCNF.',
    ],
    subskills: ['prime-attribute-identification', 'bcnf-testing', '3nf-testing', '2nf-testing', 'normal-form-comparison'],
  },
  {
    id: 'lossless-decomposition',
    title: 'Lossless Decomposition, Dependency Preservation & Minimal Cover',
    shortTitle: 'Decomposition & Covers',
    priority: 'P0',
    description: 'Testing lossless joins, dependency preservation, and computing canonical/minimal covers.',
    whyItMatters: 'Lossless and dependency-preserving decomposition questions reappear in many papers. Minimal/canonical cover is a frequent SA or MSQ question.',
    objectives: [
      'I can test whether a binary decomposition is lossless using the intersection-attribute closure test.',
      'I can determine whether a decomposition preserves all original dependencies.',
      'I can compute a canonical/minimal cover: split RHS, remove extraneous LHS attributes, remove redundant FDs.',
    ],
    subskills: ['lossless-join-test', 'dependency-preservation-test', 'minimal-cover-computation'],
  },
  {
    id: 'disk-storage',
    title: 'Disk Storage, Addressing & Access-Time Calculations',
    shortTitle: 'Disk & Storage',
    priority: 'P0',
    description: 'Disk capacity, addressing bits, cylinders, rotational latency, transfer time, and total access time.',
    whyItMatters: 'Disk arithmetic is the most stable numerical question type across all years. Expect a 3–4 mark SA or MCQ with changing numbers.',
    objectives: [
      'I can compute disk capacity from platters, surfaces, tracks, sectors, and bytes per sector.',
      'I can compute addressing bits using ceil(log₂(addressable sectors)).',
      'I can convert RPM to average rotational latency (half revolution time).',
      'I can compute transfer time from block size and data rate.',
      'I can compute total disk access time = seek + avg rotational latency + transfer time.',
    ],
    subskills: ['disk-capacity', 'addressing-bits', 'rotational-latency', 'transfer-time', 'access-time'],
  },
  {
    id: 'lru-buffer',
    title: 'LRU Buffer Management',
    shortTitle: 'LRU Buffer',
    priority: 'P0',
    description: 'Simulating LRU page replacement, counting hits, misses, and page faults.',
    whyItMatters: 'LRU appears in multiple separate papers with 3–4 frame buffers. The question is always about exact simulation — not intuition.',
    objectives: [
      'I can simulate LRU replacement step by step for any request sequence.',
      'I can distinguish hits from misses and count each accurately.',
      'I can compute misses − hits when asked.',
    ],
    subskills: ['lru-simulation', 'hit-miss-counting'],
  },
  {
    id: 'bst',
    title: 'BSTs, Tree Height, Search Paths & Insertion Orders',
    shortTitle: 'BST & Trees',
    priority: 'P0',
    description: 'Building BSTs, finding height, levels, leaf nodes, legal search paths, and valid insertion orders.',
    whyItMatters: 'BST questions recur very often in many forms: construction, height, levels, leaf sum, legal search paths, and insertion order identification.',
    objectives: [
      'I can construct a BST from a given insertion order and label all levels.',
      'I can compute the height using both edge and level conventions.',
      'I can identify leaf nodes and compute their sum.',
      'I can verify whether a probe sequence is a legal BST search path using bound tracking.',
      'I can find minimum and maximum height for n nodes.',
    ],
    subskills: ['bst-construction', 'bst-height', 'bst-search-paths', 'bst-insertion-order', 'bst-leaf-nodes'],
  },
  {
    id: 'sql-psycopg2',
    title: 'SQL Interpretation & PostgreSQL / psycopg2',
    shortTitle: 'SQL & psycopg2',
    priority: 'P1',
    description: 'Reading SQL query output, understanding psycopg2 API methods, and predicting program behaviour.',
    whyItMatters: 'SQL/psycopg2 questions show a clear recent trend in newer papers. Practical, quick-scoring questions if you know the API methods.',
    objectives: [
      'I can predict the output of SQL queries with aggregation, subqueries, and ranking.',
      'I can distinguish connect, cursor, execute, executemany, fetchall, fetchmany, and commit.',
      'I know that %s placeholders receive values separately in psycopg2.',
      'I understand when commit() is needed to persist changes.',
    ],
    subskills: ['sql-query-interpretation', 'psycopg2-api', 'parameterized-queries'],
  },
  {
    id: 'er-theory',
    title: 'ER Models, File Organization & Essential DBMS Theory',
    shortTitle: 'ER & Theory',
    priority: 'P1',
    description: 'ER diagram constraints, file organization, data dictionary, and supporting DBMS concepts.',
    whyItMatters: 'Usually one conceptual MSQ/MCQ per paper. Easy marks if revised, but do not let it take time from P0 topics.',
    objectives: [
      'I can infer cardinality and participation constraints from ER diagrams.',
      'I understand sequential vs multi-table clustering.',
      'I know key data dictionary and DDL concepts.',
    ],
    subskills: ['er-constraints', 'file-organization', 'data-dictionary'],
  },
  {
    id: 'mixed-mock',
    title: 'Mixed Quiz 2 Mock Practice & Final Revision',
    shortTitle: 'Mock & Revision',
    priority: 'P0',
    description: 'Full mixed practice with interleaved topics, timed mocks, and comprehensive revision.',
    whyItMatters: 'The actual exam mixes all topics. Practising under timed conditions with interleaved questions builds exam readiness.',
    objectives: [
      'I can solve mixed questions across all topics under time pressure.',
      'I can identify my remaining weak areas and prioritize final revision.',
      'I can apply exam strategies: time allocation, MSQ independence, unit checking.',
    ],
    subskills: ['mixed-problem-solving', 'exam-strategy', 'time-management'],
  },
];

export const moduleIdToIndex: Record<string, number> = {};
modules.forEach((m, i) => { moduleIdToIndex[m.id] = i; });

export function getModule(id: string): ModuleDef | undefined {
  return modules.find(m => m.id === id);
}
