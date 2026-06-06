/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

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
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">
        {/* Subtle decorative background circles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-600/30 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto text-center px-6 py-16 sm:py-20 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-semibold tracking-wider text-amber-300 uppercase mb-6 border border-white/5"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Sri Sairam Autonomous Portal (2021 Regulation Ready)</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight"
          >
            Sairam Academic <br />
            <span className="bg-gradient-to-r from-amber-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Companion Hub
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed"
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
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-indigo-500/20 hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <BookOpen className="h-5 w-5" />
              <span>Explore Materials</span>
            </button>
            <button
              onClick={() => setCurrentTab('contributors')}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold px-6 py-3 rounded-xl border border-slate-700 hover:border-slate-600 hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <HeartHandshake className="h-5 w-5 text-pink-400" />
              <span>Meet Contributors ({contributorsCount})</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Sairam Statistics Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Valued Contributors', value: `${contributorsCount}+`, icon: HeartHandshake, color: 'from-pink-500 to-rose-500', bg: 'bg-rose-50' },
          { label: 'Curated Notes & PYQs', value: `${resourcesCount}+`, icon: BookOpen, color: 'from-blue-500 to-indigo-500', bg: 'bg-indigo-50' },
          { label: 'Autonomous Regulation', value: 'R-2021', icon: ShieldCheck, color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-50' },
          { label: 'Autonomous Campuses', value: 'SEC & SIT', icon: Award, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div 
              key={i} 
              className="flex flex-col justify-between p-6 bg-white border border-slate-100 rounded-2xl shadow-sm transition-all duration-200 hover:shadow-md group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500 tracking-wide">{stat.label}</span>
                <div className={`p-2 rounded-xl ${stat.bg} text-slate-700 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className={`text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${stat.color}`}>
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
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Our Core Services</h2>
            <p className="text-sm text-slate-500 mt-1">Everything you need to streamline your semester preparation.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 - Syllabus & Notes */}
          <div className="flex flex-col justify-between p-6 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-md transition-all duration-300 group">
            <div>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mt-4 group-hover:text-blue-600 transition-colors">Study Resource directory</h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Filter and find high-quality handwritten lecture notes, official college lab manuals, and previous year's autonomous exam questions categorized by department and semester.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('resources')}
              className="flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-700 mt-6 group/btn"
            >
              <span>Explore study materials</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Feature 2 - GPA Calculator */}
          <div className="flex flex-col justify-between p-6 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-md transition-all duration-300 group">
            <div>
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl w-fit">
                <Calculator className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mt-4 group-hover:text-amber-600 transition-colors">Regulation-2021 GPA Engine</h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                An algorithm aligned with Sairam College’s autonomous regulations. Pre-populate default semester courses across branches to estimate your CGPA and Semester GPA instantly.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('gpa')}
              className="flex items-center space-x-1 text-xs font-bold text-amber-600 hover:text-amber-700 mt-6 group/btn"
            >
              <span>Calculate GPA</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Feature 3 - Study Plus */}
          <div className="flex flex-col justify-between p-6 rounded-2xl border border-slate-100 bg-white hover:border-indigo-100 hover:shadow-md transition-all duration-300 group">
            <div>
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
                <Clock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mt-4 group-hover:text-indigo-600 transition-colors">Study Plus & Flashcards</h3>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Prepare for Sairam Unit tests or Semester exam questions using interactive core-subject engineering flashcards, together with an integrated Pomodoro Study Timer.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('study')}
              className="flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 mt-6 group/btn"
            >
              <span>Boost focus</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Sairam Support and Community CTA */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center space-x-2 text-indigo-600 font-semibold text-sm justify-center md:justify-start">
            <GraduationCap className="h-5 w-5" />
            <span>Calling SSEC & SIT Students!</span>
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Got high-scoring study materials?</h2>
          <p className="text-slate-600 text-sm max-w-xl">
            You can earn respect, get featured permanently in our Hall of Contributors, and help thousands of Sairamites pass their autonomous exams with high marks.
          </p>
        </div>
        <button
          onClick={() => setCurrentTab('contributors')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:shadow-indigo-500/10 active:scale-95 transition-all w-full md:w-auto"
        >
          Upload & Join as Contributor
        </button>
      </section>
    </div>
  );
}
