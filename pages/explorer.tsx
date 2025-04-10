import React from 'react';
import { ExplorerContext } from '@/contexts/ExplorerContext';
import { useExplorerManager } from '@/hooks/useExplorerManager'; // The custom hook that manages state
import ExplorerManager from '@/components/Explorer/ExplorerManager';
import Layout from '@/components/Layout';
export default function Explorer() {
  const explorerContext = useExplorerManager();

  return (
    <Layout>
        <ExplorerContext.Provider value={explorerContext}>
          <ExplorerManager />
        </ExplorerContext.Provider>
    </Layout>
  );
};
