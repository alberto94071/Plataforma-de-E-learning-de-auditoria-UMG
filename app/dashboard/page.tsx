"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MODULES,
  MAX_TOTAL_SCORE,
  DIPLOMA_THRESHOLD,
} from "@/lib/content";

interface Completion { slug: string; score: number; }

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [hasDiploma, setHasDiploma] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
    if (status === "authenticated") {
      fetch("/api/quiz/submit")
        .then((r) => r.json())
        .then((d) => {
          setCompletions(d.completions || []);
          setTotalScore(d.totalScore || 0);
          setHasDiploma(d.hasDiploma || false);
          setLoading(false);
        });
    }
  }, [status, router]);

  if (status === "loading" || loading) return <LoadingScreen />;

  // Solo cuentan como completados los que tienen 20 o más puntos
  const passingCompletions = completions.filter((c) => c.score >= 20);
  const completedSlugs = passingCompletions.map((c) => c.slug);
  
  const pct = Math.round((totalScore / MAX_TOTAL_SCORE) * 100);
  const diplomaPct = Math.round((totalScore / DIPLOMA_THRESHOLD) * 100);

  return (
    <div className="dash-root">
      <div className="bg-grid" />

      {/* NAV */}
      <nav className="dash-nav">
        <div className="nav-brand">
          <img 
            src="/logo-umg.png" 
            alt="UMG Logo" 
            className="nav-logo-img"
          />
          <div>
            <div className="nav-title">AuditPro</div>
            <div className="nav-sub">Universidad Mariano Gálvez</div>
          </div>
        </div>
        <div className="nav-right">
          <span className="nav-user">👤 {session?.user?.name}</span>
          {(session?.user as { role?: string })?.role === "admin" && (
            <Link href="/admin" className="nav-link admin-link">Panel Admin</Link>
          )}
          <button className="nav-logout" onClick={() => signOut({ callbackUrl: "/" })}>
            Salir
          </button>
        </div>
      </nav>

      <main className="dash-main">
        {/* HERO STATS */}
        <section className="hero-section">
          <div className="hero-left">
            <h1 className="dash-greeting">
              ¡Hola, <span className="gold-text">{session?.user?.name?.split(" ")[0]}</span>!
            </h1>
            <p className="dash-sub">Continúa tu progreso en auditoría financiera</p>
          </div>

          <div className="score-cards">
            <div className="score-card">
              <div className="score-label">Puntaje Total</div>
              <div className="score-value gold">{totalScore}<span className="score-max">/{MAX_TOTAL_SCORE}</span></div>
              <div className="score-bar-track">
                <div className="score-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="score-card">
              <div className="score-label">Módulos Completados</div>
              <div className="score-value">{completedSlugs.length}<span className="score-max">/{MODULES.length}</span></div>
              <div className="score-bar-track">
                <div className="score-bar-fill green" style={{ width: `${(completedSlugs.length / MODULES.length) * 100}%` }} />
              </div>
            </div>

            <div className={`score-card diploma-card ${hasDiploma ? "diploma-ready" : ""}`}>
              <div className="score-label">Diploma</div>
              {hasDiploma ? (
                <Link href="/certificate" className="diploma-btn">
                  🏆 Ver mi Diploma
                </Link>
              ) : (
                <>
                  <div className="score-value">{Math.min(diplomaPct, 100)}<span className="score-max">%</span></div>
                  <div className="score-bar-track">
                    <div className="score-bar-fill gold" style={{ width: `${Math.min(diplomaPct, 100)}%` }} />
                  </div>
                  <div className="diploma-note">Necesitas {DIPLOMA_THRESHOLD} pts</div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* MODULE GRID */}
        <section className="modules-section">
          <div className="section-header">
            <h2 className="section-title">Módulos del Curso</h2>
            <p className="section-sub">Completa la teoría y aprueba la evaluación de cada módulo</p>
          </div>

          <div className="roadmap-container">
            <div className="roadmap-line" />
            <div className="modules-grid roadmap-grid">
              {MODULES.map((mod, i) => {
                const comp = completions.find((c) => c.slug === mod.slug);
                const score = comp ? comp.score : null;
                
                const isPassed = score !== null && score >= 20;
                const isPerfect = score === 30;
                const isFailed = score !== null && score < 20;
                
                let statusClass = "";
                if (isPerfect) statusClass = "status-green";
                else if (isPassed) statusClass = "status-yellow";
                else if (isFailed) statusClass = "status-red";

                return (
                  <div
                    key={mod.slug}
                    className={`module-card roadmap-card ${statusClass} ${i % 2 === 0 ? "left" : "right"}`}
                    style={{ "--accent": mod.color, animationDelay: `${i * 60}ms` } as React.CSSProperties}
                  >
                    <div className="roadmap-dot" />
                    {isPassed && <div className="done-badge">{isPerfect ? "🏆 Perfecto" : "✓ Aprobado"}</div>}
                    {isFailed && <div className="fail-badge">⚠ Repasar</div>}
                    
                    <div className="mod-icon">{mod.icon}</div>
                    <div className="mod-number">Módulo {i + 1}</div>
                    <h3 className="mod-title">{mod.title}</h3>
                    <p className="mod-desc">{mod.description}</p>

                    {score !== null && (
                      <div className="mod-score">
                        <span className={`score-pill ${statusClass}`}>{score}/30 pts</span>
                      </div>
                    )}

                    <Link
                      href={`/module/${mod.slug}`}
                      className={`mod-btn ${statusClass}`}
                    >
                      {isPassed ? "Repasar →" : "Comenzar →"}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root {
          min-height: 100vh;
          background: #05080f;
          font-family: 'DM Sans', sans-serif;
          color: #e8e8e0;
          position: relative;
        }

        .bg-grid {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(245,158,11,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,158,11,0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none; z-index: 0;
        }

        /* NAV */
        .dash-nav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px;
          height: 72px;
          background: rgba(5,8,15,0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(245,158,11,0.12);
        }

        .nav-brand { display: flex; align-items: center; gap: 14px; }
        .nav-logo-img { width: 40px; height: 40px; object-fit: contain; filter: drop-shadow(0 0 8px rgba(245,158,11,0.2)); }
        .nav-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #f0ede6; }
        .nav-sub { font-size: 11px; color: #555; letter-spacing: 0.5px; }

        .nav-right { display: flex; align-items: center; gap: 20px; }
        .nav-user { font-size: 13px; color: #888; }
        .nav-link { font-size: 13px; color: #f59e0b; text-decoration: none; font-weight: 600; }
        .admin-link { background: rgba(245,158,11,0.1); padding: 6px 14px; border-radius: 8px; border: 1px solid rgba(245,158,11,0.25); }

        .nav-logout {
          background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
          color: #f87171; font-family: 'DM Sans', sans-serif; font-size: 13px;
          padding: 6px 14px; border-radius: 8px; cursor: pointer; transition: all 0.2s;
        }
        .nav-logout:hover { background: rgba(239,68,68,0.2); }

        /* MAIN */
        .dash-main { position: relative; z-index: 1; max-width: 1200px; margin: 0 auto; padding: 48px 40px 80px; }

        /* HERO */
        .hero-section { display: flex; align-items: flex-start; gap: 40px; margin-bottom: 64px; flex-wrap: wrap; }
        .hero-left { flex: 0 0 auto; }

        .dash-greeting { font-family: 'Playfair Display', serif; font-size: 40px; font-weight: 900; line-height: 1.1; margin-bottom: 8px; }
        .gold-text { color: #f59e0b; }
        .dash-sub { font-size: 15px; color: #666; }

        .score-cards { display: flex; gap: 20px; flex: 1; flex-wrap: wrap; }

        .score-card {
          flex: 1; min-width: 160px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 20px 24px;
          position: relative;
          overflow: hidden;
        }

        .score-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #555; font-weight: 600; margin-bottom: 8px; }
        .score-value { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 700; color: #f0ede6; line-height: 1; margin-bottom: 12px; }
        .score-value.gold { color: #f59e0b; }
        .score-max { font-size: 16px; color: #444; font-family: 'DM Sans', sans-serif; font-weight: 400; }

        .score-bar-track { height: 3px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
        .score-bar-fill { height: 100%; background: #f59e0b; border-radius: 2px; transition: width 1s ease; }
        .score-bar-fill.green { background: #10b981; }
        .score-bar-fill.gold { background: #f59e0b; }

        .diploma-card.diploma-ready {
          border-color: rgba(245,158,11,0.4);
          background: rgba(245,158,11,0.06);
        }

        .diploma-btn {
          display: block;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #000;
          font-weight: 700;
          font-size: 14px;
          text-decoration: none;
          padding: 10px 16px;
          border-radius: 10px;
          text-align: center;
          margin-top: 8px;
          transition: all 0.2s;
        }
        .diploma-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(245,158,11,0.3); }

        .diploma-note { font-size: 11px; color: #444; margin-top: 8px; }

        /* MODULES */
        .modules-section {}
        .section-header { margin-bottom: 32px; }
        .section-title { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; margin-bottom: 6px; }
        .section-sub { font-size: 14px; color: #555; }

        .modules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .module-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 20px;
          padding: 28px;
          position: relative;
          transition: all 0.3s ease;
          animation: fadeUp 0.5s ease both;
          overflow: hidden;
        }

        .module-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--accent, #f59e0b);
          transform: scaleX(0);
          transition: transform 0.3s ease;
          transform-origin: left;
        }

        .module-card:hover { border-color: rgba(255,255,255,0.15); transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
        .module-card:hover::before { transform: scaleX(1); }

        /* STATUS COLORS */
        .module-card.status-red { border-color: rgba(239,68,68,0.4); background: rgba(239,68,68,0.03); }
        .module-card.status-red::before { transform: scaleX(1); background: #ef4444; }
        
        .module-card.status-yellow { border-color: rgba(245,158,11,0.4); background: rgba(245,158,11,0.03); }
        .module-card.status-yellow::before { transform: scaleX(1); background: #f59e0b; }

        .module-card.status-green { border-color: rgba(16,185,129,0.4); background: rgba(16,185,129,0.03); }
        .module-card.status-green::before { transform: scaleX(1); background: #10b981; }

        .done-badge {
          position: absolute; top: 16px; right: 16px;
          background: rgba(16,185,129,0.15); color: #10b981;
          font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px;
          border: 1px solid rgba(16,185,129,0.3);
        }
        .status-yellow .done-badge { background: rgba(245,158,11,0.15); color: #f59e0b; border-color: rgba(245,158,11,0.3); }

        .fail-badge {
          position: absolute; top: 16px; right: 16px;
          background: rgba(239,68,68,0.15); color: #f87171;
          font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px;
          border: 1px solid rgba(239,68,68,0.3);
        }

        .mod-icon { font-size: 36px; margin-bottom: 12px; }
        .mod-number { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #555; font-weight: 600; margin-bottom: 6px; }
        .mod-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; margin-bottom: 10px; color: #f0ede6; line-height: 1.2; }
        .mod-desc { font-size: 13px; color: #666; line-height: 1.6; margin-bottom: 20px; }

        .mod-score { margin-bottom: 16px; }
        .score-pill {
          background: rgba(255,255,255,0.05); color: #888;
          font-size: 12px; font-weight: 700;
          padding: 4px 12px; border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.1);
        }
        .score-pill.status-red { background: rgba(239,68,68,0.1); color: #f87171; border-color: rgba(239,68,68,0.3); }
        .score-pill.status-yellow { background: rgba(245,158,11,0.1); color: #f59e0b; border-color: rgba(245,158,11,0.3); }
        .score-pill.status-green { background: rgba(16,185,129,0.1); color: #10b981; border-color: rgba(16,185,129,0.3); }

        .mod-btn {
          display: block;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #888;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; font-weight: 700;
          padding: 12px 20px; border-radius: 10px;
          text-decoration: none; text-align: center;
          transition: all 0.2s;
        }

        .mod-btn:hover { background: rgba(255,255,255,0.1); transform: translateX(3px); }
        .mod-btn.status-red { background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.3); color: #f87171; }
        .mod-btn.status-yellow { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.3); color: #f59e0b; }
        .mod-btn.status-green { background: rgba(16,185,129,0.1); border-color: rgba(16,185,129,0.3); color: #10b981; }

        /* ROADMAP STYLES */
        .roadmap-container { position: relative; padding: 40px 0; }
        .roadmap-line {
          position: absolute; left: 50%; top: 0; bottom: 0;
          width: 2px; background: rgba(245,158,11,0.1);
          border-left: 2px dashed rgba(245,158,11,0.2);
          transform: translateX(-50%); z-index: 0;
        }
        .roadmap-grid { display: flex; flex-direction: column; gap: 60px; align-items: center; max-width: 800px; margin: 0 auto; }
        .roadmap-card { width: 100%; max-width: 400px; position: relative; z-index: 1; }
        .roadmap-card.left { align-self: flex-start; margin-right: 50%; }
        .roadmap-card.right { align-self: flex-end; margin-left: 50%; }

        .roadmap-dot {
          position: absolute; top: 50%; width: 16px; height: 16px;
          background: #05080f; border: 3px solid rgba(245,158,11,0.5);
          border-radius: 50%; z-index: 2; transform: translateY(-50%);
        }
        .roadmap-card.left .roadmap-dot { right: -58px; }
        .roadmap-card.right .roadmap-dot { left: -58px; }
        
        .status-green .roadmap-dot { border-color: #10b981; background: #10b981; box-shadow: 0 0 10px #10b981; }
        .status-yellow .roadmap-dot { border-color: #f59e0b; background: #f59e0b; }
        .status-red .roadmap-dot { border-color: #ef4444; }

        @media (max-width: 900px) {
          .roadmap-line { left: 20px; }
          .roadmap-grid { align-items: flex-start; padding-left: 60px; }
          .roadmap-card.left, .roadmap-card.right { margin: 0; max-width: 100%; }
          .roadmap-card .roadmap-dot { left: -52px !important; right: auto !important; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .dash-nav { padding: 0 20px; }
          .dash-main { padding: 32px 20px 60px; }
          .hero-section { flex-direction: column; gap: 28px; }
          .score-cards { flex-direction: column; }
          .modules-grid { grid-template-columns: 1fr; }
          .dash-greeting { font-size: 30px; }
        }
      `}</style>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={{ minHeight: "100vh", background: "#05080f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>⚖️</div>
        <div style={{ color: "#555", fontFamily: "DM Sans, sans-serif", fontSize: "14px" }}>Cargando...</div>
      </div>
    </div>
  );
}
