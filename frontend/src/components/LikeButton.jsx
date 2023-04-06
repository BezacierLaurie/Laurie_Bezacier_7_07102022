import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import "../styles/sass/Composants/_like-unlike.scss";

function LikeButton({ post, user }) {
  // 'post' et 'user' : props récupérés (envoyé avec le composant 'LikeButton' dans 'AffichePost')
  const { id } = useParams();

  const [likes, setLikes] = useState([]);
  const [idLike, setIdLike] = useState("");

  const [likeCount, setLikeCount] = useState(0);
  const [likeValue, setLikeValue] = useState(0);
  const [unlikeValue, setUnlikeValue] = useState(0);

  // LIKE / UNLIKE

  function addLike() {
    setLikeValue(1);
    createLike();
  }

  function supLike() {
    setUnlikeValue(0);
    deleteLike();
  }

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

  // Récupérer l'id d'un like
  useEffect(() => {
    // Récupérartion du token (de localstorage)
    const token = localStorage.getItem("token");
    const authorization = `Bearer ${token}`;
    //console.log(token);

    fetch("http://localhost:3000/api/like/", {
      headers: {
        Authorization: authorization,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("Liste des Likes :", data);
        setLikes(data);
        // setIdLike(likes.map((like) => like.id));
        // console.log(idLike);
      })
      .catch((err) => console.error("Erreur : ", err));
  }, []);

  function deleteLike() {
    // Récupérartion du token (de localstorage)
    const token = localStorage.getItem("token");
    const authorization = `Bearer ${token}`;
    //console.log(token);
    fetch("http://localhost:3000/api/like/" + idLike, {
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
          className={
            likeValue === 0 ? "far fa-thumbs-down" : "fas fa-thumbs-up like"
          }
          onClick={() => addLike()}
        >
          <p className="likeValue">{likeValue}</p>
        </i>
      </div>
      {/* UNLIKE */}
      <div className="icon_unlike">
        <i
          className={"fas fa-thumbs-down unlike"}
          onClick={() => supLike()}
        ></i>
      </div>
    </>
  );
}
export default LikeButton;
