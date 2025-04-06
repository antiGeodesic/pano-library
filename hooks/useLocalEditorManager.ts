import { useState, useCallback } from 'react';
import { LocalPano, LocalEditorContextType } from '@/types';
import { getPanoramaFromPanoId } from '@/services/googleMapsService'
import { getPanoramaFromCoords } from '@/services/googleMapsService'
import { convertSvPanoramaData } from '@/utils/helpers'

export function useLocalEditorManager(): LocalEditorContextType {
  const [localPanos, setLocalPanos] = useState<LocalPano[]>([]);
  const [displayedPanorama, setDisplayedPanorama] = useState<LocalPano | null>(null);
  const [currentPanorama, setCurrentPanorama] = useState<LocalPano | null>(null);
  const [currentPanoramaIsNew, setCurrentPanoramaIsNew] = useState<boolean>(true);
  const [currentSvPanorama, setCurrentSvPanorama] = useState<google.maps.StreetViewPanorama | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);



  
  const addLocalPano = useCallback((panoData: Omit<LocalPano, 'localId'>) => {
    const newPano = { ...panoData, localId: crypto.randomUUID() };
    setLocalPanos(prev => [...prev, newPano]);
    setError(null)
  }, []);

  const updateLocalPano = useCallback((panoData: LocalPano) => {

    setLocalPanos(prev => prev.map(pano => pano.localId === panoData.localId ? panoData : pano));
  }, []);

  const deleteLocalPano = useCallback((localId: string) => {
    setLocalPanos(prev => prev.filter(pano => pano.localId !== localId));
  }, []);

  const getLocalPanoById = useCallback((localId: string): LocalPano | undefined => {
    return localPanos.find(pano => pano.localId === localId);
  }, [localPanos]);
  
  const loadPanorama = useCallback((svPanoramaData: google.maps.StreetViewPanoramaData | null) => {
    if (!svPanoramaData) throw new Error('Invalid panorama data received from direct getPanorama call.');
    const localPano = convertSvPanoramaData(svPanoramaData);
    
    /*if(!panoramaData) throw new Error('Failed convertion from StreetViewPanoramaData to PanoramaData');
    const newLocalPano: LocalPano = {
      ...panoramaData, // Spread the properties of localPano
      localId: crypto.randomUUID() // Add the unique identifier
    };*/
    // Simulate an API call
    if(!localPano) return;
    setTimeout(() => {
      setCurrentPanorama(localPano);
      setDisplayedPanorama(localPano)
      setIsLoading(false);
    }, 1000);
  }, []);
  const loadPanoramaByLocation = (async ( lat: number, lng: number ) => {
    setIsLoading(true);
    const svPanoData = await getPanoramaFromCoords(lat, lng);
    loadPanorama(svPanoData);
  });


  const loadPanoramaByPanoId = (async (panoId: string) => {
    setIsLoading(true);
    const svPanoData = await getPanoramaFromPanoId(panoId);
    loadPanorama(svPanoData);
  });

  const loadExistingPanorama = useCallback(async (localPano: LocalPano) => {
    setCurrentPanorama(localPano);
    setDisplayedPanorama(localPano)
    setCurrentPanoramaIsNew(false);
  }, []);

  const loadNewPanorama = useCallback(async (localPano: LocalPano) => {
    setCurrentPanorama(localPano);
    setDisplayedPanorama(localPano)
    setCurrentPanoramaIsNew(true);
  }, []);

  const clearCurrentPano = useCallback(() => {
    setCurrentPanorama(null);
    setDisplayedPanorama(null)
    setDisplayedPanorama(null);
  }, []);

  const updateCurrentPov = ((heading: number, pitch: number, zoom: number) => {
    console.log("CurrentPanorama:", currentPanorama)
    console.log("1. Heading: ", currentPanorama?.heading)
    if(!currentPanorama) return;
    const newPano = { ...currentPanorama, heading: heading, pitch: pitch, zoom: zoom };
    setCurrentPanorama(newPano);
    setDisplayedPanorama(newPano);
    console.log("Heading: ", currentPanorama.heading)
  });

  const updateCurrentPos = ((panoId: string, lat: number, lng: number) => {
    if(!currentPanorama) return;
    const newPano = { ...currentPanorama, panoId: panoId, lat: lat, lng: lng };
    setCurrentPanorama(newPano);
    setDisplayedPanorama(newPano);
  });

  async function clickedMap(latLng: google.maps.LatLng): Promise<LocalPano | null> {
    console.log("Clicked at: ", latLng.lat(), ", ", latLng.lng())
    const svPanoData = await getPanoramaFromCoords(latLng.lat(), latLng.lng());
    return convertSvPanoramaData(svPanoData) as LocalPano | null;
  }

  return {
    localPanos,
    currentPanorama,
    displayedPanorama,
    currentPanoramaIsNew,
    currentSvPanorama,
    setCurrentPanorama,
    setDisplayedPanorama,
    addLocalPano,
    updateLocalPano,
    deleteLocalPano,
    getLocalPanoById,
    setCurrentSvPanorama,
    isLoading,
    error,
    loadPanoramaByLocation,
    loadPanoramaByPanoId,
    loadExistingPanorama,
    loadNewPanorama,
    clearCurrentPano,
    updateCurrentPov,
    updateCurrentPos,
    clickedMap,
  };
}