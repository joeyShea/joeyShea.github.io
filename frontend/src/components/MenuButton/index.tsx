import { useState, useEffect, useRef, useCallback } from "react";
import "./index.css";

const SCALE_DISTANCE = 50;
const MAX_SCALE = 1.5;
const MIN_SCALE = 1;

interface MenuButtonProps {
  pages: { name: string; path: string }[];
}

const MenuButton = ({ pages }: MenuButtonProps) => {
  const [open, setOpen] = useState(false);
  const [mouseY, setMouseY] = useState<number | null>(null);
  const [lineMove, setLineMove] = useState("0px");

  const containerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLElement | null>(null);
  const labelRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Measure half the menu height so the hamburger lines can "spread" to frame it.
  useEffect(() => {
    const update = () => {
      if (menuRef.current) setLineMove(`${menuRef.current.offsetHeight / 2}px`);
    };
    update();
    const t = setTimeout(update, 120);
    window.addEventListener("resize", update);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", update);
    };
  }, [pages.length]);

  // Track cursor Y for the magnify effect, only while open.
  useEffect(() => {
    if (!open) {
      setMouseY(null);
      return;
    }
    const onMove = (e: MouseEvent) => {
      setMouseY(menuRef.current?.contains(e.target as Node) ? e.clientY : null);
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, [open]);

  // Close when clicking/tapping outside (covers touch, where mouseleave never fires).
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const getScale = (index: number) => {
    const el = labelRefs.current[index];
    if (mouseY === null || !el) return MIN_SCALE;
    const rect = el.getBoundingClientRect();
    const dist = Math.abs(mouseY - (rect.top + rect.height / 2));
    return dist < SCALE_DISTANCE
      ? MAX_SCALE - (dist / SCALE_DISTANCE) * (MAX_SCALE - MIN_SCALE - 0.1)
      : MIN_SCALE;
  };

  const goTo = useCallback((path: string) => {
    document.getElementById(path)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  }, []);

  return (
    <div
      className="menu"
      ref={containerRef}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={`hamburger ${open ? "open" : ""}`}
        style={{ "--line-move": lineMove } as React.CSSProperties}
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="line top" />
        <span className="line middle" />
        <span className="line bottom" />
      </button>

      <nav
        ref={menuRef}
        className={`side-menu ${open ? "visible" : ""}`}
        aria-label="Section navigation"
      >
        {pages.map((page, index) => (
          <button
            key={page.path}
            type="button"
            ref={(el) => {
              labelRefs.current[index] = el;
            }}
            className="menu-link"
            style={{ transform: `scale(${getScale(index)})` }}
            onClick={() => goTo(page.path)}
          >
            {page.name}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default MenuButton;
