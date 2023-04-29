import React from "react";
import { useParams } from "react-router-dom";

import "../styles/sass/Composants/_like-unlike.scss";

function LikeButton({ post, setIsReload }) {
  // 'post' et 'setIsReload' : props récupérés (envoyés avec le composant 'LikeButton' dans 'AffichePost')
  const { id } = useParams();

  // Pour RECUPERER 'userId' (du LS), utilisé dans 'filter'
  const userId = JSON.parse(localStorage.getItem("userId"));

  // Pour CREER un like
  async function createLike() {
    // Récupérartion du token (de localstorage)
    const token = localStorage.getItem("token");
    const authorization = `Bearer ${token}`;
    //console.log(token);

    await fetch("http://localhost:3000/api/post/" + id + "/like", {
      method: "POST",
      headers: {
        //"Content-Type": "application/json",
        Authorization: authorization,
      },
      // body: JSON.stringify({
      //   userId: post.user.id, // token
      //   postId: post.id, // params (URL)
      // }),
    })
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        //console.log("Réponse du serveur à mon fetch : ", data);
        setIsReload(true);
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
        //console.log("Réponse du serveur à mon fetch : ", data);
        setIsReload(true);
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  }

  function addLike() {
    createLike();
  }

  function supLike() {
    deleteLike();
  }

  return (
    <>
      <div className="icon_like">
        {post.likes.filter((like) => {
          return like.userId === userId;
        }).length === 1 ? (
          <i className={"far fa-thumbs-up like"} onClick={supLike}></i>
        ) : (
          <i className="far fa-thumbs-up unlike " onClick={addLike}></i>
        )}
        <p className="nbLikesPost">{post.likes.length}</p>
      </div>
    </>
  );
}
export default LikeButton;
