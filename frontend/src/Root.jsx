import App from './App.jsx';
import LightboxProvider from './components/LightboxProvider.jsx';

// Wraps the app in the screenshot viewer provider
function Root() {
  return (
    <LightboxProvider>
      <App />
    </LightboxProvider>
  );
}

export default Root;
