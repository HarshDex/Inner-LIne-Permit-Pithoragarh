import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useParams } from "react-router-dom";

export default function Verify() {
  const { hash } = useParams();
const [imageUrl, setImageUrl] = useState(null);

useEffect(() => {
  async function fetchImage() {
    console.log("Checking hash:", hash);
    const { data, error } = await supabase
      .from("passes")
      .select("*")
      .eq("random_hash", hash)
      .single();

    if (error || !data) {
      console.error("Lookup error:", error);
      alert("Invalid pass");
      return;
    }

    const { data: publicUrlData } = supabase
      .storage
      .from("uploads")
      .getPublicUrl(data.storage_path);

    setImageUrl(publicUrlData.publicUrl);
  }
  fetchImage();
}, [hash]);


  return (
    <div style={{ textAlign: "center", marginTop: 40 }}>
      <h2>IL-PASS Verification</h2>
      {imageUrl ? (
        <img src={imageUrl} alt="ILP" style={{ maxWidth: "100%" }} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
