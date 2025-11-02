// useUrlSharing.ts
//
// Custom React hook for sharing and restoring admin layouts via URL.
// Handles compression, encoding, and parsing of layout data in the URL hash.
// Used by AdminView for share and restore functionality.

import { useState, useEffect } from 'react';
import lzString from 'lz-string';
import { useLayoutData, LayoutData } from './useLayoutData';
import { transformLayoutImageUrls } from 'src/utils/imageUrlTransformer';

/**
 * useUrlSharing
 *
 * Provides handlers for sharing the current layout via a compressed URL and restoring from URL.
 * Uses lz-string for compression and encoding.
 */
export const useUrlSharing = () => {
  const [shareUrl, setShareUrl] = useState('');

  const { getLayoutData, restoreLayout } = useLayoutData();

  /**
   * handleShare
   *
   * Compresses and encodes the current layout, then builds a shareable URL.
   * Sets the shareUrl state and returns the URL.
   */
  const handleShare = () => {
    const layout = getLayoutData();
    // Transform image URLs before sharing to ensure they work in production
    const transformedLayout = transformLayoutImageUrls(layout);
    const json = JSON.stringify(transformedLayout);
    const compressed = lzString.compressToEncodedURIComponent(json);
    // Assume hash route is #/admin or whatever current hash is
    const base = `${window.location.origin}${window.location.pathname}${window.location.hash.split('?')[0]}`;
    const url = `${base}?layout=${compressed}`;
    setShareUrl(url);
    return url;
  };

  // On mount, check for a layout param in the URL and restore if present
  useEffect(() => {
    // Example hash: "#/admin?layout=ENCODED_STRING"
    const hash = window.location.hash; // "#/admin?layout=ENCODED_STRING"
    const queryIndex = hash.indexOf('?');
    if (queryIndex !== -1) {
      const params = new URLSearchParams(hash.substring(queryIndex + 1));
      const layoutParam = params.get('layout');
      if (layoutParam) {
        try {
          const json = lzString.decompressFromEncodedURIComponent(layoutParam);
          if (json) {
            const data = JSON.parse(json);
            restoreLayout(data);
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }, []); // Only run on mount

  return {
    shareUrl,
    setShareUrl,
    getLayoutData,
    handleShare
  };
}; 