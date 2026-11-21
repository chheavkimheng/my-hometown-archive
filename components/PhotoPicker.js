"use client";

import { useEffect, useState } from "react";

function CameraIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2D5F4C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

export default function PhotoPicker({
  id,
  file,
  currentImage,
  onChange,
  chooseLabel,
  changeLabel,
  hint,
  error,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragging, setDragging] = useState(false);

  // A preview of the chosen file. The temporary address is released when it changes.
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const shown = previewUrl || currentImage;

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) onChange(dropped);
  }

  return (
    <div className="form-field">
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="visually-hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      <label
        htmlFor={id}
        className={`dropzone ${dragging ? "is-dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        {shown ? <img src={shown} alt="" className="dropzone-preview" /> : <CameraIcon />}
        <span className="dropzone-action">{shown ? changeLabel : chooseLabel}</span>
        <span className="dropzone-hint">{hint}</span>
      </label>
      {error && <p className="form-error" role="alert">{error}</p>}
    </div>
  );
}