import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";

export default function Verify() {
  const { ilp, hash } = useParams();
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPass() {
      const { data, error } = await supabase
        .from("passes")
        .select("*")
        .eq("hash", hash)
        .single();

      if (error || !data) {
        setError("Invalid or missing pass");
        return;
      }

      const { data: publicUrlData } = supabase
        .storage
        .from("uploads")
        .getPublicUrl(data.storage_path);

      setImageUrl(publicUrlData.publicUrl);
    }
    fetchPass();
  }, [hash]);

  if (error) return <h3>{error}</h3>;
  if (!imageUrl) return <h3>Loading...</h3>;

  return (
    <div style={{ textAlign: "center", marginTop: 50 }}>
      <h2>IL-PASS Verified</h2>
      <h4>ILP Number: {ilp}</h4>
      <img src={imageUrl} alt="ILP" style={{ maxWidth: "90%", borderRadius: "10px" }} />
    </div>
  );
}
