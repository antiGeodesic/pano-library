// services/googleMapsService.ts
import { SVRequestOptions } from '@/types/LocalEditor'; // Corrected import

// --- Cache for the Service Instance ---
let cachedSvServiceInstance: google.maps.StreetViewService | null = null;
// --- Google Maps API Key Access ---
function getApiKey(): string {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) {
        const errorMsg = "Google Maps API Key (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) is not configured in environment variables.";
        console.error(errorMsg);
        return ''; // Returning empty string, handle errors in calling functions
    }
    return key;
}

/**
 * Gets or creates a cached instance of the StreetViewService.
 * Ensures it's only created after the Google Maps API is loaded.
 * @returns The StreetViewService instance or null if API not ready.
 */
export function getStreetViewServiceInstance(): google.maps.StreetViewService | null {
    if (cachedSvServiceInstance) return cachedSvServiceInstance;
    // Check if API is loaded before creating
    if (typeof window !== 'undefined' && window.google?.maps?.StreetViewService) {
        //-commented-console.log(">>> getStreetViewServiceInstance: Creating and caching new StreetViewService instance.");
        cachedSvServiceInstance = new google.maps.StreetViewService();
        return cachedSvServiceInstance;
    }
    console.error(">>> getStreetViewServiceInstance: Google Maps API or StreetViewService not ready for instantiation.");
    return null; // API not ready
}
/*export function getStreetViewPanoramaInstance(): google.maps.StreetViewPanorama | null {
    if (cachedSvPanoramaInstance) return cachedSvPanoramaInstance;
    const svService = getStreetViewServiceInstance();
    if (!svService) return null;
    const svPanorama = new google.maps.StreetViewPanorama(svService, {
        pano: currentPanorama.panoId,
        visible: true,
        addressControl: true,
        linksControl: true,
        fullscreenControl: false,
        enableCloseButton: false,
        showRoadLabels: false,
        imageDateControl: true,
        pov: {
          heading: currentPanorama.heading || 0,
          pitch: currentPanorama.pitch || 0,
        },
        zoom: currentPanorama.zoom || 1
      });
}*/
/*const loadPanoramaByLocation = useCallback(async ( lat: number, lng: number ) => {
    setIsLoading(true);
    const panoData = await getPanoramaFromCoords(lat, lng);
    loadPanorama(panoData);
  }, []);

  const loadPanoramaByPanoId = useCallback(async (panoId: string) => {
    setIsLoading(true);
    const panoData = await getPanoramaFromPanoId(panoId);
    loadPanorama(panoData);
  }, []);*/
// --- Street View Service Wrapper ---
export async function getPanoramaFromPanoId(panoId: string): Promise<google.maps.StreetViewPanoramaData> {
    return new Promise<google.maps.StreetViewPanoramaData>((resolve, reject) => {
        const svService = getStreetViewServiceInstance();
        if (!svService) return reject(new Error("StreetViewService instance not available."));
        const request: google.maps.StreetViewPanoRequest = { pano: panoId };
        svService.getPanorama(request, (data, status) => {
            if (status === google.maps.StreetViewStatus.OK && data) resolve(data);
            else reject(new Error(`Direct getPanorama call failed. Status: ${status}`));
        });
    });
}

export async function getPanoramaFromCoords(lat: number, lng: number): Promise<google.maps.StreetViewPanoramaData | null> {
    return new Promise((resolve, reject) => {
        const svServiceInstance = getStreetViewServiceInstance();
        if (!svServiceInstance) return reject(new Error("StreetViewService instance could not be created (API not ready?)."));
        const requestOptions: google.maps.StreetViewLocationRequest = {
            location: {lat: lat, lng: lng},
            radius: 50,
            preference: google.maps.StreetViewPreference.NEAREST,
            source: google.maps.StreetViewSource.GOOGLE,
        };
        svServiceInstance.getPanorama(requestOptions, (data, status) => {
            if (status === google.maps.StreetViewStatus.OK && data) resolve(data);
            else {
                requestOptions.radius = 1000;
        requestOptions.preference = google.maps.StreetViewPreference.BEST;
        //-commented-console.log(requestOptions.preference)
        svServiceInstance.getPanorama(requestOptions, (data, status) => {
            if (status === google.maps.StreetViewStatus.OK && data) resolve(data);
            else {
                // Instead of rejecting, resolve with null indicating no panorama was found.
                //-commented-console.log(`Panorama not found or request failed. Status: ${status}`);
                resolve(null);
                
            }
        });
            }
        });
        //-commented-console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
        
        
    });
}

export async function Ue(panoId: string): Promise<object | undefined> {
    try {
        const u = `https://maps.googleapis.com/$rpc/google.internal.maps.mapsjs.v1.MapsJsInternalService/GetMetaData`;
        const payload = JSON.stringify([["apiv3",null,null,null,"US",null,null,null,null,null,[[0]]],["en","US"],[[[2,panoId]]],[[1,2,3,4,8,6]]]);

        const response = await fetch(u, {
            method: "POST",
            headers: {
                "content-type": "application/json+protobuf; charset=UTF-8",
                "x-user-agent": "grpc-web-javascript/0.1"
            },
            body: payload,
            mode: "cors",
            credentials: "omit"
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            return await response.json();
        }
    } catch {
        console.error(`There was a problem with GetMetaData`);
    }
}
/*const loadPanoramaByPanoId = useCallback(async (panoId: string) => {
    try {
        // Using the direct call promise method which worked
        let directApiCallPromise = new Promise<google.maps.StreetViewPanoramaData>((resolve, reject) => {
            const svService = getStreetViewServiceInstance();
            if (!svService) return reject(new Error("StreetViewService instance not available."));
            const request: google.maps.StreetViewPanoRequest = { pano: panoId };
            svService.getPanorama(request, (data, status) => {
                if (status === google.maps.StreetViewStatus.OK && data) resolve(data);
                else reject(new Error(`Direct getPanorama call failed. Status: ${status}`));
            });
        });

        const data = await directApiCallPromise;

        if (!data?.location?.latLng || !data.location?.pano) {
            throw new Error('Invalid panorama data received from direct getPanorama call.');
        }

        // --- Set Core Data ---
        const { latLng } = data.location;
        //const date = extractImageDate(data);
        const fetchedPanoId = data.location.pano;

        const newPanoData: {
            panoId: fetchedPanoId;
            lat: latLng.lat();
            lng: latLng.lng();
        };
    } catch (err) {
      console.error(`usePanoManagement: Error during loadPanoramaByPanoId:`, err);
      const message = err instanceof Error ? err.message : 'An unknown error occurred while loading the panorama.';
      setError(message);
      // Clear potentially partially set states
      setCurrentPanoData(null);
      setCurrentPov(null);
      setAlternatePanoramas([]);
    } finally {
      // Set loading false regardless of background fetch status
      //-commented-console.log(`usePanoManagement: loadPanoramaByPanoId FINALLY - Setting isLoading=false`);
      setIsLoading(false);
    }
  }, []);*/
/**
 * Fetches Street View panorama data based on pano ID or location.
 * Wraps the Google Maps StreetViewService getPanorama method in a Promise.
 * @param options - An object specifying either a `pano` ID or a `location` (LatLng or LatLngLiteral).
 * @returns A Promise resolving with the StreetViewPanoramaData.
 * @rejects An error if the panorama is not found or the request fails.
 */
export function getSVData2(
    options: SVRequestOptions
): Promise<google.maps.StreetViewPanoramaData> {
    //-commented-console.log(`>>> getSVData: Called with options:`, options);
    return new Promise((resolve, reject) => {
        // --- Get the cached instance ---
        const svServiceInstance = getStreetViewServiceInstance();
        if (!svServiceInstance) {
            // This now handles the "API not ready" case
            return reject(new Error("StreetViewService instance could not be created (API not ready?)."));
        }
        // --- End getting instance ---

        //-commented-console.log(`>>> getSVData: Using ${cachedSvServiceInstance === svServiceInstance ? 'cached' : 'newly created (?!)'} StreetViewService instance.`);

        const requestOptions: google.maps.StreetViewPanoRequest | google.maps.StreetViewLocationRequest = {
            preference: google.maps.StreetViewPreference.NEAREST,
            source: google.maps.StreetViewSource.DEFAULT,
            ...options,
        };

        //-commented-console.log(`>>> getSVData: Calling svServiceInstance.getPanorama with request:`, requestOptions);
        svServiceInstance.getPanorama(requestOptions, (data, status) => {
            //-commented-console.log(`>>> getSVData: getPanorama callback executed. Status: ${status}`, data); // Keep this log!
            if (status === google.maps.StreetViewStatus.OK && data) {
                //-commented-console.log(`>>> getSVData: Status OK. Resolving promise.`);
                resolve(data);
            } else {
                console.warn(`>>> getSVData: Status not OK (${status}). Rejecting promise.`);
                // Don't clear the cache on error, the instance itself is likely fine
                reject(new Error(`Panorama not found or request failed. Status: ${status}`));
            }
        });
        //-commented-console.log(`>>> getSVData: getPanorama call initiated (async).`);
    });
}


// --- Street View Static Image URL ---
/**
 * Generates a URL for the Google Street View Static API image.
 * @param panoId - The ID of the panorama.
 * @param heading - Camera heading (direction).
 * @param pitch - Camera pitch (vertical angle).
 * @returns The URL string for the preview image.
 */
export function getStreetViewPreviewUrl(
    panoId: string,
    heading: number,
    pitch: number
): string {
    const key = getApiKey();
    if (!key) {
        return '/placeholder-image.png';
    }
    const validHeading = typeof heading === 'number' ? heading : 0;
    const validPitch = typeof pitch === 'number' ? pitch : 0;

    const url = new URL('https://maps.googleapis.com/maps/api/streetview');
    url.searchParams.set('size', '300x150');
    url.searchParams.set('pano', panoId);
    url.searchParams.set('heading', validHeading.toString());
    url.searchParams.set('pitch', validPitch.toString());
    url.searchParams.set('fov', '90');
    url.searchParams.set('key', key);

    return url.toString();
}


// --- Tile-Based Panorama Discovery (Revised - see previous explanation) ---
/**
 * Placeholder/Warning: Reliable tile-based {panoId, lat, lng} discovery is complex.
 * This function currently returns empty and recommends using getSVData for map clicks.
 * @returns A Promise resolving with an empty array.
 */

// --- Helper to find nearby panoramas (using official API) ---
/**
 * Finds nearby panoramas (often different dates) for a given panorama.
 * @param currentPanoData - The data of the current panorama.
 * @param maxDistance - Maximum distance in meters to consider a panorama "nearby".
 * @returns A Promise resolving with an array of AlternatePanorama objects.
 */
/*export async function findNearbyPanoramas(
    currentPanoData: google.maps.StreetViewPanoramaData,
    maxDistance: number = 15 // Default to 15 meters
): Promise<AlternatePanorama[]> { // Type AlternatePanorama is now correctly imported
    if (!currentPanoData?.links || !currentPanoData.location?.latLng) {
        return [];
    }

    const nearby: AlternatePanorama[] = []; // Type AlternatePanorama is now correctly imported
    const currentLatLng = currentPanoData.location.latLng;
    const processedPanoIds = new Set<string>([currentPanoData.location.pano]);

    for (const link of currentPanoData.links) {
        if (!link.pano || processedPanoIds.has(link.pano)) {
            continue;
        }

        processedPanoIds.add(link.pano);

        try {
            const linkedPanoData = await getSVData({ pano: link.pano });

            if (linkedPanoData?.location?.latLng) {
                const linkedLatLng = linkedPanoData.location.latLng;
                const distance = google.maps.geometry?.spherical?.computeDistanceBetween(
                    currentLatLng,
                    linkedLatLng
                );

                if (typeof distance === 'number' && distance < maxDistance) {
                    const date = extractImageDate(linkedPanoData);
                    nearby.push({
                        panoId: linkedPanoData.location.pano,
                        date: date,
                    });
                }
            }
        } catch (error) {
            // console.warn(`Could not fetch linked pano ${link.pano}:`, error);
        }
    }
    return nearby;
}*/

/**
 * Finds nearby panoramas (often different dates) for a given panorama using Promise.allSettled.
 * This is more robust if individual linked pano lookups fail or hang.
 * @param currentPanoData - The data of the current panorama.
 * @param maxDistance - Maximum distance in meters to consider a panorama "nearby".
 * @returns A Promise resolving with an array of AlternatePanorama objects.
 */
/*export async function findNearbyPanoramas(
  currentPanoData: google.maps.StreetViewPanoramaData,
  maxDistance: number = 15 // Default to 15 meters
): Promise<AlternatePanorama[]> {
  if (!currentPanoData?.links || !currentPanoData.location?.latLng) {
      //-commented-console.log("findNearbyPanoramas: No links or location data, returning empty.");
      return [];
  }

  const currentLatLng = currentPanoData.location.latLng;
  const originPanoId = currentPanoData.location.pano;
  const nearby: AlternatePanorama[] = [];

  // Create promises for fetching data for each valid link
  const promises = currentPanoData.links
      .map(link => link.pano) // Get pano IDs
      .filter((panoId): panoId is string => !!panoId && panoId !== originPanoId) // Filter out empty/self IDs
      .map(panoId => {
          //-commented-console.log(`findNearbyPanoramas: Creating getSVData promise for linked pano ${panoId}`);
          // Add a timeout wrapper around getSVData to prevent infinite hangs
          return Promise.race([
              getSVData({ pano: panoId }),
              new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`Timeout fetching pano ${panoId}`)), 5000)) // 5-second timeout
          ]).catch(error => {
               // Ensure getSVData rejections are caught here so allSettled sees them as 'rejected'
               console.warn(`findNearbyPanoramas: Error fetching linked pano ${panoId}:`, error.message);
               return { error, panoId }; // Return an object indicating failure
          });
      });


  if (promises.length === 0) {
       //-commented-console.log("findNearbyPanoramas: No valid, unique links found.");
      return [];
  }

  //-commented-console.log(`findNearbyPanoramas: Waiting for ${promises.length} linked pano fetches...`);
  const results = await Promise.allSettled(promises);
  //-commented-console.log(`findNearbyPanoramas: Fetches settled. Results:`, results);

  // Process the results
  results.forEach(result => {
      // Check if the promise was fulfilled and didn't return our error object
      if (result.status === 'fulfilled' && result.value && !(result.value as any).error) {
          const linkedPanoData = result.value as google.maps.StreetViewPanoramaData;

          // Check if data is valid and location exists
          if (linkedPanoData?.location?.latLng && linkedPanoData.location.pano) {
              try { // Add try/catch for safety during processing
                  const linkedLatLng = linkedPanoData.location.latLng;
                  const distance = google.maps.geometry?.spherical?.computeDistanceBetween(
                      currentLatLng,
                      linkedLatLng
                  );

                  // Check distance
                  if (typeof distance === 'number' && distance < maxDistance) {
                      const date = extractImageDate(linkedPanoData);
                      nearby.push({
                          panoId: linkedPanoData.location.pano,
                          date: date,
                      });
                       //-commented-console.log(`findNearbyPanoramas: Added nearby pano ${linkedPanoData.location.pano} (Date: ${date}, Dist: ${distance.toFixed(1)}m)`);
                  }
              } catch (processingError) {
                   console.warn(`findNearbyPanoramas: Error processing fulfilled result for pano ${linkedPanoData.location?.pano}:`, processingError);
              }
          } else {
               //-commented-console.log(`findNearbyPanoramas: Fulfilled result lacked valid location data.`);
          }
      } else if (result.status === 'rejected') {
          console.warn(`findNearbyPanoramas: A linked pano fetch promise was rejected:`, result.reason);
      } else {
           // Handle cases where the promise fulfilled but contained our custom error object
           if(result.value && (result.value as any).error){
              console.warn(`findNearbyPanoramas: Caught error fetching linked pano ${ (result.value as any).panoId } within Promise.allSettled.`);
           } else {
              console.warn(`findNearbyPanoramas: Unhandled fulfilled status with unexpected value:`, result.value);
           }
      }
  });

  //-commented-console.log(`findNearbyPanoramas: Finished processing. Returning ${nearby.length} nearby panos.`);
  // Sort by date? Optional.
  return nearby;
}*/