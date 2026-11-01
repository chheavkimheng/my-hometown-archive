import { createClient } from "../../utils/supabase/server.js";
import ReviewQueue from "../../components/ReviewQueue.js";
import ReviewNotice from "../../components/ReviewNotice.js";

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

  return <ReviewQueue initialEntries={entries ?? []} loadFailed={Boolean(error)} />;
}