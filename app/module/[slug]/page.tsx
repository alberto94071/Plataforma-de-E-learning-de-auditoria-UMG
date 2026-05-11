"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import Link from "next/link";
import { getModuleBySlug, MODULES } from "@/lib/content";

export default function ModulePage() {
  const params = useParams();
  const { status } = useSession();
  const router = useRouter();
  const slug = params?.slug as string;
  const mod = getModuleBySlug(slug);
  const modIndex = MODULES.findIndex((m) => m.slug === slug);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  if (!mod) {
    return (
      <div style={{ minHeight: "100vh", background: "#05080f", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", fontFamily: "DM Sans, sans-serif" }}>
        Módulo no encontrado. <Link href="/dashboard" style={{ marginLeft: 8, color: "#f59e0b" }}>Volver</Link>
      </div>
    );
  }

  const lines = mod.content.split("\n");

  return (
    <div className="module-root">
      <div className="bg-grid" />

      {/* TOP BAR */}
      <div className="top-bar">
        <div className="nav-brand">
          <img src="/logo-umg.png" alt="UMG" className="nav-logo-mini" />
          <Link href="/dashboard" className="back-link">← Volver al Dashboard</Link>
        </div>
        <div className="progress-pill">Módulo {modIndex + 1} de {MODULES.length}</div>
      </div>

      <main className="module-main">
        {/* HEADER */}
        <div className="mod-header" style={{ "--accent": mod.color } as React.CSSProperties}>
          <div className="mod-header-icon">{mod.icon}</div>
          <div className="mod-header-meta">Módulo {modIndex + 1}</div>
          <h1 className="mod-header-title">{mod.title}</h1>
          <p className="mod-header-desc">{mod.description}</p>
        </div>

        {/* CONTENT */}
        <div className="content-card">
          <div className="content-body">
            {lines.map((line, i) => {
              if (line === "") return <div key={i} className="content-spacer" />;
              if (line.startsWith("━")) return <div key={i} className="content-divider" />;

              // Section headers (all caps, short)
              if (
                line.match(/^[A-ZÁÉÍÓÚÑ0-9 ():,–—\/·]+$/) &&
                line.length < 80 &&
                line.trim().length > 3 &&
                !line.startsWith("•")
              ) {
                const isH1 = !line.includes(":") && line.length < 40;
                return (
                  <div key={i} className={isH1 ? "content-h1" : "content-h2"}>
                    {line}
                  </div>
                );
              }

              // Bullet points
              if (line.startsWith("•")) {
                return (
                  <div key={i} className="content-bullet">
                    <span className="bullet-dot" style={{ color: mod.color }}>●</span>
                    <span>{line.slice(1).trim()}</span>
                  </div>
                );
              }

              return <p key={i} className="content-p">{line}</p>;
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="cta-section">
          <div className="cta-card">
            <div className="cta-icon">📝</div>
            <div>
              <div className="cta-title">¿Listo para la evaluación?</div>
              <div className="cta-sub">Responde correctamente al menos 2 de 3 preguntas para ganar puntos.</div>
            </div>
            <Link href={`/quiz/${mod.slug}`} className="cta-btn">
              Ir a la Evaluación →
            </Link>
          </div>
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .module-root {
          min-height: 100vh;
          background: #05080f;
          font-family: 'DM Sans', sans-serif;
          color: #e8e8e0;
        }

        .bg-grid {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(245,158,11,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,158,11,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none; z-index: 0;
        }

        .top-bar {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; height: 64px;
          background: rgba(5,8,15,0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .nav-brand { display: flex; align-items: center; gap: 12px; }
        .nav-logo-mini { width: 28px; height: 28px; object-fit: contain; }

        .back-link {
          color: #666; font-size: 14px; text-decoration: none; font-weight: 500;
          transition: color 0.2s;
        }
        .back-link:hover { color: #f59e0b; }

        .progress-pill {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          color: #666; font-size: 12px; padding: 4px 14px; border-radius: 20px;
          font-weight: 600; text-transform: uppercase; letter-spacing: 1px;
        }

        .module-main {
          max-width: 860px; margin: 0 auto;
          padding: 48px 40px 80px;
          position: relative; z-index: 1;
        }

        /* HEADER */
        .mod-header {
          text-align: center;
          padding: 48px 40px;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-top: 3px solid var(--accent, #f59e0b);
          border-radius: 24px;
          margin-bottom: 40px;
        }

        .mod-header-icon { font-size: 56px; margin-bottom: 16px; }
        .mod-header-meta {
          font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #555;
          font-weight: 600; margin-bottom: 12px;
        }
        .mod-header-title {
          font-family: 'Playfair Display', serif;
          font-size: 40px; font-weight: 900; color: #f0ede6;
          margin-bottom: 14px; line-height: 1.1;
        }
        .mod-header-desc { font-size: 16px; color: #666; max-width: 560px; margin: 0 auto; line-height: 1.6; }

        /* CONTENT */
        .content-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 24px;
          padding: 48px 52px;
          margin-bottom: 40px;
        }

        .content-h1 {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 700;
          color: #f0ede6; margin: 32px 0 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .content-h2 {
          font-size: 13px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 1.5px;
          color: #f59e0b; margin: 24px 0 8px;
        }

        .content-p { font-size: 16px; line-height: 1.8; color: #a8a49e; margin: 0; }

        .content-bullet {
          display: flex; gap: 10px; align-items: flex-start;
          padding: 4px 0;
        }
        .bullet-dot { margin-top: 3px; font-size: 8px; flex-shrink: 0; }
        .content-bullet span:last-child { font-size: 15px; line-height: 1.7; color: #a8a49e; }

        .content-spacer { height: 12px; }
        .content-divider { height: 1px; background: rgba(245,158,11,0.2); margin: 24px 0; }

        /* CTA */
        .cta-card {
          display: flex; align-items: center; gap: 24px;
          background: rgba(245,158,11,0.06);
          border: 1px solid rgba(245,158,11,0.2);
          border-radius: 20px;
          padding: 28px 32px;
          flex-wrap: wrap;
        }

        .cta-icon { font-size: 36px; }
        .cta-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #f0ede6; margin-bottom: 4px; }
        .cta-sub { font-size: 13px; color: #666; }

        .cta-btn {
          margin-left: auto;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #000;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 700;
          padding: 14px 28px; border-radius: 12px;
          text-decoration: none; white-space: nowrap;
          transition: all 0.2s;
        }
        .cta-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(245,158,11,0.3); }

        @media (max-width: 768px) {
          .module-main { padding: 32px 20px 60px; }
          .top-bar { padding: 0 20px; }
          .content-card { padding: 32px 24px; }
          .mod-header { padding: 36px 24px; }
          .mod-header-title { font-size: 30px; }
          .cta-btn { margin-left: 0; }
        }
      `}</style>
    </div>
  );
}
