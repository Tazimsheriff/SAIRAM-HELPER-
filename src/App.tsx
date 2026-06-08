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

// Firebase Integrations
import { auth, db, isUsingDummyConfig, handleFirestoreError, OperationType } from './firebase';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  
  // App Sharing popup state
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load and subscribe from Firebase if configured; fall back to local storage
  useEffect(() => {
    if (isUsingDummyConfig) {
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

      return;
    }

    // Real Firebase bindings
    const unsubscribeResources = onSnapshot(collection(db, 'resources'), (snapshot) => {
      if (snapshot.empty) {
        // Initial seeding on first connect
        INITIAL_RESOURCES.forEach(async (res) => {
          try {
            await setDoc(doc(db, 'resources', res.id), res);
          } catch (e) {
            console.error("Error seeding resource:", e);
          }
        });
      } else {
        const list: Resource[] = [];
        snapshot.forEach((docItem) => {
          list.push({ id: docItem.id, ...docItem.data() } as Resource);
        });
        setResources(list);
      }
    }, (error) => {
      console.error("Resources sync error:", error);
    });

    const unsubscribeContributors = onSnapshot(collection(db, 'contributors'), (snapshot) => {
      if (snapshot.empty) {
        // Seeding database
        INITIAL_CONTRIBUTORS.forEach(async (c) => {
          try {
            await setDoc(doc(db, 'contributors', c.id), c);
          } catch (e) {
            console.error("Error seeding contributor:", e);
          }
        });
      } else {
        const list: Contributor[] = [];
        snapshot.forEach((docItem) => {
          list.push({ id: docItem.id, ...docItem.data() } as Contributor);
        });
        setContributors(list);
      }
    }, (error) => {
      console.error("Contributors sync error:", error);
    });

    return () => {
      unsubscribeResources();
      unsubscribeContributors();
    };
  }, []);

  // State saving helpers for dummy fallback mode
  const saveContributors = (list: Contributor[]) => {
    setContributors(list);
    localStorage.setItem('sairam_contributors', JSON.stringify(list));
  };

  const saveResources = (list: Resource[]) => {
    setResources(list);
    localStorage.setItem('sairam_resources', JSON.stringify(list));
  };

  // Add Contributor
  const handleAddContributor = async (newC: Omit<Contributor, 'id' | 'contributionsCount'>) => {
    const id = `contributor-${Date.now()}`;
    const freshContributor: Contributor = {
      ...newC,
      id,
      contributionsCount: 1,
      avatarUrl: undefined,
      isUserAdded: true
    };

    if (isUsingDummyConfig) {
      const updated = [freshContributor, ...contributors];
      saveContributors(updated);
      return;
    }

    try {
      await setDoc(doc(db, 'contributors', id), freshContributor);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `contributors/${id}`);
    }
  };

  // Add Resource
  const handleAddResource = async (newR: Omit<Resource, 'id' | 'downloadsCount' | 'likes'>) => {
    const id = `resource-${Date.now()}`;
    const freshResource: Resource = {
      ...newR,
      id,
      downloadsCount: 0,
      likes: 0
    };

    if (isUsingDummyConfig) {
      const updatedResources = [freshResource, ...resources];
      saveResources(updatedResources);
      updateContributorsListForAdd(newR.uploadedBy, newR.department);
      return;
    }

    try {
      await setDoc(doc(db, 'resources', id), freshResource);
      
      // Update score or auto insert contributor on database
      const existingC = contributors.find(c => c.name.toLowerCase() === newR.uploadedBy.toLowerCase());
      if (existingC) {
        await updateDoc(doc(db, 'contributors', existingC.id), {
          contributionsCount: existingC.contributionsCount + 1
        });
      } else {
        const cid = `contributor-${Date.now()}`;
        const autoC: Contributor = {
          id: cid,
          name: newR.uploadedBy,
          regNo: 'SEC-UPLOADER',
          department: newR.department,
          batch: '2023-2027',
          contributionsCount: 1,
          isUserAdded: true
        };
        await setDoc(doc(db, 'contributors', cid), autoC);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `resources/${id}`);
    }
  };

  // Clean helper to update contributors score locally
  const updateContributorsListForAdd = (name: string, dept: string) => {
    let contributorFound = false;
    const updatedContributors = contributors.map((c) => {
      if (c.name.toLowerCase() === name.toLowerCase()) {
        contributorFound = true;
        return { ...c, contributionsCount: c.contributionsCount + 1 };
      }
      return c;
    });

    if (!contributorFound) {
      const autoContributor: Contributor = {
        id: `contributor-${Date.now()}`,
        name,
        regNo: 'SEC-UPLOADER',
        department: dept,
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
  const handleLikeResource = async (id: string) => {
    if (isUsingDummyConfig) {
      const updated = resources.map((r) =>
        r.id === id ? { ...r, likes: (r.likes || 0) + 1 } : r
      );
      saveResources(updated);
      return;
    }

    try {
      const targetR = resources.find(r => r.id === id);
      if (targetR) {
        await updateDoc(doc(db, 'resources', id), {
          likes: (targetR.likes || 0) + 1
        });
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `resources/${id}`);
    }
  };

  // Download Notes Incrementor
  const handleDownloadResource = async (id: string) => {
    const resItem = resources.find(r => r.id === id);
    if (!resItem) return;

    if (isUsingDummyConfig) {
      const updated = resources.map((r) =>
        r.id === id ? { ...r, downloadsCount: (r.downloadsCount || 0) + 1 } : r
      );
      saveResources(updated);
      window.open(resItem.downloadUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    try {
      await updateDoc(doc(db, 'resources', id), {
        downloadsCount: (resItem.downloadsCount || 0) + 1
      });
      window.open(resItem.downloadUrl, '_blank', 'noopener,noreferrer');
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `resources/${id}`);
    }
  };

  // Delete Resource
  const handleDeleteResource = async (id: string) => {
    if (isUsingDummyConfig) {
      const updated = resources.filter((r) => r.id !== id);
      saveResources(updated);
      return;
    }

    try {
      await deleteDoc(doc(db, 'resources', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, `resources/${id}`);
    }
  };

  // Copy URL
  const handleCopyLink = () => {
    const pageUrl = window.location.href;
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };


  return (
    <div className="min-h-screen flex flex-col bg-bg-base text-text-primary font-sans antialiased selection:bg-green-500 selection:text-black relative overflow-hidden">
      {/* Dynamic ambient radial glows */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full bg-green-500/12 blur-[120px] pointer-events-none z-0 -translate-x-[20%] -translate-y-[20%]" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-emerald-500/8 blur-[130px] pointer-events-none z-0 translate-x-[20%] translate-y-[20%]" />

      {/* Navbar segment */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        onShareApp={() => setShowShareModal(true)} 
        isUsingDummyConfig={isUsingDummyConfig}
      />

      {/* Main Container Frame */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10">
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
                onDeleteResource={handleDeleteResource}
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

      {/* Custom Sairam Footer */}
      <footer className="bg-bg-surface/60 border-t border-border-glass mt-16 backdrop-blur-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-border-glass pb-8">
            <div className="text-center md:text-left space-y-1.5">
              <div className="flex items-center justify-center md:justify-start space-x-2 text-white">
                <Landmark className="h-5 w-5 text-green-400" />
                <span className="font-sans font-extrabold tracking-tight text-white">THE HELPER — Sairam Space Open Source</span>
              </div>
              <p className="text-xs text-text-muted">Autonomous Academic Resource and GPA Platform made for SSEC & SIT students.</p>
              <p className="text-[10px] font-mono tracking-wider text-green-400 uppercase">COA Visualiser ideated & developed by Yatindra Rai</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
              <button onClick={() => setCurrentTab('home')} className="text-text-muted hover:text-green-400 transition-colors">Home</button>
              <button onClick={() => setCurrentTab('contributors')} className="text-text-muted hover:text-green-400 transition-colors">Contributors</button>
              <button onClick={() => setCurrentTab('resources')} className="text-text-muted hover:text-green-400 transition-colors">Resources</button>
              <button onClick={() => setCurrentTab('gpa')} className="text-text-muted hover:text-green-400 transition-colors">HelperGPA+</button>
              <button onClick={() => setCurrentTab('study')} className="text-text-muted hover:text-green-400 transition-colors">Study Plus</button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-xs text-text-muted">
            <p className="flex items-center gap-1">
              <span>Made with 💚 for Sairamites</span>
              <Heart className="h-3.5 w-3.5 text-green-400 fill-green-400 animate-pulse" />
            </p>
            <p className="text-[10px] tracking-wide text-center md:text-right">&copy; {new Date().getFullYear()} Sairam Academic Helper Portal. Under student open source initiative.</p>
          </div>
        </div>
      </footer>

      {/* Share Dialog Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-bg-surface border border-border-glass rounded-2xl max-w-sm w-full shadow-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-24 h-24 rounded-full bg-green-500/10 blur-xl pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-glass">
              <h4 className="font-extrabold text-white text-base flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-green-400" /> Share Portal
              </h4>
              <button 
                onClick={() => setShowShareModal(false)}
                className="p-1 px-2.5 text-text-muted hover:text-white bg-white/5 rounded-lg text-xs font-bold transition-all"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
                <span className="text-[10px] font-mono tracking-widest text-green-400 uppercase">Interactive Companion Network</span>
              </div>

              <p className="text-xs text-text-muted leading-relaxed">
                Copy the link below to share it in your Sairam WhatsApp Groups or Discord channels with fellow students!
              </p>

              <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-border-glass">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="w-full bg-transparent text-xs text-text-primary font-mono focus:outline-none select-all"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2 bg-green-500 hover:bg-green-600 text-black font-bold rounded-lg transition-all cursor-pointer shadow-[0_0_10px_rgba(34,197,94,0.3)]"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>

              {copied && (
                <p className="text-[10px] font-bold text-center text-green-400 flex items-center justify-center gap-1 animate-pulse">
                  ✓ Portal URL Copied!
                </p>
              )}

              <div className="bg-white/3 border border-border-glass p-3 rounded-xl flex items-start gap-2.5">
                <Info className="h-4.5 w-4.5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] text-text-muted leading-relaxed">
                  <strong>Tip:</strong> Sairam Students can submit their personal folders securely on our Notes catalog tab to grow the shared SSEC & SIT repository.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

