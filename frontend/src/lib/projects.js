// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let request = null;

// Fetches projects once and caches the request
export function loadProjects() {
  if (!request) {
    request = fetch(`${API_URL}/api/projects`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .catch(() => {
        request = null; // Allow a retry after failure
        throw new Error('...Loading, refresh to try again.');
      });
  }
  return request;
}
