import { useEffect, useRef, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import styles from '../styles/Home.module.css';
import PlusMinusButton from '../components/PlusMinusButton';
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

  const [alternatePanoramas, setAlternatePanoramas] = useState<
    { panoId: string; date: string }[]
  >([]);

  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [description, setDescription] = useState('');
  const [editingFromId, setEditingFromId] = useState<string | null>(null);

  interface SavedPano {
    id: string; // Use a unique ID string to track each save
    panoId: string;
    panoDate: string | null;
    lat: number;
    lng: number;
    heading: number;
    pitch: number;
    zoom: number;
    description: string;
    tags: string[];
  }


  const [savedLocations, setSavedLocations] = useState<SavedPano[]>([]);


  const mapRef = useRef<google.maps.Map | null>(null);
  const streetViewRef = useRef<HTMLDivElement | null>(null);
  const panoramaRef = useRef<google.maps.StreetViewPanorama | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ['geometry'],
  });

  const loadPanorama = async (panoId: string) => {
    setEditingFromId(null);
    const svService = new google.maps.StreetViewService();

    try {
      const data = await getSVData(svService, { pano: panoId });
      if (!data || !data.location?.latLng) {
        throw new Error('Invalid pano data');
      }
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
      alert('This panorama could not be loaded. It might be broken or no longer available.');
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
    if (!streetViewRef.current || !panoData || !window.google) return;

    // Clean up any old instance
    if (panoramaRef.current) {
      panoramaRef.current.setVisible(false);
      panoramaRef.current = null;
    }

    // Create new instance
    panoramaRef.current = new google.maps.StreetViewPanorama(streetViewRef.current, {
      pano: panoData.panoId,
      visible: true,
    });
  }, [panoData]);

  // ======== UI: Tag Handling ========

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

  const handleTagChange = (index: number, newValue: string) => {
    const trimmed = newValue.trim().toLowerCase();
    const newTags = [...tags];
    newTags[index] = trimmed;
    setTags(newTags);
  };

  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  // ======== Render Functions ========

  const renderMap = () => (
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

  const renderStreetView = () => (
    <>
      <div ref={streetViewRef} className={styles.streetView} />
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

  const renderTagEditor = () => (
    <div className={styles.panoEditorInfoWrapper}>
      <div className={styles.tagList}>
        {tags.map((tag, index) => (
          <div key={index} className={styles.tagListItem}>
            <input
              type="text"
              value={tag}
              onChange={(e) => handleTagChange(index, e.target.value)}
              className={styles.tagInput}
            />
            <PlusMinusButton
              isMinus={true}
              onClick={() => handleRemoveTag(index)}
            />
          </div>
        ))}

        <div className={styles.tagListItem}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              setError('');
            }}
            placeholder="Add a new tag..."
            className={`${styles.tagInput} ${error ? styles.errorInput : ''}`}
          />
          <PlusMinusButton
            isMinus={false}
            onClick={handleAddTag}
          />
          {error && <p className={styles.errorText}>{error}</p>}
        </div>
      </div>
    </div>
  );

  const renderDescriptionInput = () => (
    <div className={styles.panoEditorInfoWrapper}>
      <textarea
        className={styles.descriptionInput}
        placeholder="Enter a description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  );

  const renderAlternatePanoDatesDropdown = () => {
    if (!panoData || alternatePanoramas.length === 0) return null;

    return (
      <div className={styles.dropdown}>
        <label>
          View other dates:
          <select
            onChange={(e) => {
              const selected = alternatePanoramas.find((p) => p.panoId === e.target.value);
              if (selected) loadPanorama(selected.panoId);
            }}
          >
            <option value={panoData.panoId}>
              Current ({panoData.date || 'unknown'})
            </option>
            {alternatePanoramas.map((alt) => (
              <option key={alt.panoId} value={alt.panoId}>
                {alt.date}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  };
  const handleSaveLocation = () => {
    if (!panoData || !panoramaRef.current) return;

    const pov = panoramaRef.current.getPov();
    const zoom = panoramaRef.current.getZoom?.() ?? 1;

    const newLocation: SavedPano = {
      id: crypto.randomUUID(),
      panoId: panoData.panoId,
      panoDate: panoData.date || null,
      lat: panoData.lat,
      lng: panoData.lng,
      heading: pov.heading,
      pitch: pov.pitch,
      zoom,
      description,
      tags,
    };

    setSavedLocations((prev) => [...prev, newLocation]);
    resetEditor();
  };

  const handleUpdateLocation = () => {
    if (!editingFromId || !panoData || !panoramaRef.current) return;

    const updated = {
      id: editingFromId,
      panoId: panoData.panoId,
      panoDate: panoData.date || null,
      lat: panoData.lat,
      lng: panoData.lng,
      heading: panoramaRef.current.getPov().heading,
      pitch: panoramaRef.current.getPov().pitch,
      zoom: panoramaRef.current.getZoom?.() ?? 1,
      description,
      tags,
    };

    setSavedLocations((prev) =>
      prev.map((p) => (p.id === editingFromId ? updated : p))
    );
    resetEditor();
  };

  const handleSplitLocation = () => {
    handleSaveLocation(); // Simply save a copy
  };

  const handleDeleteLocation = () => {
    if (editingFromId) {
      setSavedLocations((prev) => prev.filter((p) => p.id !== editingFromId));
    }
    resetEditor(); // Works for both saved and unsaved cases
  };

  const handleCloseEditor = () => {
    resetEditor(); // No longer handles duplication logic
  };

  const resetEditor = () => {
    setPanoData(null);
    setDescription('');
    setTags([]);
    setInputValue('');
    setError('');
  };

  const loadSavedLocation = async (pano: SavedPano) => {
    const svService = new google.maps.StreetViewService();

    try {
      const data = await getSVData(svService, { pano: pano.panoId });

      if (data.location?.latLng) {
        const { pano: panoId, latLng } = data.location;
        setEditingFromId(pano.id);
        const date = extractImageDate(data);

        setPanoData({
          panoId,
          lat: latLng.lat(),
          lng: latLng.lng(),
          date,
        });

        setDescription(pano.description);
        setTags(pano.tags);
        setInputValue('');
        setError('');

        // Optional: set POV after Street View loads
        setTimeout(() => {
          if (panoramaRef.current) {
            panoramaRef.current.setPov({
              heading: pano.heading,
              pitch: pano.pitch,
            });
            panoramaRef.current.setZoom(pano.zoom);
          }
        }, 500);
      }
    } catch (err) {
      console.warn('Could not load saved pano:', err);
    }
  };


  const renderSavedPanoListItem = (pano: SavedPano, index: number) => (
    <div
      key={index}
      className={styles.savedPanoListItem}
      onClick={() => loadSavedLocation(pano)}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles.savedPanoListItemInfo}>
        <div><strong>Description:</strong></div>
        <div>{pano.description || 'No description'}</div>
      </div>
      <div className={styles.savedPanoListItemInfo}>
        <div><strong>Tags:</strong></div>
        <div>{pano.tags?.join(', ') || 'No tags'}</div>
      </div>
    </div>
  );


  const renderSavedPanoList = () => {
    if (savedLocations.length === 0) {
      return <p className={styles.savedPanoEmpty}>No saved locations yet.</p>;
    }

    return (
      <div className={styles.savedPanoList}>
        {savedLocations.map((pano, index) => renderSavedPanoListItem(pano, index))}
      </div>
    );
  };


  // ======== Layout ========

  if (loadError) return <p>Error loading map</p>;
  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <main className={styles.container}>
      <div className={styles.containerElement}>
        <div className={styles.map}>{renderMap()}</div>
      </div>
      <div className={styles.containerElement}>
        {panoData ? (
          <div className={styles.panoEditor}>
            {renderStreetView()}
            <div className={styles.panoSettings}>
              {renderTagEditor()}
              {renderDescriptionInput()}
              {renderAlternatePanoDatesDropdown()}
              <div className={styles.buttonRow}>
                {!editingFromId ? (
                  <>
                    <button className={styles.saveButton} onClick={handleSaveLocation}>
                      💾 Save Location
                    </button>
                    <button className={styles.deleteButton} onClick={handleDeleteLocation}>
                      🗑 Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button className={styles.updateButton} onClick={handleUpdateLocation}>
                      ✅ Update
                    </button>
                    <button className={styles.splitButton} onClick={handleSplitLocation}>
                      ➕ Split
                    </button>
                    <button className={styles.deleteButton} onClick={handleDeleteLocation}>
                      🗑 Delete
                    </button>
                    <button className={styles.closeButton} onClick={handleCloseEditor}>
                      ❌ Close
                    </button>
                  </>
                )}
              </div>


            </div>
          </div>
        ) : (
          <div className={styles.panoSelector}>
            {renderSavedPanoList()}
          </div>

        )}
      </div>
    </main>

  );
}
