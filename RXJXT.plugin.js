/**
 * @name RXJXTQuestEngine
 * @description Core Quest Automation Engine for Liquid Hub
 * @version 13.1.1
 */

window.rxjxtQuestEngine = (() => {
    let isRunning = false;
    let originalRunningGames = null;
    let originalGameForPID = null;
    let originalStreamMetadata = null;
    let fluxDispatcherRef = null;
    let currentListener = null;

    return {
        start: async (log, updateUI, isEnabled, getMode, apiCore) => {
            if (isRunning) return;
            isRunning = true;
            log('ENGINE', 'Injecting updated Webpack bypass...', 'info');

            try {
                // --- DISCORD WEBPACK EXTRACTION ---
                delete window.$;
                let wpRequire = window.webpackChunkdiscord_app.push([[Symbol()], {}, r => r]);
                window.webpackChunkdiscord_app.pop();

                const getMod = (filter) => Object.values(wpRequire.c).find(x => filter(x));

                let ApplicationStreamingStore = getMod(x => x?.exports?.A?.__proto__?.getStreamerActiveStreamMetadata)?.exports?.A;
                let RunningGameStore = getMod(x => x?.exports?.Ay?.getRunningGames)?.exports?.Ay;
                let QuestsStore = getMod(x => x?.exports?.A?.__proto__?.getQuest)?.exports?.A;
                let ChannelStore = getMod(x => x?.exports?.A?.__proto__?.getAllThreadsForParent)?.exports?.A;
                let GuildChannelStore = getMod(x => x?.exports?.Ay?.getSFWDefaultChannel)?.exports?.Ay;
                let FluxDispatcher = getMod(x => x?.exports?.h?.__proto__?.flushWaitQueue)?.exports?.h;
                let api = getMod(x => x?.exports?.Bo?.get)?.exports?.Bo;

                fluxDispatcherRef = FluxDispatcher; // Store for cleanup

                if (!QuestsStore || !FluxDispatcher) {
                    log('ERROR', 'Discord modules not found. Discord might have updated.', 'error');
                    apiCore.disableToggle();
                    return;
                }

                const supportedTasks = ["WATCH_VIDEO", "PLAY_ON_DESKTOP", "STREAM_ON_DESKTOP", "PLAY_ACTIVITY", "WATCH_VIDEO_ON_MOBILE"];
                let quests = [...QuestsStore.quests.values()].filter(x => 
                    x.userStatus?.enrolledAt && 
                    !x.userStatus?.completedAt && 
                    new Date(x.config.expiresAt).getTime() > Date.now() && 
                    supportedTasks.find(y => Object.keys((x.config.taskConfig ?? x.config.taskConfigV2).tasks).includes(y))
                );

                let isApp = typeof DiscordNative !== "undefined";

                if (quests.length === 0) {
                    log('QUEST', "No uncompleted quests found!", 'warn');
                    apiCore.disableToggle();
                    updateUI("None", 0, 100, "Idle");
                    return;
                }

                // Recursive function mapped to UI controls
                const doJob = async () => {
                    if (!isRunning || !isEnabled()) return;

                    const quest = quests.pop();
                    if (!quest) {
                        log('QUEST', "All available quests completed!", 'success');
                        apiCore.disableToggle();
                        updateUI("Complete", 0, 100, "Done");
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

                    apiCore.setQuestName(questName);
                    updateUI(questName, secondsDone, secondsNeeded, "Active");
                    log('QUEST', `Target Locked: ${questName} [${taskName}]`, 'info');

                    // --- TASK: WATCH VIDEO ---
                    if (taskName === "WATCH_VIDEO" || taskName === "WATCH_VIDEO_ON_MOBILE") {
                        const speed = 7;
                        let completed = false;

                        const watchLoop = async () => {
                            log('SPOOF', `Spoofing video data for ${questName}...`, 'brand');
                            while (isRunning && isEnabled()) {
                                const remaining = Math.min(speed, secondsNeeded - secondsDone);
                                await new Promise(resolve => setTimeout(resolve, remaining * 1000));
                                if (!isRunning || !isEnabled()) break;

                                const timestamp = secondsDone + speed;
                                try {
                                    const res = await api.post({url: `/quests/${quest.id}/video-progress`, body: {timestamp: Math.min(secondsNeeded, timestamp + Math.random())}});
                                    completed = res.body.completed_at != null;
                                    secondsDone = Math.min(secondsNeeded, timestamp);
                                    updateUI(questName, secondsDone, secondsNeeded, "Watching");
                                } catch (e) {
                                    log('ERROR', 'Video progress API limit/error.', 'error');
                                }

                                if (timestamp >= secondsNeeded) break;
                            }

                            if (!completed && isRunning && isEnabled()) {
                                await api.post({url: `/quests/${quest.id}/video-progress`, body: {timestamp: secondsNeeded}});
                            }
                            if (isRunning && isEnabled()) {
                                log('QUEST', `Completed: ${questName}`, 'success');
                                doJob();
                            }
                        };
                        watchLoop();
                    } 
                    
                    // --- TASK: PLAY ON DESKTOP ---
                    else if (taskName === "PLAY_ON_DESKTOP") {
                        if (!isApp) {
                            log('WARN', `Use Discord Desktop App for ${questName}.`, 'warn');
                            doJob();
                        } else {
                            api.get({url: `/applications/public?application_ids=${applicationId}`}).then(res => {
                                if (!isRunning || !isEnabled()) return;
                                
                                const appData = res.body[0];
                                const exeName = appData.executables?.find(x => x.os === "win32")?.name?.replace(">","") ?? appData.name.replace(/[\/\\:*?"<>|]/g, "");
                                
                                const fakeGame = {
                                    cmdLine: `C:\\Program Files\\${appData.name}\\${exeName}`, exeName,
                                    exePath: `c:/program files/${appData.name.toLowerCase()}/${exeName}`,
                                    hidden: false, isLauncher: false, id: applicationId, name: appData.name, pid: pid, pidPath: [pid], processName: appData.name, start: Date.now(),
                                };
                                
                                originalRunningGames = RunningGameStore.getRunningGames;
                                originalGameForPID = RunningGameStore.getGameForPID;
                                const fakeGames = [fakeGame];
                                
                                RunningGameStore.getRunningGames = () => fakeGames;
                                RunningGameStore.getGameForPID = (p) => fakeGames.find(x => x.pid === p);
                                FluxDispatcher.dispatch({type: "RUNNING_GAMES_CHANGE", removed: originalRunningGames(), added: [fakeGame], games: fakeGames});
                                
                                log('SPOOF', `Spoofed Playing: ${appData.name}`, 'brand');
                                
                                currentListener = data => {
                                    let progress = quest.config.configVersion === 1 ? data.userStatus.streamProgressSeconds : Math.floor(data.userStatus.progress.PLAY_ON_DESKTOP.value);
                                    updateUI(questName, progress, secondsNeeded, "Playing");
                                    
                                    if (progress >= secondsNeeded) {
                                        log('QUEST', `Completed: ${questName}`, 'success');
                                        
                                        // Cleanup
                                        RunningGameStore.getRunningGames = originalRunningGames;
                                        RunningGameStore.getGameForPID = originalGameForPID;
                                        FluxDispatcher.dispatch({type: "RUNNING_GAMES_CHANGE", removed: [fakeGame], added: [], games: []});
                                        FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", currentListener);
                                        currentListener = null;
                                        
                                        doJob();
                                    }
                                };
                                FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", currentListener);
                            });
                        }
                    } 
                    
                    // --- TASK: STREAM ON DESKTOP ---
                    else if (taskName === "STREAM_ON_DESKTOP") {
                        if (!isApp) {
                            log('WARN', `Use Discord Desktop App for ${questName}.`, 'warn');
                            doJob();
                        } else {
                            originalStreamMetadata = ApplicationStreamingStore.getStreamerActiveStreamMetadata;
                            ApplicationStreamingStore.getStreamerActiveStreamMetadata = () => ({id: applicationId, pid, sourceName: null});
                            
                            log('SPOOF', `Stream Spoofed. You MUST join a VC with 1+ person!`, 'brand');
                            updateUI(questName, secondsDone, secondsNeeded, "Waiting for VC");
                            
                            currentListener = data => {
                                let progress = quest.config.configVersion === 1 ? data.userStatus.streamProgressSeconds : Math.floor(data.userStatus.progress.STREAM_ON_DESKTOP.value);
                                updateUI(questName, progress, secondsNeeded, "Streaming");
                                
                                if (progress >= secondsNeeded) {
                                    log('QUEST', `Completed: ${questName}`, 'success');
                                    
                                    ApplicationStreamingStore.getStreamerActiveStreamMetadata = originalStreamMetadata;
                                    FluxDispatcher.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", currentListener);
                                    currentListener = null;
                                    
                                    doJob();
                                }
                            };
                            FluxDispatcher.subscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", currentListener);
                        }
                    } 
                    
                    // --- TASK: PLAY ACTIVITY ---
                    else if (taskName === "PLAY_ACTIVITY") {
                        const channelId = ChannelStore.getSortedPrivateChannels()[0]?.id ?? Object.values(GuildChannelStore.getAllGuilds()).find(x => x != null && x.VOCAL.length > 0).VOCAL[0].channel.id;
                        const streamKey = `call:${channelId}:1`;
                        
                        log('SPOOF', `Activity Spoofed. Connecting to heartbeat...`, 'brand');
                        const activityLoop = async () => {
                            while (isRunning && isEnabled()) {
                                try {
                                    const res = await api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: streamKey, terminal: false}});
                                    const progress = res.body.progress.PLAY_ACTIVITY.value;
                                    updateUI(questName, progress, secondsNeeded, "In Activity");
                                    
                                    if (progress >= secondsNeeded) {
                                        await api.post({url: `/quests/${quest.id}/heartbeat`, body: {stream_key: streamKey, terminal: true}});
                                        log('QUEST', `Completed: ${questName}`, 'success');
                                        doJob();
                                        break;
                                    }
                                } catch(e) { log('ERROR', 'Activity heartbeat failed.', 'error'); }
                                
                                await new Promise(resolve => setTimeout(resolve, 20 * 1000));
                            }
                        };
                        activityLoop();
                    }
                };

                // Init first quest loop
                doJob();

            } catch (err) {
                log('ERROR', 'Quest Engine Initialization Failed', 'error');
                apiCore.disableToggle();
            }
        },

        stop: () => {
            isRunning = false;
            try {
                if (fluxDispatcherRef && currentListener) {
                    fluxDispatcherRef.unsubscribe("QUESTS_SEND_HEARTBEAT_SUCCESS", currentListener);
                    currentListener = null;
                }
            } catch(e) {}
        }
    };
})();
