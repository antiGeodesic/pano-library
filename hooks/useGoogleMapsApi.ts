// hooks/useGoogleMapsApi.ts
import { useLoadScript } from '@react-google-maps/api';

// Define libraries needed globally by your app
// *** Make sure 'marker' and 'streetView' are included ***
const libraries: ('geometry' | 'marker' | 'places' | 'drawing' | 'visualization' | 'streetView')[] =
  ['geometry', 'marker', 'streetView']; // Added 'marker' and 'streetView'

interface UseGoogleMapsApiOptions {
  googleMapsApiKey: string | undefined;
}

/**
 * Hook to load the Google Maps JavaScript API.
 * Handles the loading state and potential errors.
 * @param options - Configuration options including the API key.
 * @returns An object containing the API loading state (`isLoaded`, `loadError`).
 */
export function useGoogleMapsApi({ googleMapsApiKey }: UseGoogleMapsApiOptions) {
  if (!googleMapsApiKey) {
   //commented-console.error("Google Maps API key is missing. Please provide NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.");
    // You could throw an error here or return a specific error state if preferred
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey ?? '', // Provide empty string if undefined, useLoadScript handles it
    libraries,
    // Consider adding other options like region, language if needed globally
  });

  return { isLoaded, loadError };
}