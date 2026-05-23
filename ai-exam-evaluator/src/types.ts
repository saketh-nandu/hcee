export interface Teacher {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Teacher' | 'Reviewer';
}

export interface Student {
  id: string;
  name: string;
  hall_ticket: string; // Roll number is the hall_ticket
  class: string;
  section: string;
  email?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export interface Exam {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  maxMarks: number;
  date: string;
  rubricKeyText: string; // Standard Answer Key
  questionPaperText: string; // Structured criteria / questions list
}

export interface QuestionFeedback {
  strengths: string[];
  weaknesses: string[];
  comments: string;
}

export interface QuestionEvaluation {
  questionNo: string;
  marksAwarded: number;
  maxMarks: number;
  strengths: string[];
  weaknesses: string[];
  feedback: string;
  confidenceScore: number;
}

export interface AnswerSheet {
  id: string;
  studentId: string;
  studentName: string;
  hallTicket: string;
  examId: string;
  fileUrl: string;
  fileName: string;
  extractedText: string;
  pages: number;
  evaluationStatus: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  overallScore: number;
  evaluationConfidence: number;
  evaluations: QuestionEvaluation[];
  overallFeedback: string;
  plagiarismScore?: number; // Bonus: Plagiarism detection score (0-100)
  handwritingQuality?: 'Excellent' | 'Legible' | 'Poor'; // Bonus: Handwriting detection
  aiImprovementPlans?: string[]; // Bonus: AI Study Recommendations
  evaluatedAt?: string;
  reviewerApproved?: boolean;
  reviewedBy?: string;
}

export interface AgentLog {
  id: string;
  timestamp: string;
  agentName: 'OCR' | 'Reconstruction' | 'Segmentation' | 'Understanding' | 'Rubric_Matching' | 'Scoring' | 'Verification';
  status: 'running' | 'completed' | 'warning' | 'error';
  message: string;
}

export interface ExamStatistics {
  totalStudents: number;
  evaluatedSheets: number;
  averageScore: number;
  topPerformer: {
    name: string;
    score: number;
    hallTicket: string;
  };
  marksDistribution: {
    range: string;
    count: number;
  }[];
  topicWeaknesses: {
    topic: string;
    errorRate: number; // percentage of students who lost marks
    description: string;
  }[];
  trendData: {
    examName: string;
    averageMarks: number;
    highestMarks: number;
  }[];
}

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  model: string;
  systemInstruction: string;
  temperature: number;
  isActive: boolean;
}

