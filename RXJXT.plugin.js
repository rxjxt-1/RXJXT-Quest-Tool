/**
 * @name RXJXTQuestDashboard
 * @author RXJXT
 * @description RXJXT Liquid Hub: v15.1.5 (Deep Webpack Traversal VC Joiner)
 * @version 15.1.5
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
        
        const RXJXT_HUB_VER = "15.1.5";
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

        const rxjxtInjectUI = () => {
            if (document.getElementById('rxjxt-overlay')) return;
            const style = document.createElement('style'); style.id = "rxjxt-styles";
            style.innerHTML = `
                @import url('https://fonts.cdnfonts.com/css/sf-pro-display');
                
                @keyframes rxjxtFadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes rxjxtScaleUp { from { opacity: 0; transform: scale(0.92) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                @keyframes rxjxtPulseUpdate { 0% { box-shadow: 0 0 0 0 rgba(50, 173, 230, 0.4); } 70% { box-shadow: 0 0 0 10px rgba(50, 173, 230, 0); } 100% { box-shadow: 0 0 0 0 rgba(50, 173, 230, 0); } }

                #rxjxt-overlay { 
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(5, 5, 8, 0.6); backdrop-filter: blur(24px) saturate(160%); -webkit-backdrop-filter: blur(24px) saturate(160%);
                    z-index: 9999999; display: flex; flex-direction: column; justify-content: center; align-items: center;
                    opacity: 0; pointer-events: none; transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    font-family: "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif; color: #fff;
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
            `;
            document.head.appendChild(style);

            document.body.insertAdjacentHTML('beforeend', `<div id="rxjxt-toast-container"></div>`);

            const leafWreathSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.5 10c-.3-1.7-1.1-3.2-2.3-4.3-.9-.9-2.3-1.2-3.5-.8-.7.2-1.3.7-1.7 1.3-.2-.5-.5-1-.9-1.4-1.3-1.1-3.2-1.3-4.7-.5-1.5.8-2.5 2.2-2.5 3.9 0 1.5.6 2.9 1.7 3.9C6.5 13.2 6 14.5 6 16c0 1.6.8 3.1 2.2 4 1.1.7 2.4 1 3.8.8.7.6 1.6 1 2.5 1s1.8-.3 2.5-1c1.4.2 2.7-.1 3.8-.8 1.4-.9 2.2-2.4 2.2-4 0-1.5-.5-2.8-1.5-3.9 1-1 1.6-2.4 1.6-3.9 0-.1 0-.1-.1-.2z"/></svg>`;
            const incognitoHatSVG = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 13h-2.14l-2.7-7.2c-.22-.59-.78-1-1.42-1h-7.5c-.64 0-1.2.41-1.42 1L4.14 13H2v2h20v-2zM9 16c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zm6 0c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
            const dashboardSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>`;
            const micOffSVG = `<svg id="rxjxt-deafen-mic" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"></line><path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6"></path><path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
            const downloadSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;

            document.body.insertAdjacentHTML('beforeend', `
                <div id="rxjxt-overlay">
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
                            <div class="rxjxt-nav-group">
                                <div class="rxjxt-nav-item active" data-target="quest">
                                    ${leafWreathSVG} Quest Engine
                                </div>
                                <div class="rxjxt-nav-item" data-target="deafen">
                                    ${incognitoHatSVG} Audio Mask
                                </div>
                            </div>
                            <div class="rxjxt-nav-group">
                                <button id="rxjxt-update-hub">
                                    ${downloadSVG} Update <span id="rxjxt-uhub-text" style="margin-left:2px;"></span>
                                </button>
                                <div class="rxjxt-close-btn rxjxt-x-btn">✕</div>
                            </div>
                        </div>

                        <div id="rxjxt-view-quest" class="rxjxt-view active">
                            <div class="rxjxt-glass-card">
                                <div class="rxjxt-card-header">
                                    <div class="rxjxt-card-title">${dashboardSVG} Core System</div>
                                    <label class="rxjxt-toggle"><input type="checkbox" id="rxjxt-grind-toggle"><span class="rxjxt-slider"></span></label>
                                </div>
                                <div>
                                    <span class="rxjxt-label">Engine Status</span>
                                    <div class="rxjxt-value rxjxt-mode-indicator" id="rxjxt-live-status">Idle</div>
                                </div>
                            </div>

                            <div class="rxjxt-glass-card">
                                <div class="rxjxt-card-header">
                                    <div class="rxjxt-card-title">Target Parameters</div>
                                    <button id="rxjxt-mode-btn">Stealth 🌿</button>
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
                                <label class="rxjxt-toggle"><input type="checkbox" id="rxjxt-deafen-toggle"><span class="rxjxt-slider"></span></label>
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
            
            const updateDashboardTheme = (activeTab) => {
                dashContainer.className = '';
                if (activeTab === 'quest') dashContainer.classList.add(`theme-${window.rxjxtMode.toLowerCase()}`);
                else if (activeTab === 'deafen') dashContainer.classList.add(window.rxjxtDeafenToggle ? 'theme-deafen-on' : 'theme-deafen-off');
            };

            document.querySelectorAll('.rxjxt-nav-item').forEach(tab => {
                tab.onclick = () => {
                    document.querySelectorAll('.rxjxt-nav-item').forEach(t => t.classList.remove('active'));
                    document.querySelectorAll('.rxjxt-view').forEach(v => v.classList.remove('active'));
                    tab.classList.add('active');
                    const target = tab.dataset.target;
                    document.getElementById(`rxjxt-view-${target}`).classList.add('active');
                    updateDashboardTheme(target);
                };
            });

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
                        rxjxtShowToast('Installation', `${name} core successfully mounted.`, 'success');
                    } catch (e) { rxjxtLog('HUB', `Failed to install ${name}`, "error"); rxjxtShowToast('Error', `Failed to install ${name}`, 'error'); return null; }
                }
                return code;
            };

            const questInput = document.getElementById('rxjxt-grind-toggle');
            questInput.addEventListener('change', async (e) => {
                window.rxjxtGrindToggle = e.target.checked;
                updateDashboardTheme(document.querySelector('.rxjxt-nav-item.active').dataset.target);

                if (!window.rxjxtGrindToggle) { 
                    rxjxtLog('QUEST', "Engine Paused.", "warn"); rxjxtUpdateQuestUI("Idle", 0, 100, "Idle"); 
                    if(window.rxjxtQuestEngine) window.rxjxtQuestEngine.stop(); 
                    document.getElementById('rxjxt-popup').style.display = 'none'; return; 
                }
                
                let savedCode = await rxjxtLoadEngine(RXJXT_QUEST_URL, "QuestCode", "QuestVersion", "Quest Engine");
                if (!savedCode) { e.target.checked = false; window.rxjxtGrindToggle = false; updateDashboardTheme('quest'); return; }
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
                        disableToggle: () => { window.rxjxtGrindToggle = false; document.getElementById('rxjxt-grind-toggle').checked = false; updateDashboardTheme('quest'); },
                        setQuestName: (n) => { document.getElementById('rxjxt-current-quest').innerText = n; }
                    };
                    window.rxjxtQuestEngine.start(rxjxtLog, rxjxtUpdateQuestUI, () => window.rxjxtGrindToggle, () => window.rxjxtMode, apiCore);
                } catch (err) { rxjxtLog('QUEST', "Corrupted Engine or Error.", "error"); }
            });

            document.getElementById('rxjxt-mode-btn').onclick = () => {
                window.rxjxtMode = window.rxjxtMode === 'STEALTH' ? 'RAGE' : 'STEALTH'; 
                document.getElementById('rxjxt-mode-btn').innerText = window.rxjxtMode === 'RAGE' ? 'Rage Mode 🔥' : 'Stealth 🌿';
                updateDashboardTheme(document.querySelector('.rxjxt-nav-item.active').dataset.target);
                rxjxtLog('QUEST', `Operating Mode switched to ${window.rxjxtMode}`, window.rxjxtMode === 'RAGE' ? "brand" : "info");
                rxjxtShowToast('Profile Change', `Switched to ${window.rxjxtMode} parameters.`, window.rxjxtMode === 'RAGE' ? 'error' : 'success');
            };

            const isConnectedToVC = () => !!document.querySelector('button[aria-label="Disconnect"]') || !!document.querySelector('button[aria-label="Disconnect from Voice"]');

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
                } catch (err) { rxjxtLog('DEAFEN', "Corrupted Module execution.", "error"); }
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
                
                btn.innerHTML = `<div id="rxjxt-header-ring"><div id="rxjxt-header-inner"><img src="${CUSTOM_LOGO_URL}" class="rxjxt-custom-logo" alt="RX"></div></div>`;
                toolbar.appendChild(btn);
                
                btn.onclick = (e) => {
                    e.preventDefault(); e.stopPropagation();
                    const overlay = document.getElementById('rxjxt-overlay');
                    if(overlay.classList.contains('rxjxt-open')) { overlay.classList.remove('rxjxt-open'); btn.classList.remove('rxjxt-pressed'); } 
                    else { overlay.classList.add('rxjxt-open'); btn.classList.add('rxjxt-pressed'); }
                };
            }

            let vcBtn = document.getElementById('rxjxt-vc-btn');
            if (toolbar && btn && !vcBtn) {
                const speakerSVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
                
                vcBtn = document.createElement('div'); vcBtn.id = 'rxjxt-vc-btn';
                vcBtn.style.cssText = 'display: flex; align-items: center; justify-content: center; cursor: pointer; width: 34px; height: 34px; border-radius: 50%; background: rgba(255,255,255,0.05); margin-left: 8px; margin-right: 4px; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); color: rgba(255,255,255,0.7); box-shadow: inset 0 0 0 1px rgba(255,255,255,0.1);';
                vcBtn.innerHTML = speakerSVG;
                
                vcBtn.onmouseover = () => { vcBtn.style.background = 'rgba(255,255,255,0.15)'; vcBtn.style.color = '#fff'; vcBtn.style.transform = 'scale(1.08)'; };
                vcBtn.onmouseout = () => { vcBtn.style.background = 'rgba(255,255,255,0.05)'; vcBtn.style.color = 'rgba(255,255,255,0.7)'; vcBtn.style.transform = 'scale(1)'; };
                
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
                
                toolbar.insertBefore(vcBtn, btn);
            }

            if (btn) {
                const hRing = document.getElementById('rxjxt-header-ring');
                if (hRing) {
                    let rCol = window.rxjxtGrindToggle ? (window.rxjxtMode === 'RAGE' ? '#FF453A' : '#30D158') : (window.rxjxtDeafenToggle ? '#FF453A' : '#ffffff40'); 
                    let pct = window.rxjxtGrindToggle ? window.rxjxtCurrentProg : 100;
                    hRing.style.backgroundImage = `conic-gradient(${rCol} 0%, ${rCol} ${pct}%, transparent ${pct}%, transparent 100%)`; 
                    hRing.style.backgroundColor = `rgba(255,255,255,0.05)`;
                }
            }
        };
        window.rxjxtToolbarInterval = setInterval(rxjxtEnsureIcon, 1000);
        rxjxtInjectUI(); rxjxtLog('HUB', "Liquid Glass Engine Activated.", "brand");
    }

    stop() {
        if (window.rxjxtTimer) clearInterval(window.rxjxtTimer); if (window.rxjxtToolbarInterval) clearInterval(window.rxjxtToolbarInterval); if (window.rxjxtVoiceWatcher) clearInterval(window.rxjxtVoiceWatcher); if (window.rxjxtQuestEngine) window.rxjxtQuestEngine.stop();
        window.rxjxtEngineRunning = false; window.rxjxtGrindToggle = false; window.rxjxtDeafenToggle = false;
        if (window.rxjxtWSHooked && window.rxjxtOriginalWS) { window.WebSocket.prototype.send = window.rxjxtOriginalWS; window.rxjxtWSHooked = false; }
        const ui = document.getElementById('rxjxt-overlay'); if (ui) ui.remove();
        const toastUI = document.getElementById('rxjxt-toast-container'); if (toastUI) toastUI.remove();
        const headerBtn = document.getElementById('rxjxt-header-btn'); if (headerBtn) headerBtn.remove();
        const vcBtn = document.getElementById('rxjxt-vc-btn'); if (vcBtn) vcBtn.remove();
        const style = document.getElementById('rxjxt-styles'); if (style) style.remove();
    }
};
