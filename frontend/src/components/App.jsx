import React from "react";
import { Routes, Route } from "react-router-dom";
import Connexion from "../pages/Connexion.jsx";
import Inscription from "../pages/Inscription.jsx";
import Home from "../pages/Home.jsx";
import CreatePost from "../pages/CreatePost.jsx";

import "../styles/sass/Base/_base.scss";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/posts" element={<Home />} />
        <Route path="/post" element={<CreatePost />} />
      </Routes>
    </>
  );
}

export default App;
