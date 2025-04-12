import React, { useRef, useEffect } from 'react';
import { PanoramaData } from '@/types/index';

interface StreetViewComponentProps {
  initialPano: PanoramaData | null,
  pendingPano: PanoramaData | null,
  setPendingPano: (panoramaData: PanoramaData | null) => void,
  updateCurrentPos: (panoId: string, lat: number, lng: number) => void,
  updateCurrentPov: (heading: number, pitch: number, zoom: number) => void,
}
const streetViewPanoramaStyles = {
  width: '100%',
  height: '100%',
};
const StreetViewComponent: React.FC<StreetViewComponentProps> = ({ initialPano, pendingPano, setPendingPano, updateCurrentPos, updateCurrentPov }) => {
    //const { currentPanorama, pendingPanorama, setPendingPanorama, updateCurrentPos, updateCurrentPov } = useLocalEditorContext();
    //-commented-console.log("[StreetViewComponent] - Initialized")
    const streetViewRef = useRef<HTMLDivElement>(null);
    const panoramaRef = useRef<google.maps.StreetViewPanorama>(null);
    const panoListenerRef = useRef<google.maps.MapsEventListener | null>(null);
    const povListenerRef = useRef<google.maps.MapsEventListener | null>(null);
   //commented-console.log("initial Pano:", initialPano)

    //if(initialPano?.panoId == displayedPanorama?.panoId &&displayedPanorama?.panoId != panoramaRef.current?.getPano()) panoramaRef.current = null;

    useEffect(() => {
        const panoramaOptions: google.maps.StreetViewPanoramaOptions = pendingPano ? 
        {
            pano: pendingPano?.panoId ?? "Zyr6Q4_9hDBQB9F-DweeFQ",
            //position: initialPano?.panoId ?{ lat: 0, lng : 0 }:{ lat: initialPano?.lat ?? 0, lng: initialPano?.lng ?? 0 },
            pov: { heading: pendingPano?.heading ?? 0, pitch: pendingPano?.pitch ?? 0 },
            zoom: pendingPano?.zoom ?? 1,
        }
        :
        {
            pano: initialPano?.panoId ?? "Zyr6Q4_9hDBQB9F-DweeFQ",
            //position: initialPano?.panoId ?{ lat: 0, lng : 0 }:{ lat: initialPano?.lat ?? 0, lng: initialPano?.lng ?? 0 },
            pov: { heading: initialPano?.heading ?? 0, pitch: initialPano?.pitch ?? 0 },
            zoom: initialPano?.zoom ?? 1,
        };
        //-commented-console.log("AAAAAAAAAAAAAA")
        if (streetViewRef.current && initialPano) {
           //commented-console.log("[StreetViewComponent] - 1:", initialPano.panoId)
            if (!panoramaRef.current || pendingPano) {
               //commented-console.log("[StreetViewComponent] - 2:", initialPano.panoId)
                panoramaRef.current = new google.maps.StreetViewPanorama(streetViewRef.current, panoramaOptions);

            }

            if (panoramaRef.current && !panoListenerRef.current) {
                panoListenerRef.current = google.maps.event.addListener(panoramaRef.current, 'position_changed', () => {
                    if (!panoramaRef.current) return;
                   //commented-console.warn("[STreetViewComponent] - new PanoId: ", panoramaRef.current.getPano())
                    const coord = panoramaRef.current.getPosition();
                    const description = panoramaRef.current.getLocation().description;
                    //console.log("panoramaRef------",panoramaRef)
                    //console.log("panoramaRef.current------",panoramaRef.current)
//
                    //console.log("streetViewRef------",streetViewRef)
                   //
                    //console.log("streetViewRef.current------",streetViewRef.current)

                    if(false) console.log(description)
                    if (coord) {
                        const panoId = panoramaRef.current.getPano();
                        const lat = coord.lat();
                        const lng = coord.lng();
                        
                        updateCurrentPos(panoId, lat, lng);
                    }
                });
            }
            if (panoramaRef.current && !povListenerRef.current) {
                povListenerRef.current = google.maps.event.addListener(panoramaRef.current, 'pov_changed', () => {
                    if (!panoramaRef.current) return;
                    const pov = panoramaRef.current.getPov();
                    if (pov) {
                        //-commented-console.log("Pov changed: ", pov.heading)
                        const heading = pov.heading;
                        const lat = pov.pitch;
                        const lng = panoramaRef.current.getZoom();
                        updateCurrentPov(heading, lat, lng);
                    }
                });
            }
            setPendingPano(null);
        }
        return () => {
            // NOTE: This cleanup now runs less often. Listeners persist until initialPano changes
            // or component unmounts. This is generally more stable for event handling.
            const pListener = panoListenerRef.current;
            const vListener = povListenerRef.current;
            if (pListener) {
                google.maps.event.removeListener(pListener);
                panoListenerRef.current = null; // Clear ref on cleanup
                //-commented-console.log("[StreetViewComponent] Cleaned up pano_changed listener.");
            }
            if (vListener) {
                google.maps.event.removeListener(vListener);
                povListenerRef.current = null; // Clear ref on cleanup
                //-commented-console.log("[StreetViewComponent] Cleaned up pov_changed listener.");
            }
            // We DO NOT destroy the panorama instance here, just the listeners associated with the *previous* run of this effect.
            // The instance persists in panoramaRef unless the component fully unmounts.
        };
    }, [initialPano, pendingPano, setPendingPano, updateCurrentPos, updateCurrentPov]);



    return (
        <div style={streetViewPanoramaStyles} ref={streetViewRef}>

        </div>
    );
};

export default StreetViewComponent;

/*import React, { useRef, useEffect } from 'react';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext'; // Adjust path
const StreetViewComponent: React.FC = () => {
  // Get context values needed
  const { initialPano, displayedPanorama, setDisplayedPanorama } = useLocalEditorContext();
 

  // Refs for the DOM element and the Google Maps objects/listeners
  const streetViewRef = useRef<HTMLDivElement>(null);
  // Use state or ref for the panorama instance? Ref is fine as we don't need re-renders based on the instance itself.
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const panoListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const povListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  // Ref to track if an update is programmatic to avoid feedback loops in listeners
  const isProgrammaticUpdate = useRef(false);
    
  useEffect(() => {
    // Ensure the Google Maps API is loaded and the container ref is available
    
    const mapApiReady = google?.maps?.StreetViewPanorama && google?.maps?.event;
    if (!streetViewRef.current || !mapApiReady) {
      //-commented-console.log("[StreetViewComponent] Waiting for API or container ref.");
      return;
    }

    let panorama = panoramaRef.current; // Local variable for easier access

    // --- Initialize Panorama Instance (only once) ---
    if (!panorama) {
      //-commented-console.log("[StreetViewComponent] Initializing StreetViewPanorama instance.");
      const initialOptions: google.maps.StreetViewPanoramaOptions = {
        // Sensible defaults, will be overridden immediately if initialPano exists
        //position: { lat: displayedPanorama.lat, lng: displayedPanorama.lng },
        //pov: { heading: displayedPanorama.heading, pitch:  displayedPanorama.pitch },
        //zoom: displayedPanorama.zoom,
        position: { lat: 0, lng: 0 },
        pov: { heading: 0, pitch: 0 },
        zoom: 0,
        visible: true, // Start hidden until explicitly set
        addressControl: true,
        linksControl: true,
        panControl: true, // Allow user panning
        zoomControl: true, // Allow user zooming
        scrollwheel: true, // Prevent scroll hijacking usually
        fullscreenControl: true,
      };

      panorama = new google.maps.StreetViewPanorama(
        streetViewRef.current,
        initialOptions
      );
      panoramaRef.current = panorama; // Store the instance in the ref

      // --- Attach Listeners (only once on init) ---
      //-commented-console.log("[StreetViewComponent] Adding listeners.");

      // Listener for when the Pano ID or Position changes (user navigation)
      panoListenerRef.current = google.maps.event.addListener(panorama, 'pano_changed', () => {
         if (isProgrammaticUpdate.current) return; // Skip if update was triggered by code below
            const movement: {panoId: string, lat: number, lng: number} = {
                panoId: panorama?.getPano() ?? "",
                lat: panorama?.getPosition()?.lat() ?? 0,
                lng: panorama?.getPosition()?.lng() ?? 0,
            }
         const panoId = panorama?.getPano();
         const position = panorama?.getPosition();
         ////-commented-console.log("[StreetViewComponent] User moved: pano_changed event - ", panoId);
         if (panoId && position && initialPano) {
             // Update displayedPanorama based on the *actual* state of the viewer
             
             setDisplayedPanorama({
                ...(displayedPanorama ?? initialPano), // Keep potentially existing pov/zoom
                ...movement,
                movementHistory: [...(displayedPanorama?.movementHistory ?? initialPano.movementHistory), movement]

             });
            //commented-console.warn(displayedPanorama?.movementHistory ?? "No movement History")
         }
         
      });

      // Listener for when the Point of View (heading/pitch) or Zoom changes
      povListenerRef.current = google.maps.event.addListener(panorama, 'pov_changed', () => {
         if (isProgrammaticUpdate.current) return; // Skip if update was triggered by code below

         const pov = panorama?.getPov();
         const zoom = panorama?.getZoom();
          ////-commented-console.log("[StreetViewComponent] User looked/zoomed: pov_changed event - ", pov, zoom);
         if (pov && typeof zoom === 'number' && initialPano) { // Ensure zoom is a number
             // Update displayedPanorama based on the *actual* state of the viewer
             setDisplayedPanorama({
                ...(displayedPanorama ?? initialPano), // Keep potentially existing pov/zoom
                heading: pov.heading,
                pitch: pov.pitch,
                zoom: zoom,
             });
            //commented-console.warn(displayedPanorama?.heading)
         }
      });
    }


    // --- Synchronize Panorama with external `initialPano` ---
    // This part runs on initial load AND whenever `initialPano` changes.
    if (panorama && displayedPanorama) {
        const currentInstancePano = panorama.getPano();
        const currentInstancePos = panorama.getPosition();

        let needsUpdate = false;

        // Check if Pano ID needs update (Primary Check)
        if (displayedPanorama.panoId && displayedPanorama.panoId !== currentInstancePano) {
            needsUpdate = true;
            //-commented-console.log(`[StreetViewComponent] Syncing: Pano ID mismatch. Target: ${displayedPanorama.panoId}, Current: ${currentInstancePano}`);
        }
        // Check if position needs update (significant change, fallback if no Pano ID)
        else if (currentInstancePos && (
            Math.abs(currentInstancePos.lat() - displayedPanorama.lat) > 1e-6 ||
            Math.abs(currentInstancePos.lng() - displayedPanorama.lng) > 1e-6
        )) {
             // Only consider position change significant if pano ID hasn't changed OR target has no pano ID
            if (!displayedPanorama.panoId || displayedPanorama.panoId === currentInstancePano) {
                needsUpdate = true;
                //-commented-console.log(`[StreetViewComponent] Syncing: Position mismatch. Target: ${displayedPanorama.lat},${displayedPanorama.lng}, Current: ${currentInstancePos.lat()},${currentInstancePos.lng()}`);
            }
        }
         // Add checks for POV and Zoom changes as well if needed, even if pano/pos match
         const currentInstancePov = panorama.getPov();
         const povChanged = !currentInstancePov ||
                            Math.abs(currentInstancePov.heading - displayedPanorama.heading) > 0.1 ||
                            Math.abs(currentInstancePov.pitch - displayedPanorama.pitch) > 0.1;
         const zoomChanged = panorama.getZoom() !== displayedPanorama.zoom;

         if (!needsUpdate && (povChanged || zoomChanged)) {
             needsUpdate = true;
             //-commented-console.log(`[StreetViewComponent] Syncing: POV/Zoom mismatch.`);
         }


        if (needsUpdate) {
            //-commented-console.log("[StreetViewComponent] Applying update from initialPano.");
            isProgrammaticUpdate.current = true; // Set flag before making changes

            // Prioritize setting by Pano ID if available
            if (displayedPanorama.panoId) {
                panorama.setPano(displayedPanorama.panoId);
            } else {
                // Fallback to position if no Pano ID
                panorama.setPosition({ lat: displayedPanorama.lat, lng: displayedPanorama.lng });
            }
            // Always set POV and Zoom to match the target state
            panorama.setPov({ heading: displayedPanorama.heading, pitch: displayedPanorama.pitch });
            panorama.setZoom(displayedPanorama.zoom);
            if (!panorama.getVisible()) {
                panorama.setVisible(true);
            }

             // Reset flag shortly after changes are applied
             // Use timeout to allow Maps API events to potentially fire first
             setTimeout(() => {
                 isProgrammaticUpdate.current = false;
             }, 100); // Adjust timeout if needed, 100ms is usually safe

        } else if (!panorama.getVisible()) {
             // If no update needed, but it's hidden, make it visible
             //-commented-console.log("[StreetViewComponent] Making existing panorama visible.");
             panorama.setVisible(true);
        }

    } else if (panorama && !initialPano) {
      // If the external context clears initialPano, hide the viewer
      //-commented-console.log("[StreetViewComponent] Hiding Panorama (no initialPano).");
      panorama.setVisible(false);
    }

    // --- Effect Cleanup ---
    // This runs when the component unmounts or dependencies change *before* the effect runs again
    return () => {
      // Use stored listener refs in cleanup
      const pListener = panoListenerRef.current;
      const vListener = povListenerRef.current;

      if (pListener || vListener) {
          //-commented-console.log("[StreetViewComponent] Cleaning up listeners.");
          if (pListener) {
              google.maps.event.removeListener(pListener);
              panoListenerRef.current = null;
          }
          if (vListener) {
              google.maps.event.removeListener(vListener);
              povListenerRef.current = null;
          }
      }
      // NOTE: We don't destroy the panorama instance itself here.
      // If the component truly unmounts, React/GC handles it.
      // If only initialPano changes, we want to reuse the instance.
    };

  // Dependencies:
  // - `initialPano`: The primary driver for updating the view programmatically.
  // - `setDisplayedPanorama`: Needed by the listeners (stable reference from context).
  }, [initialPano, displayedPanorama, setDisplayedPanorama]); // Only these two are needed.

  // Render the container div
  return (
    <div ref={streetViewRef} style={{ width: '100%', height: '400px' }}>

    </div>
  );
};

export default StreetViewComponent;*/
/*import React, { useRef, useEffect } from 'react';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext'; // Adjust path, import LocalPano type
import { LocalPano } from '@/types';
const StreetViewComponent: React.FC = () => {
  // Get context values
  const { initialPano, displayedPanorama, setDisplayedPanorama } = useLocalEditorContext();

  // Refs
  const streetViewRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const panoListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const povListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  // Ref to track the Pano ID we last *set* programmatically
  // This helps decide if we need to reset the view when initialPano changes
  const lastSetPanoId = useRef<string | null>(null);

  // --- Effect for Initialization and Synchronization ---
  useEffect(() => {
    const mapApiReady = google?.maps?.StreetViewPanorama && google?.maps?.event;
    if (!streetViewRef.current || !mapApiReady) {
      //-commented-console.log("[StreetViewComponent] Waiting for API or container ref.");
      return;
    }

    let panorama = panoramaRef.current; // Local variable

    // --- Initialize Panorama Instance (only once) ---
    if (!panorama) {
      //-commented-console.log("[StreetViewComponent] Initializing StreetViewPanorama instance.");
      const initialOptions: google.maps.StreetViewPanoramaOptions = {
        position: { lat: 0, lng: 0 }, // Placeholder
        pov: { heading: 0, pitch: 0 },
        zoom: 0,
        visible: false, // Start hidden
        addressControl: false, linksControl: false, panControl: true,
        zoomControl: true, scrollwheel: false, fullscreenControl: false,
      };
      panorama = new google.maps.StreetViewPanorama(streetViewRef.current, initialOptions);
      panoramaRef.current = panorama;

      // --- Attach Listeners (only once on init) ---
      //-commented-console.log("[StreetViewComponent] Adding listeners.");

      panoListenerRef.current = google.maps.event.addListener(panorama, 'pano_changed', () => {
        const panoId = panorama?.getPano();
        const position = panorama?.getPosition();
        //-commented-console.log("[StreetViewComponent] Listener: pano_changed - ", panoId);
        if (panoId && position) {
          // Get the LATEST displayedPanorama value from context *at the time of the event*
          // We access it directly here because functional update isn't allowed by the context type.
          const currentDisplayed = displayedPanorama; // Read the current value

          let newState: LocalPano;
          const lat = position.lat();
          const lng = position.lng();

          if (currentDisplayed === null) {
            // Create a full object if null
            newState = {
              panoId: panoId, lat: lat, lng: lng,
              heading: panoramaRef.current?.getPov()?.heading ?? 0,
              pitch: panoramaRef.current?.getPov()?.pitch ?? 0,
              zoom: panoramaRef.current?.getZoom() ?? 0,
              localId: `temp-pano-${Date.now()}`, date: new Date().toISOString(),
              description: '', tags: [], movementHistory: [],
            };
          } else {
            // Update existing object
            newState = {
              ...currentDisplayed,
              panoId: panoId, lat: lat, lng: lng,
            };
          }
          // Call the context setter with the direct value
          setDisplayedPanorama(newState);
        }
      });

      povListenerRef.current = google.maps.event.addListener(panorama, 'pov_changed', () => {
        const pov = panorama?.getPov();
        const zoom = panorama?.getZoom();
        //-commented-console.log("[StreetViewComponent] Listener: pov_changed - ", pov, zoom);
        if (pov && typeof zoom === 'number') {
           // Get the LATEST displayedPanorama value from context
           const currentDisplayed = displayedPanorama; // Read the current value

           let newState: LocalPano;

           if (currentDisplayed === null) {
             // Create a full object if null
             const currentPos = panoramaRef.current?.getPosition();
             newState = {
                panoId: panoramaRef.current?.getPano() ?? '',
                lat: currentPos?.lat() ?? 0, lng: currentPos?.lng() ?? 0,
                heading: pov.heading, pitch: pov.pitch, zoom: zoom,
                localId: `temp-pov-${Date.now()}`, date: new Date().toISOString(),
                description: '', tags: [], movementHistory: [],
             };
           } else {
              // Update existing object
              newState = {
                ...currentDisplayed,
                heading: pov.heading, pitch: pov.pitch, zoom: zoom,
              };
           }
           // Call the context setter with the direct value
           setDisplayedPanorama(newState);
        }
      });
    } // End of initialization block


    // --- Set/Reset the view based on external `initialPano` ---
    // This runs on initial load and ONLY when `initialPano` reference changes.
    if (panorama && initialPano) {
        if (initialPano.panoId !== lastSetPanoId.current) {
          //-commented-console.log(`[StreetViewComponent] Setting view to new initialPano: ${initialPano.panoId}`);
          panorama.setPano(initialPano.panoId);
          panorama.setPov({ heading: initialPano.heading, pitch: initialPano.pitch });
          panorama.setZoom(initialPano.zoom);
          panorama.setVisible(true);
          // Update the displayed state immediately to match the new source
          setDisplayedPanorama(initialPano); // <<< Call with direct value
          lastSetPanoId.current = initialPano.panoId;
        } else if (!panorama.getVisible()){
           panorama.setVisible(true);
        }
      } else if (panorama && !initialPano) {
        //-commented-console.log("[StreetViewComponent] Hiding Panorama (no initialPano).");
        panorama.setVisible(false);
        lastSetPanoId.current = null;
        // setDisplayedPanorama(null); // Call with direct value if clearing
      }

    // --- Effect Cleanup ---
    return () => {
      // Cleanup listeners on unmount
      const pListener = panoListenerRef.current;
      const vListener = povListenerRef.current;
      if (pListener) google.maps.event.removeListener(pListener);
      if (vListener) google.maps.event.removeListener(vListener);
      // No need to nullify refs here, GC handles it if component unmounts
      // //-commented-console.log("[StreetViewComponent] Cleaned up listeners.");
    };

  // Dependencies: Only `initialPano` to trigger view resets,
  // and `setDisplayedPanorama` for the listeners.
  }, [initialPano, displayedPanorama, setDisplayedPanorama]);

  // Render the container div
  return (
    <div ref={streetViewRef} style={{ width: '100%', height: '400px' }} />
  );
};

export default StreetViewComponent;*/

/*import React, { useRef, useEffect } from 'react';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext';
import { LocalPano } from '@/types'
const StreetViewComponent: React.FC = () => {
  // Get context values
  const { initialPano, displayedPanorama, setDisplayedPanorama } = useLocalEditorContext();

  // Refs for DOM, Maps objects, and stable callbacks/state
  const streetViewRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);
  const panoListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const povListenerRef = useRef<google.maps.MapsEventListener | null>(null);
  const lastSetPanoId = useRef<string | null>(null);

  // Refs to hold the latest state/setters needed inside listeners
  const displayedPanoramaRef = useRef(displayedPanorama);
  const setDisplayedPanoramaRef = useRef(setDisplayedPanorama);

  // Effect to keep the refs updated with the latest values/functions
  useEffect(() => {
    displayedPanoramaRef.current = displayedPanorama;
  }, [displayedPanorama]);

  useEffect(() => {
    setDisplayedPanoramaRef.current = setDisplayedPanorama;
  }, [setDisplayedPanorama]);


  // --- Effect for Initialization and Synchronization ---
  useEffect(() => {
    // This effect now primarily depends on initialPano to trigger resets.
    // It uses refs to access the latest displayedPanorama and setDisplayedPanorama inside listeners.

    const mapApiReady = google?.maps?.StreetViewPanorama && google?.maps?.event;
    if (!streetViewRef.current || !mapApiReady) {
      //-commented-console.log("[StreetViewComponent] Waiting for API or container ref.");
      // Cleanup potential listeners if API becomes ready but ref is still null somehow
      if (panoListenerRef.current) google.maps.event.removeListener(panoListenerRef.current);
      if (povListenerRef.current) google.maps.event.removeListener(povListenerRef.current);
      return;
    }

    let panorama = panoramaRef.current; // Local variable

    // --- Initialize Panorama Instance and Listeners (only once per instance) ---
    if (!panorama) {
      //-commented-console.log("[StreetViewComponent] Initializing StreetViewPanorama instance.");
      const initialOptions: google.maps.StreetViewPanoramaOptions = {
        position: { lat: 0, lng: 0 }, // Placeholder
        pov: { heading: 0, pitch: 0 },
        zoom: 0,
        visible: true, // Start hidden
        addressControl: true, linksControl: true, panControl: true,
        zoomControl: true, scrollwheel: true, fullscreenControl: true,
      };
      panorama = new google.maps.StreetViewPanorama(streetViewRef.current, initialOptions);
      panoramaRef.current = panorama;

      // --- Attach Listeners ---
      //-commented-console.log("[StreetViewComponent] Adding listeners.");

      // --- Pano Changed Listener ---
      panoListenerRef.current = google.maps.event.addListener(panorama, 'pano_changed', () => {
        //-commented-console.log("!!! pano_changed LISTENER INVOKED !!!"); // ** DEBUG LOG **
        const currentPanoInstance = panoramaRef.current; // Use ref inside listener
        if (!currentPanoInstance) return;

        const panoId = currentPanoInstance.getPano();
        const position = currentPanoInstance.getPosition();

        if (panoId && position) {
          // Access latest state/setter via refs
          const currentDisplayed = displayedPanoramaRef.current;
          const setter = setDisplayedPanoramaRef.current;

          let newState: LocalPano;
          const lat = position.lat();
          const lng = position.lng();

          if (currentDisplayed === null) {
            newState = {
              panoId: panoId, lat: lat, lng: lng,
              heading: currentPanoInstance.getPov()?.heading ?? 0,
              pitch: currentPanoInstance.getPov()?.pitch ?? 0,
              zoom: currentPanoInstance.getZoom() ?? 0,
              localId: `temp-pano-${Date.now()}`, date: new Date().toISOString(),
              description: '', tags: [], movementHistory: [],
             };
          } else {
            newState = { ...currentDisplayed, panoId: panoId, lat: lat, lng: lng };
          }
          setter(newState); // Call setter via ref
        }
      });

      // --- POV Changed Listener ---
      povListenerRef.current = google.maps.event.addListener(panorama, 'pov_changed', () => {
        //-commented-console.log("!!! pov_changed LISTENER INVOKED !!!"); // ** DEBUG LOG **
        const currentPanoInstance = panoramaRef.current; // Use ref inside listener
        if (!currentPanoInstance) return;

        const pov = currentPanoInstance.getPov();
        const zoom = currentPanoInstance.getZoom();

        if (pov && typeof zoom === 'number') {
          // Access latest state/setter via refs
          const currentDisplayed = displayedPanoramaRef.current;
          const setter = setDisplayedPanoramaRef.current;

          let newState: LocalPano;
          if (currentDisplayed === null) {
             newState = {
                panoId: currentPanoInstance.getPano() ?? '',
                lat: currentPanoInstance.getPosition()?.lat() ?? 0,
                lng: currentPanoInstance.getPosition()?.lng() ?? 0,
                heading: pov.heading, pitch: pov.pitch, zoom: zoom,
                localId: `temp-pov-${Date.now()}`, date: new Date().toISOString(),
                description: '', tags: [], movementHistory: [],
              };
          } else {
            newState = { ...currentDisplayed, heading: pov.heading, pitch: pov.pitch, zoom: zoom };
          }
          setter(newState); // Call setter via ref
        }
      });
    } // End of initialization block


    // --- Set/Reset the view based on external `initialPano` ---
    // This logic remains largely the same, ensuring it uses the current 'panorama' variable
    if (panorama && initialPano) {
        if (initialPano.panoId !== lastSetPanoId.current) {
            //-commented-console.log(`[StreetViewComponent] Setting view to new initialPano: ${initialPano.panoId}`);
            panorama.setPano(initialPano.panoId);
            panorama.setPov({ heading: initialPano.heading, pitch: initialPano.pitch });
            panorama.setZoom(initialPano.zoom);
            panorama.setVisible(true);
            // Use the setter ref immediately after setting view
            setDisplayedPanoramaRef.current(initialPano);
            lastSetPanoId.current = initialPano.panoId;
        } else if (!panorama.getVisible()){
             panorama.setVisible(true);
        }
    } else if (panorama && !initialPano) {
        //-commented-console.log("[StreetViewComponent] Hiding Panorama (no initialPano).");
        panorama.setVisible(false);
        lastSetPanoId.current = null;
        // Optionally clear displayed panorama via ref setter:
        // setDisplayedPanoramaRef.current(null);
    }

    // --- Effect Cleanup ---
    // Runs ONLY when component unmounts OR when initialPano changes (forcing re-initialization if needed)
    return () => {
      // NOTE: This cleanup now runs less often. Listeners persist until initialPano changes
      // or component unmounts. This is generally more stable for event handling.
      const pListener = panoListenerRef.current;
      const vListener = povListenerRef.current;
      if (pListener) {
          google.maps.event.removeListener(pListener);
          panoListenerRef.current = null; // Clear ref on cleanup
          //-commented-console.log("[StreetViewComponent] Cleaned up pano_changed listener.");
      }
      if (vListener) {
          google.maps.event.removeListener(vListener);
          povListenerRef.current = null; // Clear ref on cleanup
          //-commented-console.log("[StreetViewComponent] Cleaned up pov_changed listener.");
      }
      // We DO NOT destroy the panorama instance here, just the listeners associated with the *previous* run of this effect.
      // The instance persists in panoramaRef unless the component fully unmounts.
    };

  // The MAIN dependency is initialPano. setDisplayedPanorama is stable from context.
  }, [initialPano]); // REMOVED displayedPanorama and setDisplayedPanorama from deps


  // Render the container div
  return (
    <div ref={streetViewRef} style={{ width: '100%', height: '400px' }} />
  );
};

export default StreetViewComponent;*/