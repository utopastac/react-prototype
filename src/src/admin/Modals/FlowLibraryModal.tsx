import React, { useState } from 'react';
import Modal from '../DevTools/Modal';
import styles from './index.module.sass';
import { FormblockerComponents, ComponentData, initialComponentProps } from 'src/data/Components';
import idvImg from 'src/assets/admin-layouts/idv.jpg';
import disputesImg from 'src/assets/admin-layouts/disputes.jpg';
import accountLinkingImg from 'src/assets/admin-layouts/account-linking.jpg';
import nAuthImg from 'src/assets/admin-layouts/n-auth.jpg';
import idvData from '../layouts/idv.json';
import disputesData from '../layouts/disputes.json';
import accountLinkingData from '../layouts/account-linking.json';
import nAuthData from '../layouts/n-auth.json';
import { transformLayoutsImageUrls } from 'src/utils/imageUrlTransformer';
import { GeneratedFlow } from '../utils/flowGenerator';
import { generateFlowWithLLM, setLLMConfig, setupLLMFromEnv } from '../utils/llmFlowGenerator';
import { isLLMAvailable, getAvailableProviders, isBlockcell } from 'src/config/llm';
import Tabs, { TabItem } from '../components/Tabs';
import LabeledInput from '../LabeledInput';
import TextButton from '../components/TextButton';

interface FlowInfo {
  name: string;
  description?: string;
  image?: string; // Add image property for preview
}

interface FlowLibraryModalProps {
  onLoadComplete: (data: any) => void;
  onClose: () => void;
}

const templates: (FlowInfo & { data: any })[] = [
  { name: 'IDV', description: 'ID verification flow', data: idvData, image: idvImg },
  { name: 'Disputes', description: 'Disputes happy path flow', data: disputesData, image: disputesImg },
  { name: 'Account Linking', description: 'Account linking flows', data: accountLinkingData, image: accountLinkingImg },
  { name: 'N Auth', description: 'Account recovery flows', data: nAuthData, image: nAuthImg },
];

// Available components for LLM generation
const availableComponents = Object.keys(FormblockerComponents);

const FlowLibraryModal: React.FC<FlowLibraryModalProps> = ({ onLoadComplete, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'templates' | 'generate'>('templates');
  const [flowDescription, setFlowDescription] = useState('');
  const [generating, setGenerating] = useState(false);
  const [generatedFlow, setGeneratedFlow] = useState<GeneratedFlow | null>(null);
  const [useLLM, setUseLLM] = useState(true);
  const [llmProvider, setLlmProvider] = useState<'openai' | 'anthropic' | 'proxy' | 'goose'>('openai');
  const [apiKey, setApiKey] = useState('');

  // Tab configuration
  const tabItems: TabItem[] = [
    { id: 'templates', label: 'Templates' },
    { id: 'generate', label: 'Generate Flow' }
  ];

  // Initialize LLM configuration from environment variables
  React.useEffect(() => {
    setupLLMFromEnv();
    
    // Auto-enable LLM if available
    if (isLLMAvailable()) {
      setUseLLM(true);
      const availableProviders = getAvailableProviders();
      if (availableProviders.length > 0) {
        setLlmProvider(availableProviders[0]);
      }
    }
  }, []);

  const handleLoad = async (name: string) => {
    const tmpl = templates.find(t => t.name === name);
    if (!tmpl) return;
    setLoading(true);
    setError(null);
    try {
      const data = tmpl.data;
      
      // Transform image URLs in the layouts to work in both dev and production
      const transformedLayouts = transformLayoutsImageUrls(data.layouts);
      
      // Patch dropped array to add Component property
      const layoutsWithComponents = transformedLayouts.map((layout: any) => ({
        ...layout,
        dropped: (layout.dropped || []).map((item: any) => ({
          ...item,
          Component: (FormblockerComponents as any)[item.name],
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

  const handleGenerateFlow = async () => {
    if (!flowDescription.trim()) {
      setError('Please describe the flow you want to generate');
      return;
    }

    setGenerating(true);
    setError(null);

    try {
      let generatedFlow: GeneratedFlow;
      
      // Configure LLM if API key is provided or using proxy/goose
      if (llmProvider === 'proxy' || llmProvider === 'goose' || apiKey) {
        setLLMConfig({
          provider: llmProvider,
          apiKey: (llmProvider === 'proxy' || llmProvider === 'goose') ? undefined : apiKey
        });
      }
        
        // Use the LLM-powered generator
      generatedFlow = await generateFlowWithLLM(flowDescription);
      
      setGeneratedFlow(generatedFlow);
      
      // Automatically load the generated flow
      loadGeneratedFlow(generatedFlow);
    } catch (e) {
      console.error('Generation error:', e);
      setError(`Failed to generate flow: ${e instanceof Error ? e.message : 'Unknown error'}`);
    } finally {
      setGenerating(false);
    }
  };

  const loadGeneratedFlow = (flow?: GeneratedFlow) => {
    const flowToLoad = flow || generatedFlow;
    if (flowToLoad) {
      console.log('Loading generated flow:', flowToLoad);
      
      // Transform the generated flow to match the expected format
      const layoutsWithComponents = flowToLoad.layouts.map((layout: any) => ({
        ...layout,
        dropped: (layout.dropped || []).map((item: any) => ({
          ...item,
          Component: (FormblockerComponents as any)[item.name],
        })),
        showStatusBar: layout.showStatusBar !== undefined ? layout.showStatusBar : true,
      }));

      const loadData = {
        layouts: layoutsWithComponents,
        names: flowToLoad.names,
        layoutPositions: flowToLoad.layoutPositions,
        gridRows: flowToLoad.gridRows,
        gridCols: flowToLoad.gridCols,
      };

      console.log('Transformed load data:', loadData);
      
      onLoadComplete(loadData);
      
      // Close the modal after loading
      onClose();
    }
  };



  return (
    <Modal
      title="Flow Library"
      x={650}
      y={40}
      close={onClose}
    >
      <div className={styles.FlowLibraryModal}>
        {/* Tab Navigation */}
        <Tabs
          tabs={tabItems}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as 'templates' | 'generate')}
        />

        {/* Templates Tab */}
        {activeTab === 'templates' && (
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
        )}

        {/* Generate Flow Tab */}
        {activeTab === 'generate' && (
          <div className={styles.tabContent}>
            <div className={styles.generateSection}>
              {/* <p>Describe the user flow you want to create.</p> */}
              
              {/* <div className={styles.availableComponents}>
                <h4>Available Components:</h4>
                <div className={styles.componentList}>
                  {availableComponents.map(component => (
                    <span key={component} className={styles.componentTag}>
                      {component}
                    </span>
                  ))}
                </div>
              </div> */}

              <div className={styles.inputSection}>
                <LabeledInput
                  config={{
                    type: 'textarea',
                    placeholder: "Describe the user flow you want to generate. For example: 'Create a signup flow with name input, email verification, and success confirmation'"
                  }}
                  value={flowDescription}
                  onChange={setFlowDescription}
                />
                {/* <div className={styles.examplePrompts}>
                  <h5>Example prompts:</h5>
                  <ul>
                    <li>"Create a signup flow with name and email inputs"</li>
                    <li>"Build a login screen with email and password"</li>
                    <li>"Generate a payment flow with recipient selection and amount input"</li>
                    <li>"Create an identity verification flow with SSN and DOB inputs"</li>
                    <li>"Build a multi-step onboarding flow"</li>
                  </ul>
                </div> */}
              </div>

              <div className={styles.llmSection}>
                
                {useLLM && (
                  <div className={styles.llmConfig}>
                      <LabeledInput
                        config={{
                          type: 'select',
                          label: 'AI Provider:',
                          options: [
                            ...(getAvailableProviders().includes('goose') ? [{ value: 'goose', label: 'Goose AI 🪿' }] : []),
                            ...(isBlockcell() ? [{ value: 'proxy', label: 'Block AI (Blockcell)' }] : []),
                            { value: 'openai', label: 'OpenAI GPT-4' },
                            { value: 'anthropic', label: 'Anthropic Claude' }
                          ]
                        }}
                        value={llmProvider}
                        onChange={setLlmProvider}
                      />
                    
                    {llmProvider !== 'proxy' && llmProvider !== 'goose' && (
                      <LabeledInput
                        config={{
                          type: 'string',
                          label: 'API Key:',
                          placeholder: `Enter your ${llmProvider} API key`
                        }}
                        value={apiKey}
                        onChange={setApiKey}
                      />
                    )}
                  </div>
                )}
              </div>

              <div className={styles.buttonSection}>
                <TextButton
                  text={generating ? 'Generating...' : 'Generate Flow'}
                  onClick={handleGenerateFlow}
                  disabled={generating || !flowDescription.trim()}
                  className={styles.generateButton}
                />
              </div>
              {loading && <p className={styles.loading}>Generating...</p>}
              {error && <p className={styles.error}>{error}</p>}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default FlowLibraryModal; 