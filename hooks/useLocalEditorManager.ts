import { useState, useCallback } from 'react';
import { TagCategory } from '@/types/index'
import { LocalPano, LocalEditorContextType, DataBaseItem } from '@/types/LocalEditor';
import { getPanoramaFromCoords, getPanoramaFromPanoId } from '@/services/googleMapsService'
import { convertSvPanoramaData, convertToDataBaseItem } from '@/utils/helpers'
import { supabase } from '@/lib/supabaseClient';

export function useLocalEditorManager(): LocalEditorContextType {
  const [localPanos, setLocalPanos] = useState<LocalPano[]>([]);
  const [displayedPanorama, setDisplayedPanorama] = useState<LocalPano | null>(null);
  const [currentPanorama, setCurrentPanorama] = useState<LocalPano | null>(null);
  const [pendingPanorama, setPendingPanorama] = useState<LocalPano | null>(null);
  const [currentPanoramaIsNew, setCurrentPanoramaIsNew] = useState<boolean>(true);
  const [currentSvPanorama, setCurrentSvPanorama] = useState<google.maps.StreetViewPanorama | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  //const [error, setError] = useState<string | null>(null);

  const uploadPanoToDatabase = async (localPano: LocalPano) => {
    const dbItem: DataBaseItem = convertToDataBaseItem(localPano);
    const { data, error } = await supabase.from('pano-library-beta').insert([dbItem]);
  
    if (error) {
      console.error('Error uploading:', error.message);
      return false;
    } else {
      console.log('Upload successful:', data);
      return true;
    }
  };
  const publishLocalPanos = useCallback(async (): Promise<boolean> => {
    let succeeded = true;
  
    for (const lp of localPanos) {
      const result = await uploadPanoToDatabase(lp);
      if (!result) {
        succeeded = false;
        break; // stop on failure if needed
      }
    }
  
    return succeeded;
  }, [localPanos]);
  const clearCurrentPano = useCallback(() => {
    setCurrentPanorama(null);
    setDisplayedPanorama(null)
  }, []);

  const addLocalPano = useCallback((panoData: LocalPano) => {
    const newPano = { ...panoData, localId: crypto.randomUUID() };
    
    setLocalPanos(prev => {
      // Log the PREVIOUS state length inside the updater
      console.warn(`Adding pano. Previous localPanos length: ${prev.length}`);
      return [...prev, newPano];
    });
    console.warn("no saved pano was found")
      let lpid: string = "";
      for(const lp of localPanos) {
        lpid += lp.localId + ", ";
      }
      console.warn("localIds (length: ", localPanos.length, "): ", lpid)
    //setError(null)
    clearCurrentPano();
  }, [clearCurrentPano, localPanos]);

  const updateLocalPano = useCallback((panoData: LocalPano) => {
    
    setLocalPanos(prev => prev.map(pano => pano.localId === panoData.localId ? panoData : pano));
    clearCurrentPano();
  }, [clearCurrentPano]);

  const deleteLocalPano = useCallback((localId: string) => {
    setLocalPanos(prev => prev.filter(pano => pano.localId !== localId));
    clearCurrentPano();
  }, [clearCurrentPano]);

  const getExistingPanoById = useCallback((localId: string): LocalPano | undefined => {
    return localPanos.find(pano => {console.warn("pano: ", pano.localId, "vs", localId);if(pano.localId === localId) return pano});
  }, [localPanos]);

  const loadPanorama = useCallback(async (svPanoramaData: google.maps.StreetViewPanoramaData | null) => {
    if (!svPanoramaData) throw new Error('Invalid panorama data received from direct getPanorama call.');
    const localPano = convertSvPanoramaData(svPanoramaData);
    
    //if(!panoramaData) throw new Error('Failed convertion from StreetViewPanoramaData to PanoramaData');
    //const newLocalPano: LocalPano = {
    //  ...panoramaData, // Spread the properties of localPano
    //  localId: crypto.randomUUID() // Add the unique identifier
    //};
    // Simulate an API call
    if(!localPano) return;
    //clearCurrentPano();
    if(displayedPanorama) {
      if(getExistingPanoById(displayedPanorama.localId)) updateLocalPano(displayedPanorama);
      else addLocalPano(displayedPanorama);
    }
    setTimeout(() => {
      setCurrentPanorama(localPano);
      setDisplayedPanorama(localPano)
      setIsLoading(false);
    }, 1000);
  }, [addLocalPano, displayedPanorama, getExistingPanoById, updateLocalPano]);
  const loadPanoramaByLocation = useCallback((async ( lat: number, lng: number ) => {
    setIsLoading(true);
    const svPanoData = await getPanoramaFromCoords(lat, lng);
    console.log(svPanoData)
    loadPanorama(svPanoData);
  }), [loadPanorama]);


  const loadPanoramaByPanoId = (async (panoId: string) => {
    setIsLoading(true);
    //Zyr6Q4_9hDBQB9F-DweeFQ
    const svPanoData = await getPanoramaFromPanoId(panoId);
    loadPanorama(svPanoData);
  });

  const loadExistingPanorama = useCallback((requestedPano: LocalPano) => {
    
    if(displayedPanorama) {
      //if(getExistingPanoById(displayedPanorama.localId)) updateLocalPano({...currentPanorama, ...displayedPanorama});
      //else addLocalPano({...currentPanorama, ...displayedPanorama});
      if(!getExistingPanoById(displayedPanorama.localId)) addLocalPano({...currentPanorama, ...displayedPanorama});
    }
    
    const localPano = getExistingPanoById(requestedPano.localId);
    if(!localPano) {
      return;
    } 
    setCurrentPanorama(localPano);
    setDisplayedPanorama(localPano);
    setPendingPanorama(localPano);
    setCurrentPanoramaIsNew(false);
  }, [getExistingPanoById,currentPanorama, displayedPanorama, addLocalPano]);

  const loadNewPanorama = useCallback(async (localPano: LocalPano) => {
    if(displayedPanorama) {
      //if(getExistingPanoById(displayedPanorama.localId)) updateLocalPano({...currentPanorama, ...displayedPanorama});
      //else addLocalPano({...currentPanorama, ...displayedPanorama});
      if(!getExistingPanoById(displayedPanorama.localId)) addLocalPano({...currentPanorama, ...displayedPanorama});
    }
    setCurrentPanorama(localPano);
    setDisplayedPanorama(localPano);
    setPendingPanorama(localPano);
    setCurrentPanoramaIsNew(true);
  }, [addLocalPano, currentPanorama, displayedPanorama, getExistingPanoById]);

  

  //const updateCurrentPov = ((heading: number, pitch: number, zoom: number) => {
  //  //-commented-console.log("CurrentPanorama:", currentPanorama)
  //  //-commented-console.log("1. Heading: ", currentPanorama?.heading)
  //  if(!currentPanorama) return;
  //  const newPano = { ...currentPanorama, heading: heading, pitch: pitch, zoom: zoom };
  //  setCurrentPanorama(newPano);
  //  setDisplayedPanorama(newPano);
  //  //-commented-console.log("Heading: ", currentPanorama.heading)
  //});
//
  //const updateCurrentPos = ((panoId: string, lat: number, lng: number) => {
  //  if(!currentPanorama) return;
  //  const newPano = { ...currentPanorama, panoId: panoId, lat: lat, lng: lng };
  //  setCurrentPanorama(newPano);
  //  setDisplayedPanorama(newPano);
  //});
  const updateCurrentPov = useCallback(((heading: number, pitch: number, zoom: number) => {
    //-commented-console.log("CurrentPanorama:", displayedPanorama)
    //-commented-console.log("1. Heading: ", displayedPanorama?.heading)
    if(!displayedPanorama) return;
    const newPano = {...currentPanorama, ...displayedPanorama, heading: heading, pitch: pitch, zoom: zoom };
    setDisplayedPanorama(newPano);
    //-commented-console.log("Heading: ", displayedPanorama.heading)
  }), [currentPanorama, displayedPanorama]);

  const updateCurrentPos = useCallback((async (panoId: string, lat: number, lng: number) => {
    if(!displayedPanorama) return;
    const svPanoData = await getPanoramaFromPanoId(panoId);
    const convertedPano = convertSvPanoramaData(svPanoData);
    const newPano = { ...currentPanorama ,...displayedPanorama, address: convertedPano?.address ?? displayedPanorama.address, availableDates: convertedPano?.availableDates ?? displayedPanorama.availableDates, panoId: panoId, lat: lat, lng: lng, movementHistory: [...displayedPanorama.movementHistory, {panoId: panoId, lat: lat, lng: lng}] };
    setDisplayedPanorama(newPano);
  }), [currentPanorama, displayedPanorama]);
  const setCurrentTags = useCallback(((tags: TagCategory[]) => {
    if(!displayedPanorama) return;
    setDisplayedPanorama({...currentPanorama, ...displayedPanorama, tags: tags})
  }), [currentPanorama, displayedPanorama]);
  /*const toggleCurrentTags = useCallback(((tags: TagCategory) => {
    if(!displayedPanorama) return;
    setDisplayedPanorama({...currentPanorama, ...displayedPanorama, tags: tags})
  }), [currentPanorama, displayedPanorama]);*/
  const updateCurrentTags = useCallback(((index: number, tag: TagCategory | null) => {
    if(!displayedPanorama) return;
    if(index == -1 && tag) {
      //add tag
      setDisplayedPanorama({...currentPanorama, ...displayedPanorama, tags: [...displayedPanorama.tags, tag]})
      return;
    }
    else if(tag == null){
      const updatedTags = displayedPanorama.tags.filter((_, idx) => idx !== index);
      setDisplayedPanorama({...currentPanorama, ...displayedPanorama, tags: updatedTags})
      return;
    }
    else if(index < displayedPanorama.tags.length) {
      if (displayedPanorama.tags.includes(tag)) return;
      const updatedTags = [...displayedPanorama.tags];
      updatedTags[index] = tag;
      setDisplayedPanorama({...currentPanorama, ...displayedPanorama, tags: updatedTags})
      return;
    }
    console.warn("Tried to update tag with incompatible index")
  }), [currentPanorama, displayedPanorama]);
  const updateCurrentDescription = useCallback((description: string) => {
    if(!displayedPanorama) return;
    const newPano = { ...currentPanorama, ...displayedPanorama, description: description};
    setDisplayedPanorama(newPano);
  }, [currentPanorama, displayedPanorama]);
  async function clickedMap(latLng: google.maps.LatLng): Promise<LocalPano | null> {
    //-commented-console.log("Clicked at: ", latLng.lat(), ", ", latLng.lng())
    const svPanoData = await getPanoramaFromCoords(latLng.lat(), latLng.lng());
    console.log(svPanoData)
    console.log(JSON.stringify(svPanoData))
    return convertSvPanoramaData(svPanoData) as LocalPano | null;
  }
  const setStreetViewPanoId = useCallback((panoId: string) => {
    if(!displayedPanorama) return;
    const newLocalPano = {...displayedPanorama, panoId: panoId, movementHistory: [{panoId: displayedPanorama.panoId, lat: displayedPanorama.lat, lng: displayedPanorama.lng}]}
    setCurrentPanorama(newLocalPano);
    setDisplayedPanorama(newLocalPano);
    setPendingPanorama(newLocalPano);
  }, [displayedPanorama]);

  const saveDisplayedPano = useCallback(() => {
    if(!currentPanorama || !displayedPanorama) return;
    addLocalPano(displayedPanorama);
  }, [currentPanorama, displayedPanorama, addLocalPano])

  const updateDisplayedPano = useCallback(() => {
    if(!currentPanorama || !displayedPanorama) return;
    updateLocalPano(displayedPanorama);
  }, [currentPanorama, displayedPanorama, updateLocalPano])
  const deleteDisplayedPano = useCallback(() => {
    if(!currentPanorama || !displayedPanorama) return;
    deleteLocalPano(displayedPanorama.localId);
  }, [currentPanorama, displayedPanorama, deleteLocalPano])
  const clearDisplayedPano = useCallback(() => {
    if(!currentPanorama || !displayedPanorama) return;
    clearCurrentPano();
  }, [currentPanorama, displayedPanorama, clearCurrentPano])
  

  const setLocalPanoList = (newLPs: LocalPano[]) => {
    setLocalPanos(newLPs);
  }
  return {
    localPanos,
    currentPanorama,
    pendingPanorama,
    displayedPanorama,
    currentPanoramaIsNew,
    currentSvPanorama,
    publishLocalPanos,
    setCurrentPanorama,
    setDisplayedPanorama,
    setPendingPanorama,
    addLocalPano,
    updateLocalPano,
    deleteLocalPano,
    getExistingPanoById,
    setCurrentSvPanorama,
    isLoading,
    //error,
    loadPanoramaByLocation,
    loadPanoramaByPanoId,
    loadExistingPanorama,
    loadNewPanorama,
    clearCurrentPano,
    updateCurrentPov,
    updateCurrentPos,
    setCurrentTags,
    updateCurrentTags,
    updateCurrentDescription,
    clickedMap,
    setStreetViewPanoId,
    saveDisplayedPano,
    updateDisplayedPano,
    deleteDisplayedPano,
    clearDisplayedPano




    ,
    setLocalPanoList
  };
}
//import { useState, useCallback, useEffect } from 'react'; // Added useEffect
//import { LocalPano, LocalEditorContextType } from '@/types';
//import { getPanoramaFromPanoId } from '@/services/googleMapsService';
//import { getPanoramaFromCoords } from '@/services/googleMapsService';
//import { convertSvPanoramaData } from '@/utils/helpers';
//
//export function useLocalEditorManager(): LocalEditorContextType {
//  const [localPanos, setLocalPanos] = useState<LocalPano[]>([]);
//  const [displayedPanorama, setDisplayedPanorama] = useState<LocalPano | null>(null);
//  const [currentPanorama, setCurrentPanorama] = useState<LocalPano | null>(null);
//  const [currentPanoramaIsNew, setCurrentPanoramaIsNew] = useState<boolean>(true);
//  const [currentSvPanorama, setCurrentSvPanorama] = useState<google.maps.StreetViewPanorama | null>(null);
//  const [isLoading, setIsLoading] = useState<boolean>(false);
//  const [error, setError] = useState<string | null>(null);
//
//  // --- Internal Helper ---
//  // Memoized: Only recreates if state setters change (which they don't)
//  const clearCurrentPano = useCallback(() => {
//    //-commented-console.log("Clearing current/displayed panorama");
//    setCurrentPanorama(null);
//    setDisplayedPanorama(null);
//    setCurrentPanoramaIsNew(true); // Reset flag when clearing
//  }, []);
//
//  // --- State Modifiers ---
//  // Memoized: Depends on `clearCurrentPano`
//  const addLocalPano = useCallback((panoData: Omit<LocalPano, 'localId'>) => {
//    const newPano = { ...panoData, localId: crypto.randomUUID() };
//    //-commented-console.log("[useLocalEditorManager] Adding Local Pano:", newPano);
//    setLocalPanos(prev => {
//      // Log the PREVIOUS state length inside the updater
//      console.warn(`Adding pano. Previous localPanos length: ${prev.length}`);
//      return [...prev, newPano];
//    });
//    setError(null);
//    clearCurrentPano();
//    // Don't clear current pano when just adding to the list unless intended
//    // clearCurrentPano(); // Removed - Adding shouldn't necessarily clear the view
//  }, []); // No dependencies needed here as it only uses setLocalPanos and setError
//
//  // Memoized: Depends on `clearCurrentPano`
//  const updateLocalPano = useCallback((panoData: LocalPano) => {
//    //-commented-console.log("[useLocalEditorManager] Updating Local Pano:", panoData.localId);
//    setLocalPanos(prev => prev.map(pano => pano.localId === panoData.localId ? panoData : pano));
//    clearCurrentPano();
//    // Don't clear current pano when just updating the list unless intended
//    // clearCurrentPano(); // Removed
//  }, []); // No dependencies needed here
//
//  // Memoized: Depends on `clearCurrentPano`
//  const deleteLocalPano = useCallback((localId: string) => {
//    //-commented-console.log("[useLocalEditorManager] Deleting Local Pano:", localId);
//    setLocalPanos(prev => prev.filter(pano => pano.localId !== localId));
//    // Clear the view if the deleted pano was the one being viewed
//    if (currentPanorama?.localId === localId || displayedPanorama?.localId === localId) {
//      clearCurrentPano();
//    }
//  }, [clearCurrentPano, currentPanorama, displayedPanorama]); // Add state dependencies read inside
//
//  // --- State Accessors ---
//  // Memoized: Depends on `localPanos` state
//  const getExistingPanoById = useCallback((localId: string): LocalPano | undefined => {
//    return localPanos.find(pano => pano.localId === localId);
//  }, [localPanos]);
//
//  // --- Loaders ---
//  // Memoized: Depends on state/setters it uses
//  const loadPanorama = useCallback((svPanoramaData: google.maps.StreetViewPanoramaData | null) => {
//    setIsLoading(true); // Set loading true at the start of the process
//    setError(null);
//
//    if (!svPanoramaData) {
//      console.error('Invalid panorama data received.');
//      setError('Could not find panorama data.');
//      setIsLoading(false);
//      return; // Exit early
//    }
//
//    const localPano = convertSvPanoramaData(svPanoramaData);
//    if (!localPano) {
//      console.error('Failed conversion from StreetViewPanoramaData to LocalPano');
//      setError('Failed to process panorama data.');
//      setIsLoading(false);
//      return; // Exit early
//    }
//
//    //-commented-console.log("[useLocalEditorManager] Loading new panorama:", localPano.panoId);
//    // Simulate API call delay if needed, otherwise process directly
//    // Using setTimeout here makes reasoning about state harder. Let's process sync.
//
//    // Determine if this pano (by panoId) already exists in localPanos
//    const existingIndex = localPanos.findIndex(p => p.panoId === localPano.panoId);
//    const existingLocalPano = existingIndex !== -1 ? localPanos[existingIndex] : null;
//
//    if (existingLocalPano) {
//        //-commented-console.log("Found existing local pano, loading it:", existingLocalPano.localId);
//        setCurrentPanorama(existingLocalPano);
//        setDisplayedPanorama(existingLocalPano);
//        setCurrentPanoramaIsNew(false);
//    } else {
//        //-commented-console.log("Loading as a new (unsaved) panorama");
//        // Create a temporary localId for this unsaved pano
//        const newUnsavedPano = { ...localPano, localId: `temp-${localPano.panoId || Date.now()}` };
//        setCurrentPanorama(newUnsavedPano);
//        setDisplayedPanorama(newUnsavedPano);
//        setCurrentPanoramaIsNew(true);
//    }
//
//    setIsLoading(false);
//
//  }, [localPanos]); // Depends on localPanos to check for existing
//
//
//  // Memoized: Depends on `loadPanorama`
//  const loadPanoramaByLocation = useCallback(async (lat: number, lng: number) => {
//    //-commented-console.log(`[useLocalEditorManager] loadPanoramaByLocation: ${lat}, ${lng}`);
//    setIsLoading(true);
//    setError(null);
//    try {
//      const svPanoData = await getPanoramaFromCoords(lat, lng);
//      loadPanorama(svPanoData); // loadPanorama handles setting state/loading false
//    } catch {
//      setIsLoading(false);
//    }
//  }, [loadPanorama]);
//
//  // Memoized: Depends on `loadPanorama`
//  const loadPanoramaByPanoId = useCallback(async (panoId: string) => {
//    //-commented-console.log(`[useLocalEditorManager] loadPanoramaByPanoId: ${panoId}`);
//    setIsLoading(true);
//    setError(null);
//    const svPanoData = await getPanoramaFromPanoId(panoId);
//    if(!svPanoData) {
//      console.warn("nothing happened")
//      return;
//    }
//    loadPanorama(svPanoData); // loadPanorama handles setting state/loading false
//    
//  }, [loadPanorama]);
//
//  // Memoized: Depends on `getExistingPanoById`, `localPanos` (indirectly via getExistingPanoById)
//  const loadExistingPanorama = useCallback((localPanoToLoad: LocalPano) => {
//      // The check if it exists should happen *before* calling this ideally,
//      // but we ensure it's the exact object from state if possible.
//      const currentVersionInState = getExistingPanoById(localPanoToLoad.localId);
//      const panoToLoad = currentVersionInState ?? localPanoToLoad; // Use state version if available
//
//      //-commented-console.log("[useLocalEditorManager] Loading existing panorama:", panoToLoad.localId);
//      setCurrentPanorama(panoToLoad);
//      setDisplayedPanorama(panoToLoad);
//      setCurrentPanoramaIsNew(false);
//      setError(null);
//      setIsLoading(false);
//  }, [getExistingPanoById]); // Dependency is getExistingPanoById
//
//  // This seems redundant now with loadPanorama? Or is it for loading *from* StreetViewComponent's interactions?
//  // Let's assume it's for taking a potentially modified 'displayedPanorama' and making it 'current'
//  // It should likely *save* the previous state first if needed.
//  const loadNewPanorama = useCallback((localPanoFromInteraction: LocalPano) => {
//    // This function is confusingly named if it comes *from* interaction.
//    // Maybe rename to 'syncViewToInteraction' or similar?
//    // For now, just sets current/displayed based on the input.
//    //-commented-console.log("[useLocalEditorManager] Setting current/displayed from interaction:", localPanoFromInteraction.localId);
//
//    // Decide if the incoming pano is actually 'new' or represents an existing saved one
//    const isSaved = localPanos.some(p => p.localId === localPanoFromInteraction.localId);
//
//    setCurrentPanorama(localPanoFromInteraction);
//    setDisplayedPanorama(localPanoFromInteraction);
//    setCurrentPanoramaIsNew(!isSaved); // Set flag based on whether it's in our saved list
//
//  }, [localPanos]); // Depends on localPanos to check if saved
//
//
//  // --- Update Displayed Panorama (from StreetViewComponent etc.) ---
//  // Memoized: Depends on `displayedPanorama`, `currentPanorama`
//  const updateCurrentPov = useCallback((heading: number, pitch: number, zoom: number) => {
//    // Update ONLY displayedPanorama, reflecting the interactive state
//    setDisplayedPanorama(prev => {
//        if (!prev) return null; // Should not happen if called correctly, but safety check
//        // //-commented-console.log(`Updating POV: H=${heading.toFixed(1)}, P=${pitch.toFixed(1)}, Z=${zoom.toFixed(1)}`);
//        return { ...prev, heading: heading, pitch: pitch, zoom: zoom };
//    });
//  }, []); // No dependencies needed as it uses functional update
//
//  // Memoized: Depends on `displayedPanorama`, `currentPanorama`
//  const updateCurrentPos = useCallback((panoId: string, lat: number, lng: number) => {
//    // Update ONLY displayedPanorama, reflecting the interactive state
//     setDisplayedPanorama(prev => {
//         if (!prev) return null;
//        //  //-commented-console.log(`Updating Pos: Pano=${panoId}, Lt=${lat.toFixed(5)}, Lg=${lng.toFixed(5)}`);
//         return { ...prev, panoId: panoId, lat: lat, lng: lng };
//     });
//  }, []); // No dependencies needed
//
//  const updateCurrentTags = useCallback((index: number, tag: string) => {
//    setDisplayedPanorama(prev => {
//        if (!prev) return null;
//        let updatedTags: string[];
//        if (index === -1) { // Add tag
//            if (!tag || prev.tags.includes(tag)) return prev; // Don't add empty or duplicates
//            updatedTags = [...prev.tags, tag];
//        } else if (tag === "") { // Delete tag
//            if (index < 0 || index >= prev.tags.length) return prev; // Invalid index
//            updatedTags = prev.tags.filter((_, idx) => idx !== index);
//        } else { // Update tag
//            if (index < 0 || index >= prev.tags.length || prev.tags.includes(tag)) return prev; // Invalid or duplicate
//            updatedTags = [...prev.tags];
//            updatedTags[index] = tag;
//        }
//        return { ...prev, tags: updatedTags };
//    });
//  }, []); // No dependencies needed
//
//  const updateCurrentDescription = useCallback((description: string) => {
//    setDisplayedPanorama(prev => {
//        if (!prev) return null;
//        return { ...prev, description: description };
//    });
//  }, []); // No dependencies needed
//
//  // --- Map Click Handler ---
//  // Memoized: Depends on service/utils
//  const clickedMap = useCallback(async (latLng: google.maps.LatLng): Promise<LocalPano | null> => {
//    //-commented-console.log("[useLocalEditorManager] Clicked map at: ", latLng.lat(), ", ", latLng.lng());
//    try {
//        const svPanoData = await getPanoramaFromCoords(latLng.lat(), latLng.lng());
//        return convertSvPanoramaData(svPanoData) as LocalPano | null; // Assume conversion handles null
//    } catch (err) {
//        console.error("Error getting panorama on map click:", err);
//        return null;
//    }
//  }, []); // No dependencies assuming service/utils are stable
//
//  // --- Save/Update/Delete based on Displayed Pano ---
//  // These actions operate on the 'displayedPanorama' state
//  // Memoized: Depends on functions and state it reads/uses
//  const saveDisplayedPano = useCallback(() => {
//    if (!displayedPanorama) return;
//    //-commented-console.log("Saving displayed panorama:", displayedPanorama.localId);
//    // Use addLocalPano, but pass data without localId if it's temporary
//    const { localId, ...dataToSave } = displayedPanorama;
//    if (localId.startsWith('temp-')) {
//        addLocalPano(dataToSave);
//    } else {
//        // If it already has a real localId, maybe this should be update?
//        // Or maybe saving always creates a new copy? For now, assume add=new.
//        console.warn("Attempting to save a panorama that might already be saved. Use Update instead?");
//        addLocalPano(dataToSave); // Creates a new entry with a new localId
//    }
//  }, [displayedPanorama, addLocalPano]);
//
//  // Memoized: Depends on functions and state it reads/uses
//  const updateDisplayedPano = useCallback(() => {
//    if (!displayedPanorama || displayedPanorama.localId.startsWith('temp-')) {
//        console.warn("Cannot update - displayed panorama is new or null.");
//        return;
//    }
//    //-commented-console.log("Updating saved panorama from displayed:", displayedPanorama.localId);
//    updateLocalPano(displayedPanorama);
//  }, [displayedPanorama, updateLocalPano]);
//
//  // Memoized: Depends on functions and state it reads/uses
//  const deleteDisplayedPano = useCallback(() => {
//    if (!displayedPanorama || displayedPanorama.localId.startsWith('temp-')) {
//         console.warn("Cannot delete - displayed panorama is new or null.");
//         return; // Can't delete one not saved yet
//    }
//    //-commented-console.log("Deleting displayed panorama:", displayedPanorama.localId);
//    deleteLocalPano(displayedPanorama.localId); // deleteLocalPano handles clearing view if needed
//  }, [displayedPanorama, deleteLocalPano]);
//
//  // clearDisplayedPano seems identical to clearCurrentPano, maybe remove one?
//  // Re-using clearCurrentPano
//  const clearDisplayedPano = clearCurrentPano;
//
//
//  // Optional: Log localPanos when it actually changes
//  useEffect(() => {
//    //-commented-console.log("[useLocalEditorManager] localPanos state updated:", localPanos);
//  }, [localPanos]);
//
//
//  return {
//    localPanos,
//    currentPanorama,
//    displayedPanorama,
//    currentPanoramaIsNew,
//    currentSvPanorama, // Keep if used, otherwise remove
//    setCurrentPanorama, // Expose if needed externally
//    setDisplayedPanorama, // Expose if needed externally
//    addLocalPano,
//    updateLocalPano,
//    deleteLocalPano,
//    getExistingPanoById,
//    setCurrentSvPanorama, // Keep if used
//    isLoading,
//    error,
//    loadPanoramaByLocation,
//    loadPanoramaByPanoId,
//    loadExistingPanorama, // Renamed from loadExistingPanoramaById for clarity
//    loadNewPanorama, // Revisit naming/purpose?
//    clearCurrentPano,
//    updateCurrentPov,
//    updateCurrentPos,
//    updateCurrentTags,
//    updateCurrentDescription,
//    clickedMap,
//    saveDisplayedPano,
//    updateDisplayedPano,
//    deleteDisplayedPano,
//    clearDisplayedPano // Use the reference to clearCurrentPano
//  };
//}