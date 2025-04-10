import { createContext, useContext } from 'react';
import { ExplorerContextType } from '@/types/Explorer'; // Import types
// Create the context
export const ExplorerContext = createContext<ExplorerContextType | undefined>(undefined);

// Custom hook to use the context
export const useExplorerContext = () => {
  const context = useContext(ExplorerContext);
  if (!context) {
    throw new Error('useExplorerContext must be used within a ExplorerContext.Provider');
  }
  return context;
};
