'use client';

import React, { createContext, useContext } from 'react';

const SiteConfigContext = createContext<any>(null);

export function SiteConfigProvider({ children, data }: { children: React.ReactNode, data: any }) {
  return (
    <SiteConfigContext.Provider value={data}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig() {
  const context = useContext(SiteConfigContext);
  if (!context) {
    throw new Error('useSiteConfig must be used within a SiteConfigProvider');
  }
  return context;
}
