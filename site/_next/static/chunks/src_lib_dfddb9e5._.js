(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/types.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================================
// DBMS Quiz 2 Prep — Core Type Definitions
// ============================================================
// --- Question Types ---
__turbopack_context__.s([
    "SPACED_INTERVALS",
    ()=>SPACED_INTERVALS
]);
const SPACED_INTERVALS = [
    1,
    3,
    7
]; // days
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/mastery.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computeExamReadiness",
    ()=>computeExamReadiness,
    "computeMastery",
    ()=>computeMastery,
    "createErrorEntry",
    ()=>createErrorEntry,
    "getModuleMastery",
    ()=>getModuleMastery,
    "getModuleStatus",
    ()=>getModuleStatus,
    "getNextInterval",
    ()=>getNextInterval,
    "isMastered",
    ()=>isMastered,
    "isReviewDue",
    ()=>isReviewDue
]);
// ============================================================
// DBMS Quiz 2 Prep — Mastery Calculation Logic
// ============================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/types.ts [app-client] (ecmascript)");
;
function computeMastery(attempts, hintsUsedByAttempt) {
    const recent = attempts.slice(-10);
    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter((a)=>a.isCorrect).length;
    const recentResults = recent.map((a)=>a.isCorrect);
    const hintFreeCorrect = attempts.filter((a, i)=>a.isCorrect && hintsUsedByAttempt[i] === 0).length;
    const recentCorrect = recent.filter((a)=>a.isCorrect).length;
    const recentCount = recent.length;
    const accuracy = recentCount > 0 ? recentCorrect / recentCount * 100 : 0;
    let status = 'learning';
    if (recentCount >= 5 && accuracy >= 80 && hintFreeCorrect >= 2) {
        status = 'mastered';
    } else if (recentCount >= 2) {
        status = 'practising';
    }
    return {
        totalAttempts,
        correctAttempts,
        recentResults,
        hintFreeCorrect,
        mastery: Math.round(accuracy),
        status,
        lastAttemptDate: attempts.length > 0 ? attempts[attempts.length - 1].timestamp : null,
        subskill: '',
        moduleId: ''
    };
}
function isMastered(sm) {
    return sm.status === 'mastered';
}
function getModuleMastery(subskillMasteries, moduleSubskills) {
    if (moduleSubskills.length === 0) return 0;
    const values = moduleSubskills.map((sk)=>subskillMasteries[sk]?.mastery ?? 0);
    return Math.round(values.reduce((a, b)=>a + b, 0) / values.length);
}
function getModuleStatus(subskillMasteries, moduleSubskills, reviewDue) {
    if (moduleSubskills.length === 0) return 'not-started';
    const anyStarted = moduleSubskills.some((sk)=>(subskillMasteries[sk]?.totalAttempts ?? 0) > 0);
    if (!anyStarted) return 'not-started';
    if (reviewDue) return 'review-due';
    const avgMastery = getModuleMastery(subskillMasteries, moduleSubskills);
    if (avgMastery >= 80) return 'mastered';
    if (avgMastery >= 40) return 'practising';
    return 'learning';
}
function computeExamReadiness(subskillMasteries, moduleSubskillsMap, modulePriorities) {
    const weights = {
        P0: 4,
        P1: 2,
        P2: 1
    };
    let totalWeight = 0;
    let weightedSum = 0;
    for (const [moduleId, subskills] of Object.entries(moduleSubskillsMap)){
        const priority = modulePriorities[moduleId] || 'P2';
        const w = weights[priority] * subskills.length;
        const m = getModuleMastery(subskillMasteries, subskills);
        totalWeight += w;
        weightedSum += m * w;
    }
    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}
function getNextInterval(currentInterval) {
    const idx = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SPACED_INTERVALS"].indexOf(currentInterval);
    if (idx >= 0 && idx < __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SPACED_INTERVALS"].length - 1) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SPACED_INTERVALS"][idx + 1];
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SPACED_INTERVALS"][__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$types$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SPACED_INTERVALS"].length - 1];
}
function isReviewDue(item) {
    return Date.now() >= item.nextReviewDate;
}
function createErrorEntry(questionId, questionStem, moduleId, subskill, userAnswer, correctAnswer, misconception, repairLesson, fullExplanation, wasConfidentButWrong) {
    return {
        questionId,
        questionStem,
        moduleId,
        subskill,
        userAnswer,
        correctAnswer,
        misconception,
        repairLesson,
        fullExplanation,
        timestamp: Date.now(),
        nextReviewDate: Date.now() + 1 * 24 * 60 * 60 * 1000,
        wasConfidentButWrong
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/modules.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================================
// DBMS Quiz 2 Prep — Module Definitions
// ============================================================
__turbopack_context__.s([
    "getModule",
    ()=>getModule,
    "moduleIdToIndex",
    ()=>moduleIdToIndex,
    "modules",
    ()=>modules
]);
const modules = [
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
            'I can identify prime attributes from candidate keys.'
        ],
        subskills: [
            'closure-computation',
            'candidate-key-finding',
            'superkey-counting',
            'prime-attribute-identification'
        ]
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
            'I can distinguish the 3NF exception (RHS is prime) from BCNF.'
        ],
        subskills: [
            'prime-attribute-identification',
            'bcnf-testing',
            '3nf-testing',
            '2nf-testing',
            'normal-form-comparison'
        ]
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
            'I can compute a canonical/minimal cover: split RHS, remove extraneous LHS attributes, remove redundant FDs.'
        ],
        subskills: [
            'lossless-join-test',
            'dependency-preservation-test',
            'minimal-cover-computation'
        ]
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
            'I can compute total disk access time = seek + avg rotational latency + transfer time.'
        ],
        subskills: [
            'disk-capacity',
            'addressing-bits',
            'rotational-latency',
            'transfer-time',
            'access-time'
        ]
    },
    {
        id: 'lru-buffer',
        title: 'LRU Buffer Management',
        shortTitle: 'LRU Buffer',
        description: 'Simulating LRU page replacement, counting hits, misses, and page faults.',
        whyItMatters: 'LRU appears in multiple separate papers with 3–4 frame buffers. The question is always about exact simulation — not intuition.',
        objectives: [
            'I can simulate LRU replacement step by step for any request sequence.',
            'I can distinguish hits from misses and count each accurately.',
            'I can compute misses − hits when asked.'
        ],
        subskills: [
            'lru-simulation',
            'hit-miss-counting'
        ]
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
            'I can find minimum and maximum height for n nodes.'
        ],
        subskills: [
            'bst-construction',
            'bst-height',
            'bst-search-paths',
            'bst-insertion-order',
            'bst-leaf-nodes'
        ]
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
            'I understand when commit() is needed to persist changes.'
        ],
        subskills: [
            'sql-query-interpretation',
            'psycopg2-api',
            'parameterized-queries'
        ]
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
            'I know key data dictionary and DDL concepts.'
        ],
        subskills: [
            'er-constraints',
            'file-organization',
            'data-dictionary'
        ]
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
            'I can apply exam strategies: time allocation, MSQ independence, unit checking.'
        ],
        subskills: [
            'mixed-problem-solving',
            'exam-strategy',
            'time-management'
        ]
    }
];
const moduleIdToIndex = {};
modules.forEach((m, i)=>{
    moduleIdToIndex[m.id] = i;
});
function getModule(id) {
    return modules.find((m)=>m.id === id);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/store.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useStore",
    ()=>useStore
]);
// ============================================================
// DBMS Quiz 2 Prep — Zustand Store with localStorage Persistence
// ============================================================
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mastery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mastery.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$modules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/modules.ts [app-client] (ecmascript)");
;
;
;
const STORAGE_KEY = 'dbms-quiz2-prep-state';
const defaultOnboarding = {
    completed: false,
    topicConfidence: {},
    diagnosticScore: 0,
    diagnosticResults: [],
    studyPath: {}
};
const defaultSettings = {
    reducedMotion: false,
    fontSize: 'normal',
    highContrast: false
};
function getInitialState() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            return {
                ...getDefaultState(),
                ...parsed
            };
        }
    } catch (e) {
        console.warn('Failed to load saved state:', e);
    }
    return getDefaultState();
}
function getDefaultState() {
    return {
        onboarding: defaultOnboarding,
        moduleStatus: {},
        moduleCurrentStep: {},
        attempts: {},
        subskillMastery: {},
        errorNotebook: [],
        reviewQueue: [],
        mockResults: [],
        settings: defaultSettings,
        currentPage: 'dashboard',
        currentModule: null
    };
}
function persist(state) {
    if ("TURBOPACK compile-time truthy", 1) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.warn('Failed to persist state:', e);
        }
    }
}
const useStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])((set, get)=>({
        ...getInitialState(),
        navigate: (page, moduleId = null)=>{
            set({
                currentPage: page,
                currentModule: moduleId
            });
            window.location.hash = moduleId ? `${page}/${moduleId}` : page;
        },
        setOnboarding: (data)=>{
            const state = get();
            const onboarding = {
                ...state.onboarding,
                ...data
            };
            set({
                onboarding
            });
            persist({
                ...state,
                onboarding
            });
        },
        completeOnboarding: ()=>{
            const state = get();
            const onboarding = {
                ...state.onboarding,
                completed: true
            };
            set({
                onboarding,
                currentPage: 'dashboard'
            });
            persist({
                ...state,
                onboarding,
                currentPage: 'dashboard'
            });
        },
        recordAttempt: (attempt)=>{
            const state = get();
            const questionAttempts = [
                ...state.attempts[attempt.questionId] || [],
                attempt
            ];
            const attempts = {
                ...state.attempts,
                [attempt.questionId]: questionAttempts
            };
            // Get question subskill info from module definitions
            let subskill = 'general';
            let moduleId = 'unknown';
            for (const mod of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$modules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["modules"]){
            // We'll resolve this when questions are loaded with their metadata
            }
            // Recompute subskill mastery
            const subskillMastery = {
                ...state.subskillMastery
            };
            // The mastery is recomputed when the question engine processes it
            // Update module status
            const moduleStatus = {
                ...state.moduleStatus
            };
            set({
                attempts,
                subskillMastery,
                moduleStatus
            });
            persist({
                ...state,
                attempts,
                subskillMastery,
                moduleStatus
            });
        },
        recordAttemptWithMeta: (attempt, subskill, moduleId, questionStem, correctAnswerStr, misconception, repairLesson, fullExplanation)=>{
            const state = get();
            const questionAttempts = [
                ...state.attempts[attempt.questionId] || [],
                attempt
            ];
            const attempts = {
                ...state.attempts,
                [attempt.questionId]: questionAttempts
            };
            // Update subskill mastery
            const allSubskillAttempts = Object.values(attempts).flat().filter((a)=>{
                // Filter by subskill - we store this in a side map
                return true;
            });
            const subskillMastery = {
                ...state.subskillMastery
            };
            const skAttempts = questionAttempts;
            const hintsUsed = skAttempts.map((a)=>a.hintsUsed || 0);
            const computed = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mastery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computeMastery"])(skAttempts, hintsUsed);
            subskillMastery[subskill] = {
                ...computed,
                subskill,
                moduleId
            };
            // Handle incorrect answer: error notebook + review queue
            const errorNotebook = [
                ...state.errorNotebook
            ];
            const reviewQueue = [
                ...state.reviewQueue
            ];
            if (!attempt.isCorrect) {
                const wasConfident = attempt.confidence === 'high' && !attempt.isCorrect;
                const entry = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mastery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createErrorEntry"])(attempt.questionId, questionStem, moduleId, subskill, attempt.selectedAnswer, correctAnswerStr, misconception, repairLesson, fullExplanation, wasConfident);
                // Replace existing entry for same question
                const existingIdx = errorNotebook.findIndex((e)=>e.questionId === attempt.questionId);
                if (existingIdx >= 0) {
                    errorNotebook[existingIdx] = entry;
                } else {
                    errorNotebook.push(entry);
                }
                // Add to review queue
                const reviewReason = wasConfident ? 'confident-wrong' : 'incorrect';
                const existingReview = reviewQueue.findIndex((r)=>r.questionId === attempt.questionId);
                if (existingReview >= 0) {
                    reviewQueue[existingReview] = {
                        ...reviewQueue[existingReview],
                        nextReviewDate: Date.now() + 1 * 24 * 60 * 60 * 1000,
                        reviewCount: reviewQueue[existingReview].reviewCount + 1,
                        reason: wasConfident ? 'confident-wrong' : reviewQueue[existingReview].reason
                    };
                } else {
                    reviewQueue.push({
                        questionId: attempt.questionId,
                        moduleId,
                        subskill,
                        reason: reviewReason,
                        nextReviewDate: Date.now() + 1 * 24 * 60 * 60 * 1000,
                        interval: 1,
                        reviewCount: 0
                    });
                }
            }
            // Update module status based on subskill mastery
            const mod = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$modules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["modules"].find((m)=>m.id === moduleId);
            const moduleStatus = {
                ...state.moduleStatus
            };
            if (mod) {
                const subskillMasteries = mod.subskills.map((sk)=>subskillMasteries[sk]);
                const anyStarted = subskillMasteries.some((sm)=>sm && sm.totalAttempts > 0);
                const avgMastery = subskillMasteries.length > 0 ? Math.round(subskillMasteries.reduce((a, sm)=>a + (sm?.mastery ?? 0), 0) / subskillMasteries.length) : 0;
                const hasReviewDue = reviewQueue.some((r)=>r.moduleId === moduleId && (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mastery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isReviewDue"])(r));
                let status = 'not-started';
                if (hasReviewDue) status = 'review-due';
                else if (avgMastery >= 80) status = 'mastered';
                else if (anyStarted && avgMastery >= 40) status = 'practising';
                else if (anyStarted) status = 'learning';
                moduleStatus[moduleId] = status;
            }
            const newState = {
                attempts,
                subskillMastery,
                errorNotebook,
                reviewQueue,
                moduleStatus
            };
            set(newState);
            persist({
                ...state,
                ...newState
            });
        },
        addToErrorNotebook: (entry)=>{
            const state = get();
            const errorNotebook = [
                ...state.errorNotebook
            ];
            const idx = errorNotebook.findIndex((e)=>e.questionId === entry.questionId);
            if (idx >= 0) errorNotebook[idx] = entry;
            else errorNotebook.push(entry);
            set({
                errorNotebook
            });
            persist({
                ...state,
                errorNotebook
            });
        },
        removeFromErrorNotebook: (questionId)=>{
            const state = get();
            set({
                errorNotebook: state.errorNotebook.filter((e)=>e.questionId !== questionId)
            });
        },
        addToReviewQueue: (item)=>{
            const state = get();
            const reviewQueue = [
                ...state.reviewQueue
            ];
            const idx = reviewQueue.findIndex((r)=>r.questionId === item.questionId);
            if (idx >= 0) reviewQueue[idx] = item;
            else reviewQueue.push(item);
            set({
                reviewQueue
            });
            persist({
                ...state,
                reviewQueue
            });
        },
        getDueReviewItems: ()=>{
            return get().reviewQueue.filter(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mastery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isReviewDue"]);
        },
        markReviewComplete: (questionId)=>{
            const state = get();
            const reviewQueue = state.reviewQueue.map((r)=>{
                if (r.questionId === questionId) {
                    const nextInterval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mastery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getNextInterval"])(r.interval);
                    return {
                        ...r,
                        nextReviewDate: Date.now() + nextInterval * 24 * 60 * 60 * 1000,
                        interval: nextInterval,
                        reviewCount: r.reviewCount + 1
                    };
                }
                return r;
            });
            set({
                reviewQueue
            });
            persist({
                ...state,
                reviewQueue
            });
        },
        updateModuleStatus: (moduleId, status)=>{
            const state = get();
            const moduleStatus = {
                ...state.moduleStatus,
                [moduleId]: status
            };
            set({
                moduleStatus
            });
            persist({
                ...state,
                moduleStatus
            });
        },
        setModuleStep: (moduleId, step)=>{
            const state = get();
            const moduleCurrentStep = {
                ...state.moduleCurrentStep,
                [moduleId]: step
            };
            set({
                moduleCurrentStep
            });
            persist({
                ...state,
                moduleCurrentStep
            });
        },
        addMockResult: (result)=>{
            const state = get();
            const mockResults = [
                ...state.mockResults,
                result
            ];
            set({
                mockResults
            });
            persist({
                ...state,
                mockResults
            });
        },
        updateSettings: (newSettings)=>{
            const state = get();
            const settings = {
                ...state.settings,
                ...newSettings
            };
            set({
                settings
            });
            persist({
                ...state,
                settings
            });
            // Apply font size to document
            if (typeof document !== 'undefined') {
                document.documentElement.style.fontSize = settings.fontSize === 'xlarge' ? '20px' : settings.fontSize === 'large' ? '18px' : '16px';
            }
        },
        resetAll: ()=>{
            const fresh = getDefaultState();
            set(fresh);
            persist(fresh);
        },
        exportData: ()=>{
            const state = get();
            return JSON.stringify(state, null, 2);
        },
        getModuleMastery: (moduleId)=>{
            const state = get();
            const mod = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$modules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["modules"].find((m)=>m.id === moduleId);
            if (!mod) return 0;
            const values = mod.subskills.map((sk)=>state.subskillMastery[sk]?.mastery ?? 0);
            return values.length > 0 ? Math.round(values.reduce((a, b)=>a + b, 0) / values.length) : 0;
        },
        getModuleStatus: (moduleId)=>{
            const state = get();
            if (state.moduleStatus[moduleId]) return state.moduleStatus[moduleId];
            return 'not-started';
        },
        getExamReadiness: ()=>{
            const state = get();
            const weights = {
                P0: 4,
                P1: 2,
                P2: 1
            };
            let totalWeight = 0;
            let weightedSum = 0;
            for (const mod of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$modules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["modules"]){
                if (mod.id === 'mixed-mock') continue;
                const w = weights[mod.priority] * mod.subskills.length;
                const m = state.subskillMastery ? mod.subskills.reduce((sum, sk)=>sum + (state.subskillMastery[sk]?.mastery ?? 0), 0) / mod.subskills.length : 0;
                totalWeight += w;
                weightedSum += m * w;
            }
            return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
        },
        getNextBestActivity: ()=>{
            const state = get();
            // 1. If not onboarded, go to onboarding
            if (!state.onboarding.completed) {
                return {
                    page: 'onboarding',
                    label: 'Start Diagnostic'
                };
            }
            // 2. Check for due review items
            const dueItems = state.reviewQueue.filter(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mastery$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["isReviewDue"]);
            if (dueItems.length > 0) {
                return {
                    page: 'review',
                    label: 'Review Due Items'
                };
            }
            // 3. Find first non-mastered P0 module
            for (const mod of __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$modules$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["modules"]){
                if (mod.id === 'mixed-mock') continue;
                const status = state.moduleStatus[mod.id] || 'not-started';
                if (status !== 'mastered') {
                    return {
                        page: 'learn-module',
                        moduleId: mod.id,
                        label: `Continue: ${mod.shortTitle}`
                    };
                }
            }
            // 4. All mastered — suggest mixed mock
            return {
                page: 'mock',
                label: 'Take a Full Mock'
            };
        }
    }));
// Hydrate store on mount
if (("TURBOPACK compile-time value", "object") !== 'undefined') {
// The store auto-hydrates via getInitialState()
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questions/fd.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================================
// FD Closures, Keys & Prime Attributes
// ============================================================
__turbopack_context__.s([
    "allFdQuestions",
    ()=>allFdQuestions
]);
const allFdQuestions = [
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
            {
                level: 1,
                text: 'Start with result = {A}. Check each FD: if the LHS is a subset of result, add the RHS.'
            },
            {
                level: 2,
                text: 'A gives B and C (via A -> BC). Now result = {A, B, C}. Then C gives D (via C -> D). Now result = {A, B, C, D}.'
            },
            {
                level: 3,
                text: 'With {A, B, C, D}, BD is a subset, so add E. Final closure = {A, B, C, D, E}.'
            }
        ],
        fullExplanation: `Step-by-step closure of {A}:
1. Start: result = {A}
2. A -> BC: A is in result, so add B, C. result = {A, B, C}
3. C -> D: C is in result, so add D. result = {A, B, C, D}
4. BD -> E: both B and D are in result, so add E. result = {A, B, C, D, E}
5. No more attributes to add. A+ = {A, B, C, D, E} = all attributes, so A is a superkey.`,
        commonMisconception: 'Stopping early after adding BC and forgetting to check C -> D and BD -> E. You must keep scanning all FDs until no new attributes are added.',
        options: [
            {
                id: 'a',
                text: '{A, B, C}',
                isCorrect: false,
                explanation: 'This is incomplete. You stopped before applying C -> D.'
            },
            {
                id: 'b',
                text: '{A, B, C, D}',
                isCorrect: false,
                explanation: 'You stopped before applying BD -> E.'
            },
            {
                id: 'c',
                text: '{A, B, C, D, E}',
                isCorrect: true,
                explanation: 'Correct. After chaining through all FDs, the closure includes every attribute.'
            },
            {
                id: 'd',
                text: '{A, B, C, E}',
                isCorrect: false,
                explanation: 'D was not obtained. C -> D must be applied.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'First find attributes that never appear on any RHS. Those must be in every candidate key.'
            },
            {
                level: 2,
                text: 'A never appears on any RHS. Compute A+ to see if it covers all attributes.'
            },
            {
                level: 3,
                text: 'A+ = {A} -> add B,C -> add D -> add E -> add F. A alone determines everything, so A is a candidate key.'
            }
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
            {
                id: 'a',
                text: 'AB',
                isCorrect: false,
                explanation: 'AB is a superkey but not minimal since A alone is a superkey.'
            },
            {
                id: 'b',
                text: 'A',
                isCorrect: true,
                explanation: 'Correct. A alone determines all attributes and is minimal.'
            },
            {
                id: 'c',
                text: 'BD',
                isCorrect: false,
                explanation: 'B+ = {B}, D+ = {D}, neither reaches all attributes.'
            },
            {
                id: 'd',
                text: 'CE',
                isCorrect: false,
                explanation: 'CE+ does not include A or B, so it cannot be a superkey.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Every superkey must contain the candidate key A.'
            },
            {
                level: 2,
                text: 'The remaining attributes are B, C, D, E, F (5 attributes). Any subset of these can be combined with A to form a superkey.'
            },
            {
                level: 3,
                text: 'Number of superkeys = 2^(n-k) = 2^(6-1) = 2^5 = 32.'
            }
        ],
        fullExplanation: `The candidate key is A (1 attribute). The relation has 6 attributes.
Every superkey must contain A. The remaining 5 attributes (B, C, D, E, F) can be included or excluded freely.
Number of subsets of {B, C, D, E, F} = 2^5 = 32.
Therefore, there are 32 superkeys.`,
        commonMisconception: 'Counting 2^6 = 64 by including sets without A. A superkey must contain a candidate key, so A must be present in every superkey.',
        correctAnswer: 32,
        unit: 'superkeys',
        expectedFormat: 'integer'
    },
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
            {
                level: 1,
                text: 'Start with {B}. Check every FD to see if its LHS is a subset of {B}.'
            },
            {
                level: 2,
                text: 'No FD has just B on the left side. AB -> C requires A, which is not in {B}.'
            },
            {
                level: 3,
                text: 'Since no FD LHS is contained in {B}, the closure stays as {B}.'
            }
        ],
        fullExplanation: `Starting with {B}:
- AB -> C: needs A and B. A is not in {B}, so this does not apply.
- C -> D: needs C, which is not in {B}.
- D -> E: needs D, which is not in {B}.
No FD can fire. Therefore B+ = {B}.`,
        commonMisconception: 'Assuming B -> C transitively or guessing based on the FD set structure. Always follow the algorithm mechanically.',
        options: [
            {
                id: 'a',
                text: '{B, C, D, E}',
                isCorrect: false,
                explanation: 'No FD has B alone on the LHS.'
            },
            {
                id: 'b',
                text: '{B}',
                isCorrect: true,
                explanation: 'Correct. No FD fires from {B} alone.'
            },
            {
                id: 'c',
                text: '{B, C}',
                isCorrect: false,
                explanation: 'AB -> C requires A, not just B.'
            },
            {
                id: 'd',
                text: '{A, B, C, D, E}',
                isCorrect: false,
                explanation: 'This would require A to be in the starting set.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Check which attribute(s) never appear on any RHS. That attribute must be in every candidate key.'
            },
            {
                level: 2,
                text: 'A never appears on any RHS. Since A -> B -> C -> D, A+ = {A, B, C, D}. So A is a candidate key.'
            },
            {
                level: 3,
                text: 'Is there any other candidate key? Since A is the only attribute not on any RHS, every key must contain A. And A alone works. So A is the only candidate key.'
            }
        ],
        fullExplanation: `Step 1: A never appears on the RHS of any FD. So A must be in every candidate key.
Step 2: A+ = {A} -> {A,B} -> {A,B,C} -> {A,B,C,D}. A is a superkey.
Step 3: Since {A} has no proper non-empty subset, it is minimal. A is the only candidate key.
Note: AB, AC, AD, ABC, ABD, ACD, ABCD are all superkeys but NOT candidate keys because they are not minimal.`,
        commonMisconception: 'Selecting AB as a candidate key. AB is a superkey but not minimal since A alone suffices. A candidate key must be minimal.',
        options: [
            {
                id: 'a',
                text: 'A',
                isCorrect: true,
                explanation: 'A alone determines all attributes and is minimal.'
            },
            {
                id: 'b',
                text: 'AB',
                isCorrect: false,
                explanation: 'Superkey but not minimal. A alone works.'
            },
            {
                id: 'c',
                text: 'AC',
                isCorrect: false,
                explanation: 'Superkey but not minimal.'
            },
            {
                id: 'd',
                text: 'AD',
                isCorrect: false,
                explanation: 'Superkey but not minimal.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'A superkey is any set containing at least one candidate key. List all subsets of {A,B,C,D} that contain AB or CD.'
            },
            {
                level: 2,
                text: 'Supersets of AB: any set containing both A and B. Supersets of CD: any set containing both C and D. Use inclusion-exclusion to avoid double-counting sets containing both AB and CD.'
            },
            {
                level: 3,
                text: 'Sets containing AB: 2^2 = 4 (choose from {C,D} freely). Sets containing CD: 2^2 = 4. Sets containing both AB and CD: 1 (ABCD itself). Total = 4 + 4 - 1 = 7.'
            }
        ],
        fullExplanation: `Candidate keys: AB and CD.
Superkeys containing AB: {AB, ABC, ABD, ABCD} = 4 sets.
Superkeys containing CD: {CD, ACD, BCD, ABCD} = 4 sets.
ABCD is counted in both groups, so by inclusion-exclusion: 4 + 4 - 1 = 7 superkeys.

The 7 superkeys are: AB, CD, ABC, ABD, ACD, BCD, ABCD.`,
        commonMisconception: 'Simply computing 2^2 + 2^2 = 8 without subtracting the overlap ABCD. When there are multiple candidate keys, their supersets can overlap.',
        correctAnswer: 7,
        unit: 'superkeys',
        expectedFormat: 'integer'
    },
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
            {
                level: 1,
                text: 'A prime attribute is one that is part of at least one candidate key.'
            },
            {
                level: 2,
                text: 'The only candidate key is AB. The attributes in it are A and B.'
            },
            {
                level: 3,
                text: 'A and B are prime. C, D, E are non-prime.'
            }
        ],
        fullExplanation: `The candidate key is AB. Prime attributes are those belonging to at least one candidate key.
Since AB is the only candidate key, the prime attributes are A and B.
C, D, and E are non-prime attributes because they do not appear in any candidate key.

Note: Even though C appears on the LHS of an FD (C -> D), that does not make it prime. Only membership in a candidate key matters.`,
        commonMisconception: 'Thinking that C is prime because it appears on the LHS of C -> D. Being a determinant does not make an attribute prime; only being part of a candidate key does.',
        options: [
            {
                id: 'a',
                text: 'A',
                isCorrect: true,
                explanation: 'A is part of candidate key AB, so it is prime.'
            },
            {
                id: 'b',
                text: 'B',
                isCorrect: true,
                explanation: 'B is part of candidate key AB, so it is prime.'
            },
            {
                id: 'c',
                text: 'C',
                isCorrect: false,
                explanation: 'C is not part of any candidate key.'
            },
            {
                id: 'd',
                text: 'D',
                isCorrect: false,
                explanation: 'D is not part of any candidate key.'
            },
            {
                id: 'e',
                text: 'E',
                isCorrect: false,
                explanation: 'E is not part of any candidate key.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Prime attributes are those that appear in at least one candidate key.'
            },
            {
                level: 2,
                text: 'Key AC contributes A and C. Key BC contributes B and C. The union is {A, B, C}.'
            },
            {
                level: 3,
                text: 'The prime attributes are A, B, and C. That is 3 prime attributes.'
            }
        ],
        fullExplanation: `Candidate key AC gives prime attributes: A, C.
Candidate key BC gives prime attributes: B, C.
Union of all prime attributes = {A, B, C}.
Count = 3.

D and E are non-prime attributes.`,
        commonMisconception: 'Counting C twice because it appears in both keys. The question asks for the number of distinct prime attributes, not the total membership count.',
        options: [
            {
                id: 'a',
                text: '2',
                isCorrect: false,
                explanation: 'This would miss one of the three distinct prime attributes.'
            },
            {
                id: 'b',
                text: '3',
                isCorrect: true,
                explanation: 'Correct. A, B, and C are the three distinct prime attributes.'
            },
            {
                id: 'c',
                text: '4',
                isCorrect: false,
                explanation: 'Only 3 attributes appear across both candidate keys.'
            },
            {
                id: 'd',
                text: '5',
                isCorrect: false,
                explanation: 'D and E are non-prime.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'This is a pure chain. Start with {A} and follow the FDs one by one.'
            },
            {
                level: 2,
                text: 'A gives B, B gives C, C gives D, D gives E, E gives F, F gives G. Each step adds one attribute.'
            },
            {
                level: 3,
                text: 'The closure is {A, B, C, D, E, F, G}, which is all 7 attributes.'
            }
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
        expectedFormat: 'integer'
    },
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
            {
                level: 1,
                text: 'First find the candidate keys. Which attributes never appear on any RHS?'
            },
            {
                level: 2,
                text: 'W and X never appear on the RHS. WX+ = {W, X, Y, Z}, so WX is a candidate key. Since W and X are mandatory, WX is the only candidate key.'
            },
            {
                level: 3,
                text: 'Any superset of WX is a superkey but not a candidate key. WXY contains WX plus extra attribute Y, so it is a superkey but not minimal.'
            }
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
            {
                id: 'a',
                text: 'WX',
                isCorrect: false,
                explanation: 'WX is a candidate key, not just a superkey.'
            },
            {
                id: 'b',
                text: 'WXY',
                isCorrect: true,
                explanation: 'Correct. WXY is a superkey (contains WX) but not minimal, so not a candidate key.'
            },
            {
                id: 'c',
                text: 'W',
                isCorrect: false,
                explanation: 'W+ = {W}, which is not a superkey.'
            },
            {
                id: 'd',
                text: 'YZ',
                isCorrect: false,
                explanation: 'YZ+ = {Y, Z}, not a superkey.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Start with {P, R}. Check each FD.'
            },
            {
                level: 2,
                text: 'P -> Q: P is in {P, R}, so add Q. R -> S: R is in {P, R}, so add S.'
            },
            {
                level: 3,
                text: 'Result = {P, Q, R, S} = all attributes.'
            }
        ],
        fullExplanation: `Starting with {P, R}:
P -> Q: P is in the set, so add Q. Now {P, Q, R}
R -> S: R is in the set, so add S. Now {P, Q, R, S}

No more FDs apply. (PR)+ = {P, Q, R, S}. This means PR is a superkey.`,
        commonMisconception: 'Thinking P and R must be combined into PR on the LHS of some FD. The closure algorithm checks each FD independently.',
        options: [
            {
                id: 'a',
                text: '{P, Q, R}',
                isCorrect: false,
                explanation: 'You missed R -> S.'
            },
            {
                id: 'b',
                text: '{P, Q, R, S}',
                isCorrect: true,
                explanation: 'Correct. Both FDs fire from {P, R}.'
            },
            {
                id: 'c',
                text: '{P, R, S}',
                isCorrect: false,
                explanation: 'You missed P -> Q.'
            },
            {
                id: 'd',
                text: '{P, R}',
                isCorrect: false,
                explanation: 'Both FDs should fire and add Q and S.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Every superkey must contain AB. For a 3-attribute superkey, you need AB plus exactly one more attribute.'
            },
            {
                level: 2,
                text: 'The extra attribute can be any of {C, D, E}. That gives 3 choices.'
            },
            {
                level: 3,
                text: 'The 3-attribute superkeys are ABC, ABD, ABE. Answer: 3.'
            }
        ],
        fullExplanation: `Every superkey must contain the candidate key AB.
For a superkey with exactly 3 attributes, we need AB plus one additional attribute from {C, D, E}.
Number of ways to choose 1 from 3 = C(3,1) = 3.
The superkeys are: ABC, ABD, ABE.`,
        commonMisconception: 'Using C(5,3) = 10 which counts all 3-attribute subsets, not just those containing AB.',
        correctAnswer: 3,
        unit: 'superkeys',
        expectedFormat: 'integer'
    },
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
            {
                level: 1,
                text: 'Find attributes never on any RHS: A and C. Both must be in every candidate key.'
            },
            {
                level: 2,
                text: 'Compute AC+: {A,C} -> add B (via A->B) -> {A,B,C} -> add D (via BC->D) -> {A,B,C,D} -> add E (via D->E) -> {A,B,C,D,E}. AC is a superkey.'
            },
            {
                level: 3,
                text: 'AC is minimal (A and C are both mandatory). Is there a smaller key? No, because both A and C are required. So AC is the only candidate key.'
            }
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
            {
                id: 'a',
                text: 'A',
                isCorrect: false,
                explanation: 'A+ = {A, B}, does not reach C, D, E.'
            },
            {
                id: 'b',
                text: 'AC',
                isCorrect: true,
                explanation: 'Correct. AC+ covers all attributes and is minimal.'
            },
            {
                id: 'c',
                text: 'ABC',
                isCorrect: false,
                explanation: 'Superkey but not minimal. AC alone suffices.'
            },
            {
                id: 'd',
                text: 'BC',
                isCorrect: false,
                explanation: 'BC+ = {B, C, D, E}, missing A.'
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questions/normalization.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================================
// Normalization: 2NF, 3NF, BCNF Testing
// ============================================================
__turbopack_context__.s([
    "allNormalizationQuestions",
    ()=>allNormalizationQuestions
]);
const allNormalizationQuestions = [
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
            {
                level: 1,
                text: 'First identify prime attributes. They are A and B (from candidate key AB).'
            },
            {
                level: 2,
                text: 'For BCNF, every non-trivial FD must have a superkey on the LHS. C -> B violates BCNF because C is not a superkey.'
            },
            {
                level: 3,
                text: 'For 3NF, the exception allows non-superkey determinants if the RHS is prime. In C -> B, B is prime. So 3NF is satisfied.'
            }
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
            {
                id: 'a',
                text: '1NF',
                isCorrect: false,
                explanation: '2NF and 3NF are both satisfied.'
            },
            {
                id: 'b',
                text: '2NF',
                isCorrect: false,
                explanation: '3NF is also satisfied.'
            },
            {
                id: 'c',
                text: '3NF',
                isCorrect: true,
                explanation: 'Correct. C -> B violates BCNF but satisfies 3NF because B is prime.'
            },
            {
                id: 'd',
                text: 'BCNF',
                isCorrect: false,
                explanation: 'C is not a superkey, so C -> B violates BCNF.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Check each FD: is the LHS a superkey?'
            },
            {
                level: 2,
                text: 'A is the candidate key (hence a superkey). Every FD has A on the LHS. So every determinant is a superkey.'
            },
            {
                level: 3,
                text: 'Since every non-trivial FD has a superkey determinant, the relation is in BCNF (and therefore also 3NF and 2NF).'
            }
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
            {
                id: 'a',
                text: '2NF',
                isCorrect: false,
                explanation: '3NF and BCNF are both satisfied.'
            },
            {
                id: 'b',
                text: '3NF',
                isCorrect: false,
                explanation: 'BCNF is also satisfied.'
            },
            {
                id: 'c',
                text: 'BCNF',
                isCorrect: true,
                explanation: 'Correct. Every non-trivial FD has A (a superkey) on the LHS.'
            },
            {
                id: 'd',
                text: '1NF',
                isCorrect: false,
                explanation: 'All higher forms are satisfied.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'The candidate key AB is composite. For 2NF, check for partial dependencies of non-prime attributes on a proper subset of the key.'
            },
            {
                level: 2,
                text: 'Non-prime attributes are C and D. A -> D is a partial dependency: A is a proper subset of AB, and D is non-prime.'
            },
            {
                level: 3,
                text: 'Since a non-prime attribute D depends on a proper subset A of the candidate key AB, 2NF is violated. The relation is in 1NF only.'
            }
        ],
        fullExplanation: `Candidate key: AB. Prime attributes: {A, B}. Non-prime: {C, D}.

For 2NF: No non-prime attribute should depend on a proper subset of any candidate key.
- A -> D: A is a proper subset of AB, and D is non-prime. This is a partial dependency. 2NF is violated.

Since 2NF is not satisfied, the highest normal form is 1NF.`,
        commonMisconception: 'Thinking that A -> D is fine because A is part of the key. In 2NF, a non-prime attribute must depend on the ENTIRE candidate key, not just a part.',
        options: [
            {
                id: 'a',
                text: '1NF',
                isCorrect: true,
                explanation: 'Correct. A -> D is a partial dependency of non-prime D on part of key AB.'
            },
            {
                id: 'b',
                text: '2NF',
                isCorrect: false,
                explanation: 'A -> D violates 2NF.'
            },
            {
                id: 'c',
                text: '3NF',
                isCorrect: false,
                explanation: '2NF must hold before 3NF can hold.'
            },
            {
                id: 'd',
                text: 'BCNF',
                isCorrect: false,
                explanation: 'The relation is not even in 2NF.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Prime attributes: A (only key attribute). Non-prime: B, C.'
            },
            {
                level: 2,
                text: 'B -> C: B is not a superkey. For BCNF this fails. For 3NF, C must be prime for the exception. C is NOT prime. So 3NF also fails.'
            },
            {
                level: 3,
                text: 'A -> B is fine (A is a superkey). B -> C violates both BCNF and 3NF. The highest NF is 2NF since no partial dependency exists (key A is single-attribute, so 2NF is trivially satisfied).'
            }
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
            {
                id: 'a',
                text: 'R is in 2NF',
                isCorrect: true,
                explanation: 'Correct. A is a single-attribute candidate key, so no partial dependency is possible.'
            },
            {
                id: 'b',
                text: 'R is in 3NF',
                isCorrect: false,
                explanation: 'B -> C violates 3NF because B is not a superkey and C is not prime.'
            },
            {
                id: 'c',
                text: 'R is in BCNF',
                isCorrect: false,
                explanation: 'B -> C violates BCNF because B is not a superkey.'
            },
            {
                id: 'd',
                text: 'B -> C is the violating dependency',
                isCorrect: true,
                explanation: 'Correct. This is the FD that breaks 3NF and BCNF.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Prime attributes: A and B (both in candidate keys). Check each FD for BCNF.'
            },
            {
                level: 2,
                text: 'A -> B: A is a superkey. A -> C: A is a superkey. B -> A: B is a superkey. All LHS are superkeys.'
            },
            {
                level: 3,
                text: 'Every non-trivial FD has a superkey on the LHS. R is in BCNF.'
            }
        ],
        fullExplanation: `Candidate keys: A and B. Prime attributes: {A, B}. Non-prime: {C}.

Check each non-trivial FD:
- A -> B: A is a superkey. OK for BCNF.
- B -> A: B is a superkey. OK for BCNF.
- A -> C: A is a superkey. OK for BCNF.

All determinants are superkeys. R is in BCNF.`,
        commonMisconception: 'Thinking that having A -> B and B -> A (a cycle) means a lower normal form. Cycles do not violate BCNF as long as both sides are superkeys.',
        options: [
            {
                id: 'a',
                text: '2NF',
                isCorrect: false,
                explanation: 'BCNF is achieved.'
            },
            {
                id: 'b',
                text: '3NF',
                isCorrect: false,
                explanation: 'BCNF is achieved.'
            },
            {
                id: 'c',
                text: 'BCNF',
                isCorrect: true,
                explanation: 'Correct. Every non-trivial FD has a superkey determinant.'
            },
            {
                id: 'd',
                text: '1NF',
                isCorrect: false,
                explanation: 'Much higher normal forms are satisfied.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Prime attributes: A, B, C (union of all candidate key attributes). Non-prime: {D}. Check C -> A.'
            },
            {
                level: 2,
                text: 'C -> A: C is NOT a superkey (C+ = {C, A}, does not reach B or D). For 3NF, is A prime? Yes, A is prime. So the 3NF exception applies.'
            },
            {
                level: 3,
                text: 'BCNF fails because C is not a superkey. 3NF holds because the RHS A is prime. No partial dependency of D on a subset of AB or BC. Highest NF: 3NF.'
            }
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
            {
                id: 'a',
                text: '2NF',
                isCorrect: false,
                explanation: '3NF is satisfied via the prime-attribute exception.'
            },
            {
                id: 'b',
                text: '3NF',
                isCorrect: true,
                explanation: 'Correct. C -> A violates BCNF but satisfies 3NF because A is prime.'
            },
            {
                id: 'c',
                text: 'BCNF',
                isCorrect: false,
                explanation: 'C is not a superkey, so C -> A violates BCNF.'
            },
            {
                id: 'd',
                text: '1NF',
                isCorrect: false,
                explanation: '2NF and 3NF are both satisfied.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Candidate key AB is composite. Prime attributes: {A, B}. Non-prime: {C, D}.'
            },
            {
                level: 2,
                text: 'A -> B: A is a proper subset of key AB, but B is prime, so this does not violate 2NF. B -> C: B is a proper subset of key AB, and C is non-prime. This IS a partial dependency violation.'
            },
            {
                level: 3,
                text: 'B -> C violates 2NF (non-prime C partially depends on B, a subset of key AB). R is in 1NF only.'
            }
        ],
        fullExplanation: `Candidate key: AB. Prime: {A, B}. Non-prime: {C, D}.

2NF check (partial dependencies of non-prime on proper subset of key):
- A -> B: B is prime. Not a 2NF violation (2NF only cares about non-prime RHS).
- B -> C: B is a proper subset of AB, and C is non-prime. 2NF VIOLATED.
- AB -> CD: full key dependency. Fine.

Since 2NF is violated, highest normal form is 1NF.`,
        commonMisconception: 'Thinking A -> B causes the 2NF violation. In 2NF, we only check partial dependencies where the RHS is non-prime. B is prime, so A -> B is not a 2NF issue.',
        options: [
            {
                id: 'a',
                text: '1NF',
                isCorrect: true,
                explanation: 'Correct. B -> C is a partial dependency of non-prime C on a subset of key AB.'
            },
            {
                id: 'b',
                text: '2NF',
                isCorrect: false,
                explanation: 'B -> C violates 2NF.'
            },
            {
                id: 'c',
                text: '3NF',
                isCorrect: false,
                explanation: '2NF does not even hold.'
            },
            {
                id: 'd',
                text: 'BCNF',
                isCorrect: false,
                explanation: 'The relation is not even in 2NF.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Check each FD: is the LHS a superkey? AB is a superkey.'
            },
            {
                level: 2,
                text: 'C -> D: is C a superkey? C+ = {C, D, E}, missing A and B. C is not a superkey. This violates BCNF.'
            },
            {
                level: 3,
                text: 'C -> D and D -> E both have non-superkey LHS, but the first one encountered in the chain (C -> D) is the one that prevents BCNF.'
            }
        ],
        fullExplanation: `Candidate key: AB.

Check each FD:
- AB -> C: AB is a superkey. OK for BCNF.
- C -> D: C+ = {C, D, E}. C is NOT a superkey. VIOLATES BCNF.
- D -> E: D+ = {D, E}. D is NOT a superkey. Also violates BCNF.

Both C -> D and D -> E violate BCNF. The one that first appears in the dependency chain (and the one whose LHS is not derivable from the key) is C -> D. This is typically cited as the primary BCNF violator.`,
        commonMisconception: 'Picking AB -> C as the violator. AB is the candidate key, so it satisfies BCNF. The problem is with non-key determinants C and D.',
        options: [
            {
                id: 'a',
                text: 'AB -> C',
                isCorrect: false,
                explanation: 'AB is a superkey. This FD satisfies BCNF.'
            },
            {
                id: 'b',
                text: 'C -> D',
                isCorrect: true,
                explanation: 'Correct. C is not a superkey, so this violates BCNF.'
            },
            {
                id: 'c',
                text: 'D -> E',
                isCorrect: false,
                explanation: 'While D -> E also violates BCNF, C -> D is the primary violator that breaks the chain.'
            },
            {
                id: 'd',
                text: 'None; R is in BCNF',
                isCorrect: false,
                explanation: 'Multiple FDs have non-superkey determinants.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'A -> A is a trivial FD (the RHS is a subset of the LHS). Trivial FDs do not affect normal form testing.'
            },
            {
                level: 2,
                text: 'The only non-trivial FD is AB -> C, and AB is a superkey.'
            },
            {
                level: 3,
                text: 'Since the only non-trivial FD has a superkey determinant, R is in BCNF.'
            }
        ],
        fullExplanation: `Candidate key: AB.

FDs:
- A -> A: Trivial (A is a subset of A). Ignored for normal form testing.
- AB -> C: AB is a superkey. OK for BCNF.

The only non-trivial FD has a superkey on the LHS. R is in BCNF.`,
        commonMisconception: 'Thinking A -> A creates a problem. Trivial FDs (where the RHS is a subset of the LHS) are always satisfied and never violate any normal form.',
        options: [
            {
                id: 'a',
                text: '2NF',
                isCorrect: false,
                explanation: 'BCNF is satisfied.'
            },
            {
                id: 'b',
                text: '3NF',
                isCorrect: false,
                explanation: 'BCNF is satisfied.'
            },
            {
                id: 'c',
                text: 'BCNF',
                isCorrect: true,
                explanation: 'Correct. The only non-trivial FD (AB -> C) has a superkey LHS.'
            },
            {
                id: 'd',
                text: '1NF',
                isCorrect: false,
                explanation: 'All higher normal forms are satisfied.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Prime attributes: all of A, B, C, D (every attribute is in some candidate key). There are no non-prime attributes.'
            },
            {
                level: 2,
                text: 'Check BCNF: A is a superkey, B is a superkey, C is a superkey, D is a superkey. All determinants are superkeys.'
            },
            {
                level: 3,
                text: 'All FDs have superkey LHS. R is in BCNF. Since every attribute is prime, 3NF is also trivially satisfied even if it were needed.'
            }
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
            {
                id: 'a',
                text: 'R is in BCNF',
                isCorrect: true,
                explanation: 'All determinants are superkeys.'
            },
            {
                id: 'b',
                text: 'R is in 3NF but not BCNF',
                isCorrect: false,
                explanation: 'BCNF is satisfied, so this is false.'
            },
            {
                id: 'c',
                text: 'Every attribute is prime',
                isCorrect: true,
                explanation: 'All four attributes appear in at least one candidate key.'
            },
            {
                id: 'd',
                text: 'C -> D violates BCNF',
                isCorrect: false,
                explanation: 'C is a superkey, so C -> D satisfies BCNF.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Since the candidate key A is a single attribute, there can be no partial dependency (no proper subset of A exists).'
            },
            {
                level: 2,
                text: 'A is a superkey for all FDs. Check BCNF: all determinants are superkeys.'
            },
            {
                level: 3,
                text: 'R is in BCNF. With a single-attribute key, 2NF is always satisfied, and here BCNF is also met.'
            }
        ],
        fullExplanation: `Candidate key: A (single attribute).

Since the key is a single attribute, no proper subset of the key exists. Therefore no partial dependency is possible. 2NF is automatically satisfied.

For 3NF and BCNF: both A -> B and A -> C have A (a superkey) on the LHS. Both satisfied.

Highest normal form: BCNF.`,
        commonMisconception: 'Thinking that 2NF needs explicit checking even with a single-attribute key. With a single-attribute candidate key, 2NF is trivially satisfied because there is no proper subset to cause a partial dependency.',
        options: [
            {
                id: 'a',
                text: '2NF',
                isCorrect: false,
                explanation: 'BCNF is also satisfied.'
            },
            {
                id: 'b',
                text: '3NF',
                isCorrect: false,
                explanation: 'BCNF is also satisfied.'
            },
            {
                id: 'c',
                text: 'BCNF',
                isCorrect: true,
                explanation: 'Correct. All determinants are superkeys.'
            },
            {
                id: 'd',
                text: '1NF',
                isCorrect: false,
                explanation: 'All higher normal forms are satisfied.'
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questions/decomposition.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================================
// Lossless Decomposition, Dependency Preservation, Minimal Cover
// ============================================================
__turbopack_context__.s([
    "allDecompositionQuestions",
    ()=>allDecompositionQuestions
]);
const allDecompositionQuestions = [
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
            {
                level: 1,
                text: 'For lossless join, check if (R1 intersection R2) determines R1 or R2 under F.'
            },
            {
                level: 2,
                text: 'R1 intersection R2 = {A}. Compute A+ under F: A gives B, then C via B->C, but not D or E directly. Wait, recheck: A -> B -> C, so A+ = {A, B, C}. A+ contains all of R1. So A -> R1.'
            },
            {
                level: 3,
                text: 'Since (R1 intersection R2) = {A} determines R1 (A+ contains A, B, C), the decomposition IS lossless.'
            }
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
            {
                id: 'a',
                text: 'Yes, because A determines R1',
                isCorrect: true,
                explanation: 'Correct. A+ = {A, B, C} which covers all of R1.'
            },
            {
                id: 'b',
                text: 'No, because A does not determine R2',
                isCorrect: false,
                explanation: 'Lossless requires the intersection to determine R1 OR R2, not both.'
            },
            {
                id: 'c',
                text: 'No, because CD -> E is lost',
                isCorrect: false,
                explanation: 'Dependency preservation is a separate property from lossless join.'
            },
            {
                id: 'd',
                text: 'Cannot be determined from the given information',
                isCorrect: false,
                explanation: 'The FD set is sufficient to test lossless join.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Project each FD onto the decomposed relations. If every FD (or an equivalent one) is preserved in at least one relation, it is dependency-preserving.'
            },
            {
                level: 2,
                text: 'A -> B fits in R1 (A, B in R1). B -> C fits in R1. But CD -> E requires C (in R1) and D (in R2) and E (in R2) -- it spans both relations.'
            },
            {
                level: 3,
                text: 'CD -> E cannot be checked in R1 alone (D, E missing) or R2 alone (C missing). The union of projected FDs cannot derive CD -> E. Not dependency-preserving.'
            }
        ],
        fullExplanation: `Project FDs onto decomposed relations:
- R1(A, B, C): A -> B (fits), B -> C (fits). Projected: {A -> B, B -> C}.
- R2(A, D, E): No FD from F fits entirely in {A, D, E}. Projected: {}.

Union of projections: {A -> B, B -> C}.

Can we derive CD -> E from {A -> B, B -> C}? No, because C does not appear on any LHS of the projected FDs, so D and E are unreachable.

The dependency CD -> E is lost. The decomposition is NOT dependency-preserving.`,
        commonMisconception: 'Conflating lossless with dependency-preserving. A decomposition can be lossless but not dependency-preserving. These are independent properties.',
        options: [
            {
                id: 'a',
                text: 'Yes, all FDs are preserved',
                isCorrect: false,
                explanation: 'CD -> E is lost because it spans both R1 and R2.'
            },
            {
                id: 'b',
                text: 'No, CD -> E is not preserved',
                isCorrect: true,
                explanation: 'Correct. CD -> E requires attributes from both relations and cannot be checked in either alone.'
            },
            {
                id: 'c',
                text: 'No, A -> B is not preserved',
                isCorrect: false,
                explanation: 'A -> B is preserved in R1.'
            },
            {
                id: 'd',
                text: 'Yes, because the union of projections covers all attributes',
                isCorrect: false,
                explanation: 'Covering all attributes is not the same as preserving all FDs.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Lossless test: R1 intersection R2 = {B}. Does B determine R1 or R2? B+ = {B, C}. B+ contains R1 = {A, B}? No, A is missing.'
            },
            {
                level: 2,
                text: 'B+ = {B, C}. This does not contain all of R1 (missing A) nor all of R2 (missing D). So the decomposition is NOT lossless.'
            },
            {
                level: 3,
                text: 'Dependency preservation: A -> BCD spans both (A in R1, BCD spans both). B -> C fits in R2. So B -> C is preserved but A -> BCD is lost. Neither property fully holds.'
            }
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
            {
                id: 'a',
                text: 'The decomposition is lossless',
                isCorrect: false,
                explanation: 'B+ = {B, C} does not cover R1 or R2 entirely.'
            },
            {
                id: 'b',
                text: 'The decomposition is dependency-preserving',
                isCorrect: false,
                explanation: 'A -> BCD is lost.'
            },
            {
                id: 'c',
                text: 'B -> C is preserved in R2',
                isCorrect: true,
                explanation: 'Correct. B and C are both in R2.'
            },
            {
                id: 'd',
                text: 'R2 is in BCNF',
                isCorrect: true,
                explanation: 'Correct. In R2(B,C,D) with projected FD B->C, B is a key for R2 (B+ in R2 = {B,C,D}). The only non-trivial FD has a superkey LHS.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Try removing each FD one at a time and check if it can be derived from the remaining ones.'
            },
            {
                level: 2,
                text: 'Remove A -> C: Can we derive A -> C from {A -> B, B -> C}? Yes, by transitivity: A -> B and B -> C gives A -> C.'
            },
            {
                level: 3,
                text: 'A -> C is redundant. The minimal cover includes {A -> B, B -> C}.'
            }
        ],
        fullExplanation: `Test each FD for redundancy:

1. Remove A -> B: Remaining = {B -> C, A -> C}. Can we derive A -> B? A+ with remaining = {A, C}. B is not in A+. Cannot derive. A -> B is NOT redundant.

2. Remove B -> C: Remaining = {A -> B, A -> C}. Can we derive B -> C? B+ with remaining = {B}. Cannot derive. B -> C is NOT redundant.

3. Remove A -> C: Remaining = {A -> B, B -> C}. Can we derive A -> C? A+ with remaining = {A, B, C} (A -> B -> C by transitivity). A -> C follows. A -> C IS redundant.

Minimal cover (after removing redundancy): {A -> B, B -> C}.`,
        commonMisconception: 'Removing A -> B thinking it is redundant because A -> C exists. But A -> B cannot be derived from the other FDs.',
        options: [
            {
                id: 'a',
                text: 'A -> B',
                isCorrect: false,
                explanation: 'Cannot be derived from {B -> C, A -> C}.'
            },
            {
                id: 'b',
                text: 'B -> C',
                isCorrect: false,
                explanation: 'Cannot be derived from {A -> B, A -> C}.'
            },
            {
                id: 'c',
                text: 'A -> C',
                isCorrect: true,
                explanation: 'Correct. A -> C follows by transitivity from A -> B and B -> C.'
            },
            {
                id: 'd',
                text: 'None; all are needed',
                isCorrect: false,
                explanation: 'A -> C is derivable from the others.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'To test if B is extraneous in AB -> D: remove B and check if A -> D follows from the remaining FDs.'
            },
            {
                level: 2,
                text: 'Remove AB -> D. Check A+ with {A -> BC, B -> C, A -> B}: A+ = {A, B, C}. Does A determine D? No, D is not in A+. Now check with AB -> D replaced by A -> D: A+ = {A, B, C, D}. This is stronger.'
            },
            {
                level: 3,
                text: 'Actually, the correct test: with F - {AB -> D} = {A -> BC, B -> C, A -> B}, compute (A)+ = {A, B, C}. D is not in A+. So A -> D does not follow from the remaining FDs. But test B: B+ = {B, C}. D not in B+. So neither A nor B alone can determine D from the remaining FDs. However, with A -> B in the set, AB -> D can be simplified. Since A -> B holds, whenever AB -> D holds, A -> D also holds (because B is already determined by A). So B is extraneous.'
            }
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
            {
                id: 'a',
                text: 'A',
                isCorrect: false,
                explanation: 'Without A, B+ = {B, C}, which does not include D.'
            },
            {
                id: 'b',
                text: 'B',
                isCorrect: true,
                explanation: 'Correct. Since A -> B holds, B is redundant in AB -> D.'
            },
            {
                id: 'c',
                text: 'Both A and B',
                isCorrect: false,
                explanation: 'At least one of them must remain.'
            },
            {
                id: 'd',
                text: 'Neither; no attribute is extraneous',
                isCorrect: false,
                explanation: 'B is extraneous because A -> B already holds.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Intersection = R1 intersection R2 = {B}. Does B determine R1 or R2?'
            },
            {
                level: 2,
                text: 'B+ = {B}. No FD has B alone on the LHS. B+ does not contain R1 = {A, B} or R2 = {B, C}.'
            },
            {
                level: 3,
                text: 'Since B+ = {B}, the intersection does not determine either side. The decomposition is NOT lossless.'
            }
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
            {
                id: 'a',
                text: 'Yes, because B is common to both relations',
                isCorrect: false,
                explanation: 'Having a common attribute is necessary but not sufficient. The intersection must determine one side.'
            },
            {
                id: 'b',
                text: 'No, because B does not determine R1 or R2',
                isCorrect: true,
                explanation: 'Correct. B+ = {B} which does not cover either relation.'
            },
            {
                id: 'c',
                text: 'Yes, because the union of R1 and R2 equals R',
                isCorrect: false,
                explanation: 'The union being equal to R is necessary but not sufficient for lossless join.'
            },
            {
                id: 'd',
                text: 'Cannot determine without knowing the instances',
                isCorrect: false,
                explanation: 'Lossless join is tested using the FD set, not instances.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'The first step of finding a minimal cover is to split all RHS that have multiple attributes.'
            },
            {
                level: 2,
                text: 'AB -> CDE should be split into AB -> C, AB -> D, and AB -> E.'
            },
            {
                level: 3,
                text: 'After splitting, check for extraneous LHS attributes and redundant FDs. Splitting the RHS is always the first step.'
            }
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
            {
                id: 'a',
                text: 'Split AB -> CDE into AB -> C, AB -> D, AB -> E',
                isCorrect: true,
                explanation: 'Correct. Splitting multi-attribute RHS is the first step.'
            },
            {
                id: 'b',
                text: 'Remove AB -> CDE entirely',
                isCorrect: false,
                explanation: 'You split first, then check for redundancy of individual split FDs.'
            },
            {
                id: 'c',
                text: 'Split C -> D into C -> D (no change needed)',
                isCorrect: false,
                explanation: 'C -> D already has a single attribute on RHS; no splitting needed.'
            },
            {
                id: 'd',
                text: 'Merge AB -> CDE with C -> D',
                isCorrect: false,
                explanation: 'Merging FDs is not a step in the minimal cover algorithm.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Project each FD: A -> B uses attributes in R1 only. B -> C uses attributes in R2 only.'
            },
            {
                level: 2,
                text: 'A -> B is preserved in R1. B -> C is preserved in R2. Both original FDs are preserved.'
            },
            {
                level: 3,
                text: 'Since every original FD is preserved in at least one decomposed relation, the decomposition is dependency-preserving.'
            }
        ],
        fullExplanation: `Project FDs:
- A -> B: A and B are both in R1(A, B). Preserved in R1.
- B -> C: B and C are both in R2(B, C). Preserved in R2.

All original FDs are preserved. The decomposition IS dependency-preserving.

Bonus: Is it lossless? Intersection = {B}. B+ = {B, C} (via B -> C). B+ contains all of R2. So it is also lossless.`,
        commonMisconception: 'Thinking that A -> C must be explicitly preserved. A -> C is not in the original FD set; it is only derivable. Only the original FDs need to be preserved.',
        options: [
            {
                id: 'a',
                text: 'Yes, both FDs are preserved',
                isCorrect: true,
                explanation: 'Correct. Each FD fits entirely within one decomposed relation.'
            },
            {
                id: 'b',
                text: 'No, A -> C is lost',
                isCorrect: false,
                explanation: 'A -> C is not an original FD; it is derivable and does not need explicit preservation.'
            },
            {
                id: 'c',
                text: 'No, the FDs span both relations',
                isCorrect: false,
                explanation: 'A -> B fits in R1 and B -> C fits in R2.'
            },
            {
                id: 'd',
                text: 'Cannot be determined',
                isCorrect: false,
                explanation: 'The projection is straightforward.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Step 1: Split RHS. A -> BC becomes A -> B and A -> C. Now F = {A -> B, A -> C, A -> B (dup), B -> C, A -> D}.'
            },
            {
                level: 2,
                text: 'Step 2: Remove duplicates. Remove extra A -> B. Now {A -> B, A -> C, B -> C, A -> D}. Step 3: Remove redundant FDs. A -> C follows from A -> B and B -> C. Remove A -> C. Now {A -> B, B -> C, A -> D}.'
            },
            {
                level: 3,
                text: 'Check remaining: 3 FDs. Can any be removed? A -> B: needed (B -> C and A -> D cannot derive it). B -> C: needed. A -> D: needed. Minimal cover has 3 FDs.'
            }
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
        expectedFormat: 'integer'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questions/disk.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================================
// Disk Storage: Capacity, Addressing, Latency, Access Time
// ============================================================
__turbopack_context__.s([
    "allDiskQuestions",
    ()=>allDiskQuestions
]);
const allDiskQuestions = [
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
            {
                level: 1,
                text: 'Capacity = platters x surfaces/platter x tracks/surface x sectors/track x bytes/sector.'
            },
            {
                level: 2,
                text: 'Capacity = 6 x 2 x 2048 x 1024 x 512 = 12 x 2^11 x 2^10 x 2^9 bytes.'
            },
            {
                level: 3,
                text: '12 x 2^(11+10+9) = 12 x 2^30 = 12 x 1,073,741,824. In GB: 12 GB.'
            }
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
        expectedFormat: 'integer'
    },
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
            {
                level: 1,
                text: 'Count total addressable sectors: platters x surfaces/platter x tracks/surface x sectors/track.'
            },
            {
                level: 2,
                text: 'Total sectors = 6 x 2 x 2048 x 1024 = 3 x 2^23 = 25,165,824. Find ceil(log2 of this number).'
            },
            {
                level: 3,
                text: '3 x 2^23 = 1.5 x 2^24. This is between 2^24 and 2^25. So we need 25 bits.'
            }
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
        expectedFormat: 'integer'
    },
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
            {
                level: 1,
                text: 'First convert RPM to ms per revolution: 60000 / RPM.'
            },
            {
                level: 2,
                text: 'Time per revolution = 60000 / 7200 = 8.333 ms. Average latency = half of that.'
            },
            {
                level: 3,
                text: 'Average rotational latency = 8.333 / 2 = 4.167 ms.'
            }
        ],
        fullExplanation: `Step 1: Time per revolution = 60,000 / RPM = 60,000 / 7200 = 8.333 ms
Step 2: Average rotational latency = half a revolution = 8.333 / 2 = 4.167 ms

The average latency assumes the desired sector is equally likely to be anywhere on the track, so on average the disk must rotate half a revolution.`,
        commonMisconception: 'Using a full revolution instead of half. Average rotational latency is HALF the time per revolution, not the full time.',
        correctAnswer: 4.17,
        tolerance: 0.01,
        unit: 'ms',
        expectedFormat: '2 decimal places'
    },
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
            {
                level: 1,
                text: 'Access time = seek time + average rotational latency + transfer time. Compute each component.'
            },
            {
                level: 2,
                text: 'Seek = 8 ms. Rotational latency = (60000/7200)/2 = 4.167 ms. Transfer time = block size / data rate = 4/512 seconds.'
            },
            {
                level: 3,
                text: 'Transfer = 4/512 s = 1/128 s = 7.8125 ms. Total = 8 + 4.167 + 7.813 = 19.98, rounds to 20.0 ms.'
            }
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
        expectedFormat: '1 decimal place'
    },
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
            {
                level: 1,
                text: 'Capacity = platters x surfaces x tracks x sectors/track x bytes/sector. Solve for sectors/track.'
            },
            {
                level: 2,
                text: '8 GB = 8 x 2^30 bytes. Capacity = 4 x 2 x 1000 x S x 512. So 8 x 2^30 = 4 x 2 x 1000 x S x 512.'
            },
            {
                level: 3,
                text: '8 x 2^30 = 8 x 2^30 = 8000 x S x 2^9. So S = (8 x 2^30) / (8000 x 2^9) = (8 x 2^21) / 8000 = 16777216 / 8000 = 2097.152. Round to 2097 or 2098 depending on context. But 8GB/ (4*2*1000*512) = 8589934592/4096000 = 2097.15. Nearest integer: 2097.'
            }
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
        expectedFormat: 'integer'
    },
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
            {
                level: 1,
                text: 'A cylinder is the set of tracks at the same radius across all surfaces.'
            },
            {
                level: 2,
                text: 'The number of cylinders equals the number of tracks per surface.'
            },
            {
                level: 3,
                text: 'Number of cylinders = 500.'
            }
        ],
        fullExplanation: `A cylinder consists of all tracks at the same track number across all recording surfaces.

Number of cylinders = number of tracks per surface = 500.

The number of platters and surfaces does not affect the cylinder count; it only affects how many tracks are in each cylinder (4 platters x 2 surfaces = 8 tracks per cylinder).`,
        commonMisconception: 'Multiplying by the number of surfaces or platters. Cylinders correspond to track positions, not surface count.',
        correctAnswer: 500,
        unit: 'cylinders',
        expectedFormat: 'integer'
    },
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
            {
                level: 1,
                text: 'Transfer time = block size / data rate.'
            },
            {
                level: 2,
                text: 'Transfer time = 8 KB / 256 KB/s = 8/256 seconds = 1/32 seconds.'
            },
            {
                level: 3,
                text: '1/32 s = 1000/32 ms = 31.25 ms.'
            }
        ],
        fullExplanation: `Transfer time = block size / data rate
= 8 KB / 256 KB/s
= 1/32 seconds
= 1000/32 ms
= 31.25 ms`,
        commonMisconception: 'Forgetting to convert seconds to milliseconds. Always check the requested unit and convert if needed.',
        correctAnswer: 31.25,
        unit: 'ms',
        expectedFormat: '2 decimal places'
    },
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
            {
                level: 1,
                text: 'Capacity = 2 x 2 x 500 x 100 x 1024 bytes.'
            },
            {
                level: 2,
                text: '= 4 x 500 x 100 x 1024 = 200,000 x 1024 = 204,800,000 bytes.'
            },
            {
                level: 3,
                text: '204,800,000 / (2^20) = 204,800,000 / 1,048,576 = 195.3125 MB.'
            }
        ],
        fullExplanation: `Capacity = platters x surfaces x tracks x sectors x bytes
= 2 x 2 x 500 x 100 x 1024
= 4 x 500 x 100 x 1024
= 204,800,000 bytes

In MB: 204,800,000 / 1,048,576 = 195.3125 MB`,
        commonMisconception: 'Using 10^6 for MB instead of 2^20. The study guide specifies binary conversion.',
        correctAnswer: 195.3125,
        unit: 'MB',
        expectedFormat: 'up to 4 decimal places'
    },
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
            {
                level: 1,
                text: 'Access time = seek time + average rotational latency. Compute rotational latency first.'
            },
            {
                level: 2,
                text: 'Time per revolution = 60000/10000 = 6 ms. Average = 3 ms.'
            },
            {
                level: 3,
                text: 'Access time = 5 + 3 = 8 ms.'
            }
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
        expectedFormat: 'integer'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questions/lru.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================================
// LRU Buffer Management: Simulation and Hit/Miss Counting
// ============================================================
__turbopack_context__.s([
    "allLruQuestions",
    ()=>allLruQuestions
]);
const allLruQuestions = [
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
            {
                level: 1,
                text: 'Simulate step by step. On a miss with a full buffer, evict the LRU (leftmost in the LRU-to-MRU order).'
            },
            {
                level: 2,
                text: 'Trace: 2(M), 1(M), 4(M), 2(H), 5(M,evict2), 1(H), 2(M,evict4), 4(M,evict1), 5(H), 1(M,evict2). Count the misses.'
            },
            {
                level: 3,
                text: 'Misses at positions: 2, 1, 4, 5, 2, 4, 1 = 8 misses.'
            }
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
        expectedFormat: 'integer'
    },
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
            {
                level: 1,
                text: 'Build the full LRU table first. A hit occurs when the requested block is already in the buffer.'
            },
            {
                level: 2,
                text: 'Hits occur when the block is found: request 2 (4th position, 2 is in buffer), request 5 (9th position). That is 2 hits.'
            },
            {
                level: 3,
                text: 'Total requests = 10. Misses = 8. Hits = 10 - 8 = 2.'
            }
        ],
        fullExplanation: `From the simulation (same as previous question):
- Request 2 (4th): 2 is in buffer. HIT.
- Request 5 (9th): 5 is in buffer. HIT.

All other requests are misses.
Total hits = 2.`,
        commonMisconception: 'Thinking that a request that was recently evicted counts as a hit. A hit only occurs if the block is currently in the buffer.',
        correctAnswer: 2,
        unit: 'hits',
        expectedFormat: 'integer'
    },
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
            {
                level: 1,
                text: 'You can compute misses - hits directly without finding each separately if you know the pattern.'
            },
            {
                level: 2,
                text: 'Misses = 8, Hits = 2. The difference is 8 - 2 = 6.'
            },
            {
                level: 3,
                text: 'Alternatively: misses - hits = (total - 2*hits) = 10 - 4 = 6.'
            }
        ],
        fullExplanation: `From the full simulation:
Misses = 8
Hits = 2
Misses - Hits = 8 - 2 = 6`,
        commonMisconception: 'Computing hits - misses instead of misses - hits. The order matters for the sign of the answer.',
        correctAnswer: 6,
        unit: '',
        expectedFormat: 'integer'
    },
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
            {
                level: 1,
                text: 'With only 2 frames, the buffer fills quickly. Simulate step by step.'
            },
            {
                level: 2,
                text: '1(M), 2(M), 3(M,evict1), 1(M,evict2), 2(M,evict3), 3(M,evict1), 4(M,evict2). Every request is a miss!'
            },
            {
                level: 3,
                text: 'All 7 requests are misses. This is a classic thrashing pattern with too few frames.'
            }
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
        expectedFormat: 'integer'
    },
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
            {
                level: 1,
                text: 'Build the buffer state after each request and check if the requested block is already present.'
            },
            {
                level: 2,
                text: 'After filling [3,1,4], request 1 hits. After that, 5 evicts 3, then 3 evicts 4, then 4 evicts 1, etc. No more hits.'
            },
            {
                level: 3,
                text: 'Only position 4 is a hit. Every other request either fills the buffer or evicts a block that is needed again later.'
            }
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
            {
                id: 'a',
                text: 'Positions 4 and 8',
                isCorrect: false,
                explanation: 'Position 8 is a miss (1 was evicted at position 7).'
            },
            {
                id: 'b',
                text: 'Position 4 only',
                isCorrect: true,
                explanation: 'Correct. Only the 4th request (value 1) finds the block already in buffer.'
            },
            {
                id: 'c',
                text: 'Positions 4, 8, and 9',
                isCorrect: false,
                explanation: 'Positions 8 and 9 are misses.'
            },
            {
                id: 'd',
                text: 'No hits',
                isCorrect: false,
                explanation: 'Position 4 is a hit.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'With 4 frames and only 5 distinct values, most requests should be hits after the buffer fills.'
            },
            {
                level: 2,
                text: '1(M), 2(M), 3(M), 4(M), 1(H), 2(H), 5(M). Total: 5 misses, 2 hits.'
            },
            {
                level: 3,
                text: 'The buffer fills after 4 requests. Then 1 and 2 are still in buffer. Only 5 causes a miss.'
            }
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
        expectedFormat: 'integer'
    },
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
            {
                level: 1,
                text: 'On a miss, LRU evicts the least recently used block.'
            },
            {
                level: 2,
                text: 'The LRU block is the leftmost one: 5.'
            },
            {
                level: 3,
                text: '5 is evicted. New buffer: [3, 8, 2].'
            }
        ],
        fullExplanation: `The buffer state [5, 3, 8] is ordered from LRU (left) to MRU (right).

Request 2 is a miss (not in buffer). The LRU block is 5 (leftmost).
Evict 5, add 2 as MRU.
New buffer: [3, 8, 2]`,
        commonMisconception: 'Evicting 8 (the MRU) instead of 5 (the LRU). LRU always evicts the LEAST recently used, which is the leftmost in the LRU-to-MRU order.',
        options: [
            {
                id: 'a',
                text: '5',
                isCorrect: true,
                explanation: 'Correct. 5 is the LRU (least recently used) block.'
            },
            {
                id: 'b',
                text: '3',
                isCorrect: false,
                explanation: '3 is the middle block, not the LRU.'
            },
            {
                id: 'c',
                text: '8',
                isCorrect: false,
                explanation: '8 is the MRU (most recently used), not the LRU.'
            },
            {
                id: 'd',
                text: '2',
                isCorrect: false,
                explanation: '2 is the incoming block, not an existing one.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'With 3 frames and only 3 distinct blocks, after the buffer fills, every block stays cached.'
            },
            {
                level: 2,
                text: 'First 3 requests are misses. After that, 1, 2, 3 cycle and each is already in the buffer.'
            },
            {
                level: 3,
                text: '3 misses + 6 hits = 9 total. Hit rate = 6/9 = 66.67%, rounded to 67%.'
            }
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
        expectedFormat: 'integer'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questions/bst.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================================
// BST: Construction, Height, Search Paths, Insertion Order, Leaves
// ============================================================
__turbopack_context__.s([
    "allBstQuestions",
    ()=>allBstQuestions
]);
const allBstQuestions = [
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
            {
                level: 1,
                text: 'Build the BST by inserting one value at a time. Go left for smaller, right for larger.'
            },
            {
                level: 2,
                text: '40 at level 0. 20 and 60 at level 1. 10, 30, 50, 70 at level 2. 25 and 35 go under 30 at level 3.'
            },
            {
                level: 3,
                text: 'The deepest nodes (25, 35) are at level 3. Height in edges = 3.'
            }
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
        expectedFormat: 'integer'
    },
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
            {
                level: 1,
                text: 'Build the tree and identify which nodes have no children (leaf nodes).'
            },
            {
                level: 2,
                text: 'Leaves are nodes with no left or right child: 10, 25, 35, 50, 70.'
            },
            {
                level: 3,
                text: 'Sum = 10 + 25 + 35 + 50 + 70 = 190.'
            }
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
        expectedFormat: 'integer'
    },
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
            {
                level: 1,
                text: 'Start at root 40. Is 25 less than or greater than 40?'
            },
            {
                level: 2,
                text: '25 < 40, so go left to 20. 25 > 20, so go right to 30. 25 < 30, so go left. 25 is placed there.'
            },
            {
                level: 3,
                text: '25 is in the left subtree of 40 (via 20 -> 30 -> left).'
            }
        ],
        fullExplanation: `Starting at root 40:
- 25 < 40: go to left child 20
- 25 > 20: go to right child 30
- 25 < 30: go to left child 25

25 is in the left subtree of the root 40.
More specifically, 25 is in the right subtree of 20.`,
        commonMisconception: 'Saying 25 is in the right subtree of 20 but thinking it is also in the right subtree of 40. The overall position from root is LEFT.',
        options: [
            {
                id: 'a',
                text: 'Left subtree of 40',
                isCorrect: true,
                explanation: 'Correct. 25 < 40, so it is in the left subtree.'
            },
            {
                id: 'b',
                text: 'Right subtree of 40',
                isCorrect: false,
                explanation: '25 < 40, so it goes left, not right.'
            },
            {
                id: 'c',
                text: 'Left subtree of 20',
                isCorrect: false,
                explanation: '25 > 20, so it goes right of 20.'
            },
            {
                id: 'd',
                text: 'Right subtree of 30',
                isCorrect: false,
                explanation: '25 < 30, so it goes left of 30.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Trace from root to 50, counting each edge.'
            },
            {
                level: 2,
                text: '40 (level 0) -> right to 60 (level 1) -> left to 50 (level 2).'
            },
            {
                level: 3,
                text: '50 is at level 2.'
            }
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
            {
                id: 'a',
                text: 'Level 0',
                isCorrect: false,
                explanation: 'Level 0 is the root (40) only.'
            },
            {
                id: 'b',
                text: 'Level 1',
                isCorrect: false,
                explanation: 'Level 1 contains 20 and 60.'
            },
            {
                id: 'c',
                text: 'Level 2',
                isCorrect: true,
                explanation: 'Correct. 50 is the left child of 60.'
            },
            {
                id: 'd',
                text: 'Level 3',
                isCorrect: false,
                explanation: 'Level 3 contains 25 and 35.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Maximum height occurs in a skewed (completely unbalanced) tree. Minimum height occurs in a perfectly balanced tree.'
            },
            {
                level: 2,
                text: 'Max height = 7 - 1 = 6 edges (a chain). Min height = ceil(log2(7+1)) - 1 = ceil(3) - 1 = 3 - 1 = 2 edges.'
            },
            {
                level: 3,
                text: 'Difference = 6 - 2 = 4.'
            }
        ],
        fullExplanation: `For n = 7 nodes:

Maximum height (skewed tree): n - 1 = 7 - 1 = 6 edges. This happens when nodes are inserted in sorted order, forming a single chain.

Minimum height (balanced tree): ceil(log2(n + 1)) - 1 = ceil(log2(8)) - 1 = ceil(3) - 1 = 2 edges. This happens with a complete binary tree.

Difference = 6 - 2 = 4.`,
        commonMisconception: 'Using floor instead of ceil for minimum height, or forgetting to subtract 1. The formula for minimum edge-height is ceil(log2(n+1)) - 1.',
        correctAnswer: 4,
        unit: 'edges',
        expectedFormat: 'integer'
    },
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
            {
                level: 1,
                text: 'The key insight is that the root must be 5, and the relative ordering within each subtree must be preserved.'
            },
            {
                level: 2,
                text: 'The root is determined by the first element inserted. Any sequence that inserts 5 first, then 3 before 2 and 4 (but in any order relative to right subtree), and 7 before 6 and 8, can produce the same tree.'
            },
            {
                level: 3,
                text: 'Check each option: the root must be 5, and the left and right subtrees must get their elements in orders that produce the same substructures.'
            }
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
            {
                id: 'a',
                text: '5, 3, 2, 4, 7, 6, 8',
                isCorrect: true,
                explanation: 'Root 5 first. Left: 3 before 2,4. Right: 7 before 6,8. Same tree.'
            },
            {
                id: 'b',
                text: '3, 5, 7, 2, 4, 6, 8',
                isCorrect: false,
                explanation: 'Root becomes 3 (not 5). Different tree.'
            },
            {
                id: 'c',
                text: '5, 7, 3, 6, 2, 8, 4',
                isCorrect: true,
                explanation: 'Root 5 first. Left and right subtrees get correct relative ordering. Same tree.'
            },
            {
                id: 'd',
                text: '5, 3, 7, 4, 2, 6, 8',
                isCorrect: true,
                explanation: 'Root 5 first. 4 before 2 is fine (4 goes right of 3, 2 goes left of 3). Same tree.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Track the allowed range (lower bound, upper bound) after each probe. The target must stay within range.'
            },
            {
                level: 2,
                text: 'If current node > target, target is in the left subtree (new upper bound = current node). If current node < target, target is in the right subtree (new lower bound = current node).'
            },
            {
                level: 3,
                text: 'Check each option by verifying that 42 stays within the valid range at every step.'
            }
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
            {
                id: 'a',
                text: '60, 35, 50, 41, 42',
                isCorrect: true,
                explanation: 'Valid. Bounds stay consistent at every step.'
            },
            {
                id: 'b',
                text: '30, 50, 45, 40, 42',
                isCorrect: true,
                explanation: 'Valid. 42 remains within bounds.'
            },
            {
                id: 'c',
                text: '70, 30, 55, 38, 44, 42',
                isCorrect: true,
                explanation: 'Valid. The bounds are maintained throughout.'
            },
            {
                id: 'd',
                text: '20, 60, 35, 50, 42',
                isCorrect: true,
                explanation: 'Valid. Bounds are consistent.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Build the BST and identify nodes with no children.'
            },
            {
                level: 2,
                text: '10 is root. Left: 5 -> 3, 7. Right: 15 -> 12, 20. Leaves: 3, 7, 12, 20.'
            },
            {
                level: 3,
                text: '4 leaf nodes.'
            }
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
        expectedFormat: 'integer'
    },
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
            {
                level: 1,
                text: 'A binary tree of height h has levels 0 through h. The maximum nodes at level i is 2^i.'
            },
            {
                level: 2,
                text: 'Total max nodes = 2^0 + 2^1 + 2^2 + 2^3 = 1 + 2 + 4 + 8 = 15. Or use formula: 2^(h+1) - 1 = 2^4 - 1 = 15.'
            },
            {
                level: 3,
                text: 'Maximum nodes = 15.'
            }
        ],
        fullExplanation: `For a binary tree of height h (in edges), levels range from 0 to h.

Maximum nodes = sum from i=0 to h of 2^i = 2^(h+1) - 1

For h = 3: 2^4 - 1 = 16 - 1 = 15.

This is a complete binary tree with all levels fully filled.`,
        commonMisconception: 'Using h instead of h+1 in the formula, giving 2^3 - 1 = 7. A height-3 tree has 4 levels (0,1,2,3), not 3.',
        correctAnswer: 15,
        unit: 'nodes',
        expectedFormat: 'integer'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questions/sql.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================================
// SQL Query Interpretation & psycopg2 API
// ============================================================
__turbopack_context__.s([
    "allSqlQuestions",
    ()=>allSqlQuestions
]);
const allSqlQuestions = [
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
            {
                level: 1,
                text: 'Recall the psycopg2 workflow: connect, cursor, execute, fetch, commit, close.'
            },
            {
                level: 2,
                text: 'Check each statement against the known API. Remember that commit persists data changes, and fetchall retrieves rows.'
            },
            {
                level: 3,
                text: 'cursor.executemany runs one parameterized statement for many parameter sets. cursor.fetchall retrieves all rows. Values go to %s placeholders. conn.commit persists INSERT/UPDATE/DELETE.'
            }
        ],
        fullExplanation: `A. cursor.executemany() can execute one parameterized statement for many parameter tuples. TRUE. This is exactly what executemany does.

B. cursor.fetchall() commits pending updates. FALSE. fetchall() retrieves all remaining rows from a query result. It does not commit anything.

C. With psycopg2, values should normally be supplied separately to %s placeholders. TRUE. This is the safe, SQL-injection-proof way.

D. conn.commit() is generally needed to persist a successful INSERT. TRUE. Without commit, changes may be rolled back.`,
        commonMisconception: 'Thinking fetchall() commits data. fetchall() only reads query results; commit() is a separate operation on the connection.',
        options: [
            {
                id: 'a',
                text: 'cursor.executemany() executes one parameterized statement for many parameter tuples',
                isCorrect: true,
                explanation: 'Correct. executemany takes a SQL template and a list of parameter tuples.'
            },
            {
                id: 'b',
                text: 'cursor.fetchall() commits pending updates',
                isCorrect: false,
                explanation: 'fetchall() retrieves rows, it does not commit.'
            },
            {
                id: 'c',
                text: 'Values should be supplied separately to %s placeholders',
                isCorrect: true,
                explanation: 'Correct. This prevents SQL injection.'
            },
            {
                id: 'd',
                text: 'conn.commit() is needed to persist INSERT',
                isCorrect: true,
                explanation: 'Correct. Without commit, the transaction is not finalized.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'List the distinct marks in descending order: 90, 85, 80.'
            },
            {
                level: 2,
                text: 'The distinct marks are 90, 85, 80. The second highest is 85.'
            },
            {
                level: 3,
                text: 'The answer is 85.'
            }
        ],
        fullExplanation: `Distinct marks from the table: 90, 85, 80.

Sorted descending: 90, 85, 80.

The second highest distinct mark is 85.

Note that 90 appears twice (Alice and Carol), but since we want distinct marks, 90 counts as one value. The second position is 85 (Bob).`,
        commonMisconception: 'Not using DISTINCT and counting Bob as third highest instead of second. The question says second highest distinct mark.',
        options: [
            {
                id: 'a',
                text: '90',
                isCorrect: false,
                explanation: '90 is the highest, not the second highest.'
            },
            {
                id: 'b',
                text: '85',
                isCorrect: true,
                explanation: 'Correct. 85 is the second highest distinct mark.'
            },
            {
                id: 'c',
                text: '80',
                isCorrect: false,
                explanation: '80 is the third highest.'
            },
            {
                id: 'd',
                text: 'NULL (no result)',
                isCorrect: false,
                explanation: 'There are at least 2 distinct marks.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'psycopg2 uses %s as a placeholder, even for numeric values.'
            },
            {
                level: 2,
                text: 'The correct pattern is: cursor.execute("SELECT * FROM students WHERE age > %s", (age_value,))'
            },
            {
                level: 3,
                text: 'The key is that values are passed as a separate tuple, not via string formatting.'
            }
        ],
        fullExplanation: `The correct psycopg2 pattern is:

cursor.execute("SELECT * FROM students WHERE age > %s", (age_value,))

Key points:
- %s is the placeholder for ALL data types (not %d for integers).
- The second argument is a TUPLE. Note the trailing comma in (age_value,).
- Never use Python string formatting (f-strings or .format()) for SQL values, as this causes SQL injection vulnerabilities.`,
        commonMisconception: 'Using %d for integers or using f-strings to embed values directly in the query string. Always use %s with a separate parameter tuple.',
        options: [
            {
                id: 'a',
                text: 'cursor.execute(f"SELECT * FROM students WHERE age > {age}")',
                isCorrect: false,
                explanation: 'f-strings are vulnerable to SQL injection and should not be used for values.'
            },
            {
                id: 'b',
                text: 'cursor.execute("SELECT * FROM students WHERE age > %s", (age,))',
                isCorrect: true,
                explanation: 'Correct. %s placeholder with a separate parameter tuple.'
            },
            {
                id: 'c',
                text: 'cursor.execute("SELECT * FROM students WHERE age > %d", (age,))',
                isCorrect: false,
                explanation: 'psycopg2 uses %s for all types, not %d.'
            },
            {
                id: 'd',
                text: 'cursor.execute("SELECT * FROM students WHERE age > ?", (age,))',
                isCorrect: false,
                explanation: '? is used by SQLite, not psycopg2. Use %s.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'fetchmany(n) retrieves up to n rows from the remaining result set.'
            },
            {
                level: 2,
                text: 'After two calls, 3 + 5 = 8 rows have been fetched. Remaining = 10 - 8 = 2 rows.'
            },
            {
                level: 3,
                text: 'The third call requests 3 but only 2 remain. It returns 2.'
            }
        ],
        fullExplanation: `The result set has 10 rows total.

Call 1: fetchmany(3) returns 3 rows. Remaining: 7.
Call 2: fetchmany(5) returns 5 rows. Remaining: 2.
Call 3: fetchmany(3) requests 3 but only 2 rows remain. Returns 2 rows.

fetchmany returns at most n rows; it returns fewer when the result set is exhausted.`,
        commonMisconception: 'Thinking fetchmany(3) will always return exactly 3 rows. When fewer rows remain, it returns only what is left.',
        correctAnswer: 2,
        unit: 'rows',
        expectedFormat: 'integer'
    },
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
            {
                level: 1,
                text: 'COUNT(DISTINCT customer_id) counts unique customer IDs.'
            },
            {
                level: 2,
                text: 'Customer A (1 unique), Customer B (1 unique), plus 12 other unique customers. Total unique = 1 + 1 + 12 = 14.'
            },
            {
                level: 3,
                text: 'The query returns 14.'
            }
        ],
        fullExplanation: `Breakdown of orders by customer:
- Customer A: 5 orders (1 distinct customer)
- Customer B: 3 orders (1 distinct customer)
- Other customers: 12 orders, each from a different customer (12 distinct customers)

Total distinct customers = 1 + 1 + 12 = 14.

SELECT COUNT(DISTINCT customer_id) returns 14.`,
        commonMisconception: 'Answering 20 (total rows) or 3 (number of customer groups). COUNT(DISTINCT column) counts unique values, not total rows or groups.',
        options: [
            {
                id: 'a',
                text: '3',
                isCorrect: false,
                explanation: '3 is the number of customer groups, not the number of distinct customers.'
            },
            {
                id: 'b',
                text: '14',
                isCorrect: true,
                explanation: 'Correct. There are 14 distinct customer IDs.'
            },
            {
                id: 'c',
                text: '20',
                isCorrect: false,
                explanation: '20 is the total number of orders, not distinct customers.'
            },
            {
                id: 'd',
                text: '8',
                isCorrect: false,
                explanation: 'This does not correspond to any correct calculation.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'First compute the subquery: AVG(x) over all 7 rows.'
            },
            {
                level: 2,
                text: 'Sum = 5 + 3 + 8 + 3 + 1 + 8 + 5 = 33. AVG = 33/7 = 4.714 (approximately).'
            },
            {
                level: 3,
                text: 'Values greater than 4.714: 5, 8, 3(no), 3(no), 1(no), 8, 5. Result: 5, 8, 8, 5 = 4 rows.'
            }
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
            {
                id: 'a',
                text: '2',
                isCorrect: false,
                explanation: 'This would be the count of distinct values above average (5 and 8), not total rows.'
            },
            {
                id: 'b',
                text: '3',
                isCorrect: false,
                explanation: 'Undercounting.'
            },
            {
                id: 'c',
                text: '4',
                isCorrect: true,
                explanation: 'Correct. The rows 5, 8, 8, 5 all have values above 4.714.'
            },
            {
                id: 'd',
                text: '5',
                isCorrect: false,
                explanation: '3 and 1 are below the average.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Consider both correctness and efficiency. Running 100 separate execute calls works but is not ideal.'
            },
            {
                level: 2,
                text: 'executemany() runs a single parameterized statement with a list of parameter tuples. It is designed exactly for bulk inserts.'
            },
            {
                level: 3,
                text: 'executemany with a list of 100 tuples is the most appropriate approach.'
            }
        ],
        fullExplanation: `The most appropriate approach is cursor.executemany() with a list of 100 parameter tuples.

Example:
cursor.executemany("INSERT INTO table (col1, col2) VALUES (%s, %s)", list_of_100_tuples)

This is more efficient than 100 separate execute() calls because it reduces round-trips to the database server.

Note: After executemany, you still need conn.commit() to persist the changes.`,
        commonMisconception: 'Thinking you need 100 separate cursor.execute() calls. While this works, executemany is the proper API for bulk operations.',
        options: [
            {
                id: 'a',
                text: 'A single execute() call with all values concatenated',
                isCorrect: false,
                explanation: 'SQL does not support bulk value concatenation. Each row needs its own VALUES clause.'
            },
            {
                id: 'b',
                text: '100 separate execute() calls in a loop',
                isCorrect: false,
                explanation: 'This works but is inefficient. executemany is the proper tool.'
            },
            {
                id: 'c',
                text: 'One executemany() call with a list of 100 tuples',
                isCorrect: true,
                explanation: 'Correct. executemany is designed for bulk parameterized operations.'
            },
            {
                id: 'd',
                text: 'One execute() call with 100 %s placeholders',
                isCorrect: false,
                explanation: 'While possible, this is error-prone. executemany is the cleaner approach.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Compute SUM(qty) for each product group.'
            },
            {
                level: 2,
                text: 'A: 10+15=25. B: 5+25=30. C: 20+5=25. Filter SUM > 25: only B (30 > 25).'
            },
            {
                level: 3,
                text: 'Only 1 row (product B) satisfies the HAVING condition.'
            }
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
        expectedFormat: 'integer'
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questions/er.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================================
// ER Theory, File Organization, Data Dictionary
// ============================================================
__turbopack_context__.s([
    "allErQuestions",
    ()=>allErQuestions
]);
const allErQuestions = [
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
            {
                level: 1,
                text: 'Both sides have exactly one. Think about cardinality and participation.'
            },
            {
                level: 2,
                text: 'Cardinality is 1:1. Each Department participates in exactly one HoD relationship (total participation). Each Head also participates in exactly one (total participation).'
            },
            {
                level: 3,
                text: 'The relationship is 1:1 with total participation on both sides.'
            }
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
            {
                id: 'a',
                text: 'The cardinality ratio is 1:1',
                isCorrect: true,
                explanation: 'Correct. One department to one head.'
            },
            {
                id: 'b',
                text: 'Department has total participation',
                isCorrect: true,
                explanation: 'Correct. Every department must have exactly one HoD.'
            },
            {
                id: 'c',
                text: 'Head has partial participation',
                isCorrect: false,
                explanation: 'Every head must head a department, so participation is total, not partial.'
            },
            {
                id: 'd',
                text: 'The cardinality ratio is 1:N',
                isCorrect: false,
                explanation: 'It is 1:1, not 1:N.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Think about which organization stores related records from different tables close together on disk.'
            },
            {
                level: 2,
                text: 'Multi-table clustering stores records from multiple tables together based on a common clustering key, reducing disk I/O for joins.'
            },
            {
                level: 3,
                text: 'Multi-table (or mixed) clustering is designed exactly for this scenario.'
            }
        ],
        fullExplanation: `Multi-table clustering (also called mixed clustering) stores records from two or more tables together on the same disk block, ordered by a common clustering key.

Advantages for this scenario:
- Join operations are much faster because related records are on the same block.
- Reduces the number of disk I/O operations needed.

Sequential clustering stores records of a single table in order, which is good for range scans but does not help with cross-table access.

Hashing is fast for point lookups but does not cluster related records together.`,
        commonMisconception: 'Choosing sequential clustering. Sequential clustering only orders records within a single table. Multi-table clustering is needed for cross-table access optimization.',
        options: [
            {
                id: 'a',
                text: 'Sequential clustering',
                isCorrect: false,
                explanation: 'Only orders records within one table.'
            },
            {
                id: 'b',
                text: 'Multi-table clustering',
                isCorrect: true,
                explanation: 'Correct. Stores related records from multiple tables together.'
            },
            {
                id: 'c',
                text: 'Heap file organization',
                isCorrect: false,
                explanation: 'No particular ordering; does not optimize for joins.'
            },
            {
                id: 'd',
                text: 'Hash organization',
                isCorrect: false,
                explanation: 'Good for point lookups but does not cluster related records from different tables.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'A data dictionary stores metadata about the database structure, not the actual data.'
            },
            {
                level: 2,
                text: 'It contains table definitions, column names, data types, constraints, indexes, and user privileges.'
            },
            {
                level: 3,
                text: 'The actual row data (like employee salaries) is stored in the tables, not in the data dictionary.'
            }
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
            {
                id: 'a',
                text: 'Table and column definitions',
                isCorrect: true,
                explanation: 'Correct. Schema metadata is stored in the data dictionary.'
            },
            {
                id: 'b',
                text: 'Actual row data from tables',
                isCorrect: false,
                explanation: 'Row data is stored in the table files, not the data dictionary.'
            },
            {
                id: 'c',
                text: 'User passwords',
                isCorrect: false,
                explanation: 'Passwords may be stored in authentication systems but not in the standard data dictionary.'
            },
            {
                id: 'd',
                text: 'Application source code',
                isCorrect: false,
                explanation: 'Application code is separate from the database metadata.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'A weak entity does not have a sufficient set of attributes to form a primary key on its own.'
            },
            {
                level: 2,
                text: 'It depends on a related strong entity (the identifying or owner entity) to form its primary key via a partial key plus the owner key.'
            },
            {
                level: 3,
                text: 'A weak entity has a partial key and a total, identifying relationship with a strong entity.'
            }
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
            {
                id: 'a',
                text: 'Has no attributes at all',
                isCorrect: false,
                explanation: 'A weak entity has attributes, just not enough to form a primary key alone.'
            },
            {
                id: 'b',
                text: 'Cannot form a primary key from its own attributes alone',
                isCorrect: true,
                explanation: 'Correct. It needs the owner entity key plus its partial key.'
            },
            {
                id: 'c',
                text: 'Always has exactly one attribute',
                isCorrect: false,
                explanation: 'It can have multiple attributes but lacks a full key.'
            },
            {
                id: 'd',
                text: 'Cannot participate in any relationship',
                isCorrect: false,
                explanation: 'It must participate in at least one identifying relationship with its owner.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'Think about which DDL command modifies an existing table structure.'
            },
            {
                level: 2,
                text: 'ALTER TABLE is used for modifications. The ADD COLUMN clause adds a new column.'
            },
            {
                level: 3,
                text: 'ALTER TABLE table_name ADD COLUMN column_name datatype;'
            }
        ],
        fullExplanation: `The correct command is:
ALTER TABLE table_name ADD COLUMN column_name datatype;

- CREATE TABLE creates a new table (not for existing tables).
- DROP TABLE deletes a table entirely.
- UPDATE modifies data rows, not the table structure.

ALTER TABLE with ADD COLUMN modifies the schema (metadata), which is then reflected in the data dictionary.`,
        commonMisconception: 'Confusing UPDATE (which changes data) with ALTER (which changes structure). DDL commands like ALTER modify the schema, while DML commands like UPDATE modify the data.',
        options: [
            {
                id: 'a',
                text: 'CREATE TABLE',
                isCorrect: false,
                explanation: 'This creates a new table, not modifies an existing one.'
            },
            {
                id: 'b',
                text: 'ALTER TABLE ... ADD COLUMN',
                isCorrect: true,
                explanation: 'Correct. ALTER TABLE with ADD COLUMN adds a new column.'
            },
            {
                id: 'c',
                text: 'UPDATE TABLE',
                isCorrect: false,
                explanation: 'UPDATE changes data rows, not the table structure.'
            },
            {
                id: 'd',
                text: 'MODIFY TABLE',
                isCorrect: false,
                explanation: 'MODIFY is not a standard SQL command for adding columns.'
            }
        ]
    },
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
            {
                level: 1,
                text: 'A double line indicates total participation. Every entity of E1 must participate in the relationship R.'
            },
            {
                level: 2,
                text: 'Total participation means every E1 entity must be related to at least one E2 entity through R. This translates to a NOT NULL foreign key constraint.'
            },
            {
                level: 3,
                text: 'Double line means total participation (mandatory). A single line means partial participation (optional). The double line does not directly indicate cardinality.'
            }
        ],
        fullExplanation: `A double line from E1 to relationship R means total participation:

- Every instance of E1 MUST participate in at least one instance of R.
- In SQL, this typically translates to a NOT NULL constraint on the foreign key column.
- This is also called mandatory participation.

A single line would mean partial participation (some E1 instances may not participate).

The double line does NOT directly tell us the cardinality (1:1, 1:N, or M:N). Cardinality is shown by other notations (arrows, numbers, or crow foot notation).`,
        commonMisconception: 'Interpreting the double line as indicating cardinality (like 1:1 or 1:N). The double line indicates participation (total vs partial), not cardinality.',
        options: [
            {
                id: 'a',
                text: 'Every E1 entity must participate in R',
                isCorrect: true,
                explanation: 'Correct. Double line means total (mandatory) participation.'
            },
            {
                id: 'b',
                text: 'The cardinality from E1 to E2 is 1:1',
                isCorrect: false,
                explanation: 'Participation does not determine cardinality. A different notation is needed.'
            },
            {
                id: 'c',
                text: 'In SQL, this means a NOT NULL foreign key',
                isCorrect: true,
                explanation: 'Correct. Total participation maps to NOT NULL on the referencing column.'
            },
            {
                id: 'd',
                text: 'E2 also has total participation in R',
                isCorrect: false,
                explanation: 'The line style of E1 does not determine E2 participation.'
            }
        ]
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questions/diagnostic.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================================
// Diagnostic Questions — 12 mixed questions for initial assessment
// ============================================================
__turbopack_context__.s([
    "diagnosticQuestions",
    ()=>diagnosticQuestions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$fd$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/fd.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$normalization$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/normalization.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$disk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/disk.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$lru$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/lru.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$bst$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/bst.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$sql$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/sql.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$er$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/er.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
function pickBySubskill(questions, subskill, count) {
    const filtered = questions.filter((q)=>q.subskill === subskill && q.source !== 'worked-example' && q.source !== 'guided');
    const picked = filtered.slice(0, count);
    return picked.map((q)=>({
            question: q,
            topic: q.moduleId
        }));
}
function pickFromModule(questions, count) {
    const filtered = questions.filter((q)=>q.source !== 'worked-example' && q.source !== 'guided');
    const picked = filtered.slice(0, count);
    return picked.map((q)=>({
            question: q,
            topic: q.moduleId
        }));
}
const diagnosticQuestions = [
    // 4 FD/normalization
    ...pickBySubskill(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$fd$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allFdQuestions"], 'closure-computation', 1),
    ...pickBySubskill(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$fd$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allFdQuestions"], 'candidate-key-finding', 1),
    ...pickBySubskill(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$fd$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allFdQuestions"], 'superkey-counting', 1),
    ...pickFromModule(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$normalization$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allNormalizationQuestions"], 1),
    // 2 SQL/psycopg2
    ...pickFromModule(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$sql$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allSqlQuestions"], 2),
    // 2 disk/buffer
    ...pickFromModule(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$disk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allDiskQuestions"], 1),
    ...pickFromModule(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$lru$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allLruQuestions"], 1),
    // 2 BST
    ...pickFromModule(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$bst$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allBstQuestions"], 2),
    // 2 theory/ER
    ...pickFromModule(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$er$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allErQuestions"], 2)
].slice(0, 12);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questions/mock.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// ============================================================
// Mock Exam Configurations
// ============================================================
__turbopack_context__.s([
    "diagnosticMiniMock",
    ()=>diagnosticMiniMock,
    "fullMock",
    ()=>fullMock,
    "getMockExam",
    ()=>getMockExam,
    "mixedPracticeMock",
    ()=>mixedPracticeMock,
    "mockExamConfigs",
    ()=>mockExamConfigs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$fd$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/fd.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$normalization$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/normalization.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$decomposition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/decomposition.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$disk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/disk.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$lru$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/lru.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$bst$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/bst.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$sql$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/sql.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$er$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/er.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
function pickQuestions(questions, count, excludeIds = new Set()) {
    const eligible = questions.filter((q)=>!excludeIds.has(q.id) && q.source !== 'worked-example' && q.source !== 'guided');
    const shuffled = [
        ...eligible
    ].sort(()=>Math.random() - 0.5);
    return shuffled.slice(0, count);
}
function buildMock(used) {
    return used;
}
const usedIds = new Set();
const diagnosticMiniMock = [
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$fd$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allFdQuestions"], 2, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$normalization$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allNormalizationQuestions"], 1, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$disk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allDiskQuestions"], 2, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$lru$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allLruQuestions"], 1, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$bst$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allBstQuestions"], 2, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$sql$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allSqlQuestions"], 1, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$er$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allErQuestions"], 1, usedIds)
];
diagnosticMiniMock.forEach((q)=>usedIds.add(q.id));
const mixedPracticeMock = [
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$fd$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allFdQuestions"], 3, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$normalization$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allNormalizationQuestions"], 2, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$decomposition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allDecompositionQuestions"], 2, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$disk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allDiskQuestions"], 3, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$lru$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allLruQuestions"], 2, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$bst$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allBstQuestions"], 3, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$sql$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allSqlQuestions"], 3, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$er$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allErQuestions"], 2, usedIds)
];
mixedPracticeMock.forEach((q)=>usedIds.add(q.id));
const fullMock = [
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$fd$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allFdQuestions"], 3, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$normalization$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allNormalizationQuestions"], 2, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$decomposition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allDecompositionQuestions"], 2, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$disk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allDiskQuestions"], 2, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$lru$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allLruQuestions"], 1, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$bst$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allBstQuestions"], 3, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$sql$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allSqlQuestions"], 2, usedIds),
    ...pickQuestions(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$er$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allErQuestions"], 1, usedIds)
];
fullMock.forEach((q)=>usedIds.add(q.id));
const mockExamConfigs = [
    {
        id: 'diagnostic-mini',
        title: '10-Minute Diagnostic Mini-Mock',
        type: 'diagnostic',
        timeLimitMinutes: 10,
        questions: diagnosticMiniMock,
        description: 'Quick diagnostic across all topics to gauge your current level.'
    },
    {
        id: 'mixed-practice',
        title: '20-Minute Mixed Practice',
        type: 'mini-mock',
        timeLimitMinutes: 20,
        questions: mixedPracticeMock,
        description: 'Mixed practice with questions from every topic at exam difficulty.'
    },
    {
        id: 'full-mock',
        title: '50-Mark Quiz 2 Style Mock',
        type: 'full-mock',
        timeLimitMinutes: 50,
        questions: fullMock,
        description: 'Full-length mock exam weighted to match the actual Quiz 2 PYQ pattern.'
    }
];
function getMockExam(configId) {
    return mockExamConfigs.find((c)=>c.id === configId);
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/questions/index.ts [app-client] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

// ============================================================
// Question Bank Index — Central Registry
// ============================================================
__turbopack_context__.s([
    "getAllQuestions",
    ()=>getAllQuestions,
    "getDiagnosticQuestions",
    ()=>getDiagnosticQuestions,
    "getQuestionById",
    ()=>getQuestionById,
    "getQuestionsByDifficulty",
    ()=>getQuestionsByDifficulty,
    "getQuestionsByModule",
    ()=>getQuestionsByModule,
    "getQuestionsBySubskill",
    ()=>getQuestionsBySubskill,
    "getRandomQuestions",
    ()=>getRandomQuestions
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$fd$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/fd.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$normalization$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/normalization.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$decomposition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/decomposition.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$disk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/disk.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$lru$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/lru.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$bst$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/bst.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$sql$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/sql.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$er$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/er.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$diagnostic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/diagnostic.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$mock$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/questions/mock.ts [app-client] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
const allQuestions = [
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$fd$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allFdQuestions"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$normalization$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allNormalizationQuestions"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$decomposition$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allDecompositionQuestions"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$disk$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allDiskQuestions"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$lru$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allLruQuestions"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$bst$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allBstQuestions"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$sql$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allSqlQuestions"],
    ...__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$er$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["allErQuestions"]
];
function getAllQuestions() {
    return allQuestions;
}
function getQuestionsByModule(moduleId) {
    return allQuestions.filter((q)=>q.moduleId === moduleId);
}
function getQuestionsBySubskill(subskill) {
    return allQuestions.filter((q)=>q.subskill === subskill);
}
function getQuestionsByDifficulty(difficulty) {
    return allQuestions.filter((q)=>q.difficulty === difficulty);
}
function getRandomQuestions(count, filters) {
    let pool = [
        ...allQuestions
    ];
    if (filters?.moduleId) {
        pool = pool.filter((q)=>q.moduleId === filters.moduleId);
    }
    if (filters?.subskill) {
        pool = pool.filter((q)=>q.subskill === filters.subskill);
    }
    if (filters?.difficulty) {
        pool = pool.filter((q)=>q.difficulty === filters.difficulty);
    }
    if (filters?.format) {
        pool = pool.filter((q)=>q.format === filters.format);
    }
    if (filters?.excludeIds) {
        pool = pool.filter((q)=>!filters.excludeIds.has(q.id));
    }
    // Shuffle and pick
    const shuffled = pool.sort(()=>Math.random() - 0.5);
    return shuffled.slice(0, count);
}
function getQuestionById(id) {
    return allQuestions.find((q)=>q.id === id);
}
function getDiagnosticQuestions() {
    return __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$questions$2f$diagnostic$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["diagnosticQuestions"];
}
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_lib_dfddb9e5._.js.map