import { useState, useEffect, useCallback, useRef } from "react";
import {
  FiExternalLink,
  FiGithub,
  FiX,
  FiArrowUpRight,
  FiChevronLeft,
  FiChevronRight,
  FiZoomIn,
  FiZoomOut,
  FiMaximize,
} from "react-icons/fi";
import "./index.css";

type ProjectLink = {
  label: string;
  href: string;
  kind: "live" | "code" | "demo";
};

type Project = {
  id: string;
  title: string;
  tagline: string;
  timeframe: string;
  role?: string;
  category: string;
  status?: "live" | "building" | "shipped";
  highlights: string[];
  tech: string[];
  links?: ProjectLink[];
  images?: string[];
  note?: string;
};

// Tech names that have a matching icon in /public/icons — others render as plain chips.
const TECH_ICONS: Record<string, string> = {
  React: "/icons/react.svg",
  TypeScript: "/icons/ts.svg",
  JavaScript: "/icons/js.svg",
  "Node.js": "/icons/node.svg",
  Express: "/icons/express.svg",
  "Socket.IO": "/icons/socketio.svg",
  Python: "/icons/python.svg",
  PyTorch: "/icons/pytorch.svg",
  R: "/icons/r.svg",
  Figma: "/icons/figma.svg",
  Firebase: "/icons/firebase.svg",
  Git: "/icons/git.svg",
  GitHub: "/icons/github.svg",
  HTML: "/icons/html.svg",
  CSS: "/icons/css.svg",
  Excel: "/icons/excel.svg",
  Canva: "/icons/canva.svg",
};

// Category order controls how the selector groups render (strongest first).
const CATEGORY_ORDER = [
  "Featured",
  "AI & Agents",
  "Full-Stack",
  "Tools & Data",
  "Business & Analysis",
];

const projects: Project[] = [
  {
    id: "grafle",
    title: "Grafle",
    category: "Featured",
    status: "live",
    timeframe: "2025 – Present",
    role: "Solo project",
    tagline:
      "A free game that teaches you to recognize the world's languages and writing systems at a glance — built for GeoGuessr players who navigate by the signage.",
    highlights: [
      "Three-stage rounds — read the script, name the language, then place it on the map — spanning 71 languages, 6 script families, and ~90 hand-written confusion notes that teach on every miss.",
      "Deterministic daily challenge with streaks and a Wordle-style shareable grid, plus practice modes from Easy to Expert.",
      "A data-integrity validator gates every build: sample text must fall ≥80% inside a script's Unicode ranges, catching wrong-language errors mechanically.",
      "Ships with zero third-party runtime requests; an optional Supabase backend layers on global leaderboards and cross-device streaks.",
    ],
    tech: ["React", "Vite", "Leaflet", "Supabase", "JavaScript"],
    links: [{ label: "Play Grafle", href: "https://grafle.xyz", kind: "live" }],
    images: [
      "/project_images/grafle-og.webp",
      "/project_images/grafle1.webp",
      "/project_images/grafle2.webp",
    ],
  },
  {
    id: "cue",
    title: "Cue",
    category: "AI & Agents",
    status: "live",
    timeframe: "2025 – Present",
    role: "Solo project",
    tagline:
      "An AI calendar you talk to in plain language — it schedules, reschedules, and answers questions about your week.",
    highlights: [
      "The model decides only intent; every date, recurrence rule, and conflict check is computed deterministically server-side and treated as untrusted until validated.",
      "Two-phase agent: a tool-enabled 'gather' pass (Maps travel times, web search) collects facts, then a JSON pass emits a structured, capped action list.",
      "Recurring events live as a single RRULE expanded on read; every calendar-changing turn is journaled and reversible with a single undo.",
      "Real-time sync across devices over WebSocket, a Google-Calendar-style overlap layout, and on-device embeddings that pick an event's icon with no API call.",
    ],
    tech: ["React", "Redux", "Python", "FastAPI", "PostgreSQL", "Gemini"],
    links: [{ label: "Open Cue", href: "https://cue-demo.me", kind: "live" }],
    images: [
      "/project_images/cue1.webp",
      "/project_images/cue2.webp",
      "/project_images/cue4.webp",
      "/project_images/cue3.webp",
    ],
  },
  {
    id: "capstone",
    title: "Agentic Framework",
    category: "AI & Agents",
    status: "building",
    timeframe: "2025 – Present",
    role: "Raikes Design Studio",
    tagline:
      "A computer-use agent that sees and operates a real screen — my 9-month Raikes School Design Studio capstone.",
    highlights: [
      "Runs on local Ollama LLMs for privacy, with LangGraph orchestrating the agent loop and keeping every decision traceable.",
      "Uses YOLO and multimodal vision models to read the screen so the agent grounds its actions in what's actually rendered.",
      "Led the upfront research and helped build the application end-to-end with the studio team.",
    ],
    tech: ["Python", "Ollama", "LangGraph", "YOLO"],
  },
  {
    id: "travela",
    title: "Travela",
    category: "Full-Stack",
    status: "shipped",
    timeframe: "2026",
    role: "Hackathon team",
    tagline:
      "A full-featured travel review platform designed, built, and deployed in a 24-hour hackathon.",
    highlights: [
      "Browse, post, and rate destinations — an end-to-end review app taken from idea to deploy in a single day.",
      "Runs on AWS with RDS for data, S3 for media, and containers hosted in ECR.",
    ],
    tech: ["Next.js", "TypeScript", "AWS RDS", "S3", "ECR"],
    links: [{ label: "View code", href: "https://github.com/joeyShea/travel-map", kind: "code" }],
    images: ["/project_images/travela2.webp", "/project_images/travela1.webp"],
  },
  {
    id: "nerts",
    title: "NERTS!",
    category: "Full-Stack",
    status: "shipped",
    timeframe: "2024 – 2025",
    role: "Team of 4",
    tagline: "A real-time multiplayer card game, built full-stack with a team of four.",
    highlights: [
      "Designed and wireframed the experience in Figma, then built an accessible, responsive frontend in React.",
      "Added real-time multiplayer with Node.js and Socket.IO over Express routing.",
      "Wired up login/signup and stats collection with Firebase.",
    ],
    tech: ["Figma", "React", "Express", "Node.js", "Socket.IO", "Git", "Firebase"],
    links: [{ label: "Live demo", href: "https://nerts-web-app.onrender.com", kind: "demo" }],
    images: ["/project_images/nerts1.webp", "/project_images/nerts2.webp"],
    note: "Hosted free on Render — the demo can take ~60s to wake up.",
  },
  {
    id: "stringg",
    title: "Stringg",
    category: "Full-Stack",
    status: "live",
    timeframe: "2025",
    role: "Solo project",
    tagline:
      "A browser music composer built around physics-simulated strings and the Web Audio API.",
    highlights: [
      "Pluck and couple simulated strings to compose in the browser, with audio synthesized live through the Web Audio API.",
      "React frontend with a Python / FastAPI backend, deployed on Render.",
    ],
    tech: ["React", "TypeScript", "Python", "FastAPI", "Web Audio"],
    links: [{ label: "Open Stringg", href: "https://stringg.xyz", kind: "live" }],
    images: [
      "/project_images/stringg2.webp",
      "/project_images/stringg3.webp",
      "/project_images/stringg1.webp",
    ],
  },
  {
    id: "composite",
    title: "Composite Maker",
    category: "Tools & Data",
    status: "building",
    timeframe: "2026",
    role: "Solo project",
    tagline:
      "A native desktop app that builds print-ready Greek / yearbook composite photos and generates them in InDesign.",
    highlights: [
      "Match photos to names, assign roles, and arrange executives, then produce a print-ready layout from a custom Rust layout solver.",
      "Built with Tauri + React; scripts Adobe InDesign via AppleScript to render the final document and PDF.",
    ],
    tech: ["Tauri", "Rust", "React", "TypeScript"],
    images: ["/project_images/composites.webp"],
  },
  {
    id: "stocks",
    title: "Stock Dashboard",
    category: "Tools & Data",
    status: "shipped",
    timeframe: "2025",
    role: "Solo project",
    tagline: "A live terminal dashboard for markets and Federal Reserve data.",
    highlights: [
      "Runs in any terminal and live-updates candlestick charts plus Fed statistics pulled from FRED and Yahoo Finance.",
      "Written in Python and aliased to a single command for quick access from anywhere.",
    ],
    tech: ["Python"],
    links: [{ label: "View code", href: "https://github.com/joeyShea/StockDashboard", kind: "code" }],
    images: ["/project_images/stock.webp"],
  },
  {
    id: "sports-ml",
    title: "Sports Modeling",
    category: "Tools & Data",
    status: "shipped",
    timeframe: "2025",
    role: "Team project",
    tagline: "A machine-learning model that predicts NBA game outcomes from historical stats.",
    highlights: [
      "Gathered and cleaned historical NBA statistics with a team.",
      "Built and trained a predictive model in PyTorch to forecast game results.",
    ],
    tech: ["Python", "PyTorch", "Git"],
  },
  {
    id: "gym-stats",
    title: "Gym Usage Study",
    category: "Tools & Data",
    status: "shipped",
    timeframe: "2024",
    role: "Pair project",
    tagline: "A semester-long statistics study of campus gym usage.",
    highlights: [
      "Collected observational data on gym traffic and ran a survey to corroborate it qualitatively.",
      "Wrote up the findings with matplotlib visualizations.",
    ],
    tech: ["Python", "Excel"],
    images: ["/project_images/stats1.webp", "/project_images/stats2.webp"],
  },
  {
    id: "ourpact",
    title: "OurPact",
    category: "Business & Analysis",
    status: "shipped",
    timeframe: "2024",
    role: "Team of 5",
    tagline: "A concept app and business model developed over a 15-week innovation course.",
    highlights: [
      "Built customer profiles, prototypes, and market research into a full go-to-market concept.",
      "Culminated in a 10-minute pitch to a panel of venture capitalists.",
    ],
    tech: ["Figma"],
    images: ["/project_images/ourpact.webp", "/project_images/ourpact2.webp"],
  },
  {
    id: "opportunity-atlas",
    title: "Opportunity Atlas",
    category: "Business & Analysis",
    status: "shipped",
    timeframe: "2024",
    role: "Team project",
    tagline: "An analysis of large-scale, real-world U.S. income and mobility data.",
    highlights: [
      "Analyzed nationwide income data to surface patterns in economic opportunity.",
      "Combined Python and R for the data work and statistical modeling.",
    ],
    tech: ["Python", "R"],
  },
];

const STATUS_LABEL: Record<NonNullable<Project["status"]>, string> = {
  live: "Live",
  building: "In progress",
  shipped: "Shipped",
};

const LINK_ICON = {
  live: FiArrowUpRight,
  code: FiGithub,
  demo: FiExternalLink,
} as const;

// The deck loads a light 640px thumbnail; the modal loads the full-res original.
const thumbFor = (src: string) => src.replace(/\.webp$/, "-thumb.webp");

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round(z * 100) / 100));

/* ------------------------------------------------------------------
   Aside — the detail panel's right rail. Holds the screenshot gallery
   (a fanned deck; hovering a card hops it straight up, no reorder) and
   the project's skills, so both sit beside the write-up rather than
   stacking below it.
   ------------------------------------------------------------------ */
const ProjectAside = ({
  title,
  images,
  tech,
  onOpen,
}: {
  title: string;
  images: string[];
  tech: string[];
  onOpen: (index: number) => void;
}) => (
  <aside className="proj-aside">
    <div className="proj-aside-sticky">
      {images.length > 0 && (
        <section className="proj-aside-block">
          <p className="eyebrow proj-aside-label">
            Gallery <span className="proj-aside-count">{images.length}</span>
          </p>

          <div className="proj-deck">
            {images.map((image, i) => (
              <button
                key={image}
                type="button"
                className="proj-deck-card"
                onClick={() => onOpen(i)}
                aria-label={`Expand ${title} screenshot ${i + 1} of ${images.length}`}
              >
                <img
                  src={thumbFor(image)}
                  alt={`${title} screenshot ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  width={640}
                  height={400}
                />
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="proj-aside-block">
        <p className="eyebrow proj-aside-label">Skills</p>
        <div className="tech-row proj-skills">
          {tech.map((name) => (
            <span key={name} className="tech-chip">
              {TECH_ICONS[name] && <img src={TECH_ICONS[name]} alt="" aria-hidden="true" />}
              {name}
            </span>
          ))}
        </div>
      </section>
    </div>
  </aside>
);

/* ------------------------------------------------------------------
   Full-screen viewer — arrow navigation, zoom, and drag-to-pan.
   ------------------------------------------------------------------ */
const ImageViewer = ({
  title,
  images,
  index,
  onIndex,
  onClose,
}: {
  title: string;
  images: string[];
  index: number;
  onIndex: (index: number) => void;
  onClose: () => void;
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const moved = useRef(false);
  const closeRef = useRef<HTMLButtonElement>(null);

  const applyZoom = useCallback((next: number) => {
    const z = clampZoom(next);
    setZoom(z);
    if (z === MIN_ZOOM) setPan({ x: 0, y: 0 });
  }, []);

  const go = useCallback(
    (delta: number) => onIndex((index + delta + images.length) % images.length),
    [index, images.length, onIndex]
  );

  // Reset the transform whenever a different screenshot comes up.
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
      className="proj-modal"
      role="dialog"
      aria-modal="true"
      aria-label={`${title} screenshot ${index + 1} of ${images.length}`}
      onClick={onClose}
      onWheel={(e) => applyZoom(zoom - e.deltaY * 0.0025 * zoom)}
    >
      <button
        type="button"
        ref={closeRef}
        className="proj-modal-close"
        onClick={onClose}
        aria-label="Close viewer"
      >
        <FiX />
      </button>

      {multiple && (
        <>
          <button
            type="button"
            className="proj-modal-nav prev"
            aria-label="Previous screenshot"
            onClick={(e) => {
              e.stopPropagation();
              go(-1);
            }}
          >
            <FiChevronLeft />
          </button>
          <button
            type="button"
            className="proj-modal-nav next"
            aria-label="Next screenshot"
            onClick={(e) => {
              e.stopPropagation();
              go(1);
            }}
          >
            <FiChevronRight />
          </button>
        </>
      )}

      <div className="proj-modal-stage">
        <img
          key={images[index]}
          src={images[index]}
          alt={`${title} screenshot ${index + 1}`}
          className={`proj-modal-img ${zoom > MIN_ZOOM ? "zoomed" : ""} ${
            dragging ? "dragging" : ""
          }`}
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
          draggable={false}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={cancelDrag}
        />
      </div>

      <div className="proj-modal-bar" onClick={(e) => e.stopPropagation()}>
        {multiple && (
          <span className="proj-modal-counter">
            {index + 1} / {images.length}
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
        <span className="proj-modal-zoom">{Math.round(zoom * 100)}%</span>
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
      </div>
    </div>
  );
};

const Projects = () => {
  const [selectedId, setSelectedId] = useState<string>(projects[0].id);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const selected = projects.find((p) => p.id === selectedId) ?? projects[0];

  // Group projects by category, preserving the intended category order.
  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: projects.filter((p) => p.category === cat),
  })).filter((g) => g.items.length > 0);

  const images = selected.images ?? [];
  const closeViewer = useCallback(() => setViewerIndex(null), []);

  return (
    <div className="projects">
      {/* Selector */}
      <nav className="proj-selector scroll-thin" aria-label="Project list">
        {grouped.map(({ category, items }) => (
          <div key={category} className="proj-group">
            <p className="proj-group-title">{category}</p>
            {items.map((project) => (
              <button
                key={project.id}
                type="button"
                className={`proj-tab ${selected.id === project.id ? "active" : ""}`}
                aria-pressed={selected.id === project.id}
                onClick={() => setSelectedId(project.id)}
              >
                <span className="proj-tab-name">{project.title}</span>
                {project.status === "live" && (
                  <span className="proj-live" aria-label="Live">
                    <span className="proj-live-dot" />
                    Live
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Detail */}
      <article className="proj-detail" key={selected.id}>
        <div className="proj-detail-main">
          <div className="proj-detail-head">
            <div className="proj-detail-heading">
              {selected.category !== "Featured" && (
                <p className="eyebrow">{selected.category}</p>
              )}
              <h3 className="proj-title">{selected.title}</h3>
            </div>
            {selected.links && selected.links.length > 0 && (
              <div className="proj-links">
                {selected.links.map((link) => {
                  const Icon = LINK_ICON[link.kind];
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`proj-link ${link.kind === "live" ? "proj-link--primary" : ""}`}
                    >
                      <Icon aria-hidden="true" />
                      {link.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <p className="proj-meta">
            <span>{selected.timeframe}</span>
            {selected.role && (
              <>
                <span className="proj-meta-sep" aria-hidden="true">·</span>
                <span>{selected.role}</span>
              </>
            )}
            {selected.status && selected.status !== "live" && (
              <>
                <span className="proj-meta-sep" aria-hidden="true">·</span>
                <span className={`proj-meta-status proj-meta-status--${selected.status}`}>
                  {STATUS_LABEL[selected.status]}
                </span>
              </>
            )}
          </p>

          <p className="proj-tagline">{selected.tagline}</p>

          <ul className="proj-highlights">
            {selected.highlights.map((point, i) => (
              <li key={i}>{point}</li>
            ))}
          </ul>

          {selected.note && <p className="proj-note">{selected.note}</p>}
        </div>

        <ProjectAside
          title={selected.title}
          images={images}
          tech={selected.tech}
          onOpen={setViewerIndex}
        />
      </article>

      {/* Full-screen viewer */}
      {viewerIndex !== null && images[viewerIndex] && (
        <ImageViewer
          title={selected.title}
          images={images}
          index={viewerIndex}
          onIndex={setViewerIndex}
          onClose={closeViewer}
        />
      )}
    </div>
  );
};

export default Projects;
