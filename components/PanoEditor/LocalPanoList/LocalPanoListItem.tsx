import React from 'react';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext'; // Correct path as needed
import { getStreetViewPreviewUrl } from '@/services/googleMapsService'; // Import the service function
import { LocalPano } from '@/types';
import styles from '@/styles/Home.module.css'; // Adjust path if you create specific styles

interface LocalPanoListItemProps {
  localPano: LocalPano; // Continue to pass localPano as a prop
}

const LocalPanoListItem: React.FC<LocalPanoListItemProps> = ({ localPano }) => {
  const { loadExistingPanorama } = useLocalEditorContext();
  const previewUrl = getStreetViewPreviewUrl(localPano.panoId, localPano.heading, localPano.pitch);

  const handleClick = () => {
    loadExistingPanorama(localPano);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent scrolling on Space
      loadExistingPanorama(localPano);
    }
  };

  const truncateDescription = (text: string, maxLength: number = 80) => {
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  const formatTags = (tags: string[] = []) => {
    const validTags = tags.filter(tag => tag.trim() !== '');
    return validTags.length === 0 ? 'No tags' : validTags.join(', ');
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
          <span className={styles.infoValue}>{formatTags(localPano.tags)}</span>
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
