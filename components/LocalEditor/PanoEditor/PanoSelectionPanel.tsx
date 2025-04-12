/*import React, {useState, useEffect} from 'react';
//import LocalPanoList from '@/components/LocalEditor/PanoEditor/LocalPanoList/LocalPanoList';
import PublishPanel from '@/components/LocalEditor/PanoEditor/PublishPanel';
import { useGoogleMapsApi } from '@/hooks/useGoogleMapsApi';
import { PrimaryPanoramaDataGroup } from '@/types/index';
import { generateRandomColor } from '@/utils/helpers';
import styles from '@/styles/LocalEditor.module.css';
import PanoGroupingController from '@/components/General/PanoGroupingController';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext'; // Correct path as needed

const PanoSelectionPanel = () => {
  const { localPanos } = useLocalEditorContext();
  const { isLoaded, loadError } = useGoogleMapsApi({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });
  const [countryGroups, setCountryGroups] = useState<PrimaryPanoramaDataGroup | null>(null);
  const [yearGroups, setYearGroups] = useState<PrimaryPanoramaDataGroup | null>(null);
  const [monthGroups, setMonthGroups] = useState<PrimaryPanoramaDataGroup | null>(null);
  const [genGroups, setGenGroups] = useState<PrimaryPanoramaDataGroup | null>(null);
  const [tagGroups, setTagGroups] = useState<PrimaryPanoramaDataGroup | null>(null);
  const [localPanoCount, setLocalPanoCount] = useState<number>(localPanos.length);
  
    useEffect(() => {
      const allCountries = localPanos
        .map(pano => pano.address.country)
        .filter(Boolean);
    
      const uniqueCountries = [...new Set(allCountries)];
    
      const allSecondaryGroups = uniqueCountries.map(country => {
        const color = generateRandomColor();
        const localIds = localPanos
          .filter(p => p.address.country === country)
          .map(p => p.localId);
    
        return {
          state: 0,
          value: country,
          color,
          localIds
        };
      });
    
      const newGroup: PrimaryPanoramaDataGroup = {
        state: 0,
        value: "countries",
        color: generateRandomColor(),
        subGroups: allSecondaryGroups
      };
    
      setCountryGroups(newGroup);
    }, [localPanos]);
  if (loadError) return <p>Error loading Google Maps: {loadError.message}</p>;
  if (!isLoaded) return <p>Loading Map...</p>;
  return (
    <div className={styles.panoSelectionPanel}>
        {
          //<LocalPanoList />
        }
        <PanoGroupingController
          //primaryDataGroups={getPrimaryDataGroups()}
          primaryDataGroups={
            {
              countries: countryGroups,
              years: null,
              months: null,
              gens: null,
              tags: null
        
        
            }
          }
          localPanos={localPanos}
        />
        <div style={{width: '100%', height:'100%', gridColumn: '1', gridRow: '2'}}>
            <PublishPanel />
        </div>
        
    </div>
  );
}


  


export default PanoSelectionPanel;
*/
import React, { useState, useEffect } from 'react';
import PublishPanel from '@/components/LocalEditor/PanoEditor/PublishPanel';
import { useGoogleMapsApi } from '@/hooks/useGoogleMapsApi';
import { PrimaryPanoramaDataGroup } from '@/types/index';
import { generateRandomColor, monthNumberToName } from '@/utils/helpers';
import styles from '@/styles/LocalEditor.module.css';
import PanoGroupingController from '@/components/General/PanoGroupingController';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext';

const PanoSelectionPanel = () => {
  const { localPanos } = useLocalEditorContext();
  const { isLoaded, loadError } = useGoogleMapsApi({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [countryGroups, setCountryGroups] = useState<PrimaryPanoramaDataGroup | null>(null);
  const [yearGroups, setYearGroups] = useState<PrimaryPanoramaDataGroup | null>(null);
  const [monthGroups, setMonthGroups] = useState<PrimaryPanoramaDataGroup | null>(null);
  const [genGroups, setGenGroups] = useState<PrimaryPanoramaDataGroup | null>(null);
  const [tagGroups, setTagGroups] = useState<PrimaryPanoramaDataGroup | null>(null);

  // ===== Country Groups =====
  useEffect(() => {
    const allCountries = localPanos
      .map(pano => pano.address.country)
      .filter(Boolean);

    const uniqueCountries = [...new Set(allCountries)];

    const allSecondaryGroups = uniqueCountries.map(country => ({
      state: 0,
      value: country,
      color: generateRandomColor(),
      localIds: localPanos
        .filter(p => p.address.country === country)
        .map(p => p.localId),
    }));

    setCountryGroups({
      state: 0,
      value: 'countries',
      color: generateRandomColor(),
      subGroups: allSecondaryGroups,
    });
  }, [localPanos]);

  // ===== Year Groups =====
  useEffect(() => {
    const allYears = localPanos
      .map(p => p.date?.split("-")[0])
      .filter(Boolean);

    const uniqueYears = [...new Set(allYears)];

    const allSecondaryGroups = uniqueYears.map(year => ({
      state: 0,
      value: year,
      color: generateRandomColor(),
      localIds: localPanos
        .filter(p => p.date?.startsWith(year))
        .map(p => p.localId),
    }));

    setYearGroups({
      state: 0,
      value: 'years',
      color: generateRandomColor(),
      subGroups: allSecondaryGroups,
    });
  }, [localPanos]);

  // ===== Month Groups =====
  useEffect(() => {
    const allMonths = localPanos
      .map(p => p.date?.split("-")[1])
      .filter(Boolean).map(m => monthNumberToName(m));

    const uniqueMonths = [...new Set(allMonths)];

    const allSecondaryGroups = uniqueMonths.map(month => ({
      state: 0,
      value: month,
      color: generateRandomColor(),
      localIds: localPanos
        .filter(p => monthNumberToName(p.date?.split("-")[1]) === month)
        .map(p => p.localId),
    }));

    setMonthGroups({
      state: 0,
      value: 'months',
      color: generateRandomColor(),
      subGroups: allSecondaryGroups,
    });
  }, [localPanos]);

  // ===== Generation Groups =====
  useEffect(() => {
    const allGens = localPanos
      .map(p => p.gen)
      .filter(Boolean);

    const uniqueGens = [...new Set(allGens)];

    const allSecondaryGroups = uniqueGens.map(gen => ({
      state: 0,
      value: gen,
      color: generateRandomColor(),
      localIds: localPanos
        .filter(p => p.gen === gen)
        .map(p => p.localId),
    }));

    setGenGroups({
      state: 0,
      value: 'generations',
      color: generateRandomColor(),
      subGroups: allSecondaryGroups,
    });
  }, [localPanos]);

  // ===== Tag Groups =====
  useEffect(() => {
    const allTags = localPanos
      .filter(p => p.tags?.length >= 1)
      .map(p => p.tags[0].t)
      .filter(Boolean);

    const uniqueTags = [...new Set(allTags)];

    const allSecondaryGroups = uniqueTags.map(tag => ({
      state: 0,
      value: tag,
      color: generateRandomColor(),
      localIds: localPanos
        .filter(p => p.tags?.[0]?.t === tag)
        .map(p => p.localId),
    }));

    setTagGroups({
      state: 0,
      value: 'tags',
      color: generateRandomColor(),
      subGroups: allSecondaryGroups,
    });
  }, [localPanos]);

  // ===== Error and Loading =====
  if (loadError) return <p>Error loading Google Maps: {loadError.message}</p>;
  if (!isLoaded) return <p>Loading Map...</p>;

  return (
    <div className={styles.panoSelectionPanel}>
      <div className={styles.panoGroupingPanel}>
      <PanoGroupingController
        primaryDataGroups={{
          countries: countryGroups,
          years: yearGroups,
          months: monthGroups,
          gens: genGroups,
          tags: tagGroups,
        }}
        localPanos={localPanos}
      />
      </div>
      
      <div style={{ width: '100%', height: '100%', gridColumn: '1', gridRow: '2' }}>
        <PublishPanel />
      </div>
    </div>
  );
};

export default PanoSelectionPanel;
