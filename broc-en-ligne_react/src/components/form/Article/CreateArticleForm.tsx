import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import icon_image from "../../../assets/icon/icon-image.svg";
import icon_video from "../../../assets/icon/icon-video.svg";
import icon_add_article from "../../../assets/icon/icon-add-article.svg";
import { useForm } from "react-hook-form";

import jwt from "jwt-decode";
import { CircularProgress } from "@mui/material";

export default function CreateArticleForm() {
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

  //apercu image
  const [files, setFiles] = useState([]);
  const [ShowModal, setShowModal] = useState(false);
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
              url: [...prevArticle.url, ...arr],
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
            url: [...prevArticle.url, ...arr],
          }));
        }
      }
    }
  }

  function removeFile(index, e) {
    e.preventDefault();
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

  const [article, setArticle] = useState({
    title: "",
    content: "",
    price: "",
    etat: "",
    url: [],
    category: "",
    user: user_id
  });

  function checkIfNumber(event) {

    /**
     * Allowing: Integers | Backspace | Tab | Delete | Left & Right arrow keys
     **/

    const regex = new RegExp(/(^\d*$)|(Backspace|Tab|Delete|ArrowLeft|ArrowRight)/);

    return !event.key.match(regex) && event.preventDefault();
  }

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/categories`)
      .then(res => {
        setCategories(res.data);
      });
  }, []);

  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = async (data, e) => {
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.description);
    formData.append("price", data.price);
    formData.append("etat", data.etat);
    formData.append("category", data.category);
    formData.append("user", article.user);

    if (Array.isArray(article.url) && article.url.length > 0) {
      article.url.forEach((url) => {
        formData.append("url", url);
      });
    }

    axios.defaults.headers.common["Content-Type"] = "multipart/form-data";
    await axios.post(`${process.env.REACT_APP_API_URL}/article`, formData)
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
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg">
          </div>
          <form className="col-lg form-create-article" style={{ background: "#FFFBEB" }} onSubmit={handleSubmit(onSubmit)}>
            <h1 className="text-center pt-3 pb-3">Déposer un article</h1>
            <div className={`alert alert-info`} role="alert">
              Pour déposer un article, il vous faut être inscrit à une brocante !
            </div>
            {ShowModal &&
              <div className="alert alert-danger" role="alert">
                Un ou plusieurs fichiers dépassent le poids maximum autorisé de 50Mo ou ne respecte pas le format JPEG, JPG, MP4 et MOV autorisés !
              </div>
            }

            <div className="mb-3">
              <label htmlFor="title" className="form-label">Titre*</label>
              <input
                type="text"
                className={`form-control ${errors.title ? "is-invalid" : ""}`}
                id="title"
                placeholder="Écrivez votre titre"
                aria-describedby="errorTitle"
                {...register("title", { required: true })}
              />
              {errors.title && (
                <div id="errorTitle" className="invalid-feedback">
                  Titre requis.
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="select" className="form-label">Catégorie</label>
              <select
                className={`form-select ${errors.category ? "is-invalid" : ""}`}
                id="select"
                aria-describedby="errorCategory"
                {...register("category", { required: true })}
              >
                <option value="">Choisissez une catégorie</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div id="errorCategory" className="invalid-feedback">
                  Catégorie requise.
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description*</label>
              <textarea
                className={`form-control ${errors.description ? "is-invalid" : ""}`}
                style={{ height: 175, resize: "none" }}
                placeholder="Décrivez votre produit"
                id="floatingTextarea2"
                aria-describedby="errorDescription"
                {...register("description", { required: true })}
              ></textarea>
              {errors.description && (
                <div id="errorDescription" className="invalid-feedback">
                  Description requise.
                </div>
              )}
            </div>

            <div className={`row m-0 mb-3 ${errors.etat ? "is-invalid mb-5" : ""}`} >
              <label className="form-label ps-0">État*</label>
              <div className="form-check col-md-2 col-6">
                <input
                  className={`form-check-input ${errors.etat ? "is-invalid" : ""}`}
                  type="radio"
                  name="etat"
                  id="etat-neuf"
                  value="Neuf"
                  aria-describedby="errorEtat"
                  {...register("etat", { required: true })}
                />
                <label className="form-check-label" htmlFor="etat-neuf">
                  Neuf
                </label>
                {errors.etat && (
                  <div id="errorEtat" className="invalid-feedback" style={{
                    position: "absolute",
                    marginLeft: "-24px"
                  }}>
                    État requis.
                  </div>
                )}
              </div>

              <div className="form-check col-md-4 col-6">
                <input
                  className={`form-check-input ${errors.etat ? "is-invalid" : ""}`}
                  type="radio"
                  name="etat"
                  id="etat-tbe"
                  value="Très bon état"
                  aria-describedby="errorEtat"
                  {...register("etat", { required: true })}
                />
                <label className="form-check-label" htmlFor="etat-tbe">
                  Très bon état
                </label>
              </div>

              <div className="form-check col-md-3 col-6">
                <input
                  className={`form-check-input ${errors.etat ? "is-invalid" : ""}`}
                  type="radio"
                  name="etat"
                  id="etat-bon"
                  value="Bon état"
                  aria-describedby="errorEtat"
                  {...register("etat", { required: true })}
                />
                <label className="form-check-label" htmlFor="etat-bon">
                  Bon état
                </label>
              </div>

              <div className="form-check col-md-3 col-6">
                <input
                  className={`form-check-input ${errors.etat ? "is-invalid" : ""}`}
                  type="radio"
                  name="etat"
                  id="etat-satisfaisant"
                  value="Satisfaisant"
                  aria-describedby="errorEtat"
                  {...register("etat", { required: true })}
                />
                <label className="form-check-label" htmlFor="etat-satisfaisant">
                  Satisfaisant
                </label>
              </div>

            </div>


            <div className="mb-4">
              <label htmlFor="price" className="form-label">Prix*</label>
              <div className="input-group">
                <input
                  type="number" min="1"
                  onKeyDown={(event) => checkIfNumber(event)}
                  className={`form-control ${errors.etat ? "is-invalid" : ""}`}
                  id="price"
                  placeholder="Écrivez le prix du produit"
                  aria-describedby="errorPrice"
                  {...register("price", { required: true })}
                />
                <span className="input-group-text" id="basic-addon2">€</span>

                {errors.price && (
                  <div id="errorPrice" className="invalid-feedback">
                    Prix requis.
                  </div>
                )}
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

                <input type="file" accept="image/jpg, image/jpeg, image/heic, image/png, image/xml"
                  multiple
                  onChange={(e) => { handleFileChange(e) }}
                />
              </span>

              <span className="col-lg btn-file">
                <img className="mb-2" src={icon_video} alt="ajouter une image" />
                <p>Déposez vos vidéos</p>
                <button className="btn btn-add px-4 py-2">Ajouter des vidéos
                  <img className="ps-3 pb-1" alt="icon" src={icon_add_article} />
                </button>

                <input type="file" accept="video/*"
                  multiple
                  onChange={(e) => { handleFileChange(e) }} />
              </span>

              <div className="form-text">
                Seuls les fichiers au format JPEG, JPG, MP4 et MOV sont autorisés. Taille maximum : 50Mo.
              </div>

            </div>

            <div className="row mb-3">
              {files.map((file, index) => (
                <div className="col-sm-6 my-3 preview-file" key={index}>
                  {file.type === "image" && (
                    <>
                      <img src={file.url} alt={file.file.name} style={{ objectFit: "cover", width: "100%", height: 175 }} />
                      <button className="delete-btn" onClick={(e) => removeFile(index, e)}>X</button>
                    </>
                  )}
                  {file.type === "video" && (
                    <>
                      <video loop autoPlay muted style={{ objectFit: "cover", width: "100%", height: 175 }}>
                        <source src={file.url} type="video/mp4" />
                        Votre navigateur ne support pas le tag video.
                      </video>
                      <button className="delete-btn" onClick={(e) => removeFile(index, e)}>X</button>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="mb-3">
              <div className="form-check checkbox">
                <input
                  className={`form-check-input ${errors.checkbox ? "is-invalid" : ""}`}
                  type="checkbox"
                  id="checkbox"
                  aria-describedby="errorCheckbox"
                  {...register("checkbox", { required: true })}
                />
                <label className="form-check-label" htmlFor="checkbox">
                  J’accepte que mon numéro de téléphone soit affiché en cas de retrait à domicile*
                </label>
                {errors.checkbox && (
                  <div id="errorCheckbox" className="invalid-feedback">
                    Vous devez accepter avant de soumettre.
                  </div>
                )}
              </div>
            </div>

            {
              isLoading ? (
                <p className="btn btn-submit px-4 py-2"><CircularProgress color="inherit" /></p>
              ) : (
                <button type="submit" className="btn btn-submit px-4 py-2">Déposer l'article</button>
              )
            }
          </form>
        </div>
      </div >
    </>
  );
}