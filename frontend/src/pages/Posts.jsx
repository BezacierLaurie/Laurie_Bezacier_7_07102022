//import React, { useState, useEffect } from "react";

import "../styles/sass/Pages/_posts.scss";

function Posts() {
  //let [titrePost, setTitrePost] = useState([]);

  //useEffect(() => {
    fetch("http://localhost:3000/api/posts", {
      headers: {
        Authorization: process.env.tokenKey,
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch(console.error("Erreur"));
  //}, []);

  return (
    <>
      <div>
        <h1 id="titre_page">Liste des Posts</h1>
      </div>
      <div className="liste_posts">
        <div className="posts">
          {/* Ternaire */}
          {/* <h2 className="posts_titre">{titrePost}</h2> */}
        </div>
      </div>
    </>
  );
}

export default Posts;
