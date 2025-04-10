import React, { useState, useRef } from 'react';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext'; // Correct path as needed
import styles from '@/styles/LocalEditor.module.css';
const EditorActionButtons: React.FC = () => {
  const { 
    currentPanorama,
    //addLocalPano,
    //updateLocalPano,
    //deleteLocalPano,
    //clearCurrentPano,
    saveDisplayedPano,
    updateDisplayedPano,
    deleteDisplayedPano,
    clearDisplayedPano,
    currentPanoramaIsNew,
    displayedPanorama
  } = useLocalEditorContext();
  
  const [toggledButtonId, setToggledButtonId] = useState<string | null>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);
  if(!currentPanorama || !displayedPanorama) return (
    <div className={styles.buttonGrid} ref={buttonContainerRef}>
      <div className={`${styles.editButton}`}>Null 1</div>
      <div className={`${styles.editButton}`}>Null 2</div>
      <div className={`${styles.editButton}`}>Null 3</div>
      <div className={`${styles.editButton}`}>Null 4</div>
    </div>
  )
  //-commented-console.log("[EditorActionButtons] - Initialized")

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
      
      //-commented-console.log("Saving new data...");
      saveDisplayedPano();
      //addLocalPano({ ...currentPanorama, ...displayedPanorama});
      //clearCurrentPano();
    };
  
    const handleUpdate = () => {
      //-commented-console.log("Updating existing data...");
      updateDisplayedPano();
      //updateLocalPano({ ...currentPanorama, ...displayedPanorama});
      //clearCurrentPano();
    };
  
    const handleDelete = () => {
      //-commented-console.log("Deleting current data...");
      deleteDisplayedPano();
      //deleteLocalPano(currentPanorama.localId);
      //clearCurrentPano();
    };
  
    const handleClose = () => {
      //-commented-console.log("Closing editor...");
      clearDisplayedPano();
      //clearCurrentPano();
    };
  /*const handleSave = () => {
    //-commented-console.log(`[EditorActionButtons.tsx] - handleSave(){  if(${currentPanorama}){ ...}}`);
    if (currentPanoramaIsNew) {
      //addLocalPano(currentPanorama);
      onSave();
      //clearCurrentPano(); // Optionally clear after saving
    }
  };

  const handleUpdate = () => {
    if (!currentPanoramaIsNew) {
      //-commented-console.log("⚠️ - Update Current Panorama")
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
          //-commented-console.log(`[EditorActionButtons.tsx] - handleClick( id=${id}, isToggled=${isToggled}, currentPanoIsNew=${currentPanoramaIsNew}, currentPanorama=${JSON.stringify(currentPanorama)} ){...}`);
          //-commented-console.log(`[EditorActionButtons.tsx] - handleClick( ${id} ){...}`);
          //-commented-console.log(`[EditorActionButtons.tsx] - handleClick( ${id} ){...}`);
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
    <div className={styles.editorActionButtons} ref={buttonContainerRef}>
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
