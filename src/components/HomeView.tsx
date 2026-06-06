import React from 'react';
import { BookOpen, Calculator, HeartHandshake, Sparkles, Clock, ChevronRight, GraduationCap, Award, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  contributorsCount: number;
  resourcesCount: number;
}

export default function HomeView({ setCurrentTab, contributorsCount, resourcesCount }: HomeViewProps) {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl glass-card py-16 sm:py-20 px-6 lg:px-8 shadow-2xl">
        {/* Subtle decorative green radial glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-green-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-green-500/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-mono tracking-widest text-green-300 uppercase mb-6 border border-green-500/25"
          >
            <Sparkles className="h-3.5 w-3.5 text-green-400" />
            <span>Sri Sairam Autonomous Portal (2021 Regulation Ready)</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight"
          >
            Sairam Academic <br />
            <span className="bg-gradient-to-r from-white via-green-300 to-green-400 bg-clip-text text-transparent">
              Companion Hub
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-sm sm:text-base text-text-muted max-w-2xl mx-auto leading-relaxed"
          >
            Access curated lecture notes, exam question banks, lab sheets, and a smart GPA calculator custom structured for Sri Sairam Engineering College & Sri Sairam Institute of Technology.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap gap-4 justify-center"
          >
            <button
              onClick={() => setCurrentTab('resources')}
              className="flex items-center space-x-2 bg-green-500/20 hover:bg-green-500/35 text-green-300 font-bold px-6 py-3 rounded-xl border border-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.2)] hover:shadow-[0_0_25px_rgba(34,197,94,0.35)] hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <BookOpen className="h-5 w-5" />
              <span>Explore Materials</span>
            </button>
            <button
              onClick={() => setCurrentTab('contributors')}
              className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-white font-bold px-6 py-3 rounded-xl border border-border-glass hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <HeartHandshake className="h-5 w-5 text-green-400" />
              <span>Meet Contributors ({contributorsCount})</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Sairam Statistics Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Valued Contributors', value: `${contributorsCount}+`, icon: HeartHandshake, bg: 'bg-green-500/10 border-green-500/20 text-green-400' },
          { label: 'Curated Notes & PYQs', value: `${resourcesCount}+`, icon: BookOpen, bg: 'bg-green-500/10 border-green-500/20 text-green-400' },
          { label: 'Autonomous Regulation', value: 'R-2021', icon: ShieldCheck, bg: 'bg-green-500/10 border-green-500/20 text-green-400' },
          { label: 'Autonomous Campuses', value: 'SEC & SIT', icon: Award, bg: 'bg-green-500/10 border-green-500/20 text-green-400' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className="flex flex-col justify-between p-6 glass-card rounded-2xl transition-all duration-200 hover:-translate-y-0.5 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs uppercase font-mono tracking-widest text-text-muted">{stat.label}</span>
                <div className={`p-2 rounded-xl border ${stat.bg} group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-green-300 to-green-500">
                  {stat.value}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Primary Actions / Features Layout */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="w-full space-y-1">
            <div className="flex items-center gap-4">
              <span className="font-mono text-xs uppercase tracking-widest text-green-400">Our Core Services</span>
              <div className="h-px flex-grow bg-gradient-to-r from-green-500/25 to-transparent"></div>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Streamline Semester Prep</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 - Syllabus & Notes */}
          <div className="flex flex-col justify-between p-6 rounded-2xl glass-card transition-all duration-300 group hover:-translate-y-0.5">
            <div>
              <div className="p-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl w-fit">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mt-4 group-hover:text-green-300 transition-colors">Study Resource directory</h3>
              <p className="text-text-muted text-xs sm:text-sm mt-2 leading-relaxed">
                Filter and find high-quality handwritten lecture notes, official college lab manuals, and previous year's autonomous exam questions categorized by department and semester.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('resources')}
              className="flex items-center space-x-1 text-xs font-bold text-green-400 hover:text-green-300 mt-6 group/btn cursor-pointer"
            >
              <span>Explore study materials</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Feature 2 - GPA Calculator */}
          <div className="flex flex-col justify-between p-6 rounded-2xl glass-card transition-all duration-300 group hover:-translate-y-0.5">
            <div>
              <div className="p-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl w-fit">
                <Calculator className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mt-4 group-hover:text-green-300 transition-colors">Regulation-2021 GPA Engine</h3>
              <p className="text-text-muted text-xs sm:text-sm mt-2 leading-relaxed">
                An algorithm aligned with Sairam College’s autonomous regulations. Pre-populate default semester courses across branches to estimate your CGPA and Semester GPA instantly.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('gpa')}
              className="flex items-center space-x-1 text-xs font-bold text-green-400 hover:text-green-300 mt-6 group/btn cursor-pointer"
            >
              <span>Calculate GPA</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Feature 3 - Study Plus */}
          <div className="flex flex-col justify-between p-6 rounded-2xl glass-card transition-all duration-300 group hover:-translate-y-0.5">
            <div>
              <div className="p-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl w-fit">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mt-4 group-hover:text-green-300 transition-colors">Study Plus & Flashcards</h3>
              <p className="text-text-muted text-xs sm:text-sm mt-2 leading-relaxed">
                Prepare for Sairam Unit tests or Semester exam questions using interactive core-subject engineering flashcards, together with an integrated Pomodoro Study Timer.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('study')}
              className="flex items-center space-x-1 text-xs font-bold text-green-400 hover:text-green-300 mt-6 group/btn cursor-pointer"
            >
              <span>Boost focus</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Sairam Support and Community CTA */}
      <section className="bg-bg-surface/40 hover:bg-bg-surface/50 border border-border-glass rounded-2xl p-6 sm:p-8 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300">
        <div className="space-y-4 text-center md:text-left">
          <div className="flex items-center space-x-2 text-green-400 font-semibold text-sm justify-center md:justify-start">
            <GraduationCap className="h-5 w-5" />
            <span className="font-mono uppercase tracking-widest text-xs">SSEC & SIT Student Union</span>
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-white tracking-tight">Have valuable study materials?</h2>
            <p className="text-text-muted text-xs sm:text-sm max-w-xl">
              Earn permanent respect, get featured actively in our Hall of Contributors repository, and help thousands of Sairamites ace their autonomous examinations.
            </p>
          </div>
        </div>
        <button
          onClick={() => setCurrentTab('contributors')}
          className="bg-green-500/15 hover:bg-green-500/25 text-green-300 border border-green-500/40 font-bold px-6 py-3.5 rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.1)] hover:shadow-[0_0_20px_rgba(34,197,94,0.25)] hover:scale-[1.01] active:scale-95 transition-all w-full md:w-auto cursor-pointer"
        >
          Upload & Join Contributors Repo
        </button>
      </section>
    </div>
  );
}
