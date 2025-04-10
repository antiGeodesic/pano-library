import React from 'react';
import LocalPanoList from '@/components/LocalEditor/PanoEditor/LocalPanoList/LocalPanoList';
import PublishPanel from '@/components/LocalEditor/PanoEditor/PublishPanel';
import { useGoogleMapsApi } from '@/hooks/useGoogleMapsApi';
import styles from '@/styles/LocalEditor.module.css';
const PanoSelectionPanel = () => {

  const { isLoaded, loadError } = useGoogleMapsApi({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  
  if (loadError) return <p>Error loading Google Maps: {loadError.message}</p>;
  if (!isLoaded) return <p>Loading Map...</p>;


  return (
    <div className={styles.panoSelectionPanel}>
        <LocalPanoList />
        <div style={{width: '100%', height:'100%', gridColumn: '1', gridRow: '2'}}>
            <PublishPanel />
        </div>
        
    </div>
  );
};

export default PanoSelectionPanel;
