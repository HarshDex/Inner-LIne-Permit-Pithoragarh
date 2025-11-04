import { useState } from "react";
import { supabase } from "../supabaseClient";
import { generateHash } from "../utils/hash";

export default function Upload() {
  const [ilp, setIlp] = useState("");
  const [file, setFile] = useState(null);
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!ilp || !file) return alert("Enter ILP number and select image.");

    setLoading(true);

    const hash = await generateHash(ilp);
    const storagePath = `IL-PASS-${ilp}/${hash}-${file.name}`;

    // Upload (replace if already exists)
    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(storagePath, file, { upsert: true });

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      setLoading(false);
      return;
    }

    // Upsert into database
    const { error: dbError } = await supabase
      .from("passes")
      .upsert({
        ilp_number: ilp,
        storage_path: storagePath,
        filename: file.name,
        mime_type: file.type,
        hash,
      }, { onConflict: "ilp_number" });

    if (dbError) {
      alert("Database error: " + dbError.message);
      setLoading(false);
      return;
    }

    const url = `${import.meta.env.VITE_BASE_URL}/verify/IL-PASS-${ilp}/${hash}`;
    setLink(url);
    setLoading(false);
  }

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>Upload IL-PASS</h2>
      <input
        placeholder="Enter ILP Number"
        value={ilp}
        onChange={(e) => setIlp(e.target.value)}
      /><br /><br />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} /><br /><br />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload & Get Link"}
      </button>

      {link && (
        <div style={{ marginTop: 20 }}>
          ✅ Link generated:<br />
          <a href={link} target="_blank" rel="noreferrer">{link}</a>
        </div>
      )}
    </div>
  );
}
