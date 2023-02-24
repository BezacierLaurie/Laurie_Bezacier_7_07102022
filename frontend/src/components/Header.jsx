import React from 'react' ;
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
            <nav className="liensHeader">
                <div>
                    <Link className="lien_posts" to="/posts">Liste des Posts</Link>
                    <Link className="lien_ajoutPost" to="/post">Ajouter un post</Link>
                </div>
                <div>
                    <Link className="lien_deconnexion" to="/">Déconnexion</Link>
                </div>
            </nav>
        </>
    )
}

export default Header