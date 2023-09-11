import { useState, useEffect } from "react";

import "../../views/User/Profile/Profile.scss"
import yellow_heart from "../../assets/icon/yellow_heart.svg";
import icon_edit from "../../assets/icon/icon-edit.svg";
import icon_trash from "../../assets/icon/icon-trash.svg";

import moment from 'moment';
import 'moment/locale/fr';
import { Link } from "react-router-dom";
import jwt from "jwt-decode";
import axios from "axios";

export default function ArticleCard(props) {
  const isAuth: Boolean = !!localStorage.getItem("token");
  var user_id = "";
  let displayActionBtn: boolean;

  if (isAuth) {
    const token = localStorage.getItem("token");
    const decodeToken = jwt(token);
    user_id = decodeToken["id"];
  }

  if (user_id === props.user.id) {
    displayActionBtn = true;
  } else {
    displayActionBtn = false;
  }

  const [NbrLike, setNbrLike] = useState(0);

  useEffect(() => {
    const Loading = async () => {
      try {
        axios.get(`${process.env.REACT_APP_API_URL}/favorite/article/${props.id}`).then(res => {
          if (res.data.nbr) {
            setNbrLike(res.data.nbr);
          }
        })
      } catch (error) {
        console.log(error)
      }
    };
    Loading();
  }, []);


  const ext = props.image.split(".").pop().toLowerCase(); // extraire l'extension de fichier

  const formatDate = (date) => {
    return moment(date).locale("fr").startOf('seconds').fromNow();
  }

  //select option delete
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectChangeOption = (e) => {
    setSelectedOption(e.target.value);
  }

  const isDisabled = selectedOption === "";

  //modal
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleShow2 = () => { handleClose(); setShow2(true); }
  const handleClose2 = () => setShow2(false);
  const handleDelete = () => { handleClose2(); props.onDelete(); };

  return (
    <div className="article-infos">
      <div className="article-card">
        <Link to={"/article/" + props.id} className="stretched-link"></Link>
        <div className="article-image">
          {ext === 'mp4' || ext === 'mov' ? (
            <video loop autoPlay muted className="article-video">
              <source src={`${process.env.REACT_APP_MEDIA_URL}/${props.image}`} type="video/mp4" />
              Votre navigateur ne support pas le tag video.
            </video>
          ) : (
            <img alt={props.image} src={`${process.env.REACT_APP_MEDIA_URL}/${props.image}`} className="card-img" />
          )}
        </div>
        <div className="article-data">
          <div className="h3_button">
            <h3>{props.name}</h3>
            {props.status === 1 && <button className="article-reserved">Réservé</button>}
            {displayActionBtn && <div className="dropdown">
              <button className="btn btn-action dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              </button>
              <ul className="dropdown-menu dropdown-item-action">
                <li>
                  <Link className="dropdown-item" to={`/article/modifier/${props.id}`}>
                    <img src={icon_edit} />
                    Modifier
                  </Link>
                </li>
                <li>
                  <a className="dropdown-item" onClick={handleShow}>
                    <img src={icon_trash} />
                    Supprimer
                  </a>
                </li>
              </ul>
            </div>}
          </div>

          <p className="article-prix">{props.price}€</p>
          <div className="article-date">
            <p>
              Posté {formatDate(props.date)}
            </p>
            <div className="heart-int">
              <p>{NbrLike}</p>
              <img src={yellow_heart} alt="yellow_heart" />
            </div>
          </div>
        </div>

        {/* modal1 */}
        <div className={`modal ${show ? "d-block" : "d-none"}`} aria-labelledby="requestArticleSuppression1Label" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <p className="modal-title w-100 text-center" id="requestArticleSuppression1Label">Suppression d’article</p>
              </div>
              <div className="modal-body text-center border-0">
                <p> sur le point de supprimer cet article. Êtes-vous certain de vouloir continuer ?</p>
              </div>
              <div className="border-0 d-grid gap-2 group-btn-action">
                <button type="button" className="btn btn-action-1" onClick={handleShow2}>Oui</button>
                <button type="button" className="btn btn-action-2" onClick={handleClose}>Non</button>
              </div>
            </div>
          </div>
        </div>

        {/* modal2 */}
        <div className={`modal ${show2 ? "d-block" : "d-none"}`} aria-labelledby="requestArticleSuppression2Label" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <p className="modal-title w-100 text-center" id="requestArticleSuppression2Label">Suppression d’article</p>
              </div>
              <div className="modal-body text-center border-0 pb-4">
                <p>Pour quelle raison souhaitez-vous supprimer cet article ?</p>
                <select className="form-select" onChange={handleSelectChangeOption}>
                  <option value="">Veuillez séléctionner une raison</option>
                  <option value="1">Je souhaite modifier mon annonce</option>
                  <option value="2">J’ai vendu mon bien sur Broc en ligne</option>
                  <option value="3">J’ai vendu mon bien par un autre moyen</option>
                  <option value="4">Autres</option>
                </select>
              </div>
              <div className="border-0 d-grid gap-2 group-btn-action pt-4">
                <button type="button" className="btn btn-action-1" disabled={isDisabled} onClick={handleDelete}>Supprimer</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div >
  );
}