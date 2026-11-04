export const SHADOW_STYLES = `
:host {
  all: initial;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color-scheme: dark;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.pl-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2147483647;
  background: rgba(10, 14, 23, 0.94);
  backdrop-filter: blur(16px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  animation: plFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.pl-modal-card {
  width: 100%;
  max-width: 640px;
  background: #111827;
  border: 1px solid #374151;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.pl-modal-header {
  padding: 24px;
  border-bottom: 1px solid #1f2937;
  display: flex;
  align-items: center;
  gap: 16px;
}

.pl-modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.pl-modal-footer {
  padding: 16px 24px;
  background: #0b0f19;
  border-top: 1px solid #1f2937;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.pl-assistant-pill {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 2147483646;
  background: linear-gradient(135deg, #1e3a8a, #3b82f6);
  color: #ffffff;
  padding: 10px 18px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.5);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.pl-assistant-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px -5px rgba(59, 130, 246, 0.6);
}

.pl-drawer-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 420px;
  height: 600px;
  max-height: calc(100vh - 48px);
  z-index: 2147483647;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: plSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.pl-drawer-header {
  padding: 16px 20px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.pl-drawer-messages {
  flex: 1;
  padding: 16px 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.pl-msg-bubble {
  max-width: 88%;
  padding: 12px 16px;
  border-radius: 14px;
  font-size: 13.5px;
  line-height: 1.5;
  word-break: break-word;
}

.pl-msg-user {
  align-self: flex-end;
  background: #2563eb;
  color: #ffffff;
  border-bottom-right-radius: 4px;
}

.pl-msg-assistant {
  align-self: flex-start;
  background: #1e293b;
  color: #e2e8f0;
  border: 1px solid #334155;
  border-bottom-left-radius: 4px;
}

.pl-quick-chips {
  padding: 10px 16px;
  display: flex;
  gap: 8px;
  overflow-x: auto;
  background: #0b0f19;
  border-top: 1px solid #1e293b;
  scrollbar-width: none;
}

.pl-chip-btn {
  background: #1e293b;
  color: #93c5fd;
  border: 1px solid #3b82f6;
  border-radius: 12px;
  padding: 6px 12px;
  font-size: 11.5px;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s;
}

.pl-chip-btn:hover {
  background: #2563eb;
  color: #ffffff;
}

.pl-drawer-input-row {
  padding: 12px 16px;
  background: #0f172a;
  border-top: 1px solid #334155;
  display: flex;
  gap: 10px;
}

.pl-chat-input {
  flex: 1;
  background: #1e293b;
  border: 1px solid #475569;
  border-radius: 10px;
  padding: 10px 14px;
  color: #f8fafc;
  font-size: 13px;
  outline: none;
}

.pl-chat-input:focus {
  border-color: #3b82f6;
}

.pl-send-btn {
  background: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 0 16px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
}

.pl-send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes plFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes plSlideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
`;
