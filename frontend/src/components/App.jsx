import React from "react";
import { Routes, Route } from "react-router-dom";
import Connexion from "../pages/Connexion.jsx";
import Inscription from "../pages/Inscription.jsx";
import Home from "../pages/Home.jsx";
import CreatePost from "../pages/CreatePost.jsx";
import AffichePost from "../pages/AffichePost.jsx";
import UpdatePost from "../pages/UpdatePost.jsx";

import "../styles/sass/Base/_base.scss";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/post" element={<Home />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/post/:id" element={<AffichePost />} />
        <Route path="/update-post/:id" element={<UpdatePost />} />
      </Routes>
    </>
  );
}

export default App;
