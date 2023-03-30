import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";

import "../styles/sass/Pages/_affichePost.scss";
import "../styles/sass/Composants/_buttons.scss";

function AffichePost() {
  const { id } = useParams();

  const [post, setPost] = useState("");
  const [pseudo, setPseudo] = useState("");

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
        //console.log("Détails du Post : ", data);
        setPost(data);
        //console.log("Pseudo du User : ", data.user.pseudo);
        setPseudo(data.user.pseudo);
      })
      .catch((err) => console.error("Error:", err));
  }, [id]);

  const navigate = useNavigate();
  function deletePost(e) {
    e.preventDefault();
    let confirm = window.confirm("Suppression du post ?");
    if (confirm === true) {
      // Récupérartion du token (de localstorage)
      const token = localStorage.getItem("token");
      const authorization = `Bearer ${token}`;
      //console.log(token);
      fetch("http://localhost:3000/api/post/" + id, {
        method: "DELETE",
        headers: {
          Authorization: authorization,
        },
      })
        .then(function (response) {
          return response.json();
        })
        .then((data) => {
          console.log("Réponse du serveur à mon fetch : ", data);
          navigate("/post");
        })
        .catch(function (error) {
          console.error("Error:", error);
        });
    }
  }

  return (
    <>
      <Header />
      <div id="titre_page">
        <h1 className="post_titre">{post.titre}</h1>
      </div>
      <div className="post">
        <div className="post_descript">
          <h2 className="post_auteur">{pseudo}</h2>
          <p className="post_contenu">{post.contenu}</p>
          <div className="post_icon">
            <div className="icon_like">
              <i className="far fa-thumbs-up"></i>
              <i className="fas fa-thumbs-up like"></i>
              <p>0</p>
            </div>
            <div className="icon_dislike">
              <i className="far fa-thumbs-down"></i>
              <i className="fas fa-thumbs-down dislike"></i>
              <p>0</p>
            </div>
          </div>
          <div className="post_btn">
            <button className="btn_retour" type="button" value="Retour">
              <a href="/post">Retour</a>
            </button>
            <button className="btn_modifier" type="submit" value="Modifier">
              <Link
                to={"/update-post/" + post.id}
                className="btn_modifier-lien"
                key={post.id}
              >
                Modifier
              </Link>
            </button>
            <button
              className="btn_supprimer"
              type="submit"
              value="Supprimer"
              onClick={deletePost}
            >
              Supprimer
            </button>
          </div>
        </div>
        <div className="post_img">
          {post.imageUrl ? (
            <img src={post.imageUrl} alt="Illustration du post" />
          ) : (
            <p>Aucune photo</p>
          )}
        </div>
      </div>
    </>
  );
}

export default AffichePost;
