import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
export const AssistantDrawer = ({ isOpen, onClose, telemetryContext, backendUrl = 'http://localhost:5000', }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [sessionId] = useState(() => {
        // Generate UUID v4 for the session
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = (Math.random() * 16) | 0;
            const v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    });
    const messagesEndRef = useRef(null);
    // Initial welcome greeting
    useEffect(() => {
        if (messages.length === 0) {
            const brand = telemetryContext.matchedBrand || 'the purported brand';
            const risk = telemetryContext.riskLevel;
            const greeting = risk === 'HIGH_RISK'
                ? `⚠️ **Warning:** I am PhishLens Sentinel. This page has been flagged as a **critical phishing risk** mimicking **${brand}**. Do NOT enter any credentials. How can I assist you with securing your accounts?`
                : risk === 'SUSPICIOUS'
                    ? `🔍 **Notice:** I am PhishLens Sentinel. This site has unusual characteristics that may indicate an impersonation attempt. What questions do you have about this page?`
                    : `🛡️ **PhishLens Sentinel Active:** No significant security threats are detected on this page. Feel free to ask if you suspect any links or forms.`;
            setMessages([
                {
                    id: 'welcome',
                    role: 'assistant',
                    content: greeting,
                },
            ]);
        }
    }, [telemetryContext]);
    // Auto-scroll on new tokens
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isStreaming]);
    const handleSendMessage = async (textToSend) => {
        const text = textToSend.trim();
        if (!text || isStreaming)
            return;
        const userMsgId = 'user-' + Date.now();
        const assistantMsgId = 'assistant-' + Date.now();
        setMessages((prev) => [...prev, { id: userMsgId, role: 'user', content: text }]);
        setInput('');
        setIsStreaming(true);
        // Placeholder for streaming assistant response
        setMessages((prev) => [...prev, { id: assistantMsgId, role: 'assistant', content: '' }]);
        try {
            const response = await fetch(`${backendUrl}/api/v1/assistant/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'text/event-stream',
                },
                body: JSON.stringify({
                    sessionId,
                    message: text,
                    telemetryContext,
                }),
            });
            if (!response.ok || !response.body) {
                throw new Error(`HTTP error ${response.status}`);
            }
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let partialAssistantText = '';
            while (true) {
                const { value, done } = await reader.read();
                if (done)
                    break;
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n');
                for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed.startsWith('data:')) {
                        const dataContent = trimmed.substring(5).trim();
                        if (dataContent === '[DONE]') {
                            break;
                        }
                        try {
                            const parsed = JSON.parse(dataContent);
                            if (parsed.text) {
                                partialAssistantText += parsed.text;
                                setMessages((prev) => prev.map((m) => (m.id === assistantMsgId ? { ...m, content: partialAssistantText } : m)));
                            }
                            else if (parsed.error) {
                                partialAssistantText += `\n\n*(Error: ${parsed.error})*`;
                                setMessages((prev) => prev.map((m) => (m.id === assistantMsgId ? { ...m, content: partialAssistantText } : m)));
                            }
                        }
                        catch {
                            // Ignore partial JSON chunks
                        }
                    }
                }
            }
        }
        catch (err) {
            console.warn('[AssistantDrawer] Streaming network error:', err);
            setMessages((prev) => prev.map((m) => m.id === assistantMsgId
                ? {
                    ...m,
                    content: 'PhishLens Sentinel encountered a network issue communicating with the telemetry server. If you entered passwords on this page, immediately navigate to the official website and reset your credentials.',
                }
                : m));
        }
        finally {
            setIsStreaming(false);
        }
    };
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "pl-drawer-container", children: [_jsxs("div", { className: "pl-drawer-header", children: [_jsxs("div", { style: { display: 'flex', alignItems: 'center', gap: '10px' }, children: [_jsx("div", { style: {
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '50%',
                                    backgroundColor: '#3b82f6',
                                    boxShadow: '0 0 10px #3b82f6',
                                } }), _jsxs("div", { children: [_jsx("div", { style: { fontWeight: 700, fontSize: '14px', color: '#f8fafc' }, children: "PhishLens Sentinel" }), _jsx("div", { style: { fontSize: '11px', color: '#94a3b8' }, children: "Real-Time Conversational Security Analyst" })] })] }), _jsx("button", { onClick: onClose, style: {
                            background: 'transparent',
                            border: 'none',
                            color: '#94a3b8',
                            fontSize: '18px',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '6px',
                        }, title: "Close Assistant", children: "\u2715" })] }), _jsxs("div", { className: "pl-drawer-messages", children: [messages.map((msg) => (_jsx("div", { className: `pl-msg-bubble ${msg.role === 'user' ? 'pl-msg-user' : 'pl-msg-assistant'}`, children: _jsx("div", { style: { whiteSpace: 'pre-wrap' }, children: msg.content }) }, msg.id))), isStreaming && (_jsx("div", { style: { alignSelf: 'flex-start', color: '#94a3b8', fontSize: '12px', fontStyle: 'italic' }, children: "Sentinel is analyzing threat context..." })), _jsx("div", { ref: messagesEndRef })] }), _jsxs("div", { className: "pl-quick-chips", children: [_jsx("button", { className: "pl-chip-btn", onClick: () => handleSendMessage('Why is this page flagged?'), disabled: isStreaming, children: "Why is this flagged?" }), _jsx("button", { className: "pl-chip-btn", onClick: () => handleSendMessage('Is it safe if I only browse without logging in?'), disabled: isStreaming, children: "Can I safely browse?" }), _jsx("button", { className: "pl-chip-btn", onClick: () => handleSendMessage('I already submitted my password—what should I do now?'), disabled: isStreaming, children: "\uD83D\uDEA8 Entered my password!" })] }), _jsxs("form", { className: "pl-drawer-input-row", onSubmit: (e) => {
                    e.preventDefault();
                    handleSendMessage(input);
                }, children: [_jsx("input", { type: "text", className: "pl-chat-input", placeholder: "Ask Sentinel about this page...", value: input, onChange: (e) => setInput(e.target.value), disabled: isStreaming }), _jsx("button", { type: "submit", className: "pl-send-btn", disabled: isStreaming || !input.trim(), children: "Send" })] })] }));
};
