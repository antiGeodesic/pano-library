import React from 'react';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext'; // Correct path as needed
import { getStreetViewPreviewUrl } from '@/services/googleMapsService'; // Import the service function
import { LocalPano, TagStructure } from '@/types/LocalEditor';
import { TagCategory } from '@/types/index';
import categories from '@/data/categories.json';
import styles from '@/styles/LocalEditor.module.css'; // Adjust path if you create specific styles

interface LocalPanoListItemProps {
  localPano: LocalPano; // Continue to pass localPano as a prop
}


const LocalPanoListItem: React.FC<LocalPanoListItemProps> = ({ localPano }) => {
  const { loadExistingPanorama } = useLocalEditorContext();
  const previewUrl = getStreetViewPreviewUrl(localPano.panoId, localPano.heading, localPano.pitch);

  const handleClick = () => {
    loadExistingPanorama(localPano);
  };
  const tagsData: TagStructure[] = categories;
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent scrolling on Space
      loadExistingPanorama(localPano);
    }
  };

  const truncateDescription = (text: string, maxLength: number = 80) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const formatTags = (tags: TagCategory[] = []) => {
    const readableTags: { x: string, y: string, z: string, t: string }[] = tags.map(tag =>
    (
      tag.x == -1 ?
      {
        x: "",
        y: "",
        z: "",
        t: tag.t
      }
      :
      {
        x: tagsData[tag.x].category,
        y: tagsData[tag.x].subCategories[tag.y].subCategory,
        z: tagsData[tag.x].subCategories[tag.y].subSubCategories[tag.z].subSubCategory,
        t: ""
      }
    )
    );
    return (
      <div>{
      readableTags.map((tag, index) => tag.x == "" ?
      
      (
        <div key={index}style={{ border: "2px solid red", borderRadius: "2px", display: "flex", flexDirection: "row" }}>
          <span style={{ backgroundColor: "#FFFFFF", border: "2px solid #AAAAAA", borderRadius: "4px", color: "#FF0000" }}>{tag.t}</span>
        </div>
      )
      :
      (
        <div key={index}style={{ border: "2px solid red", borderRadius: "2px", display: "flex", flexDirection: "row" }}>
          <span style={{ backgroundColor: "#888888", border: "2px solid #444444", borderRadius: "4px", color: "#880000" }}>{tag.x}</span>
          {"=> "}
          <span style={{ backgroundColor: "#AAAAAA", border: "2px solid #666666", borderRadius: "4px", color: "#AA0000" }}>{tag.y}</span>
          {"=> "}
          <span style={{ backgroundColor: "#CCCCCC", border: "2px solid #888888", borderRadius: "4px", color: "#CC0000" }}>{tag.z}</span>
          {"=> "}
          <span style={{ backgroundColor: "#FFFFFF", border: "2px solid #AAAAAA", borderRadius: "4px", color: "#FF0000" }}>{tag.t}</span>
        </div>
        )
      
      )
    }</div>)
  }

  return (
    <div
      className={styles.savedPanoListItem}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Load panorama: ${localPano.description || localPano.panoId}`}
    >
      <picture>
        <img
          src={previewUrl}
          alt={`Street View preview for ${localPano.description || localPano.panoId}`}
          className={styles.savedPanoPreview}
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder-image.png'; // Ensure a placeholder is available
          }}
        />
      </picture>

      <div className={styles.savedPanoListItemDetails}>
        <div className={styles.savedPanoListItemInfo}>
          <strong className={styles.infoLabel}>Description:</strong>
          <span className={styles.infoValue}>{truncateDescription(localPano.description)}</span>
        </div>
        <div className={styles.savedPanoListItemInfo}>
          <strong className={styles.infoLabel}>Tags:</strong>
          {formatTags(localPano.tags)}
        </div>
        <div className={styles.savedPanoListItemInfo}>
          <strong className={styles.infoLabel}>Pano ID:</strong>
          <span className={styles.infoValueSmall}>{localPano.panoId}</span>
        </div>
      </div>
    </div>
  );
};

export default LocalPanoListItem;
