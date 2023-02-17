import React from "react";
import { useState } from "react";
import HeaderInscrConnex from "../components/HeaderInscrConnex.jsx";

function Inscription() {
  const [pseudo, setPseudo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        return response.json();
      })
      .then((data) => console.log("Réponse du serveur à mon fetch : ", data))
      .catch(function (error) {
        console.error("Error:", error);
      });
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
          <input id="btn_inscr" type="submit" value="S'inscrire" />
        </form>
      </div>
    </>
  );
}

export default Inscription;
