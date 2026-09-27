import { notFound } from "next/navigation";
import translations from "../../../data/translations.js";
import EntryDetail from "../../../components/EntryDetail.js";
import { createClient } from "../../../utils/supabase/server.js";

export default async function EntryPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: entry, error } = await supabase
    .from("entries")
    .select("id, slug, title, description, contributor, place, image:photo_url")
    .eq("id", id)
    .single();

  if (error || !entry) {
    notFound();
  }

  const translation = translations.km[entry.slug] || null;

  return <EntryDetail entry={entry} translation={translation} />;
}