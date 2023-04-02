import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";

import "../styles/sass/Pages/_updatePost.scss";
import "../styles/sass/Composants/_formulaires.scss";
import "../styles/sass/Composants/_buttons.scss";

function UpdatePost() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [post, setPost] = useState({});
  const [user, setUser] = useState({});

  const [titrePost, setTitrePost] = useState(post.titre);
  const [contenuPost, setContenuPost] = useState(post.contenu);

  const [imgPost, setImgPost] = useState("");
  const [imgPrewiew, setImgPreview] = useState("");

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
        //console.log("Pseudo du User : ", data.user.pseudo);
        setUser(data.user.pseudo);
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
    if (imgPost === "") {
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
    } else {
      let formData = new FormData();
      formData.append("titre", titrePost);
      formData.append("contenu", contenuPost);
      formData.append("image", imgPost);
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
        console.log("Réponse du serveur à mon fetch : ", data);
        navigate("/post/" + post.id);
      })
      .catch(function (error) {
        console.error("Error:", error);
      });
  }

  // Pour AFFICHER 'img'
  function handleSelectFiles(e) {
    // Stock le fichier img dans 'imgPost'
    setImgPost(e.target.files[0]);
    // Pour GENERER l'URL du fichier
    // const objectUrlImg = URL.createObjectURL(imgPost);
    // setImgPreview(objectUrlImg);
  }

  return (
    <>
      <Header />
      <div id="titre_page">
        <h1>Modification d'un post</h1>
      </div>
      <div className="form_update-post">
        <form onSubmit={handleSubmit}>
          {/* Titre du post */}
          <label htmlFor="titrePost">Titre du post :</label>
          <input
            type="text"
            id="titrePost"
            name="titrePost"
            size="20"
            defaultValue={post.titre}
            //value={titrePost}
            onChange={(e) => setTitrePost(e.target.value)}
            required
          />
          {/* Auteur du post */}
          <label htmlFor="auteurPost">Auteur du post :</label>
          <input
            type="text"
            id="auteurPost"
            name="auteurPost"
            value={user}
            onChange={(e) => setUser(e.target.value)}
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
            defaultValue={post.contenu}
            onChange={(e) => setContenuPost(e.target.value)}
            required
          ></textarea>
          {/* Image du post */}
          <label htmlFor="imgPost">Image :</label>
          <div className="form_update-post_img">
            <p>
              <a className="updatePost_img-lien" href="#newPicture">
                Ajouter une photo
              </a>
            </p>
            <div id="newPicture" className="newPicture">
              <summary>
                <input
                  type="file"
                  name="imgPost"
                  onChange={handleSelectFiles}
                />
                {imgPost ? (
                  <img src={imgPrewiew} alt="Illustration du post" />
                ) : (
                  <p></p>
                )}
              </summary>
            </div>
          </div>
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
                className="btn_annuler-lien"
                key={post.id}
              >
                Annuler
              </Link>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default UpdatePost;