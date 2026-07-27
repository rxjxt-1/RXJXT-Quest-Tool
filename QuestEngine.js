/**
 * @name RXJXT-Quest-Engine
 * @version 1.1.0
 */
window.rxjxtQuestEngine = {
    _rxjxtIsGrinding: false,
    _rxjxtWatcher: null,
    
    start: async function(rxjxtLog, rxjxtUpdateUI, rxjxtGetToggle, rxjxtGetMode, rxjxtApiCore) {
        // RXJXT ANTI-TAMPER CHECK
        if (!String(this.start).includes("rxjxt") || !window.rxjxtEngineRunning) { 
            window.rxjxtQuestEngine = null; 
            throw new Error("RXJXT_CORRUPTED"); 
        }

        try {
            // New Webpack Extraction from your updated code
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

            const rxjxtCheckAndStart = () => {
                if (!rxjxtGetToggle() || this._rxjxtIsGrinding) return;
                if (!QuestsStore) { rxjxtLog('QUEST', "Discord Core Not Ready", "warn"); return; }

                let quests = [...QuestsStore.quests.values()].filter(x => x.userStatus?.enrolledAt && !x.userStatus?.completedAt && new Date(x.config.expiresAt).getTime() > Date.now() && supportedTasks.find(y => Object.keys((x.config.taskConfig ?? x.config.taskConfigV2).tasks).includes(y)));
                let isApp = typeof DiscordNative !== "undefined";

                if (quests.length === 0) {
                    rxjxtLog('QUEST', "You don't have any uncompleted quests!", "warn");
                    rxjxtUpdateUI("Finished", 100, 100, "Idle");
                    return;
                }

                this._rxjxtIsGrinding = true;
                doJob(quests, isApp);
            };

            const doJob = (questList, isApp) => {
                if (!rxjxtGetToggle()) { this._rxjxtIsGrinding = false; return; }

                const quest = questList.pop();
                if (!quest) {
                    this._rxjxtIsGrinding = false; 
                    rxjxtCheckAndStart(); 
                    return; 
                }

                const pid = Math.floor(Math.random() * 30000) + 1000;
                const questName = quest.config.messages.questName;
                const taskConfig = quest.config.taskConfig ?? quest.config.taskConfigV2;
                const taskName = supportedTasks.find(x => taskConfig.tasks[x] != null);
                const taskData = taskConfig.tasks[taskName];
                const applicationId = quest.config.application?.id ?? taskData.applications[0].id;
                const secondsNeeded = taskData.target;
                let secondsDone = quest.userStatus?.progress?.[taskName]?.value ?? 0;

                rxjxtApiCore.setQuestName(questName);
                rxjxtUpdateUI(questName, secondsDone, secondsNeeded, "Grinding");

                const rxjxtFinish = async () => {
                    rxjxtLog('QUEST', `Quest completed: ${questName}`, "success");
                    rxjxtUpdateUI(questName, secondsNeeded, secondsNeeded, "Complete");
                    await new Promise(r => setTimeout(r, 2500)); 
                    doJob(questList, isApp);
                };

                if (taskName === "WATCH_VIDEO" || taskName === "WATCH_VIDEO_ON_MOBILE") {
                    const speed = 7;
                    let completed = false;
                    rxjxtLog('QUEST', `Spoofing video for ${questName}.`, "info");

                    let fn = async () => {          
                        while (true) {
                            if (!rxjxtGetToggle()) { this._rxjxtIsGrinding = false; return; }
                            const remaining = Math.min(speed, secondsNeeded - secondsDone);
                            await new Promise(resolve => setTimeout(resolve, remaining * 1000));

                            const timestamp = secondsDone + speed;
                            const res = await api.post({url: `/quests/${quest.id}/video-progress`, body: {timestamp: Math.min(secondsNeeded, timestamp + Math.random())}});
                            completed = res.body.completed_at != null;
                            secondsDone = Math.min(secondsNeeded, timestamp);
                            
                            rxjxtUpdateUI(questName, secondsDone, secondsNeeded, "Grinding");

                            if (timestamp >= secondsNeeded) break;
                        }
                        if (!completed && rxjxtGetToggle()) {
                            await api.post({url: `/quests/${quest.id}/video-progress`, body: {timestamp: secondsNeeded}});
                        }
                        rxjxtFinish();
                    }
                    fn();
                } else if (taskName === "PLAY_ON_DESKTOP") {
                    if (!isApp) {
                        rxjxtLog('QUEST', `Use desktop app for ${questName}!`, "error");
                        rxjxtFinish(); 
                    } else {
                        api.get({url: `/applications/public?application_ids=${applicationId}`}).then(res => {
                            const appData = res.body[0];
                            const exeName = appData.executables?.find(x => x.os === "win32")?.name?.replace(">","") ?? appData.name.replace(/[\/\\:*?"<>|]/g, "");
                            
                            const fakeGame = {
                                cmdLine: `C:\\Program Files\\${appData.name}\\${exeName}`,
                                exeName,
                                exePath: `c:/program files/${appData.name.toLowerCase()}/${exeName}`,
                                hidden: false,
                                isLauncher: false,
                                id: applicationId,
                                name: appData.name,
                                pid: pid,
                                pidPath: [pid],
                                processName: appData.name,
                                start: Date.now(),
                            };
                            
                            const realGames = RunningGameStore.getRunningGames();
                            const fakeGames = [fakeGame];
                            const realGetRunningGames = RunningGameStore.getRunningGames;
                            const realGetGameForPID = RunningGameStore.getGameForPID;
                            
                            RunningGameStore.getRunningGames = () => fakeGames;
                            RunningGameStore.getGameForPID = (p) => fakeGames.find(x => x.pid === p);
                            FluxDispatcher.dispatch({type: "RUNNING_GAMES_CHANGE", removed: realGames, added: [fakeGame], games: fakeGames});
                            
                            let fn = data => {
                                if (!rxjxtGetToggle()) {
                                    FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                                    RunningGameStore.getRunningGames = realGetRunningGames;
                                    RunningGameStore.getGameForPID = realGetGameForPID;
                                    FluxDispatcher.dispatch({type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: [], games: []});
                                    this._rxjxtIsGrinding = false; return;
                                }

                                let progress = quest.config.configVersion === 1 ? data.userStatus.streamProgressSeconds : Math.floor(data.userStatus.progress.PLAY_ON_DESKTOP.value);
                                rxjxtUpdateUI(questName, progress, secondsNeeded, "Grinding");
                                
                                if (progress >= secondsNeeded) {
                                    RunningGameStore.getRunningGames = realGetRunningGames;
                                    RunningGameStore.getGameForPID = realGetGameForPID;
                                    FluxDispatcher.dispatch({type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: [], games: []});
                                    FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                                    rxjxtFinish();
                                }
                            };
                            FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                            rxjxtLog('QUEST', `Spoofed ${appData.name}. Wait ${Math.ceil((secondsNeeded - secondsDone) / 60)} mins.`, "info");
                        });
                    }
                } else if (taskName === "STREAM_ON_DESKTOP") {
                    if (!isApp) {
                        rxjxtLog('QUEST', `Use desktop app for ${questName}!`, "error");
                        rxjxtFinish();
                    } else {
                        let realFunc = ApplicationStreamingStore.getStreamerActiveStreamMetadata;
                        ApplicationStreamingStore.getStreamerActiveStreamMetadata = () => ({ id: applicationId, pid, sourceName: null });
                        
                        let fn = data => {
                            if (!rxjxtGetToggle()) {
                                ApplicationStreamingStore.getStreamerActiveStreamMetadata = realFunc;
                                FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                                this._rxjxtIsGrinding = false; return;
                            }

                            let progress = quest.config.configVersion === 1 ? data.userStatus.streamProgressSeconds : Math.floor(data.userStatus.progress.STREAM_ON_DESKTOP.value);
                            rxjxtUpdateUI(questName, progress, secondsNeeded, "Streaming");
                            
                            if (progress >= secondsNeeded) {
                                ApplicationStreamingStore.getStreamerActiveStreamMetadata = realFunc;
                                FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                                rxjxtFinish();
                            }
                        };
                        FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                        rxjxtLog('QUEST', `Spoofed stream. VC requires 1+ person. Wait ${Math.ceil((secondsNeeded - secondsDone) / 60)} mins.`, "info");
                    }
                } else if (taskName === "PLAY_ACTIVITY") {
                    const channelId = ChannelStore.getSortedPrivateChannels()[0]?.id ?? Object.values(GuildChannelStore.getAllGuilds()).find(x => x != null && x.VOCAL.length > 0).VOCAL[0].channel.id;
                    const streamKey = `call:${channelId}:1`;
                    
                    let fn = async () => {
                        rxjxtLog('QUEST', `Completing activity: ${questName}`, "info");
                        
                        while (true) {
                            if (!rxjxtGetToggle()) { this._rxjxtIsGrinding = false; return; }
                            const res = await api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: streamKey, terminal: false}});
                            const progress = res.body.progress.PLAY_ACTIVITY.value;
                            
                            rxjxtUpdateUI(questName, progress, secondsNeeded, "Syncing");
                            await new Promise(resolve => setTimeout(resolve, 20 * 1000));
                            
                            if (progress >= secondsNeeded) {
                                if (rxjxtGetToggle()) await api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: streamKey, terminal: true}});
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
            this._rxjxtIsGrinding = false; 
            rxjxtLog('QUEST', "SYSTEM INITIALIZING... ERROR: " + err.message, "warn");
        }
    },
    stop: function() {
        this._rxjxtIsGrinding = false;
        if(this._rxjxtWatcher) clearInterval(this._rxjxtWatcher);
    }
};
