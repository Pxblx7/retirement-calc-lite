import { createClient } from "@supabase/supabase-js";

// ─── Supabase keep-alive ──────────────────────────────────────────────────────
// Supabase pauses free-tier projects after 7 days without API activity.
// This route runs a trivial query so the daily Vercel Cron (see vercel.json)
// counts as database activity. RLS may return zero rows for the anon key —
// that's fine; the query itself is what registers as activity.

// Never statically cache this route — each hit must reach Supabase.
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Vercel Cron sends "Authorization: Bearer <CRON_SECRET>" when the env var
  // is set. Enforce it only if configured so manual testing still works.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && req.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase
    .from("scenarios")
    .select("id", { count: "exact", head: true })
    .limit(1);

  if (error) {
    console.error("❌ Keep-alive query failed:", error.message);
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
