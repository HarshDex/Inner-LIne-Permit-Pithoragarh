import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "./VerifyPass.css";

import topMountain from "../assets/topMountain.png";
import signatureImg from "../assets/signature.png";
import bottomMountain from "../assets/bottomMountain.png";
import qrImg from "../assets/qr.png";


export default function VerifyPass() {
  const { passId, token } = useParams();
  const [pass, setPass] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPass() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/pass/${passId}/${token}`
        );

        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Pass not found");
          return;
        }
        setPass(data.pass);
      } catch {
        setError("Network error");
      }
    }

    loadPass();
  }, [passId, token]);

  if (error) return <div style={{ padding: 20, fontSize: 22 }}>{error}</div>;
  if (!pass) return <div style={{ padding: 20, fontSize: 22 }}>Loading…</div>;

  return (
    <div className="pass-container">

      <img src={topMountain} className="pass-top-image" />

      <div className="pass-id">{pass.passId}</div>

      <div className="pass-name">{pass.name}</div>

      <div className="pass-row">
        <div className="pass-left">
          <div><b>C/O</b> {pass.co}</div>
          <div style={{ whiteSpace: "pre-line" }}>{pass.address}</div>

          <div style={{ marginTop: 10 }}>
            <b>PROFESSION:</b> {pass.profession || "OTHER"}
          </div>
          <div><b>ID MARK:</b> {pass.idMark || "NONE"}</div>
          <div><b>MOBILE:</b> {pass.mobile}</div>
        </div>

        {/* Placeholder for QR */}
        <img src={qrImg} alt="QR Code" className="pass-qr" />
      </div>

      <div className="pass-section">
        <hr />
        <div style={{ marginTop: 10, fontWeight: 600 }}>Pass Details</div>

        <div style={{ fontSize: 14, marginTop: 5 }}>
          Permission For : आदि कैलाश एवं ऊँ पर्वत Track for 4 Days
        </div>

        <div style={{ fontSize: 14, marginTop: 5 }}>
          <b>Issued From:</b> {pass.issuedFrom}
        </div>

        <div style={{ fontSize: 14, marginTop: 5 }}>
          <b>Validity:</b> {pass.validTill}
        </div>

        <div style={{ fontSize: 14, marginTop: 5 }}>
          <b>ISSUING AUTHORITY:</b> SDM DHARCHULA 000000000
        </div>
      </div>

      <div className="pass-valid">VALID</div>

      <img src={signatureImg} className="pass-signature" />

      <img src={bottomMountain} className="pass-bottom-image" />

    </div>
  );
}
