import React, {useState} from 'react';
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
    updateCurrentPov,
    clearCurrentPano
  } = useExplorerContext();
 //commented-console.log("[ExplorerPanoViewer]----------------DisplayedPano: ", displayedPano)
 //commented-console.log("[ExplorerPanoViewer]----------------InitialPano: ", initialPano)
  const [toggled, setToggled] = useState<boolean>(false);
  if (!initialPano || !displayedPano) return null;
  
  const handleClear = async() => {

    clearCurrentPano()
};

function loadAvailableDatesData() {
  return null;
}
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
          loadAvailableDatesData={loadAvailableDatesData}
        />
        <AddressDisplay 
            displayedPano={displayedPano}
        />
        <>
          {renderButton('Close', 'Confirm Close', handleClear, styles.closeButton)}
        </>
      </div>
    </div>

  );
};

export default ExplorerPanoViewer;
