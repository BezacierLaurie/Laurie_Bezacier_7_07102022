import React from "react";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import Header from "../components/Header.jsx";

import "../styles/sass/Pages/_createPost.scss";
import "../styles/sass/Composants/_formulaires.scss";
import "../styles/sass/Composants/_buttons.scss";

function UpdatePost() {
  const { id } = useParams();

  const [post, setPost] = useState({});
  const [user, setUser] = useState({});

  const [titrePost, setTitrePost] = useState(post.titre);
  const [contenuPost, setContenuPost] = useState(post.contenu);
  const [imgPost, setImgPost] = useState(post.imgPost);

  // Pour CIBLER le 'input img'
  const refImg = useRef(null);

  // Pour RECUPERER les infos d'un post en particulier et le pseudo du user associé
  useEffect(() => {
    // Récupérartion du token (de localstorage)
    const token = localStorage.getItem("token");
    const authorization = `Bearer ${token}`;
    //console.log(token);
    fetch("http://localhost:3000/api/post/" + id, {
      headers: {
        Authorization: authorization,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Détails du Post : ", data);
        setPost(data);
        //console.log("Pseudo du User : ", data.user.pseudo);
        setUser(data.user.pseudo);
      })
      .catch((err) => console.error("Error:", err));
  }, [id]);

  // Pour MODIFIER un post
  function handleSubmit(e) {
    e.preventDefault();

    let formData = new FormData();
    let fileField = refImg;
    formData.append("titre", titrePost);
    formData.append("contenu", contenuPost);
    formData.append("imageUrl", fileField.files[0]);
    // Valeur du 'Content-Type'
    let contentType;
    if (imgPost === "") {
      console.log("pas d'img");
      contentType = "application/json";
      console.log("Absence d'image : ", contentType);
    } else {
      console.log("img : ", imgPost);
      contentType = "form-data";
      console.log("Présence d'une image : ", contentType);
    }
    // Récupérartion du token (de localstorage)
    const token = localStorage.getItem("token");
    const authorization = `Bearer ${token}`;
    //console.log(token);
    fetch("http://localhost:3000/api/post/", {
      method: "PUT",
      headers: {
        "Content-Type": contentType,
        Authorization: authorization,
      },
      body: JSON.stringify({
        formData,
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
        <h1>Modification d'un post</h1>
      </div>
      <div className="form_creat-post">
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
          {/* Image du post */}
          <label htmlFor="imgPost">Image :</label>
          <div className="form_creat-post_img">
            <p>
              <a className="creatPost_img_lien" href="#newPicture">
                Ajouter une photo
              </a>
            </p>
            <div id="newPicture" className="newPicture">
              <summary>
                <div ref={refImg} id="refImg">
                  <input
                    type="file"
                    name="imgPost"
                    onChange={(e) => setImgPost(e.target.files[0])}
                  />
                  {imgPost ? (
                    <img src={imgPost} alt="Illustration du post" />
                  ) : (
                    <p></p>
                  )}
                </div>
              </summary>
            </div>
          </div>
          {/* Btn */}
          <div className="updatePost_btn">
            <input type="submit" value="Enregister" />
          </div>
        </form>
      </div>
    </>
  );
}

export default UpdatePost;
