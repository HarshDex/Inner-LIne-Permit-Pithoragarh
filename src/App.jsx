import { useState } from "react";
import { supabase } from "./supabaseClient";

function generateHash(len = 32) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from(crypto.getRandomValues(new Uint8Array(len)))
    .map(x => chars[x % chars.length])
    .join('');
}

export default function App() {
  const [ilp, setIlp] = useState("");
  const [month, setMonth] = useState(1);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [link, setLink] = useState(null);

  async function handleUpload() {
    if (!file || !ilp) {
      alert("Please fill all fields!");
      return;
    }

    setUploading(true);
    const year = new Date().getFullYear();
    const hash = generateHash(24);

    const path = `IL-PASS-${ilp}/${year}-${month}/${hash}-${file.name}`;

    // Upload to Supabase public bucket
    const { error: uploadError } = await supabase.storage
      .from("uploads")
      .upload(path, file);

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    // Save record in database
    const { error: dbError } = await supabase.from("passes").insert([
      {
        ilp_number: ilp,
        month,
        year,
        storage_path: path,
        filename: file.name,
        mime_type: file.type,
        random_hash: hash,
      },
    ]);

    if (dbError) {
      alert("Database error: " + dbError.message);
      setUploading(false);
      return;
    }

    // Your final desired link format
    const url = `https://pass.pithorgarh.online/verify/IL-PASS-${ilp}-${month}-${year}/${hash}`;
    setLink(url);
    setUploading(false);
  }

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", textAlign: "center" }}>
      <h2>Create IL-PASS Link</h2>

      <input
        placeholder="Enter ILP Number"
        value={ilp}
        onChange={(e) => setIlp(e.target.value)}
        style={{ marginBottom: 10 }}
      />

      <div>
        <label>Month: </label>
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 10 }}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      </div>

      <button
        onClick={handleUpload}
        disabled={uploading}
        style={{ marginTop: 20 }}
      >
        {uploading ? "Uploading..." : "Create Link"}
      </button>

      {link && (
        <div style={{ marginTop: 20 }}>
          ✅ Your link:<br />
          <a href={link} target="_blank" rel="noreferrer">
            {link}
          </a>
        </div>
      )}
    </div>
  );
}
