import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import Verify from "./pages/Verify.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route
        path="/verify/:slug1-:ilp-:month-:year/:hash"
        element={<Verify />}
      />
    </Routes>
  </BrowserRouter>
);
