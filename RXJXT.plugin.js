/**
 * @name RXJXTQuestDashboard
 * @author RXJXT
 * @description RXJXT Liquid Shell: Fully Automated Cloud Updater
 * @version 11.1.0
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
        
        // THE CLOUD URLS
        const HUB_VER = "11.1.0";
        const HUB_URL = "https://raw.githubusercontent.com/rxjxt-1/RXJXT-Quest-Tool/main/RXJXT.plugin.js";
        const QUEST_URL = "https://raw.githubusercontent.com/rxjxt-1/RXJXT-Quest-Tool/main/QuestEngine.js";
        const DEAFEN_URL = "https://raw.githubusercontent.com/rxjxt-1/RXJXT-Deafen-Tool/main/DeafenEngine.js";

        const CUSTOM_LOGO_URL = "https://cdn.discordapp.com/attachments/1354865979145978109/1432999976543322202/b3e66a70-76a7-455b-8c40-6fccf7dc6193_1.png?ex=6a3cddba&is=6a3b8c3a&hm=d8474058ce1fa9b246f66919c6b90e8371236e70ed09ed4e54ba4a8e5a9b0438&"; 
        const _k = ["R", "X", "J", "X", "T"].join("");

        const rxjxtLog = (app, msg, type = "info") => {
            const colors = { info: "#0A84FF", success: "#30D158", warn: "#FF9F0A", error: "#FF453A", brand: "#FF453A", finish: "#32ADE6" };
            const color = colors[type] || colors.info;
            console.log(`%c[ ${_k} | ${app} ]%c ${msg}`, `color: #000; background: ${color}; font-weight: bold; border-radius: 4px; padding: 2px 6px;`, `color: ${color}; font-weight: 500; padding-left: 5px;`);

            const logBox = document.getElementById(app === 'QUEST' ? 'rxjxt-terminal-quest' : 'rxjxt-terminal-deafen');
            if (logBox) {
                const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
                const logEntry = document.createElement('div');
                logEntry.style.marginBottom = "4px";
                logEntry.innerHTML = `<span style="color: rgba(255,255,255,0.3); font-size: 10px;">[${time}]</span> <span style="color: ${color}; font-weight: 500;">${msg}</span>`;
                logBox.appendChild(logEntry);
                logBox.scrollTop = logBox.scrollHeight;
            }
        };

        const injectLiquidUI = () => {
            if (document.getElementById('rxjxt-liquid-ui')) return;
            const style = document.createElement('style');
            style.id = "rxjxt-styles";
            style.innerHTML = `
                /* iOS Liquid Glass UI SHELL */
                #rxjxt-liquid-ui { position: fixed; top: 65px; right: 15px; z-index: 9999999; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #fff; pointer-events: none; display: flex; flex-direction: column; align-items: flex-end; gap: 12px; }
                
                .liquid-panel { transform-origin: calc(100% - 15px) -20px; transform: scale(0) translate(20px, -20px); opacity: 0; border-radius: 50px; pointer-events: none; transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease, border-radius 0.4s ease, box-shadow 0.5s ease; }
                .liquid-panel.rxjxt-open { opacity: 1; transform: scale(1) translate(0, 0); pointer-events: auto; }

                .ios-glass { background: rgba(28, 28, 32, 0.65); backdrop-filter: blur(40px) saturate(200%); -webkit-backdrop-filter: blur(40px) saturate(200%); border: 1px solid rgba(255, 255, 255, 0.08); box-shadow: 0 24px 48px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255, 255, 255, 0.1); }

                #rxjxt-mini-menu.rxjxt-open { border-radius: 100px; display: flex; flex-direction: row; align-items: center; padding: 6px; gap: 6px; }
                .rxjxt-hub-item { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 8px 16px; cursor: pointer; border-radius: 100px; transition: 0.3s cubic-bezier(0.25, 1, 0.5, 1); background: rgba(255,255,255,0.02); border: 1px solid transparent; }
                .rxjxt-hub-item:hover { background: rgba(255,255,255,0.1); transform: scale(1.05); }
                .rxjxt-hub-item svg { width: 18px; height: 18px; }
                .rxjxt-hub-item span { font-weight: 600; font-size: 13px; letter-spacing: 0.3px; }

                .rxjxt-panel { width: 360px; position: absolute; right: 0; top: 0; }
                .rxjxt-panel.rxjxt-open { border-radius: 24px; position: relative; }
                
                .theme-stealth { box-shadow: 0 24px 48px rgba(0,0,0,0.5), 0 0 40px rgba(10, 132, 255, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.1); border-color: rgba(10, 132, 255, 0.2); }
                .theme-stealth .rxjxt-brand-name, .theme-stealth .rxjxt-live-status { color: #0A84FF; }
                .theme-stealth input:checked + .rxjxt-slider { background-color: #0A84FF; }
                
                .theme-rage { box-shadow: 0 24px 48px rgba(0,0,0,0.5), 0 0 40px rgba(255, 69, 58, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.1); border-color: rgba(255, 69, 58, 0.2); }
                .theme-rage .rxjxt-brand-name, .theme-rage .rxjxt-live-status { color: #FF453A; }
                .theme-rage input:checked + .rxjxt-slider { background-color: #FF453A; }

                .theme-deafen-off { box-shadow: 0 24px 48px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.08); }
                .theme-deafen-off .rxjxt-brand-name, .theme-deafen-off .rxjxt-live-status { color: rgba(255,255,255,0.8); }
                
                .theme-deafen-on { box-shadow: 0 24px 48px rgba(0,0,0,0.5), 0 0 40px rgba(255, 69, 58, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1); border-color: rgba(255, 69, 58, 0.3); }
                .theme-deafen-on .rxjxt-brand-name, .theme-deafen-on .rxjxt-live-status { color: #FF453A; }
                .theme-deafen-on input:checked + .rxjxt-slider { background-color: #FF453A; }

                .rxjxt-header { padding: 18px 22px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
                .rxjxt-brand-name { font-size: 16px; font-weight: 700; letter-spacing: 0.5px; transition: color 0.3s ease; }
                .rxjxt-controls { display: flex; align-items: center; gap: 12px; }
                .rxjxt-mode-btn { padding: 4px 10px; font-size: 11px; font-weight: 600; background: rgba(255,255,255,0.05); border: none; border-radius: 100px; cursor: pointer; color: rgba(255,255,255,0.8); transition: 0.2s; }
                .rxjxt-mode-btn:hover { background: rgba(255,255,255,0.1); }
                .rxjxt-toggle { position: relative; display: inline-block; width: 40px; height: 22px; }
                .rxjxt-toggle input { opacity: 0; width: 0; height: 0; }
                .rxjxt-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(255,255,255,0.15); transition: .3s cubic-bezier(0.25, 1, 0.5, 1); border-radius: 34px; }
                .rxjxt-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 2px; bottom: 2px; background-color: #fff; transition: .3s cubic-bezier(0.25, 1, 0.5, 1); border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
                input:checked + .rxjxt-slider:before { transform: translateX(18px); }
                .rxjxt-close-btn { width: 26px; height: 26px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; justify-content: center; align-items: center; cursor: pointer; font-size: 12px; color: rgba(255,255,255,0.7); transition: 0.2s; }
                .rxjxt-close-btn:hover { background: rgba(255,255,255,0.2); color: #fff; transform: scale(1.1); }
                
                .rxjxt-body { padding: 22px; }
                .rxjxt-status-box { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 12px; font-weight: 600; }
                .rxjxt-eta { color: rgba(255,255,255,0.5); }
                .rxjxt-label { font-size: 11px; color: rgba(255,255,255,0.4); text-transform: uppercase; font-weight: 600; margin-bottom: 6px; display: block; letter-spacing: 0.5px; }
                .rxjxt-value { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.9); margin-bottom: 22px; line-height: 1.5; word-wrap: break-word; }
                
                .rxjxt-progress-wrapper { width: 100%; height: 6px; background: rgba(0,0,0,0.3); border-radius: 100px; margin-bottom: 22px; overflow: hidden; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5); }
                .rxjxt-progress-fill { height: 100%; width: 0%; background: #fff; border-radius: 100px; transition: width 0.4s ease, background 0.4s ease; }
                .theme-stealth .rxjxt-progress-fill { background: #0A84FF; }
                .theme-rage .rxjxt-progress-fill { background: #FF453A; }
                
                .rxjxt-terminal-container { background: rgba(0, 0, 0, 0.2); border-radius: 12px; padding: 12px; height: 110px; overflow-y: auto; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 11px; box-shadow: inset 0 2px 10px rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); }
                
                #rxjxt-header-btn { margin: 0 12px !important; transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
                #rxjxt-header-ring { width: 34px; height: 34px; border-radius: 50%; background: conic-gradient(#fff var(--rxjxt-prog, 0%), rgba(255,255,255,0.1) 0); display: flex; justify-content: center; align-items: center; transition: all 0.3s ease; }
                #rxjxt-header-inner { width: 28px; height: 28px; background: #1c1c1e; border-radius: 50%; display: flex; justify-content: center; align-items: center; overflow: hidden; box-shadow: 0 2px 5px rgba(0,0,0,0.3); transition: all 0.3s cubic-bezier(0.25, 1, 0.5, 1); }
                .rxjxt-custom-logo { width: 18px; height: 18px; object-fit: contain; transition: 0.3s ease; }
                #rxjxt-header-btn:hover #rxjxt-header-inner { transform: scale(1.05); }
                #rxjxt-header-btn.rxjxt-pressed #rxjxt-header-inner { transform: scale(0.85); background: #000; box-shadow: inset 0 4px 8px rgba(0,0,0,0.8); }
                #rxjxt-header-btn.rxjxt-pressed .rxjxt-custom-logo { opacity: 0.6; transform: scale(0.9); }

                #rxjxt-popup { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 10; display: none; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 30px; box-sizing: border-box; border-radius: 24px; }
                .rxjxt-popup-title { font-size: 18px; font-weight: 700; margin-bottom: 8px; }
                .rxjxt-popup-text { font-size: 13px; color: rgba(255,255,255,0.7); margin-bottom: 24px; line-height: 1.4; }
                .rxjxt-popup-actions { display: flex; gap: 12px; }
                .rxjxt-action-btn { background: rgba(255, 255, 255, 0.1); border: none; color: #fff; padding: 10px 20px; font-weight: 600; cursor: pointer; transition: 0.2s; border-radius: 100px; font-size: 13px; }
                .rxjxt-action-btn.primary { background: #0A84FF; }
                .rxjxt-action-btn:hover { filter: brightness(1.2); transform: scale(1.05); }
            `;
            document.head.appendChild(style);

            document.body.insertAdjacentHTML('beforeend', `
                <div id="rxjxt-liquid-ui">
                    <div id="rxjxt-mini-menu" class="liquid-panel ios-glass">
                        <div class="rxjxt-hub-item" id="rxjxt-menu-quest" style="color: #0A84FF;">
                            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
                            <span>Quest</span>
                        </div>
                        <div class="rxjxt-hub-item" id="rxjxt-menu-deafen" style="color: #FF453A;">
                            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3a9 9 0 0 0-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-4v8h4c1.1 0 2-.9 2-2v-7a9 9 0 0 0-9-9z"/></svg>
                            <span>Deafen</span>
                        </div>
                        <div class="rxjxt-hub-item" id="rxjxt-update-hub" style="display: none; color: #32ADE6;">
                            <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.36 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>
                            <span id="rxjxt-uhub-text">Hub</span>
                        </div>
                    </div>

                    <div id="rxjxt-quest-dash" class="liquid-panel ios-glass theme-stealth rxjxt-panel">
                        <div id="rxjxt-popup">
                            <div class="rxjxt-popup-title" id="rxjxt-popup-title">Confirm</div>
                            <div class="rxjxt-popup-text" id="rxjxt-popup-text">Message</div>
                            <div class="rxjxt-popup-actions">
                                <button class="rxjxt-action-btn primary" id="rxjxt-popup-btn-1">Confirm</button>
                                <button class="rxjxt-action-btn" id="rxjxt-popup-btn-2" style="display:none;">Cancel</button>
                            </div>
                        </div>
                        <div class="rxjxt-header">
                            <div class="rxjxt-brand-name">Quest Dash</div>
                            <div class="rxjxt-controls">
                                <button class="rxjxt-mode-btn" id="rxjxt-mode-btn">Stealth</button>
                                <label class="rxjxt-toggle">
                                    <input type="checkbox" id="rxjxt-grind-toggle">
                                    <span class="rxjxt-slider"></span>
                                </label>
                                <div class="rxjxt-close-btn rxjxt-x-btn">✕</div>
                            </div>
                        </div>
                        <div class="rxjxt-body">
                            <div class="rxjxt-status-box"><div class="rxjxt-live-status" id="rxjxt-live-status">Idle</div><div class="rxjxt-eta" id="rxjxt-eta">--:--</div></div>
                            <span class="rxjxt-label">Target</span><div class="rxjxt-value" id="rxjxt-current-quest">None</div>
                            <span class="rxjxt-label">Progress <span id="rxjxt-pct" style="float:right; font-weight:700;">0%</span></span>
                            <div class="rxjxt-progress-wrapper"><div class="rxjxt-progress-fill" id="rxjxt-bar"></div></div>
                            <span class="rxjxt-label">Terminal</span><div class="rxjxt-terminal-container" id="rxjxt-terminal-quest"></div>
                        </div>
                    </div>

                    <div id="rxjxt-deafen-dash" class="liquid-panel ios-glass theme-deafen-off rxjxt-panel">
                        <div class="rxjxt-header">
                            <div class="rxjxt-brand-name">Deafen Dash</div>
                            <div class="rxjxt-controls">
                                <label class="rxjxt-toggle">
                                    <input type="checkbox" id="rxjxt-deafen-toggle">
                                    <span class="rxjxt-slider"></span>
                                </label>
                                <div class="rxjxt-close-btn rxjxt-x-btn">✕</div>
                            </div>
                        </div>
                        <div class="rxjxt-body">
                            <div class="rxjxt-status-box"><div class="rxjxt-live-status" id="rxjxt-deafen-status">Inactive</div></div>
                            <span class="rxjxt-label">Info</span>
                            <div class="rxjxt-value">Toggle to automate Fake Deafen. You will hear and speak normally while appearing deafened to others.</div>
                            <span class="rxjxt-label">Terminal</span><div class="rxjxt-terminal-container" id="rxjxt-terminal-deafen"></div>
                        </div>
                    </div>
                </div>
            `);

            // HUB LOGIC
            const miniMenu = document.getElementById('rxjxt-mini-menu');
            const questDash = document.getElementById('rxjxt-quest-dash');
            const deafenDash = document.getElementById('rxjxt-deafen-dash');
            const toolBtn = document.getElementById('rxjxt-header-btn');

            const closeAllPanels = () => {
                miniMenu.classList.remove('rxjxt-open'); questDash.classList.remove('rxjxt-open'); deafenDash.classList.remove('rxjxt-open');
                if (toolBtn) toolBtn.classList.remove('rxjxt-pressed');
            };

            document.getElementById('rxjxt-menu-quest').onclick = () => { miniMenu.classList.remove('rxjxt-open'); questDash.classList.add('rxjxt-open'); };
            document.getElementById('rxjxt-menu-deafen').onclick = () => { miniMenu.classList.remove('rxjxt-open'); deafenDash.classList.add('rxjxt-open'); };
            document.querySelectorAll('.rxjxt-x-btn').forEach(btn => { btn.onclick = closeAllPanels; });

            // --- AUTO BOOTSTRAPPER (LAZY LOADER) ---
            const loadEngine = async (url, codeKey, versionKey, name) => {
                let code = BdApi.Data.load("RXJXTHub", codeKey);
                if (!code) {
                    rxjxtLog('HUB', `Auto-Installing ${name}...`, "warn");
                    try {
                        let res = await fetch(url + "?t=" + Date.now(), {cache: "no-store"});
                        code = await res.text();
                        let match = code.match(/@version\s+([0-9.]+)/);
                        BdApi.Data.save("RXJXTHub", codeKey, code);
                        BdApi.Data.save("RXJXTHub", versionKey, match ? match[1] : "1.0.0");
                        rxjxtLog('HUB', `${name} Installed!`, "success");
                    } catch (e) { rxjxtLog('HUB', `Failed to install ${name}`, "error"); return null; }
                }
                return code;
            };

            // QUEST ENGINE HANDLER (With Lazy Load)
            const questInput = document.getElementById('rxjxt-grind-toggle');
            questInput.addEventListener('change', async (e) => {
                window.rxjxtGrindToggle = e.target.checked;
                if (!window.rxjxtGrindToggle) {
                    rxjxtLog('QUEST', "Paused.", "warn");
                    updateQuestUI("Idle", 0, 100, "Idle");
                    if(window.rxjxtQuestEngine) window.rxjxtQuestEngine.stop();
                    return;
                }

                let savedCode = await loadEngine(QUEST_URL, "QuestCode", "QuestVersion", "Quest Engine");
                if (!savedCode) { e.target.checked = false; window.rxjxtGrindToggle = false; return; }

                try {
                    if (!window.rxjxtQuestEngine) eval(savedCode);
                    rxjxtLog('QUEST', "Enabled.", "success");
                    const apiCore = {
                        showPopup: (title, text, btn1, cb1, btn2, cb2) => {
                            const popup = document.getElementById('rxjxt-popup');
                            document.getElementById('rxjxt-popup-title').innerText = title; document.getElementById('rxjxt-popup-text').innerText = text;
                            const b1 = document.getElementById('rxjxt-popup-btn-1'); b1.innerText = btn1; b1.onclick = () => { popup.style.display = 'none'; if(cb1) cb1(); };
                            const b2 = document.getElementById('rxjxt-popup-btn-2');
                            if(btn2) { b2.style.display = 'block'; b2.innerText = btn2; b2.onclick = () => { popup.style.display = 'none'; if(cb2) cb2(); }; } else b2.style.display = 'none';
                            popup.style.display = 'flex';
                        },
                        hidePopup: () => { document.getElementById('rxjxt-popup').style.display = 'none'; },
                        disableToggle: () => { window.rxjxtGrindToggle = false; document.getElementById('rxjxt-grind-toggle').checked = false; },
                        setQuestName: (name) => { document.getElementById('rxjxt-current-quest').innerText = name; }
                    };
                    window.rxjxtQuestEngine.start(rxjxtLog, updateQuestUI, () => window.rxjxtGrindToggle, () => window.rxjxtMode, apiCore);
                } catch (err) { console.error(err); rxjxtLog('QUEST', "Failed to execute engine.", "error"); }
            });

            const modeBtn = document.getElementById('rxjxt-mode-btn');
            modeBtn.onclick = () => {
                window.rxjxtMode = window.rxjxtMode === 'STEALTH' ? 'RAGE' : 'STEALTH';
                modeBtn.innerText = window.rxjxtMode === 'RAGE' ? 'Rage' : 'Stealth';
                questDash.className = `liquid-panel ios-glass rxjxt-panel rxjxt-open theme-${window.rxjxtMode.toLowerCase()}`;
                rxjxtLog('QUEST', `Mode: ${window.rxjxtMode}`, window.rxjxtMode === 'RAGE' ? "brand" : "info");
            };

            // DEAFEN ENGINE HANDLER (With Lazy Load)
            const deafenInput = document.getElementById('rxjxt-deafen-toggle');
            const deafenStatusText = document.getElementById('rxjxt-deafen-status');
            deafenInput.addEventListener('change', async (e) => {
                window.rxjxtDeafenToggle = e.target.checked;
                
                let savedCode = await loadEngine(DEAFEN_URL, "DeafenCode", "DeafenVersion", "Deafen Engine");
                if (!savedCode) { e.target.checked = false; window.rxjxtDeafenToggle = false; return; }

                try {
                    eval(savedCode);
                    const updateUI = (text, color, isGlow) => {
                        deafenStatusText.innerText = isGlow ? "Active" : "Inactive";
                        const panel = document.getElementById('rxjxt-deafen-dash');
                        if (panel) panel.className = `liquid-panel ios-glass rxjxt-panel ${panel.classList.contains('rxjxt-open') ? 'rxjxt-open' : ''} ${isGlow ? 'theme-deafen-on' : 'theme-deafen-off'}`;
                    };
                    if (window.rxjxtDeafenToggle) window.rxjxtDeafenEngine.start(rxjxtLog, updateUI);
                    else window.rxjxtDeafenEngine.stop(rxjxtLog, updateUI);
                } catch (err) { console.error(err); rxjxtLog('DEAFEN', "Failed to execute engine.", "error"); }
            });

            // HUB UPDATE CHECKER (For future master updates)
            fetch(HUB_URL + "?t=" + Date.now(), {cache: "no-store"}).then(res => res.text()).then(code => {
                let match = code.match(/@version\s+([0-9.]+)/);
                if(match && match[1] !== HUB_VER) {
                    const btn = document.getElementById('rxjxt-update-hub');
                    btn.style.display = 'flex'; document.getElementById('rxjxt-uhub-text').innerText = `v${match[1]}`;
                    btn.onclick = () => {
                        const fs = require('fs'), path = require('path');
                        fs.writeFileSync(path.join(BdApi.Plugins.folder, "RXJXT.plugin.js"), code);
                        BdApi.UI.showToast(`Updated to v${match[1]}!`, {type: "success"});
                        setTimeout(() => location.reload(), 2000);
                    };
                }
            }).catch(()=>{});

            // SILENT ENGINE UPDATES
            const checkEngineUpdate = async (url, codeKey, versionKey, name) => {
                try {
                    let res = await fetch(url + "?t=" + Date.now(), {cache: "no-store"});
                    let code = await res.text();
                    let match = code.match(/@version\s+([0-9.]+)/);
                    let currentVer = BdApi.Data.load("RXJXTHub", versionKey);
                    
                    if(match && currentVer && match[1] !== currentVer) {
                        BdApi.Data.save("RXJXTHub", codeKey, code);
                        BdApi.Data.save("RXJXTHub", versionKey, match[1]);
                        rxjxtLog('HUB', `${name} Auto-Updated to v${match[1]}!`, "success");
                    }
                } catch(e) {}
            };
            checkEngineUpdate(QUEST_URL, "QuestCode", "QuestVersion", "Quest Engine");
            checkEngineUpdate(DEAFEN_URL, "DeafenCode", "DeafenVersion", "Deafen Engine");
        };

        let currentSecondsLeft = 0;
        const updateQuestUI = (questName, current, total, status = "Active") => {
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
                let ringColor = window.rxjxtMode === 'RAGE' ? '#FF453A' : '#0A84FF';
                if(pct >= 100) ringColor = '#30D158';
                if (!window.rxjxtGrindToggle) ringColor = '#fff';
                headerRing.style.background = `conic-gradient(${ringColor} var(--rxjxt-prog, 0%), rgba(255,255,255,0.1) 0)`;
            }
        };

        window.rxjxtTimer = setInterval(() => {
            if (currentSecondsLeft > 0 && window.rxjxtGrindToggle) {
                currentSecondsLeft--;
                let mins = Math.floor(currentSecondsLeft / 60).toString().padStart(2, '0');
                let secs = (currentSecondsLeft % 60).toString().padStart(2, '0');
                const etaEl = document.getElementById('rxjxt-eta');
                if(etaEl) etaEl.innerText = `${mins}:${secs}`;
            }
        }, 1000);

        const ensureToolbarIcon = () => {
            if (!window.rxjxtEngineRunning) return;
            let btn = document.getElementById('rxjxt-header-btn');
            const toolbar = document.querySelector('section [class*="toolbar_"]');

            if (toolbar && !btn) {
                btn = document.createElement('div');
                btn.id = 'rxjxt-header-btn';
                btn.style.cssText = 'display: flex; align-items: center; justify-content: center; cursor: pointer; position: relative;';
                btn.innerHTML = `<div id="rxjxt-header-ring" style="--rxjxt-prog: 0%;"><div id="rxjxt-header-inner"><img src="${CUSTOM_LOGO_URL}" class="rxjxt-custom-logo"></div></div>`;
                
                btn.onclick = (e) => {
                    e.preventDefault(); e.stopPropagation();
                    const miniMenu = document.getElementById('rxjxt-mini-menu');
                    const questDash = document.getElementById('rxjxt-quest-dash');
                    const deafenDash = document.getElementById('rxjxt-deafen-dash');
                    
                    if(questDash.classList.contains('rxjxt-open') || deafenDash.classList.contains('rxjxt-open') || miniMenu.classList.contains('rxjxt-open')) {
                        questDash.classList.remove('rxjxt-open'); deafenDash.classList.remove('rxjxt-open'); miniMenu.classList.remove('rxjxt-open');
                        btn.classList.remove('rxjxt-pressed');
                    } else {
                        miniMenu.classList.add('rxjxt-open'); btn.classList.add('rxjxt-pressed');
                    }
                };
                toolbar.insertBefore(btn, toolbar.firstChild);
            }
        };

        window.rxjxtToolbarInterval = setInterval(ensureToolbarIcon, 1000);

        injectLiquidUI();
        rxjxtLog('HUB', "UI Shell Loaded. Ready.", "brand");
    }

    stop() {
        if (window.rxjxtTimer) clearInterval(window.rxjxtTimer);
        if (window.rxjxtToolbarInterval) clearInterval(window.rxjxtToolbarInterval);
        if (window.rxjxtQuestEngine) window.rxjxtQuestEngine.stop();
        window.rxjxtEngineRunning = false; window.rxjxtGrindToggle = false; window.rxjxtDeafenToggle = false;
        if (window.rxjxtWSHooked && window.rxjxtOriginalWS) { window.WebSocket.prototype.send = window.rxjxtOriginalWS; window.rxjxtWSHooked = false; }
        const ui = document.getElementById('rxjxt-liquid-ui'); if (ui) ui.remove();
        const headerBtn = document.getElementById('rxjxt-header-btn'); if (headerBtn) headerBtn.remove();
        const style = document.getElementById('rxjxt-styles'); if (style) style.remove();
        console.log("%c[ RXJXT ] SHUTDOWN.", "color: #ff003c; font-weight: bold;");
    }
};
