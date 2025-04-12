export interface PanoramaData {
  gen: string;
  localId: string; // A unique identifier for local storage
  panoId: string;
  lat: number;
  lng: number;
  heading: number;
  pitch: number;
  zoom: number;
  date: string;
  address: {country: string, subdivision: string, region: string, road: string};
  availableDates: {panoId: string, date: string, gen: string, panoData: google.maps.StreetViewPanoramaData | null}[];
  description: string;
  tags: TagCategory[];
  movementHistory: {panoId: string, lat: number, lng: number}[];
}

export interface TagCategory {
    x: number,
    y: number,
    z: number,
    t: string
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
    address: {country: string, subdivision: string, region: string, road: string};
    description: string;
    tags: TagCategory[];
  }

  export interface PrimaryPanoramaDataGroup {
    state: number;
    value: string;
    color: string;
    subGroups: SecondaryPanoramaDataGroup[];
  }
  export interface SecondaryPanoramaDataGroup {
    state: number;
    value: string;
    color: string;
    localIds: string[] | number[];
  }