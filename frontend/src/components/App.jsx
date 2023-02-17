import React from "react";
import { Routes, Route } from "react-router-dom";
import Connexion from "../pages/Connexion.jsx";
import Inscription from "../pages/Inscription.jsx";
// import Home from "../pages/Home.jsx";

import "../styles/sass/Base/_base.scss";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        {/* <Route path="/posts" element={<Home />} /> */}
      </Routes>
    </>
  );
}

export default App;
