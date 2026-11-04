import React, { useEffect, useState } from 'react';
import { fetchThreatDetail } from '../lib/api';
import { ConversationViewer } from './ConversationViewer';
import { ShieldAlert, AlertTriangle, ShieldCheck, X, Globe, Lock, Cpu, Terminal } from 'lucide-react';

interface ForensicModalProps {
  threatId: string | null;
  onClose: () => void;
}

export const ForensicModal: React.FC<ForensicModalProps> = ({ threatId, onClose }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'forensics' | 'dom' | 'chat'>('forensics');

  useEffect(() => {
    if (!threatId) return;
    setLoading(true);
    fetchThreatDetail(threatId)
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Forensic fetch error:', err);
        setLoading(false);
      });
  }, [threatId]);

  if (!threatId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Forensic Threat Inspection</span>
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {threatId.slice(0, 8)}...
                </span>
              </h3>
              <div className="text-xs text-slate-400 font-mono mt-0.5 truncate max-w-lg">
                {data?.threat?.detected_url || 'Inspecting telemetry...'}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6">
          <button
            onClick={() => setActiveTab('forensics')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition ${
              activeTab === 'forensics'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Forensic Evidence
          </button>
          <button
            onClick={() => setActiveTab('dom')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition ${
              activeTab === 'dom'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            DOM & Structural Telemetry
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'chat'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Sentinel Chat Audit</span>
            {data?.chatMessages?.length > 0 && (
              <span className="px-1.5 py-0.2 bg-blue-500/20 text-blue-300 rounded-full text-[10px]">
                {data.chatMessages.length}
              </span>
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="py-20 text-center text-slate-400 font-mono text-sm">
              Synthesizing forensic indicators and neural analysis...
            </div>
          ) : !data || !data.threat ? (
            <div className="py-20 text-center text-red-400">
              Failed to load threat details.
            </div>
          ) : (
            <>
              {activeTab === 'forensics' && (
                <div className="space-y-6">
                  {/* Score & Impersonation Callout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="text-xs text-slate-400 font-semibold uppercase">Risk Score Verdict</div>
                      <div className="text-3xl font-black mt-2 text-red-400 flex items-center gap-2">
                        <span>{data.threat.risk_score} / 100</span>
                        <span className="text-xs px-2 py-1 rounded bg-red-500/20 border border-red-500/40 uppercase">
                          {data.threat.risk_level}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-2">
                        Confidence derived from multi-signal DOM and visual pHash correlation.
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="text-xs text-slate-400 font-semibold uppercase">Identified Brand Impersonated</div>
                      <div className="text-2xl font-bold mt-2 text-white">
                        {data.matchedBrand?.brand_name || data.threat.ai_forensic_analysis?.brandImpersonated || 'Brand Visual Mimic'}
                      </div>
                      <div className="text-xs text-slate-400 mt-2 font-mono">
                        Host mismatch: <span className="text-red-300">{data.threat.normalized_domain}</span>
                      </div>
                    </div>
                  </div>

                  {/* Neural Forensic Explanation */}
                  <div className="p-5 rounded-xl bg-blue-950/20 border border-blue-500/30 space-y-3">
                    <div className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      <span>Gemini 2.5 Flash Neural Forensic Analysis</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">
                      {data.threat.ai_forensic_analysis?.userExplanation ||
                        'Visual and structural characteristics exhibit unauthorized identity appropriation.'}
                    </p>
                  </div>

                  {/* Primary Evidence List */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Primary Evidence Chain
                    </h4>
                    <div className="space-y-2">
                      {data.threat.ai_forensic_analysis?.primaryEvidence?.map((ev: string, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300"
                        >
                          <span className="text-red-400 font-bold">•</span>
                          <span>{ev}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'dom' && (
                <div className="space-y-6">
                  {/* Form Actions Audit */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span>Forms & Data Routing Destination</span>
                    </div>

                    {data.threat.dom_telemetry?.externalFormActions?.length > 0 ? (
                      <div className="space-y-2">
                        <div className="text-xs text-red-400 font-medium">
                          Cross-origin data routing detected:
                        </div>
                        {data.threat.dom_telemetry.externalFormActions.map((act: string, idx: number) => (
                          <div key={idx} className="p-2 bg-red-950/30 border border-red-800/50 rounded font-mono text-xs text-red-300">
                            {act}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400">
                        No cross-domain form routing detected.
                      </div>
                    )}
                  </div>

                  {/* Raw DOM Telemetry JSON */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Harvested DOM Telemetry (Zero-PII)
                    </div>
                    <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto max-h-64">
                      {JSON.stringify(data.threat.dom_telemetry, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === 'chat' && (
                <ConversationViewer messages={data.chatMessages || []} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

