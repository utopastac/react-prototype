import React, { useState, useEffect } from "react";
import { 
  useUser, 
  useUserDispatch, 
  UserObject, 
  UPDATE_USER 
} from 'src/containers/UserContext';

import { 
  useFeed, 
  useFeedDispatch, 
  FEED_REMOVE, 
  FEED_ADD, 
  FeedItem 
} from 'src/containers/FeedContext';

import * as Icons from "src/data/Icons";
import { ICON_16, ICON_PROMINENT, ICON_24 } from "src/components/Icon";
import Modal from "./Modal";
import DevToolsSection from "./DevToolsSection";
import styles from "./index.module.sass";
import DevToolsLink, { DevToolsLinkProps } from "./DevToolsLink";
import { motion, AnimatePresence } from "framer-motion";
import ThemeSection from "src/admin/DevTools/ThemeSection";
import LabeledInput from '../LabeledInput';
import ToolbarButton from '../components/ToolbarButton';
import TextButton from '../components/TextButton';
import Signature from '../components/Signature';
//

/**
 * Props interface for the DevTools component
 */
interface DevToolsProps {
  isToolsOpen: boolean;    // Controls whether the dev tools panel is visible
  toggleTools: () => void; // Function to toggle the dev tools panel
}

/**
 * DevTools Component
 * 
 * A comprehensive development tools panel that provides:
 * - Theme customization settings
 * - User profile editing (name, cashtag, avatar)
 * - Activity management (view/add/remove activities)
 * - Navigation to different app flows
 * 
 * The component uses a slide-in animation and organizes features into collapsible sections.
 */
const DevTools: React.FC<DevToolsProps> = ({ isToolsOpen, toggleTools }) => {
  // State to track which sections are currently expanded
  const [openSections, setOpenSections] = useState<string[]>([]);

  // Context hooks for managing user data and activities
  const userDispatch = useUserDispatch();
  const userObject: UserObject = useUser();
  const { name, cashtag, avatar } = userObject;

  const activityData = useFeed();

  // Local state for form inputs - synced with user context
  const [nameInputValue, setNameInputValue] = useState(name);
  const [cashtagInputValue, setCashtagInputValue] = useState(cashtag);
  
  // Modal state management
  const [showModalValue, setShowModalValue] = useState(false);
  const [modalContentsValue, setModalContentsValue] = useState<{content: React.ReactNode | null, title: string, x: number, y: number}>({content: null, title: "", x: 0, y: 0});

  // Close all modals when dev tools are closed
  useEffect(() => {
    if (!isToolsOpen) {
      setShowModalValue(false);
    }
  }, [isToolsOpen]);

  // Navigation routes data for the Flows section
  const routeData = [
    {title:"Components", path:"/components", description:"All UI components"},
    {title:"App", path:"/discover", description:"Main app interface"},
    {title:"Account", path:"/account", description:"User profile settings"},
    {title:"Account linking", path:"/account-linking", description:"Account linking flow"},
    {title:"Reporting", path:"/report", description:"User reporting flow"},
    {title:"Disputes", path:"/dispute", description:"Disputes flow"},
    {title:"Receipt", path:"/receipt", description:"Receipt view"},
    {title:"Chavez", path:"/chavez", description:"Special features demo"},
    {title:"Parallax", path:"/parallax", description:"Animation showcase"}
  ];

  // Generate navigation links from route data
  const routeLinks = routeData.map((route:DevToolsLinkProps, index:number)=>{
    return (
      <DevToolsLink {...route} key={`route${index}`} />
    )    
  });

  /**
   * Toggles the open/closed state of a section
   * @param sectionTitle - The title of the section to toggle
   */
  const handleSectionToggle = (sectionTitle: string): void => {
    setOpenSections((prev) =>
      prev.includes(sectionTitle)
        ? prev.filter((title) => title !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  return (
    <div className={styles.Main}>
      {/* Toggle button for opening/closing dev tools */}
      <ToolbarButton 
        icon={Icons.Wallet24} 
        iconSize={ICON_16} 
        iconColor={ICON_PROMINENT} 
        onClick={toggleTools} 
        title="Toggle Dev Tools"
        className={styles.showTools}
        position="left"
      />
      
      {/* Animated dev tools panel */}
      <AnimatePresence initial={false}>
        {isToolsOpen && (
          <motion.div
            className={`${styles.toolsWrapper}`}
            initial={{ x: 300, width: 0}}
            animate={{ x: 0, width: 300}}
            exit={{ x: 300, width: 0}}
            transition={{ type: 'spring', stiffness: 300, damping: 40 }}
          >
            <header>
              <h2>Dev tools</h2>
            </header>
            
            <div className={styles.tools}>
              {/* Theme Settings Section */}
              <DevToolsSection 
                title="Theme Settings" 
                isOpen={openSections.includes("Theme Settings")}
                onToggle={() => handleSectionToggle("Theme Settings")}
              >
                <ThemeSection />
              </DevToolsSection>

              {/* User Settings Section - Name, Cashtag, Avatar */}
              <DevToolsSection 
                title="User Settings"
                isOpen={openSections.includes("User Settings")}
                onToggle={() => handleSectionToggle("User Settings")}
              >
                <LabeledInput
                  config={{ type: 'string', label: 'User Name' }}
                  value={nameInputValue}
                  onChange={(value: string) => {
                    setNameInputValue(value);
                    userDispatch!({ type: UPDATE_USER, payload: { name: value } });
                  }}
                />
                <LabeledInput
                  config={{ type: 'string', label: 'Cashtag' }}
                  value={cashtagInputValue}
                  onChange={(value: string) => {
                    setCashtagInputValue(value);
                    userDispatch!({ type: UPDATE_USER, payload: { cashtag: value } });
                  }}
                />
                <LabeledInput
                  config={{ type: 'avatar-select', label: 'Avatar' }}
                  value={avatar}
                  onChange={(value: string) => {
                    userDispatch!({ type: UPDATE_USER, payload: { avatar: value } });
                  }}
                />
              </DevToolsSection>

              {/* Feed Management Section */}
              <DevToolsSection 
                title="Feed"
                isOpen={openSections.includes("Feed")}
                onToggle={() => handleSectionToggle("Feed")}
              >
                <div className={styles.inputSection}>
                  <div className={styles.input}>
                    {/* Feed count dropdown - shows current posts */}
                    <div
                      className={styles.dropdown}
                      onClick={(e: React.MouseEvent) => {
                        setModalContentsValue({
                          content: (<FeedRows />),
                          title: "Feed posts",
                          x: e.pageX,
                          y: e.pageY
                        });
                        setShowModalValue(!showModalValue);
                      }}
                    >
                      {`${activityData.length} posts`}
                    </div>
                    {/* Add post button */}
                    <ToolbarButton
                      title="Add post"
                      icon={Icons.Add16}
                      onClick={(e: React.MouseEvent) => {
                        setModalContentsValue({
                          content: (<AddFeedPost />),
                          title: "Add post",
                          x: e.pageX,
                          y: e.pageY
                        });
                        setShowModalValue(!showModalValue);
                      }}
                      position='left'
                    />
                  </div>
                </div>
              </DevToolsSection>
              
              {/* Navigation Flows Section */}
              <DevToolsSection 
                title="Flows"
                isOpen={openSections.includes("Flows")}
                onToggle={() => handleSectionToggle("Flows")}
              >
                <div className={styles.routeLinks}>
                  { routeLinks }
                </div>
              </DevToolsSection>
            </div>
            
            {/* Developer signature and formblocker link */}
            <Signature
              contact="Contact @peterwright"
              buttonTitle="Formblocker maker"
              buttonIcon={Icons.DocumentQuill24}
              path={'/multi-admin'}
              buttonIconSize={ICON_24}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Modal overlay for displaying additional content */}
      {showModalValue && (
        <Modal title={modalContentsValue.title} x={modalContentsValue.x} y={modalContentsValue.y} close={() => { setShowModalValue(false) }}>
          {modalContentsValue.content}
        </Modal>
      )}
    </div>
  );
};

/**
 * FeedRows Component
 * 
 * Displays a list of all current activities in a modal.
 * Clicking on an activity row removes it from the list.
 */
const FeedRows: React.FC = () => {
  const activityDispatch = useFeedDispatch();
  const activityData = useFeed();

  return (
    <div className={styles.activityRows}>
      {activityData.map((post: FeedItem, index: number) => (
        <div
          key={`activityRow${index}`}
          className={styles.activityRow}
          onClick={() => {
            activityDispatch({
              type: FEED_REMOVE,
              index
            });
          }}
        >
          <h4 className={styles.text}>{post.author.name}</h4>
          <p>{post.stats.likes} likes</p>
        </div>
      ))}
    </div>
  );
};

/**
 * AddFeedPost Component
 * 
 * Form for adding new activities to the activity list.
 * Includes fields for name, body, date, total, and avatar.
 * Automatically fetches a random avatar on component mount.
 */
const AddFeedPost: React.FC = () => {
  const activityDispatch = useFeedDispatch();
  
  // Form state for new post
  const [authorNameInputValue, setAuthorNameInputValue] = useState("");
  const [contentInputValue, setContentInputValue] = useState("");
  const [avatarInputValue, setAvatarInputValue] = useState("");

  // Fetch a random avatar when component mounts
  useEffect(() => {
    const fetchRandomAvatar = () => {
      // Use UI Faces API to get a random realistic avatar
      // This API provides random realistic avatar images
      const avatarUrl = `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70)}`;
      setAvatarInputValue(avatarUrl);
    };

    fetchRandomAvatar();
  }, []);

  const handleAddPost = () => {
    const newPost: FeedItem = {
      id: `${Date.now()}`,
      author: {
        name: authorNameInputValue || "Anonymous",
        avatar: avatarInputValue
      },
      content: contentInputValue,
      createdAt: new Date().toISOString(),
      stats: { likes: 0, comments: 0, shares: 0 }
    };

    activityDispatch({
      type: FEED_ADD,
      post: newPost
    });
  };

  return (
    <div className={styles.addActivity}>
      <LabeledInput
        config={{ type: 'string', label: 'Author Name' }}
        value={authorNameInputValue}
        onChange={setAuthorNameInputValue}
      />
      <LabeledInput
        config={{ type: 'string', label: 'Content' }}
        value={contentInputValue}
        onChange={setContentInputValue}
      />
      
      {/* Avatar input with preview and random generation */}
      <div className={styles.avatarInput}>
        <LabeledInput
          config={{ type: 'string', label: 'Avatar URL' }}
          value={avatarInputValue}
          onChange={setAvatarInputValue}
        />
        {avatarInputValue && (
          <div className={styles.avatarPreview}>
            <img 
              src={avatarInputValue} 
              alt="Avatar preview"
              onClick={() => {
                // Generate a new random avatar when clicked
                const avatarUrl = `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70)}`;
                setAvatarInputValue(avatarUrl);
              }}
            />
          </div>
        )}
      </div>
      
      {/* Add post button */}
      <div className={styles.row}>
        <TextButton text="Add post" onClick={handleAddPost} />
      </div>
    </div>
  );
};

export default DevTools;