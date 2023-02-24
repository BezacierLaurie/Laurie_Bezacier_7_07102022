import React from "react";
import { useState } from "react";

import Header from "../components/Header.jsx";

import "../styles/sass/Pages/_createPost.scss";
import "../styles/sass/Composants/_formulaires.scss";
import "../styles/sass/Composants/_buttons.scss";

function CreatePost() {
  const [titrePost, setTitrePost] = useState("");
  const [auteurPost, setAuteurPost] = useState("");
  const [contenuPost, setContenuPost] = useState("");
  const [imgPost, setImgPost] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:3000/api/posts/", {
      method: "POST",
      headers: {
        "Content-Type": "form-data",
        Authorization: process.env.tokenKey,
      },
      body: JSON.stringify({
        titre: titrePost,
        auteur: auteurPost,
        contenu: contenuPost,
        imageUrl: imgPost,
      }),
    })
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        console.log("Réponse du serveur à mon fetch : ", data);
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  }

  return (
    <>
      <Header />
      <div id="titre_page">
        <h1>Création d'un post</h1>
      </div>
      <div className="form_creat-post">
        <form onSubmit={handleSubmit}>
          {/* Titre du post */}
          <label htmlFor="titre">Titre du post :</label>
          <input
            type="text"
            id="creatPost_titre"
            name="titre_post"
            size="20"
            value={titrePost}
            onChange={(e) => setTitrePost(e.target.value)}
            required
          />
          {/* Auteur du post */}
          <label htmlFor="auteur">Auteur du post :</label>
          <input
            type="text"
            id="creatPost_auteur"
            name="auteur_post"
            value={auteurPost}
            onChange={(e) => setAuteurPost(e.target.value)}
            required
          />
          {/* Contenu du post */}
          <label htmlFor="contenu">Contenu du post :</label>
          <textarea
            id="creatPost_contenu"
            name="contenu_post"
            rows="10"
            cols="20"
            value={contenuPost}
            onChange={(e) => setContenuPost(e.target.value)}
            required
          ></textarea>
          {/* Image du post */}
          <div className="creatPost_img">
            <p>
              <a className="creatPost_img_lien" href="#newPicture">Ajouter une photo</a>
            </p>
            <div id="newPicture" className="creatPost_img">
                <input
                  type="submit"
                  value="Insérer une image"
                  onChange={(e) => setImgPost(e.target.value)}
                />
                <img src="#" alt="Illustration du post" />
            </div>
          </div>
          {/* Btn */}
          <div className="creatPost_btn">
            <input type="submit" value="Poster" />
          </div>
        </form>
      </div>
    </>
  );
}

export default CreatePost;
