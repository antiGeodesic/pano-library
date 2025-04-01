import { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import styles from '../styles/Home.module.css';

const containerStyle = {
  width: '100%',
  height: '100%',
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
  const [activeSection, setActiveSection] = useState<'map' | 'panoEditor' | null>(null);
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
              // skip
            }
          }
        }

        setAlternatePanoramas(nearby);
      }
    } catch (err) {
      console.warn('Could not load pano:', err);
    }
  };
  const handlePanoClick = () => {
    setActiveSection('panoEditor');
  };
  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    setActiveSection('map'); // 👈 user just interacted with the map
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

  // ✅ Clean UI helpers below:
  const createMapElement = () => (
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
  );

  const createStreetViewElement = () => (
    <>
      <div 
        ref={streetViewRef} 
        className={styles.streetView} 
        onClick={handlePanoClick}
      />
      {alternatePanoramas.length > 0 && (
        <div className={styles.dropdown}>
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
    </>
  );

  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  const handleAddTag = () => {
    const trimmed = inputValue.trim();

    if (!trimmed) {
      setError('Tag cannot be empty.');
      return;
    }

    if (tags.includes(trimmed.toLowerCase())) {
      setError('Tag already exists.');
      return;
    }

    setTags([...tags, trimmed.toLowerCase()]);
    setInputValue('');
    setError('');
  };

  const createTagListElement = () => (
    <div className={styles.tagListElement}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setError(''); // clear error on typing
        }}
        placeholder="Enter a tag..."
        className={`${styles.tagInput} ${error ? styles.errorInput : ''}`}
      />
      <button
        onClick={handleAddTag}
        className={`${styles.tagButton} ${error ? styles.errorButton : ''}`}
      >
        Add Tag
      </button>
      {error && <p className={styles.errorText}>{error}</p>}
    </div>
  );
  const createTagList = () => (
    <div className={styles.tagList}>
      {tags.length > 0 && (
        <ul className={styles.tagListDisplay}>
          {tags.map((tag, i) => (
            <li key={i} className={styles.tagItem}>
              {tag}
            </li>
          ))}
        </ul>
      )}
      {createTagListElement()}
    </div>
  );
  if (loadError) return <p>❌ Error loading map</p>;
  if (!isLoaded) return <p>Loading map...</p>;



  return (
    <main className={styles.container}>
      <div className={styles.containerElement}>
        <div className={styles.map}>
          {createMapElement()}
        </div>
      </div>
      <div className={styles.containerElement}>
        <div className={styles.panoEditor}>
          {createStreetViewElement()}
          {createTagList()}
        </div>
      </div>
    </main>
  );
}
