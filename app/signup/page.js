"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "../../utils/supabase/client.js";

const styles = {
  title: {
    fontFamily: "Georgia, 'Times New Roman', serif",
    fontSize: 32,
    fontWeight: 700,
    color: "#2D5F4C",
    marginBottom: 24,
  },
  form: {
    maxWidth: 400,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: "#2B2B2B",
    marginBottom: 4,
    display: "block",
  },
  input: {
    width: "100%",
    padding: "12px 16px",
    fontSize: 16,
    color: "#2B2B2B",
    backgroundColor: "#FCFAF5",
    border: "1px solid #D8DED5",
    borderRadius: 8,
    boxSizing: "border-box",
  },
  button: {
    padding: "12px 24px",
    fontSize: 16,
    fontWeight: 600,
    color: "#FCFAF5",
    backgroundColor: "#2D5F4C",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  error: {
    fontSize: 14,
    color: "#B22234",
    margin: 0,
  },
  switchLink: {
    fontSize: 14,
    color: "#2B2B2B",
    marginTop: 8,
  },
};

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (signUpError) {
      setError("Could not create account. Please try again.");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main className="page-container">
      <h1 style={styles.title}>Sign Up</h1>
      <form style={styles.form} onSubmit={handleSubmit}>
        <div>
          <label style={styles.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div>
          <label style={styles.label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={styles.input}
          />
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
      <p style={styles.switchLink}>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </main>
  );
}