import React, { useState } from 'react';
import Modal from '../DevTools/Modal';
import styles from './index.module.sass';
import { InterventionScreenComponents } from 'src/data/Components';
import idvImg from 'src/assets/admin-layouts/idv.jpg';
import disputesImg from 'src/assets/admin-layouts/disputes.jpg';
import accountLinkingImg from 'src/assets/admin-layouts/account-linking.jpg';
import nAuthImg from 'src/assets/admin-layouts/n-auth.jpg';
import idvData from '../layouts/idv.json';
import disputesData from '../layouts/disputes.json';
import accountLinkingData from '../layouts/account-linking.json';
import nAuthData from '../layouts/n-auth.json';
import { transformLayoutsImageUrls } from 'src/utils/imageUrlTransformer';

interface FlowInfo {
  name: string;
  description?: string;
  image?: string; // Add image property for preview
}

interface FlowLibraryModalProps {
  onLoadComplete: (data: any) => void;
  x?: number;
  y?: number;
  onClose: () => void;
}

const templates: (FlowInfo & { data: any })[] = [
  { name: 'IDV', description: 'ID verification flow', data: idvData, image: idvImg },
  { name: 'Disputes', description: 'Disputes happy path flow', data: disputesData, image: disputesImg },
  { name: 'Account Linking', description: 'Account linking flows', data: accountLinkingData, image: accountLinkingImg },
  { name: 'N Auth', description: 'Account recovery flows', data: nAuthData, image: nAuthImg },
];

const FlowLibraryModal: React.FC<FlowLibraryModalProps> = ({ onLoadComplete, x, y, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLoad = async (name: string) => {
    const tmpl = templates.find(t => t.name === name);
    if (!tmpl) return;
    setLoading(true);
    setError(null);
    try {
      const data = tmpl.data;
      
      // Transform image URLs in the layouts to work in both dev and production
      const transformedLayouts = transformLayoutsImageUrls(data.layouts);
      
      // Patch components array to add Component property
      const layoutsWithComponents = transformedLayouts.map((layout: any) => ({
        ...layout,
        components: (layout.components || []).map((item: any) => ({
          ...item,
          Component: (InterventionScreenComponents as any)[item.name],
        })),
        showStatusBar: layout.showStatusBar !== undefined ? layout.showStatusBar : true,
      }));
      onLoadComplete({
        layouts: layoutsWithComponents,
        names: data.layoutNames,
        layoutPositions: data.layoutPositions,
        gridRows: data.gridRows,
        gridCols: data.gridCols,
      });
    } catch (e) {
      setError('Failed to load layout file');
    } finally {
      setLoading(false);
    }
  };




  return (
    <Modal
      title="Flow Library"
      x={x}
      y={y}
      close={onClose}
    >
      <div className={styles.FlowLibraryModal}>
        <div className={styles.tabContent}>
          {templates.length === 0 ? (
            <p>No templates found.</p>
          ) : (
            <ul>
              {templates.map(tmpl => (
                <li key={tmpl.name} onClick={() => handleLoad(tmpl.name)}>
                  <div className={styles.image}>
                    {tmpl.image && (
                      <img src={tmpl.image} alt={tmpl.name + ' preview'} />
                    )}
                  </div>
                  <div className={styles.content}>
                    <h4>{tmpl.name}</h4>
                    {tmpl.description && <p>{tmpl.description}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default FlowLibraryModal; 