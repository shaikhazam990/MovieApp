import { useEffect } from "react";
import "./TrailerModal.scss";

export default function TrailerModal({ trailerKey, onClose }) {

  // ESC press pe modal close karo
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Modal open hone pe body scroll band karo
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="trailer-modal" onClick={onClose}>

      {/* Click inside pe close mat karo */}
      <div
        className="trailer-modal__box"
        onClick={(e) => e.stopPropagation()}
      >

        <button className="trailer-modal__close" onClick={onClose}>✕</button>

        {trailerKey ? (
          <div className="trailer-modal__video">
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Movie Trailer"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          </div>
        ) : (
          // Trailer nahi mili toh yeh dikhao — app crash nahi hogi
          <div className="trailer-modal__unavailable">
            <span>🎬</span>
            <p>Trailer for this movie is currently unavailable.</p>
          </div>
        )}

      </div>
    </div>
  );
}