import React, { useState, useMemo, useEffect } from 'react';
import {
  Search, BookOpen, Shield, FileText, CheckCircle, XCircle, Clock, 
  RotateCcw, History, Plus, Edit3, Trash2, Eye, Filter, User, 
  Settings, Award, AlertTriangle, ArrowRight, Check, X, FileUp,
  Layers, LogOut, Lock, ChevronRight, Activity, Tag, Sparkles
} from 'lucide-react';

// ==========================================
// INITIAL MOCK DATA (Aligned with Assignment 4 Object Diagram)
// ==========================================

const INITIAL_CATEGORIES = [
  { categoryId: 'CAT-01', name: 'Examinations', description: 'Rules regarding mid-terms, end-terms, and grading', status: 'Active' },
  { categoryId: 'CAT-02', name: 'Attendance', description: 'Policies on minimum mandatory course attendance', status: 'Active' },
  { categoryId: 'CAT-03', name: 'Admissions', description: 'Criteria and rules for undergraduate & postgraduate intake', status: 'Active' },
  { categoryId: 'CAT-04', name: 'Research', description: 'Guidelines for thesis, dissertations, and PhD coursework', status: 'Active' },
  { categoryId: 'CAT-05', name: 'Discipline', description: 'Student code of conduct and disciplinary committee rules', status: 'Retired' }
];

const INITIAL_REGULATIONS = [
  {
    regulationId: 'REG-001',
    title: 'Minimum Attendance Policy',
    currentStatus: 'Published',
    currentVersionNumber: '2',
    effectiveDate: '2025-08-01',
    categories: ['CAT-02'],
    createdDate: '2024-05-10',
    createdBy: 'Ananya Verma (Author/Editor)',
    versions: [
      {
        versionId: 'VER-001-1',
        versionNumber: '1',
        versionStatus: 'Superseded',
        effectiveDate: '2024-06-01',
        createdDate: '2024-05-10',
        applicability: 'All UG students',
        content: 'Students are required to maintain a minimum of 75% attendance in each registered course to be eligible to sit for the final examinations. Absence due to medical reasons must be certified by the Institute Medical Officer within 3 days.',
        approval: {
          approvalId: 'APR-01',
          decision: 'Approved',
          comments: 'Approved as proposed by UG committee.',
          decisionDate: '2024-05-20',
          approverDesignation: 'Chair, UG Academic Committee'
        }
      },
      {
        versionId: 'VER-001-2',
        versionNumber: '2',
        versionStatus: 'Current',
        effectiveDate: '2025-08-01',
        createdDate: '2025-07-01',
        applicability: 'All UG students',
        content: 'Students are required to maintain a minimum of 80% attendance in each course. A relaxation up to 5% may be granted by the Dean of Academic Affairs for representation in sports or national events.',
        approval: {
          approvalId: 'APR-02',
          decision: 'Approved',
          comments: 'Approved revision for strict academic standard.',
          decisionDate: '2025-07-15',
          approverDesignation: 'Chair, UG Academic Committee'
        }
      }
    ]
  },
  {
    regulationId: 'REG-002',
    title: 'Grade Improvement & Backlog Regulation',
    currentStatus: 'Under Review',
    currentVersionNumber: '1',
    effectiveDate: '2026-11-01',
    categories: ['CAT-01'],
    createdDate: '2026-10-01',
    createdBy: 'Ananya Verma (Author/Editor)',
    versions: [
      {
        versionId: 'VER-002-1',
        versionNumber: '1',
        versionStatus: 'Under Review',
        effectiveDate: '2026-11-01',
        createdDate: '2026-10-01',
        applicability: 'B.Tech Batches 2023 onwards',
        content: 'Students receiving a grade of D or F in any core course are allowed up to two attempts to repeat the course for grade improvement. The higher grade obtained will be reflected on the transcript.',
        approval: null
      }
    ]
  },
  {
    regulationId: 'REG-003',
    title: 'PhD Comprehensive Examination Guidelines',
    currentStatus: 'Draft',
    currentVersionNumber: '1',
    effectiveDate: '2027-01-01',
    categories: ['CAT-04'],
    createdDate: '2026-10-15',
    createdBy: 'Rajesh Kumar (Author/Editor)',
    rejectionComments: 'Please clarify the timeline for the second attempt if a scholar fails on the first try.',
    versions: [
      {
        versionId: 'VER-003-1',
        versionNumber: '1',
        versionStatus: 'Draft',
        effectiveDate: '2027-01-01',
        createdDate: '2026-10-15',
        applicability: 'PhD Scholars',
        content: 'Every doctoral candidate must complete the comprehensive qualifying examination within 4 semesters of joining. The exam consists of a written proposal and an oral defense.',
        approval: {
          approvalId: 'APR-03',
          decision: 'Rejected',
          comments: 'Please clarify the timeline for the second attempt if a scholar fails on the first try.',
          decisionDate: '2026-10-18',
          approverDesignation: 'Dean, Academic Research'
        }
      }
    ]
  }
];

const INITIAL_USERS = [
  { userId: 'U-001', name: 'Aarav Sharma', email: 'aarav@lnmiit.ac.in', role: 'Student', accountStatus: 'Active' },
  { userId: 'U-002', name: 'Dr. Meena Gupta', email: 'meena@lnmiit.ac.in', role: 'Faculty', accountStatus: 'Active' },
  { userId: 'U-014', name: 'Ananya Verma', email: 'ananya.verma@lnmiit.ac.in', role: 'Author/Editor', accountStatus: 'Active' },
  { userId: 'U-002-APP', name: 'Prof. S. R. Kale', email: 'dean.academic@lnmiit.ac.in', role: 'Approver', designation: 'Chair, UG Academic Committee', accountStatus: 'Active' },
  { userId: 'U-999', name: 'Dev Administrator', email: 'admin@lnmiit.ac.in', role: 'Administrator', accountStatus: 'Active' }
];

const INITIAL_AUDIT_LOGS = [
  { logId: 'LOG-001', regulationId: 'REG-001', regTitle: 'Minimum Attendance Policy', action: 'Created', user: 'Ananya Verma (Author/Editor)', timestamp: '2024-05-10 10:15:22', details: 'Initial draft v1 created.' },
  { logId: 'LOG-002', regulationId: 'REG-001', regTitle: 'Minimum Attendance Policy', action: 'Submitted', user: 'Ananya Verma (Author/Editor)', timestamp: '2024-05-12 14:20:00', details: 'Submitted draft v1 for review.' },
  { logId: 'LOG-003', regulationId: 'REG-001', regTitle: 'Minimum Attendance Policy', action: 'Approved', user: 'Chair, UG Academic Committee', timestamp: '2024-05-20 11:05:00', details: 'Approved v1 with effective date 2024-06-01.' },
  { logId: 'LOG-004', regulationId: 'REG-001', regTitle: 'Minimum Attendance Policy', action: 'Published', user: 'ARR System', timestamp: '2024-06-01 00:00:00', details: 'Automatically published v1 upon reaching effective date.' },
  { logId: 'LOG-005', regulationId: 'REG-001', regTitle: 'Minimum Attendance Policy', action: 'Created', user: 'Ananya Verma (Author/Editor)', timestamp: '2025-07-01 09:30:10', details: 'Draft v2 created.' },
  { logId: 'LOG-006', regulationId: 'REG-001', regTitle: 'Minimum Attendance Policy', action: 'Approved', user: 'Chair, UG Academic Committee', timestamp: '2025-07-15 16:45:00', details: 'Approved v2. Superseded v1.' },
  { logId: 'LOG-007', regulationId: 'REG-003', regTitle: 'PhD Comprehensive Examination Guidelines', action: 'Rejected', user: 'Dean, Academic Research', timestamp: '2026-10-18 15:10:00', details: 'Rejected draft v1 with mandatory comment.' }
];

export default function App() {
  // State Management
  const [currentUser, setCurrentUser] = useState(INITIAL_USERS[0]); // Default: Student
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [regulations, setRegulations] = useState(INITIAL_REGULATIONS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [users, setUsers] = useState(INITIAL_USERS);

  // Active View Tab
  const [activeTab, setActiveTab] = useState('repository'); // 'repository', 'editor', 'approvals', 'admin', 'workflows'

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('ALL');
  const [dateFilter, setDateFilter] = useState('');

  // UI Selection State
  const [selectedRegulation, setSelectedRegulation] = useState(null);
  const [viewingVersionHistoryReg, setViewingVersionHistoryReg] = useState(null);

  // Draft Editor Form State
  const [editorData, setEditorData] = useState({
    regulationId: null,
    title: '',
    categoryIds: [],
    effectiveDate: '',
    applicability: 'All Students',
    content: '',
    basedOnVersion: null
  });

  // Approver Action Modal State
  const [rejectingReg, setRejectingReg] = useState(null);
  const [rejectionCommentInput, setRejectionCommentInput] = useState('');
  const [rejectError, setRejectError] = useState('');

  // Category Admin Modal
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Toast / System Alert
  const [notification, setNotification] = useState(null);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Record Audit Entry helper
  const addAuditEntry = (regulationId, regTitle, action, details) => {
    const newLog = {
      logId: `LOG-${Date.now().toString().slice(-4)}`,
      regulationId,
      regTitle,
      action,
      user: currentUser.role === 'Approver' ? currentUser.designation : currentUser.name,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // ==========================================
  // BUSINESS LOGIC & FILTERING (BR-003, BR-004)
  // ==========================================

  // Filter regulations visible to the current role
  const visibleRegulations = useMemo(() => {
    return regulations.filter(reg => {
      // BR-003 & BR-004: Students/Faculty see ONLY Published regulations
      if (currentUser.role === 'Student' || currentUser.role === 'Faculty') {
        if (reg.currentStatus !== 'Published') return false;
      }
      // Status filter
      if (selectedStatusFilter !== 'ALL' && reg.currentStatus !== selectedStatusFilter) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'ALL' && !reg.categories.includes(selectedCategory)) {
        return false;
      }
      // Effective Date filter
      if (dateFilter && reg.effectiveDate > dateFilter) {
        return false;
      }
      // Full Text Keyword Search
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const titleMatch = reg.title.toLowerCase().includes(query);
        const latestVer = reg.versions[reg.versions.length - 1];
        const contentMatch = latestVer && latestVer.content.toLowerCase().includes(query);
        const appMatch = latestVer && latestVer.applicability.toLowerCase().includes(query);
        if (!titleMatch && !contentMatch && !appMatch) return false;
      }

      return true;
    });
  }, [regulations, currentUser.role, selectedCategory, selectedStatusFilter, dateFilter, searchTerm]);

  // Handle Switch Role
  const handleRoleSwitch = (user) => {
    setCurrentUser(user);
    setSelectedRegulation(null);
    setViewingVersionHistoryReg(null);
    showToast(`Switched active persona to ${user.name} (${user.role})`, 'info');
  };

  // ==========================================
  // AUTHOR/EDITOR ACTIONS (UC-004, UC-005, UC-006, UC-015)
  // ==========================================

  const startNewDraft = () => {
    setEditorData({
      regulationId: null,
      title: '',
      categoryIds: [categories[0]?.categoryId || 'CAT-01'],
      effectiveDate: new Date().toISOString().split('T')[0],
      applicability: 'All Students',
      content: '',
      basedOnVersion: null
    });
    setActiveTab('editor');
  };

  const handleEditDraft = (reg) => {
    const latestVer = reg.versions[reg.versions.length - 1];
    setEditorData({
      regulationId: reg.regulationId,
      title: reg.title,
      categoryIds: [...reg.categories],
      effectiveDate: reg.effectiveDate,
      applicability: latestVer?.applicability || 'All Students',
      content: latestVer?.content || '',
      basedOnVersion: null
    });
    setActiveTab('editor');
  };

  // UC-015: Retrieve Previous Version & Create New Revision
  const handleCreateRevisionFromVersion = (reg, version) => {
    const nextVerNum = String(reg.versions.length + 1);
    setEditorData({
      regulationId: reg.regulationId,
      title: reg.title,
      categoryIds: [...reg.categories],
      effectiveDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      applicability: version.applicability,
      content: `${version.content}\n\n[Revised baseline derived from Version ${version.versionNumber}]`,
      basedOnVersion: version.versionNumber
    });
    setActiveTab('editor');
    showToast(`Pre-filled new revision (v${nextVerNum}) from Version ${version.versionNumber}`, 'info');
  };

  const saveDraft = (submitForReview = false) => {
    // Validation
    if (!editorData.title.trim()) {
      showToast('Regulation title is required.', 'error');
      return;
    }
    if (editorData.categoryIds.length === 0) {
      showToast('At least one category must be assigned (BR-012).', 'error');
      return;
    }
    if (!editorData.content.trim()) {
      showToast('Regulation content cannot be empty.', 'error');
      return;
    }

    let updatedRegId = editorData.regulationId;

    if (!updatedRegId) {
      // Create new regulation entity
      updatedRegId = `REG-${Date.now().toString().slice(-3)}`;
      const newVerId = `VER-${updatedRegId.slice(-3)}-1`;
      
      const newVersion = {
        versionId: newVerId,
        versionNumber: '1',
        versionStatus: submitForReview ? 'Under Review' : 'Draft',
        effectiveDate: editorData.effectiveDate,
        createdDate: new Date().toISOString().split('T')[0],
        applicability: editorData.applicability,
        content: editorData.content,
        approval: null
      };

      const newRegulation = {
        regulationId: updatedRegId,
        title: editorData.title,
        currentStatus: submitForReview ? 'Under Review' : 'Draft',
        currentVersionNumber: '1',
        effectiveDate: editorData.effectiveDate,
        categories: editorData.categoryIds,
        createdDate: new Date().toISOString().split('T')[0],
        createdBy: currentUser.name,
        versions: [newVersion]
      };

      setRegulations(prev => [newRegulation, ...prev]);
      addAuditEntry(
        updatedRegId, 
        editorData.title, 
        submitForReview ? 'Submitted' : 'Created', 
        submitForReview ? 'Draft v1 created and submitted for review.' : 'Draft v1 saved.'
      );
    } else {
      // Updating existing regulation (Creating new revision or modifying draft)
      setRegulations(prev => prev.map(reg => {
        if (reg.regulationId !== updatedRegId) return reg;

        // If current status is Draft or Rejected, modify the draft version directly
        if (reg.currentStatus === 'Draft') {
          const updatedVersions = [...reg.versions];
          const lastIdx = updatedVersions.length - 1;
          updatedVersions[lastIdx] = {
            ...updatedVersions[lastIdx],
            content: editorData.content,
            applicability: editorData.applicability,
            effectiveDate: editorData.effectiveDate,
            versionStatus: submitForReview ? 'Under Review' : 'Draft'
          };

          return {
            ...reg,
            title: editorData.title,
            categories: editorData.categoryIds,
            effectiveDate: editorData.effectiveDate,
            currentStatus: submitForReview ? 'Under Review' : 'Draft',
            rejectionComments: null,
            versions: updatedVersions
          };
        } else {
          // Creating a brand NEW version revision (UC-015 / FR-028)
          const nextVerNum = String(reg.versions.length + 1);
          const newVerObj = {
            versionId: `VER-${reg.regulationId.slice(-3)}-${nextVerNum}`,
            versionNumber: nextVerNum,
            versionStatus: submitForReview ? 'Under Review' : 'Draft',
            effectiveDate: editorData.effectiveDate,
            createdDate: new Date().toISOString().split('T')[0],
            applicability: editorData.applicability,
            content: editorData.content,
            approval: null
          };

          return {
            ...reg,
            // Main regulation currentStatus stays Published/Archived until revision is approved! (BR-006)
            currentStatus: reg.currentStatus === 'Published' ? 'Published' : (submitForReview ? 'Under Review' : 'Draft'),
            categories: editorData.categoryIds,
            versions: [...reg.versions, newVerObj]
          };
        }
      }));

      addAuditEntry(
        updatedRegId, 
        editorData.title, 
        submitForReview ? 'Submitted' : 'Edited', 
        submitForReview ? 'Regulation submitted for review.' : 'Draft revision updated.'
      );
    }

    showToast(submitForReview ? 'Regulation submitted for review successfully!' : 'Draft saved successfully!');
    setActiveTab('repository');
  };

  // ==========================================
  // APPROVER ACTIONS (UC-007, UC-008, BR-008, BR-009)
  // ==========================================

  const handleApprove = (reg) => {
    const latestVerIdx = reg.versions.length - 1;

    setRegulations(prev => prev.map(r => {
      if (r.regulationId !== reg.regulationId) return r;

      const updatedVersions = r.versions.map((v, idx) => {
        if (idx === latestVerIdx) {
          return {
            ...v,
            versionStatus: 'Current',
            approval: {
              approvalId: `APR-${Date.now().toString().slice(-4)}`,
              decision: 'Approved',
              comments: 'Approved as compliant with academic regulations.',
              decisionDate: new Date().toISOString().split('T')[0],
              approverDesignation: currentUser.designation || 'Chair, UG Academic Committee'
            }
          };
        } else if (v.versionStatus === 'Current') {
          // Supersede prior current version
          return { ...v, versionStatus: 'Superseded' };
        }
        return v;
      });

      return {
        ...r,
        currentStatus: 'Published',
        currentVersionNumber: updatedVersions[latestVerIdx].versionNumber,
        effectiveDate: updatedVersions[latestVerIdx].effectiveDate,
        versions: updatedVersions
      };
    }));

    addAuditEntry(reg.regulationId, reg.title, 'Approved', `Approved version by ${currentUser.designation}. Published automatically.`);
    showToast(`Regulation "${reg.title}" has been APPROVED and Published!`);
  };

  const handleOpenRejectModal = (reg) => {
    setRejectingReg(reg);
    setRejectionCommentInput('');
    setRejectError('');
  };

  const confirmRejection = () => {
    // BR-009: Mandatory rejection comments
    if (!rejectionCommentInput.trim()) {
      setRejectError('Rejection comments are mandatory (BR-009). Please explain what changes are required.');
      return;
    }

    const reg = rejectingReg;
    const latestVerIdx = reg.versions.length - 1;

    setRegulations(prev => prev.map(r => {
      if (r.regulationId !== reg.regulationId) return r;

      const updatedVersions = r.versions.map((v, idx) => {
        if (idx === latestVerIdx) {
          return {
            ...v,
            versionStatus: 'Draft',
            approval: {
              approvalId: `APR-${Date.now().toString().slice(-4)}`,
              decision: 'Rejected',
              comments: rejectionCommentInput,
              decisionDate: new Date().toISOString().split('T')[0],
              approverDesignation: currentUser.designation || 'Academic Council Approver'
            }
          };
        }
        return v;
      });

      return {
        ...r,
        currentStatus: 'Draft', // Returned to draft status (BR-005)
        rejectionComments: rejectionCommentInput,
        versions: updatedVersions
      };
    }));

    addAuditEntry(reg.regulationId, reg.title, 'Rejected', `Rejected by ${currentUser.designation}. Returned to Draft with comments.`);
    showToast(`Regulation returned to Draft status with comments attached.`, 'info');
    setRejectingReg(null);
  };

  // ==========================================
  // ADMINISTRATOR ACTIONS (UC-002, UC-003, UC-010)
  // ==========================================

  const handleArchiveRegulation = (regId, title) => {
    setRegulations(prev => prev.map(r => {
      if (r.regulationId === regId) {
        return { ...r, currentStatus: 'Archived' };
      }
      return r;
    }));
    addAuditEntry(regId, title, 'Archived', 'Regulation manually archived by Administrator.');
    showToast(`Regulation "${title}" archived.`);
  };

  const handleSaveCategory = () => {
    if (!newCatName.trim()) return;

    if (editingCategory) {
      setCategories(prev => prev.map(c => c.categoryId === editingCategory.categoryId ? { ...c, name: newCatName, description: newCatDesc } : c));
      showToast(`Category "${newCatName}" updated.`);
    } else {
      const newCat = {
        categoryId: `CAT-0${categories.length + 1}`,
        name: newCatName,
        description: newCatDesc,
        status: 'Active'
      };
      setCategories(prev => [...prev, newCat]);
      showToast(`Category "${newCatName}" created.`);
    }
    setEditingCategory(null);
    setNewCatName('');
    setNewCatDesc('');
  };

  const handleToggleCategoryStatus = (catId) => {
    setCategories(prev => prev.map(c => {
      if (c.categoryId === catId) {
        const nextStatus = c.status === 'Active' ? 'Retired' : 'Active';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
    showToast('Category status updated (BR-011: Retiring category preserves linked regulations).', 'info');
  };

  // ==========================================
  // RENDER APP UI
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col">
      {/* TOP HEADER / BAR */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-blue-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold text-white tracking-wide">LNMIIT Repository</h1>
                <span className="text-xs px-2 py-0.5 rounded bg-indigo-900/60 text-indigo-300 font-mono border border-indigo-700">v1.0 Baseline</span>
              </div>
              <p className="text-xs text-slate-400">Academic Regulation & Policy Repository System</p>
            </div>
          </div>

          {/* Persona Switcher Dropdown */}
          <div className="flex items-center space-x-3 bg-slate-900/80 p-1.5 rounded-xl border border-slate-700">
            <User className="w-4 h-4 text-indigo-400 ml-2" />
            <span className="text-xs text-slate-400 font-medium">Role:</span>
            <select
              className="bg-slate-800 text-slate-200 text-sm font-semibold rounded-lg px-2.5 py-1 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={currentUser.userId}
              onChange={(e) => {
                const usr = users.find(u => u.userId === e.target.value);
                if (usr) handleRoleSwitch(usr);
              }}
            >
              {users.map(u => (
                <option key={u.userId} value={u.userId}>
                  {u.name} — ({u.role})
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* SYSTEM TOAST NOTIFICATION */}
      {notification && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center space-x-3 transition-all transform animate-bounce ${
          notification.type === 'error' ? 'bg-red-900/90 text-red-200 border-red-700' :
          notification.type === 'info' ? 'bg-blue-900/90 text-blue-200 border-blue-700' :
          'bg-emerald-900/90 text-emerald-200 border-emerald-700'
        }`}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{notification.msg}</span>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full flex flex-col gap-6">
        
        {/* NAVIGATION TABS */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setActiveTab('repository')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'repository' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search & Browse</span>
          </button>

          {(currentUser.role === 'Author/Editor' || currentUser.role === 'Administrator') && (
            <button
              onClick={startNewDraft}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'editor' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Draft New Regulation</span>
            </button>
          )}

          {(currentUser.role === 'Approver' || currentUser.role === 'Administrator') && (
            <button
              onClick={() => setActiveTab('approvals')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all relative ${
                activeTab === 'approvals' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Approver Dashboard</span>
              {regulations.filter(r => r.currentStatus === 'Under Review').length > 0 && (
                <span className="ml-1.5 bg-amber-500 text-slate-950 text-xs px-2 py-0.5 rounded-full font-bold">
                  {regulations.filter(r => r.currentStatus === 'Under Review').length}
                </span>
              )}
            </button>
          )}

          {currentUser.role === 'Administrator' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'admin' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>System Admin & Audit Log</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('workflows')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ml-auto ${
              activeTab === 'workflows' 
                ? 'bg-slate-700 text-white' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4 text-indigo-400" />
            <span>Workflow & UML Architecture</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: REPOSITORY SEARCH & BROWSE (UC-012, FR-020-025)     */}
        {/* ========================================================= */}
        {activeTab === 'repository' && (
          <div className="flex flex-col gap-6">
            
            {/* SEARCH BAR & FILTER CARD */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
              <div className="flex flex-col md:flex-row gap-4">
                
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search regulation titles, keyword contents, applicability..."
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Category Dropdown */}
                <div className="w-full md:w-56">
                  <select
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="ALL">All Categories</option>
                    {categories.map(c => (
                      <option key={c.categoryId} value={c.categoryId}>
                        {c.name} {c.status === 'Retired' ? '(Retired)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter (Hidden for Student/Faculty per BR-003) */}
                {(currentUser.role !== 'Student' && currentUser.role !== 'Faculty') && (
                  <div className="w-full md:w-48">
                    <select
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={selectedStatusFilter}
                      onChange={(e) => setSelectedStatusFilter(e.target.value)}
                    >
                      <option value="ALL">All Statuses</option>
                      <option value="Published">Published</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Draft">Draft</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                )}

                {/* Date Filter */}
                <div className="w-full md:w-48">
                  <input
                    type="date"
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    title="Filter regulations effective on or before date"
                  />
                </div>
              </div>

              {/* Status Banner Notice for Students/Faculty */}
              {(currentUser.role === 'Student' || currentUser.role === 'Faculty') && (
                <div className="flex items-center space-x-2 text-xs text-indigo-300 bg-indigo-950/50 p-2.5 rounded-lg border border-indigo-800/50">
                  <Shield className="w-4 h-4 flex-shrink-0 text-indigo-400" />
                  <span>
                    <strong>Authoritative Scope Active:</strong> Showing published regulations only. Draft and under-review policies are hidden from student/faculty view (BR-003).
                  </span>
                </div>
              )}
            </div>

            {/* RESULTS LIST & DETAILS SPLIT VIEW */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* REGULATION CARDS LISTING (7 Cols) */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-semibold">
                  <span>REGULATION RESULTS ({visibleRegulations.length})</span>
                  <span>Select to inspect</span>
                </div>

                {visibleRegulations.length === 0 ? (
                  <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl p-8 text-center text-slate-400">
                    <Filter className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="font-semibold">No regulations match criteria</p>
                    <p className="text-xs text-slate-500 mt-1">Try resetting filters or adjusting search terms.</p>
                  </div>
                ) : (
                  visibleRegulations.map(reg => {
                    const isSelected = selectedRegulation?.regulationId === reg.regulationId;
                    const catNames = reg.categories.map(cid => categories.find(c => c.categoryId === cid)?.name).filter(Boolean);

                    return (
                      <div
                        key={reg.regulationId}
                        onClick={() => setSelectedRegulation(reg)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                          isSelected 
                            ? 'bg-slate-800 border-indigo-500 shadow-lg ring-1 ring-indigo-500' 
                            : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-slate-100 text-sm leading-snug">{reg.title}</h3>
                          
                          {/* Status Badge */}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex-shrink-0 ${
                            reg.currentStatus === 'Published' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            reg.currentStatus === 'Under Review' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                            reg.currentStatus === 'Draft' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                            'bg-slate-700 text-slate-400'
                          }`}>
                            {reg.currentStatus}
                          </span>
                        </div>

                        {/* Metadata row */}
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span className="flex items-center text-indigo-300 font-medium">
                            <Tag className="w-3 h-3 mr-1" />
                            {catNames.join(', ')}
                          </span>
                          <span>•</span>
                          <span>Ver {reg.currentVersionNumber}</span>
                          <span>•</span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1 text-slate-500" />
                            Eff: {reg.effectiveDate}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* DETAILED VIEW CARD (7 Cols) */}
              <div className="lg:col-span-7">
                {selectedRegulation ? (
                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 sticky top-20">
                    
                    {/* Header */}
                    <div className="border-b border-slate-700 pb-4">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-mono text-indigo-400 font-semibold">{selectedRegulation.regulationId}</span>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setViewingVersionHistoryReg(selectedRegulation)}
                            className="flex items-center space-x-1 text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg font-medium transition"
                          >
                            <History className="w-3.5 h-3.5" />
                            <span>Version History ({selectedRegulation.versions.length})</span>
                          </button>

                          {(currentUser.role === 'Author/Editor' || currentUser.role === 'Administrator') && selectedRegulation.currentStatus === 'Draft' && (
                            <button
                              onClick={() => handleEditDraft(selectedRegulation)}
                              className="flex items-center space-x-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg font-medium transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Draft</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <h2 className="text-xl font-bold text-white mb-3">{selectedRegulation.title}</h2>

                      {/* Attribute Pills */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-900/60 p-3 rounded-xl text-xs">
                        <div>
                          <p className="text-slate-500">Current Status</p>
                          <p className="font-semibold text-slate-200">{selectedRegulation.currentStatus}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Active Version</p>
                          <p className="font-semibold text-slate-200">v{selectedRegulation.currentVersionNumber}</p>
                        </div>
                        <div>
                          <p className="text-slate-500">Effective Date</p>
                          <p className="font-semibold text-indigo-300">{selectedRegulation.effectiveDate}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-slate-500">Issuing Authority (Role)</p>
                          <p className="font-semibold text-emerald-400 flex items-center mt-0.5">
                            <Award className="w-3.5 h-3.5 mr-1" />
                            {selectedRegulation.versions.find(v => v.versionNumber === selectedRegulation.currentVersionNumber)?.approval?.approverDesignation || 'Academic Council / Registrar'}
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-500">Category</p>
                          <p className="font-semibold text-slate-200">
                            {selectedRegulation.categories.map(cid => categories.find(c => c.categoryId === cid)?.name).join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rejection Comments Box (If returned to Draft) */}
                    {selectedRegulation.rejectionComments && (
                      <div className="bg-amber-950/40 border border-amber-800/80 rounded-xl p-3.5 text-xs text-amber-200">
                        <p className="font-bold flex items-center text-amber-400 mb-1">
                          <AlertTriangle className="w-4 h-4 mr-1.5" />
                          Approver Rejection Feedback
                        </p>
                        <p className="italic">{selectedRegulation.rejectionComments}</p>
                      </div>
                    )}

                    {/* Published / Active Content Display */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Policy Content</h4>
                      <div className="bg-slate-900/80 border border-slate-700/60 rounded-xl p-4 text-sm text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                        {selectedRegulation.versions[selectedRegulation.versions.length - 1]?.content}
                      </div>
                    </div>

                    {/* Applicability Scope */}
                    <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/40 px-3 py-2 rounded-lg border border-slate-700/40">
                      <span>Applicability: <strong className="text-slate-200">{selectedRegulation.versions[selectedRegulation.versions.length - 1]?.applicability}</strong></span>
                      <span>Author: {selectedRegulation.createdBy}</span>
                    </div>

                  </div>
                ) : (
                  <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl p-12 text-center text-slate-400 h-full flex flex-col items-center justify-center">
                    <BookOpen className="w-12 h-12 text-slate-600 mb-3" />
                    <p className="text-base font-semibold">Select a regulation from the repository listing</p>
                    <p className="text-xs text-slate-500 mt-1">View full details, effective dates, and authority metadata.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VERSION HISTORY MODAL / OVERLAY (UC-014, UC-015)          */}
        {/* ========================================================= */}
        {viewingVersionHistoryReg && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-3xl w-full p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-hidden">
              
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <History className="w-5 h-5 text-indigo-400 mr-2" />
                    Version Control History: {viewingVersionHistoryReg.title}
                  </h3>
                  <p className="text-xs text-slate-400">Preserved lineage (BR-007: No versions deleted)</p>
                </div>
                <button
                  onClick={() => setViewingVersionHistoryReg(null)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Version Timeline */}
              <div className="overflow-y-auto space-y-4 pr-1">
                {viewingVersionHistoryReg.versions.map((ver) => (
                  <div key={ver.versionId} className="bg-slate-900/90 border border-slate-700 rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="bg-indigo-950 text-indigo-300 font-bold px-2.5 py-0.5 rounded-md text-xs border border-indigo-800">
                          Version {ver.versionNumber}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          ver.versionStatus === 'Current' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          ver.versionStatus === 'Superseded' ? 'bg-slate-800 text-slate-400 border border-slate-600' :
                          'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {ver.versionStatus}
                        </span>
                      </div>

                      {/* Action: Create Revision from this version (UC-015 / FR-028) */}
                      {(currentUser.role === 'Author/Editor' || currentUser.role === 'Administrator') && (
                        <button
                          onClick={() => {
                            const reg = viewingVersionHistoryReg;
                            setViewingVersionHistoryReg(null);
                            handleCreateRevisionFromVersion(reg, ver);
                          }}
                          className="flex items-center space-x-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded-lg transition"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Create Revision from v{ver.versionNumber}</span>
                        </button>
                      )}
                    </div>

                    <div className="text-xs text-slate-400 flex flex-wrap gap-3">
                      <span>Created: {ver.createdDate}</span>
                      <span>•</span>
                      <span>Effective Date: {ver.effectiveDate}</span>
                      <span>•</span>
                      <span>Scope: {ver.applicability}</span>
                    </div>

                    {/* Content Snippet */}
                    <div className="bg-slate-950 p-3 rounded-lg text-xs text-slate-300 font-mono">
                      {ver.content}
                    </div>

                    {/* Approval Audit details */}
                    {ver.approval && (
                      <div className="text-xs bg-slate-800/60 p-2 rounded border border-slate-700/50 flex items-center justify-between text-slate-400">
                        <span>Decision: <strong className={ver.approval.decision === 'Approved' ? 'text-emerald-400' : 'text-red-400'}>{ver.approval.decision}</strong></span>
                        <span>Authority: {ver.approval.approverDesignation}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: DRAFT EDITOR (UC-004, UC-005, UC-006)               */}
        {/* ========================================================= */}
        {activeTab === 'editor' && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-2xl max-w-4xl mx-auto w-full flex flex-col gap-6">
            
            <div className="border-b border-slate-700 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center">
                  <Edit3 className="w-5 h-5 text-indigo-400 mr-2" />
                  {editorData.regulationId ? 'Edit Regulation Revision' : 'Draft New Regulation'}
                </h2>
                <p className="text-xs text-slate-400">
                  Author/Editor Interface • Standard workflow: Draft → Submit for Review
                </p>
              </div>

              {editorData.basedOnVersion && (
                <span className="bg-indigo-950 text-indigo-300 border border-indigo-700 text-xs px-3 py-1 rounded-full font-semibold">
                  Derived from Version {editorData.basedOnVersion}
                </span>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Regulation Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Attendance Requirements for UG Programs"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editorData.title}
                  onChange={(e) => setEditorData({ ...editorData, title: e.target.value })}
                />
              </div>

              {/* Category Checkboxes (FR-019, BR-012) */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Assign Category (At least 1 required) *</label>
                <div className="flex flex-wrap gap-2">
                  {categories.filter(c => c.status === 'Active').map(cat => {
                    const isChecked = editorData.categoryIds.includes(cat.categoryId);
                    return (
                      <button
                        key={cat.categoryId}
                        type="button"
                        onClick={() => {
                          const updated = isChecked 
                            ? editorData.categoryIds.filter(id => id !== cat.categoryId)
                            : [...editorData.categoryIds, cat.categoryId];
                          setEditorData({ ...editorData, categoryIds: updated });
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                          isChecked 
                            ? 'bg-indigo-600 border-indigo-500 text-white' 
                            : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Effective Date & Applicability Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Proposed Effective Date *</label>
                  <input
                    type="date"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editorData.effectiveDate}
                    onChange={(e) => setEditorData({ ...editorData, effectiveDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Target Applicability *</label>
                  <input
                    type="text"
                    placeholder="e.g. All UG Students, B.Tech Batch 2024..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editorData.applicability}
                    onChange={(e) => setEditorData({ ...editorData, applicability: e.target.value })}
                  />
                </div>
              </div>

              {/* Content Body */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Regulation Document Text / Body *</label>
                <textarea
                  rows={8}
                  placeholder="Enter full regulation text..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editorData.content}
                  onChange={(e) => setEditorData({ ...editorData, content: e.target.value })}
                />
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab('repository')}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={() => saveDraft(false)}
                className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-100 rounded-xl text-xs font-bold transition"
              >
                Save as Draft
              </button>

              <button
                type="button"
                onClick={() => saveDraft(true)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5"
              >
                <FileUp className="w-4 h-4" />
                <span>Submit for Review</span>
              </button>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: APPROVER DASHBOARD (UC-007, UC-008)                */}
        {/* ========================================================= */}
        {activeTab === 'approvals' && (
          <div className="flex flex-col gap-6">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl">
              <h2 className="text-lg font-bold text-white mb-1 flex items-center">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-2" />
                Approver Publication Dashboard
              </h2>
              <p className="text-xs text-slate-400">
                Logged in as: <strong className="text-indigo-300">{currentUser.designation || currentUser.name}</strong>
              </p>
            </div>

            {/* Pending Reviews List */}
            <div className="space-y-4">
              {regulations.filter(r => r.currentStatus === 'Under Review').length === 0 ? (
                <div className="bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl p-12 text-center text-slate-400">
                  <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2 opacity-50" />
                  <p className="font-semibold text-slate-200">No regulations pending review</p>
                  <p className="text-xs text-slate-500">All submitted regulations have been reviewed.</p>
                </div>
              ) : (
                regulations.filter(r => r.currentStatus === 'Under Review').map(reg => {
                  const pendingVer = reg.versions[reg.versions.length - 1];

                  return (
                    <div key={reg.regulationId} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg flex flex-col gap-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-mono text-indigo-400 font-bold">{reg.regulationId}</span>
                            <span className="bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                              UNDER REVIEW
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-white mt-1">{reg.title}</h3>
                        </div>

                        <div className="text-xs text-slate-400">
                          <span>Effective Date: <strong className="text-indigo-300">{reg.effectiveDate}</strong></span>
                        </div>
                      </div>

                      {/* Content Preview */}
                      <div className="bg-slate-900 p-4 rounded-xl text-xs text-slate-300 font-mono">
                        {pendingVer?.content}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-end space-x-3 pt-2">
                        <button
                          onClick={() => handleOpenRejectModal(reg)}
                          className="flex items-center space-x-1.5 px-4 py-2 bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 rounded-xl text-xs font-bold transition"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Reject with Comments</span>
                        </button>

                        <button
                          onClick={() => handleApprove(reg)}
                          className="flex items-center space-x-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-emerald-600/20"
                        >
                          <Check className="w-4 h-4" />
                          <span>Approve & Publish</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* MANDATORY REJECTION COMMENT MODAL (BR-009) */}
            {rejectingReg && (
              <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4">
                  
                  <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                    <h3 className="text-base font-bold text-white flex items-center text-red-400">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Reject Regulation (Mandatory Feedback)
                    </h3>
                    <button onClick={() => setRejectingReg(null)} className="text-slate-400 hover:text-white">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300">
                    Business Rule <strong>BR-009</strong> requires providing explicit feedback explaining why <strong>"{rejectingReg.title}"</strong> is being rejected. The draft will be returned to the author.
                  </p>

                  <textarea
                    rows={4}
                    placeholder="Enter explicit rejection comments here..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={rejectionCommentInput}
                    onChange={(e) => {
                      setRejectionCommentInput(e.target.value);
                      if (e.target.value.trim()) setRejectError('');
                    }}
                  />

                  {rejectError && (
                    <p className="text-xs text-red-400 font-semibold">{rejectError}</p>
                  )}

                  <div className="flex justify-end space-x-3 pt-2">
                    <button
                      onClick={() => setRejectingReg(null)}
                      className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmRejection}
                      className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-red-600/30"
                    >
                      Confirm Rejection
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: SYSTEM ADMIN & AUDIT TRAIL (UC-002, UC-003, UC-016) */}
        {/* ========================================================= */}
        {activeTab === 'admin' && (
          <div className="flex flex-col gap-6">
            
            {/* CATEGORIES MANAGEMENT SECTION */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center">
                    <Layers className="w-5 h-5 text-indigo-400 mr-2" />
                    Category Management (FR-016, FR-017, FR-018)
                  </h3>
                  <p className="text-xs text-slate-400">BR-011: Retiring a category preserves all previously assigned regulations.</p>
                </div>

                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setNewCatName('');
                    setNewCatDesc('');
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Category</span>
                </button>
              </div>

              {/* Add/Edit Input box */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/80 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Category Name"
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 sm:w-1/3"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Description..."
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 flex-1"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                />
                <button
                  onClick={handleSaveCategory}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition"
                >
                  {editingCategory ? 'Update' : 'Add'}
                </button>
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {categories.map(cat => (
                  <div key={cat.categoryId} className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-3.5 flex flex-col justify-between gap-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-sm text-slate-200">{cat.name}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          cat.status === 'Active' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {cat.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">{cat.description}</p>
                    </div>

                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800 text-xs">
                      <button
                        onClick={() => {
                          setEditingCategory(cat);
                          setNewCatName(cat.name);
                          setNewCatDesc(cat.description);
                        }}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        Edit
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => handleToggleCategoryStatus(cat.categoryId)}
                        className="text-amber-400 hover:text-amber-300"
                      >
                        {cat.status === 'Active' ? 'Retire' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* IMMUTABLE AUDIT TRAIL LOG (UC-016, FR-030, FR-031) */}
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col gap-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center">
                  <Shield className="w-5 h-5 text-indigo-400 mr-2" />
                  System Audit Trail (Immutable Log)
                </h3>
                <p className="text-xs text-slate-400">FR-030/031: Records creation, edit, submission, approval, rejection, and archiving events.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 uppercase font-mono">
                    <tr>
                      <th className="p-3">Log ID</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Regulation</th>
                      <th className="p-3">Action</th>
                      <th className="p-3">Actor</th>
                      <th className="p-3">Log Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60 font-mono">
                    {auditLogs.map(log => (
                      <tr key={log.logId} className="hover:bg-slate-700/30">
                        <td className="p-3 text-indigo-400">{log.logId}</td>
                        <td className="p-3 text-slate-400">{log.timestamp}</td>
                        <td className="p-3 text-slate-200 font-sans font-medium">{log.regTitle}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                            log.action === 'Approved' ? 'bg-emerald-950 text-emerald-400' :
                            log.action === 'Rejected' ? 'bg-red-950 text-red-400' :
                            log.action === 'Submitted' ? 'bg-amber-950 text-amber-400' :
                            'bg-indigo-950 text-indigo-300'
                          }`}>
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3 text-slate-300 font-sans">{log.user}</td>
                        <td className="p-3 text-slate-400 font-sans">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: WORKFLOWS & ARCHITECTURE DIAGRAMS (LAB ASSIGNMENTS) */}
        {/* ========================================================= */}
        {activeTab === 'workflows' && (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col gap-6">
            <div className="border-b border-slate-700 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center">
                <Activity className="w-5 h-5 text-indigo-400 mr-2" />
                UML Architecture & Workflow Models (Assignments 3–5)
              </h2>
              <p className="text-xs text-slate-400">Formal behavioral and structural specification representation</p>
            </div>

            {/* Visual Workflow Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Card 1 */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col gap-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">UC-012 Workflow</span>
                <h4 className="font-bold text-white text-sm">Search & Discover Regulations</h4>
                <div className="text-xs text-slate-400 space-y-1 mt-2 font-mono">
                  <p>1. User applies keyword/filters</p>
                  <p>2. System validates SearchCriteria</p>
                  <p>3. Filter published & effective rules</p>
                  <p>4. Render metadata & issuing authority</p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col gap-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">UC-007 / UC-008 Workflow</span>
                <h4 className="font-bold text-white text-sm">Approve / Reject Decision</h4>
                <div className="text-xs text-slate-400 space-y-1 mt-2 font-mono">
                  <p>1. Approver inspects submission</p>
                  <p>2. Approve → Publish & record log</p>
                  <p>3. Reject → Require comment (BR-009)</p>
                  <p>4. Return to Draft with feedback</p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 flex flex-col gap-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">UC-015 Workflow</span>
                <h4 className="font-bold text-white text-sm">Version Revisions</h4>
                <div className="text-xs text-slate-400 space-y-1 mt-2 font-mono">
                  <p>1. Author views version lineage</p>
                  <p>2. Retrieve prior baseline (v1)</p>
                  <p>3. Pre-fill new draft revision (v3)</p>
                  <p>4. Re-enter review pipeline (BR-006)</p>
                </div>
              </div>

            </div>

            {/* Architecture Overview Table */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/80">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Modelled Domain Entities (Assignment 4 Class Model)</h4>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center text-xs">
                <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-yellow-400 font-bold block">User</span>
                  <span className="text-[10px] text-slate-400">Student, Faculty, Admin</span>
                </div>
                <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-yellow-400 font-bold block">AuthorEditor</span>
                  <span className="text-[10px] text-slate-400">Subspecialization</span>
                </div>
                <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-yellow-400 font-bold block">Approver</span>
                  <span className="text-[10px] text-slate-400">Subspecialization</span>
                </div>
                <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-blue-400 font-bold block">Regulation</span>
                  <span className="text-[10px] text-slate-400">Composite Parent</span>
                </div>
                <div className="bg-slate-800 p-2.5 rounded-lg border border-slate-700">
                  <span className="text-blue-400 font-bold block">RegulationVersion</span>
                  <span className="text-[10px] text-slate-400">Preserved Versions</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* FOOTER */}
      <footer className="bg-slate-800 border-t border-slate-700 py-4 text-center text-xs text-slate-500">
        <p>Software Development Laboratory (CS314) • Team T018 • LNMIIT Jaipur</p>
      </footer>
    </div>
  );
}