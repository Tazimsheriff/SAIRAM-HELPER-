/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Contributor {
  id: string;
  name: string;
  regNo: string;
  department: string;
  batch: string; // e.g. "2022-2026"
  contributionsCount: number;
  contactUrl?: string; // Telegram link, Instagram, etc.
  avatarUrl?: string;
  isUserAdded?: boolean;
}

export interface Resource {
  id: string;
  subjectCode: string;
  subjectName: string;
  department: string; // "CSE" | "IT" | "ECE" | "EEE" | "AIDS" | "MECH" | "All"
  semester: number; // 1 to 8
  type: 'Notes' | 'Question Paper' | 'Lab Manual' | 'Syllabus';
  downloadUrl: string;
  uploadedBy: string; // Links to a contributor id or name
  fileSize: string;
  downloadsCount: number;
  likes?: number;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  grade?: string; // O, A+, A, B+, B, C, RA
}

export type GradeValue = 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'RA';

export interface FeedbackSubmission {
  id: string;
  name: string;
  email: string;
  type: 'General' | 'Bug' | 'Resource Request' | 'Appreciation';
  message: string;
  createdAt: string;
}
