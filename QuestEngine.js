/**
 * @name RXJXT-Quest-Engine
 * @version 1.0.0
 * @description Cloud Module for Quest Grinding
 */
window.rxjxtQuestEngine = {
    isGrinding: false,
    watcher: null,
    
    start: async function(log, updateUI, getToggleState, getMode, apiCore) {
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
                if (!getToggleState()) return;
                if (this.isGrinding) return;
                if (!QuestsStore) { log('QUEST', "Discord Core Not Ready", "warn"); return; }

                const allQuests = [...QuestsStore.quests.values()].filter(x => new Date(x.config.expiresAt).getTime() > Date.now() && supportedTasks.find(y => Object.keys((x.config.taskConfig ?? x.config.taskConfigV2).tasks).includes(y)));
                let unacceptedQuests = allQuests.filter(x => !x.userStatus?.enrolledAt && !x.userStatus?.completedAt);
                let acceptedQuests = allQuests.filter(x => x.userStatus?.enrolledAt && !x.userStatus?.completedAt);

                if (acceptedQuests.length > 0) {
                    if (this.watcher) { clearInterval(this.watcher); this.watcher = null; }
                    apiCore.hidePopup();
                    
                    let nextQuestToGrind = null;
                    if (getMode() === 'RAGE') {
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
                                updateUI("Paused", 0, 100, "Action");
                                apiCore.showPopup(
                                    "Confirm", "Only video quests remain. Auto-grind them?", 
                                    "Confirm", () => { window.rxjxtVideoApproval = true; checkAndStart(); }, 
                                    "Cancel", () => { apiCore.disableToggle(); log('QUEST', "Cancelled.", "warn"); updateUI("Idle", 0, 100, "Idle"); }
                                );
                                return; 
                            } else { nextQuestToGrind = videoQuests.pop(); }
                        }
                    }

                    if (nextQuestToGrind) {
                        this.isGrinding = true;
                        log('QUEST', `Grinding started.`, "success");
                        doJob([nextQuestToGrind], api, RunningGameStore, FluxDispatcher, ApplicationStreamingStore, ChannelStore, GuildChannelStore);
                    }
                } 
                else if (unacceptedQuests.length > 0) {
                    updateUI("Action Required", 0, 100, "Idle");
                    apiCore.showPopup("Info", "Accept quests in Discord first.", "Retry", () => checkAndStart());
                    if (!this.watcher) this.watcher = setInterval(() => { if (!this.isGrinding && getToggleState()) checkAndStart(); }, 3000);
                } else {
                    log('QUEST', "No quests found.", "error");
                    apiCore.showPopup("Status", "All quests completed or unavailable.", "Refresh", () => checkAndStart());
                }
            };

            const doJob = async (questsArray, api, RunningGameStore, FluxDispatcher, ApplicationStreamingStore, ChannelStore, GuildChannelStore) => {
                const quest = questsArray.pop();
                if(!quest) { this.isGrinding = false; checkAndStart(); return; }

                const pid = Math.floor(Math.random() * 30000) + 1000;
                const applicationId = quest.config.application.id;
                const questName = quest.config.messages.questName;
                const taskConfig = quest.config.taskConfig ?? quest.config.taskConfigV2;
                const taskName = supportedTasks.find(x => taskConfig.tasks[x] != null);
                const secondsNeeded = taskConfig.tasks[taskName].target;
                let secondsDone = quest.userStatus?.progress?.[taskName]?.value ?? 0;

                apiCore.setQuestName(questName);
                updateUI(questName, secondsDone, secondsNeeded, "Grinding");

                const finishQuest = async () => {
                    log('QUEST', `Done: ${questName}`, "finish");
                    updateUI(questName, secondsNeeded, secondsNeeded, "Complete");
                    await new Promise(r => setTimeout(r, 2500)); 
                    this.isGrinding = false; checkAndStart();
                };

                if(taskName === "WATCH_VIDEO" || taskName === "WATCH_VIDEO_ON_MOBILE") {
                    const speed = 7; let completed = false;
                    let fn = async () => {
                        while(true) {
                            if (!getToggleState()) { this.isGrinding = false; return; } 
                            const remaining = Math.min(speed, secondsNeeded - secondsDone);
                            await new Promise(resolve => setTimeout(resolve, remaining * 1000));
                            const timestamp = secondsDone + speed;
                            const res = await api.post({url: `/quests/${quest.id}/video-progress`, body: {timestamp: Math.min(secondsNeeded, timestamp + Math.random())}});
                            completed = res.body.completed_at != null;
                            secondsDone = Math.min(secondsNeeded, timestamp);
                            updateUI(questName, secondsDone, secondsNeeded, "Grinding");
                            if(timestamp >= secondsNeeded) break;
                        }
                        if(!completed && getToggleState()) await api.post({url: `/quests/${quest.id}/video-progress`, body: {timestamp: secondsNeeded}});
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

                        let fn = data => {
                            if (!getToggleState()) { 
                                FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                                RunningGameStore.getRunningGames = realGetRunningGames; RunningGameStore.getGameForPID = realGetGameForPID;
                                FluxDispatcher.dispatch({type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: [], games: []});
                                this.isGrinding = false; return;
                            }
                            let progress = quest.config.configVersion === 1 ? data.userStatus.streamProgressSeconds : Math.floor(data.userStatus.progress.PLAY_ON_DESKTOP.value);
                            updateUI(questName, progress, secondsNeeded, "Grinding");
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
                    let fn = data => {
                        if (!getToggleState()) { 
                            FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", fn);
                            ApplicationStreamingStore.getStreamerActiveStreamMetadata = realFunc;
                            this.isGrinding = false; return;
                        }
                        let progress = quest.config.configVersion === 1 ? data.userStatus.streamProgressSeconds : Math.floor(data.userStatus.progress.STREAM_ON_DESKTOP.value);
                        updateUI(questName, progress, secondsNeeded, "Streaming");
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
                        while(true) {
                            if (!getToggleState()) { this.isGrinding = false; return; } 
                            const res = await api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: streamKey, terminal: false}});
                            const progress = res.body.progress.PLAY_ACTIVITY.value;
                            updateUI(questName, progress, secondsNeeded, "Syncing");
                            await new Promise(resolve => setTimeout(resolve, 20 * 1000));
                            if(progress >= secondsNeeded) {
                                if (getToggleState()) await api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: streamKey, terminal: true}});
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
            this.isGrinding = false; log('QUEST', "SYSTEM INITIALIZING...", "warn");
        }
    },
    stop: function() {
        this.isGrinding = false;
        if(this.watcher) clearInterval(this.watcher);
    }
};
