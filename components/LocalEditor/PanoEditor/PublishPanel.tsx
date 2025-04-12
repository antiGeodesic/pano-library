import React, { useState, useRef } from 'react';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext'; // Correct path as needed
import styles from '@/styles/LocalEditor.module.css';
const PublishPanel: React.FC = () => {
  const { 
    localPanos,
    publishLocalPanos
  } = useLocalEditorContext();
  
  const [toggled, setToggled] = useState<boolean>(false);
  const [publishResult, setPublishResult] = useState<string>('none');
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  
  const handleRetry = () => {
    setPublishResult('none')
};
    const handleNothing = () => {
       //commented-console.warn("Nothing")
    };
  
    const handlePublish = async() => {
       //commented-console.warn("Publish")
        const success = await publishLocalPanos();
        setPublishResult(success ? 'success' : 'fail');
    };


  const renderButton = (label: string, confirmLabel: string, action: () => void, className: string) => {
    return (
      <button
        className={`${styles.publishButton} ${className} ${toggled ? styles.publishButtonToggled : ''}`}
        onClick={() => {

          if (toggled) {
            action();
            setToggled(false);
          } else {
            setToggled(true);
          }
        }}
        aria-live="polite"
      >
        <span className={`${styles.publishButtonContent} ${toggled ? styles.publishButtonContentToggled : ''}`}>
          {toggled ? confirmLabel : label}
        </span>
      </button>
    );
  };

  return (
    <div className={styles.publishPanel} ref={buttonContainerRef}>

      {publishResult == 'fail' ? (
        <>
            {renderButton('Failed to upload. Retry?', 'Confirm Retry', handleRetry, styles.deleteButton)}
        </>
      ) : publishResult == 'success' ? (
        <>
            {renderButton('Upload successful', 'Continue', handleRetry, styles.updateButton)}
        </>
      ) :   localPanos.length == 0 ? (
        <>
          {renderButton("Can't upload without any panoramas", "Can't upload without any panoramas", handleNothing, styles.deleteButton)}
        </>
      ) : (
        <>
          {renderButton('Upload', 'Confirm Upload', handlePublish, styles.updateButton)}
        </>
      )}
    </div>
  );
};

export default PublishPanel;
