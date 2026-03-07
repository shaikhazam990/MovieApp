import { useEffect, useRef } from "react";

// Reusable Infinite Scroll component
// Jab last element screen pe aaye toh onLoadMore call hota hai

export default function InfiniteScroll({ onLoadMore, hasMore, loading, children }) {
  const observerRef = useRef(null);  // sentinel element ref
  const loaderRef   = useRef(null);  // IntersectionObserver ref

  useEffect(() => {
    // Pehle wala observer disconnect karo
    if (loaderRef.current) loaderRef.current.disconnect();

    // Naya observer banao
    loaderRef.current = new IntersectionObserver(
      (entries) => {
        // Sentinel visible hai aur aur data hai toh load karo
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    // Sentinel element observe karo
    if (observerRef.current) {
      loaderRef.current.observe(observerRef.current);
    }

    return () => loaderRef.current?.disconnect();
  }, [hasMore, loading, onLoadMore]);

  return (
    <div>
      {children}

      {/* Sentinel — yeh element screen pe aane pe load more trigger hoga */}
      <div ref={observerRef} style={{ height: "20px" }} />

      {/* Loading state */}
      {loading && (
        <div style={{
          display:        "flex",
          justifyContent: "center",
          padding:        "24px",
        }}>
          <span style={{
            width:        "32px",
            height:       "32px",
            border:       "3px solid #333",
            borderTop:    "3px solid var(--accent)",
            borderRadius: "50%",
            animation:    "spin 0.7s linear infinite",
            display:      "inline-block",
          }} />
        </div>
      )}

      {/* No more data */}
      {!hasMore && !loading && (
        <p style={{
          textAlign: "center",
          color:     "var(--text-muted)",
          padding:   "24px",
          fontSize:  "0.85rem",
        }}>
          You've reached the end 🎬
        </p>
      )}
    </div>
  );
}