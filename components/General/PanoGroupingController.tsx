import React from 'react';
import PanoGroupingComponent from './PrimaryPanoGroupComponent';
import styles from '@/styles/PanoGrouping.module.css';
import { PanoramaData, PrimaryPanoramaDataGroup } from '@/types/index';
interface PanoGroupingControllerProps {
    primaryDataGroups: {
        countries: PrimaryPanoramaDataGroup | null,
        years: PrimaryPanoramaDataGroup | null,
        months: PrimaryPanoramaDataGroup | null,
        gens: PrimaryPanoramaDataGroup | null,
        tags: PrimaryPanoramaDataGroup | null
    },
    localPanos: PanoramaData[]
}

const PanoGroupingController: React.FC<PanoGroupingControllerProps> = ({ primaryDataGroups }) => {
console.log(primaryDataGroups)
  return (
    <div className={styles.panoGroupingComponent}>
        <div className={styles.primaryPanoGroupWrapper}>
          {
            primaryDataGroups.countries &&
            <PanoGroupingComponent 
              dataGroup={primaryDataGroups.countries}
            />
            
          }
            
        </div>
        <div className={styles.primaryPanoGroupWrapper}>
        {
          primaryDataGroups.years &&
            <PanoGroupingComponent 
              dataGroup={primaryDataGroups.years}
            />
}
        </div>
        <div className={styles.primaryPanoGroupWrapper}>
          {
            primaryDataGroups.months &&
            <PanoGroupingComponent 
              dataGroup={primaryDataGroups.months}
            />
          }
        </div>
        <div className={styles.primaryPanoGroupWrapper}>
          {
            primaryDataGroups.gens &&
            <PanoGroupingComponent 
              dataGroup={primaryDataGroups.gens}
            />
          }
        </div>
    </div>
  );
};

export default PanoGroupingController;
