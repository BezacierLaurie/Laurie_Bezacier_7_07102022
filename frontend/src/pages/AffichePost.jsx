import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
//import LikeButton from "../components/LikeButton.jsx";

import "../styles/sass/Composants/_post.scss";
import "../styles/sass/Composants/_buttons.scss";
import "../styles/sass/Composants/_img.scss";

function AffichePost() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState({});
  const [user, setUser] = useState({});

  const [canUpdateDelete, setCanUpdateDelete] = useState(false);

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
        setPost(data);
        //console.log("Détails du Post : ", data);
        setUser(data.user);
        //console.log("Détails du User : ", data.user);
        //console.log("Pseudo du User : ", data.user.pseudo);
        setCanUpdateDelete(isOwnerOrAdmin(data));
      })
      .catch((err) => console.error("Error:", err));
  }, [id]);

  function deletePost(e) {
    e.preventDefault();

    let confirm = window.confirm("Suppression du post '" + post.titre + "' ?");

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

  // Pour DETERMINER si le user connecté (= loggé), est propriétaire (= owner) ou est administrateur (= admin)
  function isOwnerOrAdmin(post) {
    // Récupérartion du 'userId' (parsé car dans LocalStorage type 'string')
    const userId = JSON.parse(localStorage.getItem("userId"));
    // Récupérartion du 'isAdmin' (parsé car dans LocalStorage type 'string')
    const isAdmin = JSON.parse(localStorage.getItem("isAdmin"));
    // Vérif : Si la clé 'userId' est absente dans LS (= le user ne s'est pas connecté)
    if (userId === null) {
      return false;
    }
    // Si le user connecté est propriétaire (= 'owner')
    if (post.userId === userId) {
      return true;
    }
    // Vérif : Si la clé 'isAdmin' est absente dans LS (= le user ne s'est pas connecté)
    if (isAdmin === null) {
      return false;
    }
    // Vérif : Si 'isAdmin' vaut 'true' dans LS (= le user s'est connecté et est administrateur)
    if (isAdmin === true) {
      return true;
    }
    // Le user est connecté mais n'est ni propriétaire ni administrateur
    return false;
  }

  return(
    if(post==null){
      return(<div>post en cours de chargement ...</div>)
    }
  )

  return (
    <>
      <Header />
      <div id="titre_page">
        <h1 className="post_titre">{post.titre}</h1>
      </div>
      <div className="post">
        <div className="post_descript">
          <h2 className="post_auteur">{user.pseudo}</h2>
          <p className="post_contenu">{post.contenu}</p>
          <div className="post_icon">{/* <LikeButton post={post} /> */}</div>
          <div className="post_btn">
            <button className="btn_retour" type="button" value="Retour">
              <Link to={"/post/"} className="btn_retour-lien">
                Retour
              </Link>
            </button>
            {canUpdateDelete ? (
              <>
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
              </>
            ) : (
              <div></div>
            )}
          </div>
        </div>
        <div className="post_img">
          {post.imageUrl ? (
            <div className="img_affich">
              <img src={post.imageUrl} alt="Illustration du post" />
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </>
  );
}

export default AffichePost;
