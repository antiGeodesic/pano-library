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

interface CoverageDatesComponentProps {
  displayedPano: PanoramaData;
  setPanoId: (panoId: string) => void;
}

const CoverageDatesDropdown: React.FC<CoverageDatesComponentProps> = ({ displayedPano, setPanoId }) => {
  const itemHeight = 30;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  if (!displayedPano) return null;

  const datesInfo = displayedPano.availableDates;
  
  // Format the currently displayed date
  const formattedSelectedDate = displayedPano.date?.split("T")[0] || "Select Date";
  
  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);
  
  // Calculate dropdown height based on open state
  const dropdownHeight = isOpen ? (datesInfo.length + 1) * itemHeight : itemHeight;

  return (
    <div className={styles.coverageDates}>
      <div 
        className={`${styles.coverageDatesDropdown} ${isOpen ? styles.open : ''}`}
        style={{ maxHeight: `${dropdownHeight}px` }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header - always visible and shows the selected date */}
        <div className={`${styles.coverageDatesDropdownHeader} ${styles.coverageDatesDropdownItem}`}>
          <span>{formattedSelectedDate}</span>
        </div>
        
        {/* Dropdown items - only visible when open */}
        <div className={styles.coverageDatesDropdownList}>
          {datesInfo.map((dateInfo) => {
            const isSelected = displayedPano.panoId === dateInfo.panoId;
            const yyyy_mm_dd = dateInfo.date?.split("T")[0].split("-") || undefined;
            const yyyy_mm = yyyy_mm_dd? (yyyy_mm_dd[0] + "-" + yyyy_mm_dd[1]) : ""; 
            return (
              <div 
                key={dateInfo.panoId} 
                className={`${styles.coverageDatesDropdownItem} ${isSelected ? styles.coverageDatesDropdownItemSelected : ''}`}
              >
                <button 
                  onClick={() => {
                    if (!isSelected) {
                      setPanoId(dateInfo.panoId);
                      setIsOpen(false);
                    }
                  }}
                  disabled={isSelected}
                  className={isSelected ? styles.disabled : ''}
                >
                  <span>{yyyy_mm}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CoverageDatesDropdown;