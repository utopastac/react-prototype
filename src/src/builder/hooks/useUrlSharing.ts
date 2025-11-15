import { useState, useEffect } from 'react';
import lzString from 'lz-string';
import { useLayoutData } from './useLayoutData';

export const useUrlSharing = () => {
  const [shareUrl, setShareUrl] = useState('');
  const layoutData = useLayoutData();

  const handleShare = () => {
    const layout = layoutData.getLayoutData();
    const json = JSON.stringify(layout);
    const compressed = lzString.compressToEncodedURIComponent(json);
    const base = `${window.location.origin}${window.location.pathname}${window.location.hash.split('?')[0]}`;
    const url = `${base}?layout=${compressed}`;
    setShareUrl(url);
    return url;
  };

  // On mount, check for a layout param in the URL and restore if present
  useEffect(() => {
    // Example hash: "#/admin?layout=ENCODED_STRING"
    const hash = window.location.hash;
    const queryIndex = hash.indexOf('?');
    if (queryIndex !== -1) {
      const params = new URLSearchParams(hash.substring(queryIndex + 1));
      const layoutParam = params.get('layout');
      if (layoutParam) {
        try {
          const json = lzString.decompressFromEncodedURIComponent(layoutParam);
          if (json) {
            const data = JSON.parse(json);
            layoutData.restoreLayouts(data);
          }
        } catch (e) {
          // ignore
        }
      }
    }
  }, []);

  return {
    shareUrl,
    setShareUrl,
    getLayoutData: layoutData.getLayoutData,
    handleShare
  };
}; 