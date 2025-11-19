import React, { useState, useMemo } from 'react';
import Modal from 'src/admin/Modal';
import Tabs from 'src/admin/components/Tabs';
import SearchInput from 'src/admin/components/LabeledInput/SearchInput';
import Icon from 'src/components/Icon';
import { Navigation, Reactions, System, CheckboxChecked } from 'src/data/AllIcons';
import styles from './index.module.sass';

interface IconPickerProps {
  value?: string | any;
  onChange: (icon: any) => void;
  onClose: () => void;
  x?: number;
  y?: number;
}

type IconGroup = 'Navigation' | 'Reactions' | 'System' | 'CheckboxChecked';

const IconPicker: React.FC<IconPickerProps> = ({ value, onChange, onClose, x, y }) => {
  const [selectedGroup, setSelectedGroup] = useState<IconGroup>('System');
  const [searchQuery, setSearchQuery] = useState('');

  // Get all icons from the selected group
  const getGroupIcons = (group: IconGroup): Record<string, any> => {
    switch (group) {
      case 'Navigation':
        return Navigation;
      case 'Reactions':
        return Reactions;
      case 'System':
        return System;
      case 'CheckboxChecked':
        return { CheckboxChecked };
      default:
        return {};
    }
  };

  // Get all icons flattened for search
  const allIconsFlat = useMemo(() => {
    const icons: Array<{ name: string; value: any; group: IconGroup }> = [];
    
    Object.entries(Navigation).forEach(([name, icon]) => {
      icons.push({ name, value: icon, group: 'Navigation' });
    });
    
    Object.entries(Reactions).forEach(([name, icon]) => {
      icons.push({ name, value: icon, group: 'Reactions' });
    });
    
    Object.entries(System).forEach(([name, icon]) => {
      icons.push({ name, value: icon, group: 'System' });
    });
    
    icons.push({ name: 'CheckboxChecked', value: CheckboxChecked, group: 'CheckboxChecked' });
    
    return icons;
  }, []);

  // Filter icons based on search query
  const filteredIcons = useMemo(() => {
    if (!searchQuery.trim()) {
      // No search query, show icons from selected group
      const groupIcons = getGroupIcons(selectedGroup);
      return Object.entries(groupIcons).map(([name, icon]) => ({
        name,
        value: icon,
        group: selectedGroup
      }));
    } else {
      // Search across all icons
      const query = searchQuery.toLowerCase();
      return allIconsFlat.filter(icon => 
        icon.name.toLowerCase().includes(query)
      );
    }
  }, [searchQuery, selectedGroup, allIconsFlat]);

  const handleIconSelect = (icon: any) => {
    onChange(icon);
    onClose();
  };

  // Check if an icon is currently selected
  const isIconSelected = (icon: any): boolean => {
    if (!value) return false;
    // Compare icon values - handle both string URLs and imported module references
    if (value === icon) return true;
    const valueStr = typeof value === 'string' ? value : (value as any)?.default || String(value);
    const iconStr = typeof icon === 'string' ? icon : (icon as any)?.default || String(icon);
    return valueStr === iconStr;
  };

  return (
    <Modal
      title="Select Icon"
      close={onClose}
      x={x}
      y={y}
    >
      <div className={styles.IconPicker}>
        <div className={styles.SearchContainer}>
          <SearchInput
            placeholder="Search icons..."
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        {!searchQuery && (
          <div className={styles.TabsContainer}>
            <Tabs
              tabs={[
                { id: 'System', label: 'System' },
                { id: 'Navigation', label: 'Navigation' },
                { id: 'Reactions', label: 'Reactions' },
                { id: 'CheckboxChecked', label: 'Other' },
              ]}
              activeTab={selectedGroup}
              onTabChange={(tabId) => {
                setSelectedGroup(tabId as IconGroup);
                setSearchQuery(''); // Clear search when switching groups
              }}
            />
          </div>
        )}

        <div className={styles.IconsGrid}>
          {filteredIcons.length > 0 ? (
            filteredIcons.map(({ name, value: iconValue, group }) => (
              <button
                key={`${group}-${name}`}
                className={`${styles.IconButton} ${isIconSelected(iconValue) ? styles.selected : ''}`}
                onClick={() => handleIconSelect(iconValue)}
                title={name}
              >
                <Icon icon={iconValue} size="24" color="prominent" />
                <span className={styles.IconName}>{name}</span>
              </button>
            ))
          ) : (
            <div className={styles.NoResults}>No icons found</div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default IconPicker;

