'use client';

import { useState } from 'react';

interface CartActionsProps {
  cartUrl: string;
  buyUrls?: { vendor: string; url: string; productName: string }[];
}

export default function CartActions({ cartUrl, buyUrls = [] }: CartActionsProps) {
  const [copied, setCopied] = useState(false);
  const [linksCopied, setLinksCopied] = useState(false);

  const handleShare = () => {
    const fullUrl = `${window.location.origin}${cartUrl}`;
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCopyAllLinks = () => {
    const text = buyUrls.map(u => `${u.productName}: ${u.url}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setLinksCopied(true);
      setTimeout(() => setLinksCopied(false), 2000);
    });
  };

  const handleBuyAll = () => {
    const uniqueUrls = [...new Set(buyUrls.map(u => u.url))];
    // Stagger tab opens slightly so browsers don't block them
    uniqueUrls.forEach((url, i) => {
      setTimeout(() => {
        window.open(url, '_blank', 'noopener,noreferrer');
      }, i * 300);
    });
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
      <button
        onClick={handleShare}
        className="inline-flex items-center px-4 py-2 bg-[var(--card)] border border-[var(--card-border)] text-sm font-medium text-[var(--foreground)] rounded-lg hover:bg-[var(--surface)] transition-colors"
      >
        {copied ? 'Copied!' : 'Share this stack'}
      </button>
      {buyUrls.length > 0 && (
        <>
          <button
            onClick={handleCopyAllLinks}
            className="inline-flex items-center px-4 py-2 bg-[var(--card)] border border-[var(--card-border)] text-sm font-medium text-[var(--foreground)] rounded-lg hover:bg-[var(--surface)] transition-colors"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            {linksCopied ? 'Copied!' : 'Copy all links'}
          </button>
          <button
            onClick={handleBuyAll}
            className="inline-flex items-center px-4 py-2 bg-[var(--accent)] text-white text-sm font-medium rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open all vendor tabs
          </button>
        </>
      )}
    </div>
  );
}
