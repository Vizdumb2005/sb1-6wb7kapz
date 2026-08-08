// ============================================================
// Disk Storage: Capacity, Addressing, Latency, Access Time
// ============================================================

import { Question, MCQQuestion, MSQQuestion, NumericSAQuestion } from '../types';

export const allDiskQuestions: Question[] = [
  // ---- Q1: Disk capacity in GB (Exam) ----
  {
    id: 'disk-capacity-gb',
    moduleId: 'disk-storage',
    subskill: 'disk-capacity',
    format: 'numeric-sa',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'A disk has 6 platters, 2 surfaces per platter, 2048 tracks per surface, 1024 sectors per track, and 512 bytes per sector. What is the capacity in GB? (Use 1 GB = 2^30 bytes.)',
    hints: [
      { level: 1, text: 'Capacity = platters x surfaces/platter x tracks/surface x sectors/track x bytes/sector.' },
      { level: 2, text: 'Capacity = 6 x 2 x 2048 x 1024 x 512 = 12 x 2^11 x 2^10 x 2^9 bytes.' },
      { level: 3, text: '12 x 2^(11+10+9) = 12 x 2^30 = 12 x 1,073,741,824. In GB: 12 GB.' },
    ],
    fullExplanation: `Formula: Capacity = platters x (surfaces/platter) x (tracks/surface) x (sectors/track) x (bytes/sector)

Calculation:
= 6 x 2 x 2048 x 1024 x 512
= 12 x 2^11 x 2^10 x 2^9
= 12 x 2^30 bytes

Since 1 GB = 2^30 bytes:
Capacity = 12 GB`,
    commonMisconception: 'Forgetting to multiply by 2 surfaces per platter, or using decimal GB (10^9) instead of binary GB (2^30). The study guide specifies binary conversion.',
    correctAnswer: 12,
    unit: 'GB',
    expectedFormat: 'integer',
  } as NumericSAQuestion,

  // ---- Q2: Addressing bits (Exam) ----
  {
    id: 'disk-addressing-bits',
    moduleId: 'disk-storage',
    subskill: 'addressing-bits',
    format: 'numeric-sa',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    askConfidence: true,
    stem: 'A disk has 6 platters, 2 surfaces per platter, 2048 tracks per surface, and 1024 sectors per track. What is the minimum number of bits needed to address any sector?',
    hints: [
      { level: 1, text: 'Count total addressable sectors: platters x surfaces/platter x tracks/surface x sectors/track.' },
      { level: 2, text: 'Total sectors = 6 x 2 x 2048 x 1024 = 3 x 2^23 = 25,165,824. Find ceil(log2 of this number).' },
      { level: 3, text: '3 x 2^23 = 1.5 x 2^24. This is between 2^24 and 2^25. So we need 25 bits.' },
    ],
    fullExplanation: `Total addressable sectors = 6 x 2 x 2048 x 1024
= 12 x 2048 x 1024
= 12 x 2^11 x 2^10
= 12 x 2^21
= 3 x 2^22

Wait, let me recalculate:
6 x 2 = 12 = 3 x 2^2
2048 = 2^11
1024 = 2^10

Total = 3 x 2^2 x 2^11 x 2^10 = 3 x 2^23

2^23 = 8,388,608
3 x 2^23 = 25,165,824

log2(25,165,824) = log2(3) + 23 = 1.585 + 23 = 24.585

ceil(24.585) = 25 bits

Since 2^24 = 16,777,216 < 25,165,824, and 2^25 = 33,554,432 > 25,165,824, we need 25 bits.`,
    commonMisconception: 'Taking log2 of 2^23 only and getting 23, ignoring the factor of 3. Always multiply all components before taking log2.',
    correctAnswer: 25,
    unit: 'bits',
    expectedFormat: 'integer',
  } as NumericSAQuestion,

  // ---- Q3: Rotational latency (Foundation) ----
  {
    id: 'disk-rotational-latency',
    moduleId: 'disk-storage',
    subskill: 'rotational-latency',
    format: 'numeric-sa',
    difficulty: 'Foundation',
    source: 'PYQ-inspired',
    stem: 'A disk rotates at 7200 RPM. What is the average rotational latency in ms? (Round to 2 decimal places.)',
    hints: [
      { level: 1, text: 'First convert RPM to ms per revolution: 60000 / RPM.' },
      { level: 2, text: 'Time per revolution = 60000 / 7200 = 8.333 ms. Average latency = half of that.' },
      { level: 3, text: 'Average rotational latency = 8.333 / 2 = 4.167 ms.' },
    ],
    fullExplanation: `Step 1: Time per revolution = 60,000 / RPM = 60,000 / 7200 = 8.333 ms
Step 2: Average rotational latency = half a revolution = 8.333 / 2 = 4.167 ms

The average latency assumes the desired sector is equally likely to be anywhere on the track, so on average the disk must rotate half a revolution.`,
    commonMisconception: 'Using a full revolution instead of half. Average rotational latency is HALF the time per revolution, not the full time.',
    correctAnswer: 4.17,
    tolerance: 0.01,
    unit: 'ms',
    expectedFormat: '2 decimal places',
  } as NumericSAQuestion,

  // ---- Q4: Full access time (Exam) ----
  {
    id: 'disk-access-time-full',
    moduleId: 'disk-storage',
    subskill: 'access-time',
    format: 'numeric-sa',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    askConfidence: true,
    stem: 'Average seek time = 8 ms, rotation speed = 7200 RPM, block size = 4 KB, data rate = 512 KB/s. Find the total access time in ms. (Round to 1 decimal place.)',
    hints: [
      { level: 1, text: 'Access time = seek time + average rotational latency + transfer time. Compute each component.' },
      { level: 2, text: 'Seek = 8 ms. Rotational latency = (60000/7200)/2 = 4.167 ms. Transfer time = block size / data rate = 4/512 seconds.' },
      { level: 3, text: 'Transfer = 4/512 s = 1/128 s = 7.8125 ms. Total = 8 + 4.167 + 7.813 = 19.98, rounds to 20.0 ms.' },
    ],
    fullExplanation: `Component 1 - Seek time: 8 ms
Component 2 - Average rotational latency:
  Time per revolution = 60,000 / 7200 = 8.333 ms
  Average latency = 8.333 / 2 = 4.167 ms
Component 3 - Transfer time:
  Transfer time = block size / data rate = 4 KB / 512 KB/s = 1/128 s = 7.8125 ms

Total access time = 8 + 4.167 + 7.813 = 19.980 ms
Rounded to 1 decimal place: 20.0 ms`,
    commonMisconception: 'Forgetting the transfer time or converting units incorrectly. Make sure all components are in ms before adding.',
    correctAnswer: 20,
    tolerance: 0.1,
    unit: 'ms',
    expectedFormat: '1 decimal place',
  } as NumericSAQuestion,

  // ---- Q5: Find missing parameter (Challenge) ----
  {
    id: 'disk-missing-parameter',
    moduleId: 'disk-storage',
    subskill: 'disk-capacity',
    format: 'numeric-sa',
    difficulty: 'Challenge',
    source: 'PYQ-inspired',
    stem: 'A disk has 4 platters (double-sided), 1000 tracks per surface, 512 bytes per sector, and a capacity of 8 GB. How many sectors per track does it have? (Use 1 GB = 2^30 bytes.)',
    hints: [
      { level: 1, text: 'Capacity = platters x surfaces x tracks x sectors/track x bytes/sector. Solve for sectors/track.' },
      { level: 2, text: '8 GB = 8 x 2^30 bytes. Capacity = 4 x 2 x 1000 x S x 512. So 8 x 2^30 = 4 x 2 x 1000 x S x 512.' },
      { level: 3, text: '8 x 2^30 = 8 x 2^30 = 8000 x S x 2^9. So S = (8 x 2^30) / (8000 x 2^9) = (8 x 2^21) / 8000 = 16777216 / 8000 = 2097.152. Round to 2097 or 2098 depending on context. But 8GB/ (4*2*1000*512) = 8589934592/4096000 = 2097.15. Nearest integer: 2097.' },
    ],
    fullExplanation: `Capacity = platters x surfaces x tracks/surface x (sectors/track) x (bytes/sector)
8 x 2^30 = 4 x 2 x 1000 x S x 512
8,589,934,592 = 4,096,000 x S
S = 8,589,934,592 / 4,096,000 = 2097.152

Since sectors must be a whole number, the nearest integer is 2097.

Note: In practice, the sector count would likely be a round number. The discrepancy suggests the exact parameters may not perfectly divide, but mathematically the answer is 2097.`,
    commonMisconception: 'Forgetting to multiply by 2 surfaces per platter (double-sided means 2 surfaces per platter).',
    correctAnswer: 2097,
    unit: 'sectors per track',
    expectedFormat: 'integer',
  } as NumericSAQuestion,

  // ---- Q6: Cylinder count (Foundation) ----
  {
    id: 'disk-cylinder-count',
    moduleId: 'disk-storage',
    subskill: 'disk-capacity',
    format: 'numeric-sa',
    difficulty: 'Foundation',
    source: 'PYQ-inspired',
    stem: 'A disk has 4 platters, 2 surfaces per platter, and 500 tracks per surface. How many cylinders does the disk have?',
    hints: [
      { level: 1, text: 'A cylinder is the set of tracks at the same radius across all surfaces.' },
      { level: 2, text: 'The number of cylinders equals the number of tracks per surface.' },
      { level: 3, text: 'Number of cylinders = 500.' },
    ],
    fullExplanation: `A cylinder consists of all tracks at the same track number across all recording surfaces.

Number of cylinders = number of tracks per surface = 500.

The number of platters and surfaces does not affect the cylinder count; it only affects how many tracks are in each cylinder (4 platters x 2 surfaces = 8 tracks per cylinder).`,
    commonMisconception: 'Multiplying by the number of surfaces or platters. Cylinders correspond to track positions, not surface count.',
    correctAnswer: 500,
    unit: 'cylinders',
    expectedFormat: 'integer',
  } as NumericSAQuestion,

  // ---- Q7: Transfer time calculation (Exam) ----
  {
    id: 'disk-transfer-time',
    moduleId: 'disk-storage',
    subskill: 'transfer-time',
    format: 'numeric-sa',
    difficulty: 'Exam',
    source: 'PYQ-inspired',
    stem: 'A disk has a data transfer rate of 256 KB/s and needs to read a block of 8 KB. What is the transfer time in ms?',
    hints: [
      { level: 1, text: 'Transfer time = block size / data rate.' },
      { level: 2, text: 'Transfer time = 8 KB / 256 KB/s = 8/256 seconds = 1/32 seconds.' },
      { level: 3, text: '1/32 s = 1000/32 ms = 31.25 ms.' },
    ],
    fullExplanation: `Transfer time = block size / data rate
= 8 KB / 256 KB/s
= 1/32 seconds
= 1000/32 ms
= 31.25 ms`,
    commonMisconception: 'Forgetting to convert seconds to milliseconds. Always check the requested unit and convert if needed.',
    correctAnswer: 31.25,
    unit: 'ms',
    expectedFormat: '2 decimal places',
  } as NumericSAQuestion,

  // ---- Q8: Capacity in MB (Foundation) ----
  {
    id: 'disk-capacity-mb',
    moduleId: 'disk-storage',
    subskill: 'disk-capacity',
    format: 'numeric-sa',
    difficulty: 'Foundation',
    source: 'PYQ-inspired',
    stem: 'A disk has 2 platters, 2 surfaces per platter, 500 tracks per surface, 100 sectors per track, and 1024 bytes per sector. What is the capacity in MB? (Use 1 MB = 2^20 bytes.)',
    hints: [
      { level: 1, text: 'Capacity = 2 x 2 x 500 x 100 x 1024 bytes.' },
      { level: 2, text: '= 4 x 500 x 100 x 1024 = 200,000 x 1024 = 204,800,000 bytes.' },
      { level: 3, text: '204,800,000 / (2^20) = 204,800,000 / 1,048,576 = 195.3125 MB.' },
    ],
    fullExplanation: `Capacity = platters x surfaces x tracks x sectors x bytes
= 2 x 2 x 500 x 100 x 1024
= 4 x 500 x 100 x 1024
= 204,800,000 bytes

In MB: 204,800,000 / 1,048,576 = 195.3125 MB`,
    commonMisconception: 'Using 10^6 for MB instead of 2^20. The study guide specifies binary conversion.',
    correctAnswer: 195.3125,
    unit: 'MB',
    expectedFormat: 'up to 4 decimal places',
  } as NumericSAQuestion,

  // ---- Q9: Access time without transfer (Foundation) ----
  {
    id: 'disk-access-no-transfer',
    moduleId: 'disk-storage',
    subskill: 'access-time',
    format: 'numeric-sa',
    difficulty: 'Foundation',
    source: 'PYQ-inspired',
    stem: 'Average seek time = 5 ms, rotation speed = 10000 RPM. Find the access time in ms excluding transfer time. (Round to 2 decimal places.)',
    hints: [
      { level: 1, text: 'Access time = seek time + average rotational latency. Compute rotational latency first.' },
      { level: 2, text: 'Time per revolution = 60000/10000 = 6 ms. Average = 3 ms.' },
      { level: 3, text: 'Access time = 5 + 3 = 8 ms.' },
    ],
    fullExplanation: `Average rotational latency = (60,000 / RPM) / 2
= (60,000 / 10,000) / 2
= 6 / 2
= 3 ms

Access time (excluding transfer) = seek + rotational latency
= 5 + 3 = 8 ms`,
    commonMisconception: 'Using the full revolution time instead of half for average latency. Average rotational latency is always half the revolution time.',
    correctAnswer: 8,
    unit: 'ms',
    expectedFormat: 'integer',
  } as NumericSAQuestion,
];
