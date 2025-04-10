import {PanoramaData, TagCategory} from '@/types/index'
  
  export interface ExplorerContextType {
    
    
    displayedPano: PanoramaData | null;
    setDisplayedPano: (panoramaData: PanoramaData | null) => void;
    initialPano: PanoramaData | null;
    setInitialPano: (panoramaData: PanoramaData | null) => void;
    pendingPano: PanoramaData | null;
    setPendingPano: (panoramaData: PanoramaData | null) => void;
    loadNewPano: (panoramaData: PanoramaData) => void;
    displayedPanos: DataBasePano[];



    displayAll: () => Promise<boolean>;
    displayByTag: (tag: string) => Promise<boolean>;
    displayByTagKeyword: (tag: string) => Promise<boolean>;


    clickedMap: (latLng: google.maps.LatLng) => Promise<PanoramaData | null>;
    setPanoId: (panoId: string) => void;

    updateCurrentPov: (heading: number, pitch: number, zoom: number) => void;
    updateCurrentPos: (panoId: string, lat: number, lng: number) => void;
  }

  export interface DataBasePano {
    id: number;
    gen: string;
    localId: string; // A unique identifier for local storage
    panoId: string;
    lat: number;
    lng: number;
    heading: number;
    pitch: number;
    zoom: number;
    date: string;
    address: string;
    description: string;
    tags: TagCategory[];
  }
