// utils/helpers.ts
import { useState, useCallback } from 'react';
import { LocalPano } from '@/types'; // Corrected import
import { StreetViewPanorama } from '@react-google-maps/api';
export function extractImageDate(data: google.maps.StreetViewPanoramaData): string {
  // Use optional chaining and nullish coalescing for safety
  // The 'any' assertion is sometimes necessary due to incomplete Google Maps types
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyData = data as any;
  return anyData?.imageDate ?? anyData?.tiles?.imageDate ?? 'unknown';
}

export function convertSvPanoramaData(data: google.maps.StreetViewPanoramaData | null): LocalPano | null {
  if(!data || !data.location || !data.location.pano || !data.location.latLng) return null;

  return {
    localId: crypto.randomUUID(),
    panoId: data.location.pano as string,
    lat: data.location.latLng.lat() as number,
    lng: data.location.latLng.lng() as number,
    heading: data.links && data.links.length > 0 ? data.links[0].heading ?? 0 : 0,
    pitch: 0,
    zoom: 1,
    description: "",
    tags: [],
    date: data.imageDate,
  } as LocalPano;
}
