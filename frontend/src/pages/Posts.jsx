import React, { useState, useEffect } from 'react';

import '../styles/sass/Pages/_posts.scss';

function Posts() {
  let [posts, setPosts] = useState([])

  useEffect(() => {
    fetch("http://localhost:3000/api/posts", {
      
    })
    // token
      .then(res => res.json())
      .then(data => setPosts(data.posts))
      .catch(console.error("Erreur"))
  }, [])

  return (
    <>
      <div>
        <h1 id="titre_page">Liste des Posts</h1>
      </div>
      <div className="liste_posts">
        <div className="posts">
          {/* Ternaire */}
          <h2 className="posts_titre">{posts.titre}</h2>
        </div>
      </div>
    </>
  );
}

export default Posts;
