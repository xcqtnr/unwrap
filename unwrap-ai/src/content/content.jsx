// Content Script for Unwrap AI
// PURPOSE: Check if current site is a wrapper and inject the React popup

import React from 'react';
import { createRoot } from 'react-dom/client';
import UnwrapAlert from './UnwrapAlert';
import './content.css';

async function checkSite() {
    // Get current domain (strip www. prefix)
    const currentDomain = window.location.hostname.replace(/^www\./, '');

    // Fetch cached database from local storage
    const { sites } = await chrome.storage.local.get('sites');

    if (!sites || Object.keys(sites).length === 0) {
        console.log('[Unwrap AI] No sites in database yet');
        return;
    }

    // Check for exact domain match or subdomain match
    let matchedDomain = null;
    let matchedData = null;

    // First try exact match
    if (sites[currentDomain]) {
        matchedDomain = currentDomain;
        matchedData = sites[currentDomain];
    } else {
        // Try subdomain matching (e.g., app.chatpdf.com matches chatpdf.com)
        for (const domain of Object.keys(sites)) {
            if (currentDomain.endsWith('.' + domain)) {
                matchedDomain = domain;
                matchedData = sites[domain];
                break;
            }
        }
    }

    if (matchedData) {
        console.log(`[Unwrap AI] Site recognized: ${matchedData.name}`);

        // Check if already injected
        if (document.getElementById('unwrap-ai-root')) {
            return;
        }

        // Create container for React app
        const container = document.createElement('div');
        container.id = 'unwrap-ai-root';
        document.body.appendChild(container);

        // Mount React component with domain included in data
        const root = createRoot(container);
        root.render(<UnwrapAlert wrapper={{ domain: matchedDomain, ...matchedData }} />);

        // Update stats
        chrome.runtime.sendMessage({
            type: 'UPDATE_STATS',
            stat: 'sitesShown',
            value: 1
        });
    }
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkSite);
} else {
    checkSite();
}
