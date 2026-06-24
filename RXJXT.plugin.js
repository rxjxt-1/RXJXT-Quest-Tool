/**
 * @name RXJXTQuestDashboard
 * @author RXJXT
 * @description Smooth Dropdown UI, Custom Logo, Force Server Jump & Auto-Grind.
 * @version 7.6.5
 * @updateUrl https://raw.githubusercontent.com/rxjxt-1/RXJXT-Quest-Tool/refs/heads/main/RXJXT.plugin.js
 */

module.exports = class RXJXTQuestDashboard {
    start() {
        if (window.rxjxtEngineRunning) return;
        window.rxjxtEngineRunning = true;

        console.clear();
        const sleep = ms => new Promise(res => setTimeout(res, ms));

        // ==========================================
        // RXJXT CONFIGURATION (YAHAN CHANGES KARO)
        // ==========================================
        const CURRENT_VERSION = "7.6.5";
        const UPDATE_URL = "https://raw.githubusercontent.com/rxjxt-1/RXJXT-Quest-Tool/refs/heads/main/RXJXT.plugin.js";
        
        // APNA LOGO LINK YAHAN DAALO 👇
        const CUSTOM_LOGO_URL = "https://cdn.discordapp.com/attachments/1354865979145978109/1432999976543322202/b3e66a70-76a7-455b-8c40-6fccf7dc6193_1.png?ex=6a3cddba&is=6a3b8c3a&hm=d8474058ce1fa9b246f66919c6b90e8371236e70ed09ed4e54ba4a8e5a9b0438&"; 
        const SERVER_INVITE_LINK = "https://discord.gg/DDPmSywBcV";
        
        // SERVER ID (Tumhari embed kar di gayi hai)
        const SERVER_ID = "1301844105604890624"; 
        const CHANNEL_ID = ""; 

        const rxjxtLog = (msg, type = "info") => {
            const colors = { info: "#00f3ff", success: "#fcee0a", warn: "#ff9d00", error: "#ff003c", brand: "#ff003c", finish: "#43b581" };
            const color = colors[type] || colors.info;
            console.log(`%c[ RXJXT ]%c ${msg}`, `color: #000; background: ${color}; font-weight: bold; padding: 2px 6px; border-radius: 3px;`, `color: ${color}; font-weight: bold; padding-left: 5px; text-shadow: 0 0 5px ${color};`);

            const logBox = document.getElementById('rxjxt-terminal');
            if (logBox) {
                const time = new Date().toLocaleTimeString('en-US', { hour12: false });
                const logEntry = document.createElement('div');
                logEntry.innerHTML = `<span style="color: rgba(255,255,255,0.4);">[${time}]</span> <span style="color: ${color}; text-shadow: 0 0 3px ${color};">${msg}</span>`;
                logBox.appendChild(logEntry);
                logBox.scrollTop = logBox.scrollHeight;
            }
        };

        const injectLiquidUI = () => {
            if (document.getElementById('rxjxt-liquid-ui')) return;
            const style = document.createElement('style');
            style.id = "rxjxt-styles";
            style.innerHTML = `
                @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;700&family=Share+Tech+Mono&display=swap');
                
                #rxjxt-liquid-ui { position: fixed; top: 65px; right: 15px; z-index: 9999999; font-family: 'Share Tech Mono', monospace; color: #fff; perspective: 1000px; }
                
                #rxjxt-main-dash { 
                    width: 380px; 
                    background: rgba(10, 15, 20, 0.6); 
                    backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); 
                    border: 1px solid rgba(0, 243, 255, 0.4); 
                    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(0,243,255,0.1); 
                    border-radius: 12px; overflow: hidden; position: relative;
                    
                    opacity: 0;
                    transform: translateY(-20px) scale(0.95);
                    transform-origin: top right;
                    pointer-events: none;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                
                #rxjxt-main-dash.rxjxt-open {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                    pointer-events: auto;
                }

                #rxjxt-main-dash::before { content: ""; position: absolute; top:0; left:0; width:100%; height:100%; background: repeating-linear-gradient(transparent, transparent 2px, rgba(0, 243, 255, 0.03) 3px); pointer-events: none; z-index: 0; }
                
                .rxjxt-header { background: linear-gradient(90deg, rgba(255,0,60,0.8) 0%, rgba(0,0,0,0.2) 100%); padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(252, 238, 10, 0.5); position: relative; z-index: 20; }
                .rxjxt-brand-name { font-family: 'Rajdhani', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: 2px; text-shadow: 0 0 10px #ff003c; animation: glitch 3s infinite; }
                .rxjxt-controls { display: flex; gap: 15px; }
                .rxjxt-btn-icon { color: #00f3ff; cursor: pointer; font-weight: bold; transition: 0.2s; text-shadow: 0 0 5px #00f3ff; font-size: 16px; }
                .rxjxt-btn-icon:hover { color: #fff; text-shadow: 0 0 15px #fff; transform: scale(1.3); }
                
                #rxjxt-update-btn { display: none; color: #fcee0a; text-shadow: 0 0 10px #ff9d00; animation: pulse-mini 1s infinite; font-size: 18px; margin-right: 5px; }
                #rxjxt-update-btn:hover { color: #fff; text-shadow: 0 0 20px #00f3ff; transform: scale(1.4); }

                .rxjxt-body { padding: 20px; position: relative; z-index: 3; }
                .rxjxt-status-box { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 12px; }
                #rxjxt-live-status { color: #fcee0a; font-weight: bold; text-shadow: 0 0 5px #fcee0a; }
                #rxjxt-eta { color: #00f3ff; font-weight: bold; }
                .rxjxt-label { font-size: 11px; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-bottom: 4px; display: block; }
                .rxjxt-value { font-size: 14px; color: #fff; text-shadow: 0 0 8px #00f3ff; margin-bottom: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                
                .rxjxt-progress-wrapper { width: 100%; height: 8px; background: rgba(0,0,0,0.6); border: 1px solid rgba(0, 243, 255, 0.3); border-radius: 4px; position: relative; margin-bottom: 20px; overflow: hidden; box-shadow: inset 0 0 5px #000; }
                .rxjxt-progress-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #00f3ff, #fcee0a); box-shadow: 0 0 15px #fcee0a; transition: width 0.4s ease; position: relative; }
                
                .rxjxt-terminal-container { background: rgba(0, 0, 0, 0.6); border: 1px solid rgba(255,0,60,0.3); border-left: 3px solid #ff003c; border-radius: 4px; padding: 10px; height: 120px; overflow-y: auto; font-size: 11px; box-shadow: inset 0 0 10px rgba(0,0,0,0.8); }
                .rxjxt-terminal-container::-webkit-scrollbar { width: 4px; }
                .rxjxt-terminal-container::-webkit-scrollbar-thumb { background: #00f3ff; border-radius: 2px; }

                #rxjxt-header-btn { margin: 0 12px !important; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                #rxjxt-header-btn:hover { transform: translateY(-3px) scale(1.15); filter: drop-shadow(0px 8px 12px rgba(255,0,60,0.5)); }
                
                #rxjxt-header-ring { width: 34px; height: 34px; border-radius: 50%; background: conic-gradient(#00f3ff var(--rxjxt-prog, 0%), rgba(255,0,60,0.2) 0); display: flex; justify-content: center; align-items: center; box-shadow: 0 0 10px rgba(0, 243, 255, 0.4); transition: background 0.3s ease; animation: pulse-mini-ring 3s infinite; }
                #rxjxt-header-inner { width: 26px; height: 26px; background: #1e1f22; border-radius: 50%; display: flex; justify-content: center; align-items: center; overflow: hidden; box-shadow: inset 0 0 8px rgba(0,0,0,0.8); }
                .rxjxt-custom-logo { width: 18px; height: 18px; object-fit: contain; transition: transform 0.3s ease; }
                #rxjxt-header-btn:hover .rxjxt-custom-logo { transform: scale(1.2); }
                
                #rxjxt-popup { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); z-index: 10; display: none; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 50px 20px 20px 20px; box-sizing: border-box; }
                .rxjxt-popup-title { color: #ff003c; font-size: 18px; font-weight: bold; margin-bottom: 10px; text-shadow: 0 0 10px #ff003c; }
                .rxjxt-popup-text { color: #aaa; font-size: 12px; margin-bottom: 20px; }
                .rxjxt-action-btn { background: rgba(0, 243, 255, 0.1); border: 1px solid #00f3ff; color: #00f3ff; padding: 8px 20px; font-family: inherit; font-weight: bold; cursor: pointer; transition: 0.3s; box-shadow: 0 0 10px rgba(0, 243, 255, 0.2); border-radius: 4px; }
                .rxjxt-action-btn:hover { background: #00f3ff; color: #000; box-shadow: 0 0 20px #00f3ff; }
                
                @keyframes pulse-mini-ring { 0%, 100% { box-shadow: 0 0 5px rgba(255,0,60,0.4); } 50% { box-shadow: 0 0 15px rgba(0,243,255,0.7); } }
                @keyframes glitch { 0%, 100% { transform: translate(0); } 20% { transform: translate(-1px, 1px); } 40% { transform: translate(1px, -1px); } }
            `;
            document.head.appendChild(style);

            document.body.insertAdjacentHTML('beforeend', `
                <div id="rxjxt-liquid-ui">
                    <div id="rxjxt-main-dash" class="rxjxt-open">
                        <div id="rxjxt-popup">
                            <div class="rxjxt-popup-title" id="rxjxt-popup-title">WARNING</div>
                            <div class="rxjxt-popup-text" id="rxjxt-popup-text">No active quests found.</div>
                            <button class="rxjxt-action-btn" id="rxjxt-popup-btn">RETRY ENGINE</button>
                        </div>
                        <div class="rxjxt-header">
                            <div class="rxjxt-brand-name">RXJXT TOOL v${CURRENT_VERSION}</div>
                            <div class="rxjxt-controls">
                                <span class="rxjxt-btn-icon" id="rxjxt-update-btn" title="Cloud Update Available!">☁️</span>
                                <span class="rxjxt-btn-icon" id="rxjxt-close-btn" title="Hide Dashboard">✕</span>
                            </div>
                        </div>
                        <div class="rxjxt-body">
                            <div class="rxjxt-status-box"><div id="rxjxt-live-status">AWAITING SYSTEM...</div><div id="rxjxt-eta">ETA: --:--</div></div>
                            <span class="rxjxt-label">Target Info</span><div class="rxjxt-value" id="rxjxt-current-quest">SEARCHING...</div>
                            <span class="rxjxt-label">Progress <span id="rxjxt-pct" style="float:right; color:#fcee0a; font-weight:bold;">0%</span></span>
                            <div class="rxjxt-progress-wrapper"><div class="rxjxt-progress-fill" id="rxjxt-bar"></div></div>
                            <span class="rxjxt-label">Engine Terminal</span><div class="rxjxt-terminal-container" id="rxjxt-terminal"></div>
                        </div>
                    </div>
                </div>
            `);

            document.getElementById('rxjxt-close-btn').onclick = () => {
                const dash = document.getElementById('rxjxt-main-dash');
                if(dash) dash.classList.remove('rxjxt-open');
                rxjxtLog("DASHBOARD HIDDEN. ENGINE STILL RUNNING.", "warn");
            };

            // CHECK FOR GITHUB UPDATES
            fetch(UPDATE_URL).then(res => res.text()).then(code => {
                const match = code.match(/@version\s+([0-9.]+)/);
                if(match && match[1] !== CURRENT_VERSION) {
                    rxjxtLog(`UPDATE AVAILABLE: v${match[1]} DETECTED ON GITHUB!`, "warn");
                    const updateBtn = document.getElementById('rxjxt-update-btn');
                    updateBtn.style.display = '
