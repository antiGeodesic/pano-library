import React from 'react';
import ExplorerMapComponent from './ExplorerMapComponent';
import ExplorerControlPanel from './ExplorerControlPanel';
import styles from '@/styles/Explorer.module.css';
import ExplorerPanoViewer from './ExplorerPanoViewer';
import { useGoogleMapsApi } from '@/hooks/useGoogleMapsApi';
import { useExplorerContext } from '@/contexts/ExplorerContext';
const ExplorerManager = () => {
    const {
        displayedPanos,
        displayedPano
      } = useExplorerContext();
    const { isLoaded, loadError } = useGoogleMapsApi({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    });


    if (loadError) return <p>Error loading Google Maps: {loadError.message}</p>;
    if (!isLoaded) return <p>Loading Map...</p>;
    if(!displayedPanos) console.log("Null")
    return (
        <div className={styles.explorerManager}>

            <div className={styles.explorerMap}>
                <ExplorerMapComponent />
            </div>

            <div className={styles.explorerSettingsPanel}>
            {displayedPano ? 
            (
                <ExplorerPanoViewer/> 
            )
            :
            (
                <ExplorerControlPanel/>
            )
        }
            </div>
        </div>
    );
};

export default ExplorerManager;
