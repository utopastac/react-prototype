import { useState, useEffect } from 'react';
import lzString from 'lz-string';
import { useMultiLayoutData } from './useMultiLayoutData';
import { transformLayoutsImageUrls } from 'src/utils/imageUrlTransformer';

export const useMultiUrlSharing = () => {
  const [shareUrl, setShareUrl] = useState('');
  const multiLayoutData = useMultiLayoutData();

  const handleShare = () => {
    const layout = multiLayoutData.getMultiLayoutData();
    // Transform image URLs before sharing to ensure they work in production
    const transformedLayout = {
      ...layout,
      layouts: transformLayoutsImageUrls(layout.layouts || [])
    };
    const json = JSON.stringify(transformedLayout);
    const compressed = lzString.compressToEncodedURIComponent(json);
    const base = `${window.location.origin}${window.location.pathname}${window.location.hash.split('?')[0]}`;
    const url = `${base}?multiLayout=${compressed}`;
    setShareUrl(url);
    return url;
  };

  // On mount, check for a multiLayout param in the URL and restore if present
  useEffect(() => {
    // Example hash: "#/admin?multiLayout=ENCODED_STRING"
    const hash = window.location.hash;
    const queryIndex = hash.indexOf('?');
    if (queryIndex !== -1) {
      const params = new URLSearchParams(hash.substring(queryIndex + 1));
      const multiLayoutParam = params.get('multiLayout');
      if (multiLayoutParam) {
        try {
          const json = lzString.decompressFromEncodedURIComponent(multiLayoutParam);
          if (json) {
            const data = JSON.parse(json);
            multiLayoutData.restoreMultiLayout(data);
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
    getMultiLayoutData: multiLayoutData.getMultiLayoutData,
    handleShare
  };
}; 