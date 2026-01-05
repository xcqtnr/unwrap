// UnwrapAlert Component - Toast-first UX with new schema
import React, { useState } from 'react';
import { Icons } from '../components/Icons';

export default function UnwrapAlert({ wrapper }) {
    const [dismissed, setDismissed] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyPrompt = async () => {
        try {
            await navigator.clipboard.writeText(wrapper.system_prompt);
            setCopied(true);

            chrome.runtime.sendMessage({
                type: 'UPDATE_STATS',
                stat: 'promptsCopied',
                value: 1
            });

            // Use savings_monthly for stats
            if (wrapper.savings_monthly) {
                chrome.runtime.sendMessage({
                    type: 'UPDATE_STATS',
                    stat: 'moneySaved',
                    value: wrapper.savings_monthly
                });
            }

            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('[Unwrap AI] Failed to copy:', err);
        }
    };

    const goToAlternative = () => {
        window.open(wrapper.alternative_url, '_blank');
    };

    if (dismissed) return null;

    // Compact Toast View (Top Right)
    if (!expanded) {
        return (
            <div className="unwrap-toast">
                <div className="unwrap-toast-content" onClick={() => setExpanded(true)}>
                    <div className="unwrap-toast-icon">
                        <Icons.Lightbulb />
                    </div>
                    <div className="unwrap-toast-text">
                        <div className="unwrap-toast-title">
                            Free alternative available
                        </div>
                        <div className="unwrap-toast-subtitle">
                            {wrapper.name} · {wrapper.price_text}
                        </div>
                    </div>
                    <div className="unwrap-toast-action">
                        <Icons.ArrowRight />
                    </div>
                </div>
                <button
                    className="unwrap-toast-close"
                    onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
                >
                    <Icons.Close />
                </button>
            </div>
        );
    }

    // Full Modal View
    return (
        <div className="unwrap-overlay" onClick={() => setExpanded(false)}>
            <div className="unwrap-alert" onClick={(e) => e.stopPropagation()}>
                <div className="unwrap-header">
                    <div className="unwrap-logo">
                        <Icons.Unwrap />
                        <span className="unwrap-title">Unwrap AI</span>
                    </div>
                    <div className="unwrap-controls">
                        <button
                            className="unwrap-btn-icon"
                            onClick={() => setExpanded(false)}
                            title="Minimize"
                        >
                            <Icons.Minimize />
                        </button>
                        <button
                            className="unwrap-btn-icon"
                            onClick={() => setDismissed(true)}
                            title="Dismiss"
                        >
                            <Icons.Close />
                        </button>
                    </div>
                </div>

                <div className="unwrap-content">
                    <div className="unwrap-warning">
                        <Icons.Lightbulb />
                        <span>This service costs <strong>{wrapper.price_text}</strong></span>
                    </div>

                    <div className="unwrap-info">
                        <div className="unwrap-info-row">
                            <span className="unwrap-label">Site</span>
                            <span className="unwrap-value">{wrapper.name}</span>
                        </div>
                        {wrapper.category && (
                            <div className="unwrap-info-row">
                                <span className="unwrap-label">Category</span>
                                <span className="unwrap-value">{wrapper.category}</span>
                            </div>
                        )}
                        {wrapper.base_model && (
                            <div className="unwrap-info-row">
                                <span className="unwrap-label">May use</span>
                                <span className="unwrap-value unwrap-model">{wrapper.base_model}</span>
                            </div>
                        )}
                        <div className="unwrap-info-row">
                            <span className="unwrap-label">Free option</span>
                            <a
                                href={wrapper.alternative_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="unwrap-value unwrap-link"
                            >
                                {wrapper.alternative_name}
                                <Icons.ArrowRight />
                            </a>
                        </div>
                        {wrapper.confidence && (
                            <div className="unwrap-info-row">
                                <span className="unwrap-label">Community confidence</span>
                                <span className="unwrap-value unwrap-confidence">{wrapper.confidence}%</span>
                            </div>
                        )}
                    </div>

                    {wrapper.reason && (
                        <div className="unwrap-reason">
                            <Icons.Lightbulb />
                            <span>{wrapper.reason}</span>
                        </div>
                    )}

                    <div className="unwrap-prompt-section">
                        <div className="unwrap-prompt-header">
                            <Icons.Document />
                            <span className="unwrap-prompt-label">Suggested prompt</span>
                        </div>
                        <pre className="unwrap-prompt-text">{wrapper.system_prompt}</pre>
                    </div>
                </div>

                <div className="unwrap-actions">
                    <button className="unwrap-btn unwrap-btn-primary" onClick={copyPrompt}>
                        {copied ? <Icons.Check /> : <Icons.Copy />}
                        {copied ? 'Copied' : 'Copy prompt'}
                    </button>
                    <button className="unwrap-btn unwrap-btn-secondary" onClick={goToAlternative}>
                        <Icons.ExternalLink />
                        Try free option
                    </button>
                </div>

                <div className="unwrap-footer">
                    {wrapper.contributor && (
                        <span className="unwrap-tagline">
                            Contributed by {wrapper.contributor}
                            {wrapper.last_updated && ` · Updated ${wrapper.last_updated}`}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
