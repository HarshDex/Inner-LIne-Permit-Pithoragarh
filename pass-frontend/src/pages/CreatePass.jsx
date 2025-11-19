import React, { useState } from "react";
import "./CreatePass.css";

export default function CreatePass() {
  const ADMIN_PASSWORD = "NATURE@4917";

  const [enteredPassword, setEnteredPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const [form, setForm] = useState({
    ilpNumber: "",
    month: "",
    year: "",
    name: "",
    co: "",
    address: "",
    profession: "",
    idMark: "",
    mobile: "",
    issuedFrom: "",
    validTill: ""
  });

  const [url, setUrl] = useState("");

  function verifyAdmin(e) {
    e.preventDefault();
    if (enteredPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
    } else {
      alert("Incorrect Password!");
    }
  }

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/create-pass`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Something went wrong!");
        return;
      }

      setUrl(data.verifyUrl);
    } catch {
      alert("Network error");
    }
  }

  // 🔐 ADMIN LOGIN SCREEN
  if (!isAdmin) {
    return (
      <div className="admin-wrapper">
        <div className="admin-title">Admin Login</div>

        <form onSubmit={verifyAdmin}>
          <input
            className="admin-input"
            type="password"
            placeholder="Enter Admin Password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
            required
          />

          <button className="admin-btn" type="submit">
            Login
          </button>
        </form>
      </div>
    );
  }

  // FORM UI
  return (
    <div className="form-container">
      <h2>Create Pass</h2>

      <form onSubmit={submit}>
        <label>ILP Number</label>
        <input name="ilpNumber" value={form.ilpNumber} onChange={update} required />

        <label>Month</label>
        <input name="month" value={form.month} onChange={update} required />

        <label>Year</label>
        <input name="year" value={form.year} onChange={update} required />

        <label>Name</label>
        <input name="name" value={form.name} onChange={update} required />

        <label>C/O</label>
        <input name="co" value={form.co} onChange={update} />

        <label>Address</label>
        <textarea name="address" value={form.address} onChange={update} />

        <label>Profession</label>
        <input name="profession" value={form.profession} onChange={update} />

        <label>ID Mark</label>
        <input name="idMark" value={form.idMark} onChange={update} />

        <label>Mobile</label>
        <input name="mobile" value={form.mobile} onChange={update} />

        <label>Issued From</label>
        <input type="date" name="issuedFrom" value={form.issuedFrom} onChange={update} />

        <label>Valid Till</label>
        <input type="date" name="validTill" value={form.validTill} onChange={update} />

        <button className="submit-btn" type="submit">
          Create Pass
        </button>
      </form>

      {url && (
        <div style={{ marginTop: 20 }}>
          <h3>Your Verification URL:</h3>
          <a href={url} target="_blank">{url}</a>
        </div>
      )}
    </div>
  );
}
