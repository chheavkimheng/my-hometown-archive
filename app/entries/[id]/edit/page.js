"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import EntryForm from "../../../../components/EntryForm.js";
import { createClient } from "../../../../utils/supabase/client.js";

const styles = {
  title: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 36,
    fontWeight: 700,
    color: "#2D5F4C",
    margin: "0 0 24px",
  },
};

export default function EditEntryPage({ params }) {
  const { id } = use(params);
  const [entry, setEntry] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | not-found | forbidden | ready

  useEffect(() => {
    let active = true;

    async function load() {
      const supabase = createClient();
      const { data: userData } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("entries")
        .select("id, title, description, contributor, place, owner, image:photo_url")
        .eq("id", id)
        .single();

      if (!active) return;

      if (error || !data) {
        setStatus("not-found");
        return;
      }

      if (!userData?.user || userData.user.id !== data.owner) {
        setStatus("forbidden");
        return;
      }

      setEntry(data);
      setStatus("ready");
    }

    load();
    return () => {
      active = false;
    };
  }, [id]);

  if (status === "loading") {
    return <main className="page-container" />;
  }

  if (status === "not-found") {
    return (
      <main className="page-container">
        <h1 style={styles.title}>Entry not found</h1>
        <p><Link href="/entries">Back to entries</Link></p>
      </main>
    );
  }

  if (status === "forbidden") {
    return (
      <main className="page-container">
        <h1 style={styles.title}>You can't edit this entry</h1>
        <p>
          You can only edit entries you contributed yourself. <Link href="/entries">Back to entries</Link>
        </p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <h1 style={styles.title}>Edit entry</h1>
      <EntryForm entry={entry} />
    </main>
  );
}