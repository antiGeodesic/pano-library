import React, {useState} from 'react';
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

  );
};

export default CoverageDatesDropdown;
