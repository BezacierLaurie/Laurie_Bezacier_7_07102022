import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/img/logo/logo_2.png";

import "../styles/sass/Layout/_header.scss";

function Header() {
  const [user, setUser] = useState({});

  // Pour RECUPERER 'pseudo' d'un user
  useEffect(() => {
    // Récupérartion du 'userId' (de localStorage)
    const userId = localStorage.getItem("userId");

    // Récupérartion du token (de localStorage)
    const token = localStorage.getItem("token");
    const authorization = `Bearer ${token}`;
    //console.log(token);
    fetch("http://localhost:3000/api/user/" + userId, {
      headers: {
        Authorization: authorization,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //console.log("Détails du User : ", data);
        setUser(data);
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <>
      <div id="logo">
        <img src={Logo} alt="Logo de Groupomania" />
        <p>Réseau Social d'Entreprise</p>
      </div>
      <nav className="liensHeader">
        <div>
          <Link className="lien_posts" to="/post">
            Liste des Posts
          </Link>
          <Link className="lien_ajoutPost" to="/create-post">
            Ajouter un post
          </Link>
        </div>
        <div>
          <Link to="/" className="lien_deconnexion">
            Déconnexion - <span id="pseudo">{user.pseudo}</span>
          </Link>
        </div>
      </nav>
      <hr />
    </>
  );
}

export default Header;
