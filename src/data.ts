/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Contributor, Resource, Course } from './types';

export const SAIRAM_DEPARTMENTS = [
  { code: 'CSE', name: 'Computer Science & Engineering' },
  { code: 'IT', name: 'Information Technology' },
  { code: 'ECE', name: 'Electronics & Communication Engineering' },
  { code: 'AIDS', name: 'Artificial Intelligence & Data Science' },
  { code: 'EEE', name: 'Electrical & Electronics Engineering' },
  { code: 'MECH', name: 'Mechanical Engineering' },
  { code: 'CSBS', name: 'Computer Science & Business Systems' }
];

export const INITIAL_CONTRIBUTORS: Contributor[] = [
  {
    id: 'c1',
    name: 'Abishek S',
    regNo: 'SEC22CS045',
    department: 'CSE',
    batch: '2022-2026',
    contributionsCount: 18,
    contactUrl: 'https://t.me/+SairamCSECompanion',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'c2',
    name: 'Ramya Devi R',
    regNo: 'SEC22IT102',
    department: 'IT',
    batch: '2022-2026',
    contributionsCount: 14,
    contactUrl: 'https://instagram.com/ramya_devi',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'c3',
    name: 'Vigneshwaran M',
    regNo: 'SEC23AD054',
    department: 'AIDS',
    batch: '2023-2027',
    contributionsCount: 22,
    contactUrl: 'https://t.me/vicky_aids',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'c4',
    name: 'Keerthana S',
    regNo: 'SEC22EC144',
    department: 'ECE',
    batch: '2022-2026',
    contributionsCount: 9,
    contactUrl: 'https://t.me/keerthu_s',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'c5',
    name: 'Sanjay Kumar K',
    regNo: 'SEC24CS112',
    department: 'CSE',
    batch: '2024-2028',
    contributionsCount: 5,
    contactUrl: 'https://github.com/sanjay-sec',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'c6',
    name: 'Harini P',
    regNo: 'SEC23EE031',
    department: 'EEE',
    batch: '2023-2027',
    contributionsCount: 11,
    contactUrl: 'https://instagram.com/harini_ee',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'c7',
    name: 'Akash R',
    regNo: 'SEC22ME015',
    department: 'MECH',
    batch: '2022-2026',
    contributionsCount: 16,
    contactUrl: 'https://t.me/akash_mech_sec',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'c8',
    name: 'Nithya Priya V',
    regNo: 'SIT23IT082',
    department: 'IT',
    batch: '2023-2027',
    contributionsCount: 13,
    contactUrl: 'https://t.me/nithya_sit',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
  },
  {
    id: 'c9',
    name: 'Gowtham K',
    regNo: 'SEC22CB021',
    department: 'CSBS',
    batch: '2022-2026',
    contributionsCount: 7,
    contactUrl: 'https://github.com/gowtham-csbs',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&h=150&q=80'
  }
];

export const INITIAL_RESOURCES: Resource[] = [
  // CSE - Semester 5
  {
    id: 'r1',
    subjectCode: 'CCS339',
    subjectName: 'Computer Networks Lecture Notes (All 5 Units)',
    department: 'CSE',
    semester: 5,
    type: 'Notes',
    downloadUrl: 'https://drive.google.com/drive/folders/1SairamAcademicCompanion_CN',
    uploadedBy: 'Abishek S',
    fileSize: '14.2 MB',
    downloadsCount: 342
  },
  {
    id: 'r2',
    subjectCode: 'CCS339',
    subjectName: 'Computer Networks - Internal Assessment Question Bank',
    department: 'CSE',
    semester: 5,
    type: 'Question Paper',
    downloadUrl: 'https://drive.google.com/drive/folders/1SairamAcademicCompanion_CN_QB',
    uploadedBy: 'Sanjay Kumar K',
    fileSize: '2.5 MB',
    downloadsCount: 198
  },
  {
    id: 'r3',
    subjectCode: 'CCS356',
    subjectName: 'Object Oriented Analysis and Design (OOAD) Notes',
    department: 'CSE',
    semester: 5,
    type: 'Notes',
    downloadUrl: 'https://drive.google.com/drive/folders/1Sairam_OOAD_Notes',
    uploadedBy: 'Abishek S',
    fileSize: '8.7 MB',
    downloadsCount: 221
  },
  // IT - Semester 3
  {
    id: 'r4',
    subjectCode: 'CCS349',
    subjectName: 'Data Structures Lab Manual with Solutions',
    department: 'IT',
    semester: 3,
    type: 'Lab Manual',
    downloadUrl: 'https://drive.google.com/drive/folders/1Sairam_DS_Lab',
    uploadedBy: 'Ramya Devi R',
    fileSize: '5.1 MB',
    downloadsCount: 412
  },
  {
    id: 'r5',
    subjectCode: 'CCS349',
    subjectName: 'Data Structures Handwritten Unit Notes (Regulation 2021)',
    department: 'IT',
    semester: 3,
    type: 'Notes',
    downloadUrl: 'https://drive.google.com/drive/folders/1Sairam_DS_Notes',
    uploadedBy: 'Nithya Priya V',
    fileSize: '18.4 MB',
    downloadsCount: 387
  },
  // AIDS - Semester 4
  {
    id: 'r6',
    subjectCode: 'CAD341',
    subjectName: 'Design and Analysis of Algorithms - Formula & Core Notes',
    department: 'AIDS',
    semester: 4,
    type: 'Notes',
    downloadUrl: 'https://drive.google.com/drive/folders/1Sairam_DAA_Core',
    uploadedBy: 'Vigneshwaran M',
    fileSize: '11.3 MB',
    downloadsCount: 295
  },
  {
    id: 'r7',
    subjectCode: 'CAD342',
    subjectName: 'Database Management Systems Semester PYQ (2022-2024)',
    department: 'AIDS',
    semester: 4,
    type: 'Question Paper',
    downloadUrl: 'https://drive.google.com/drive/folders/1Sairam_DBMS_PYQ',
    uploadedBy: 'Vigneshwaran M',
    fileSize: '4.2 MB',
    downloadsCount: 184
  },
  // ECE - Semester 4
  {
    id: 'r8',
    subjectCode: 'CEC341',
    subjectName: 'Analog and Digital Communication Lecture Slides',
    department: 'ECE',
    semester: 4,
    type: 'Notes',
    downloadUrl: 'https://drive.google.com/drive/folders/1Sairam_ADC_Slides',
    uploadedBy: 'Keerthana S',
    fileSize: '22 MB',
    downloadsCount: 154
  },
  {
    id: 'r9',
    subjectCode: 'CEC342',
    subjectName: 'Microprocessor & Microcontroller Lab Viva Preparation',
    department: 'ECE',
    semester: 4,
    type: 'Lab Manual',
    downloadUrl: 'https://drive.google.com/drive/folders/1Sairam_MPMC_Viva',
    uploadedBy: 'Keerthana S',
    fileSize: '1.8 MB',
    downloadsCount: 209
  },
  // EEE - Semester 3
  {
    id: 'r10',
    subjectCode: 'CEE331',
    subjectName: 'Electrical Machines-I Imp Question Answers (Unit 1-5)',
    department: 'EEE',
    semester: 3,
    type: 'Notes',
    downloadUrl: 'https://drive.google.com/drive/folders/1Sairam_Machines_QB',
    uploadedBy: 'Harini P',
    fileSize: '9.6 MB',
    downloadsCount: 145
  },
  // MECH - Semester 6
  {
    id: 'r11',
    subjectCode: 'CME361',
    subjectName: 'Design of Transmission Systems Complete Notebook Pdf',
    department: 'MECH',
    semester: 6,
    type: 'Notes',
    downloadUrl: 'https://drive.google.com/drive/folders/1Sairam_DTS_Notebook',
    uploadedBy: 'Akash R',
    fileSize: '31.4 MB',
    downloadsCount: 172
  },
  {
    id: 'r12',
    subjectCode: 'CME362',
    subjectName: 'Computer Aided Simulation & Analysis Lab Record',
    department: 'MECH',
    semester: 6,
    type: 'Lab Manual',
    downloadUrl: 'https://drive.google.com/drive/folders/1Sairam_CASA_Lab',
    uploadedBy: 'Akash R',
    fileSize: '6.4 MB',
    downloadsCount: 119
  }
];

export const DEPARTMENT_COURSES: { [dept: string]: { [sem: number]: Course[] } } = {
  CSE: {
    1: [
      { id: 'cse11', code: 'HS3151', name: 'Professional English I', credits: 3 },
      { id: 'cse12', code: 'MA3151', name: 'Matrices and Calculus', credits: 4 },
      { id: 'cse13', code: 'PH3151', name: 'Engineering Physics', credits: 3 },
      { id: 'cse14', code: 'CY3151', name: 'Engineering Chemistry', credits: 3 },
      { id: 'cse15', code: 'GE3151', name: 'Problem Solving and Python Programming', credits: 3 },
      { id: 'cse16', code: 'GE3171', name: 'Problem Solving and Python Programming Laboratory', credits: 2 },
      { id: 'cse17', code: 'BS3171', name: 'Physics and Chemistry Laboratory', credits: 2 }
    ],
    2: [
      { id: 'cse21', code: 'HS3251', name: 'Professional English II', credits: 3 },
      { id: 'cse22', code: 'MA3251', name: 'Statistics and Numerical Methods', credits: 4 },
      { id: 'cse23', code: 'PH3256', name: 'Physics for Information Science', credits: 3 },
      { id: 'cse24', code: 'BE3251', name: 'Basic Electrical and Electronics Engineering', credits: 3 },
      { id: 'cse25', code: 'GE3251', name: 'Engineering Graphics', credits: 4 },
      { id: 'cse26', code: 'CS3251', name: 'Programming in C', credits: 3 },
      { id: 'cse27', code: 'CS3271', name: 'C Programming Laboratory', credits: 2 }
    ],
    3: [
      { id: 'cse31', code: 'MA3354', name: 'Discrete Mathematics', credits: 4 },
      { id: 'cse32', code: 'CS3351', name: 'Digital Principles and Computer Organization', credits: 4 },
      { id: 'cse33', code: 'CS3352', name: 'Foundations of Data Science', credits: 3 },
      { id: 'cse34', code: 'CS3301', name: 'Data Structures', credits: 3 },
      { id: 'cse35', code: 'CS3391', name: 'Object Oriented Programming', credits: 3 },
      { id: 'cse36', code: 'CS3311', name: 'Data Structures Laboratory', credits: 1.5 },
      { id: 'cse37', code: 'CS3381', name: 'Object Oriented Programming Laboratory', credits: 1.5 },
      { id: 'cse38', code: 'CS3361', name: 'Data Science Laboratory', credits: 1.5 }
    ],
    4: [
      { id: 'cse41', code: 'CS3452', name: 'Theory of Computation', credits: 3 },
      { id: 'cse42', code: 'CS3491', name: 'Cryptography and Cyber Security', credits: 3 },
      { id: 'cse43', code: 'CS3492', name: 'Database Management Systems', credits: 3 },
      { id: 'cse44', code: 'CS3401', name: 'Algorithms', credits: 4 },
      { id: 'cse45', code: 'CS3451', name: 'Introduction to Operating Systems', credits: 3 },
      { id: 'cse46', code: 'GE3451', name: 'Environmental Sciences and Sustainability', credits: 2 },
      { id: 'cse47', code: 'CS3411', name: 'Database Management Systems Laboratory', credits: 1.5 },
      { id: 'cse48', code: 'CS3412', name: 'Operating Systems Laboratory', credits: 1.5 }
    ],
    5: [
      { id: 'cse51', code: 'CS3591', name: 'Computer Networks', credits: 4 },
      { id: 'cse52', code: 'CS3501', name: 'Compiler Design', credits: 4 },
      { id: 'cse53', code: 'CB3491', name: 'Cryptography and Network Security', credits: 3 },
      { id: 'cse54', code: 'CS3551', name: 'Web Technologies', credits: 3 },
      { id: 'cse55', code: 'CCS356', name: 'Object Oriented Analysis and Design', credits: 3 },
      { id: 'cse56', code: 'CS3511', name: 'Web Technologies Laboratory', credits: 1.5 },
      { id: 'cse57', code: 'CS3512', name: 'Compiler Design Laboratory', credits: 1.5 }
    ]
  },
  IT: {
    3: [
      { id: 'it31', code: 'MA3354', name: 'Discrete Mathematics', credits: 4 },
      { id: 'it32', code: 'CS3351', name: 'Digital Principles and Computer Organization', credits: 4 },
      { id: 'it33', code: 'IT3301', name: 'Design and Analysis of Algorithms', credits: 3 },
      { id: 'it34', code: 'IT3351', name: 'Object Oriented Programming', credits: 3 },
      { id: 'it35', code: 'IT3311', name: 'Data Structures Laboratory', credits: 1.5 },
      { id: 'it36', code: 'IT3381', name: 'Object Oriented Programming Laboratory', credits: 1.5 }
    ]
  },
  AIDS: {
    3: [
      { id: 'ad31', code: 'MA3352', name: 'Linear Algebra and Combinatorics', credits: 4 },
      { id: 'ad32', code: 'AD3351', name: 'Design and Analysis of Algorithms', credits: 4 },
      { id: 'ad33', code: 'AD3301', name: 'Data Structures and Algorithms', credits: 3 },
      { id: 'ad34', code: 'AD3311', name: 'Data Science & Algorithm Lab', credits: 2 }
    ]
  }
};

// Generates fallback courses for any department/semester combination not explicitly listed
export function getCoursesForDeptAndSemester(dept: string, semester: number): Course[] {
  if (DEPARTMENT_COURSES[dept] && DEPARTMENT_COURSES[dept][semester]) {
    return DEPARTMENT_COURSES[dept][semester];
  }
  
  // Standard default template courses for general calculation
  return [
    { id: `${dept}-${semester}-1`, code: `${dept}3${semester}01`, name: `Core Professional Subject - I`, credits: 4 },
    { id: `${dept}-${semester}-2`, code: `${dept}3${semester}02`, name: `Core Professional Subject - II`, credits: 3 },
    { id: `${dept}-${semester}-3`, code: `${dept}3${semester}03`, name: `Core Professional Subject - III`, credits: 3 },
    { id: `${dept}-${semester}-4`, code: `GE3${semester}51`, name: `Professional Elective - I`, credits: 3 },
    { id: `${dept}-${semester}-5`, code: `OE3${semester}11`, name: `Open Elective - I`, credits: 3 },
    { id: `${dept}-${semester}-6`, code: `${dept}3${semester}11`, name: `Practical Laboratory - I`, credits: 1.5 },
    { id: `${dept}-${semester}-7`, code: `${dept}3${semester}12`, name: `Practical Laboratory - II`, credits: 1.5 },
    { id: `${dept}-${semester}-8`, code: `EE3${semester}81`, name: `Employability Enhancement Seminar`, credits: 1 }
  ];
}

export const GRADES = [
  { label: 'O (Outstanding - 10)', value: 'O', points: 10 },
  { label: 'A+ (Excellent - 9)', value: 'A+', points: 9 },
  { label: 'A (Very Good - 8)', value: 'A', points: 8 },
  { label: 'B+ (Good - 7)', value: 'B+', points: 7 },
  { label: 'B (Average - 6)', value: 'B', points: 6 },
  { label: 'C (Satisfactory - 5)', value: 'C', points: 5 },
  { label: 'RA (Re-Appearance - 0)', value: 'RA', points: 0 }
];

export const STUDY_FLASHCARDS = [
  {
    id: 'f1',
    subject: 'Computer Networks',
    question: 'What are the 7 layers of the OSI Model from bottom to top?',
    answer: '1. Physical Layer\n2. Data Link Layer\n3. Network Layer\n4. Transport Layer\n5. Session Layer\n6. Presentation Layer\n7. Application Layer\n\n(Mnemonic: "Please Do Not Touch Steve\'s Pet Alligator")'
  },
  {
    id: 'f2',
    subject: 'Data Structures',
    question: 'What is the time complexity of searching in a Balanced Binary Search Tree (like AVL or Red-Black Tree)?',
    answer: 'The time complexity is O(log n) in both average and worst cases, because the tree height is maintained in a balanced state proportional to log n.'
  },
  {
    id: 'f3',
    subject: 'Database Management Systems',
    question: 'What are ACID properties in database transactions?',
    answer: '• Atomicity: All operations in a transaction succeed or none do.\n• Consistency: Database goes from one valid state to another.\n• Isolation: Concurrent transactions do not interfere with each other.\n• Durability: Once committed, changes survive system failures.'
  },
  {
    id: 'f4',
    subject: 'Operating Systems',
    question: 'What is Thrashing in Virtual Memory management?',
    answer: 'Thrashing occurs when the virtual memory subsystem is in a constant state of paging (swapping pages in and out of RAM), leading to high disk latency and extremely low CPU utilization.'
  },
  {
    id: 'f5',
    subject: 'Theory of Computation',
    question: 'What is the difference between a DFA and an NFA?',
    answer: '• DFA (Deterministic Finite Automata): For every state and input symbol, there is exactly one unique transition to a next state.\n• NFA (Non-Deterministic Finite Automata): Can have zero, one, or multiple transitions for a single state and input symbol, or can have epsilon (empty transition) jumps.'
  }
];
