import React, { useCallback, useState, useEffect } from 'react';
import { AdvancedMarker, APIProvider, Map, useMap, MapMouseEvent } from '@vis.gl/react-google-maps';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext';
import { MovementHistoryPolyline } from './MovementHistoryPolyline';
import Image from 'next/image'

const StreetViewLayerManager: React.FC = () => {
    const map = useMap(); // Get map instance from context

    useEffect(() => {
        if (!map) return; // Wait for map instance

        // Check if StreetViewCoverageLayer constructor is available
        if (!google.maps.StreetViewCoverageLayer) {
            console.warn("StreetViewCoverageLayer not available. Ensure 'streetView' library is loaded via APIProvider.");
            return;
        }

        console.log("Adding StreetViewCoverageLayer");
        const svLayer = new google.maps.StreetViewCoverageLayer();
        svLayer.setMap(map);

        // Cleanup function to remove layer when component unmounts or map changes
        return () => {
            console.log("Removing StreetViewCoverageLayer");
            svLayer.setMap(null);
        };
    }, [map]); // Re-run effect if map instance changes

    return null; // This component doesn't render anything itself
};

const containerStyle = {
    width: '100%',
    height: '100%',

};

const defaultCenter = {
    lat: 0,
    lng: 0,
};

const defaultZoom = 2;

// --- Custom SVG for the "No Panorama Found" Marker (keep as is) ---
const noPanoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>
`;
// Use the SVG directly in an img tag's src
const encodedNoPanoSvgDataUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(noPanoSvg)}`;

interface MapComponentContentProps {
    noPanoMarkerPosition: google.maps.LatLngLiteral | null; // Receive position as prop
}

const MapComponentContent: React.FC<MapComponentContentProps> = ({
    noPanoMarkerPosition // Destructure the prop
}) => {
    // Still needs context for localPanos and displayedPanorama for rendering markers
    const { localPanos, displayedPanorama } = useLocalEditorContext();
    const map = useMap(); // Hook still needed here for MapPanController/AnimatedValuesController if it uses map


    // --- Get initial map state ---
    const [initialMapValues, setInitialMapValues] = useState<number[] | undefined>();
    useEffect(() => {
        if (map && !initialMapValues) {
            const center = map.getCenter();
            const zoom = map.getZoom();
            if (center && zoom !== undefined) {
                setInitialMapValues([center.lat(), center.lng(), zoom]);
            }
        }
    }, [map, initialMapValues]);


    // --- Define the `onUpdate` callback for the controller ---
    /*const handleMapUpdate = useCallback((currentValues: number[]) => {
        if (!map || currentValues.length < 3) return;
        const [currentLat, currentLng, currentZoom] = currentValues;
        map.setCenter({ lat: currentLat, lng: currentLng });
        map.setZoom(currentZoom);
    }, [map]);*/


    // onMapClick is NO LONGER defined here

    return (
        <>
            {/* --- Render Markers (including the conditional noPano marker) --- */}
            {localPanos.map((loc) => (
                <AdvancedMarker key={loc.localId} position={{ lat: loc.lat, lng: loc.lng }} title={`Saved: ${loc.description || 'Untitled'}`}>
                    <Image
                        //SvgComponent={CircleAndArrow}
                        //src={'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/White_Arrow_Up.svg/1024px-White_Arrow_Up.svg.png?20101102112120'}
                        src={'@/media/CircleAndArrow.svg'}
                        alt={'Arrow Pin'}
                        width={30}
                        height={30}
                        style={{
                            width: `30px`,
                            height: `30px`,
                            left: '-15px',
                            top: '-15px',
                            transform: `rotate(${loc.heading}deg)`,
                            transformOrigin: 'center center',
                            objectFit: 'contain',
                        }}
                    />


                </AdvancedMarker>
            ))}
            {displayedPanorama && (
                <AdvancedMarker key={displayedPanorama.localId} position={{ lat: displayedPanorama.lat, lng: displayedPanorama.lng }} >

                    <Image
                        src={'@/media/CircleAndArrow.svg'}
                        alt='Arrow Pin'
                        width={30}
                        height={30}
                        style={{
                            width: `30px`,
                            height: `30px`,
                            transform: `rotate(${displayedPanorama.heading}deg)`,
                            transformOrigin: 'center 29px',
                            objectFit: 'contain',
                            filter: 'brightness(0.7) sepia(0.6) hue-rotate(100deg) saturate(500%)',
                        }}
                    />
                </AdvancedMarker>
            )}
            {/* Use the prop to render the marker */}
            {noPanoMarkerPosition && (
                <AdvancedMarker position={noPanoMarkerPosition} title="No panorama found">
                    <Image src={encodedNoPanoSvgDataUrl} width={24} height={24} alt="No panorama" />
                </AdvancedMarker>
            )}

            {/* --- Utilities / Layers --- */}
            <StreetViewLayerManager />
            {displayedPanorama?.movementHistory && displayedPanorama.movementHistory.length >= 2 && (
                <MovementHistoryPolyline
                    history={displayedPanorama.movementHistory}
                    options={{
                        strokeColor: '#FF0000', // Blue
                        strokeWeight: 4,
                    }}
                />
            )}
        </>
    );
};


// --- Outer Component providing API Context and handling clicks ---
const MapComponent: React.FC = () => {
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    // --- Context needed for the click handler ---
    const { clickedMap, loadNewPanorama } = useLocalEditorContext();

    // --- State for the "No Panorama" marker position (Lifted Up) ---
    const [noPanoMarkerPosition, setNoPanoMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);


    // --- Map Click Handler (Lifted Up) ---
    const onMapClick = useCallback(async (event: MapMouseEvent) => {
        const latLngLiteral = event.detail?.latLng;
        if (!latLngLiteral) return;
        console.log("Map clicked at (outer):", latLngLiteral);
        setNoPanoMarkerPosition(null); // Hide previous marker

        try {
            // clickedMap and loadNewPanorama come from context
            const localPano = await clickedMap(new google.maps.LatLng(latLngLiteral.lat, latLngLiteral.lng));
            console.log("clickedMap result (outer):", localPano);

            if (localPano) {
                loadNewPanorama(localPano);
                // No need to set marker position if pano found
            } else {
                console.log("No panorama found (outer). Setting marker position.");
                setNoPanoMarkerPosition(latLngLiteral); // Set state here
            }
        } catch (error) {
            console.error("Error during map click processing (outer):", error);
            setNoPanoMarkerPosition(latLngLiteral); // Show marker even on error
        }
    }, [clickedMap, loadNewPanorama]); // Dependencies from context


    if (!googleMapsApiKey) {
        return <div>Error: Google Maps API key is missing...</div>;
    }

    return (
        <APIProvider apiKey={googleMapsApiKey} libraries={['marker', 'streetView', 'geometry']}>
            <div style={containerStyle}>
                <Map
                    defaultCenter={defaultCenter}
                    defaultZoom={defaultZoom}
                    mapId={'4213f07b4e56a5ae'}
                    streetViewControl={false}
                    fullscreenControl={false}
                    mapTypeControl={false}
                    clickableIcons={false}
                    gestureHandling={'greedy'}
                    // *** Assign the onClick handler HERE ***
                    onClick={onMapClick}
                >
                    {/* Pass the marker position state down */}
                    <MapComponentContent noPanoMarkerPosition={noPanoMarkerPosition} />
                </Map>
            </div>
        </APIProvider>
    );
};

export default MapComponent;