import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import sql from "@/lib/db";
import {
  DIPLOMA_THRESHOLD,
  MAX_SCORE_PER_MODULE,
  MAX_TOTAL_SCORE,
  MODULES,
} from "@/lib/content";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const { moduleSlug, score } = await req.json();
  const userId = Number(session.user.id);

  // Check if already completed this module
  const existing = await sql`
    SELECT id FROM module_completions
    WHERE user_id = ${userId} AND module_slug = ${moduleSlug}
    LIMIT 1
  `;

  if (existing.length === 0) {
    await sql`
      INSERT INTO module_completions (user_id, module_slug, score, max_score)
      VALUES (${userId}, ${moduleSlug}, ${score}, ${MAX_SCORE_PER_MODULE})
    `;
  }

  // Calculate total score across all completed modules
  const completions = await sql`
    SELECT module_slug, score FROM module_completions WHERE user_id = ${userId}
  `;

  const totalScore = completions.reduce(
    (sum: number, row: { score: number }) => sum + row.score,
    0
  );
  const completedSlugs = completions.map((r: { module_slug: string }) => r.module_slug);
  const allModulesDone = MODULES.every((m) => completedSlugs.includes(m.slug));
  const hasDiploma = totalScore >= DIPLOMA_THRESHOLD && allModulesDone;

  // Save course completion if eligible
  if (hasDiploma) {
    await sql`
      INSERT INTO course_completions (user_id, total_score, max_score)
      VALUES (${userId}, ${totalScore}, ${MAX_TOTAL_SCORE})
      ON CONFLICT (user_id) DO UPDATE SET total_score = ${totalScore}, completed_at = NOW()
    `;
  }

  return NextResponse.json({
    ok: true,
    totalScore,
    hasDiploma,
    completedModules: completedSlugs,
  });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const userId = Number(session.user.id);

  const completions = await sql`
    SELECT module_slug, score FROM module_completions WHERE user_id = ${userId}
  `;

  const totalScore = completions.reduce(
    (sum: number, row: { score: number }) => sum + row.score,
    0
  );

  const courseCompletion = await sql`
    SELECT id FROM course_completions WHERE user_id = ${userId} LIMIT 1
  `;

  return NextResponse.json({
    completions: completions.map((r: { module_slug: string; score: number }) => ({
      slug: r.module_slug,
      score: r.score,
    })),
    totalScore,
    hasDiploma: courseCompletion.length > 0,
  });
}
