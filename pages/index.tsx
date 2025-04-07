/*import React from 'react';
import LocalEditorManager from '@/components/LocalEditorManager';
import { LocalEditorContext } from '@/contexts/LocalEditorContext';
import { useLocalEditorManager } from '@/hooks/useLocalEditorManager';
const App = () => {
  const editorManager = useLocalEditorManager();
  return (
    <LocalEditorContext.Provider value={editorManager}>
      <LocalEditorManager />
    </LocalEditorContext.Provider>
  );
};

export default App;
*/


/*import React, { createContext, useContext } from 'react';
import LocalEditorManager from '@/components/LocalEditorManager';
import { useLocalEditorManager } from '@/hooks/useLocalEditorManager';
const MyContext = createContext(null);

// Context Provider Component
export const MyProvider = ({ children }) => {
  const contextValue = useLocalEditorManager();

  return (
    <MyContext.Provider value={contextValue}>
      <LocalEditorManager />
    </MyContext.Provider>
  );
};

// Custom hook to use the context
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};*/
/*import React from 'react';
import ReactDOM from 'react-dom';
import { LocalEditorContext } from '@/contextss/LocalEditorContext';
import { useLocalEditorManager } from '@/hooks/useLocalEditorManager'; // The custom hook that manages state

export default function Home() {
  
}
*/
// src/index.tsx
import React from 'react';
import { LocalEditorContext } from '@/contexts/LocalEditorContext';
import { useLocalEditorManager } from '@/hooks/useLocalEditorManager'; // The custom hook that manages state
import LocalEditorManager from '@/components/LocalEditorManager';

export default function Home() {
  const localEditorContext = useLocalEditorManager();
  //-commented-console.log("Home")
  return (
    <LocalEditorContext.Provider value={localEditorContext}>
      <LocalEditorManager />
    </LocalEditorContext.Provider>
  );
};
