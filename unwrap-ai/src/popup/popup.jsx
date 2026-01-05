// Toolbar Popup for Unwrap AI - Swedish minimal design
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Icons } from '../components/Icons';
import './popup.css';

function Popup() {
    const [stats, setStats] = useState({
        sitesShown: 0,
        moneySaved: 0,
        promptsCopied: 0
    });
    const [siteCount, setSiteCount] = useState(0);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [fetchError, setFetchError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        const { stats: savedStats } = await chrome.storage.local.get('stats');
        if (savedStats) {
            setStats(savedStats);
        }

        const { sites, lastUpdated: updated, fetchError: error } = await chrome.storage.local.get(['sites', 'lastUpdated', 'fetchError']);
        if (sites) {
            setSiteCount(Object.keys(sites).length);
        }
        if (updated) {
            setLastUpdated(new Date(updated));
        }
        if (error) {
            setFetchError(error);
        }
    }

    const formatMoney = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (date) => {
        if (!date) return 'Never';
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="popup">
            <header className="popup-header">
                <div className="popup-logo">
                    <Icons.Unwrap />
                    <h1 className="popup-title">Unwrap AI</h1>
                </div>
                <span className="popup-version">v1.0</span>
            </header>

            <p className="popup-tagline">Discover free alternatives to AI tools</p>

            {fetchError && (
                <div className="popup-error">
                    <Icons.Alert />
                    <span>{fetchError.message}</span>
                </div>
            )}

            <div className="stats-grid">
                <div className="stat-card stat-primary">
                    <div className="stat-icon">
                        <Icons.Savings />
                    </div>
                    <div className="stat-content">
                        <div className="stat-value">{formatMoney(stats.moneySaved)}</div>
                        <div className="stat-label">Saved</div>
                    </div>
                </div>

                <div className="stat-row">
                    <div className="stat-card stat-small">
                        <div className="stat-icon">
                            <Icons.Shield />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.sitesShown}</div>
                            <div className="stat-label">Sites shown</div>
                        </div>
                    </div>
                    <div className="stat-card stat-small">
                        <div className="stat-icon">
                            <Icons.Document />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{stats.promptsCopied}</div>
                            <div className="stat-label">Copied</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="popup-info">
                <div className="info-row">
                    <span className="info-label">
                        <Icons.Database />
                        Database
                    </span>
                    <span className="info-value">{siteCount} sites</span>
                </div>
                <div className="info-row">
                    <span className="info-label">
                        <Icons.Refresh />
                        Updated
                    </span>
                    <span className="info-value">{formatDate(lastUpdated)}</span>
                </div>
            </div>

            <div className="popup-actions">
                <button
                    className="popup-btn"
                    onClick={() => chrome.tabs.create({ url: 'https://github.com/xcqtnr/unwrap-ai-db' })}
                >
                    <Icons.Book />
                    View database
                </button>
                <button
                    className="popup-btn popup-btn-outline"
                    onClick={() => chrome.tabs.create({ url: 'https://github.com/xcqtnr/unwrap-ai-db/issues/new?template=suggest-site.yml' })}
                >
                    <Icons.Flag />
                    Suggest a site
                </button>
            </div>

            <footer className="popup-footer">
                <a href="https://github.com/xcqtnr/unwrap-ai" target="_blank" rel="noopener noreferrer">
                    Open Source
                </a>
            </footer>
        </div>
    );
}

const container = document.getElementById('popup-root');
const root = createRoot(container);
root.render(<Popup />);
