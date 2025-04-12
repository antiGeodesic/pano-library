import { useState, useCallback } from 'react';
import { ExplorerContextType,  } from '@/types/Explorer';
import { PanoramaData } from '@/types/index';
import { getPanoramaFromCoords } from '@/services/googleMapsService'
import { convertSvPanoramaData, convertFromDataBasePano } from '@/utils/helpers'
import { downloadAll, downloadByTag, downloadByTagKeyword } from '@/utils/subabase-helpers';


export function useExplorerManager(): ExplorerContextType {
    const [displayedPano, setDisplayedPano] = useState<PanoramaData | null>(null)
    const [initialPano, setInitialPano] = useState<PanoramaData | null>(null);
    const [pendingPano, setPendingPano] = useState<PanoramaData | null>(null);
    const [displayedPanos, setDisplayedPanos] = useState<PanoramaData[]>([]);


    const clearCurrentPano = useCallback(() => {
      setInitialPano(null);
      setDisplayedPano(null);
      setPendingPano(null);
    }, []);
    const displayAll = useCallback(async (): Promise<boolean> => {
        const data = await downloadAll();
        if (data) {
            console.log("Yes")
            for(const pano of data) {
                console.log("lat: ", pano.lat, "lng: ", pano.lng)
            }
            setDisplayedPanos(data.map(dbPano => convertFromDataBasePano(dbPano)));
        }
        return typeof data !== null;
    }, []);
    const displayByTag = useCallback(async (tag: string): Promise<boolean> => {
        console.log("Display By Tag")
        const data = await downloadByTag(tag);
        if (data) {
            console.log("Yes")
            for(const pano of data) {
                console.log("lat: ", pano.lat, "lng: ", pano.lng)
            }
            setDisplayedPanos(data.map(dbPano => convertFromDataBasePano(dbPano)));
        }
        return typeof data !== null;
    }, []);
    const displayByTagKeyword = useCallback(async (tag: string): Promise<boolean> => {
        console.log("Display By Tag")
        const data = await downloadByTagKeyword(tag);
        if (data) {
            console.log("Yes")
            for(const pano of data) {
                console.log("lat: ", pano.lat, "lng: ", pano.lng)
            }
            setDisplayedPanos(data.map(dbPano => convertFromDataBasePano(dbPano)));
        }
        return typeof data !== null;
    }, []);





      const getExistingPanoById = useCallback((localId: string): PanoramaData | undefined => {
        return displayedPanos.find(pano => {if(pano.localId === localId) return pano});
      }, [displayedPanos]);

        const loadExistingPano = useCallback((requestedPano: PanoramaData) => {
          
          console.warn("hello?")
          
          const localPano = getExistingPanoById(requestedPano.localId);
          if(!localPano) {
            console.warn("no saved pano was found")
            return;
          } 
          setInitialPano(localPano);
          setDisplayedPano(localPano);
          setPendingPano(localPano);
        }, [getExistingPanoById]);
    async function clickedMap(latLng: google.maps.LatLng): Promise<PanoramaData | null> {
        //-commented-console.log("Clicked at: ", latLng.lat(), ", ", latLng.lng())
        const svPanoData = await getPanoramaFromCoords(latLng.lat(), latLng.lng());
        console.log(svPanoData)
        console.log(JSON.stringify(svPanoData))
        const panoramaData = await convertSvPanoramaData(svPanoData) as PanoramaData | null;
        return panoramaData;
      }
    const loadNewPano = useCallback(async (panoramaData: PanoramaData) => {
      setInitialPano(panoramaData);
      setDisplayedPano(panoramaData);
      setPendingPano(panoramaData);
    }, [setInitialPano, setDisplayedPano]);

    
      const setPanoId = useCallback((panoId: string) => {
        if(!displayedPano) return;
        const newLocalPano = {...displayedPano, panoId: panoId, movementHistory: [{panoId: displayedPano.panoId, lat: displayedPano.lat, lng: displayedPano.lng}]}
        setInitialPano(newLocalPano);
        setDisplayedPano(newLocalPano);
        setPendingPano(newLocalPano);
      }, [displayedPano]);

      const updateCurrentPov = useCallback(((heading: number, pitch: number, zoom: number) => {
        //-commented-console.log("CurrentPanorama:", displayedPano)
        //-commented-console.log("1. Heading: ", displayedPano?.heading)
        if(!displayedPano) return;
        const newPano = {...initialPano, ...displayedPano, heading: heading, pitch: pitch, zoom: zoom };
        setDisplayedPano(newPano);
        //-commented-console.log("Heading: ", displayedPano.heading)
      }), [initialPano, displayedPano]);
    
      const updateCurrentPos = useCallback(((panoId: string, lat: number, lng: number) => {
        if(!displayedPano) return;
        const newPano = { ...initialPano, ...displayedPano, panoId: panoId, lat: lat, lng: lng, movementHistory: [...displayedPano.movementHistory, {panoId: panoId, lat: lat, lng: lng}] };
        setDisplayedPano(newPano);
      }), [initialPano, displayedPano]);
    return {
        displayedPano,
        setDisplayedPano,
        initialPano,
        setInitialPano,
        pendingPano,
        setPendingPano,
        setPanoId,
        loadNewPano,
        displayedPanos,
        displayAll,
        displayByTag,
        displayByTagKeyword,
        clearCurrentPano,
        getExistingPanoById,
        loadExistingPano,
        clickedMap,
        updateCurrentPos,
        updateCurrentPov
    };
}