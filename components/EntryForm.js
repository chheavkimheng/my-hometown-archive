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
  currentPhoto: { width: 160, borderRadius: 8, marginBottom: 8, display: "block" },
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

export default function EntryForm({ entry }) {
  const isEdit = Boolean(entry);
  const [title, setTitle] = useState(entry?.title ?? "");
  const [description, setDescription] = useState(entry?.description ?? "");
  const [contributor, setContributor] = useState(entry?.contributor ?? "");
  const [place, setPlace] = useState(entry?.place ?? "");
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

    const photoRequired = !isEdit || !entry?.image;
    const fieldErrors = validateEntry({ ...trimmed, photoFile, photoRequired });
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

      let photoUrl = entry?.image ?? null;

      if (photoFile) {
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
        photoUrl = urlData.publicUrl;
      }

      const payload = {
        title: trimmed.title,
        description: trimmed.description,
        contributor: trimmed.contributor,
        place: trimmed.place || null,
        photo_url: photoUrl,
      };

      let savedId;

      if (isEdit) {
        const { data: updated, error: updateError } = await supabase
          .from("entries")
          .update(payload)
          .eq("id", entry.id)
          .select();

        if (updateError || !updated || updated.length === 0) {
          console.error("Update failed:", updateError);
          setGeneralError("That change wasn't saved.");
          setSubmitting(false);
          return;
        }
        savedId = updated[0].id;
      } else {
        const { data: inserted, error: insertError } = await supabase
          .from("entries")
          .insert({ ...payload, owner: userId }) // owner from the session, never from the form
          .select()
          .single();

        if (insertError || !inserted) {
          console.error("Entry save failed:", insertError);
          setGeneralError("We couldn't save your entry. Please try again.");
          setSubmitting(false);
          return;
        }
        savedId = inserted.id;
      }

      router.push(`/entries/${savedId}`);
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
        <label style={styles.label} htmlFor="photo">
          Photo{isEdit ? " (optional — leave blank to keep the current one)" : ""}
        </label>
        {isEdit && entry?.image && (
          <img src={entry.image} alt="Current" style={styles.currentPhoto} />
        )}
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
        {submitting ? "Saving…" : isEdit ? "Save changes" : "Save entry"}
      </button>
    </form>
  );
}