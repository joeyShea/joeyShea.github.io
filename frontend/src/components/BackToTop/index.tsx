import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import "./index.css";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  // Show once the page is more than halfway through its scrollable range.
  // Recomputed on scroll rather than measured once, since lazy-loaded photos
  // change the document height as the reader moves down.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollable > 0 && window.scrollY / scrollable > 0.5);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const toTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      className={`to-top ${visible ? "visible" : ""}`}
      aria-label="Back to top"
      title="Back to top"
      onClick={toTop}
    >
      <FiArrowUp aria-hidden="true" />
    </button>
  );
};

export default BackToTop;
