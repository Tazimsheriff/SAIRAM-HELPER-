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
    if (count >= 18) return { label: 'Grand Archon', color: 'bg-amber-500/10 text-amber-300 border-amber-500/20', icon: Award };
    if (count >= 12) return { label: 'Elite Contributor', color: 'bg-green-500/10 text-green-300 border-green-500/20', icon: Shield };
    return { label: 'Sairam Helper', color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20', icon: Heart };
  };

  return (
    <div className="space-y-10">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
          Valued Contributors Showcase <span className="text-green-400">💚</span>
        </h1>
        <p className="text-text-muted text-xs sm:text-sm leading-relaxed">
          Big thanks to all the talented students from Sri Sairam Engineering College & Sri Sairam Institute of Technology who have shared study materials, notes, lab manual answers, and code!
        </p>
        <button
          onClick={() => setShowSubmitModal(true)}
          className="inline-flex items-center space-x-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 font-bold px-5 py-2.5 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.12)] cursor-pointer transition-all duration-200 hover:scale-[1.02] active:scale-95"
        >
          <Sparkles className="h-4 w-4" />
          <span>Become a Contributor</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/3 border border-border-glass p-4 sm:p-5 rounded-2xl shadow-lg flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-md">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search contributor or Reg. No..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-white/5 border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-400 transition-all text-white placeholder-text-muted/60"
          />
        </div>

        {/* Filter Badges Directory */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <span className="text-xs font-mono font-bold text-text-muted mr-1.5 flex items-center space-x-1">
            <Filter className="h-3 w-3 text-green-400" />
            <span>DEPT:</span>
          </span>
          <button
            onClick={() => setSelectedDept('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold select-none transition-all cursor-pointer ${
              selectedDept === 'All'
                ? 'bg-green-500/15 text-green-300 border border-green-500/30'
                : 'text-text-muted bg-white/3 hover:bg-white/10'
            }`}
          >
            All Branches
          </button>
          {SAIRAM_DEPARTMENTS.map((dept) => (
            <button
              key={dept.code}
              onClick={() => setSelectedDept(dept.code)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold select-none transition-all cursor-pointer ${
                selectedDept === dept.code
                  ? 'bg-green-500/15 text-green-300 border border-green-500/30'
                  : 'text-text-muted bg-white/3 hover:bg-white/10'
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
                className={`group relative rounded-2xl glass-card p-6 flex flex-col justify-between ${
                  c.isUserAdded 
                    ? 'border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.15)] ring-2 ring-green-500/10' 
                    : ''
                }`}
              >
                {/* User Joined Badge */}
                {c.isUserAdded && (
                  <span className="absolute -top-2.5 right-6 bg-gradient-to-r from-green-500 to-green-600 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Sparkles className="h-3 w-3" /> New Companion
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
                        className="h-14 w-14 rounded-xl object-cover border border-border-glass shadow-inner group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-700 flex items-center justify-center text-black font-black text-xl shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                        {c.name.split(' ')[0][0]}
                        {c.name.split(' ')[1] ? c.name.split(' ')[1][0] : ''}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-white text-base flex items-center gap-1.5 group-hover:text-green-300 transition-colors">
                        {c.name}
                      </h3>
                      <p className="text-xs font-mono font-bold text-green-400/80">{c.regNo}</p>
                    </div>
                  </div>

                  {/* Badges details block */}
                  <div className="space-y-2 mt-4 text-xs">
                    <div className="flex items-center justify-between text-text-muted bg-white/3 p-2 rounded-xl border border-border-glass">
                      <span className="font-semibold flex items-center gap-1 text-text-muted/70">
                        <Calendar className="h-3 w-3" /> Batch
                      </span>
                      <span className="font-bold text-white">{c.batch}</span>
                    </div>

                    <div className="flex items-center justify-between text-text-muted bg-white/3 p-2 rounded-xl border border-border-glass">
                      <span className="font-semibold flex items-center gap-1 text-text-muted/70">
                        <BookCheck className="h-3.5 w-3.5" /> Department
                      </span>
                      <span className="font-extrabold text-green-300 bg-green-500/10 px-2 py-0.5 rounded text-[10px]">
                        {c.department}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score and Contact Button */}
                <div className="border-t border-border-glass mt-5 pt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted/70">Contributions</span>
                    <span className="font-black text-white text-lg">{c.contributionsCount} items</span>
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
                        className="p-2 bg-white/3 text-text-muted hover:text-green-400 hover:bg-white/10 border border-[#234] rounded-lg transition-colors"
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
          <div className="col-span-full py-16 text-center space-y-3 bg-bg-surface/40 border border-border-glass rounded-2xl">
            <HelpCircle className="h-10 w-10 text-text-muted mx-auto" />
            <h3 className="font-bold text-white text-lg">No Contributor Found</h3>
            <p className="text-text-muted text-sm max-w-sm mx-auto">
              We couldn't find anyone matching "{searchTerm}" under branch "{selectedDept}".
            </p>
          </div>
        )}
      </motion.div>

      {/* Become Contributor Callout */}
      <section className="bg-bg-surface/40 border border-border-glass rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center sm:text-left">
          <h2 className="text-xl font-bold text-white">Want to join the repository as a contributor?</h2>
          <p className="text-text-muted text-sm max-w-lg">
            Help Sairamites stay ahead! Submit your high-scoring handwritten notes, class slides, or solved lab manual drives. We feature every contributor instantly!
          </p>
        </div>
        <button
          onClick={() => setShowSubmitModal(true)}
          className="flex items-center space-x-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 border border-green-500/40 font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto justify-center cursor-pointer"
        >
          <Sparkles className="h-4 w-4" />
          <span>Apply Online Now</span>
        </button>
      </section>

      {/* Modal Form Dialog */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fadeIn">
          <div className="bg-bg-surface border border-border-glass rounded-2xl max-w-md w-full shadow-2xl p-6 relative overflow-hidden">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-border-glass">
              <div>
                <h3 className="font-extrabold text-white text-lg">Join Sairam Hall of Fame</h3>
                <p className="text-xs text-text-muted mt-1">Get credited as a valued academic contributor 🤩</p>
              </div>
              <button 
                onClick={() => setShowSubmitModal(false)}
                className="p-1 px-2.5 text-text-muted hover:text-white bg-white/5 rounded-lg text-sm font-bold transition-all"
              >
                ✕
              </button>
            </div>

            {/* Content Logic */}
            {isSuccess ? (
              <div className="py-12 text-center space-y-4">
                <div className="h-16 w-16 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto shadow-md border border-green-500/30">
                  <Send className="h-8 w-8 animate-bounce text-green-450" />
                </div>
                <h4 className="text-xl font-black text-white">Welcome on Board!</h4>
                <p className="text-sm text-text-muted">
                  Congratulations! Your details have been submitted. Welcome to our active study network.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-4 py-2.5 bg-white/5 border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-450/25 focus:border-green-400 text-white placeholder-text-muted/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Registration No</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. SEC22CS084"
                      value={formData.regNo}
                      onChange={(e) => setFormData({ ...formData, regNo: e.target.value })}
                      className="w-full text-xs px-4 py-2.5 bg-white/5 border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-450/25 focus:border-green-400 text-white placeholder-text-muted/40"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Batch</label>
                    <select
                      value={formData.batch}
                      onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 bg-bg-surface border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-450/25 focus:border-green-400 text-white cursor-pointer"
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
                    <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 bg-bg-surface border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-450/25 focus:border-green-400 text-white cursor-pointer"
                    >
                      {SAIRAM_DEPARTMENTS.map((dept) => (
                        <option key={dept.code} value={dept.code}>
                          {dept.name} ({dept.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Social / Contact URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://t.me/your_handle"
                      value={formData.contactUrl}
                      onChange={(e) => setFormData({ ...formData, contactUrl: e.target.value })}
                      className="w-full text-xs px-4 py-2.5 bg-white/5 border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-450/25 focus:border-green-400 text-white placeholder-text-muted/40"
                    />
                  </div>
                </div>

                {formError && (
                  <p className="text-xs font-semibold text-rose-400 bg-rose-950/20 p-2.5 rounded-lg border border-rose-900/40">
                    ⚠️ {formError}
                  </p>
                )}

                <div className="pt-3 border-t border-border-glass flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="w-1/2 py-2.5 text-text-muted hover:text-white bg-white/5 rounded-xl hover:bg-white/10 text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 bg-green-500 hover:bg-green-600 text-black font-extrabold rounded-xl text-xs hover:shadow transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] cursor-pointer"
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
