import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import LikeButton from "../components/LikeButton.jsx";

import "../styles/sass/Composants/_post.scss";
import "../styles/sass/Composants/_buttons.scss";
import "../styles/sass/Composants/_img.scss";

function AffichePost() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState({});
  const [user, setUser] = useState({});
  //const [like, setLike] = useState({});

  const [pseudo, setPseudo] = useState("");

  // Pour RECUPERER les infos d'un 'post' en particulier et le 'pseudo' du 'user' associé
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
        //console.log("Détails du User : ", data.user);
        setUser(data.user);
        //console.log("Pseudo du User : ", data.user.pseudo);
        setPseudo(data.user.pseudo);
        // console.log("Détails du Post : ", data.like)
        //setLike(data.like)
      })
      .catch((err) => console.error("Error:", err));
  }, [id]);

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
          //console.log("Réponse du serveur à mon fetch : ", data);
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
          {/* <div className="post_icon">
            <LikeButton post={post} user={user} like={like}/>
          </div> */}
          <div className="post_btn">
            <button className="btn_retour" type="button" value="Retour">
              <Link to={"/post/"} className="btn_retour-lien">
                Retour
              </Link>
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
        <div className="img-affich">
          {post.imageUrl ? (
            <img src={post.imageUrl} alt="Illustration du post" />
          ) : (
            <p>Aucune image</p>
          )}
        </div>
      </div>
    </>
  );
}

export default AffichePost;
