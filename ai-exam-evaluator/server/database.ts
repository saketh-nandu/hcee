import fs from 'fs';
import path from 'path';
import { initialSubjects, initialExams, initialStudents, initialAnswerSheets } from '../src/mockData.js';
import { Subject, Exam, Student, AnswerSheet, AgentLog, AgentConfig } from '../src/types.js';

const DATA_FILE = path.join(process.cwd(), '.data_evaluator.json');

export interface DBStore {
  subjects: Subject[];
  exams: Exam[];
  students: Student[];
  answerSheets: AnswerSheet[];
  agentLogs: { [sheetId: string]: AgentLog[] };
  agentConfigs?: AgentConfig[];
}

export const defaultAgentConfigs: AgentConfig[] = [
  {
    id: 'agent-ocr',
    name: 'OCR Transcription Agent',
    role: 'Visual text extraction & handwritten word profiling',
    model: 'gemini-3.5-flash',
    systemInstruction: 'You are an expert OCR Agent. Directly read handwritten exam sheets and transcribe all readable characters. Correct skewing noise but retain spelling mistakes and precise structural layout. Return only the raw text.',
    temperature: 0.1,
    isActive: true
  },
  {
    id: 'agent-reconstruction',
    name: 'Transcript Repair Agent',
    role: 'Bypassing visual skew / noise, maintaining raw meaning',
    model: 'gemini-3.5-flash',
    systemInstruction: 'You are an expert Reconstruction Agent. Clean typographic noise, eliminate broken chars, and handle structural clarity of the extracted transcript without changing the original semantics or correcting factual errors.',
    temperature: 0.2,
    isActive: true
  },
  {
    id: 'agent-segmentation',
    name: 'Layout Segmenter Agent',
    role: 'Deconstructing booklet structure into question blocks',
    model: 'gemini-3.5-flash',
    systemInstruction: 'You are a Question Segmentation specialist. Isolate student answers and map them against distinct question labels (e.g. Q1, Q2, etc.) based on the input question paper schema.',
    temperature: 0.1,
    isActive: true
  },
  {
    id: 'agent-rubric',
    name: 'Rubric Matchmaster Agent',
    role: 'Mapping isolated solutions to solution keys',
    model: 'gemini-3.5-flash',
    systemInstruction: 'You are a Rubric Alignment Analyst. Match student answers closely to baseline Answer Rubrics to detect factual matches, keyword coverage, and step completeness.',
    temperature: 0.2,
    isActive: true
  },
  {
    id: 'agent-scoring',
    name: 'Marks Assessor Agent',
    role: 'Objective grading deductions calculation',
    model: 'gemini-3.5-flash',
    systemInstruction: 'You are an expert Grading Expert. Calculate marks for every question objectively using standard step deduction calculations, with strict adherence to maximum scores.',
    temperature: 0.2,
    isActive: true
  },
  {
    id: 'agent-verification',
    name: 'Verification & Audit Agent',
    role: 'Safety locks & anti-hallucination checkpoints',
    model: 'gemini-3.5-flash',
    systemInstruction: 'You are a grading Verification compliance inspector. Verify that marks never exceed maximum thresholds, eliminate hallucination artifacts, compute overall feedback, plagiarism check flag ratings, and design custom study recommendation guides.',
    temperature: 0.1,
    isActive: true
  }
];

let memoryDb: DBStore | null = null;

export function getDB(): DBStore {
  if (memoryDb) {
    return memoryDb;
  }

  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
      memoryDb = JSON.parse(fileContent);
      if (!memoryDb.agentConfigs) {
        memoryDb.agentConfigs = [...defaultAgentConfigs];
        saveDB();
      }
      console.log('Database loaded successfully from file registry.');
      return memoryDb!;
    }
  } catch (error) {
    console.error('Error reading JSON DB file, falling back to memory database:', error);
  }

  // Seed initial data
  memoryDb = {
    subjects: [...initialSubjects],
    exams: [...initialExams],
    students: [...initialStudents],
    answerSheets: [...initialAnswerSheets],
    agentLogs: {},
    agentConfigs: [...defaultAgentConfigs]
  };

  saveDB();
  return memoryDb;
}

export function saveDB() {
  if (!memoryDb) return;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryDb, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write JSON DB to physical filesystem:', err);
  }
}

// Data helper functions
export function getExams(): Exam[] {
  return getDB().exams;
}

export function getExam(id: string): Exam | undefined {
  return getDB().exams.find(e => e.id === id);
}

export function createExam(exam: Exam): Exam {
  const db = getDB();
  db.exams.push(exam);
  saveDB();
  return exam;
}

export function getStudents(): Student[] {
  return getDB().students;
}

export function getStudent(id: string): Student | undefined {
  return getDB().students.find(s => s.id === id);
}

export function getStudentByTicket(ticket: string): Student | undefined {
  return getDB().students.find(s => s.hall_ticket.toLowerCase() === ticket.toLowerCase());
}

export function createStudent(student: Student): Student {
  const db = getDB();
  db.students.push(student);
  saveDB();
  return student;
}

export function getAnswerSheets(): AnswerSheet[] {
  return getDB().answerSheets;
}

export function getAnswerSheet(id: string): AnswerSheet | undefined {
  return getDB().answerSheets.find(s => s.id === id);
}

export function createAnswerSheet(sheet: AnswerSheet): AnswerSheet {
  const db = getDB();
  db.answerSheets.push(sheet);
  saveDB();
  return sheet;
}

export function updateAnswerSheet(sheet: AnswerSheet): AnswerSheet {
  const db = getDB();
  const idx = db.answerSheets.findIndex(s => s.id === sheet.id);
  if (idx !== -1) {
    db.answerSheets[idx] = sheet;
  } else {
    db.answerSheets.push(sheet);
  }
  saveDB();
  return sheet;
}

export function getLogs(sheetId: string): AgentLog[] {
  return getDB().agentLogs[sheetId] || [];
}

export function saveLogs(sheetId: string, logs: AgentLog[]) {
  const db = getDB();
  db.agentLogs[sheetId] = logs;
  saveDB();
}

export function getSubjects(): Subject[] {
  return getDB().subjects;
}

export function getAgentConfigs(): AgentConfig[] {
  const db = getDB();
  return db.agentConfigs || [...defaultAgentConfigs];
}

export function updateAgentConfigs(configs: AgentConfig[]): AgentConfig[] {
  const db = getDB();
  db.agentConfigs = configs;
  saveDB();
  return configs;
}
