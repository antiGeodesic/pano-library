import React from 'react';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext'; // Adjust the import path as necessary
import StreetViewComponent from '@/components/PanoEditor/StreetViewComponent'
import TagEditor from './TagEditor';
import DescriptionEditor from './DescriptionEditor';
import EditorActionButtons from './EditorActionButtons';
import styles from '@/styles/Home.module.css';

const PanoEditorPanel: React.FC = () => {
  const {
    currentPanorama
  } = useLocalEditorContext();

  if (!currentPanorama) return null;
  //-commented-console.log("[PanoEditorPanel] - Initialized")


  return (
    <div className={styles.panoEditor}>
      {/* Street View Component */}
      <StreetViewComponent

      />

      {/* Settings and Controls Area */}
      <div className={styles.panoSettings}>
        {/* Tag Editor */}
        <TagEditor

        />

        {/* Description Editor */}
        <DescriptionEditor

        />

        {/* Action Buttons */}
        <EditorActionButtons
        />
      </div>
    </div>
  );
};

export default PanoEditorPanel;
