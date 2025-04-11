import React from 'react';
import ExplorerControlPanel from './ExplorerControlPanel';
import styles from '@/styles/Explorer.module.css';
import ExplorerPanoViewer from './ExplorerPanoViewer';
import { useGoogleMapsApi } from '@/hooks/useGoogleMapsApi';
import { useExplorerContext } from '@/contexts/ExplorerContext';
import DeckMap from '@/components/Deck/DeckMap';
const ExplorerManager = () => {
    const {
        clickedMap,
        loadNewPano,
        getExistingPanoById,
        loadExistingPano,
        displayedPanos,
        displayedPano,
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
                <DeckMap 
                    clickedMap={clickedMap}
                    loadNewPano={loadNewPano}
                    getExistingPanoById={getExistingPanoById}
                    loadExistingPanorama={loadExistingPano}
                    displayedPanos={displayedPanos}
                    displayedPano={displayedPano}
                />
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
