/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Clock, Play, Square, RotateCcw, Award, ChevronLeft, ChevronRight, HelpCircle, GraduationCap, Flame } from 'lucide-react';
import { STUDY_FLASHCARDS } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export default function StudyPlusView() {
  // Pomodoro timer States
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timerMode, setTimerMode] = useState<'Work' | 'Break'>('Work');
  
  // Custom toast notification states
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
  };

  // Flashcards state
  const [cardIdx, setCardIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [streakCount, setStreakCount] = useState(3); // cute simulated streak

  // Core Pomodoro Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Trigger mode swaps
            if (timerMode === 'Work') {
              setTimerMode('Break');
              setMinutes(5);
              triggerToast("Focus session complete! Time to take a short, healthy break. 🌸");
            } else {
              setTimerMode('Work');
              setMinutes(25);
              triggerToast("Break's over! Let's resume engineering prep. 🚀");
            }
            setIsActive(false);
          } else {
            setMinutes(prev => prev - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(prev => prev - 1);
        }
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, seconds, minutes, timerMode]);

  // Handle timer control buttons
  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    if (timerMode === 'Work') {
      setMinutes(25);
    } else {
      setMinutes(5);
    }
    setSeconds(0);
  };

  const selectTimerMode = (mode: 'Work' | 'Break') => {
    setIsActive(false);
    setTimerMode(mode);
    setMinutes(mode === 'Work' ? 25 : 5);
    setSeconds(0);
  };

  // Flashcards controls
  const handleCardFlip = () => setIsFlipped(!isFlipped);
  
  const handleNextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCardIdx(prev => (prev + 1) % STUDY_FLASHCARDS.length);
    }, 150);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCardIdx(prev => (prev - 1 + STUDY_FLASHCARDS.length) % STUDY_FLASHCARDS.length);
    }, 150);
  };

  return (
    <div className="relative">
      {/* Visual slide-in Toast Indicator */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-20 right-4 left-4 sm:left-auto sm:right-8 z-50 bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-800 flex items-center justify-between gap-3 max-w-sm animate-fadeIn"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-xl text-white shrink-0">
                <Clock className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Sairam Study Focus</p>
                <p className="text-xs font-bold text-slate-100">{toastMessage}</p>
              </div>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white font-extrabold text-sm p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Interactive flashcard desk */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
              <GraduationCap className="h-5.5 w-5.5 text-indigo-600" /> Exam Revision Flashcards
            </h2>
            <p className="text-slate-400 text-xs">Flip cards to review key questions and answers for Sairam Unit Exams.</p>
          </div>

          <div className="flex items-center space-x-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
            <Flame className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-bold font-mono">{streakCount}d Streak</span>
          </div>
        </div>

        {/* 3D Flip Card Container */}
        <div className="relative h-80 w-full perspective-1000">
          <div
            onClick={handleCardFlip}
            className={`cursor-pointer w-full h-full duration-500 transform-style-3d relative transition-transform ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
          >
            {/* Front Card Face */}
            <div className="absolute inset-0 bg-white border border-slate-100 rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow backface-hidden">
              <div className="space-y-4">
                <span className="inline-block bg-indigo-50 text-indigo-700 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider border border-indigo-100">
                  {STUDY_FLASHCARDS[cardIdx].subject}
                </span>
                <p className="text-lg font-black text-slate-800 leading-snug pt-2">
                  {STUDY_FLASHCARDS[cardIdx].question}
                </p>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold text-slate-400 border-t border-slate-50 pt-4">
                <span>Card {cardIdx + 1} of {STUDY_FLASHCARDS.length}</span>
                <span className="text-indigo-600">Click card to show answer →</span>
              </div>
            </div>

            {/* Back Card Face (Reversed) */}
            <div className="absolute inset-0 bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 flex flex-col justify-between shadow-xl rotate-y-180 backface-hidden">
              <div className="space-y-4 overflow-y-auto max-h-52 pr-1 select-text">
                <span className="inline-block bg-amber-500/10 text-amber-400 font-extrabold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider border border-amber-500/10">
                  Model Answer Key
                </span>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap font-medium">
                  {STUDY_FLASHCARDS[cardIdx].answer}
                </p>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold text-slate-500 border-t border-slate-800 pt-4">
                <span>Subject Expertise</span>
                <span className="text-amber-400">Click to flip front ←</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card toggles navigation bar */}
        <div className="flex items-center justify-between bg-white border border-slate-100 p-3 rounded-2xl">
          <button
            onClick={handlePrevCard}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleCardFlip}
            className="px-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200"
          >
            {isFlipped ? 'Show Question' : 'Reveal Answer'}
          </button>

          <button
            onClick={handleNextCard}
            className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Pomodoro Focus Timer Side Widget */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col items-center">
          <div className="text-center space-y-1 mb-6">
            <h3 className="font-bold text-slate-800 text-base flex items-center justify-center gap-1.5">
              <Clock className="h-4.5 w-4.5 text-indigo-600" /> Pomodoro Focus Timer
            </h3>
            <p className="text-xs text-slate-400">Keep concentration limits for tough units.</p>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-1.5 rounded-xl w-full">
            <button
              onClick={() => selectTimerMode('Work')}
              className={`py-2 text-xs font-extrabold rounded-lg transition-all ${
                timerMode === 'Work'
                  ? 'bg-white text-indigo-700 shadow border border-indigo-100/30'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Study Focus (25m)
            </button>
            <button
              onClick={() => selectTimerMode('Break')}
              className={`py-2 text-xs font-extrabold rounded-lg transition-all ${
                timerMode === 'Break'
                  ? 'bg-white text-indigo-700 shadow border border-indigo-100/30'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Rest Break (5m)
            </button>
          </div>

          {/* Core Tick Clock Display */}
          <div className="my-8 text-center select-none font-mono">
            <span className="text-6xl font-black text-slate-800 tracking-tight">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className={`block text-[10px] font-bold tracking-widest uppercase mt-2 ${
              isActive ? 'text-emerald-500 animate-pulse' : 'text-slate-400'
            }`}>
              {isActive ? 'Session Active' : 'Session Paused'}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3 w-full">
            <button
              onClick={toggleTimer}
              className={`w-2/3 py-3 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-2 transition-all ${
                isActive
                  ? 'bg-slate-800 hover:bg-slate-700 text-white'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/10'
              }`}
            >
              {isActive ? (
                <>
                  <Square className="h-4 w-4 fill-white" />
                  <span>Pause Session</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-white" />
                  <span>Start Session</span>
                </>
              )}
            </button>
            <button
              onClick={resetTimer}
              className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200/50 rounded-xl font-bold text-xs flex items-center justify-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Study tips sidebar */}
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 space-y-3.5">
          <h4 className="font-extrabold text-slate-800 text-xs tracking-wider uppercase flex items-center gap-1">
            <Award className="h-4 w-4 text-indigo-600" /> Sairam Exam Study Rules
          </h4>
          <ul className="space-y-2 text-xs text-slate-500 leading-relaxed">
            <li>• Allocate <strong>25 minutes of high focus</strong> to learn one units code or equations, then pause.</li>
            <li>• Use notes credited to Grand Archon contributors to find key formula guides first.</li>
            <li>• Go through past semester autonomous papers to map repeated questions.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  );
}
