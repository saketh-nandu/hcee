import React, { useEffect, useState, useRef } from 'react';
import { 
  Terminal, 
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { AgentLog, AnswerSheet, Exam } from '../types';

interface PipelineViewerProps {
  sheetId: string;
  associatedExam?: Exam;
  onSelectSheet: (id: string) => void;
  onNavigateHome: () => void;
}

export default function PipelineViewer({
  sheetId,
  associatedExam,
  onSelectSheet,
  onNavigateHome
}: PipelineViewerProps) {
  const [logs, setLogs] = useState<AgentLog[]>([]);
  const [sheet, setSheet] = useState<AnswerSheet | null>(null);
  const [loading, setLoading] = useState(true);
  const terminalEndRef = useRef<HTMLDivElement | null>(null);

  // Poll logs and sheet status every 1.5 seconds until finalized
  useEffect(() => {
    let active = true;

    const pollData = async () => {
      try {
        const sheetRes = await fetch(`/api/sheets/${sheetId}`);
        const logRes = await fetch(`/api/sheets/${sheetId}/logs`);

        if (sheetRes.ok && logRes.ok) {
          const sheetData = await sheetRes.json();
          const logData = await logRes.json();

          if (active) {
            setSheet(sheetData);
            setLogs(logData);
            setLoading(false);

            // If done, stop fetching
            if (sheetData.evaluationStatus === 'Completed' || sheetData.evaluationStatus === 'Failed') {
              clearInterval(timer);
            }
          }
        }
      } catch (err) {
        console.error("Polling error logs inside PipelineViewer:", err);
      }
    };

    pollData();
    const timer = setInterval(pollData, 1500);

    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [sheetId]);

  // Scroll to bottom of terminal when logs length updates
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Determine standard agent states to render in timeline
  const agentsList: { name: AgentLog['agentName']; label: string; desc: string }[] = [
    { name: 'OCR', label: 'OCR Vision Agent', desc: 'Resolves raw hand-ink glyph patterns into symbols' },
    { name: 'Reconstruction', label: 'Text Reconstruction Agent', desc: 'Repairs cursive grammatical syntax gaps' },
    { name: 'Segmentation', label: 'Segment Agent', desc: 'Isolates candidate answers by rubric landmarks' },
    { name: 'Understanding', label: 'Understanding Agent', desc: 'Translates student response semantic models' },
    { name: 'Rubric_Matching', label: 'Rubric Agent', desc: 'Maps concepts against solution templates list' },
    { name: 'Scoring', label: 'Scoring Analyst', desc: 'Allocates step-weighted metrics consistently' },
    { name: 'Verification', label: 'Verification Auditor', desc: 'Locks grade boundaries against errors' }
  ];

  const getAgentStatus = (agentName: AgentLog['agentName']) => {
    const agentLogs = logs.filter(l => l.agentName === agentName);
    if (agentLogs.length === 0) return 'pending';
    
    // Find if has completed or warnings
    const completed = agentLogs.some(l => l.status === 'completed');
    const warning = agentLogs.some(l => l.status === 'warning');
    const error = agentLogs.some(l => l.status === 'error');

    if (error) return 'error';
    if (completed) return 'completed';
    if (warning) return 'warning';
    return 'running';
  };

  const getPercentageProgress = () => {
    if (!sheet) return 5;
    if (sheet.evaluationStatus === 'Completed') return 100;
    if (sheet.evaluationStatus === 'Failed') return 100;

    // Approximate math based on completed agent levels
    let activeAgentsCount = 0;
    agentsList.forEach(agent => {
      const status = getAgentStatus(agent.name);
      if (status === 'completed') activeAgentsCount++;
      else if (status === 'running') activeAgentsCount += 0.5;
    });

    return Math.floor((activeAgentsCount / agentsList.length) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8 selection:bg-neutral-900 selection:text-white">
      {/* Header Profile description */}
      <div className="bg-white border border-neutral-200 p-6 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm animate-fadeIn">
        <div className="flex items-center space-x-4">
          <div className="bg-neutral-100 border border-neutral-200 text-neutral-800 p-3 rounded-lg">
            <RefreshCw className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h2 className="text-lg font-bold uppercase tracking-tight text-neutral-900 flex flex-wrap items-center gap-2">
              <span>Evaluating booklet:</span>
              <span className="text-neutral-600 font-mono text-sm font-semibold">{sheet?.fileName}</span>
            </h2>
            <p className="text-xs text-neutral-500 mt-1.5 font-sans font-medium">
              Candidate: <span className="font-bold text-neutral-900">{sheet?.studentName?.toUpperCase()} ({sheet?.hallTicket})</span> • Rubric: <span className="font-bold text-neutral-900">{associatedExam?.title?.toUpperCase()}</span>
            </p>
          </div>
        </div>

        {sheet?.evaluationStatus === 'Completed' && (
          <button 
            id="pipeline-btn-view"
            onClick={() => onSelectSheet(sheet.id)}
            className="bg-neutral-900 hover:bg-neutral-850 text-white font-bold uppercase tracking-widest text-xs px-6 py-3 rounded-lg flex items-center space-x-2 transition-all cursor-pointer"
          >
            <span>Browse Graded Sheet</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Progress slider bar */}
      <div className="space-y-3">
        <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-neutral-500 font-bold">
          <span>LangGraph Pipeline State Machine Progress</span>
          <span className="text-neutral-900 font-bold">{getPercentageProgress()}%</span>
        </div>
        <div className="w-full bg-neutral-100 h-2.5 rounded-lg overflow-hidden border border-neutral-200 shadow-inner">
          <div 
            className="bg-neutral-900 h-full transition-all duration-500" 
            style={{ width: `${getPercentageProgress()}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column - Live log screen (Terminal) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden flex flex-col h-[520px] shadow-lg">
            <div className="bg-neutral-900 px-5 py-3 border-b border-neutral-800 flex justify-between items-center">
              <div className="flex items-center space-x-2.5">
                <Terminal className="w-4 h-4 text-neutral-400" />
                <span className="text-[10px] uppercase font-bold font-mono tracking-widest text-neutral-200">AUTONOMOUS_PIPELINE.LOG</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-neutral-750" />
                <span className="w-2 h-2 rounded-full bg-neutral-600" />
                <span className="w-2 h-2 rounded-full bg-neutral-400" />
              </div>
            </div>

            <div className="p-5 overflow-y-auto flex-1 font-mono text-[10px] space-y-3 text-neutral-100">
              {logs.length === 0 ? (
                <div className="text-neutral-550 flex items-center space-x-2 animate-pulse font-mono">
                  <span>&gt; Initializing task queues, provisioning sandbox space...</span>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="space-y-1 font-mono">
                    <div className="flex items-start space-x-2 leading-relaxed">
                      <span className="text-neutral-500 select-none font-bold">&gt;</span>
                      <span className="text-neutral-500">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                      <span className={`font-bold uppercase tracking-wider text-[9px] ${
                        log.status === 'completed' ? 'text-emerald-400' :
                        log.status === 'warning' ? 'text-amber-400' :
                        log.status === 'error' ? 'text-red-400' : 'text-neutral-300'
                      }`}>
                        [{log.agentName?.toUpperCase()}]
                      </span>
                      <span className="text-neutral-300">{log.message}</span>
                    </div>
                  </div>
                ))
              )}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>

        {/* Right column - Multi agent steps status */}
        <div className="space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-5 shadow-sm animate-fadeIn">
            <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-900">Active Grading Agents</h3>
            
            <div className="relative border-l border-neutral-200 pl-6 space-y-6">
              {agentsList.map((agent, i) => {
                const status = getAgentStatus(agent.name);
                
                return (
                  <div key={i} className="relative">
                    {/* Glowing status circle indicator */}
                    <div className={`absolute -left-[31px] top-1 w-2.5 h-2.5 rounded-full border bg-white transition-all ${
                      status === 'completed' ? 'border-emerald-500 bg-emerald-500 shadow' :
                      status === 'running' ? 'border-neutral-900 bg-neutral-900 animate-pulse' :
                      status === 'warning' ? 'border-amber-500 bg-amber-500' :
                      status === 'error' ? 'border-red-500 bg-red-500' : 'border-neutral-200 bg-neutral-100'
                    }`} />

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900 uppercase tracking-wide">{agent.label}</span>
                        <span className={`font-mono text-[9px] font-bold uppercase tracking-widest ${
                          status === 'completed' ? 'text-emerald-700' :
                          status === 'running' ? 'text-neutral-900 animate-pulse' :
                          status === 'warning' ? 'text-amber-705' :
                          status === 'error' ? 'text-red-700' : 'text-neutral-400'
                        }`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-[10px] text-neutral-500 leading-snug font-sans font-medium">{agent.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
