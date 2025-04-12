// utils/helpers.ts
import { PanoramaData, DataBasePano } from '@/types';
import { LocalPano, DataBaseItem } from '@/types/LocalEditor'; // Corrected import
import { getCountryFromCoordinate } from '@/utils/geoContainment';
//import { Ue } from '@/services/googleMapsService';
export function extractImageDate(data: google.maps.StreetViewPanoramaData): string {
  // Use optional chaining and nullish coalescing for safety
  // The 'any' assertion is sometimes necessary due to incomplete Google Maps types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyData = data as any;
  return anyData?.imageDate ?? anyData?.tiles?.imageDate ?? 'unknown';
}
function getLinkedCoverage(data: google.maps.StreetViewPanoramaData): {panoId: string, date: string}[] {
  // Parse the data to access all properties
  const parsedData = JSON.parse(JSON.stringify(data));
  
  // Check if time property exists
  if (!parsedData.time || !Array.isArray(parsedData.time)) {
    console.warn('Time data not found or not in expected format', parsedData);
    return [];
  }
  
  // Log for debugging
  console.warn('Coverage data structure:', parsedData.time);
  
  // Define a more specific type for the date objects
  type DateObject = {
    pano: string;
    [key: string]: unknown; // Allow for unknown properties without using 'any'
  };
  
  return parsedData.time.map((dateObj: DateObject) => {
    // Extract pano ID - this seems to be consistent
    const panoId = dateObj.pano;
    
    // Find the date value by looking for strings that match date format
    let date: string | null = null;
    
    // Iterate through all properties looking for date-like strings
    const keys = Object.keys(dateObj).filter(key => key !== 'pano');
    for (const key of keys) {
      const value = dateObj[key];
      
      // Check if the value is a string and follows ISO date format
      if (
        typeof value === 'string' && 
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)
      ) {
        date = value;
        break;
      }
    }
    
    if (!date) {
      console.warn('Could not find date property for panorama:', panoId);
    }
    
    return {
      panoId,
      date: date || 'Unknown Date'
    };
  });
}
//function getLinkedCoverage(data: google.maps.StreetViewPanoramaData): {panoId: string, date: string}[] {
//  const dates: {pano: string, Mu: string}[] = JSON.parse((JSON.stringify(data))).time;
//  console.warn(dates);
//  return dates.map(date => ({panoId: date.pano, date: date.Mu}));
//}
export async function getPanoramaAddress(data: google.maps.StreetViewPanoramaData): Promise<{country: string, subdivision: string, region: string, road: string}> {
  let address =  {country: "", subdivision: "", region: "", road: ""}
  if(!data.location || !data.location.latLng)
    return address;
  const country = await getCountryFromCoordinate(data.location.latLng.lat(), data.location.latLng.lng());
  const dataAddress = data.location?.description?.split(', ');
  console.log(dataAddress)
  if(dataAddress?.length == 3)
    address = {country: country, subdivision: dataAddress[2], region: dataAddress[1], road: dataAddress[0]}
  else if(dataAddress?.length == 2)
    address = {country: country, subdivision: dataAddress[1], region: "", road: dataAddress[0]}
  else if(dataAddress?.length == 1)
    address = {country: country, subdivision: dataAddress[0], region: "", road: ""}

  //const metaData = await Ue(data.location?.pano )
  //console.log(metaData);
  /*if(metaData)
  {
    try{
      console.log(`countryTag: ${metaData[5][0][1][4]}`)
    }
    catch(error){
        countryTag=null
    }
    try{
        console.log(`elevationTag: ${metaData[5][0][1][1][0]}`)
      }
    catch(error){
        elevationTag=null
    }
    try{
        console.log(`roadTag: ${metaData[5][0][12][0][0][0][2][0]}`)
      }
    catch(error){
        roadTag=null
    }
    try{
        console.log(`driDirTag: ${ccData[5][0][1][2][0]}`)
      }
    catch(error){
        driDirTag=null
    }
    try{
        console.log(`trekkerTag: ${ccData[6][5]}`)
      }
    catch(error){
        trekkerTag=null
    }
    try{
        console.log(`floorTag: ${ccData[5][0][1][3][2][0]}`)
          }
    }
    catch(error){
        floorTag=null
    }*/
   return address;
  }
  

export async function convertSvPanoramaData(data: google.maps.StreetViewPanoramaData | null): Promise<PanoramaData | null> {
  if(!data || !data.location || !data.location.pano || !data.location.latLng || !data) return null;

  console.log("[Helpers}---------", data);
  const address = await getPanoramaAddress(data);
  return {
    gen: getCameraGen(data, address.country),
    localId: crypto.randomUUID(),
    panoId: data.location.pano as string,
    lat: data.location.latLng.lat() as number,
    lng: data.location.latLng.lng() as number,
    heading: data.links && data.links.length > 0 ? data.links[0].heading ?? 0 : 0,
    pitch: 0,
    zoom: 1,
    address: address,
    description: "",
    tags: [],
    date: data.imageDate,
    availableDates: getLinkedCoverage(data),
    movementHistory: [{panoId: data.location.pano as string, lat: data.location.latLng.lat() as number, lng: data.location.latLng.lng() as number}]
  } as LocalPano;
}
export function convertToDataBaseItem(localPano: LocalPano) : DataBaseItem {
  return {
    gen: localPano.gen,
    panoId: localPano.panoId,
    lat: localPano.lat,
    lng: localPano.lng,
    heading: localPano.heading,
    pitch: localPano.pitch,
    zoom: localPano.zoom,
    date: localPano.date,
    address: {country: localPano.address.country, subdivision: localPano.address.subdivision, region: localPano.address.region, road: localPano.address.road},
    description: localPano.description,
    tags: localPano.tags.map(tag => ({x: tag.x, y: tag.y, z: tag.z, t: tag.t}))
  }
}
export function convertFromDataBasePano(dbPano: DataBasePano) : PanoramaData {
  return {
    localId: dbPano.id?.toString(),
    gen: dbPano.gen,
    panoId: dbPano.panoId,
    lat: dbPano.lat,
    lng: dbPano.lng,
    heading: dbPano.heading,
    pitch: dbPano.pitch,
    zoom: dbPano.zoom,
    date: dbPano.date,
    address: dbPano.address,
    availableDates: [],
    description: dbPano.description,
    tags: dbPano.tags,
    movementHistory: []
  }
}
function gen2or3(data: google.maps.StreetViewPanoramaData, country: string): string {
  const date=new Date();

  
    if(country == 'Australia') {if(date < new Date('2010-06')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Brazil') {if(date < new Date('2010-04')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Canada') {if(date < new Date('2010-06')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Japan') {if(date < new Date('2011-10')) {return "Gen 2"} return "Gen 3"}
    if(country == 'United Kingdom') {if(date < new Date('2012-04')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Ireland') {if(date < new Date('2011-11')) {return "Gen 2"} return "Gen 3"}
    if(country == 'New Zealand') {if(date < new Date('2010-04')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Mexico') {if(date < new Date('2011-05')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Russia') {if(date < new Date('2011-11')) {return "Gen 2"} return "Gen 3"}
    if(country == 'United States of America') {if(date < new Date('2011-11')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Italy') {if(date < new Date('2011-01')) {return "Gen 2"} else if(date < new Date('2012-01')) return "Gen 2 or 3"; return "Gen 3"}
    if(country == 'Denmark') {if(date < new Date('2011-12')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Greece') {if(date < new Date('2011-11')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Romania') {if(date < new Date('2010-12')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Poland') {if(date < new Date('2011-05')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Czechia') {if(date < new Date('2010-01')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Switzerland') {if(date < new Date('2012-12')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Sweden') {if(date < new Date('2012-12')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Finland') {if(date < new Date('2012-12')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Belgium') {if(date < new Date('2011-12')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Luxembourg') {if(date < new Date('2011-12')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Netherlands') {if(date < new Date('2012-12')) {return "Gen 2"} return "Gen 3"}
    if(country == 'South Africa') {if(date < new Date('2011-12')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Singapore') {if(date < new Date('2010-12')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Taiwan') {if(date < new Date('2011-11')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Hong Kong') {if(date < new Date('2009-12')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Macao') {if(date < new Date('2010-01')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Monaco') {if(date < new Date('2011-11')) {return "Gen 2"} return "Gen 3"}
    if(country == 'San Marino') {if(date < new Date('2010-11')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Andorra') {if(date < new Date('2011-12')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Isle of Man') {if(date < new Date('2010-12')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Jersey') {if(date < new Date('2010-12')) {return "Gen 2"} return "Gen 3"}
    if(country == 'France') {if(date < new Date('2011-12')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Germany') {if(date < new Date('2012-12')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Spain') {if(date < new Date('2011-12')) {return "Gen 2"} return "Gen 3"}
    if(country == 'Portugal') {if(date < new Date('2010-12')) {return "Gen 2"} return "Gen 3"}
  return "Gen 3";
}
function findCameraGen(data: google.maps.StreetViewPanoramaData, country: string) {

    if (data&&data.tiles) {
        if (data.tiles.worldSize.height === 1664) { // Gen 1
            return 'Gen 1';
        } else if (data.tiles.worldSize.height === 6656) { // Gen 2 or 3

            const lat = data.location?.latLng?.lat() ?? -90;

            let date;
            if (data.imageDate) {
                date = new Date(data.imageDate);
            } else {
                date = 'nodata';
            }

            if (date!=='nodata'&&((country === 'BD' && (date >= new Date('2021-04'))) ||
                                  (country === 'EC' && (date >= new Date('2022-03'))) ||
                                  (country === 'FI' && (date >= new Date('2020-09'))) ||
                                  (country === 'IN' && (date >= new Date('2021-10'))) ||
                                  (country === 'LK' && (date >= new Date('2021-02'))) ||
                                  (country === 'KH' && (date >= new Date('2022-10'))) ||
                                  (country === 'LB' && (date >= new Date('2021-05'))) ||
                                  (country === 'NG' && (date >= new Date('2021-06'))) ||
                                  (country === 'ST') ||
                                  (country === 'US' && lat > 52 && (date >= new Date('2019-01'))))) {
                return 'Shitcam';
            }
            return gen2or3(data, country)
        }
        else if(data.tiles.worldSize.height === 8192){
            return 'Gen 4';
        }
    }
    return 'Unknown';
}
const panoIdCameraGenCache: {panoId: string, gen: string}[] = [];
export function getCameraGen(data: google.maps.StreetViewPanoramaData, country: string) {
  console.warn("...")
  console.error("gen --- 1")
  const dataLocation = data.location;
  if(!dataLocation) return;
  const genCache = panoIdCameraGenCache.find(item => item.panoId === dataLocation.pano)
  if(genCache) return genCache.gen;
  const gen = findCameraGen(data, country);
  console.error("gen --- 2")
  panoIdCameraGenCache.push({panoId: dataLocation.pano, gen: gen});
  return gen;
}