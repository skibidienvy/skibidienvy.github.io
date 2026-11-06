'use client';

import {
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';

const BASE_Z = 22;

// Central window stack: focus order lives in React state, so z-index is
// derived (last id = top) instead of a module-global counter.
export function useWindowStack(ids: readonly string[]) {
  const [order, setOrder] = useState<readonly string[]>(ids);

  const bringToFront = useCallback((id: string) => {
    setOrder((current) =>
      current[current.length - 1] === id
        ? current
        : [...current.filter((x) => x !== id), id],
    );
  }, []);

  const zOf = useCallback(
    (id: string) => BASE_Z + Math.max(0, order.indexOf(id)),
    [order],
  );

  return { zOf, bringToFront };
}

export function DesktopWindow({
  id,
  title,
  className,
  z,
  onFocus,
  children,
}: {
  id: string;
  title: string;
  className: string;
  z: number;
  onFocus: (id: string) => void;
  children: ReactNode;
}) {
  const windowRef = useRef<HTMLElement>(null);
  const drag = useRef({ active: false, x: 0, y: 0, left: 0, top: 0 });

  const beginDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    onFocus(id);
    if (event.button !== 0 || window.matchMedia('(max-width: 760px)').matches) return;
    const node = windowRef.current;
    if (!node) return;
    const bounds = node.getBoundingClientRect();
    drag.current = {
      active: true,
      x: event.clientX,
      y: event.clientY,
      left: bounds.left,
      top: bounds.top,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const node = windowRef.current;
    if (!node) return;
    const left = Math.min(
      Math.max(8, drag.current.left + event.clientX - drag.current.x),
      Math.max(8, window.innerWidth - node.offsetWidth - 8),
    );
    const top = Math.min(
      Math.max(8, drag.current.top + event.clientY - drag.current.y),
      Math.max(8, window.innerHeight - node.offsetHeight - 8),
    );
    node.style.left = `${left}px`;
    node.style.top = `${top}px`;
    node.style.right = 'auto';
    node.style.bottom = 'auto';
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    drag.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  return (
    <section
      ref={windowRef}
      className={`os-window ${className}`}
      aria-label={title}
      style={{ zIndex: z }}
      onPointerDownCapture={() => onFocus(id)}
    >
      <div
        className="window-titlebar"
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <span>{title}</span>
        <span className="window-title-marks" aria-hidden="true">
          <i />
          <i />
        </span>
      </div>
      <div className="window-body">{children}</div>
    </section>
  );
}
