import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { MessageSquare, Shield, User } from 'lucide-react';
export const ConversationViewer = ({ messages }) => {
    if (messages.length === 0) {
        return (_jsxs("div", { className: "py-16 text-center text-slate-500 font-mono text-xs", children: [_jsx(MessageSquare, { className: "w-8 h-8 mx-auto mb-2 text-slate-600" }), "No interactive chat sessions were initiated by the user during this incident."] }));
    }
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-400", children: [_jsx("span", { children: "Sentinel In-Page Interaction Transcript" }), _jsx("span", { className: "font-mono text-slate-500", children: "Zero-PII Compliance Verified" })] }), _jsx("div", { className: "space-y-3", children: messages.map((msg) => {
                    const isUser = msg.role === 'user';
                    return (_jsxs("div", { className: `p-4 rounded-xl border flex gap-3 ${isUser
                            ? 'bg-blue-600/10 border-blue-500/30 text-blue-100 ml-8'
                            : 'bg-slate-950 border-slate-800 text-slate-200 mr-8'}`, children: [_jsx("div", { className: "mt-0.5", children: isUser ? (_jsx("div", { className: "p-1.5 rounded-lg bg-blue-600 text-white", children: _jsx(User, { className: "w-4 h-4" }) })) : (_jsx("div", { className: "p-1.5 rounded-lg bg-slate-800 text-blue-400 border border-slate-700", children: _jsx(Shield, { className: "w-4 h-4" }) })) }), _jsxs("div", { className: "flex-1 space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between text-[11px] text-slate-400", children: [_jsx("span", { className: "font-semibold", children: isUser ? 'Client User' : 'PhishLens Sentinel AI' }), _jsx("span", { className: "font-mono", children: new Date(msg.created_at).toLocaleTimeString() })] }), _jsx("div", { className: "text-xs whitespace-pre-wrap leading-relaxed", children: msg.content })] })] }, msg.id));
                }) })] }));
};
