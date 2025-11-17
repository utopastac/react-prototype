import React from "react";
import ReactMarkdown from "react-markdown";
import styles from "./index.module.sass";
import Icon from "src/components/Icon";
import * as Icons from "src/data/AllIcons";

export interface InlineFeedbackProps {
  label: string;
  type?: 'positive' | 'negative' | 'neutral' | 'caution';
  className?: string;
}

const InlineFeedback: React.FC<InlineFeedbackProps> = ({ 
  label, 
  type = 'neutral',
  className 
}) => {
  const getIcon = () => {
    switch(type) {
      case 'positive':
        return Icons.System.SignalSuccessSmall;
      case 'negative':
        return Icons.System.SignalErrorSmall;
      case 'caution':
        return Icons.System.SignalCautionSmall;
      case 'neutral':
        return Icons.System.QuestionSmall;
      default:
        return Icons.System.QuestionSmall ;
    }
  };

  const getIconColor = () => {
    switch(type) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'failure';
      case 'caution':
        return 'caution';
      case 'neutral':
        return 'standard';
      default:
        return 'standard';
    }
  };

  return (
    <div 
      className={[
        styles.Main,
        styles[type],
        className
      ].filter(Boolean).join(' ')}
    >
      <div className={styles.icon}>
        <Icon 
          icon={getIcon()} 
          size="16" 
          color={getIconColor()} 
        />
      </div>
      <div className={styles.content}>
        <ReactMarkdown>{label}</ReactMarkdown>
      </div>
    </div>
  );
};

export default InlineFeedback;

export const InlineFeedbackPropMeta = {
  label: { type: 'string', label: 'Label (Markdown)' },
  type: {
    type: 'select',
    label: 'Type',
    options: ['positive', 'negative', 'neutral', 'caution']
  },
  className: { type: 'string', label: 'CSS Class' }
};

