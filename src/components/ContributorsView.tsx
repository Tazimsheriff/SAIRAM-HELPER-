/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Filter, Sparkles, Send, Award, Heart, HelpCircle, ExternalLink, Calendar, BookCheck, Shield } from 'lucide-react';
import { Contributor } from '../types';
import { SAIRAM_DEPARTMENTS } from '../data';
import { motion, AnimatePresence } from 'motion/react';

interface ContributorsViewProps {
  contributors: Contributor[];
  onAddContributor: (newContributor: Omit<Contributor, 'id' | 'contributionsCount'>) => void;
}

export default function ContributorsView({ contributors, onAddContributor }: ContributorsViewProps) {
  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    regNo: '',
    department: 'CSE',
    batch: '2023-2027',
    contactUrl: ''
  });
  const [formError, setFormError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Filter & Search Logic
  const filteredContributors = contributors.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.regNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || c.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  // Handle Join Application
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.regNo.trim()) {
      setFormError('Please fill in your Name and Registration Number.');
      return;
    }
    
    // Reg No simple check
    if (formData.regNo.length < 5) {
      setFormError('Please enter a valid Sairam registration number (e.g. SEC22CS045).');
      return;
    }

    onAddContributor({
      name: formData.name.trim(),
      regNo: formData.regNo.trim().toUpperCase(),
      department: formData.department,
      batch: formData.batch,
      contactUrl: formData.contactUrl.trim() || undefined
    });

    setIsSuccess(true);
    setFormError('');
    
    // Reset after success animation
    setTimeout(() => {
      setShowSubmitModal(false);
      setIsSuccess(false);
      setFormData({
        name: '',
        regNo: '',
        department: 'CSE',
        batch: '2023-2027',
        contactUrl: ''
      });
    }, 2200);
  };

  // Get Rank based on Contributions
  const getRankStats = (count: number) => {
    if (count >= 18) return { label: 'Grand Archon', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Award };
    if (count >= 12) return { label: 'Elite Contributor', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Shield };
    return { label: 'Sairam Helper', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Heart };
  };

  return (
    <div className="space-y-10">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight flex items-center justify-center gap-2">
          Valued Contributors Showcase <span className="text-amber-500">🎀</span>
        </h1>
        <p className="text-slate-500 text-sm leading-relaxed">
          Big thanks to all the talented students from Sri Sairam Engineering College & Sri Sairam Institute of Technology who have shared study materials, notes, lab manual answers, and code!
        </p>
        <button
          onClick={() => setShowSubmitModal(true)}
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-md cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-95"
        >
          <Sparkles className="h-4 w-4" />
          <span>Become a Contributor</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-100 p-4 sm:p-5 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search contributor or Reg. No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 placeholder-slate-400"
          />
        </div>

        {/* Filter Badges Directory */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-xs font-bold text-slate-400 mr-1.5 flex items-center space-x-1">
            <Filter className="h-3 w-3" />
            <span>DEPT:</span>
          </span>
          <button
            onClick={() => setSelectedDept('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold select-none transition-all ${
              selectedDept === 'All'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            All Branches
          </button>
          {SAIRAM_DEPARTMENTS.map((dept) => (
            <button
              key={dept.code}
              onClick={() => setSelectedDept(dept.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold select-none transition-all ${
                selectedDept === dept.code
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-600 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              {dept.code}
            </button>
          ))}
        </div>
      </div>

      {/* Contributors Grid */}
      <motion.div 
        layout 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredContributors.map((c) => {
            const rank = getRankStats(c.contributionsCount);
            const RankIcon = rank.icon;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={c.id}
                className={`group relative bg-white rounded-2xl border ${
                  c.isUserAdded 
                    ? 'border-indigo-400 shadow-indigo-100/50 ring-2 ring-indigo-500/10' 
                    : 'border-slate-100'
                } p-6 hover:shadow-md hover:border-slate-200 transition-all duration-300 flex flex-col justify-between`}
              >
                {/* User Joined Badge */}
                {c.isUserAdded && (
                  <span className="absolute -top-2.5 right-6 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Sparkles className="h-3 w-3" /> New Contributor
                  </span>
                )}

                <div>
                  {/* Avatar & Header */}
                  <div className="flex items-center space-x-4 mb-4">
                    {c.avatarUrl ? (
                      <img
                        src={c.avatarUrl}
                        alt={c.name}
                        referrerPolicy="no-referrer"
                        className="h-14 w-14 rounded-xl object-cover border border-slate-100 shadow-inner group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                        {c.name.split(' ')[0][0]}
                        {c.name.split(' ')[1] ? c.name.split(' ')[1][0] : ''}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5 group-hover:text-indigo-600 transition-colors">
                        {c.name}
                      </h3>
                      <p className="text-xs font-mono font-bold text-slate-400">{c.regNo}</p>
                    </div>
                  </div>

                  {/* Badges details block */}
                  <div className="space-y-2 mt-4 text-xs">
                    <div className="flex items-center justify-between text-slate-500 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                      <span className="font-semibold flex items-center gap-1 text-slate-400">
                        <Calendar className="h-3 w-3" /> Batch
                      </span>
                      <span className="font-bold text-slate-700">{c.batch}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500 bg-slate-50/50 p-2 rounded-xl border border-slate-100">
                      <span className="font-semibold flex items-center gap-1 text-slate-400">
                        <BookCheck className="h-3.5 w-3.5" /> Department
                      </span>
                      <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded text-[10px]">
                        {c.department}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score and Contact Button */}
                <div className="border-t border-slate-100 mt-5 pt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Contributions</span>
                    <span className="font-black text-slate-800 text-lg">{c.contributionsCount} items</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className={`p-1.5 px-2.5 rounded-lg border text-[10px] font-bold flex items-center space-x-1 ${rank.color}`}>
                      <RankIcon className="h-3 w-3" />
                      <span>{rank.label}</span>
                    </div>

                    {c.contactUrl && (
                      <a
                        href={c.contactUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-slate-50 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-slate-100 rounded-lg transition-colors"
                        title="Contact Contributor"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredContributors.length === 0 && (
          <div className="col-span-full py-16 text-center space-y-3 bg-white border border-slate-100 rounded-2xl">
            <HelpCircle className="h-10 w-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-700 text-lg">No Contributor Found</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">
              We couldn't find anyone matching "{searchTerm}" under branch "{selectedDept}".
            </p>
          </div>
        )}
      </motion.div>

      {/* Become Contributor Callout */}
      <section className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-xl font-bold text-slate-800">Want to join the hall as a contributor?</h2>
          <p className="text-slate-500 text-sm max-w-lg">
            Help Sairamites stay ahead! Submit your high-scoring handwritten notes, class slides, or solved lab manual drives. We feature every contributor instantly!
          </p>
        </div>
        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto justify-center"
        >
          <Sparkles className="h-4 w-4" />
          <span>Apply Online Now</span>
        </button>
      </section>

      {/* Modal Form Dialog */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-50 shadow-2xl p-6 relative overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-slate-800 text-lg">Join Sairam Hall of Fame</h3>
                <p className="text-xs text-slate-400 mt-1">Get credited as a valued academic contributor 🤩</p>
              </div>
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="p-1 px-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Content Logic */}
            {isSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <Send className="h-8 w-8 animate-bounce" />
                </div>
                <h4 className="text-xl font-black text-slate-800">Welcome on Board!</h4>
                <p className="text-sm text-slate-500">
                  Congratulations! You are officially scheduled as our newest Contributor. Your card has been successfully added.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-sm px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Roll / Registration No</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SEC22CS084"
                      value={formData.regNo}
                      onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                      className="w-full text-sm px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Batch</label>
                    <select
                      value={formData.batch}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                      className="w-full text-sm px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                    >
                      <option value="2022-2026">2022 - 2026</option>
                      <option value="2023-2027">2023 - 2027</option>
                      <option value="2024-2028">2024 - 2028</option>
                      <option value="2025-2029">2025 - 2029</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full text-sm px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                    >
                      {SAIRAM_DEPARTMENTS.map((dept) => (
                        <option key={dept.code} value={dept.code}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Social / Contact URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://t.me/your_handle"
                      value={formData.contactUrl}
                      onChange={(e) => setFormData({ ...formData, contactUrl: e.target.value })}
                      className="w-full text-sm px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                    />
                  </div>
                </div>

                {formError && (
                  <p className="text-xs font-semibold text-rose-500 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                    ⚠️ {formError}
                  </p>
                )}

                <div className="pt-3 border-t border-slate-100 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="w-1/2 py-2.5 text-slate-500 hover:text-slate-700 bg-slate-50 rounded-xl hover:bg-slate-100 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs hover:shadow transition-all"
                  >
                    Submit & Join
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
