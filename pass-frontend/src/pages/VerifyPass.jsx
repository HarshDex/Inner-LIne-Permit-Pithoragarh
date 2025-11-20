import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import QRCode from "qrcode";

import "./VerifyPass.css";

import topMountain from "../assets/topMountain.png";
import signatureImg from "../assets/signature.png";
import bottomMountain from "../assets/bottomMountain.png";
import uttarakhandLogo from "../assets/uttarakhandLogo.png";


export default function VerifyPass() {


  const { passId, token } = useParams();
  const [pass, setPass] = useState(null);
  const [error, setError] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");

  const verifyUrl = `${window.location.origin}/verify/${passId}/${token}`;

  QRCode.toDataURL(verifyUrl, {
    margin: 0,
    scale: 12,
    color: {
      dark: "#008000",   // green color EXACT like your sample
      light: "#ffffff"   // white background
    }
  })
  .then(url => setQrDataUrl(url));

  function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    weekday: "short",   // Sat
    month: "short",     // Nov
    day: "numeric",     // 15
    year: "numeric"     // 2025
  };

  const formatted = date.toLocaleString("en-US", options);
  return `${formatted} 12:00 AM`;
}


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
      <div className="pass-id-top">Inner Line Permit / {pass.passId}</div>
      <img src={topMountain} className="pass-top-image" />
      <div className="pass-id">{pass.passId}</div>
      <div className="pass-name">{pass.name}</div>

      <div className="pass-row">
        <img src={uttarakhandLogo} className="uttarakhandLogo" alt="" />
        <div className="pass-left">
          <div>C/O {pass.co}</div>
          <div style={{ whiteSpace: "pre-line" }} className="passAddress">{pass.address}</div>
          <br></br>
          <div style={{ marginTop: 10 }}>
            PROFESSION: {pass.profession || "OTHER"}
          </div>
          <div>ID MARK: {pass.idMark || "NONE"}</div>
          <div>MOBILE: {pass.mobile}</div>
        </div>

        {/* Placeholder for QR */}
        {qrDataUrl && (
          <img src={qrDataUrl} alt="QR Code" className="pass-qr" />
        )}

      </div>

      <div className="pass-section">
        <hr />
        <div className="pass-title">Pass Details</div>

        <div className="pass-permission">
          Permission For : <b>आदि कैलाश एवं ऊँ पर्वत</b> Track for 4 Days
        </div>

        <div className="pass-issued">
          <b>Issued From:</b> {formatDate(pass.issuedFrom)}
        </div>

        <div>
          <b>Validity:</b> {formatDate(pass.validTill)}
        </div>

        <div className="pass-authority">
          <b>ISSUING AUTHORITY:</b> SDM DHARCHULA 000000000
        </div>
      </div>

      <div className="pass-valid">VALID</div>

      <img src={signatureImg} className="pass-signature" />

      <img src={bottomMountain} className="pass-bottom-image" />
    </div>
  );
}
