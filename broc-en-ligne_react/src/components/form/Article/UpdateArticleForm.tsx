import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import icon_image from "../../../assets/icon/icon-image.svg";
import icon_video from "../../../assets/icon/icon-video.svg";
import icon_add_article from "../../../assets/icon/icon-add-article.svg";

import jwt from "jwt-decode";
import { CircularProgress } from "@mui/material";

const baseUrl: string = `${process.env.REACT_APP_API_URL}`;

export default function UpdateArticleForm() {
  const [ShowModal, setShowModal] = useState(false);
  let user_id: string;
  let user_username: string;
  const isAuth: boolean = !!localStorage.getItem("token");
  if (isAuth) {
    const token = localStorage.getItem("token");
    const decodeToken = jwt(token);
    user_id = decodeToken["id"];
    user_username = decodeToken["username"];
  }

  const [isLoading, setIsLoading] = useState(false);

  const url = window.location.href;
  const arrayUrl = url.split("/");
  const articleId = arrayUrl[arrayUrl.length - 1];

  const navigate = useNavigate();

  const [article, setArticle] = useState({
    title: "",
    category: "",
    content: "",
    etat: "",
    price: "",
    user: user_id,
    file: [],
    url: []
  });

  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState([]);

  function handleFileChange(e) {
    const selectedFiles = e.target.files;
    const newFiles = [];
    const arr = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (file.type.includes("image")) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          newFiles.push({ file: file, url: reader.result, type: "image" });
          arr.push(file)
          if (newFiles.length === selectedFiles.length) {
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            setArticle((prevArticle) => ({
              ...prevArticle,
              url: Array.isArray(prevArticle.url) ? [...prevArticle.url, ...arr] : [prevArticle.url, ...arr],
            }));
          }
        };
      } else if (file.type.includes("video")) {
        newFiles.push({ file: file, url: URL.createObjectURL(file), type: "video" });
        arr.push(file)
        if (newFiles.length === selectedFiles.length) {
          setFiles((prevFiles) => [...prevFiles, ...newFiles]);
          setArticle((prevArticle) => ({
            ...prevArticle,
            url: Array.isArray(prevArticle.url) ? [...prevArticle.url, ...arr] : [prevArticle.url, ...arr],
          }));
        }
      }
    }
  }

  function checkIfNumber(event) {

    /**
     * Allowing: Integers | Backspace | Tab | Delete | Left & Right arrow keys
     **/

    const regex = new RegExp(/(^\d*$)|(Backspace|Tab|Delete|ArrowLeft|ArrowRight)/);

    return !event.key.match(regex) && event.preventDefault();
  }

  function removeFile(index, e, id) {
    e.preventDefault();
    if (id != null) {
      setFiles(prevFiles => prevFiles.filter((file, i) => i !== index));
      setArticle(prevArticle => ({
        ...prevArticle,
        file: prevArticle.file.filter((url, i) => i !== index)
      }));

      axios.delete(`${baseUrl}/files/${id}`)
        .then((response) => {
          console.log("file with id : " + id + " deleted")
        })
        .catch((error) => {
          console.log(error);
        });

    } else {
      setFiles((prevFiles) => {
        const newFiles = [...prevFiles];
        newFiles.splice(index, 1);
        return newFiles;
      });
      setArticle((prevArticle) => ({
        ...prevArticle,
        url: prevArticle.url.filter((url, i) => i !== index)
      }));
    }
  }

  useEffect(() => {
    axios
      .get(`${baseUrl}/categories`)
      .then(res => {
        setCategories(res.data);
      });

    axios
      .get(`${baseUrl}/article/${articleId}`)
      .then(res => {
        setArticle({ ...res.data, category: res.data.category.id });
        setFiles(res.data.file || [])
      });
  }, [articleId]);

  const formulaireComplet = article.title && article.content &&
    article.price && article.category && article.etat && (article.file.length !== 0) || (article.url);

  async function updateArticle(e) {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", article.title);
    formData.append("category", article.category);
    formData.append("content", article.content);
    formData.append("etat", article.etat);
    formData.append("price", article.price);

    if (Array.isArray(article.url) && article.url.length > 0) {
      article.url.forEach((url) => {
        formData.append("url", url);
      });
    }

    axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
    await axios.patch(`${process.env.REACT_APP_API_URL}/article/${articleId}`, formData)
      .then((response) => {
        setIsLoading(false);

        if (response.status === 200) {
          navigate(`/profil/${user_username}`);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
        setShowModal(true);
      });
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg">
          </div>
          <form className="col-lg form-update-article" style={{ background: "#FFFBEB" }} onSubmit={updateArticle}>
            <h1 className="text-center pt-3 pb-5">Modifier un article</h1>
            {ShowModal &&
              <div className="alert alert-danger" role="alert">
                Un ou plusieurs fichiers dépassent le poids maximum autorisé de 50Mo ou ne respecte le format JPEG, JPG, MP4 et MOV autorisés !
              </div>
            }
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Titre*</label>
              <input type="text" className="form-control" id="title" name="title" placeholder="Écrivez votre titre" required value={article.title} onChange={(e) => { setArticle({ ...article, title: e.target.value }) }} />
            </div>

            <div className="mb-3">
              <label htmlFor="select" className="form-label">Catégorie</label>
              <select className="form-select" id="select" name="category" required value={article.category} onChange={(e) => { setArticle({ ...article, category: e.target.value }) }}>
                <option disabled>Choisissez une catégorie</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="title" className="form-label">Description*</label>
              <textarea className="form-control" name="content" style={{ height: 175, resize: "none" }} placeholder="Décrivez votre produit" id="floatingTextarea2" required value={article.content} onChange={(e) => { setArticle({ ...article, content: e.target.value }) }}></textarea>
            </div>

            <div className="row m-0 mb-3">
              <label className="form-label ps-0">État*</label>
              <div className="form-check col-md-2 col-6">
                <input className="form-check-input" type="radio" name="etat" id="etat-neuf" checked={article.etat === "Neuf"} value={"Neuf"} onChange={(e) => { setArticle({ ...article, etat: e.target.value }) }} />
                <label className="form-check-label" htmlFor="etat-neuf">
                  Neuf
                </label>
              </div>

              <div className="form-check col-md-4 col-6">
                <input className="form-check-input" type="radio" name="etat" id="etat-tbe" checked={article.etat === "Très bon état"} value={"Très bon état"} onChange={(e) => { setArticle({ ...article, etat: e.target.value }) }} />
                <label className="form-check-label" htmlFor="etat-tbe">
                  Très bon état
                </label>
              </div>

              <div className="form-check col-md-3 col-6">
                <input className="form-check-input" type="radio" name="etat" id="etat-bon" checked={article.etat === "Bon état"} value={"Bon état"} onChange={(e) => { setArticle({ ...article, etat: e.target.value }) }} />
                <label className="form-check-label" htmlFor="etat-bon">
                  Bon état
                </label>
              </div>

              <div className="form-check col-md-3 col-6">
                <input className="form-check-input" type="radio" name="etat" id="etat-satisfaisant" checked={article.etat === "Satisfaisant"} value={"Satisfaisant"} onChange={(e) => { setArticle({ ...article, etat: e.target.value }) }} />
                <label className="form-check-label" htmlFor="etat-satisfaisant">
                  Satisfaisant
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="price" className="form-label">Prix*</label>
              <div className="input-group">
                <input type="number" min="1" className="form-control" id="price" onKeyDown={(event) => checkIfNumber(event)} placeholder="Écrivez le prix du produit" required value={article.price} onChange={(e) => { setArticle({ ...article, price: e.target.value }) }} />
                <span className="input-group-text" id="basic-addon2">€</span>
              </div>
            </div>

            <div className="row mb-3">
              <label className="form-label mb-3">Déposez vos images et vidéos afin de démontrer que votre appareil fonctionne</label>

              <span className="col-lg btn-file">
                <img className="mb-2" src={icon_image} alt="ajouter une image" />
                <p>Déposez vos photos</p>
                <button className="btn btn-add px-4 py-2">Ajouter des images
                  <img className="ps-3 pb-1" alt="icon" src={icon_add_article} />
                </button>

                <input type="file" name="file" accept="image/jpg, image/jpeg" multiple onChange={(e) => { handleFileChange(e) }} />
              </span>

              <span className="col-lg btn-file">
                <img className="mb-2" src={icon_video} alt="ajouter une image" />
                <p>Déposez vos vidéos</p>
                <button className="btn btn-add px-4 py-2">Ajouter des vidéos
                  <img className="ps-3 pb-1" alt="icon" src={icon_add_article} />
                </button>

                <input type="file" name="file" accept="video/*" multiple onChange={(e) => { handleFileChange(e) }} />
              </span>
              <div className="form-text">
                Seuls les fichiers au format JPEG, JPG, MP4 et MOV sont autorisés. Taille maximum : 50Mo.
              </div>
            </div>

            <div className="row mb-3">
              {files.map((file, index) => {

                let ext: string = "";
                let fileUrl: string = "";

                if (file.file == null) {
                  ext = file.url.split(".").pop().toLowerCase();
                  fileUrl = (`${process.env.REACT_APP_MEDIA_URL}/${file.url}`);
                }

                return (
                  <div className="col-sm-6 my-3 preview-file" key={index}>
                    {file.file != null ? (
                      <>
                        {file.type === "image" && (
                          <>
                            <img src={file.url} alt={file.name} style={{ objectFit: "cover", width: "100%", height: 175 }} />
                            <button className="delete-btn" onClick={(e) => removeFile(index, e, null)}>X</button>
                          </>
                        )}
                        {file.type === "video" && (
                          <>
                            <video loop autoPlay muted style={{ objectFit: "cover", width: "100%", height: 175 }}>
                              <source src={file.url} type="video/mp4" />
                              Votre navigateur ne support pas le tag video.
                            </video>
                            <button className="delete-btn" onClick={(e) => removeFile(index, e, null)}>X</button>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        {ext === "mp4" || ext === 'mov' ? (
                          <>
                            <video loop autoPlay muted style={{ objectFit: "cover", width: "100%", height: 175 }}>
                              <source src={fileUrl} type="video/mp4" />
                              Votre navigateur ne support pas le tag video.
                            </video>
                            <button className="delete-btn" onClick={(e) => removeFile(index, e, file.id)}>X</button>
                          </>
                        ) : (
                          <>
                            <img src={fileUrl} alt={file.name} style={{ objectFit: "cover", width: "100%", height: 175 }} />
                            <button className="delete-btn" onClick={(e) => removeFile(index, e, file.id)}>X</button>
                            <p>{file.file}</p>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )
              }
              )}
            </div>
            {
              isLoading ? (
                <p className="btn btn-submit px-4 py-2"><CircularProgress color="inherit" /></p>
              ) : (
                <button type="submit" className="btn btn-submit px-4 py-2" disabled={!formulaireComplet}>Sauvegarder</button>
              )
            }
          </form>
        </div>
      </div>
    </>
  );
}