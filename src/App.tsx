/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import ContributorsView from './components/ContributorsView';
import ResourcesView from './components/ResourcesView';
import GpaCalculatorView from './components/GpaCalculatorView';
import StudyPlusView from './components/StudyPlusView';
import { INITIAL_CONTRIBUTORS, INITIAL_RESOURCES } from './data';
import { Contributor, Resource } from './types';
import { Heart, Landmark, Send, Sparkles, Copy, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  
  // App Sharing popup state
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load state from local storage or default to curated Sairam data
  useEffect(() => {
    const savedContributors = localStorage.getItem('sairam_contributors');
    const savedResources = localStorage.getItem('sairam_resources');

    if (savedContributors) {
      setContributors(JSON.parse(savedContributors));
    } else {
      setContributors(INITIAL_CONTRIBUTORS);
      localStorage.setItem('sairam_contributors', JSON.stringify(INITIAL_CONTRIBUTORS));
    }

    if (savedResources) {
      setResources(JSON.parse(savedResources));
    } else {
      setResources(INITIAL_RESOURCES);
      localStorage.setItem('sairam_resources', JSON.stringify(INITIAL_RESOURCES));
    }
  }, []);

  // Save state helpers
  const saveContributors = (list: Contributor[]) => {
    setContributors(list);
    localStorage.setItem('sairam_contributors', JSON.stringify(list));
  };

  const saveResources = (list: Resource[]) => {
    setResources(list);
    localStorage.setItem('sairam_resources', JSON.stringify(list));
  };

  // Add Contributor
  const handleAddContributor = (newC: Omit<Contributor, 'id' | 'contributionsCount'>) => {
    const freshContributor: Contributor = {
      ...newC,
      id: `contributor-${Date.now()}`,
      contributionsCount: 1, // Start with 1, as they are likely submitting a resource too
      avatarUrl: undefined, // Will render styled initials icon
      isUserAdded: true
    };

    const updated = [freshContributor, ...contributors];
    saveContributors(updated);
  };

  // Add Resource
  const handleAddResource = (newR: Omit<Resource, 'id' | 'downloadsCount' | 'likes'>) => {
    const freshResource: Resource = {
      ...newR,
      id: `resource-${Date.now()}`,
      downloadsCount: 0,
      likes: 0
    };

    // Update resources list
    const updatedResources = [freshResource, ...resources];
    saveResources(updatedResources);

    // Dynamic Credit: find if the uploader name matches an existing contributor, and increment their score!
    let contributorFound = false;
    const updatedContributors = contributors.map((c) => {
      if (c.name.toLowerCase() === newR.uploadedBy.toLowerCase()) {
        contributorFound = true;
        return { ...c, contributionsCount: c.contributionsCount + 1 };
      }
      return c;
    });

    // If uploader didn't exist in contributors, let's create a new contributor card for them automatically!
    if (!contributorFound) {
      const autoContributor: Contributor = {
        id: `contributor-${Date.now()}`,
        name: newR.uploadedBy,
        regNo: 'SEC-UPLOADER',
        department: newR.department,
        batch: '2023-2027',
        contributionsCount: 1,
        isUserAdded: true
      };
      saveContributors([autoContributor, ...contributors]);
    } else {
      saveContributors(updatedContributors);
    }
  };

  // Like Resource
  const handleLikeResource = (id: string) => {
    const updated = resources.map((r) =>
      r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r
    );
    saveResources(updated);
  };

  // Simulated Drive Notes Download Incrementor
  const handleDownloadResource = (id: string) => {
    const resItem = resources.find(r => r.id === id);
    if (!resItem) return;

    // Increment count
    const updated = resources.map((r) =>
      r.id === id ? { ...r, downloadsCount: (r.downloadsCount || 0) + 1 } : r
    );
    saveResources(updated);

    // Open drive URL (using standard _blank wrapper)
    window.open(resItem.downloadUrl, '_blank', 'noopener,noreferrer');
  };

  // Copy URL to clipboard
  const handleCopyLink = () => {
    const pageUrl = window.location.href;
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-700 font-sans antialiased selection:bg-indigo-600 selection:text-white">
      {/* Navbar segment */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onShareApp={() => setShowShareModal(true)} 
      />

      {/* Main Container Frame */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
          >
            {currentTab === 'home' && (
              <HomeView 
                setCurrentTab={setCurrentTab} 
                contributorsCount={contributors.length} 
                resourcesCount={resources.length} 
              />
            )}
            
            {currentTab === 'contributors' && (
              <ContributorsView 
                contributors={contributors} 
                onAddContributor={handleAddContributor} 
              />
            )}
            
            {currentTab === 'resources' && (
              <ResourcesView 
                resources={resources} 
                onDownloadResource={handleDownloadResource}
                onLikeResource={handleLikeResource}
                onAddResource={handleAddResource}
              />
            )}
            
            {currentTab === 'gpa' && (
              <GpaCalculatorView />
            )}
            
            {currentTab === 'study' && (
              <StudyPlusView />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Custom Sairam Footer (resembling Helpers layout footer) */}
      <footer className="bg-slate-900 text-slate-400 mt-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-8">
            <div className="text-center md:text-left space-y-1">
              <div className="flex items-center justify-center md:justify-start space-x-2 text-white">
                <Landmark className="h-5 w-5 text-indigo-400" />
                <span className="font-extrabold tracking-tight">THE HELPER — Sairam Space Open Source</span>
              </div>
              <p className="text-xs text-slate-500">Autonomous Academic Resource and GPA Platform made with 💙 for SSEC & SIT students.</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
              <button onClick={() => setCurrentTab('home')} className="hover:text-white transition-colors">Home</button>
              <button onClick={() => setCurrentTab('contributors')} className="hover:text-white transition-colors">Contributors</button>
              <button onClick={() => setCurrentTab('resources')} className="hover:text-white transition-colors">Resources</button>
              <button onClick={() => setCurrentTab('gpa')} className="hover:text-white transition-colors">HelperGPA+</button>
              <button onClick={() => setCurrentTab('study')} className="hover:text-white transition-colors">Study Plus</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-slate-500">
            <p className="flex items-center gap-1">
              <span>Made for Sairam, made by Sairamites</span>
              <Heart className="h-3.5 w-3.5 text-pink-500 fill-pink-500" />
            </p>
            <p className="text-[10px] tracking-wide">&copy; {new Date().getFullYear()} Sairam Academic Helper Portal. All educational assets belong to respective student creators.</p>
          </div>
        </div>
      </footer>

      {/* Share Dialog Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-slate-100 shadow-2xl p-6 relative overflow-hidden">
            
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h4 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-indigo-600" /> Share with Friends
              </h4>
              <button 
                onClick={() => setShowShareModal(false)}
                className="p-1 px-2.5 text-slate-400 hover:text-slate-700 bg-slate-50 rounded-lg text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-slate-500 leading-relaxed">
                Copy the link below and share it in your Sairam WhatsApp Groups, Discord servers, or Telegram channels with classmates!
              </p>

              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="w-full bg-transparent text-xs text-slate-600 font-mono focus:outline-none select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>

              {copied && (
                <p className="text-[10px] font-bold text-center text-emerald-600 flex items-center justify-center gap-1 animate-pulse">
                  ✓ Companion Link copied successfully!
                </p>
              )}

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80 flex items-start gap-2.5">
                <Info className="h-4.5 w-4.5 text-indigo-500 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-indigo-700 leading-relaxed">
                  <strong>Tip:</strong> Sairam Students can submit drive folders directly on our notes tab to expand the pool of notes. Let's study smarter.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

