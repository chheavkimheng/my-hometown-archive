"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import translations from "../../data/translations.js";
import EntryCard from "../../components/EntryCard.js";
import MyEntriesStats from "../../components/MyEntriesStats.js";
import MyEntriesEmpty from "../../components/MyEntriesEmpty.js";
import HowReviewWorks from "../../components/HowReviewWorks.js";
import { createClient } from "../../utils/supabase/client.js";
import { useLanguage } from "../../context/LanguageContext.js";

const styles = {
  headerRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "16px 24px",
    marginBottom: 32,
  },
  accent: {
    width: 48,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#C97B5B",
    marginBottom: 16,
  },
  title: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: "clamp(34px, 5vw, 46px)",
    fontWeight: 700,
    color: "#2D5F4C",
    margin: 0,
    lineHeight: 1.15,
  },
  subtitle: { fontSize: 17, color: "#6B6B63", margin: "10px 0 0" },
  grid: { marginTop: 28, rowGap: 32 },
  item: { display: "grid", gridTemplateRows: "auto 1fr", gap: 10 },
  itemTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  status: {
    display: "inline-block",
    padding: "4px 12px",
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 999,
    border: "1px solid #D8DED5",
  },
  editLink: { fontSize: 14, fontWeight: 600, color: "#2D5F4C", textDecoration: "none" },
  cardLink: { display: "block", height: "100%", textDecoration: "none", color: "inherit" },
  note: { marginTop: 28, color: "#6B6B63" },
};

// The words carry the meaning; the colors only help.
const statusColors = {
  pending: { color: "#8A3B1E", backgroundColor: "#FBEFE6" },
  published: { color: "#2D5F4C", backgroundColor: "#E6EFE9" },
  returned: { color: "#B3261E", backgroundColor: "#FDECEA" },
};

// A gray placeholder shaped like a card, shown while entries load.
function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton skeleton-media" />
      <div className="skeleton skeleton-line title" />
      <div className="skeleton skeleton-line" />
      <div className="skeleton skeleton-line short" />
    </div>
  );
}

export default function MyEntriesPage() {
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
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
        <p style={styles.note}>
          {t.my_login_prompt} <Link href="/login">{t.nav_login}</Link>
        </p>
      </main>
    );
  }

  const counts = {
    all: entries.length,
    pending: entries.filter((e) => e.status === "pending").length,
    published: entries.filter((e) => e.status === "published").length,
    returned: entries.filter((e) => e.status === "returned").length,
  };
  const visible = filter === "all" ? entries : entries.filter((e) => e.status === filter);

  let content;
  if (loading) {
    content = (
      <div className="entries-grid" style={styles.grid} aria-busy="true">
        {[0, 1, 2].map((i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  } else if (entries.length === 0) {
    content = <MyEntriesEmpty />;
  } else {
    content = (
      <>
        <MyEntriesStats counts={counts} filter={filter} onChange={setFilter} />
        {visible.length === 0 ? (
          <p style={styles.note}>{t.my_filter_empty}</p>
        ) : (
          <div className="entries-grid" style={styles.grid}>
            {visible.map((entry) => {
              const km = translations.km[entry.slug];
              const title = lang === "km" && km?.title ? km.title : entry.title;
              const description =
                lang === "km" && km?.description ? km.description : entry.description;
              const place = lang === "km" && km?.place ? km.place : entry.place;
              const label = t[`status_${entry.status}`] ?? entry.status;

              return (
                <div key={entry.id} style={styles.item}>
                  <div style={styles.itemTop}>
                    <span style={{ ...styles.status, ...statusColors[entry.status] }}>{label}</span>
                    <Link href={`/entries/${entry.id}/edit`} style={styles.editLink}>
                      {entry.status === "returned" ? t.my_edit_resubmit : t.my_edit_entry}
                    </Link>
                  </div>
                  <Link href={`/entries/${entry.id}`} style={styles.cardLink}>
                    <EntryCard image={entry.image} title={title} description={description} place={place} />
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </>
    );
  }

  return (
    <main className="page-container wide">
      <div style={styles.headerRow}>
        <div>
          <div style={styles.accent} aria-hidden="true" />
          <h1 style={styles.title}>{t.nav_my_entries}</h1>
          <p style={styles.subtitle}>{t.my_subtitle}</p>
        </div>
        <Link href="/contribute" className="btn-primary">
          + {t.my_add_entry}
        </Link>
      </div>

      {content}
      <HowReviewWorks />
    </main>
  );
}