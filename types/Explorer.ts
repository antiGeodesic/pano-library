import {PanoramaData} from '@/types/index'
  
  export interface ExplorerContextType {
    
    
    displayedPano: PanoramaData | null;
    setDisplayedPano: (panoramaData: PanoramaData | null) => void;
    initialPano: PanoramaData | null;
    setInitialPano: (panoramaData: PanoramaData | null) => void;
    pendingPano: PanoramaData | null;
    setPendingPano: (panoramaData: PanoramaData | null) => void;
    loadNewPano: (panoramaData: PanoramaData) => void;
    displayedPanos: PanoramaData[];
    getExistingPanoById: (localId: string) => PanoramaData | undefined;
    loadExistingPano: (localPano: PanoramaData ) => void;

    displayAll: () => Promise<boolean>;
    displayByTag: (tag: string) => Promise<boolean>;
    displayByTagKeyword: (tag: string) => Promise<boolean>;

    clearCurrentPano: () => void;
    clickedMap: (latLng: google.maps.LatLng) => Promise<PanoramaData | null>;
    setPanoId: (panoId: string) => void;

    updateCurrentPov: (heading: number, pitch: number, zoom: number) => void;
    updateCurrentPos: (panoId: string, lat: number, lng: number) => void;
  }