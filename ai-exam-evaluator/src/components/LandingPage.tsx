import React, { useState } from 'react';
import { 
  CheckCircle, 
  Cpu, 
  Layers, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  HelpCircle
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
}

export default function LandingPage({ onStart, onLogin }: LandingPageProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const stats = [
    { value: "99.2%", label: "OCR Accuracy", desc: "Recognizes complex handwriting styles & cursive scripts" },
    { value: "< 15s", label: "Evaluation Speed", desc: "Saves up to 12 hours per examination batch" },
    { value: "0.95", label: "Teacher Correlation", desc: "Substantially matches veteran human grading parameters" },
    { value: "125K+", label: "Papers Graded", desc: "Active university and school examination cohorts" }
  ];

  const steps = [
    {
      num: "01",
      title: "Define Question Key",
      desc: "Upload target exam boundaries & weighted criteria keywords to orient evaluating models."
    },
    {
      num: "02",
      title: "Batch Scan Sheets",
      desc: "Upload handwritten booklets as bulk high-density PDFs or clean image packages."
    },
    {
      num: "03",
      title: "Agent Execution Loop",
      desc: "Multi-agent graph aligns transcriptions, detects structures, and allocates marks."
    },
    {
      num: "04",
      title: "Review & Signoff",
      desc: "Audit the analytical scores with exact inline annotations and publish final records."
    }
  ];

  const faqs = [
    {
      q: "How does the OCR engine handle messy or cursive handwriting?",
      a: "Our advanced vision system utilizes specialized multi-layer neural handwriting layouts to resolve noisy inks. If cursives are excessively blurred, the Verification Agent flags active alerts for rapid human review."
    },
    {
      q: "Can the AI understand partial answers and award step marks?",
      a: "Yes! Guided by the Custom Rubric schema, the Marks Allocation agent weights semantic elements individually to guarantee high-fidelity step-scores."
    },
    {
      q: "Can we override the AI-generated scores?",
      a: "Absolutely. The dashboard console provides instant manual overrides. Any changed marks automatically recompute all analytics counters on-the-fly."
    },
    {
      q: "Is student data kept confidential?",
      a: "100% yes. All exam booklet scans, OCR outputs, and analytical metrics remain securely sandboxed with standard educational permission protocols."
    }
  ];

  return (
    <div className="bg-white text-neutral-900 min-h-screen font-sans overflow-x-hidden selection:bg-neutral-900 selection:text-white">
      
      {/* Navigation Headers */}
      <nav id="landing-nav" className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-neutral-200/80 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-neutral-900 text-white p-2 rounded-xl shadow-sm">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight text-neutral-900 uppercase">AI Exam Evaluator</span>
              <span className="text-[9px] block text-neutral-500 font-mono tracking-[0.25em] uppercase leading-none">Autonomous Agent Core</span>
            </div>
          </div>
          <div className="flex items-center space-x-5">
            <button 
              id="nav-btn-faq" 
              onClick={() => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-neutral-500 hover:text-black text-xs uppercase tracking-wider font-bold transition-colors cursor-pointer"
            >
              FAQ
            </button>
            <button 
              id="login-btn-top" 
              onClick={onLogin} 
              className="text-neutral-700 hover:text-black hover:bg-neutral-50 text-xs font-bold uppercase tracking-wider border border-neutral-300 rounded-lg px-4 py-2 transition-all cursor-pointer"
            >
              Teacher Login
            </button>
            <button 
              id="cta-start-top" 
              onClick={onStart} 
              className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-lg flex items-center space-x-2 transition-all cursor-pointer"
            >
              <span>Launch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header id="landing-hero" className="relative pt-24 pb-20 px-6 flex flex-col items-center justify-center text-center">
        {/* Subtle Ambient Background gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-neutral-100/50 rounded-full filter blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto z-10">
          <div className="inline-flex items-center space-x-2 bg-neutral-100 border border-neutral-200 rounded-full px-4 py-1.5 mb-8 text-[10px] font-bold uppercase tracking-widest text-neutral-700">
            <Sparkles className="w-3.5 h-3.5 text-neutral-900" />
            <span>Autonomous Evaluation & Handwriting Transcriptions</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-neutral-950 mb-6 leading-[0.95]">
            Handwritten Exams <br />
            <span className="text-neutral-900 border-b-4 border-neutral-900 pb-1">
              Autonomous Grader
            </span>
          </h1>

          <p className="text-neutral-600 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed font-sans font-medium">
            Eliminate weeks of exhausting grading backlogs. Convert physical answer sheets into structured layout transcripts. Award step marks with absolute semantic consistency.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center items-center mb-16">
            <button 
              id="cta-start-hero" 
              onClick={onStart} 
              className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white font-bold uppercase tracking-wider text-xs px-8 py-4.5 rounded-lg flex items-center justify-center space-x-3 transition-all cursor-pointer"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              id="cta-learn-hero" 
              onClick={() => document.getElementById('pipeline-section')?.scrollIntoView({ behavior: 'smooth' })} 
              className="w-full sm:w-auto bg-transparent hover:bg-neutral-50 border border-neutral-350 text-neutral-800 font-bold uppercase tracking-wider text-xs px-8 py-4.5 rounded-lg transition-all cursor-pointer"
            >
              See Agent Pipeline
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 bg-neutral-50/70 border border-neutral-200 rounded-xl p-8 text-left">
            {stats.map((stat, i) => (
              <div key={i} className="space-y-2">
                <div className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tighter font-mono">{stat.value}</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-800 font-mono">{stat.label}</div>
                <div className="text-xs text-neutral-500 leading-snug font-sans font-medium">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Main Feature Highlight Grid */}
      <section id="features-section" className="py-20 px-6 border-t border-neutral-200 relative bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Operational Integrity</h2>
            <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-neutral-900">Full-Stack SaaS Excellence</h3>
            <p className="text-neutral-500 mt-4 text-sm font-sans font-medium">
              Provide school systems and private coaches with secure tools to automate student answer booklets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div id="feature-card-ocr" className="bg-white border border-neutral-200 shadow-sm rounded-xl p-8 hover:border-neutral-900 transition-all group">
              <div className="bg-neutral-100 text-neutral-900 p-3 rounded-lg w-fit mb-6 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold uppercase tracking-tight text-neutral-900 mb-2">Dual OCR Parsing</h4>
              <p className="text-neutral-500 text-xs leading-relaxed font-sans font-medium">
                Transcribes diverse continuous writing patterns. Accommodates ink variations, page layout tilts, and messy scribbled equations.
              </p>
            </div>

            <div id="feature-card-multi-agent" className="bg-white border border-neutral-200 shadow-sm rounded-xl p-8 hover:border-neutral-900 transition-all group">
              <div className="bg-neutral-100 text-neutral-900 p-3 rounded-lg w-fit mb-6 group-hover:scale-110 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold uppercase tracking-tight text-neutral-900 mb-2">Multi-Agent Graph</h4>
              <p className="text-neutral-500 text-xs leading-relaxed font-sans font-medium">
                Avoid single-prompts. Multi-agent state machine performs structured layout analysis, transcript repairs, rubrics comparison, & audit triggers.
              </p>
            </div>

            <div id="feature-card-review" className="bg-white border border-neutral-200 shadow-sm rounded-xl p-8 hover:border-neutral-900 transition-all group">
              <div className="bg-neutral-100 text-neutral-900 p-3 rounded-lg w-fit mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold uppercase tracking-tight text-neutral-900 mb-2">Academic Validation</h4>
              <p className="text-neutral-500 text-xs leading-relaxed font-sans font-medium">
                Inspects grammatical structure limits, computes handwriting legibility indexes, and surfaces plagiarism patterns within grading cohorts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Multi-Agent workflow visualization */}
      <section id="pipeline-section" className="py-20 px-6 bg-neutral-50 border-t border-neutral-250/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Automated Pipelinings</h2>
            <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-tight text-neutral-900">How The Grading Team Evaluates</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col bg-white border border-neutral-200 shadow-sm rounded-xl p-6 relative">
                <div className="text-5xl font-black text-neutral-200 font-mono mb-4">{step.num}</div>
                <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-900 mb-2">{step.title}</h4>
                <p className="text-neutral-500 text-xs leading-relaxed font-sans font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section id="faq-section" className="py-20 px-6 border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[10px] font-mono font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Inquiry Desk</h2>
            <h3 className="text-3xl font-bold uppercase tracking-tight text-neutral-900">Frequently Asked Answers</h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-neutral-200 rounded-lg overflow-hidden transition-all shadow-sm">
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full text-left px-6 py-5 flex justify-between items-center text-neutral-800 hover:text-black font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <HelpCircle className="w-4 h-4 text-neutral-450" />
                </button>
                {activeFaq === i && (
                  <div className="px-6 pb-5 text-xs text-neutral-650 border-t border-neutral-100 pt-3 leading-relaxed font-sans font-medium">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <footer className="border-t border-neutral-200 py-16 px-6 text-center text-neutral-450 text-xs bg-white relative">
        <div className="max-w-2xl mx-auto">
          <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-10 mb-12">
            <h4 className="text-xl font-bold uppercase tracking-tight text-neutral-900 mb-2">Boost Evaluation Velocity</h4>
            <p className="text-neutral-500 text-xs max-w-md mx-auto mb-6 font-sans font-medium">Transcribe, score, and evaluate continuous exams automatically using our robust multi-agent OCR engine.</p>
            <button 
              onClick={onStart} 
              className="bg-neutral-900 hover:bg-neutral-800 text-white font-bold uppercase tracking-widest text-xs py-3.5 px-6 rounded-lg transition-all shadow-sm cursor-pointer"
            >
              Initialize Workspace
            </button>
          </div>
          <p className="font-mono text-[10px] font-bold text-neutral-400">© 2026 AI EXAM EVALUATOR. OPERATED WITH GEMINI MULTI-AGENT HANDWRITING RECONSTRUCTIONS.</p>
        </div>
      </footer>
    </div>
  );
}
