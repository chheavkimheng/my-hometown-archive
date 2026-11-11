"use client";

import { useState } from "react";
import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";
import { createClient } from "../utils/supabase/client.js";
import ReviewItem from "./ReviewItem.js";
import ReviewStats from "./ReviewStats.js";
import ReviewEmpty from "./ReviewEmpty.js";

const styles = {
  title: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 36,
    fontWeight: 700,
    color: "#2D5F4C",
    margin: "0 0 24px",
  },
  list: { display: "flex", flexDirection: "column", gap: 24 },
};

export default function ReviewQueue({ initialEntries, loadFailed, counts }) {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const [entries, setEntries] = useState(initialEntries);
  const [busyId, setBusyId] = useState(null);
  const [failedId, setFailedId] = useState(null);
  const [reviewed, setReviewed] = useState({
    published: counts?.published ?? 0,
    returned: counts?.returned ?? 0,
  });

  async function handleReview(entryId, decision) {
    setBusyId(entryId);
    setFailedId(null);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("review_entry", {
      entry_id: entryId,
      decision,
    });
    setBusyId(null);

    // review_entry refuses by returning false, not by throwing an error.
    if (error || data !== true) {
      setFailedId(entryId);
      return;
    }
    setEntries((current) => current.filter((entry) => entry.id !== entryId));
    setReviewed((current) => ({ ...current, [decision]: current[decision] + 1 }));
  }

  let content;
  if (loadFailed) {
    content = <p role="alert">{t.review_load_failed}</p>;
  } else if (entries.length === 0) {
    content = <ReviewEmpty />;
  } else {
    content = (
      <div style={styles.list}>
        {entries.map((entry) => (
          <ReviewItem
            key={entry.id}
            entry={entry}
            busy={busyId === entry.id}
            failed={failedId === entry.id}
            onReview={handleReview}
          />
        ))}
      </div>
    );
  }

  return (
    <main className="page-container">
      <h1 style={styles.title}>{t.review_title}</h1>
      {counts && !loadFailed && (
        <ReviewStats
          pending={entries.length}
          published={reviewed.published}
          returned={reviewed.returned}
        />
      )}
      {content}
    </main>
  );
}