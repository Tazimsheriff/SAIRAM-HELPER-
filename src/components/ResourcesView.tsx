import React, { useState } from 'react';
import { Search, BookOpen, Download, Filter, PlusCircle, Sparkles, HelpCircle, Calendar, GraduationCap, Check, Send } from 'lucide-react';
import { Resource } from '../types';
import { SAIRAM_DEPARTMENTS } from '../data';
import { motion, AnimatePresence } from 'motion/react';

interface ResourcesViewProps {
  resources: Resource[];
  onDownloadResource: (id: string) => void;
  onLikeResource: (id: string) => void;
  onAddResource: (newResource: Omit<Resource, 'id' | 'downloadsCount' | 'likes'>) => void;
}

export default function ResourcesView({
  resources,
  onDownloadResource,
  onLikeResource,
  onAddResource
}: ResourcesViewProps) {
  // Navigation & Filter options
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<string>('All');
  
  // Submit resource form
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    subjectCode: '',
    subjectName: '',
    department: 'CSE',
    semester: 5,
    type: 'Notes' as Resource['type'],
    downloadUrl: '',
    uploadedBy: ''
  });
  const [formError, setFormError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Type color map
  const typeStyles = {
    'Notes': 'bg-green-500/10 text-green-300 border-green-500/20',
    'Question Paper': 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    'Lab Manual': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    'Syllabus': 'bg-amber-500/10 text-amber-300 border-amber-500/20'
  };

  // Filter logic
  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || r.department === selectedDept;
    const matchesSem = selectedSemester === 0 || r.semester === selectedSemester;
    const matchesType = selectedType === 'All' || r.type === selectedType;

    return matchesSearch && matchesDept && matchesSem && matchesType;
  });

  const semestersList = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subjectCode || !formData.subjectName || !formData.downloadUrl || !formData.uploadedBy) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (!formData.downloadUrl.includes('drive.google.com') && !formData.downloadUrl.includes('github.com') && !formData.downloadUrl.startsWith('http')) {
      setFormError('Please enter a valid link (Google Drive files/folders preferred).');
      return;
    }

    onAddResource({
      subjectCode: formData.subjectCode.trim().toUpperCase(),
      subjectName: formData.subjectName.trim(),
      department: formData.department,
      semester: Number(formData.semester),
      type: formData.type,
      downloadUrl: formData.downloadUrl.trim(),
      uploadedBy: formData.uploadedBy.trim(),
      fileSize: '4.5 MB' // Auto-simulated
    });

    setIsSuccess(true);
    setFormError('');

    setTimeout(() => {
      setShowUploadModal(false);
      setIsSuccess(false);
      // Reset form
      setFormData({
        subjectCode: '',
        subjectName: '',
        department: 'CSE',
        semester: 5,
        type: 'Notes',
        downloadUrl: '',
        uploadedBy: ''
      });
    }, 2200);
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Syllabus & Lecture Notes <span className="text-green-400">📚</span>
          </h1>
          <p className="text-text-muted text-xs sm:text-sm mt-1">Autonomous Regulation-2021 shared student study drives repository.</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center space-x-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/40 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:scale-[1.01] active:scale-95 transition-all self-start md:self-auto cursor-pointer"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          <span>Upload Study Drive</span>
        </button>
      </div>

      {/* 8-Semester Quick Navigator */}
      <div className="glass-card p-5 rounded-2xl shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-xs font-mono font-bold text-green-400 tracking-wider flex items-center gap-1.5 uppercase">
              <BookOpen className="h-4 w-4" /> Browse Notes by Semester
            </h3>
            <p className="text-[10px] text-text-muted font-medium">Select a semester node to quickly filter down our catalog</p>
          </div>
          <span className="text-[10px] text-green-400 font-extrabold bg-green-500/10 border border-green-500/25 px-2.5 py-1 rounded-lg">
            Regulation 2021 Syllabi
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {/* All Semesters Pill */}
          <button
            onClick={() => setSelectedSemester(0)}
            className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer text-center select-none ${
              selectedSemester === 0
                ? 'bg-green-500/20 text-green-300 border border-green-500/40 shadow-[0_0_10px_rgba(34,197,94,0.15)]'
                : 'bg-white/3 hover:bg-white/10 text-text-muted border border-border-glass'
            }`}
          >
            All Semesters
          </button>
          
          {semestersList.map((sem) => {
            const isActive = selectedSemester === sem;
            return (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 cursor-pointer text-center select-none flex flex-col justify-center items-center gap-0.5 ${
                  isActive
                    ? 'bg-green-500/20 text-green-300 border border-green-500/40 shadow-[0_0_10px_rgba(34,197,94,0.15)]'
                    : 'bg-white/3 hover:bg-white/10 text-text-muted border border-border-glass'
                }`}
              >
                <span>Sem {sem}</span>
                <span className={`text-[8px] font-mono font-bold tracking-tight px-1 py-0.25 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-green-500/10 text-green-450'}`}>
                  {sem % 2 === 0 ? 'EVEN' : 'ODD'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory Filter Panel */}
      <div className="glass-card p-5 rounded-2xl shadow-lg space-y-4">
        <h3 className="text-xs font-mono font-bold text-green-400 tracking-wider flex items-center gap-1.5 uppercase">
          <Filter className="h-3.5 w-3.5" /> Academic Filter Panel
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Branch Select */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Branch / Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/25 focus:border-green-400 text-white bg-bg-surface font-bold cursor-pointer"
            >
              <option value="All">All Branches</option>
              {SAIRAM_DEPARTMENTS.map((dept) => (
                <option key={dept.code} value={dept.code}>
                  {dept.code} - {dept.name.split(' & ')[0]}
                </option>
              ))}
            </select>
          </div>

          {/* Semester Select */}
          <div>
            <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="w-full text-xs px-3.5 py-2.5 border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/25 focus:border-green-400 text-white bg-bg-surface font-bold cursor-pointer"
            >
              <option value={0}>All Semesters</option>
              {semestersList.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem} {sem % 2 === 0 ? 'Even' : 'Odd'}
                </option>
              ))}
            </select>
          </div>

          {/* Type Select */}
          <div>
            <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/25 focus:border-green-400 text-white bg-bg-surface font-bold cursor-pointer"
            >
              <option value="All">All Materials</option>
              <option value="Notes">Notes Only</option>
              <option value="Question Paper">Question Papers</option>
              <option value="Lab Manual">Lab Manuals</option>
              <option value="Syllabus">Syllabus</option>
            </select>
          </div>

          {/* General Search Box */}
          <div>
            <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Search Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
              <input
                type="text"
                placeholder="Search code or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white/5 border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-400 text-white placeholder-text-muted/40"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resource Table / Grid Layout */}
      {/* Desktop View (Table) */}
      <div className="hidden md:block glass-card rounded-2xl shadow-lg border border-border-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border-glass bg-white/1 text-[10px] font-mono font-bold text-text-muted tracking-wider uppercase select-none">
                <th className="px-6 py-4">Subject Info</th>
                <th className="px-6 py-4">Department & Sem</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Size & Uploader</th>
                <th className="px-6 py-4 text-center">Popularity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-glass bg-white/1">
              <AnimatePresence mode="popLayout">
                {filteredResources.map((res) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    key={res.id}
                    className="hover:bg-green-500/3 transition-colors border-b border-border-glass"
                  >
                    {/* Code & Name */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="inline-block bg-white/5 text-green-300 font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-border-glass">
                          {res.subjectCode}
                        </span>
                        <p className="font-extrabold text-white text-sm max-w-sm line-clamp-1">{res.subjectName}</p>
                      </div>
                    </td>

                    {/* Department & Sem */}
                    <td className="px-6 py-4 text-xs font-bold text-text-muted">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-green-300 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded text-[10px]">
                          {res.department}
                        </span>
                        <span className="text-white">Sem {res.semester}</span>
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${typeStyles[res.type]}`}>
                        {res.type}
                      </span>
                    </td>

                    {/* Size & Author */}
                    <td className="px-6 py-4 text-xs text-text-muted">
                      <div className="space-y-0.5">
                        <p className="font-bold text-white/90">{res.fileSize}</p>
                        <p className="text-[10px] text-text-muted">By {res.uploadedBy}</p>
                      </div>
                    </td>

                    {/* Popularity stats */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center justify-center space-y-0.5">
                        <p className="font-mono font-bold text-green-300 text-xs">{res.downloadsCount || 0} hits</p>
                        <p className="text-[9px] text-text-muted">Sairamites reached</p>
                      </div>
                    </td>

                    {/* Actions download */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center space-x-1.5">
                        <button
                          onClick={() => onDownloadResource(res.id)}
                          className="inline-flex items-center space-x-1.5 bg-green-500 hover:bg-green-600 text-black font-extrabold text-[10px] tracking-wide uppercase px-3.5 py-2 rounded-xl shadow-[0_0_12px_rgba(34,197,94,0.3)] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Get Notes</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredResources.length === 0 && (
          <div className="py-16 text-center space-y-3 bg-bg-surface/30">
            <HelpCircle className="h-10 w-10 text-text-muted mx-auto" />
            <h4 className="font-extrabold text-white text-lg">No study files listed yet</h4>
            <p className="text-text-muted text-sm max-w-sm mx-auto">
              Be the first to submit materials for branch "{selectedDept}" in Semester {selectedSemester}!
            </p>
          </div>
        )}
      </div>

      {/* Mobile view (Sleek Study Cards with touch safe action targets) */}
      <div className="block md:hidden space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredResources.map((res) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              key={res.id}
              className="bg-bg-surface/50 border border-border-glass p-4 rounded-2xl shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span className="inline-block bg-white/5 text-green-300 font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-border-glass">
                    {res.subjectCode}
                  </span>
                  <p className="font-extrabold text-white text-sm leading-snug">{res.subjectName}</p>
                </div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${typeStyles[res.type]}`}>
                  {res.type}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 border-t border-border-glass text-xs text-text-muted">
                <div className="flex items-center space-x-1">
                  <span className="text-green-300 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded text-[9px] font-bold">
                    {res.department}
                  </span>
                  <span className="font-bold text-[10px] text-white">Sem {res.semester}</span>
                </div>
                <span className="text-border-glass">•</span>
                <span className="font-semibold text-white/80 text-[10px]">{res.fileSize}</span>
                <span className="text-border-glass">•</span>
                <span className="text-text-muted text-[10px]">By {res.uploadedBy}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-[10px] text-text-muted">
                  <span className="font-bold text-green-400">{res.downloadsCount || 0}</span> drive hits
                </div>
                <button
                  onClick={() => onDownloadResource(res.id)}
                  className="inline-flex items-center space-x-1.5 bg-green-500 hover:bg-green-650 text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-[0_0_12px_rgba(34,197,94,0.35)] transition-all active:scale-95 cursor-pointer touch-manipulation min-h-[44px]"
                >
                  <Download className="h-4 w-4" />
                  <span>Get Drive Notes</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredResources.length === 0 && (
          <div className="py-12 bg-bg-surface/50 border border-border-glass rounded-2xl text-center space-y-3 px-4">
            <HelpCircle className="h-10 w-10 text-green-400 mx-auto font-sans animate-pulse" />
            <h4 className="font-extrabold text-white text-base">No study files listed yet</h4>
            <p className="text-text-muted text-xs max-w-xs mx-auto">
              Be the first to submit materials for branch "{selectedDept}" in Semester {selectedSemester}!
            </p>
          </div>
        )}
      </div>

      {/* Showcase Form Upload Box Dialog */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-bg-surface border border-border-glass rounded-2xl max-w-lg w-full shadow-2xl p-6 relative overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-border-glass">
              <div>
                <h3 className="font-extrabold text-white text-lg">Upload study files</h3>
                <p className="text-xs text-text-muted mt-0.5">Your drives populate active notes mirrors instantly 🚀</p>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-1 px-2.5 text-text-muted hover:text-white bg-white/5 rounded-lg text-sm font-bold transition-all"
              >
                ✕
              </button>
            </div>

            {/* Upload form display */}
            {isSuccess ? (
              <div className="py-12 text-center space-y-4 animate-scaleUp">
                <div className="h-16 w-16 bg-green-500/15 text-green-400 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                  <Send className="h-8 w-8 text-green-400 animate-bounce" />
                </div>
                <h4 className="text-xl font-black text-white">Study File Submitted!</h4>
                <p className="text-sm text-text-muted max-w-xs mx-auto">
                  Your academic resource is now listed, and we have updated your contributions count. Awesome job!
                </p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Subject Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CCS339"
                      value={formData.subjectCode}
                      onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                      className="w-full text-xs px-4 py-2.5 bg-white/5 border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-450/25 focus:border-green-400 text-white placeholder-text-muted/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Resource Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as Resource['type'] })}
                      className="w-full text-xs px-3 py-2.5 bg-bg-surface border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-450/25 focus:border-green-400 text-white cursor-pointer"
                    >
                      <option value="Notes">Notes</option>
                      <option value="Question Paper">Question Paper</option>
                      <option value="Lab Manual">Lab Manual</option>
                      <option value="Syllabus">Syllabus</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Subject / Material Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Networks Unit 1 & 2 Complete handwritten slides"
                    value={formData.subjectName}
                    onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                    className="w-full text-xs px-4 py-2.5 bg-white/5 border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-450/25 focus:border-green-400 text-white placeholder-text-muted/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Branch / Dept</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 bg-bg-surface border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-450/25 focus:border-green-400 text-white cursor-pointer"
                    >
                      {SAIRAM_DEPARTMENTS.map((dept) => (
                        <option key={dept.code} value={dept.code}>
                          {dept.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Semester</label>
                    <select
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                      className="w-full text-xs px-3 py-2.5 bg-bg-surface border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-450/25 focus:border-green-400 text-white cursor-pointer"
                    >
                      {semestersList.map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Drive / Notes Link</label>
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={formData.downloadUrl}
                    onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                    className="w-full text-xs px-4 py-2.5 bg-white/5 border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-450/25 focus:border-green-400 text-white placeholder-text-muted/40"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Your Name for Credits</label>
                  <input
                    type="text"
                    required
                    placeholder="Your Name (e.g., Vigneshwaran M)"
                    value={formData.uploadedBy}
                    onChange={(e) => setFormData({ ...formData, uploadedBy: e.target.value })}
                    className="w-full text-xs px-4 py-2.5 bg-white/5 border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-450/25 focus:border-green-400 text-white placeholder-text-muted/40"
                  />
                </div>

                {formError && (
                  <p className="text-xs font-semibold text-rose-450 bg-rose-950/25 p-2.5 rounded-lg border border-rose-900/40">
                    ⚠️ {formError}
                  </p>
                )}

                <div className="pt-3 border-t border-border-glass flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="w-1/2 py-2.5 text-text-muted hover:text-white bg-white/5 rounded-xl hover:bg-white/10 text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 bg-green-500 hover:bg-green-600 text-black font-extrabold rounded-xl text-xs hover:shadow transition-all shadow-[0_0_15px_rgba(34,197,94,0.35)] cursor-pointer animate-pulse"
                  >
                    Submit Material
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
