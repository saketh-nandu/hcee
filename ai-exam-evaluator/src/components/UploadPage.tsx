import React, { useState } from 'react';
import { 
  Upload, 
  File, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  Brain, 
  UserPlus, 
  Layers, 
  Sparkles,
  Check,
  X,
  FileText,
  FolderArchive,
  Image as ImageIcon
} from 'lucide-react';
import { Exam, Student } from '../types';

interface UploadPageProps {
  exams: Exam[];
  students: Student[];
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

export default function UploadPage({
  exams,
  students,
  onStartEvaluation,
  onAddStudent,
  onAddExam
}: UploadPageProps) {
  // Navigation tabs inside the configurator
  const [activeSubTab, setActiveSubTab] = useState<'upload' | 'create-student' | 'create-exam'>('upload');

  // Evaluation form state
  const [selectedExamId, setSelectedExamId] = useState('autodetect');
  const [selectedStudentId, setSelectedStudentId] = useState('autodetect');
  const [pagesCount, setPagesCount] = useState(3);
  const [customFiles, setCustomFiles] = useState<{ id: string; name: string; size: number; base64: string; type: 'pdf' | 'zip' | 'image' }[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [useAutoDetectKey, setUseAutoDetectKey] = useState(true);
  const [useAutoDetectStudent, setUseAutoDetectStudent] = useState(true);

  // Preset mock profiles
  const [activePreset, setActivePreset] = useState<string>('preset-rahul');

  // Custom creators state
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentTicket, setNewStudentTicket] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('B.Tech CSE');
  const [newStudentSection, setNewStudentSection] = useState('A');
  const [studentSuccessMsg, setStudentSuccessMsg] = useState('');

  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamSubjectId, setNewExamSubjectId] = useState('sub-1');
  const [newExamMaxMarks, setNewExamMaxMarks] = useState('50');
  const [newExamQuestions, setNewExamQuestions] = useState('');
  const [newExamRubric, setNewExamRubric] = useState('');
  const [examSuccessMsg, setExamSuccessMsg] = useState('');

  // Sample answer sheets text library (so teachers don't have to scan real items during preview!)
  const answerSheetPresets: { [key: string]: { name: string; text: string; pages: number } } = {
    'preset-rahul': {
      name: 'Rahul Sen - Cursive CS101.pdf',
      pages: 3,
      text: `Rahul Sen - 22CS101 - CS101 Evaluation
Q1. The Von Neumann architecture bottleneck arises because instructions and standard variables share a single physical bus lines. Since memory delay timing values (DRAM) are vastly greater than CPU clock values, the CPU remains stalled during data transit intervals.
We solve this using Cache memory hierarchy. By introducing SRAM components (L1, L2, L3) that are physically closer to the chip core and much faster, we stage subsequent and frequent instruction segments, dropping bus contention levels.

Q2. TCP is highly connection-oriented. It sets pathways with a 3-way synchronization protocol (SYN -> SYN-ACK -> ACK). During active phases, sequence identifiers map missing chunks and trigger retries if timeouts expire.
UDP is packetized and connectionless. It sends datagram vectors to targets without negotiating handshakes or reordering. Great for delay-sensitive live multimedia streams.

Q3. IPv4 works globally at Layer 3 Network layer, establishing logical router domains across planetary connections.
MAC operates locally at Layer 2 Data Link layer, representing media access hardware cards within the local broadcast switches directory.

Q4. DNS maps readable alpha domains (e.g., google.com) to target binary IPs. The OS queries host profiles, recursive resolvers, root domain nameservers (.), COM TLD systems, and authoritative host databases sequence until IP registers, caching the results.`
    },
    'preset-priya': {
      name: 'Priya Patel - Medium cursive.pdf',
      pages: 2,
      text: `Priya Patel - 22CS102 - Autumn
Q1. Core bottleneck is speed gap. CPU processes in nanonseconds while normal computer memory takes microseconds. That means memory slows everything down.
Having a local Cache holds the variable structures, making retrieval speed up.

Q2. TCP keeps track of correct connection bounds with syn ACK. Retries packet loss.
UDP just streams the files. Suitable for voice and online streaming networks.

Q3. IP addresses route between routers (Layer 3). MAC is physical 48-bit address on local networks (Layer 2) card.

Q4. DNS is name resolution phonebook. It queries from local caching records, root directory, TLD .com catalog, and authoritative domain server to translate human domain inputs to machine IPs.`
    },
    'preset-sneha': {
      name: 'Sneha Sharma - Poor Handwriting.pdf',
      pages: 1,
      text: `Sneha Sharma - CS101 Exam - Roll 22CS104
Q1. Memory bottleneck is about CPU waiting. Cache speeds it up.
Q2. TCP uses connection synchronization. UDP throws frames.
Q3. IP routes. MAC is LAN hardware address.
Q4. DNS resolves google.com web domain to numbers server IP so browser can connect.`
    }
  };

  // Convert uploaded custom files supporting PDF, multiple images, and ZIPs
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadProgress(10);
      const filePromises = Array.from(files).map((fileItem, idx) => {
        const file = fileItem as File;
        return new Promise<{ id: string; name: string; size: number; base64: string; type: 'pdf' | 'zip' | 'image' }>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            let fileType: 'pdf' | 'zip' | 'image' = 'image';
            if (file.name.toLowerCase().endsWith('.pdf')) fileType = 'pdf';
            else if (file.name.toLowerCase().endsWith('.zip')) fileType = 'zip';
            resolve({
              id: `${Date.now()}-${idx}-${Math.random()}`,
              name: file.name,
              size: file.size,
              base64: reader.result as string,
              type: fileType
            });
          };
          reader.readAsDataURL(file);
        });
      });

      Promise.all(filePromises).then((results) => {
        setCustomFiles((prev) => [...prev, ...results]);
        setUploadProgress(100);
        setTimeout(() => setUploadProgress(null), 1200);
      });
    }
  };

  // Trigger evaluation
  const handleStartSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const targetExamId = useAutoDetectKey ? 'autodetect' : selectedExamId;
    const targetStudentId = useAutoDetectStudent ? 'autodetect' : selectedStudentId;

    if (!useAutoDetectKey && !targetExamId) {
      alert("Please select an Exam Rubric template or activate Autodetect Mode.");
      return;
    }
    if (!useAutoDetectStudent && !targetStudentId) {
      alert("Please select a Student Profile or activate Autodetect Mode.");
      return;
    }

    if (customFiles.length > 0) {
      // Parallel loop processing for custom files
      customFiles.forEach((file) => {
        onStartEvaluation({
          examId: targetExamId,
          studentId: targetStudentId,
          fileName: file.name,
          fileBase64: file.base64 || undefined,
          pagesCount
        });
      });
    } else {
      // Benchmark preset selection
      const presetInfo = answerSheetPresets[activePreset];
      onStartEvaluation({
        examId: targetExamId,
        studentId: targetStudentId,
        fileName: presetInfo.name,
        pagesCount: presetInfo.pages,
        rawTextPreset: presetInfo.text
      });
    }
  };

  // Creators submission handlers
  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName || !newStudentTicket) return;
    onAddStudent({
      name: newStudentName,
      hall_ticket: newStudentTicket,
      className: newStudentClass,
      section: newStudentSection
    });
    setStudentSuccessMsg(`Student "${newStudentName}" successfully created and matched to class catalog!`);
    setNewStudentName('');
    setNewStudentTicket('');
    setTimeout(() => setStudentSuccessMsg(''), 4000);
  };

  const handleExamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExamTitle || !newExamQuestions || !newExamRubric) return;
    onAddExam({
      title: newExamTitle,
      subjectId: newExamSubjectId,
      maxMarks: newExamMaxMarks,
      questionPaperText: newExamQuestions,
      rubricKeyText: newExamRubric
    });
    setExamSuccessMsg(`Exam rubric "${newExamTitle}" added to evaluator templates library.`);
    setNewExamTitle('');
    setNewExamQuestions('');
    setNewExamRubric('');
    setTimeout(() => setExamSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 selection:bg-neutral-900 selection:text-white">
      {/* Header Profile description */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white border border-neutral-200 p-6 rounded-xl shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-neutral-900 flex items-center space-x-3 uppercase tracking-tight">
            <span>Evaluation Workspace</span>
            <span className="bg-neutral-100 text-neutral-800 text-[10px] py-1 px-3 border border-neutral-300 rounded-lg font-mono uppercase font-bold tracking-widest">
              Agent-Ready
            </span>
          </h1>
          <p className="text-xs text-neutral-550 mt-1.5 font-sans font-medium">
            Configure analytical evaluation tasks, manage student listings, or setup answer sheet grading criteria keys.
          </p>
        </div>
        
        {/* Workspace tabs slider selector */}
        <div className="flex bg-neutral-100 p-1.5 rounded-lg border border-neutral-200 select-none">
          <button 
            type="button"
            onClick={() => setActiveSubTab('upload')}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
              activeSubTab === 'upload' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Start evaluation
          </button>
          <button 
            type="button"
            onClick={() => setActiveSubTab('create-student')}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
              activeSubTab === 'create-student' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Manage Students
          </button>
          <button 
            type="button"
            onClick={() => setActiveSubTab('create-exam')}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all cursor-pointer ${
              activeSubTab === 'create-exam' ? 'bg-neutral-900 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Config keys
          </button>
        </div>
      </div>

      {activeSubTab === 'upload' && (
        <form onSubmit={handleStartSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main workspace selector */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-neutral-200 p-6 rounded-xl space-y-6 shadow-sm">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-900 flex items-center space-x-2">
                <Upload className="w-5 h-5 text-neutral-800" />
                <span>Upload or Simulate Student Copy Scan</span>
              </h3>

              {/* Upload switch */}
              <div className="grid grid-cols-2 gap-2 bg-neutral-50 p-1 border border-neutral-200 rounded-lg text-[10px] font-mono uppercase font-bold tracking-wider">
                <button 
                  type="button"
                  onClick={() => { setCustomFiles([]); }}
                  className={`py-2 text-center rounded-md transition-all cursor-pointer ${
                    customFiles.length === 0 ? 'bg-white text-neutral-900 border border-neutral-200 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Use benchmark presets
                </button>
                <button 
                  type="button"
                  onClick={() => document.getElementById('file-upload-input')?.click()}
                  className={`py-2 text-center rounded-md transition-all cursor-pointer ${
                    customFiles.length > 0 ? 'bg-white text-neutral-900 border border-neutral-200 shadow-sm' : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  Upload custom scans (PDF/ZIP/Images)
                </button>
              </div>

              {customFiles.length === 0 ? (
                /* Preset Selection Cards Grid */
                <div className="space-y-4">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest font-bold block">Available Transcriptions Benchmark:</span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Preset 1 */}
                    <div 
                      onClick={() => setActivePreset('preset-rahul')}
                      className={`border p-4 rounded-lg cursor-pointer transition-all space-y-4 ${
                        activePreset === 'preset-rahul' ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-350 bg-white shadow-xs'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-805 border border-neutral-250">
                          High confidence
                        </span>
                        <Sparkles className={`w-3.5 h-3.5 text-neutral-800 ${activePreset === 'preset-rahul' ? 'opacity-100' : 'opacity-30'}`} />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-tight text-neutral-900">Rahul Sen</h4>
                        <p className="text-[10px] text-neutral-500 mt-1 leading-snug font-sans font-medium">Continuous cursive script style. Answers CSE quiz template.</p>
                      </div>
                      <div className="text-[9px] text-neutral-450 font-mono uppercase tracking-wider">3 Pages booklet</div>
                    </div>

                    {/* Preset 2 */}
                    <div 
                      onClick={() => setActivePreset('preset-priya')}
                      className={`border p-4 rounded-lg cursor-pointer transition-all space-y-4 ${
                        activePreset === 'preset-priya' ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-350 bg-white shadow-xs'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-805 border border-neutral-250">
                          Standard Ink
                        </span>
                        <Layers className="w-3.5 h-3.5 text-neutral-850 justify-end" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-tight text-neutral-900">Priya Patel</h4>
                        <p className="text-[10px] text-neutral-500 mt-1 leading-snug font-sans font-medium">Average block writing layout with moderate syntax density.</p>
                      </div>
                      <div className="text-[9px] text-neutral-450 font-mono uppercase tracking-wider">2 Pages booklet</div>
                    </div>

                    {/* Preset 3 */}
                    <div 
                      onClick={() => setActivePreset('preset-sneha')}
                      className={`border p-4 rounded-lg cursor-pointer transition-all space-y-4 ${
                        activePreset === 'preset-sneha' ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-350 bg-white shadow-xs'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-red-750 border border-red-200">
                          Messy script
                        </span>
                        <AlertCircle className="w-3.5 h-3.5 text-red-650" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-tight text-neutral-900">Sneha Sharma</h4>
                        <p className="text-[10px] text-neutral-500 mt-1 leading-snug font-sans font-medium">Extremely low loops clarity. Forces OCR repair triggers.</p>
                      </div>
                      <div className="text-[9px] text-neutral-450 font-mono uppercase tracking-wider font-semibold">1 Page booklet</div>
                    </div>
                  </div>

                  {/* Preset Preview Box */}
                  <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 space-y-3">
                    <span className="text-[9px] uppercase font-mono tracking-widest font-bold text-neutral-700 block">Simulated Transcription Preview:</span>
                    <p className="text-xs font-mono text-neutral-700 max-h-[140px] overflow-y-auto leading-relaxed border-l-2 border-neutral-950 pl-4 whitespace-pre-wrap">
                      {answerSheetPresets[activePreset].text}
                    </p>
                  </div>
                </div>
              ) : (
                /* Custom Multi-File List Container */
                <div className="space-y-4">
                  <div className="border border-dashed border-neutral-300 hover:border-neutral-400 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-3 bg-neutral-50/50 transition-colors">
                    <div className="bg-neutral-100 text-neutral-900 p-3 rounded-lg border border-neutral-200">
                      <Upload className="w-6 h-6 text-neutral-800" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">Inbound Student Sheets Deck</h4>
                      <p className="text-[10px] text-neutral-500 mt-1 font-mono">{customFiles.length} item(s) loaded into pipeline staging area</p>
                    </div>
                  </div>

                  {uploadProgress !== null && (
                    <div className="space-y-1 bg-neutral-50 p-3 border border-neutral-205 rounded-lg">
                      <div className="flex justify-between text-[9px] font-mono text-neutral-550">
                        <span className="uppercase font-bold tracking-wider">Reassembling multimodal chunks...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 h-1 rounded-full overflow-hidden">
                        <div className="bg-neutral-900 h-full transition-all" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}

                  {/* List of Custom Uploads */}
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {customFiles.map((f, fIdx) => (
                      <div key={f.id} className="flex justify-between items-center bg-white border border-neutral-200 p-3 rounded-lg text-xs hover:border-neutral-355 transition-all shadow-xs">
                        <div className="flex items-center space-x-3 truncate">
                          {f.type === 'pdf' ? (
                            <FileText className="w-5 h-5 text-neutral-700 shrink-0" />
                          ) : f.type === 'zip' ? (
                            <FolderArchive className="w-5 h-5 text-neutral-700 shrink-0" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-neutral-700 shrink-0" />
                          )}
                          <div className="truncate">
                            <span className="font-semibold text-neutral-905 block truncate max-w-[240px]">{f.name}</span>
                            <span className="text-[9px] text-[#777] font-mono uppercase block">
                              {f.type === 'pdf' ? 'PDF Document • Split-pages OCR' : 
                               f.type === 'zip' ? 'ZIP Folder • Bulk batch extract' : 
                               'Image booklet • OCR Segmenter'}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0">
                          <span className="text-[9px] text-neutral-500 font-mono">{(f.size / 1024).toFixed(0)} KB</span>
                          <button 
                            type="button"
                            onClick={() => setCustomFiles(prev => prev.filter(item => item.id !== f.id))}
                            className="p-1 hover:bg-neutral-100 rounded-md text-red-650 transition-colors cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <button 
                      type="button"
                      onClick={() => document.getElementById('file-upload-input')?.click()}
                      className="text-[10px] bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-905 uppercase tracking-wider font-bold py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                    >
                      + Add more files
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setCustomFiles([]); }}
                      className="text-[10px] text-red-600 uppercase tracking-wider font-bold hover:underline cursor-pointer"
                    >
                      Clear files list
                    </button>
                  </div>
                </div>
              )}

              {/* Hidden System file selector */}
              <input 
                id="file-upload-input" 
                type="file" 
                accept=".pdf,image/*,.zip"
                multiple
                onChange={handleFileChange} 
                className="hidden" 
              />
            </div>
          </div>

          {/* Job execution details */}
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200 p-6 rounded-xl space-y-5 shadow-sm">
              <h3 className="font-bold text-xs uppercase tracking-wider text-neutral-905">Grading Directives Panel</h3>
              
              <div className="space-y-5 text-xs font-bold">
                
                {/* 1. Answer key autodetection switch */}
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold">Rubric Answer Key Mode</span>
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono ${useAutoDetectKey ? 'bg-neutral-900 border border-neutral-950 text-white font-bold' : 'bg-neutral-200 text-neutral-500'}`}>
                      {useAutoDetectKey ? 'AI Autodetect' : 'Static select'}
                    </span>
                  </div>
                  <label className="flex items-start space-x-2.5 cursor-pointer text-xs leading-tight font-semibold selection:bg-transparent">
                    <input 
                      type="checkbox" 
                      className="rounded accent-neutral-900 w-3.5 h-3.5 mt-0.5 border-neutral-300 cursor-pointer"
                      checked={useAutoDetectKey}
                      onChange={(e) => setUseAutoDetectKey(e.target.checked)}
                    />
                    <div className="flex flex-col">
                      <span className="text-neutral-900 font-bold">Zero-Key Autodetect Mode</span>
                      <span className="text-[9px] text-[#777] font-sans font-medium mt-0.5">Faculty doesn\'t need to provide predefined rubrics; AI extracts Q&A live!</span>
                    </div>
                  </label>
                </div>

                {/* Conditional Exam standard selector */}
                {!useAutoDetectKey && (
                  <div className="space-y-1.5 font-sans font-medium animate-fade-inUp">
                    <label className="text-neutral-500 block uppercase tracking-wider text-[9px] font-mono font-bold">Select Standard exam rubric:</label>
                    <select 
                      value={selectedExamId} 
                      onChange={e => setSelectedExamId(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-lg py-3 px-4 text-xs text-neutral-900 outline-none focus:border-neutral-950 font-mono font-bold cursor-pointer"
                    >
                      {exams.map(exam => (
                        <option key={exam.id} value={exam.id}>{exam.title.toUpperCase()} ({exam.maxMarks}M)</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 2. Student candidate identity autodetection switch */}
                <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider font-bold">Student Identity allocation</span>
                    <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono ${useAutoDetectStudent ? 'bg-neutral-900 border border-neutral-950 text-white font-bold' : 'bg-neutral-200 text-[#777]'}`}>
                      {useAutoDetectStudent ? 'Auto-Register' : 'Matched profile'}
                    </span>
                  </div>
                  <label className="flex items-start space-x-2.5 cursor-pointer text-xs leading-tight font-semibold selection:bg-transparent">
                    <input 
                      type="checkbox" 
                      className="rounded accent-neutral-900 w-3.5 h-3.5 mt-0.5 border-neutral-300 cursor-pointer"
                      checked={useAutoDetectStudent}
                      onChange={(e) => setUseAutoDetectStudent(e.target.checked)}
                    />
                    <div className="flex flex-col">
                      <span className="text-neutral-900 font-semibold font-bold">Parse Student Registry autonomously</span>
                      <span className="text-[9px] text-[#777] font-sans font-medium mt-0.5">Extracts candidate name/ticket index directly from script headings.</span>
                    </div>
                  </label>
                </div>

                {/* Conditional select box mapping */}
                {!useAutoDetectStudent && (
                  <div className="space-y-1.5 font-sans font-medium animate-fade-inUp">
                    <div className="flex justify-between">
                      <label className="text-neutral-500 block uppercase tracking-wider text-[9px] font-mono font-bold">Assign Student candidate:</label>
                      <button type="button" onClick={() => setActiveSubTab('create-student')} className="text-neutral-900 hover:underline uppercase tracking-wider text-[9px] font-mono font-bold cursor-pointer">
                        + NEW candidate
                      </button>
                    </div>
                    <select 
                      value={selectedStudentId} 
                      onChange={e => setSelectedStudentId(e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded-lg py-3 px-4 text-xs text-neutral-900 outline-none focus:border-neutral-950 font-mono font-bold cursor-pointer"
                    >
                      {students.map(std => (
                        <option key={std.id} value={std.id}>{std.name.toUpperCase()} ({std.hall_ticket})</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* 3. Page count for single document */}
                <div className="space-y-1.5 font-sans font-medium">
                  <label className="text-neutral-500 block uppercase tracking-wider text-[9px] font-mono font-bold">Default Booklet pages per student:</label>
                  <input 
                    type="number" 
                    value={pagesCount}
                    onChange={e => setPagesCount(Number(e.target.value))}
                    className="w-full bg-white border border-neutral-300 rounded-lg py-3 px-4 text-xs text-neutral-900 outline-none focus:border-neutral-950 font-mono font-bold"
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              {/* Start AI pipeline action trigger */}
              <button 
                type="submit"
                id="btn-evaluate-submit"
                className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold uppercase tracking-widest py-3.5 rounded-lg text-xs flex items-center justify-center space-x-2.5 cursor-pointer transform hover:-translate-y-0.5 transition-all shadow-sm"
              >
                <Brain className="w-4 h-4 text-white" />
                <span>Trigger Autonomous Pipeline</span>
              </button>
            </div>
          </div>

        </form>
      )}

      {/* CREATE NEW STUDENT CONSOLE */}
      {activeSubTab === 'create-student' && (
        <div className="bg-white border border-neutral-200 p-8 rounded-xl max-w-2xl mx-auto space-y-6 shadow-sm">
          <div className="flex items-center space-x-3.5 border-b border-neutral-100 pb-4">
            <div className="bg-neutral-50 text-neutral-900 p-2.5 rounded-lg border border-neutral-200">
              <UserPlus className="w-5 h-5 text-neutral-800" />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-tight text-neutral-950 text-sm">Register Student Profile</h3>
              <p className="text-neutral-500 text-xs mt-1 font-sans font-medium">
                Populate Student Registry database index configurations to map handwritten booklet IDs automatically.
              </p>
            </div>
          </div>

          {studentSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-3.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{studentSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleStudentSubmit} className="space-y-4 text-xs font-bold font-sans">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 font-medium">
                <label className="text-neutral-500 uppercase tracking-wider text-[9px] font-mono font-bold">Full candidate name *</label>
                <input 
                  type="text" 
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  placeholder="e.g. Ramesh Reddy"
                  className="w-full bg-white border border-neutral-300 rounded-lg py-3 px-4 text-neutral-900 outline-none focus:border-neutral-950 font-mono font-bold"
                  required
                />
              </div>
              <div className="space-y-1.5 font-medium">
                <label className="text-neutral-500 uppercase tracking-wider text-[9px] font-mono font-bold">Hall ticket identification *</label>
                <input 
                  type="text" 
                  value={newStudentTicket}
                  onChange={e => setNewStudentTicket(e.target.value)}
                  placeholder="e.g. 22CS199"
                  className="w-full bg-white border border-neutral-300 rounded-lg py-3 px-4 text-neutral-900 outline-none focus:border-neutral-950 font-mono font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 font-medium">
                <label className="text-neutral-505 uppercase tracking-wider text-[9px] font-mono font-bold">Department registry</label>
                <input 
                  type="text" 
                  value={newStudentClass}
                  onChange={e => setNewStudentClass(e.target.value)}
                  placeholder="B.Tech Computer Science"
                  className="w-full bg-white border border-neutral-300 rounded-lg py-3 px-4 text-neutral-900 outline-none focus:border-neutral-950 font-mono font-bold"
                />
              </div>
              <div className="space-y-1.5 font-medium">
                <label className="text-neutral-505 uppercase tracking-wider text-[9px] font-mono font-bold">Active Section Designation</label>
                <input 
                  type="text" 
                  value={newStudentSection}
                  onChange={e => setNewStudentSection(e.target.value)}
                  placeholder="e.g. A"
                  className="w-full bg-white border border-neutral-300 rounded-lg py-3 px-4 text-neutral-900 outline-none focus:border-neutral-950 font-mono font-bold"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold uppercase tracking-widest text-xs py-4 px-4 rounded-lg transition-all cursor-pointer shadow-xs"
            >
              Add Student to active Database
            </button>
          </form>
        </div>
      )}

      {/* CREATE NEW EXAM RUBRIC CONSOLE */}
      {activeSubTab === 'create-exam' && (
        <div className="bg-white border border-neutral-200 p-8 rounded-xl max-w-4xl mx-auto space-y-6 shadow-sm">
          <div className="flex items-center space-x-3.5 border-b border-neutral-100 pb-4">
            <div className="bg-neutral-50 text-neutral-900 p-2.5 rounded-lg border border-neutral-200">
              <Settings className="w-5 h-5 text-neutral-800" />
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-tight text-neutral-900 text-sm">Configure Custom Exam Rubric</h3>
              <p className="text-neutral-500 text-xs mt-1 font-sans font-medium">
                Deploy standard keys containing solution boundaries to orient multi-agent scoring networks.
              </p>
            </div>
          </div>

          {examSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{examSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleExamSubmit} className="space-y-6 text-xs font-bold font-sans">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5 col-span-2 font-medium">
                <label className="text-neutral-500 uppercase tracking-wider text-[9px] font-mono font-bold">Exam Assessment Title *</label>
                <input 
                  type="text" 
                  value={newExamTitle}
                  onChange={e => setNewExamTitle(e.target.value)}
                  placeholder="e.g. Networks Midterm Assessment"
                  className="w-full bg-white border border-neutral-300 rounded-lg py-3 px-4 text-neutral-900 outline-none focus:border-neutral-950 font-mono font-bold"
                  required
                />
              </div>
              <div className="space-y-1.5 font-medium">
                <label className="text-neutral-500 uppercase tracking-wider text-[9px] font-mono font-bold">Max Assessable Score *</label>
                <input 
                  type="number" 
                  value={newExamMaxMarks}
                  onChange={e => setNewExamMaxMarks(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full bg-white border border-neutral-300 rounded-lg py-3 px-4 text-neutral-900 outline-none focus:border-neutral-950 font-mono font-bold"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono font-bold">
              <div className="space-y-2 h-fit select-none">
                <label className="text-neutral-500 block uppercase tracking-wider text-[9px] mb-1 font-bold">Detailed Question Paper list *</label>
                <textarea 
                  value={newExamQuestions}
                  onChange={e => setNewExamQuestions(e.target.value)}
                  rows={8}
                  placeholder={`e.g.\nQ1. Define cache architecture? (10 Marks)\nQ2. Differentiate TCP and UDP? (10 Marks)`}
                  className="w-full bg-white border border-neutral-300 rounded-lg py-3.5 px-4 text-xs text-neutral-900 outline-none focus:border-neutral-950 leading-normal"
                  required
                />
              </div>

              <div className="space-y-2 h-fit select-none">
                <label className="text-neutral-500 block uppercase tracking-wider text-[9px] mb-1 font-bold">Standard Evaluator Rubric Criteria guidelines *</label>
                <textarea 
                  value={newExamRubric}
                  onChange={e => setNewExamRubric(e.target.value)}
                  rows={8}
                  placeholder={`e.g.\nQ1 Key:\n- Mentions L1 vs L2 caching layers (4 marks)\n- Quantifies memory speed vs CPU speed (6 marks)`}
                  className="w-full bg-white border border-neutral-300 rounded-lg py-3.5 px-4 text-xs text-neutral-900 outline-none focus:border-neutral-950 leading-normal"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold uppercase tracking-widest text-xs py-4 px-4 rounded-lg cursor-pointer transition-all shadow-xs"
            >
              Deploy Rubric Key to Evaluation Engine Templates
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
