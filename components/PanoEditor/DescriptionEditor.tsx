import React from 'react';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext'; // Adjust the import path as needed
import styles from '@/styles/Home.module.css';

const DescriptionEditor: React.FC = () => {
  const { currentPanorama, displayedPanorama, setDisplayedPanorama } = useLocalEditorContext();

  if(!currentPanorama || !displayedPanorama) return;
  
  return (
    <div className={styles.panoEditorInfoWrapper}>
      <label htmlFor="pano-description" className={styles.editorLabel}>Description:</label>
      <textarea
        id="pano-description"
        className={styles.descriptionInput}
        placeholder="Enter a description..."
        value={displayedPanorama.description}
        //onChange={(e) => setDescription(e.target.value)}
        //onChange={(e) => setDisplayedPanorama({ ...currentPanorama, panoId: displayedPanorama.panoId, lat: displayedPanorama.lat, lng: displayedPanorama.lng, heading: displayedPanorama.heading, pitch: displayedPanorama.pitch, zoom: displayedPanorama.zoom, tags: tags, movementHistory: displayedPanorama?.movementHistory ? [...displayedPanorama?.movementHistory, panoValues] : [panoValues] })}
        onChange={(e) => setDisplayedPanorama({...currentPanorama, ...displayedPanorama, description: e.target.value})}
        rows={4}
      />
    </div>
  );
};

export default DescriptionEditor;
