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
    const [lineMove, setLineMove] = useState("0px");

    const menuRef = useRef<HTMLDivElement | null>(null);
    const labelRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Track cursor Y-position inside menu
    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            if (menuRef.current?.contains(event.target as Node)) {
                setMousePos({ y: event.clientY });
            }
        };

        const handleMouseLeave = () => {
            setMousePos(null); // Reset only when leaving the entire menu
        };

        document.addEventListener("mousemove", handleMouseMove);
        menuRef.current?.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            menuRef.current?.removeEventListener("mouseleave", handleMouseLeave);
        };
    }, []);

    useEffect(() => {
        const updateLineMove = () => {
            if (menuRef.current) {
                const menuHeight = menuRef.current.offsetHeight;
                setLineMove(`${menuHeight / 2}px`);
            }
        };

        updateLineMove();
        setTimeout(updateLineMove, 100);

        window.addEventListener("resize", updateLineMove);

        return () => window.removeEventListener("resize", updateLineMove);
    }, []);

    // Scale effect for menu items
    const getScale = (index: number) => {
        if (!mousePos || !labelRefs.current[index]) return MIN_SCALE;

        const rect = labelRefs.current[index]!.getBoundingClientRect();
        const labelY = rect.top + rect.height / 2;
        const distance = Math.abs(mousePos.y - labelY);

        return distance < SCALE_DISTANCE
            ? MAX_SCALE - (distance / SCALE_DISTANCE) * (MAX_SCALE - MIN_SCALE - 0.1)
            : MIN_SCALE;
    };
    setTimeout(() => {
        if (menuRef.current) {
            const menuHeight = menuRef.current.offsetHeight;
            setLineMove(`${menuHeight / 2}px`);
        }
    }, 100);

    return (
        <div className="hamburger-container">
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
                        className="menu-link incButton"
                        style={{
                            transform: `scale(${getScale(index)})`,
                            transition: "transform 0.1s linear",
                            transformOrigin: "center",
                            cursor: "pointer",
                        }}
                        onClick={() => {
							const section = document.getElementById(page.path);
                            if (section) {
                                const offset = 130; // Adjust this value as needed
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
