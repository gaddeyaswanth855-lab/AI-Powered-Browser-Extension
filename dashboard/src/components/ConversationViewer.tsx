import React from 'react';
import { MessageSquare, Shield, User } from 'lucide-react';

interface ConversationViewerProps {
  messages: Array<{
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    created_at: string;
  }>;
}

export const ConversationViewer: React.FC<ConversationViewerProps> = ({ messages }) => {
  if (messages.length === 0) {
    return (
      <div className="py-16 text-center text-slate-500 font-mono text-xs">
        <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-600" />
        No interactive chat sessions were initiated by the user during this incident.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400">
        <span>Sentinel In-Page Interaction Transcript</span>
        <span className="font-mono text-slate-500">Zero-PII Compliance Verified</span>
      </div>

      <div className="space-y-3">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`p-4 rounded-xl border flex gap-3 ${
                isUser
                  ? 'bg-blue-600/10 border-blue-500/30 text-blue-100 ml-8'
                  : 'bg-slate-950 border-slate-800 text-slate-200 mr-8'
              }`}
            >
              <div className="mt-0.5">
                {isUser ? (
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                    <User className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="p-1.5 rounded-lg bg-slate-800 text-blue-400 border border-slate-700">
                    <Shield className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold">{isUser ? 'Client User' : 'PhishLens Sentinel AI'}</span>
                  <span className="font-mono">{new Date(msg.created_at).toLocaleTimeString()}</span>
                </div>
                <div className="text-xs whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

