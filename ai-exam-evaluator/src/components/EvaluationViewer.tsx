import React, { useState, useEffect } from 'react';
import { 
  FileCheck, 
  ArrowLeft, 
  Printer, 
  Save, 
  ShieldCheck, 
  PenTool,
  AlertTriangle,
  Lightbulb,
  Check,
  Download,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { AnswerSheet, Exam, QuestionEvaluation } from '../types';

interface EvaluationViewerProps {
  sheetId: string;
  associatedExam?: Exam;
  onNavigateHome: () => void;
  onRefresh: () => void;
}

export default function EvaluationViewer({
  sheetId,
  associatedExam,
  onNavigateHome,
  onRefresh
}: EvaluationViewerProps) {
  const [sheet, setSheet] = useState<AnswerSheet | null>(null);
  const [loading, setLoading] = useState(true);

  // Buffer state for manual review edits
  const [editedEvaluations, setEditedEvaluations] = useState<QuestionEvaluation[]>([]);
  const [overallFeedback, setOverallFeedback] = useState('');
  const [reviewerApproved, setReviewerApproved] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch target sheet details
  useEffect(() => {
    const fetchSheet = async () => {
      try {
        const res = await fetch(`/api/sheets/${sheetId}`);
        if (res.ok) {
          const data = await res.json();
          setSheet(data);
          setEditedEvaluations(data.evaluations || []);
          setOverallFeedback(data.overallFeedback || '');
          setReviewerApproved(data.reviewerApproved || false);
        }
      } catch (err) {
        console.error("Failed to load sheet details inside EvaluationViewer:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSheet();
  }, [sheetId]);

  // Adjust score for a specific segmented question
  const handleScoreChange = (index: number, scoreVal: number) => {
    const updated = [...editedEvaluations];
    const max = updated[index].maxMarks || 10;
    
    let score = scoreVal;
    if (score > max) score = max;
    if (score < 0) score = 0;

    updated[index] = {
      ...updated[index],
      marksAwarded: score
    };
    setEditedEvaluations(updated);
  };

  // Adjust feedback for a specific segmented question
  const handleFeedbackChange = (index: number, val: string) => {
    const updated = [...editedEvaluations];
    updated[index] = {
      ...updated[index],
      feedback: val
    };
    setEditedEvaluations(updated);
  };

  // Trigger manual override PUT endpoint
  const handleSaveReview = async () => {
    try {
      const res = await fetch(`/api/sheets/${sheetId}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evaluations: editedEvaluations,
          overallFeedback,
          reviewerApproved: true
        })
      });

      if (res.ok) {
        const updatedData = await res.json();
        setSheet(updatedData);
        setReviewerApproved(true);
        setSaveSuccess(true);
        onRefresh();
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Manual review overriding error:", err);
    }
  };

  // Printable report cards layout trigger
  const handlePrintReport = () => {
    window.print();
  };

  // Standard Excel CSV Export
  const handleExportExcel = () => {
    if (!sheet) return;
    let csv = "\uFEFF"; // Byte-Order-Mark for Excel to parse UTF-8 characters correctly!
    csv += `AI SCRIPT GRADING & EVALUATION REPORT\r\n`;
    csv += `Student Name,${sheet.studentName}\r\n`;
    csv += `Hall Ticket ID,${sheet.hallTicket}\r\n`;
    csv += `Exam Code,${associatedExam?.title || 'Autodetected AI Exam'}\r\n`;
    csv += `Subject,${associatedExam?.subjectName || 'Autonomous AI Assessment'}\r\n`;
    csv += `Total Awarded Marks,${currentlyEditedTotal} / ${associatedExam?.maxMarks || 100}\r\n`;
    csv += `AI Grade Confidence,${(sheet.evaluationConfidence * 100).toFixed(0)}%\r\n`;
    csv += `Handwriting Status,${sheet.handwritingQuality}\r\n\r\n`;

    csv += `Question ID,Max Marks,Marks Awarded,Feedback Comment\r\n`;
    editedEvaluations.forEach((q) => {
      const escapedFeedback = (q.feedback || '').replace(/"/g, '""');
      csv += `"${q.questionRank || 'Q'}","${q.maxMarks || 10}","${q.marksAwarded}","${escapedFeedback}"\r\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sheet.studentName.replace(/\s+/g, '_')}_Academic_Evaluations.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Rich HTML formatted MS Word Document Export
  const handleExportWord = () => {
    if (!sheet) return;
    let html = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          body { font-family: 'Calibri', 'Arial', sans-serif; line-height: 1.5; color: #111111; margin: 30px; }
          h1 { color: #111111; font-size: 20pt; border-bottom: 2px solid #222222; padding-bottom: 5px; margin-bottom: 15px; }
          h2 { color: #333333; font-size: 14pt; margin-top: 25px; border-bottom: 1px solid #dddddd; padding-bottom: 3px; }
          .meta-box { background-color: #f8f9fa; padding: 15px; border: 1px solid #e9ecef; border-left: 5px solid #111111; margin-bottom: 25px; }
          p { margin: 5px 0; font-size: 11pt; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 25px; }
          th, td { border: 1px solid #cccccc; padding: 10px; font-size: 10.5pt; text-align: left; }
          th { background-color: #f1f3f5; font-weight: bold; color: #212529; }
          .badge { font-weight: bold; text-transform: uppercase; font-size: 9pt; }
          ul { margin: 10px 0; padding-left: 20px; }
          li { font-size: 11pt; margin-bottom: 5px; }
        </style>
      </head>
      <body>
        <h1>ACADEMIC EVALUATION SUMMARY REPORT</h1>
        <div class="meta-box">
          <p><strong>Student Candidate:</strong> ${sheet.studentName}</p>
          <p><strong>Registry Hall Ticket:</strong> ${sheet.hallTicket}</p>
          <p><strong>Class Course:</strong> B.Tech Computer Science &amp; Engineering</p>
          <p><strong>Exam Title:</strong> ${associatedExam?.title || 'Autodetected AI Exam'}</p>
          <p><strong>Subject Name:</strong> ${associatedExam?.subjectName || 'Autonomous AI Assessment'}</p>
          <p><strong>Aggregate Marks Awarded:</strong> ${currentlyEditedTotal} / ${associatedExam?.maxMarks || 100}</p>
          <p><strong>AI Confidence Quotient:</strong> ${(sheet.evaluationConfidence * 100).toFixed(0)}%</p>
          <p><strong>Handwriting Deciphering Quality:</strong> ${sheet.handwritingQuality}</p>
        </div>

        <h2>INDIVIDUAL QUESTION BREAKDOWN</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Max possible</th>
              <th>Marks Awarded</th>
              <th>Feedback Comment &amp; Recommendations</th>
            </tr>
          </thead>
          <tbody>
    `;

    editedEvaluations.forEach(q => {
      html += `
        <tr>
          <td><strong>${q.questionRank || 'Q'}</strong></td>
          <td>${q.maxMarks || 10}</td>
          <td>${q.marksAwarded}</td>
          <td>${q.feedback || 'Fully conforms to answer rubric expectations.'}</td>
        </tr>
      `;
    });

    html += `
          </tbody>
        </table>

        <h2>ACADEMIC SWOT ANALYSIS</h2>
        <p><strong>Demonstrated Strengths:</strong></p>
        <ul>
          ${(sheet.strengths && sheet.strengths.length > 0 ? sheet.strengths : ['Formulates critical terms and logic parameters correctly']).map(s => `<li>${s}</li>`).join('')}
        </ul>
        <p><strong>Areas of Development:</strong></p>
        <ul>
          ${(sheet.weaknesses && sheet.weaknesses.length > 0 ? sheet.weaknesses : ['Needs structured formatting in analytical calculations']).map(w => `<li>${w}</li>`).join('')}
        </ul>

        <h2>OVERALL REMARKS &amp; ADVICE</h2>
        <p>${overallFeedback || 'The student shows consistent capabilities. Continue focused workouts in core topics.'}</p>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${sheet.studentName.replace(/\s+/g, '_')}_Academic_Evaluations.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-neutral-500 animate-pulse font-mono tracking-widest uppercase text-xs">
        &gt; Fetching verified script allocations...
      </div>
    );
  }

  if (!sheet) {
    return (
      <div id="evaluation-viewer-error" className="max-w-2xl mx-auto p-12 text-center bg-white border border-neutral-200 rounded-xl space-y-4 shadow-sm">
        <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
        <h3 className="font-bold text-neutral-900 uppercase tracking-wider text-sm">Answer Sheet Profile Missing</h3>
        <p className="text-xs text-neutral-500">The requested evaluations dataset structure does not exist or has experienced server cache errors.</p>
        <button onClick={onNavigateHome} className="text-neutral-900 font-bold uppercase tracking-widest text-[10px] hover:underline cursor-pointer">
          Return to home dashboard
        </button>
      </div>
    );
  }

  // Calculate sum of active questions scores
  const currentlyEditedTotal = editedEvaluations.reduce((sum, q) => sum + q.marksAwarded, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 selection:bg-neutral-900 selection:text-white print:bg-white print:text-black print:p-0">
      
      {/* Upper Navigation Row -> Hides in printable layouts */}
      <div className="flex justify-between items-center bg-white p-4 border border-neutral-200 rounded-xl print:hidden shadow-sm">
        <button 
          onClick={onNavigateHome}
          className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 hover:text-neutral-900 flex items-center space-x-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-neutral-650" />
          <span>Back to dashboard</span>
        </button>

        <div className="flex items-center space-x-2 md:space-x-3 flex-wrap gap-y-2">
          <button 
            id="btn-export-pdf"
            onClick={handlePrintReport}
            className="bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 px-3.5 py-2.5 rounded-lg text-xs flex items-center space-x-2 font-bold uppercase tracking-wider cursor-pointer shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-neutral-700" />
            <span>Export as PDF</span>
          </button>

          <button 
            id="btn-export-excel"
            onClick={handleExportExcel}
            className="bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 px-3.5 py-2.5 rounded-lg text-xs flex items-center space-x-2 font-bold uppercase tracking-wider cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-800" />
            <span>Export as Excel</span>
          </button>

          <button 
            id="btn-export-word"
            onClick={handleExportWord}
            className="bg-white hover:bg-neutral-50 border border-neutral-300 text-neutral-900 px-3.5 py-2.5 rounded-lg text-xs flex items-center space-x-2 font-bold uppercase tracking-wider cursor-pointer shadow-xs"
          >
            <FileText className="w-3.5 h-3.5 text-blue-800" />
            <span>Export as Word Doc</span>
          </button>
          
          <button 
            id="btn-save-review-action"
            onClick={handleSaveReview}
            className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2.5 rounded-lg text-xs flex items-center space-x-2 font-bold uppercase tracking-widest cursor-pointer shadow-sm"
          >
            <Save className="w-3.5 h-3.5 text-white" />
            <span>Approve & Lock Marks</span>
          </button>
        </div>
      </div>

      {/* Sheet Metadata Profile Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column - Student card and KPI metrics details */}
        <div className="space-y-6 lg:col-span-1 print:col-span-3">
          
          {/* Main Card */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6 relative overflow-hidden shadow-sm">
            {/* Stamp indicator if approved and locked */}
            {reviewerApproved && (
              <div className="absolute top-5 right-5 rotate-12 border border-emerald-555 bg-emerald-50 text-emerald-800 font-mono text-[9px] font-bold px-3 py-1 rounded-md uppercase tracking-widest shadow-xs">
                Approved ✓
              </div>
            )}

            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono tracking-widest text-[#777] block font-bold">Student Script Evaluation</span>
              <h2 className="text-lg font-bold uppercase tracking-tight text-neutral-950 font-sans">{sheet.studentName}</h2>
              <div className="text-[10px] text-neutral-500 font-mono mt-1 font-bold">Hall Ticket: <span className="text-neutral-900 font-bold">{sheet.hallTicket}</span></div>
            </div>

            <div className="border-t border-neutral-100 my-4 pt-4 space-y-3.5 text-xs text-neutral-600 font-medium">
              <div className="flex justify-between">
                <span className="uppercase text-[9px] font-mono text-neutral-450 font-bold">Assigned Exam:</span>
                <span className="text-neutral-900 font-semibold">{associatedExam?.title?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="uppercase text-[9px] font-mono text-neutral-450 font-bold">Subject Name:</span>
                <span className="text-neutral-900 font-semibold">{associatedExam?.subjectName?.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="uppercase text-[9px] font-mono text-neutral-455 font-bold">Pages booklet:</span>
                <span className="text-neutral-900 font-mono font-bold">{sheet.pages} Pages</span>
              </div>
              {sheet.evaluatedAt && (
                <div className="flex justify-between">
                  <span className="uppercase text-[9px] font-mono text-neutral-455 font-bold">Evaluated Instant:</span>
                  <span className="text-neutral-900 font-mono text-[10px] font-bold">{new Date(sheet.evaluatedAt).toLocaleString()}</span>
                </div>
              )}
            </div>

            {/* Display Marks Progress */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-500 block font-bold">Total Graded Score</span>
                <div className="text-3xl font-bold text-neutral-900 mt-1 font-mono">
                  {currentlyEditedTotal}
                  <span className="text-xs font-normal text-neutral-450"> / {associatedExam?.maxMarks || 50}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-500 block font-bold">AI Confidence Index</span>
                <div className="text-lg font-bold text-neutral-900 mt-1 font-mono">{(sheet.evaluationConfidence * 100).toFixed(0)}%</div>
              </div>
            </div>

            {/* Handwriting quality Legibility metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-lg shadow-xs">
                <div className="flex items-center space-x-1.5 text-neutral-500 mb-1 font-sans">
                  <PenTool className="w-3.5 h-3.5 text-neutral-700" />
                  <span className="text-[9px] font-mono uppercase font-bold tracking-wider leading-none text-neutral-500">Handwriting</span>
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  sheet.handwritingQuality === 'Excellent' ? 'text-emerald-700 font-bold' :
                  sheet.handwritingQuality === 'Legible' ? 'text-neutral-800' : 'text-amber-700'
                }`}>
                  {sheet.handwritingQuality}
                </span>
              </div>

              {/* Plagiarism checks indices */}
              <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-lg shadow-xs">
                <div className="flex items-center space-x-1.5 text-neutral-500 mb-1 font-sans">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-700" />
                  <span className="text-[9px] font-mono uppercase font-bold tracking-wider leading-none text-neutral-500">Plagiarism</span>
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider ${
                  (sheet.plagiarismScore || 0) < 15 ? 'text-emerald-700' : 'text-red-700 font-extrabold'
                }`}>
                  {sheet.plagiarismScore}% Matches
                </span>
              </div>
            </div>
          </div>

          {/* AI generated Recommendations/improvement lists */}
          <div className="bg-white border border-neutral-200 p-6 rounded-xl space-y-4 print:page-break-before shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-905 flex items-center space-x-2">
              <Lightbulb className="w-4.5 h-4.5 text-neutral-800" />
              <span>AI Study Recommendations</span>
            </h3>
            {sheet.aiImprovementPlans && sheet.aiImprovementPlans.length > 0 ? (
              <ul className="space-y-3.5 text-xs text-neutral-600 font-semibold font-sans">
                {sheet.aiImprovementPlans.map((rec, k) => (
                  <li key={k} className="flex items-start space-x-2 leading-relaxed">
                    <span className="text-neutral-900 font-bold shrink-0 mt-0.5">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-neutral-450 font-mono">No recommendation data compiled.</p>
            )}
          </div>
        </div>

        {/* Right column - Deep Question Breakdown + Overrides interfaces */}
        <div className="lg:col-span-2 space-y-6 print:col-span-3">
          
          {/* Main Override Header */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-6 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-900 px-1 flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-neutral-800" />
              <span>Segmented Question feedback and Overrides</span>
            </h3>

            {saveSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-2 shadow-xs">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Override grades and annotations lock-graded successfully!</span>
              </div>
            )}

            <div className="space-y-6">
              {editedEvaluations.map((question, i) => (
                <div key={i} className="bg-neutral-50 border border-neutral-200 rounded-lg p-5 space-y-4 hover:border-neutral-300 transition-all shadow-xs">
                  
                  {/* Top line mapping */}
                  <div className="flex justify-between items-center border-b border-neutral-200 pb-3 font-mono font-bold">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-neutral-900 uppercase tracking-widest">{question.questionNo} segment</span>
                      <span className="text-[10px] text-neutral-400">•</span>
                      <span className="text-[9px] uppercase tracking-wide text-neutral-500 font-bold">confidence: {(question.confidenceScore * 100).toFixed(0)}%</span>
                    </div>

                    {/* Marks slider override controls */}
                    <div className="flex items-center space-x-2 font-mono text-[10px] uppercase text-neutral-550 font-bold">
                      <span>Score Awarded:</span>
                      <input 
                        type="number"
                        value={question.marksAwarded}
                        max={question.maxMarks}
                        min={0}
                        onChange={(e) => handleScoreChange(i, Number(e.target.value))}
                        className="bg-white border border-neutral-350 rounded-lg p-1.5 w-12 text-center text-xs font-black text-neutral-900 outline-none focus:border-neutral-950 font-mono"
                      />
                      <span className="text-neutral-400">/ {question.maxMarks}</span>
                    </div>
                  </div>

                  {/* Rating / slider */}
                  <div className="flex justify-between items-center gap-4">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-neutral-500 font-bold">Marks Range Slider:</span>
                    <input 
                      type="range"
                      min="0"
                      max={question.maxMarks}
                      value={question.marksAwarded}
                      onChange={(e) => handleScoreChange(i, Number(e.target.value))}
                      className="flex-1 accent-neutral-900 h-1 bg-neutral-200 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Bullet Lists */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-850 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-150 w-fit block">Identified Strengths:</span>
                      <ul className="space-y-2 list-disc pl-4 text-neutral-600 leading-relaxed font-sans font-medium">
                        {question.strengths.map((str, sIdx) => <li key={sIdx}>{str}</li>)}
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-rose-850 font-bold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-150 w-fit block">Omissions / Gaps detected:</span>
                      <ul className="space-y-2 list-disc pl-4 text-neutral-600 leading-relaxed font-sans font-medium">
                        {question.weaknesses.map((weak, wIdx) => <li key={wIdx}>{weak}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* Feedback description textarea feedback */}
                  <div className="space-y-2 pt-3 border-t border-neutral-200 select-none font-sans font-semibold">
                    <label className="text-[9px] uppercase font-mono tracking-widest text-neutral-500 font-bold">Question Annotator Feedback:</label>
                    <textarea 
                      rows={2}
                      value={question.feedback}
                      onChange={(e) => handleFeedbackChange(i, e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-lg py-2.5 px-3 text-xs text-neutral-900 outline-none focus:border-neutral-950 font-medium leading-relaxed font-sans"
                    />
                  </div>

                </div>
              ))}
            </div>

            {/* Master overall feedback text block editor */}
            <div className="space-y-2 pt-4 border-t border-neutral-200">
              <label className="text-xs text-neutral-900 uppercase tracking-wider font-bold block">Overall Expert Grader Summary Commentary</label>
              <textarea 
                rows={4}
                value={overallFeedback}
                onChange={e => setOverallFeedback(e.target.value)}
                className="w-full bg-white border border-neutral-300 rounded-lg p-3 text-xs text-neutral-900 leading-relaxed outline-none focus:border-neutral-950 font-sans font-semibold"
              />
            </div>

            {/* Action buttons footer */}
            <div className="pt-4 border-t border-neutral-200 flex justify-end">
              <button 
                id="btn-bottom-grade-save"
                onClick={handleSaveReview}
                className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold uppercase tracking-widest py-3.5 px-6 rounded-lg text-xs flex items-center space-x-2 transition-all cursor-pointer shadow-xs"
              >
                <Save className="w-4 h-4 text-white" />
                <span>Verify Student Marks & Sign-Off</span>
              </button>
            </div>

          </div>
        </div>

      </div>

      {/* Hidden printable layout overlay */}
      <div id="printable-area-cover" className="hidden print:block font-serif text-black p-8 bg-white space-y-6">
        <center className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">AI EXAM EVALUATOR</h1>
          <p className="text-xs uppercase font-mono tracking-widest text-gray-500">OFFICIAL STUDENT ACADEMIC SCORE CARD REPORT</p>
        </center>

        <div className="border-t-2 border-b-2 border-black py-4 grid grid-cols-2 text-sm leading-relaxed">
          <div>
            <strong>Student Name:</strong> {sheet.studentName}<br />
            <strong>Hall Ticket (Roll):</strong> {sheet.hallTicket}<br />
            <strong>Evaluation Grade Timestamp:</strong> {sheet.evaluatedAt ? new Date(sheet.evaluatedAt).toLocaleString() : "N/A"}
          </div>
          <div className="text-right">
            <strong>Exam Title:</strong> {associatedExam?.title}<br />
            <strong>Subject Code:</strong> {associatedExam?.subjectName}<br />
            <strong>Verified Assessor:</strong> Teacher (AI Autonomous)
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold border-b border-black pb-1">MARK SHEET BREAKDOWN</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300 text-left text-xs uppercase font-mono tracking-wider">
                <th className="py-2">Question Section</th>
                <th className="py-2 text-right">Maximum marks</th>
                <th className="py-2 text-right">Awarded marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {editedEvaluations.map((q, qIndex) => (
                <tr key={qIndex}>
                  <td className="py-3 font-semibold">{q.questionNo} assessment</td>
                  <td className="py-3 text-right">{q.maxMarks}</td>
                  <td className="py-3 text-right font-bold">{q.marksAwarded}</td>
                </tr>
              ))}
              <tr className="font-extrabold text-base border-t-2 border-black">
                <td className="py-3 uppercase font-extrabold">Final Grand Total Score</td>
                <td className="py-3 text-right">{associatedExam?.maxMarks || 50}</td>
                <td className="py-3 text-right">{currentlyEditedTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-2">
          <h4 className="font-bold text-sm">OVERALL COMMENTARY SUMMARY:</h4>
          <p className="text-sm italic text-gray-700 leading-normal">{overallFeedback}</p>
        </div>

        <div className="pt-20 grid grid-cols-2 text-xs text-center">
          <div>
            <div className="border-b border-black w-40 mx-auto" />
            <span className="block mt-1 uppercase tracking-wider text-[10px]">Academic Dean / Auditor Signature</span>
          </div>
          <div>
            <div className="border-b border-black w-40 mx-auto" />
            <span className="block mt-1 uppercase tracking-wider text-[10px]">Examiner Sign-off</span>
          </div>
        </div>
      </div>

    </div>
  );
}
