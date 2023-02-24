import React from 'react';
import Logo from '../assets/img/logo/logo_2.png';
import {Link} from 'react-router-dom';

import '../styles/sass/Layout/_header.scss'

function Header() {
    return (
        <>
            <div id="logo">
            <img src={Logo} alt="Logo de Groupomania"/>
                <p>Réseau Social d'Entreprise</p>
            </div>
            <nav className="liensHeader_inscr-connect">
                <Link className="lien_inscription" to="/inscription">Inscription</Link>
                <Link className="lien_connexion" to="/">Connexion</Link>
            </nav>
        </>
    )
}

export default Header