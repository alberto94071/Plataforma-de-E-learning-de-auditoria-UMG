"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MAX_TOTAL_SCORE } from "@/lib/content";

interface CertData {
  totalScore: number;
  completedAt: string;
}

export default function CertificatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const certRef = useRef<HTMLDivElement>(null);
  const [certData, setCertData] = useState<CertData | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<"pdf" | "png" | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
    if (status === "authenticated") {
      fetch("/api/quiz/submit")
        .then((r) => r.json())
        .then((d) => {
          if (!d.hasDiploma) {
            router.push("/dashboard");
          } else {
            setCertData({ totalScore: d.totalScore, completedAt: new Date().toISOString() });
          }
        });
    }
  }, [status, router]);

  const now = new Date();
  const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const dateStr = `Guatemala, ${now.getDate()} de ${MESES[now.getMonth()]} de ${now.getFullYear()}`;

  async function downloadDiploma(type: "pdf" | "png") {
    if (!certRef.current) return;
    setDownloading(true);
    setDownloadType(type);

    try {
      const html2canvas = (await import("html2canvas")).default;
      
      const canvas = await html2canvas(certRef.current, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        windowWidth: 1200, // Simular ancho de escritorio
        windowHeight: 800,
      });

      if (type === "png") {
        const link = document.createElement("a");
        link.download = `diploma-auditoria-${session?.user?.name?.replace(/\s/g, "_")}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
      } else {
        const jsPDF = (await import("jspdf")).default;
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Calcular dimensiones manteniendo proporción
        const canvasRatio = canvas.height / canvas.width;
        let finalW = pdfWidth;
        let finalH = pdfWidth * canvasRatio;

        // Si la altura calculada se pasa de la hoja, ajustamos por altura
        if (finalH > pdfHeight) {
          finalH = pdfHeight;
          finalW = pdfHeight / canvasRatio;
        }

        const x = (pdfWidth - finalW) / 2;
        const y = (pdfHeight - finalH) / 2;

        pdf.addImage(imgData, "PNG", x, y, finalW, finalH);
        pdf.save(`diploma-auditoria-${session?.user?.name?.replace(/\s/g, "_")}.pdf`);
      }
    } catch (err) {
      console.error("Error generating certificate:", err);
      alert("Error al generar el diploma. Intenta de nuevo.");
    } finally {
      setDownloading(false);
      setDownloadType(null);
    }
  }

  if (status === "loading" || !certData) {
    return (
      <div style={{ minHeight: "100vh", background: "#05080f", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", fontFamily: "DM Sans, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏆</div>
          <div style={{ color: "#555", fontSize: 14 }}>Preparando tu diploma...</div>
        </div>
      </div>
    );
  }

  const userName = session?.user?.name || "Estudiante";
  const pctScore = Math.round((certData.totalScore / MAX_TOTAL_SCORE) * 100);

  return (
    <div className="cert-root">
      <div className="bg-grid" />

      {/* CONTROLS */}
      <div className="cert-controls">
        <Link href="/dashboard" className="back-link">← Volver al Dashboard</Link>
        <div className="download-group">
          <button
            className="dl-btn dl-png"
            onClick={() => downloadDiploma("png")}
            disabled={downloading}
          >
            {downloading && downloadType === "png" ? "⏳ Generando..." : "⬇ Descargar PNG"}
          </button>
          <button
            className="dl-btn dl-pdf"
            onClick={() => downloadDiploma("pdf")}
            disabled={downloading}
          >
            {downloading && downloadType === "pdf" ? "⏳ Generando..." : "📄 Descargar PDF"}
          </button>
        </div>
      </div>

      {/* DIPLOMA */}
      <div className="diploma-wrapper">
        <div className="diploma" ref={certRef}>
          {/* Corner decorations */}
          <div className="corner tl" />
          <div className="corner tr" />
          <div className="corner bl" />
          <div className="corner br" />

          {/* Top ornament */}
          <div className="diploma-top-ornament">
            <div className="ornament-line" />
            <div className="ornament-diamond">◆</div>
            <div className="ornament-line" />
          </div>

          {/* Logo + Institution */}
          <div className="diploma-institution">
            <div className="institution-name">Universidad Mariano Gálvez de Guatemala</div>
            <div className="institution-faculty">Facultad de Ciencias Económicas · Licenciatura en contaduría pública y auditoría</div>
          </div>

          {/* Decorative divider */}
          <div className="deco-line">
            <span className="deco-star">✦</span>
            <span className="deco-span" />
            <span className="deco-star">✦</span>
          </div>

          {/* Main title */}
          <div className="diploma-otorga">OTORGA EL PRESENTE</div>
          <div className="diploma-main-title">Diploma de Aprovechamiento</div>

          {/* Subtitle */}
          <div className="diploma-curso-label">en el curso interactivo de</div>
          <div className="diploma-curso-name">Principios de Auditoría Financiera</div>

          {/* To */}
          <div className="diploma-a">a:</div>

          {/* Student name */}
          <div className="diploma-name">{userName.toUpperCase()}</div>

          {/* Description */}
          <p className="diploma-desc">
            Por haber completado satisfactoriamente los módulos de aprendizaje interactivo que comprenden
            los Principios Fundamentales, Estados Financieros, Normas Internacionales de Auditoría (NIA),
            Normas Internacionales de Información Financiera (NIIF) y Normas Internacionales de Contabilidad (NIC).
          </p>

          {/* Score */}
          <div className="diploma-score-row">
            <div className="score-box">
              <div className="score-box-label">Puntaje Obtenido</div>
              <div className="score-box-value">{certData.totalScore}/{MAX_TOTAL_SCORE}</div>
            </div>
            <div className="score-box">
              <div className="score-box-label">Calificación</div>
              <div className="score-box-value">{pctScore}%</div>
            </div>
            <div className="score-box">
              <div className="score-box-label">Resultado</div>
              <div className="score-box-value approved">APROBADO</div>
            </div>
          </div>

          {/* Footer */}
          <div className="deco-line" style={{ marginTop: 32 }}>
            <span className="deco-star">✦</span>
            <span className="deco-span" />
            <span className="deco-star">✦</span>
          </div>

          <div className="diploma-footer">
            <div className="sig-block">
              <img src="/firma.png" alt="Firma" className="sig-img" />
              <div className="sig-line" />
              <div className="sig-name">Presidenta del Quinto ciclo B</div>
              <div className="sig-inst">Facultad de Ciencias Económicas</div>
            </div>
            <div className="diploma-footer-seal">
              <img 
                src="/logo-umg.png" 
                alt="Sello UMG" 
                className="footer-seal-img"
              />
            </div>
            <div className="sig-block">
              <div className="sig-line" />
              <div className="sig-name">Plataforma AuditPro</div>
              <div className="sig-inst">{dateStr}</div>
            </div>
          </div>

          {/* Bottom ornament */}
          <div className="diploma-top-ornament" style={{ marginTop: 24 }}>
            <div className="ornament-line" />
            <div className="ornament-diamond">◆</div>
            <div className="ornament-line" />
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .cert-root { min-height: 100vh; background: #05080f; font-family: 'DM Sans', sans-serif; color: #e8e8e0; padding-bottom: 80px; }
        .bg-grid { position: fixed; inset: 0; background-image: linear-gradient(rgba(245,158,11,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.03) 1px, transparent 1px); background-size: 48px 48px; pointer-events: none; z-index: 0; }

        .cert-controls {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 40px; height: 72px;
          background: rgba(5,8,15,0.95); backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(245,158,11,0.15);
        }

        .back-link { color: #666; font-size: 14px; text-decoration: none; font-weight: 500; transition: color 0.2s; }
        .back-link:hover { color: #f59e0b; }

        .download-group { display: flex; gap: 12px; }

        .dl-btn {
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 700;
          padding: 10px 20px; border-radius: 10px; cursor: pointer;
          border: none; transition: all 0.2s;
        }
        .dl-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .dl-png { background: rgba(99,102,241,0.15); color: #818cf8; border: 1px solid rgba(99,102,241,0.3); }
        .dl-png:hover:not(:disabled) { background: rgba(99,102,241,0.25); }
        .dl-pdf { background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; }
        .dl-pdf:hover:not(:disabled) { box-shadow: 0 6px 20px rgba(245,158,11,0.3); transform: translateY(-1px); }

        /* DIPLOMA WRAPPER */
        .diploma-wrapper { display: flex; justify-content: center; padding: 48px 24px; position: relative; z-index: 1; }

        /* THE DIPLOMA */
        .diploma {
          width: 900px;
          min-height: 620px;
          background: #fdfcf0; /* Light parchment color */
          border: 12px double #8a7a30;
          border-radius: 4px;
          padding: 48px 60px;
          position: relative;
          text-align: center;
          box-shadow: 0 0 30px rgba(0,0,0,0.1);
          overflow: hidden;
          color: #1a2a1a;
        }

        /* Removed texture overlay to fix rendering crash */

        /* Corner decorations */
        .corner {
          position: absolute; width: 60px; height: 60px;
          border-color: #8a7a30; border-style: solid;
        }
        .corner.tl { top: 12px; left: 12px; border-width: 3px 0 0 3px; }
        .corner.tr { top: 12px; right: 12px; border-width: 3px 3px 0 0; }
        .corner.bl { bottom: 12px; left: 12px; border-width: 0 0 3px 3px; }
        .corner.br { bottom: 12px; right: 12px; border-width: 0 3px 3px 0; }

        /* Ornament line */
        .diploma-top-ornament { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
        .ornament-line { flex: 1; height: 1px; background: #8a7a30; opacity: 0.5; }
        .ornament-diamond { color: #8a7a30; font-size: 12px; }

        /* Institution */
        .diploma-institution { margin-bottom: 20px; }
        .diploma-seal-img { width: 75px; height: 75px; object-fit: contain; margin-bottom: 12px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }
        .institution-name { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #1a365d; letter-spacing: 0.5px; margin-bottom: 4px; }
        .institution-faculty { font-family: 'Cormorant Garamond', serif; font-size: 14px; color: #4a5568; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600; }

        /* Deco line */
        .deco-line { display: flex; align-items: center; gap: 10px; margin: 16px 0; }
        .deco-star { color: #8a7a30; font-size: 10px; }
        .deco-span { flex: 1; height: 1px; background: rgba(138, 122, 48, 0.3); }

        /* Main title */
        .diploma-otorga { font-family: 'Cormorant Garamond', serif; font-size: 13px; text-transform: uppercase; letter-spacing: 4px; color: #718096; margin-bottom: 6px; font-weight: 600; }
        .diploma-main-title { font-family: 'Playfair Display', serif; font-size: 42px; font-weight: 900; color: #2c5282; margin-bottom: 14px; }

        .diploma-curso-label { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 16px; color: #4a5568; margin-bottom: 4px; }
        .diploma-curso-name { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 700; color: #8a7a30; margin-bottom: 16px; }

        .diploma-a { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 18px; color: #4a5568; margin-bottom: 6px; }

        .diploma-name {
          font-family: 'Playfair Display', serif;
          font-size: 38px; font-weight: 900;
          color: #1a2a1a;
          margin-bottom: 16px;
          letter-spacing: 1px;
          border-bottom: 2px solid #8a7a30;
          display: inline-block;
          padding: 0 20px 5px;
        }

        .diploma-desc { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: #4a5568; line-height: 1.6; max-width: 720px; margin: 0 auto 24px; font-weight: 500; }

        /* Score boxes */
        .diploma-score-row { display: flex; justify-content: center; gap: 24px; margin: 20px 0; }
        .score-box { background: rgba(138, 122, 48, 0.05); border: 1px solid rgba(138, 122, 48, 0.2); border-radius: 8px; padding: 12px 24px; min-width: 130px; }
        .score-box-label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #718096; margin-bottom: 4px; font-weight: 700; }
        .score-box-value { font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700; color: #2d3748; }
        .score-box-value.approved { color: #2f855a; font-size: 18px; }

        /* Footer */
        .diploma-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 32px; }
        .sig-block { text-align: center; min-width: 220px; display: flex; flex-direction: column; align-items: center; }
        .sig-img { height: 65px; object-fit: contain; margin-bottom: -10px; position: relative; z-index: 5; mix-blend-mode: multiply; }
        .sig-line { width: 100%; height: 1.5px; background: #2d3748; margin-bottom: 8px; }
        .sig-name { font-family: 'Playfair Display', serif; font-size: 14px; font-weight: 700; color: #1a365d; margin-bottom: 2px; }
        .sig-inst { font-size: 11px; color: #4a5568; font-style: italic; font-weight: 600; }

        .diploma-footer-seal {
          width: 100px; height: 100px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: -10px;
        }
        .footer-seal-img {
          width: 85px; height: 85px;
          object-fit: contain;
          filter: grayscale(0.2) contrast(1.1);
        }

        @media (max-width: 960px) {
          .diploma { width: 100%; min-height: auto; padding: 32px 28px; }
          .diploma-name { font-size: 24px; }
          .diploma-main-title { font-size: 28px; }
          .diploma-footer { flex-direction: column; gap: 24px; align-items: center; }
          .diploma-score-row { flex-wrap: wrap; }
          .cert-controls { padding: 0 20px; flex-wrap: wrap; height: auto; padding: 12px 20px; gap: 12px; }
        }
      `}</style>
    </div>
  );
}
