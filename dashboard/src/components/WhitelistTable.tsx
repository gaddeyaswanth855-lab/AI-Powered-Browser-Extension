import React, { useState } from 'react';
import { addWhitelistDomain } from '../lib/api';
import { ShieldCheck, Plus, Search } from 'lucide-react';

interface WhitelistTableProps {
  whitelist: any[];
  onRefresh: () => void;
}

export const WhitelistTable: React.FC<WhitelistTableProps> = ({ whitelist, onRefresh }) => {
  const [domain, setDomain] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = whitelist.filter((item) =>
    item.domain.toLowerCase().includes(search.toLowerCase()) ||
    (item.reason && item.reason.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setSubmitting(true);
    try {
      await addWhitelistDomain(domain.trim(), reason.trim() || undefined);
      setDomain('');
      setReason('');
      onRefresh();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Add Form */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Add Global Whitelist Override</span>
        </h3>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="Domain (e.g. internal.corp.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
          />
          <input
            type="text"
            placeholder="Operational Reason / Ticket ID"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Add Whitelist</span>
          </button>
        </form>
      </div>

      {/* Whitelist Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search whitelisted domains..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {filtered.length} domains whitelisted
          </div>
        </div>

        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/70 text-xs uppercase font-semibold text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Domain</th>
              <th className="py-3 px-4">Reason / Notes</th>
              <th className="py-3 px-4">Scope</th>
              <th className="py-3 px-4 text-right">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((item) => (
              <tr key={item.id || item.domain} className="hover:bg-slate-800/40">
                <td className="py-3.5 px-4 font-mono text-xs font-semibold text-emerald-400">
                  {item.domain}
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-300">
                  {item.reason || 'Manual administrative exemption'}
                </td>
                <td className="py-3.5 px-4 text-xs">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                    {item.is_global ? 'GLOBAL' : 'TENANT'}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono text-xs text-slate-500">
                  {new Date(item.created_at || Date.now()).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

