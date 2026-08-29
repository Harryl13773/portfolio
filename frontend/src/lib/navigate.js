// Pushes a new URL and notifies the route switch via popstate
export function navigate(to) {
  if (window.location.pathname !== to) {
    window.history.pushState({}, '', to);
  }
  window.dispatchEvent(new PopStateEvent('popstate'));
}

// Handles plain left-click navigation while preserving modified and middle-click behavior
export function handleNavClick(event, to) {
  if (event.defaultPrevented || event.button !== 0) return;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  navigate(to);
}
