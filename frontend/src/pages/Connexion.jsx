import React from 'react';
import HeaderInscrConnex from '../components/HeaderInscrConnex.jsx';
import { Link } from 'react-router-dom';

import '../styles/sass/Pages/_connexion.scss';
import '../styles/sass/Composants/_formulaires.scss';
import '../styles/sass/Composants/_buttons.scss';

function Connexion() {
    return (
        <>
            <HeaderInscrConnex />
            <div id="titre_page">
                <h1>Connexion</h1>
            </div>
            <div className="form_inscr-connect">
                <form >
                    <label htmlFor="email">Email :</label>
                    <input type="email" id="email" name="email" required />
                    <label htmlFor="password">Password :</label>
                    <input type="password" id="password" name="password" minlength="4" maxlength="10"
                        required />
                    <input id="btn_connect" type="submit" value="Se connecter" />
                </form>
            </div>
            <div className="inscription">
                <p >
                    Si vous ne disposez pas déjà d'un compte, inscrivez-vous ici : <Link className="inscription_lien"
                        to="/inscription">S'inscrire
                        !</Link>
                </p>
            </div>
        </>
    )
}

export default Connexion