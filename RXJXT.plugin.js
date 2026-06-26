/**
 * @name RXJXTQuestDashboard
 * @author RXJXT
 * @description RXJXT Hub: Quest Grinder + Cloud Fake Deafen Engine
 * @version 10.1.0
 * @updateUrl https://raw.githubusercontent.com/rxjxt-1/RXJXT-Quest-Tool/main/RXJXT.plugin.js
 */

module.exports = class RXJXTQuestDashboard {
    start() {
        if (window.rxjxtEngineRunning) return;
        window.rxjxtEngineRunning = true;
        
        window.rxjxtGrindToggle = false; 
        window.rxjxtMode = 'STEALTH'; 
        window.rxjxtVideoApproval = false;
        window.rxjxtDeafenToggle = false; 

        console.clear();
        const sleep = ms => new Promise(res => setTimeout(res, ms));

        // URLs FOR DUAL UPDATE SYSTEM
        const HUB_VER = "10.1.0";
        const HUB_URL = "https://raw.githubusercontent.com/rxjxt-1/RXJXT-Quest-Tool/main/RXJXT.plugin.js";
        const DEAFEN_URL = "https://raw.githubusercontent.com/rxjxt-1/RXJXT-Deafen-Tool/main/DeafenEngine.js";

        const CUSTOM_LOGO_URL = "https://cdn.discordapp.com/attachments/1354865979145978109/1432999976543322202/b3e66a70-76a7-455b-8c40-6fccf7dc6193_1.png?ex=6a3cddba&is=6a3b8c3a&hm=d8474058ce1fa9b246f66919c6b90e8371236e70ed09ed4e54ba4a8e5a9b0438&"; 

        const _k = ["R", "X", "J", "X", "T"].join("");
        if (this.constructor.name !== `${_k}QuestDashboard` || typeof BdApi === "undefined") {
            console.error("%c[ RXJXT SECURITY ] CODE TAMPERING DETECTED...", "color: red; font-size: 20px; font-weight: bold;");
            window.rxjxtEngineRunning = null; return Math.random() * 0; 
        }

        const rxjxtLog = (app, msg, type = "info") => {
            const colors = { info: "#00f3ff", success: "#fcee0a", warn: "#ff9d00", error: "#ff003c", brand: "#ff003c", finish: "#43b581" };
            const color = colors[type] || colors.info;
            console.log(`%c[ ${_k} | ${app} ]%c ${msg}`, `color: #000; background: ${color}; font-weight: bold; padding: 2px 6px; border-radius: 3px;`, `color: ${color}; font-weight: bold; padding-left: 5px; text-shadow: 0 0 5px ${color};`);

            const logBox = document.getElementById(app === 'QUEST' ? 'rxjxt-terminal-quest' : 'rxjxt-terminal-deafen');
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
                #rxjxt-liquid-ui { position: fixed; top: 65px; right: 15px; z-index: 9999999; font-family: 'Share Tech Mono', monospace; color: #fff; perspective: 1000px; pointer-events: none; display: flex; flex-direction: column; align-items: flex-end; gap: 10px; }
                
                #rxjxt-mini-menu { width: 220px; background: rgba(15, 20, 25, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(0, 243, 255, 0.3); border-radius: 12px; padding: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.8); opacity: 0; transform: translateY(-10px) scale(0.95); transform-origin: top right; pointer-events: none; transition: all 0.3s ease; }
                #rxjxt-mini-menu.rxjxt-open { opacity: 1; transform: translateY(0) scale(1); pointer-events: auto; }
                
                .rxjxt-menu-item { display: flex; align-items: center; gap: 12px; padding: 12px; cursor: pointer; border-radius: 8px; transition: 0.2s; background: rgba(255,255,255,0.03); margin-bottom: 5px; border: 1px solid transparent; }
                .rxjxt-menu-item:hover { background: rgba(0, 243, 255, 0.1); transform: translateX(-3px); }
                .rxjxt-menu-item svg { width: 22px; height: 22px; }
                .rxjxt-menu-item span { font-family: 'Rajdhani', sans-serif; font-weight: bold; font-size: 16px; letter-spacing: 1px; }

                .headset-off { color: #43b581; filter: drop-shadow(0 0 8px rgba(67, 181, 129, 0.8)); }
                .headset-on { color: #ff003c; filter: drop-shadow(0 0 12px rgba(255, 0, 60, 0.9)); animation: pulse-red 2s infinite; }
                .quest-icon { color: #00f3ff; filter: drop-shadow(0 0 8px rgba(0, 243, 255, 0.6)); }
                .upd-hub { color: #fcee0a; filter: drop-shadow(0 0 8px rgba(252, 238, 10, 0.8)); animation: pulse-yellow 1.5s infinite; }
                .upd-deafen { color: #a200ff; filter: drop-shadow(0 0 8px rgba(162, 0, 255, 0.8)); animation: pulse-purple 1.5s infinite; }

                @keyframes pulse-red { 0%, 100% { filter: drop-shadow(0 0 12px rgba(255,0,60,0.9)); } 50% { filter: drop-shadow(0 0 20px rgba(255,0,60,1)); } }
                @keyframes pulse-yellow { 0%, 100% { filter: drop-shadow(0 0 8px rgba(252,238,10,0.7)); } 50% { filter: drop-shadow(0 0 15px rgba(252,238,10,1)); } }
                @keyframes pulse-purple { 0%, 100% { filter: drop-shadow(0 0 8px rgba(162,0,255,0.7)); } 50% { filter: drop-shadow(0 0 15px rgba(162,0,255,1)); } }

                .rxjxt-panel { width: 400px; backdrop-filter: blur(25px) saturate(180%); border-radius: 16px; position: absolute; right: 0; top: 0; opacity: 0; transform: translateX(20px) scale(0.95); transform-origin: center right; pointer-events: none; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .rxjxt-panel.rxjxt-open { opacity: 1; transform: translateX(0) scale(1); pointer-events: auto; position: relative; }
                .rxjxt-panel::before { content: ""; position: absolute; top:0; left:0; width:100%; height:100%; background: repeating-linear-gradient(transparent, transparent 2px, rgba(255, 255, 255, 0.02) 3px); pointer-events: none; z-index: 0; }
                
                /* THEMES FOR QUEST */
                .theme-stealth { background: rgba(10, 20, 30, 0.65); border: 1px solid rgba(0, 243, 255, 0.2); box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8), inset 0 1px 20px rgba(0, 243, 255, 0.05); transition: all 0.5s ease; }
                .theme-stealth .rxjxt-brand-name { text-shadow: 0 0 10px rgba(0, 243, 255, 0.8); color: #fff;}
                .theme-stealth .rxjxt-mode-btn { color: #00f3ff; border-color: rgba(0, 243, 255, 0.4); }
                .theme-stealth .rxjxt-terminal-container { border-left-color: #00f3ff; }
                .theme-stealth .rxjxt-progress-fill { background: linear-gradient(90deg, #00f3ff, #0a58fc); box-shadow: 0 0 15px rgba(0, 243, 255, 0.6); }
                .theme-stealth input:checked + .rxjxt-slider { background-color: #00f3ff; box-shadow: 0 0 10px rgba(0, 243, 255, 0.5); border-color: #00f3ff; }
                
                .theme-rage { background: rgba(30, 10, 10, 0.65); border: 1px solid rgba(255, 0, 60, 0.2); box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8), inset 0 1px 20px rgba(255, 0, 60, 0.05); transition: all 0.5s ease; }
                .theme-rage .rxjxt-brand-name { text-shadow: 0 0 10px rgba(255, 0, 60, 0.8); color: #ff003c; }
                .theme-rage .rxjxt-mode-btn { color: #ff003c; border-color: rgba(255, 0, 60, 0.4); }
                .theme-rage .rxjxt-terminal-container { border-left-color: #ff003c; }
                .theme-rage .rxjxt-progress-fill { background: linear-gradient(90deg, #ff003c, #ff9d00); box-shadow: 0 0 15px rgba(255, 0, 60, 0.6); }
                .theme-rage input:checked + .rxjxt-slider { background-color: #ff003c; box-shadow: 0 0 10px rgba(255, 0, 60, 0.5); border-color: #ff003c; }

                /* THEMES FOR DEAFEN (GREEN OFF / RED ON) */
                .theme-deafen-off { background: rgba(10, 25, 15, 0.65); border: 1px solid rgba(67, 181, 129, 0.3); box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8), inset 0 1px 20px rgba(67, 181, 129, 0.1); transition: all 0.5s ease; }
                .theme-deafen-off .rxjxt-brand-name { text-shadow: 0 0 10px rgba(67, 181, 129, 0.8); color: #fff;}
                .theme-deafen-off .rxjxt-terminal-container { border-left-color: #43b581; transition: all 0.5s ease; }
                .theme-deafen-off input:checked + .rxjxt-slider { background-color: #43b581; box-shadow: 0 0 10px rgba(67, 181, 129, 0.5); border-color: #43b581; }

                .theme-deafen-on { background: rgba(30, 10, 10, 0.65); border: 1px solid rgba(255, 0, 60, 0.5); box-shadow: 0 15px 40px rgba(0, 0, 0, 0.9), inset 0 1px 30px rgba(255, 0, 60, 0.2), 0 0 25px rgba(255, 0, 60, 0.3); transition: all 0.5s ease; }
                .theme-deafen-on .rxjxt-brand-name { text-shadow: 0 0 15px rgba(255, 0, 60, 1); color: #ff003c;}
                .theme-deafen-on .rxjxt-terminal-container { border-left-color: #ff003c; box-shadow: inset 0 0 15px rgba(255,0,60,0.2); transition: all 0.5s ease; }
                .theme-deafen-on input:checked + .rxjxt-slider { background-color: #ff003c; box-shadow: 0 0 15px rgba(255, 0, 60, 0.8); border-color: #ff003c; }

                .rxjxt-header { background: rgba(255, 255, 255, 0.05); padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.1); position: relative; z-index: 20; }
                .rxjxt-brand-name { font-family: 'Rajdhani', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: 2px; transition: color 0.3s, text-shadow 0.3s; }
                .rxjxt-controls { display: flex; align-items: center; gap: 10px; }
                .rxjxt-mode-btn { padding: 4px 8px; font-size: 11px; font-family: inherit; font-weight: bold; background: transparent; border: 1px solid; border-radius: 4px; cursor: pointer; transition: 0.3s; }
                .rxjxt-toggle { position: relative; display: inline-block; width: 36px; height: 18px; margin-left: 5px; }
                .rxjxt-toggle input { opacity: 0; width: 0; height: 0; }
                .rxjxt-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255,255,255,0.2); transition: .4s; border-radius: 34px; border: 1px solid rgba(255,255,255,0.1); }
                .rxjxt-slider:before { position: absolute; content: ""; height: 12px; width: 12px; left: 3px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; }
                input:checked + .rxjxt-slider:before { transform: translateX(16px); background-color: #111; }
                .rxjxt-btn-icon { color: rgba(255,255,255,0.7); cursor: pointer; font-weight: bold; transition: 0.2s; font-size: 16px; margin-left: 5px; }
                .rxjxt-btn-icon:hover { color: #fff; text-shadow: 0 0 10px #fff; transform: scale(1.2); }
                
                .rxjxt-body { padding: 20px; position: relative; z-index: 3; }
                .rxjxt-status-box { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 12px; }
                .rxjxt-live-status { font-weight: bold; transition: color 0.5s ease; }
                .rxjxt-eta { color: rgba(255,255,255,0.8); font-weight: bold; }
                .rxjxt-label { font-size: 11px; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-bottom: 4px; display: block; }
                .rxjxt-value { font-size: 14px; color: #fff; margin-bottom: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-shadow: 0 0 8px rgba(255,255,255,0.3); line-height: 1.4; }
                .rxjxt-progress-wrapper { width: 100%; height: 8px; background: rgba(0,0,0,0.5); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 4px; position: relative; margin-bottom: 20px; overflow: hidden; box-shadow: inset 0 0 5px rgba(0,0,0,0.8); }
                .rxjxt-progress-fill { height: 100%; width: 0%; transition: width 0.4s ease; position: relative; }
                .rxjxt-terminal-container { background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(255,255,255,0.1); border-left: 3px solid; border-radius: 6px; padding: 10px; height: 120px; overflow-y: auto; font-size: 11px; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); transition: border-left-color 0.5s ease; }
                
                #rxjxt-header-btn { margin: 0 12px !important; transition: all 0.3s ease; }
                #rxjxt-header-btn:hover { transform: translateY(-3px) scale(1.15); filter: drop-shadow(0px 5px 10px rgba(255,255,255,0.4)); }
                #rxjxt-header-ring { width: 34px; height: 34px; border-radius: 50%; background: conic-gradient(#fff var(--rxjxt-prog, 0%), rgba(255,255,255,0.1) 0); display: flex; justify-content: center; align-items: center; box-shadow: 0 0 10px rgba(255, 255, 255, 0.2); transition: background 0.3s ease; }
                #rxjxt-header-inner { width: 26px; height: 26px; background: #1e1f22; border-radius: 50%; display: flex; justify-content: center; align-items: center; overflow: hidden; box-shadow: inset 0 0 8px rgba(0,0,0,0.8); }
                .rxjxt-custom-logo { width: 18px; height: 18px; object-fit: contain; transition: transform 0.3s ease; }
                #rxjxt-header-btn:hover .rxjxt-custom-logo { transform: scale(1.2); }
                
                #rxjxt-popup { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(10,15,20,0.9); backdrop-filter: blur(10px); z-index: 10; display: none; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 30px; box-sizing: border-box; border-radius: 16px; }
                .rxjxt-popup-title { color: #fff; font-size: 18px; font-weight: bold; margin-bottom: 10px; text-shadow: 0 0 10px rgba(255,255,255,0.5); }
                .rxjxt-popup-text { color: #ccc; font-size: 12px; margin-bottom: 20px; line-height: 1.4; }
                .rxjxt-popup-actions { display: flex; gap: 10px; }
                .rxjxt-action-btn { background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255,255,255,0.3); color: #fff; padding: 8px 15px; font-family: inherit; font-weight: bold; cursor: pointer; transition: 0.3s; border-radius: 6px; font-size: 12px; }
                .rxjxt-action-btn:hover { background: #fff; color: #000; box-shadow: 0 0 15px rgba(255,255,255,0.5); }
            `;
            document.head.appendChild(style);

            document.body.insertAdjacentHTML('beforeend', `
                <div id="rxjxt-liquid-ui">
                    <!-- DROP-DOWN HUB -->
                    <div id="rxjxt-mini-menu">
                        <div class="rxjxt-menu-item" id="rxjxt-menu-quest">
                            <svg viewBox="0 0 24 24" class="quest-icon"><path fill="currentColor" d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                            <span>Quest Grinder</span>
                        </div>
                        <div class="rxjxt-menu-item" id="rxjxt-menu-deafen">
                            <svg viewBox="0 0 24 24" id="rxjxt-headset-icon" class="headset-off"><path fill="currentColor" d="M12 3a9 9 0 0 0-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-4v8h4c1.1 0 2-.9 2-2v-7a9 9 0 0 0-9-9z"/></svg>
                            <span>Fake Deafen</span>
                        </div>
                        
                        <!-- DUAL UPDATE BUTTONS -->
                        <div class="rxjxt-menu-item" id="rxjxt-update-hub" style="display: none; border-color: rgba(252,238,10,0.4);">
                            <svg viewBox="0 0 24 24" class="upd-hub"><path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.36 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
                            <span id="rxjxt-uhub-text" style="color: #fcee0a; text-shadow: 0 0 8px rgba(252,238,10,0.5);">Update Hub</span>
                        </div>
                        <div class="rxjxt-menu-item" id="rxjxt-update-deafen" style="display: none; border-color: rgba(162,0,255,0.4);">
                            <svg viewBox="0 0 24 24" class="upd-deafen"><path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.36 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
                            <span id="rxjxt-udeaf-text" style="color: #a200ff; text-shadow: 0 0 8px rgba(162,0,255,0.5);">Update Deafen</span>
                        </div>
                    </div>

                    <!-- QUEST DASHBOARD -->
                    <div id="rxjxt-quest-dash" class="rxjxt-panel theme-stealth">
                        <div id="rxjxt-popup">
                            <div class="rxjxt-popup-title" id="rxjxt-popup-title">WARNING</div>
                            <div class="rxjxt-popup-text" id="rxjxt-popup-text">No active quests found.</div>
                            <div class="rxjxt-popup-actions">
                                <button class="rxjxt-action-btn" id="rxjxt-popup-btn-1">RETRY</button>
                                <button class="rxjxt-action-btn" id="rxjxt-popup-btn-2" style="display:none;">CANCEL</button>
                            </div>
                        </div>
                        <div class="rxjxt-header">
                            <div class="rxjxt-brand-name">${_k} QUEST V10.1</div>
                            <div class="rxjxt-controls">
                                <button class="rxjxt-mode-btn" id="rxjxt-mode-btn" title="Toggle Grind Mode">[ STEALTH ]</button>
                                <label class="rxjxt-toggle" title="Toggle Quest Auto-Grind">
                                    <input type="checkbox" id="rxjxt-grind-toggle">
                                    <span class="rxjxt-slider"></span>
                                </label>
                                <span class="rxjxt-btn-icon" id="rxjxt-close-quest" title="Back to Menu">✕</span>
                            </div>
                        </div>
                        <div class="rxjxt-body">
                            <div class="rxjxt-status-box"><div class="rxjxt-live-status" id="rxjxt-live-status" style="color: #00f3ff; text-shadow: 0 0 5px rgba(0,243,255,0.5);">SYSTEM IDLE...</div><div class="rxjxt-eta" id="rxjxt-eta">ETA: --:--</div></div>
                            <span class="rxjxt-label">Target Info</span><div class="rxjxt-value" id="rxjxt-current-quest">WAITING...</div>
                            <span class="rxjxt-label">Progress <span id="rxjxt-pct" style="float:right; font-weight:bold;">0%</span></span>
                            <div class="rxjxt-progress-wrapper"><div class="rxjxt-progress-fill" id="rxjxt-bar"></div></div>
                            <span class="rxjxt-label">Quest Terminal</span><div class="rxjxt-terminal-container" id="rxjxt-terminal-quest"></div>
                        </div>
                    </div>

                    <!-- FAKE DEAFEN DASHBOARD -->
                    <div id="rxjxt-deafen-dash" class="rxjxt-panel theme-deafen-off">
                        <div class="rxjxt-header">
                            <div class="rxjxt-brand-name">${_k} DEAFEN V10.1</div>
                            <div class="rxjxt-controls">
                                <label class="rxjxt-toggle" title="Toggle Fake Deafen">
                                    <input type="checkbox" id="rxjxt-deafen-toggle">
                                    <span class="rxjxt-slider"></span>
                                </label>
                                <span class="rxjxt-btn-icon" id="rxjxt-close-deafen" title="Back to Menu">✕</span>
                            </div>
                        </div>
                        <div class="rxjxt-body">
                            <div class="rxjxt-status-box"><div class="rxjxt-live-status" id="rxjxt-deafen-status" style="color: #43b581;">DEAFEN INACTIVE</div></div>
                            <span class="rxjxt-label">Instructions</span>
                            <div class="rxjxt-value" style="white-space: normal;">1. Connect to any Voice Channel.<br>2. Turn ON the toggle above.<br>3. Cloud engine will fully automate the sync process!<br>4. Turn OFF to instantly restore normal connection.</div>
                            <span class="rxjxt-label">Deafen Terminal</span><div class="rxjxt-terminal-container" id="rxjxt-terminal-deafen"></div>
                        </div>
                    </div>
                </div>
            `);

            // HUB NAVIGATION
            const miniMenu = document.getElementById('rxjxt-mini-menu');
            const questDash = document.getElementById('rxjxt-quest-dash');
            const deafenDash = document.getElementById('rxjxt-deafen-dash');

            document.getElementById('rxjxt-menu-quest').onclick = () => { miniMenu.classList.remove('rxjxt-open'); questDash.classList.add('rxjxt-open'); };
            document.getElementById('rxjxt-menu-deafen').onclick = () => { miniMenu.classList.remove('rxjxt-open'); deafenDash.classList.add('rxjxt-open'); };
            document.getElementById('rxjxt-close-quest').onclick = () => { questDash.classList.remove('rxjxt-open'); miniMenu.classList.add('rxjxt-open'); };
            document.getElementById('rxjxt-close-deafen').onclick = () => { deafenDash.classList.remove('rxjxt-open'); miniMenu.classList.add('rxjxt-open'); };

            // QUEST MODE
            const modeBtn = document.getElementById('rxjxt-mode-btn');
            modeBtn.onclick = () => {
                window.rxjxtMode = window.rxjxtMode === 'STEALTH' ? 'RAGE' : 'STEALTH';
                modeBtn.innerText = `[ ${window.rxjxtMode} ]`;
                questDash.className = `rxjxt-panel rxjxt-open theme-${window.rxjxtMode.toLowerCase()}`;
                
                const qStatusText = document.getElementById('rxjxt-live-status');
                if(window.rxjxtMode === 'RAGE'){
                    qStatusText.style.color = "#ff003c";
                    qStatusText.style.textShadow = "0 0 5px rgba(255,0,60,0.5)";
                } else {
                    qStatusText.style.color = "#00f3ff";
                    qStatusText.style.textShadow = "0 0 5px rgba(0,243,255,0.5)";
                }
                rxjxtLog('QUEST', `MODE SWITCHED TO: ${window.rxjxtMode}`, window.rxjxtMode === 'RAGE' ? "brand" : "info");
            };

            // MODULAR FAKE DEAFEN TOGGLE WITH PANEL GLOW
            const deafenInput = document.getElementById('rxjxt-deafen-toggle');
            const headsetIcon = document.getElementById('rxjxt-headset-icon');
            const deafenStatusText = document.getElementById('rxjxt-deafen-status');

            deafenInput.addEventListener('change', async (e) => {
                window.rxjxtDeafenToggle = e.target.checked;
                
                let savedCode = BdApi.Data.load("RXJXTHub", "DeafenCode");
                if (!savedCode) {
                    e.target.checked = false; window.rxjxtDeafenToggle = false;
                    rxjxtLog('DEAFEN', "Deafen Engine NOT Installed! Check Hub for updates.", "error");
                    return BdApi.UI.showToast("Deafen Engine missing! Click 'Install Deafen' in the Hub menu.", {type: "error"});
                }

                try {
                    eval(savedCode);
                    
                    const updateUI = (text, color, isGlow) => {
                        headsetIcon.className.baseVal = isGlow ? 'headset-on' : 'headset-off';
                        deafenStatusText.innerText = text;
                        deafenStatusText.style.color = color;
                        
                        // Dynamically changing the entire panel's theme glow
                        const panel = document.getElementById('rxjxt-deafen-dash');
                        if (panel) {
                            panel.className = `rxjxt-panel ${panel.classList.contains('rxjxt-open') ? 'rxjxt-open' : ''} ${isGlow ? 'theme-deafen-on' : 'theme-deafen-off'}`;
                        }
                    };

                    if (window.rxjxtDeafenToggle) window.rxjxtDeafenEngine.start(rxjxtLog, updateUI);
                    else window.rxjxtDeafenEngine.stop(rxjxtLog, updateUI);

                } catch (err) {
                    console.error(err);
                    rxjxtLog('DEAFEN', "Failed to execute Cloud Deafen Engine.", "error");
                }
            });

            // --- DUAL UPDATE CHECKER ---
            fetch(HUB_URL).then(res => res.text()).then(code => {
                let match = code.match(/@version\s+([0-9.]+)/);
                if(match && match[1] !== HUB_VER) {
                    const btn = document.getElementById('rxjxt-update-hub');
                    btn.style.display = 'flex';
                    document.getElementById('rxjxt-uhub-text').innerText = `Update Hub v${match[1]}`;
                    btn.onclick = () => {
                        const fs = require('fs'), path = require('path');
                        fs.writeFileSync(path.join(BdApi.Plugins.folder, "RXJXT.plugin.js"), code);
                        BdApi.UI.showToast(`Hub Updated to v${match[1]}! Reloading...`, {type: "success"});
                        setTimeout(() => location.reload(), 2000);
                    };
                }
            }).catch(()=>{});

            fetch(DEAFEN_URL).then(res => res.text()).then(code => {
                let match = code.match(/@version\s+([0-9.]+)/);
                let currentVer = BdApi.Data.load("RXJXTHub", "DeafenVersion") || "0.0.0";
                
                if(match && match[1] !== currentVer) {
                    const btn = document.getElementById('rxjxt-update-deafen');
                    btn.style.display = 'flex';
                    document.getElementById('rxjxt-udeaf-text').innerText = currentVer === "0.0.0" ? `Install Deafen v${match[1]}` : `Update Deafen v${match[1]}`;
                    
                    btn.onclick = () => {
                        BdApi.Data.save("RXJXTHub", "DeafenCode", code);
                        BdApi.Data.save("RXJXTHub", "DeafenVersion", match[1]);
                        BdApi.UI.showToast(`Deafen Engine Installed! v${match[1]}`, {type: "success"});
                        rxjxtLog('DEAFEN', `Cloud Engine v${match[1]} Installed Successfully!`, "success");
                        btn.style.display = 'none';
                    };
                }
            }).catch(()=>{});
        };

        const ensureToolbarIcon = () => {
            if (!window.rxjxtEngineRunning) return;
            let btn = document.getElementById('rxjxt-header-btn');
            const toolbar = document.querySelector('section [class*="toolbar_"]');

            if (toolbar && !btn) {
                btn = document.createElement('div');
                btn.id = 'rxjxt-header-btn';
                btn.setAttribute('aria-label', 'RXJXT Hub');
                btn.style.cssText = 'display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative;';
                
                btn.innerHTML = `
                    <div id="rxjxt-header-ring" style="--rxjxt-prog: 0%;">
                        <div id="rxjxt-header-inner">
                            <img src="${CUSTOM_LOGO_URL}" alt="S" class="rxjxt-custom-logo" onerror="this.style.display='none'; this.parentElement.innerText='S';">
                        </div>
                    </div>
                `;
                
                btn.onclick = (e) => {
                    e.preventDefault(); e.stopPropagation();
                    const miniMenu = document.getElementById('rxjxt-mini-menu');
                    const questDash = document.getElementById('rxjxt-quest-dash');
                    const deafenDash = document.getElementById('rxjxt-deafen-dash');
                    
                    if(questDash.classList.contains('rxjxt-open')) questDash.classList.remove('rxjxt-open');
                    else if (deafenDash.classList.contains('rxjxt-open')) deafenDash.classList.remove('rxjxt-open');
                    else miniMenu.classList.toggle('rxjxt-open');
                };
                toolbar.insertBefore(btn, toolbar.firstChild);
            }
        };

        window.rxjxtToolbarInterval = setInterval(ensureToolbarIcon, 1000);

        let currentSecondsLeft = 0;
        const updateUI = (questName, current, total, status = "progress") => {
            if(!document.getElementById('rxjxt-pct')) return;
            let pct = 0;
            if (total > 0) {
                pct = Math.min(100, Math.floor((current / total) * 100));
                document.getElementById('rxjxt-bar').style.width = `${pct}%`;
                document.getElementById('rxjxt-pct').innerText = `${pct}%`;
                currentSecondsLeft = Math.max(0, total - current);
            }
            
            const statusEl = document.getElementById('rxjxt-live-status');
            if(statusEl) statusEl.innerText = status;

            const headerRing = document.getElementById('rxjxt-header-ring');
            if (headerRing) {
                headerRing.style.setProperty('--rxjxt-prog', `${pct}%`);
                let ringColor = window.rxjxtMode === 'RAGE' ? '#ff003c' : '#00f3ff';
                if(pct >= 100) ringColor = window.rxjxtMode === 'RAGE' ? '#ff9d00' : '#fcee0a';
                if (!window.rxjxtGrindToggle) ringColor = '#fff';
                headerRing.style.background = `conic-gradient(${ringColor} var(--rxjxt-prog, 0%), rgba(255,255,255,0.1) 0)`;
            }
        };

        const showPopup = (title, text, btn1Text, cb1, btn2Text = null, cb2 = null) => {
            const popup = document.getElementById('rxjxt-popup');
            if (!popup) return;
            document.getElementById('rxjxt-popup-title').innerText = title;
            document.getElementById('rxjxt-popup-text').innerText = text;
            
            const btn1 = document.getElementById('rxjxt-popup-btn-1');
            btn1.innerText = btn1Text;
            btn1.onclick = () => { popup.style.display = 'none'; if(cb1) cb1(); };
            
            const btn2 = document.getElementById('rxjxt-popup-btn-2');
            if(btn2Text) {
                btn2.style.display = 'block'; btn2.innerText = btn2Text;
                btn2.onclick = () => { popup.style.display = 'none'; if(cb2) cb2(); };
            } else { btn2.style.display = 'none'; }
            popup.style.display = 'flex';
        };

        const hidePopup = () => { const popup = document.getElementById('rxjxt-popup'); if(popup) popup.style.display = 'none'; };

        window.rxjxtTimer = setInterval(() => {
            if (currentSecondsLeft > 0 && window.rxjxtGrindToggle) {
                currentSecondsLeft--;
                let mins = Math.floor(currentSecondsLeft / 60).toString().padStart(2, '0');
                let secs = (currentSecondsLeft % 60).toString().padStart(2, '0');
                const etaEl = document.getElementById('rxjxt-eta');
                if(etaEl) etaEl.innerText = `ETA: ${mins}:${secs}`;
            }
        }, 1000);

        injectLiquidUI();
        rxjxtLog('QUEST', "RXJXT V10.1 HUB INITIALIZED...", "brand");
        rxjxtLog('DEAFEN', "HUB READY. CHECKING CLOUD MODULE...", "info");

        // CORE QUEST GRINDER LOGIC
        let isGrinding = false;
        const startEngine = async () => {
            try {
                let wpRequire = window.webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
                window.webpackChunkdiscord_app.pop();

                let ApplicationStreamingStore = Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getStreamerActiveStreamMetadata)?.exports?.A;
                let RunningGameStore = Object.values(wpRequire.c).find(x => x?.exports?.Ay?.getRunningGames)?.exports?.Ay;
                let QuestsStore = Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getQuest)?.exports?.A;
                let ChannelStore = Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getAllThreadsForParent)?.exports?.A;
                let GuildChannelStore = Object.values(wpRequire.c).find(x => x?.exports?.Ay?.getSFWDefaultChannel)?.exports?.Ay;
                let FluxDispatcher = Object.values(wpRequire.c).find(x => x?.exports?.h?.__proto__?.flushWaitQueue)?.exports?.h;
                let api = Object.values(wpRequire.c).find(x => x?.exports?.Bo?.get)?.exports?.Bo;

                const supportedTasks = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE"];

                const checkAndStart = () => {
                    if (!window.rxjxtGrindToggle) return;
                    if (isGrinding) return;
                    if (!QuestsStore) { rxjxtLog('QUEST', "Discord Core Not Ready", "warn"); return; }

                    const allQuests = [...QuestsStore.quests.values()].filter(x => new Date(x.config.expiresAt).getTime() > Date.now() && supportedTasks.find(y => Object.keys((x.config.taskConfig ?? x.config.taskConfigV2).tasks).includes(y)));
                    
                    let unacceptedQuests = allQuests.filter(x => !x.userStatus?.enrolledAt && !x.userStatus?.completedAt);
                    let acceptedQuests = allQuests.filter(x => x.userStatus?.enrolledAt && !x.userStatus?.completedAt);

                    if (acceptedQuests.length > 0) {
                        if (window.questWatcher) { clearInterval(window.questWatcher); window.questWatcher = null; }
                        hidePopup();
                        
                        let nextQuestToGrind = null;

                        if (window.rxjxtMode === 'RAGE') {
                            nextQuestToGrind = acceptedQuests.pop();
                        } else {
                            let gameQuests = acceptedQuests.filter(q => {
                                let tName = supportedTasks.find(x => (q.config.taskConfig ?? q.config.taskConfigV2).tasks[x] != null);
                                return tName !== "WATCH_VIDEO" && tName !== "WATCH_VIDEO_ON_MOBILE";
                            });
                            let videoQuests = acceptedQuests.filter(q => {
                                let tName = supportedTasks.find(x => (q.config.taskConfig ?? q.config.taskConfigV2).tasks[x] != null);
                                return tName === "WATCH_VIDEO" || tName === "WATCH_VIDEO_ON_MOBILE";
                            });

                            if (gameQuests.length > 0) {
                                nextQuestToGrind = gameQuests.pop();
                            } else if (videoQuests.length > 0) {
                                if (!window.rxjxtVideoApproval) {
                                    updateUI("WAITING FOR USER", 0, 100, "STEALTH PAUSED");
                                    showPopup(
                                        "VIDEO QUESTS DETECTED", 
                                        "Sirf Videos wali quest bachi hain. Kya main inko grind karna start kar du?", 
                                        "HAAN KARDO", () => { window.rxjxtVideoApproval = true; checkAndStart(); }, 
                                        "REHNE DO", () => { 
                                            window.rxjxtGrindToggle = false; 
                                            document.getElementById('rxjxt-grind-toggle').checked = false;
                                            rxjxtLog('QUEST', "GRINDING STOPPED BY USER", "warn");
                                            updateUI("SYSTEM PAUSED", 0, 100, "SYSTEM IDLE");
                                        }
                                    );
                                    return; 
                                } else { nextQuestToGrind = videoQuests.pop(); }
                            }
                        }

                        if (nextQuestToGrind) {
                            isGrinding = true;
                            rxjxtLog('QUEST', `QUEST ACCEPTED (${window.rxjxtMode} MODE). ENGAGING AUTO-START...`, "success");
                            doJob([nextQuestToGrind], api, RunningGameStore, FluxDispatcher, ApplicationStreamingStore, ChannelStore, GuildChannelStore);
                        }
                    } 
                    else if (unacceptedQuests.length > 0) {
                        updateUI("WAITING FOR USER", 0, 100, "ACTION REQUIRED");
                        showPopup("QUEST NOT ACCEPTED", "Discord quest section mein jaakar quest ACCEPT karo!", "RETRY CHECK", () => checkAndStart());
                        
                        if (!window.questWatcher) {
                            rxjxtLog('QUEST', "WAITING FOR QUEST ACCEPTANCE...", "warn");
                            window.questWatcher = setInterval(() => { if (!isGrinding && window.rxjxtGrindToggle) checkAndStart(); }, 3000);
                        }
                    } 
                    else {
                        rxjxtLog('QUEST', "NO ELIGIBLE QUESTS FOUND.", "error");
                        showPopup("NO QUESTS", "Sab quests complete ho chuki hain ya koi nayi available nahi hai.", "REFRESH", () => checkAndStart());
                    }
                };

                const toggleInput = document.getElementById('rxjxt-grind-toggle');
                if (toggleInput) {
                    toggleInput.addEventListener('change', (e) => {
                        window.rxjxtGrindToggle = e.target.checked;
                        if (!window.rxjxtGrindToggle) window.rxjxtVideoApproval = false;
                        
                        if (window.rxjxtGrindToggle) { rxjxtLog('QUEST', "GRINDING ENABLED", "success"); checkAndStart(); } 
                        else { rxjxtLog('QUEST', "GRINDING PAUSED", "warn"); updateUI("PAUSED", 0, 100, "SYSTEM IDLE"); }
                    });
                }

                const doJob = async (questsArray, api, RunningGameStore, FluxDispatcher, ApplicationStreamingStore, ChannelStore, GuildChannelStore) => {
                    const quest = questsArray.pop();
                    if(!quest) { isGrinding = false; checkAndStart(); return; }

                    const pid = Math.floor(Math.random() * 30000) + 1000;
                    const applicationId = quest.config.application.id;
                    const applicationName = quest.config.application.name;
                    const questName = quest.config.messages.questName;
                    const taskConfig = quest.config.taskConfig ?? quest.config.taskConfigV2;
                    const taskName = supportedTasks.find(x => taskConfig.tasks[x] != null);
                    const secondsNeeded = taskConfig.tasks[taskName].target;
                    let secondsDone = quest.userStatus?.progress?.[taskName]?.value ?? 0;

                    rxjxtLog('QUEST', `TARGET LOCK: ${questName}`, "info");
                    document.getElementById('rxjxt-current-quest').innerText = questName;
                    updateUI(questName, secondsDone, secondsNeeded, "IN PROGRESS...");

                    const finishQuest = async () => {
                        rxjxtLog('QUEST', `[✔] QUEST COMPLETE: ${questName}`, "finish");
                        updateUI(questName, secondsNeeded, secondsNeeded, "SUCCESS!");
                        await sleep(2500); isGrinding = false; checkAndStart();
                    };

                    if(taskName === "WATCH_VIDEO" || taskName === "WATCH_VIDEO_ON_MOBILE") {
                        const speed = 7; let completed = false;
                        let fn = async () => {
                            rxjxtLog('QUEST', `SPOOFING VIDEO METRICS...`, "warn");
                            while(true) {
                                if (!window.rxjxtGrindToggle) { isGrinding = false; return; } 
                                const remaining = Math.min(speed, secondsNeeded - secondsDone);
                                await new Promise(resolve => setTimeout(resolve, remaining * 1000));
                                const timestamp = secondsDone + speed;
                                const res = await api.post({url: `/quests/${quest.id}/video-progress`, body: {timestamp: Math.min(secondsNeeded, timestamp + Math.random())}});
                                completed = res.body.completed_at != null;
                                secondsDone = Math.min(secondsNeeded, timestamp);
                                updateUI(questName, secondsDone, secondsNeeded, "IN PROGRESS...");
                                if(timestamp >= secondsNeeded) break;
                            }
                            if(!completed && window.rxjxtGrindToggle) await api.post({url: `/quests/${quest.id}/video-progress`, body: {timestamp: secondsNeeded}});
                            finishQuest();
                        }
                        fn();
                    } else if(taskName === "PLAY_ON_DESKTOP") {
                        api.get({url: `/applications/public?application_ids=${applicationId}`}).then(res => {
                            const appData = res.body[0];
                            const exeName = appData.executables?.find(x => x.os === "win32")?.name?.replace(">","") ?? appData.name.replace(/[\/\\:*?"<>|]/g, "");
                            const fakeGame = { cmdLine: `C:\\Program Files\\${appData.name}\\${exeName}`, exeName, exePath: `c:/program files/${appData.name.toLowerCase()}/${exeName}`, hidden: false, isLauncher: false, id: applicationId, name: appData.name, pid, pidPath: [pid], processName: appData.name, start: Date.now() };

                            const realGames = RunningGameStore.getRunningGames(); const fakeGames = [fakeGame];
                            const realGetRunningGames = RunningGameStore.getRunningGames; const realGetGameForPID = RunningGameStore.getGameForPID;
                            
                            RunningGameStore.getRunningGames = () => fakeGames; RunningGameStore.getGameForPID = p => fakeGames.find(x => x.pid === p);
                            FluxDispatcher.dispatch({type: "RUNNING_GAMES_CHANGE", removed: realGames, added: [fakeGame], games: fakeGames});
                            rxjxtLog('QUEST', `INJECTED GAME PID: ${applicationName}`, "warn");

                            let fn = data => {
                                if (!window.rxjxtGrindToggle) { 
                                    FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                                    RunningGameStore.getRunningGames = realGetRunningGames; RunningGameStore.getGameForPID = realGetGameForPID;
                                    FluxDispatcher.dispatch({type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: [], games: []});
                                    isGrinding = false; return;
                                }
                                let progress = quest.config.configVersion === 1 ? data.userStatus.streamProgressSeconds : Math.floor(data.userStatus.progress.PLAY_ON_DESKTOP.value);
                                updateUI(questName, progress, secondsNeeded, "GRINDING...");
                                if(progress >= secondsNeeded) {
                                    RunningGameStore.getRunningGames = realGetRunningGames; RunningGameStore.getGameForPID = realGetGameForPID;
                                    FluxDispatcher.dispatch({type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: [], games: []});
                                    FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                                    finishQuest();
                                }
                            };
                            FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                        });
                    }
                    else if(taskName === "STREAM_ON_DESKTOP") {
                        let realFunc = ApplicationStreamingStore.getStreamerActiveStreamMetadata;
                        ApplicationStreamingStore.getStreamerActiveStreamMetadata = () => ({ id: applicationId, pid, sourceName: null });
                        rxjxtLog('QUEST', `SPOOFING STREAM METADATA: ${applicationName}`, "warn");

                        let fn = data => {
                            if (!window.rxjxtGrindToggle) { 
                                FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                                ApplicationStreamingStore.getStreamerActiveStreamMetadata = realFunc;
                                isGrinding = false; return;
                            }
                            let progress = quest.config.configVersion === 1 ? data.userStatus.streamProgressSeconds : Math.floor(data.userStatus.progress.STREAM_ON_DESKTOP.value);
                            updateUI(questName, progress, secondsNeeded, "STREAMING...");
                            if(progress >= secondsNeeded) {
                                ApplicationStreamingStore.getStreamerActiveStreamMetadata = realFunc;
                                FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                                finishQuest();
                            }
                        };
                        FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                    }
                    else if(taskName === "PLAY_ACTIVITY") {
                        const channelId = ChannelStore.getSortedPrivateChannels()[0]?.id ?? Object.values(GuildChannelStore.getAllGuilds()).find(x => x != null && x.VOCAL.length > 0).VOCAL[0].channel.id;
                        const streamKey = `call:${channelId}:1`;
                        
                        let fn = async () => {
                            rxjxtLog('QUEST', `FORGING ACTIVITY SYNC...`, "warn");
                            while(true) {
                                if (!window.rxjxtGrindToggle) { isGrinding = false; return; } 
                                const res = await api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: streamKey, terminal: false}});
                                const progress = res.body.progress.PLAY_ACTIVITY.value;
                                updateUI(questName, progress, secondsNeeded, "ACTIVITY SYNC...");
                                await new Promise(resolve => setTimeout(resolve, 20 * 1000));
                                if(progress >= secondsNeeded) {
                                    if (window.rxjxtGrindToggle) await api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: streamKey, terminal: true}});
                                    break;
                                }
                            }
                            finishQuest();
                        }
                        fn();
                    }
                };

            } catch (err) {
                isGrinding = false;
                rxjxtLog('QUEST', "SYSTEM INITIALIZING...", "warn");
                setTimeout(startEngine, 3000); 
            }
        };

        setTimeout(startEngine, 3000); 
    }

    stop() {
        if (window.rxjxtTimer) clearInterval(window.rxjxtTimer);
        if (window.questWatcher) clearInterval(window.questWatcher);
        if (window.rxjxtToolbarInterval) clearInterval(window.rxjxtToolbarInterval);
        
        window.rxjxtEngineRunning = false;
        window.rxjxtGrindToggle = false;
        window.rxjxtDeafenToggle = false;
        
        if (window.rxjxtWSHooked && window.rxjxtOriginalWS) {
            window.WebSocket.prototype.send = window.rxjxtOriginalWS;
            window.rxjxtWSHooked = false;
        }

        const ui = document.getElementById('rxjxt-liquid-ui');
        if (ui) ui.remove();
        const headerBtn = document.getElementById('rxjxt-header-btn');
        if (headerBtn) headerBtn.remove();
        const style = document.getElementById('rxjxt-styles');
        if (style) style.remove();
        
        console.log("%c[ RXJXT ] HUB STOPPED & CLEANED UP.", "color: #ff003c; font-weight: bold;");
    }
};
