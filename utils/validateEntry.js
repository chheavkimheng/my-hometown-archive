// utils/validateEntry.js
//
// Field rules for a contribution, agreed on in Lab 7 Step 3. Shared by
// the contribute form and the edit form, so the rules only ever live
// in one place. Each error is a key into data/translations.js (plus a
// number when it needs one), so the form can show it in either language.

import { CATEGORIES } from "../data/entryOptions.js";

const LIMITS = {
  title: 100,
  description: 1000,
  contributor: 100,
  place: 150,
  source: 150,
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

const tooLong = (max) => ({ key: "error_too_long", max });

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

  // English or Khmer is enough, so a contributor who only writes Khmer can still contribute.
  if (!title.trim() && !titleKm.trim()) {
    errors.title = { key: "error_title_either" };
  } else if (title.trim().length > LIMITS.title) {
    errors.title = tooLong(LIMITS.title);
  }
  if (titleKm.trim().length > LIMITS.title) {
    errors.titleKm = tooLong(LIMITS.title);
  }

  if (!description.trim() && !descriptionKm.trim()) {
    errors.description = { key: "error_description_either" };
  } else if (description.trim().length > LIMITS.description) {
    errors.description = tooLong(LIMITS.description);
  }
  if (descriptionKm.trim().length > LIMITS.description) {
    errors.descriptionKm = tooLong(LIMITS.description);
  }

  if (!contributor.trim()) {
    errors.contributor = { key: "error_contributor_required" };
  } else if (contributor.trim().length > LIMITS.contributor) {
    errors.contributor = tooLong(LIMITS.contributor);
  }

  if (place.trim().length > LIMITS.place) {
    errors.place = tooLong(LIMITS.place);
  }

  if (!source.trim()) {
    errors.source = { key: "error_source_required" };
  } else if (source.trim().length > LIMITS.source) {
    errors.source = tooLong(LIMITS.source);
  }

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