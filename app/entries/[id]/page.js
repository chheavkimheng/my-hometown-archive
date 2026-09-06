import { notFound } from "next/navigation";
import entries from "../../../data/entries.js";
import translations from "../../../data/translations.js";
import EntryDetail from "../../../components/EntryDetail.js";

export default async function EntryPage({ params }) {
  const { id } = await params;
  const entry = entries.find((e) => e.id === id);

  if (!entry) {
    notFound();
  }

  const translation = translations.km[id] || null;

  return <EntryDetail entry={entry} translation={translation} />;
}