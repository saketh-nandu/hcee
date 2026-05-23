import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Trash2, 
  Database,
  Sliders,
  Info
} from 'lucide-react';
import AgentStudio from './AgentStudio';

export default function Settings() {
  const [configMode, setConfigMode] = useState<'system' | 'agent'>('system');
  const [apiKeyActive, setApiKeyActive] = useState<boolean | null>(null);
  const [gradingStrictness, setGradingStrictness] = useState('standard');
  const [autoApproveScore, setAutoApproveScore] = useState(true);
  const [plagiarismIndex, setPlagiarismIndex] = useState(15);
  const [wipeSuccess, setWipeSuccess] = useState(false);

  // Poll server state
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setApiKeyActive(data.aiActive);
      })
      .catch(() => setApiKeyActive(false));
  }, []);

  const handleWipeDatabase = async () => {
    if (confirm("Are you sure you want to reset the cache registry database? All custom exam templates and newly graded sheets will revert back to baseline benchmarks.")) {
      // Create simple data reset trick
      localStorage.clear();
      setWipeSuccess(true);
      setTimeout(() => {
        setWipeSuccess(false);
        window.location.reload();
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8 selection:bg-neutral-900 selection:text-white">
      {/* Header Profile description */}
      <div className="bg-white border border-neutral-200 p-6 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-neutral-900 flex items-center space-x-3 uppercase">
            <span>Control & Settings Desk</span>
            <span className="bg-neutral-100 border border-neutral-200 text-neutral-800 text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-lg font-bold">
              {configMode === 'system' ? 'System Configuration' : 'Agent Prompt Customizer'}
            </span>
          </h1>
          <p className="text-xs text-neutral-500 mt-1.5 font-sans font-medium">
            {configMode === 'system' 
              ? 'Configure evaluation strictness coefficients, auto-approval thresholds, and baseline databases.'
              : 'Edit multi-agent core system instructions, LLM context structures, and invoke unit tests.'}
          </p>
        </div>

        {/* High-Contrast Toggle Switch */}
        <div className="flex bg-neutral-100/80 border border-neutral-250 p-1 rounded-xl w-56 text-[9px] font-mono font-bold tracking-widest h-fit shrink-0">
          <button 
            type="button"
            onClick={() => setConfigMode('system')}
            className={`flex-1 text-center py-2.5 rounded-lg flex items-center justify-center space-x-1.5 uppercase transition-all duration-155 cursor-pointer ${
              configMode === 'system' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-950'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Tunings</span>
          </button>
          <button 
            type="button"
            onClick={() => setConfigMode('agent')}
            className={`flex-1 text-center py-2.5 rounded-lg flex items-center justify-center space-x-1.5 uppercase transition-all duration-155 cursor-pointer ${
              configMode === 'agent' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-950'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Prompts</span>
          </button>
        </div>
      </div>

      {configMode === 'agent' ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-sm animate-fade-in text-neutral-800">
          <AgentStudio />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
        
        {/* Left Side Settings Form */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-neutral-200 p-6 rounded-xl space-y-6 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-900 flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-neutral-800" />
              <span>Grading Engine Tuning</span>
            </h3>

            <div className="space-y-4 text-xs font-bold font-sans">
              {/* Strictness config */}
              <div className="space-y-2">
                <label className="text-neutral-500 block uppercase tracking-wider text-[9px] font-mono font-bold">Evaluation Strictness profile:</label>
                <div className="grid grid-cols-3 gap-2 bg-neutral-50 p-1 border border-neutral-200 rounded-lg">
                  <button 
                    type="button"
                    onClick={() => setGradingStrictness('lenient')}
                    className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-md cursor-pointer transition-all ${
                      gradingStrictness === 'lenient' ? 'bg-white text-neutral-900 border border-neutral-250 shadow-xs font-bold' : 'text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    Lenient (Soft check)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setGradingStrictness('standard')}
                    className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-md cursor-pointer transition-all ${
                      gradingStrictness === 'standard' ? 'bg-white text-neutral-900 border border-neutral-250 shadow-xs font-bold' : 'text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    Balanced (Moderate)
                  </button>
                  <button 
                    type="button"
                    onClick={() => setGradingStrictness('rigorous')}
                    className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-md cursor-pointer transition-all ${
                      gradingStrictness === 'rigorous' ? 'bg-white text-neutral-900 border border-neutral-250 shadow-xs font-bold' : 'text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    Rigorous (Strict check)
                  </button>
                </div>
              </div>

              {/* Automatic Approval Toggle */}
              <div className="flex items-center justify-between p-4 bg-neutral-50 border border-neutral-200 rounded-lg shadow-xs">
                <div>
                  <span className="text-neutral-905 block text-xs uppercase tracking-tight font-bold">Authorize Auto-Signoff</span>
                  <span className="text-[10px] text-neutral-500 block font-sans font-medium mt-1">Lock and approve scores automatically if grading confidence resolves over 92%.</span>
                </div>
                <button 
                  type="button"
                  onClick={() => setAutoApproveScore(!autoApproveScore)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    autoApproveScore ? 'bg-neutral-900 text-white shadow-xs' : 'bg-white text-neutral-400 border border-neutral-300'
                  }`}
                >
                  {autoApproveScore ? "Active" : "Disabled"}
                </button>
              </div>

              {/* Plagiarism threshold settings slider */}
              <div className="space-y-3 p-4 bg-neutral-50 border border-neutral-200 rounded-lg shadow-xs">
                <div className="flex justify-between items-center text-xs">
                  <div>
                    <span className="text-neutral-900 block uppercase tracking-tight font-bold">Flag Copy Match Limit</span>
                    <span className="text-[10px] text-neutral-500 block font-sans font-medium mt-1">Triggers a warning tag if answer matchmaking indices exceed limits.</span>
                  </div>
                  <span className="text-sm font-bold text-neutral-950 font-mono">{plagiarismIndex}%</span>
                </div>
                <input 
                  type="range"
                  min="5"
                  max="60"
                  value={plagiarismIndex}
                  onChange={e => setPlagiarismIndex(Number(e.target.value))}
                  className="w-full accent-neutral-900 h-1 bg-neutral-200 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right column diagnostics details */}
        <div className="space-y-6 animate-fade-in">
          {/* Active AI Status widget */}
          <div className="bg-white border border-neutral-200 p-5 rounded-xl space-y-4 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-900 flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-neutral-850" />
              <span>AI Server Health</span>
            </h3>

            <div className="space-y-4 text-xs font-bold">
              <div className="flex items-center justify-between py-1 border-b border-neutral-100">
                <span className="text-[10px] uppercase font-mono text-neutral-500">Gemini Key status</span>
                {apiKeyActive === null ? (
                  <span className="text-neutral-400 font-mono font-medium">Tracing...</span>
                ) : apiKeyActive ? (
                  <span className="text-emerald-700 font-mono font-bold uppercase tracking-wider">API Active ✓</span>
                ) : (
                  <span className="text-amber-700 font-mono font-bold uppercase tracking-wider">Fallback System active</span>
                )}
              </div>

              <div className="bg-neutral-50 p-3.5 rounded-lg border border-neutral-200 text-[10px] text-neutral-600 leading-relaxed flex items-start space-x-2 shadow-xs">
                <Info className="w-3.5 h-3.5 text-neutral-800 shrink-0 mt-0.5" />
                <span className="font-sans font-medium leading-relaxed font-semibold">
                  {apiKeyActive 
                    ? "Your API key is active. All grading models run using 'gemini-2.5-flash' on the server."
                    : "Using modular rule-based heuristics. Provide a real 'GEMINI_API_KEY' secret inside Settings panel to unlock continuous handwriting OCR."
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Database management console */}
          <div className="bg-white border border-neutral-200 p-5 rounded-xl space-y-4 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-900 flex items-center space-x-2">
              <Database className="w-4 h-4 text-neutral-80 &" />
              <span>Database Sync</span>
            </h3>

            {wipeSuccess && (
              <div className="bg-emerald-50 border border-emerald-250 text-emerald-800 p-2.5 text-center font-bold font-mono tracking-wide rounded-lg text-[10px]">
                DATABASE REBUILT! RE-ALIGNING INDEXES...
              </div>
            )}

            <button 
              type="button"
              onClick={handleWipeDatabase}
              className="w-full bg-rose-50 hover:bg-rose-105/50 border border-rose-200 text-rose-800 font-bold uppercase tracking-widest py-3 px-3 rounded-lg text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-700" />
              <span>Restore Database Baseline</span>
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);
}

