import React, { useState } from 'react';
import { useExplorerContext } from '@/contexts/ExplorerContext';

import { useGoogleMapsApi } from '@/hooks/useGoogleMapsApi';
import styles from '@/styles/Explorer.module.css'
const ExplorerControlPanel = () => {
    const { displayByTagKeyword } = useExplorerContext();
    const { isLoaded, loadError } = useGoogleMapsApi({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    });
    const [tag, setTag] = useState<string>("");

    if (loadError) return <p>Error loading Google Maps: {loadError.message}</p>;
    if (!isLoaded) return <p>Loading Map...</p>;
    const isEmpty = tag == "";
    //console.log("[ExplorerControlPanel]--------", displayedPano)
    return (
        <div className={styles.controlPanel}>
            <div className={styles.controlPanelHeader}>
                <span>Filter by tags</span>
            </div>
            <div className={styles.controlPanelSearchPanel}>
                <textarea
                    id="control-panel-search-input"
                    className={styles.searchInput}
                    placeholder="Enter a tag..."
                    value={tag}
                    //onChange={(e) => setDescription(e.target.value)}
                    //onChange={(e) => setDisplayedPanorama({ ...currentPanorama, panoId: displayedPanorama.panoId, lat: displayedPanorama.lat, lng: displayedPanorama.lng, heading: displayedPanorama.heading, pitch: displayedPanorama.pitch, zoom: displayedPanorama.zoom, tags: tags, movementHistory: displayedPanorama?.movementHistory ? [...displayedPanorama?.movementHistory, panoValues] : [panoValues] })}
                    onChange={(e) => { setTag(e.target.value) }}
                    rows={1}
                />
                {

                    (
                        <button
                            className={`${isEmpty ? styles.submitSearchButtonEmpty : styles.submitSearchButton}`}
                            //disabled={!isEmpty}
                            onClick={() => (!isEmpty && displayByTagKeyword(tag))}
                            //onClick={() => displayByTag(tag)}
                        >
                            <span className={styles.submitSearchButtonContent}>{isEmpty ?  "Search for a tag" : `Search for "${tag}"`}</span>
                        </button>
                    )
                }



            </div>
        </div>
    );
};

export default ExplorerControlPanel;
