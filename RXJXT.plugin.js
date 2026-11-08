/**
 * @name RXJXTQuestDashboard
 * @author RXJXT
 * @description RXJXT Liquid Hub: v17.0.0 (Deep Webpack Traversal VC Joiner)
 * @version 17.0.0
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
        window.rxjxtQuestFound = false; window.rxjxtQuestScanTimer = null;
        window.rxjxtCurrentProg = 0; window.rxjxtTotalSeconds = 0; window.rxjxtCurrentSecondsDone = 0; window.rxjxtUpdateAvailable = false;
        console.clear();
        
        const RXJXT_HUB_VER = "17.0.0";
        const RXJXT_REPO_BASE = "https://raw.githubusercontent.com/rxjxt-1/RXJXT-Quest-Tool/main/";
        const RXJXT_HUB_URL = RXJXT_REPO_BASE + "RXJXT.plugin.js";
        const RXJXT_QUEST_URL = RXJXT_REPO_BASE + "QuestEngine.js";
        const RXJXT_DEAFEN_URL = RXJXT_REPO_BASE + "DeafenEngine.js";

        const CUSTOM_LOGO_URL = "https://i.ibb.co/KcS5f6yT/b3e66a70-76a7-455b-8c40-6fccf7dc6193-1.png"; 
        const SHOVEL_DIG_GIF_URL = "https://media.tenor.com/xZ1kJC5YpzMAAAAj/shovel-digging.gif";
        const DEVELOPER_ID = "1262670730865283076"; 

        const rxjxtLog = (app, msg, type = "info") => {
            const colors = { info: "#c8c8cc", success: "#ff3045", warn: "#ff7280", error: "#ff3045", brand: "#ff3045", finish: "#ffffff" };
            const color = colors[type] || colors.info;
            console.log(`%c[ ${_k} | ${app} ]%c ${msg}`, `color: #000; background: ${color}; font-weight: bold; border-radius: 4px; padding: 2px 6px;`, `color: ${color}; font-weight: 500; padding-left: 5px;`);

            const logBox = document.getElementById(app === 'QUEST' ? 'rxjxt-terminal-quest' : 'rxjxt-terminal-deafen');
            if (logBox) {
                const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
                const logEntry = document.createElement('div'); logEntry.style.marginBottom = "6px";
                logEntry.style.animation = "rxjxtFadeIn 0.3s ease forwards";
                logEntry.innerHTML = `<span style="color: rgba(255,255,255,0.3); font-size: 11px; font-weight: 500; margin-right: 6px;">[${time}]</span> <span style="color: ${color}; font-weight: 500; text-shadow: 0 0 8px ${color}40;">${msg}</span>`;
                logBox.appendChild(logEntry); logBox.scrollTop = logBox.scrollHeight;
            }
        };

        const rxjxtShowToast = (title, message, type = 'info') => {
            const container = document.getElementById('rxjxt-toast-container');
            if (!container) return;
            
            const toast = document.createElement('div');
            toast.className = `rxjxt-toast toast-${type}`;
            
            let icon = '';
            if (type === 'success') icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:14px; height:14px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
            else if (type === 'error') icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:14px; height:14px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;
            else icon = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" style="width:14px; height:14px;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;

            toast.innerHTML = `<div class="rxjxt-toast-icon">${icon}</div><div class="rxjxt-toast-text"><span style="color:rgba(255,255,255,0.6); font-size: 11px; display:block; margin-bottom: 2px;">${title}</span><span style="font-size: 13px;">${message}</span></div>`;
            
            container.appendChild(toast);
            
            setTimeout(() => toast.classList.add('show'), 10);
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 500);
            }, 3500);
        };

        const rxjxtIsQuestName = value => {
            const name = String(value ?? '').trim();
            return !!name && !/^(none|none selected|no (?:active )?quests?(?: found| available)?|quest not found|searching(?: for)? quest|idle|n\/a)$/i.test(name);
        };
        const rxjxtIsConnectedToVC = () => !!document.querySelector('button[aria-label="Disconnect"]') || !!document.querySelector('button[aria-label="Disconnect from Voice"]');

        const rxjxtInjectUI = () => {
            if (document.getElementById('rxjxt-overlay')) return;
            const style = document.createElement('style'); style.id = "rxjxt-styles";
            style.innerHTML = `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                
                @keyframes rxjxtFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes rxjxtScaleUp { from { opacity: 0; transform: scale(0.92) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                @keyframes rxjxtPulseUpdate { 0% { box-shadow: 0 0 0 0 rgba(50, 173, 230, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(50, 173, 230, 0); } 100% { box-shadow: 0 0 0 0 rgba(50, 173, 230, 0); } }

                #rxjxt-overlay { 
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(5, 5, 8, 0.6); backdrop-filter: blur(24px) saturate(160%); -webkit-backdrop-filter: blur(24px) saturate(160%);
                    z-index: 9999999; display: flex; flex-direction: column; justify-content: center; align-items: center;
                    opacity: 0; pointer-events: none; transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    font-family: "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif; color: #fff;
                }
                #rxjxt-overlay.rxjxt-open { opacity: 1; pointer-events: auto; }

                #rxjxt-main-dashboard {
                    width: 760px; max-width: 90vw; display: flex; flex-direction: column; gap: 20px;
                    opacity: 0; transform: scale(0.95); transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                #rxjxt-overlay.rxjxt-open #rxjxt-main-dashboard { opacity: 1; transform: scale(1); }

                .rxjxt-top-bar {
                    display: flex; justify-content: space-between; align-items: center;
                    background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
                    border-top: 1px solid rgba(255, 255, 255, 0.15); border-left: 1px solid rgba(255, 255, 255, 0.1);
                    border-right: 1px solid rgba(0, 0, 0, 0.2); border-bottom: 1px solid rgba(0, 0, 0, 0.2);
                    border-radius: 100px; padding: 10px 18px; box-shadow: 0 15px 35px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.1);
                }
                .rxjxt-nav-group { display: flex; gap: 8px; align-items: center; }
                
                .rxjxt-nav-item { 
                    display: flex; align-items: center; gap: 8px; padding: 10px 22px; border-radius: 100px; cursor: pointer; 
                    background: transparent; border: 1px solid transparent; box-sizing: border-box;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); color: rgba(255,255,255,0.5); font-weight: 600; font-size: 14.5px;
                }
                .rxjxt-nav-item:hover { color: #fff; background: rgba(255,255,255,0.05); }
                .rxjxt-nav-item:active { transform: scale(0.95); }
                
                .rxjxt-nav-item[data-target="quest"].active { 
                    background: rgba(48, 209, 88, 0.15); color: #30D158; border: 1px solid rgba(48, 209, 88, 0.2); box-shadow: 0 4px 15px rgba(0,0,0,0.2), inset 0 1px 3px rgba(48, 209, 88, 0.3);
                }
                .rxjxt-nav-item[data-target="deafen"].active { 
                    background: rgba(255, 69, 58, 0.15); color: #FF453A; border: 1px solid rgba(255, 69, 58, 0.2); box-shadow: 0 4px 15px rgba(0,0,0,0.2), inset 0 1px 3px rgba(255, 69, 58, 0.3);
                }
                .rxjxt-nav-item svg { width: 18px; height: 18px; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                .rxjxt-nav-item.active svg { transform: scale(1.15); }

                #rxjxt-update-hub { 
                    display: none; align-items: center; gap: 8px; padding: 10px 20px; font-size: 13.5px; font-weight: 700;
                    background: linear-gradient(135deg, rgba(50, 173, 230, 0.2), rgba(50, 173, 230, 0.05)); color: #32ADE6; 
                    border: 1px solid rgba(50, 173, 230, 0.4); border-radius: 100px; cursor: pointer;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2);
                    animation: rxjxtPulseUpdate 2s infinite; transition: all 0.3s;
                }
                #rxjxt-update-hub:hover { background: rgba(50, 173, 230, 0.3); color: #fff; transform: translateY(-2px); }
                #rxjxt-update-hub svg { width: 16px; height: 16px; }

                .rxjxt-close-btn {
                    width: 38px; height: 38px; border-radius: 50%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                    display: flex; justify-content: center; align-items: center; cursor: pointer; font-size: 14px; color: rgba(255,255,255,0.6); transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .rxjxt-close-btn:hover { background: rgba(255,45,85,0.9); color: #fff; transform: rotate(90deg) scale(1.1); border-color: rgba(255,255,255,0.4); box-shadow: 0 4px 15px rgba(255,45,85,0.4); }

                .rxjxt-view { display: none; grid-template-columns: 1fr 1fr; gap: 20px; }
                .rxjxt-view.active { display: grid; }
                
                .rxjxt-glass-card {
                    background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%);
                    backdrop-filter: blur(30px) saturate(200%); -webkit-backdrop-filter: blur(30px) saturate(200%);
                    border-top: 1px solid rgba(255, 255, 255, 0.15); border-left: 1px solid rgba(255, 255, 255, 0.1);
                    border-right: 1px solid rgba(0, 0, 0, 0.3); border-bottom: 1px solid rgba(0, 0, 0, 0.3);
                    border-radius: 28px; padding: 26px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.08);
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); display: flex; flex-direction: column; gap: 16px;
                }
                .rxjxt-glass-card:hover { transform: translateY(-3px); box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.15); }
                .rxjxt-card-full { grid-column: 1 / -1; }

                .theme-stealth .rxjxt-mode-indicator { color: #30D158; text-shadow: 0 0 12px rgba(48,209,88,0.5); }
                .theme-rage .rxjxt-glass-card { 
                    background: linear-gradient(135deg, rgba(255, 69, 58, 0.06) 0%, rgba(0, 0, 0, 0.2) 100%);
                    border-top: 1px solid rgba(255, 69, 58, 0.3); border-left: 1px solid rgba(255, 69, 58, 0.15);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 10px rgba(255, 69, 58, 0.1);
                }
                .theme-rage .rxjxt-mode-indicator { color: #FF453A; text-shadow: 0 0 15px rgba(255,69,58,0.7); }
                .theme-deafen-on .rxjxt-deafen-card {
                    background: linear-gradient(135deg, rgba(255, 69, 58, 0.06) 0%, rgba(0, 0, 0, 0.2) 100%);
                    border-top: 1px solid rgba(255, 69, 58, 0.3); border-left: 1px solid rgba(255, 69, 58, 0.15);
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5), inset 0 1px 10px rgba(255, 69, 58, 0.1);
                }

                .rxjxt-card-header { display: flex; justify-content: space-between; align-items: center; }
                .rxjxt-card-title { font-size: 16px; font-weight: 600; color: rgba(255,255,255,0.9); display: flex; align-items: center; gap: 10px; }
                .rxjxt-card-title svg { color: rgba(255,255,255,0.5); }

                #rxjxt-deafen-mic { width: 24px; height: 24px; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); transform-origin: center; }
                .theme-deafen-on #rxjxt-deafen-mic { color: #FF453A; filter: drop-shadow(0 0 12px rgba(255,69,58,0.8)); transform: scale(1.05); }

                .rxjxt-toggle { position: relative; display: inline-block; width: 52px; height: 30px; }
                .rxjxt-toggle input { opacity: 0; width: 0; height: 0; }
                .rxjxt-slider { 
                    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; 
                    background-color: rgba(0,0,0,0.5); border-radius: 34px; 
                    box-shadow: inset 0 2px 8px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.08);
                    transition: .4s cubic-bezier(0.16, 1, 0.3, 1); 
                }
                .rxjxt-slider:before { 
                    position: absolute; content: ""; height: 22px; width: 22px; left: 4px; bottom: 4px; 
                    background-color: #aaa; border-radius: 50%; box-shadow: 0 2px 6px rgba(0,0,0,0.5);
                    transition: .4s cubic-bezier(0.16, 1, 0.3, 1); 
                }
                input:checked + .rxjxt-slider:before { background-color: #fff; transform: translateX(22px); box-shadow: 0 2px 8px rgba(0,0,0,0.6), inset 0 -2px 4px rgba(0,0,0,0.1); }
                input:active + .rxjxt-slider:before { width: 28px; }
                input:checked:active + .rxjxt-slider:before { transform: translateX(16px); }

                .theme-stealth input:checked + .rxjxt-slider { background-color: rgba(48,209,88,0.8); box-shadow: inset 0 2px 6px rgba(0,0,0,0.3), 0 0 15px rgba(48,209,88,0.4); border-color: rgba(48,209,88,0.4); }
                .theme-rage input:checked + .rxjxt-slider { background-color: rgba(255,69,58,0.8); box-shadow: inset 0 2px 6px rgba(0,0,0,0.3), 0 0 15px rgba(255,69,58,0.4); border-color: rgba(255,69,58,0.4); }
                .theme-deafen-on input:checked + .rxjxt-slider { background-color: rgba(255,69,58,0.8); box-shadow: inset 0 2px 6px rgba(0,0,0,0.3), 0 0 15px rgba(255,69,58,0.4); border-color: rgba(255,69,58,0.4); }

                #rxjxt-mode-btn {
                    padding: 8px 18px; font-size: 13px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;
                    background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 14px; cursor: pointer; color: #fff; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: inset 0 1px 1px rgba(255,255,255,0.1);
                }
                .theme-stealth #rxjxt-mode-btn:hover { background: rgba(48, 209, 88, 0.2); border-color: rgba(48, 209, 88, 0.4); color: #30D158; text-shadow: 0 0 8px rgba(48, 209, 88, 0.5); transform: translateY(-2px); }
                .theme-rage #rxjxt-mode-btn { background: rgba(255, 69, 58, 0.15); border-color: rgba(255, 69, 58, 0.5); color: #FF453A; text-shadow: 0 0 10px rgba(255, 69, 58, 0.6); box-shadow: 0 4px 15px rgba(255, 69, 58, 0.2); }
                .theme-rage #rxjxt-mode-btn:hover { background: rgba(255, 69, 58, 0.3); transform: translateY(-2px); }
                #rxjxt-mode-btn:active { transform: scale(0.95); }

                .rxjxt-label { font-size: 12.5px; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.5px; font-weight: 700; margin-bottom: 6px; display: block; }
                .rxjxt-value { font-size: 16px; font-weight: 600; color: #fff; margin-bottom: 8px; }
                .rxjxt-eta-badge { background: rgba(0,0,0,0.5); padding: 5px 12px; border-radius: 10px; font-family: "SF Mono", monospace; font-size: 13.5px; font-weight: 600; border: 1px solid rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); box-shadow: inset 0 2px 5px rgba(0,0,0,0.5); }

                .rxjxt-progress-bg { width: 100%; height: 12px; background: rgba(0,0,0,0.5); border-radius: 12px; overflow: hidden; box-shadow: inset 0 2px 6px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.05); }
                .rxjxt-progress-fill { height: 100%; width: 0%; border-radius: 12px; transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s, box-shadow 0.4s; }
                .theme-stealth .rxjxt-progress-fill { background: linear-gradient(90deg, #30D158, #23a559); box-shadow: inset 0 1px 2px rgba(255,255,255,0.4), 0 0 15px rgba(48, 209, 88, 0.5); }
                .theme-rage .rxjxt-progress-fill { background: linear-gradient(90deg, #FF453A, #FF375F); box-shadow: inset 0 1px 2px rgba(255,255,255,0.4), 0 0 15px rgba(255, 69, 58, 0.5); }

                .rxjxt-terminal { background: rgba(0, 0, 0, 0.5); border-radius: 18px; padding: 18px; height: 150px; overflow-y: auto; font-family: "SF Mono", monospace; font-size: 12.5px; box-shadow: inset 0 6px 15px rgba(0,0,0,0.7), inset 0 1px 3px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.05); border: 1px solid transparent; }
                .rxjxt-terminal::-webkit-scrollbar { width: 6px; } .rxjxt-terminal::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; } .rxjxt-terminal::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.25); }

                .rxjxt-view.active > div:nth-child(1) { animation: rxjxtScaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.05s forwards; opacity: 0; }
                .rxjxt-view.active > div:nth-child(2) { animation: rxjxtScaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards; opacity: 0; }
                .rxjxt-view.active > div:nth-child(3) { animation: rxjxtScaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards; opacity: 0; }
                .rxjxt-view.active > div:nth-child(4) { animation: rxjxtScaleUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards; opacity: 0; }

                #rxjxt-header-btn { margin-left: 8px !important; margin-right: 4px !important; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                #rxjxt-header-ring { width: 34px; height: 34px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: inset 0 0 0 1px rgba(255,255,255,0.15); overflow: hidden; transform: translateZ(0); transition: all 0.4s; }
                #rxjxt-header-inner { width: 28px; height: 28px; background: #1c1c1e; border-radius: 50%; display: flex; justify-content: center; align-items: center; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.6); z-index: 2; }
                .rxjxt-custom-logo { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; transition: 0.4s; }
                #rxjxt-header-btn:hover #rxjxt-header-inner { transform: scale(1.12); }
                #rxjxt-header-btn.rxjxt-pressed #rxjxt-header-inner { transform: scale(0.85); box-shadow: inset 0 2px 8px rgba(0,0,0,0.8); }

                #rxjxt-toast-container { position: fixed; top: 40px; left: 50%; transform: translateX(-50%); z-index: 999999999; display: flex; flex-direction: column; gap: 10px; align-items: center; pointer-events: none; }
                .rxjxt-toast { background: rgba(15, 15, 18, 0.85); backdrop-filter: blur(25px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 100px; padding: 12px 24px 12px 16px; color: #fff; font-family: "SF Pro Display", sans-serif; font-size: 14px; display: flex; align-items: center; gap: 14px; box-shadow: 0 15px 40px rgba(0,0,0,0.5); transform: translateY(-30px) scale(0.9); opacity: 0; transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
                .rxjxt-toast.show { transform: translateY(0) scale(1); opacity: 1; }
                .rxjxt-toast-icon { width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
                .toast-success .rxjxt-toast-icon { background: linear-gradient(135deg, #30D158, #23a559); color: #fff; } .toast-error .rxjxt-toast-icon { background: linear-gradient(135deg, #FF453A, #FF375F); color: #fff; } .toast-info .rxjxt-toast-icon { background: linear-gradient(135deg, #0A84FF, #5E5CE6); color: #fff; }

                #rxjxt-popup { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); z-index: 200; display: none; flex-direction: column; justify-content: center; align-items: center; border-radius: inherit; }
                .rxjxt-popup-content { background: linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)); backdrop-filter: blur(40px); border-top: 1px solid rgba(255,255,255,0.2); border-left: 1px solid rgba(255,255,255,0.1); padding: 36px; border-radius: 28px; text-align: center; box-shadow: 0 25px 60px rgba(0,0,0,0.6); max-width: 340px; animation: rxjxtScaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
                .rxjxt-popup-title { font-size: 19px; font-weight: 700; margin-bottom: 12px; } .rxjxt-popup-text { font-size: 14.5px; color: rgba(255,255,255,0.7); margin-bottom: 26px; line-height: 1.5; }
                .rxjxt-popup-actions { display: flex; gap: 14px; justify-content: center; } 
                .rxjxt-action-btn { background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 12px 26px; font-size: 14px; font-weight: 600; cursor: pointer; border-radius: 100px; transition: 0.3s; }
                .rxjxt-action-btn.primary { background: linear-gradient(180deg, #1A90FF 0%, #007AFF 100%); border: none; box-shadow: 0 4px 15px rgba(10, 132, 255, 0.4), inset 0 1px 1px rgba(255,255,255,0.3); } 
                .rxjxt-action-btn:hover { transform: scale(1.05); } .rxjxt-action-btn:active { transform: scale(0.95); }
                
                .rxjxt-footer { text-align: center; margin-top: 5px; font-size: 12.5px; font-weight: 600; color: rgba(255,255,255,0.3); } .rxjxt-footer a { color: rgba(255,255,255,0.6); text-decoration: none; transition: 0.3s; } .rxjxt-footer a:hover { color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.3); }

                /* RXJXT premium monochrome / crimson finish */
                #rxjxt-overlay, #rxjxt-toast-container {
                    --rxjxt-red: #ff3045;
                    --rxjxt-red-soft: rgba(255, 48, 69, 0.16);
                    --rxjxt-red-line: rgba(255, 48, 69, 0.36);
                    --rxjxt-black: #000;
                    --rxjxt-white: #f7f7f8;
                }
                #rxjxt-overlay {
                    background: rgba(0, 0, 0, 0.88);
                    backdrop-filter: blur(28px) saturate(115%);
                    -webkit-backdrop-filter: blur(28px) saturate(115%);
                }
                #rxjxt-main-dashboard {
                    gap: 16px;
                    transform: perspective(1400px) translateY(18px) scale(.94) rotateX(4deg);
                    transform-origin: 50% 55%;
                    transition: opacity .48s cubic-bezier(.16, 1, .3, 1), transform .72s cubic-bezier(.16, 1, .3, 1), filter .72s cubic-bezier(.16, 1, .3, 1);
                    filter: blur(8px);
                    will-change: transform, opacity, filter;
                }
                #rxjxt-overlay.rxjxt-open #rxjxt-main-dashboard {
                    transform: perspective(1400px) translateY(0) scale(1) rotateX(0);
                    filter: blur(0);
                }
                .rxjxt-top-bar {
                    position: relative;
                    background: linear-gradient(120deg, rgba(20,20,20,.96), rgba(3,3,3,.94));
                    border: 1px solid rgba(255,255,255,.12);
                    box-shadow: 0 22px 70px rgba(0,0,0,.82), 0 0 34px rgba(255,48,69,.08), inset 0 1px 0 rgba(255,255,255,.1);
                    padding: 10px 14px;
                    backdrop-filter: blur(24px);
                }
                .rxjxt-nav-item { color: rgba(255,255,255,.56); letter-spacing: .01em; }
                .rxjxt-nav-item:hover { color: #fff; background: rgba(255,255,255,.075); }
                .rxjxt-nav-item[data-target="quest"].active,
                .rxjxt-nav-item[data-target="deafen"].active {
                    color: var(--rxjxt-white);
                    background: linear-gradient(135deg, rgba(255,48,69,.24), rgba(255,48,69,.08));
                    border: 1px solid var(--rxjxt-red-line);
                    box-shadow: 0 5px 24px rgba(255,48,69,.16), inset 0 1px 0 rgba(255,255,255,.12);
                }
                .rxjxt-nav-item.active svg { color: var(--rxjxt-red); filter: drop-shadow(0 0 8px rgba(255,48,69,.45)); }
                #rxjxt-update-hub {
                    color: #fff; background: linear-gradient(135deg, #ff3045, #9e1020);
                    border: 1px solid rgba(255,255,255,.22); box-shadow: 0 8px 28px rgba(255,48,69,.24), inset 0 1px 0 rgba(255,255,255,.28);
                    animation: rxjxtPulseUpdate 2.4s infinite;
                }
                #rxjxt-update-hub:hover { background: linear-gradient(135deg, #ff5263, #b91428); color: #fff; transform: translateY(-2px) scale(1.025); }
                .rxjxt-close-btn { background: rgba(255,255,255,.045); border-color: rgba(255,255,255,.14); color: rgba(255,255,255,.72); }
                .rxjxt-close-btn:hover { background: var(--rxjxt-red); border-color: rgba(255,255,255,.45); box-shadow: 0 0 24px rgba(255,48,69,.38); }
                .rxjxt-glass-card {
                    position: relative;
                    background: linear-gradient(145deg, rgba(15,15,16,.98), rgba(2,2,2,.98));
                    border: 1px solid rgba(255,255,255,.095);
                    border-top-color: rgba(255,255,255,.19);
                    border-radius: 24px;
                    box-shadow: 0 26px 64px rgba(0,0,0,.72), inset 0 1px 0 rgba(255,255,255,.075);
                    transform: perspective(1100px) rotateX(var(--rxjxt-card-tilt-y, 0deg)) rotateY(var(--rxjxt-card-tilt-x, 0deg)) translateY(var(--rxjxt-card-lift, 0px));
                    transform-style: preserve-3d;
                    transition: transform .24s cubic-bezier(.2,.8,.2,1), border-color .35s ease, box-shadow .35s ease, background .35s ease;
                    will-change: transform;
                }
                .rxjxt-glass-card:hover {
                    --rxjxt-card-lift: -4px;
                    border-color: rgba(255,48,69,.3);
                    box-shadow: 0 34px 78px rgba(0,0,0,.82), 0 0 30px rgba(255,48,69,.07), inset 0 1px 0 rgba(255,255,255,.12);
                }
                .theme-rage .rxjxt-glass-card,
                .theme-deafen-on .rxjxt-deafen-card {
                    background: linear-gradient(145deg, rgba(22,5,7,.98), rgba(2,2,2,.98));
                    border-color: rgba(255,48,69,.24);
                    box-shadow: 0 26px 64px rgba(0,0,0,.78), inset 0 1px 0 rgba(255,255,255,.07);
                }
                .theme-stealth .rxjxt-mode-indicator,
                .theme-rage .rxjxt-mode-indicator,
                .theme-deafen-on #rxjxt-deafen-mic { color: var(--rxjxt-red); text-shadow: 0 0 14px rgba(255,48,69,.42); }
                #rxjxt-deafen-mic { transition: color .4s ease, filter .4s ease, transform .4s cubic-bezier(.16,1,.3,1); }
                .theme-deafen-on #rxjxt-deafen-mic { filter: drop-shadow(0 0 12px rgba(255,48,69,.62)); }
                .rxjxt-card-title { color: rgba(255,255,255,.94); }
                .rxjxt-card-title svg { color: rgba(255,255,255,.68); transition: color .3s ease, transform .4s cubic-bezier(.16,1,.3,1); }
                .rxjxt-glass-card:hover .rxjxt-card-title svg { color: var(--rxjxt-red); transform: translateZ(10px) scale(1.06); }
                .rxjxt-toggle input:checked + .rxjxt-slider,
                .theme-stealth input:checked + .rxjxt-slider,
                .theme-rage input:checked + .rxjxt-slider,
                .theme-deafen-on input:checked + .rxjxt-slider {
                    background: linear-gradient(110deg, #8f0c1b, #ff3045);
                    box-shadow: inset 0 2px 6px rgba(0,0,0,.35), 0 0 18px rgba(255,48,69,.3);
                }
                .rxjxt-slider:before { transition: width .24s cubic-bezier(.16,1,.3,1), transform .36s cubic-bezier(.16,1,.3,1), background .3s ease, box-shadow .3s ease; }
                #rxjxt-mode-btn { transition: transform .32s cubic-bezier(.16,1,.3,1), background .3s ease, color .3s ease, border-color .3s ease, box-shadow .3s ease; }
                .theme-stealth #rxjxt-mode-btn:hover,
                .theme-rage #rxjxt-mode-btn,
                .theme-rage #rxjxt-mode-btn:hover {
                    color: #fff; background: linear-gradient(135deg, rgba(255,48,69,.26), rgba(135,8,23,.28));
                    border-color: rgba(255,48,69,.5); text-shadow: 0 0 10px rgba(255,48,69,.45);
                    box-shadow: 0 8px 24px rgba(255,48,69,.16), inset 0 1px 0 rgba(255,255,255,.1);
                }
                .rxjxt-label { color: rgba(255,255,255,.48); letter-spacing: .11em; }
                .rxjxt-value { color: #fff; }
                .rxjxt-eta-badge { background: #030303; border-color: rgba(255,255,255,.11); color: rgba(255,255,255,.88); }
                .rxjxt-progress-bg { height: 9px; background: #030303; border: 1px solid rgba(255,255,255,.08); }
                .theme-stealth .rxjxt-progress-fill,
                .theme-rage .rxjxt-progress-fill {
                    background: linear-gradient(90deg, #8f0c1b, #ff3045 72%, #fff);
                    box-shadow: inset 0 1px 2px rgba(255,255,255,.38), 0 0 18px rgba(255,48,69,.38);
                }
                .rxjxt-terminal { background: #020202; border-color: rgba(255,255,255,.09); box-shadow: inset 0 8px 24px rgba(0,0,0,.9), 0 1px 0 rgba(255,255,255,.035); }
                .rxjxt-terminal::-webkit-scrollbar-thumb { background: rgba(255,255,255,.17); }
                .rxjxt-terminal::-webkit-scrollbar-thumb:hover { background: var(--rxjxt-red); }
                .rxjxt-terminal span { color: var(--rxjxt-red) !important; text-shadow: 0 0 10px rgba(255,48,69,.24) !important; }
                .rxjxt-terminal span:first-child { color: rgba(255,255,255,.38) !important; text-shadow: none !important; }
                .rxjxt-view.active > div:nth-child(n) { animation: rxjxtScaleUp .58s cubic-bezier(.16,1,.3,1) both; }
                .rxjxt-view.active > div:nth-child(1) { animation-delay: .04s; }
                .rxjxt-view.active > div:nth-child(2) { animation-delay: .09s; }
                .rxjxt-view.active > div:nth-child(3) { animation-delay: .14s; }
                .rxjxt-view.active > div:nth-child(4) { animation-delay: .19s; }
                #rxjxt-header-btn { filter: grayscale(1) contrast(1.15); }
                #rxjxt-header-ring { box-shadow: 0 0 0 1px rgba(255,255,255,.2), 0 0 18px rgba(255,48,69,.16) !important; }
                #rxjxt-header-inner { background: #030303; }
                #rxjxt-header-btn:hover #rxjxt-header-ring { box-shadow: 0 0 0 1px rgba(255,48,69,.7), 0 0 24px rgba(255,48,69,.36); }
                #rxjxt-toast-container { top: 34px; }
                .rxjxt-toast { background: rgba(5,5,5,.96); border-color: rgba(255,255,255,.13); box-shadow: 0 22px 60px rgba(0,0,0,.75), 0 0 25px rgba(255,48,69,.1); }
                .toast-success .rxjxt-toast-icon,
                .toast-error .rxjxt-toast-icon,
                .toast-info .rxjxt-toast-icon { background: linear-gradient(135deg, #ff3045, #870816); color: #fff; box-shadow: 0 0 18px rgba(255,48,69,.24); }
                #rxjxt-popup { background: rgba(0,0,0,.78); }
                .rxjxt-popup-content { background: linear-gradient(145deg, #121212, #020202); border: 1px solid rgba(255,255,255,.14); box-shadow: 0 32px 90px rgba(0,0,0,.85), 0 0 36px rgba(255,48,69,.11); }
                .rxjxt-popup-title { color: #fff; }
                .rxjxt-popup-text { color: rgba(255,255,255,.66); }
                .rxjxt-action-btn { background: rgba(255,255,255,.055); border-color: rgba(255,255,255,.14); transition: transform .28s cubic-bezier(.16,1,.3,1), background .28s ease, border-color .28s ease, box-shadow .28s ease; }
                .rxjxt-action-btn.primary { color: #fff; background: linear-gradient(135deg, #ff3045, #9a1021); box-shadow: 0 8px 24px rgba(255,48,69,.24), inset 0 1px 0 rgba(255,255,255,.25); }
                .rxjxt-action-btn:hover { transform: translateY(-2px) scale(1.035); border-color: rgba(255,48,69,.42); box-shadow: 0 10px 28px rgba(255,48,69,.15); }
                .rxjxt-action-btn:active { transform: translateY(1px) scale(.96); }
                .rxjxt-footer { color: rgba(255,255,255,.36); letter-spacing: .025em; }
                .rxjxt-footer a { color: rgba(255,255,255,.72); }
                .rxjxt-footer a:hover { color: var(--rxjxt-red); text-shadow: 0 0 12px rgba(255,48,69,.4); }
                #rxjxt-overlay button, #rxjxt-overlay .rxjxt-nav-item, #rxjxt-overlay .rxjxt-close-btn { -webkit-tap-highlight-color: transparent; }
                #rxjxt-overlay button:focus-visible, #rxjxt-overlay .rxjxt-nav-item:focus-visible, #rxjxt-overlay .rxjxt-close-btn:focus-visible { outline: 2px solid var(--rxjxt-red); outline-offset: 3px; }
                @keyframes rxjxtPulseUpdate { 0%,100% { box-shadow: 0 8px 26px rgba(255,48,69,.16), inset 0 1px 0 rgba(255,255,255,.25); } 50% { box-shadow: 0 8px 34px rgba(255,48,69,.36), inset 0 1px 0 rgba(255,255,255,.32); } }
                @media (max-width: 700px) {
                    #rxjxt-main-dashboard { width: min(94vw, 560px); max-height: 92vh; overflow-y: auto; padding: 4px; }
                    .rxjxt-top-bar { border-radius: 22px; gap: 8px; }
                    .rxjxt-nav-item { padding: 9px 13px; }
                    .rxjxt-view { grid-template-columns: 1fr; gap: 12px; }
                    .rxjxt-card-full { grid-column: auto; }
                    .rxjxt-glass-card { padding: 20px; }
                }
                @media (prefers-reduced-motion: reduce) {
                    #rxjxt-overlay *, #rxjxt-toast-container * { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .01ms !important; }
                }

                /* RXJXT command-center redesign */
                #rxjxt-overlay {
                    --rxjxt-red: #ff3045;
                    --rxjxt-white: #f6f6f7;
                    --rxjxt-muted: rgba(246,246,247,.48);
                    box-sizing: border-box;
                    overflow: auto;
                    padding: 34px 22px;
                    background: radial-gradient(ellipse at 50% 0%, rgba(117,9,25,.2), transparent 42%), rgba(0,0,0,.96);
                    perspective: 1600px;
                }
                #rxjxt-overlay::before {
                    content: "";
                    position: fixed;
                    inset: 0;
                    pointer-events: none;
                    background: radial-gradient(circle at 12% 82%, rgba(255,48,69,.055), transparent 25%), radial-gradient(circle at 88% 18%, rgba(255,255,255,.035), transparent 22%);
                }
                #rxjxt-main-dashboard {
                    position: relative;
                    isolation: isolate;
                    width: min(1120px, 94vw);
                    max-width: 94vw;
                    max-height: calc(100vh - 56px);
                    overflow: auto;
                    box-sizing: border-box;
                    padding: 20px;
                    gap: 17px;
                    border: 1px solid rgba(255,255,255,.13);
                    border-radius: 30px;
                    background: linear-gradient(145deg, rgba(15,15,16,.985), rgba(0,0,0,.995) 70%);
                    box-shadow: 0 45px 130px rgba(0,0,0,.9), 0 0 70px rgba(255,48,69,.09), inset 0 1px 0 rgba(255,255,255,.09);
                    transform: perspective(1500px) translateY(42px) scale(.92) rotateX(9deg) rotateY(-2deg);
                    transform-origin: 50% 42%;
                    filter: blur(12px);
                    transition: opacity .5s ease, transform .82s cubic-bezier(.16,1,.3,1), filter .65s ease, box-shadow .6s ease;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255,48,69,.42) transparent;
                }
                #rxjxt-main-dashboard::before {
                    content: "";
                    position: absolute;
                    inset: 0;
                    z-index: 0;
                    pointer-events: none;
                    border-radius: inherit;
                    background: radial-gradient(ellipse at 50% 0%, rgba(255,48,69,.11), transparent 42%), linear-gradient(120deg, rgba(255,255,255,.018), transparent 30%, rgba(255,255,255,.012));
                }
                #rxjxt-main-dashboard > * { position: relative; z-index: 1; }
                #rxjxt-main-dashboard > #rxjxt-popup { position: absolute; z-index: 200; }
                #rxjxt-overlay.rxjxt-open:not(.rxjxt-intro) #rxjxt-main-dashboard {
                    opacity: 1;
                    transform: perspective(1500px) translateY(0) scale(1) rotateX(0) rotateY(0);
                    filter: blur(0);
                }
                #rxjxt-overlay.rxjxt-intro #rxjxt-main-dashboard { opacity: 0; pointer-events: none; transform: perspective(1500px) translateY(55px) scale(.88) rotateX(13deg); filter: blur(16px); }
                #rxjxt-overlay:not(.rxjxt-open) #rxjxt-main-dashboard { opacity: 0; pointer-events: none; transform: perspective(1500px) translateY(42px) scale(.92) rotateX(9deg) rotateY(-2deg); filter: blur(12px); }
                .rxjxt-top-bar {
                    display: grid;
                    grid-template-columns: minmax(130px,1fr) auto minmax(240px,1fr);
                    align-items: center;
                    gap: 16px;
                    padding: 10px 12px;
                    border: 1px solid rgba(255,255,255,.095);
                    border-radius: 22px;
                    background: linear-gradient(110deg, rgba(28,28,29,.94), rgba(7,7,8,.97));
                    box-shadow: 0 12px 34px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.075);
                }
                .rxjxt-brand-lockup { display: flex; align-items: center; gap: 11px; min-width: 0; }
                .rxjxt-brand-mark {
                    width: 39px; height: 39px; display: grid; place-items: center; flex: 0 0 auto;
                    border: 1px solid rgba(255,48,69,.48); border-radius: 13px;
                    color: #fff; background: linear-gradient(145deg, rgba(255,48,69,.3), rgba(20,2,5,.94));
                    box-shadow: 0 0 24px rgba(255,48,69,.2), inset 0 1px 0 rgba(255,255,255,.25);
                    font-size: 12px; font-weight: 900; letter-spacing: .08em;
                    transform: perspective(300px) rotateY(-10deg);
                    transition: transform .4s cubic-bezier(.16,1,.3,1), box-shadow .4s ease;
                }
                .rxjxt-top-bar:hover .rxjxt-brand-mark { transform: perspective(300px) rotateY(10deg) rotateX(7deg) scale(1.04); box-shadow: 0 0 32px rgba(255,48,69,.32), inset 0 1px 0 rgba(255,255,255,.3); }
                .rxjxt-brand-copy { display: flex; flex-direction: column; gap: 3px; line-height: 1; }
                .rxjxt-brand-copy strong { color: #fff; font-size: 13px; letter-spacing: .14em; }
                .rxjxt-brand-copy span { color: rgba(255,255,255,.38); font-size: 8px; font-weight: 800; letter-spacing: .16em; }
                .rxjxt-top-bar > .rxjxt-nav-group:nth-of-type(2) { justify-content: center; gap: 5px; }
                .rxjxt-top-bar > .rxjxt-nav-group:last-child { justify-content: flex-end; gap: 10px; }
                .rxjxt-nav-item {
                    gap: 7px; padding: 10px 14px; border-radius: 13px;
                    color: rgba(255,255,255,.52); font-size: 12px; font-weight: 700;
                    transition: transform .3s cubic-bezier(.16,1,.3,1), background .3s ease, color .3s ease, box-shadow .3s ease;
                }
                .rxjxt-nav-item svg { width: 15px; height: 15px; }
                .rxjxt-nav-item:hover { transform: translateY(-2px); background: rgba(255,255,255,.055); }
                .rxjxt-nav-item[data-target="quest"].active, .rxjxt-nav-item[data-target="deafen"].active {
                    color: #fff; background: linear-gradient(135deg, rgba(255,48,69,.28), rgba(90,6,17,.24));
                    border: 1px solid rgba(255,48,69,.42); box-shadow: 0 6px 20px rgba(255,48,69,.14), inset 0 1px 0 rgba(255,255,255,.12);
                }
                .rxjxt-nav-item:active { transform: translateY(1px) scale(.96); }
                #rxjxt-update-hub { padding: 9px 12px; border-radius: 12px; font-size: 11px; animation: rxjxtButtonBreath 3.2s ease-in-out infinite; }
                .rxjxt-user-chip { display: flex; align-items: center; gap: 9px; min-width: 0; padding: 4px 11px 4px 5px; border: 1px solid rgba(255,255,255,.1); border-radius: 16px; background: rgba(255,255,255,.035); }
                .rxjxt-user-avatar-shell, .rxjxt-avatar-shell { position: relative; display: grid; place-items: center; overflow: hidden; border-radius: 50%; background: #151515; }
                .rxjxt-user-avatar-shell { width: 34px; height: 34px; flex: 0 0 auto; border: 1px solid rgba(255,255,255,.28); box-shadow: 0 0 16px rgba(255,48,69,.15); }
                .rxjxt-avatar-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; border-radius: inherit; }
                .rxjxt-avatar-img[hidden] { display: none; }
                .rxjxt-avatar-initials { display: grid; place-items: center; width: 100%; height: 100%; color: #fff; background: radial-gradient(circle at 28% 20%, rgba(255,48,69,.55), #100306 72%); font-weight: 800; letter-spacing: .04em; }
                .rxjxt-user-avatar-shell .rxjxt-avatar-initials { font-size: 11px; }
                .rxjxt-user-copy { min-width: 0; display: flex; flex-direction: column; gap: 3px; }
                .rxjxt-user-copy span { overflow: hidden; max-width: 110px; color: #fff; font-size: 11px; font-weight: 700; text-overflow: ellipsis; white-space: nowrap; }
                .rxjxt-user-copy small { color: rgba(255,255,255,.42); font-size: 9px; }
                .rxjxt-user-presence, .rxjxt-dashboard-eyebrow i, .rxjxt-session-card strong i, .rxjxt-progress-caption i { width: 6px; height: 6px; display: inline-block; border-radius: 50%; background: var(--rxjxt-red); box-shadow: 0 0 12px rgba(255,48,69,.78); }
                .rxjxt-user-presence { margin-left: 1px; animation: rxjxtDotPulse 2s ease-in-out infinite; }
                .rxjxt-close-btn { width: 34px; height: 34px; border-radius: 12px; font-size: 12px; }
                .rxjxt-close-btn:hover { transform: rotate(90deg) scale(1.06); }
                .rxjxt-dashboard-head { display: flex; justify-content: space-between; align-items: flex-end; gap: 22px; padding: 17px 8px 2px; }
                .rxjxt-dashboard-copy { min-width: 0; }
                .rxjxt-dashboard-eyebrow { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 12px; color: rgba(255,255,255,.45); font-size: 9px; font-weight: 800; letter-spacing: .19em; }
                .rxjxt-dashboard-eyebrow i { width: 5px; height: 5px; }
                .rxjxt-dashboard-head h1 { margin: 0; color: #fff; font-size: clamp(27px, 3.4vw, 40px); font-weight: 650; letter-spacing: -.045em; line-height: 1.08; }
                .rxjxt-dashboard-head h1 span { color: rgba(255,255,255,.47); font-weight: 450; }
                .rxjxt-dashboard-head p { margin: 10px 0 0; color: rgba(255,255,255,.46); font-size: 12px; letter-spacing: .01em; }
                .rxjxt-session-card { position: relative; display: grid; gap: 5px; min-width: 112px; overflow: hidden; padding: 12px 15px; border: 1px solid rgba(255,255,255,.09); border-radius: 16px; background: linear-gradient(145deg, rgba(24,24,25,.86), rgba(4,4,4,.94)); }
                .rxjxt-session-orbit { position: absolute; top: -23px; right: -6px; width: 72px; height: 72px; border: 1px solid rgba(255,48,69,.16); border-radius: 50%; box-shadow: 0 0 24px rgba(255,48,69,.08), inset 0 0 22px rgba(255,48,69,.06); animation: rxjxtOrbit 8s linear infinite; }
                .rxjxt-session-label { color: rgba(255,255,255,.38); font-size: 8px; font-weight: 800; letter-spacing: .16em; }
                .rxjxt-session-card strong { display: flex; align-items: center; gap: 7px; color: #fff; font-size: 11px; letter-spacing: .1em; }
                .rxjxt-session-card strong i { width: 5px; height: 5px; }
                .rxjxt-view { grid-template-columns: repeat(12, minmax(0,1fr)); gap: 14px; perspective: 1200px; }
                .rxjxt-view.active > div:nth-child(1), .rxjxt-view.active > div:nth-child(2) { grid-column: span 6; }
                .rxjxt-view.active > div:nth-child(n+3) { grid-column: 1 / -1; }
                .rxjxt-glass-card {
                    position: relative; isolation: isolate; overflow: hidden; min-width: 0;
                    padding: 22px 24px; border: 1px solid rgba(255,255,255,.105); border-top-color: rgba(255,255,255,.18); border-radius: 22px;
                    background: radial-gradient(circle at var(--rxjxt-pointer-x,50%) var(--rxjxt-pointer-y,50%), rgba(255,48,69,.12), transparent 43%), linear-gradient(145deg, rgba(22,22,23,.96), rgba(5,5,6,.98));
                    box-shadow: 0 18px 42px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.055);
                    transform: perspective(1050px) rotateX(var(--rxjxt-card-tilt-y,0deg)) rotateY(var(--rxjxt-card-tilt-x,0deg)) translateY(var(--rxjxt-card-lift,0px));
                    transform-style: preserve-3d;
                    transition: transform .2s cubic-bezier(.2,.8,.2,1), border-color .35s ease, box-shadow .35s ease, background .35s ease;
                    will-change: transform;
                }
                .rxjxt-glass-card::after { content: ""; position: absolute; inset: 0; z-index: -1; pointer-events: none; opacity: 0; background: linear-gradient(115deg, transparent 18%, rgba(255,255,255,.045) 40%, transparent 61%); transform: translateX(-55%); transition: opacity .3s ease, transform .75s cubic-bezier(.16,1,.3,1); }
                .rxjxt-glass-card:hover { --rxjxt-card-lift: -5px; z-index: 2; border-color: rgba(255,48,69,.32); box-shadow: 0 28px 60px rgba(0,0,0,.7), 0 0 30px rgba(255,48,69,.09), inset 0 1px 0 rgba(255,255,255,.12); }
                .rxjxt-glass-card:hover::after { opacity: 1; transform: translateX(55%); }
                .rxjxt-glass-card > * { transform: translateZ(12px); }
                .rxjxt-card-header { margin-bottom: 13px; }
                .rxjxt-card-title { color: rgba(255,255,255,.92); font-size: 14px; font-weight: 650; letter-spacing: .005em; }
                .rxjxt-card-title svg { color: var(--rxjxt-red); }
                .rxjxt-label { margin-bottom: 8px; color: rgba(255,255,255,.4); font-size: 9px; letter-spacing: .16em; }
                .rxjxt-value { margin-bottom: 0; color: #fff; font-size: clamp(20px,2.5vw,27px); font-weight: 620; letter-spacing: -.035em; }
                #rxjxt-live-status { display: flex; align-items: center; gap: 9px; }
                #rxjxt-live-status::before { content: ""; width: 7px; height: 7px; flex: 0 0 auto; border-radius: 50%; background: var(--rxjxt-red); box-shadow: 0 0 14px rgba(255,48,69,.7); animation: rxjxtDotPulse 2.4s ease-in-out infinite; }
                #rxjxt-mode-btn { padding: 9px 13px; border-radius: 12px; background: rgba(255,255,255,.045); border-color: rgba(255,255,255,.13); font-size: 10px; }
                .theme-stealth #rxjxt-mode-btn:hover, .theme-rage #rxjxt-mode-btn, .theme-rage #rxjxt-mode-btn:hover { color: #fff; background: linear-gradient(135deg, rgba(255,48,69,.28), rgba(95,7,18,.3)); border-color: rgba(255,48,69,.48); }
                .rxjxt-progress-caption { display: flex; justify-content: space-between; align-items: center; margin: 2px 0 -7px; color: rgba(255,255,255,.4); font-size: 8px; font-weight: 800; letter-spacing: .14em; }
                .rxjxt-progress-caption span:last-child { display: inline-flex; align-items: center; gap: 6px; color: rgba(255,255,255,.63); }
                .rxjxt-progress-caption i { width: 5px; height: 5px; animation: rxjxtDotPulse 1.8s ease-in-out infinite; }
                .rxjxt-progress-bg { position: relative; height: 10px; overflow: hidden; border: 1px solid rgba(255,255,255,.085); background: #030303; box-shadow: inset 0 2px 7px rgba(0,0,0,.9), 0 1px 0 rgba(255,255,255,.035); }
                .rxjxt-progress-bg::after { content: ""; position: absolute; z-index: 2; top: 0; bottom: 0; left: -35%; width: 28%; pointer-events: none; background: linear-gradient(90deg, transparent, rgba(255,255,255,.18), rgba(255,48,69,.2), transparent); filter: blur(2px); animation: rxjxtTrackSweep 3.6s ease-in-out infinite; }
                .rxjxt-progress-fill { position: relative; overflow: hidden; background: linear-gradient(90deg,#750917,#e51d32 68%,#ff5263); box-shadow: 0 0 17px rgba(255,48,69,.42); }
                .rxjxt-progress-fill::after { content: ""; position: absolute; inset: -80% auto -80% -45%; width: 30%; transform: skewX(-20deg); background: linear-gradient(90deg,transparent,rgba(255,255,255,.72),transparent); animation: rxjxtFillGleam 2.6s ease-in-out infinite; }
                .theme-stealth .rxjxt-progress-fill, .theme-rage .rxjxt-progress-fill { background: linear-gradient(90deg,#750917,#e51d32 68%,#ff5263); box-shadow: 0 0 17px rgba(255,48,69,.42); }
                .rxjxt-eta-badge { padding: 7px 11px; border-color: rgba(255,255,255,.1); border-radius: 11px; background: rgba(0,0,0,.65); font-size: 11px; }
                .rxjxt-terminal { height: 138px; padding: 14px 16px; border: 1px solid rgba(255,255,255,.075); border-radius: 15px; background: rgba(0,0,0,.78); font-size: 10px; line-height: 1.75; }
                .rxjxt-terminal span { color: var(--rxjxt-red) !important; }
                .rxjxt-terminal span:first-child { color: rgba(255,255,255,.34) !important; }
                .rxjxt-deafen-card { min-height: 96px; }
                .rxjxt-toggle { width: 48px; height: 27px; }
                .rxjxt-slider:before { width: 19px; height: 19px; left: 4px; bottom: 4px; }
                input:checked + .rxjxt-slider:before { transform: translateX(21px); }
                input:checked:active + .rxjxt-slider:before { transform: translateX(15px); }
                .rxjxt-footer { padding: 0 0 3px; color: rgba(255,255,255,.3); font-size: 9px; letter-spacing: .08em; }
                .rxjxt-welcome {
                    position: absolute; z-index: 5; top: 50%; left: 50%; display: flex; flex-direction: column; align-items: center;
                    width: min(560px, 88vw); padding: 32px; text-align: center; pointer-events: none;
                    opacity: 0; transform: translate(-50%,-46%) perspective(1000px) rotateX(-16deg) scale(.78); filter: blur(16px);
                    transition: opacity .48s ease, transform .72s cubic-bezier(.16,1,.3,1), filter .5s ease;
                }
                #rxjxt-overlay.rxjxt-open.rxjxt-intro .rxjxt-welcome {
                    opacity: 1; transform: translate(-50%,-50%) perspective(1000px) rotateX(0) scale(1); filter: blur(0);
                    animation: rxjxtWelcomeArrive .9s cubic-bezier(.16,1,.3,1) both;
                }
                .rxjxt-avatar-shell { width: 112px; height: 112px; margin-bottom: 25px; border: 1px solid rgba(255,255,255,.38); box-shadow: 0 0 0 8px rgba(255,255,255,.035), 0 0 70px rgba(255,48,69,.3), 0 26px 70px rgba(0,0,0,.75); }
                .rxjxt-welcome-orbit::before, .rxjxt-welcome-orbit::after { content: ""; position: absolute; inset: -13px; border: 1px solid rgba(255,48,69,.33); border-radius: 50%; transform: rotateX(67deg) rotateZ(-20deg); animation: rxjxtAvatarOrbit 5s linear infinite; }
                .rxjxt-welcome-orbit::after { inset: -21px; border-color: rgba(255,255,255,.14); transform: rotateX(70deg) rotateZ(35deg); animation-duration: 7s; animation-direction: reverse; }
                .rxjxt-welcome-orbit .rxjxt-avatar-initials { font-size: 31px; }
                .rxjxt-welcome-kicker { display: flex; align-items: center; gap: 9px; color: rgba(255,255,255,.49); font-size: 9px; font-weight: 800; letter-spacing: .2em; }
                .rxjxt-welcome-live-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--rxjxt-red); box-shadow: 0 0 14px var(--rxjxt-red); animation: rxjxtDotPulse 1.8s infinite; }
                .rxjxt-welcome h1 { margin: 16px 0 7px; color: #fff; font-size: clamp(31px,5vw,54px); font-weight: 540; line-height: 1.04; letter-spacing: -.055em; text-shadow: 0 8px 45px rgba(0,0,0,.7); }
                .rxjxt-welcome h1 span { color: rgba(255,255,255,.53); font-weight: 450; }
                .rxjxt-welcome p { margin: 7px 0 20px; color: rgba(255,255,255,.45); font-size: 12px; letter-spacing: .04em; }
                .rxjxt-welcome-loader { position: relative; width: 172px; height: 2px; overflow: hidden; border-radius: 2px; background: rgba(255,255,255,.1); }
                .rxjxt-welcome-loader span { position: absolute; inset: 0 auto 0 -42%; width: 42%; border-radius: inherit; background: linear-gradient(90deg,transparent,#fff,var(--rxjxt-red),transparent); box-shadow: 0 0 15px rgba(255,48,69,.75); animation: rxjxtWelcomeLoad 1.35s ease-in-out infinite; }
                #rxjxt-toast-container { top: 30px; }
                .rxjxt-toast { border-radius: 17px; background: rgba(5,5,5,.97); border-color: rgba(255,255,255,.13); }
                .toast-success .rxjxt-toast-icon, .toast-error .rxjxt-toast-icon, .toast-info .rxjxt-toast-icon { background: linear-gradient(135deg,#ff3045,#850b19); }
                .rxjxt-popup-content { border: 1px solid rgba(255,255,255,.14); border-radius: 23px; background: linear-gradient(145deg,#171718,#030303); }
                .rxjxt-action-btn.primary { background: linear-gradient(135deg,#ff3045,#880b1a); }
                @keyframes rxjxtWelcomeArrive { 0% { opacity: 0; transform: translate(-50%,-42%) perspective(1000px) rotateX(-22deg) scale(.68); filter: blur(20px); } 65% { opacity: 1; transform: translate(-50%,-51%) perspective(1000px) rotateX(3deg) scale(1.025); filter: blur(0); } 100% { opacity: 1; transform: translate(-50%,-50%) perspective(1000px) rotateX(0) scale(1); filter: blur(0); } }
                @keyframes rxjxtAvatarOrbit { to { rotate: 360deg; } }
                @keyframes rxjxtWelcomeLoad { 0% { transform: translateX(0); } 100% { transform: translateX(340%); } }
                @keyframes rxjxtTrackSweep { 0% { left: -32%; opacity: 0; } 20% { opacity: .8; } 72% { opacity: .65; } 100% { left: 112%; opacity: 0; } }
                @keyframes rxjxtFillGleam { 0%,15% { left: -45%; opacity: 0; } 30% { opacity: .75; } 72%,100% { left: 120%; opacity: 0; } }
                @keyframes rxjxtDotPulse { 0%,100% { opacity: .58; transform: scale(.82); } 50% { opacity: 1; transform: scale(1.22); } }
                @keyframes rxjxtOrbit { to { transform: rotate(360deg); } }
                @keyframes rxjxtButtonBreath { 0%,100% { box-shadow: 0 7px 22px rgba(255,48,69,.16), inset 0 1px 0 rgba(255,255,255,.24); } 50% { box-shadow: 0 8px 30px rgba(255,48,69,.32), inset 0 1px 0 rgba(255,255,255,.28); } }
                @media (max-width: 900px) {
                    #rxjxt-main-dashboard { width: min(760px,96vw); max-width: 96vw; padding: 14px; border-radius: 24px; }
                    .rxjxt-top-bar { grid-template-columns: 1fr auto; }
                    .rxjxt-brand-lockup { grid-column: 1; grid-row: 1; }
                    .rxjxt-top-bar > .rxjxt-nav-group:nth-of-type(2) { grid-column: 1 / -1; grid-row: 2; justify-content: flex-start; overflow-x: auto; }
                    .rxjxt-top-bar > .rxjxt-nav-group:last-child { grid-column: 2; grid-row: 1; }
                    .rxjxt-user-copy { display: none; }
                    .rxjxt-user-chip { padding-right: 7px; }
                }
                @media (max-width: 620px) {
                    #rxjxt-overlay { align-items: flex-start; padding: 12px 8px; }
                    #rxjxt-main-dashboard { width: 100%; max-width: 100%; max-height: calc(100vh - 24px); padding: 11px; gap: 12px; border-radius: 21px; }
                    .rxjxt-top-bar { gap: 8px; padding: 9px; border-radius: 17px; }
                    .rxjxt-nav-item { padding: 9px 10px; font-size: 10px; }
                    .rxjxt-nav-item svg { width: 13px; height: 13px; }
                    #rxjxt-update-hub { padding: 8px 9px; }
                    .rxjxt-dashboard-head { align-items: flex-start; padding: 11px 3px 0; }
                    .rxjxt-dashboard-head h1 { font-size: 28px; }
                    .rxjxt-dashboard-head p { max-width: 270px; font-size: 10px; line-height: 1.5; }
                    .rxjxt-session-card { min-width: 78px; padding: 9px; }
                    .rxjxt-view { grid-template-columns: 1fr; gap: 10px; }
                    .rxjxt-view.active > div:nth-child(n) { grid-column: 1 / -1; }
                    .rxjxt-glass-card { padding: 17px; border-radius: 18px; }
                    .rxjxt-terminal { height: 112px; }
                    .rxjxt-welcome { padding: 18px; }
                    .rxjxt-avatar-shell { width: 92px; height: 92px; }
                }
                @media (prefers-reduced-motion: reduce) {
                    #rxjxt-overlay *, #rxjxt-toast-container * { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .01ms !important; }
                }

                /* Satin motion: compact flip reveals, soft specular sweeps, no orbiting loops. */
                #rxjxt-main-dashboard {
                    transform: perspective(1450px) translateY(32px) scale(.94) rotateY(-11deg) rotateX(2deg);
                    transform-origin: 50% 44%;
                    transition: opacity .42s ease, transform .72s cubic-bezier(.18,.82,.22,1), filter .55s ease, box-shadow .6s ease;
                    backface-visibility: hidden;
                }
                #rxjxt-overlay.rxjxt-open:not(.rxjxt-intro) #rxjxt-main-dashboard {
                    transform: perspective(1450px) translateY(0) scale(1) rotateY(0) rotateX(0);
                }
                #rxjxt-overlay.rxjxt-intro #rxjxt-main-dashboard,
                #rxjxt-overlay:not(.rxjxt-open) #rxjxt-main-dashboard {
                    transform: perspective(1450px) translateY(32px) scale(.94) rotateY(-11deg) rotateX(2deg);
                }
                .rxjxt-session-orbit { animation: none; opacity: .62; transform: scale(.88); }
                .rxjxt-welcome-orbit::before,
                .rxjxt-welcome-orbit::after { animation: none; }
                .rxjxt-close-btn:hover { transform: translateY(-1px) scale(1.055); }

                .rxjxt-glass-card {
                    transition: transform .42s cubic-bezier(.18,.82,.22,1), border-color .36s ease, box-shadow .42s ease, background .36s ease;
                    backface-visibility: hidden;
                }
                .rxjxt-glass-card::after {
                    z-index: 0;
                    opacity: 0;
                    background: linear-gradient(112deg, transparent 26%, rgba(255,255,255,.02) 39%, rgba(255,255,255,.2) 49%, rgba(255,255,255,.04) 55%, transparent 70%);
                    transform: translateX(-115%) skewX(-12deg);
                    transition: opacity .2s ease;
                }
                .rxjxt-glass-card > * { position: relative; z-index: 1; transform: translateZ(16px); }
                .rxjxt-glass-card:hover::after {
                    opacity: 1;
                    animation: rxjxtCardSheen .92s cubic-bezier(.2,.7,.2,1) both;
                }
                .rxjxt-glass-card:active {
                    --rxjxt-card-lift: 0px;
                    transform: perspective(1050px) rotateX(2deg) rotateY(-1deg) translateY(1px) scale(.992);
                }
                .rxjxt-view.active > div:nth-child(n) {
                    animation: rxjxtCardFlipIn .62s cubic-bezier(.18,.82,.22,1) both;
                    backface-visibility: hidden;
                }
                .rxjxt-view.active > div:nth-child(1) { animation-delay: .035s; }
                .rxjxt-view.active > div:nth-child(2) { animation-delay: .09s; }
                .rxjxt-view.active > div:nth-child(3) { animation-delay: .145s; }
                .rxjxt-view.active > div:nth-child(4) { animation-delay: .2s; }

                .rxjxt-nav-item, .rxjxt-action-btn, #rxjxt-mode-btn, #rxjxt-update-hub, .rxjxt-toggle {
                    transform-style: preserve-3d;
                    backface-visibility: hidden;
                }
                .rxjxt-nav-item:active, .rxjxt-action-btn:active, #rxjxt-mode-btn:active,
                #rxjxt-update-hub:active, .rxjxt-toggle:active {
                    transform: perspective(520px) rotateX(7deg) translateY(1px) scale(.975);
                }
                .rxjxt-brand-mark { transform-style: preserve-3d; }
                .rxjxt-welcome-orbit { transform-style: preserve-3d; }
                .rxjxt-welcome-loader { box-shadow: 0 0 20px rgba(255,48,69,.13); }

                #rxjxt-deafen-mic { transform-style: preserve-3d; backface-visibility: hidden; }
                .theme-deafen-on #rxjxt-deafen-mic { animation: rxjxtAudioShimmer 2.4s ease-in-out infinite; }

                @keyframes rxjxtCardFlipIn {
                    0% { opacity: 0; transform: perspective(900px) translateY(17px) rotateY(-8deg) scale(.97); filter: blur(7px); }
                    68% { opacity: 1; transform: perspective(900px) translateY(-1px) rotateY(1.5deg) scale(1.006); filter: blur(0); }
                    100% { opacity: 1; transform: perspective(900px) translateY(0) rotateY(0) scale(1); filter: blur(0); }
                }
                @keyframes rxjxtCardSheen {
                    0% { opacity: 0; transform: translateX(-115%) skewX(-12deg); }
                    18% { opacity: .9; }
                    100% { opacity: 0; transform: translateX(115%) skewX(-12deg); }
                }
                @keyframes rxjxtAudioShimmer {
                    0%,100% { transform: perspective(420px) scale(1); filter: drop-shadow(0 0 5px rgba(255,48,69,.28)); }
                    50% { transform: perspective(420px) scale(1.09); filter: drop-shadow(0 0 13px rgba(255,48,69,.78)); }
                }
                @keyframes rxjxtWelcomeArrive {
                    0% { opacity: 0; transform: translate(-50%,-46%) perspective(1000px) rotateY(-20deg) scale(.82); filter: blur(15px); }
                    72% { opacity: 1; transform: translate(-50%,-51%) perspective(1000px) rotateY(2deg) scale(1.018); filter: blur(0); }
                    100% { opacity: 1; transform: translate(-50%,-50%) perspective(1000px) rotateY(0) scale(1); filter: blur(0); }
                }
                @keyframes rxjxtAvatarOrbit { 0%,100% { opacity: .45; } 50% { opacity: .9; } }
                @keyframes rxjxtOrbit { 0%,100% { opacity: .42; } 50% { opacity: .74; } }
                @media (prefers-reduced-motion: reduce) {
                    #rxjxt-overlay *, #rxjxt-toast-container * { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .01ms !important; }
                }

                /* Dashboard layout tuned to the supplied charcoal / AMOLED reference. */
                #rxjxt-overlay {
                    padding: 24px;
                    background: radial-gradient(ellipse at 78% -12%, rgba(255,255,255,.115), transparent 38%), rgba(0,0,0,.72);
                    backdrop-filter: blur(30px) saturate(112%);
                    -webkit-backdrop-filter: blur(30px) saturate(112%);
                }
                #rxjxt-overlay::before {
                    background: radial-gradient(circle at 12% 82%, rgba(255,48,69,.065), transparent 25%), radial-gradient(ellipse at 86% 14%, rgba(255,255,255,.08), transparent 31%);
                    background-size: 145% 145%;
                    animation: rxjxtAmbientDrift 20s ease-in-out infinite alternate;
                }
                #rxjxt-main-dashboard {
                    display: grid;
                    grid-template-columns: 194px minmax(0,1fr);
                    grid-template-rows: auto minmax(0,1fr) auto;
                    grid-template-areas: "rail head" "rail view" "rail foot";
                    gap: 14px 20px;
                    width: min(1260px, 96vw);
                    max-width: 96vw;
                    max-height: min(900px, 92vh);
                    overflow: hidden;
                    padding: 12px;
                    border: 1px solid rgba(255,255,255,.1);
                    border-radius: 26px;
                    background: linear-gradient(145deg, rgba(13,13,14,.985), rgba(1,1,1,.99) 72%);
                    box-shadow: 0 42px 120px rgba(0,0,0,.82), 0 0 55px rgba(255,48,69,.055), inset 0 1px 0 rgba(255,255,255,.07);
                }
                .rxjxt-top-bar {
                    grid-area: rail;
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                    align-items: stretch;
                    gap: 0;
                    padding: 20px 12px 12px;
                    border: 1px solid rgba(255,255,255,.075);
                    border-radius: 18px;
                    background: linear-gradient(180deg, rgba(20,20,21,.98), rgba(7,7,8,.98));
                    box-shadow: 0 22px 52px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.055);
                    backdrop-filter: blur(22px);
                }
                .rxjxt-brand-lockup {
                    min-height: 42px;
                    margin: 0 4px 20px;
                    padding: 0 0 16px;
                    border-bottom: 1px solid rgba(255,255,255,.075);
                }
                .rxjxt-brand-mark { display: none !important; }
                .rxjxt-brand-copy { min-width: 0; gap: 5px; }
                .rxjxt-brand-copy strong {
                    display: block;
                    max-width: 156px;
                    overflow: hidden;
                    color: #fff;
                    font-size: 14px;
                    font-weight: 650;
                    letter-spacing: -.025em;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .rxjxt-brand-copy span { color: rgba(255,255,255,.35); font-size: 8px; letter-spacing: .18em; }
                .rxjxt-top-bar > .rxjxt-nav-group:nth-of-type(2) {
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    justify-content: flex-start;
                    gap: 5px;
                    width: 100%;
                }
                .rxjxt-top-bar > .rxjxt-nav-group:nth-of-type(2)::before {
                    content: "WORKSPACE";
                    display: block;
                    margin: 0 8px 8px;
                    color: rgba(255,255,255,.28);
                    font-size: 8px;
                    font-weight: 800;
                    letter-spacing: .17em;
                }
                .rxjxt-nav-item {
                    justify-content: flex-start;
                    min-height: 39px;
                    padding: 10px 11px;
                    border: 1px solid transparent;
                    border-radius: 10px;
                    color: rgba(255,255,255,.5);
                    font-size: 11px;
                    font-weight: 550;
                    letter-spacing: 0;
                    transition: transform .34s cubic-bezier(.18,.82,.22,1), background .34s ease, color .28s ease, border-color .34s ease, box-shadow .34s ease;
                }
                .rxjxt-nav-item svg { flex: 0 0 auto; width: 15px; height: 15px; }
                .rxjxt-nav-item:hover { transform: translateX(2px); background: rgba(255,255,255,.045); }
                .rxjxt-nav-item[data-target="quest"].active,
                .rxjxt-nav-item[data-target="deafen"].active {
                    color: #fff;
                    background: linear-gradient(110deg, rgba(255,255,255,.105), rgba(255,255,255,.035));
                    border-color: rgba(255,255,255,.1);
                    box-shadow: inset 2px 0 0 #ff3045, 0 8px 18px rgba(0,0,0,.2);
                }
                .rxjxt-nav-item.active svg { color: #ff3045; filter: drop-shadow(0 0 7px rgba(255,48,69,.35)); }
                .rxjxt-top-bar > .rxjxt-nav-group:last-child {
                    display: flex;
                    flex-direction: column;
                    align-items: stretch;
                    justify-content: flex-end;
                    gap: 10px;
                    width: 100%;
                    margin-top: auto;
                    padding-top: 18px;
                    border-top: 1px solid rgba(255,255,255,.075);
                }
                #rxjxt-update-hub { width: 100%; justify-content: center; padding: 10px 9px; border-radius: 10px; font-size: 10px; }
                .rxjxt-close-btn { align-self: flex-end; }
                .rxjxt-user-chip { display: none !important; }
                .rxjxt-dashboard-head { grid-area: head; align-items: flex-end; min-width: 0; padding: 9px 5px 0; }
                .rxjxt-dashboard-eyebrow { margin-bottom: 8px; font-size: 8px; letter-spacing: .17em; }
                .rxjxt-dashboard-head h1 { font-size: clamp(25px, 3vw, 38px); font-weight: 560; letter-spacing: -.05em; }
                .rxjxt-dashboard-head p { margin-top: 8px; font-size: 10px; color: rgba(255,255,255,.42); }
                .rxjxt-session-card { min-width: 105px; padding: 10px 12px; border-radius: 12px; background: linear-gradient(145deg, #19191a, #080808); }
                .rxjxt-session-orbit { animation: none; opacity: .55; }
                .rxjxt-view { grid-area: view; min-height: 0; overflow-y: auto; align-content: start; padding: 2px 6px 7px 0; gap: 12px; scrollbar-width: thin; scrollbar-color: rgba(255,255,255,.16) transparent; }
                .rxjxt-view::-webkit-scrollbar { width: 5px; }
                .rxjxt-view::-webkit-scrollbar-thumb { background: rgba(255,255,255,.14); border-radius: 8px; }
                .rxjxt-glass-card {
                    padding: 17px 19px;
                    border-color: rgba(255,255,255,.075);
                    border-top-color: rgba(255,255,255,.12);
                    border-radius: 16px;
                    background: linear-gradient(145deg, rgba(26,26,27,.94), rgba(16,16,17,.96));
                    box-shadow: 0 14px 34px rgba(0,0,0,.36), inset 0 1px 0 rgba(255,255,255,.035);
                }
                .rxjxt-glass-card:hover { border-color: rgba(255,48,69,.22); box-shadow: 0 20px 42px rgba(0,0,0,.5), 0 0 22px rgba(255,48,69,.045), inset 0 1px 0 rgba(255,255,255,.075); }
                .rxjxt-card-title { font-size: 12px; font-weight: 600; }
                .rxjxt-label { font-size: 8px; }
                .rxjxt-value { font-size: clamp(19px,2.2vw,25px); }
                .rxjxt-progress-bg { border-radius: 7px; background: #050505; }
                .rxjxt-progress-bg::after { animation: none; opacity: 0; }
                .rxjxt-progress-fill::after { animation: none; opacity: 0; }
                .rxjxt-progress-caption i { animation: none; }
                #rxjxt-main-dashboard.quest-active .rxjxt-progress-bg::after { opacity: 1; animation: rxjxtTrackSweep 3.6s ease-in-out infinite; }
                #rxjxt-main-dashboard.quest-active .rxjxt-progress-fill::after { opacity: 1; animation: rxjxtFillGleam 2.6s ease-in-out infinite; }
                #rxjxt-main-dashboard.quest-active .rxjxt-progress-caption i { animation: rxjxtDotPulse 1.8s ease-in-out infinite; }
                .rxjxt-progress-caption span:last-child { color: rgba(255,255,255,.5); }
                #rxjxt-main-dashboard.quest-active .rxjxt-progress-caption span:last-child { color: #fff; }
                #rxjxt-mode-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    min-width: 105px;
                    padding: 8px 11px;
                    border: 1px solid rgba(255,255,255,.12);
                    border-radius: 9px;
                    color: rgba(255,255,255,.82);
                    background: linear-gradient(145deg, rgba(255,255,255,.07), rgba(255,255,255,.025));
                    font-family: inherit;
                    font-size: 10px;
                    font-weight: 600;
                }
                #rxjxt-mode-btn[data-mode="rage"] { color: #fff; border-color: rgba(255,48,69,.38); background: linear-gradient(135deg, rgba(255,48,69,.24), rgba(100,7,18,.25)); box-shadow: 0 6px 20px rgba(255,48,69,.1), inset 0 1px 0 rgba(255,255,255,.1); }
                #rxjxt-mode-btn .rxjxt-mode-icon { width: 14px; height: 14px; color: #ff3045; }
                .rxjxt-mode-icon { animation: rxjxtModeFlip .5s cubic-bezier(.18,.82,.22,1) both; transform-origin: center; }
                .rxjxt-toggle { position: relative; width: 66px; height: 30px; display: inline-block; flex: 0 0 auto; cursor: pointer; }
                .rxjxt-toggle input { position: absolute; width: 1px; height: 1px; opacity: 0; }
                .rxjxt-toggle .rxjxt-slider {
                    position: absolute;
                    inset: 0;
                    display: grid;
                    place-items: center;
                    border: 1px solid rgba(255,255,255,.12);
                    border-radius: 9px;
                    color: rgba(255,255,255,.45);
                    background: linear-gradient(145deg, #19191a, #0b0b0c);
                    box-shadow: inset 0 1px 4px rgba(0,0,0,.65), 0 4px 12px rgba(0,0,0,.24);
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: .15em;
                    transition: color .28s ease, border-color .32s ease, background .32s ease, box-shadow .32s ease, transform .36s cubic-bezier(.18,.82,.22,1);
                }
                .rxjxt-toggle .rxjxt-slider::before { display: none !important; }
                .rxjxt-toggle .rxjxt-slider::after { content: "OFF"; }
                .rxjxt-toggle input:checked + .rxjxt-slider {
                    color: #fff;
                    border-color: rgba(255,48,69,.56);
                    background: linear-gradient(135deg, #d71e33, #810b19);
                    box-shadow: 0 0 22px rgba(255,48,69,.2), inset 0 1px 0 rgba(255,255,255,.18);
                }
                .rxjxt-toggle input:checked + .rxjxt-slider::after { content: "ON"; }
                .rxjxt-toggle:hover .rxjxt-slider { border-color: rgba(255,255,255,.27); transform: translateY(-1px); }
                .rxjxt-toggle input:checked:hover + .rxjxt-slider { border-color: rgba(255,48,69,.8); }
                .rxjxt-toggle input:focus-visible + .rxjxt-slider { outline: 2px solid #ff3045; outline-offset: 3px; }
                .rxjxt-terminal { border-radius: 12px; background: rgba(3,3,3,.74); }
                .rxjxt-footer { grid-area: foot; margin: 0; text-align: right; font-size: 8px; }
                .rxjxt-toast { font-family: "Inter", "SF Pro Display", sans-serif; }
                @keyframes rxjxtAmbientDrift { 0% { background-position: 0% 8%; } 100% { background-position: 100% 90%; } }
                @keyframes rxjxtModeFlip { 0% { opacity: .3; transform: perspective(260px) rotateY(-75deg) scale(.78); filter: blur(3px); } 72% { opacity: 1; transform: perspective(260px) rotateY(8deg) scale(1.08); filter: blur(0); } 100% { transform: perspective(260px) rotateY(0) scale(1); } }
                @media (max-width: 760px) {
                    #rxjxt-overlay { padding: 10px; }
                    #rxjxt-main-dashboard {
                        grid-template-columns: minmax(0,1fr);
                        grid-template-rows: auto auto minmax(0,1fr) auto;
                        grid-template-areas: "rail" "head" "view" "foot";
                        gap: 10px;
                        width: min(680px, 98vw);
                        max-height: 95vh;
                        padding: 9px;
                        border-radius: 20px;
                    }
                    .rxjxt-top-bar { display: grid; grid-template-columns: minmax(0,1fr) auto; grid-template-rows: auto auto; gap: 8px; padding: 12px; border-radius: 15px; }
                    .rxjxt-brand-lockup { grid-column: 1; grid-row: 1; min-height: 0; margin: 0; padding: 0; border: 0; }
                    .rxjxt-brand-copy strong { max-width: 190px; }
                    .rxjxt-top-bar > .rxjxt-nav-group:nth-of-type(2) { grid-column: 1 / -1; grid-row: 2; flex-direction: row; overflow-x: auto; }
                    .rxjxt-top-bar > .rxjxt-nav-group:nth-of-type(2)::before { display: none; }
                    .rxjxt-nav-item { flex: 1 0 auto; justify-content: center; padding: 9px 10px; }
                    .rxjxt-top-bar > .rxjxt-nav-group:last-child { grid-column: 2; grid-row: 1; flex-direction: row; align-items: center; justify-content: flex-end; width: auto; margin: 0; padding: 0; border: 0; }
                    #rxjxt-update-hub { width: auto; }
                    .rxjxt-close-btn { align-self: auto; }
                    .rxjxt-dashboard-head { padding: 4px 3px 0; }
                    .rxjxt-view { grid-template-columns: 1fr; }
                    .rxjxt-view.active > div:nth-child(n) { grid-column: 1 / -1; }
                    .rxjxt-glass-card { padding: 15px; border-radius: 14px; }
                    .rxjxt-footer { text-align: center; }
                }
                /* Discord toolbar controls: matching rectangular hardware, distinct states. */
                @property --rxjxt-toolbar-progress-angle {
                    syntax: "<angle>";
                    inherits: false;
                    initial-value: 0deg;
                }
                #rxjxt-header-btn,
                #rxjxt-vc-btn {
                    box-sizing: border-box !important;
                    width: 44px !important;
                    height: 34px !important;
                    flex: 0 0 44px;
                    padding: 0 !important;
                    border-radius: 9px !important;
                    cursor: pointer;
                    transform-style: preserve-3d;
                    -webkit-tap-highlight-color: transparent;
                }
                #rxjxt-header-btn {
                    position: relative !important;
                    isolation: isolate;
                    overflow: hidden;
                    --rxjxt-toolbar-progress-angle: 0deg;
                    border: 2px solid transparent !important;
                    background: linear-gradient(145deg, #111112, #020202) padding-box, conic-gradient(from -90deg, #37e77c 0deg var(--rxjxt-toolbar-progress-angle), rgba(255,255,255,.16) var(--rxjxt-toolbar-progress-angle) 360deg) border-box !important;
                    box-shadow: 0 4px 13px rgba(0,0,0,.48), inset 0 1px 0 rgba(255,255,255,.09), 0 0 12px rgba(255,48,69,.08);
                    filter: none !important;
                    transition: width .42s cubic-bezier(.18,.82,.22,1), flex-basis .42s cubic-bezier(.18,.82,.22,1), transform .28s cubic-bezier(.18,.82,.22,1), box-shadow .32s ease, --rxjxt-toolbar-progress-angle .55s cubic-bezier(.18,.82,.22,1) !important;
                }
                #rxjxt-header-btn::before {
                    content: "";
                    position: absolute;
                    inset: 1px;
                    z-index: 1;
                    pointer-events: none;
                    border-radius: 7px;
                    opacity: 0;
                    background: linear-gradient(110deg, transparent 0%, rgba(255,255,255,.03) 36%, rgba(255,255,255,.38) 49%, rgba(255,48,69,.28) 57%, transparent 76%);
                    transition: opacity .3s ease;
                }
                #rxjxt-header-btn::after {
                    content: none;
                }
                #rxjxt-header-ring {
                    position: relative !important;
                    z-index: 2 !important;
                    width: 100% !important;
                    height: 100% !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 0;
                    overflow: hidden !important;
                    border-radius: inherit !important;
                    background: transparent !important;
                    background-image: none !important;
                    box-shadow: none !important;
                }
                #rxjxt-header-inner {
                    width: 28px !important;
                    height: 28px !important;
                    display: grid !important;
                    place-items: center !important;
                    overflow: visible !important;
                    border-radius: 4px !important;
                    background: transparent !important;
                    box-shadow: none !important;
                    transform: translateY(-1px) !important;
                    transition: transform .28s cubic-bezier(.18,.82,.22,1) !important;
                }
                .rxjxt-custom-logo {
                    width: 100% !important;
                    height: 100% !important;
                    object-fit: contain !important;
                    border-radius: 0 !important;
                    filter: none !important;
                    transform: translateZ(1px);
                    transition: transform .32s cubic-bezier(.18,.82,.22,1), filter .32s ease;
                }
                #rxjxt-dashboard-shovel {
                    display: grid;
                    flex: 0 0 0;
                    width: 0;
                    height: 21px;
                    place-items: center;
                    overflow: hidden;
                    opacity: 0;
                    color: #ff4055;
                    transform: translateX(6px) scale(.68);
                    transform-origin: center;
                    transition: width .42s cubic-bezier(.18,.82,.22,1), flex-basis .42s cubic-bezier(.18,.82,.22,1), opacity .24s ease, transform .5s cubic-bezier(.18,.82,.22,1);
                }
                #rxjxt-dashboard-shovel .rxjxt-shovel-static { display: block; width: 20px; height: 20px; overflow: visible; filter: drop-shadow(0 0 3px rgba(255,48,69,.52)); }
                #rxjxt-dashboard-shovel .rxjxt-shovel-gif { display: none; width: 21px; height: 21px; object-fit: contain; filter: grayscale(1) contrast(2.7) sepia(1) saturate(9) hue-rotate(318deg) brightness(.88); mix-blend-mode: screen; }
                #rxjxt-dashboard-shovel .rxjxt-shovel-dirt { opacity: 0; transform-box: fill-box; transform-origin: center; }
                #rxjxt-header-btn.rxjxt-dashboard-open {
                    width: 70px !important;
                    flex-basis: 70px !important;
                }
                #rxjxt-header-btn.rxjxt-dashboard-open #rxjxt-header-ring { gap: 7px; }
                #rxjxt-header-btn.rxjxt-toolbar-active {
                    width: 70px !important;
                    flex-basis: 70px !important;
                }
                #rxjxt-header-btn.rxjxt-toolbar-active #rxjxt-header-ring { gap: 7px; }
                #rxjxt-header-btn.rxjxt-dashboard-open #rxjxt-dashboard-shovel,
                #rxjxt-header-btn.rxjxt-toolbar-active #rxjxt-dashboard-shovel {
                    width: 22px;
                    flex-basis: 22px;
                    opacity: 1;
                    transform: translateX(0) scale(1);
                }
                #rxjxt-header-btn.rxjxt-shovel-animated #rxjxt-dashboard-shovel .rxjxt-shovel-static { display: none; }
                #rxjxt-header-btn.rxjxt-shovel-animated #rxjxt-dashboard-shovel .rxjxt-shovel-gif[src] { display: block; }
                #rxjxt-header-btn:hover::before,
                #rxjxt-header-btn.rxjxt-toolbar-active::before { opacity: 1; animation: rxjxtVoiceSheen 1.15s cubic-bezier(.18,.82,.22,1) infinite; }
                #rxjxt-header-btn:hover {
                    transform: translateY(-1px) perspective(400px) rotateX(3deg) scale(1.035) !important;
                    border-color: rgba(255,48,69,.9) !important;
                    box-shadow: 0 7px 20px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.15), 0 0 18px rgba(255,48,69,.23);
                }
                #rxjxt-header-btn:hover #rxjxt-header-inner { transform: translateY(-1px) translateZ(4px) scale(1.07) !important; }
                #rxjxt-header-btn:hover .rxjxt-custom-logo { transform: translateZ(5px) scale(1.04); }
                #rxjxt-header-btn:active { transform: translateY(1px) scale(.965) !important; }
                #rxjxt-header-btn.rxjxt-dashboard-open { border-color: rgba(255,48,69,.78) !important; box-shadow: 0 0 15px rgba(255,48,69,.16), inset 0 1px 0 rgba(255,255,255,.1); }
                #rxjxt-vc-btn {
                    position: relative;
                    isolation: isolate;
                    overflow: hidden;
                    margin: 0 5px 0 7px !important;
                    border: 1px solid rgba(255,255,255,.13) !important;
                    color: rgba(255,48,69,.72) !important;
                    background: linear-gradient(145deg, #111112, #030303) !important;
                    box-shadow: 0 4px 13px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.065);
                    transition: transform .28s cubic-bezier(.18,.82,.22,1), border-color .3s ease, color .3s ease, box-shadow .3s ease, background .3s ease !important;
                }
                #rxjxt-vc-btn::before {
                    content: "";
                    position: absolute;
                    inset: 1px;
                    z-index: 0;
                    border-radius: 7px;
                    pointer-events: none;
                    opacity: 0;
                    background: linear-gradient(130deg, rgba(255,255,255,.12), transparent 48%, rgba(255,255,255,.035));
                    transition: opacity .3s ease;
                }
                #rxjxt-vc-btn svg { position: relative; z-index: 1; width: 17px; height: 17px; color: inherit; opacity: .88; transition: transform .3s cubic-bezier(.18,.82,.22,1), filter .3s ease, opacity .3s ease; }
                #rxjxt-vc-btn:hover:not(.rxjxt-vc-connected) { border-color: rgba(255,255,255,.28) !important; color: #ff5263 !important; background: linear-gradient(145deg, #171718, #060606) !important; box-shadow: 0 7px 16px rgba(0,0,0,.5), inset 0 1px 0 rgba(255,255,255,.1); }
                #rxjxt-vc-btn:hover::before { opacity: 1; }
                #rxjxt-vc-btn.rxjxt-vc-connected:active { transform: translateY(1px) scale(.965) !important; }
                #rxjxt-vc-btn.rxjxt-vc-connected:active svg { transform: perspective(360px) rotateX(12deg) scale(.86); }
                #rxjxt-vc-btn.rxjxt-vc-connected {
                    border-color: rgba(255,48,69,.78) !important;
                    color: #ff4055 !important;
                    background: linear-gradient(145deg, #1c070a, #050303) !important;
                    animation: rxjxtVoiceConnected 2.2s ease-in-out infinite;
                }
                #rxjxt-vc-btn.rxjxt-vc-connected:hover { transform: translateY(-2px) perspective(480px) rotateX(6deg) scale(1.045) !important; }
                #rxjxt-vc-btn.rxjxt-vc-connected::before { opacity: 1; background: linear-gradient(110deg, transparent, rgba(255,255,255,.08) 38%, rgba(255,48,69,.24) 52%, transparent 72%); animation: rxjxtVoiceSheen 2.6s cubic-bezier(.18,.82,.22,1) infinite; }
                #rxjxt-vc-btn:hover::before { opacity: 1; background: linear-gradient(110deg, transparent 0%, rgba(255,255,255,.03) 36%, rgba(255,255,255,.38) 49%, rgba(255,48,69,.28) 57%, transparent 76%); animation: rxjxtVoiceSheen 1.15s cubic-bezier(.18,.82,.22,1) infinite; }
                #rxjxt-vc-btn.rxjxt-vc-connected svg { opacity: 1; filter: drop-shadow(0 0 7px rgba(255,48,69,.68)); animation: rxjxtVoiceSignal 1.8s ease-in-out infinite; }
                #rxjxt-vc-btn .rxjxt-speaker-wave { transform-box: fill-box; transform-origin: center; }
                #rxjxt-vc-btn.rxjxt-vc-connected .rxjxt-speaker-body { animation: rxjxtSpeakerCore 1.8s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
                #rxjxt-vc-btn.rxjxt-vc-connected .rxjxt-speaker-wave-near { animation: rxjxtSpeakerWave 1.25s ease-in-out infinite; }
                #rxjxt-vc-btn.rxjxt-vc-connected .rxjxt-speaker-wave-far { animation: rxjxtSpeakerWave 1.25s ease-in-out .24s infinite; }
                #rxjxt-header-btn:focus-visible, #rxjxt-vc-btn:focus-visible { outline: 2px solid #ff3045; outline-offset: 3px; }

                .rxjxt-progress-bg {
                    box-sizing: border-box;
                    width: 100%;
                    height: 12px;
                    padding: 0;
                    border-radius: 3px;
                    vertical-align: middle;
                    border-color: rgba(255,255,255,.09);
                    background: #030303;
                    box-shadow: inset 0 2px 5px rgba(0,0,0,.95), 0 1px 0 rgba(255,255,255,.025);
                }
                .rxjxt-progress-fill,
                .theme-stealth .rxjxt-progress-fill,
                .theme-rage .rxjxt-progress-fill {
                    box-sizing: border-box;
                    height: 100%;
                    min-width: 0;
                    border-radius: 2px;
                    vertical-align: top;
                    background: linear-gradient(90deg, #760817 0%, #d71e33 60%, #ff4055 88%, #ffd4da 100%);
                    box-shadow: inset 0 1px 1px rgba(255,255,255,.4), 0 0 16px rgba(255,48,69,.35);
                }
                .rxjxt-progress-bg::after {
                    background: linear-gradient(90deg, transparent, rgba(255,48,69,.24), rgba(255,232,235,.82), rgba(255,64,85,.3), transparent);
                }
                .rxjxt-progress-fill::after {
                    background: linear-gradient(90deg, transparent, rgba(255,240,242,.94), rgba(255,92,109,.56), transparent);
                }
                @keyframes rxjxtVoiceConnected { 0%,100% { box-shadow: 0 4px 13px rgba(0,0,0,.45), 0 0 5px rgba(255,48,69,.12), inset 0 1px 0 rgba(255,255,255,.08); } 50% { box-shadow: 0 5px 18px rgba(0,0,0,.5), 0 0 17px rgba(255,48,69,.42), inset 0 0 12px rgba(255,48,69,.1); } }
                @keyframes rxjxtVoiceSheen { 0% { opacity: 0; transform: translateX(-115%); } 22% { opacity: .8; } 72% { opacity: .65; } 100% { opacity: 0; transform: translateX(115%); } }
                @keyframes rxjxtVoiceSignal { 0%,100% { transform: scale(1); } 50% { transform: scale(1.09); } }
                @keyframes rxjxtSpeakerCore { 0%,100% { transform: scale(1); } 50% { transform: scale(1.045); } }
                @keyframes rxjxtSpeakerWave { 0%,100% { opacity: .62; } 50% { opacity: 1; filter: drop-shadow(0 0 3px rgba(255,80,100,.78)); } }
                @media (prefers-reduced-motion: reduce) {
                    #rxjxt-overlay *, #rxjxt-toast-container * { animation-duration: .01ms !important; animation-iteration-count: 1 !important; scroll-behavior: auto !important; transition-duration: .01ms !important; }
                    #rxjxt-header-btn::before { animation-duration: .01ms !important; animation-iteration-count: 1 !important; }
                    #rxjxt-vc-btn, #rxjxt-vc-btn::before, #rxjxt-vc-btn svg, #rxjxt-vc-btn svg * { animation-duration: .01ms !important; animation-iteration-count: 1 !important; }
                }
            `;
            document.head.appendChild(style);

            document.body.insertAdjacentHTML('beforeend', `<div id="rxjxt-toast-container"></div>`);

            const leafWreathSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 20 6v5c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-4"/></svg>`;
            const incognitoHatSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9v6h4l5 4V5L7 9H3Z"/><path d="M16 9c1.5 1.5 1.5 4.5 0 6M19 6c3.3 3.3 3.3 8.7 0 12"/></svg>`;
            const dashboardSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>`;
            const micOffSVG = `<svg id="rxjxt-deafen-mic" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
            const stealthSVG = `<svg class="rxjxt-mode-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12s3.2-6 9-6 9 6 9 6-3.2 6-9 6-9-6-9-6Z"/><circle cx="12" cy="12" r="2.3"/><path d="M4 20 20 4"/></svg>`;
            const rageSVG = `<svg class="rxjxt-mode-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22a7 7 0 0 0 7-7c0-2.7-1.4-4.6-3.5-6.5.2 2-1 3.1-2.2 3.7C13.6 8.2 11 4.4 7.6 2 8 6.4 5 8.8 5 13a7 7 0 0 0 7 9Z"/><path d="M12 22a3.4 3.4 0 0 0 3.4-3.4c0-1.3-.7-2.3-1.7-3.3.1 1-.5 1.6-1.2 1.9-.1-2-1.2-3.5-2.9-4.7.2 2.2-1 3.3-1 5.2A3.4 3.4 0 0 0 12 22Z"/></svg>`;
            const downloadSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;

            document.body.insertAdjacentHTML('beforeend', `
                <div id="rxjxt-overlay">
                    <div class="rxjxt-welcome" aria-hidden="true">
                        <div class="rxjxt-welcome-orbit rxjxt-avatar-shell">
                            <span class="rxjxt-avatar-initials" id="rxjxt-welcome-initials">RX</span>
                            <img class="rxjxt-avatar-img" id="rxjxt-welcome-avatar" alt="Your Discord avatar">
                        </div>
                        <div class="rxjxt-welcome-kicker"><span class="rxjxt-welcome-live-dot"></span> PERSONAL COMMAND CENTER</div>
                        <h1>Welcome back,<br><span id="rxjxt-welcome-name">there</span></h1>
                        <p>Preparing your workspace</p>
                        <div class="rxjxt-welcome-loader"><span></span></div>
                    </div>
                    <div id="rxjxt-main-dashboard" class="theme-stealth">
                        <div id="rxjxt-popup">
                            <div class="rxjxt-popup-content">
                                <div class="rxjxt-popup-title" id="rxjxt-popup-title">Confirm</div>
                                <div class="rxjxt-popup-text" id="rxjxt-popup-text">Message</div>
                                <div class="rxjxt-popup-actions">
                                    <button class="rxjxt-action-btn primary" id="rxjxt-popup-btn-1">Confirm</button>
                                    <button class="rxjxt-action-btn" id="rxjxt-popup-btn-2" style="display:none;">Cancel</button>
                                </div>
                            </div>
                        </div>
                        
                        <div class="rxjxt-top-bar">
                            <div class="rxjxt-brand-lockup">
                                <div class="rxjxt-brand-copy"><strong id="rxjxt-dashboard-name">Discord User</strong><span>CONTROL SYSTEM</span></div>
                            </div>
                            <div class="rxjxt-nav-group" role="tablist" aria-label="Dashboard modules">
                                <div class="rxjxt-nav-item active" data-target="quest" role="tab" tabindex="0" aria-selected="true" aria-controls="rxjxt-view-quest">
                                    ${leafWreathSVG} Quest Engine
                                </div>
                                <div class="rxjxt-nav-item" data-target="deafen" role="tab" tabindex="0" aria-selected="false" aria-controls="rxjxt-view-deafen">
                                    ${incognitoHatSVG} Audio Routing
                                </div>
                            </div>
                            <div class="rxjxt-nav-group">
                                <button id="rxjxt-update-hub">
                                    ${downloadSVG} Update <span id="rxjxt-uhub-text" style="margin-left:2px;"></span>
                                </button>
                                <div class="rxjxt-close-btn rxjxt-x-btn">✕</div>
                            </div>
                        </div>

                        <section class="rxjxt-dashboard-head">
                            <div class="rxjxt-dashboard-copy">
                                <span class="rxjxt-dashboard-eyebrow"><i></i> PERSONAL CONTROL CENTER</span>
                                <h1>Welcome back, <span id="rxjxt-dashboard-greeting">there</span></h1>
                                <p>Your activity, system status and live progress at a glance.</p>
                            </div>
                            <div class="rxjxt-session-card"><span class="rxjxt-session-orbit"></span><span class="rxjxt-session-label">SESSION</span><strong><i></i> READY</strong></div>
                        </section>

                        <div id="rxjxt-view-quest" class="rxjxt-view active">
                            <div class="rxjxt-glass-card">
                                <div class="rxjxt-card-header">
                                    <div class="rxjxt-card-title">${dashboardSVG} Core System</div>
                                    <label class="rxjxt-toggle"><input type="checkbox" id="rxjxt-grind-toggle" aria-label="Toggle Core System"><span class="rxjxt-slider"></span></label>
                                </div>
                                <div>
                                    <span class="rxjxt-label">Engine Status</span>
                                    <div class="rxjxt-value rxjxt-mode-indicator" id="rxjxt-live-status">Idle</div>
                                </div>
                            </div>

                            <div class="rxjxt-glass-card">
                                <div class="rxjxt-card-header">
                                    <div class="rxjxt-card-title">Target Parameters</div>
                                    <button id="rxjxt-mode-btn" data-mode="stealth">${stealthSVG}<span>Stealth</span></button>
                                </div>
                                <div>
                                    <span class="rxjxt-label">Active Quest</span>
                                    <div class="rxjxt-value" id="rxjxt-current-quest">None Selected</div>
                                </div>
                            </div>

                            <div class="rxjxt-glass-card rxjxt-card-full">
                                <div class="rxjxt-card-header" style="margin-bottom: 6px;">
                                    <div class="rxjxt-card-title">Completion <span style="font-size: 14px; color: rgba(255,255,255,0.5); font-weight: 600; margin-left: 8px;" id="rxjxt-pct">0%</span></div>
                                    <div class="rxjxt-eta-badge" id="rxjxt-eta">--:--</div>
                                </div>
                                <div class="rxjxt-progress-caption"><span>LIVE ACTIVITY FLOW</span><span><i></i> STANDBY</span></div>
                                <div class="rxjxt-progress-bg">
                                    <div class="rxjxt-progress-fill" id="rxjxt-bar"></div>
                                </div>
                            </div>

                            <div class="rxjxt-glass-card rxjxt-card-full">
                                <span class="rxjxt-label">Live System Logs</span>
                                <div class="rxjxt-terminal" id="rxjxt-terminal-quest"></div>
                            </div>
                        </div>

                        <div id="rxjxt-view-deafen" class="rxjxt-view">
                            <div class="rxjxt-glass-card rxjxt-deafen-card rxjxt-card-full" style="flex-direction: row; justify-content: space-between; align-items: center;">
                                <div>
                                    <div class="rxjxt-card-title" style="margin-bottom: 8px; font-size: 18px;">${micOffSVG} Virtual Audio Routing</div>
                                    <span class="rxjxt-label" style="text-transform: none; color: rgba(255,255,255,0.6);">Intercepts local WebSocket to spoof Deafen status seamlessly.</span>
                                </div>
                                <label class="rxjxt-toggle"><input type="checkbox" id="rxjxt-deafen-toggle" aria-label="Toggle Virtual Audio Routing"><span class="rxjxt-slider"></span></label>
                            </div>

                            <div class="rxjxt-glass-card rxjxt-deafen-card rxjxt-card-full">
                                <div class="rxjxt-card-header">
                                    <span class="rxjxt-label">Module Logs</span>
                                    <div class="rxjxt-value" id="rxjxt-deafen-status" style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.5);">Inactive</div>
                                </div>
                                <div class="rxjxt-terminal" id="rxjxt-terminal-deafen"></div>
                            </div>
                        </div>

                        <div class="rxjxt-footer">
                            v${RXJXT_HUB_VER} • Authored by <a href="discord://-/users/${DEVELOPER_ID}" target="_blank">RXJXT</a>
                        </div>
                    </div>
                </div>
            `);

            const dashContainer = document.getElementById('rxjxt-main-dashboard');
            const overlay = document.getElementById('rxjxt-overlay');

            const rxjxtSetUserIdentity = () => {
                let user = null;
                try {
                    if (typeof BdApi !== 'undefined' && BdApi.Webpack && BdApi.Webpack.getStore) {
                        user = BdApi.Webpack.getStore('UserStore')?.getCurrentUser?.() || null;
                    }
                } catch (_) {}

                const displayName = user?.globalName || user?.username || 'Discord User';
                let avatarUrl = '';
                try {
                    if (user?.avatar && user?.id) {
                        const extension = user.avatar.startsWith('a_') ? 'gif' : 'png';
                        avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=256`;
                    } else if (user?.id) {
                        const defaultIndex = Number((BigInt(user.id) >> 22n) % 6n);
                        avatarUrl = `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
                    }
                } catch (_) {}

                const initials = displayName.split(/\s+/).filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase() || 'RX';
                ['rxjxt-welcome-name', 'rxjxt-dashboard-name', 'rxjxt-dashboard-greeting'].forEach(id => {
                    const node = document.getElementById(id);
                    if (node) node.textContent = displayName;
                });
                ['rxjxt-welcome-initials'].forEach(id => {
                    const node = document.getElementById(id);
                    if (node) node.textContent = initials;
                });
                ['rxjxt-welcome-avatar'].forEach(id => {
                    const image = document.getElementById(id);
                    if (!image) return;
                    image.hidden = !avatarUrl;
                    image.onerror = () => { image.hidden = true; };
                    if (avatarUrl) image.src = avatarUrl;
                });
            };

            overlay._rxjxtIntroTimer = null;
            overlay._rxjxtOpenModal = () => {
                if (overlay.classList.contains('rxjxt-open')) return;
                rxjxtSetUserIdentity();
                overlay.classList.add('rxjxt-open');
                const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                if (!reduceMotion) {
                    overlay.classList.add('rxjxt-intro');
                    overlay._rxjxtIntroTimer = setTimeout(() => overlay.classList.remove('rxjxt-intro'), 1650);
                }
                const trigger = document.getElementById('rxjxt-header-btn');
                if (trigger) trigger.classList.add('rxjxt-pressed');
            };

            if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                dashContainer.querySelectorAll('.rxjxt-glass-card').forEach(card => {
                    card.addEventListener('pointermove', event => {
                        if (event.pointerType === 'touch') return;
                        const bounds = card.getBoundingClientRect();
                        const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
                        const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
                        card.style.setProperty('--rxjxt-card-tilt-x', `${((x - 0.5) * 4.5).toFixed(2)}deg`);
                        card.style.setProperty('--rxjxt-card-tilt-y', `${((0.5 - y) * 4.5).toFixed(2)}deg`);
                        card.style.setProperty('--rxjxt-pointer-x', `${(x * 100).toFixed(1)}%`);
                        card.style.setProperty('--rxjxt-pointer-y', `${(y * 100).toFixed(1)}%`);
                    });
                    card.addEventListener('pointerleave', () => {
                        card.style.setProperty('--rxjxt-card-tilt-x', '0deg');
                        card.style.setProperty('--rxjxt-card-tilt-y', '0deg');
                    });
                });
            }
            
            const updateDashboardTheme = (activeTab) => {
                dashContainer.className = '';
                if (activeTab === 'quest') dashContainer.classList.add(`theme-${window.rxjxtMode.toLowerCase()}`);
                else if (activeTab === 'deafen') dashContainer.classList.add(window.rxjxtDeafenToggle ? 'theme-deafen-on' : 'theme-deafen-off');
                const questActive = activeTab === 'quest' && !!window.rxjxtGrindToggle;
                dashContainer.classList.toggle('quest-active', questActive);
                const progressState = dashContainer.querySelector('.rxjxt-progress-caption span:last-child');
                if (progressState) {
                    const label = questActive ? (window.rxjxtQuestFound ? 'TRACKING' : 'SEARCHING') : 'STANDBY';
                    progressState.innerHTML = `<i></i> ${label}`;
                }
            };
            window.rxjxtUpdateDashboardTheme = updateDashboardTheme;

            document.querySelectorAll('.rxjxt-nav-item').forEach(tab => {
                tab.onclick = () => {
                    const target = tab.dataset.target;
                    const nextView = document.getElementById(`rxjxt-view-${target}`);
                    if (!nextView || nextView.classList.contains('active')) return;
                    document.querySelectorAll('.rxjxt-nav-item').forEach(t => {
                        t.classList.remove('active');
                        t.setAttribute('aria-selected', 'false');
                    });
                    document.querySelectorAll('.rxjxt-view').forEach(v => v.classList.remove('active'));
                    tab.classList.add('active');
                    tab.setAttribute('aria-selected', 'true');
                    nextView.classList.add('active');
                    updateDashboardTheme(target);
                    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                        nextView.animate([
                            { opacity: 0, filter: 'blur(7px)', transform: 'perspective(1000px) translateY(9px) rotateY(-3deg) scale(.99)' },
                            { opacity: 1, filter: 'blur(0)', transform: 'perspective(1000px) translateY(0) rotateY(0) scale(1)' }
                        ], { duration: 420, easing: 'cubic-bezier(.18,.82,.22,1)' });
                    }
                };
                tab.onkeydown = event => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        tab.click();
                    }
                };
            });

            const closeModal = () => {
                clearTimeout(overlay._rxjxtIntroTimer);
                overlay.classList.remove('rxjxt-intro');
                overlay.classList.remove('rxjxt-open');
                let t = document.getElementById('rxjxt-header-btn'); if(t) t.classList.remove('rxjxt-pressed');
            };
            overlay._rxjxtCloseModal = closeModal;
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
                        rxjxtShowToast('Installation', `${name} core successfully mounted.`, 'success');
                    } catch (e) { rxjxtLog('HUB', `Failed to install ${name}`, "error"); rxjxtShowToast('Error', `Failed to install ${name}`, 'error'); return null; }
                }
                return code;
            };

            const questInput = document.getElementById('rxjxt-grind-toggle');
            const stopCoreForMissingQuest = (reason = 'No active quest found. Core System is OFF.') => {
                clearTimeout(window.rxjxtQuestScanTimer);
                const wasRunning = !!window.rxjxtGrindToggle;
                window.rxjxtGrindToggle = false;
                window.rxjxtQuestFound = false;
                questInput.checked = false;
                try { window.rxjxtQuestEngine?.stop?.(); } catch (_) {}
                const questName = document.getElementById('rxjxt-current-quest');
                if (questName) questName.textContent = 'None Selected';
                rxjxtUpdateQuestUI('Idle', 0, 100, 'Idle');
                updateDashboardTheme(document.querySelector('.rxjxt-nav-item.active')?.dataset.target || 'quest');
                if (wasRunning) {
                    rxjxtLog('QUEST', reason, 'warn');
                    rxjxtShowToast('Core System Standby', reason, 'info');
                }
            };
            window.rxjxtStopCoreForMissingQuest = stopCoreForMissingQuest;
            questInput.addEventListener('change', async (e) => {
                window.rxjxtGrindToggle = e.target.checked;
                updateDashboardTheme(document.querySelector('.rxjxt-nav-item.active').dataset.target);

                if (!window.rxjxtGrindToggle) { 
                    clearTimeout(window.rxjxtQuestScanTimer);
                    rxjxtLog('QUEST', "Engine Paused.", "warn"); rxjxtUpdateQuestUI("Idle", 0, 100, "Idle"); 
                    if(window.rxjxtQuestEngine) window.rxjxtQuestEngine.stop(); 
                    document.getElementById('rxjxt-popup').style.display = 'none'; return; 
                }

                const existingQuest = document.getElementById('rxjxt-current-quest')?.textContent;
                window.rxjxtQuestFound = rxjxtIsQuestName(existingQuest);
                if (!window.rxjxtQuestFound) {
                    const statusEl = document.getElementById('rxjxt-live-status');
                    if (statusEl) statusEl.textContent = 'Searching';
                }
                
                let savedCode = await rxjxtLoadEngine(RXJXT_QUEST_URL, "QuestCode", "QuestVersion", "Quest Engine");
                if (!window.rxjxtGrindToggle) return;
                if (!savedCode) { stopCoreForMissingQuest('Quest engine could not be loaded. Core System is OFF.'); return; }
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
                        disableToggle: () => {
                            clearTimeout(window.rxjxtQuestScanTimer);
                            window.rxjxtGrindToggle = false;
                            window.rxjxtQuestFound = false;
                            document.getElementById('rxjxt-grind-toggle').checked = false;
                            updateDashboardTheme('quest');
                        },
                        setQuestName: (n) => {
                            const name = String(n ?? '').trim();
                            const nameEl = document.getElementById('rxjxt-current-quest');
                            if (nameEl) nameEl.textContent = rxjxtIsQuestName(name) ? name : 'None Selected';
                            if (rxjxtIsQuestName(name)) {
                                window.rxjxtQuestFound = true;
                                clearTimeout(window.rxjxtQuestScanTimer);
                                updateDashboardTheme(document.querySelector('.rxjxt-nav-item.active')?.dataset.target || 'quest');
                            } else if (/no (?:active )?quests?|quest not found/i.test(name)) stopCoreForMissingQuest();
                        }
                    };
                    window.rxjxtQuestEngine.start(rxjxtLog, rxjxtUpdateQuestUI, () => window.rxjxtGrindToggle, () => window.rxjxtMode, apiCore);
                    clearTimeout(window.rxjxtQuestScanTimer);
                    if (window.rxjxtGrindToggle && !window.rxjxtQuestFound) {
                        window.rxjxtQuestScanTimer = setTimeout(() => {
                            if (window.rxjxtGrindToggle && !window.rxjxtQuestFound) stopCoreForMissingQuest();
                        }, 12000);
                    }
                } catch (err) {
                    rxjxtLog('QUEST', "Corrupted Engine or Error.", "error");
                    stopCoreForMissingQuest('Quest engine failed to start. Core System is OFF.');
                }
            });

            const modeButton = document.getElementById('rxjxt-mode-btn');
            const renderModeButton = () => {
                const isRage = window.rxjxtMode === 'RAGE';
                modeButton.dataset.mode = isRage ? 'rage' : 'stealth';
                modeButton.innerHTML = `${isRage ? rageSVG : stealthSVG}<span>${isRage ? 'Rage' : 'Stealth'}</span>`;
            };
            renderModeButton();
            modeButton.onclick = () => {
                window.rxjxtMode = window.rxjxtMode === 'STEALTH' ? 'RAGE' : 'STEALTH'; 
                renderModeButton();
                updateDashboardTheme(document.querySelector('.rxjxt-nav-item.active').dataset.target);
                rxjxtLog('QUEST', `Operating Mode switched to ${window.rxjxtMode}`, window.rxjxtMode === 'RAGE' ? "brand" : "info");
                rxjxtShowToast('Profile Change', `Switched to ${window.rxjxtMode} parameters.`, window.rxjxtMode === 'RAGE' ? 'error' : 'success');
            };

            const isConnectedToVC = rxjxtIsConnectedToVC;

            const deafenInput = document.getElementById('rxjxt-deafen-toggle');
            deafenInput.addEventListener('change', async (e) => {
                if (e.target.checked && !isConnectedToVC()) {
                    e.target.checked = false; window.rxjxtDeafenToggle = false; rxjxtLog('DEAFEN', "Connect to VC first!", "warn");
                    rxjxtShowToast('Action Denied', 'Please establish a Voice Connection first.', 'error');
                    const statEl = document.getElementById('rxjxt-deafen-status');
                    if(statEl) { statEl.innerText = "No VC Detected"; statEl.style.color = '#FF453A'; setTimeout(() => { if (!window.rxjxtDeafenToggle && statEl) { statEl.innerText = "Inactive"; statEl.style.color = 'rgba(255,255,255,0.5)'; } }, 3000); } return;
                }

                window.rxjxtDeafenToggle = e.target.checked;
                updateDashboardTheme(document.querySelector('.rxjxt-nav-item.active').dataset.target);
                
                let savedCode = await rxjxtLoadEngine(RXJXT_DEAFEN_URL, "DeafenCode", "DeafenVersion", "Deafen Engine");
                if (!savedCode) { e.target.checked = false; window.rxjxtDeafenToggle = false; updateDashboardTheme('deafen'); return; }
                try {
                    eval(savedCode);
                    const updateUI = (text, color, isGlow) => {
                        const statEl = document.getElementById('rxjxt-deafen-status');
                        statEl.innerText = isGlow ? "Active Routing" : "Inactive";
                        statEl.style.color = isGlow ? '#FF453A' : 'rgba(255,255,255,0.5)';
                        if(isGlow) statEl.style.textShadow = '0 0 10px rgba(255,69,58,0.5)'; else statEl.style.textShadow = 'none';
                        if (document.querySelector('.rxjxt-nav-item[data-target="deafen"]').classList.contains('active')) updateDashboardTheme('deafen');
                    };
                    if (window.rxjxtDeafenToggle) window.rxjxtDeafenEngine.start(rxjxtLog, updateUI); else window.rxjxtDeafenEngine.stop(rxjxtLog, updateUI);
                } catch (err) {
                    rxjxtLog('DEAFEN', "Corrupted Module execution.", "error");
                    e.target.checked = false;
                    window.rxjxtDeafenToggle = false;
                    try { window.rxjxtDeafenEngine?.stop?.(rxjxtLog, () => {}); } catch (_) {}
                    updateDashboardTheme('deafen');
                }
            });

            fetch(RXJXT_HUB_URL + "?t=" + Date.now(), {cache: "no-store"}).then(res => res.text()).then(code => {
                let match = code.match(/@version\s+([0-9.]+)/);
                if(match && match[1] !== RXJXT_HUB_VER) {
                    window.rxjxtUpdateAvailable = true; 
                    const btn = document.getElementById('rxjxt-update-hub'); btn.style.display = 'inline-flex'; document.getElementById('rxjxt-uhub-text').innerText = `v${match[1]}`;
                    const mainRing = document.getElementById('rxjxt-header-ring'); if (mainRing) { mainRing.style.boxShadow = '0 0 15px rgba(50,173,230,0.6)'; }
                    btn.onclick = () => { 
                        require('fs').writeFileSync(require('path').join(BdApi.Plugins.folder, "RXJXT.plugin.js"), code); 
                        rxjxtShowToast('Core Updated', `Hub updated to v${match[1]}. Restarting service...`, 'success');
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
                        rxjxtLog('HUB', `${name} background updated to v${match[1]}!`, "success"); 
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
            if (window.rxjxtGrindToggle) {
                const reportedState = `${String(qName ?? '')} ${String(stat ?? '')}`;
                if (/no (?:active )?quests?|quest not found|no quest found/i.test(reportedState)) {
                    window.rxjxtStopCoreForMissingQuest?.();
                    return;
                }
                if (rxjxtIsQuestName(qName)) {
                    window.rxjxtQuestFound = true;
                    clearTimeout(window.rxjxtQuestScanTimer);
                    const questNameEl = document.getElementById('rxjxt-current-quest');
                    if (questNameEl) questNameEl.textContent = String(qName).trim();
                    window.rxjxtUpdateDashboardTheme?.(document.querySelector('.rxjxt-nav-item.active')?.dataset.target || 'quest');
                }
            }
        };

        window.rxjxtVoiceWatcher = setInterval(() => {
            if (window.rxjxtDeafenToggle) {
                const inVC = !!document.querySelector('button[aria-label="Disconnect"]') || !!document.querySelector('button[aria-label="Disconnect from Voice"]');
                if (!inVC) {
                    rxjxtLog('DEAFEN', "VC Connection lost. Halting routing.", "warn");
                    rxjxtShowToast('Voice Disconnected', 'Auto-stopping Virtual Audio Routing.', 'error');
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
            const toolbar = document.querySelector('section [class*="toolbar_"]');
            
            let btn = document.getElementById('rxjxt-header-btn'); 
            if (toolbar && !btn) {
                btn = document.createElement('div'); btn.id = 'rxjxt-header-btn'; 
                btn.style.cssText = 'display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative; margin-left: 4px; margin-right: 4px;';
                btn.setAttribute('role', 'button');
                btn.setAttribute('aria-label', 'Open RXJXT dashboard');
                btn.setAttribute('aria-pressed', 'false');
                btn.tabIndex = 0;
                
                btn.innerHTML = `<div id="rxjxt-header-ring"><div id="rxjxt-header-inner"><img src="${CUSTOM_LOGO_URL}" class="rxjxt-custom-logo" alt="RX"></div><span id="rxjxt-dashboard-shovel" aria-hidden="true"><svg class="rxjxt-shovel-static" viewBox="0 0 24 24" fill="none" aria-hidden="true"><defs><linearGradient id="rxjxt-shovel-blade" x1="2" y1="21" x2="10" y2="12" gradientUnits="userSpaceOnUse"><stop stop-color="#a90c20"/><stop offset=".58" stop-color="#ff3045"/><stop offset="1" stop-color="#ff9aa4"/></linearGradient><linearGradient id="rxjxt-shovel-handle" x1="9" y1="15" x2="21" y2="3" gradientUnits="userSpaceOnUse"><stop stop-color="#8e0d1d"/><stop offset=".55" stop-color="#ff4055"/><stop offset="1" stop-color="#ffc0c5"/></linearGradient></defs><g class="rxjxt-shovel-action"><path d="M18.7 5.1 8.5 15.2" stroke="url(#rxjxt-shovel-handle)" stroke-width="3" stroke-linecap="round"/><path d="m17.9 4.4 2.8-2.7 2 2-2.7 2.8" fill="#a90c20" stroke="#ff8792" stroke-width=".8" stroke-linejoin="round"/><path d="M9.2 14.1c-2.3-2.4-5.7-1.5-6.6 1.5l-1.8 5.1c-.2.6.4 1.2 1 .9l5.1-1.8c3-1 3.8-4.3 1.5-6.6l-.1-.1Z" fill="url(#rxjxt-shovel-blade)" stroke="#ff8994" stroke-width=".8" stroke-linejoin="round"/><path d="m5.3 15.1 3.2 3.2" stroke="#ffc1c6" stroke-opacity=".72" stroke-width=".8" stroke-linecap="round"/></g><circle class="rxjxt-shovel-dirt rxjxt-shovel-dirt-1" cx="2.2" cy="13.3" r=".8" fill="#ff5365"/><circle class="rxjxt-shovel-dirt rxjxt-shovel-dirt-2" cx="5.8" cy="11.7" r=".65" fill="#ffbac0"/><circle class="rxjxt-shovel-dirt rxjxt-shovel-dirt-3" cx="1.1" cy="17" r=".55" fill="#d8172e"/></svg><img class="rxjxt-shovel-gif" data-src="${SHOVEL_DIG_GIF_URL}" alt=""></span></div>`;
                toolbar.appendChild(btn);
                
                btn.onclick = (e) => {
                    e.preventDefault(); e.stopPropagation();
                    const overlay = document.getElementById('rxjxt-overlay');
                    const wasOpen = overlay.classList.contains('rxjxt-open');
                    if (wasOpen) overlay._rxjxtCloseModal?.();
                    else overlay._rxjxtOpenModal?.();
                    btn.classList.toggle('rxjxt-dashboard-open', !wasOpen);
                    btn.setAttribute('aria-pressed', String(!wasOpen));
                };
                btn.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); } };
            }

            let vcBtn = document.getElementById('rxjxt-vc-btn');
            if (toolbar && btn && !vcBtn) {
                const speakerSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon class="rxjxt-speaker-body" points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path class="rxjxt-speaker-wave rxjxt-speaker-wave-near" d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path class="rxjxt-speaker-wave rxjxt-speaker-wave-far" d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;
                
                vcBtn = document.createElement('div'); vcBtn.id = 'rxjxt-vc-btn';
                vcBtn.style.cssText = 'display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative;';
                vcBtn.setAttribute('role', 'button');
                vcBtn.setAttribute('aria-label', 'Connect to voice channel');
                vcBtn.setAttribute('aria-pressed', 'false');
                vcBtn.title = 'Connect to voice channel';
                vcBtn.tabIndex = 0;
                vcBtn.innerHTML = speakerSVG;
                
                vcBtn.onclick = () => {
                    let success = false;
                    const channelId = "1354309619828396296";

                    try {
                        const modules = BdApi.Webpack ? BdApi.Webpack.getModules(m => m) : [];
                        
                        // Method 1: Deep Memory Traversal
                        for (const m of modules) {
                            if (!m) continue;
                            if (typeof m.selectVoiceChannel === 'function') {
                                m.selectVoiceChannel(channelId);
                                success = true; break;
                            }
                            if (m.default && typeof m.default.selectVoiceChannel === 'function') {
                                m.default.selectVoiceChannel(channelId);
                                success = true; break;
                            }
                        }

                        // Method 2: Native Router Fallback
                        if (!success) {
                            const ChannelStore = BdApi.Webpack ? BdApi.Webpack.getModule(BdApi.Webpack.Filters.byProps("getChannel")) : BdApi.findModuleByProps("getChannel");
                            const Router = BdApi.Webpack ? BdApi.Webpack.getModule(BdApi.Webpack.Filters.byProps("transitionTo")) : BdApi.findModuleByProps("transitionTo");
                            
                            if (ChannelStore && Router) {
                                const channel = ChannelStore.getChannel(channelId);
                                if (channel && channel.guild_id) {
                                    Router.transitionTo(`/channels/${channel.guild_id}/${channelId}`);
                                    success = true;
                                }
                            }
                        }

                        // Method 3: Core Dispatch Injection
                        if (!success) {
                            const Dispatcher = BdApi.Webpack ? BdApi.Webpack.getModule(BdApi.Webpack.Filters.byProps("dispatch", "subscribe")) : BdApi.findModuleByProps("dispatch", "subscribe");
                            if (Dispatcher) {
                                Dispatcher.dispatch({ type: "VOICE_CHANNEL_SELECT", channelId: channelId, currentVoiceChannelId: null, video: false });
                                success = true;
                            }
                        }
                    } catch (e) {
                        console.error("[ RXJXT ] VC Connector Exception:", e);
                    }

                    if (success) {
                        rxjxtShowToast('Audio Connection', "Connecting to Voice Channel...", 'success');
                    } else {
                        rxjxtShowToast('Error', 'Deep connection failed. Webpack module hidden.', 'error');
                    }
                };
                vcBtn.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); vcBtn.click(); } };
                
                toolbar.insertBefore(vcBtn, btn);
            }

            if (btn) {
                const overlay = document.getElementById('rxjxt-overlay');
                const isOpen = !!overlay?.classList.contains('rxjxt-open');
                const progressPct = Math.max(0, Math.min(100, Number(window.rxjxtCurrentProg) || 0));
                btn.classList.toggle('rxjxt-dashboard-open', isOpen);
                btn.style.setProperty('--rxjxt-toolbar-progress-angle', `${(3.6 * progressPct).toFixed(1)}deg`);
                const isGrinding = !!window.rxjxtGrindToggle;
                const animateShovel = isGrinding && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                btn.classList.toggle('rxjxt-toolbar-active', isGrinding);
                btn.classList.toggle('rxjxt-shovel-animated', animateShovel);
                const shovelGif = btn.querySelector('.rxjxt-shovel-gif');
                if (shovelGif) {
                    if (animateShovel && shovelGif.getAttribute('src') !== shovelGif.dataset.src) shovelGif.setAttribute('src', shovelGif.dataset.src);
                    else if (!animateShovel && shovelGif.hasAttribute('src')) shovelGif.removeAttribute('src');
                }
                btn.setAttribute('aria-pressed', String(isOpen));
            }
            if (vcBtn) {
                const connected = rxjxtIsConnectedToVC();
                vcBtn.classList.toggle('rxjxt-vc-connected', connected);
                vcBtn.setAttribute('aria-label', connected ? 'Connected to voice channel' : 'Connect to voice channel');
                vcBtn.setAttribute('aria-pressed', String(connected));
                vcBtn.title = connected ? 'Connected to voice channel' : 'Connect to voice channel';
            }
        };
        window.rxjxtToolbarInterval = setInterval(rxjxtEnsureIcon, 1000);
        rxjxtInjectUI(); rxjxtLog('HUB', "Liquid Glass Engine Activated.", "brand");
    }

    stop() {
        if (window.rxjxtTimer) clearInterval(window.rxjxtTimer); if (window.rxjxtToolbarInterval) clearInterval(window.rxjxtToolbarInterval); if (window.rxjxtVoiceWatcher) clearInterval(window.rxjxtVoiceWatcher); if (window.rxjxtQuestScanTimer) clearTimeout(window.rxjxtQuestScanTimer); if (window.rxjxtQuestEngine) window.rxjxtQuestEngine.stop();
        window.rxjxtEngineRunning = false; window.rxjxtGrindToggle = false; window.rxjxtQuestFound = false; window.rxjxtDeafenToggle = false;
        if (window.rxjxtWSHooked && window.rxjxtOriginalWS) { window.WebSocket.prototype.send = window.rxjxtOriginalWS; window.rxjxtWSHooked = false; }
        const ui = document.getElementById('rxjxt-overlay'); if (ui) ui.remove();
        const toastUI = document.getElementById('rxjxt-toast-container'); if (toastUI) toastUI.remove();
        const headerBtn = document.getElementById('rxjxt-header-btn'); if (headerBtn) headerBtn.remove();
        const vcBtn = document.getElementById('rxjxt-vc-btn'); if (vcBtn) vcBtn.remove();
        const style = document.getElementById('rxjxt-styles'); if (style) style.remove();
    }
};




