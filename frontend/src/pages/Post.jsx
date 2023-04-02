import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "../styles/sass/Composants/_post.scss";

function Post() {
  const [post, setPost] = useState([]);

  useEffect(() => {
    // Récupérartion du token (de localstorage)
    const token = localStorage.getItem("token");
    const authorization = `Bearer ${token}`;
    //console.log(token);

    fetch("http://localhost:3000/api/post", {
      headers: {
        Authorization: authorization,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //console.log("Liste des posts :", data);
        setPost(data);
      })
      .catch((err) => console.error("Erreur : ", err));
  }, []);

  return (
    <>
      <div>
        <h1 id="titre_page">Liste des Posts</h1>
      </div>
      <div className="liste_posts">
        {post.map((post) => {
          return (
            <Link to={"/post/" + post.id} className="posts" key={post.id}>
              <article>
                <h2 className="posts_titre">{post.titre}</h2>
                <h3 className="posts_auteur">{post.user.pseudo}</h3>
                <p className="posts_contenu">{post.contenu}</p>
              </article>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default Post;
