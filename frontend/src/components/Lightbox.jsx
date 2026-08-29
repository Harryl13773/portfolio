import './Lightbox.css';

// Non-blocking centered viewer that allows interaction with the page behind it.
function Lightbox({ state, onClose, onPrev, onNext }) {
  if (!state) return null;

  const { images, index, title } = state;

  return (
    <div className="lightbox-overlay">
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="Close">
        ×
      </button>

      {images.length > 1 && (
        <button
          type="button"
          className="lightbox-nav lightbox-prev"
          onClick={onPrev}
          aria-label="Previous screenshot"
        >
          ‹
        </button>
      )}

      <img
        className="lightbox-image"
        src={images[index]}
        alt={`${title} screenshot ${index + 1}`}
      />

      {images.length > 1 && (
        <button
          type="button"
          className="lightbox-nav lightbox-next"
          onClick={onNext}
          aria-label="Next screenshot"
        >
          ›
        </button>
      )}
    </div>
  );
}

export default Lightbox;
