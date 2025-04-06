import React from 'react';

// Import Components
import MapComponent from '@/components/MapComponent';
import PanoEditorPanel from '@/components/PanoEditor/PanoEditorPanel';
import LocalPanoList from '@/components/LocalPanoList/LocalPanoList';

// Import Styles
import styles from '@/styles/Home.module.css';

// Import Hooks
import { useGoogleMapsApi } from '@/hooks/useGoogleMapsApi';
import { useLocalEditorManager } from '@/hooks/useLocalEditorManager';  // Adjusted import

export default function Home() {
  // Initialize Hooks
  const { isLoaded, loadError } = useGoogleMapsApi({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });
  const {
    localPanos,
    currentPanorama,
    addLocalPano,
    updateLocalPano,
    deleteLocalPano,
    getLocalPanoById,
    setCurrentPanorama,
    isLoading,
    error,
    clearCurrentPano,
    loadPanoramaByLocation,
    loadPanoramaByPanoId
  } = useLocalEditorManager();  // Consolidated hook

  // Render Logic
  if (loadError) return <p>Error loading Google Maps: {loadError.message}</p>;
  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <main className={styles.container}>
      {/* Map View (Left Side) */}
      <div className={styles.containerElement}>
        <div className={styles.map}>
          <MapComponent
            onMapClick={(e) => e.latLng && loadPanoramaByLocation(e.latLng.toJSON())}
            localPanos={localPanos}
            currentPanoData={currentPanorama}
          />
        </div>
      </div>

      {/* Editor / List View (Right Side) */}
      <div className={styles.containerElement}>
        {isLoading ? (
          <div className={styles.loadingIndicator}><p>Loading Panorama...</p></div>
        ) : error ? (
          <div className={styles.errorIndicator}><p>Error: {error}</p><button onClick={clearCurrentPano}>Clear</button></div>
        ) : currentPanorama ? (
          <PanoEditorPanel
            panoData={currentPanorama}
            onSave={addLocalPano}
            onUpdate={updateLocalPano}
            onDelete={deleteLocalPano}
            onClose={clearCurrentPano}
          />
        ) : (
          <LocalPanoList
            localPanos={localPanos}
            onPanoSelect={(pano) => setCurrentPanorama(pano)}
          />
        )}
      </div>
    </main>
  );
}
