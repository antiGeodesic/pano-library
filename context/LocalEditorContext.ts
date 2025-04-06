import { createContext, useContext } from 'react';
import { LocalEditorContextType } from '@/types'; // Import types
// Create the context
export const LocalEditorContext = createContext<LocalEditorContextType | undefined>(undefined);

// Custom hook to use the context
export const useLocalEditorContext = () => {
  const context = useContext(LocalEditorContext);
  if (!context) {
    throw new Error('useLocalEditorContext must be used within a LocalEditorContext.Provider');
  }
  return context;
};
