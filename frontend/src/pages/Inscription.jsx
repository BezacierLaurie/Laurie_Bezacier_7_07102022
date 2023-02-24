import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import HeaderInscrConnex from "../components/HeaderInscrConnex.jsx";

function Inscription() {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messUser, setMessUser] = useState("");

  const navigate = useNavigate();

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
      }),
    })
      .then(function (response) {
        //setMessUser("Réponse du serveur à mon fetch : " + response.status);
        console.log(response);
        // Si status 200 ou 201 : redirection (Connexion)
        if (response.status === 200 || response.status === 201) {
          navigate("/");
        }
        // Pour récupérer le 'status' et le transmettre à 'data'
        let resAPI = response.json();
        console.log(resAPI);
        resAPI.status = response.status;
        console.log(resAPI.status);
        return resAPI();
      })
      .then((data) => {
        console.log(data);
        // Si status différent de 200 alors setMessUser : mess utilisateur (Erreur)
        if (data.status !== 200 || data.status !== 201) {
          setMessUser("Inscription impossible !");
          //alert("Inscription impossible !");
        }
        console.log("Réponse du serveur à mon fetch : ", data);
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
          {/* Message User */}
          <div>{messUser}</div>
          {/* Btn */}
          <input id="btn_inscr" type="submit" value="S'inscrire" />
        </form>
      </div>
    </>
  );
}

export default Inscription;
