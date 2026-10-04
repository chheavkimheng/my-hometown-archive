"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client.js";
import { validateEntry, extensionForPhotoType } from "../utils/validateEntry.js";

const styles = {
  form: { display: "flex", flexDirection: "column", gap: 20, maxWidth: 560 },
  field: { display: "flex", flexDirection: "column", gap: 6 },
  label: { fontSize: 14, fontWeight: 600, color: "#2D5F4C" },
  input: {
    padding: "12px 14px",
    fontSize: 16,
    border: "1px solid #D8DED5",
    borderRadius: 8,
    fontFamily: "inherit",
  },
  textarea: {
    padding: "12px 14px",
    fontSize: 16,
    border: "1px solid #D8DED5",
    borderRadius: 8,
    fontFamily: "inherit",
    minHeight: 120,
    resize: "vertical",
  },
  error: { fontSize: 13, color: "#B3261E", margin: 0 },
  generalError: {
    padding: "12px 16px",
    backgroundColor: "#FBEFE6",
    border: "1px solid #E8C4A8",
    borderRadius: 8,
    color: "#8A3B1E",
    fontSize: 14,
  },
  submit: {
    padding: "14px 24px",
    fontSize: 16,
    fontWeight: 600,
    color: "#FCFAF5",
    backgroundColor: "#2D5F4C",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  submitDisabled: { opacity: 0.6, cursor: "not-allowed" },
};

export default function EntryForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contributor, setContributor] = useState("");
  const [place, setPlace] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setGeneralError(null);

    const trimmed = {
      title: title.trim(),
      description: description.trim(),
      contributor: contributor.trim(),
      place: place.trim(),
    };

    const fieldErrors = validateEntry({ ...trimmed, photoFile });
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const supabase = createClient();

    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        throw new Error("not authenticated");
      }
      const userId = userData.user.id;

      // Random filename, never the one the browser reports — prevents
      // path traversal and silently overwriting someone else's file.
      const ext = extensionForPhotoType(photoFile.type);
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(path, photoFile, { contentType: photoFile.type });

      if (uploadError) {
        console.error("Photo upload failed:", uploadError);
        setGeneralError("We couldn't upload that photo. Please try again.");
        setSubmitting(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("photos").getPublicUrl(path);

      const { data: inserted, error: insertError } = await supabase
        .from("entries")
        .insert({
          title: trimmed.title,
          description: trimmed.description,
          contributor: trimmed.contributor,
          place: trimmed.place || null,
          photo_url: urlData.publicUrl,
          owner: userId, // from the session, never from the form
        })
        .select()
        .single();

      if (insertError || !inserted) {
        console.error("Entry save failed:", insertError);
        setGeneralError("We couldn't save your entry. Please try again.");
        setSubmitting(false);
        return;
      }

      router.push(`/entries/${inserted.id}`);
    } catch (err) {
      console.error("Unexpected error saving entry:", err);
      setGeneralError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {generalError && <p style={styles.generalError}>{generalError}</p>}

      <div style={styles.field}>
        <label style={styles.label} htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
          className="auth-input"
        />
        {errors.title && <p style={styles.error}>{errors.title}</p>}
      </div>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
          className="auth-input"
        />
        {errors.description && <p style={styles.error}>{errors.description}</p>}
      </div>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="contributor">Contributor</label>
        <input
          id="contributor"
          type="text"
          value={contributor}
          onChange={(e) => setContributor(e.target.value)}
          style={styles.input}
          className="auth-input"
        />
        {errors.contributor && <p style={styles.error}>{errors.contributor}</p>}
      </div>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="place">Place (optional)</label>
        <input
          id="place"
          type="text"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          style={styles.input}
          className="auth-input"
        />
        {errors.place && <p style={styles.error}>{errors.place}</p>}
      </div>

      <div style={styles.field}>
        <label style={styles.label} htmlFor="photo">Photo</label>
        <input
          id="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setPhotoFile(e.target.files?.[0] ?? null)}
        />
        {errors.photo && <p style={styles.error}>{errors.photo}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        style={{ ...styles.submit, ...(submitting ? styles.submitDisabled : {}) }}
      >
        {submitting ? "Saving…" : "Save entry"}
      </button>
    </form>
  );
}