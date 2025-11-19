import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import CreatePass from "./pages/CreatePass";
import VerifyPass from "./pages/VerifyPass";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreatePass />} />
        <Route path="/create" element={<CreatePass />} />
        <Route path="/verify/:passId/:token" element={<VerifyPass />} />
      </Routes>
    </Router>
  );
}

export default App;
