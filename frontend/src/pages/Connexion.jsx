import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import HeaderInscrConnex from "../components/HeaderInscrConnex.jsx";

import "../styles/sass/Pages/_connexion.scss";
import "../styles/sass/Composants/_formulaires.scss";
import "../styles/sass/Composants/_buttons.scss";

function Connexion() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(async function (response) {
        // Pour transmettre le status au 'response.json'
        let resAPI = await response.json();
        resAPI.status = response.status;
        // Si status 200 ou 201 : redirection (page 'Post' = accueil)
        if (resAPI.status === 200 || resAPI.status === 201) {
          // Stockage du 'token' dans le localStorage
          const token = resAPI.token;
          localStorage.setItem("token", token);
          // Stockage du 'userId' dans le localStorage
          const userId = resAPI.userId;
          localStorage.setItem("userId", userId);
          // Redirection (page 'Post' = accueil)
          navigate("/post");
        } else {
          console.log("Réponse du serveur à mon fetch : ", resAPI);
        }
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  }
  return (
    <>
      <HeaderInscrConnex />
      <div id="titre_page">
        <h1>Connexion</h1>
      </div>
      <div className="form_inscr-connect">
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* Password */}
          <label htmlFor="password">Password :</label>
          <input
            type="password"
            id="password"
            name="password"
            minLength="4"
            maxLength="10"
            placeholder="****"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* Btn */}
          <input id="btn_connect" type="submit" value="Se connecter" />
        </form>
      </div>
      {/* Inscription */}
      <div className="inscription">
        <p>
          Si vous ne disposez pas déjà d'un compte, inscrivez-vous ici :{" "}
          <Link className="inscription-lien" to="/inscription">
            S'inscrire !
          </Link>
        </p>
      </div>
    </>
  );
}

export default Connexion;
