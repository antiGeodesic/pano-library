import { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100vh',
};

const center = {
  lat: 48.8584,
  lng: 2.2945,
};

type SVRequestOptions =
  | {
    pano: string;
    location?: never;
    radius?: never;
    source?: google.maps.StreetViewSource;
  }
  | {
    pano?: never;
    location: google.maps.LatLngLiteral;
    radius?: number;
    source?: google.maps.StreetViewSource;
  };

// ✅ Wrap getPanorama in a promise
function getSVData(
  service: google.maps.StreetViewService,
  options: SVRequestOptions
): Promise<google.maps.StreetViewPanoramaData> {
  return new Promise((resolve, reject) => {
    service.getPanorama(options, (data, status) => {
      if (status === google.maps.StreetViewStatus.OK && data) {
        resolve(data);
      } else {
        reject(new Error('Panorama not found'));
      }
    });
  });
}


function extractImageDate(data: google.maps.StreetViewPanoramaData): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
return (data as any)?.imageDate ?? (data.tiles as any)?.imageDate ?? 'unknown';
}

export default function Home() {
  const [panoData, setPanoData] = useState<{
    panoId: string;
    lat: number;
    lng: number;
    date?: string;
  } | null>(null);

  const [alternatePanoramas, setAlternatePanoramas] = useState<
    { panoId: string; date: string }[]
  >([]);

  const mapRef = useRef<google.maps.Map | null>(null);
  const streetViewRef = useRef<HTMLDivElement | null>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['geometry'],
  });

  const loadPanorama = async (panoId: string) => {
    const svService = new google.maps.StreetViewService();

    try {
      const data = await getSVData(svService, { pano: panoId });

      if (data.location?.latLng) {
        const { pano, latLng } = data.location;
        const date = extractImageDate(data);

        setPanoData({
          panoId: pano,
          lat: latLng.lat(),
          lng: latLng.lng(),
          date,
        });

        const nearby: { panoId: string; date: string }[] = [];

        if (data.links) {
          for (const link of data.links) {
            try {
              const linked = await getSVData(svService, { pano: link.pano ?? '' });

              if (
                linked.location?.latLng &&
                google.maps.geometry.spherical.computeDistanceBetween(
                  latLng,
                  linked.location.latLng
                ) < 10
              ) {
                const linkedDate = extractImageDate(linked);
                nearby.push({ panoId: linked.location.pano, date: linkedDate });
              }
            } catch {
              // skip broken pano
            }
          }
        }

        setAlternatePanoramas(nearby);
      }
    } catch (err) {
      console.warn('Could not load pano:', err);
    }
  };

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const svService = new google.maps.StreetViewService();
      const location = { lat: e.latLng.lat(), lng: e.latLng.lng() };

      try {
        const data = await getSVData(svService, {
          location,
          radius: 50,
          source: google.maps.StreetViewSource.DEFAULT,
        });

        if (data.location?.pano) {
          loadPanorama(data.location.pano);
        }
      } catch {
        console.warn('No Google pano found at this location.');
      }
    }
  };

  useEffect(() => {
    if (streetViewRef.current && panoData && window.google) {
      if (!panoramaRef.current) {
        panoramaRef.current = new google.maps.StreetViewPanorama(streetViewRef.current, {
          pano: panoData.panoId,
          visible: true,
        });
      } else {
        panoramaRef.current.setPano(panoData.panoId);
        panoramaRef.current.setVisible(true);
      }
    }
  }, [panoData]);

  if (loadError) return <p>Error loading map</p>;
  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <main style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={14}
          onClick={handleMapClick}
          onLoad={(map) => {
            mapRef.current = map;
            new google.maps.StreetViewCoverageLayer().setMap(map);
          }}
          options={{ streetViewControl: false }}
        >
          {panoData && (
            <Marker
              position={{ lat: panoData.lat, lng: panoData.lng }}
              title={`Pano location - ${panoData.panoId}`}
            />
          )}
        </GoogleMap>

      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <div ref={streetViewRef} style={{ width: '100%', height: '100%' }} />

        {alternatePanoramas.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              background: '#fff',
              padding: '0.5rem',
              borderRadius: 8,
              boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            }}
          >
            <label>
              View other dates:
              <select
                onChange={(e) => {
                  const selected = alternatePanoramas.find((p) => p.panoId === e.target.value);
                  if (selected) loadPanorama(selected.panoId);
                }}
              >
                <option value={panoData?.panoId || ''}>
                  Current ({panoData?.date || 'unknown'})
                </option>
                {alternatePanoramas.map((alt) => (
                  <option key={alt.panoId} value={alt.panoId}>
                    {alt.date}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>
    </main>
  );
}
