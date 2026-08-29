import { useCallback, useEffect, useMemo, useState } from 'react';
import { LightboxContext } from '../lib/lightbox-context';
import Lightbox from './Lightbox';

// Tracks the active screenshot preview, allowing any ProjectCard to replace it
function LightboxProvider({ children }) {
  const [state, setState] = useState(null); // { images, index, title } | null

  const openLightbox = useCallback((images, index, title) => {
    if (!images || images.length === 0) return;
    setState({ images, index, title });
  }, []);

  const closeLightbox = useCallback(() => setState(null), []);

  const showPrev = useCallback(() => {
    setState((s) => (s ? { ...s, index: (s.index - 1 + s.images.length) % s.images.length } : s));
  }, []);

  const showNext = useCallback(() => {
    setState((s) => (s ? { ...s, index: (s.index + 1) % s.images.length } : s));
  }, []);

  useEffect(() => {
    if (!state) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [state, closeLightbox, showPrev, showNext]);

  const isLightboxOpen = state !== null;

  const value = useMemo(
    () => ({ openLightbox, isLightboxOpen }),
    [openLightbox, isLightboxOpen]
  );

  return (
    <LightboxContext.Provider value={value}>
      {children}
      <Lightbox state={state} onClose={closeLightbox} onPrev={showPrev} onNext={showNext} />
    </LightboxContext.Provider>
  );
}

export default LightboxProvider;
