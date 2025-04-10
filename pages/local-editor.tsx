import React from 'react';
import { LocalEditorContext } from '@/contexts/LocalEditorContext';
import { useLocalEditorManager } from '@/hooks/useLocalEditorManager'; // The custom hook that manages state
import LocalEditorManager from '@/components/LocalEditor/LocalEditorManager';
import Layout from '@/components/Layout';
export default function LocalEditor() {
  const localEditorContext = useLocalEditorManager();
  //-commented-console.log("Home")
  return (
    <Layout>
      <LocalEditorContext.Provider value={localEditorContext}>
        <LocalEditorManager />
      </LocalEditorContext.Provider>
    </Layout>
  );
};
