import React, { useState, useEffect } from 'react';
import { 
  Clock, Play, Square, RotateCcw, BookOpen, Youtube, FileText, 
  Calculator, Cpu, Binary, ArrowLeft, Trash2, Plus, Sparkles, AlertCircle, Send
} from 'lucide-react';
import { SAIRAM_DEPARTMENTS, getCoursesForDeptAndSemester } from '../data';
import { motion, AnimatePresence } from 'motion/react';

export default function StudyPlusView() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  
  // Custom toast notification states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // 1. Branch-Wise Subjects State
  const [selectedDept, setSelectedDept] = useState('CSE');
  const [selectedSemester, setSelectedSemester] = useState<number>(5);

  // 2. Pomodoro timer States
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timerMode, setTimerMode] = useState<'Work' | 'Break'>('Work');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            if (timerMode === 'Work') {
              setTimerMode('Break');
              setMinutes(5);
              triggerToast("Focus session complete! Time to take a short break. 🌸");
            } else {
              setTimerMode('Work');
              setMinutes(25);
              triggerToast("Break over! Let's resume engineering prep. 🚀");
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

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setMinutes(timerMode === 'Work' ? 25 : 5);
    setSeconds(0);
  };

  // 3. Focus YouTube States
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [activeVideoId, setActiveVideoId] = useState('Fj0X7c_sc80'); // Default COA / Computer Architecture video ID
  const recommendedLectures = [
    { title: 'Computer Organization & Architecture (Yatindra Rai)', id: 'Fj0X7c_sc80' },
    { title: 'Computer Networks Full Course in 4 Hours', id: 'IPvYjXCsS8I' },
    { title: 'Operating Systems Lectures for Semester Exams', id: 'vBURTt97EkA' },
    { title: 'Data Structures and Algorithms Playbook', id: '8hly31xKli0' }
  ];

  const handlePasteYoutube = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) return;
    
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = youtubeUrl.match(regExp);
    
    if (match && match[2].length === 11) {
      videoId = match[2];
    } else {
      videoId = youtubeUrl.trim(); 
    }

    if (videoId) {
      setActiveVideoId(videoId);
      triggerToast('Distraction-free lecture loaded!');
      setYoutubeUrl('');
    } else {
      triggerToast('Could not retrieve YouTube video ID. Check the link format!');
    }
  };

  // 4. Quick Notes States
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');

  // Load notes on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('sairam_study_quick_notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    } else {
      setNotes([
        "Boolean expressions simplify using K-Maps or Quine-McCluskey methods.",
        "MIPS Instruction set handles R-type, I-type, and J-type registers for execution.",
        "Remember to cite Yatindra Rai's COA visualizer charts during the mid-semester reviews!"
      ]);
    }
  }, []);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const updated = [newNote.trim(), ...notes];
    setNotes(updated);
    localStorage.setItem('sairam_study_quick_notes', JSON.stringify(updated));
    setNewNote('');
    triggerToast('Quick note captured!');
  };

  const handleDeleteNote = (idx: number) => {
    const updated = notes.filter((_, i) => i !== idx);
    setNotes(updated);
    localStorage.setItem('sairam_study_quick_notes', JSON.stringify(updated));
    triggerToast('Note discarded');
  };

  // 5. Number Converter States
  const [decVal, setDecVal] = useState('15');
  const [binVal, setBinVal] = useState('1111');
  const [hexVal, setHexVal] = useState('F');
  const [octVal, setOctVal] = useState('17');
  const [converterError, setConverterError] = useState<string | null>(null);

  const convertFromDecimal = (val: string) => {
    setDecVal(val);
    if (val === '') {
      setBinVal('');
      setHexVal('');
      setOctVal('');
      setConverterError(null);
      return;
    }
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      setConverterError('Please enter a valid base-10 number');
      return;
    }
    setConverterError(null);
    setBinVal(num.toString(2));
    setHexVal(num.toString(16).toUpperCase());
    setOctVal(num.toString(8));
  };

  const convertFromBinary = (val: string) => {
    setBinVal(val);
    if (val === '') {
      setDecVal('');
      setHexVal('');
      setOctVal('');
      setConverterError(null);
      return;
    }
    if (!/^[01]+$/.test(val)) {
      setConverterError('Binary digits must lock to only 0 & 1');
      return;
    }
    setConverterError(null);
    const num = parseInt(val, 2);
    setDecVal(num.toString(10));
    setHexVal(num.toString(16).toUpperCase());
    setOctVal(num.toString(8));
  };

  const convertFromHex = (val: string) => {
    const formatted = val.toUpperCase();
    setHexVal(formatted);
    if (val === '') {
      setDecVal('');
      setBinVal('');
      setOctVal('');
      setConverterError(null);
      return;
    }
    if (!/^[0-9A-F]+$/.test(formatted)) {
      setConverterError('Hex digits must lock to 0-9 and A-F');
      return;
    }
    setConverterError(null);
    const num = parseInt(formatted, 16);
    setDecVal(num.toString(10));
    setBinVal(num.toString(2));
    setOctVal(num.toString(8));
  };

  // 6. Logic Gate Simulator States
  const [selectedGate, setSelectedGate] = useState<'AND' | 'OR' | 'NOT' | 'XOR' | 'NAND' | 'NOR'>('AND');
  const [gateInA, setGateInA] = useState(true);
  const [gateInB, setGateInB] = useState(false);

  const getGateOutput = () => {
    if (selectedGate === 'AND') return gateInA && gateInB;
    if (selectedGate === 'OR') return gateInA || gateInB;
    if (selectedGate === 'NOT') return !gateInA;
    if (selectedGate === 'XOR') return gateInA !== gateInB;
    if (selectedGate === 'NAND') return !(gateInA && gateInB);
    if (selectedGate === 'NOR') return !(gateInA || gateInB);
    return false;
  };

  // 7. Binary array Operations states
  const [binOp, setBinOp] = useState<'AND' | 'OR' | 'XOR' | 'NOT'>('AND');
  const [opInA, setOpInA] = useState<boolean[]>([true, false, true, false]);
  const [opInB, setOpInB] = useState<boolean[]>([false, true, true, false]);

  const toggleBitA = (idx: number) => {
    setOpInA(prev => prev.map((bit, i) => (i === idx ? !bit : bit)));
    triggerToast('Inverted Register A Bit');
  };

  const toggleBitB = (idx: number) => {
    setOpInB(prev => prev.map((bit, i) => (i === idx ? !bit : bit)));
    triggerToast('Inverted Register B Bit');
  };

  const getBinaryOpResult = () => {
    return opInA.map((bitA, i) => {
      const bitB = opInB[i];
      if (binOp === 'AND') return bitA && bitB;
      if (binOp === 'OR') return bitA || bitB;
      if (binOp === 'XOR') return bitA !== bitB;
      if (binOp === 'NOT') return !bitA;
      return false;
    });
  };

  // Main list of 7 tools as shown in the screenshot!
  const toolsList = [
    {
      id: 'subjects',
      title: 'Branch-wise subjects',
      description: 'Semester-wise subjects core index maps',
      icon: BookOpen,
    },
    {
      id: 'timer',
      title: 'Study Timer',
      description: 'Pomodoro timer with responsive rest nodes',
      icon: Clock,
    },
    {
      id: 'youtube',
      title: 'Focus YouTube',
      description: 'Distraction-free video container loops without advertisements',
      icon: Youtube,
    },
    {
      id: 'notes',
      title: 'Quick Notes',
      description: 'Exam highlights revision scratchpad space',
      icon: FileText,
    },
    {
      id: 'converter',
      title: 'Number Converter',
      description: 'Instant Decimal, Binary, and Hex mapping tool',
      icon: Calculator,
    },
    {
      id: 'gates',
      title: 'Logic Gate Simulator',
      description: 'Visualize custom logic outputs dynamically',
      icon: Cpu,
    },
    {
      id: 'operations',
      title: 'Binary Operations',
      description: 'Interactive bitwise Register execution panel',
      icon: Binary,
    }
  ];

  return (
    <div className="relative min-h-[70vh] bg-black text-white p-6 sm:p-10 rounded-3xl border border-border-glass shadow-2xl selection:bg-green-500 overflow-hidden font-sans">
      
      {/* Absolute futuristic ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-950/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-950/10 rounded-full blur-3xl pointer-events-none" />

      {/* Slide-in notification banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -30 }}
            className="fixed top-8 right-6 left-6 sm:left-auto z-50 bg-slate-900/95 border border-green-500/30 text-white rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 max-w-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 text-green-300 rounded-xl border border-green-500/40">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[9px] font-mono font-bold tracking-wider text-green-400 uppercase">Interactive Terminal</p>
                <p className="text-xs font-bold text-slate-100">{toastMessage}</p>
              </div>
            </div>
            <button 
              onClick={() => setToastMessage(null)}
              className="text-slate-500 hover:text-white font-extrabold text-sm p-1 cursor-pointer"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!activeTool ? (
          // MAIN TOOLS DASHBOARD HUB
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-12 relative z-10"
          >
            {/* Header section */}
            <div className="text-center space-y-3">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white select-none">
                Helper <span className="text-transparent bg-clip-text bg-gradient-to-br from-green-300 to-green-500">Study Plus</span>
              </h1>
              <p className="text-text-muted text-xs sm:text-sm font-semibold max-w-lg mx-auto">
                Advanced diagnostic tools, converters, and timers to accelerate examination preparation.
              </p>
            </div>

            {/* Grid display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {toolsList.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <motion.div
                    key={tool.id}
                    whileHover={{ scale: 1.02, translateY: -2, borderColor: '#22c55e' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setActiveTool(tool.id);
                      triggerToast(`Switched workspace to ${tool.title}`);
                    }}
                    className="group bg-white/3 hover:bg-white/5 border border-border-glass p-6 rounded-2xl cursor-pointer transition-all duration-200 shadow-xl flex flex-col items-center text-center space-y-4 select-none min-h-[220px] justify-center"
                  >
                    {/* Green core frame */}
                    <div className="p-4 bg-green-500/10 text-green-300 rounded-2xl border border-green-500/30 transform group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(34,197,94,0.1)]">
                      <IconComponent className="h-6 w-6" />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-white text-base tracking-tight group-hover:text-green-300 transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-text-muted text-xs font-semibold max-w-[220px] mx-auto leading-relaxed">
                        {tool.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Custom footer */}
            <div className="pt-8 border-t border-border-glass flex justify-center text-center">
              <p className="text-[10px] font-mono text-text-muted tracking-wide uppercase">
                Academic visualization tools loaded & synced for Sairamites •{' '}
                <span className="text-green-400 font-extrabold hover:underline cursor-pointer">
                  Regulation-2021
                </span>
              </p>
            </div>
          </motion.div>
        ) : (
          // ACTIVE STUDY TOOL PANELS
          <motion.div
            key="active-tool"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-8 relative z-10"
          >
            {/* Header banner back navigator */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border-glass">
              <button
                onClick={() => setActiveTool(null)}
                className="flex items-center gap-2 text-xs font-extrabold text-text-muted hover:text-white bg-white/5 hover:bg-white/10 border border-border-glass px-4 py-2.5 rounded-xl cursor-pointer transition-all select-none"
              >
                <ArrowLeft className="h-4 w-4 text-green-400" />
                <span>Back to Study Tools</span>
              </button>
              
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-mono font-bold tracking-wider text-green-450 uppercase">
                  {toolsList.find(t => t.id === activeTool)?.title} Workspace
                </span>
              </div>
            </div>

            {/* 1. Branch-Wise Catalog */}
            {activeTool === 'subjects' && (
              <div className="space-y-6">
                <div className="glass-card p-6 rounded-2xl border border-border-glass space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-green-400" /> Departmental Subject Index
                      </h3>
                      <p className="text-xs text-text-muted">Review official Regulation-2021 autonomous subjects to map your notes easily.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono font-black text-text-muted tracking-wider">Select Department / Branch</label>
                      <select
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="w-full bg-bg-surface border border-border-glass p-3 text-xs rounded-xl font-bold text-white focus:border-green-450 outline-none cursor-pointer"
                      >
                        {SAIRAM_DEPARTMENTS.map((dept) => (
                          <option key={dept.code} value={dept.code}>
                            {dept.code} — {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono font-black text-text-muted tracking-wider">Select Academic Semester</label>
                      <select
                        value={selectedSemester}
                        onChange={(e) => setSelectedSemester(Number(e.target.value))}
                        className="w-full bg-bg-surface border border-border-glass p-3 text-xs rounded-xl font-bold text-white focus:border-green-450 outline-none cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <option key={sem} value={sem}>
                            Semester {sem} {sem % 2 === 0 ? '(EVEN)' : '(ODD)'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="glass-card border border-border-glass rounded-2xl overflow-hidden p-6 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-border-glass">
                    <h4 className="text-xs font-mono font-bold uppercase text-green-400 tracking-wider">
                      {selectedDept} - Semester {selectedSemester} Syllabus Catalog
                    </h4>
                    <span className="text-[10px] uppercase font-bold text-green-400 bg-green-500/10 border border-green-500/30 px-2 py-0.5 rounded">
                      Active Curriculum
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getCoursesForDeptAndSemester(selectedDept, selectedSemester).map((course) => (
                      <div 
                        key={course.id}
                        className="bg-white/3 p-4 rounded-xl border border-border-glass flex justify-between items-center gap-3 transition-colors hover:border-green-400/40"
                      >
                        <div>
                          <span className="text-[9px] font-mono font-black text-green-300 bg-green-500/10 border border-green-500/25 px-2 py-0.5 rounded mr-2">
                            {course.code}
                          </span>
                          <p className="text-xs font-extrabold text-slate-100 mt-1.5 leading-snug">{course.name}</p>
                        </div>
                        <span className="text-[10px] font-mono font-black text-text-muted bg-black/50 px-2.5 py-1.5 rounded-lg border border-border-glass shrink-0 text-center min-w-[70px]">
                          {course.credits} Cr
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 2. Pomodoro Timer */}
            {activeTool === 'timer' && (
              <div className="max-w-md mx-auto space-y-6">
                <div className="glass-card border border-border-glass p-8 rounded-3xl text-center space-y-8 shadow-2xl relative">
                  
                  {/* Glowing core timer ring effect */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto w-40 h-40 bg-green-500/5 rounded-full blur-2xl pointer-events-none" />

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-white text-base">Sairam Pomodoro Desk</h3>
                    <p className="text-xs text-text-muted">Maintain high focused bursts of engineering revision.</p>
                  </div>

                  {/* Mode Selector */}
                  <div className="grid grid-cols-2 gap-2 bg-bg-surface p-1.5 rounded-xl border border-border-glass">
                    <button
                      onClick={() => {
                        setIsActive(false);
                        setTimerMode('Work');
                        setMinutes(25);
                        setSeconds(0);
                      }}
                      className={`py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                        timerMode === 'Work'
                          ? 'bg-green-500/20 text-green-350 border border-green-500/35 shadow-[0_0_12px_rgba(34,197,94,0.15)]'
                          : 'text-text-muted hover:text-white'
                      }`}
                    >
                      Study Focus (25m)
                    </button>
                    <button
                      onClick={() => {
                        setIsActive(false);
                        setTimerMode('Break');
                        setMinutes(5);
                        setSeconds(0);
                      }}
                      className={`py-2 text-xs font-extrabold rounded-lg transition-all cursor-pointer ${
                        timerMode === 'Break'
                          ? 'bg-green-500/20 text-green-350 border border-green-500/35 shadow-[0_0_12px_rgba(34,197,94,0.15)]'
                          : 'text-text-muted hover:text-white'
                      }`}
                    >
                      Rest Break (5m)
                    </button>
                  </div>

                  {/* countdown digits */}
                  <div className="py-4 font-mono select-none">
                    <span className="text-7xl font-black text-white tracking-tight drop-shadow-[0_4px_12px_rgba(34,197,94,0.15)]">
                      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                    <span className={`block text-[10px] font-mono font-bold tracking-widest uppercase mt-4 ${
                      isActive ? 'text-green-400 animate-pulse' : 'text-text-muted'
                    }`}>
                      {isActive ? '● Count Down Initiated' : '⌛ Active Standby'}
                    </span>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={toggleTimer}
                      className={`flex-grow py-3 px-5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
                        isActive
                          ? 'bg-white/5 hover:bg-white/10 text-white border border-border-glass'
                          : 'bg-green-500 hover:bg-green-600 text-black shadow-lg shadow-green-500/10'
                      }`}
                    >
                      {isActive ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      <span>{isActive ? 'Pause Timer' : 'Begin Focus'}</span>
                    </button>
                    
                    <button
                      onClick={resetTimer}
                      className="py-3 px-5 bg-white/5 hover:bg-white/10 text-text-muted border border-border-glass rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
                    >
                      <RotateCcw className="h-4 w-4 text-green-400" />
                      <span>Reset</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. Focus YouTube */}
            {activeTool === 'youtube' && (
              <div className="space-y-6">
                <div className="glass-card p-6 rounded-2xl border border-border-glass space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Youtube className="h-5 w-5 text-green-400" /> Focus YouTube Cinema
                    </h3>
                    <p className="text-xs text-text-muted">Loads key videos in a zero-distraction container without recommended side loops or comments.</p>
                  </div>

                  {/* Video URL input */}
                  <form onSubmit={handlePasteYoutube} className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Paste continuous YouTube Lecture Link (or video code ID)..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      className="flex-grow bg-white/5 border border-border-glass px-4 py-3 text-xs rounded-xl font-semibold outline-none focus:border-green-400 text-slate-100 placeholder-slate-500"
                    />
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-black rounded-xl px-5 py-3 text-xs font-black tracking-wide shrink-0 transition-transform active:scale-95 cursor-pointer"
                    >
                      Load Video
                    </button>
                  </form>
                </div>

                {/* Main Embed Cinema Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Left embedded video frame */}
                  <div className="lg:col-span-8 bg-black rounded-2xl border border-border-glass overflow-hidden shadow-2xl aspect-video relative">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${activeVideoId}`}
                      title="Sairam Study Space YouTube Focus Viewer"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>

                  {/* Right recommended academic curated lectures list */}
                  <div className="lg:col-span-4 bg-white/3 border border-border-glass p-5 rounded-2xl flex flex-col justify-between">
                    <div className="space-y-4">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-green-450 pb-2 border-b border-border-glass flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-green-400" /> Curated Syllabus Guides
                      </h4>
                      
                      <div className="space-y-3">
                        {recommendedLectures.map((lec) => (
                          <div
                            key={lec.id}
                            onClick={() => {
                              setActiveVideoId(lec.id);
                              triggerToast(`Loaded: ${lec.title}`);
                            }}
                            className={`p-3 rounded-xl border text-xs cursor-pointer select-none transition-all ${
                              activeVideoId === lec.id
                                ? 'bg-green-500/15 border-green-500/35 text-white font-extrabold'
                                : 'bg-bg-surface border-border-glass text-text-muted hover:border-green-550'
                            }`}
                          >
                            <p>{lec.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-bg-surface border border-border-glass p-3.5 rounded-xl mt-4">
                      <p className="text-[10px] text-text-muted leading-relaxed font-mono">
                        💡 <strong>Hint:</strong> Use this distraction-free theater with our <em>Study Timer</em> running simultaneously in background to complete Unit checklists!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Quick Notes */}
            {activeTool === 'notes' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left note composition panel */}
                  <div className="lg:col-span-5 bg-white/3 p-6 rounded-2xl border border-border-glass space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        <FileText className="h-5 w-5 text-green-400" /> Unit Revision Scratchpad
                      </h3>
                      <p className="text-xs text-text-muted">Jot down temporary formula tricks. Saves to local state.</p>
                    </div>

                    <form onSubmit={handleAddNote} className="space-y-3">
                      <textarea
                        rows={4}
                        placeholder="Write down formula steps or concept answers here..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="w-full bg-bg-surface border border-border-glass p-3 text-xs rounded-xl font-semibold outline-none focus:border-green-400 text-slate-100 placeholder-slate-500 resize-none"
                      />
                      <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600 text-black rounded-xl py-3 text-xs font-bold tracking-wide shrink-0 transition-transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Plus className="h-4 w-4" /> Save Quick Note
                      </button>
                    </form>
                  </div>

                  {/* Right listed notes workspace */}
                  <div className="lg:col-span-7 bg-white/3 border border-border-glass p-6 rounded-2xl space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-border-glass">
                      <h4 className="text-xs font-mono font-bold uppercase text-green-450 tracking-wider">
                        My Saved Exam Scratchpads ({notes.length})
                      </h4>
                      {notes.length > 0 && (
                        <button
                          onClick={() => {
                            setNotes([]);
                            localStorage.removeItem('sairam_study_quick_notes');
                            triggerToast('All scratchpad notes cleared!');
                          }}
                          className="text-[10px] text-rose-450 hover:text-rose-400 font-extrabold cursor-pointer font-mono"
                        >
                          Clear All Notes
                        </button>
                      )}
                    </div>

                    {notes.length === 0 ? (
                      <div className="text-center py-12 space-y-2">
                        <FileText className="h-10 w-10 text-white/10 mx-auto" />
                        <p className="text-xs font-bold text-text-muted">No temporary scratchpads saved yet.</p>
                        <p className="text-[10px] text-text-muted/60 max-w-xs mx-auto">Compose notes on the left panel to preserve highlights for review before entering examinations!</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        <AnimatePresence>
                          {notes.map((note, idx) => (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.98 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, y: -10 }}
                              key={idx}
                              className="bg-bg-surface border border-border-glass p-4 rounded-xl flex justify-between gap-3 items-start group"
                            >
                              <div className="space-y-2">
                                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-green-500/10 border border-green-500/20 text-green-300">
                                  Point #{notes.length - idx}
                                </span>
                                <p className="text-xs font-bold text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                                  {note}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteNote(idx)}
                                className="text-text-muted hover:text-rose-400 p-1 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                                title="Discard note"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 5. Number Converter */}
            {activeTool === 'converter' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="glass-card p-8 rounded-3xl border border-border-glass space-y-6">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-green-400" /> CSE Number system Converter
                    </h3>
                    <p className="text-xs text-text-muted">Performs real-time conversion between Computer Organization number representation standards.</p>
                  </div>

                  {converterError && (
                    <div className="bg-rose-950/40 border border-rose-900/30 text-rose-300 p-3 rounded-xl flex items-center gap-2 text-xs">
                      <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
                      <p>{converterError}</p>
                    </div>
                  )}

                  <div className="space-y-4 font-mono">
                    {/* Decimal standard Base-10 */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-white/3 border border-border-glass p-3 rounded-2xl">
                      <div className="sm:col-span-3 text-xs font-mono font-bold uppercase text-green-400">Decimal (Base 10)</div>
                      <div className="sm:col-span-9">
                        <input
                          type="number"
                          value={decVal}
                          onChange={(e) => convertFromDecimal(e.target.value)}
                          placeholder="Type decimal number..."
                          className="w-full bg-bg-surface border border-transparent px-4 py-2 rounded-xl text-xs font-bold text-white outline-none focus:border-green-450"
                        />
                      </div>
                    </div>

                    {/* Binary standard Base-2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-white/3 border border-border-glass p-3 rounded-2xl">
                      <div className="sm:col-span-3 text-xs font-mono font-bold uppercase text-green-400">Binary (Base 2)</div>
                      <div className="sm:col-span-9">
                        <input
                          type="text"
                          value={binVal}
                          onChange={(e) => convertFromBinary(e.target.value)}
                          placeholder="Type binary series (0, 1)..."
                          className="w-full bg-bg-surface border border-transparent outline-none px-4 py-2 rounded-xl text-xs font-bold text-white focus:border-green-450"
                        />
                      </div>
                    </div>

                    {/* Hexadecimal standard Base-16 */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-white/3 border border-border-glass p-3 rounded-2xl">
                      <div className="sm:col-span-3 text-xs font-mono font-bold uppercase text-green-400">Hex (Base 16)</div>
                      <div className="sm:col-span-9">
                        <input
                          type="text"
                          value={hexVal}
                          onChange={(e) => convertFromHex(e.target.value)}
                          placeholder="Type hex string (A-F, 0-9)..."
                          className="w-full bg-bg-surface border border-transparent outline-none px-4 py-2 rounded-xl text-xs font-bold text-white focus:border-green-450 font-mono"
                        />
                      </div>
                    </div>

                    {/* Octal standard Base-8 */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-white/3 border border-border-glass p-3 rounded-2xl text-slate-400">
                      <div className="sm:col-span-3 text-xs font-mono font-bold uppercase text-text-muted/70">Octal (Base 8)</div>
                      <div className="sm:col-span-9">
                        <input
                          type="text"
                          value={octVal}
                          readOnly
                          className="w-full bg-black/40 border border-transparent outline-none px-4 py-2 rounded-xl text-xs font-bold text-green-300/40 cursor-not-allowed font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Logic Gate Simulator */}
            {activeTool === 'gates' && (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="glass-card p-8 rounded-3xl border border-border-glass space-y-6">
                  
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-green-400" /> Digital Logic Gates Lab Simulator
                    </h3>
                    <p className="text-xs text-text-muted">Visualize output logic signals for single-stage standard logic gates.</p>
                  </div>

                  {/* Gate Selector */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {(['AND', 'OR', 'NOT', 'XOR', 'NAND', 'NOR'] as const).map((gate) => (
                      <button
                        key={gate}
                        onClick={() => setSelectedGate(gate)}
                        className={`px-4 py-2 rounded-xl text-xs font-mono font-extrabold cursor-pointer transition-all ${
                          selectedGate === gate
                            ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                            : 'bg-white/4 hover:bg-white/10 text-text-muted border border-border-glass'
                        }`}
                      >
                        {gate}
                      </button>
                    ))}
                  </div>

                  {/* Operational Sandbox */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center bg-white/3 p-6 rounded-2xl border border-border-glass font-mono">
                    {/* Input Controls */}
                    <div className="space-y-4 flex flex-col justify-center">
                      <div className="space-y-1 text-center sm:text-left">
                        <span className="text-[10px] text-text-muted uppercase tracking-wider">Gate Input A</span>
                        <div className="flex justify-center sm:justify-start">
                          <button
                            onClick={() => setGateInA(!gateInA)}
                            className={`w-28 py-2 md:py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                              gateInA ? 'bg-emerald-600 border-transparent text-white' : 'bg-slate-900 border border-slate-850 text-slate-500'
                            }`}
                          >
                            {gateInA ? 'HIGH (1)' : 'LOW (0)'}
                          </button>
                        </div>
                      </div>

                      {selectedGate !== 'NOT' && (
                        <div className="space-y-1 text-center sm:text-left">
                          <span className="text-[10px] text-text-muted uppercase tracking-wider">Gate Input B</span>
                          <div className="flex justify-center sm:justify-start">
                            <button
                              onClick={() => setGateInB(!gateInB)}
                              className={`w-28 py-2 md:py-2.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                                gateInB ? 'bg-emerald-600 border-transparent text-white' : 'bg-slate-900 border border-slate-850 text-slate-500'
                              }`}
                            >
                              {gateInB ? 'HIGH (1)' : 'LOW (0)'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Logic Gate Symbol Mock Vector */}
                    <div className="flex flex-col items-center justify-center p-4 border border-border-glass bg-bg-surface rounded-2xl min-h-[120px]">
                      <span className="text-[10px] font-mono font-bold text-text-muted mb-1">Gate Schematic</span>
                      <div className="text-xl font-bold bg-green-500 text-black px-5 py-2 rounded-xl uppercase">
                        {selectedGate}
                      </div>
                      <div className="mt-2 text-[9px] text-green-400 font-mono font-bold tracking-wide">
                        {selectedGate === 'NOT' ? '1-Input node' : '2-Inputs node'}
                      </div>
                    </div>

                    {/* Computed Output */}
                    <div className="text-center space-y-2">
                      <span className="text-[10px] text-text-muted uppercase tracking-wider">Output Result Y</span>
                      <div className="flex justify-center">
                        <div className={`p-5 rounded-2xl border text-center transition-all ${
                          getGateOutput()
                            ? 'bg-green-500/10 border-green-500/30 text-green-300'
                            : 'bg-slate-900/90 border-slate-850 text-slate-500'
                        }`}>
                          <p className="text-3xl font-black font-mono">{getGateOutput() ? '1' : '0'}</p>
                          <p className="text-[9px] uppercase font-mono font-bold tracking-widest mt-1">
                            {getGateOutput() ? 'HIGH' : 'LOW'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Simulated Truth Table */}
                  <div className="bg-black/40 p-4 rounded-xl border border-border-glass overflow-x-auto font-mono text-center">
                    <p className="text-left text-[10px] uppercase font-mono font-bold text-green-400 pb-2 border-b border-border-glass mb-3">
                      Truth Table Reference: {selectedGate} Gate
                    </p>
                    
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-text-muted border-b border-border-glass">
                          <th className="pb-2">Input A</th>
                          {selectedGate !== 'NOT' && <th className="pb-2">Input B</th>}
                          <th className="pb-2 text-green-400">Output Y</th>
                          <th className="pb-2">State Match</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-glass">
                        {(selectedGate === 'NOT' ? [[1], [0]] : [[0,0], [0,1], [1,0], [1,1]]).map((row, i) => {
                          const a = row[0] === 1;
                          const b = row[1] === 1;
                          
                          let out = false;
                          if (selectedGate === 'AND') out = a && b;
                          else if (selectedGate === 'OR') out = a || b;
                          else if (selectedGate === 'NOT') out = !a;
                          else if (selectedGate === 'XOR') out = a !== b;
                          else if (selectedGate === 'NAND') out = !(a && b);
                          else if (selectedGate === 'NOR') out = !(a || b);

                          const isCurrentActive = selectedGate === 'NOT' 
                            ? (gateInA === a)
                            : (gateInA === a && gateInB === b);

                          return (
                            <tr 
                              key={i} 
                              className={`transition-colors ${isCurrentActive ? 'bg-green-500/10 text-white font-black' : 'text-slate-500'}`}
                            >
                              <td className="py-2">{a ? '1' : '0'}</td>
                              {selectedGate !== 'NOT' && <td className="py-2">{b ? '1' : '0'}</td>}
                              <td className={`py-2 ${isCurrentActive ? 'text-green-400' : ''}`}>{out ? '1' : '0'}</td>
                              <td className="py-2 text-[10px]">
                                {isCurrentActive ? '👉 Active' : 'Idle'}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Binary Operations */}
            {activeTool === 'operations' && (
              <div className="max-w-xl mx-auto space-y-6 font-mono">
                <div className="glass-card p-8 rounded-3xl border border-border-glass space-y-6">
                  
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      <Binary className="h-5 w-5 text-green-400" /> Bitwise Binary Operations Monitor
                    </h3>
                    <p className="text-xs text-text-muted">Perform discrete bitwise operations on custom 4-bit arrays. Click individual registers to flip values!</p>
                  </div>

                  {/* Operation Select Button Panel */}
                  <div className="grid grid-cols-4 gap-2 bg-bg-surface p-1 rounded-xl border border-border-glass">
                    {(['AND', 'OR', 'XOR', 'NOT'] as const).map((op) => (
                      <button
                        key={op}
                        onClick={() => setSelectedGate(op === 'NOT' ? 'NOT' : selectedGate) || setBinOp(op)}
                        className={`py-2 text-xs font-mono font-bold rounded-lg transition-all cursor-pointer ${
                          binOp === op
                            ? 'bg-green-500/20 text-green-300 border border-green-500/35'
                            : 'text-text-muted hover:text-white'
                        }`}
                      >
                        {op}
                      </button>
                    ))}
                  </div>

                  {/* Interactive Registers */}
                  <div className="space-y-4">
                    {/* Register A */}
                    <div className="bg-white/3 p-4 border border-border-glass rounded-2xl">
                      <div className="flex justify-between items-center mb-2 font-mono">
                        <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Register A (Input)</span>
                        <span className="text-[10px] text-green-405 font-bold">
                          Dec: {parseInt(opInA.map(b => b ? '1' : '0').join(''), 2)}
                        </span>
                      </div>
                      
                      <div className="flex gap-2 justify-center">
                        {opInA.map((bit, i) => (
                          <div
                            key={i}
                            onClick={() => toggleBitA(i)}
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black md:text-lg cursor-pointer transition-all select-none hover:scale-105 active:scale-95 border ${
                              bit 
                                ? 'bg-green-500/10 border-green-500/30 text-green-300' 
                                : 'bg-slate-900 border-slate-850 text-slate-500'
                            }`}
                          >
                            {bit ? '1' : '0'}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Operational Indicator Sign */}
                    <div className="flex justify-center">
                      <span className="px-4 py-1.5 bg-white/3 rounded-full text-xs font-mono font-bold text-green-300 border border-border-glass uppercase leading-none">
                        {binOp === 'AND' && 'BITWISE AND (&)'}
                        {binOp === 'OR' && 'BITWISE OR (|)'}
                        {binOp === 'XOR' && 'BITWISE XOR (^)'}
                        {binOp === 'NOT' && 'BITWISE NOT (~)'}
                      </span>
                    </div>

                    {/* Register B (Ignored in NOT operation) */}
                    {binOp !== 'NOT' && (
                      <div className="bg-white/3 p-4 border border-border-glass rounded-2xl">
                        <div className="flex justify-between items-center mb-2 font-mono">
                          <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Register B (Input)</span>
                          <span className="text-[10px] text-green-405 font-bold">
                            Dec: {parseInt(opInB.map(b => b ? '1' : '0').join(''), 2)}
                          </span>
                        </div>
                        
                        <div className="flex gap-2 justify-center">
                          {opInB.map((bit, i) => (
                            <div
                              key={i}
                              onClick={() => toggleBitB(i)}
                              className={`w-12 h-12 rounded-xl flex items-center justify-center font-black md:text-lg cursor-pointer transition-all select-none hover:scale-105 active:scale-95 border ${
                                bit 
                                  ? 'bg-green-500/10 border-green-500/30 text-green-300' 
                                  : 'bg-slate-900 border-slate-850 text-slate-500'
                              }`}
                            >
                              {bit ? '1' : '0'}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Equals Separator */}
                    <div className="h-px bg-border-glass my-4" />

                    {/* Output Register */}
                    <div className="bg-green-500/5 border border-green-500/30 p-5 rounded-3xl relative">
                      <div className="absolute top-3.5 right-4 text-[9px] uppercase font-mono font-bold text-green-400 tracking-wider animate-pulse">
                        Live outcome
                      </div>
                      <div className="flex flex-col items-center justify-center text-center space-y-3">
                        <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold font-mono">Output Register Y</span>
                        
                        <div className="flex gap-2 justify-center mt-1">
                          {getBinaryOpResult().map((bit, i) => (
                            <div
                              key={i}
                              className={`w-12 h-12 rounded-xl flex items-center justify-center font-black md:text-lg border transition-all ${
                                bit 
                                  ? 'bg-green-500 border-transparent text-black shadow-md shadow-green-500/20' 
                                  : 'bg-[#150d32]/90 border-border-glass text-slate-700'
                              }`}
                            >
                              {bit ? '1' : '0'}
                            </div>
                          ))}
                        </div>

                        <span className="text-xs font-mono font-bold text-white bg-white/5 px-3 py-1.5 rounded-lg border border-border-glass">
                          Result Decimal: {parseInt(getBinaryOpResult().map(b => b ? '1' : '0').join(''), 2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
