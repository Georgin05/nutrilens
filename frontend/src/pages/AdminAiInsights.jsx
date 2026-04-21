import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function AdminAiInsights() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getAdminAiConversations();
        setConversations(data || []);
      } catch (err) {
        console.error("Failed to fetch ai insights", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">AI Insight Monitoring</h1>
          <p className="text-admin-text-muted font-medium">Real-time telemetry and accuracy auditing for the NutriLens AI Core.</p>
        </div>
        <button className="btn-admin-primary flex items-center gap-2">
          <span className="material-symbols-outlined">auto_awesome</span>
          Run System Audit
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Main Feed */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black text-white">Live Interaction Stream</h2>
            <div className="flex items-center gap-2 bg-admin-surface p-1 rounded-xl border border-admin-border">
              <span className="px-3 py-1 bg-admin-primary text-admin-bg-dark rounded-lg text-[10px] font-black uppercase">Live</span>
              <span className="px-3 py-1 text-admin-text-muted text-[10px] font-black uppercase">Historical</span>
            </div>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-20">
                <span className="material-symbols-outlined animate-spin text-admin-primary text-4xl">sync</span>
              </div>
            ) : conversations.length === 0 ? (
              <div className="clay-card-admin p-10 text-center text-admin-text-muted font-bold italic">
                No active pulses detected in the AI core.
              </div>
            ) : (
              conversations.map((conv, i) => (
                <div key={conv.id || i} className="clay-card-admin p-8 group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-admin-surface flex items-center justify-center text-admin-primary border border-admin-border">
                        <span className="material-symbols-outlined">psychology</span>
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">Node #{conv.user_id || 'Global'}</p>
                        <p className="text-[10px] font-bold text-admin-text-muted uppercase tracking-widest">
                          {new Date(conv.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="px-3 py-1 border border-admin-primary/20 rounded-full flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-admin-primary rounded-full animate-pulse"></span>
                      <span className="text-[10px] font-black text-admin-primary uppercase tracking-widest">Processing</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="p-4 bg-admin-bg-dark/40 rounded-2xl rounded-tl-none border border-admin-border/10">
                      <p className="text-sm font-medium text-admin-text-muted italic">"{conv.message}"</p>
                    </div>
                    <div className="p-4 bg-admin-primary/5 rounded-2xl rounded-tr-none border border-admin-primary/20">
                      <p className="text-sm font-bold text-white leading-relaxed">
                        <span className="text-admin-primary">AI Core:</span> Analysis complete. Nutrients verified against GS1 mapping.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-admin-border flex justify-between items-center">
                    <div className="flex gap-4">
                      <button className="flex items-center gap-2 text-[10px] font-black text-admin-text-muted hover:text-admin-primary transition-colors uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">thumb_up</span> Correct
                      </button>
                      <button className="flex items-center gap-2 text-[10px] font-black text-admin-text-muted hover:text-rose-500 transition-colors uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">thumb_down</span> Flag
                      </button>
                    </div>
                    <button className="text-[10px] font-black text-admin-primary uppercase tracking-widest hover:underline">Full Trace</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Metrics */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <div className="clay-card-admin p-8">
            <h3 className="text-[10px] font-black text-admin-text-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-admin-primary">bolt</span>
              Active Triggers
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Medical Limitation', status: 'Blocked', color: 'rose' },
                { name: 'Label OCR Confidence', status: 'Verify', color: 'amber' },
                { name: 'Macro Discrepancy', status: 'Idle', color: 'admin-primary' },
              ].map((trigger, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-admin-bg-dark/40 rounded-xl border border-admin-border/10">
                  <span className="text-xs font-black text-white">{trigger.name}</span>
                  <span className={`text-[10px] font-black uppercase text-${trigger.color === 'admin-primary' ? 'admin-primary' : trigger.color + '-500'}`}>
                    {trigger.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="clay-card-admin p-8">
            <h3 className="text-[10px] font-black text-admin-text-muted uppercase tracking-[0.2em] mb-8">Intelligence Map</h3>
            <div className="space-y-6">
              {[
                { l: 'Vision Accuracy', v: 99, c: 'admin-primary' },
                { l: 'Context Engine', v: 84, c: 'blue-400' },
                { l: 'Recipe Synthesis', v: 72, c: 'amber-400' },
              ].map((metric, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                    <span className="text-white">{metric.l}</span>
                    <span className={`text-${metric.c}`}>{metric.v}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-admin-bg-dark rounded-full overflow-hidden">
                    <div className={`h-full bg-${metric.c === 'admin-primary' ? 'admin-primary' : metric.c}`} style={{ width: `${metric.v}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
