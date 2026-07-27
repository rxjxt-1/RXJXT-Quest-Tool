/**
 * @name RXJXT-Quest-Engine
 * @version 2.0.0
 * @description Upgraded with Dynamic Webpack Property Finder for update-proof functionality.
 */
window.rxjxtQuestEngine = {
    _rxjxtIsGrinding: false,
    _rxjxtWatcher: null,
    
    start: async function(rxjxtLog, rxjxtUpdateUI, rxjxtGetToggle, rxjxtGetMode, rxjxtApiCore) {
        // RXJXT ANTI-TAMPER CHECK
        if (!String(this.start).includes("rxjxt") || !window.rxjxtEngineRunning) { window.rxjxtQuestEngine = null; throw new Error("RXJXT_CORRUPTED"); }

        try {
            // THE FIX: Dynamic Webpack Extractor (Update-Proof)
            let rxjxtWp;
            window.webpackChunkdiscord_app.push([[Symbol()], {}, r => rxjxtWp = r]);
            window.webpackChunkdiscord_app.pop();

            const rxjxtFindByProps = (...props) => {
                for (let m of Object.values(rxjxtWp.c)) {
                    if (m?.exports) {
                        if (props.every(p => m.exports[p] !== undefined)) return m.exports;
                        for (let key in m.exports) {
                            if (m.exports[key] && typeof m.exports[key] === 'object' && props.every(p => m.exports[key][p] !== undefined)) return m.exports[key];
                        }
                    }
                }
                return null;
            };

            // Safely pulling Discord stores regardless of minified letter changes
            let rxjxtStreamStore = rxjxtFindByProps("getStreamerActiveStreamMetadata");
            let rxjxtGameStore = rxjxtFindByProps("getRunningGames", "getGameForPID");
            let rxjxtQuestStore = rxjxtFindByProps("quests", "getQuest");
            let rxjxtThreadStore = rxjxtFindByProps("getAllThreadsForParent");
            let rxjxtGuildStore = rxjxtFindByProps("getSFWDefaultChannel");
            let rxjxtDispatcher = rxjxtFindByProps("dispatch", "subscribe", "unsubscribe");
            let rxjxtReq = rxjxtFindByProps("get", "post", "put");

            const rxjxtSupported = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE"];

            const rxjxtCheckAndStart = () => {
                if (!rxjxtGetToggle() || this._rxjxtIsGrinding) return;
                if (!rxjxtQuestStore) { rxjxtLog('QUEST', "Discord Core Not Ready. Retrying...", "warn"); return; }

                const rxjxtAll = [...rxjxtQuestStore.quests.values()].filter(x => new Date(x.config.expiresAt).getTime() > Date.now() && rxjxtSupported.find(y => Object.keys((x.config.taskConfig ?? x.config.taskConfigV2).tasks).includes(y)));
                let rxjxtUnacc = rxjxtAll.filter(x => !x.userStatus?.enrolledAt && !x.userStatus?.completedAt);
                let rxjxtAcc = rxjxtAll.filter(x => x.userStatus?.enrolledAt && !x.userStatus?.completedAt);

                if (rxjxtAcc.length > 0) {
                    if (this._rxjxtWatcher) { clearInterval(this._rxjxtWatcher); this._rxjxtWatcher = null; }
                    rxjxtApiCore.hidePopup();
                    
                    let rxjxtNext = null;
                    if (rxjxtGetMode() === 'RAGE') { rxjxtNext = rxjxtAcc.pop(); } 
                    else {
                        let rxjxtGames = rxjxtAcc.filter(q => {
                            let tName = rxjxtSupported.find(x => (q.config.taskConfig ?? q.config.taskConfigV2).tasks[x] != null);
                            return tName !== "WATCH_VIDEO" && tName !== "WATCH_VIDEO_ON_MOBILE";
                        });
                        let rxjxtVids = rxjxtAcc.filter(q => {
                            let tName = rxjxtSupported.find(x => (q.config.taskConfig ?? q.config.taskConfigV2).tasks[x] != null);
                            return tName === "WATCH_VIDEO" || tName === "WATCH_VIDEO_ON_MOBILE";
                        });

                        if (rxjxtGames.length > 0) rxjxtNext = rxjxtGames.pop();
                        else if (rxjxtVids.length > 0) {
                            if (!window.rxjxtVideoApproval) {
                                rxjxtUpdateUI("Paused", 0, 100, "Action");
                                rxjxtApiCore.showPopup("Confirm", "Only video quests remain. Auto-grind them?", "Confirm", () => { window.rxjxtVideoApproval = true; rxjxtCheckAndStart(); }, "Cancel", () => { rxjxtApiCore.disableToggle(); rxjxtLog('QUEST', "Cancelled.", "warn"); rxjxtUpdateUI("Idle", 0, 100, "Idle"); });
                                return; 
                            } else rxjxtNext = rxjxtVids.pop();
                        }
                    }

                    if (rxjxtNext) {
                        this._rxjxtIsGrinding = true; rxjxtLog('QUEST', `Grinding started.`, "success");
                        rxjxtDoJob([rxjxtNext], rxjxtReq, rxjxtGameStore, rxjxtDispatcher, rxjxtStreamStore, rxjxtThreadStore, rxjxtGuildStore);
                    }
                } 
                else if (rxjxtUnacc.length > 0) {
                    rxjxtUpdateUI("Action Required", 0, 100, "Idle");
                    rxjxtApiCore.showPopup("Info", "Accept quests in Discord first.", "Retry", () => rxjxtCheckAndStart());
                    if (!this._rxjxtWatcher) this._rxjxtWatcher = setInterval(() => { if (!this._rxjxtIsGrinding && rxjxtGetToggle()) rxjxtCheckAndStart(); }, 3000);
                } else {
                    rxjxtLog('QUEST', "No quests found.", "error");
                    rxjxtApiCore.showPopup("Status", "All quests completed or unavailable.", "Refresh", () => rxjxtCheckAndStart());
                }
            };

            const rxjxtDoJob = async (rxjxtArray, api, GameStore, Dispatcher, StreamStore, ThreadStore, GuildStore) => {
                const quest = rxjxtArray.pop();
                if(!quest) { this._rxjxtIsGrinding = false; rxjxtCheckAndStart(); return; }

                const pid = Math.floor(Math.random() * 30000) + 1000;
                const rxjxtAppId = quest.config.application.id;
                const rxjxtQName = quest.config.messages.questName;
                const rxjxtTaskCfg = quest.config.taskConfig ?? quest.config.taskConfigV2;
                const rxjxtTName = rxjxtSupported.find(x => rxjxtTaskCfg.tasks[x] != null);
                const rxjxtTarget = rxjxtTaskCfg.tasks[rxjxtTName].target;
                let rxjxtDone = quest.userStatus?.progress?.[rxjxtTName]?.value ?? 0;

                rxjxtApiCore.setQuestName(rxjxtQName);
                rxjxtUpdateUI(rxjxtQName, rxjxtDone, rxjxtTarget, "Grinding");

                const rxjxtFinish = async () => {
                    rxjxtLog('QUEST', `Done: ${rxjxtQName}`, "finish");
                    rxjxtUpdateUI(rxjxtQName, rxjxtTarget, rxjxtTarget, "Complete");
                    await new Promise(r => setTimeout(r, 2500)); 
                    this._rxjxtIsGrinding = false; rxjxtCheckAndStart();
                };

                if(rxjxtTName === "WATCH_VIDEO" || rxjxtTName === "WATCH_VIDEO_ON_MOBILE") {
                    let rxjxtComp = false;
                    let fn = async () => {
                        while(true) {
                            if (!rxjxtGetToggle()) { this._rxjxtIsGrinding = false; return; } 
                            const rem = Math.min(7, rxjxtTarget - rxjxtDone);
                            await new Promise(r => setTimeout(r, rem * 1000));
                            const ts = rxjxtDone + 7;
                            const res = await api.post({url: `/quests/${quest.id}/video-progress`, body: {timestamp: Math.min(rxjxtTarget, ts + Math.random())}});
                            rxjxtComp = res.body.completed_at != null;
                            rxjxtDone = Math.min(rxjxtTarget, ts);
                            rxjxtUpdateUI(rxjxtQName, rxjxtDone, rxjxtTarget, "Grinding");
                            if(ts >= rxjxtTarget) break;
                        }
                        if(!rxjxtComp && rxjxtGetToggle()) await api.post({url: `/quests/${quest.id}/video-progress`, body: {timestamp: rxjxtTarget}});
                        rxjxtFinish();
                    }
                    fn();
                } else if(rxjxtTName === "PLAY_ON_DESKTOP") {
                    api.get({url: `/applications/public?application_ids=${rxjxtAppId}`}).then(res => {
                        const app = res.body[0];
                        const exe = app.executables?.find(x => x.os === "win32")?.name?.replace(">","") ?? app.name.replace(/[\/\\:*?"<>|]/g, "");
                        const fake = { cmdLine: `C:\\Program Files\\${app.name}\\${exe}`, exeName: exe, exePath: `c:/program files/${app.name.toLowerCase()}/${exe}`, hidden: false, isLauncher: false, id: rxjxtAppId, name: app.name, pid: pid, pidPath: [pid], processName: app.name, start: Date.now() };

                        const realG = GameStore.getRunningGames(); 
                        const realFn1 = GameStore.getRunningGames; const realFn2 = GameStore.getGameForPID;
                        
                        GameStore.getRunningGames = () => [fake]; GameStore.getGameForPID = p => [fake].find(x => x.pid === p);
                        Dispatcher.dispatch({type: "RUNNING_GAMES_CHANGE", removed: realG, added: [fake], games: [fake]});

                        let fn = data => {
                            if (!rxjxtGetToggle()) { 
                                Dispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                                GameStore.getRunningGames = realFn1; GameStore.getGameForPID = realFn2;
                                Dispatcher.dispatch({type: "RUNNING_GAMES_CHANGE", removed: [fake], added: [], games: []});
                                this._rxjxtIsGrinding = false; return;
                            }
                            let prog = quest.config.configVersion === 1 ? data.userStatus.streamProgressSeconds : Math.floor(data.userStatus.progress.PLAY_ON_DESKTOP.value);
                            rxjxtUpdateUI(rxjxtQName, prog, rxjxtTarget, "Grinding");
                            if(prog >= rxjxtTarget) {
                                GameStore.getRunningGames = realFn1; GameStore.getGameForPID = realFn2;
                                Dispatcher.dispatch({type: "RUNNING_GAMES_CHANGE", removed: [fake], added: [], games: []});
                                Dispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                                rxjxtFinish();
                            }
                        };
                        Dispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                    });
                }
                else if(rxjxtTName === "STREAM_ON_DESKTOP") {
                    let realF = StreamStore.getStreamerActiveStreamMetadata;
                    StreamStore.getStreamerActiveStreamMetadata = () => ({ id: rxjxtAppId, pid: pid, sourceName: null });
                    let fn = data => {
                        if (!rxjxtGetToggle()) { 
                            Dispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                            StreamStore.getStreamerActiveStreamMetadata = realF;
                            this._rxjxtIsGrinding = false; return;
                        }
                        let prog = quest.config.configVersion === 1 ? data.userStatus.streamProgressSeconds : Math.floor(data.userStatus.progress.STREAM_ON_DESKTOP.value);
                        rxjxtUpdateUI(rxjxtQName, prog, rxjxtTarget, "Streaming");
                        if(prog >= rxjxtTarget) {
                            StreamStore.getStreamerActiveStreamMetadata = realF;
                            Dispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                            rxjxtFinish();
                        }
                    };
                    Dispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                }
                else if(rxjxtTName === "PLAY_ACTIVITY") {
                    // FIX: Safe checking for VC channel availability
                    const cId = ThreadStore.getSortedPrivateChannels()[0]?.id ?? Object.values(GuildStore.getAllGuilds()).find(x => x != null && x.VOCAL && x.VOCAL.length > 0)?.VOCAL[0]?.channel?.id;
                    if(!cId) { 
                        rxjxtLog('QUEST', "No VC channel found to sync activity.", "error"); 
                        this._rxjxtIsGrinding = false;
                        rxjxtCheckAndStart();
                        return; 
                    }
                    
                    const sKey = `call:${cId}:1`;
                    let fn = async () => {
                        while(true) {
                            if (!rxjxtGetToggle()) { this._rxjxtIsGrinding = false; return; } 
                            const res = await api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: sKey, terminal: false}});
                            const prog = res?.body?.progress?.PLAY_ACTIVITY?.value ?? rxjxtDone;
                            rxjxtUpdateUI(rxjxtQName, prog, rxjxtTarget, "Syncing");
                            await new Promise(r => setTimeout(r, 20000));
                            if(prog >= rxjxtTarget) {
                                if (rxjxtGetToggle()) await api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: sKey, terminal: true}});
                                break;
                            }
                        }
                        rxjxtFinish();
                    }
                    fn();
                }
            };
            rxjxtCheckAndStart();
        } catch (err) {
            this._rxjxtIsGrinding = false; rxjxtLog('QUEST', "SYSTEM INITIALIZING...", "warn");
            // Auto-retry if stores haven't loaded yet
            setTimeout(() => { if(rxjxtGetToggle()) this.start(rxjxtLog, rxjxtUpdateUI, rxjxtGetToggle, rxjxtGetMode, rxjxtApiCore); }, 5000);
        }
    },
    stop: function() {
        this._rxjxtIsGrinding = false;
        if(this._rxjxtWatcher) clearInterval(this._rxjxtWatcher);
    }
};
