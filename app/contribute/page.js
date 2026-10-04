"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import EntryForm from "../../components/EntryForm.js";
import { createClient } from "../../utils/supabase/client.js";

const styles = {
  title: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 36,
    fontWeight: 700,
    color: "#2D5F4C",
    margin: "0 0 24px",
  },
};

export default function ContributePage() {
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

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

  if (!checked) {
    return <main className="page-container" />;
  }

  if (!user) {
    return (
      <main className="page-container">
        <h1 style={styles.title}>Add an entry</h1>
        <p>
          You need to be logged in to contribute. <Link href="/login">Log in</Link> to continue.
        </p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <h1 style={styles.title}>Add an entry</h1>
      <EntryForm />
    </main>
  );
}