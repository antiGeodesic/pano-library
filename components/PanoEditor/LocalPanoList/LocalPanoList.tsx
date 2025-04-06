import React from 'react';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext'; // Correct path as needed
import LocalPanoListItem from './LocalPanoListItem';
import styles from '@/styles/Home.module.css';

const LocalPanoList: React.FC = () => {
  const { localPanos } = useLocalEditorContext();

  if (!localPanos || localPanos.length === 0) {
    return (
        <div className={styles.panoSelector}>
             <p className={styles.savedPanoEmpty}>
               Click on the map to find a Street View location and save it here.
             </p>
        </div>
    );
  }

  return (
    <div className={styles.panoSelector}>
        <h2 className={styles.panoListHeader}>Locally Saved Panoramas</h2>
        <div className={styles.savedPanoList}>
        {localPanos.map((localPano) => (
            <LocalPanoListItem
            key={localPano.localId}
            localPano={localPano}
            />
        ))}
        </div>
    </div>
  );
};

export default LocalPanoList;
