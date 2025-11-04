import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Verify() {
  const { ilp, month, year, hash } = useParams();
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getImage() {
      try {
        const { data, error } = await supabase
          .from("passes")
          .select("*")
          .eq("random_hash", hash)
          .single();

        if (error || !data) {
          setError("Record not found!");
          return;
        }

        // Build full public Supabase URL (since bucket is public)
        const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/uploads`;
        const fullUrl = `${baseUrl}/${data.storage_path}`;
        setImageUrl(fullUrl);
      } catch (err) {
        console.error(err);
        setError("Something went wrong");
      }
    }

    getImage();
  }, [hash]);

  if (error)
    return (
      <div style={{ textAlign: "center", color: "red", marginTop: 40 }}>
        {error}
      </div>
    );

  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>IL-PASS-{ilp} — {month}-{year}</h2>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="ILP"
          style={{
            maxWidth: "100%",
            borderRadius: 8,
            boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
