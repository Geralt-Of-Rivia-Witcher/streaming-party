import { useState } from "react";
import "./App.css";
import VideoPlayerPage from "./VideoPlayerPage";

function App() {
  const [filename, setFilename] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPlayer, setShowPlayer] = useState(false);

  const handleFetchUrl = async () => {
    if (!filename) {
      setError("Please enter a filename.");
      return;
    }
    setLoading(true);
    setError("");
    setVideoUrl("");
    try {
      const res = await fetch(
        `${
          process.env.REACT_APP_BACKEND_URL
        }/media/signed-url/${encodeURIComponent(filename)}`
      );
      if (!res.ok) throw new Error("Failed to fetch signed URL");
      const url = await res.text();
      if (!url) throw new Error("No URL returned");
      setVideoUrl(url);
      setShowPlayer(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (showPlayer && videoUrl) {
    return (
      <VideoPlayerPage url={videoUrl} onBack={() => setShowPlayer(false)} />
    );
  }

  return (
    <div className="streaming-party-container">
      <h1>Streaming Party</h1>
      <div className="input-section">
        <input
          type="text"
          placeholder="Enter video filename (e.g. WednesdayS02E05.mkv)"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
        />
        <button onClick={handleFetchUrl} disabled={loading}>
          {loading ? "Loading..." : "Play"}
        </button>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default App;
