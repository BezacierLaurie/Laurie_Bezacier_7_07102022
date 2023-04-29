import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import Header from "../components/Header.jsx";

import "../styles/sass/Composants/_post.scss";
import "../styles/sass/Composants/_formulaires.scss";
import "../styles/sass/Composants/_buttons.scss";
import "../styles/sass/Composants/_img.scss";

function UpdatePost() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [post, setPost] = useState({});

  const [titrePost, setTitrePost] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [contenuPost, setContenuPost] = useState("");
  const [imgPost, setImgPost] = useState("");

  // Pour RECUPERER les infos d'un post en particulier et le pseudo du user associé
  useEffect(() => {
    // Récupérartion du token (de localstorage)
    const token = localStorage.getItem("token");
    const authorization = `Bearer ${token}`;
    //console.log(token);

    fetch("http://localhost:3000/api/post/" + id, {
      headers: {
        Authorization: authorization,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        //console.log("Détails du Post : ", data);
        setPost(data);
        setTitrePost(data.titre); // identique à 'titrePost' (state) = post.titre (ancienne valeur)
        setPseudo(data.user.pseudo); // 'data.user.pseudo' et pas 'data. pseudo' car 'user' est un objet dans l'objet 'post'
        setContenuPost(data.contenu);
      })
      .catch((err) => console.error("Error:", err));
  }, [id]);

  // Pour MODIFIER un post
  function handleSubmit(e) {
    e.preventDefault();

    // Headers du fetch
    // Récupérartion du token (de localstorage)
    const token = localStorage.getItem("token");
    //console.log(token);
    let headersFetch = {
      //"Content-Type": contentType,
      Authorization: `Bearer ${token}`,
    };
    // Valeur du 'Content-Type'
    if (imgPost === "" || imgPost === "DELETED") {
      //console.log("pas d'img");
      headersFetch["Content-Type"] = "application/json";
    }
    // Body du fetch
    let bodyFetch;
    if (imgPost === "") {
      bodyFetch = JSON.stringify({
        titre: titrePost,
        contenu: contenuPost,
      });
    } else if (imgPost === "DELETED") {
      bodyFetch = JSON.stringify({
        titre: titrePost,
        contenu: contenuPost,
        image: "DELETED",
      });
    } else {
      let formData = new FormData();
      formData.append("titre", titrePost);
      formData.append("contenu", contenuPost);
      formData.append("image", imgPost); // valeur de 'imgPost' = "File 'image'"
      bodyFetch = formData;
    }
    fetch("http://localhost:3000/api/post/" + id, {
      method: "PUT",
      headers: headersFetch,
      body: bodyFetch,
    })
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        //console.log("Réponse du serveur à mon fetch : ", data);
        navigate("/post/" + post.id);
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  }

  // Pour SUPPRIMER l'image de 'imgPost'
  function deleteImg(e) {
    e.preventDefault();
    // Nouvelle valeur de l'ancienne image quand image supprimée
    post.imageUrl = "";
    // Nouvelle valeur de 'imgPost' quand image supprimée
    setImgPost("DELETED");
  }

  return (
    <>
      <Header />
      <div id="titre_page">
        <h1>Modification du post</h1>
      </div>
      <div className="form_update-post">
        <form onSubmit={handleSubmit}>
          <div className="post">
            <div className="post_descript_update">
              {/* Titre du post */}
              <label htmlFor="titrePost">Titre du post :</label>
              <input
                type="text"
                id="titrePost"
                name="titrePost"
                size="20"
                value={titrePost}
                onChange={(e) => setTitrePost(e.target.value)}
                required
              />
              {/* Auteur du post */}
              <label htmlFor="auteurPost">Auteur du post :</label>
              <input
                type="text"
                id="auteurPost"
                name="auteurPost"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                readOnly
                required
              />
              {/* Contenu du post */}
              <label htmlFor="contenuPost">Contenu du post :</label>
              <textarea
                id="contenuPost"
                name="contenuPost"
                rows="10"
                cols="20"
                value={contenuPost}
                onChange={(e) => setContenuPost(e.target.value)}
                required
              ></textarea>
              {/* Btn */}
              <div className="post_btn">
                <button
                  className="btn_enregistrer"
                  type="submit"
                  value="Enregistrer"
                >
                  Enregistrer
                </button>
                <button className="btn_annuler" type="submit" value="Annuler">
                  <Link
                    to={"/post/" + post.id}
                    key={post.id}
                    className="btn_annuler-lien"
                  >
                    Annuler
                  </Link>
                </button>
              </div>
            </div>
            {/* Image du post */}
            <div className="imgs">
              <label htmlFor="imgPost"></label>
              {post.imageUrl ? (
                <>
                  <div className="img_affich">
                    <img src={post.imageUrl} alt="Illustration du post" />
                  </div>
                  <div className="select-img_update">
                    <details className="newPicture">
                      <summary className="select-img-lien">
                        Sélectionner une autre image
                      </summary>
                      <input
                        type="file"
                        name="imgPost"
                        onChange={(e) => setImgPost(e.target.files[0])}
                      />
                    </details>
                    <br />
                    <button
                      className="btn_suppprimer-img"
                      type="submit"
                      value="Supprimer l'image"
                      onClick={deleteImg}
                    >
                      Supprimer l'image
                    </button>
                  </div>
                </>
              ) : (
                <div className="select-img-update">
                  <details className="newPicture">
                    <summary className="select-img-lien">
                      Sélectionner une image
                    </summary>
                    <input
                      type="file"
                      name="imgPost"
                      onChange={(e) => setImgPost(e.target.files[0])}
                    />
                  </details>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default UpdatePost;
