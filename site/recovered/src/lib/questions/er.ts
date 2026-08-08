// ============================================================
// ER Theory, File Organization, Data Dictionary
// ============================================================

import { Question, MCQQuestion, MSQQuestion, NumericSAQuestion } from '../types';

export const allErQuestions: Question[] = [
  // ---- Q1: ER cardinality MSQ (Exam) ----
  {
    id: 'er-cardinality-msq',
    moduleId: 'er-theory',
    subskill: 'er-constraints',
    format: 'msq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'A Department has exactly one Head of Department, and every Head must head exactly one Department. Which of the following correctly describe this relationship? Select all that apply.',
    hints: [
      { level: 1, text: 'Both sides have exactly one. Think about cardinality and participation.' },
      { level: 2, text: 'Cardinality is 1:1. Each Department participates in exactly one HoD relationship (total participation). Each Head also participates in exactly one (total participation).' },
      { level: 3, text: 'The relationship is 1:1 with total participation on both sides.' },
    ],
    fullExplanation: `Analysis:
- Cardinality: One department has one HoD, one HoD heads one department. This is 1:1.
- Participation for Department: Every department must have a HoD. Total participation.
- Participation for Head: Every head must head a department. Total participation.

True statements:
- The cardinality ratio is 1:1
- Department has total participation
- Head has total participation`,
    commonMisconception: 'Confusing cardinality (how many) with participation (must participate). Cardinality is about the number of entities on the other side; participation is about whether every entity must be involved.',
    options: [
      { id: 'a', text: 'The cardinality ratio is 1:1', isCorrect: true, explanation: 'Correct. One department to one head.' },
      { id: 'b', text: 'Department has total participation', isCorrect: true, explanation: 'Correct. Every department must have exactly one HoD.' },
      { id: 'c', text: 'Head has partial participation', isCorrect: false, explanation: 'Every head must head a department, so participation is total, not partial.' },
      { id: 'd', text: 'The cardinality ratio is 1:N', isCorrect: false, explanation: 'It is 1:1, not 1:N.' },
    ],
  } as MSQQuestion,

  // ---- Q2: File organization (Foundation) ----
  {
    id: 'er-file-organization',
    moduleId: 'er-theory',
    subskill: 'file-organization',
    format: 'mcq',
    difficulty: 'Foundation',
    source: 'PYQ-inspired',
    stem: 'Which file organization is best suited when records from two tables are frequently accessed together using a common key?',
    hints: [
      { level: 1, text: 'Think about which organization stores related records from different tables close together on disk.' },
      { level: 2, text: 'Multi-table clustering stores records from multiple tables together based on a common clustering key, reducing disk I/O for joins.' },
      { level: 3, text: 'Multi-table (or mixed) clustering is designed exactly for this scenario.' },
    ],
    fullExplanation: `Multi-table clustering (also called mixed clustering) stores records from two or more tables together on the same disk block, ordered by a common clustering key.

Advantages for this scenario:
- Join operations are much faster because related records are on the same block.
- Reduces the number of disk I/O operations needed.

Sequential clustering stores records of a single table in order, which is good for range scans but does not help with cross-table access.

Hashing is fast for point lookups but does not cluster related records together.`,
    commonMisconception: 'Choosing sequential clustering. Sequential clustering only orders records within a single table. Multi-table clustering is needed for cross-table access optimization.',
    options: [
      { id: 'a', text: 'Sequential clustering', isCorrect: false, explanation: 'Only orders records within one table.' },
      { id: 'b', text: 'Multi-table clustering', isCorrect: true, explanation: 'Correct. Stores related records from multiple tables together.' },
      { id: 'c', text: 'Heap file organization', isCorrect: false, explanation: 'No particular ordering; does not optimize for joins.' },
      { id: 'd', text: 'Hash organization', isCorrect: false, explanation: 'Good for point lookups but does not cluster related records from different tables.' },
    ],
  } as MCQQuestion,

  // ---- Q3: Data dictionary (Foundation) ----
  {
    id: 'er-data-dictionary',
    moduleId: 'er-theory',
    subskill: 'data-dictionary',
    format: 'mcq',
    difficulty: 'Foundation',
    source: 'PYQ-inspired',
    stem: 'Which of the following is stored in a data dictionary (system catalog)?',
    hints: [
      { level: 1, text: 'A data dictionary stores metadata about the database structure, not the actual data.' },
      { level: 2, text: 'It contains table definitions, column names, data types, constraints, indexes, and user privileges.' },
      { level: 3, text: 'The actual row data (like employee salaries) is stored in the tables, not in the data dictionary.' },
    ],
    fullExplanation: `A data dictionary (also called system catalog) stores metadata about the database:
- Names of tables, columns, views, indexes
- Data types and constraints
- Schema definitions
- User access privileges
- Integrity constraints
- Statistics about tables (for query optimization)

It does NOT store the actual data rows. For example, it stores that there is a column called salary with type integer, but not the individual salary values of employees.`,
    commonMisconception: 'Thinking the data dictionary stores actual data rows. It stores only metadata (information about the structure and properties of the data).',
    options: [
      { id: 'a', text: 'Table and column definitions', isCorrect: true, explanation: 'Correct. Schema metadata is stored in the data dictionary.' },
      { id: 'b', text: 'Actual row data from tables', isCorrect: false, explanation: 'Row data is stored in the table files, not the data dictionary.' },
      { id: 'c', text: 'User passwords', isCorrect: false, explanation: 'Passwords may be stored in authentication systems but not in the standard data dictionary.' },
      { id: 'd', text: 'Application source code', isCorrect: false, explanation: 'Application code is separate from the database metadata.' },
    ],
  } as MCQQuestion,

  // ---- Q4: ER weak entity (Exam) ----
  {
    id: 'er-weak-entity',
    moduleId: 'er-theory',
    subskill: 'er-constraints',
    format: 'mcq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'In an ER diagram, a weak entity set is best described as one that:',
    hints: [
      { level: 1, text: 'A weak entity does not have a sufficient set of attributes to form a primary key on its own.' },
      { level: 2, text: 'It depends on a related strong entity (the identifying or owner entity) to form its primary key via a partial key plus the owner key.' },
      { level: 3, text: 'A weak entity has a partial key and a total, identifying relationship with a strong entity.' },
    ],
    fullExplanation: `A weak entity set:
- Does not have enough attributes to form a primary key by itself.
- Has a partial key (discriminator) that uniquely identifies it among entities related to the same owner.
- Has an identifying relationship (double diamond in ER diagram) with a strong (owner) entity.
- The primary key of a weak entity is the combination of its partial key and the primary key of the owner entity.
- Always has total participation in the identifying relationship.

Example: Dependent is a weak entity of Employee. Dependent has a partial key (dependent_name), and the full key is (employee_id, dependent_name).`,
    commonMisconception: 'Thinking any entity with a foreign key is weak. A weak entity is specifically one that cannot form a primary key from its own attributes alone, not just one that references another entity.',
    options: [
      { id: 'a', text: 'Has no attributes at all', isCorrect: false, explanation: 'A weak entity has attributes, just not enough to form a primary key alone.' },
      { id: 'b', text: 'Cannot form a primary key from its own attributes alone', isCorrect: true, explanation: 'Correct. It needs the owner entity key plus its partial key.' },
      { id: 'c', text: 'Always has exactly one attribute', isCorrect: false, explanation: 'It can have multiple attributes but lacks a full key.' },
      { id: 'd', text: 'Cannot participate in any relationship', isCorrect: false, explanation: 'It must participate in at least one identifying relationship with its owner.' },
    ],
  } as MCQQuestion,

  // ---- Q5: DDL command (Foundation) ----
  {
    id: 'er-ddl-alter',
    moduleId: 'er-theory',
    subskill: 'data-dictionary',
    format: 'mcq',
    difficulty: 'Foundation',
    source: 'PYQ-inspired',
    stem: 'Which SQL command is used to add a new column to an existing table?',
    hints: [
      { level: 1, text: 'Think about which DDL command modifies an existing table structure.' },
      { level: 2, text: 'ALTER TABLE is used for modifications. The ADD COLUMN clause adds a new column.' },
      { level: 3, text: 'ALTER TABLE table_name ADD COLUMN column_name datatype;' },
    ],
    fullExplanation: `The correct command is:
ALTER TABLE table_name ADD COLUMN column_name datatype;

- CREATE TABLE creates a new table (not for existing tables).
- DROP TABLE deletes a table entirely.
- UPDATE modifies data rows, not the table structure.

ALTER TABLE with ADD COLUMN modifies the schema (metadata), which is then reflected in the data dictionary.`,
    commonMisconception: 'Confusing UPDATE (which changes data) with ALTER (which changes structure). DDL commands like ALTER modify the schema, while DML commands like UPDATE modify the data.',
    options: [
      { id: 'a', text: 'CREATE TABLE', isCorrect: false, explanation: 'This creates a new table, not modifies an existing one.' },
      { id: 'b', text: 'ALTER TABLE ... ADD COLUMN', isCorrect: true, explanation: 'Correct. ALTER TABLE with ADD COLUMN adds a new column.' },
      { id: 'c', text: 'UPDATE TABLE', isCorrect: false, explanation: 'UPDATE changes data rows, not the table structure.' },
      { id: 'd', text: 'MODIFY TABLE', isCorrect: false, explanation: 'MODIFY is not a standard SQL command for adding columns.' },
    ],
  } as MCQQuestion,

  // ---- Q6: ER participation constraint (Exam) ----
  {
    id: 'er-participation',
    moduleId: 'er-theory',
    subskill: 'er-constraints',
    format: 'msq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    askConfidence: true,
    stem: 'An ER diagram shows Entity E1 in a relationship R with Entity E2. E1 has a double line connecting to R. Which of the following are true? Select all that apply.',
    hints: [
      { level: 1, text: 'A double line indicates total participation. Every entity of E1 must participate in the relationship R.' },
      { level: 2, text: 'Total participation means every E1 entity must be related to at least one E2 entity through R. This translates to a NOT NULL foreign key constraint.' },
      { level: 3, text: 'Double line means total participation (mandatory). A single line means partial participation (optional). The double line does not directly indicate cardinality.' },
    ],
    fullExplanation: `A double line from E1 to relationship R means total participation:

- Every instance of E1 MUST participate in at least one instance of R.
- In SQL, this typically translates to a NOT NULL constraint on the foreign key column.
- This is also called mandatory participation.

A single line would mean partial participation (some E1 instances may not participate).

The double line does NOT directly tell us the cardinality (1:1, 1:N, or M:N). Cardinality is shown by other notations (arrows, numbers, or crow foot notation).`,
    commonMisconception: 'Interpreting the double line as indicating cardinality (like 1:1 or 1:N). The double line indicates participation (total vs partial), not cardinality.',
    options: [
      { id: 'a', text: 'Every E1 entity must participate in R', isCorrect: true, explanation: 'Correct. Double line means total (mandatory) participation.' },
      { id: 'b', text: 'The cardinality from E1 to E2 is 1:1', isCorrect: false, explanation: 'Participation does not determine cardinality. A different notation is needed.' },
      { id: 'c', text: 'In SQL, this means a NOT NULL foreign key', isCorrect: true, explanation: 'Correct. Total participation maps to NOT NULL on the referencing column.' },
      { id: 'd', text: 'E2 also has total participation in R', isCorrect: false, explanation: 'The line style of E1 does not determine E2 participation.' },
    ],
  } as MSQQuestion,
];
