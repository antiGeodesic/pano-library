import React from 'react';
import StreetViewComponent from '@/components/LocalEditor/PanoEditor/StreetViewComponent'
import CoverageDatesDropdown from '@/components/LocalEditor/PanoEditor/CoverageDatesDropdown';
import AddressDisplay from '@/components/LocalEditor/PanoEditor/AddressDisplay';
import styles from '@/styles/Explorer.module.css';
import { useExplorerContext } from '@/contexts/ExplorerContext';


const ExplorerPanoViewer: React.FC = () => {
  const {
    displayedPano,
    initialPano,
    pendingPano,
    setPendingPano,
    setPanoId,
    updateCurrentPos,
    updateCurrentPov
  } = useExplorerContext();
  console.log("[ExplorerPanoViewer]----------------DisplayedPano: ", displayedPano)
  console.log("[ExplorerPanoViewer]----------------InitialPano: ", initialPano)
  if (!initialPano || !displayedPano) return null;
  
  

  return (
    <div className={styles.panoEditorPanel}>
      {/* Street View Component */}
      <div className={styles.streetViewComponent}>
        <StreetViewComponent
          initialPano={initialPano}
          pendingPano={pendingPano}
          setPendingPano={setPendingPano}
          updateCurrentPos={updateCurrentPos}
          updateCurrentPov={updateCurrentPov}
        />
      </div>
      

      <div className={styles.coverageInfo}>
        <CoverageDatesDropdown 
          displayedPano={displayedPano}
          setPanoId={setPanoId}
        />
        <AddressDisplay 
            displayedPano={displayedPano}
        />
      </div>
    </div>

  );
};

export default ExplorerPanoViewer;
