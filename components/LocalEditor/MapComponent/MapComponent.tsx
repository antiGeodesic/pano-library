/*
const StreetViewLayerManager: React.FC = () => {
    const map = useMap(); // Get map instance from context

    useEffect(() => {
        if (!map) return; // Wait for map instance

        // Check if StreetViewCoverageLayer constructor is available
        if (!google.maps.StreetViewCoverageLayer) {
            console.warn("StreetViewCoverageLayer not available. Ensure 'streetView' library is loaded via APIProvider.");
            return;
        }

        //-commented-console.log("Adding StreetViewCoverageLayer");
        const svLayer = new google.maps.StreetViewCoverageLayer();
        svLayer.setMap(map);

        // Cleanup function to remove layer when component unmounts or map changes
        return () => {
            //-commented-console.log("Removing StreetViewCoverageLayer");
            svLayer.setMap(null);
        };
    }, [map]); // Re-run effect if map instance changes

    return null; // This component doesn't render anything itself
};
const LAYERS = {
	thin: (x: number,y: number,z: number) => `https://maps.googleapis.com/maps/vt?pb=!1m7!8m6!1m3!1i${z}!2i${x}!3i${y}!2i9!3x1!2m8!1e2!2ssvv!4m2!1scc!2s*211m3*211e2*212b1*213e2*212b1*214b1!4m2!1ssvl!2s*211b0*212b1!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m4!1e0!8m2!1e1!1e1!6m6!1e12!2i2!11e0!39b0!44e0!50e`,
	fat: (x: number,y: number,z: number) => `https://mts1.googleapis.com/vt?hl=en-US&lyrs=svv|cb_client:app&style=5,8&x=${x}&y=${y}&z=${z}`,
}
function tileCacheKey(x: number,y: number,zoom: number, layerType: string) {
    if(layerType == 'thin') return `https://maps.googleapis.com/maps/vt?pb=!1m7!8m6!1m3!1i${zoom}!2i${x}!3i${y}!2i9!3x1!2m8!1e2!2ssvv!4m2!1scc!2s*211m3*211e2*212b1*213e2*212b1*214b1!4m2!1ssvl!2s*211b0*212b1!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m4!1e0!8m2!1e1!1e1!6m6!1e12!2i2!11e0!39b0!44e0!50e`
	return `https://mts1.googleapis.com/vt?hl=en-US&lyrs=svv|cb_client:app&style=5,8&x=${x}&y=${y}&z=${zoom}`;
    //tileCacheKey(coord.x, coord.y, zoom, zoom > 10 ? 'thin' : 'fat')
    //  div.innerHTML = `
    //        ${  //zoom > 5 ?
    //            //`<img src="https://maps.googleapis.com/maps/vt?pb=!1m7!8m6!1m3!1i${zoom}!2i${coord.x}!3i${coord.y}!2i9!3x1!2m8!1e2!2ssvv!4m2!1scc!2s*211m3*211e2*212b1*213e2*212b1*214b1!4m2!1ssvl!2s*211b0*212b1!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m4!1e0!8m2!1e1!1e1!6m6!1e12!2i2!11e0!39b0!44e0!50e"/>`
    //            //:
    //            //`<img src="https://mts1.googleapis.com/vt?hl=en-US&lyrs=svv|cb_client:app&style=5,8&x=${coord.x}&y=${coord.y}&z=${zoom}"/>`
    //            `<img src="${tileCacheKey(coord.x, coord.y, zoom, zoom > 7 ? 'thin' : 'fat')}"/>`
    //        }
    //        
    //        
    //  `;
    //}


    {<StreetViewLayerManager />}
*/


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//import React, { useCallback, useState, useEffect } from 'react';
//import { AdvancedMarker, APIProvider, Map, useMap, MapMouseEvent } from '@vis.gl/react-google-maps';
//import { useLocalEditorContext } from '@/contexts/LocalEditorContext';
//import { MovementHistoryPolyline } from './MovementHistoryPolyline';
//import { ArrowSvg } from './ArrowSvg';
//import Image from 'next/image'
//
//
//const containerStyle = {
//    width: '100%',
//    height: '100%',
//
//};
//
//const defaultCenter = {
//    lat: 0,
//    lng: 0,
//};
//
//const defaultZoom = 8;
//
//// --- Custom SVG for the "No Panorama Found" Marker (keep as is) ---
//const noPanoSvg = `
//<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
//  <line x1="18" y1="6" x2="6" y2="18"></line>
//  <line x1="6" y1="6" x2="18" y2="18"></line>
//</svg>
//`;
//// Use the SVG directly in an img tag's src
//const encodedNoPanoSvgDataUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(noPanoSvg)}`;
//
//interface MapComponentContentProps {
//    noPanoMarkerPosition: google.maps.LatLngLiteral | null; // Receive position as prop
//}
//
//class CoordMapType implements google.maps.MapType {
//    tileSize: google.maps.Size;
//    alt: string|null = null;
//    maxZoom: number = 17;
//    minZoom: number = 0;
//    name: string|null = null;
//    projection: google.maps.Projection|null = null;
//    radius: number = 6378137;
//
//    constructor(tileSize: google.maps.Size) {
//      this.tileSize = tileSize;
//    }
//    getTile(
//      coord: google.maps.Point,
//      zoom: number,
//      ownerDocument: Document
//    ): HTMLElement {
//      const div = ownerDocument.createElement("div");
//
//    
//    div.innerHTML = `
//        <img src="https://maps.googleapis.com/maps/vt?pb=!1m7!8m6!1m3!1i${zoom}!2i${coord.x}!3i${coord.y}!2i9!3x1!2m8!1e2!2ssvv!4m2!1scc!2s*211m3*211e2*212b1*213e2*212b1*214b1!4m2!1ssvl!2s*211b0*212b1!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m4!1e0!8m2!1e1!1e1!6m6!1e12!2i2!11e0!39b0!44e0!50e"/>
//        <p style="color:red;">(${coord.x}, ${coord.y})</p>
//        <p style="color:blue;"> ${zoom} </p>
//    `;
//
//      div.style.zIndex = "-1"
//      div.style.width = this.tileSize.width + "px";
//      div.style.height = this.tileSize.height + "px";
//      div.style.fontSize = "10";
//      div.style.borderStyle = "solid";
//      div.style.borderWidth = "1px";
//      div.style.borderColor = "#AAAAAA";
//      return div;
//    }
//    releaseTile(tile: Element): void {//-commented-console.log(tile)}
//    
//  }
//  
//const MapComponentContent: React.FC<MapComponentContentProps> = ({
//    noPanoMarkerPosition // Destructure the prop
//}) => {
//    // Still needs context for localPanos and displayedPanorama for rendering markers
//    const { localPanos, displayedPanorama } = useLocalEditorContext();
//    const map = useMap(); // Hook still needed here for MapPanController/AnimatedValuesController if it uses map
//
//
//    const coordMapType = new CoordMapType(new google.maps.Size(256, 256))
//
//    map?.overlayMapTypes.insertAt(
//        0,
//        coordMapType
//    );
//    // --- Get initial map state ---
//    const [initialMapValues, setInitialMapValues] = useState<number[] | undefined>();
//    useEffect(() => {
//        if (map && !initialMapValues) {
//            const center = map.getCenter();
//            const zoom = map.getZoom();
//            if (center && zoom !== undefined) {
//                setInitialMapValues([center.lat(), center.lng(), zoom]);
//            }
//        }
//    }, [map, initialMapValues]);
//
//
//
//
//    return (
//        <>
//            {/* --- Render Markers (including the conditional noPano marker) --- */}
//            {localPanos.map((loc) => (
//                <AdvancedMarker key={loc.localId} position={{ lat: loc.lat, lng: loc.lng }} title={`Saved: ${loc.description || 'Untitled'}`}>
//                    <ArrowSvg heading={loc.heading} size={45} rgb={{r: 0, g: 0, b: 0}} />
//                </AdvancedMarker>
//            ))}
//            {displayedPanorama && (
//                <AdvancedMarker key={displayedPanorama.localId} position={{ lat: displayedPanorama.lat, lng: displayedPanorama.lng }} >
//                    <ArrowSvg heading={displayedPanorama.heading} size={45} rgb={{r: 1, g: 0, b: 0}} />
//                </AdvancedMarker>
//            )}
//            {/* Use the prop to render the marker */}
//            {noPanoMarkerPosition && (
//                <AdvancedMarker position={noPanoMarkerPosition} title="No panorama found">
//                    
//                    <Image src={encodedNoPanoSvgDataUrl} width={24} height={24} alt="No panorama" />
//                </AdvancedMarker>
//            )}
//
//            {/* --- Utilities / Layers --- */}
//            
//            {displayedPanorama?.movementHistory && displayedPanorama.movementHistory.length >= 2 && (
//                <MovementHistoryPolyline
//                    history={displayedPanorama.movementHistory}
//                    options={{
//                        strokeColor: '#FF0000', // Blue
//                        strokeWeight: 4,
//                    }}
//                />
//            )}
//        </>
//    );
//};
//
//
//// --- Outer Component providing API Context and handling clicks ---
//const MapComponent: React.FC = () => {
//    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
//    // --- Context needed for the click handler ---
//    const { clickedMap, loadNewPanorama } = useLocalEditorContext();
//
//    // --- State for the "No Panorama" marker position (Lifted Up) ---
//    const [noPanoMarkerPosition, setNoPanoMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
//
//
//    // --- Map Click Handler (Lifted Up) ---
//    const onMapClick = useCallback(async (event: MapMouseEvent) => {
//        const latLngLiteral = event.detail?.latLng;
//        if (!latLngLiteral) return;
//        //-commented-console.log("Map clicked at (outer):", latLngLiteral);
//        setNoPanoMarkerPosition(null); // Hide previous marker
//
//        try {
//            // clickedMap and loadNewPanorama come from context
//            const localPano = await clickedMap(new google.maps.LatLng(latLngLiteral.lat, latLngLiteral.lng));
//            //-commented-console.log("clickedMap result (outer):", localPano);
//
//            if (localPano) {
//                loadNewPanorama(localPano);
//                // No need to set marker position if pano found
//            } else {
//                //-commented-console.log("No panorama found (outer). Setting marker position.");
//                setNoPanoMarkerPosition(latLngLiteral); // Set state here
//            }
//        } catch (error) {
//            console.error("Error during map click processing (outer):", error);
//            setNoPanoMarkerPosition(latLngLiteral); // Show marker even on error
//        }
//    }, [clickedMap, loadNewPanorama]); // Dependencies from context
//
//
//    if (!googleMapsApiKey) {
//        return <div>Error: Google Maps API key is missing...</div>;
//    }
//
//    return (
//        <APIProvider apiKey={googleMapsApiKey} libraries={['marker', 'streetView', 'geometry']}>
//            <div style={containerStyle}>
//                <Map
//                    defaultCenter={defaultCenter}
//                    defaultZoom={defaultZoom}
//                    mapId={'4213f07b4e56a5ae'}
//                    streetViewControl={false}
//                    fullscreenControl={false}
//                    mapTypeControl={false}
//                    clickableIcons={false}
//                    gestureHandling={'greedy'}
//                    // *** Assign the onClick handler HERE ***
//                    onClick={onMapClick}
//                >
//                    {/* Pass the marker position state down */}
//                    <MapComponentContent noPanoMarkerPosition={noPanoMarkerPosition} />
//                </Map>
//            </div>
//        </APIProvider>
//    );
//};
//
//export default MapComponent;

import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { AdvancedMarker, APIProvider, Map, useMap, MapMouseEvent } from '@vis.gl/react-google-maps';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext';
import { MovementHistoryPolyline } from '@/components/LocalEditor/MapComponent/MovementHistoryPolyline';
import { ArrowSvg } from '@/components/LocalEditor/MapComponent/ArrowSvg';

//
const containerStyle = {
    width: '100%',
    height: '100%',
//
};
//
const defaultCenter = {
    lat: 59.36187265426956, 
    lng: 18.089235210029738,
};
//
const defaultZoom = 12;
//
// --- Custom SVG for the "No Panorama Found" Marker (keep as is) ---
const noPanoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>
`;
// Use the SVG directly in an img tag's src
const encodedNoPanoSvgDataUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(noPanoSvg)}`;
//
interface MapComponentContentProps {
    noPanoMarkerPosition: google.maps.LatLngLiteral | null; // Receive position as prop
}

//
// MapComponent.tsx (or wherever MapComponentContent is)


// --- Custom Map Type Class (Keep definition as is, but fix zIndex) ---
class CoordMapType implements google.maps.MapType {
    tileSize: google.maps.Size;
    alt: string|null = null;
    maxZoom: number = 19; // Often 19 or higher for street view tiles
    minZoom: number = 0;
    name: string|null = 'StreetViewThinLines'; // Give it a name
    projection: google.maps.Projection|null = null;
    radius: number = 6378137;

    constructor(tileSize: google.maps.Size) {
      this.tileSize = tileSize;
    }
    getTile(
      coord: google.maps.Point,
      zoom: number,
      ownerDocument: Document
    ): HTMLElement {
      const div = ownerDocument.createElement("div");

      // Construct the tile URL (same as before)
      const tileUrl = `https://maps.googleapis.com/maps/vt?pb=!1m7!8m6!1m3!1i${zoom}!2i${coord.x}!3i${coord.y}!2i9!3x1!2m8!1e2!2ssvv!4m2!1scc!2s*211m3*211e2*212b1*213e2*212b1*214b1!4m2!1ssvl!2s*211b0*212b1!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m4!1e0!8m2!1e1!1e1!6m6!1e12!2i2!11e0!39b0!44e0!50e`;

      // Use an Image element for better loading/error handling (optional but good practice)
      const img = ownerDocument.createElement("img");
      img.src = tileUrl;
      img.style.width = this.tileSize.width + "px";
      img.style.height = this.tileSize.height + "px";
      img.style.position = "absolute"; // Position within the div
      img.style.left = "0";
      img.style.top = "0";

      div.appendChild(img);

      // Remove debug paragraphs for performance
      // div.innerHTML = `<img src="${tileUrl}"/><p>...</p>`; // Avoid innerHTML if possible

      div.style.width = this.tileSize.width + "px";
      div.style.height = this.tileSize.height + "px";
      div.style.position = "relative"; // Needed for absolute positioning of img

      // *** Use a positive zIndex for overlays ***
      div.style.zIndex = "1"; // Or another appropriate positive value

      // Optional: Add border for debugging tile boundaries
      // div.style.border = "1px solid rgba(255, 0, 0, 0.5)";

      return div;
    }
    releaseTile(tile: Element): void {
        // Optional: Cleanup if needed, e.g., remove event listeners if added

        //Making ESLint shut the fuck up
        if(false) console.log("Releasing tile:", tile);
    }
  }


// --- Map Component Content ---
const MapComponentContent: React.FC<MapComponentContentProps> = ({
    noPanoMarkerPosition
}) => {
    const { localPanos, displayedPanorama } = useLocalEditorContext();
    const map = useMap();
    
    // --- Create the CoordMapType instance ONLY ONCE using useMemo ---
    const coordMapType = useMemo(() => {
        //-commented-console.log("Creating CoordMapType instance (should happen once)");
        // Ensure google.maps is loaded before accessing Size
        if (google?.maps?.Size) {
           return new CoordMapType(new google.maps.Size(256, 256));
        }
        return null; // Return null if google.maps isn't ready
    }, []); // Empty dependency array ensures it's created only once


    // --- Add/Remove the overlay using useEffect ---
    useEffect(() => {
        if (map && coordMapType) {
            //-commented-console.log("Adding custom overlay to map");
            // Add the memoized instance to the map's overlay types
            map.overlayMapTypes.insertAt(0, coordMapType);

            // --- Return cleanup function ---
            return () => {
                //-commented-console.log("Removing custom overlay from map");
                // Find and remove the specific instance on cleanup
                let found = false;
                for (let i = 0; i < map.overlayMapTypes.getLength(); i++) {
                    if (map.overlayMapTypes.getAt(i) === coordMapType) {
                        map.overlayMapTypes.removeAt(i);
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    console.warn("Could not find custom overlay instance to remove.");
                }
            };
        }
        // Cleanup function runs if map or coordMapType instance changes (or on unmount)
    }, [map, coordMapType]); // Depend on map instance and the memoized type instance
    
    if(!map)
        return null;
    const mapBounds: google.maps.LatLngBounds | undefined = map.getBounds();
    if(!mapBounds)
        return null;
    const max = mapBounds.getNorthEast();
    const min = mapBounds.getSouthWest();
    const isInBounds = (lat: number, lng: number): boolean => {
        return (lat < max.lat() && lat > min.lat() && lng < max.lng() && lng > min.lng())
    }
    console.log("max: (", max.lng(), ", ", max.lat(), "), min: (", min.lng(), ", ", min.lat(), ")");
    return (
        <>
            {/* --- Markers --- */}
             {localPanos.map((loc, index) => isInBounds(loc.lat, loc.lng) && (
                
                 <AdvancedMarker key={loc.localId} position={{ lat: loc.lat, lng: loc.lng }} zIndex={index}>
                     <ArrowSvg heading={loc.heading} size={45} rgb={{r: 0, g: 0, b: 0}} />
                 </AdvancedMarker>
             ))}
             {displayedPanorama && (
                 <AdvancedMarker key={displayedPanorama.localId} position={{ lat: displayedPanorama.lat, lng: displayedPanorama.lng }} >
                     <ArrowSvg heading={displayedPanorama.heading} size={45} rgb={{r: 1, g: 0, b: 0}} />
                     
                 </AdvancedMarker>
                 
             )}
             {noPanoMarkerPosition && (
                 <AdvancedMarker position={noPanoMarkerPosition} title="No panorama found">
                     {/* If using Next Image for optimization */}
                     {/* <Image src={encodedNoPanoSvgDataUrl} width={24} height={24} alt="No panorama" unoptimized /> */}
                     {/* Or standard img if Image component causes issues here */}
                      <img src={encodedNoPanoSvgDataUrl} width={24} height={24} alt="No panorama" />
                 </AdvancedMarker>
             )}

            {/* --- Utilities / Layers --- */}
            {/* Render MovementHistoryPolyline etc. */}
            {displayedPanorama?.movementHistory && displayedPanorama.movementHistory.length >= 2 && (
                <MovementHistoryPolyline
                    history={displayedPanorama.movementHistory}
                    options={{ strokeColor: '#FF0000', strokeWeight: 4 }}
                />
            )}

            {/* Remove Animation Controller if pan/zoom animation is not needed anymore */}
            {/* {targetValues.length > 0 && ( <AnimatedValuesController ... /> )} */}
        </>
    );
};

//
//
// --- Outer Component providing API Context and handling clicks ---
const MapComponent: React.FC = () => {
    const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    // --- Context needed for the click handler ---
    const { clickedMap, loadNewPanorama } = useLocalEditorContext();
//
    // --- State for the "No Panorama" marker position (Lifted Up) ---
    const [noPanoMarkerPosition, setNoPanoMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
//
//
    // --- Map Click Handler (Lifted Up) ---
    const onMapClick = useCallback(async (event: MapMouseEvent) => {
        const latLngLiteral = event.detail?.latLng;
        if (!latLngLiteral) return;
        //-commented-console.log("Map clicked at (outer):", latLngLiteral);
        setNoPanoMarkerPosition(null); // Hide previous marker
//
        try {
            // clickedMap and loadNewPanorama come from context
            const localPano = await clickedMap(new google.maps.LatLng(latLngLiteral.lat, latLngLiteral.lng));
            //-commented-console.log("clickedMap result (outer):", localPano);
//
            if (localPano) {
                loadNewPanorama(localPano);
                // No need to set marker position if pano found
            } else {
                //-commented-console.log("No panorama found (outer). Setting marker position.");
                setNoPanoMarkerPosition(latLngLiteral); // Set state here
            }
        } catch (error) {
            console.error("Error during map click processing (outer):", error);
            setNoPanoMarkerPosition(latLngLiteral); // Show marker even on error
        }
    }, [clickedMap, loadNewPanorama]); // Dependencies from context
//
//
    if (!googleMapsApiKey) {
        return <div>Error: Google Maps API key is missing...</div>;
    }
//
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
                    <MapComponentContent noPanoMarkerPosition={noPanoMarkerPosition} />
                </Map>
            </div>
        </APIProvider>
    );
};
//
export default MapComponent;