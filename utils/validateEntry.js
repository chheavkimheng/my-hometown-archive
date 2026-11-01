// utils/validateEntry.js
//
// Field rules for a contribution, agreed on in Lab 7 Step 3. Shared by
// the contribute form and the edit form, so the rules only ever live
// in one place.

const LIMITS = {
  title: 100,
  description: 1000,
  contributor: 100,
  place: 150,
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

// photoRequired: true when creating (always need a photo), or when
// editing an entry that doesn't already have one. False when editing
// an entry that already has a photo and the user didn't pick a new one.
export function validateEntry({ title, description, contributor, place, photoFile, photoRequired = true }) {
  const errors = {};

  // Each error is a key into data/translations.js, plus the number it needs, so the form can show it in either language.
  if (!title.trim()) {
    errors.title = { key: "error_title_required" };
  } else if (title.trim().length > LIMITS.title) {
    errors.title = { key: "error_too_long", max: LIMITS.title };
  }

  if (!description.trim()) {
    errors.description = { key: "error_description_required" };
  } else if (description.trim().length > LIMITS.description) {
    errors.description = { key: "error_too_long", max: LIMITS.description };
  }

  if (!contributor.trim()) {
    errors.contributor = { key: "error_contributor_required" };
  } else if (contributor.trim().length > LIMITS.contributor) {
    errors.contributor = { key: "error_too_long", max: LIMITS.contributor };
  }

  if (place.trim().length > LIMITS.place) {
    errors.place = { key: "error_too_long", max: LIMITS.place };
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