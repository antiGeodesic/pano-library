// types/index.ts
import {PanoramaData, TagCategory} from '@/types/index'
export type LocalPano = PanoramaData;
export interface PanoramaValues {
  panoId: string,
  lat: number,
  lng: number,
  heading: number,
  pitch: number,
  zoom: number
}
export interface TagStructure {
  category: string;
  index: number;
  subCategories: {
    subCategory: string;
    index: number;
    subSubCategories: {
      subSubCategory: string;
      index: number;
    }[];
  }[];
}
/*export interface TagCategory {
  x: number,
  y: number,
  z: number,
  t: string
}
// Local panorama might add local-specific fields if any
export interface LocalPano {
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
  availableDates: {panoId: string, date: string}[];
  description: string;
  tags: TagCategory[];
  
  movementHistory: {panoId: string, lat: number, lng: number}[];
}*/
export interface DataBaseItem {
  gen: string;
  panoId: string;
  lat: number;
  lng: number;
  heading: number;
  pitch: number;
  zoom: number;
  date: string;
  address: {country: string, subdivision: string, region: string, road: string};
  description: string;
  tags: TagCategory[];
}
export interface control {
  dates: google.maps.StreetViewLocationRequest
}
export type SVRequestOptions =
  | {
    panoId: string;
    location?: never;
    radius?: never;
    source?: google.maps.StreetViewSource;
    preference?: google.maps.StreetViewPreference;
  }
  | {
    panoId?: never;
    location: google.maps.LatLng | google.maps.LatLngLiteral;
    radius?: number;
    source?: google.maps.StreetViewSource;
    preference?: google.maps.StreetViewPreference;
  };
  export interface LocalEditorContextType {
    localPanos: LocalPano[];
    currentPanorama: LocalPano | null;
    displayedPanorama: LocalPano | null;
    pendingPanorama: LocalPano | null;
    currentPanoramaIsNew: boolean;
    currentSvPanorama: google.maps.StreetViewPanorama | null;

    publishLocalPanos: () => Promise<boolean>;
    addLocalPano: (panoData: LocalPano) => void;
    updateLocalPano: (panoData: LocalPano) => void;
    deleteLocalPano: (localId: string) => void;
    setCurrentPanorama: (panorama: LocalPano | null) => void;
    setDisplayedPanorama: (panorama: LocalPano | null) => void;
    setPendingPanorama: (panorama: LocalPano | null) => void;
    getExistingPanoById: (localId: string) => LocalPano | undefined;
    setCurrentSvPanorama: (panorama: google.maps.StreetViewPanorama | null) => void;
    isLoading: boolean;
    //error: string | null;
    loadPanoramaByLocation: (lat: number, lng: number ) => void;
    loadPanoramaByPanoId: (panoId: string) => void;
    loadExistingPanorama: (localPano: LocalPano ) => void;
    loadNewPanorama: (localPano: LocalPano ) => void;
    clearCurrentPano: () => void;
    updateCurrentPov: (heading: number, pitch: number, zoom: number) => void;
    updateCurrentPos: (panoId: string, lat: number, lng: number) => void;
    //toggleCurrentTags: (tag: TagCategory) => void;
    setCurrentTags: (tag: TagCategory[]) => void;
    updateCurrentTags: (index: number, tag: TagCategory | null) => void;
    updateCurrentDescription: (description: string) => void;
    clickedMap: (latLng: google.maps.LatLng) => Promise<LocalPano | null>;
    setStreetViewPanoId: (panoId: string) => void;
    saveDisplayedPano: () => void;
    updateDisplayedPano: () => void;
    deleteDisplayedPano: () => void;
    clearDisplayedPano: () => void;




    setLocalPanoList: (newLPs: LocalPano[]) => void;
  }
  // --- NEW TYPES ---

// Simple type for Point of View
export interface PointOfView {
  heading: number;
  pitch: number;
  zoom: number;
}
export interface Coordinate {
lat: number;
lng: number;
}
// Represents the complete live state of the viewer
export interface LiveViewerState {
  panoId: string;
  lat: number;
  lng: number;
  date: string | null;
  pov: PointOfView;
}

export interface PanoState {
panoId: string;
coord: Coordinate;
pov: PointOfView;
}
/*
// Existing types...
export interface LocalPano {
  id: string; // Unique ID for tracking
  panoId: string;
  coord: Coordinate;
  pov: PointOfView;
  panoDate: string | null;
  //lat: number;
  //lng: number;
  //heading: number;
  //pitch: number;
  //zoom: number;
  description: string;
  tags: string[];
}

export interface CurrentPanoData {
  panoId: string;
  lat: number;
  lng: number;
  date: string | null; // Make non-optional if always available
}

export interface AlternatePanorama {
  panoId: string;
  date: string;
}

export type SVRequestOptions =
  | {
    panoId: string;
    location?: never;
    radius?: never;
    source?: google.maps.StreetViewSource;
    preference?: google.maps.StreetViewPreference;
  }
  | {
    panoId?: never;
    location: google.maps.LatLng | google.maps.LatLngLiteral;
    radius?: number;
    source?: google.maps.StreetViewSource;
    preference?: google.maps.StreetViewPreference;
  };

export interface TilePanorama {
    panoId: string;
    lat: number;
    lng: number;
}

// --- NEW TYPES ---

// Simple type for Point of View
export interface PointOfView {
    heading: number;
    pitch: number;
    zoom: number;
}
export interface Coordinate {
  lat: number;
  lng: number;
}
// Represents the complete live state of the viewer
export interface LiveViewerState {
    panoId: string;
    lat: number;
    lng: number;
    date: string | null;
    pov: PointOfView;
}

export interface PanoState {
  panoId: string;
  coord: Coordinate;
  pov: PointOfView;
}*/