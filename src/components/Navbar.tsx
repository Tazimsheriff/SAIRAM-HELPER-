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
    <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div 
            onClick={() => setCurrentTab('home')} 
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-amber-500 shadow-md group-hover:scale-105 transition-all duration-300">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-lg tracking-tight text-slate-800">THE HELPER</span>
                <span className="text-[10px] bg-indigo-50 text-indigo-600 font-bold px-1.5 py-0.5 rounded border border-indigo-100">SAIRAM</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">Academic Student Companion 🎀</p>
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
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <IconComp className={`h-4.5 w-4.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <span className="h-5 w-px bg-slate-200 mx-1"></span>

            {/* Premium CTA Button */}
            <button
              onClick={onShareApp}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-medium px-4 py-2 rounded-lg text-xs tracking-wider uppercase shadow hover:shadow-md hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={onShareApp}
              className="p-2.5 rounded-lg bg-slate-50 text-slate-500 hover:text-slate-700"
            >
              <Share2 className="h-4.5 w-4.5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-50 focus:outline-none transition-colors duration-200"
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
        <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-lg animate-fadeIn">
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
                      ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 pl-3'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <IconComp className={`h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
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
