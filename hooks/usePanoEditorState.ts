import { useState, useCallback } from 'react';
import { LocalPano } from '@/types/LocalEditor';

export function useLocalEditorManager() {
    const [panoramas, setPanoramas] = useState<LocalPano[]>([]);
    const [currentPanorama, setCurrentPanorama] = useState<LocalPano | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [tagError, setTagError] = useState('');
    const [description, setDescription] = useState('');

    const addPanorama = useCallback((pano: LocalPano) => {
        setPanoramas(prev => [...prev, pano]);
    }, []);

    const updatePanorama = useCallback((panoId: string, updatedData: Partial<LocalPano>) => {
        setPanoramas(prev => prev.map(p => p.localId === panoId ? {...p, ...updatedData} : p));
    }, []);

    const deletePanorama = useCallback((panoId: string) => {
        setPanoramas(prev => prev.filter(p => p.localId !== panoId));
    }, []);

    const addTag = useCallback(() => {
        const trimmed = inputValue.trim().toLowerCase();
        if (!trimmed) {
            setTagError('Tag cannot be empty.');
            return;
        }
        if (tags.includes(trimmed)) {
            setTagError('Tag already exists.');
            return;
        }
        setTags(prev => [...prev, trimmed]);
        setInputValue('');
        setTagError('');
    }, [inputValue, tags]);

    const removeTag = useCallback((index: number) => {
        setTags(prev => prev.filter((_, i) => i !== index));
    }, []);

    const updateTag = useCallback((index: number, newValue: string) => {
        const trimmed = newValue.trim().toLowerCase();
        if (tags.some((tag, i) => i !== index && tag === trimmed)) {
            setTagError('Duplicate tag.');
            return;
        }
        setTags(prev => prev.map((tag, i) => i === index ? trimmed : tag));
    }, [tags]);

    // Function to populate editor state when a panorama is selected for editing
    const populateEditorState = useCallback((data: LocalPano) => {
        setTags(data.tags || []);
        setDescription(data.description || '');
        setCurrentPanorama(data);
    }, []);

    return {
        panoramas,
        currentPanorama,
        tags,
        inputValue,
        tagError,
        description,
        setCurrentPanorama,
        addPanorama,
        updatePanorama,
        deletePanorama,
        setTags,
        setInputValue,
        setDescription,
        addTag,
        removeTag,
        updateTag,
        populateEditorState,
    };
}
