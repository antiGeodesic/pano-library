// utils/geoContainment.ts
/*
import { point, FeatureCollection, Feature, Polygon, MultiPolygon } from '@turf/helpers';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';


interface GeojsonInfo {
  country: string;
    data: FeatureCollection<Polygon | MultiPolygon>;
}
let cachedFiles: GeojsonInfo[] = [];
let isAssigned = false;
async function addData(country: string): Promise<GeojsonInfo | null> {
  try {
    const geojson: FeatureCollection<Polygon | MultiPolygon> = await import(`@/data/countries/${country}.json`);
  const item = {country: country, data: geojson}
  if(!isAssigned) {
    cachedFiles = [item]
    isAssigned = true;
  }
  else {
    cachedFiles.push(item)
  }
  return item;
  }
  catch {
   //commented-console.warn("Somethign went wrong with getting geojson data")
    return null;
  }
}

async function getData(country: string): Promise<FeatureCollection<Polygon | MultiPolygon> | null> {
  const exists = cachedFiles.some(item => item.country === country)
  if(!exists) {
    return await addData(country);
  }
  else {
    return cachedFiles.find(item => item.country === country)?.data ?? null;
  }
}

export async function isCoordinateInCountry(
  lat: number,
  lng: number,
  country: string
): Promise<boolean> {
  try {
    // Dynamically import the country's GeoJSON file
    const geojson = await getData(country);
    const pt = point([lng, lat]);
    if(!geojson){
     //commented-console.error(`Error getting geojson data for ${country}:`);
      return false;
    }
    try {
      for (const feature of geojson.features) {
        if (booleanPointInPolygon(pt, feature)) {
          return true;
        }
      }
    } catch {
      try {
      for (const feature of geojson.geometry) {
        if (booleanPointInPolygon(pt, feature)) {
          return true;
        }
      } 
    }
    catch {
console.log("catch x3")
console.log(geojson.geometry.type)
if(geojson.geometry.type == "Polygon") {
  if (booleanPointInPolygon(pt, geojson.geometry)) {
   //commented-console.log(geojson.geometry.type)
    return true;
  }
}
        
    }
    }
    

    return false;
  } catch (error) {
   //commented-console.error(`Error checking containment for ${country}:`, error);
    return false;
  }
}
*/


// utils/geoContainment.ts
type LatLngList = {
  lat: {
    [lat: string]: {
      [lng: string]: {
        countries: string[];
      };
    };
  };
};
type CountryNameMap = {
  A3: Record<string, string>;
};



import { point } from '@turf/helpers';
import type { Polygon, MultiPolygon, Feature } from 'geojson';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import rawCountryNames from "@/data/countries_a3.json";
const countryNames = rawCountryNames as CountryNameMap;
import rawLatLngList from "@/data/latLngList.json";
const latLngList = rawLatLngList as LatLngList;
export async function isCoordinateInCountry(
  lat: number,
  lng: number,
  country: string
): Promise<boolean> {
  try {
    const imported = await import(`@/data/countries/${country}.json`);
    const geojson = imported.default as Feature<Polygon | MultiPolygon>;

    if (
      !geojson ||
      !geojson.geometry ||
      !geojson.geometry.coordinates ||
      !geojson.geometry.coordinates.length
    ) {
     //commented-console.error("Invalid geometry for country:", country, geojson.geometry);
      return false;
    }

    const pt = point([lng, lat]);
    const isInside = booleanPointInPolygon(pt, geojson);

    return isInside;
  } catch (error) {
   console.error(`Error checking containment for ${country}:`, error);
    return false;
  }
}


export async function getCountryA3FromCoordinate(lat: number, lng: number): Promise<string> {
  const roundedLat = Math.floor(lat).toString();
  const roundedLng = Math.floor(lng).toString();

  const countries = latLngList.lat?.[roundedLat]?.[roundedLng]?.countries;
 //commented-console.log("[geoContainment.ts]" ,countries)
  if (Array.isArray(countries) && countries.length == 1) {
    return countries[0];
  } else if(Array.isArray(countries)) {
    for(const country of countries) {
      const isInCountry = await isCoordinateInCountry(lat, lng, country)
      if(isInCountry) {
        return country;
      }
    }
   //commented-console.error(`Did not find a matching country at coordinate (lat: ${lat}, lng: ${lng})`)
   //commented-console.error("Countries are: ", countries)
    return "Unknown";
  }
  else {
   //commented-console.warn(`No data for lat ${lat}, lng ${lng}`);
    return "Unknown";
  }
}
export async function getCountryFromCoordinate(lat: number, lng: number): Promise<string> {
  const countryA3: string = await getCountryA3FromCoordinate(lat, lng);
  if(countryA3 == "Unknown") return countryA3;
  try {
    const country = countryNames.A3[countryA3];
    if(country) return country;
  } catch {
   //commented-console.error("No Country Was found when converting from A3 - ", countryA3);
    
  }
  return countryA3;
}