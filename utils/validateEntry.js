// utils/validateEntry.js
//
// Field rules for a contribution, agreed on in Lab 7 Step 3. Shared by
// the contribute form and the edit form, so the rules only ever live
// in one place. Each error is a key into data/translations.js (plus a
// number when it needs one), so the form can show it in either language.

import { CATEGORIES } from "../data/entryOptions.js";

// Rules you may want to flip. With the Khmer fields required, English is optional;
// set REQUIRE_ENGLISH to true if every entry must have both languages.
export const REQUIRE_KHMER = true;
export const REQUIRE_ENGLISH = false;

// Fewest and most characters each field accepts. The maximums match the database checks.
export const LIMITS = {
  title: { min: 3, max: 100 },
  description: { min: 20, max: 1000 },
  contributor: { min: 2, max: 100 },
  place: { min: 2, max: 150 },
  source: { min: 2, max: 150 },
};

const ALLOWED_PHOTO_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export const MAX_PHOTO_BYTES = 5 * 1024 * 1024; // 5 MB, matches the Storage bucket limit

export function extensionForPhotoType(type) {
  return ALLOWED_PHOTO_TYPES[type] ?? null;
}

// Khmer letters, vowel signs and digits all live in the Unicode block U+1780 to U+17FF.
const KHMER_CHARACTERS = /[\u1780-\u17FF]/g;
const LATIN_LETTERS = /[A-Za-z]/g;

// "Written in Khmer" means Khmer characters are present and at least as common as Latin letters,
// so a name or a few English words are fine but a sentence in English is not.
function isMostlyKhmer(text) {
  const khmer = (text.match(KHMER_CHARACTERS) ?? []).length;
  const latin = (text.match(LATIN_LETTERS) ?? []).length;
  return khmer > 0 && khmer >= latin;
}

function lengthError(text, { min, max }) {
  const length = [...text.trim()].length;
  if (length < min) return { key: "error_too_short", min };
  if (length > max) return { key: "error_too_long", max };
  return null;
}

// Empty is fine when the field is optional. Otherwise the text has to pass the Khmer rule
// (for the Khmer fields) and then the length rule.
function textError(text, rule, { requiredKey = null, khmer = false } = {}) {
  if (!text.trim()) return requiredKey ? { key: requiredKey } : null;
  if (khmer && !isMostlyKhmer(text)) return { key: "error_khmer_only" };
  return lengthError(text, rule);
}

// photoRequired: true when creating (always need a photo), or when
// editing an entry that doesn't already have one. False when editing
// an entry that already has a photo and the user didn't pick a new one.
export function validateEntry({
  title,
  titleKm,
  description,
  descriptionKm,
  contributor,
  place,
  source,
  category,
  photoFile,
  photoRequired = true,
}) {
  const errors = {};
  const set = (field, error) => {
    if (error) errors[field] = error;
  };

  set("title", textError(title, LIMITS.title, {
    requiredKey: REQUIRE_ENGLISH ? "error_title_required" : null,
  }));
  set("titleKm", textError(titleKm, LIMITS.title, {
    requiredKey: REQUIRE_KHMER ? "error_title_km_required" : null,
    khmer: true,
  }));
  set("description", textError(description, LIMITS.description, {
    requiredKey: REQUIRE_ENGLISH ? "error_description_required" : null,
  }));
  set("descriptionKm", textError(descriptionKm, LIMITS.description, {
    requiredKey: REQUIRE_KHMER ? "error_description_km_required" : null,
    khmer: true,
  }));

  // Never save an entry with no title or description in either language.
  if (!title.trim() && !titleKm.trim() && !errors.title && !errors.titleKm) {
    errors.title = { key: "error_title_required" };
  }
  if (!description.trim() && !descriptionKm.trim() && !errors.description && !errors.descriptionKm) {
    errors.description = { key: "error_description_required" };
  }

  set("contributor", textError(contributor, LIMITS.contributor, {
    requiredKey: "error_contributor_required",
  }));
  set("place", textError(place, LIMITS.place));
  set("source", textError(source, LIMITS.source, { requiredKey: "error_source_required" }));

  if (!CATEGORIES.includes(category)) {
    errors.category = { key: "error_category_required" };
  }

  if (photoRequired && !photoFile) {
    errors.photo = { key: "error_photo_required" };
  } else if (photoFile) {
    if (!extensionForPhotoType(photoFile.type)) {
      errors.photo = { key: "error_photo_type" };
    } else if (photoFile.size > MAX_PHOTO_BYTES) {
      errors.photo = { key: "error_photo_size" };
    }
  }

  return errors;
}