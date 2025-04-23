import { useState } from "react";
import styles from "@/src/styles/components/ScraperForm.module.css";

const ScraperForm = () => {
  const [url, setUrl] = useState("");
  const [depth, setDepth] = useState(10);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const res = await fetch("/api/scrape_post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to scrape: " + data.error);
      setMessage("");
      setLoading(false);
      return;
    }
    setMessage(data.message || "Done!");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.scraperForm}>
      <h2 className={styles.formTitle}>Add Content to Knowledge Base</h2>
      <div className={styles.formGroup}>
        <div className={styles.inputContainer}>
          <label htmlFor="urlInput" className={styles.inputLabel}>
            Website URL
          </label>
          <input
            id="urlInput"
            className={styles.inputField}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to scrape"
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="depthInput" className={styles.inputLabel}>
            Crawl Depth
          </label>
          <input
            id="depthInput"
            className={styles.inputField}
            type="number"
            value={depth}
            onChange={(e) => setDepth(Number(e.target.value))}
            placeholder="Enter depth (default: 10)"
          />
        </div>

        <button
          className={styles.submitButton}
          disabled={loading}
          type="submit"
        >
          {loading ? "Processing..." : "Scrape and Save"}
        </button>
      </div>
      {message && (
        <p className={`${styles.message} ${styles.success}`}>{message}</p>
      )}
      {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}
    </form>
  );
};

export default ScraperForm;
