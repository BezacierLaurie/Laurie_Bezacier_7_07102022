import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import HeaderInscrConnex from "../components/HeaderInscrConnex.jsx";

function Inscription() {
  const navigate = useNavigate();

  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState(false);
  const [messUser, setMessUser] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    fetch("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pseudo: pseudo,
        email: email,
        password: password,
        admin: admin,
      }),
    })
      .then(function (response) {
        // Si status 200 ou 201 : redirection (vers page 'Connexion')
        if (response.status === 200 || response.status === 201) {
          navigate("/");
        }
        // Sinon setMessUser : Message User (erreur)
        else {
          setMessUser("Vous êtes déjà inscrit, connectez-vous !");
        }
        // // Pour récupérer le 'status' et le transmettre à 'data'
        // let resAPI = response.json();
        // resAPI.status = response.status;
        // return resAPI;
        return response.json();
      })
      .then((data) => {
        console.log("Infos 'user' créé : ", data);
      })
      .catch((error) => setMessUser("Error:" + error));
  }

  return (
    <>
      <HeaderInscrConnex />
      <div id="titre_page">
        <h1>Inscription</h1>
      </div>
      <div className="form_inscr-connect">
        <form onSubmit={handleSubmit}>
          {/* Pseudo */}
          <label htmlFor="pseudo"> Pseudo :</label>
          <input
            type="text"
            id="pseudo"
            name="pseudo"
            placeholder="Pseudo"
            value={pseudo}
            onChange={(e) => setPseudo(e.target.value)}
            required
          />
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
          {/* Admin */}
          <div className="admin-checkbox">
            <label htmlFor="admin">Admin</label>
            <input
              type="checkbox"
              id="admin"
              name="admin"
              value={admin}
              onChange={(e) => setAdmin(e.target.value)}
            />
          </div>
          {/* Message User (erreur) */}
          <div>{messUser}</div>
          {/* Btn */}
          <button id="btn_inscr" type="submit" value="S'inscrire">
            S'inscrire
          </button>
        </form>
      </div>
    </>
  );
}

export default Inscription;
