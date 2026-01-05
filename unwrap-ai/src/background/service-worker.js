// Background Service Worker for Unwrap AI
// PURPOSE: Fetch the latest wrapper database daily and cache it locally

const DATABASE_URL = 'https://xcqtnr.github.io/unwrap-ai-db/database.json';

// Initialize on install
chrome.runtime.onInstalled.addListener(async () => {
    console.log('[Unwrap AI] Extension installed, setting up...');

    // Set up daily alarm (every 24 hours)
    chrome.alarms.create('dailyUpdate', { periodInMinutes: 1440 });

    // Initial fetch
    await fetchDatabase();

    // Initialize stats
    const { stats } = await chrome.storage.local.get('stats');
    if (!stats) {
        await chrome.storage.local.set({
            stats: {
                sitesShown: 0,
                moneySaved: 0,
                promptsCopied: 0
            }
        });
    }
});

// Listen for daily alarm
chrome.alarms.onAlarm.addListener(async (alarm) => {
    if (alarm.name === 'dailyUpdate') {
        console.log('[Unwrap AI] Daily update triggered');
        await fetchDatabase();
    }
});

// Fetch and cache the site list
async function fetchDatabase() {
    try {
        const response = await fetch(DATABASE_URL);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        // Store sites object (domain-keyed) directly
        await chrome.storage.local.set({
            sites: data.sites,
            lastUpdated: new Date().toISOString(),
            databaseVersion: data.version,
            fetchError: null // Clear any previous error
        });

        const siteCount = Object.keys(data.sites).length;
        console.log(`[Unwrap AI] Database updated: ${siteCount} sites loaded`);
    } catch (error) {
        console.error('[Unwrap AI] Failed to fetch database:', error);

        // Store error state for UI feedback
        await chrome.storage.local.set({
            fetchError: {
                message: 'Unable to load database',
                timestamp: new Date().toISOString()
            }
        });
    }
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'UPDATE_STATS') {
        updateStats(message.stat, message.value);
    }
    if (message.type === 'GET_STATS') {
        chrome.storage.local.get('stats').then(({ stats }) => {
            sendResponse(stats);
        });
        return true; // Keep channel open for async response
    }
});

async function updateStats(stat, value) {
    const { stats } = await chrome.storage.local.get('stats');
    if (stats) {
        stats[stat] = (stats[stat] || 0) + value;
        await chrome.storage.local.set({ stats });
    }
}
