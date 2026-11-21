"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../utils/supabase/client.js";
import {
  validateEntry,
  extensionForPhotoType,
  LIMITS,
  REQUIRE_ENGLISH,
  REQUIRE_KHMER,
} from "../utils/validateEntry.js";
import { CATEGORIES, FESTIVAL_DAYS, TAGS } from "../data/entryOptions.js";
import translations from "../data/translations.js";
import { useLanguage } from "../context/LanguageContext.js";
import SubmissionNotice from "./SubmissionNotice.js";
import FormSection from "./FormSection.js";
import FormField from "./FormField.js";
import TagPicker from "./TagPicker.js";
import PhotoPicker from "./PhotoPicker.js";

export default function EntryForm({ entry }) {
  const isEdit = Boolean(entry);
  const [title, setTitle] = useState(entry?.title ?? "");
  const [titleKm, setTitleKm] = useState(entry?.title_km ?? "");
  const [description, setDescription] = useState(entry?.description ?? "");
  const [descriptionKm, setDescriptionKm] = useState(entry?.description_km ?? "");
  const [contributor, setContributor] = useState(entry?.contributor ?? "");
  const [place, setPlace] = useState(entry?.place ?? "");
  const [source, setSource] = useState(entry?.source ?? "");
  const [category, setCategory] = useState(entry?.category ?? "");
  const [festivalDay, setFestivalDay] = useState(entry?.festival_day ?? "");
  const [tags, setTags] = useState(entry?.tags ?? []);
  const [photoFile, setPhotoFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const { lang } = useLanguage();
  const t = translations[lang]?.ui ?? translations.en.ui;
  const msg = (error) =>
    error
      ? t[error.key].replace("{max}", error.max ?? "").replace("{min}", error.min ?? "")
      : null;
  const counter = (value, rule) => ({ current: [...value].length, max: rule.max });
  const optionalIf = (isRequired) => (isRequired ? "" : ` ${t.form_optional}`);

  const toggleTag = (key) =>
    setTags((current) =>
      current.includes(key) ? current.filter((k) => k !== key) : [...current, key]
    );

  async function handleSubmit(e) {
    e.preventDefault();
    setGeneralError(null);

    const trimmed = {
      title: title.trim(),
      titleKm: titleKm.trim(),
      description: description.trim(),
      descriptionKm: descriptionKm.trim(),
      contributor: contributor.trim(),
      place: place.trim(),
      source: source.trim(),
    };

    const photoRequired = !isEdit || !entry?.image;
    const fieldErrors = validateEntry({ ...trimmed, category, photoFile, photoRequired });
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
          setGeneralError("form_error_upload");
          setSubmitting(false);
          return;
        }

        const { data: urlData } = supabase.storage.from("photos").getPublicUrl(path);
        photoUrl = urlData.publicUrl;
      }

      // If only Khmer was written, it is also saved as the main text, so the entry is never blank.
      const payload = {
        title: trimmed.title || trimmed.titleKm,
        title_km: trimmed.titleKm || null,
        description: trimmed.description || trimmed.descriptionKm,
        description_km: trimmed.descriptionKm || null,
        contributor: trimmed.contributor,
        place: trimmed.place || null,
        source: trimmed.source,
        category,
        festival_day: festivalDay || null,
        tags,
        photo_url: photoUrl,
      };

      let savedId;

      if (isEdit) {
        // Only a reviewer's edit may keep its status; everyone else's goes back to review.
        const { data: isReviewer } = await supabase.rpc("is_reviewer");
        const updatePayload =
          isReviewer === true ? payload : { ...payload, status: "pending" };

        const { data: updated, error: updateError } = await supabase
          .from("entries")
          .update(updatePayload)
          .eq("id", entry.id)
          .select();

        if (updateError || !updated || updated.length === 0) {
          console.error("Update failed:", updateError);
          setGeneralError("form_error_not_saved");
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
          setGeneralError("form_error_save");
          setSubmitting(false);
          return;
        }
        setSubmitted(true);
        return;
      }

      router.push(`/entries/${savedId}`);
    } catch (err) {
      console.error("Unexpected error saving entry:", err);
      setGeneralError("form_error_generic");
      setSubmitting(false);
    }
  }

  if (submitted) {
    return <SubmissionNotice />;
  }

  return (
    <form onSubmit={handleSubmit} className="entry-form">
      {generalError && (
        <p className="form-alert" role="alert">
          {t[generalError]}
        </p>
      )}

      <FormSection title={t.form_section_story}>
        <div className="form-grid">
          <FormField
            id="title"
            label={`${t.form_title_en}${optionalIf(REQUIRE_ENGLISH)}`}
            error={msg(errors.title)}
            count={counter(title, LIMITS.title)}
          >
            <input id="title" type="text" className="form-control" maxLength={LIMITS.title.max} value={title} onChange={(e) => setTitle(e.target.value)} />
          </FormField>
          <FormField
            id="titleKm"
            label={`${t.form_title_km}${optionalIf(REQUIRE_KHMER)}`}
            error={msg(errors.titleKm)}
            hint={t.form_khmer_hint}
            count={counter(titleKm, LIMITS.title)}
          >
            <input id="titleKm" type="text" lang="km" className="form-control" maxLength={LIMITS.title.max} value={titleKm} onChange={(e) => setTitleKm(e.target.value)} />
          </FormField>
          <FormField
            id="description"
            label={`${t.form_description_en}${optionalIf(REQUIRE_ENGLISH)}`}
            error={msg(errors.description)}
            count={counter(description, LIMITS.description)}
          >
            <textarea id="description" className="form-control" maxLength={LIMITS.description.max} value={description} onChange={(e) => setDescription(e.target.value)} />
          </FormField>
          <FormField
            id="descriptionKm"
            label={`${t.form_description_km}${optionalIf(REQUIRE_KHMER)}`}
            error={msg(errors.descriptionKm)}
            hint={t.form_khmer_hint}
            count={counter(descriptionKm, LIMITS.description)}
          >
            <textarea id="descriptionKm" lang="km" className="form-control" maxLength={LIMITS.description.max} value={descriptionKm} onChange={(e) => setDescriptionKm(e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title={t.form_section_details}>
        <div className="form-grid">
          <FormField id="category" label={t.form_category} error={msg(errors.category)}>
            <select id="category" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">{t.form_category_placeholder}</option>
              {CATEGORIES.map((key) => (
                <option key={key} value={key}>{t[`category_${key}`]}</option>
              ))}
            </select>
          </FormField>
          <FormField id="festivalDay" label={`${t.form_day} ${t.form_optional}`}>
            <select id="festivalDay" className="form-control" value={festivalDay} onChange={(e) => setFestivalDay(e.target.value)}>
              <option value="">{t.form_day_placeholder}</option>
              {FESTIVAL_DAYS.map((key) => (
                <option key={key} value={key}>{t[`day_${key}`]}</option>
              ))}
            </select>
          </FormField>
          <FormField id="contributor" label={t.contributor_label} error={msg(errors.contributor)} count={counter(contributor, LIMITS.contributor)}>
            <input id="contributor" type="text" className="form-control" maxLength={LIMITS.contributor.max} value={contributor} onChange={(e) => setContributor(e.target.value)} />
          </FormField>
          <FormField id="place" label={t.form_place} error={msg(errors.place)} count={counter(place, LIMITS.place)}>
            <input id="place" type="text" className="form-control" maxLength={LIMITS.place.max} value={place} onChange={(e) => setPlace(e.target.value)} />
          </FormField>
          <FormField id="source" label={t.source_label} hint={t.form_source_hint} error={msg(errors.source)} count={counter(source, LIMITS.source)} full>
            <input id="source" type="text" className="form-control" maxLength={LIMITS.source.max} value={source} onChange={(e) => setSource(e.target.value)} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title={`${t.form_section_tags} ${t.form_optional}`}>
        <TagPicker options={TAGS} selected={tags} onToggle={toggleTag} labelFor={(key) => t[`tag_${key}`]} />
        <p className="form-hint" style={{ marginTop: 12 }}>{t.form_tags_hint}</p>
      </FormSection>

      <FormSection title={t.form_section_photo}>
        <PhotoPicker
          id="photo"
          file={photoFile}
          currentImage={entry?.image ?? null}
          onChange={setPhotoFile}
          chooseLabel={t.form_photo_choose}
          changeLabel={t.form_photo_change}
          hint={isEdit ? `${t.form_photo_hint} ${t.form_photo_edit_hint}` : t.form_photo_hint}
          error={msg(errors.photo)}
        />
      </FormSection>

      <button type="submit" disabled={submitting} className="form-submit">
        {submitting ? t.form_saving : isEdit ? t.form_save_changes : t.form_save_entry}
      </button>
    </form>
  );
}