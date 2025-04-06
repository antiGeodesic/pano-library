import React from 'react';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext';
import MapComponent from '@/components/MapComponent/MapComponent';
import PanoEditorPanel from '@/components/PanoEditor/PanoEditorPanel';
import LocalPanoList from '@/components/PanoEditor/LocalPanoList/LocalPanoList';
import styles from '@/styles/Home.module.css';
import { useGoogleMapsApi } from '@/hooks/useGoogleMapsApi';
const LocalEditorManager = () => {
  const {
    currentPanorama,
    isLoading,
    error,
    clearCurrentPano
  } = useLocalEditorContext();
  console.log("[LocalEditorManager] - Initialized")
  const { isLoaded, loadError } = useGoogleMapsApi({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  
  if (loadError) return <p>Error loading Google Maps: {loadError.message}</p>;
  if (!isLoaded) return <p>Loading Map...</p>;

  // Centralized error handling
  if (error) {
    return (
      <div className={styles.error}>
        <p>Error: {error}</p>
        <button onClick={clearCurrentPano}>Try Again</button>
      </div>
    );
  }

  // Centralized loading state handling
  /*if (!currentPanorama || isLoading) {
    return <div className={styles.loading}>Loading...</div>;
  }*/

  return (
    <main className={styles.container}>
      {/* Map View (Left Side) */}
      <div className={styles.containerElement}>
        <div className={styles.map}>
          <MapComponent />
          {/* onMapClick={(e) => e.latLng && loadPanoramaByLocation(e.latLng.lat(), e.latLng.lng())}*/}
        </div>
      </div>

      {/* Editor / List View (Right Side) */}
      <div className={styles.containerElement}>
        {isLoading ? (
          <div className={styles.loadingIndicator}><p>Loading Panorama...</p></div> // Add a loading state indicator
        ) : error ? (
          <div className={styles.error}>
            <div className={styles.errorIndicator}><p>Error: {error}</p><button onClick={clearCurrentPano}>Clear</button></div>
            <button onClick={clearCurrentPano}>Try Again</button>
          </div>
          // Add error display
        ) : currentPanorama ? (
          <PanoEditorPanel />
        ) : (
          <LocalPanoList />
        )}
      </div>
    </main>
  );
};

export default LocalEditorManager;
