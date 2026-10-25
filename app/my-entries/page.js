"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import translations from "../../data/translations.js";
import EntryCard from "../../components/EntryCard.js";
import { createClient } from "../../utils/supabase/client.js";
import { useLanguage } from "../../context/LanguageContext.js";

const styles = {
  title: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 36,
    fontWeight: 700,
    color: "#2D5F4C",
    margin: "0 0 24px",
  },
  grid: { marginTop: 24 },
  statusRow: { margin: "0 0 8px" },
  status: {
    display: "inline-block",
    padding: "4px 12px",
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 999,
    border: "1px solid #D8DED5",
  },
  cardLink: { textDecoration: "none", color: "inherit" },
};

// The words carry the meaning; the colors only help.
const statusColors = {
  pending: { color: "#8A3B1E", backgroundColor: "#FBEFE6" },
  published: { color: "#2D5F4C", backgroundColor: "#E6EFE9" },
  returned: { color: "#B3261E", backgroundColor: "#FDECEA" },
};

export default function MyEntriesPage() {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = user?.id;

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setChecked(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) return;
    let active = true;

    async function loadEntries() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("entries")
        .select("id, slug, title, description, place, status, image:photo_url")
        .eq("owner", userId)
        .order("created_at", { ascending: false });

      if (!active) return;
      if (error) {
        console.error("Failed to load your entries:", error);
      }
      setEntries(data ?? []);
      setLoading(false);
    }

    loadEntries();
    return () => {
      active = false;
    };
  }, [userId]);

  if (!checked) {
    return <main className="page-container" />;
  }

  if (!user) {
    return (
      <main className="page-container">
        <h1 style={styles.title}>{t.nav_my_entries}</h1>
        <p>
          You need to be logged in to see your entries. <Link href="/login">Log in</Link> to continue.
        </p>
      </main>
    );
  }

  let content;
  if (loading) {
    content = <p>Loading your entries…</p>;
  } else if (entries.length === 0) {
    content = (
      <p>
        You have not added any entries yet. <Link href="/contribute">Add an entry</Link>.
      </p>
    );
  } else {
    content = (
      <div className="entries-grid" style={styles.grid}>
        {entries.map((entry) => {
          const km = translations.km[entry.slug];
          const title = lang === "km" && km?.title ? km.title : entry.title;
          const description =
            lang === "km" && km?.description ? km.description : entry.description;
          const place = lang === "km" && km?.place ? km.place : entry.place;
          const label = t[`status_${entry.status}`] ?? entry.status;

          return (
            <div key={entry.id}>
              <p style={styles.statusRow}>
                <span style={{ ...styles.status, ...statusColors[entry.status] }}>{label}</span>
              </p>
              <Link href={`/entries/${entry.id}`} style={styles.cardLink}>
                <EntryCard image={entry.image} title={title} description={description} place={place} />
              </Link>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <main className="page-container wide">
      <h1 style={styles.title}>{t.nav_my_entries}</h1>
      {content}
    </main>
  );
}