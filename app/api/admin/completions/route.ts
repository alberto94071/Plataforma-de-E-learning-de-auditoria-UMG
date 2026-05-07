import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import sql from "@/lib/db";

export async function GET() {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session?.user || role !== "admin") {
    return NextResponse.json({ error: "Acceso denegado." }, { status: 403 });
  }

  const completions = await sql`
    SELECT 
      u.id,
      u.name,
      u.email,
      u.created_at AS registered_at,
      cc.total_score,
      cc.max_score,
      cc.completed_at,
      COUNT(mc.id)::int AS modules_completed
    FROM users u
    LEFT JOIN course_completions cc ON cc.user_id = u.id
    LEFT JOIN module_completions mc ON mc.user_id = u.id
    WHERE u.role = 'student'
    GROUP BY u.id, u.name, u.email, u.created_at, cc.total_score, cc.max_score, cc.completed_at
    ORDER BY cc.completed_at DESC NULLS LAST, u.created_at DESC
  `;

  const stats = await sql`
    SELECT
      COUNT(DISTINCT u.id)::int AS total_students,
      COUNT(DISTINCT cc.user_id)::int AS total_completions,
      COALESCE(ROUND(AVG(cc.total_score)::numeric, 1), 0) AS avg_score
    FROM users u
    LEFT JOIN course_completions cc ON cc.user_id = u.id
    WHERE u.role = 'student'
  `;

  return NextResponse.json({ completions, stats: stats[0] });
}
