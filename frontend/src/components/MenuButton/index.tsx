import { useState, useEffect, useRef } from "react";
import "./index.css";

const SCALE_DISTANCE = 50;
const MAX_SCALE = 1.5;
const MIN_SCALE = 1;

interface MenuButtonProps {
  pages: { name: string; path: string }[];
}

const MenuButton = ({ pages }: MenuButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState<{ y: number } | null>(null);
  const [lineMove, setLineMove] = useState("8vw"); // Default movement
  const menuRef = useRef<HTMLDivElement | null>(null);
  const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Track cursor Y-position inside menu
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (menuRef.current?.contains(event.target as Node)) {
        setMousePos({ y: event.clientY });
      } else {
        setMousePos(null);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Calculate line movement based on menu height
  useEffect(() => {
    const updateLineMove = () => {
      if (menuRef.current) {
        const menuHeight = menuRef.current.offsetHeight;
        setLineMove(`${menuHeight / 2}px`); // Move half of menu height
      }
    };
  
    updateLineMove(); // Run once on mount
    window.addEventListener("resize", updateLineMove);
  
    return () => window.removeEventListener("resize", updateLineMove);
  }, [pages.length]); // Runs when menu items change *or* on resize

  // Scale effect for menu items
  const getScale = (index: number) => {
    if (!mousePos || !labelRefs.current[index]) return MIN_SCALE;

    const rect = labelRefs.current[index]!.getBoundingClientRect();
    const labelY = rect.top + rect.height / 2;
    const distance = Math.abs(mousePos.y - labelY);

    return distance < SCALE_DISTANCE
      ? MAX_SCALE - (distance / SCALE_DISTANCE) * (MAX_SCALE - MIN_SCALE)
      : MIN_SCALE;
  };

  return (
    <div
      className="hamburger-container"
    >
      {/* Menu Button */}
      <div
        className={`hamburger ${isHovered ? "open" : ""}`}
        style={{ "--line-move": lineMove } as React.CSSProperties}
        onMouseEnter={() => setIsHovered(true)}
      >
        <span className="line top"></span>
        <span className="line middle"></span>
        <span className="line bottom"></span>
      </div>

      {/* Side Menu */}
      <nav
  ref={menuRef}
  className={`side-menu ${isHovered ? "visible" : "hidden"}`}
  onMouseLeave={() => setIsHovered(false)}
>
  {pages.map((page, index) => (
    <div
      key={page.name}
      ref={(el) => {
        labelRefs.current[index] = el;
      }}
      className="menu-link"
      style={{
        transform: `scale(${getScale(index)})`,
        transition: "transform 0.1s linear",
        transformOrigin: "center",
        cursor: "pointer",
      }}
      onClick={() => {
        const section = document.getElementById(page.path);
        if (section) {
          const offset = 100; // Adjust this value as needed
          const topPosition = section.getBoundingClientRect().top + window.scrollY - offset;
      
          window.scrollTo({ top: topPosition, behavior: "smooth" });
        }
      }}
    >
      {page.name}
    </div>
  ))}
</nav>

      
    </div>
  );
};

export default MenuButton;
