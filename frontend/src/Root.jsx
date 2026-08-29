import { useEffect, useState } from 'react';
import App from './App.jsx';
import ProjectsPage from './ProjectsPage.jsx';
import LightboxProvider from './components/LightboxProvider.jsx';

// Routes between the site's two paths, synced with pushState and browser navigation
function Root() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <LightboxProvider>
      {path === '/projects' ? <ProjectsPage /> : <App />}
    </LightboxProvider>
  );
}

export default Root;
