import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Upload from "./pages/Upload.jsx";
import Verify from "./pages/Verify.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Upload />} />
      <Route path="/verify/IL-PASS-:ilp/:hash" element={<Verify />} />
    </Routes>
  </BrowserRouter>
);
