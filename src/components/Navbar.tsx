/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GraduationCap, HeartHandshake, BookOpen, Calculator, Clock, Menu, X, Share2 } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onShareApp: () => void;
}

export default function Navbar({ currentTab, setCurrentTab, onShareApp }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: GraduationCap },
    { id: 'contributors', label: 'Contributors', icon: HeartHandshake },
    { id: 'resources', label: 'Syllabus & Notes', icon: BookOpen },
    { id: 'gpa', label: 'GPA Calculator', icon: Calculator },
    { id: 'study', label: 'Study Plus', icon: Clock },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-bg-surface/65 backdrop-blur-md border-b border-border-glass shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div 
            onClick={() => setCurrentTab('home')} 
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-800 shadow-[0_0_15px_rgba(34,197,94,0.3)] group-hover:scale-105 transition-all duration-300">
              <GraduationCap className="h-6 w-6 text-black" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-sans font-bold text-lg tracking-tight text-white">THE HELPER</span>
                <span className="text-[10px] bg-green-500/10 text-green-400 font-bold px-1.5 py-0.5 rounded border border-green-500/20">SAIRAM</span>
              </div>
              <p className="text-[10px] text-text-muted font-medium tracking-wide">Academic Student Companion 🎀</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex space-x-1.5 items-center">
            {navItems.map((item) => {
               const IconComp = item.icon;
               const isActive = currentTab === item.id;
               return (
                 <button
                   key={item.id}
                   onClick={() => {
                     setCurrentTab(item.id);
                     setIsOpen(false);
                   }}
                   className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 select-none ${
                     isActive
                       ? 'bg-green-500/10 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]'
                       : 'text-text-muted hover:text-green-300 hover:bg-white/3'
                   }`}
                 >
                   <IconComp className={`h-4.5 w-4.5 ${isActive ? 'text-green-400' : 'text-text-muted'}`} />
                   <span>{item.label}</span>
                 </button>
               );
            })}
            
            <span className="h-5 w-px bg-border-glass mx-1"></span>

            {/* Premium CTA Button */}
            <button
              onClick={onShareApp}
              className="flex items-center space-x-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/40 font-bold px-4 py-2 rounded-lg text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:shadow-[0_0_20px_rgba(34,197,94,0.25)] hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={onShareApp}
              className="p-2.5 rounded-lg bg-white/5 border border-border-glass text-text-muted hover:text-white"
            >
              <Share2 className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-text-muted hover:text-white hover:bg-white/5 focus:outline-none transition-colors duration-200"
            >
              {isOpen ? (
                <X className="h-6 w-6 block" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6 block" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-bg-surface/95 backdrop-blur-md border-b border-border-glass shadow-lg animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    setIsOpen(false);
                  }}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-left text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-green-500/10 text-green-400 border-l-4 border-green-500 pl-3'
                      : 'text-text-muted hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <IconComp className={`h-5 w-5 ${isActive ? 'text-green-400' : 'text-text-muted'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
