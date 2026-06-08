import React, { useState } from 'react';
import { 
  Search, BookOpen, Download, Filter, PlusCircle, Sparkles, HelpCircle, 
  Calendar, GraduationCap, Check, Send, Trash2, ShieldAlert, Clock, 
  UserCheck, Lock, Unlock, CheckCircle2, XCircle, History
} from 'lucide-react';
import { Resource } from '../types';
import { SAIRAM_DEPARTMENTS } from '../data';
import { motion, AnimatePresence } from 'motion/react';

interface ResourcesViewProps {
  resources: Resource[];
  onDownloadResource: (id: string) => void;
  onLikeResource: (id: string) => void;
  onAddResource: (newResource: Omit<Resource, 'id' | 'downloadsCount' | 'likes'>) => void;
  onDeleteResource: (id: string) => void;
}

interface ModeratorAction {
  id: string;
  type: 'ADD' | 'DELETE';
  timestamp: string;
  contributorName: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
  reason?: string;
  subjectCode?: string;
  subjectName?: string;
  department?: string;
  semester?: number;
  materialType?: Resource['type'];
  downloadUrl?: string;
  targetResourceId?: string;
  targetResource?: Omit<Resource, 'id' | 'downloadsCount' | 'likes'>;
}

export default function ResourcesView({
  resources,
  onDownloadResource,
  onLikeResource,
  onAddResource,
  onDeleteResource
}: ResourcesViewProps) {
  // Navigation & Filter options
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<string>('All');
  
  // Custom Role State (Simulating: student | contributor | admin)
  const [userRole, setUserRole] = useState<'student' | 'contributor' | 'admin'>(() => {
    const saved = localStorage.getItem('sairam_user_role');
    return (saved as 'student' | 'contributor' | 'admin') || 'student';
  });

  const [showAuditLogs, setShowAuditLogs] = useState(false);

  // Submit resource form states
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [formData, setFormData] = useState({
    subjectCode: '',
    subjectName: '',
    department: 'CSE',
    semester: 5,
    type: 'Notes' as Resource['type'],
    downloadUrl: '',
    uploadedBy: ''
  });
  const [formError, setFormError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Deletion Proposal form states
  const [showDeletionModal, setShowDeletionModal] = useState(false);
  const [selectedResourceForDeletion, setSelectedResourceForDeletion] = useState<Resource | null>(null);
  const [deletionContributorName, setDeletionContributorName] = useState('');
  const [deletionReason, setDeletionReason] = useState('');

  // Toast notifier states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Moderator actions approval list
  const [pendingActions, setPendingActions] = useState<ModeratorAction[]>(() => {
    const saved = localStorage.getItem('sairam_moderator_actions');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'act-1',
        type: 'ADD',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        contributorName: 'Abishek S',
        status: 'PENDING',
        subjectCode: 'CCS356',
        subjectName: 'Object Oriented Analysis & Design Unit 4 & 5 Complete Reference PDF',
        department: 'CSE',
        semester: 5,
        materialType: 'Notes',
        downloadUrl: 'https://drive.google.com/drive/folders/1Sairam_OOAD_Unit4',
        targetResource: {
          subjectCode: 'CCS356',
          subjectName: 'Object Oriented Analysis & Design Unit 4 & 5 Complete Reference PDF',
          department: 'CSE',
          semester: 5,
          type: 'Notes',
          downloadUrl: 'https://drive.google.com/drive/folders/1Sairam_OOAD_Unit4',
          uploadedBy: 'Abishek S',
          fileSize: '12.4 MB'
        }
      },
      {
        id: 'act-2',
        type: 'DELETE',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        contributorName: 'Ramya Devi R',
        status: 'PENDING',
        reason: 'The drive folder is showing empty or deleted file node.',
        targetResourceId: 'r4',
        subjectCode: 'CCS349',
        subjectName: 'Data Structures Lab Manual with Solutions'
      }
    ];
  });

  const saveActions = (list: ModeratorAction[]) => {
    setPendingActions(list);
    localStorage.setItem('sairam_moderator_actions', JSON.stringify(list));
  };

  const handleRoleChange = (role: 'student' | 'contributor' | 'admin') => {
    setUserRole(role);
    localStorage.setItem('sairam_user_role', role);
    triggerToast(`Active profile switched to ${role.toUpperCase()} simulated console.`);
  };

  // Propose/Delete actions submission
  const handleProposeDeletion = (res: Resource) => {
    if (userRole === 'student') {
      triggerToast('🔒 Access Restricted: Regular students cannot request note deletion.');
      return;
    }
    setSelectedResourceForDeletion(res);
    setDeletionContributorName(userRole === 'contributor' ? 'Abishek S' : '');
    setDeletionReason('');
    setShowDeletionModal(true);
  };

  const handleDeletionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deletionContributorName.trim() || !deletionReason.trim()) {
      triggerToast('Please provide moderator name and a valid reason.');
      return;
    }

    if (!selectedResourceForDeletion) return;

    if (userRole === 'admin') {
      // Admins delete directly
      onDeleteResource(selectedResourceForDeletion.id);
      triggerToast(`Removed [${selectedResourceForDeletion.subjectCode}] directly from Sairam catalog.`);
      
      const instantLog: ModeratorAction = {
        id: `act-${Date.now()}`,
        type: 'DELETE',
        timestamp: new Date().toISOString(),
        contributorName: 'Administrator (Direct Exec)',
        status: 'APPROVED',
        reason: deletionReason.trim() + ' (Direct Exec)',
        targetResourceId: selectedResourceForDeletion.id,
        subjectCode: selectedResourceForDeletion.subjectCode,
        subjectName: selectedResourceForDeletion.subjectName
      };
      saveActions([instantLog, ...pendingActions]);
      setShowDeletionModal(false);
    } else {
      // Contributors queue a proposal
      const action: ModeratorAction = {
        id: `act-${Date.now()}`,
        type: 'DELETE',
        timestamp: new Date().toISOString(),
        contributorName: deletionContributorName.trim(),
        status: 'PENDING',
        reason: deletionReason.trim(),
        targetResourceId: selectedResourceForDeletion.id,
        subjectCode: selectedResourceForDeletion.subjectCode,
        subjectName: selectedResourceForDeletion.subjectName
      };

      saveActions([action, ...pendingActions]);
      triggerToast(`Removal proposal for ${selectedResourceForDeletion.subjectCode} sent to Admin queue.`);
      setShowDeletionModal(false);
    }
  };

  // Authorize Pending Moderator queues
  const handleAuthorizeAction = (actionId: string, decision: 'APPROVED' | 'DECLINED') => {
    const updated = pendingActions.map((a) => {
      if (a.id === actionId) {
        return { ...a, status: decision };
      }
      return a;
    });

    const targetAction = pendingActions.find(a => a.id === actionId);
    if (!targetAction) return;

    if (decision === 'APPROVED') {
      if (targetAction.type === 'ADD' && targetAction.targetResource) {
        onAddResource(targetAction.targetResource);
        triggerToast(`APPROVED: Uploaded "${targetAction.subjectName}" to live drives.`);
      } else if (targetAction.type === 'DELETE' && targetAction.targetResourceId) {
        onDeleteResource(targetAction.targetResourceId);
        triggerToast(`APPROVED: Removed "${targetAction.subjectName}" from live drives.`);
      }
    } else {
      triggerToast(`CANCELED: Declined proposal submitted by ${targetAction.contributorName}.`);
    }

    saveActions(updated);
  };

  // Type color map
  const typeStyles = {
    'Notes': 'bg-green-500/10 text-green-300 border-green-500/20',
    'Question Paper': 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    'Lab Manual': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    'Syllabus': 'bg-amber-500/10 text-amber-300 border-amber-500/20'
  };

  // Filter logic
  const filteredResources = resources.filter((r) => {
    const matchesSearch =
      r.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.subjectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || r.department === selectedDept;
    const matchesSem = selectedSemester === 0 || r.semester === selectedSemester;
    const matchesType = selectedType === 'All' || r.type === selectedType;

    return matchesSearch && matchesDept && matchesSem && matchesType;
  });

  const semestersList = [1, 2, 3, 4, 5, 6, 7, 8];

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subjectCode || !formData.subjectName || !formData.downloadUrl || !formData.uploadedBy) {
      setFormError('Please fill in all required fields.');
      return;
    }

    if (!formData.downloadUrl.includes('drive.google.com') && !formData.downloadUrl.includes('github.com') && !formData.downloadUrl.startsWith('http')) {
      setFormError('Please enter a valid link (Google Drive files/folders preferred).');
      return;
    }

    if (userRole === 'student') {
      setFormError('Authorization Error: Student accounts are restricted from modifying catalog records.');
      return;
    }

    const freshTargetResource = {
      subjectCode: formData.subjectCode.trim().toUpperCase(),
      subjectName: formData.subjectName.trim(),
      department: formData.department,
      semester: Number(formData.semester),
      type: formData.type,
      downloadUrl: formData.downloadUrl.trim(),
      uploadedBy: formData.uploadedBy.trim(),
      fileSize: '6.4 MB'
    };

    if (userRole === 'admin') {
      // Direct update
      onAddResource(freshTargetResource);
      setIsSuccess(true);
      triggerToast(`Published resource ${formData.subjectCode} onto Sairam drive as Administrator.`);
    } else {
      // Moderator proposal
      const newProposal: ModeratorAction = {
        id: `act-${Date.now()}`,
        type: 'ADD',
        timestamp: new Date().toISOString(),
        contributorName: formData.uploadedBy.trim(),
        status: 'PENDING',
        subjectCode: formData.subjectCode.trim().toUpperCase(),
        subjectName: formData.subjectName.trim(),
        department: formData.department,
        semester: Number(formData.semester),
        materialType: formData.type,
        downloadUrl: formData.downloadUrl.trim(),
        targetResource: freshTargetResource
      };

      saveActions([newProposal, ...pendingActions]);
      setIsSuccess(true);
    }

    setFormError('');

    setTimeout(() => {
      setShowUploadModal(false);
      setIsSuccess(false);
      // Reset form
      setFormData({
        subjectCode: '',
        subjectName: '',
        department: 'CSE',
        semester: 5,
        type: 'Notes',
        downloadUrl: '',
        uploadedBy: ''
      });
    }, 2400);
  };

  return (
    <div className="space-y-8 relative">
      
      {/* Sliding Notification Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            className="fixed top-24 right-6 left-6 sm:left-auto z-50 bg-slate-900 border border-green-500/30 text-white rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-center justify-between gap-4 max-w-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 text-green-300 rounded-xl border border-green-500/30">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[9px] font-mono font-bold tracking-wider text-green-450 uppercase">Moderator System Note</p>
                <p className="text-xs font-extrabold text-slate-100">{toastMessage}</p>
              </div>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-slate-500 hover:text-white p-1">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role Switcher Deck */}
      <div className="glass-card bg-slate-950/60 border border-green-500/20 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-5 shadow-[0_0_20px_rgba(34,197,94,0.05)]">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <ShieldAlert className="h-4 w-4 text-green-400" />
            <h2 className="text-xs font-sans font-black text-white tracking-tight uppercase">
              Dynamic Sairam Moderation & Approval Desk
            </h2>
          </div>
          <p className="text-[11px] text-text-muted leading-relaxed">
            Simulate academic profiles to test our multi-tiered Moderation loop. Contributors propose; Admins approve.
          </p>
        </div>
        
        <div className="flex bg-white/3 p-1 rounded-xl border border-border-glass shrink-0">
          {(['student', 'contributor', 'admin'] as const).map((role) => (
            <button
              key={role}
              onClick={() => handleRoleChange(role)}
              className={`px-3.5 py-2.5 text-xs font-black tracking-wide rounded-lg uppercase cursor-pointer transition-all select-none flex items-center gap-1.5 ${
                userRole === role
                  ? 'bg-green-500 text-black shadow-md shadow-green-500/10'
                  : 'text-text-muted hover:text-white'
              }`}
            >
              {role === 'student' && <GraduationCap className="h-3.5 w-3.5" />}
              {role === 'contributor' && <UserCheck className="h-3.5 w-3.5" />}
              {role === 'admin' && <Lock className="h-3.5 w-3.5" />}
              <span>{role}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ADMIN CONTROL DESK */}
      {userRole === 'admin' && (
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card bg-slate-950/90 border border-green-500/30 p-6 rounded-2xl space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-24 h-24 rounded-full bg-green-500/10 blur-xl pointer-events-none"></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-glass">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-green-500/10 text-green-300 border border-green-500/30 rounded-xl">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-tight">Sairam Space Admin Control Desk</h3>
                <p className="text-xs text-text-muted">Review and authorize pending contributions from academic moderators.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-550 animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-green-400">Admin Live Sandbox</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-mono font-black text-green-300 tracking-wider uppercase flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> Pending Authorizations ({pendingActions.filter(a => a.status === 'PENDING').length})
            </h4>
            
            {pendingActions.filter(a => a.status === 'PENDING').length === 0 ? (
              <div className="py-8 text-center border border-dashed border-border-glass rounded-xl text-text-muted text-xs font-medium bg-black/10">
                🕊️ No actions await moderation. Beautiful! All entries are fully in-sync.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {pendingActions.filter(a => a.status === 'PENDING').map((action) => (
                  <div key={action.id} className="p-4 bg-white/2 border border-border-glass rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-green-500/20 transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold tracking-wide ${
                          action.type === 'ADD' 
                            ? 'bg-blue-500/15 text-blue-300 border border-blue-500/25' 
                            : 'bg-rose-500/15 text-rose-300 border border-rose-550/25'
                        }`}>
                          {action.type === 'ADD' ? 'PROPOSAL: ADD DRIVE' : 'PROPOSAL: REMOVE DRIVE'}
                        </span>
                        <span className="text-[10px] text-text-muted">sub by <strong className="text-white">{action.contributorName}</strong></span>
                        <span className="text-border-glass">•</span>
                        <span className="text-[10px] text-text-muted font-mono">{new Date(action.timestamp).toLocaleTimeString()}</span>
                      </div>

                      {action.type === 'ADD' ? (
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold text-slate-100 flex items-center gap-1.5">
                            <span className="text-[9px] font-mono text-green-300 bg-white/5 border border-border-glass px-1.5 py-0.25 rounded">{action.subjectCode}</span> 
                            {action.subjectName}
                          </p>
                          <p className="text-[10px] text-text-muted">
                            Branch: <strong className="text-slate-300">{action.department}</strong> | Semester: <strong className="text-slate-300">{action.semester}</strong> | Type: <strong className="text-slate-300">{action.materialType}</strong> | Link: <a href={action.downloadUrl} target="_blank" rel="noreferrer" className="text-green-400 font-semibold hover:underline bg-white/3 px-1 py-0.25 rounded">{action.downloadUrl?.substring(0, 32)}...</a>
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <p className="text-xs font-extrabold text-white/95">
                            Remove Resource: <span className="text-rose-300">{action.subjectName}</span> ({action.subjectCode})
                          </p>
                          <p className="text-[10px] text-rose-450 leading-relaxed font-semibold">
                            Reason: <span className="italic">"{action.reason}"</span>
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Approval Buttons */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                      <button 
                        onClick={() => handleAuthorizeAction(action.id, 'APPROVED')}
                        className="bg-green-500 hover:bg-green-600 text-black font-extrabold text-[10px] tracking-wider uppercase px-3.5 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-green-500/10 flex items-center gap-1.5 hover:scale-[1.01] active:translate-y-0.5 transition-all text-center min-h-[38px]"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Approve</span>
                      </button>
                      <button 
                        onClick={() => handleAuthorizeAction(action.id, 'DECLINED')}
                        className="bg-white/5 hover:bg-white/10 hover:text-rose-400 border border-border-glass text-text-muted font-bold text-[10px] tracking-wider uppercase px-3.5 py-2.5 rounded-xl cursor-pointer flex items-center gap-1.5 hover:scale-[1.01] active:translate-y-0.5 transition-all"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Decline</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Audit Logs Trail */}
            <div className="pt-4 border-t border-border-glass space-y-3">
              <button 
                onClick={() => setShowAuditLogs(!showAuditLogs)}
                className="text-xs font-mono font-bold text-green-400 hover:underline flex items-center gap-1.5 cursor-pointer"
              >
                <History className="h-4 w-4" />
                <span>{showAuditLogs ? '▼ Close Administration Logs' : '▶ Open Administration Logs'}</span>
              </button>

              {showAuditLogs && (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 bg-black/30 p-3 rounded-xl border border-border-glass">
                  {pendingActions.filter(a => a.status !== 'PENDING').length === 0 ? (
                    <p className="text-[10px] text-text-muted font-mono italic">No actions archived. Approve or Decline proposals above to track logs.</p>
                  ) : (
                    pendingActions.filter(a => a.status !== 'PENDING').map(action => (
                      <div key={action.id} className="p-2.5 bg-black/20 border border-border-glass rounded-lg text-[10px] font-mono flex justify-between items-center gap-3">
                        <div className="space-y-0.5">
                          <p className="text-slate-200 font-extrabold">
                            [{action.type}] {action.subjectCode} - {action.subjectName}
                          </p>
                          <p className="text-text-muted">
                            Initiated by {action.contributorName} • Decision is logged.
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wide ${
                          action.status === 'APPROVED' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/15 text-rose-400 border border-rose-550/20'
                        }`}>
                          {action.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Page Title & Proposal trigger */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-2">
            Syllabus & Lecture Notes <span className="text-green-400">📚</span>
          </h1>
          <p className="text-text-muted text-xs sm:text-sm mt-1">
            Autonomous Regulation-2021 shared student study drives repository.
          </p>
        </div>
        <button
          onClick={() => {
            if (userRole === 'student') {
              triggerToast('🔒 Restricted: Switch profile representation to Contributor or Admin to write files!');
            } else {
              setShowUploadModal(true);
            }
          }}
          className={`inline-flex items-center space-x-2 border font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all self-start md:self-auto cursor-pointer ${
            userRole === 'student'
              ? 'bg-white/3 text-text-muted/65 border-border-glass cursor-not-allowed opacity-50'
              : 'bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/40 shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:scale-[1.01] active:scale-95'
          }`}
        >
          <PlusCircle className="h-4.5 w-4.5" />
          <span>Propose Note Drive</span>
        </button>
      </div>

      {/* 8-Semester Quick Navigator */}
      <div className="glass-card p-5 rounded-2xl shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h3 className="text-xs font-mono font-bold text-green-400 tracking-wider flex items-center gap-1.5 uppercase">
              <BookOpen className="h-4 w-4" /> Browse Notes by Semester
            </h3>
            <p className="text-[10px] text-text-muted font-medium">Select a semester node to quickly filter down our catalog</p>
          </div>
          <span className="text-[10px] text-green-400 font-extrabold bg-green-500/10 border border-green-500/25 px-2.5 py-1 rounded-lg">
            Regulation 2021 Syllabi
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          <button
            onClick={() => setSelectedSemester(0)}
            className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all active:scale-95 cursor-pointer text-center select-none ${
              selectedSemester === 0
                ? 'bg-green-500/20 text-green-300 border border-green-500/40 shadow-[0_0_10px_rgba(34,197,94,0.15)]'
                : 'bg-white/3 hover:bg-white/10 text-text-muted border border-border-glass'
            }`}
          >
            All Semesters
          </button>
          
          {semestersList.map((sem) => {
            const isActive = selectedSemester === sem;
            return (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`py-2 px-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 cursor-pointer text-center select-none flex flex-col justify-center items-center gap-0.5 ${
                  isActive
                    ? 'bg-green-500/20 text-green-300 border border-green-500/40 shadow-[0_0_10px_rgba(34,197,94,0.15)]'
                    : 'bg-white/3 hover:bg-white/10 text-text-muted border border-border-glass'
                }`}
              >
                <span>Sem {sem}</span>
                <span className={`text-[8px] font-mono font-bold tracking-tight px-1 py-0.25 rounded ${isActive ? 'bg-white/20 text-white' : 'bg-green-500/10 text-green-400'}`}>
                  {sem % 2 === 0 ? 'EVEN' : 'ODD'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Directory Filter Panel */}
      <div className="glass-card p-5 rounded-2xl shadow-lg space-y-4">
        <h3 className="text-xs font-mono font-bold text-green-400 tracking-wider flex items-center gap-1.5 uppercase">
          <Filter className="h-3.5 w-3.5" /> Academic Filter Panel
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Branch / Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/25 focus:border-green-400 text-white bg-bg-surface font-bold cursor-pointer"
            >
              <option value="All">All Branches</option>
              {SAIRAM_DEPARTMENTS.map((dept) => (
                <option key={dept.code} value={dept.code}>
                  {dept.code} - {dept.name.split(' & ')[0]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Semester</label>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="w-full text-xs px-3.5 py-2.5 border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/25 focus:border-green-400 text-white bg-bg-surface font-bold cursor-pointer"
            >
              <option value={0}>All Semesters</option>
              {semestersList.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem} {sem % 2 === 0 ? 'Even' : 'Odd'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/25 focus:border-green-400 text-white bg-bg-surface font-bold cursor-pointer"
            >
              <option value="All">All Materials</option>
              <option value="Notes">Notes Only</option>
              <option value="Question Paper">Question Papers</option>
              <option value="Lab Manual">Lab Manuals</option>
              <option value="Syllabus">Syllabus</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Search Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
              <input
                type="text"
                placeholder="Search code or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white/5 border border-border-glass rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400/20 focus:border-green-400 text-white placeholder-text-muted/40 font-semibold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Resource Table (Desktop) */}
      <div className="hidden md:block glass-card rounded-2xl shadow-lg border border-border-glass overflow-hidden bg-bg-surface/30">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border-glass bg-white/1 text-[10px] font-mono font-bold text-text-muted tracking-wider uppercase select-none">
                <th className="px-6 py-4">Subject Info</th>
                <th className="px-6 py-4">Department & Sem</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Size & Uploader</th>
                <th className="px-6 py-4 text-center">Popularity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-glass bg-white/1">
              <AnimatePresence mode="popLayout">
                {filteredResources.map((res) => (
                  <motion.tr
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    key={res.id}
                    className="hover:bg-green-500/3 transition-colors border-b border-border-glass"
                  >
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <span className="inline-block bg-white/5 text-green-300 font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-border-glass">
                          {res.subjectCode}
                        </span>
                        <p className="font-extrabold text-white text-sm max-w-sm line-clamp-1">{res.subjectName}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-bold text-text-muted">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-green-300 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded text-[10px]">
                          {res.department}
                        </span>
                        <span className="text-white">Sem {res.semester}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${typeStyles[res.type as keyof typeof typeStyles]}`}>
                        {res.type}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs text-text-muted">
                      <div className="space-y-0.5">
                        <p className="font-bold text-white/95">{res.fileSize}</p>
                        <p className="text-[10px] text-text-muted">By {res.uploadedBy}</p>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center justify-center space-y-0.5">
                        <p className="font-mono font-bold text-green-300 text-xs">{res.downloadsCount || 0} hits</p>
                        <p className="text-[9px] text-text-muted">Sairamites reached</p>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center space-x-1.5">
                        {/* Remove Action */}
                        <button
                          onClick={() => handleProposeDeletion(res)}
                          className={`p-2 rounded-xl border cursor-pointer transition-all active:scale-95 flex items-center justify-center min-h-[34px] min-w-[34px] ${
                            userRole === 'student'
                              ? 'bg-white/2 border-border-glass text-slate-500 opacity-30 hover:opacity-100 hover:border-slate-400 hover:text-white'
                              : 'bg-rose-500/10 hover:bg-rose-600 hover:text-white text-rose-400 border-rose-550/20 shadow-md'
                          }`}
                          title={userRole === 'student' ? '🔒 Removal Proposing Restricted (Students)' : '🗑️ Propose Drive Removal'}
                        >
                          {userRole === 'student' ? <Lock className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
                        </button>

                        <button
                          onClick={() => onDownloadResource(res.id)}
                          className="inline-flex items-center space-x-1.5 bg-green-500 hover:bg-green-600 text-black font-extrabold text-[10px] tracking-wide uppercase px-3.5 py-2.5 rounded-xl shadow-[0_0_12px_rgba(34,197,94,0.3)] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer min-h-[34px]"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Get Drive</span>
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {filteredResources.length === 0 && (
          <div className="py-16 text-center space-y-3 bg-bg-surface/30">
            <HelpCircle className="h-10 w-10 text-text-muted mx-auto" />
            <h4 className="font-extrabold text-white text-lg">No study files listed yet</h4>
            <p className="text-text-muted text-sm max-w-sm mx-auto animate-pulse">
              Be the first to submit materials for branch "{selectedDept}" in Semester {selectedSemester}!
            </p>
          </div>
        )}
      </div>

      {/* Mobile view (Sleek Notes Cards with 44px targets) */}
      <div className="block md:hidden space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredResources.map((res) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              key={res.id}
              className="bg-bg-surface/50 border border-border-glass p-4 rounded-2xl shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <span className="inline-block bg-white/5 text-green-300 font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-border-glass">
                    {res.subjectCode}
                  </span>
                  <p className="font-extrabold text-white text-sm leading-snug">{res.subjectName}</p>
                </div>
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold border shrink-0 ${typeStyles[res.type as keyof typeof typeStyles]}`}>
                  {res.type}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-2 border-t border-border-glass text-xs text-text-muted">
                <div className="flex items-center space-x-1">
                  <span className="text-green-300 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded text-[9px] font-bold">
                    {res.department}
                  </span>
                  <span className="font-bold text-[10px] text-white">Sem {res.semester}</span>
                </div>
                <span className="text-border-glass">•</span>
                <span className="font-semibold text-white/80 text-[10px]">{res.fileSize}</span>
                <span className="text-border-glass">•</span>
                <span className="text-text-muted text-[10px]">By {res.uploadedBy}</span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="text-[10px] text-text-muted">
                  <span className="font-bold text-green-400">{res.downloadsCount || 0}</span> drive hits
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleProposeDeletion(res)}
                    className={`px-3 py-2 border rounded-xl flex items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer touch-manipulation ${
                      userRole === 'student'
                        ? 'bg-white/2 border-border-glass text-slate-500 opacity-45 hover:opacity-100 hover:text-white'
                        : 'bg-rose-500/10 text-rose-455 border-rose-500/20 bg-rose-950/20'
                    }`}
                    title="Trash propose file removal"
                  >
                    {userRole === 'student' ? <Lock className="h-4 w-4 text-slate-500" /> : <Trash2 className="h-4 w-4" />}
                  </button>

                  <button
                    onClick={() => onDownloadResource(res.id)}
                    className="inline-flex items-center space-x-1.5 bg-green-500 hover:bg-green-650 text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-[0_0_12px_rgba(34,197,94,0.35)] transition-all active:scale-95 cursor-pointer touch-manipulation min-h-[44px]"
                  >
                    <Download className="h-4 w-4" />
                    <span>Get Drive Notes</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredResources.length === 0 && (
          <div className="py-12 bg-bg-surface/50 border border-border-glass rounded-2xl text-center space-y-3 px-4">
            <HelpCircle className="h-10 w-10 text-green-400 mx-auto font-sans animate-pulse" />
            <h4 className="font-extrabold text-white text-base">No study files listed yet</h4>
            <p className="text-text-muted text-xs max-w-xs mx-auto">
              Be the first to submit materials for branch "{selectedDept}" in Semester {selectedSemester}!
            </p>
          </div>
        )}
      </div>

      {/* Upload/Propose note Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-bg-surface border border-border-glass rounded-2xl max-w-lg w-full shadow-2xl p-6 relative overflow-hidden">
            
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-border-glass">
              <div>
                <h3 className="font-extrabold text-white text-lg">
                  {userRole === 'admin' ? 'Publish Academic Drive' : 'Propose Lecture Notes'}
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  {userRole === 'admin' 
                    ? 'Publish study materials instantly onto the live dashboard.' 
                    : 'Submit study drives to Admin review workspace for approval.'}
                </p>
              </div>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-1 px-2.5 text-text-muted hover:text-white bg-white/5 rounded-lg text-sm font-bold transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {isSuccess ? (
              <div className="py-12 text-center space-y-4 animate-scaleUp">
                <div className="h-16 w-16 bg-green-500/15 text-green-400 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                  <Send className="h-8 w-8 text-green-400 animate-bounce" />
                </div>
                <h4 className="text-xl font-black text-white">
                  {userRole === 'admin' ? 'Resource Published!' : 'Propose submitted successfully'}
                </h4>
                <p className="text-sm text-text-muted max-w-xs mx-auto">
                  {userRole === 'admin' 
                    ? 'Your material is live, and immediately browsable by all SSEC/SIT Sairam students.' 
                    : 'Your study folder proposal is transferred to Sairam Administrators. It goes live upon authorization! Check Pending actions queue!'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Subject Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CCS339"
                      value={formData.subjectCode}
                      onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                      className="w-full text-xs px-4 py-2.5 bg-white/5 border border-border-glass rounded-xl focus:outline-none focus:ring-1 focus:ring-green-450 text-white placeholder-text-muted/40 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Resource Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as Resource['type'] })}
                      className="w-full text-xs px-3 py-2.5 bg-bg-surface border border-border-glass rounded-xl focus:outline-none focus:ring-1 focus:ring-green-450 text-white cursor-pointer font-bold"
                    >
                      <option value="Notes">Notes</option>
                      <option value="Question Paper">Question Paper</option>
                      <option value="Lab Manual">Lab Manual</option>
                      <option value="Syllabus">Syllabus</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Subject / Material Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Computer Networks Unit 1 & 2 Complete handwritten slides"
                    value={formData.subjectName}
                    onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                    className="w-full text-xs px-4 py-2.5 bg-white/5 border border-border-glass rounded-xl focus:outline-none focus:ring-1 focus:ring-green-450 text-white placeholder-text-muted/40 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Branch / Dept</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full text-xs px-3 py-2.5 bg-bg-surface border border-border-glass rounded-xl focus:outline-none focus:ring-1 focus:ring-green-450 text-white cursor-pointer font-bold"
                    >
                      {SAIRAM_DEPARTMENTS.map((dept) => (
                        <option key={dept.code} value={dept.code}>
                          {dept.code}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Semester</label>
                    <select
                      value={formData.semester}
                      onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
                      className="w-full text-xs px-3 py-2.5 bg-bg-surface border border-border-glass rounded-xl focus:outline-none focus:ring-1 focus:ring-green-450 text-white cursor-pointer font-bold"
                    >
                      {semestersList.map((sem) => (
                        <option key={sem} value={sem}>
                          Semester {sem}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Drive / Notes Link</label>
                  <input
                    type="url"
                    required
                    placeholder="https://drive.google.com/drive/folders/..."
                    value={formData.downloadUrl}
                    onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                    className="w-full text-xs px-4 py-2.5 bg-white/5 border border-border-glass rounded-xl focus:outline-none focus:ring-1 focus:ring-green-450 text-white placeholder-text-muted/40 font-mono text-[10px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-text-muted mb-1.5 uppercase">Your Name (Contributor Profile)</label>
                  <input
                    type="text"
                    required
                    placeholder="Identify yourself as contributor (e.g. Abishek S)"
                    value={formData.uploadedBy}
                    onChange={(e) => setFormData({ ...formData, uploadedBy: e.target.value })}
                    className="w-full text-xs px-4 py-2.5 bg-white/5 border border-border-glass rounded-xl focus:outline-none focus:ring-1 focus:ring-green-450 text-white placeholder-text-muted/40 font-semibold"
                  />
                </div>

                {formError && (
                  <p className="text-xs font-semibold text-rose-450 bg-rose-950/25 p-2.5 rounded-lg border border-rose-900/40">
                    ⚠️ {formError}
                  </p>
                )}

                <div className="pt-3 border-t border-border-glass flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="w-1/2 py-2.5 text-text-muted hover:text-white bg-white/5 rounded-xl hover:bg-white/10 text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2.5 bg-green-500 hover:bg-green-600 text-black font-extrabold rounded-xl text-xs hover:shadow transition-all shadow-[0_0_15px_rgba(34,197,94,0.35)] cursor-pointer"
                  >
                    {userRole === 'admin' ? 'Authorize & Publish' : 'Submit for Approval'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Propose Deletion Modal Overlay */}
      {showDeletionModal && selectedResourceForDeletion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-bg-surface border border-border-glass rounded-2xl max-w-md w-full shadow-2xl p-6 relative overflow-hidden">
            
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-border-glass">
              <div>
                <h4 className="font-extrabold text-white text-base">Propose Note Deletion</h4>
                <p className="text-[10px] text-text-muted mt-0.5">Contributor request for academic record adjustment</p>
              </div>
              <button 
                onClick={() => setShowDeletionModal(false)}
                className="text-text-muted hover:text-white text-xs cursor-pointer p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-rose-950/15 border border-rose-500/20 rounded-xl">
                <p className="text-[10px] text-rose-400 font-extrabold tracking-wider uppercase">Removal Target File:</p>
                <p className="text-xs text-white/95 font-bold mt-1">
                  [{selectedResourceForDeletion.subjectCode}] {selectedResourceForDeletion.subjectName}
                </p>
                <p className="text-[10px] text-text-muted mt-1 font-mono">Originally submitted by {selectedResourceForDeletion.uploadedBy}</p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-text-muted uppercase">Your Name (Contributor ID)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Ramya Devi R"
                  value={deletionContributorName}
                  onChange={(e) => setDeletionContributorName(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white/5 border border-border-glass rounded-xl focus:outline-none focus:ring-1 focus:ring-green-450 text-white placeholder-text-muted/30 font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono font-bold text-text-muted uppercase">Reason for Removal Notification</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g., File link is broken, duplicate note, or outdated syllabus catalog..."
                  value={deletionReason}
                  onChange={(e) => setDeletionReason(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-white/5 border border-border-glass rounded-xl focus:outline-none focus:ring-1 focus:ring-green-450 text-white placeholder-text-muted/30 resize-none font-medium"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeletionModal(false)}
                  className="w-1/2 py-2.5 text-text-muted hover:text-white bg-white/5 rounded-xl text-xs font-bold transition-all"
                >
                  Abort Propose
                </button>
                <button
                  onClick={handleDeletionSubmit}
                  className="w-1/2 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-rose-950/10 transition-all cursor-pointer"
                >
                  {userRole === 'admin' ? 'Delete Instantly' : 'Propose Removal'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
