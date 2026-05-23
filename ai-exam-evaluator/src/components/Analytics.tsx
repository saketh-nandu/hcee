import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  AreaChart, 
  Area, 
  CartesianGrid, 
  Cell
} from 'recharts';
import { 
  TrendingDown, 
} from 'lucide-react';
import { staticStats } from '../mockData';
import { AnswerSheet, Exam, Student } from '../types';

interface AnalyticsProps {
  sheets: AnswerSheet[];
  exams: Exam[];
  students: Student[];
  onSelectStudent: (id: string) => void;
}

export default function Analytics({
  sheets,
  exams,
  students,
  onSelectStudent
}: AnalyticsProps) {
  // Aggregate real dynamic data based on current sheets inside database
  const completedSheets = sheets.filter(s => s.evaluationStatus === 'Completed');
  
  // Sort rankings list
  const rankedStudents = [...completedSheets].sort((a, b) => b.overallScore - a.overallScore);

  // Recharts color configurations
  const COLORS = ['#171717', '#262626', '#404040', '#525252'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 selection:bg-neutral-900 selection:text-white">
      {/* Upper Brand Grid Header */}
      <div className="bg-white border border-neutral-200 p-6 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-neutral-900 flex items-center space-x-3 uppercase">
            <span>Class Performance Analytics</span>
            <span className="bg-neutral-100 text-neutral-800 text-[10px] font-mono uppercase font-bold tracking-widest px-3 py-1 border border-neutral-205 rounded-lg">
              Recharts Active
            </span>
          </h1>
          <p className="text-xs text-neutral-550 mt-1.5 font-sans font-medium">
            Syllabus conceptual gaps analysis, grading trends histograms, and dynamic student academic rankings based on OCR results.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column graphs */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Chart 1 - Grade Distribution */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-900">Grading Marks Distribution</h3>
            <p className="text-xs text-neutral-500 font-medium">Total active students grouped into performance score brackets.</p>
            
            <div className="h-64 select-none">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={staticStats.marksDistribution}>
                  <XAxis dataKey="range" stroke="#737373" fontSize={10} tickLine={false} fontClassName="font-mono font-bold" />
                  <YAxis stroke="#737373" fontSize={10} tickLine={false} allowDecimals={false} fontClassName="font-mono font-bold" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
                    labelStyle={{ color: '#171717', fontSize: '11px', fontFamily: 'monospace', fontWeight: 'bold' }}
                    itemStyle={{ color: '#262626', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Bar dataKey="count" fill="#171717" radius={[4, 4, 0, 0]}>
                    {staticStats.marksDistribution.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2 - Historical Trends */}
          <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-909">Class Academic Progress Trend</h3>
            <p className="text-xs text-neutral-505 font-medium">Continuous timeline showing historic exam class limits (Mean vs Peak Performance).</p>
            
            <div className="h-64 select-none">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={staticStats.trendData}>
                  <defs>
                    <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#171717" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#171717" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="examName" stroke="#737373" fontSize={10} tickLine={false} fontClassName="font-mono font-bold" />
                  <YAxis stroke="#737373" fontSize={10} tickLine={false} fontClassName="font-mono font-bold" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderRadius: '8px', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}
                    labelStyle={{ color: '#171717', fontSize: '11px', fontFamily: 'monospace', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="averageMarks" name="Class Mean" stroke="#171717" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAvg)" />
                  <Area type="monotone" dataKey="highestMarks" name="Class Peak" stroke="#525252" strokeWidth={2.5} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Right column lists */}
        <div className="space-y-6">
          
          {/* Rank tables list */}
          <div className="bg-white border border-neutral-200 p-6 rounded-xl space-y-4 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-900">Class Academic Rankings</h3>
            <p className="text-xs text-neutral-500 font-medium">Active roster sorted by dynamic marks totals in database.</p>

            {rankedStudents.length === 0 ? (
              <p className="text-xs text-neutral-450 font-mono">No student rank indicators logged.</p>
            ) : (
              <div className="space-y-3 font-medium font-sans">
                {rankedStudents.map((rank, idx) => (
                  <div key={rank.id} className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200 rounded-lg shadow-xs">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-6 h-6 rounded-md bg-neutral-100 text-neutral-800 flex items-center justify-center font-mono text-xs font-bold shrink-0 border border-neutral-205">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="text-xs text-neutral-900 uppercase font-bold tracking-tight">{rank.studentName}</div>
                        <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{rank.hallTicket}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-neutral-950 font-mono">{rank.overallScore} pts</div>
                      <div className="text-[9px] text-[#777] font-mono uppercase tracking-wider mt-0.5 font-bold">Confidence: {(rank.evaluationConfidence * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Detected Student Weaknesses topics lists */}
          <div className="bg-white border border-neutral-200 p-6 rounded-xl space-y-4 shadow-sm">
            <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-900 flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-rose-600" />
              <span>Priority Topic Weaknesses</span>
            </h3>
            <p className="text-xs text-neutral-500 font-medium">Syllabus streams with highest conceptual errors during grading runs.</p>

            <div className="space-y-3 font-sans">
              {staticStats.topicWeaknesses.map((topic, index) => (
                <div key={index} className="bg-neutral-50 border border-neutral-200 p-3.5 rounded-lg space-y-2 shadow-xs">
                  <div className="flex justify-between text-xs font-bold leading-none">
                    <strong className="text-neutral-900 block text-xs truncate max-w-[190px] uppercase font-bold tracking-tight">{topic.topic}</strong>
                    <span className="text-[10px] font-mono text-rose-650 tracking-wider uppercase font-bold">{topic.errorRate}% gap</span>
                  </div>
                  <p className="text-[10px] text-neutral-500 leading-relaxed font-sans font-medium">{topic.description}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
