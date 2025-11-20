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

  // -------------------------------
  // EXPIRED CHECK FUNCTION
  // -------------------------------
  function isExpired(dateString) {
    const today = new Date();
    const validity = new Date(dateString);
    return today > validity;
  }

  // -------------------------------
  // CUSTOM DATE FORMATTER
  // -------------------------------
  function formatDate(dateString) {
    const date = new Date(dateString);
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    };
    const formatted = date.toLocaleString("en-US", options);
    return `${formatted} 12:00 AM`;
  }

  // -------------------------------
  // LOAD PASS DATA
  // -------------------------------
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

  // -------------------------------
  // GENERATE QR AFTER PASS LOADS
  // -------------------------------
  useEffect(() => {
    if (!pass) return;

    const verifyUrl = `${window.location.origin}/verify/${passId}/${token}`;

    QRCode.toDataURL(verifyUrl, {
      margin: 0,
      scale: 12,
      color: {
        dark: isExpired(pass.validTill) ? "#ff0000ff" : "#008000",
        light: "#FFFFFF"
      }
    }).then(url => setQrDataUrl(url));
  }, [pass]);

  // -------------------------------
  // STATE CHECKS
  // -------------------------------
  if (error) return <div style={{ padding: 20, fontSize: 22 }}>{error}</div>;
  if (!pass) return <div style={{ padding: 20, fontSize: 22 }}>Loading…</div>;

  // -------------------------------
  // RETURN UI
  // -------------------------------
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
          <div
            style={{ whiteSpace: "pre-line" }}
            className="passAddress"
          >
            {pass.address}
          </div>
          <br />
          <div style={{ marginTop: 10 }}>
            PROFESSION: {pass.profession || "OTHER"}
          </div>
          <div>ID MARK: {pass.idMark || "NONE"}</div>
          <div>MOBILE: {pass.mobile}</div>
        </div>

        {qrDataUrl && (
          <img src={qrDataUrl} alt="QR Code" className="pass-qr" />
        )}
      </div>

      <div className="pass-section">
        <div className="pass-title">Pass Details</div>
        <hr className="line" />

        <div className="pass-permission">
          Permission For : <b>आदि कैलाश एवं ऊँ पर्वत</b> Track for 4 Days
        </div>

        <div className="pass-issued">
          Issued From: {formatDate(pass.issuedFrom)}
        </div>

        <div style={{marginBottom: "15px",marginTop:"7px"}}>
          Validity: {formatDate(pass.validTill)}
        </div>

        <div className="pass-authority">
          ISSUING AUTHORITY: SDM DHARCHULA 000000000
        </div>
      </div>

      {/* VALID / EXPIRED BOX */}
      <div
        className="pass-valid"
        style={{
          background: isExpired(pass.validTill) ? "#E17B7D" : "#35c267"
        }}
      >
        {isExpired(pass.validTill) ? "PASS EXPIRED" : "VALID"}
      </div>

      <img src={signatureImg} className="pass-signature" />
      <img src={bottomMountain} className="pass-bottom-image" />
    </div>
  );
}
