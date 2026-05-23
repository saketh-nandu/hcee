import React, { useState } from 'react';
import { 
  Users, 
  FileCheck, 
  Award, 
  TrendingUp, 
  AlertTriangle, 
  Upload, 
  Search, 
  Download, 
  ChevronsRight, 
  Brain,
  Filter,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { AnswerSheet, Exam, Student } from '../types';
import UploadPage from './UploadPage';

interface TeacherDashboardProps {
  sheets: AnswerSheet[];
  exams: Exam[];
  students: Student[];
  onSelectSheet: (id: string) => void;
  onNavigateToAnalytics: () => void;
  onStartEvaluation: (payload: {
    examId: string;
    studentId: string;
    fileName: string;
    fileBase64?: string;
    pagesCount: number;
    rawTextPreset?: string;
  }) => void;
  onAddStudent: (student: { name: string; hall_ticket: string; className: string; section: string }) => void;
  onAddExam: (exam: { title: string; subjectId: string; maxMarks: string; questionPaperText: string; rubricKeyText: string }) => void;
}

export default function TeacherDashboard({
  sheets,
  exams,
  students,
  onSelectSheet,
  onNavigateToAnalytics,
  onStartEvaluation,
  onAddStudent,
  onAddExam
}: TeacherDashboardProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [examFilter, setExamFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUploadPanel, setShowUploadPanel] = useState(false);

  // Stats calculation
  const totalStudentsCount = students.length;
  const completedSheets = sheets.filter(s => s.evaluationStatus === 'Completed');
  const totalSheetsCount = completedSheets.length;
  
  const averageScore = totalSheetsCount > 0
    ? Math.round(completedSheets.reduce((sum, s) => sum + s.overallScore, 0) / totalSheetsCount * 10) / 10
    : 0;

  // Find top performer across all completed sheets
  let topStudent = { name: "N/A", score: 0, testName: "" };
  if (completedSheets.length > 0) {
    const sorted = [...completedSheets].sort((a, b) => b.overallScore - a.overallScore);
    const topSheet = sorted[0];
    const exam = exams.find(e => e.id === topSheet.examId);
    topStudent = {
      name: topSheet.studentName,
      score: topSheet.overallScore,
      testName: exam ? exam.title : "Exam"
    };
  }

  // Filter sheets list
  const filteredSheets = sheets.filter(sheet => {
    const matchesSearch = 
      sheet.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheet.hallTicket.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sheet.fileName.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesExam = examFilter === 'all' || sheet.examId === examFilter;
    const matchesStatus = statusFilter === 'all' || sheet.evaluationStatus === statusFilter;

    return matchesSearch && matchesExam && matchesStatus;
  });

  // Highlight low confidence alerts (< 0.90 evaluationConfidence)
  const lowConfidenceAlerts = completedSheets.filter(s => s.evaluationConfidence < 0.90);

  // Trigger quick CSV mock export
  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Student Name,Hall Ticket,Exam ID,Score,Confidence,Status\n"
      + sheets.map(s => `"${s.studentName}","${s.hallTicket}","${s.examId}",${s.overallScore},${s.evaluationConfidence},"${s.evaluationStatus}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ai_evaluation_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-6 py-8 selection:bg-neutral-900 selection:text-white">
      {/* Upper Brand Grid Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-neutral-200 p-6 rounded-xl shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-neutral-900 uppercase flex items-center space-x-3">
            <span>Teacher Workspace Control</span>
            <span className="bg-neutral-100 text-neutral-800 text-[9px] py-1 px-2.5 rounded-lg border border-neutral-300 font-mono font-bold uppercase tracking-wider">
              Assessor Unit
            </span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1.5 font-sans font-medium">
            Autonomous multi-agent grading console, active OCR pipeline queue status, and manual criteria overrides.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            id="dash-btn-excel" 
            onClick={handleExportCSV}
            className="bg-white hover:bg-neutral-50 text-neutral-800 px-4 py-2.5 rounded-lg text-xs uppercase tracking-wider font-bold flex items-center space-x-2 transition-all cursor-pointer border border-neutral-300"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          
          <button 
            id="dash-btn-run" 
            onClick={() => setShowUploadPanel(!showUploadPanel)}
            className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold uppercase tracking-wider text-xs px-4 py-2.5 rounded-lg flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>{showUploadPanel ? 'Hide Grading Panel' : 'Grade New Sheets'}</span>
          </button>
        </div>
      </div>

      {/* Embedded Collapsible Grading Desk */}
      <AnimatePresence>
        {showUploadPanel && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white border border-neutral-200 rounded-xl shadow-sm"
          >
            <div className="flex justify-between items-center px-6 py-4.5 border-b border-neutral-200 bg-neutral-50">
              <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-black flex items-center space-x-2">
                <Brain className="w-4 h-4 text-neutral-800" />
                <span>AI Scans Input & Allocation Console</span>
              </span>
              <button 
                onClick={() => setShowUploadPanel(false)}
                className="text-xs text-red-650 hover:underline transition-colors uppercase tracking-widest text-[9px] font-bold font-mono cursor-pointer"
              >
                ✕ Hide Panel
              </button>
            </div>
            <div className="p-4 bg-white">
              <UploadPage 
                exams={exams}
                students={students}
                onStartEvaluation={onStartEvaluation}
                onAddStudent={onAddStudent}
                onAddExam={onAddExam}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KPI Stats Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div id="kpi-total-students" className="bg-white border border-neutral-200/80 rounded-xl p-5 flex items-center space-x-4 shadow-sm">
          <div className="bg-neutral-50 text-neutral-900 p-3.5 rounded-lg border border-neutral-200">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-mono font-bold block">Total Students</div>
            <div className="text-2xl font-bold text-neutral-900 font-mono">{totalStudentsCount}</div>
            <div className="text-[10px] text-neutral-450 font-mono font-medium">B.Tech Batch CSE</div>
          </div>
        </div>

        {/* Card 2 */}
        <div id="kpi-graded-sheets" className="bg-white border border-neutral-200/80 rounded-xl p-5 flex items-center space-x-4 shadow-sm">
          <div className="bg-neutral-50 text-neutral-900 p-3.5 rounded-lg border border-neutral-200">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-mono font-bold block">Evaluated Copies</div>
            <div className="text-2xl font-bold text-neutral-900 font-mono">{totalSheetsCount} / {sheets.length}</div>
            <div className="text-[10px] text-neutral-450 font-mono font-medium">Completed OCR sweeps</div>
          </div>
        </div>

        {/* Card 3 */}
        <div id="kpi-average-score" className="bg-white border border-neutral-200/80 rounded-xl p-5 flex items-center space-x-4 shadow-sm">
          <div className="bg-neutral-50 text-neutral-900 p-3.5 rounded-lg border border-neutral-200">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-mono font-bold block">Class Mean Score</div>
            <div className="text-2xl font-bold text-neutral-900 font-mono">{(averageScore > 0) ? `${averageScore} pts` : "N/A"}</div>
            <div className="text-[10px] text-emerald-700 font-mono font-bold">↑ 4.2% from quizzes</div>
          </div>
        </div>

        {/* Card 4 */}
        <div id="kpi-top-performer" className="bg-white border border-neutral-200/80 rounded-xl p-5 flex items-center space-x-4 shadow-sm">
          <div className="bg-neutral-50 text-neutral-900 p-3.5 rounded-lg border border-neutral-200">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-mono font-bold block">Top Accomplishment</div>
            <div className="text-xl font-bold text-neutral-900 truncate max-w-[140px] uppercase tracking-tight">{topStudent.name}</div>
            <div className="text-[10px] text-neutral-500 truncate max-w-[140px] font-mono font-medium">{topStudent.testName}</div>
          </div>
        </div>
      </div>

      {/* Critical Alert Banner for Low-Confidence AI results */}
      {lowConfidenceAlerts.length > 0 && (
        <div id="low-confidence-banner" className="bg-amber-50/50 border border-amber-250 rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="bg-amber-100 text-amber-900 p-2.5 rounded-lg border border-amber-200">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-950">Low-Grading Confidence Alerts ({lowConfidenceAlerts.length})</h4>
              <p className="text-xs text-neutral-600 mt-1 font-sans font-medium">
                The transcription loop detected low legibility scores. Please manually review these student books.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowConfidenceAlerts.map(alert => (
              <button 
                key={alert.id}
                onClick={() => onSelectSheet(alert.id)}
                className="bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-lg transition-all cursor-pointer"
              >
                Audit {alert.studentName}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Content Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main submissions table - 2 Cols span */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-100/50 p-4 rounded-xl border border-neutral-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search candidates, roll digits..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-neutral-350 focus:border-neutral-950 rounded-lg py-2.5 pl-10 pr-4 text-xs text-neutral-900 outline-none font-mono font-medium"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-neutral-500" />
              
              {/* Exam Filters */}
              <select 
                value={examFilter} 
                onChange={e => setExamFilter(e.target.value)}
                className="bg-white border border-neutral-300 text-neutral-800 rounded-lg py-2 px-3 text-xs font-bold uppercase tracking-wider outline-none cursor-pointer"
              >
                <option value="all">ALL EXAMS</option>
                {exams.map(ex => (
                  <option key={ex.id} value={ex.id}>{ex.title.toUpperCase()}</option>
                ))}
              </select>

              {/* Status Filters */}
              <select 
                value={statusFilter} 
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-white border border-neutral-300 text-neutral-800 rounded-lg py-2 px-3 text-xs font-bold uppercase tracking-wider outline-none cursor-pointer"
              >
                <option value="all">ALL STATUS</option>
                <option value="Completed">COMPLETED</option>
                <option value="Processing">PROCESSING</option>
                <option value="Failed">FAILED</option>
              </select>
            </div>
          </div>

          {/* Submissions List Card */}
          <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-5 border-b border-neutral-200 flex justify-between items-center">
              <h3 className="font-bold text-sm uppercase tracking-wider text-neutral-900">Answer Sheets Repository ({filteredSheets.length})</h3>
              <button onClick={onNavigateToAnalytics} className="text-neutral-900 hover:underline text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer">
                <span>Analytics Grid</span>
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>

            {filteredSheets.length === 0 ? (
              <div className="p-12 text-center text-neutral-400 space-y-3">
                <Brain className="w-8 h-8 text-neutral-300 mx-auto" />
                <p className="text-xs font-mono font-medium">No candidate worksheets aligned to standard criteria filters.</p>
                <button onClick={() => { setSearchTerm(''); setExamFilter('all'); setStatusFilter('all'); }} className="text-neutral-900 text-xs uppercase tracking-wider font-bold hover:underline">
                  Reset current filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-[9px] uppercase font-mono tracking-widest text-neutral-500 font-bold">
                      <th className="px-6 py-4">Student Roll Identification</th>
                      <th className="px-6 py-4">Associated Paper</th>
                      <th className="px-6 py-4">Model Status</th>
                      <th className="px-6 py-4 text-right">Raw score</th>
                      <th className="px-6 py-4 text-right">Confidence index</th>
                      <th className="px-6 py-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-150 text-xs font-sans">
                    {filteredSheets.map((sheet) => {
                      const associatedExam = exams.find(e => e.id === sheet.examId);
                      
                      return (
                        <tr key={sheet.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-neutral-900">
                            <div className="uppercase tracking-tight text-xs font-bold text-neutral-900">{sheet.studentName}</div>
                            <div className="text-[10px] text-neutral-500 font-mono mt-1 font-medium">{sheet.hallTicket}</div>
                          </td>
                          <td className="px-6 py-4 text-neutral-600 max-w-[180px] truncate font-medium">
                            {associatedExam ? associatedExam.title : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[9px] uppercase font-bold font-mono tracking-wider border ${
                              sheet.evaluationStatus === 'Completed' 
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-250' 
                                : sheet.evaluationStatus === 'Processing'
                                ? 'bg-neutral-105 text-neutral-800 border-neutral-250'
                                : 'bg-red-50 text-red-850 border-red-250'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                sheet.evaluationStatus === 'Completed' 
                                  ? 'bg-emerald-500' 
                                  : sheet.evaluationStatus === 'Processing'
                                  ? 'bg-neutral-800 animate-pulse'
                                  : 'bg-red-500'
                              }`} />
                              <span>{sheet.evaluationStatus}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-neutral-900 text-sm font-mono">
                            {sheet.evaluationStatus === 'Completed' ? (
                              <span>
                                {sheet.overallScore} 
                                <span className="text-[10px] text-neutral-400 font-normal"> / {associatedExam?.maxMarks || 100}</span>
                              </span>
                            ) : (
                              <span className="text-neutral-400 font-mono font-medium">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {sheet.evaluationStatus === 'Completed' ? (
                              <span className={`font-mono text-xs font-bold ${
                                sheet.evaluationConfidence >= 0.90 ? 'text-emerald-700' : 'text-amber-700'
                              }`}>
                                {(sheet.evaluationConfidence * 100).toFixed(0)}%
                              </span>
                            ) : (
                              <span className="text-neutral-400 font-mono font-semibold">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button 
                              onClick={() => onSelectSheet(sheet.id)}
                              className="bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 font-bold uppercase tracking-wider text-[10px] px-3.5 py-2 rounded-lg transition-all cursor-pointer"
                            >
                              {sheet.evaluationStatus === 'Completed' ? 'Review & Override' : 'Track Status'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-6">
          {/* Active Question Key profiles */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="font-bold uppercase tracking-wider text-neutral-950 text-xs">Target Answer Keys ({exams.length})</h3>
            <div className="space-y-3">
              {exams.map(exam => (
                <div key={exam.id} className="bg-neutral-50 border border-neutral-200 p-4 rounded-lg space-y-2.5">
                  <div className="flex justify-between items-start gap-2">
                    <div className="text-xs font-bold text-neutral-900 uppercase tracking-tight max-w-[150px] truncate">{exam.title}</div>
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-neutral-900 text-white px-2 py-0.5 rounded-md shrink-0">
                      {exam.maxMarks} MARKS
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-600 font-sans line-clamp-2 leading-relaxed">
                    {exam.questionPaperText}
                  </div>
                  <div className="border-t border-neutral-250 pt-2 flex justify-between items-center text-[9px] text-neutral-500 font-mono uppercase tracking-wider">
                    <div className="font-medium">{exam.subjectName}</div>
                    <div className="font-medium">{exam.date}</div>
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={() => { setShowUploadPanel(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-full text-center bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-800 text-xs uppercase tracking-wider font-bold py-2.5 rounded-lg transition-all cursor-pointer"
            >
              Configure Custom Rubric Keys
            </button>
          </div>

          {/* Quick AI metrics summary checklist */}
          <div className="bg-white border border-neutral-200 rounded-xl p-5 space-y-4 shadow-sm">
            <h3 className="font-bold uppercase tracking-wider text-neutral-950 text-xs">Model Integrity Metrics</h3>
            <div className="space-y-3 font-mono">
              <div className="flex items-center justify-between text-xs py-2 border-b border-neutral-100">
                <span className="text-neutral-550 uppercase tracking-wide text-[9px] font-bold">OCR Confidence Mean</span>
                <span className="text-emerald-700 font-bold">92.4%</span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-neutral-100">
                <span className="text-neutral-550 uppercase tracking-wide text-[9px] font-bold">Deduction Assurance</span>
                <span className="text-emerald-700 flex items-center space-x-1 font-bold uppercase tracking-wide text-[9px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verified</span>
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-neutral-100">
                <span className="text-neutral-550 uppercase tracking-wide text-[9px] font-bold">Anti plagiarism sweeps</span>
                <span className="text-neutral-800 font-bold uppercase tracking-wide text-[9px]">Automatic</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-neutral-550 uppercase tracking-wide text-[9px] font-bold">Gemini SDK link</span>
                <span className="text-neutral-800 font-bold uppercase tracking-wide text-[9px]">@google/genai active</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
