import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Zap,
  BarChart3,
  Users,
  CalendarClock,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Network,
  FolderArchive,
  FileText,
  Sparkles,
  Lock,
} from "lucide-react";
import "./Landing.css";

const SHOWCASE = [
  {
    id: "network",
    icon: <Network size={20} />,
    color: "purple",
    tab: "Case Network",
    title: "Interactive Entity & Relationship Graph",
    desc: "Visualize multi-jurisdictional criminal conspiracies, cartel financial flows, and person-of-interest clusters in real time with interactive graph physics, pan, zoom, and algorithmic pathfinding.",
    bullets: [
      "Breadth-First Search (BFS) & Depth-First Search (DFS) traversals",
      "Shortest path calculation and degrees of separation",
      "Color-coded entity classifications (Suspects, Shell Corps, Vehicles, Accounts)",
    ],
    image: `${import.meta.env.BASE_URL}previews/preview_dashboard.png`,
  },
  {
    id: "cases",
    icon: <FolderArchive size={20} />,
    color: "blue",
    tab: "Case Files",
    title: "Multi-Jurisdictional Case Dossiers",
    desc: "Maintain comprehensive investigation dossiers powered by high-performance algorithmic data structures. Merge Sort (O(n log n)) ensures instant sorting across thousands of cases.",
    bullets: [
      "Singly Linked List memory model with pointer manipulation",
      "Automatic cross-case suspect and entity matching",
      "History Stack for full Undo (Ctrl+Z) and Redo (Ctrl+Y) support",
    ],
    image: `${import.meta.env.BASE_URL}previews/preview_scheduling.png`,
  },
  {
    id: "timeline",
    icon: <CalendarClock size={20} />,
    color: "cyan",
    tab: "Timeline",
    title: "Forensic Chronological Timeline",
    desc: "Reconstruct suspect movements, intercepted communications, wire transfers, and sightings in exact chronological order with significance ranking and location coordinates.",
    bullets: [
      "Filter by event category (Incident, Transaction, Meeting, Surveillance)",
      "Flag critical milestones and evidentiary anomalies",
      "Cross-reference events against associated persons of interest",
    ],
    image: `${import.meta.env.BASE_URL}previews/preview_workforce.png`,
  },
  {
    id: "evidence",
    icon: <FileText size={20} />,
    color: "orange",
    tab: "Evidence Locker",
    title: "Chain of Custody & Courtroom Dossiers",
    desc: "Log physical artifacts, digital captures, forensic biology, and financial records with an unbreakable chain of custody and instant one-click PDF dossier export.",
    bullets: [
      "Tracking of logging officer, storage locker, and verification status",
      "Courtroom-admissible PDF generation with investigator attestation",
      "Automatic integrity verification and evidence linkage",
    ],
    image: `${import.meta.env.BASE_URL}previews/preview_reports.png`,
  },
];

const STATS = [
  { number: "100%", label: "Graph Traversal Accuracy" },
  { number: "O(n log n)", label: "Merge Sort Efficiency" },
  { number: "Level 3", label: "Security Clearance" },
  { number: "0ms", label: "Instant Graph Querying" },
];

export default function Landing() {
  const navRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Navbar scroll effect
  useEffect(() => {
    const onScroll = () => {
      if (navRef.current) {
        navRef.current.classList.toggle("scrolled", window.scrollY > 40);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Intersection Observer for scroll-triggered reveals
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const current = SHOWCASE[activeTab];

  return (
    <div className="landing-root">
      {/* Animated background */}
      <div className="landing-bg">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="grid-overlay" />

      {/* Content */}
      <div className="landing-content">
        {/* ── Navbar ── */}
        <nav ref={navRef} className="lp-nav">
          <div className="lp-nav-logo">
            <Shield size={24} className="text-violet-400" />
            <span>CaseChain</span>
          </div>
          <Link to="/login" className="lp-nav-cta">
            Investigator Portal
          </Link>
        </nav>

        {/* ── Hero ── */}
        <section className="lp-hero" id="hero">
          <div className="lp-hero-badge">
            <span className="pulse-dot" />
            Intelligence Platform v2.4 Active
          </div>

          <h1>
            Case Investigation &<br />
            <span className="gradient-text">Relationship Intelligence</span>
          </h1>

          <p className="lp-hero-sub">
            Empower your team to connect scattered clues, uncover hidden criminal syndicates,
            and map multi-jurisdictional networks with graph intelligence and forensic precision.
          </p>

          <div className="lp-hero-actions">
            <Link to="/login" className="lp-btn-primary">
              Access Investigation Portal
              <ArrowRight size={18} />
            </Link>
            <a href="#features" className="lp-btn-ghost">
              Explore Capabilities
              <ChevronDown size={18} />
            </a>
          </div>

          <div className="scroll-indicator">
            <div className="scroll-mouse" />
            <span>Scroll</span>
          </div>
        </section>

        {/* ── Stats ── */}
        <div className="stats-bar">
          {STATS.map((s, i) => (
            <div key={i} className={`stat-item reveal reveal-delay-${i + 1}`}>
              <div className="stat-number">{s.number}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Features Showcase ── */}
        <section className="lp-section" id="features">
          <h2 className="lp-section-title reveal">
            Advanced Intelligence{" "}
            <span className="gradient-text">Architecture</span>
          </h2>
          <p className="lp-section-sub reveal">
            From interactive network graphs to chronological timeline reconstruction, explore the tools
            built to break through complex, multi-layered criminal conspiracies.
          </p>

          {/* Tabs */}
          <div className="showcase-tabs reveal">
            {SHOWCASE.map((s, i) => (
              <button
                key={s.id}
                className={`showcase-tab ${activeTab === i ? "active" : ""} ${s.color}`}
                onClick={() => setActiveTab(i)}
              >
                {s.icon}
                <span>{s.tab}</span>
              </button>
            ))}
          </div>

          {/* Showcase panel */}
          <div className="showcase-panel reveal" key={current.id}>
            <div className="showcase-info">
              <h3 className="showcase-title">{current.title}</h3>
              <p className="showcase-desc">{current.desc}</p>
              <ul className="showcase-bullets">
                {current.bullets.map((b, i) => (
                  <li key={i}>
                    <CheckCircle2 size={16} className={`bullet-icon ${current.color}`} />
                    {b}
                  </li>
                ))}
              </ul>
              <Link to="/login" className="lp-btn-primary" style={{ marginTop: "1.5rem" }}>
                Launch Interactive Demo
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="showcase-image-wrap">
              <div className={`showcase-image-glow ${current.color}`} />
              <div className="p-8 rounded-2xl border border-white/10 bg-slate-950/80 flex flex-col justify-center items-center text-center min-h-[300px]">
                <div className="p-4 rounded-2xl bg-violet-600/20 border border-violet-500/30 text-violet-400 mb-4">
                  {current.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{current.title}</h4>
                <p className="text-xs text-muted-foreground max-w-sm mb-4">
                  Fully operational within CaseChain workspace. Includes live graph exploration, algorithmic search, and instant PDF dossiers.
                </p>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Enter Workspace
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="lp-cta-section">
          <h2 className="reveal">
            Accelerate Complex
            <br />
            Criminal <span className="gradient-text">Investigations</span>
          </h2>
          <p className="reveal reveal-delay-1">
            Empower intelligence analysts and investigative units with graph algorithms,
            pattern correlation, and verified chain of custody.
          </p>
          <div className="reveal reveal-delay-2">
            <Link to="/login" className="lp-btn-primary">
              Open CaseChain Terminal
              <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="lp-footer">
          <div className="lp-footer-logo flex items-center justify-center gap-2">
            <Shield size={18} className="text-violet-400" />
            <span>CaseChain</span>
          </div>
          <p>&copy; {new Date().getFullYear()} CaseChain. Case Investigation & Relationship Intelligence Platform.</p>
        </footer>
      </div>
    </div>
  );
}
