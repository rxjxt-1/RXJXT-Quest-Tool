/**
 * @name RXJXTQuestDashboard
 * @author RXJXT
 * @description RXJXT Liquid Hub: v15.0.0 Stable Final (Ambient Bento Edition)
 * @version 15.0.0
 * @updateUrl https://raw.githubusercontent.com/rxjxt-1/RXJXT-Quest-Tool/main/RXJXT.plugin.js
 */

module.exports = class RXJXTQuestDashboard {
    start() {
        const _k = ["R", "X", "J", "X", "T"].join("");
        const rxjxtCode = this.start.toString();
        if (this.constructor.name !== `${_k}QuestDashboard` || typeof BdApi === "undefined" || !rxjxtCode.includes("rxjxtEngineRunning")) {
            console.error("%c[ RXJXT SECURITY ] CODE TAMPERING DETECTED! CORRUPTING SYSTEM...", "color: red; font-size: 20px; font-weight: bold;");
            window.rxjxtEngineRunning = "CORRUPTED"; throw new Error("RXJXT_SECURITY_LOCKDOWN");
        }

        if (window.rxjxtEngineRunning === true) return;
        window.rxjxtEngineRunning = true;
        
        window.rxjxtGrindToggle = false; window.rxjxtMode = 'STEALTH'; window.rxjxtVideoApproval = false; window.rxjxtDeafenToggle = false; 
        window.rxjxtCurrentProg = 0; window.rxjxtTotalSeconds = 0; window.rxjxtCurrentSecondsDone = 0; window.rxjxtUpdateAvailable = false;
        console.clear();
        
        const RXJXT_HUB_VER = "15.0.0";
        const RXJXT_REPO_BASE = "https://raw.githubusercontent.com/rxjxt-1/RXJXT-Quest-Tool/main/";
        const RXJXT_HUB_URL = RXJXT_REPO_BASE + "RXJXT.plugin.js";
        const RXJXT_QUEST_URL = RXJXT_REPO_BASE + "QuestEngine.js";
        const RXJXT_DEAFEN_URL = RXJXT_REPO_BASE + "DeafenEngine.js";

        const CUSTOM_LOGO_URL = "https://i.ibb.co/KcS5f6yT/b3e66a70-76a7-455b-8c40-6fccf7dc6193-1.png"; 
        const DEVELOPER_ID = "1262670730865283076"; 

        const rxjxtLog = (app, msg, type = "info") => {
            const colors = { info: "#ffffff", success: "#a8ff78", warn: "#ffc000", error: "#ff416c", brand: "#a8ff78", finish: "#32ADE6" };
            const color = colors[type] || colors.info;
            console.log(`%c[ ${_k} | ${app} ]%c ${msg}`, `color: #000; background: ${color}; font-weight: bold; border-radius: 4px; padding: 2px 6px;`, `color: ${color}; font-weight: 500; padding-left: 5px;`);

            const logBox = document.getElementById(app === 'QUEST' ? 'rxjxt-terminal-quest' : 'rxjxt-terminal-deafen');
            if (logBox) {
                const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
                const logEntry = document.createElement('div'); 
                logEntry.className = "terminal-entry"; 
                logEntry.innerHTML = `<span style="color: rgba(255,255,255,0.3); font-size: 11px; margin-right: 8px;">${time}</span> <span style="color: ${color}; font-weight: 500;">${msg}</span>`;
                logBox.appendChild(logEntry); logBox.scrollTop = logBox.scrollHeight;
            }
        };

        const rxjxtShowToast = (title, message, type = 'info') => {
            const container = document.getElementById('rxjxt-toast-container');
            if (!container) return;
            
            const toast = document.createElement('div');
            toast.className = `bento-toast toast-${type}`;
            
            let icon = type === 'success' ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:14px; height:14px;"><polyline points="20 6 9 17 4 12"></polyline></svg>` : 
                       type === 'error' ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:14px; height:14px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>` : 
                       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:14px; height:14px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

            toast.innerHTML = `<div class="bento-toast-icon">${icon}</div><div class="bento-toast-text"><span>${title}</span>${message}</div>`;
            container.appendChild(toast);
            
            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 600); }, 3500);
        };

        const rxjxtInjectUI = () => {
            if (document.getElementById('rxjxt-overlay')) return;
            const style = document.createElement('style'); style.id = "rxjxt-styles";
            style.innerHTML = `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
                
                :root {
                    --bento-bg: #121214;
                    --bento-card: #1c1c1f;
                    --bento-border: rgba(255, 255, 255, 0.08);
                    
                    /* Background Globals */
                    --theme-color: transparent;
                    --theme-grad: rgba(255,255,255,0.1);
                    --theme-glow: transparent;
                    
                    /* Unique Mode Colors */
                    --quest-color: linear-gradient(90deg, #a8ff78, #78ffd6);
                    --quest-glow: rgba(168, 255, 120, 0.4);
                }

                #rxjxt-overlay { 
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0, 0, 0, 0.75);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    z-index: 9999999;
                    display: flex; justify-content: center; align-items: center;
                    opacity: 0; pointer-events: none;
                    transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    font-family: 'Inter', sans-serif; 
                    color: #fff;
                }
                #rxjxt-overlay.rxjxt-open { opacity: 1; pointer-events: auto; }

                /* Bento Dashboard Grid */
                .bento-dashboard {
                    display: grid;
                    grid-template-columns: 80px 480px;
                    gap: 16px;
                    height: 560px;
                    transform: scale(0.95) translateY(20px);
                    opacity: 0;
                    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
                #rxjxt-overlay.rxjxt-open .bento-dashboard { transform: scale(1) translateY(0); opacity: 1; }

                .bento-card {
                    background: var(--bento-card);
                    border: 1px solid var(--bento-border);
                    border-radius: 28px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.05);
                    position: relative;
                    overflow: hidden;
                }

                /* Sidebar Navigation */
                .bento-sidebar {
                    display: flex; flex-direction: column; align-items: center; justify-content: space-between;
                    padding: 24px 0; gap: 16px;
                }
                .nav-icons { display: flex; flex-direction: column; gap: 12px; }
                .nav-item {
                    width: 48px; height: 48px; border-radius: 24px;
                    display: flex; justify-content: center; align-items: center;
                    color: rgba(255,255,255,0.4); cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    background: transparent;
                }
                .nav-item:hover { color: #fff; background: rgba(255,255,255,0.05); }
                .nav-item.active { 
                    background: var(--bento-border); color: #fff; 
                    box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
                }
                .nav-item svg { width: 22px; height: 22px; transition: 0.4s; }
                .nav-item.active svg { filter: drop-shadow(0 0 10px rgba(255,255,255,0.5)); transform: scale(1.1); }

                /* Main Content Area */
                .bento-main { 
                    padding: 32px; 
                    display: flex; 
                    flex-direction: column; 
                    position: relative; 
                    height: 100%; 
                    box-sizing: border-box; 
                }
                
                /* Ambient Glow */
                .ambient-bg {
                    position: absolute; top: -50px; right: -50px; width: 200px; height: 200px;
                    background: var(--theme-color);
                    filter: blur(100px); opacity: 0.15;
                    border-radius: 50%; z-index: 0; pointer-events: none;
                    transition: background 0.5s ease, opacity 0.5s ease;
                }
                .bento-main > * { z-index: 1; position: relative; }

                /* Header */
                .bento-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
                .bento-title-group { display: flex; flex-direction: column; gap: 4px; }
                .bento-title { font-size: 24px; font-weight: 600; letter-spacing: -0.5px; }
                .bento-subtitle { font-size: 13px; color: rgba(255,255,255,0.4); font-weight: 500; }
                
                /* Close Button */
                .bento-close {
                    width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.05);
                    display: flex; justify-content: center; align-items: center; cursor: pointer;
                    transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid transparent;
                }
                .bento-close:hover { 
                    background: rgba(255, 65, 108, 0.15); border-color: rgba(255, 65, 108, 0.4); 
                    transform: rotate(90deg) scale(1.1); 
                }
                .bento-close:hover svg { color: #ff416c; }
                .bento-close svg { width: 16px; height: 16px; color: rgba(255,255,255,0.6); transition: 0.3s; }

                /* Data Row */
                .bento-data-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                .giant-text { font-size: 56px; font-weight: 600; letter-spacing: -2px; line-height: 1; }
                .giant-text-dim { color: rgba(255,255,255,0.3); font-size: 32px; font-weight: 500; }
                
                .pill-btn {
                    padding: 8px 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 100px; color: #fff; font-size: 13px; font-weight: 500; font-family: 'Inter';
                    cursor: pointer; transition: 0.3s; margin-top: 10px;
                }
                .pill-btn:hover { background: rgba(255,255,255,0.1); }

                /* Decoupled GIANT STATUS ICONS */
                .status-icon-container {
                    width: 64px; height: 64px; display: flex; justify-content: center; align-items: center;
                    border-radius: 50%; background: rgba(255,255,255,0.05); transition: all 0.4s ease;
                }
                .status-icon-container svg { width: 32px; height: 32px; color: rgba(255,255,255,0.3); transition: all 0.4s ease; }
                
                /* Specific Quest Styling */
                #quest-big-icon.active { background: var(--quest-color); box-shadow: 0 0 30px var(--quest-glow); }
                #quest-big-icon.active svg { color: #000; }
                
                /* Specific Deafen Styling */
                #deafen-big-icon.active { background: linear-gradient(90deg, #ff8a00, #ffc000); box-shadow: 0 0 30px rgba(255, 138, 0, 0.5); }
                #deafen-big-icon.active svg { color: #000; }

                /* Progress Bar */
                .mega-progress-container {
                    width: 100%; height: 48px; background: rgba(0,0,0,0.4);
                    border-radius: 100px; position: relative; padding: 4px; box-sizing: border-box;
                    box-shadow: inset 0 2px 10px rgba(0,0,0,0.5), 0 1px 1px rgba(255,255,255,0.05);
                    margin-bottom: 24px; display: flex; align-items: center; overflow: hidden;
                }
                .mega-progress-fill {
                    height: 100%; width: 0%; border-radius: 100px;
                    background: var(--quest-color);
                    box-shadow: 0 0 30px var(--quest-glow), inset 0 2px 4px rgba(255,255,255,0.4);
                    transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1), background 0.5s ease, box-shadow 0.5s ease;
                    position: relative; overflow: hidden; min-width: 2%;
                }
                .mega-progress-fill::after {
                    content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    transform: translateX(-100%); animation: shimmer 2s infinite;
                }
                @keyframes shimmer { 100% { transform: translateX(100%); } }

                .progress-text-overlay {
                    position: absolute; right: 20px; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.6); z-index: 2; mix-blend-mode: difference;
                }

                /* Toggles */
                .bento-toggle-wrapper { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: rgba(0,0,0,0.2); border-radius: 20px; margin-bottom: 20px; }
                .bento-toggle-label { font-size: 15px; font-weight: 500; }
                .bento-toggle { position: relative; width: 56px; height: 32px; cursor: pointer; }
                .bento-toggle input { opacity: 0; width: 0; height: 0; }
                .bento-slider {
                    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(255,255,255,0.1); border-radius: 100px;
                    transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: inset 0 2px 5px rgba(0,0,0,0.3);
                }
                .bento-slider:before {
                    position: absolute; content: ""; height: 24px; width: 24px; left: 4px; bottom: 4px;
                    background: #fff; border-radius: 50%;
                    transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                }
                
                input:checked + .bento-slider:before { transform: translateX(24px); box-shadow: none; }
                
                /* Decoupled Toggle Colors */
                #rxjxt-grind-toggle:checked + .bento-slider { background: var(--quest-color); }
                #rxjxt-deafen-toggle:checked + .bento-slider { background: linear-gradient(90deg, #ff8a00, #ffc000); }

                /* Terminal Area */
                .bento-terminal {
                    background: rgba(0,0,0,0.3); border-radius: 16px; padding: 16px; 
                    height: 170px; flex: none; overflow-y: auto; 
                    font-family: 'SF Mono', Consolas, monospace; font-size: 12px;
                    box-shadow: inset 0 4px 10px rgba(0,0,0,0.3);
                    box-sizing: border-box; margin-bottom: 0;
                }
                .bento-terminal::-webkit-scrollbar { width: 6px; }
                .bento-terminal::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }
                .bento-terminal::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }

                .terminal-entry { animation: slideUpLog 0.3s ease-out; margin-bottom: 8px; }
                @keyframes slideUpLog { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

                /* Views */
                .bento-view { display: none; flex-direction: column; height: 100%; animation: fadeView 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                .bento-view.active { display: flex; }
                @keyframes fadeView { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }

                /* Toasts */
                #rxjxt-toast-container { position: fixed; top: 30px; left: 50%; transform: translateX(-50%); z-index: 999999999; display: flex; flex-direction: column; gap: 12px; align-items: center; pointer-events: none; }
                .bento-toast {
                    background: rgba(20,20,23,0.9); backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.1); border-radius: 100px;
                    padding: 10px 20px 10px 12px; color: #fff; font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 500;
                    display: flex; align-items: center; gap: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 20px var(--theme-glow);
                    transform: translateY(-40px) scale(0.9); opacity: 0; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .bento-toast.show { transform: translateY(0) scale(1); opacity: 1; }
                .bento-toast-icon { width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center; background: rgba(255,255,255,0.1); }
                .toast-success .bento-toast-icon { background: var(--quest-color); color: #000; }
                .toast-error .bento-toast-icon { background: linear-gradient(90deg, #ff4b2b, #ff416c); color: #fff; box-shadow: 0 0 15px rgba(255,65,108,0.5); }
                .bento-toast-text span { display: block; font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

                /* Popup */
                #rxjxt-popup { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); z-index: 200; display: none; justify-content: center; align-items: center; }
                .popup-box { background: var(--bento-card); border: 1px solid var(--bento-border); padding: 30px; border-radius: 28px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.6); width: 320px; }
                .rxjxt-popup-title { font-size: 20px; font-weight: 600; margin-bottom: 10px; } 
                .rxjxt-popup-text { font-size: 14px; color: rgba(255,255,255,0.6); margin-bottom: 24px; }
                .rxjxt-popup-actions { display: flex; gap: 12px; justify-content: center; } 
                .rxjxt-action-btn { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 10px 20px; font-weight: 500; border-radius: 100px; cursor: pointer; transition: 0.3s; }
                .rxjxt-action-btn.primary { background: var(--quest-color); color: #000; border: none; box-shadow: 0 0 15px var(--theme-glow); font-weight: 600; } 
                .rxjxt-action-btn:hover { transform: scale(1.05); }

                /* Toolbar Icon */
                #rxjxt-header-btn { margin-left: 12px !important; margin-right: 8px !important; transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
                #rxjxt-header-ring { width: 36px; height: 36px; border-radius: 12px; display: flex; justify-content: center; align-items: center; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); overflow: hidden; transition: 0.4s; }
                #rxjxt-header-inner { width: 28px; height: 28px; border-radius: 8px; display: flex; justify-content: center; align-items: center; background: #000; overflow: hidden; transition: 0.4s; }
                .rxjxt-custom-logo { width: 100%; height: 100%; object-fit: cover; transition: 0.4s; filter: grayscale(100%); }
                #rxjxt-header-btn:hover { transform: translateY(-2px); }
                #rxjxt-header-btn.rxjxt-pressed #rxjxt-header-ring { border-color: rgba(255,255,255,0.3); }
                #rxjxt-header-btn.rxjxt-pressed #rxjxt-header-inner { transform: scale(0.85); }
            `;
            document.head.appendChild(style);
            document.body.insertAdjacentHTML('beforeend', `<div id="rxjxt-toast-container"></div>`);

            // SVGs
            const shovelSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22v-5l5-5 5 5-5 5z"/><path d="M9.5 14.5L22 2"/></svg>`;
            const hatSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 13h-2.14l-2.7-7.2c-.22-.59-.78-1-1.42-1h-7.5c-.64 0-1.2.41-1.42 1L4.14 13H2v2h20v-2zM9 16c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm6 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
            const closeSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
            const headphoneSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>`;
            const gamepadSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 12h4"/><path d="M8 10v4"/><path d="M15 13h.01"/><path d="M18 11h.01"/></svg>`;

            document.body.insertAdjacentHTML('beforeend', `
                <div id="rxjxt-overlay">
                    <div class="bento-dashboard" id="main-bento-grid">
                        <div id="rxjxt-popup"><div class="popup-box"><div class="rxjxt-popup-title" id="rxjxt-popup-title">Confirm</div><div class="rxjxt-popup-text" id="rxjxt-popup-text">Message</div><div class="rxjxt-popup-actions"><button class="rxjxt-action-btn primary" id="rxjxt-popup-btn-1">Confirm</button><button class="rxjxt-action-btn" id="rxjxt-popup-btn-2" style="display:none;">Cancel</button></div></div></div>

                        <div class="bento-card bento-sidebar">
                            <div class="nav-icons">
                                <div class="nav-item active" data-target="quest">${shovelSVG}</div>
                                <div class="nav-item" data-target="deafen">${hatSVG}</div>
                            </div>
                            <div class="nav-item" id="rxjxt-update-hub" style="display:none; color:#a8ff78;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg></div>
                        </div>

                        <div class="bento-card bento-main">
                            <div class="ambient-bg"></div>
                            
                            <div class="bento-header">
                                <div class="bento-title-group">
                                    <div class="bento-title" id="card-title">Quest Engine</div>
                                    <div class="bento-subtitle" id="rxjxt-current-quest">None Selected</div>
                                </div>
                                <div class="bento-close rxjxt-x-btn">${closeSVG}</div>
                            </div>

                            <!-- Quest View -->
                            <div id="rxjxt-view-quest" class="bento-view active">
                                <div class="bento-data-row">
                                    <div>
                                        <div class="giant-text"><span id="rxjxt-pct">0</span><span class="giant-text-dim">%</span></div>
                                        <button class="pill-btn" id="rxjxt-mode-btn">Stealth Mode</button>
                                    </div>
                                    <div class="status-icon-container" id="quest-big-icon">${gamepadSVG}</div>
                                </div>

                                <div class="mega-progress-container">
                                    <div class="mega-progress-fill" id="rxjxt-bar"></div>
                                    <div class="progress-text-overlay" id="rxjxt-eta">00:00</div>
                                </div>

                                <div class="bento-toggle-wrapper">
                                    <span class="bento-toggle-label">Engine Power</span>
                                    <label class="bento-toggle"><input type="checkbox" id="rxjxt-grind-toggle"><span class="bento-slider"></span></label>
                                </div>

                                <div class="bento-terminal" id="rxjxt-terminal-quest"></div>
                            </div>

                            <!-- Deafen View -->
                            <div id="rxjxt-view-deafen" class="bento-view">
                                <div class="bento-data-row">
                                    <div>
                                        <div class="giant-text" id="rxjxt-deafen-status-text">OFF</div>
                                    </div>
                                    <div class="status-icon-container" id="deafen-big-icon">${headphoneSVG}</div>
                                </div>

                                <div class="bento-toggle-wrapper" style="margin-top: 10px;">
                                    <span class="bento-toggle-label">Spoof Audio State</span>
                                    <label class="bento-toggle"><input type="checkbox" id="rxjxt-deafen-toggle"><span class="bento-slider"></span></label>
                                </div>

                                <div class="bento-terminal" id="rxjxt-terminal-deafen"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `);

            const overlay = document.getElementById('rxjxt-overlay');
            const rootStyle = document.documentElement.style;
            
            // Single Source of Truth for Visual Syncing
            const rxjxtSyncVisuals = () => {
                const activeNav = document.querySelector('.nav-item.active');
                if (!activeNav) return;
                const activeTab = activeNav.dataset.target;
                
                let ambColor = 'transparent', ambGrad = 'transparent', ambGlow = 'transparent';
                
                // Quest Specific Color Calculations
                const qCol = window.rxjxtMode === 'RAGE' ? '#ff416c' : '#a8ff78';
                const qGrad = window.rxjxtMode === 'RAGE' ? 'linear-gradient(90deg, #ff4b2b, #ff416c)' : 'linear-gradient(90deg, #a8ff78, #78ffd6)';
                const qGlow = window.rxjxtMode === 'RAGE' ? 'rgba(255, 65, 108, 0.4)' : 'rgba(168, 255, 120, 0.4)';
                
                rootStyle.setProperty('--quest-color', qGrad);
                rootStyle.setProperty('--quest-glow', qGlow);

                // Set Ambient Glow based strictly on active view
                if (activeTab === 'quest') {
                    if (window.rxjxtGrindToggle) { ambColor = qCol; ambGrad = qGrad; ambGlow = qGlow; }
                } else if (activeTab === 'deafen') {
                    if (window.rxjxtDeafenToggle) { ambColor = '#ff8a00'; ambGrad = 'linear-gradient(90deg, #ff8a00, #ffc000)'; ambGlow = 'rgba(255, 138, 0, 0.5)'; }
                }

                rootStyle.setProperty('--theme-color', ambColor);
                rootStyle.setProperty('--theme-grad', ambGrad);
                rootStyle.setProperty('--theme-glow', ambGlow);

                // Sync Physical Toggles with memory
                const qToggle = document.getElementById('rxjxt-grind-toggle');
                if (qToggle && qToggle.checked !== window.rxjxtGrindToggle) qToggle.checked = window.rxjxtGrindToggle;
                
                const dToggle = document.getElementById('rxjxt-deafen-toggle');
                if (dToggle && dToggle.checked !== window.rxjxtDeafenToggle) dToggle.checked = window.rxjxtDeafenToggle;

                // Sync Icon states
                const questIcon = document.getElementById('quest-big-icon');
                if (questIcon) window.rxjxtGrindToggle ? questIcon.classList.add('active') : questIcon.classList.remove('active');
                
                const deafenIcon = document.getElementById('deafen-big-icon');
                if (deafenIcon) window.rxjxtDeafenToggle ? deafenIcon.classList.add('active') : deafenIcon.classList.remove('active');
            };

            // Tabs
            document.querySelectorAll('.nav-item:not(#rxjxt-update-hub)').forEach(tab => {
                tab.onclick = () => {
                    document.querySelectorAll('.nav-item').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.bento-view').forEach(v => v.classList.remove('active'));
                    tab.classList.add('active');
                    const target = tab.dataset.target;
                    document.getElementById(`rxjxt-view-${target}`).classList.add('active');
                    document.getElementById('card-title').innerText = target === 'quest' ? 'Quest Engine' : 'Fake Deafen';
                    document.getElementById('rxjxt-current-quest').style.display = target === 'quest' ? 'block' : 'none';
                    rxjxtSyncVisuals();
                };
            });

            const closeModal = () => { overlay.classList.remove('rxjxt-open'); let t = document.getElementById('rxjxt-header-btn'); if(t) t.classList.remove('rxjxt-pressed'); };
            document.querySelector('.rxjxt-x-btn').onclick = closeModal;
            overlay.onclick = (e) => { if (e.target.id === 'rxjxt-overlay') closeModal(); };

            const rxjxtLoadEngine = async (url, codeKey, versionKey, name) => {
                let code = BdApi.Data.load("RXJXTHub", codeKey);
                if (!code) {
                    rxjxtLog('HUB', `Installing ${name}...`, "warn");
                    try {
                        let res = await fetch(url + "?t=" + Date.now(), {cache: "no-store"});
                        code = await res.text(); let match = code.match(/@version\s+([0-9.]+)/);
                        BdApi.Data.save("RXJXTHub", codeKey, code); BdApi.Data.save("RXJXTHub", versionKey, match ? match[1] : "1.0.0");
                        rxjxtLog('HUB', `${name} Installed!`, "success");
                        rxjxtShowToast('System Ready', `${name} loaded.`, 'success');
                    } catch (e) { rxjxtLog('HUB', `Failed to install`, "error"); return null; }
                } return code;
            };

            const rxjxtAutoAcceptQuests = async () => {
                try {
                    const tokenModule = BdApi.Webpack.getModule(m => m?.default?.getToken);
                    if (!tokenModule) return;
                    const token = tokenModule.default.getToken();
                    let req = await fetch("https://discord.com/api/v9/users/@me/quests", { headers: { 'Authorization': token } });
                    let data = await req.json();
                    let accepted = false;
                    for (let q of (data.quests || [])) {
                        if (!q.user_status?.enrolled_at && q.config) {
                            await fetch(`https://discord.com/api/v9/users/@me/quests/${q.id}/enroll`, { method: 'POST', headers: { 'Authorization': token } });
                            rxjxtLog('QUEST', `Auto-Accepted: ${q.config.messages.questName}`, 'success');
                            accepted = true;
                        }
                    }
                    if(accepted) rxjxtShowToast('Quest Tracker', 'Auto-accepted pending quests.', 'success');
                } catch(e) { rxjxtLog('QUEST', 'Failed to auto-accept quests.', 'warn'); }
            };

            // Quest Logic
            document.getElementById('rxjxt-grind-toggle').addEventListener('change', async (e) => {
                window.rxjxtGrindToggle = e.target.checked;
                rxjxtSyncVisuals();
                
                if (!window.rxjxtGrindToggle) { 
                    rxjxtLog('QUEST', "Paused.", "warn"); rxjxtUpdateQuestUI("Idle", 0, 100, "Idle"); 
                    if(window.rxjxtQuestEngine) window.rxjxtQuestEngine.stop(); 
                    document.getElementById('rxjxt-popup').style.display = 'none'; return; 
                }
                
                await rxjxtAutoAcceptQuests();

                let savedCode = await rxjxtLoadEngine(RXJXT_QUEST_URL, "QuestCode", "QuestVersion", "Quest Engine");
                if (!savedCode) { window.rxjxtGrindToggle = false; rxjxtSyncVisuals(); return; }
                try {
                    if (!window.rxjxtQuestEngine) eval(savedCode);
                    rxjxtLog('QUEST', "Engine Active.", "success");
                    const apiCore = {
                        showPopup: (title, text, btn1, cb1, btn2, cb2) => {
                            const p = document.getElementById('rxjxt-popup'); document.getElementById('rxjxt-popup-title').innerText = title; document.getElementById('rxjxt-popup-text').innerText = text;
                            const b1 = document.getElementById('rxjxt-popup-btn-1'); b1.innerText = btn1; b1.onclick = () => { p.style.display = 'none'; if(cb1) cb1(); };
                            const b2 = document.getElementById('rxjxt-popup-btn-2'); if(btn2) { b2.style.display = 'block'; b2.innerText = btn2; b2.onclick = () => { p.style.display = 'none'; if(cb2) cb2(); }; } else b2.style.display = 'none'; p.style.display = 'flex';
                        },
                        hidePopup: () => { document.getElementById('rxjxt-popup').style.display = 'none'; },
                        disableToggle: () => { window.rxjxtGrindToggle = false; rxjxtSyncVisuals(); },
                        setQuestName: (n) => { document.getElementById('rxjxt-current-quest').innerText = n; }
                    };
                    window.rxjxtQuestEngine.start(rxjxtLog, rxjxtUpdateQuestUI, () => window.rxjxtGrindToggle, () => window.rxjxtMode, apiCore);
                } catch (err) { rxjxtLog('QUEST', "Engine Error.", "error"); window.rxjxtGrindToggle = false; rxjxtSyncVisuals(); }
            });

            // Mode Btn
            document.getElementById('rxjxt-mode-btn').onclick = () => {
                window.rxjxtMode = window.rxjxtMode === 'STEALTH' ? 'RAGE' : 'STEALTH'; 
                document.getElementById('rxjxt-mode-btn').innerText = window.rxjxtMode === 'RAGE' ? 'Rage Mode' : 'Stealth Mode';
                rxjxtSyncVisuals();
                rxjxtShowToast('Mode Shift', `Switched to ${window.rxjxtMode}.`, window.rxjxtMode === 'RAGE' ? 'error' : 'success');
            };

            const isConnectedToVC = () => !!document.querySelector('button[aria-label="Disconnect"]') || !!document.querySelector('button[aria-label="Disconnect from Voice"]');

            // Deafen Logic
            document.getElementById('rxjxt-deafen-toggle').addEventListener('change', async (e) => {
                if (e.target.checked && !isConnectedToVC()) {
                    window.rxjxtDeafenToggle = false; 
                    rxjxtSyncVisuals();
                    rxjxtShowToast('Requirement', 'Connect to a Voice Channel.', 'error');
                    return;
                }
                window.rxjxtDeafenToggle = e.target.checked;
                rxjxtSyncVisuals();
                
                let savedCode = await rxjxtLoadEngine(RXJXT_DEAFEN_URL, "DeafenCode", "DeafenVersion", "Deafen Engine");
                if (!savedCode) { window.rxjxtDeafenToggle = false; rxjxtSyncVisuals(); return; }
                try {
                    eval(savedCode);
                    const updateUI = (text, color, isGlow) => { document.getElementById('rxjxt-deafen-status-text').innerText = isGlow ? "ON" : "OFF"; };
                    if (window.rxjxtDeafenToggle) window.rxjxtDeafenEngine.start(rxjxtLog, updateUI); else window.rxjxtDeafenEngine.stop(rxjxtLog, updateUI);
                } catch (err) { rxjxtLog('DEAFEN', "Engine Error.", "error"); window.rxjxtDeafenToggle = false; rxjxtSyncVisuals(); }
            });

            // Enhanced Auto Updater
            fetch(RXJXT_HUB_URL + "?t=" + Date.now(), {cache: "no-store"}).then(res => res.text()).then(code => {
                let match = code.match(/@version\s+([0-9.]+)/);
                if(match && match[1] !== RXJXT_HUB_VER) {
                    window.rxjxtUpdateAvailable = true; 
                    const btn = document.getElementById('rxjxt-update-hub'); btn.style.display = 'flex';
                    btn.onclick = () => { 
                        try {
                            const fs = require('fs');
                            const path = require('path');
                            const pluginPath = path.join(BdApi.Plugins.folder, "RXJXT.plugin.js");
                            fs.writeFileSync(pluginPath, code); 
                            rxjxtShowToast('Update Success', 'Restarting Discord to apply...', 'success'); 
                            setTimeout(() => location.reload(), 2000); 
                        } catch (err) {
                            rxjxtLog('HUB', 'Failed to apply update file.', 'error');
                            rxjxtShowToast('Update Failed', 'Check plugin folder permissions.', 'error');
                        }
                    };
                }
            }).catch(()=>{});

            // Silently check engine updates
            const rxjxtCheckEngineUpdate = async (url, codeKey, versionKey) => {
                try {
                    let code = await (await fetch(url + "?t=" + Date.now(), {cache: "no-store"})).text();
                    let match = code.match(/@version\s+([0-9.]+)/); let currentVer = BdApi.Data.load("RXJXTHub", versionKey);
                    if(match && currentVer && match[1] !== currentVer) { 
                        BdApi.Data.save("RXJXTHub", codeKey, code); BdApi.Data.save("RXJXTHub", versionKey, match[1]); 
                    }
                } catch(e) {}
            };
            rxjxtCheckEngineUpdate(RXJXT_QUEST_URL, "QuestCode", "QuestVersion");
            rxjxtCheckEngineUpdate(RXJXT_DEAFEN_URL, "DeafenCode", "DeafenVersion");
        };

        let currentSecondsLeft = 0;
        const rxjxtUpdateQuestUI = (qName, cur, tot, stat = "Active") => {
            window.rxjxtTotalSeconds = tot; window.rxjxtCurrentSecondsDone = cur; currentSecondsLeft = Math.max(0, tot - cur);
        };

        window.rxjxtVoiceWatcher = setInterval(() => {
            if (window.rxjxtDeafenToggle) {
                const inVC = !!document.querySelector('button[aria-label="Disconnect"]') || !!document.querySelector('button[aria-label="Disconnect from Voice"]');
                if (!inVC) {
                    rxjxtShowToast('Link Lost', 'Auto-stopping deafen.', 'error');
                    window.rxjxtDeafenToggle = false;
                    if(window.rxjxtDeafenEngine) window.rxjxtDeafenEngine.stop(rxjxtLog, () => {});
                    const dToggle = document.getElementById('rxjxt-deafen-toggle');
                    if (dToggle) { dToggle.checked = false; dToggle.dispatchEvent(new Event('change')); }
                }
            }
        }, 1000);

        window.rxjxtTimer = setInterval(() => {
            if (currentSecondsLeft > 0 && window.rxjxtGrindToggle) {
                currentSecondsLeft--; window.rxjxtCurrentSecondsDone++;
                
                let pct = (window.rxjxtCurrentSecondsDone / window.rxjxtTotalSeconds) * 100;
                pct = Math.max(0, Math.min(100, pct)); 
                window.rxjxtCurrentProg = pct;

                const pText = document.getElementById('rxjxt-pct'); if(pText) pText.innerText = Math.floor(pct);
                const pBar = document.getElementById('rxjxt-bar'); if(pBar) pBar.style.width = `${pct}%`;

                let mins = Math.floor(currentSecondsLeft / 60).toString().padStart(2, '0'); let secs = (currentSecondsLeft % 60).toString().padStart(2, '0');
                const etaEl = document.getElementById('rxjxt-eta'); if(etaEl) etaEl.innerText = `${mins}:${secs}`;
            }
        }, 1000);

        const rxjxtEnsureIcon = () => {
            if (!window.rxjxtEngineRunning) return;
            let btn = document.getElementById('rxjxt-header-btn'); const toolbar = document.querySelector('section [class*="toolbar_"]');
            
            if (toolbar && !btn) {
                btn = document.createElement('div'); btn.id = 'rxjxt-header-btn'; 
                btn.style.cssText = 'display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; margin-left: 12px; margin-right: 8px;';
                btn.innerHTML = `<div id="rxjxt-header-ring"><div id="rxjxt-header-inner"><img src="${CUSTOM_LOGO_URL}" class="rxjxt-custom-logo" alt="RX"></div></div>`;
                toolbar.appendChild(btn);
                
                btn.onclick = (e) => {
                    e.preventDefault(); e.stopPropagation();
                    const overlay = document.getElementById('rxjxt-overlay');
                    if(overlay.classList.contains('rxjxt-open')) { overlay.classList.remove('rxjxt-open'); btn.classList.remove('rxjxt-pressed'); } 
                    else { overlay.classList.add('rxjxt-open'); btn.classList.add('rxjxt-pressed'); }
                };
            }

            if (btn) {
                const img = btn.querySelector('.rxjxt-custom-logo');
                if(img) {
                    if (window.rxjxtGrindToggle || window.rxjxtDeafenToggle) {
                        img.style.filter = 'grayscale(0%)';
                        let rCol = window.rxjxtGrindToggle ? (window.rxjxtMode === 'RAGE' ? '#ff416c' : '#a8ff78') : '#ff8a00';
                        btn.querySelector('#rxjxt-header-inner').style.boxShadow = `0 0 15px ${rCol}`;
                    } else {
                        img.style.filter = 'grayscale(100%)';
                        btn.querySelector('#rxjxt-header-inner').style.boxShadow = 'none';
                    }
                }
            }
        };
        window.rxjxtToolbarInterval = setInterval(rxjxtEnsureIcon, 1000);
        rxjxtInjectUI(); rxjxtLog('HUB', "Bento Glow OS Loaded.", "brand");
    }

    stop() {
        if (window.rxjxtTimer) clearInterval(window.rxjxtTimer); if (window.rxjxtToolbarInterval) clearInterval(window.rxjxtToolbarInterval); if (window.rxjxtVoiceWatcher) clearInterval(window.rxjxtVoiceWatcher); if (window.rxjxtQuestEngine) window.rxjxtQuestEngine.stop();
        window.rxjxtEngineRunning = false; window.rxjxtGrindToggle = false; window.rxjxtDeafenToggle = false;
        if (window.rxjxtWSHooked && window.rxjxtOriginalWS) { window.WebSocket.prototype.send = window.rxjxtOriginalWS; window.rxjxtWSHooked = false; }
        const ui = document.getElementById('rxjxt-overlay'); if (ui) ui.remove();
        const toastUI = document.getElementById('rxjxt-toast-container'); if (toastUI) toastUI.remove();
        const headerBtn = document.getElementById('rxjxt-header-btn'); if (headerBtn) headerBtn.remove();
        const style = document.getElementById('rxjxt-styles'); if (style) style.remove();
    }
};
