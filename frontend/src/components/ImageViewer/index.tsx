import { useState, useEffect, useCallback, useRef } from "react";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiZoomIn,
  FiZoomOut,
  FiMaximize,
  FiInfo,
} from "react-icons/fi";
import "./index.css";

/** One row of the metadata rail — e.g. { label: "Aperture", value: "f/8" }. */
export type MetaRow = {
  label: string;
  value: string;
};

export type ViewerImage = {
  src: string;
  alt: string;
  /** Optional line shown under the image — used by the photo gallery. */
  caption?: string;
  /** Shown in the side rail when the viewer runs with `showMeta`. */
  meta?: MetaRow[];
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(z * 100) / 100));

/* ------------------------------------------------------------------
   Full-screen viewer — arrow navigation, zoom, and drag-to-pan.
   Shared by the Projects gallery and the photo grid in Hobbies.

   `showMeta` opts a caller into the metadata rail: the photo wall passes
   it so frames can show their EXIF, while Projects leaves it off and the
   viewer stays exactly as it was.
   ------------------------------------------------------------------ */
const ImageViewer = ({
  images,
  index,
  onIndex,
  onClose,
  showMeta = false,
}: {
  images: ViewerImage[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
  showMeta?: boolean;
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  // On a narrow screen the rail would crowd out the photo, so it starts closed
  // there and stays a tap away on the toolbar.
  const [metaOpen, setMetaOpen] = useState(
    () => typeof window === "undefined" || window.matchMedia("(min-width: 761px)").matches
  );
  const dragStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const moved = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const current = images[index];
  const meta = showMeta ? current.meta : undefined;
  const railOpen = !!meta?.length && metaOpen;

  const applyZoom = useCallback((next: number) => {
    const z = clampZoom(next);
    setZoom(z);
    if (z === MIN_ZOOM) setPan({ x: 0, y: 0 });
  }, []);

  const go = useCallback(
    (delta: number) => onIndex((index + delta + images.length) % images.length),
    [index, images.length, onIndex]
  );

  // Reset the transform whenever a different image comes up.
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [index]);

  // Lock body scroll and wire up keyboard controls while open.
  useEffect(() => {
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "+" || e.key === "=") applyZoom(zoom + 0.5);
      else if (e.key === "-" || e.key === "_") applyZoom(zoom - 0.5);
      else if (e.key === "0") applyZoom(MIN_ZOOM);
      else if (e.key === "i" || e.key === "I") setMetaOpen((open) => !open);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose, go, applyZoom, zoom]);

  const onPointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
    moved.current = false;
    if (zoom > MIN_ZOOM) setDragging(true);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLImageElement>) => {
    const start = dragStart.current;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) moved.current = true;
    if (zoom > MIN_ZOOM) setPan({ x: start.px + dx, y: start.py + dy });
  };
  const onPointerUp = () => {
    // a click that didn't drag toggles between fit and 2x
    if (dragStart.current && !moved.current) applyZoom(zoom > MIN_ZOOM ? MIN_ZOOM : 2);
    dragStart.current = null;
    setDragging(false);
  };
  const cancelDrag = () => {
    dragStart.current = null;
    setDragging(false);
  };

  const multiple = images.length > 1;

  return (
    <div
      className="iv-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${current.alt} — ${index + 1} of ${images.length}`}
      onClick={onClose}
      onWheel={(e) => applyZoom(zoom - e.deltaY * 0.0025 * zoom)}
    >
      <button
        type="button"
        ref={closeRef}
        className="iv-close"
        onClick={onClose}
        aria-label="Close viewer"
      >
        <FiX />
      </button>

      {multiple && (
        <>
          <button
            type="button"
            className="iv-nav prev"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
          >
            <FiChevronLeft />
          </button>
          <button
            type="button"
            className="iv-nav next"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
          >
            <FiChevronRight />
          </button>
        </>
      )}

      <div className={`iv-content ${railOpen ? "with-rail" : ""}`}>
        {/* The image is a direct flex child on purpose: its *used* height then
            drives the column, so the caption sits right under the frame instead
            of below a tall wrapper's slack. */}
        <figure className="iv-figure">
          <img
            key={current.src}
            src={current.src}
            alt={current.alt}
            className={`iv-img ${zoom > MIN_ZOOM ? "zoomed" : ""} ${dragging ? "dragging" : ""}`}
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
            draggable={false}
            onClick={(e) => e.stopPropagation()}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={cancelDrag}
          />

          {current.caption && (
            <figcaption className="iv-caption" onClick={(e) => e.stopPropagation()}>
              {current.caption}
            </figcaption>
          )}
        </figure>

        {railOpen && (
          <aside className="iv-meta scroll-thin" onClick={(e) => e.stopPropagation()}>
            <p className="eyebrow iv-meta-label">Metadata</p>
            <dl className="iv-meta-list">
              {meta.map((row) => (
                <div key={row.label} className="iv-meta-row">
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </aside>
        )}
      </div>

      <div className="iv-bar" onClick={(e) => e.stopPropagation()}>
        {multiple && (
          <span className="iv-counter">
            {/* The index sits in a slot as wide as the highest number the set can
                reach, so stepping 9 → 10 can't widen the bar — and, since the bar
                is centred, shift everything in it half a digit sideways. */}
            <span
              className="iv-counter-index"
              style={{ width: `${String(images.length).length}ch` }}
            >
              {index + 1}
            </span>{" "}
            / {images.length}
          </span>
        )}
        <button
          type="button"
          onClick={() => applyZoom(zoom - 0.5)}
          disabled={zoom <= MIN_ZOOM}
          aria-label="Zoom out"
        >
          <FiZoomOut />
        </button>
        <span className="iv-zoom">{Math.round(zoom * 100)}%</span>
        <button
          type="button"
          onClick={() => applyZoom(zoom + 0.5)}
          disabled={zoom >= MAX_ZOOM}
          aria-label="Zoom in"
        >
          <FiZoomIn />
        </button>
        <button
          type="button"
          onClick={() => applyZoom(MIN_ZOOM)}
          disabled={zoom === MIN_ZOOM && pan.x === 0 && pan.y === 0}
          aria-label="Reset zoom"
        >
          <FiMaximize />
        </button>

        {!!meta?.length && (
          <button
            type="button"
            className={`iv-meta-toggle ${metaOpen ? "on" : ""}`}
            onClick={() => setMetaOpen((open) => !open)}
            aria-pressed={metaOpen}
            aria-label={metaOpen ? "Hide metadata" : "Show metadata"}
            title="Metadata (i)"
          >
            <FiInfo />
          </button>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;
