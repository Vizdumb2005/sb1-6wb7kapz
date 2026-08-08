// ============================================================
// SQL Query Interpretation & psycopg2 API
// ============================================================

import { Question, MCQQuestion, MSQQuestion, NumericSAQuestion } from '../types';

export const allSqlQuestions: Question[] = [
  // ---- Q1: psycopg2 API MSQ (Exam) ----
  {
    id: 'sql-psycopg2-api',
    moduleId: 'sql-psycopg2',
    subskill: 'psycopg2-api',
    format: 'msq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'Which of the following statements about psycopg2 are correct? Select all that apply.',
    hints: [
      { level: 1, text: 'Recall the psycopg2 workflow: connect, cursor, execute, fetch, commit, close.' },
      { level: 2, text: 'Check each statement against the known API. Remember that commit persists data changes, and fetchall retrieves rows.' },
      { level: 3, text: 'cursor.executemany runs one parameterized statement for many parameter sets. cursor.fetchall retrieves all rows. Values go to %s placeholders. conn.commit persists INSERT/UPDATE/DELETE.' },
    ],
    fullExplanation: `A. cursor.executemany() can execute one parameterized statement for many parameter tuples. TRUE. This is exactly what executemany does.

B. cursor.fetchall() commits pending updates. FALSE. fetchall() retrieves all remaining rows from a query result. It does not commit anything.

C. With psycopg2, values should normally be supplied separately to %s placeholders. TRUE. This is the safe, SQL-injection-proof way.

D. conn.commit() is generally needed to persist a successful INSERT. TRUE. Without commit, changes may be rolled back.`,
    commonMisconception: 'Thinking fetchall() commits data. fetchall() only reads query results; commit() is a separate operation on the connection.',
    options: [
      { id: 'a', text: 'cursor.executemany() executes one parameterized statement for many parameter tuples', isCorrect: true, explanation: 'Correct. executemany takes a SQL template and a list of parameter tuples.' },
      { id: 'b', text: 'cursor.fetchall() commits pending updates', isCorrect: false, explanation: 'fetchall() retrieves rows, it does not commit.' },
      { id: 'c', text: 'Values should be supplied separately to %s placeholders', isCorrect: true, explanation: 'Correct. This prevents SQL injection.' },
      { id: 'd', text: 'conn.commit() is needed to persist INSERT', isCorrect: true, explanation: 'Correct. Without commit, the transaction is not finalized.' },
    ],
  } as MSQQuestion,

  // ---- Q2: SQL ranking query (Exam) ----
  {
    id: 'sql-nth-highest',
    moduleId: 'sql-psycopg2',
    subskill: 'sql-query-interpretation',
    format: 'mcq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'Table Students(name, marks) has rows: (Alice, 90), (Bob, 85), (Carol, 90), (Dave, 80). A query selects the second highest distinct mark. What value is returned?',
    hints: [
      { level: 1, text: 'List the distinct marks in descending order: 90, 85, 80.' },
      { level: 2, text: 'The distinct marks are 90, 85, 80. The second highest is 85.' },
      { level: 3, text: 'The answer is 85.' },
    ],
    fullExplanation: `Distinct marks from the table: 90, 85, 80.

Sorted descending: 90, 85, 80.

The second highest distinct mark is 85.

Note that 90 appears twice (Alice and Carol), but since we want distinct marks, 90 counts as one value. The second position is 85 (Bob).`,
    commonMisconception: 'Not using DISTINCT and counting Bob as third highest instead of second. The question says second highest distinct mark.',
    options: [
      { id: 'a', text: '90', isCorrect: false, explanation: '90 is the highest, not the second highest.' },
      { id: 'b', text: '85', isCorrect: true, explanation: 'Correct. 85 is the second highest distinct mark.' },
      { id: 'c', text: '80', isCorrect: false, explanation: '80 is the third highest.' },
      { id: 'd', text: 'NULL (no result)', isCorrect: false, explanation: 'There are at least 2 distinct marks.' },
    ],
  } as MCQQuestion,

  // ---- Q3: Parameterized queries (Foundation) ----
  {
    id: 'sql-parameterized',
    moduleId: 'sql-psycopg2',
    subskill: 'parameterized-queries',
    format: 'mcq',
    difficulty: 'Foundation',
    source: 'PYQ-inspired',
    stem: 'In psycopg2, what is the correct way to execute a parameterized query with a variable age value?',
    hints: [
      { level: 1, text: 'psycopg2 uses %s as a placeholder, even for numeric values.' },
      { level: 2, text: 'The correct pattern is: cursor.execute("SELECT * FROM students WHERE age > %s", (age_value,))' },
      { level: 3, text: 'The key is that values are passed as a separate tuple, not via string formatting.' },
    ],
    fullExplanation: `The correct psycopg2 pattern is:

cursor.execute("SELECT * FROM students WHERE age > %s", (age_value,))

Key points:
- %s is the placeholder for ALL data types (not %d for integers).
- The second argument is a TUPLE. Note the trailing comma in (age_value,).
- Never use Python string formatting (f-strings or .format()) for SQL values, as this causes SQL injection vulnerabilities.`,
    commonMisconception: 'Using %d for integers or using f-strings to embed values directly in the query string. Always use %s with a separate parameter tuple.',
    options: [
      { id: 'a', text: 'cursor.execute(f"SELECT * FROM students WHERE age > {age}")', isCorrect: false, explanation: 'f-strings are vulnerable to SQL injection and should not be used for values.' },
      { id: 'b', text: 'cursor.execute("SELECT * FROM students WHERE age > %s", (age,))', isCorrect: true, explanation: 'Correct. %s placeholder with a separate parameter tuple.' },
      { id: 'c', text: 'cursor.execute("SELECT * FROM students WHERE age > %d", (age,))', isCorrect: false, explanation: 'psycopg2 uses %s for all types, not %d.' },
      { id: 'd', text: 'cursor.execute("SELECT * FROM students WHERE age > ?", (age,))', isCorrect: false, explanation: '? is used by SQLite, not psycopg2. Use %s.' },
    ],
  } as MCQQuestion,

  // ---- Q4: fetchmany behavior (Exam) ----
  {
    id: 'sql-fetchmany',
    moduleId: 'sql-psycopg2',
    subskill: 'psycopg2-api',
    format: 'numeric-sa',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'A query returns 10 rows. First call: cursor.fetchmany(3) returns 3 rows. Second call: cursor.fetchmany(5) returns 5 rows. How many rows does the third call cursor.fetchmany(3) return?',
    hints: [
      { level: 1, text: 'fetchmany(n) retrieves up to n rows from the remaining result set.' },
      { level: 2, text: 'After two calls, 3 + 5 = 8 rows have been fetched. Remaining = 10 - 8 = 2 rows.' },
      { level: 3, text: 'The third call requests 3 but only 2 remain. It returns 2.' },
    ],
    fullExplanation: `The result set has 10 rows total.

Call 1: fetchmany(3) returns 3 rows. Remaining: 7.
Call 2: fetchmany(5) returns 5 rows. Remaining: 2.
Call 3: fetchmany(3) requests 3 but only 2 rows remain. Returns 2 rows.

fetchmany returns at most n rows; it returns fewer when the result set is exhausted.`,
    commonMisconception: 'Thinking fetchmany(3) will always return exactly 3 rows. When fewer rows remain, it returns only what is left.',
    correctAnswer: 2,
    unit: 'rows',
    expectedFormat: 'integer',
  } as NumericSAQuestion,

  // ---- Q5: SQL COUNT with DISTINCT (Foundation) ----
  {
    id: 'sql-count-distinct',
    moduleId: 'sql-psycopg2',
    subskill: 'sql-query-interpretation',
    format: 'mcq',
    difficulty: 'Foundation',
    source: 'PYQ-inspired',
    stem: 'Table orders(order_id, customer_id, amount) has 20 rows. Customer A has 5 orders, Customer B has 3 orders, and the remaining 12 orders are from unique customers. What does SELECT COUNT(DISTINCT customer_id) FROM orders return?',
    hints: [
      { level: 1, text: 'COUNT(DISTINCT customer_id) counts unique customer IDs.' },
      { level: 2, text: 'Customer A (1 unique), Customer B (1 unique), plus 12 other unique customers. Total unique = 1 + 1 + 12 = 14.' },
      { level: 3, text: 'The query returns 14.' },
    ],
    fullExplanation: `Breakdown of orders by customer:
- Customer A: 5 orders (1 distinct customer)
- Customer B: 3 orders (1 distinct customer)
- Other customers: 12 orders, each from a different customer (12 distinct customers)

Total distinct customers = 1 + 1 + 12 = 14.

SELECT COUNT(DISTINCT customer_id) returns 14.`,
    commonMisconception: 'Answering 20 (total rows) or 3 (number of customer groups). COUNT(DISTINCT column) counts unique values, not total rows or groups.',
    options: [
      { id: 'a', text: '3', isCorrect: false, explanation: '3 is the number of customer groups, not the number of distinct customers.' },
      { id: 'b', text: '14', isCorrect: true, explanation: 'Correct. There are 14 distinct customer IDs.' },
      { id: 'c', text: '20', isCorrect: false, explanation: '20 is the total number of orders, not distinct customers.' },
      { id: 'd', text: '8', isCorrect: false, explanation: 'This does not correspond to any correct calculation.' },
    ],
  } as MCQQuestion,

  // ---- Q6: SQL subquery interpretation (Challenge) ----
  {
    id: 'sql-subquery',
    moduleId: 'sql-psycopg2',
    subskill: 'sql-query-interpretation',
    format: 'mcq',
    difficulty: 'Challenge',
    source: 'PYQ-inspired',
    askConfidence: true,
    stem: 'Table T(x) has values: 5, 3, 8, 3, 1, 8, 5. Query: SELECT x FROM T WHERE x > (SELECT AVG(x) FROM T). How many rows are returned?',
    hints: [
      { level: 1, text: 'First compute the subquery: AVG(x) over all 7 rows.' },
      { level: 2, text: 'Sum = 5 + 3 + 8 + 3 + 1 + 8 + 5 = 33. AVG = 33/7 = 4.714 (approximately).' },
      { level: 3, text: 'Values greater than 4.714: 5, 8, 3(no), 3(no), 1(no), 8, 5. Result: 5, 8, 8, 5 = 4 rows.' },
    ],
    fullExplanation: `Step 1: Compute the average.
Values: 5, 3, 8, 3, 1, 8, 5
Sum = 5 + 3 + 8 + 3 + 1 + 8 + 5 = 33
AVG = 33 / 7 = 4.714...

Step 2: Filter x > 4.714:
- 5 > 4.714: YES
- 3 > 4.714: NO
- 8 > 4.714: YES
- 3 > 4.714: NO
- 1 > 4.714: NO
- 8 > 4.714: YES
- 5 > 4.714: YES

Result: 4 rows (values 5, 8, 8, 5).`,
    commonMisconception: 'Computing the average of distinct values (5, 3, 8, 1) instead of all rows. AVG in SQL considers all rows unless DISTINCT is specified.',
    options: [
      { id: 'a', text: '2', isCorrect: false, explanation: 'This would be the count of distinct values above average (5 and 8), not total rows.' },
      { id: 'b', text: '3', isCorrect: false, explanation: 'Undercounting.' },
      { id: 'c', text: '4', isCorrect: true, explanation: 'Correct. The rows 5, 8, 8, 5 all have values above 4.714.' },
      { id: 'd', text: '5', isCorrect: false, explanation: '3 and 1 are below the average.' },
    ],
  } as MCQQuestion,

  // ---- Q7: executemany vs execute (Exam) ----
  {
    id: 'sql-executemany',
    moduleId: 'sql-psycopg2',
    subskill: 'psycopg2-api',
    format: 'mcq',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'You need to insert 100 rows into a table. Which approach is most appropriate in psycopg2?',
    hints: [
      { level: 1, text: 'Consider both correctness and efficiency. Running 100 separate execute calls works but is not ideal.' },
      { level: 2, text: 'executemany() runs a single parameterized statement with a list of parameter tuples. It is designed exactly for bulk inserts.' },
      { level: 3, text: 'executemany with a list of 100 tuples is the most appropriate approach.' },
    ],
    fullExplanation: `The most appropriate approach is cursor.executemany() with a list of 100 parameter tuples.

Example:
cursor.executemany("INSERT INTO table (col1, col2) VALUES (%s, %s)", list_of_100_tuples)

This is more efficient than 100 separate execute() calls because it reduces round-trips to the database server.

Note: After executemany, you still need conn.commit() to persist the changes.`,
    commonMisconception: 'Thinking you need 100 separate cursor.execute() calls. While this works, executemany is the proper API for bulk operations.',
    options: [
      { id: 'a', text: 'A single execute() call with all values concatenated', isCorrect: false, explanation: 'SQL does not support bulk value concatenation. Each row needs its own VALUES clause.' },
      { id: 'b', text: '100 separate execute() calls in a loop', isCorrect: false, explanation: 'This works but is inefficient. executemany is the proper tool.' },
      { id: 'c', text: 'One executemany() call with a list of 100 tuples', isCorrect: true, explanation: 'Correct. executemany is designed for bulk parameterized operations.' },
      { id: 'd', text: 'One execute() call with 100 %s placeholders', isCorrect: false, explanation: 'While possible, this is error-prone. executemany is the cleaner approach.' },
    ],
  } as MCQQuestion,

  // ---- Q8: SQL GROUP BY with HAVING (Exam) ----
  {
    id: 'sql-group-having',
    moduleId: 'sql-psycopg2',
    subskill: 'sql-query-interpretation',
    format: 'numeric-sa',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'Table sales(product, qty) has: (A,10), (B,5), (A,15), (C,20), (B,25), (C,5). Query: SELECT product FROM sales GROUP BY product HAVING SUM(qty) > 25. How many rows are returned?',
    hints: [
      { level: 1, text: 'Compute SUM(qty) for each product group.' },
      { level: 2, text: 'A: 10+15=25. B: 5+25=30. C: 20+5=25. Filter SUM > 25: only B (30 > 25).' },
      { level: 3, text: 'Only 1 row (product B) satisfies the HAVING condition.' },
    ],
    fullExplanation: `Group by product and compute sum:
- Product A: SUM(qty) = 10 + 15 = 25
- Product B: SUM(qty) = 5 + 25 = 30
- Product C: SUM(qty) = 20 + 5 = 25

HAVING SUM(qty) > 25 filters to groups where the sum exceeds 25:
- A: 25 > 25? NO (not strictly greater)
- B: 30 > 25? YES
- C: 25 > 25? NO

1 row returned (product B).`,
    commonMisconception: 'Including A and C because 25 equals 25. The condition is strictly greater than (>) 25, not greater than or equal.',
    correctAnswer: 1,
    unit: 'rows',
    expectedFormat: 'integer',
  } as NumericSAQuestion,
];
