import React, { useState } from 'react';
import { TagCategory } from '@/types/index';
import { useLocalEditorContext  } from '@/contexts/LocalEditorContext';
import PlusMinusButton from '@/components/LocalEditor/PanoEditor/PlusMinusButton';
import styles from '@/styles/LocalEditor.module.css';
interface TagEditorProps {
  initialTags: TagCategory[],
  setCurrentTags: (tags: TagCategory[]) => void;
}
const TagEditor: React.FC<TagEditorProps> = ({initialTags, setCurrentTags}) => {
  const { /*currentPanorama,
    setCurrentTags*/
  } = useLocalEditorContext();

  
  //const tagRef = useRef<HTMLDivElement>(null);
  const [tags, setTags] = useState<TagCategory[]>(initialTags);
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  if (!initialTags) {
    return null;
  }

  //const tags: TagCategory[] = displayedPanorama.tags;
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
    const newTag: TagCategory = {x: -1, y: -1, z: -1, t: inputValue};
    setCurrentTags([...tags, newTag])
    setTags([...tags, newTag])
    
    //updateCurrentTags(-1, {x: -1, y: -1, z: -1, t: inputValue})
    setInputValue('');
    setError('');
  };

  const removeTag = (index: number) => {
    //updateCurrentTags(index, "");
    console.log("[TagEditor]---------------- Tag Count (1): ", tags.length)
    const newTags: TagCategory[] = tags.splice(index, 1);
    console.log("[TagEditor]---------------- Tag Count (2):", tags.length)
    setCurrentTags(newTags)
    setTags(newTags)
    
  };

  const changeTag = (index: number, newValue: string) => {
    const newTags: TagCategory[] = tags;
    newTags[index] = {x: -1, y: -1, z: -1, t: newValue};
    setCurrentTags(newTags)
    setTags(newTags)
  };

  return (

      <div className={styles.tagList}>
        <div className={styles.editorLabel}>Tags:</div>
        {tags.map((tag, index) => (
          <div key={index} className={styles.tagListItem}>
            <input
              type="text"
              value={tag.t}
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

  );
};

export default TagEditor;
