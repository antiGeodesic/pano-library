import React, { useState, useRef } from 'react';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext'; // Correct path as needed
import styles from '@/styles/Home.module.css';

const EditorActionButtons: React.FC = () => {
  const {
    currentPanorama,
    addLocalPano,
    updateLocalPano,
    deleteLocalPano,
    clearCurrentPano,
    currentPanoramaIsNew,
    displayedPanorama
  } = useLocalEditorContext();
  const [toggledButtonId, setToggledButtonId] = useState<string | null>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  if(!currentPanorama) return (
    <div className={styles.buttonGrid} ref={buttonContainerRef}>
      <div className={`${styles.editButton}`}>Null 1</div>
      <div className={`${styles.editButton}`}>Null 2</div>
      <div className={`${styles.editButton}`}>Null 3</div>
      <div className={`${styles.editButton}`}>Null 4</div>
    </div>
  )
  

  /*useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toggledButtonId && buttonContainerRef.current && !buttonContainerRef.current.contains(event.target as Node)) {
        setToggledButtonId(null); // Cancel the confirmation
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggledButtonId]);*/
  const handleSave = () => {
      console.log("Saving new data...");
      addLocalPano({ ...currentPanorama, ...displayedPanorama});
      clearCurrentPano();
    };
  
    const handleUpdate = () => {
      console.log("Updating existing data...");
      updateLocalPano({ ...currentPanorama, ...displayedPanorama});
      clearCurrentPano();
    };
  
    const handleDelete = () => {
      console.log("Deleting current data...");
      deleteLocalPano(currentPanorama.localId);
      clearCurrentPano();
    };
  
    const handleClose = () => {
      console.log("Closing editor...");
      clearCurrentPano();
    };
  /*const handleSave = () => {
    console.log(`[EditorActionButtons.tsx] - handleSave(){  if(${currentPanorama}){ ...}}`);
    if (currentPanoramaIsNew) {
      //addLocalPano(currentPanorama);
      onSave();
      //clearCurrentPano(); // Optionally clear after saving
    }
  };

  const handleUpdate = () => {
    if (!currentPanoramaIsNew) {
      console.log("⚠️ - Update Current Panorama")
      //updateLocalPano(currentPanorama);
      onUpdate();
      //clearCurrentPano();
    }
  };

  const handleDelete = () => {
    if (currentPanoramaIsNew) {
      //deleteLocalPano(currentPanorama.localId);
      onDelete();
      //clearCurrentPano(); // Optionally clear after deleting
    }
  };

  const handleClose = () => {
    onClose();
    //clearCurrentPano();
  };*/

  // Helper function to render a single button with confirmation logic
  const renderButton = (id: string, label: string, confirmLabel: string, action: () => void, className: string) => {
    const isToggled = toggledButtonId === id;
    return (
      <button
        className={`${styles.editButton} ${className} ${isToggled ? styles.editButtonToggled : ''}`}
        onClick={() => {
          console.log(`[EditorActionButtons.tsx] - handleClick( id=${id}, isToggled=${isToggled}, currentPanoIsNew=${currentPanoramaIsNew}, currentPanorama=${JSON.stringify(currentPanorama)} ){...}`);
          console.log(`[EditorActionButtons.tsx] - handleClick( ${id} ){...}`);
          console.log(`[EditorActionButtons.tsx] - handleClick( ${id} ){...}`);
          if (isToggled) {
            action();
            setToggledButtonId(null);
          } else {
            setToggledButtonId(id);
          }
        }}
        aria-live="polite"
      >
        <span className={`${styles.editButtonContent} ${isToggled ? styles.editButtonContentToggled : ''}`}>
          {isToggled ? confirmLabel : label}
        </span>
      </button>
    );
  };

  return (
    <div className={styles.buttonGrid} ref={buttonContainerRef}>
      {currentPanoramaIsNew ? (
        <>
          {renderButton('save', '💾 Save', 'Confirm Save?', handleSave, styles.saveButton)}
          {renderButton('delete', '🗑 Discard', 'Confirm Discard?', handleDelete, styles.deleteButton)}
        </>
      ) : (
        <>
          {renderButton('update', '✅ Update', 'Confirm Update?', handleUpdate, styles.updateButton)}
          {renderButton('delete', '🗑 Delete', 'Confirm Delete?', handleDelete, styles.deleteButton)}
          {renderButton('close', '❌ Close', 'Confirm Close?', handleClose, styles.closeButton)}
        </>
      )}
    </div>
  );
};

export default EditorActionButtons;
