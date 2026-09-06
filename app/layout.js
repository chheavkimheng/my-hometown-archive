import "./globals.css";
import collection from "../collection.config.js";
import { LanguageProvider } from "../context/LanguageContext.js";
import Header from "../components/Header.js";
import Footer from "../components/Footer.js";

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "#F7F3EC",
          color: "#2B2B2B",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          minHeight: "100vh",
        }}
      >
        <LanguageProvider>
          <Header />
          {children}
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}