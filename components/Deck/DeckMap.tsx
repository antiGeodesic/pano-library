
import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { APIProvider, Map, useMap, MapMouseEvent } from '@vis.gl/react-google-maps';
import { PanoramaData } from '@/types/index';
import { MovementHistoryPolyline } from '@/components/LocalEditor/MapComponent/MovementHistoryPolyline';
import { ScatterplotLayer, IconLayer, PathLayer } from '@deck.gl/layers';
// Make sure to import the GoogleMapsOverlay if needed
import { GoogleMapsOverlay } from '@deck.gl/google-maps';

const defaultCenter = {
    //Stockholm
    //lat: 59.36187265426956,
    //lng: 18.089235210029738,
    lat: 0,
    lng: 0
};

const defaultZoom = 2;

// SVG for the "No Panorama Found" Marker
const noPanoSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
  <line x1="18" y1="6" x2="6" y2="18"></line>
  <line x1="6" y1="6" x2="18" y2="18"></line>
</svg>
`;
const encodedNoPanoSvgDataUrl = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(noPanoSvg)}`;
/*const simpleArrowSVG = (heading: number, rgb: { r: number, g: number, b: number }) => { //for future use
  const rotation = heading || 0;
  const color = `rgb(${rgb.r * 255},${rgb.g * 255},${rgb.b * 255})`;

  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <g transform="rotate(${rotation} 12 12)">
      <path d="M12 2L5 12h4v8h6v-8h4L12 2z" fill="${color}" />
    </g>
  </svg>
  `;

};*/
// Arrow SVG for icon layer
const arrowSvg = (heading: number, rgb: { r: number, g: number, b: number }) => {
  const rotation = heading || 0;
  const color = `rgb(${rgb.r * 255},${rgb.g * 255},${rgb.b * 255})`;

  return `
  <svg width="540" height="540" viewBox="0 0 540 540" xmlns="http://www.w3.org/2000/svg">

      <path transform="rotate(${rotation} 0 0)" fill="${color}" stroke="black" stroke-width="25" stroke-linecap="round" stroke-linejoin="round" d="M 300 205 L 300 120 L 350 160 C 380 130 350 100 350 100 L 285.867 33.838 C 281.259 29.231 275.174 26.9 269.075 26.886 C 262.976 26.873 256.863 29.177 252.2 33.84 L 190 100 C 190 100 160 130 190 160 L 240 120 L 240 205 L 235 209.5 C 188.3 236.4 188.3 303.8 235 330.7 C 256.7 343.2 283.3 343.2 305 330.7 C 351.7 303.8 351.7 236.4 305 209.5 L 300 205 Z"/>

      </svg>
  `;
};
  
class CoordMapType implements google.maps.MapType {
  tileSize: google.maps.Size;
  alt: string | null = null;
  maxZoom: number = 19;
  minZoom: number = 2;
  name: string | null = 'StreetViewThinLines';
  projection: google.maps.Projection | null = null;
  radius: number = 6378137;

  constructor(tileSize: google.maps.Size, private opacity = 1) {
    this.tileSize = tileSize;
  }

  getTile(
    coord: google.maps.Point,
    zoom: number,
    ownerDocument: Document
  ): HTMLElement {
    const div = ownerDocument.createElement("div");
    const tileUrl = `https://maps.googleapis.com/maps/vt?pb=!1m7!8m6!1m3!1i${zoom}!2i${coord.x}!3i${coord.y}!2i9!3x1!2m8!1e2!2ssvv!4m2!1scc!2s*211m3*211e2*212b1*213e2*212b1*214b1!4m2!1ssvl!2s*211b0*212b1!3m8!2sen!3sus!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m4!1e0!8m2!1e1!1e1!6m6!1e12!2i2!11e0!39b0!44e0!50e`;

    const img = ownerDocument.createElement("img");
    img.src = tileUrl;
    img.style.opacity = this.opacity.toString();
    //img.style.filter = 'brightness(3) grayscale(1)';
    img.style.width = this.tileSize.width + "px";
    img.style.height = this.tileSize.height + "px";
    img.style.position = "absolute";
    img.style.left = "0";
    img.style.top = "0";

    div.appendChild(img);
    div.style.width = this.tileSize.width + "px";
    div.style.height = this.tileSize.height + "px";
    div.style.position = "relative";
    div.style.zIndex = "1";

    return div;
  }

  releaseTile(tile: Element): void {
    if(!false) console.log(tile); //So ESLint can shut the fuck up
    // Cleanup if needed
  }
}

interface MapComponentContentProps {
  noPanoMarkerPosition: google.maps.LatLngLiteral | null;
  clickedFromDeckRef: React.RefObject<string>;
  displayedPanos: PanoramaData[];
  displayedPano: PanoramaData | null;
}

const DeckGLWithGoogleMaps: React.FC<MapComponentContentProps> = ({
  noPanoMarkerPosition,
  clickedFromDeckRef,
  displayedPanos,
  displayedPano
}) => {
  const map = useMap();
  const [mapFullyLoaded, setMapFullyLoaded] = useState(false);
  const overlayRef = useRef<GoogleMapsOverlay | null>(null);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  // Create icons once
  const icons = useMemo(() => ({
    arrow: {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(arrowSvg(0, { r: 0, g: 0, b: 0 }))}`,
      width: 540,
      height: 540,
      anchorY: 270,
    },
    highlightedArrow: {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(arrowSvg(0, { r: 1, g: 0, b: 0 }))}`,
      width: 540,
      height: 540,
      anchorY: 270,
    },
    noPano: {
      url: encodedNoPanoSvgDataUrl,
      width: 24,
      height: 24,
      anchorY: 24
    }
  }), []);
  
  // Wait for map to be fully loaded
  useEffect(() => {
    if (!map) return;
    
    // Check if map is already initialized
    if (
      map.getDiv() && 
      map.getDiv().offsetWidth > 0 && 
      map.getDiv().offsetHeight > 0 &&
      map.getCenter() !== undefined &&
      map.getZoom() !== undefined
    ) {
      setMapFullyLoaded(true);
      return;
    }

    // Otherwise wait for the idle event
    const idleListener = map.addListener('idle', () => {
      if (
        map.getDiv() && 
        map.getDiv().offsetWidth > 0 && 
        map.getDiv().offsetHeight > 0
      ) {
        setMapFullyLoaded(true);
        google.maps.event.removeListener(idleListener);
      }
    });
    
    return () => {
      if (idleListener) {
        google.maps.event.removeListener(idleListener);
      }
    };
  }, [map]);

  // Initialize the overlay when map is fully loaded
  useEffect(() => {
    if (!map || !mapFullyLoaded || overlayRef.current) return;
    
    try {
      console.log("Creating GoogleMapsOverlay");
      // Create the overlay
      const overlay = new GoogleMapsOverlay({
        pickingRadius: 5
      });
      
      // Store reference
      overlayRef.current = overlay;
      
      // Set the map
      overlay.setMap(map);
      console.log("GoogleMapsOverlay created and attached to map");
    } catch (err) {
      console.error("Error initializing overlay:", err);
    }
    
    return () => {
      if (overlayRef.current) {
        try {
          overlayRef.current.finalize();
          overlayRef.current.setMap(null);
          overlayRef.current = null;
        } catch (err) {
          console.error("Error cleaning up overlay:", err);
        }
      }
    };
  }, [map, mapFullyLoaded]);

  // Custom map overlay
  const coordMapType = useMemo(() => {
    if (google?.maps?.Size) {
      return new CoordMapType(new google.maps.Size(256, 256), 1);
    }
    return null;
  }, []);

  // Add custom tile overlay once
  useEffect(() => {
    if (map && coordMapType) {
      map.overlayMapTypes.insertAt(0, coordMapType);
      
      return () => {
        for (let i = 0; i < map.overlayMapTypes.getLength(); i++) {
          if (map.overlayMapTypes.getAt(i) === coordMapType) {
            map.overlayMapTypes.removeAt(i);
            break;
          }
        }
      };
    }
  }, [map, coordMapType]);

  // Prepare and update layers when data changes
  useEffect(() => {
    if (!overlayRef.current) return;
    
    // Prepare data
    const locationData = displayedPanos.map(loc => {

        const isHovered = loc.localId === hoveredId;

        return {
            position: [loc.lng, loc.lat],
            icon: isHovered ? icons.highlightedArrow : icons.arrow,
      angle: loc.heading || 0,
      id: loc.localId,
        }
      
    });
    
    const highlightedLocation = displayedPano ? [{
      position: [displayedPano.lng, displayedPano.lat],
      icon: icons.highlightedArrow,
      angle: displayedPano.heading || 0,
      id: displayedPano.localId,
    }] : [];
    
    const noPanoData = noPanoMarkerPosition ? [{
      position: [noPanoMarkerPosition.lng, noPanoMarkerPosition.lat],
      icon: icons.noPano,
      angle: 0,
      id: 'no-pano-marker',
    }] : [];
    
    const pathData = (displayedPano?.movementHistory && displayedPano.movementHistory.length >= 2) ? [{
      path: displayedPano.movementHistory.map(point => [point.lng, point.lat]),
      color: [255, 0, 0, 255],
      width: 4,
    }] : [];
    
    console.log("Updating layers with data:", {
      locations: locationData.length,
      highlighted: highlightedLocation.length,
      noPano: noPanoData.length,
      paths: pathData.length
    });

    // Debug data format if empty but expected data
    if (locationData.length === 0 && displayedPanos.length > 0) {
      console.log("Warning: displayedPanos has data but locationData is empty", displayedPanos);
    }
    
    // Add a debug point at map center for visibility testing
    const debugData = [{
      position: [defaultCenter.lng, defaultCenter.lat],
      radius: 50,
      color: [0, 0, 255]
    }];
    
    try {
      // Create layers
      const layers = [
        // Debug layer to verify rendering works
        new ScatterplotLayer({
          id: 'debug-layer',
          data: debugData,
          getPosition: d => d.position,
          getRadius: d => d.radius,
          getFillColor: d => d.color,
          pickable: true,
        }),
        new IconLayer({
            id: 'location-layer',
            data: locationData,
            pickable: true,
            //iconMapping: {},
          
            getIcon: d => d.icon,
          
            getPosition: d => d.position,
            getSize: d => (d.id === hoveredId ? 50 : 40),
            getAngle: d => d.angle,
            getColor: d => (d.id === hoveredId ? [0, 255, 0] : [255, 255, 255]),
          
            sizeScale: 1,
            opacity: 1,
          
            onHover: ({ object }) => {
              setHoveredId(object ? object.id : null);
            },
            
            /*onClick: ({ object }) => {
              if (object) {
                console.log(`Clicked pano with ID: ${object.id}`);
              }
            }*/
              onClick: info => {
                if (info.object) {
                  clickedFromDeckRef.current = info.object.id; // flag that DeckGL handled the click
                }
              }
          }),
        new IconLayer({
          id: 'highlighted-location-layer',
          data: highlightedLocation,
          getIcon: d => d.icon,
          getPosition: d => d.position,
          getSize: 50,
          getAngle: d => d.angle,
          pickable: true,
          parameters: { depthTest: false }
        }),
        new IconLayer({
          id: 'no-pano-layer',
          data: noPanoData,
          getIcon: d => d.icon,
          getPosition: d => d.position,
          getSize: 50,
          pickable: true,
        }),
        new PathLayer({
          id: 'movement-history-layer',
          data: pathData,
          getPath: d => d.path,
          getColor: d => d.color,
          getWidth: d => d.width,
          pickable: true,
        })
      ];
      
      // Update overlay with new layers
      overlayRef.current.setProps({ layers });
    } catch (err) {
      console.error("Error updating layers:", err);
    }
  }, [
    displayedPanos,
    displayedPano,
    noPanoMarkerPosition,
    icons.arrow,
    icons.highlightedArrow,
    icons.noPano,
    hoveredId,
    clickedFromDeckRef
  ]);

  return (
    <>
      {displayedPano?.movementHistory && displayedPano.movementHistory.length >= 2 && (
        <MovementHistoryPolyline
          history={displayedPano.movementHistory}
          options={{ strokeColor: '#FF0000', strokeWeight: 4 }}
        />
      )}
    </>
  );
};

// Main component
interface DeckMapProps {
    clickedMap: (latLng: google.maps.LatLng) => Promise<PanoramaData | null>;
    loadNewPano: (localPano: PanoramaData ) => void;
    getExistingPanoById: (localId: string) => PanoramaData | undefined;
    loadExistingPanorama: (localPano: PanoramaData ) => void;
    displayedPanos: PanoramaData[];
    displayedPano: PanoramaData | null;
  }
  
  const DeckMap: React.FC<DeckMapProps> = ({
    clickedMap, 
    loadNewPano,
    getExistingPanoById,
    loadExistingPanorama,
    displayedPanos,
    displayedPano
  }) => {
  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const [noPanoMarkerPosition, setNoPanoMarkerPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const clickedFromDeckRef = useRef("");

  console.log("[DeckMap]-(1): ");
  
  // Map Click Handler
  const onMapClick = useCallback(async (event: MapMouseEvent) => {
    if (clickedFromDeckRef.current != "") {
      // Reset the flag and ignore this click
      //clickedFromDeckRef.current = false;
      console.warn("----------Clicked from deck ref")
      console.warn(clickedFromDeckRef.current)
      const localPano = getExistingPanoById(clickedFromDeckRef.current)
      if(localPano) {
        loadExistingPanorama(localPano)
      }
      
      clickedFromDeckRef.current = ""
      return;
    }
  
    const latLngLiteral = event.detail?.latLng;
    if (!latLngLiteral) return;
    setNoPanoMarkerPosition(null);
  
    try {
      const localPano = await clickedMap(new google.maps.LatLng(latLngLiteral.lat, latLngLiteral.lng));
  
      if (localPano) {
        loadNewPano(localPano);
      } else {
        setNoPanoMarkerPosition(latLngLiteral);
      }
    } catch (error) {
      console.error("Error during map click processing:", error);
      setNoPanoMarkerPosition(latLngLiteral);
    }
  }, [clickedMap, loadNewPano, loadExistingPanorama, getExistingPanoById]);
  /*const onMapClick = useCallback(async (event: MapMouseEvent) => {
    const latLngLiteral = event.detail?.latLng;
    if (!latLngLiteral) return;
    setNoPanoMarkerPosition(null);

    try {
      const localPano = await clickedMap(new google.maps.LatLng(latLngLiteral.lat, latLngLiteral.lng));

      if (localPano) {
        loadNewPanorama(localPano);
      } else {
        setNoPanoMarkerPosition(latLngLiteral);
      }
    } catch (error) {
      console.error("Error during map click processing:", error);
      setNoPanoMarkerPosition(latLngLiteral);
    }
  }, [clickedMap, loadNewPanorama]);*/

  if (!googleMapsApiKey) {
    return <div>Error: Google Maps API key is missing...</div>;
  }

  return (
    <APIProvider apiKey={googleMapsApiKey} libraries={['marker', 'streetView', 'geometry']}>
      <div style={{
  width: '100%',
  height: '100%',
  position: 'relative',
}}>
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          mapId={'4213f07b4e56a5ae'}
          streetViewControl={false}
          fullscreenControl={true}
          mapTypeControl={true}
          clickableIcons={false}
          gestureHandling={'greedy'}
          reuseMaps={true}
          onClick={(event) => onMapClick(event)}
        >
          <DeckGLWithGoogleMaps
            noPanoMarkerPosition={noPanoMarkerPosition}
            clickedFromDeckRef={clickedFromDeckRef}
            displayedPanos={displayedPanos}
            displayedPano={displayedPano}
          />
        </Map>
      </div>
    </APIProvider>
  );
};

export default DeckMap;


