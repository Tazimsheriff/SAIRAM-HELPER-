/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calculator, Plus, Trash2, RotateCcw, HelpCircle, GraduationCap, Award, ChartLine } from 'lucide-react';
import { Course } from '../types';
import { SAIRAM_DEPARTMENTS, GRADES, getCoursesForDeptAndSemester } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export default function GpaCalculatorView() {
  const [selectedDept, setSelectedDept] = useState('CSE');
  const [selectedSemester, setSelectedSemester] = useState(3);
  const [courses, setCourses] = useState<Course[]>([]);
  
  // Custom courses state to allow editing
  const [customCourseName, setCustomCourseName] = useState('');
  const [customCourseCode, setCustomCourseCode] = useState('');
  const [customCourseCredits, setCustomCourseCredits] = useState<number>(3);

  // Cumulative CGPA calculator state
  const [pastSemestersGpas, setPastSemestersGpas] = useState<string[]>(['', '', '']);
  const [calculatedCgpa, setCalculatedCgpa] = useState<number | null>(null);

  // Load preset courses when dept or semester changes
  useEffect(() => {
    const presets = getCoursesForDeptAndSemester(selectedDept, selectedSemester);
    // Deep clone with empty grade
    setCourses(presets.map(p => ({ ...p, grade: 'O' })));
  }, [selectedDept, selectedSemester]);

  // Handle grade selection changes
  const handleGradeChange = (id: string, grade: string) => {
    setCourses(prev =>
      prev.map(c => (c.id === id ? { ...c, grade } : c))
    );
  };

  // Delete a course Row
  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  // Add custom Course row
  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCourseName.trim()) return;

    const newCourse: Course = {
      id: `custom-${Date.now()}`,
      code: customCourseCode.trim().toUpperCase() || 'MANUAL',
      name: customCourseName.trim(),
      credits: Number(customCourseCredits),
      grade: 'O'
    };

    setCourses(prev => [...prev, newCourse]);
    setCustomCourseName('');
    setCustomCourseCode('');
    setCustomCourseCredits(3);
  };

  // Reset core courses list
  const handleReset = () => {
    const presets = getCoursesForDeptAndSemester(selectedDept, selectedSemester);
    setCourses(presets.map(p => ({ ...p, grade: 'O' })));
  };

  // GPA computation math logic
  const calculateGPA = () => {
    let totalCredits = 0;
    let weightedPoints = 0;

    courses.forEach(c => {
      if (c.grade) {
        const gradeObj = GRADES.find(g => g.value === c.grade);
        if (gradeObj) {
          totalCredits += c.credits;
          weightedPoints += c.credits * gradeObj.points;
        }
      }
    });

    if (totalCredits === 0) return 0;
    const gpa = weightedPoints / totalCredits;
    return parseFloat(gpa.toFixed(2));
  };

  const gpaResult = calculateGPA();

  // CGPA calculation logic
  const handleCalculateCgpa = () => {
    const validGpas = pastSemestersGpas
      .map(g => parseFloat(g))
      .filter(g => !isNaN(g) && g >= 0 && g <= 10);
    
    if (validGpas.length === 0) {
      setCalculatedCgpa(null);
      return;
    }

    const avg = validGpas.reduce((sum, g) => sum + g, 0) / validGpas.length;
    setCalculatedCgpa(parseFloat(avg.toFixed(2)));
  };

  // Set past semester lengths
  const setPastSemesterCount = (count: number) => {
    setPastSemestersGpas(Array(count).fill(''));
    setCalculatedCgpa(null);
  };

  // Gpa styling thresholds
  const getGpaGradeColor = (gpa: number) => {
    if (gpa >= 9.0) return 'text-emerald-500 bg-emerald-50 border-emerald-200';
    if (gpa >= 8.0) return 'text-indigo-500 bg-indigo-50 border-indigo-200';
    if (gpa >= 6.0) return 'text-amber-500 bg-amber-50 border-amber-200';
    return 'text-rose-500 bg-rose-50 border-rose-200';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* GPA Core Calculator Grid Details */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                <Calculator className="h-5 w-5 text-indigo-600" /> R-2021 GPA Calculator
              </h2>
              <p className="text-slate-400 text-xs">Pre-mapped credits and subjects for Autonomous Sairam Streams.</p>
            </div>
            
            {/* Presets selectors */}
            <div className="flex gap-2.5">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="text-xs font-bold bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-700 outline-none"
              >
                {SAIRAM_DEPARTMENTS.slice(0, 4).map((dept) => (
                  <option key={dept.code} value={dept.code}>
                    {dept.code}
                  </option>
                ))}
              </select>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(Number(e.target.value))}
                className="text-xs font-bold bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-slate-700 outline-none"
              >
                {[1, 2, 3, 4, 5].map((sem) => (
                  <option key={sem} value={sem}>
                    Sem {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-slate-50 pt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="hidden sm:table-row border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400 select-none">
                    <th className="pb-3 pl-2">Subject Info</th>
                    <th className="pb-3 text-center">Credits</th>
                    <th className="pb-3 pr-2">Your Grade</th>
                    <th className="pb-3 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 sm:divide-y sm:divide-slate-50">
                  <AnimatePresence mode="popLayout">
                    {courses.map((course) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={course.id}
                        className="flex flex-col sm:table-row py-4 sm:py-0 border-b border-slate-100 md:border-b-0 hover:bg-slate-50/50 transition-colors"
                      >
                        {/* Course Name */}
                        <td className="py-1.5 sm:py-3 pl-2 flex justify-between items-center sm:table-cell">
                          <div className="space-y-0.5 max-w-xs sm:max-w-md">
                            <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-100 border border-slate-200/50 px-1 py-0.25 rounded">
                              {course.code}
                            </span>
                            <p className="font-bold text-slate-700 text-xs leading-snug">{course.name}</p>
                          </div>
                          {/* Visible only on mobile inside the same block */}
                          <span className="inline-block sm:hidden text-xs font-extrabold text-slate-500 bg-slate-100 border border-slate-200/30 px-2 py-0.5 rounded">
                            {course.credits} Credits
                          </span>
                        </td>

                        {/* Credits - Hidden on mobile */}
                        <td className="hidden sm:table-cell py-3 text-center font-extrabold text-slate-600 text-xs">
                          {course.credits}
                        </td>

                        {/* Grade Dropdown Selector */}
                        <td className="py-1.5 sm:py-3 pr-2 flex items-center justify-between sm:table-cell">
                          <span className="text-slate-400 text-xs font-bold sm:hidden">Select Grade:</span>
                          <select
                            value={course.grade || 'O'}
                            onChange={(e) => handleGradeChange(course.id, e.target.value)}
                            className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-700 outline-none w-28 sm:w-28 shadow-sm cursor-pointer"
                          >
                            {GRADES.map((g) => (
                              <option key={g.value} value={g.value}>
                                {g.value} ({g.points} pts)
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Delete course row button */}
                        <td className="py-1.5 sm:py-3 text-right flex justify-between items-center sm:table-cell">
                          <span className="text-slate-400 text-xs font-bold sm:hidden">Actions:</span>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="p-1 px-2.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 select-none cursor-pointer flex items-center gap-1 text-xs font-bold"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sm:hidden">Remove</span>
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {courses.length === 0 && (
              <div className="text-center py-12 space-y-2">
                <HelpCircle className="h-8 w-8 text-slate-300 mx-auto" />
                <h4 className="font-bold text-slate-700 text-sm">Course List is Empty</h4>
                <p className="text-slate-400 text-xs">Select or add subjects below to begin GPA calculations.</p>
              </div>
            )}
          </div>

          {/* Quick reset button */}
          <div className="flex justify-end pt-4 border-t border-slate-50">
            <button
              onClick={handleReset}
              className="flex items-center space-x-1 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 font-bold px-3 py-1.5 rounded-xl text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Curriculum Courses</span>
            </button>
          </div>
        </div>

        {/* Add Manual Custom Subject Roll Form */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h3 className="text-xs font-bold text-slate-400 tracking-wider mb-4 uppercase">
            <Plus className="h-3.5 w-3.5 inline mr-1" /> Add Custom Course / Practical
          </h3>
          <form onSubmit={handleAddCourse} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Code (e.g. EC3411)"
              value={customCourseCode}
              onChange={(e) => setCustomCourseCode(e.target.value)}
              className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs hover:border-slate-300 focus:outline-none col-span-1 text-slate-800"
            />
            <input
              type="text"
              required
              placeholder="Course title or lab name..."
              value={customCourseName}
              onChange={(e) => setCustomCourseName(e.target.value)}
              className="px-3.5 py-2 border border-slate-200 rounded-xl text-xs hover:border-slate-300 focus:outline-none col-span-2 text-slate-800"
            />
            <div className="flex gap-2 col-span-1">
              <select
                value={customCourseCredits}
                onChange={(e) => setCustomCourseCredits(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold text-slate-600 outline-none w-1/2"
              >
                <option value={4}>4 Credits</option>
                <option value={3}>3 Credits</option>
                <option value={2}>2 Credits</option>
                <option value={1.5}>1.5 Credits</option>
                <option value={1}>1 Credit</option>
              </select>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-2 px-3 rounded-xl text-xs w-1/2"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Side GPA & CGPA Analysis Cards */}
      <div className="space-y-6">
        {/* Animated Live GPA Score Meter */}
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 rounded-full bg-blue-500/20 blur-2xl"></div>
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold tracking-widest uppercase text-amber-400">Semester GPA Result</span>
            <p className="text-slate-300 text-xs">Calculated on Sairam autonomous scoring weightages.</p>
          </div>

          <div className="my-8 text-center space-y-2">
            <span className="block text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-amber-300">
              {gpaResult.toFixed(2)}
            </span>
            <span className="inline-block bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-white/5 uppercase">
              {gpaResult >= 9.0 ? 'Outstanding (O)' : gpaResult >= 8.0 ? 'Elite (A+/A)' : gpaResult >= 6.0 ? 'Good Standing' : 'Keep Pushing'}
            </span>
          </div>

          <div className="border-t border-white/10 pt-4 flex justify-between text-xs text-slate-400">
            <span>Total Units Included:</span>
            <span className="font-bold text-white">
              {courses.reduce((sum, c) => sum + c.credits, 0)} Credits
            </span>
          </div>
        </div>

        {/* CGPA Interactive Projections Panel */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 tracking-wider flex items-center gap-1 uppercase">
            <ChartLine className="h-3.5 w-3.5 text-indigo-600" /> CGPA Multi-Sem Projection
          </h3>
          <p className="text-slate-500 text-xs leading-relaxed">
            Quickly project your cumulative grade point average (CGPA) based on previous semesters.
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => setPastSemesterCount(2)}
              className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all border ${
                pastSemestersGpas.length === 2 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-500 border-slate-100'
              }`}
            >
              2 Semesters
            </button>
            <button
              onClick={() => setPastSemesterCount(4)}
              className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all border ${
                pastSemestersGpas.length === 4 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-500 border-slate-100'
              }`}
            >
              4 Semesters
            </button>
            <button
              onClick={() => setPastSemesterCount(6)}
              className={`px-3 py-1 rounded-lg text-[10px] font-extrabold transition-all border ${
                pastSemestersGpas.length === 6 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-500 border-slate-100'
              }`}
            >
              6 Semesters
            </button>
          </div>

          <div className="space-y-2 pt-2">
            {pastSemestersGpas.map((val, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-slate-600">Semester {idx + 1} GPA:</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  placeholder="e.g. 8.45"
                  value={val}
                  onChange={(e) => {
                    const newArr = [...pastSemestersGpas];
                    newArr[idx] = e.target.value;
                    setPastSemestersGpas(newArr);
                    setCalculatedCgpa(null); // Clear result to force recalculate
                  }}
                  className="w-24 border border-slate-200 rounded-xl px-2.5 py-1 text-xs text-right text-slate-800"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleCalculateCgpa}
            className="w-full bg-slate-50 hover:bg-slate-100 hover:text-indigo-600 text-slate-600 border border-slate-200/65 font-bold py-2 rounded-xl text-xs transition-colors"
          >
            Calculate Composite CGPA
          </button>

          {calculatedCgpa !== null && (
            <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl flex items-center justify-between text-indigo-800">
              <span className="text-xs font-bold">Projected CGPA:</span>
              <span className="text-lg font-black text-indigo-700">{calculatedCgpa.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
