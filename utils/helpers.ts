// utils/helpers.ts
import { LocalPano, DataBaseItem } from '@/types/LocalEditor'; // Corrected import
import { Ue } from '@/services/googleMapsService';
export function extractImageDate(data: google.maps.StreetViewPanoramaData): string {
  // Use optional chaining and nullish coalescing for safety
  // The 'any' assertion is sometimes necessary due to incomplete Google Maps types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyData = data as any;
  return anyData?.imageDate ?? anyData?.tiles?.imageDate ?? 'unknown';
}
function getLinkedCoverage(data: google.maps.StreetViewPanoramaData): {panoId: string, date: string}[] {
  const dates: {pano: string, Mu: string}[] = JSON.parse((JSON.stringify(data))).time;
  console.warn(dates);
  return dates.map(date => ({panoId: date.pano, date: date.Mu}));
}
export async function getPanoramaAddress(data: google.maps.StreetViewPanoramaData): Promise<{country: string, subdivision: string, region: string, road: string}> {
  let address =  {country: "", subdivision: "", region: "", road: ""}
  if(!data.location)
    return address;
  const dataAddress = data.location?.description?.split(', ');
  
  if(dataAddress?.length == 2)
    address = {country: "", subdivision: dataAddress[2], region: dataAddress[1], road: dataAddress[0]}
  else if(dataAddress?.length == 1)
    address = {country: "", subdivision: dataAddress[1], region: "", road: dataAddress[0]}
  else if(dataAddress?.length == 0)
    address = {country: "", subdivision: dataAddress[0], region: "", road: ""}

  const metaData = await Ue(data.location?.pano )
  console.log(metaData);
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
  

export async function convertSvPanoramaData(data: google.maps.StreetViewPanoramaData | null): Promise<LocalPano | null> {
  if(!data || !data.location || !data.location.pano || !data.location.latLng || !data) return null;

  console.log("[Helpers}---------", data);
  return {
    gen: "4",
    localId: crypto.randomUUID(),
    panoId: data.location.pano as string,
    lat: data.location.latLng.lat() as number,
    lng: data.location.latLng.lng() as number,
    heading: data.links && data.links.length > 0 ? data.links[0].heading ?? 0 : 0,
    pitch: 0,
    zoom: 1,
    address: await getPanoramaAddress(data),
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
/*function isGen2(data: google.maps.StreetViewPanoramaData, country: string) {
  const date=new Date();
  return(
    (country == 'AU' && date < new Date('2010-06'))
  || (country == 'BR' && date < new Date('2010-04'))
  || (country == 'CA' && date < new Date('2010-06'))
  || (country == 'CL' && false )//Trekker
  || (country == 'JP' && date < new Date('2011-10'))
  || (country == 'GB' && date < new Date('2012-04'))
  || (country == 'IE' && date < new Date('2011-11'))
  || (country == 'NZ' && date < new Date('2010-04'))
  || (country == 'MX' && date < new Date(''))
  || (country == 'RU' && date < new Date(''))
  || (country == 'US' && date < new Date(''))
  || (country == 'IT' && date < new Date(''))
  || (country == 'DK' && date < new Date(''))
  || (country == 'GR' && date < new Date(''))
  || (country == 'RO' && date < new Date(''))
  || (country == 'PL' && date < new Date(''))
  || (country == 'CZ' && date < new Date(''))
  || (country == 'CH' && date < new Date(''))
  || (country == 'SE' && date < new Date(''))
  || (country == 'FI' && date < new Date(''))
  || (country == 'BE' && date < new Date(''))
  || (country == 'LU' && date < new Date(''))
  || (country == 'NL' && date < new Date(''))
  || (country == 'ZA' && date < new Date(''))
  || (country == 'SG' && date < new Date(''))
  || (country == 'TW' && date < new Date(''))
  || (country == 'HK' && date < new Date(''))
  || (country == 'MO' && date < new Date(''))
  || (country == 'MC' && date < new Date(''))
  || (country == 'SM' && date < new Date(''))
  || (country == 'AD' && date < new Date(''))
  || (country == 'IM' && date < new Date(''))
  || (country == 'JE' && date < new Date(''))
  || (country == 'FR' && date < new Date(''))
  || (country == 'DE' && date < new Date(''))
  || (country == 'ES' && date < new Date(''))
  || (country == 'PT' && date < new Date(''))
  || (country == 'SJ' && date < new Date('')))
}*//*
export function getCameraGen(data: google.maps.StreetViewPanoramaData, country: string) {

    if (data&&data.tiles) {
        if (data.tiles.worldSize.height === 1664) { // Gen 1
            return 'Gen1';
        } else if (data.tiles.worldSize.height === 6656) { // Gen 2 or 3

            let lat;
            for (let key in data.Sv) {
                lat = data.Sv[key].lat;
                break;
            }

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
                return 'Badcam';
            }
            if (gen2Countries.includes(country)||country=='Country not found'||!country) {
                return 'Gen2or3';
            }
            else{
                return 'Gen3';}
        }
        else if(data.tiles.worldSize.height === 8192){
            return 'Gen4';
        }
    }
    return 'Unknown';
}
*/