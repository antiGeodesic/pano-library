/*import React, {useState} from 'react';
import { PanoramaData } from '@/types/index';
import styles from '@/styles/LocalEditor.module.css';
interface CoverageDatesComponentProps{
  displayedPano: PanoramaData
  setPanoId: (panoId: string) => void;
}
const CoverageDatesDropdown: React.FC<CoverageDatesComponentProps> = ({displayedPano, setPanoId}) => {
  const itemHeight = 30;
  const [height, setHeight] = useState<number>(itemHeight);
  if(!displayedPano) return;



  const dates = displayedPano.availableDates;
  

  return (
      <div className={styles.coverageDates}>
      <div 
      className={styles.coverageDatesDropdown}
      style={{ maxHeight: `${height}px` }}
      onMouseEnter={() => setHeight((dates.length + 1) * itemHeight)}
      onMouseLeave={() => setHeight(itemHeight)}
      >

        <div  className={styles.coverageDatesDropdownItem}>
        <span>{displayedPano.date}</span>
        </div>
      {dates.map((date) => {
        const isSelected = displayedPano.panoId == date.panoId
        return (
          <div key={date.panoId} className={`${styles.coverageDatesDropdownItem}${isSelected ? styles.coverageDatesDropdownItemSelected : ''}`}>
            <button 
                onClick={() => {if(date.panoId == displayedPano.panoId) return; setPanoId(date.panoId)}}
                disabled={isSelected}
                >
                <span>{date.date?.split("T")[0]}</span>
            </button>

          </div>
        )})}

      </div>
      </div>
  );
};

export default CoverageDatesDropdown;
*/
import React, { useState } from 'react';
import { PanoramaData } from '@/types/index';
import styles from '@/styles/LocalEditor.module.css';
//import { getCameraGen, getCameraGenCache } from '@/utils/helpers';
//import { getPanoramaFromPanoId } from '@/services/googleMapsService';

interface CoverageDatesComponentProps {
  displayedPano: PanoramaData;
  setPanoId: (panoId: string) => void;
  loadAvailableDatesData: () => void;
}

const CoverageDatesDropdown: React.FC<CoverageDatesComponentProps> = ({ displayedPano, setPanoId, loadAvailableDatesData }) => {
  //const itemHeight = 30;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedDatePanoId, setSelectedDatePanoId] = useState<string | null>(displayedPano?.panoId ?? null);
  //let availableDates = displayedPano?.availableDates.map(date => ({panoId: date.panoId, date: date.date, gen: date.panoId == displayedPano.panoId ? displayedPano.gen : ""}));
  const availableDates = displayedPano?.availableDates;
  if (!displayedPano) return null;

  const updateSelectedDate = (panoId: string) => {
    setSelectedDatePanoId(panoId);
    setPanoId(panoId);
  }
  const formatDate = (date: string): string => {
    const yyyy_mm_dd = date.split("T")[0].split("-") || undefined;
    const yyyy_mm = yyyy_mm_dd? (yyyy_mm_dd[0] + "-" + yyyy_mm_dd[1]) : ""; 
    return yyyy_mm;
  }
  const formatGen = (gen: string): string => {
    if(gen == "Gen 1" || gen == "Gen 2" || gen == "Gen 2 or 3" || gen == "Gen 3" || gen == "Gen 4" || gen == "Shitcam" || gen == "Gen ?") return gen;
    return "";
  }
  const styleGen = (gen: string) => {
   //commented-console.error(gen)
    return `${styles.coverageDatesDropdownItemGen} ${
                        gen == "Gen 1" ?
                        styles.coverageDatesDropdownItemGen1 :
                        gen == "Gen 2" ?
                        styles.coverageDatesDropdownItemGen2 :
                        gen == "Gen 3" ?
                        styles.coverageDatesDropdownItemGen3 :
                        gen == "Gen 4" ?
                        styles.coverageDatesDropdownItemGen4 :
                        gen == "Shitcam" ?
                        styles.coverageDatesDropdownItemShitcam : 
                        styles.coverageDatesDropdownItemUnknown
                      }`
  }
  /*const getGen = async(panoId: string): Promise<string> => {
    for(const date of availableDates) {
      let gen = date.gen;
     //commented-console.error("gen:----------(1): ",gen)
      if(gen == "" && displayedPano.address.country != "Unknown") {
       //commented-console.error("gen:----------(2): ",gen)
        gen = getCameraGenCache(date.panoId) ?? "";
        if(gen == "") {
          const svData = await getPanoramaFromPanoId(date.panoId);
          gen = getCameraGen(svData, displayedPano.address.country) ?? "Gen ?";
        }
       //commented-console.error("gen:----------(3): ",gen)
      }
      if(date.panoId == panoId) return gen;
    }
    return "";
  }*/
  //const datesInfo = displayedPano.availableDates;
  
  // Format the currently displayed date
  //const formattedSelectedDate = displayedPano.date?.split("T")[0] || "Select Date";
  if(!selectedDatePanoId) {
    setSelectedDatePanoId(displayedPano.panoId)
  }
  const handleMouseEnter = async() => {
    /*const newAvailableDates = [];
    for(const date of availableDates) {
      let gen = date.gen;
     //commented-console.error("gen:----------(1): ",gen)
      if(gen == "" && displayedPano.address.country != "Unknown") {
       //commented-console.error("gen:----------(2): ",gen)
        gen = getCameraGenCache(date.panoId) ?? "";
        if(gen == "") {
          const svData = await getPanoramaFromPanoId(date.panoId);
          gen = getCameraGen(svData, displayedPano.address.country) ?? "Gen ?";
        }
       //commented-console.error("gen:----------(3): ",gen)
      }
      newAvailableDates.push({
        panoId: date.panoId,
        date: date.date,
        gen: gen
      });
    }
    availableDates = newAvailableDates;*/
    loadAvailableDatesData()
    setIsOpen(true)
  };
  const handleMouseLeave = () => setIsOpen(false);
  
  // Calculate dropdown height based on open state
  //const dropdownHeight = isOpen ? (availableDates.length + 1) * itemHeight : itemHeight;

  return (
    <div className={styles.coverageDates}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
    >
      
        {/* Header - always visible and shows the selected date */}
        <div className={`${styles.coverageDatesDropdownHeader} ${styles.coverageDatesDropdownItem}  ${isOpen ? styles.open : styles.closed}`}>
          <span className={styles.coverageDatesDropdownItemDate}>{formatDate(availableDates.filter(dateInfo => dateInfo.panoId === selectedDatePanoId || dateInfo.panoId === displayedPano.panoId)[0]?.date ?? "")}</span>
          <span className={styleGen(formatGen(availableDates.filter(dateInfo => dateInfo.panoId === selectedDatePanoId || dateInfo.panoId === displayedPano.panoId)[0]?.gen))}>{formatGen(availableDates.filter(dateInfo => dateInfo.panoId === selectedDatePanoId || dateInfo.panoId === displayedPano.panoId)[0]?.gen)}</span>
        </div>
        
        {/* Dropdown items - only visible when open */}
        
        <div 
        className={`${styles.coverageDatesDropdown} ${isOpen ? styles.open : ''}`}
        
      >
      <div className={`${styles.coverageDatesDropdownList} ${isOpen ? styles.open : ''}`}>
          {availableDates.map((dateInfo) => {
            const isSelected = selectedDatePanoId === dateInfo.panoId;
            return (
              <div 
                key={dateInfo.panoId} 
                className={`${styles.coverageDatesDropdownItem} ${isSelected ? styles.coverageDatesDropdownItemSelected : ''}`}
              >
                <button 
                  onClick={() => {
                    if (!isSelected) {
                      updateSelectedDate(dateInfo.panoId);
                      setIsOpen(false);
                    }
                  }}
                  disabled={isSelected}
                  className={isSelected ? styles.disabled : ''}
                >
                  <div className={styles.coverageDatesDropdownItem}>
                    <span className={styles.coverageDatesDropdownItemDate}>{formatDate(dateInfo.date)}</span>
                    <span className={styleGen(formatGen(dateInfo.gen))}>{formatGen(dateInfo.gen)}</span>
                  </div>
                </button>
              </div>
            );
          })}
        </div></div>
    </div>
  );
};

export default CoverageDatesDropdown;