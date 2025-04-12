import React from 'react';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext'; // Adjust the import path as necessary
import StreetViewComponent from '@/components/LocalEditor/PanoEditor/StreetViewComponent'
//import TagEditor from '@/components/LocalEditor/PanoEditor/TagEditor';
import DescriptionEditor from '@/components/LocalEditor/PanoEditor/DescriptionEditor';
import EditorActionButtons from '@/components/LocalEditor/PanoEditor/EditorActionButtons';
import CoverageDatesDropdown from '@/components/LocalEditor/PanoEditor/CoverageDatesDropdown';
import AddressDisplay from '@/components/LocalEditor/PanoEditor/AddressDisplay';
//import CategoryEditor from '@/components/LocalEditor/PanoEditor/CategoryEditor'
import TagEditor from '@/components/LocalEditor/PanoEditor/TagEditor'
import styles from '@/styles/LocalEditor.module.css';


const PanoEditorPanel: React.FC = () => {
  const {
    currentPanorama,
    displayedPanorama,
    pendingPanorama,
    setPendingPanorama,
    setStreetViewPanoId,
    updateCurrentPos,
    updateCurrentPov,
    setCurrentTags,
    loadAvailableDatesData
  } = useLocalEditorContext();
  if (!currentPanorama || !displayedPanorama) return null;
  //-commented-console.log("[PanoEditorPanel] - Initialized")


  return (
    <div className={styles.panoEditorPanel}>
      {/* Street View Component */}
      <div className={styles.streetViewComponent}>
        <StreetViewComponent
            initialPano={currentPanorama}
            pendingPano={pendingPanorama}
            setPendingPano={setPendingPanorama}
            updateCurrentPos={updateCurrentPos}
            updateCurrentPov={updateCurrentPov}
        />
      </div>
      

      <div className={styles.coverageInfo}>
        <CoverageDatesDropdown 
          displayedPano={displayedPanorama}
          setPanoId={setStreetViewPanoId}
          loadAvailableDatesData={loadAvailableDatesData}
        />
        <AddressDisplay 
          displayedPano={displayedPanorama}
        />
      </div>
      {/* Tag Editor */}
      <TagEditor
        initialTags={currentPanorama.tags}
        setCurrentTags={setCurrentTags}
      />
      
      {/* Description Editor */}
      <DescriptionEditor/>

      {/* Action Buttons */}
      <EditorActionButtons/>
      {/*
        <div className={styles.categoryEditor}>
          <CategoryEditor/>
        </div>
      */}
    </div>

  );
};

export default PanoEditorPanel;
