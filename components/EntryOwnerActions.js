"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client.js";

const styles = {
  row: { display: "flex", gap: 12, marginTop: 32 },
  editLink: {
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    color: "#2D5F4C",
    border: "1px solid #2D5F4C",
    borderRadius: 8,
    textDecoration: "none",
  },
  deleteButton: {
    padding: "10px 20px",
    fontSize: 14,
    fontWeight: 600,
    color: "#B3261E",
    backgroundColor: "#FFFFFF",
    border: "1px solid #B3261E",
    borderRadius: 8,
    cursor: "pointer",
  },
};

// Pulls the storage object path out of a public Supabase Storage URL
// (".../storage/v1/object/public/photos/<path>" -> "<path>"). Returns
// null for anything else — like the Lab 6 seed entries' local
// "/images/entryN.jpg" paths — so cleanup is skipped for those on purpose.
function storagePathFromPublicUrl(url) {
  const marker = "/storage/v1/object/public/photos/";
  const idx = url?.indexOf(marker) ?? -1;
  return idx === -1 ? null : url.slice(idx + marker.length);
}

export default function EntryOwnerActions({ entryId, photoUrl }) {
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm("Delete this entry? This can't be undone.");
    if (!confirmed) return;

    setDeleting(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("entries")
      .delete()
      .eq("id", entryId)
      .select();

    if (error || !data || data.length === 0) {
      console.error("Delete failed:", error);
      alert("That change wasn't saved.");
      setDeleting(false);
      return;
    }

    // Best-effort cleanup — if this fails, the entry is still gone, we
    // just leave an orphaned file in storage. Not a correctness issue.
    const path = storagePathFromPublicUrl(photoUrl);
    if (path) {
      const { error: storageError } = await supabase.storage.from("photos").remove([path]);
      if (storageError) {
        console.error("Photo cleanup failed (entry was still deleted):", storageError);
      }
    }

    router.push("/entries");
  }

  return (
    <div style={styles.row}>
      <Link href={`/entries/${entryId}/edit`} style={styles.editLink}>
        Edit
      </Link>
      <button type="button" onClick={handleDelete} disabled={deleting} style={styles.deleteButton}>
        {deleting ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}