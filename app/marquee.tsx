'use client';

import { useEffect, useRef, useState } from 'react';

// Seamless marquee. One copy of `text` is the unit; the track is translated by
// exactly one unit width (--meow-unit) so it loops without a seam. We repeat the
// unit until the strip is at least viewport + 1 unit wide, re-measuring on resize
// and zoom (ResizeObserver on <html> fires on both) so no gap ever shows.
export function Marquee({
  text,
  label,
  className = 'meow-ticker',
  trackClassName = 'meow-ticker-track',
}: {
  text: string;
  label: string;
  className?: string;
  trackClassName?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [copies, setCopies] = useState(2);
  const [unitWidth, setUnitWidth] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const fit = () => {
      const unit = track.firstElementChild as HTMLElement | null;
      const width = unit?.offsetWidth ?? 0;
      if (!width) return;
      setUnitWidth(width);
      const needed = Math.max(2, Math.ceil(window.innerWidth / width) + 1);
      setCopies((current) => (current === needed ? current : needed));
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(document.documentElement);
    document.fonts?.ready.then(fit).catch(() => undefined);
    return () => observer.disconnect();
  }, [text]);

  return (
    <footer className={className} aria-label={label}>
      <div
        className={trackClassName}
        ref={trackRef}
        style={unitWidth ? ({ '--meow-unit': `${unitWidth}px` } as React.CSSProperties) : undefined}
      >
        {Array.from({ length: copies }, (_, index) => (
          <span key={index} aria-hidden={index > 0}>
            {text}
          </span>
        ))}
      </div>
    </footer>
  );
}
