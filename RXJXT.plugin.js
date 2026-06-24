/**
 * @name RXJXTQuestDashboard
 * @author RXJXT
 * @description Native Discord Toolbar UI & Auto-Grind Engine for Quests.
 * @version 7.4.0
 * @updateUrl https://raw.githubusercontent.com/rxjxt-1/RXJXT-Quest-Tool/refs/heads/main/RXJXT.plugin.js
 */

module.exports = class RXJXTQuestDashboard {
    start() {
        if (window.rxjxtEngineRunning) return;
        window.rxjxtEngineRunning = true;

        console.clear();
        const sleep = ms => new Promise(res => setTimeout(res, ms));

        // ==========================================
        // RXJXT OTA UPDATER CONFIG
        // ==========================================
        const CURRENT_VERSION = "7.4.0";
        
        // YAHAN APNA GITHUB 'RAW' LINK DAALO 👇
        const UPDATE_URL = "https://raw.githubusercontent.com/rxjxt-1/RXJXT-Quest-Tool/refs/heads/main/RXJXT.plugin.js";

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
                
                #rxjxt-liquid-ui { position: fixed; top: 60px; right: 40px; z-index: 9999999; font-family: 'Share Tech Mono', monospace; color: #fff; }
                #rxjxt-main-dash { width: 380px; background: rgba(10, 15, 20, 0.45); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px); border: 1px solid rgba(0, 243, 255, 0.4); box-shadow: 0 8px 32px 0 rgba(0, 243, 255, 0.2), inset 0 0 20px rgba(0,0,0,0.8); border-radius: 12px; overflow: hidden; transition: opacity 0.3s ease, transform 0.3s ease; position: relative; }
                #rxjxt-main-dash::before { content: ""; position: absolute; top:0; left:0; width:100%; height:100%; background: repeating-linear-gradient(transparent, transparent 2px, rgba(0, 243, 255, 0.03) 3px); pointer-events: none; z-index: 0; }
                
                .rxjxt-header { background: linear-gradient(90deg, rgba(255,0,60,0.8) 0%, rgba(0,0,0,0.2) 100%); padding: 12px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(252, 238, 10, 0.5); cursor: grab; position: relative; z-index: 20; }
                .rxjxt-brand-name { font-family: 'Rajdhani', sans-serif; font-size: 20px; font-weight: 700; letter-spacing: 2px; text-shadow: 0 0 10px #ff003c; animation: glitch 3s infinite; pointer-events: none; }
                .rxjxt-controls { display: flex; gap: 15px; }
                .rxjxt-btn-icon { color: #00f3ff; cursor: pointer; font-weight: bold; transition: 0.2s; text-shadow: 0 0 5px #00f3ff; font-size: 16px; }
                .rxjxt-btn-icon:hover { color: #fff; text-shadow: 0 0 15px #fff; transform: scale(1.2); }
                
                #rxjxt-update-btn { display: none; color: #fcee0a; text-shadow: 0 0 10px #ff9d00; animation: pulse-mini 1s infinite; font-size: 18px; margin-right: 5px; }
                #rxjxt-update-btn:hover { color: #fff; text-shadow: 0 0 20px #00f3ff; transform: scale(1.3); }

                .rxjxt-body { padding: 20px; position: relative; z-index: 3; }
                .rxjxt-status-box { display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 11px; }
                #rxjxt-live-status { color: #fcee0a; font-weight: bold; text-shadow: 0 0 5px #fcee0a; }
                #rxjxt-eta { color: #00f3ff; font-weight: bold; }
                .rxjxt-label { font-size: 11px; color: rgba(255,255,255,0.6); text-transform: uppercase; margin-bottom: 4px; display: block; }
                .rxjxt-value { font-size: 14px; color: #fff; text-shadow: 0 0 8px #00f3ff; margin-bottom: 20px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .rxjxt-progress-wrapper { width: 100%; height: 8px; background: rgba(0,0,0,0.6); border: 1px solid rgba(0, 243, 255, 0.3); border-radius: 4px; position: relative; margin-bottom: 20px; overflow: hidden; }
                .rxjxt-progress-fill { height: 100%; width: 0%; background: linear-gradient(90deg, #00f3ff, #fcee0a); box-shadow: 0 0 15px #fcee0a; transition: width 0.3s ease; position: relative; }
                .rxjxt-terminal-container { background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(255,0,60,0.3); border-left: 2px solid #ff003c; border-radius: 4px; padding: 10px; height: 110px; overflow-y: auto; font-size: 11px; }
                
                /* NATIVE TOOLBAR ICON STYLES */
                #rxjxt-header-ring { width: 24px; height: 24px; border-radius: 50%; background: conic-gradient(#00f3ff var(--rxjxt-prog, 0%), rgba(255,0,60,0.15) 0); display: flex; justify-content: center; align-items: center; box-shadow: 0 0 8px rgba(0, 243, 255, 0.3); transition: background 0.3s ease; animation: pulse-mini-ring 2s infinite; }
                #rxjxt-header-inner { width: 18px; height: 18px; background: #2b2d31; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-family: 'Rajdhani', sans-serif; font-weight: bold; font-size: 12px; color: #fff; transition: color 0.3s ease; }
                #rxjxt-header-btn:hover #rxjxt-header-ring { box-shadow: 0 0 15px rgba(0, 243, 255, 0.8); }
                
                #rxjxt-popup { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.85); backdrop-filter: blur(5px); z-index: 10; display: none; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 50px 20px 20px 20px; box-sizing: border-box; }
                .rxjxt-popup-title { color: #ff003c; font-size: 18px; font-weight: bold; margin-bottom: 10px; text-shadow: 0 0 10px #ff003c; }
                .rxjxt-popup-text { color: #aaa; font-size: 12px; margin-bottom: 20px; }
                .rxjxt-action-btn { background: rgba(0, 243, 255, 0.1); border: 1px solid #00f3ff; color: #00f3ff; padding: 8px 20px; font-family: inherit; font-weight: bold; cursor: pointer; transition: 0.3s; box-shadow: 0 0 10px rgba(0, 243, 255, 0.2); }
                .rxjxt-action-btn:hover { background: #00f3ff; color: #000; box-shadow: 0 0 20px #00f3ff; }
                
                @keyframes pulse-mini { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
                @keyframes pulse-mini-ring { 0%, 100% { box-shadow: 0 0 5px rgba(255,0,60,0.4); } 50% { box-shadow: 0 0 12px rgba(0,243,255,0.6); } }
                @keyframes glitch { 0%, 100% { transform: translate(0); } 20% { transform: translate(-1px, 1px); } 40% { transform: translate(1px, -1px); } }
            `;
            document.head.appendChild(style);

            document.body.insertAdjacentHTML('beforeend', `
                <div id="rxjxt-liquid-ui">
                    <div id="rxjxt-main-dash">
                        <div id="rxjxt-popup">
                            <div class="rxjxt-popup-title" id="rxjxt-popup-title">WARNING</div>
                            <div class="rxjxt-popup-text" id="rxjxt-popup-text">No active quests found.</div>
                            <button class="rxjxt-action-btn" id="rxjxt-popup-btn">RETRY ENGINE</button>
                        </div>
                        <div class="rxjxt-header" id="rxjxt-drag-handle">
                            <div class="rxjxt-brand-name">RXJXT TOOL v${CURRENT_VERSION}</div>
                            <div class="rxjxt-controls">
                                <span class="rxjxt-btn-icon" id="rxjxt-update-btn" title="Cloud Update Available!">☁️</span>
                                <span class="rxjxt-btn-icon" id="rxjxt-min-btn" title="Minimize to Toolbar">_</span>
                                <span class="rxjxt-btn-icon" id="rxjxt-close-btn" title="Close">✕</span>
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

            const makeDraggable = (element, handle) => {
                let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                handle.onmousedown = (e) => {
                    e.preventDefault(); pos3 = e.clientX; pos4 = e.clientY;
                    document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
                    document.onmousemove = (e) => {
                        e.preventDefault(); pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY;
                        element.style.top = (element.offsetTop - pos2) + "px"; element.style.left = (element.offsetLeft - pos1) + "px"; element.style.right = "auto";
                    };
                };
            };

            const uiWrapper = document.getElementById('rxjxt-liquid-ui');
            makeDraggable(uiWrapper, document.getElementById('rxjxt-drag-handle'));

            document.getElementById('rxjxt-min-btn').onclick = () => {
                document.getElementById('rxjxt-main-dash').style.display = 'none';
            };
            document.getElementById('rxjxt-close-btn').onclick = () => {
                this.stop(); 
            };

            // CHECK FOR GITHUB UPDATES
            fetch(UPDATE_URL).then(res => res.text()).then(code => {
                const match = code.match(/@version\s+([0-9.]+)/);
                if(match && match[1] !== CURRENT_VERSION) {
                    rxjxtLog(`UPDATE AVAILABLE: v${match[1]} DETECTED ON GITHUB!`, "warn");
                    const updateBtn = document.getElementById('rxjxt-update-btn');
                    updateBtn.style.display = 'inline-block';
                    
                    updateBtn.onclick = () => {
                        rxjxtLog(`DOWNLOADING UPDATE v${match[1]}...`, "info");
                        const fs = require('fs');
                        const path = require('path');
                        try {
                            const pluginFile = path.join(BdApi.Plugins.folder, "RXJXT.plugin.js");
                            fs.writeFileSync(pluginFile, code);
                            BdApi.UI.showToast(`RXJXT Tool Updated to v${match[1]}! Reloading...`, {type: "success"});
                            setTimeout(() => location.reload(), 2000);
                        } catch(e) {
                            rxjxtLog("UPDATE FAILED. PLEASE UPDATE MANUALLY.", "error");
                        }
                    };
                }
            }).catch(err => { rxjxtLog("COULD NOT CONNECT TO GITHUB FOR UPDATES.", "warn"); });
        };

        // NATIVE DISCORD TOOLBAR INJECTOR
        const ensureToolbarIcon = () => {
            if (!window.rxjxtEngineRunning) return;
            let btn = document.getElementById('rxjxt-header-btn');
            // Target Discord's native header toolbar
            const toolbar = document.querySelector('section [class*="toolbar_"]');

            if (toolbar && !btn) {
                btn = document.createElement('div');
                btn.id = 'rxjxt-header-btn';
                btn.setAttribute('aria-label', 'RXJXT Dashboard');
                btn.style.cssText = 'display: flex; align-items: center; justify-content: center; cursor: pointer; margin: 0 8px; width: 24px; height: 24px; position: relative;';
                
                btn.innerHTML = `
                    <div id="rxjxt-header-ring" style="--rxjxt-prog: 0%;">
                        <div id="rxjxt-header-inner">Q</div>
                    </div>
                `;
                
                btn.onclick = () => {
                    const mainDash = document.getElementById('rxjxt-main-dash');
                    if(mainDash) mainDash.style.display = mainDash.style.display === 'none' ? 'block' : 'none';
                };

                // Insert at the beginning of the toolbar
                toolbar.insertBefore(btn, toolbar.firstChild);
            }
        };

        // Run interval to ensure icon stays even if user changes servers/channels
        window.rxjxtToolbarInterval = setInterval(ensureToolbarIcon, 1500);

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

            // UPDATE NATIVE HEADER ICON RING
            const headerRing = document.getElementById('rxjxt-header-ring');
            const headerInner = document.getElementById('rxjxt-header-inner');
            if (headerRing && headerInner) {
                headerRing.style.setProperty('--rxjxt-prog', `${pct}%`);
                if(pct >= 100) {
                    headerRing.style.background = `conic-gradient(#fcee0a var(--rxjxt-prog, 0%), rgba(255,0,60,0.15) 0)`;
                    headerInner.style.color = '#fcee0a';
                    headerInner.innerText = '✔';
                } else {
                    headerRing.style.background = `conic-gradient(#00f3ff var(--rxjxt-prog, 0%), rgba(255,0,60,0.15) 0)`;
                    headerInner.style.color = '#fff';
                    headerInner.innerText = 'Q';
                }
            }
        };

        const showPopup = (title, text, btnText, callback) => {
            const popup = document.getElementById('rxjxt-popup');
            if (!popup) return;
            document.getElementById('rxjxt-popup-title').innerText = title;
            document.getElementById('rxjxt-popup-text').innerText = text;
            const btn = document.getElementById('rxjxt-popup-btn');
            btn.innerText = btnText;
            btn.onclick = () => { popup.style.display = 'none'; if(callback) callback(); };
            popup.style.display = 'flex';
        };

        const hidePopup = () => {
            const popup = document.getElementById('rxjxt-popup');
            if(popup) popup.style.display = 'none';
        };

        window.rxjxtTimer = setInterval(() => {
            if (currentSecondsLeft > 0) {
                currentSecondsLeft--;
                let mins = Math.floor(currentSecondsLeft / 60).toString().padStart(2, '0');
                let secs = (currentSecondsLeft % 60).toString().padStart(2, '0');
                const etaEl = document.getElementById('rxjxt-eta');
                if(etaEl) etaEl.innerText = `ETA: ${mins}:${secs}`;
            }
        }, 1000);

        injectLiquidUI();
        rxjxtLog("RXJXT NATIVE BD PLUGIN MOUNTED...", "brand");

        let isGrinding = false;

        const startEngine = async () => {
            try {
                let wpRequire = window.webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
                window.webpackChunkdiscord_app.pop();

                let ApplicationStreamingStore = Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getStreamerActiveStreamMetadata);
                let RunningGameStore = Object.values(wpRequire.c).find(x => x?.exports?.Ay?.getRunningGames);
                let QuestsStore = Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getQuest);
                let ChannelStore = Object.values(wpRequire.c).find(x => x?.exports?.A?.__proto__?.getAllThreadsForParent);
                let GuildChannelStore = Object.values(wpRequire.c).find(x => x?.exports?.Ay?.getSFWDefaultChannel);
                let FluxDispatcher = Object.values(wpRequire.c).find(x => x?.exports?.h?.__proto__?.flushWaitQueue);
                let api = Object.values(wpRequire.c).find(x => x?.exports?.Bo?.get);

                if (ApplicationStreamingStore) ApplicationStreamingStore = ApplicationStreamingStore.exports.A;
                if (RunningGameStore) RunningGameStore = RunningGameStore.exports.Ay;
                if (QuestsStore) QuestsStore = QuestsStore.exports.A;
                if (ChannelStore) ChannelStore = ChannelStore.exports.A;
                if (GuildChannelStore) GuildChannelStore = GuildChannelStore.exports.Ay;
                if (FluxDispatcher) FluxDispatcher = FluxDispatcher.exports.h;
                if (api) api = api.exports.Bo;

                const supportedTasks = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE"];

                const checkAndStart = () => {
                    if (isGrinding) return;

                    const allQuests = [...QuestsStore.quests.values()].filter(x => new Date(x.config.expiresAt).getTime() > Date.now() && supportedTasks.find(y => Object.keys((x.config.taskConfig ?? x.config.taskConfigV2).tasks).includes(y)));
                    
                    let unacceptedQuests = allQuests.filter(x => !x.userStatus?.enrolledAt && !x.userStatus?.completedAt);
                    let acceptedQuests = allQuests.filter(x => x.userStatus?.enrolledAt && !x.userStatus?.completedAt);

                    if (acceptedQuests.length > 0) {
                        if (window.questWatcher) { clearInterval(window.questWatcher); window.questWatcher = null; }
                        hidePopup();
                        isGrinding = true;
                        rxjxtLog("QUEST ACCEPTED. ENGAGING AUTO-START...", "success");
                        doJob(acceptedQuests, api, RunningGameStore, FluxDispatcher, ApplicationStreamingStore, ChannelStore, GuildChannelStore);
                    } 
                    else if (unacceptedQuests.length > 0) {
                        updateUI("WAITING FOR USER", 0, 100, "ACTION REQUIRED");
                        showPopup("QUEST NOT ACCEPTED", "Discord quest section mein jaakar quest ACCEPT karo! Tool automatically start ho jayega.", "RETRY CHECK", () => checkAndStart());
                        
                        if (!window.questWatcher) {
                            rxjxtLog("WAITING FOR QUEST ACCEPTANCE...", "warn");
                            window.questWatcher = setInterval(() => { if (!isGrinding) checkAndStart(); }, 3000);
                        }
                    } 
                    else {
                        rxjxtLog("NO ELIGIBLE QUESTS FOUND.", "error");
                        showPopup("NO QUESTS", "Sab quests complete ho chuki hain ya koi nayi available nahi hai.", "REFRESH", () => checkAndStart());
                    }
                };

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

                    rxjxtLog(`TARGET LOCK: ${questName}`, "info");
                    document.getElementById('rxjxt-current-quest').innerText = questName;
                    updateUI(questName, secondsDone, secondsNeeded, "IN PROGRESS...");

                    const finishQuest = async () => {
                        rxjxtLog(`[✔] QUEST COMPLETE: ${questName}`, "finish");
                        updateUI(questName, secondsNeeded, secondsNeeded, "SUCCESS!");
                        await sleep(2500);
                        isGrinding = false;
                        checkAndStart();
                    };

                    if(taskName === "WATCH_VIDEO" || taskName === "WATCH_VIDEO_ON_MOBILE") {
                        const speed = 7;
                        let completed = false;
                        let fn = async () => {
                            rxjxtLog(`SPOOFING VIDEO METRICS...`, "warn");
                            while(true) {
                                const remaining = Math.min(speed, secondsNeeded - secondsDone);
                                await new Promise(resolve => setTimeout(resolve, remaining * 1000));
                                const timestamp = secondsDone + speed;
                                const res = await api.post({url: `/quests/${quest.id}/video-progress`, body: {timestamp: Math.min(secondsNeeded, timestamp + Math.random())}});
                                completed = res.body.completed_at != null;
                                secondsDone = Math.min(secondsNeeded, timestamp);
                                updateUI(questName, secondsDone, secondsNeeded, "IN PROGRESS...");
                                if(timestamp >= secondsNeeded) break;
                            }
                            if(!completed) await api.post({url: `/quests/${quest.id}/video-progress`, body: {timestamp: secondsNeeded}});
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
                            rxjxtLog(`INJECTED GAME PID: ${applicationName}`, "warn");

                            let fn = data => {
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
                        rxjxtLog(`SPOOFING STREAM METADATA: ${applicationName}`, "warn");

                        let fn = data => {
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
                            rxjxtLog(`FORGING ACTIVITY SYNC...`, "warn");
                            while(true) {
                                const res = await api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: streamKey, terminal: false}});
                                const progress = res.body.progress.PLAY_ACTIVITY.value;
                                updateUI(questName, progress, secondsNeeded, "ACTIVITY SYNC...");
                                await new Promise(resolve => setTimeout(resolve, 20 * 1000));
                                if(progress >= secondsNeeded) {
                                    await api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: streamKey, terminal: true}});
                                    break;
                                }
                            }
                            finishQuest();
                        }
                        fn();
                    }
                };

                checkAndStart();
            } catch (err) {
                isGrinding = false;
                rxjxtLog("WAITING FOR DISCORD TO LOAD...", "warn");
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
        
        const ui = document.getElementById('rxjxt-liquid-ui');
        if (ui) ui.remove();
        
        const headerBtn = document.getElementById('rxjxt-header-btn');
        if (headerBtn) headerBtn.remove();

        const style = document.getElementById('rxjxt-styles');
        if (style) style.remove();
        
        console.log("%c[ RXJXT ] TOOL STOPPED & CLEANED UP.", "color: #ff003c; font-weight: bold;");
    }
};
