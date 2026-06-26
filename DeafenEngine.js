/**
 * @name RXJXT-Deafen-Engine
 * @version 1.0.3
 */
window.rxjxtDeafenEngine = {
    start: async function(rxjxtLog, rxjxtUIUpdate) {
        // RXJXT ANTI-TAMPER CHECK
        if (!String(this.start).includes("rxjxt")) { window.rxjxtDeafenEngine = null; throw new Error("RXJXT_CORRUPTED"); }

        window.rxjxtDeafenActive = false;
        if (!window.rxjxtOriginalWS) {
            window.rxjxtOriginalWS = window.WebSocket.prototype.send;
            window.WebSocket.prototype.send = function(rxjxtData) {
                if (window.rxjxtDeafenActive && Object.prototype.toString.call(rxjxtData) === "[object ArrayBuffer]") {
                    let rxjxtDec = new TextDecoder("utf-8");
                    if (rxjxtDec.decode(rxjxtData).includes("self_deaf")) {
                        rxjxtLog('DEAFEN', "Packet Dropped (RXJXT Exploit Active!)", "success");
                        rxjxtData = rxjxtData.replace('"self_mute":false', 'NiceOneDiscord'); 
                    }
                }
                return window.rxjxtOriginalWS.apply(this, arguments);
            };
        }

        const rxjxtTog = () => {
            let b = document.querySelector('[aria-label="Deafen"], [aria-label="Undeafen"]');
            if (b) b.click();
        };

        rxjxtLog('DEAFEN', "Automating Fake Deafen...", "brand");
        if (!document.querySelector('[aria-label="Undeafen"]')) { 
            rxjxtTog(); await new Promise(r => setTimeout(r, 600)); 
        }

        window.rxjxtDeafenActive = true;
        rxjxtTog();
        rxjxtUIUpdate("Active", "#FF453A", true);
    },
    
    stop: async function(rxjxtLog, rxjxtUIUpdate) {
        rxjxtLog('DEAFEN', "Restoring normal connection...", "warn");
        window.rxjxtDeafenActive = false;
        
        const rxjxtTog = () => {
            let b = document.querySelector('[aria-label="Deafen"], [aria-label="Undeafen"]');
            if (b) b.click();
        };

        if (!document.querySelector('[aria-label="Undeafen"]')) {
            rxjxtTog(); await new Promise(r => setTimeout(r, 600)); rxjxtTog(); 
        }
        rxjxtUIUpdate("Inactive", "#43b581", false);
    }
};
