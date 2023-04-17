import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import "../styles/sass/Composants/_like-unlike.scss";

function LikeButton({ post }) {
  // 'post' : props récupéré (envoyé avec le composant 'LikeButton' dans 'AffichePost')
  const { id } = useParams();

  // Pour RECUPERER 'userId' (du LS), utilisé dans 'filter'
  const userId = JSON.parse(localStorage.getItem("userId"));

  console.log(post);

  const [likeValue, setLikeValue] = useState(0);
  const [countLike, setCountLike] = useState(0);

  function addLike() {
    setCountLike(countLike + 1);
    setLikeValue(likeValue === 1);
    createLike();
  }

  function supLike() {
    setCountLike(countLike - 1);
    setLikeValue(likeValue === 0);
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
        userId: post.user.id,
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
      {/* LIKE */}
      {post.likes
        .filter((arrayLike) => {
          return arrayLike.userId === userId;
        })
        .map((like) => {
          return (
            <>
              <div className="icon_like">
                <i
                  key={like.id}
                  className={
                    like.valeur === 0
                      ? "far fa-thumbs-up"
                      : "fas fa-thumbs-up like"
                  }
                  onClick={addLike}
                ></i>
                <p className="likeValue">valeur du like : {like.valeur}</p>
                <p className="likeCount">nombre de likes : {countLike}</p>
              </div>
            </>
          );
        })}
      {/* UNLIKE */}
      <div className="icon_unlike">
        <i className={"fas fa-thumbs-down unlike"} onClick={supLike}></i>
      </div>
    </>
  );
}
export default LikeButton;
