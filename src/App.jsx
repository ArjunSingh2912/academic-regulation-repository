import React, { useState } from 'react';
import { 
  BookOpen, Search, History, CheckCircle, 
  Shield, Edit, AlertCircle, LogOut, User, Lock 
} from 'lucide-react';

// Hardcoded Users & Passwords
const USERS_DATABASE = [
  { id: 'U-001', name: 'Aarav Sharma', email: 'student@lnmiit.ac.in', password: 'student123', role: 'Student', designation: 'UG Student' },
  { id: 'U-002', name: 'Dr. Rajesh Kumar', email: 'faculty@lnmiit.ac.in', password: 'faculty123', role: 'Faculty', designation: 'Associate Professor' },
  { id: 'U-014', name: 'Ananya Verma', email: 'author@lnmiit.ac.in', password: 'author123', role: 'AuthorEditor', designation: 'Assistant Registrar' },
  { id: 'U-005', name: 'Prof. S. N. Biswas', email: 'approver@lnmiit.ac.in', password: 'approver123', role: 'Approver', designation: 'Chair, UG Committee' },
  { id: 'U-099', name: 'System Admin', email: 'admin@lnmiit.ac.in', password: 'admin123', role: 'Administrator', designation: 'System Administrator' },
];

export default function App() {
  // Session State
  const [currentUser, setCurrentUser] = useState(null);
  
  // Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Dashboard State
  const [activeTab, setActiveTab] = useState('repository');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReg, setSelectedReg] = useState(null);

  // Sample Regulations Data
  const [regulations] = useState([
    {
      id: 'REG-001',
      title: 'Minimum Attendance Policy',
      category: 'Attendance',
      currentStatus: 'Published',
      version: 'v2.0',
      effectiveDate: '2025-08-01',
      content: 'Students must maintain a minimum of 80% attendance in all registered courses to be eligible for end-semester examinations.'
    },
    {
      id: 'REG-002',
      title: 'Grading and Evaluation Guidelines',
      category: 'Examinations',
      currentStatus: 'Under Review',
      version: 'v1.0',
      effectiveDate: '2026-01-01',
      content: 'Implementation of relative grading across upper-level courses. Mid-term examinations shall carry a maximum weightage of 30%.'
    }
  ]);

  // Handle Login Action
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const matchedUser = USERS_DATABASE.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (matchedUser) {
      setCurrentUser(matchedUser);
      setErrorMessage('');
      // Default initial tab based on role
      if (matchedUser.role === 'Approver') setActiveTab('review');
      else if (matchedUser.role === 'AuthorEditor') setActiveTab('drafts');
      else setActiveTab('repository');
    } else {
      setErrorMessage('Invalid institutional email or password.');
    }
  };

  // Quick Select Account Handler for Easy Testing
  const handleQuickSelect = (account) => {
    setEmail(account.email);
    setPassword(account.password);
  };

  // Handle Logout Action
  const handleLogout = () => {
    setCurrentUser(null);
    setEmail('');
    setPassword('');
    setSelectedReg(null);
  };

  // -------------------------------------------------------------
  // SCREEN 1: LOGIN PAGE (Shown whenever currentUser is null)
  // -------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 max-w-md w-full p-8">
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-12 h-12 bg-blue-900 text-white rounded-xl flex items-center justify-center mb-3 shadow">
              <BookOpen size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Academic Regulation Repository</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to access institutional policies</p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                <User size={15} /> Institutional Email
              </label>
              <input
                type="email"
                placeholder="e.g. student@lnmiit.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1.5">
                <Lock size={15} /> Password
              </label>
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-900 text-white font-medium rounded-lg hover:bg-blue-800 transition shadow"
            >
              Sign In
            </button>
          </form>

          {/* Quick Demo Selector */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 font-semibold mb-2 uppercase tracking-wider">Test Account Quick-Fill:</p>
            <div className="space-y-1.5">
              {USERS_DATABASE.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => handleQuickSelect(acc)}
                  className="w-full text-left px-3 py-2 rounded border border-slate-200 hover:bg-slate-50 text-xs flex justify-between items-center transition"
                >
                  <span className="font-semibold text-slate-700">{acc.role}</span>
                  <span className="text-slate-400">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SCREEN 2: MAIN REPOSITORY DASHBOARD (Shown after authentication)
  // -------------------------------------------------------------
  const visibleRegulations = regulations.filter((reg) => {
    if ((currentUser.role === 'Student' || currentUser.role === 'Faculty') && reg.currentStatus !== 'Published') {
      return false;
    }
    return reg.title.toLowerCase().includes(searchQuery.toLowerCase()) || reg.category.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Header */}
      <header className="bg-blue-950 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen size={28} className="text-blue-400" />
            <div>
              <h1 className="text-lg font-bold leading-tight">Academic Regulation Repository</h1>
              <p className="text-xs text-blue-300">Logged in as {currentUser.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold">{currentUser.name}</p>
              <p className="text-xs text-blue-300">{currentUser.designation}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 bg-blue-900 hover:bg-blue-800 text-blue-200 hover:text-white rounded-lg flex items-center gap-1.5 text-xs font-medium transition"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Bar based on Role */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex gap-2">
          <button
            onClick={() => { setActiveTab('repository'); setSelectedReg(null); }}
            className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${
              activeTab === 'repository' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search size={16} />
            Browse Regulations
          </button>

          {(currentUser.role === 'AuthorEditor' || currentUser.role === 'Administrator') && (
            <button
              onClick={() => { setActiveTab('drafts'); setSelectedReg(null); }}
              className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${
                activeTab === 'drafts' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit size={16} />
              Authoring & Drafts
            </button>
          )}

          {(currentUser.role === 'Approver' || currentUser.role === 'Administrator') && (
            <button
              onClick={() => { setActiveTab('review'); setSelectedReg(null); }}
              className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${
                activeTab === 'review' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <CheckCircle size={16} />
              Review Queue
            </button>
          )}

          {currentUser.role === 'Administrator' && (
            <button
              onClick={() => { setActiveTab('admin'); setSelectedReg(null); }}
              className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 ${
                activeTab === 'admin' ? 'border-blue-900 text-blue-900' : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield size={16} />
              Admin Settings
            </button>
          )}
        </div>
      </nav>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-6 flex-1 w-full">
        {activeTab === 'repository' && !selectedReg && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search regulations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Version</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleRegulations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50">
                      <td className="p-4 font-semibold text-slate-800">{reg.title}</td>
                      <td className="p-4">{reg.category}</td>
                      <td className="p-4">{reg.version}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          reg.currentStatus === 'Published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {reg.currentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedReg(reg)}
                          className="px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-medium hover:bg-blue-800"
                        >
                          View Policy
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedReg && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <span className="text-xs font-bold text-blue-900 uppercase">{selectedReg.category}</span>
                <h2 className="text-xl font-bold text-slate-900">{selectedReg.title}</h2>
              </div>
              <button
                onClick={() => setSelectedReg(null)}
                className="px-3 py-1.5 border rounded-lg text-xs text-slate-600 hover:bg-slate-50"
              >
                ← Back
              </button>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border text-sm text-slate-800 leading-relaxed">
              {selectedReg.content}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}