/**
 * @name RXJXTQuestDashboard
 * @author RXJXT
 * @description RXJXT Liquid Hub: v14.0.0 Stable Final (Center Overlay, iPhone Toasts & Custom Logos)
 * @version 14.0.0
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
        
        const RXJXT_HUB_VER = "14.0.0";
        const RXJXT_REPO_BASE = "https://raw.githubusercontent.com/rxjxt-1/RXJXT-Quest-Tool/main/";
        const RXJXT_HUB_URL = RXJXT_REPO_BASE + "RXJXT.plugin.js";
        const RXJXT_QUEST_URL = RXJXT_REPO_BASE + "QuestEngine.js";
        const RXJXT_DEAFEN_URL = RXJXT_REPO_BASE + "DeafenEngine.js";

        const CUSTOM_LOGO_URL = "https://i.ibb.co/KcS5f6yT/b3e66a70-76a7-455b-8c40-6fccf7dc6193-1.png"; 
        const DEVELOPER_ID = "1262670730865283076"; 

        const rxjxtLog = (app, msg, type = "info") => {
            const colors = { info: "#0A84FF", success: "#30D158", warn: "#FF9F0A", error: "#FF453A", brand: "#FF453A", finish: "#32ADE6" };
            const color = colors[type] || colors.info;
            console.log(`%c[ ${_k} | ${app} ]%c ${msg}`, `color: #000; background: ${color}; font-weight: bold; border-radius: 4px; padding: 2px 6px;`, `color: ${color}; font-weight: 500; padding-left: 5px;`);

            const logBox = document.getElementById(app === 'QUEST' ? 'rxjxt-terminal-quest' : 'rxjxt-terminal-deafen');
            if (logBox) {
                const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
                const logEntry = document.createElement('div'); logEntry.style.marginBottom = "4px";
                logEntry.innerHTML = `<span style="color: rgba(255,255,255,0.4); font-size: 11px; font-weight: 500;">[${time}]</span> <span style="color: ${color}; font-weight: 600;">${msg}</span>`;
                logBox.appendChild(logEntry); logBox.scrollTop = logBox.scrollHeight;
            }
        };

        const rxjxtShowToast = (title, message, type = 'info') => {
            const container = document.getElementById('rxjxt-toast-container');
            if (!container) return;
            
            const toast = document.createElement('div');
            toast.className = `rxjxt-toast toast-${type}`;
            
            let icon = '';
            if (type === 'success') icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:12px; height:12px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            else if (type === 'error') icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:12px; height:12px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
            else icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:12px; height:12px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

            toast.innerHTML = `<div class="rxjxt-toast-icon">${icon}</div><div class="rxjxt-toast-text"><span style="color:rgba(255,255,255,0.6); font-size: 11px; display:block;">${title}</span>${message}</div>`;
            
            container.appendChild(toast);
            
            setTimeout(() => toast.classList.add('show'), 10); // iPhone slide down animation
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 500); // Remove from DOM after fade out
            }, 3500);
        };

        const rxjxtInjectUI = () => {
            if (document.getElementById('rxjxt-overlay')) return;
            const style = document.createElement('style'); style.id = "rxjxt-styles";
            style.innerHTML = `
                /* SF Pro Font Setup */
                @import url('https://fonts.cdnfonts.com/css/sf-pro-display');
                
                /* Full Screen Overlay with Blur */
                #rxjxt-overlay { 
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0, 0, 0, 0.45);
                    backdrop-filter: blur(12px) saturate(150%);
                    -webkit-backdrop-filter: blur(12px) saturate(150%);
                    z-index: 9999999;
                    display: flex; justify-content: center; align-items: center;
                    opacity: 0; pointer-events: none;
                    transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    font-family: "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, sans-serif; 
                    color: #fff;
                }
                #rxjxt-overlay.rxjxt-open { opacity: 1; pointer-events: auto; }

                /* Center Scaling Animation */
                .liquid-panel { 
                    transform-origin: center; 
                    transform: scale(0.85) translateY(20px); 
                    opacity: 0; 
                    border-radius: 40px; 
                    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease, border-radius 0.5s; 
                }
                #rxjxt-overlay.rxjxt-open .liquid-panel { 
                    opacity: 1; 
                    transform: scale(1) translateY(0); 
                    border-radius: 20px;
                }
                
                /* Main 3D Glass Body */
                .ios-glass { 
                    background: rgba(18, 18, 22, 0.65); 
                    backdrop-filter: blur(50px) saturate(200%); 
                    -webkit-backdrop-filter: blur(50px) saturate(200%); 
                    border: 1px solid rgba(255, 255, 255, 0.1); 
                    box-shadow: 0 40px 80px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255, 255, 255, 0.15); 
                }

                /* Sidebar Layout */
                .rxjxt-dashboard-layout { display: flex; width: 560px; min-height: 420px; }
                
                .rxjxt-sidebar { 
                    width: 150px; 
                    background: rgba(0, 0, 0, 0.25); 
                    border-right: 1px solid rgba(255, 255, 255, 0.05); 
                    display: flex; flex-direction: column; 
                    padding: 24px 12px; 
                    justify-content: space-between;
                    border-radius: 20px 0 0 20px;
                    box-shadow: inset -10px 0 20px rgba(0,0,0,0.1);
                }
                
                .rxjxt-nav-group { display: flex; flex-direction: column; gap: 10px; }
                
                /* 3D Sidebar Items */
                .rxjxt-nav-item { 
                    display: flex; align-items: center; gap: 12px; 
                    padding: 12px 14px; border-radius: 14px; cursor: pointer; 
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); 
                    color: rgba(255,255,255,0.5); font-weight: 600; font-size: 14.5px;
                    border: 1px solid transparent;
                }
                .rxjxt-nav-item:hover { background: rgba(255,255,255,0.05); color: #fff; }
                
                .rxjxt-nav-item.active { 
                    background: rgba(255,255,255,0.12); 
                    color: #fff; 
                    box-shadow: inset 0 1px 1px rgba(255,255,255,0.2), 0 8px 20px rgba(0,0,0,0.4); 
                    border: 1px solid rgba(255,255,255,0.08);
                }
                
                .rxjxt-nav-item svg { width: 22px; height: 22px; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                .rxjxt-nav-item.active svg { transform: scale(1.1); }

                .rxjxt-content-area { flex: 1; padding: 22px; position: relative; display: flex; flex-direction: column; gap: 12px; }
                .rxjxt-view { display: none; flex-direction: column; gap: 12px; }
                .rxjxt-view.active { display: flex; }
                
                /* Nested 3D Glass Cards */
                .rxjxt-3d-card {
                    background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 18px; padding: 16px 20px;
                    box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1), 0 4px 12px rgba(0,0,0,0.2);
                }

                .rxjxt-header-card { display: flex; justify-content: space-between; align-items: center; }
                .rxjxt-brand-name { font-size: 17px; font-weight: 700; letter-spacing: 0.3px; display: flex; align-items: center; gap: 8px; } 
                .rxjxt-controls { display: flex; align-items: center; gap: 14px; }
                
                .rxjxt-mode-btn { padding: 6px 14px; font-size: 12px; font-family: inherit; font-weight: 700; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); border-radius: 100px; cursor: pointer; color: rgba(255,255,255,0.8); transition: 0.3s; box-shadow: inset 0 1px 2px rgba(255,255,255,0.1); }
                .rxjxt-mode-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
                
                /* Hyper-realistic 3D Toggle Switch */
                .rxjxt-toggle { position: relative; display: inline-block; width: 46px; height: 26px; } .rxjxt-toggle input { opacity: 0; width: 0; height: 0; }
                .rxjxt-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.4); transition: .4s cubic-bezier(0.16, 1, 0.3, 1); border-radius: 34px; box-shadow: inset 0 2px 6px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05); }
                .rxjxt-slider:before { position: absolute; content: ""; height: 22px; width: 22px; left: 2px; bottom: 2px; background-color: #fff; transition: .4s cubic-bezier(0.16, 1, 0.3, 1); border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.4), inset 0 -2px 2px rgba(0,0,0,0.1); }
                input:checked + .rxjxt-slider:before { transform: translateX(20px); }
                
                .theme-stealth input:checked + .rxjxt-slider, .theme-rage input:checked + .rxjxt-slider { background-color: #30D158; box-shadow: inset 0 2px 6px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.2); }
                .theme-deafen-on input:checked + .rxjxt-slider { background-color: #FF453A; box-shadow: inset 0 2px 6px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.2); }

                /* 3D Close Button */
                .rxjxt-close-wrapper { display: flex; justify-content: flex-end; margin-bottom: -4px; padding-right: 4px; }
                .rxjxt-close-btn { width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.08); display: flex; justify-content: center; align-items: center; cursor: pointer; font-size: 13px; font-weight: 700; color: rgba(255,255,255,0.6); transition: 0.3s cubic-bezier(0.16, 1, 0.3, 1); border: 1px solid rgba(255,255,255,0.1); box-shadow: inset 0 1px 1px rgba(255,255,255,0.2), 0 4px 10px rgba(0,0,0,0.3); }
                .rxjxt-close-btn:hover { background: rgba(255,255,255,0.2); color: #fff; transform: scale(1.1) rotate(90deg); }
                
                /* Typography & Data Styling */
                .rxjxt-status-box { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; }
                .rxjxt-eta { color: rgba(255,255,255,0.5); font-family: "SF Mono", Consolas, monospace; font-size: 13px; background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 6px; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5); } 
                .rxjxt-label { font-size: 11px; color: rgba(255,255,255,0.4); text-transform: uppercase; font-weight: 700; margin-bottom: 6px; display: block; letter-spacing: 0.5px; }
                .rxjxt-value { font-size: 14px; font-weight: 600; color: rgba(255,255,255,0.9); margin-bottom: 16px; line-height: 1.4; word-wrap: break-word; }
                
                /* 3D Progress Bar */
                .rxjxt-progress-wrapper { width: 100%; height: 8px; background: rgba(0,0,0,0.5); border-radius: 100px; overflow: hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.05); margin-top: 4px; }
                .rxjxt-progress-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #30D158, #23a559); box-shadow: inset 0 1px 1px rgba(255,255,255,0.4), 0 0 10px rgba(48, 209, 88, 0.6); border-radius: 100px; transition: width 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
                
                /* Recessed Terminal */
                .rxjxt-recessed-terminal { background: rgba(0, 0, 0, 0.5); border-radius: 16px; padding: 14px; height: 110px; overflow-y: auto; font-family: "SF Mono", Consolas, monospace; font-size: 11.5px; font-weight: 500; border: 1px solid transparent; box-shadow: inset 0 4px 12px rgba(0,0,0,0.8), inset 0 1px 3px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.08); }
                .rxjxt-recessed-terminal::-webkit-scrollbar { width: 4px; } .rxjxt-recessed-terminal::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }

                .rxjxt-info-pill { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: auto; padding-top: 8px; font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.4); }
                .rxjxt-info-pill a { color: #0A84FF; text-decoration: none; transition: 0.3s; } .rxjxt-info-pill a:hover { filter: brightness(1.3); text-decoration: underline; }

                /* === STAGGERED BOOTING ANIMATION === */
                @keyframes rxjxtCardBoot { 0% { opacity: 0; transform: translateY(15px) scale(0.98); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
                .rxjxt-view.active > div:nth-child(1) { animation: rxjxtCardBoot 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s forwards; opacity: 0; }
                .rxjxt-view.active > div:nth-child(2) { animation: rxjxtCardBoot 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards; opacity: 0; }
                .rxjxt-view.active > div:nth-child(3) { animation: rxjxtCardBoot 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards; opacity: 0; }
                .rxjxt-view.active > div:nth-child(4) { animation: rxjxtCardBoot 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.35s forwards; opacity: 0; }

                /* Dynamic Brand Colors */
                .theme-stealth .status-quest { color: #30D158; text-shadow: 0 0 10px rgba(48,209,88,0.4); }
                .theme-rage .status-quest { color: #FF453A; text-shadow: 0 0 10px rgba(255,69,58,0.4); }
                .theme-deafen-off .status-deafen { color: rgba(255,255,255,0.5); }
                .theme-deafen-on .status-deafen { color: #FF453A; text-shadow: 0 0 10px rgba(255,69,58,0.4); }

                /* Toolbar Button */
                #rxjxt-header-btn { margin-left: 8px !important; margin-right: 4px !important; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                #rxjxt-header-ring { width: 34px; height: 34px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15); overflow: hidden; transform: translateZ(0); }
                #rxjxt-header-inner { width: 28px; height: 28px; background: #1c1c1e; border-radius: 50%; display: flex; justify-content: center; align-items: center; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.6); z-index: 2; }
                .rxjxt-custom-logo { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                #rxjxt-header-btn:hover #rxjxt-header-inner { transform: scale(1.12); }
                #rxjxt-header-btn.rxjxt-pressed #rxjxt-header-inner { transform: scale(0.85); box-shadow: inset 0 2px 8px rgba(0,0,0,0.8); }
                #rxjxt-header-btn.rxjxt-pressed .rxjxt-custom-logo { opacity: 0.6; transform: scale(0.9); }

                /* iPhone Style Toasts Container */
                #rxjxt-toast-container { position: fixed; top: 40px; left: 50%; transform: translateX(-50%); z-index: 999999999; display: flex; flex-direction: column; gap: 10px; align-items: center; pointer-events: none; }
                .rxjxt-toast { background: rgba(25, 25, 28, 0.85); backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 100px; padding: 10px 22px 10px 14px; color: #fff; font-family: "SF Pro Display", sans-serif; font-size: 13.5px; font-weight: 600; display: flex; align-items: center; gap: 14px; box-shadow: 0 15px 40px rgba(0,0,0,0.5); transform: translateY(-50px) scale(0.8); opacity: 0; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
                .rxjxt-toast.show { transform: translateY(0) scale(1); opacity: 1; }
                .rxjxt-toast-icon { width: 28px; height: 28px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.3); }
                .toast-success .rxjxt-toast-icon { background: linear-gradient(135deg, #30D158, #23a559); color: #fff; }
                .toast-error .rxjxt-toast-icon { background: linear-gradient(135deg, #FF453A, #FF375F); color: #fff; }
                .toast-info .rxjxt-toast-icon { background: linear-gradient(135deg, #0A84FF, #5E5CE6); color: #fff; }

                /* 3D Popup */
                #rxjxt-popup { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.7); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); z-index: 200; display: none; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 30px; border-radius: 20px; }
                .rxjxt-popup-title { font-size: 18px; font-weight: 700; margin-bottom: 10px; } .rxjxt-popup-text { font-size: 14px; color: rgba(255,255,255,0.8); margin-bottom: 26px; }
                .rxjxt-popup-actions { display: flex; gap: 12px; } 
                .rxjxt-action-btn { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 10px 24px; font-weight: 600; cursor: pointer; border-radius: 100px; box-shadow: inset 0 1px 1px rgba(255,255,255,0.15), 0 4px 10px rgba(0,0,0,0.3); transition: 0.3s; }
                .rxjxt-action-btn.primary { background: linear-gradient(180deg, #1A90FF 0%, #007AFF 100%); border: none; box-shadow: inset 0 1px 1px rgba(255,255,255,0.3), 0 4px 15px rgba(10, 132, 255, 0.4); } 
                .rxjxt-action-btn:hover { filter: brightness(1.2); transform: scale(1.05); }
                
                .upd-icon { color: #32ADE6; filter: drop-shadow(0 0 8px rgba(50,173,230,0.6)); }
            `;
            document.head.appendChild(style);

            // Container for iPhone Toasts
            document.body.insertAdjacentHTML('beforeend', `<div id="rxjxt-toast-container"></div>`);

            // Wreath and Incognito SVG Variables
            const wreathSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>`;
            const crownSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/></svg>`;
            // Perfect Wreath (Leafy) resembling image_24a79a.png
            const leafWreathSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 10c-.3-1.7-1.1-3.2-2.3-4.3-.9-.9-2.3-1.2-3.5-.8-.7.2-1.3.7-1.7 1.3-.2-.5-.5-1-.9-1.4-1.3-1.1-3.2-1.3-4.7-.5-1.5.8-2.5 2.2-2.5 3.9 0 1.5.6 2.9 1.7 3.9C6.5 13.2 6 14.5 6 16c0 1.6.8 3.1 2.2 4 1.1.7 2.4 1 3.8.8.7.6 1.6 1 2.5 1s1.8-.3 2.5-1c1.4.2 2.7-.1 3.8-.8 1.4-.9 2.2-2.4 2.2-4 0-1.5-.5-2.8-1.5-3.9 1-1 1.6-2.4 1.6-3.9 0-.1 0-.1-.1-.2z"/></svg>`;
            // Perfect Incognito Hat resembling image_24551e.png
            const incognitoHatSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 13h-2.14l-2.7-7.2c-.22-.59-.78-1-1.42-1h-7.5c-.64 0-1.2.41-1.42 1L4.14 13H2v2h20v-2zM9 16c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm6 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;

            document.body.insertAdjacentHTML('beforeend', `
                <div id="rxjxt-overlay">
                    <div id="rxjxt-main-dashboard" class="liquid-panel ios-glass theme-stealth">
                        <div id="rxjxt-popup"><div class="rxjxt-popup-title" id="rxjxt-popup-title">Confirm</div><div class="rxjxt-popup-text" id="rxjxt-popup-text">Message</div><div class="rxjxt-popup-actions"><button class="rxjxt-action-btn primary" id="rxjxt-popup-btn-1">Confirm</button><button class="rxjxt-action-btn" id="rxjxt-popup-btn-2" style="display:none;">Cancel</button></div></div>
                        
                        <div class="rxjxt-dashboard-layout">
                            <!-- Sidebar Navigation -->
                            <div class="rxjxt-sidebar">
                                <div class="rxjxt-nav-group">
                                    <div class="rxjxt-nav-item active" data-target="quest">
                                        ${leafWreathSVG}
                                        <span>Quest</span>
                                    </div>
                                    <div class="rxjxt-nav-item" data-target="deafen">
                                        ${incognitoHatSVG}
                                        <span>Deafen</span>
                                    </div>
                                </div>
                                <div class="rxjxt-nav-group">
                                    <div class="rxjxt-nav-item" id="rxjxt-update-hub" style="display: none; color: #32ADE6; background: rgba(50,173,230,0.1); border-color: rgba(50,173,230,0.2); box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);">
                                        <svg viewBox="0 0 24 24" class="upd-icon" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"></path><path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path><path d="M3 22v-6h6"></path><path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path></svg>
                                        <span id="rxjxt-uhub-text">Update</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Content Area -->
                            <div class="rxjxt-content-area">
                                <div class="rxjxt-close-wrapper"><div class="rxjxt-close-btn rxjxt-x-btn">✕</div></div>
                                
                                <!-- Quest View -->
                                <div id="rxjxt-view-quest" class="rxjxt-view active">
                                    <div class="rxjxt-3d-card rxjxt-header-card">
                                        <div class="rxjxt-brand-name">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                                            Quest Engine
                                        </div>
                                        <div class="rxjxt-controls">
                                            <button class="rxjxt-mode-btn" id="rxjxt-mode-btn">Stealth</button>
                                            <label class="rxjxt-toggle"><input type="checkbox" id="rxjxt-grind-toggle"><span class="rxjxt-slider"></span></label>
                                        </div>
                                    </div>
                                    
                                    <div class="rxjxt-3d-card">
                                        <div class="rxjxt-status-box"><span class="status-quest" id="rxjxt-live-status">Idle</span><span class="rxjxt-eta" id="rxjxt-eta">--:--</span></div>
                                        <span class="rxjxt-label">Current Target</span><div class="rxjxt-value" id="rxjxt-current-quest">None Selected</div>
                                        <span class="rxjxt-label" style="display: flex; justify-content: space-between;">Progress <span id="rxjxt-pct">0%</span></span>
                                        <div class="rxjxt-progress-wrapper"><div class="rxjxt-progress-fill" id="rxjxt-bar"></div></div>
                                    </div>

                                    <div class="rxjxt-recessed-terminal" id="rxjxt-terminal-quest"></div>
                                </div>

                                <!-- Deafen View -->
                                <div id="rxjxt-view-deafen" class="rxjxt-view">
                                    <div class="rxjxt-3d-card rxjxt-header-card">
                                        <div class="rxjxt-brand-name">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                                            Fake Deafen
                                        </div>
                                        <div class="rxjxt-controls">
                                            <label class="rxjxt-toggle"><input type="checkbox" id="rxjxt-deafen-toggle"><span class="rxjxt-slider"></span></label>
                                        </div>
                                    </div>
                                    
                                    <div class="rxjxt-3d-card">
                                        <div class="rxjxt-status-box"><span class="status-deafen" id="rxjxt-deafen-status">Inactive</span></div>
                                        <span class="rxjxt-label">Information</span>
                                        <div class="rxjxt-value" style="font-size: 13px; margin-bottom: 0;">Toggle to automate Fake Deafen. You will hear and speak normally while appearing deafened to others.</div>
                                    </div>

                                    <div class="rxjxt-recessed-terminal" id="rxjxt-terminal-deafen"></div>
                                </div>

                                <div class="rxjxt-info-pill">v${RXJXT_HUB_VER} • Developed by <a href="discord://-/users/${DEVELOPER_ID}" target="_blank">RXJXT</a></div>
                            </div>
                        </div>
                    </div>
                </div>
            `);

            const dashContainer = document.getElementById('rxjxt-main-dashboard');
            const overlay = document.getElementById('rxjxt-overlay');
            
            // Updates Theme & Dynamically Colors Sidebar Logos
            const updateDashboardTheme = (activeTab) => {
                dashContainer.className = `liquid-panel ios-glass`;
                if (activeTab === 'quest') dashContainer.classList.add(`theme-${window.rxjxtMode.toLowerCase()}`);
                else if (activeTab === 'deafen') dashContainer.classList.add(window.rxjxtDeafenToggle ? 'theme-deafen-on' : 'theme-deafen-off');

                const qIcon = document.querySelector('.rxjxt-nav-item[data-target="quest"] svg');
                const dIcon = document.querySelector('.rxjxt-nav-item[data-target="deafen"] svg');
                
                // Colorize Quest Logo (Wreath)
                if (window.rxjxtGrindToggle) {
                    if (window.rxjxtMode === 'RAGE') { qIcon.style.color = '#FF453A'; qIcon.style.filter = 'drop-shadow(0 0 8px rgba(255,69,58,0.5))'; }
                    else { qIcon.style.color = '#30D158'; qIcon.style.filter = 'drop-shadow(0 0 8px rgba(48,209,88,0.5))'; }
                } else { qIcon.style.color = ''; qIcon.style.filter = ''; }

                // Colorize Deafen Logo (Incognito)
                if (window.rxjxtDeafenToggle) { dIcon.style.color = '#FF453A'; dIcon.style.filter = 'drop-shadow(0 0 8px rgba(255,69,58,0.5))'; }
                else { dIcon.style.color = ''; dIcon.style.filter = ''; }
            };

            // Switch Tabs
            document.querySelectorAll('.rxjxt-nav-item:not(#rxjxt-update-hub)').forEach(tab => {
                tab.onclick = () => {
                    document.querySelectorAll('.rxjxt-nav-item').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.rxjxt-view').forEach(v => v.classList.remove('active'));
                    tab.classList.add('active');
                    const target = tab.dataset.target;
                    document.getElementById(`rxjxt-view-${target}`).classList.add('active');
                    updateDashboardTheme(target);
                };
            });

            // Close Modal logic (X button & clicking outside blur background)
            const closeModal = () => {
                overlay.classList.remove('rxjxt-open');
                let t = document.getElementById('rxjxt-header-btn'); if(t) t.classList.remove('rxjxt-pressed');
            };
            document.querySelector('.rxjxt-x-btn').onclick = closeModal;
            overlay.onclick = (e) => { if (e.target.id === 'rxjxt-overlay') closeModal(); };

            const rxjxtLoadEngine = async (url, codeKey, versionKey, name) => {
                let code = BdApi.Data.load("RXJXTHub", codeKey);
                if (!code) {
                    rxjxtLog('HUB', `Auto-Installing ${name}...`, "warn");
                    try {
                        let res = await fetch(url + "?t=" + Date.now(), {cache: "no-store"});
                        code = await res.text(); let match = code.match(/@version\s+([0-9.]+)/);
                        BdApi.Data.save("RXJXTHub", codeKey, code); BdApi.Data.save("RXJXTHub", versionKey, match ? match[1] : "1.0.0");
                        rxjxtLog('HUB', `${name} Installed!`, "success");
                        rxjxtShowToast('Installation', `${name} installed properly.`, 'success');
                    } catch (e) { rxjxtLog('HUB', `Failed to install ${name}`, "error"); rxjxtShowToast('Error', `Failed to install ${name}`, 'error'); return null; }
                }
                return code;
            };

            const questInput = document.getElementById('rxjxt-grind-toggle');
            questInput.addEventListener('change', async (e) => {
                window.rxjxtGrindToggle = e.target.checked;
                updateDashboardTheme(document.querySelector('.rxjxt-nav-item.active').dataset.target);

                if (!window.rxjxtGrindToggle) { 
                    rxjxtLog('QUEST', "Paused.", "warn"); rxjxtUpdateQuestUI("Idle", 0, 100, "Idle"); 
                    if(window.rxjxtQuestEngine) window.rxjxtQuestEngine.stop(); 
                    document.getElementById('rxjxt-popup').style.display = 'none'; return; 
                }
                
                let savedCode = await rxjxtLoadEngine(RXJXT_QUEST_URL, "QuestCode", "QuestVersion", "Quest Engine");
                if (!savedCode) { e.target.checked = false; window.rxjxtGrindToggle = false; updateDashboardTheme('quest'); return; }
                try {
                    if (!window.rxjxtQuestEngine) eval(savedCode);
                    rxjxtLog('QUEST', "Enabled.", "success");
                    const apiCore = {
                        showPopup: (title, text, btn1, cb1, btn2, cb2) => {
                            const p = document.getElementById('rxjxt-popup'); document.getElementById('rxjxt-popup-title').innerText = title; document.getElementById('rxjxt-popup-text').innerText = text;
                            const b1 = document.getElementById('rxjxt-popup-btn-1'); b1.innerText = btn1; b1.onclick = () => { p.style.display = 'none'; if(cb1) cb1(); };
                            const b2 = document.getElementById('rxjxt-popup-btn-2'); if(btn2) { b2.style.display = 'block'; b2.innerText = btn2; b2.onclick = () => { p.style.display = 'none'; if(cb2) cb2(); }; } else b2.style.display = 'none'; p.style.display = 'flex';
                        },
                        hidePopup: () => { document.getElementById('rxjxt-popup').style.display = 'none'; },
                        disableToggle: () => { window.rxjxtGrindToggle = false; document.getElementById('rxjxt-grind-toggle').checked = false; updateDashboardTheme('quest'); },
                        setQuestName: (n) => { document.getElementById('rxjxt-current-quest').innerText = n; }
                    };
                    window.rxjxtQuestEngine.start(rxjxtLog, rxjxtUpdateQuestUI, () => window.rxjxtGrindToggle, () => window.rxjxtMode, apiCore);
                } catch (err) { rxjxtLog('QUEST', "Corrupted Engine or Error.", "error"); }
            });

            document.getElementById('rxjxt-mode-btn').onclick = () => {
                window.rxjxtMode = window.rxjxtMode === 'STEALTH' ? 'RAGE' : 'STEALTH'; 
                document.getElementById('rxjxt-mode-btn').innerText = window.rxjxtMode === 'RAGE' ? 'Rage' : 'Stealth';
                updateDashboardTheme(document.querySelector('.rxjxt-nav-item.active').dataset.target);
                rxjxtLog('QUEST', `Mode: ${window.rxjxtMode}`, window.rxjxtMode === 'RAGE' ? "brand" : "info");
                rxjxtShowToast('Mode Changed', `Switched to ${window.rxjxtMode} mode.`, window.rxjxtMode === 'RAGE' ? 'error' : 'success');
            };

            const isConnectedToVC = () => !!document.querySelector('button[aria-label="Disconnect"]') || !!document.querySelector('button[aria-label="Disconnect from Voice"]');

            const deafenInput = document.getElementById('rxjxt-deafen-toggle');
            deafenInput.addEventListener('change', async (e) => {
                if (e.target.checked && !isConnectedToVC()) {
                    e.target.checked = false; window.rxjxtDeafenToggle = false; rxjxtLog('DEAFEN', "Connect to VC first!", "warn");
                    rxjxtShowToast('Action Failed', 'Please connect to a Voice Channel first.', 'error');
                    const statEl = document.getElementById('rxjxt-deafen-status');
                    if(statEl) { statEl.innerText = "Connect to VC first!"; setTimeout(() => { if (!window.rxjxtDeafenToggle && statEl) statEl.innerText = "Inactive"; }, 3000); } return;
                }

                window.rxjxtDeafenToggle = e.target.checked;
                updateDashboardTheme(document.querySelector('.rxjxt-nav-item.active').dataset.target);
                
                let savedCode = await rxjxtLoadEngine(RXJXT_DEAFEN_URL, "DeafenCode", "DeafenVersion", "Deafen Engine");
                if (!savedCode) { e.target.checked = false; window.rxjxtDeafenToggle = false; updateDashboardTheme('deafen'); return; }
                try {
                    eval(savedCode);
                    const updateUI = (text, color, isGlow) => {
                        document.getElementById('rxjxt-deafen-status').innerText = isGlow ? "Active" : "Inactive";
                        if (document.querySelector('.rxjxt-nav-item[data-target="deafen"]').classList.contains('active')) updateDashboardTheme('deafen');
                    };
                    if (window.rxjxtDeafenToggle) window.rxjxtDeafenEngine.start(rxjxtLog, updateUI); else window.rxjxtDeafenEngine.stop(rxjxtLog, updateUI);
                } catch (err) { rxjxtLog('DEAFEN', "Corrupted Engine or Error.", "error"); }
            });

            fetch(RXJXT_HUB_URL + "?t=" + Date.now(), {cache: "no-store"}).then(res => res.text()).then(code => {
                let match = code.match(/@version\s+([0-9.]+)/);
                if(match && match[1] !== RXJXT_HUB_VER) {
                    window.rxjxtUpdateAvailable = true; 
                    const btn = document.getElementById('rxjxt-update-hub'); btn.style.display = 'flex'; document.getElementById('rxjxt-uhub-text').innerText = `v${match[1]}`;
                    const mainRing = document.getElementById('rxjxt-header-ring'); if (mainRing) mainRing.classList.add('rxjxt-update-blink');
                    btn.onclick = () => { 
                        require('fs').writeFileSync(require('path').join(BdApi.Plugins.folder, "RXJXT.plugin.js"), code); 
                        rxjxtShowToast('Update Successful', `Updated to v${match[1]}! Restarting...`, 'success');
                        setTimeout(() => location.reload(), 2000); 
                    };
                }
            }).catch(()=>{});

            const rxjxtCheckEngineUpdate = async (url, codeKey, versionKey, name) => {
                try {
                    let code = await (await fetch(url + "?t=" + Date.now(), {cache: "no-store"})).text();
                    let match = code.match(/@version\s+([0-9.]+)/); let currentVer = BdApi.Data.load("RXJXTHub", versionKey);
                    if(match && currentVer && match[1] !== currentVer) { 
                        BdApi.Data.save("RXJXTHub", codeKey, code); BdApi.Data.save("RXJXTHub", versionKey, match[1]); 
                        rxjxtLog('HUB', `${name} Auto-Updated to v${match[1]}!`, "success"); 
                        rxjxtShowToast('Engine Updated', `${name} updated to v${match[1]}.`, 'info');
                    }
                } catch(e) {}
            };
            rxjxtCheckEngineUpdate(RXJXT_QUEST_URL, "QuestCode", "QuestVersion", "Quest Engine");
            rxjxtCheckEngineUpdate(RXJXT_DEAFEN_URL, "DeafenCode", "DeafenVersion", "Deafen Engine");
        };

        let currentSecondsLeft = 0;
        const rxjxtUpdateQuestUI = (qName, cur, tot, stat = "Active") => {
            window.rxjxtTotalSeconds = tot; window.rxjxtCurrentSecondsDone = cur; currentSecondsLeft = Math.max(0, tot - cur);
            const statusEl = document.getElementById('rxjxt-live-status'); if(statusEl) statusEl.innerText = stat;
        };

        window.rxjxtVoiceWatcher = setInterval(() => {
            if (window.rxjxtDeafenToggle) {
                const inVC = !!document.querySelector('button[aria-label="Disconnect"]') || !!document.querySelector('button[aria-label="Disconnect from Voice"]');
                if (!inVC) {
                    rxjxtLog('DEAFEN', "Left VC. Auto-stopping...", "warn");
                    rxjxtShowToast('Voice Disconnected', 'Auto-stopping Fake Deafen.', 'error');
                    const toggle = document.getElementById('rxjxt-deafen-toggle');
                    if (toggle) { toggle.checked = false; toggle.dispatchEvent(new Event('change')); } 
                    else { window.rxjxtDeafenToggle = false; if(window.rxjxtDeafenEngine) window.rxjxtDeafenEngine.stop(rxjxtLog, () => {}); }
                }
            }
        }, 1000);

        window.rxjxtTimer = setInterval(() => {
            if (currentSecondsLeft > 0 && window.rxjxtGrindToggle) {
                currentSecondsLeft--; window.rxjxtCurrentSecondsDone++;
                
                let pct = (window.rxjxtCurrentSecondsDone / window.rxjxtTotalSeconds) * 100;
                pct = Math.max(0, Math.min(100, pct)); 
                window.rxjxtCurrentProg = pct;

                const pText = document.getElementById('rxjxt-pct'); if(pText) pText.innerText = `${Math.floor(pct)}%`;
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
                btn.style.cssText = 'display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; margin-left: 8px; margin-right: 4px;';
                
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
                const hRing = document.getElementById('rxjxt-header-ring');
                if (hRing) {
                    let rCol = window.rxjxtGrindToggle ? '#30D158' : '#FF453A'; let pct = window.rxjxtGrindToggle ? window.rxjxtCurrentProg : 100;
                    hRing.style.backgroundImage = `conic-gradient(${rCol} 0%, ${rCol} ${pct}%, transparent ${pct}%, transparent 100%)`; hRing.style.backgroundColor = `rgba(255,255,255,0.08)`;
                    if (window.rxjxtUpdateAvailable) hRing.classList.add('rxjxt-update-blink');
                }
            }
        };
        window.rxjxtToolbarInterval = setInterval(rxjxtEnsureIcon, 1000);
        rxjxtInjectUI(); rxjxtLog('HUB', "v14.0.0 Stable Build Loaded.", "brand");
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
