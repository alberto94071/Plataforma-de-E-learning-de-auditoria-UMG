"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
    } else {
      router.push("/dashboard");
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Error al registrarse.");
      setLoading(false);
      return;
    }
    // Auto-login after register
    const loginRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (loginRes?.error) {
      setError("Registro exitoso. Inicia sesión.");
      setMode("login");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="landing-root">
      {/* Animated background grid */}
      <div className="bg-grid" />
      <div className="bg-glow" />

      <div className="landing-split">
        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="left-inner">
            <div className="brand-header">
              <img 
                src="/logo-umg.png" 
                alt="UMG Logo" 
                className="landing-logo-img"
              />
              <div className="brand-badge">UMG · Auditoría</div>
            </div>
            <h1 className="hero-title">
              Domina la<br />
              <span className="hero-gold">Auditoría</span><br />
              Financiera
            </h1>
            <p className="hero-sub">
              Curso interactivo de principios de auditoría, estados financieros
              y normas internacionales NIA · NIIF · NIC para estudiantes de la
              Universidad Mariano Gálvez.
            </p>

            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-num">7</span>
                <span className="stat-label">Módulos</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-num">21</span>
                <span className="stat-label">Evaluaciones</span>
              </div>
              <div className="stat-divider" />
              <div className="stat-item">
                <span className="stat-num">🏆</span>
                <span className="stat-label">Diploma</span>
              </div>
            </div>

            <div className="module-chips">
              {["Principios Fundamentales", "Estados Financieros", "NIA · NIIF · NIC", "Negocio en Marcha", "Sociedades Mercantiles"].map((t) => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL — AUTH */}
        <div className="right-panel">
          <div className="auth-card">
            <div className="auth-tabs">
              <button
                className={`auth-tab ${mode === "login" ? "active" : ""}`}
                onClick={() => { setMode("login"); setError(""); }}
              >
                Iniciar Sesión
              </button>
              <button
                className={`auth-tab ${mode === "register" ? "active" : ""}`}
                onClick={() => { setMode("register"); setError(""); }}
              >
                Registrarse
              </button>
            </div>

            <form onSubmit={mode === "login" ? handleLogin : handleRegister} className="auth-form">
              {mode === "register" && (
                <div className="field-group">
                  <label>Nombre Completo</label>
                  <input
                    type="text"
                    placeholder="Tu nombre completo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                  />
                </div>
              )}

              <div className="field-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="correo@umg.edu.gt"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="field-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
              </div>

              {error && <p className="auth-error">{error}</p>}

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? (
                  <span className="spinner" />
                ) : mode === "login" ? (
                  "Entrar al Curso →"
                ) : (
                  "Crear Cuenta →"
                )}
              </button>
            </form>

            <p className="auth-footer-note">
              {mode === "login" ? "¿No tienes cuenta? " : "¿Ya tienes cuenta? "}
              <button
                className="link-btn"
                onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
              >
                {mode === "login" ? "Regístrate gratis" : "Inicia sesión"}
              </button>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .landing-root {
          min-height: 100vh;
          background: #05080f;
          font-family: 'DM Sans', sans-serif;
          overflow: hidden;
          position: relative;
          color: #e8e8e0;
        }

        .bg-grid {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(245,158,11,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,158,11,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        .bg-glow {
          position: fixed;
          top: -200px;
          left: -200px;
          width: 700px;
          height: 700px;
          background: radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .landing-split {
          display: flex;
          min-height: 100vh;
          position: relative;
          z-index: 1;
        }

        /* LEFT */
        .left-panel {
          flex: 1.2;
          display: flex;
          align-items: center;
          padding: 60px 80px;
        }

        .left-inner { max-width: 560px; }
        .brand-header { display: flex; align-items: center; gap: 16px; margin-bottom: 36px; }
        .landing-logo-img { width: 50px; height: 50px; object-fit: contain; filter: drop-shadow(0 0 12px rgba(245,158,11,0.3)); }

        .brand-badge {
          display: inline-block;
          background: rgba(245,158,11,0.12);
          border: 1px solid rgba(245,158,11,0.3);
          color: #f59e0b;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 2px;
          text-transform: uppercase;
          padding: 6px 14px;
          border-radius: 20px;
        }

        .hero-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(42px, 5vw, 68px);
          font-weight: 900;
          line-height: 1.1;
          color: #f0ede6;
          margin-bottom: 24px;
        }

        .hero-gold { color: #f59e0b; }

        .hero-sub {
          font-size: 16px;
          line-height: 1.7;
          color: #8a8880;
          margin-bottom: 48px;
          max-width: 460px;
        }

        .stats-row {
          display: flex;
          align-items: center;
          gap: 32px;
          margin-bottom: 40px;
        }

        .stat-item { text-align: center; }

        .stat-num {
          display: block;
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: #f59e0b;
          line-height: 1;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #666;
          font-weight: 500;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(245,158,11,0.2);
        }

        .module-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .chip {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: #b0aca0;
          font-size: 12px;
          padding: 6px 14px;
          border-radius: 20px;
          font-weight: 500;
          transition: all 0.2s;
        }

        /* RIGHT */
        .right-panel {
          flex: 0.8;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 40px;
          background: rgba(255,255,255,0.015);
          border-left: 1px solid rgba(255,255,255,0.05);
          backdrop-filter: blur(20px);
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
        }

        .auth-tabs {
          display: flex;
          gap: 0;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 40px;
        }

        .auth-tab {
          flex: 1;
          background: transparent;
          border: none;
          color: #666;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          font-weight: 500;
          padding: 10px 16px;
          border-radius: 9px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .auth-tab.active {
          background: rgba(245,158,11,0.15);
          color: #f59e0b;
          font-weight: 600;
        }

        .auth-form { display: flex; flex-direction: column; gap: 20px; }

        .field-group { display: flex; flex-direction: column; gap: 8px; }

        .field-group label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #666;
        }

        .field-group input {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 14px 16px;
          color: #f0ede6;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
        }

        .field-group input:focus {
          border-color: rgba(245,158,11,0.5);
          background: rgba(245,158,11,0.04);
        }

        .field-group input::placeholder { color: #444; }

        .auth-error {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
          font-size: 13px;
          padding: 10px 14px;
          border-radius: 8px;
        }

        .auth-btn {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border: none;
          border-radius: 12px;
          color: #000;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 700;
          padding: 16px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 8px;
          letter-spacing: 0.3px;
        }

        .auth-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(245,158,11,0.3); }
        .auth-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(0,0,0,0.3);
          border-top-color: #000;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .auth-footer-note {
          text-align: center;
          color: #555;
          font-size: 13px;
          margin-top: 24px;
        }

        .link-btn {
          background: none;
          border: none;
          color: #f59e0b;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          cursor: pointer;
          font-weight: 600;
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .landing-split { flex-direction: column; }
          .left-panel { padding: 40px 24px 20px; }
          .right-panel { border-left: none; border-top: 1px solid rgba(255,255,255,0.05); padding: 40px 24px; }
          .stats-row { gap: 20px; }
        }
      `}</style>
    </div>
  );
}
