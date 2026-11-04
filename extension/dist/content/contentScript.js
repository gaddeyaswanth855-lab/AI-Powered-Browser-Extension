var Y=Object.defineProperty;var J=(t,s,n)=>s in t?Y(t,s,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[s]=n;var C=(t,s,n)=>J(t,typeof s!="symbol"?s+"":s,n);import{e as K}from"../assets/heuristics-CFOxF7Pe.js";import{j as e,H as V,c as U,r as S}from"../assets/HeuristicBadge-DBKoJY92.js";function Q(){const t=window.location.hostname.toLowerCase();window.location.origin.toLowerCase();const s=[],n=new Set;document.querySelectorAll("form").forEach(r=>{const i=r.getAttribute("action")||"";let p=t,y=!1;if(i)try{const g=new URL(i,window.location.href);p=g.hostname.toLowerCase(),p!==t&&!p.endsWith(`.${t}`)&&(y=!0,n.add(g.origin))}catch{(i.startsWith("javascript:")||i.startsWith("data:"))&&(y=!0,n.add(i.substring(0,30)))}const w=r.querySelectorAll("input"),m=[];let A=!1;w.forEach(g=>{var P;const E=(g.getAttribute("type")||"text").toLowerCase(),L=(g.getAttribute("name")||g.getAttribute("id")||"").substring(0,50);L&&m.push(L),(E==="password"||L.toLowerCase().includes("pass")||(P=g.getAttribute("autocomplete"))!=null&&P.includes("password"))&&(A=!0)}),s.push({action:i,method:(r.getAttribute("method")||"GET").toUpperCase(),targetDomain:p,isCrossDomain:y,hasPasswordField:A,inputNames:m})});let a=s.some(r=>r.hasPasswordField);if(a||document.querySelectorAll('input[type="password"]').length>0&&(a=!0),!a){const r=document.querySelectorAll("*");for(const i of Array.from(r))if(i.shadowRoot&&i.shadowRoot.querySelectorAll('input[type="password"]').length>0){a=!0;break}}let l=!1;const d=document.querySelectorAll("iframe"),u=window.innerWidth||document.documentElement.clientWidth,c=window.innerHeight||document.documentElement.clientHeight;d.forEach(r=>{try{const i=r.getBoundingClientRect(),p=i.width/u*100,y=i.height/c*100,w=r.getAttribute("src")||"";p>=75&&y>=75&&w&&!w.startsWith("/")&&!w.includes(t)&&(l=!0)}catch{}});const x=[],h=["header img","nav img",'img[src*="logo" i]','img[alt*="logo" i]','img[class*="logo" i]','img[id*="logo" i]',".logo img","#logo img",'a[class*="brand" i] img','a[class*="logo" i] img'];return document.querySelectorAll(h.join(", ")).forEach(r=>{const i=r.currentSrc||r.src;i&&(i.startsWith("http")||i.startsWith("data:image"))&&!x.includes(i)&&x.push(i)}),{forms:s,hasPasswordField:a,externalFormActions:Array.from(n),iframeOverlayDetected:l,candidateLogoUrls:x.slice(0,5)}}class X{constructor(s){C(this,"observer",null);C(this,"loadTimestamp",Date.now());C(this,"debounceTimer",null);C(this,"onTriggerCallback");C(this,"isObserving",!1);this.onTriggerCallback=s}start(){if(this.isObserving||typeof window>"u")return;this.loadTimestamp=Date.now();const s=document.body||document.documentElement;if(!s){window.addEventListener("DOMContentLoaded",()=>this.start(),{once:!0});return}this.observer=new MutationObserver(n=>{var l,d;let o=!1;const a=Date.now()-this.loadTimestamp;for(const u of n){if(u.type==="childList")for(let c=0;c<u.addedNodes.length;c++){const x=u.addedNodes[c];if(x.nodeType===Node.ELEMENT_NODE){const h=x,b=h.tagName.toLowerCase();if(b==="input"&&(h.getAttribute("type")==="password"||(l=h.getAttribute("name"))!=null&&l.includes("pass"))||b==="form"||b==="iframe"||(d=h.querySelector)!=null&&d.call(h,'input[type="password"], form, iframe, img[src*="logo" i], svg[class*="logo" i]')){o=!0;break}}}if(o)break}o&&(this.debounceTimer&&clearTimeout(this.debounceTimer),this.debounceTimer=setTimeout(()=>{const u=a>1e3;this.onTriggerCallback(u)},300))}),this.observer.observe(s,{childList:!0,subtree:!0}),this.isObserving=!0}stop(){this.observer&&(this.observer.disconnect(),this.observer=null),this.debounceTimer&&(clearTimeout(this.debounceTimer),this.debounceTimer=null),this.isObserving=!1}}const Z=({evidence:t,matchedBrand:s,currentHost:n,externalFormActions:o=[],delayedRenderDetected:a=!1})=>e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"14px"},children:[s&&e.jsxs("div",{style:{background:"rgba(239, 68, 68, 0.1)",border:"1px solid rgba(239, 68, 68, 0.3)",borderRadius:"10px",padding:"12px 16px",fontSize:"13px",color:"#fca5a5"},children:[e.jsx("div",{style:{fontWeight:700,marginBottom:"4px",color:"#ef4444"},children:"⚠️ Identity Spoofing Conflict"}),e.jsxs("div",{children:["Asserted Target Brand: ",e.jsx("strong",{children:s})]}),e.jsxs("div",{children:["Current Unverified Host: ",e.jsx("strong",{style:{color:"#ffffff"},children:n})]})]}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"8px"},children:[e.jsx("div",{style:{fontSize:"12px",fontWeight:700,color:"#9ca3af",textTransform:"uppercase",letterSpacing:"0.05em"},children:"Forensic Indicators"}),e.jsx("ul",{style:{listStyleType:"none",padding:0,margin:0,display:"flex",flexDirection:"column",gap:"8px"},children:t.map((l,d)=>e.jsxs("li",{style:{display:"flex",alignItems:"flex-start",gap:"10px",fontSize:"13px",color:"#e5e7eb",lineHeight:"1.4",background:"#1f2937",padding:"10px 14px",borderRadius:"8px",borderLeft:"3px solid #ef4444"},children:[e.jsx("span",{style:{color:"#ef4444",fontWeight:"bold"},children:"•"}),e.jsx("span",{children:l})]},d))})]}),o.length>0&&e.jsxs("div",{style:{fontSize:"12px",color:"#fbbf24",background:"rgba(245, 158, 11, 0.1)",border:"1px solid rgba(245, 158, 11, 0.3)",padding:"10px 14px",borderRadius:"8px"},children:[e.jsx("strong",{children:"Data Exfiltration Route:"})," Submitting credentials to"," ",e.jsx("code",{style:{background:"#374151",padding:"2px 4px",borderRadius:"4px",color:"#fff"},children:o.join(", ")})]}),a&&e.jsxs("div",{style:{fontSize:"12px",color:"#a78bfa",background:"rgba(167, 139, 250, 0.1)",border:"1px solid rgba(167, 139, 250, 0.3)",padding:"10px 14px",borderRadius:"8px"},children:[e.jsx("strong",{children:"Delayed-Render Evasion:"})," Phishing payload injected late via JavaScript to evade automated scanners."]})]}),ee=({onLeaveSite:t,onBypass:s,onOpenAssistant:n,onReport:o,riskLevel:a})=>e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",gap:"12px",flexWrap:"wrap"},children:[e.jsxs("div",{style:{display:"flex",gap:"8px",alignItems:"center"},children:[e.jsx("button",{onClick:t,style:{background:"#dc2626",color:"#ffffff",border:"none",borderRadius:"8px",padding:"10px 18px",fontWeight:700,fontSize:"13.5px",cursor:"pointer",boxShadow:"0 4px 12px rgba(220, 38, 38, 0.4)"},children:"🛡️ Leave Site Immediately"}),e.jsx("button",{onClick:n,style:{background:"#2563eb",color:"#ffffff",border:"none",borderRadius:"8px",padding:"10px 16px",fontWeight:600,fontSize:"13px",cursor:"pointer"},children:"💬 Ask PhishLens Sentinel"})]}),e.jsxs("div",{style:{display:"flex",gap:"10px",alignItems:"center"},children:[e.jsx("button",{onClick:o,style:{background:"transparent",color:"#9ca3af",border:"1px solid #374151",borderRadius:"8px",padding:"8px 12px",fontSize:"12px",cursor:"pointer"},children:"Report Issue"}),e.jsx("button",{onClick:s,style:{background:"transparent",color:"#6b7280",border:"none",fontSize:"12px",cursor:"pointer",textDecoration:"underline"},children:"I accept the risk (Bypass)"})]})]}),te=({score:t,riskLevel:s,matchedBrand:n,currentHost:o,evidence:a,externalFormActions:l=[],delayedRenderDetected:d=!1,userExplanation:u,onLeaveSite:c,onBypass:x,onOpenAssistant:h,onReport:b})=>{const r=s==="HIGH_RISK";return e.jsx("div",{className:"pl-modal-backdrop",children:e.jsxs("div",{className:"pl-modal-card",children:[e.jsxs("div",{className:"pl-modal-header",children:[e.jsx("div",{style:{width:"48px",height:"48px",borderRadius:"12px",backgroundColor:r?"rgba(239, 68, 68, 0.2)":"rgba(245, 158, 11, 0.2)",border:`1px solid ${r?"#ef4444":"#f59e0b"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px"},children:r?"🛑":"⚠️"}),e.jsxs("div",{style:{flex:1},children:[e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"6px"},children:e.jsx("h2",{style:{fontSize:"18px",fontWeight:800,color:"#ffffff"},children:r?"PhishLens: Deceptive Impersonation Intercepted":"PhishLens: Suspicious Brand Replica Flagged"})}),e.jsx(V,{score:t,riskLevel:s})]})]}),e.jsxs("div",{className:"pl-modal-body",children:[u&&e.jsx("div",{style:{fontSize:"14px",color:"#f3f4f6",lineHeight:"1.5",background:"#1f2937",padding:"14px 18px",borderRadius:"10px",borderLeft:`4px solid ${r?"#ef4444":"#f59e0b"}`},children:u}),e.jsx(Z,{evidence:a,matchedBrand:n,currentHost:o,externalFormActions:l,delayedRenderDetected:d})]}),e.jsx("div",{className:"pl-modal-footer",children:e.jsx(ee,{onLeaveSite:c,onBypass:x,onOpenAssistant:h,onReport:b,riskLevel:s})})]})})};let f=null,I=null;function se(t){f&&D(),f=document.createElement("phishlens-modal-root"),f.style.position="fixed",f.style.zIndex="2147483647",f.style.top="0",f.style.left="0",f.style.width="100vw",f.style.height="100vh",f.style.pointerEvents="auto";const s=f.attachShadow({mode:"closed"}),n=document.createElement("style");n.textContent=t.cssText,s.appendChild(n);const o=document.createElement("div");s.appendChild(o),document.documentElement.appendChild(f),I=U.createRoot(o),I.render(e.jsx(te,{score:t.score,riskLevel:t.riskLevel,matchedBrand:t.matchedBrand,currentHost:t.currentHost,evidence:t.evidence,externalFormActions:t.externalFormActions,delayedRenderDetected:t.delayedRenderDetected,userExplanation:t.userExplanation,onLeaveSite:t.onLeaveSite,onBypass:()=>{D(),t.onBypass()},onOpenAssistant:()=>{D(),t.onOpenAssistant()},onReport:t.onReport}))}function D(){if(I){try{I.unmount()}catch{}I=null}f&&f.parentNode&&(f.parentNode.removeChild(f),f=null)}const ne=({onClick:t,isOpen:s,riskLevel:n})=>{if(s)return null;let o="#3b82f6",a="#60a5fa";return n==="HIGH_RISK"?(o="#ef4444",a="#f87171"):n==="SUSPICIOUS"&&(o="#f59e0b",a="#fbbf24"),e.jsxs("button",{onClick:t,className:"pl-assistant-pill",style:{borderColor:o},title:"Open PhishLens Sentinel Security Assistant",children:[e.jsx("span",{style:{width:"8px",height:"8px",borderRadius:"50%",backgroundColor:a,display:"inline-block"}}),e.jsx("span",{children:"PhishLens Sentinel"})]})},oe=({isOpen:t,onClose:s,telemetryContext:n,backendUrl:o="http://localhost:5000"})=>{const[a,l]=S.useState([]),[d,u]=S.useState(""),[c,x]=S.useState(!1),[h]=S.useState(()=>"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,i=>{const p=Math.random()*16|0;return(i==="x"?p:p&3|8).toString(16)})),b=S.useRef(null);S.useEffect(()=>{if(a.length===0){const i=n.matchedBrand||"the purported brand",p=n.riskLevel,y=p==="HIGH_RISK"?`⚠️ **Warning:** I am PhishLens Sentinel. This page has been flagged as a **critical phishing risk** mimicking **${i}**. Do NOT enter any credentials. How can I assist you with securing your accounts?`:p==="SUSPICIOUS"?"🔍 **Notice:** I am PhishLens Sentinel. This site has unusual characteristics that may indicate an impersonation attempt. What questions do you have about this page?":"🛡️ **PhishLens Sentinel Active:** No significant security threats are detected on this page. Feel free to ask if you suspect any links or forms.";l([{id:"welcome",role:"assistant",content:y}])}},[n]),S.useEffect(()=>{var i;(i=b.current)==null||i.scrollIntoView({behavior:"smooth"})},[a,c]);const r=async i=>{const p=i.trim();if(!p||c)return;const y="user-"+Date.now(),w="assistant-"+Date.now();l(m=>[...m,{id:y,role:"user",content:p}]),u(""),x(!0),l(m=>[...m,{id:w,role:"assistant",content:""}]);try{const m=await fetch(`${o}/api/v1/assistant/chat`,{method:"POST",headers:{"Content-Type":"application/json",Accept:"text/event-stream"},body:JSON.stringify({sessionId:h,message:p,telemetryContext:n})});if(!m.ok||!m.body)throw new Error(`HTTP error ${m.status}`);const A=m.body.getReader(),g=new TextDecoder("utf-8");let E="";for(;;){const{value:L,done:P}=await A.read();if(P)break;const G=g.decode(L,{stream:!0}).split(`
`);for(const $ of G){const H=$.trim();if(H.startsWith("data:")){const B=H.substring(5).trim();if(B==="[DONE]")break;try{const R=JSON.parse(B);R.text?(E+=R.text,l(O=>O.map(k=>k.id===w?{...k,content:E}:k))):R.error&&(E+=`

*(Error: ${R.error})*`,l(O=>O.map(k=>k.id===w?{...k,content:E}:k)))}catch{}}}}}catch(m){console.warn("[AssistantDrawer] Streaming network error:",m),l(A=>A.map(g=>g.id===w?{...g,content:"PhishLens Sentinel encountered a network issue communicating with the telemetry server. If you entered passwords on this page, immediately navigate to the official website and reset your credentials."}:g))}finally{x(!1)}};return t?e.jsxs("div",{className:"pl-drawer-container",children:[e.jsxs("div",{className:"pl-drawer-header",children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"10px"},children:[e.jsx("div",{style:{width:"10px",height:"10px",borderRadius:"50%",backgroundColor:"#3b82f6",boxShadow:"0 0 10px #3b82f6"}}),e.jsxs("div",{children:[e.jsx("div",{style:{fontWeight:700,fontSize:"14px",color:"#f8fafc"},children:"PhishLens Sentinel"}),e.jsx("div",{style:{fontSize:"11px",color:"#94a3b8"},children:"Real-Time Conversational Security Analyst"})]})]}),e.jsx("button",{onClick:s,style:{background:"transparent",border:"none",color:"#94a3b8",fontSize:"18px",cursor:"pointer",padding:"4px 8px",borderRadius:"6px"},title:"Close Assistant",children:"✕"})]}),e.jsxs("div",{className:"pl-drawer-messages",children:[a.map(i=>e.jsx("div",{className:`pl-msg-bubble ${i.role==="user"?"pl-msg-user":"pl-msg-assistant"}`,children:e.jsx("div",{style:{whiteSpace:"pre-wrap"},children:i.content})},i.id)),c&&e.jsx("div",{style:{alignSelf:"flex-start",color:"#94a3b8",fontSize:"12px",fontStyle:"italic"},children:"Sentinel is analyzing threat context..."}),e.jsx("div",{ref:b})]}),e.jsxs("div",{className:"pl-quick-chips",children:[e.jsx("button",{className:"pl-chip-btn",onClick:()=>r("Why is this page flagged?"),disabled:c,children:"Why is this flagged?"}),e.jsx("button",{className:"pl-chip-btn",onClick:()=>r("Is it safe if I only browse without logging in?"),disabled:c,children:"Can I safely browse?"}),e.jsx("button",{className:"pl-chip-btn",onClick:()=>r("I already submitted my password—what should I do now?"),disabled:c,children:"🚨 Entered my password!"})]}),e.jsxs("form",{className:"pl-drawer-input-row",onSubmit:i=>{i.preventDefault(),r(d)},children:[e.jsx("input",{type:"text",className:"pl-chat-input",placeholder:"Ask Sentinel about this page...",value:d,onChange:i=>u(i.target.value),disabled:c}),e.jsx("button",{type:"submit",className:"pl-send-btn",disabled:c||!d.trim(),children:"Send"})]})]}):null};let v=null,W=null,T=null;const ie=({telemetryContext:t,backendUrl:s,initialOpen:n=!1})=>{const[o,a]=S.useState(n);return T=a,e.jsxs(e.Fragment,{children:[e.jsx(ne,{onClick:()=>a(!0),isOpen:o,riskLevel:t.riskLevel}),e.jsx(oe,{isOpen:o,onClose:()=>a(!1),telemetryContext:t,backendUrl:s})]})};function re(t){if(v){t.initialOpen&&T&&T(!0);return}v=document.createElement("phishlens-assistant-root"),v.style.position="fixed",v.style.zIndex="2147483646",v.style.bottom="0",v.style.right="0",v.style.pointerEvents="auto";const s=v.attachShadow({mode:"closed"}),n=document.createElement("style");n.textContent=t.cssText,s.appendChild(n);const o=document.createElement("div");s.appendChild(o),document.documentElement.appendChild(v),W=U.createRoot(o),W.render(e.jsx(ie,{telemetryContext:t.telemetryContext,backendUrl:t.backendUrl,initialOpen:t.initialOpen}))}function _(){T&&T(!0)}const M=`
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
`,N="http://localhost:5000";let F=null,j=!1,q=null;function ae(){document.querySelectorAll("form").forEach(n=>{n.addEventListener("submit",o=>{j||(o.preventDefault(),o.stopPropagation(),alert("🛡️ PhishLens Protection: Form submission blocked on this unverified or spoofed website."))},!0)}),document.querySelectorAll("input").forEach(n=>{n.setAttribute("autocomplete","off")})}async function z(t=!1){const s=window.location.href,n=window.location.hostname.toLowerCase();if(s.startsWith("chrome://")||s.startsWith("chrome-extension://")||s.startsWith("about:"))return;const o=Q();let a=null;if(o.candidateLogoUrls.length>0)try{const r=await new Promise(i=>{chrome.runtime.sendMessage({type:"COMPUTE_PHASH",payload:{imageUrl:o.candidateLogoUrls[0]}},p=>i(p)),setTimeout(()=>i(null),300)});r&&r.phash&&(a=r.phash)}catch{}const l=K({domain:n,externalFormActions:o.externalFormActions,hasPasswordField:o.hasPasswordField,computedPHash:a,delayedRenderDetected:t,iframeOverlayDetected:o.iframeOverlayDetected});let d=null;if(l.score>=35&&!j)try{const r=await fetch(`${N}/api/v1/telemetry/evaluate`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:s,domain:n,matchedBrand:l.matchedBrand,hammingDistance:l.hammingDistance,forms:o.forms,hasPasswordField:o.hasPasswordField,externalFormActions:o.externalFormActions,delayedRenderDetected:t,clientHeuristicScore:l.score,viewportPHash:a||void 0})});r.ok&&(d=await r.json())}catch(r){console.warn("[PhishLens] Telemetry backend offline or unreachable:",r)}const u=d?d.riskScore:l.score,c=d?d.verdict:l.riskLevel,x=d?d.primaryEvidence:l.evidence,h=d==null?void 0:d.userExplanation;F={url:s,domain:n,riskScore:u,riskLevel:c,matchedBrand:l.matchedBrand,hammingDistance:l.hammingDistance,delayedRenderDetected:t,externalFormActions:o.externalFormActions,forms:o.forms,hasPasswordField:o.hasPasswordField,evaluatedAt:new Date().toISOString(),bypassed:j,incidentResponse:d},chrome.runtime.sendMessage({type:"PAGE_EVALUATED",payload:F});const b={url:s,domain:n,matchedBrand:l.matchedBrand,riskScore:u,riskLevel:c,externalFormActions:o.externalFormActions,delayedRenderDetected:t};re({telemetryContext:b,backendUrl:N,cssText:M,initialOpen:!1}),c!=="SAFE"&&!j&&(ae(),se({score:u,riskLevel:c,matchedBrand:l.matchedBrand,currentHost:n,evidence:x,externalFormActions:o.externalFormActions,delayedRenderDetected:t,userExplanation:h,cssText:M,onLeaveSite:()=>{window.location.href="about:blank"},onBypass:()=>{j=!0,D(),chrome.runtime.sendMessage({type:"BYPASS_PAGE"})},onOpenAssistant:()=>{_()},onReport:async()=>{try{await fetch(`${N}/api/v1/telemetry/report`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({incidentId:d==null?void 0:d.incidentId,url:s,userVerdict:"FALSE_POSITIVE",userComments:"Submitted via Modal Shield"})}),alert("Report logged successfully. Our threat analysis team will review this site.")}catch{alert("Unable to submit report to backend.")}}}))}chrome.runtime.onMessage.addListener((t,s,n)=>{if(t.type==="GET_PAGE_STATUS"){n(F);return}if(t.type==="TOGGLE_ASSISTANT"){_(),n({success:!0});return}if(t.type==="BYPASS_PAGE"){j=!0,D(),n({success:!0});return}});document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{z(!1)}):z(!1);q=new X(t=>{j||(console.log("[PhishLens] DOM mutation observed. Re-evaluating page (delayed:",t,")"),z(t))});q.start();
