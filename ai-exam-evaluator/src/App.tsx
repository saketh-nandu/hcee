import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Layers, 
  Home, 
  Upload, 
  Users, 
  LineChart, 
  Settings as SettingsIcon, 
  LogOut, 
  Lock, 
  Mail, 
  User, 
  Sparkles,
  Info
} from 'lucide-react';
import LandingPage from './components/LandingPage';
import TeacherDashboard from './components/TeacherDashboard';
import UploadPage from './components/UploadPage';
import PipelineViewer from './components/PipelineViewer';
import EvaluationViewer from './components/EvaluationViewer';
import StudentSearch from './components/StudentSearch';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import AgentStudio from './components/AgentStudio';
import { AnswerSheet, Exam, Student, Subject } from './types';

export default function App() {
  // Session States
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role: string } | null>(null);

  // Active workspace route tab
  const [activeTab, setActiveTab] = useState<'landing' | 'dash' | 'upload' | 'processing' | 'eval-viewer' | 'students' | 'analytics' | 'agents' | 'settings'>('landing');
  
  // Selection references
  const [selectedSheetId, setSelectedSheetId] = useState<string | null>(null);
  const [processingSheetId, setProcessingSheetId] = useState<string | null>(null);

  // Dynamic entity registries lists
  const [sheets, setSheets] = useState<AnswerSheet[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  // Auth form modal trigger states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMail, setAuthMail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authName, setAuthName] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [authError, setAuthError] = useState('');

  // Initial Sync from Express databases
  const refreshDatabase = async () => {
    try {
      const sheetsRes = await fetch('/api/sheets');
      const examsRes = await fetch('/api/exams');
      const studentsRes = await fetch('/api/students');

      if (sheetsRes.ok && examsRes.ok && studentsRes.ok) {
        const sheetsData = await sheetsRes.json();
        const examsData = await examsRes.json();
        const studentsData = await studentsRes.json();
        setSheets(sheetsData);
        setExams(examsData);
        setStudents(studentsData);
      }
    } catch (err) {
      console.error("Critical database synchronization error inside React controller:", err);
    }
  };

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setCurrentUser(data.user);
          }
        }
      } catch (err) {
        console.error("Session resolve errors:", err);
      } finally {
        setIsLoadingSession(false);
      }
    };
    
    fetchSession();
    refreshDatabase();
    
    // Auto sync dashboard items list every 10 seconds to capture completed pipelines
    const timer = setInterval(refreshDatabase, 10000);
    return () => clearInterval(timer);
  }, []);

  // Trigger login via auth modals
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const endpoint = isSigningUp ? '/api/auth/signup' : '/api/auth/login';
    const payload = isSigningUp 
      ? { email: authMail, password: authPass, name: authName, role: 'Teacher' }
      : { email: authMail, password: authPass };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentUser(data.user);
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setActiveTab('dash');
        refreshDatabase();
      } else {
        setAuthError(data.error || 'Authentication credential checks failed.');
      }
    } catch (err) {
      setAuthError('Connection failure.');
    }
  };

  // Skip Login Flow (Frictionless demo setup)
  const handleFrictionlessLaunch = () => {
    setIsLoggedIn(true);
    setCurrentUser({ name: 'Dr. Sarah Jenkins', email: 'teacher@aieval.edu', role: 'Teacher' });
    setActiveTab('dash');
    refreshDatabase();
  };

  // Exit workspace and return back to landings page
  const handleSignOut = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setActiveTab('landing');
  };

  // Configure new student profile POST
  const handleAddStudentProfile = async (student: { name: string; hall_ticket: string; className: string; section: string }) => {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
      });
      if (res.ok) {
        refreshDatabase();
      }
    } catch (err) {
      console.error("failed adding student profile:", err);
    }
  };

  // Configure new exam rubric criteria POST
  const handleAddExamRubric = async (exam: { title: string; subjectId: string; maxMarks: string; questionPaperText: string; rubricKeyText: string }) => {
    try {
      const res = await fetch('/api/exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exam)
      });
      if (res.ok) {
        refreshDatabase();
      }
    } catch (err) {
      console.error("failed adding exam rubric:", err);
    }
  };

  // Start Multiagent evaluation pipeline job
  const handleStartEvaluationJob = async (payload: {
    examId: string;
    studentId: string;
    fileName: string;
    fileBase64?: string;
    pagesCount: number;
    rawTextPreset?: string;
  }) => {
    try {
      const res = await fetch('/api/evaluate/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setProcessingSheetId(data.sheetId);
        setActiveTab('processing');
        refreshDatabase();
      }
    } catch (err) {
      console.error("Grading queue trigger error:", err);
    }
  };

  // Select target sheet
  const handleSelectActiveSheet = (id: string) => {
    setSelectedSheetId(id);
    const targetSheet = sheets.find(s => s.id === id);
    if (targetSheet && targetSheet.evaluationStatus === 'Processing') {
      setProcessingSheetId(id);
      setActiveTab('processing');
    } else {
      setActiveTab('eval-viewer');
    }
  };

  const selectedSheetForEvaluation = sheets.find(s => s.id === selectedSheetId);
  const activeProcessingSheet = sheets.find(s => s.id === processingSheetId);

  return (
    <div className="bg-[#fcfcfc] text-neutral-900 min-h-screen font-sans selection:bg-neutral-900 selection:text-white relative flex">
      
      {/* SaaS Authentication Drawers / modals */}
      {showLoginModal && (
        <div id="auth-modal-overlay" className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-200 rounded-xl w-full max-w-sm p-8 space-y-6 relative shadow-2xl">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-950 font-bold cursor-pointer transition-colors"
            >
              ✕
            </button>
            
            <div className="text-center space-y-3">
              <div className="bg-neutral-900 text-white p-2.5 rounded-xl w-fit mx-auto shadow-md">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold uppercase tracking-tight text-neutral-900">{isSigningUp ? "Create Profile" : "Login Console"}</h3>
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono font-bold">Authenticating Sandbox</p>
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-650 text-xs py-2.5 px-3 rounded-lg text-center font-mono font-medium">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs font-bold select-none">
              {isSigningUp && (
                <div className="space-y-1">
                  <label className="text-neutral-500 block uppercase tracking-wider text-[9px] font-mono">Assessor Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                    <input 
                      type="text" 
                      placeholder="Dr. Sarah Jenkins"
                      value={authName}
                      onChange={e => setAuthName(e.target.value)}
                      className="w-full bg-neutral-50 border border-neutral-250 focus:border-neutral-950 rounded-lg py-3 pl-10 pr-4 text-neutral-900 outline-none font-mono"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-neutral-500 block uppercase tracking-wider text-[9px] font-mono">Workspace Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input 
                    type="email" 
                    placeholder="teacher@aieval.edu"
                    value={authMail}
                    onChange={e => setAuthMail(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-250 focus:border-neutral-950 rounded-lg py-3 pl-10 pr-4 text-neutral-900 outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-500 block uppercase tracking-wider text-[9px] font-mono">Access Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={authPass}
                    onChange={e => setAuthPass(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-250 focus:border-neutral-950 rounded-lg py-3 pl-10 pr-4 text-neutral-900 outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold uppercase tracking-wider py-4 rounded-lg transition-all cursor-pointer text-[11px]"
              >
                {isSigningUp ? "Create Sandbox Account" : "Access Console"}
              </button>
            </form>

            <div className="text-center font-bold text-[10px] tracking-wider uppercase text-neutral-500">
              <button 
                onClick={() => setIsSigningUp(!isSigningUp)}
                className="hover:text-black hover:underline cursor-pointer transition-all"
              >
                {isSigningUp ? "Already signed up? Sign-In" : "Need account? Create credentials"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main workspace layout */}
      {!isLoggedIn || activeTab === 'landing' ? (
        <main className="w-full animate-fade-inUp">
          <LandingPage 
            onStart={handleFrictionlessLaunch} 
            onLogin={() => { setIsSigningUp(false); setShowLoginModal(true); }} 
          />
        </main>
      ) : (
        <div className="w-full flex">
          
          {/* Static Left Sidebar Navigation */}
          <aside id="workspace-sidebar" className="sticky top-0 h-screen w-64 bg-white border-r border-neutral-200/80 flex flex-col justify-between shrink-0 py-6 px-4 print:hidden">
            <div className="space-y-8">
              {/* Brand log */}
              <div className="flex items-center space-x-3 px-2">
                <div className="bg-neutral-900 text-white p-2 rounded-lg shadow-sm">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-sm tracking-tight text-neutral-900 block">AI Exam Evaluator</span>
                  <span className="text-[9px] block text-neutral-500 font-mono uppercase tracking-[0.22em] leading-none mt-0.5">Teacher Core</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1 select-none text-[10px] font-bold uppercase tracking-widest">
                <button 
                  onClick={() => setActiveTab('dash')}
                  className={`w-full text-left px-4 py-3.5 rounded-lg flex items-center space-x-3 transition-all cursor-pointer ${
                    activeTab === 'dash' ? 'bg-neutral-900 text-white font-black' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                <button 
                  onClick={() => setActiveTab('students')}
                  className={`w-full text-left px-4 py-3.5 rounded-lg flex items-center space-x-3 transition-all cursor-pointer ${
                    activeTab === 'students' ? 'bg-neutral-900 text-white font-black' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Cohort Insights</span>
                </button>

                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left px-4 py-3.5 rounded-lg flex items-center space-x-3 transition-all cursor-pointer ${
                    activeTab === 'settings' ? 'bg-neutral-900 text-white font-black' : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <SettingsIcon className="w-4 h-4" />
                  <span>Control Desk</span>
                </button>
              </nav>
            </div>

            {/* Profile Sign-out footer */}
            <div className="space-y-4 border-t border-neutral-200/85 pt-4">
              <div className="flex items-center space-x-3 px-2">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold text-xs uppercase">
                  {currentUser?.name.charAt(0)}
                </div>
                <div className="truncate max-w-[140px]">
                  <span className="text-xs font-bold text-neutral-900 block">{currentUser?.name}</span>
                  <span className="text-[10px] text-neutral-500 block font-mono">{currentUser?.email}</span>
                </div>
              </div>
              
              <button 
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2.5 rounded-lg flex items-center space-x-3 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 text-xs font-bold transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-neutral-450" />
                <span>Exit Workspace</span>
              </button>
            </div>
          </aside>

          {/* Core Content Layout Area */}
          <main className="flex-1 bg-[#fcfcfc] overflow-y-auto h-screen relative print:h-auto print:bg-white pb-12">
            {activeTab === 'dash' && (
              <TeacherDashboard 
                sheets={sheets} 
                exams={exams} 
                students={students} 
                onSelectSheet={handleSelectActiveSheet}
                onNavigateToAnalytics={() => setActiveTab('students')}
                onStartEvaluation={handleStartEvaluationJob}
                onAddStudent={handleAddStudentProfile}
                onAddExam={handleAddExamRubric}
              />
            )}

            {activeTab === 'processing' && activeProcessingSheet && (
              <PipelineViewer 
                sheetId={activeProcessingSheet.id}
                associatedExam={exams.find(e => e.id === activeProcessingSheet.examId)}
                onSelectSheet={handleSelectActiveSheet}
                onNavigateHome={() => setActiveTab('dash')}
              />
            )}

            {activeTab === 'eval-viewer' && selectedSheetId && (
              <EvaluationViewer 
                sheetId={selectedSheetId}
                associatedExam={exams.find(e => e.id === selectedSheetForEvaluation?.examId)}
                onNavigateHome={() => setActiveTab('dash')}
                onRefresh={refreshDatabase}
              />
            )}

            {activeTab === 'students' && (
              <StudentSearch 
                students={students}
                sheets={sheets}
                exams={exams}
                onSelectSheet={handleSelectActiveSheet}
              />
            )}

            {activeTab === 'settings' && (
              <Settings />
            )}
          </main>

        </div>
      )}

    </div>
  );
}
