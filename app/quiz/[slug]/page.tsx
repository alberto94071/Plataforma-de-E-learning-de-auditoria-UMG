"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Script from "next/script";
import { getModuleBySlug, MODULES, MIN_CORRECT_TO_PASS, POINTS_PER_CORRECT } from "@/lib/content";

type Phase = "quiz" | "result";

export default function QuizPage() {
  const params = useParams();
  const { status } = useSession();
  const router = useRouter();
  const slug = params?.slug as string;
  const mod = getModuleBySlug(slug);
  const modIndex = MODULES.findIndex((m) => m.slug === slug);

  const [selected, setSelected] = useState<(number | null)[]>([]);
  const [phase, setPhase] = useState<Phase>("quiz");
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [hasDiploma, setHasDiploma] = useState(false);

  // Sound effects
  const playSound = (url: string) => {
    const audio = new Audio(url);
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  const SOUNDS = {
    click: "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3",
    correct: "https://assets.mixkit.co/active_storage/sfx/600/600-preview.mp3",
    wrong: "https://assets.mixkit.co/active_storage/sfx/251/251-preview.mp3",
    success: "https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3",
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [status, router]);

  useEffect(() => {
    if (mod) setSelected(new Array(mod.questions.length).fill(null));
  }, [mod]);

  if (!mod) return null;

  const allAnswered = selected.every((s) => s !== null);

  async function handleSubmit() {
    if (!allAnswered || submitted) return;
    let correct = 0;
    mod!.questions.forEach((q, i) => {
      if (selected[i] === q.correct) correct++;
    });
    const pts = correct * POINTS_PER_CORRECT;
    setCorrectCount(correct);
    setScore(pts);
    setSubmitted(true);

    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleSlug: slug, score: pts }),
    });
    const data = await res.json();
    if (data.alreadyCompleted) setAlreadyCompleted(true);
    setTotalScore(data.totalScore || 0);
    setHasDiploma(data.hasDiploma || false);
    
    // Interactions
    if (correct === mod!.questions.length) {
      playSound(SOUNDS.success);
      if (typeof (window as any).confetti === "function") {
        (window as any).confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#ffffff', '#10b981']
        });
      }
    } else if (correct >= MIN_CORRECT_TO_PASS) {
      playSound(SOUNDS.correct);
    } else {
      playSound(SOUNDS.wrong);
    }

    setPhase("result");
  }

  const passed = correctCount >= MIN_CORRECT_TO_PASS;

  return (
    <div className="quiz-root">
      <Script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js" strategy="afterInteractive" />
      <div className="bg-grid" />

      <div className="top-bar">
        <div className="nav-brand">
          <img src="/logo-umg.png" alt="UMG" className="nav-logo-mini" />
          <Link href={`/module/${slug}`} className="back-link">← Ver teoría</Link>
        </div>
        <div className="quiz-badge">{mod.icon} {mod.title}</div>
      </div>

      <main className="quiz-main">
        {phase === "quiz" && (
          <>
            <div className="quiz-header">
              <div className="quiz-num">Módulo {modIndex + 1} · Evaluación</div>
              <h1 className="quiz-title">{mod.title}</h1>
              <p className="quiz-sub">Responde todas las preguntas y presiona Calificar</p>
            </div>

            <div className="questions-list">
              {mod.questions.map((q, qi) => (
                <div key={qi} className="question-card" style={{ animationDelay: `${qi * 80}ms` }}>
                  <div className="q-number">Pregunta {qi + 1}</div>
                  <p className="q-text">{q.question}</p>
                  <div className="options-list">
                    {q.options.map((opt, oi) => (
                      <button
                        key={oi}
                        className={`option-btn ${selected[qi] === oi ? "selected" : ""}`}
                        onClick={() => {
                          playSound(SOUNDS.click);
                          const next = [...selected];
                          next[qi] = oi;
                          setSelected(next);
                        }}
                      >
                        <span className="option-letter">{["A", "B", "C"][oi]}</span>
                        <span>{opt}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="submit-section">
              <div className="answered-count">
                {selected.filter((s) => s !== null).length}/{mod.questions.length} preguntas respondidas
              </div>
              <button
                className={`submit-btn ${!allAnswered ? "disabled" : ""}`}
                onClick={handleSubmit}
                disabled={!allAnswered}
              >
                Calificar Respuestas →
              </button>
            </div>
          </>
        )}

        {phase === "result" && (
          <div className="result-section">
            <div className={`result-card ${passed ? "passed" : "failed"}`}>
              <div className="result-emoji">{passed ? "🎉" : "📚"}</div>
              <div className="result-verdict">{passed ? "¡Aprobado!" : "No Aprobado"}</div>
              <div className="result-score">{correctCount}/{mod.questions.length}</div>
              <div className="result-sub">respuestas correctas</div>

              {!alreadyCompleted && (
                <div className={`points-badge ${passed ? "pts-green" : "pts-gray"}`}>
                  {passed ? `+${score} puntos ganados` : "0 puntos (necesitas 2/3)"}
                </div>
              )}
              {alreadyCompleted && (
                <div className="points-badge pts-gray">Ya completado previamente</div>
              )}

              <div className="total-score-row">
                <span>Puntaje total acumulado:</span>
                <span className="total-score-val">{totalScore} pts</span>
              </div>

              {/* Answers review */}
              <div className="answers-review">
                {mod.questions.map((q, qi) => {
                  const userAns = selected[qi];
                  const isCorrect = userAns === q.correct;
                  return (
                    <div key={qi} className={`review-item ${isCorrect ? "review-correct" : "review-wrong"}`}>
                      <div className="review-q">{q.question}</div>
                      <div className="review-answers">
                        {userAns !== null && userAns !== q.correct && (
                          <span className="review-ans wrong">✗ Tu respuesta: {q.options[userAns!]}</span>
                        )}
                        <span className="review-ans correct">✓ Respuesta: {q.options[q.correct]}</span>
                      </div>
                      <div className="review-explanation">
                        <strong>💡 Explicación:</strong> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>

              {hasDiploma && (
                <div className="diploma-alert">
                  🏆 ¡Felicidades! Has alcanzado el puntaje para tu diploma.
                  <Link href="/certificate" className="diploma-alert-btn">Ver Diploma →</Link>
                </div>
              )}

              <div className="result-actions">
                <Link href="/dashboard" className="result-btn secondary">← Volver al Menú</Link>
                {!passed && (
                  <button className="result-btn primary" onClick={() => {
                    setSelected(new Array(mod!.questions.length).fill(null));
                    setPhase("quiz");
                    setSubmitted(false);
                  }}>
                    Intentar de Nuevo
                  </button>
                )}
                {passed && modIndex < MODULES.length - 1 && (
                  <Link href={`/module/${MODULES[modIndex + 1].slug}`} className="result-btn primary">
                    Siguiente Módulo →
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .quiz-root { min-height: 100vh; background: #05080f; font-family: 'DM Sans', sans-serif; color: #e8e8e0; }
        .bg-grid { position: fixed; inset: 0; background-image: linear-gradient(rgba(245,158,11,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.025) 1px, transparent 1px); background-size: 48px 48px; pointer-events: none; z-index: 0; }

        .top-bar { position: sticky; top: 0; z-index: 100; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; height: 64px; background: rgba(5,8,15,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,255,255,0.06); }
        .nav-brand { display: flex; align-items: center; gap: 12px; }
        .nav-logo-mini { width: 28px; height: 28px; object-fit: contain; }
        .back-link { color: #666; font-size: 14px; text-decoration: none; font-weight: 500; transition: color 0.2s; }
        .back-link:hover { color: #f59e0b; }
        .quiz-badge { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #888; font-size: 13px; padding: 6px 14px; border-radius: 20px; }

        .quiz-main { max-width: 760px; margin: 0 auto; padding: 48px 40px 80px; position: relative; z-index: 1; }

        .quiz-header { text-align: center; margin-bottom: 48px; }
        .quiz-num { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #f59e0b; font-weight: 600; margin-bottom: 10px; }
        .quiz-title { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900; margin-bottom: 10px; }
        .quiz-sub { font-size: 15px; color: #555; }

        .questions-list { display: flex; flex-direction: column; gap: 24px; }

        .question-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 20px; padding: 28px 32px; animation: fadeUp 0.4s ease both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        .q-number { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #555; font-weight: 600; margin-bottom: 10px; }
        .q-text { font-size: 18px; font-weight: 600; color: #f0ede6; margin-bottom: 20px; line-height: 1.4; }

        .options-list { display: flex; flex-direction: column; gap: 10px; }

        .option-btn {
          display: flex; align-items: center; gap: 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 14px 20px;
          color: #b0aca0; font-family: 'DM Sans', sans-serif;
          font-size: 15px; cursor: pointer;
          text-align: left; transition: all 0.2s;
        }
        .option-btn:hover { border-color: rgba(245,158,11,0.3); color: #f0ede6; background: rgba(245,158,11,0.04); }
        .option-btn.selected { border-color: rgba(245,158,11,0.6); background: rgba(245,158,11,0.1); color: #f59e0b; }

        .option-letter {
          flex-shrink: 0; width: 28px; height: 28px;
          background: rgba(255,255,255,0.08);
          border-radius: 6px; display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700;
        }
        .option-btn.selected .option-letter { background: rgba(245,158,11,0.3); }

        .submit-section { margin-top: 40px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
        .answered-count { font-size: 13px; color: #555; }

        .submit-btn {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border: none; border-radius: 12px;
          color: #000; font-family: 'DM Sans', sans-serif;
          font-size: 15px; font-weight: 700;
          padding: 14px 32px; cursor: pointer; transition: all 0.2s;
        }
        .submit-btn:hover:not(.disabled) { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(245,158,11,0.3); }
        .submit-btn.disabled { opacity: 0.4; cursor: not-allowed; }

        /* RESULT */
        .result-section { display: flex; justify-content: center; }
        .result-card { width: 100%; max-width: 640px; background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; padding: 48px 40px; text-align: center; }
        .result-card.passed { border-color: rgba(16,185,129,0.3); }
        .result-card.failed { border-color: rgba(239,68,68,0.2); }

        .result-emoji { font-size: 56px; margin-bottom: 16px; }
        .result-verdict { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900; margin-bottom: 8px; }
        .result-card.passed .result-verdict { color: #10b981; }
        .result-card.failed .result-verdict { color: #f87171; }
        .result-score { font-family: 'Playfair Display', serif; font-size: 64px; font-weight: 900; color: #f0ede6; line-height: 1; }
        .result-sub { font-size: 14px; color: #555; margin-bottom: 20px; }

        .points-badge { display: inline-block; font-size: 14px; font-weight: 700; padding: 6px 18px; border-radius: 20px; margin-bottom: 20px; }
        .pts-green { background: rgba(16,185,129,0.12); color: #10b981; border: 1px solid rgba(16,185,129,0.3); }
        .pts-gray { background: rgba(255,255,255,0.05); color: #666; border: 1px solid rgba(255,255,255,0.1); }

        .total-score-row { display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); border-radius: 10px; padding: 12px 20px; margin-bottom: 28px; font-size: 14px; color: #666; }
        .total-score-val { font-weight: 700; color: #f59e0b; font-size: 18px; }

        .answers-review { display: flex; flex-direction: column; gap: 12px; text-align: left; margin-bottom: 28px; }
        .review-item { padding: 14px 18px; border-radius: 12px; border: 1px solid; }
        .review-item.review-correct { background: rgba(16,185,129,0.06); border-color: rgba(16,185,129,0.2); }
        .review-item.review-wrong { background: rgba(239,68,68,0.05); border-color: rgba(239,68,68,0.2); }
        .review-q { font-size: 14px; font-weight: 600; color: #c0bdb8; margin-bottom: 8px; }
        .review-answers { display: flex; flex-direction: column; gap: 4px; }
        .review-ans { font-size: 13px; }
        .review-ans.wrong { color: #f87171; }
        .review-ans.correct { color: #10b981; }
        .review-explanation { margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.05); font-size: 13px; color: #888; line-height: 1.5; }

        .diploma-alert { display: flex; align-items: center; justify-content: space-between; gap: 12px; background: rgba(245,158,11,0.1); border: 1px solid rgba(245,158,11,0.3); border-radius: 12px; padding: 14px 20px; margin-bottom: 24px; font-size: 14px; font-weight: 600; color: #f59e0b; flex-wrap: wrap; }
        .diploma-alert-btn { background: #f59e0b; color: #000; text-decoration: none; font-size: 13px; font-weight: 700; padding: 6px 16px; border-radius: 8px; }

        .result-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
        .result-btn { padding: 12px 24px; border-radius: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.2s; border: none; }
        .result-btn.primary { background: linear-gradient(135deg, #f59e0b, #d97706); color: #000; }
        .result-btn.secondary { background: rgba(255,255,255,0.06); color: #888; border: 1px solid rgba(255,255,255,0.1); }
        .result-btn:hover { transform: translateY(-1px); }

        @media (max-width: 768px) {
          .quiz-main { padding: 32px 20px 60px; }
          .top-bar { padding: 0 20px; }
          .question-card { padding: 20px; }
          .result-card { padding: 32px 24px; }
        }
      `}</style>
    </div>
  );
}
