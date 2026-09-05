const styles = {
  card: {
    marginTop: 24,
    padding: 24,
    backgroundColor: "#FFFBF0",
    border: "1px solid #D4AF37",
    borderRadius: 10,
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: 6,
    marginBottom: 16,
    display: "block",
  },
  label: {
    fontFamily: "'Courier New', monospace",
    fontSize: 12,
    color: "#A6192E",
    margin: "12px 0 0",
  },
  value: {
    fontSize: 16,
    margin: "6px 0 0",
    color: "#3D2817",
  },
};

export default function EntryCard({ image, title, description, contributor, place }) {
  return (
    <div style={styles.card}>
      {image && <img src={image} alt={title} style={styles.image} />}

      <p style={styles.label}>TITLE</p>
      <p style={styles.value}>{title}</p>

      <p style={styles.label}>DESCRIPTION</p>
      <p style={styles.value}>{description}</p>

      <p style={styles.label}>CONTRIBUTOR</p>
      <p style={styles.value}>{contributor}</p>

      <p style={styles.label}>PLACE</p>
      <p style={styles.value}>{place}</p>
    </div>
  );
}