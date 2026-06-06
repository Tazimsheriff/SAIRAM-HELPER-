import React, { useState, useEffect } from 'react';
import { Calculator, Plus, Trash2, RotateCcw, HelpCircle, Award, ChartLine, Check, Landmark } from 'lucide-react';
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
    // Deep clone with default O grade
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* GPA Core Calculator Grid Details */}
      <div className="lg:col-span-2 space-y-6">
        <div className="glass-card rounded-2xl p-6 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
                <Calculator className="h-5 w-5 text-green-400" /> R-2021 GPA Calculator
              </h2>
              <p className="text-text-muted text-xs">Pre-mapped credits and subjects for Autonomous Sairam streams.</p>
            </div>
            
            {/* Presets selectors */}
            <div className="flex gap-2">
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="text-xs font-bold bg-bg-surface border border-border-glass px-3 py-2 rounded-xl text-white outline-none cursor-pointer"
              >
                {SAIRAM_DEPARTMENTS.slice(0, 5).map((dept) => (
                  <option key={dept.code} value={dept.code}>
                    {dept.code} Preset
                  </option>
                ))}
              </select>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(Number(e.target.value))}
                className="text-xs font-bold bg-bg-surface border border-border-glass px-3 py-2 rounded-xl text-white outline-none cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Sem {sem}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t border-border-glass pt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="hidden sm:table-row border-b border-border-glass text-[10px] uppercase font-mono font-bold text-text-muted select-none">
                    <th className="pb-3 pl-2">Subject Info</th>
                    <th className="pb-3 text-center">Credits</th>
                    <th className="pb-3 pr-2">Your Grade</th>
                    <th className="pb-3 text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-glass bg-white/1">
                  <AnimatePresence mode="popLayout">
                    {courses.map((course) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={course.id}
                        className="flex flex-col sm:table-row py-4 sm:py-0 border-b border-border-glass sm:border-b-0 hover:bg-green-500/3 transition-colors"
                      >
                        {/* Course Name */}
                        <td className="py-2 pl-2 flex justify-between items-center sm:table-cell">
                          <div className="space-y-1.5 max-w-xs sm:max-w-md">
                            <span className="text-[10px] font-mono text-green-300 font-bold bg-white/5 border border-border-glass px-1.5 py-0.5 rounded">
                              {course.code}
                            </span>
                            <p className="font-extrabold text-white text-xs sm:text-sm leading-snug">{course.name}</p>
                          </div>
                          {/* Visible only on mobile inside the same block */}
                          <span className="inline-block sm:hidden text-[10px] font-mono font-bold text-green-300 bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 rounded">
                            {course.credits} Credits
                          </span>
                        </td>

                        {/* Credits - Hidden on mobile */}
                        <td className="hidden sm:table-cell py-3 text-center font-extrabold text-white text-xs">
                          {course.credits}
                        </td>

                        {/* Grade Dropdown Selector */}
                        <td className="py-2 pr-2 flex items-center justify-between sm:table-cell">
                          <span className="text-text-muted text-xs font-mono font-bold sm:hidden">Select Grade:</span>
                          <select
                            value={course.grade || 'O'}
                            onChange={(e) => handleGradeChange(course.id, e.target.value)}
                            className="bg-bg-surface border border-border-glass rounded-xl px-2.5 py-1.5 text-xs font-bold text-white outline-none w-32 shadow-sm cursor-pointer"
                          >
                            {GRADES.map((g) => (
                              <option key={g.value} value={g.value}>
                                {g.value} ({g.points} pts)
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Delete course row button */}
                        <td className="py-2 text-right flex justify-between items-center sm:table-cell">
                          <span className="text-text-muted text-xs font-mono font-bold sm:hidden">Remove:</span>
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="p-1 px-2.5 text-text-muted hover:text-rose-450 rounded-lg hover:bg-rose-950/20 select-none cursor-pointer flex items-center gap-1 text-xs font-bold transition-all"
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
                <HelpCircle className="h-8 w-8 text-text-muted mx-auto" />
                <h4 className="font-bold text-white text-sm">Course List is Empty</h4>
                <p className="text-text-muted text-xs">Select or add custom curriculum subjects below to begin GPA calculations.</p>
              </div>
            )}
          </div>

          {/* Quick reset button */}
          <div className="flex justify-end pt-4 border-t border-border-glass">
            <button
              onClick={handleReset}
              className="flex items-center space-x-1.5 border border-border-glass bg-white/5 hover:bg-white/10 text-text-muted hover:text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5 text-green-400" />
              <span>Reset Semester presets</span>
            </button>
          </div>
        </div>

        {/* Add Manual Custom Subject Roll Form */}
        <div className="glass-card rounded-2xl p-5 shadow-lg">
          <h3 className="text-xs font-mono font-bold text-green-400 tracking-wider mb-4 uppercase">
            <Plus className="h-3.5 w-3.5 inline mr-1" /> Add Custom Course / Practical Labs
          </h3>
          <form onSubmit={handleAddCourse} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Code (e.g. EC3411)"
              value={customCourseCode}
              onChange={(e) => setCustomCourseCode(e.target.value)}
              className="px-3.5 py-2 text-xs bg-white/5 border border-border-glass rounded-xl text-white outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-400 col-span-1 placeholder-text-muted/30 uppercase font-mono"
            />
            <input
              type="text"
              required
              placeholder="Course title or lab name..."
              value={customCourseName}
              onChange={(e) => setCustomCourseName(e.target.value)}
              className="px-3.5 py-2 text-xs bg-white/5 border border-border-glass rounded-xl text-white outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-400 col-span-2 placeholder-text-muted/30 font-sans"
            />
            <div className="flex gap-2 col-span-1">
              <select
                value={customCourseCredits}
                onChange={(e) => setCustomCourseCredits(Number(e.target.value))}
                className="bg-bg-surface border border-border-glass rounded-xl px-2 py-2 text-xs font-bold text-white outline-none w-1/2 cursor-pointer"
              >
                <option value={4}>4 Cr</option>
                <option value={3}>3 Cr</option>
                <option value={2}>2 Cr</option>
                <option value={1.5}>1.5 Cr</option>
                <option value={1}>1 Cr</option>
              </select>
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-black font-extrabold p-2 px-3 rounded-xl text-xs w-1/2 shadow-[0_0_12px_rgba(34,197,94,0.3)] transition-all cursor-pointer"
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
        <div className="bg-gradient-to-br from-bg-surface via-black/80 to-[#021002] border border-border-glass text-white rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 rounded-full bg-green-500/10 blur-2xl"></div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-extrabold tracking-widest uppercase text-green-400 flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-green-400" /> Semester GPA Result
            </span>
            <p className="text-text-muted text-xs">Calculated based on autonomous rules.</p>
          </div>

          <div className="my-8 text-center space-y-2.5">
            <span className="block text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-green-300 to-green-500 font-sans tracking-tight">
              {gpaResult.toFixed(2)}
            </span>
            <span className="inline-block bg-green-500/10 text-green-350 text-[10px] font-mono font-bold px-3 py-1 rounded-full border border-green-500/30 uppercase tracking-widest">
              {gpaResult >= 9.0 ? 'Outstanding (O / Elite)' : gpaResult >= 8.0 ? 'A+ / Excellent' : gpaResult >= 6.0 ? 'Good Standing (B/A)' : 'Average / Clear papers'}
            </span>
          </div>

          <div className="border-t border-border-glass pt-4 flex justify-between text-xs text-text-muted">
            <span>Aggregated Course Units:</span>
            <span className="font-extrabold text-green-300">
              {courses.reduce((sum, c) => sum + c.credits, 0)} Credits
            </span>
          </div>
        </div>

        {/* CGPA Interactive Projections Panel */}
        <div className="glass-card rounded-2xl p-5 shadow-lg space-y-4">
          <h3 className="text-xs font-mono font-bold text-green-400 tracking-wider flex items-center gap-1.5 uppercase">
            <ChartLine className="h-4 w-4" /> CGPA Multi-Sem Projection
          </h3>
          <p className="text-text-muted text-xs leading-relaxed">
            Quickly estimate your cumulative grade point average (CGPA) based on previous semesters.
          </p>

          <div className="flex gap-2">
            {[2, 4, 6].map((num) => (
              <button
                key={num}
                onClick={() => setPastSemesterCount(num)}
                className={`flex-grow py-1.5 rounded-lg text-[10px] font-mono font-extrabold transition-all border cursor-pointer select-none ${
                  pastSemestersGpas.length === num 
                    ? 'bg-green-500/20 text-green-300 border-green-500/40 shadow-[0_0_10px_rgba(34,197,94,0.15)]' 
                    : 'bg-white/3 text-text-muted border-border-glass hover:bg-white/10 hover:text-white'
                }`}
              >
                {num} Semesters
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-2">
            {pastSemestersGpas.map((val, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4">
                <span className="text-xs font-semibold text-text-muted">Semester {idx + 1} GPA:</span>
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
                  className="w-24 bg-white/5 border border-border-glass rounded-xl px-2.5 py-1 text-xs text-right text-white focus:ring-1 focus:ring-green-400/20 focus:border-green-400 outline-none font-mono font-bold"
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleCalculateCgpa}
            className="w-full bg-green-500/10 hover:bg-green-500/20 hover:text-green-300 text-green-400 border border-green-500/30 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
          >
            Calculate Composite CGPA
          </button>

          {calculatedCgpa !== null && (
            <div className="bg-green-500/10 border border-green-500/30 p-3.5 rounded-xl flex items-center justify-between text-green-300">
              <span className="text-xs font-bold font-mono tracking-wide">COMPRESSED CGPA:</span>
              <span className="text-lg font-black text-white">{calculatedCgpa.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
