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

  if (!title.trim()) {
    errors.title = "Title is required.";
  } else if (title.trim().length > LIMITS.title) {
    errors.title = `Keep it under ${LIMITS.title} characters.`;
  }

  if (!description.trim()) {
    errors.description = "Description is required.";
  } else if (description.trim().length > LIMITS.description) {
    errors.description = `Keep it under ${LIMITS.description} characters.`;
  }

  if (!contributor.trim()) {
    errors.contributor = "Contributor is required.";
  } else if (contributor.trim().length > LIMITS.contributor) {
    errors.contributor = `Keep it under ${LIMITS.contributor} characters.`;
  }

  if (place.trim().length > LIMITS.place) {
    errors.place = `Keep it under ${LIMITS.place} characters.`;
  }

  if (photoRequired && !photoFile) {
    errors.photo = "A photo is required.";
  } else if (photoFile) {
    if (!extensionForPhotoType(photoFile.type)) {
      errors.photo = "Photo must be a JPEG, PNG, or WebP image.";
    } else if (photoFile.size > MAX_PHOTO_BYTES) {
      errors.photo = "Photo must be under 5 MB.";
    }
  }

  return errors;
}