function truncate(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

const styles = {
  card: {
    padding: 20,
    backgroundColor: "#FCFAF5",
    border: "1px solid #D8DED5",
    borderRadius: 10,
    height: "100%",
  },
  image: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    borderRadius: 8,
    marginBottom: 16,
    display: "block",
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: "#2D5F4C",
    margin: "0 0 8px",
  },
  excerpt: {
    fontSize: 14,
    lineHeight: 1.6,
    color: "#6B6B63",
    margin: "0 0 12px",
  },
  place: {
    fontSize: 13,
    color: "#C97B5B",
    margin: 0,
  },
};

export default function EntryCard({ image, title, description, place }) {
  return (
    <div className="entry-card" style={styles.card}>
      {image && <img src={image} alt={title} style={styles.image} />}
      <h2 style={styles.title}>{title}</h2>
      <p style={styles.excerpt}>{truncate(description, 110)}</p>
      <p style={styles.place}>{place}</p>
    </div>
  );
}