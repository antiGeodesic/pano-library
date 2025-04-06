import React from 'react';
import { useLocalEditorContext } from '@/contexts/LocalEditorContext'; // Adjust the import path as necessary
//import { LocalPano } from '@/types';
import StreetViewComponent from '@/components/PanoEditor/StreetViewComponent'
import TagEditor from './TagEditor';
import DescriptionEditor from './DescriptionEditor';
import EditorActionButtons from './EditorActionButtons';
import styles from '@/styles/Home.module.css';

const PanoEditorPanel: React.FC = () => {
  const {
    currentPanorama,
    displayedPanorama,
    /*addLocalPano,
    updateLocalPano,
    deleteLocalPano,
    clearCurrentPano,*/
  } = useLocalEditorContext();
  if (!currentPanorama || !displayedPanorama) return null;

  //let tags = currentPanorama.tags, /*description = currentPanorama.description,*/ panoValues = { panoId: currentPanorama.panoId, lat: currentPanorama.lat, lng: currentPanorama.lng }, povValues = { heading: currentPanorama.heading, pitch: currentPanorama.pitch, zoom: currentPanorama.zoom };
  /*
  const [tags, setTags] = useState<string[]>(currentPanorama.tags);
  const [description, setDescription] = useState(currentPanorama.description);
  const [panoValues, setPanoValues] = useState<{panoId: string, lat: number, lng: number}>({panoId: currentPanorama.panoId,lat: currentPanorama.lat,lng: currentPanorama.lng});
  const [povValues, setPovValues] = useState<{heading: number, pitch: number, zoom: number}>({heading: currentPanorama.heading,pitch: currentPanorama.pitch,zoom: currentPanorama.zoom});
  useEffect(() => {
    if(!currentPanorama) return;
    setDisplayedPanorama({...currentPanorama, ...panoValues, ...povValues, tags: tags, description: description, movementHistory: displayedPanorama?.movementHistory ? [...displayedPanorama?.movementHistory, panoValues] : [panoValues]})
    console.log(displayedPanorama?.movementHistory)

  }, [tags, description, panoValues, povValues]);
  */
  //const updateDisplayedPanorama = () => setDisplayedPanorama({ ...currentPanorama, ...displayedPanorama, ...panoValues, ...povValues, tags: tags, movementHistory: displayedPanorama?.movementHistory ? [...displayedPanorama?.movementHistory, panoValues] : [panoValues] })
  //const setTags = (newTags: string[]) => { tags = newTags; updateDisplayedPanorama() }
  //const setDescription = (newDescription: string) => { description = newDescription; updateDisplayedPanorama() }
  //const setPanoValues = (newPanoValues: { panoId: string, lat: number, lng: number }) => { panoValues = newPanoValues; updateDisplayedPanorama() }
  //const setPovValues = (newPovValues: { heading: number, pitch: number, zoom: number }) => { povValues = newPovValues; updateDisplayedPanorama() }


  /*const handleSave = () => {
    console.log("Saving new data...");
    const newLocalPano: LocalPano = { ...currentPanorama, ...panoValues, ...povValues, tags: tags, movementHistory: displayedPanorama?.movementHistory ?? [] }
    console.log("Trying to save this:", newLocalPano);
    addLocalPano(newLocalPano);
    clearCurrentPano();
  };

  const handleUpdate = () => {
    console.log("Updating existing data...");
    updateLocalPano({ ...currentPanorama, ...panoValues, ...povValues, tags: tags, movementHistory: displayedPanorama?.movementHistory ?? [] });
    clearCurrentPano();
  };

  const handleDelete = () => {
    console.log("Deleting current data...");
    deleteLocalPano(currentPanorama.localId);
    clearCurrentPano();
  };

  const handleClose = () => {
    console.log("Closing editor...");
    clearCurrentPano();
  };*/

  return (
    <div className={styles.panoEditor}>
      {/* Street View Component */}
      <StreetViewComponent/>

      {/* Settings and Controls Area */}
      <div className={styles.panoSettings}>
        {/* Tag Editor */}
        <TagEditor/>

        {/* Description Editor */}
        <DescriptionEditor/>

        {/* Action Buttons */}
        <EditorActionButtons
        />
      </div>
    </div>
  );
};

export default PanoEditorPanel;
