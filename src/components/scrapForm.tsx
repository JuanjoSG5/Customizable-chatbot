// React component
import { useState } from "react";

const ScraperForm = () => {
  const [url, setUrl] = useState("");
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
    <form onSubmit={handleSubmit}>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL to scrape"
      />
      <button disabled={loading} type="submit">Scrape and Save</button>
      <p>
        {message} {error}
      </p>
    </form>
  );
};

export default ScraperForm;
