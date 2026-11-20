function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

const styles = {
  card: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    backgroundColor: "#FCFAF5",
    border: "1px solid #D8DED5",
    borderRadius: 12,
    overflow: "hidden",
  },
  media: {
    aspectRatio: "4 / 3",
    overflow: "hidden",
    backgroundColor: "#E6EFE9",
  },
  image: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  body: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    padding: "18px 20px 20px",
  },
  title: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 1.3,
    color: "#2D5F4C",
    margin: "0 0 8px",
  },
  excerpt: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "#6B6B63",
    margin: "0 0 14px",
  },
  place: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginTop: "auto",
    fontSize: 13,
    color: "#C97B5B",
  },
};

function PinIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export default function EntryCard({ image, title, description, place }) {
  return (
    <div className="entry-card" style={styles.card}>
      <div style={styles.media}>
        {image && <img src={image} alt={title} style={styles.image} />}
      </div>
      <div style={styles.body}>
        <h2 style={styles.title}>{title}</h2>
        <p style={styles.excerpt}>{truncate(description, 110)}</p>
        {place && (
          <p style={styles.place}>
            <PinIcon />
            {place}
          </p>
        )}
      </div>
    </div>
  );
}