"use client";

import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  Braces,
  Code2,
  Database,
  Github,
  Linkedin,
  Mail,
  Server,
  Sparkles,
  Terminal,
  Wrench
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CodolioPayload, GitHubPayload, GitHubRepo } from "@/lib/types";

const sections = [
  { id: "intro", label: "INTRO" },
  { id: "stats", label: "KEY DATA" },
  { id: "projects", label: "PROJECTS" },
  { id: "skills", label: "SKILLS" },
  { id: "contact", label: "CONTACT" }
];

const skillGroups = [
  {
    title: "Frontend",
    icon: Code2,
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Responsive UI"]
  },
  {
    title: "Backend",
    icon: Server,
    skills: ["Node.js", "Express", "REST APIs", "Authentication", "Server Components", "API Design"]
  },
  {
    title: "AI/ML",
    icon: Sparkles,
    skills: ["LLM APIs", "Prompt Systems", "Python", "Automation", "Data Pipelines", "Applied AI"]
  },
  {
    title: "Databases",
    icon: Database,
    skills: ["MongoDB", "PostgreSQL", "Firebase", "Prisma", "SQL", "Data Modeling"]
  },
  {
    title: "Tools & DevOps",
    icon: Wrench,
    skills: ["Git", "GitHub", "Vercel", "Docker", "CI/CD", "Linux"]
  }
];

const bootLines = [
  "BOOTING DESERT INTERFACE",
  "CALIBRATING GOLDEN HALO",
  "SYNCING GITHUB TELEMETRY",
  "MAPPING ACTIVE BUILDS",
  "ALIGNING CHAOS VECTOR",
  "SYSTEMS ONLINE"
];

const fallbackGithub: GitHubPayload = {
  user: {
    login: "uppal-harsh",
    name: "Harsh Uppal",
    avatarUrl: "",
    bio: "Full-stack developer engineering cinematic interfaces and resilient systems.",
    location: null,
    blog: null,
    htmlUrl: "https://github.com/uppal-harsh",
    publicRepos: 0,
    followers: 0,
    following: 0,
    createdAt: new Date().toISOString()
  },
  repos: [],
  topRepos: [],
  activeRepos: [],
  totals: {
    stars: 0,
    forks: 0,
    repos: 0,
    followers: 0,
    following: 0
  },
  languages: [],
  activity: [],
  generatedAt: new Date().toISOString()
};

function formatDate(value?: string | null) {
  if (!value) return "Unknown";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function shortNumber(value: number) {
  return new Intl.NumberFormat("en", { notation: value > 999 ? "compact" : "standard" }).format(value);
}

function formatPercent(value: number) {
  if (value > 0 && value < 1) return "<1%";
  return `${Number.isInteger(value) ? value : value.toFixed(1)}%`;
}

function usePortfolioData() {
  const [github, setGithub] = useState<GitHubPayload | null>(null);
  const [codolio, setCodolio] = useState<CodolioPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      setLoading(true);
      try {
        const [githubResponse, codolioResponse] = await Promise.allSettled([
          fetch("/api/github").then(async (response) => {
            const payload = await response.json();
            if (!response.ok) throw new Error(payload.error ?? "GitHub data unavailable.");
            return payload as GitHubPayload;
          }),
          fetch("/api/codolio").then((response) => response.json() as Promise<CodolioPayload>)
        ]);

        if (!alive) return;

        if (githubResponse.status === "fulfilled") {
          setGithub(githubResponse.value);
          setError(null);
        } else {
          setGithub(fallbackGithub);
          setError(githubResponse.reason instanceof Error ? githubResponse.reason.message : "GitHub data unavailable.");
        }

        if (codolioResponse.status === "fulfilled") {
          setCodolio(codolioResponse.value);
        }
      } finally {
        if (alive) setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  return { github, codolio, loading, error };
}

function useActiveSection() {
  const [active, setActive] = useState("intro");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.16, 0.35, 0.6] }
    );

    sections.forEach((section) => {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, []);

  return active;
}

function BootScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    const startedAt = performance.now();
    const duration = 2650;
    let frameId = 0;

    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const nextProgress = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(nextProgress);
      setLineIndex(Math.min(bootLines.length - 1, Math.floor((nextProgress / 100) * bootLines.length)));

      if (nextProgress < 100) {
        frameId = requestAnimationFrame(tick);
      } else {
        window.setTimeout(onComplete, 520);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [onComplete]);

  return (
    <motion.div
      className="boot-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(14px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      role="status"
      aria-live="polite"
      aria-label="Portfolio systems loading"
    >
      <div className="boot-grid" aria-hidden="true" />
      <div className="boot-halo" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className="boot-panel">
        <div className="boot-kicker">[ SYSTEM WAKE SEQUENCE ]</div>
        <h1>
          SYSTEMS
          <br />
          LOADING
        </h1>
        <div className="boot-status">
          <span>{bootLines[lineIndex]}</span>
          <strong>{progress.toString().padStart(3, "0")}%</strong>
        </div>
        <div className="boot-progress">
          <motion.i animate={{ width: `${progress}%` }} transition={{ duration: 0.18 }} />
        </div>
        <div className="boot-log">
          {bootLines.map((line, index) => (
            <span key={line} className={index <= lineIndex ? "active" : ""}>
              {">"} {line}
            </span>
          ))}
        </div>
      </div>
      <div className="boot-footer">RHYTHM IN CHAOS / ORDER IN FLUX</div>
    </motion.div>
  );
}

function NoiseCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const paint = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const density = Math.min(width * height * 0.00008, 9000);
      canvas.width = width;
      canvas.height = height;
      context.clearRect(0, 0, width, height);

      for (let index = 0; index < density; index += 1) {
        const alpha = Math.random() * 0.16;
        context.fillStyle = `rgba(255,255,255,${alpha})`;
        context.fillRect(Math.random() * width, Math.random() * height, 1, 1);
      }
    };

    paint();
    window.addEventListener("resize", paint);
    const id = window.setInterval(paint, 2200);

    return () => {
      window.removeEventListener("resize", paint);
      window.clearInterval(id);
    };
  }, []);

  return <canvas ref={canvasRef} className="noise-canvas" aria-hidden="true" />;
}

function SideNav({ active }: { active: string }) {
  return (
    <nav className="side-nav" aria-label="Portfolio sections">
      <div className="side-rail" />
      {sections.map((section) => (
        <a key={section.id} href={`#${section.id}`} className={active === section.id ? "active" : ""}>
          <span>{section.label}</span>
        </a>
      ))}
    </nav>
  );
}

function SectionShell({
  id,
  kicker,
  title,
  children
}: {
  id: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="section-shell">
      <motion.div
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12%" }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="section-heading">
          <span>{kicker}</span>
          <h2>{title}</h2>
        </div>
        {children}
      </motion.div>
    </section>
  );
}

function SkeletonCard({ className = "" }: { className?: string }) {
  return <div className={`skeleton-card ${className}`} />;
}

function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 42;
    const start = performance.now();

    const step = () => {
      frame += 1;
      const progress = Math.min(1, (performance.now() - start) / 1100);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.round(value * eased));
      if (frame < totalFrames && progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [value]);

  return <>{shortNumber(display)}</>;
}

function CyberFigure() {
  const circuitLines = Array.from({ length: 18 }, (_, index) => index);

  return (
    <div className="figure-wrap" aria-hidden="true">
      <div className="halo-shell">
        <span />
        <span />
        <span />
      </div>
      <motion.div
        className="figure"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="head">
          {circuitLines.map((line) => {
            const lineStyle = {
              "--line-top": `${8 + line * 4.6}%`,
              "--line-left": `${12 + (line % 7) * 8}%`,
              "--line-width": `${58 - (line % 5) * 5}%`,
              "--line-rotate": `${-16 + line * 2}deg`
            } as React.CSSProperties;

            return <span key={line} style={lineStyle} />;
          })}
        </div>
        <div className="torso">
          {Array.from({ length: 24 }, (_, index) => {
            const dotStyle = {
              "--dot-left": `${8 + (index % 8) * 11}%`,
              "--dot-top": `${14 + Math.floor(index / 8) * 15}%`
            } as React.CSSProperties;

            return <i key={index} style={dotStyle} />;
          })}
        </div>
      </motion.div>
    </div>
  );
}

function Hero({ github, loading }: { github: GitHubPayload | null; loading: boolean }) {
  const { scrollYProgress } = useScroll();
  const dunesY = useTransform(scrollYProgress, [0, 0.25], [0, 80]);
  const figureY = useTransform(scrollYProgress, [0, 0.25], [0, -40]);

  return (
    <section id="intro" className="hero">
      <motion.div style={{ y: dunesY }} className="dune-field" aria-hidden="true">
        <div className="dune dune-a" />
        <div className="dune dune-b" />
        <div className="dune dune-c" />
      </motion.div>
      <div className="hero-grid" aria-hidden="true" />
      <motion.div style={{ y: figureY }} className="hero-figure-layer">
        <CyberFigure />
      </motion.div>
      <div className="hero-copy">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.15 }}
          className="hero-label"
        >
          <span>[ SERVICES ]</span>
          <p>THE ENGINE OF INNOVATION, EXECUTION AND CRAFT.</p>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          RHYTHM IN CHAOS.
          <br />
          ORDER IN FLUX.
        </motion.h1>
        <motion.div
          className="hero-subtitle"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.55 }}
        >
          LIQUID VISION.
          <br />
          SOLID ARCHITECTURE.
        </motion.div>
      </div>
      <div className="hero-terminal">
        <Terminal size={16} />
        <span>{loading ? "SYNCING LIVE SIGNALS" : `${github?.user.name ?? "HARSH UPPAL"} / FULL-STACK DEVELOPER`}</span>
      </div>
    </section>
  );
}

function StatsSection({
  github,
  codolio,
  loading,
  error
}: {
  github: GitHubPayload | null;
  codolio: CodolioPayload | null;
  loading: boolean;
  error: string | null;
}) {
  const data = github ?? fallbackGithub;
  const statCards = [
    { label: "PUBLIC REPOS", value: data.totals.repos },
    { label: "TOTAL STARS", value: data.totals.stars },
    { label: "TOTAL FORKS", value: data.totals.forks },
    { label: "FOLLOWERS", value: data.totals.followers },
    { label: "FOLLOWING", value: data.totals.following },
    { label: "C-SCORE", value: codolio?.stats.cScore ?? 0, suffix: codolio?.stats.cScore ? "" : "LINK" }
  ];

  return (
    <SectionShell id="stats" kicker="[ GITHUB STATS ]" title="Live Signal Dashboard">
      {error ? <div className="error-strip">{error}</div> : null}
      <div className="stats-grid">
        {loading
          ? Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} />)
          : statCards.map((card) => (
              <motion.article key={card.label} className="stat-card" whileHover={{ y: -6, borderColor: "rgba(245,200,66,0.72)" }}>
                <span>{card.label}</span>
                <strong>{card.suffix ?? <AnimatedCounter value={card.value} />}</strong>
              </motion.article>
            ))}
      </div>

      <div className="data-panels">
        <div className="glass-panel">
          <div className="panel-title">
            <Braces size={17} />
            <span>LANGUAGE DISTRIBUTION</span>
          </div>
          <div className="language-list">
            {loading
              ? Array.from({ length: 5 }, (_, index) => <SkeletonCard key={index} className="thin" />)
              : data.languages.map((language) => (
                  <div key={language.name} className="language-row">
                    <div>
                      <span>{language.name}</span>
                      <em>{formatPercent(language.percent)}</em>
                    </div>
                    <div className="language-bar">
                      <motion.i
                        initial={{ width: 0 }}
                        whileInView={{ width: `${Math.max(language.percent, 0.8)}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.9 }}
                        style={{ backgroundColor: language.color }}
                      />
                    </div>
                  </div>
                ))}
          </div>
        </div>
        <div className="glass-panel">
          <div className="panel-title">
            <Terminal size={17} />
            <span>RECENT ACTIVITY</span>
          </div>
          <div className="activity-list">
            {loading
              ? Array.from({ length: 5 }, (_, index) => <SkeletonCard key={index} className="activity" />)
              : data.activity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="activity-row">
                    <span>{activity.label}</span>
                    <strong>{activity.repo.replace("uppal-harsh/", "")}</strong>
                    <em>{formatDate(activity.date)}</em>
                  </div>
                ))}
          </div>
        </div>
      </div>
      <ContributionField seed={data.totals.stars + data.totals.repos + data.totals.forks} loading={loading} />
    </SectionShell>
  );
}

function ContributionField({ seed, loading }: { seed: number; loading: boolean }) {
  const cells = useMemo(() => {
    return Array.from({ length: 98 }, (_, index) => {
      const value = (Math.sin(index * 12.9898 + seed) * 43758.5453) % 1;
      return Math.abs(value);
    });
  }, [seed]);

  return (
    <div className="contribution-panel" aria-label="Generated contribution visualization">
      <span>[ CONTRIBUTION FIELD ]</span>
      <div className="contribution-grid">
        {cells.map((cell, index) => (
          <motion.i
            key={index}
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.006 }}
            className={loading ? "loading" : ""}
            style={{ "--heat": loading ? 0.25 : cell } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ repo, index }: { repo: GitHubRepo; index: number }) {
  return (
    <motion.article
      className="project-card"
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      whileHover={{ y: -8 }}
    >
      <div className="project-topline">
        <span>{repo.language ?? "System"}</span>
        <em>{formatDate(repo.updatedAt)}</em>
      </div>
      <h3>{repo.name.replace(/[-_]/g, " ")}</h3>
      <p>{repo.description ?? "An active repository from the engineering archive, synced directly from GitHub."}</p>
      <div className="project-meta">
        <span>{repo.stars} stars</span>
        <span>{repo.forks} forks</span>
        <span>{repo.openIssues} issues</span>
      </div>
      <div className="project-actions">
        <a href={repo.htmlUrl} target="_blank" rel="noreferrer">
          GitHub <ArrowUpRight size={15} />
        </a>
        {repo.homepage ? (
          <a href={repo.homepage} target="_blank" rel="noreferrer">
            Live <ArrowUpRight size={15} />
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}

function ProjectsSection({ github, loading }: { github: GitHubPayload | null; loading: boolean }) {
  const repos = github?.activeRepos ?? [];

  return (
    <SectionShell id="projects" kicker="[ ACTIVE PROJECTS ]" title="Concurrent Builds">
      <div className="project-grid">
        {loading
          ? Array.from({ length: 6 }, (_, index) => <SkeletonCard key={index} className="project-skeleton" />)
          : repos.map((repo, index) => <ProjectCard key={repo.id} repo={repo} index={index} />)}
      </div>
    </SectionShell>
  );
}

function SkillsSection() {
  return (
    <SectionShell id="skills" kicker="[ SKILLS STACK ]" title="Tools For Controlled Chaos">
      <div className="skills-grid">
        {skillGroups.map((group, groupIndex) => {
          const Icon = group.icon;
          return (
            <motion.article
              key={group.title}
              className="skill-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: groupIndex * 0.08 }}
            >
              <div className="skill-title">
                <Icon size={18} />
                <span>{group.title}</span>
              </div>
              <div className="skill-pills">
                {group.skills.map((skill, index) => (
                  <motion.span key={skill} whileHover={{ y: -3, scale: 1.03 }} transition={{ type: "spring", stiffness: 260 }}>
                    {skill}
                    <i style={{ animationDelay: `${index * 0.2}s` }} />
                  </motion.span>
                ))}
              </div>
            </motion.article>
          );
        })}
      </div>
    </SectionShell>
  );
}

function ContactSection({ codolio }: { codolio: CodolioPayload | null }) {
  return (
    <SectionShell id="contact" kicker="[ CONTACT ]" title="Transmit The Brief">
      <div className="contact-panel">
        <div>
          <span className="contact-label">FULL-STACK DEVELOPER / HARSH UPPAL</span>
          <h2>Available for internships, freelance builds, and ambitious product systems.</h2>
          <p>
            Engineering interfaces that feel cinematic, systems that remain legible, and products that keep moving after the first launch.
          </p>
        </div>
        <div className="contact-links">
          <a href="https://github.com/uppal-harsh" target="_blank" rel="noreferrer">
            <Github size={18} />
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/harsh-uppal" target="_blank" rel="noreferrer">
            <Linkedin size={18} />
            LinkedIn
          </a>
          <a href="mailto:harshuppal.dev@gmail.com">
            <Mail size={18} />
            Email
          </a>
          <a href={codolio?.profileUrl ?? "https://codolio.com/profile/uppal-harsh"} target="_blank" rel="noreferrer">
            <ArrowUpRight size={18} />
            Codolio
          </a>
          <a href="/resume.pdf" target="_blank" rel="noreferrer" className="resume-link">
            Resume
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </SectionShell>
  );
}

export default function PortfolioExperience() {
  const { github, codolio, loading, error } = usePortfolioData();
  const active = useActiveSection();
  const [booting, setBooting] = useState(true);
  const cursorX = useMotionValue(50);
  const cursorY = useMotionValue(35);
  const smoothX = useSpring(cursorX, { stiffness: 80, damping: 24 });
  const smoothY = useSpring(cursorY, { stiffness: 80, damping: 24 });

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      cursorX.set((event.clientX / window.innerWidth) * 100);
      cursorY.set((event.clientY / window.innerHeight) * 100);
    };

    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, [cursorX, cursorY]);

  return (
    <motion.main
      className="portfolio-shell"
      style={
        {
          "--cursor-x": smoothX,
          "--cursor-y": smoothY
        } as React.CSSProperties
      }
    >
      <AnimatePresence>{booting ? <BootScreen onComplete={() => setBooting(false)} /> : null}</AnimatePresence>
      <NoiseCanvas />
      <SideNav active={active} />
      <div className="right-label">PORTFOLIO</div>
      <Hero github={github} loading={loading} />
      <StatsSection github={github} codolio={codolio} loading={loading} error={error} />
      <ProjectsSection github={github} loading={loading} />
      <SkillsSection />
      <ContactSection codolio={codolio} />
    </motion.main>
  );
}
