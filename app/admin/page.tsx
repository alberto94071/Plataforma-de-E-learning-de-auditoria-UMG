"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MAX_TOTAL_SCORE, DIPLOMA_THRESHOLD } from "@/lib/content";

interface Student {
  id: number;
  name: string;
  email: string;
  registered_at: string;
  total_score: number | null;
  max_score: number | null;
  completed_at: string | null;
  modules_completed: number;
}

interface Stats {
  total_students: number;
  total_completions: number;
  avg_score: number;
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "completed" | "in-progress">("all");
  const [printingId, setPrintingId] = useState<number | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/"); return; }
    const role = (session?.user as { role?: string })?.role;
    if (status === "authenticated" && role !== "admin") { router.push("/dashboard"); return; }
    if (status === "authenticated") {
      fetch("/api/admin/completions")
        .then((r) => r.json())
        .then((d) => {
          setStudents(d.completions || []);
          setStats(d.stats || null);
          setLoading(false);
        });
    }
  }, [status, session, router]);

  const MESES = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"];
  function formatDate(iso: string | null) {
    if (!iso) return "—";
    const d = new Date(iso);
    return `${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
  }

  async function printDiploma(student: Student) {
    if (!student.total_score) return;
    setPrintingId(student.id);

    // Build a printable diploma HTML and open in new window
    const MESES_FULL = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
    const dt = student.completed_at ? new Date(student.completed_at) : new Date();
    const dateStr = `Guatemala, ${dt.getDate()} de ${MESES_FULL[dt.getMonth()]} de ${dt.getFullYear()}`;
    const pct = Math.round((student.total_score / MAX_TOTAL_SCORE) * 100);

    const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Diploma - ${student.name}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#f0f0f0; display:flex; justify-content:center; padding:40px; font-family:'DM Sans', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .diploma {
    width:900px; min-height:620px;
    background:#fdfcf0;
    border:12px double #8a7a30; border-radius:4px; padding:48px 60px;
    position:relative; text-align:center;
    box-shadow:0 0 30px rgba(0,0,0,0.1);
    color:#1a2a1a;
    overflow:hidden;
  }
  /* Texture removed to fix crash */
  .corner { position:absolute; width:60px; height:60px; border-color:#8a7a30; border-style:solid; z-index:2; }
  .tl { top:12px; left:12px; border-width:3px 0 0 3px; }
  .tr { top:12px; right:12px; border-width:3px 3px 0 0; }
  .bl { bottom:12px; left:12px; border-width:0 0 3px 3px; }
  .br { bottom:12px; right:12px; border-width:0 3px 3px 0; }

  .orn { display:flex; align-items:center; gap:12px; margin-bottom:24px; position:relative; z-index:2; }
  .orn-line { flex:1; height:1px; background:#8a7a30; opacity:0.5; }
  .orn-d { color:#8a7a30; font-size:12px; }

  .inst-name { font-family:'Playfair Display', serif; font-size:20px; font-weight:700; color:#1a365d; letter-spacing:0.5px; margin-bottom:4px; position:relative; z-index:2; }
  .inst-fac { font-family:'Cormorant Garamond', serif; font-size:14px; color:#4a5568; letter-spacing:1.5px; text-transform:uppercase; font-weight:600; position:relative; z-index:2; }

  .deco { display:flex; align-items:center; gap:10px; margin:16px 0; position:relative; z-index:2; }
  .deco-star { color:#8a7a30; font-size:10px; }
  .deco-span { flex:1; height:1px; background:rgba(138, 122, 48, 0.3); }

  .otorga { font-family:'Cormorant Garamond', serif; font-size:13px; text-transform:uppercase; letter-spacing:4px; color:#718096; margin-bottom:6px; font-weight:600; position:relative; z-index:2; }
  .main-title { font-family:'Playfair Display', serif; font-size:42px; font-weight:900; color:#2c5282; margin-bottom:14px; position:relative; z-index:2; }
  .curso-lbl { font-family:'Cormorant Garamond', serif; font-style:italic; font-size:16px; color:#4a5568; margin-bottom:4px; position:relative; z-index:2; }
  .curso-name { font-family:'Playfair Display', serif; font-size:20px; font-weight:700; color:#8a7a30; margin-bottom:16px; position:relative; z-index:2; }

  .a-label { font-family:'Cormorant Garamond', serif; font-style:italic; font-size:18px; color:#4a5568; margin-bottom:6px; position:relative; z-index:2; }
  .student-name {
    font-family:'Playfair Display', serif; font-size:38px; font-weight:900; color:#1a2a1a;
    margin-bottom:16px; letter-spacing:1px; border-bottom:2px solid #8a7a30;
    display:inline-block; padding:0 20px 5px; position:relative; z-index:2;
  }
  .desc { font-family:'Cormorant Garamond', serif; font-size:15px; color:#4a5568; line-height:1.6; max-width:720px; margin:0 auto 24px; font-weight:500; position:relative; z-index:2; }

  .score-row { display:flex; justify-content:center; gap:24px; margin:20px 0; position:relative; z-index:2; }
  .sbox { background:rgba(138, 122, 48, 0.05); border:1px solid rgba(138, 122, 48, 0.2); border-radius:8px; padding:12px 24px; min-width:130px; }
  .sbox-label { font-size:10px; text-transform:uppercase; letter-spacing:1px; color:#718096; margin-bottom:4px; font-weight:700; }
  .sbox-val { font-family:'Playfair Display', serif; font-size:24px; font-weight:700; color:#2d3748; }
  .sbox-val.grn { color:#2f855a; font-size:18px; }

  .footer { display:flex; justify-content:space-between; align-items:flex-end; margin-top:32px; position:relative; z-index:2; }
  .sig { text-align:center; min-width:220px; display:flex; flex-direction:column; align-items:center; }
  .sig-img { height: 65px; object-fit: contain; margin-bottom: -10px; position: relative; z-index: 5; mix-blend-mode: multiply; }
  .sig-line { width:100%; height:1.5px; background:#2d3748; margin-bottom:8px; }
  .sig-name { font-family:'Playfair Display', serif; font-size:14px; font-weight:700; color:#1a365d; margin-bottom:2px; }
  .sig-inst { font-size:11px; color:#4a5568; font-style:italic; font-weight:600; }

  .seal-img { width:85px; height:85px; object-fit:contain; filter:grayscale(0.2) contrast(1.1); }

  @page {
    size: A4 landscape;
    margin: 0;
  }
  @media print {
    body { background:white; padding:0; margin:0; }
    .diploma { 
      width: 297mm; 
      height: 210mm;
      border: 12px double #8a7a30 !important;
      box-shadow: none; 
      -webkit-print-color-adjust: exact; 
      print-color-adjust: exact;
      margin: 0 auto;
      padding: 30px 50px; /* Reduced padding for print */
    }
    .corner { border-color: #8a7a30 !important; }
  }
</style>
</head>
<body>
<div class="diploma">
  <div class="corner tl"></div><div class="corner tr"></div>
  <div class="corner bl"></div><div class="corner br"></div>
  
  <div class="orn"><div class="orn-line"></div><div class="orn-d">◆</div><div class="orn-line"></div></div>

  <div class="inst-name">Universidad Mariano Gálvez de Guatemala</div>
  <div class="inst-fac">Facultad de Ciencias Económicas · Licenciatura en contaduría pública y auditoría</div>
  
  <div class="deco"><span class="deco-star">✦</span><span class="deco-span"></span><span class="deco-star">✦</span></div>
  
  <div class="otorga">OTORGA EL PRESENTE</div>
  <div class="main-title">Diploma de Aprovechamiento</div>
  <div class="curso-lbl">en el curso interactivo de</div>
  <div class="curso-name">Principios de Auditoría Financiera</div>
  
  <div class="a-label">a:</div>
  <div class="student-name">${student.name.toUpperCase()}</div>
  
  <p class="desc">Por haber completado satisfactoriamente los módulos de aprendizaje interactivo que comprenden los Principios Fundamentales, Estados Financieros, Normas Internacionales de Auditoría (NIA), Normas Internacionales de Información Financiera (NIIF) y Normas Internacionales de Contabilidad (NIC).</p>
  
  <div class="score-row">
    <div class="sbox"><div class="sbox-label">Puntaje</div><div class="sbox-val">${student.total_score}/${MAX_TOTAL_SCORE}</div></div>
    <div class="sbox"><div class="sbox-label">Calificación</div><div class="sbox-val">${pct}%</div></div>
    <div class="sbox"><div class="sbox-label">Resultado</div><div class="sbox-val grn">APROBADO</div></div>
  </div>

  <div class="deco"><span class="deco-star">✦</span><span class="deco-span"></span><span class="deco-star">✦</span></div>

  <div class="footer" style="margin-top:20px">
    <div class="sig"><img src="/firma.png" alt="Firma" class="sig-img"><div class="sig-line"></div><div class="sig-name">Presidenta del Quinto ciclo B</div><div class="sig-inst">Facultad de Ciencias Económicas</div></div>
    <div class="seal"><img src="/logo-umg.png" alt="Sello UMG" class="seal-img"></div>
    <div class="sig"><div class="sig-line"></div><div class="sig-name">Plataforma AuditPro</div><div class="sig-inst">${dateStr}</div></div>
  </div>

  <div class="orn" style="margin-top:12px"><div class="orn-line"></div><div class="orn-d">◆</div><div class="orn-line"></div></div>
</div>
<script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`;

    const w = window.open("", "_blank", "width=980,height=720");
    if (w) {
      w.document.write(html);
      w.document.close();
    }
    setPrintingId(null);
  }

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true :
      filter === "completed" ? s.completed_at !== null :
      s.completed_at === null;
    return matchSearch && matchFilter;
  });

  if (loading) return <div style={{ minHeight: "100vh", background: "#05080f", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b", fontFamily: "DM Sans, sans-serif" }}>Cargando panel...</div>;

  return (
    <div className="admin-root">
      <div className="bg-grid" />

      {/* NAV */}
      <nav className="admin-nav">
        <div className="nav-brand">
          <span>🔍</span>
          <div>
            <div className="nav-title">AuditPro · Admin</div>
            <div className="nav-sub">Panel de Administración</div>
          </div>
        </div>
        <Link href="/dashboard" className="nav-back">← Vista Estudiante</Link>
      </nav>

      <main className="admin-main">
        <h1 className="admin-title">Panel de Control</h1>
        <p className="admin-sub">Gestión de estudiantes y diplomas del curso de Auditoría</p>

        {/* STATS */}
        {stats && (
          <div className="stats-grid">
            {[
              { label: "Total Estudiantes", value: stats.total_students, icon: "👥", color: "#6366f1" },
              { label: "Diplomas Emitidos", value: stats.total_completions, icon: "🏆", color: "#f59e0b" },
              { label: "Tasa de Completación", value: stats.total_students > 0 ? `${Math.round((stats.total_completions / stats.total_students) * 100)}%` : "0%", icon: "📈", color: "#10b981" },
              { label: "Puntaje Promedio", value: `${stats.avg_score}/${MAX_TOTAL_SCORE}`, icon: "📊", color: "#ec4899" },
            ].map((s) => (
              <div key={s.label} className="stat-card" style={{ "--c": s.color } as React.CSSProperties}>
                <div className="stat-icon">{s.icon}</div>
                <div className="stat-val" style={{ color: s.color }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* FILTERS */}
        <div className="filters-row">
          <input
            className="search-input"
            type="text"
            placeholder="🔍 Buscar por nombre o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="filter-tabs">
            {(["all", "completed", "in-progress"] as const).map((f) => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "Todos" : f === "completed" ? "✓ Completados" : "⏳ En Progreso"}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="table-wrap">
          <table className="students-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Módulos</th>
                <th>Puntaje</th>
                <th>Estado</th>
                <th>Fecha Reg.</th>
                <th>Completado</th>
                <th>Diploma</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="empty-row">No se encontraron registros.</td></tr>
              )}
              {filtered.map((s) => (
                <tr key={s.id} className={s.completed_at ? "row-completed" : ""}>
                  <td>
                    <div className="student-cell">
                      <div className="student-avatar">{s.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <div className="student-name-cell">{s.name}</div>
                        <div className="student-email">{s.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="modules-bar-wrap">
                      <div className="modules-bar-track">
                        <div className="modules-bar-fill" style={{ width: `${(s.modules_completed / 7) * 100}%` }} />
                      </div>
                      <span className="modules-count">{s.modules_completed}/7</span>
                    </div>
                  </td>
                  <td>
                    {s.total_score !== null ? (
                      <span className="score-cell">{s.total_score}/{MAX_TOTAL_SCORE}</span>
                    ) : <span className="na-cell">—</span>}
                  </td>
                  <td>
                    {s.completed_at ? (
                      <span className="badge badge-green">✓ Diploma</span>
                    ) : s.modules_completed > 0 ? (
                      <span className="badge badge-yellow">En progreso</span>
                    ) : (
                      <span className="badge badge-gray">Sin iniciar</span>
                    )}
                  </td>
                  <td className="date-cell">{formatDate(s.registered_at)}</td>
                  <td className="date-cell">{formatDate(s.completed_at)}</td>
                  <td>
                    {s.completed_at ? (
                      <button
                        className="print-btn"
                        onClick={() => printDiploma(s)}
                        disabled={printingId === s.id}
                      >
                        {printingId === s.id ? "..." : "🖨 Imprimir"}
                      </button>
                    ) : (
                      <span className="na-cell">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-footer">{filtered.length} registros mostrados</div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .admin-root { min-height: 100vh; background: #05080f; font-family: 'DM Sans', sans-serif; color: #e8e8e0; }
        .bg-grid { position: fixed; inset: 0; background-image: linear-gradient(rgba(245,158,11,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.025) 1px, transparent 1px); background-size: 48px 48px; pointer-events: none; z-index: 0; }

        .admin-nav { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 72px; background: rgba(5,8,15,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(245,158,11,0.12); }
        .nav-brand { display: flex; align-items: center; gap: 14px; font-size: 24px; }
        .nav-title { font-family: 'Playfair Display', serif; font-size: 18px; font-weight: 700; color: #f0ede6; }
        .nav-sub { font-size: 11px; color: #555; }
        .nav-back { color: #666; font-size: 13px; text-decoration: none; font-weight: 500; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding: 8px 16px; border-radius: 8px; transition: all 0.2s; }
        .nav-back:hover { color: #f59e0b; border-color: rgba(245,158,11,0.3); }

        .admin-main { max-width: 1280px; margin: 0 auto; padding: 48px 40px 80px; position: relative; z-index: 1; }
        .admin-title { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900; margin-bottom: 6px; }
        .admin-sub { font-size: 14px; color: #555; margin-bottom: 40px; }

        /* STATS */
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 40px; }
        .stat-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 24px; border-top: 2px solid var(--c, #f59e0b); transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-2px); }
        .stat-icon { font-size: 28px; margin-bottom: 12px; }
        .stat-val { font-family: 'Playfair Display', serif; font-size: 32px; font-weight: 700; margin-bottom: 4px; }
        .stat-label { font-size: 12px; color: #555; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }

        /* FILTERS */
        .filters-row { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
        .search-input { flex: 1; min-width: 240px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 16px; color: #f0ede6; font-family: 'DM Sans', sans-serif; font-size: 14px; outline: none; transition: border-color 0.2s; }
        .search-input:focus { border-color: rgba(245,158,11,0.4); }
        .search-input::placeholder { color: #444; }
        .filter-tabs { display: flex; gap: 8px; }
        .filter-tab { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; color: #555; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; padding: 10px 16px; cursor: pointer; transition: all 0.2s; }
        .filter-tab.active { background: rgba(245,158,11,0.12); border-color: rgba(245,158,11,0.3); color: #f59e0b; }

        /* TABLE */
        .table-wrap { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; overflow: hidden; }
        .students-table { width: 100%; border-collapse: collapse; }
        .students-table th { padding: 14px 20px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #555; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.02); }
        .students-table td { padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 14px; color: #a0a09a; vertical-align: middle; }
        .students-table tr:last-child td { border-bottom: none; }
        .students-table tr:hover td { background: rgba(255,255,255,0.02); }
        .row-completed td { color: #c0bdb8; }

        .student-cell { display: flex; align-items: center; gap: 12px; }
        .student-avatar { width: 36px; height: 36px; background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.25); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #f59e0b; flex-shrink: 0; }
        .student-name-cell { font-weight: 600; color: #e0ddd8; font-size: 14px; }
        .student-email { font-size: 12px; color: #555; }

        .modules-bar-wrap { display: flex; align-items: center; gap: 8px; }
        .modules-bar-track { width: 60px; height: 4px; background: rgba(255,255,255,0.08); border-radius: 2px; overflow: hidden; }
        .modules-bar-fill { height: 100%; background: #f59e0b; border-radius: 2px; transition: width 0.5s; }
        .modules-count { font-size: 12px; color: #666; }

        .score-cell { font-weight: 700; color: #f59e0b; }
        .na-cell { color: #444; }
        .date-cell { font-size: 12px; color: #555; }

        .badge { display: inline-block; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; }
        .badge-green { background: rgba(16,185,129,0.12); color: #10b981; border: 1px solid rgba(16,185,129,0.25); }
        .badge-yellow { background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.25); }
        .badge-gray { background: rgba(255,255,255,0.04); color: #555; border: 1px solid rgba(255,255,255,0.08); }

        .print-btn { background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25); color: #818cf8; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 700; padding: 7px 14px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
        .print-btn:hover { background: rgba(99,102,241,0.2); }
        .print-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .empty-row { text-align: center; color: #444; padding: 40px !important; }
        .table-footer { text-align: right; font-size: 12px; color: #444; margin-top: 12px; }

        @media (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .admin-main { padding: 32px 20px 60px; }
          .admin-nav { padding: 0 20px; }
          .table-wrap { overflow-x: auto; }
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr 1fr; }
          .filters-row { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}
