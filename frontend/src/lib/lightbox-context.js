import { createContext, useContext } from 'react';

// One shared preview panel for the whole page — see components/LightboxProvider.jsx
export const LightboxContext = createContext(null);

export function useLightbox() {
  const ctx = useContext(LightboxContext);
  if (!ctx) throw new Error('useLightbox must be used within a LightboxProvider');
  return ctx;
}
