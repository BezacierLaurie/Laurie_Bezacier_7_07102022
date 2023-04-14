import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import "../styles/sass/Composants/_like-unlike.scss";

function LikeButton({ post, user }) {
  // 'post' et 'user' : props récupérés (envoyé avec le composant 'LikeButton' dans 'AffichePost')
  const { id } = useParams();

  console.log(post);
  const likesPost = post.likes;
  console.log(likesPost);

  const [allLikesPost, setAllLikesPost] = useState([]);
  const [likeValue, setLikeValue] = useState(0);
  const [countLike, setCountLike] = useState(0);

  function addLike() {
    setCountLike(countLike + 1);
    setLikeValue(1);
    createLike();
  }

  function supLike() {
    setCountLike(countLike - 1);
    setLikeValue(0);
    deleteLike();
  }

  // Pour CREER un like
  async function createLike() {
    // Récupérartion du token (de localstorage)
    const token = localStorage.getItem("token");
    const authorization = `Bearer ${token}`;
    //console.log(token);
    await fetch("http://localhost:3000/api/post" + id + "/like", {
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

  // Pour RECUPERER le like du post par le user loggé (par filtrage)
  // Récupérartion du 'userId' (de LocalStorage)
  const userId = localStorage.getItem("userId");
  setAllLikesPost(post.like);
  console.log(allLikesPost);
  console.log(post.like);
  const likesFiltered = allLikesPost.filter((oneLike) => {
    return oneLike.userId === userId;
  });
  console.log(likesFiltered);

  // Pour SUPPRIMER un like
  function deleteLike() {
    // Récupérartion du token (de localstorage)
    const token = localStorage.getItem("token");
    const authorization = `Bearer ${token}`;
    //console.log(token);
    fetch("http://localhost:3000/api/post/" + id + "/like", {
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
      {likesFiltered.map((like) => {
        return (
          <>
            {/* LIKE */}
            <div className="icon_like" key={like.id}>
              <i
                className={
                  likeValue === 0 ? "far fa-thumbs-up" : "fas fa-thumbs-up like"
                }
                onClick={addLike()}
              ></i>
              <p className="likeValue">valeur du like : {likeValue}</p>
              <p className="likeValue">nombre de likes : {countLike}</p>
            </div>
          </>
        );
      })}
      {/* UNLIKE */}
      <div className="icon_unlike">
        <i className={"fas fa-thumbs-down unlike"} onClick={supLike()}></i>
      </div>
    </>
  );
}
export default LikeButton;
