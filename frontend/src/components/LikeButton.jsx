import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import "../styles/sass/Composants/_like-unlike.scss";

function LikeButton({ post, user, like }) {
  // 'post' et 'user' : props récupérés (envoyé avec le composant 'LikeButton' dans 'AffichePost')
  const { id } = useParams();

  const [likeValue, setLikeValue] = useState(0);

  function addLike() {
    setLikeValue(likeValue + 1);
    createLike();
  }

  function supLike() {
    setLikeValue(likeValue - 1);
    deleteLike();
  }

  // Pour CREER un like
  async function createLike() {
    // Récupérartion du token (de localstorage)
    const token = localStorage.getItem("token");
    const authorization = `Bearer ${token}`;
    //console.log(token);

    await fetch("http://localhost:3000/api/like/post/" + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify({
        userId: user.id,
        postId: post.id,
        valeur: likeValue,
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

  // Pour SUPPRIMER un like
  function deleteLike() {
    // Récupérartion du token (de localstorage)
    const token = localStorage.getItem("token");
    const authorization = `Bearer ${token}`;
    //console.log(token);
    fetch("http://localhost:3000/api/like/" + like.id, {
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
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  }

  return (
    <>
      {/* LIKE */}
      <div className="icon_like">
        <i
          key={like.id}
          className={
            likeValue === 0 ? "far fa-thumbs-up" : "fas fa-thumbs-up like"
          }
          onClick={addLike()}
        >
          <p>id du like : {like.id}</p>
          <p className="likeValue">valeur du like : {likeValue}</p>
        </i>
      </div>
      {/* UNLIKE */}
      <div className="icon_unlike">
        <i className={"fas fa-thumbs-down unlike"} onClick={supLike()}></i>
      </div>
    </>
  );
}
export default LikeButton;
