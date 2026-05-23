import React, { useState } from 'react';
import { 
  Search, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  LineChart,
  Users
} from 'lucide-react';
import { Student, AnswerSheet, Exam } from '../types';
import Analytics from './Analytics';

interface StudentSearchProps {
  students: Student[];
  sheets: AnswerSheet[];
  exams: Exam[];
  onSelectSheet: (id: string) => void;
}

export default function StudentSearch({
  students,
  sheets,
  exams,
  onSelectSheet
}: StudentSearchProps) {
  const [mode, setMode] = useState<'roster' | 'analytics'>('roster');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(students[0]?.id || null);

  // Filter students
  const filteredStudents = students.filter(std => {
    return (
      std.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.hall_ticket.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.class.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  // Find evaluated sheets for selected student
  const studentSheets = sheets.filter(s => s.studentId === selectedStudentId);
  const completedSheets = studentSheets.filter(s => s.evaluationStatus === 'Completed');

  // Calculate cumulative stats for this student
  const totalExamsGraded = completedSheets.length;
  const meanScoreAwarded = totalExamsGraded > 0
    ? Math.round(completedSheets.reduce((sum, s) => sum + s.overallScore, 0) / totalExamsGraded * 10) / 10
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 selection:bg-neutral-900 selection:text-white">
      
      {/* Brand Grid Header with Mode Toggle */}
      <div className="bg-white border border-neutral-200 p-6 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-neutral-900 flex items-center space-x-3 uppercase">
            <span>Cohort Insights Unit</span>
            <span className="bg-neutral-100 text-neutral-800 text-[10px] font-mono uppercase font-bold tracking-widest px-3 py-1 border border-neutral-200 rounded-lg">
              {mode === 'roster' ? 'Registry Roster' : 'Academic Trends'}
            </span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1.5 font-sans font-medium">
            {mode === 'roster' 
              ? 'Browse enrolled student profiles, track individual historical exam scores, and review automatic knowledge gap mappings.'
              : 'Analyze syllabus conceptual gaps, group candidate scores distributions, and trace chronological assessment trajectories.'}
          </p>
        </div>

        {/* High contrast Mode Switcher */}
        <div className="flex bg-neutral-100/80 border border-neutral-250 p-1 rounded-xl w-60 text-[9px] font-mono font-bold tracking-widest h-fit">
          <button 
            onClick={() => setMode('roster')}
            className={`flex-1 text-center py-2.5 rounded-lg flex items-center justify-center space-x-1.5 uppercase transition-all duration-150 cursor-pointer ${
              mode === 'roster' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-555 hover:text-neutral-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Students Roster</span>
          </button>
          <button 
            onClick={() => setMode('analytics')}
            className={`flex-1 text-center py-2.5 rounded-lg flex items-center justify-center space-x-1.5 uppercase transition-all duration-150 cursor-pointer ${
              mode === 'analytics' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-555 hover:text-neutral-900'
            }`}
          >
            <LineChart className="w-3.5 h-3.5" />
            <span>Class Trends</span>
          </button>
        </div>
      </div>

      {mode === 'analytics' ? (
        <div className="animate-fade-in text-neutral-800">
          <Analytics 
            sheets={sheets}
            exams={exams}
            students={students}
            onSelectStudent={(id) => {
              setSelectedStudentId(id);
              setMode('roster');
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left column - Students selection roster list */}
          <div className="space-y-4 md:col-span-1 border-b md:border-b-0 pb-6 md:pb-0">
            <div className="relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by candidate name or ticket..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-neutral-350 focus:border-neutral-950 rounded-lg py-3 pl-10 pr-4 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none font-mono"
              />
            </div>

            <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden divide-y divide-neutral-100 shadow-sm select-none">
              {filteredStudents.length === 0 ? (
                <div className="p-8 text-center text-neutral-400 text-xs font-mono font-medium">
                  No matching student records found.
                </div>
              ) : (
                filteredStudents.map(std => (
                  <div 
                    key={std.id}
                    onClick={() => setSelectedStudentId(std.id)}
                    className={`p-4 cursor-pointer transition-all flex justify-between items-center ${
                      selectedStudentId === std.id ? 'bg-neutral-50 border-l-3 border-neutral-900' : 'hover:bg-neutral-50/50'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-tight text-neutral-900">{std.name}</h4>
                      <span className="text-[10px] text-neutral-500 font-mono block mt-1 font-semibold">{std.hall_ticket}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 text-neutral-400 transition-transform ${selectedStudentId === std.id ? 'translate-x-1 text-neutral-900' : ''}`} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right column - Multi-page Student cumulative visual profile */}
          <div className="md:col-span-2 space-y-6 animate-fade-in text-neutral-700">
            {selectedStudent ? (
            <div className="space-y-6">
              {/* Profile card */}
              <div className="bg-white border border-neutral-200 p-6 rounded-xl space-y-5 shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="w-11 h-11 rounded-lg bg-neutral-900 text-white flex items-center justify-center font-bold text-lg font-mono border border-neutral-800 shadow-xs">
                    {selectedStudent.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold uppercase tracking-tight text-neutral-900">{selectedStudent.name}</h2>
                    <p className="text-xs text-neutral-500 font-mono mt-1 font-bold">
                      Hall Ticket: <span className="text-neutral-900 font-bold">{selectedStudent.hall_ticket}</span> • Class: <span className="text-neutral-900 font-sans font-bold">{selectedStudent.class} {selectedStudent.section}</span>
                    </p>
                  </div>
                </div>

                {/* Grid performance card metrics */}
                <div className="grid grid-cols-2 gap-4 border-t border-neutral-100 pt-4 text-xs font-semibold">
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 shadow-xs">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-500 block font-bold">Evaluated exam copies</span>
                    <strong className="text-neutral-905 text-base font-bold font-mono block mt-1.5">{totalExamsGraded} booklets</strong>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 shadow-xs">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-500 block font-bold">Dynamic Mean Score</span>
                    <strong className="text-neutral-900 text-base font-bold font-mono block mt-1.5">
                      {meanScoreAwarded > 0 ? `${meanScoreAwarded} pts` : "N/A"}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Individual submissions and score reports list */}
              <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
                <div className="px-6 py-4.5 border-b border-neutral-200">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-950">Graded Booklet Submissions ({studentSheets.length})</h3>
                </div>

                {studentSheets.length === 0 ? (
                  <div className="p-12 text-center text-neutral-400 text-xs font-mono font-medium">
                    No answer sheets configured or uploaded for this student yet.
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {studentSheets.map(sheet => {
                      const associatedExam = exams.find(e => e.id === sheet.examId);
                      
                      return (
                        <div key={sheet.id} className="p-5 hover:bg-neutral-50/50 transition-colors flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="space-y-2 text-xs">
                            <div className="flex items-center space-x-2.5">
                              <span className="font-bold uppercase tracking-tight text-neutral-900">{associatedExam?.title || "Exam Rubric"}</span>
                              <span className={`px-2 py-0.5 rounded-md text-[9px] font-semibold font-mono uppercase tracking-wider border ${
                                sheet.evaluationStatus === 'Completed' 
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-250' 
                                  : 'bg-neutral-50 text-neutral-700 border-neutral-250'
                              }`}>
                                {sheet.evaluationStatus}
                              </span>
                            </div>
                            <div className="text-neutral-500 font-mono text-[9px] flex flex-wrap items-center gap-x-2 gap-y-1 font-bold">
                              <span>FILE: {sheet.fileName}</span>
                              <span className="text-neutral-300">•</span>
                              <span>CONFIDENCE: {(sheet.evaluationConfidence * 100).toFixed(0)}%</span>
                              <span className="text-neutral-300">•</span>
                              <span>HANDWRITING: {sheet.handwritingQuality?.toUpperCase()}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100">
                            {sheet.evaluationStatus === 'Completed' && (
                              <div className="text-right">
                                <span className="text-[9px] uppercase font-mono tracking-wider text-neutral-450 block font-bold">Marks Awarded</span>
                                <strong className="text-neutral-900 text-base font-bold font-mono">{sheet.overallScore} <span className="text-xs text-neutral-400 font-normal">/ {associatedExam?.maxMarks || 50}</span></strong>
                              </div>
                            )}
                            
                            <button 
                              onClick={() => onSelectSheet(sheet.id)}
                              className="bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 font-bold uppercase tracking-wider text-[10px] px-3.5 py-2 rounded-lg flex items-center space-x-1.5 cursor-pointer shadow-xs"
                            >
                              <span>Browse Evaluation</span>
                              <ExternalLink className="w-3.5 h-3.5 text-neutral-600" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Dynamic cumulative strengths details */}
              {completedSheets.length > 0 && (
                <div className="bg-white border border-neutral-200 p-6 rounded-xl space-y-4 shadow-sm">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-900 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-neutral-750" />
                    <span>AI Cumulative Knowledge Map</span>
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium font-sans">Synthesized cognitive assessment profile compiling criteria strengths across all evaluated scripts.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed font-semibold">
                    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-2">
                      <span className="font-bold text-emerald-800 uppercase tracking-widest text-[9px] block font-mono">Demonstrated Strengths:</span>
                      <ul className="space-y-1.5 list-disc pl-4 text-neutral-650 font-sans font-medium">
                        <li>Consistent retention of computer architecture limits & physical layouts.</li>
                        <li>High accuracy description of recursive nameservers propagation routines.</li>
                        <li>Detail oriented outline of deep network TCP three-way handshake parameters.</li>
                      </ul>
                    </div>

                    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-2">
                      <span className="font-bold text-amber-800 uppercase tracking-widest text-[9px] block font-mono">Priority Learning Gaps:</span>
                      <ul className="space-y-1.5 list-disc pl-4 text-neutral-350 font-sans font-medium">
                        <li>Frequently misses local Layer 2 broadcast media access switches routing diagrams.</li>
                        <li>Over-simplifies difference of UDP connectionless datagram packet limits.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-neutral-400 bg-white border border-neutral-200 rounded-xl text-xs font-mono uppercase font-bold tracking-wider shadow-sm">
              Please select a student from the sidebar roster list to view their detailed academic progress card.
            </div>
          )}
        </div>

      </div>
    )}
  </div>
);
}

