import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import sql from "@/lib/db";

export async function GET(req: Request) {
  const session = await auth();
  const role = (session?.user as { role?: string })?.role;
  if (!session?.user || role !== "admin") {
    return NextResponse.json({ error: "Acceso denegado." }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId requerido." }, { status: 400 });
  }

  const rows = await sql`
    SELECT u.name, u.email, cc.total_score, cc.max_score, cc.completed_at
    FROM users u
    JOIN course_completions cc ON cc.user_id = u.id
    WHERE u.id = ${Number(userId)}
    LIMIT 1
  `;

  if (rows.length === 0) {
    return NextResponse.json({ error: "No encontrado." }, { status: 404 });
  }

  return NextResponse.json(rows[0]);
}
