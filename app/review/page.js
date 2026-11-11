import { createClient } from "../../utils/supabase/server.js";
import ReviewQueue from "../../components/ReviewQueue.js";
import ReviewNotice from "../../components/ReviewNotice.js";

// A read-only count. Returns null if the query fails, so the page never shows a wrong number.
async function countByStatus(supabase, status) {
  const { count, error } = await supabase
    .from("entries")
    .select("id", { count: "exact", head: true })
    .eq("status", status);
  return error ? null : count;
}

export default async function ReviewPage() {
  const supabase = await createClient();
  const { data: isReviewer } = await supabase.rpc("is_reviewer");

  // Politeness, not security: the database is the real gate.
  if (isReviewer !== true) {
    return <ReviewNotice />;
  }

  const { data: entries, error } = await supabase
    .from("entries")
    .select("id, title, description, contributor, place, created_at, image:photo_url")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to load the review queue:", error);
  }

  const [published, returned] = await Promise.all([
    countByStatus(supabase, "published"),
    countByStatus(supabase, "returned"),
  ]);
  const counts = published === null || returned === null ? null : { published, returned };

  return (
    <ReviewQueue
      initialEntries={entries ?? []}
      loadFailed={Boolean(error)}
      counts={counts}
    />
  );
}