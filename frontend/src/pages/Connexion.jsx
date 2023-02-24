import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import HeaderInscrConnex from "../components/HeaderInscrConnex.jsx";

import "../styles/sass/Pages/_connexion.scss";
import "../styles/sass/Composants/_formulaires.scss";
import "../styles/sass/Composants/_buttons.scss";

function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.tokenKey,
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then(function (response) {
        // Si status 200 ou 201 : redirection (Posts)
        if (response.status === 200 || response.status === 201) {
          navigate("/posts");
        }
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
          <Link className="inscription_lien" to="/inscription">
            S'inscrire !
          </Link>
        </p>
      </div>
    </>
  );
}

export default Connexion;
