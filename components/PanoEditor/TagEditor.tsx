import React, { useState } from 'react';
import { useLocalEditorContext  } from '@/contexts/LocalEditorContext';
import PlusMinusButton from '@/components/PanoEditor/PlusMinusButton';
import styles from '@/styles/Home.module.css';

const TagEditor: React.FC = () => {
  const { currentPanorama,
    displayedPanorama,
    updateCurrentTags
  } = useLocalEditorContext();

  
  //const tagRef = useRef<HTMLDivElement>(null);
  
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  if (!currentPanorama || !displayedPanorama) {
    return null;
  }

  const tags: string[] = displayedPanorama.tags;
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      addTag();
    }
  };

  const addTag = () => {
    if (!inputValue.trim()) {
      setError('Tag cannot be empty');
      return;
    }

    updateCurrentTags(-1, inputValue)
    setInputValue('');
    setError('');
  };

  const removeTag = (index: number) => {
    updateCurrentTags(index, "");

  };

  const changeTag = (index: number, newValue: string) => {
    updateCurrentTags(index, newValue);

  };

  return (
    <div className={styles.panoEditorInfoWrapper}>
      <label className={styles.editorLabel}>Tags:</label>
      <div className={styles.tagList}>
        {tags.map((tag, index) => (
          <div key={index} className={styles.tagListItem}>
            <input
              type="text"
              value={tag}
              onChange={(e) => changeTag(index, e.target.value)}
              className={styles.tagInput}
              aria-label={`Edit tag ${index + 1}`}
            />
            <PlusMinusButton
              isMinus={true}
              onClick={() => removeTag(index)}
              aria-label={`Remove tag ${tag}`}
            />
          </div>
        ))}
        <div className={styles.tagListItem}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={handleKeyDown}
            placeholder="Add a new tag..."
            className={`${styles.tagInput} ${error ? styles.errorInput : ''}`}
            aria-label="Add a new tag"
            aria-invalid={!!error}
            aria-describedby={error ? "tag-error-message" : undefined}
          />
          <PlusMinusButton
            isMinus={false}
            onClick={addTag}
            aria-label="Add tag"
            disabled={!inputValue.trim()}
          />
        </div>
        {error && <p id="tag-error-message" className={styles.errorText}>{error}</p>}
      </div>
    </div>
  );
};

export default TagEditor;
