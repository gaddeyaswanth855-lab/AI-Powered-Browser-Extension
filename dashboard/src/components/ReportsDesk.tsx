import React from 'react';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface ReportsDeskProps {
  reports: any[];
  onRefresh: () => void;
}

export const ReportsDesk: React.FC<ReportsDeskProps> = ({ reports }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white">Client False-Positive & Dispute Triage Desk</h3>
          <p className="text-xs text-slate-400 mt-0.5">User-submitted feedback from in-browser Warning Shield</p>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          {reports.length} total submissions
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/70 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Verdict Type</th>
              <th className="py-3 px-4">Reported URL</th>
              <th className="py-3 px-4">User Comments</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Submitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-500">
                  No pending user reports in the triage queue.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        report.user_verdict === 'FALSE_POSITIVE'
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {report.user_verdict}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-xs text-blue-400 max-w-sm truncate">
                    {report.submitted_url}
                  </td>

                  <td className="py-3.5 px-4 text-xs text-slate-300 max-w-md truncate">
                    {report.user_comments || 'No comment attached'}
                  </td>

                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-xs font-mono">
                      {report.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-500 whitespace-nowrap">
                    {new Date(report.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

