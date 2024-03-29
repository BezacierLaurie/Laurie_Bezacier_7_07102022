import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";

import "../styles/sass/Composants/_post.scss";
import "../styles/sass/Composants/_formulaires.scss";
import "../styles/sass/Composants/_buttons.scss";
import "../styles/sass/Composants/_img.scss";

function CreatePost() {
  const navigate = useNavigate();

  const [titrePost, setTitrePost] = useState("");
  const [contenuPost, setContenuPost] = useState("");
  const [imgPost, setImgPost] = useState("");

  const [user, setUser] = useState({});

  // Pour RECUPERER 'pseudo' d'un 'user'
  useEffect(() => {
    // Récupérartion du 'userId' (de localStorage)
    const userId = localStorage.getItem("userId");

    // Récupérartion du token (de localStorage)
    const token = localStorage.getItem("token");
    const authorization = `Bearer ${token}`;
    //console.log(token);

    fetch("http://localhost:3000/api/user/" + userId, {
      headers: {
        Authorization: authorization,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //console.log("Détails du User : ", data);
        setUser(data.pseudo);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  // Pour CREER un 'post'
  async function handleSubmit(e) {
    e.preventDefault();

    // Headers du fetch
    // Récupérartion du token (de localstorage)
    const token = localStorage.getItem("token");
    //console.log(token);
    let headersFetch = {
      //"Content-Type": contentType,
      Authorization: `Bearer ${token}`,
    };
    // Valeur du 'Content-Type'
    if (imgPost === "") {
      //console.log("pas d'img");
      headersFetch["Content-Type"] = "application/json";
    }

    // Body du fetch
    let bodyFetch;
    if (imgPost === "") {
      bodyFetch = JSON.stringify({
        titre: titrePost,
        contenu: contenuPost,
      });
    } else {
      let formData = new FormData();
      formData.append("titre", titrePost);
      formData.append("contenu", contenuPost);
      formData.append("image", imgPost);
      bodyFetch = formData;
    }

    await fetch("http://localhost:3000/api/post/", {
      method: "POST",
      headers: headersFetch,
      body: bodyFetch,
    })
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        console.log("Réponse du serveur à mon fetch : ", data);
        // Redirection (page 'Post' = accueil)
        navigate("/post");
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
      <div className="form_create-post">
        <form onSubmit={handleSubmit}>
          {/* Titre du post */}
          <label htmlFor="titrePost">Titre du post :</label>
          <input
            type="text"
            id="titrePost"
            name="titrePost"
            size="20"
            value={titrePost}
            onChange={(e) => setTitrePost(e.target.value)}
            required
          />
          {/* Auteur du post */}
          <label htmlFor="auteurPost">Auteur du post :</label>
          <input
            type="text"
            id="auteurPost"
            name="auteurPost"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            readOnly
            required
          />
          {/* Contenu du post */}
          <label htmlFor="contenuPost">Contenu du post :</label>
          <textarea
            id="contenuPost"
            name="contenuPost"
            rows="10"
            cols="20"
            value={contenuPost}
            onChange={(e) => setContenuPost(e.target.value)}
            required
          ></textarea>
          <br />
          {/* Image du post */}
          <label htmlFor="imgPost">Image :</label>
          <div className="select-img">
            <details className="newPicture">
              <summary className="select-img-lien">
                Sélectionner une image
              </summary>
              <input
                type="file"
                name="imgPost"
                onChange={(e) => setImgPost(e.target.files[0])}
              />
            </details>
          </div>
          {/* Btn */}
          <div className="post_btn">
            <button className="btn_poster" type="submit" value="Poster">
              Poster
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreatePost;
