import { notFound } from "next/navigation";
import EntryDetail from "../../../components/EntryDetail.js";
import { createClient } from "../../../utils/supabase/server.js";

export default async function EntryPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: entry, error } = await supabase
    .from("entries")
    .select(
      "id, slug, title, title_km, description, description_km, contributor, place, source, category, festival_day, tags, owner, image:photo_url"
    )
    .eq("id", id)
    .single();

  if (error || !entry) {
    notFound();
  }

  const { data: userData } = await supabase.auth.getUser();
  const isOwner = userData?.user?.id === entry.owner;

  return <EntryDetail entry={entry} isOwner={isOwner} />;
}