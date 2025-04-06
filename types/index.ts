// types/index.ts
// Base panorama data type
export interface PanoramaData {
  panoId: string;
  lat: number;
  lng: number;
  date?: string; // Optional, not all panoramas may have a known date
  description: string;
  tags: string[];
  heading: number;
  pitch: number;
  zoom?: number;
  movementHistory: {panoId: string, lat: number, lng: number}[];
}

// Alternate panorama might just be a type alias if no extra fields are needed
export type AlternatePanorama = PanoramaData;

export interface PanoramaValues {
  panoId: string,
  lat: number,
  lng: number,
  heading: number,
  pitch: number,
  zoom: number
}

// Local panorama might add local-specific fields if any
export interface LocalPano {
  localId: string; // A unique identifier for local storage
  panoId: string;
  lat: number;
  lng: number;
  date: string; // Optional, not all panoramas may have a known date
  description: string;
  tags: string[];
  heading: number;
  pitch: number;
  zoom: number;
  movementHistory: {panoId: string, lat: number, lng: number}[];
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
    currentPanoramaIsNew: boolean;
    currentSvPanorama: google.maps.StreetViewPanorama | null;
    addLocalPano: (panoData: Omit<LocalPano, 'localId'>) => void;
    updateLocalPano: (panoData: LocalPano) => void;
    deleteLocalPano: (localId: string) => void;
    setCurrentPanorama: (panorama: LocalPano | null) => void;
    setDisplayedPanorama: (panorama: LocalPano | null) => void;
    getLocalPanoById: (localId: string) => LocalPano | undefined;
    setCurrentSvPanorama: (panorama: google.maps.StreetViewPanorama | null) => void;
    isLoading: boolean;
    error: string | null;
    loadPanoramaByLocation: (lat: number, lng: number ) => void;
    loadPanoramaByPanoId: (panoId: string) => void;
    loadExistingPanorama: (localPano: LocalPano ) => void;
    loadNewPanorama: (localPano: LocalPano ) => void;
    clearCurrentPano: () => void;
    updateCurrentPov: (heading: number, pitch: number, zoom: number) => void;
    updateCurrentPos: (panoId: string, lat: number, lng: number) => void;
    clickedMap: (latLng: google.maps.LatLng) => Promise<LocalPano | null>;
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