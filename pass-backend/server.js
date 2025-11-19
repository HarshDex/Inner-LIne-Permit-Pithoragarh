// server.js
const express = require('express');
const cors = require("cors");
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_DIR = path.join(__dirname, 'data');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(bodyParser.json());
app.use(cors());


// Create passId
function makePassId(number, month, year) {
  const n = String(number).trim();
  const m = String(month).trim();
  const y = String(year).trim();
  return `IL-PASS-${n}-${m}-${y}`;
}

// Generate secure token
function genToken() {
  return crypto.randomBytes(32).toString('hex'); // 64 chars
}

// POST: create pass
app.post('/api/create-pass', (req, res) => {
  try {
    const {
      ilpNumber,
      month,
      year,
      name,
      co,
      address,
      profession,
      idMark,
      mobile,
      issuedFrom,
      validTill
    } = req.body;

    // Required fields
    if (!ilpNumber || !month || !year || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const passId = makePassId(ilpNumber, month, year);
    const token = genToken();

    const pass = {
      passId,
      ilpNumber,
      month,
      year,
      name,
      co: co || "",
      address: address || "",
      profession: profession || "",
      idMark: idMark || "",
      mobile: mobile || "",
      issuedFrom: issuedFrom || null,
      validTill: validTill || null,
      token,
      createdAt: new Date().toISOString(),
      status: "valid"
    };

    const filePath = path.join(DATA_DIR, `${passId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(pass, null, 2), "utf8");

    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const verifyUrl = `${baseUrl}/verify/${encodeURIComponent(passId)}/${token}`;

    return res.json({ pass, verifyUrl });

  } catch (err) {
    console.error("Error creating pass:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET: fetch pass
app.get('/api/pass/:passId/:token', (req, res) => {
  try {
    const { passId, token } = req.params;
    const filePath = path.join(DATA_DIR, `${passId}.json`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: "Pass not found" });
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (data.token !== token) {
      return res.status(404).json({ error: "Invalid token" });
    }

    return res.json({ pass: data });

  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// HEALTH CHECK
app.get('/api/health', (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
