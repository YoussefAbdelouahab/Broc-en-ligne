import SliderCard from "../../../components/slider-card/SliderCard";
import "./Article.scss";
import { Link, useNavigate } from "react-router-dom";
import Rating from '@mui/material/Rating';

import Navbar from "../../../components/header/navbar-principal/Navbar";
import Button from "../../../utils/button/Button";

import icon_reservation from "../../../assets/icon/icon-reservation.svg";
import icon_phone from "../../../assets/icon/icon-phone.svg";
import icon_heart from "../../../assets/icon/icon-heart.svg";
import icon_heartfull from "../../../assets/icon/icon_hearfull.svg";
import icon_cross from "../../../assets/icon/icon-cross.svg";
import frame_bonhome from "../../../assets/Frame.png";

import moment from 'moment';
import 'moment/locale/fr';
import axios from "axios";
import { useEffect, useState } from "react";
import jwt from "jwt-decode";
import Footer from "../../../components/footer/Footer";
import { CircularProgress } from "@mui/material";

const baseUrl = `${process.env.REACT_APP_API_URL}`

function Alert(props) {
    const { showAlert, showAlertError, text, error } = props;

    if (error) {
        return (
            <div className={`alert alert-danger ${showAlertError ? "d-block" : "d-none"}`} role="alert">
                {text}
            </div>
        )
    }
    return (
        <div className={`alert alert-success ${showAlert ? "d-block" : "d-none"}`} role="alert">
            {text}
        </div>
    )
}

export default function Article() {
    const limitSlider: number = 12;

    const isAuth = !!localStorage.getItem("token");
    const url = window.location.href;
    const articleId = url.split("/").pop();

    let user_id = "";
    const token = localStorage.getItem("token");
    if (token) {
        const decodedToken = jwt(token);
        user_id = decodedToken["id"];
    }

    let history = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const [showAlertCancelReservation, setShowAlertCancelReservation] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };
    const handleShowAlertCancelReservation = () => {
        setShowAlertCancelReservation(true);
        setTimeout(() => {
            setShowAlertCancelReservation(false);
        }, 3000);
    };

    const [showAlertError, setShowAlertError] = useState(false);
    const [showAlertErrorCancelReservation, setShowAlertErrorCancelReservation] = useState(false);
    const handleShowAlertError = () => {
        setShowAlertError(true);
        setTimeout(() => {
            setShowAlertError(false);
        }, 3000);
    };
    const handleShowAlertErrorCancelReservation = () => {
        setShowAlertErrorCancelReservation(true);
        setTimeout(() => {
            setShowAlertErrorCancelReservation(false);
        }, 3000);
    };

    const [isLike, setIsLike] = useState(false);
    const [article, setArticle] = useState(null);
    const [countArticleUser, setCountArticleUser] = useState(0);
    const [Fleamarkets, setFleamarkets] = useState({
        id: "",
        title: "",
        event_date: "",
        address: "",
        city: ""
    });
    const [DeleteReservation, setDeleteReservation] = useState(false);
    const [DeleteReservation2, setDeleteReservation2] = useState(false);
    const [CurrentFlea, setCurrentFlea] = useState([]);
    const [CurrentFleaDate, setCurrentFleaDate] = useState("");
    const [RateAvg, setRateAvg] = useState(null);
    const [countRate, setCountRate] = useState(null);

    const [reservationVerif, setReservationVerif] = useState({
        reservation: {}
    });

    const [ReservationData, setReservationData] = useState({
        delivery_hour: "",
        userExposantId: "",
        userVisitorId: "",
        articleId: "",
        fleamarketId: "",
        mail: "",
        username: "",
        phone: ""
    })

    function userVisitor() {
        axios.get(`${process.env.REACT_APP_API_URL}/user/${user_id}`)
            .then(res => {
                console.log(res.data)
            }).catch((err) => console.log(err));
    }

    useEffect(() => {
        const getArticle = async () => {
            try {
                const articleResponse = await axios.get(`${process.env.REACT_APP_API_URL}/article/${articleId}`);
                const articleData = articleResponse.data;

                if (articleData.status === 1) {
                    await axios.get(`${process.env.REACT_APP_API_URL}/reservation/${articleId}/${user_id}`)
                        .then((res) => {
                            setReservationVerif({ ...reservationVerif, reservation: res.data })
                        });
                    setDeleteReservation(true);
                    setDeleteReservation2(true);
                }
                setArticle(articleData);
                const userId = articleData.user.id;

                const countArticle = async (userId) => {
                    try {
                        const countResponse = await axios.get(`${process.env.REACT_APP_API_URL}/articles/${userId}/count`);
                        const countData = countResponse.data;
                        setCountArticleUser(countData);
                    } catch (error) {
                        console.log(error);
                    }
                };
                countArticle(userId);

                const getFlea = async (userId) => {
                    try {
                        const fleaResponse = await axios.get(`${process.env.REACT_APP_API_URL}/market/user/${userId}`);
                        const fleaData = fleaResponse.data;
                        if (fleaResponse.data.length === 0) {
                            setDeleteReservation(true);
                        } else {
                            setFleamarkets({
                                id: fleaData[0].fleaMarket.id,
                                title: fleaData[0].fleaMarket.title,
                                event_date: fleaData[0].fleaMarket.event_date,
                                address: fleaData[0].fleaMarket.address,
                                city: fleaData[0].fleaMarket.localisation.city
                            });
                            const str = moment(fleaData.NearestDate).format("dddd d MMMM YYYY");
                            const str2 = str.charAt(0).toUpperCase() + str.slice(1);
                            setCurrentFleaDate(str2);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                };
                getFlea(userId);

                if (user_id !== "") {
                    try {
                        const favoriteResponse = await axios.get(`${process.env.REACT_APP_API_URL}/favorite/verif?articleId=${articleId}&userId=${user_id}`);
                        const favoriteData = favoriteResponse.data;
                        if (favoriteData.ko) {
                            setIsLike(true);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };

        getArticle();
    }, [articleId, user_id]);


    useEffect(() => {
        //rate user
        if (article && article.user) {
            try {
                axios.get(`${process.env.REACT_APP_API_URL}/rate/${article.user.username}`).then(res => {
                    setRateAvg(Math.round(res.data.averageRate.averageRage * 100) / 100);
                    setCountRate(res.data.count)
                })
            } catch (error) {
                console.log(error)
            }
        }
    }, [article]);

    // index thumbs
    const [selectedIndex, setSelectedIndex] = useState(0);
    // show more
    const [showMore, setShowMore] = useState(false);

    // date parse and transle fr
    const formatDate = (date) => {
        return moment(date).locale("fr").startOf('seconds').fromNow();
    }

    const formatDateBrocante = (date) => {
        return moment(date).locale("fr").format('LL');
    }

    const [showReservation, setShowReservation] = useState(false);
    const [showReservation2, setShowReservation2] = useState(false);
    const [showReservation3, setShowReservation3] = useState(false);
    const [showModalContact, setShowModalContact] = useState(false);
    const [showModalCancelReservation, setShowModalCancelReservation] = useState(false);

    async function ShowReservation() {
        setShowReservation(true);
        if (user_id !== "") {
            try {
                axios.get(`${process.env.REACT_APP_API_URL}/user/${user_id}`).then(res => {
                    setReservationData({
                        ...ReservationData,
                        userExposantId: article.user.id,
                        userVisitorId: user_id,
                        articleId: articleId,
                        fleamarketId: Fleamarkets.id,
                        mail: res.data.mail,
                        username: res.data.username,
                        phone: res.data.phone
                    })
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    async function CreateReservation(e) {
        e.preventDefault();
        setIsLoading(true);

        await axios.post(`${process.env.REACT_APP_API_URL}/reservation/`, {
            delivery_hour: ReservationData.delivery_hour,
            userExposantId: ReservationData.userExposantId,
            userVisitorId: ReservationData.userVisitorId,
            articleId: ReservationData.articleId,
            fleamarketId: ReservationData.fleamarketId.toString(),
        }).then(res => {
            console.log(res.data)
            setShowReservation2(false);
            setShowReservation3(true);
            handleShowAlert()
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
            handleShowAlertError();
            setIsLoading(false);
        });
    }

    async function cancelReservation(e) {
        e.preventDefault();
        setIsLoading(true);

        await axios.delete(`${process.env.REACT_APP_API_URL}/reservation/${articleId}/${user_id}`)
            .then(res => {
                console.log(res.data)
                handleShowAlertCancelReservation();
                setIsLoading(false);
                history(0)

            }).catch((err) => {
                console.log(err);
                setIsLoading(false);
                handleShowAlertErrorCancelReservation();
            });
    }

    async function addFavorite() {
        if (isLike == false) {
            try {
                axios.post(`${process.env.REACT_APP_API_URL}/favorite/article/`, { articleId: articleId, userId: user_id }).then(res => {
                    setIsLike(!isLike);
                })
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                axios.delete(`${process.env.REACT_APP_API_URL}/favorite/delete?articleId=${articleId}&userId=${user_id}`).then(res => {
                    setIsLike(!isLike);
                })
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <>
            {article &&
                <>
                    <Navbar />
                    <div className="container-fluid info-article py-5" key={article.id}>
                        <div className="container">
                            <Alert showAlert={showAlert} text={"Votre réservation a été effectuée avec succès !"} />
                            <Alert showAlertError={showAlertError} text={"Désolé, la réservation a échoué. Veuillez réessayer ultérieurement."} error={true} />
                            <Alert showAlert={showAlertCancelReservation} text={"Votre réservation a été annulée avec succès."} />
                            <Alert showAlertError={showAlertErrorCancelReservation} text={"Désolé, l'annulation de la réservation a échoué. Vous ne pouvez pas annulée 24 heures avant la date de l'événement."} error={true} />
                            <a onClick={() => history(-1)} className="link-return">Retour</a>
                            <div className="row mt-3">
                                {/* Slider Image */}
                                <div className="col-lg-8 col-12 mb-lg-0 mb-5">
                                    {/* slider images article */}
                                    <div id="carouselExampleIndicators" className={`carousel slide ${isAuth ? "" : "no-auth"}`}>
                                        {/* slide */}
                                        <div className="carousel-inner">
                                            {article.file.map((item, index) => {
                                                const ext = item.url.split(".").pop().toLowerCase(); // extraire l'extension de fichier
                                                return (
                                                    <div className={`carousel-item ${selectedIndex === index ? "active" : ""}`} key={`thumb-${index}`}>
                                                        {ext === "mp4" || ext === 'mov' ? (
                                                            <video controls muted className="d-block w-100" >
                                                                <source src={`${process.env.REACT_APP_MEDIA_URL}/${item.url}`} type="video/mp4" />
                                                                Votre navigateur ne support pas le tag video.
                                                            </video>
                                                        ) : (
                                                            <img src={`${process.env.REACT_APP_MEDIA_URL}/${item.url}`} className="d-block w-100" alt={item.url} />
                                                        )}

                                                        <div className="carousel-caption d-none d-md-block">
                                                            <p><span>{index + 1}</span>{" sur " + article.file.length}</p>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* tumbs */}
                                        <div className="carousel-indicators">
                                            {article.file.map((item, index) => {
                                                const ext = item.url.split(".").pop().toLowerCase(); // extraire l'extension de fichier
                                                return (
                                                    <div onClick={() => setSelectedIndex(index)} className={`button-item ${selectedIndex === index ? "active" : ""}`} key={`btn-${index}`} data-bs-target="#carouselExampleIndicators" data-bs-slide-to={index} aria-current="true" aria-label={`Slide-${index}`}>
                                                        {ext === "mp4" || ext === 'mov' ? (
                                                            <video loop autoPlay muted className="d-block w-100">
                                                                <source src={`${process.env.REACT_APP_MEDIA_URL}/${item.url}`} type="video/mp4" />
                                                                Votre navigateur ne support pas le tag video.
                                                            </video>
                                                        ) : (
                                                            <img src={`${process.env.REACT_APP_MEDIA_URL}/${item.url}`} className="d-block w-100" alt={item.url} />
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>

                                        {/* navigation */}
                                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Previous</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                </div>
                                {/* Info User, Article */}
                                <div className="col-lg-4 col-12">
                                    <div className="column px-lg-4">
                                        <div className="card-info card-info-user p-4">
                                            <div className="info-group-user" style={{
                                                display: "flex",
                                                flexWrap: "wrap"
                                            }}>
                                                <p className="username">{article.user.username}</p>
                                                {/* rating user */}
                                                <div style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "end",
                                                }}>
                                                    <div style={{
                                                        display: "flex",
                                                        alignItems: "center"
                                                    }}>
                                                        <Rating className="pe-1" name="read-only" value={RateAvg} size="small" readOnly />
                                                        <p style={{
                                                            margin: 0,
                                                        }}>({countRate})</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="info-user-location">
                                                <svg width="13" height="18" viewBox="0 0 18 23" fill="" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M17.992 9.98C17.9951 8.79928 17.7657 7.62951 17.3168 6.53746C16.8678 5.44542 16.2082 4.45249 15.3756 3.61537C13.6939 1.92473 11.4095 0.971363 9.02499 0.964998C6.64043 0.958633 4.351 1.89979 2.66036 3.58143C0.969721 5.26307 0.0163532 7.54744 0.00998798 9.932C-0.0111291 12.7022 0.793046 15.416 2.32002 17.7275C3.847 20.039 6.02763 21.8435 8.58399 22.911C8.71467 22.9702 8.85654 23.0005 8.99999 23C9.14448 23.0003 9.28735 22.9696 9.41899 22.91C11.9676 21.8457 14.1428 20.0488 15.669 17.7469C17.1952 15.445 18.0037 12.7418 17.992 9.98ZM8.99999 20.9C6.89193 19.9719 5.10429 18.4429 3.86066 16.5041C2.61702 14.5654 1.9726 12.303 2.00799 10C2.00799 9.0818 2.18884 8.17258 2.54022 7.32428C2.8916 6.47597 3.40663 5.70517 4.0559 5.05591C4.70516 4.40664 5.47596 3.89161 6.32427 3.54023C7.17257 3.18885 8.08179 3.008 8.99999 3.008C9.91819 3.008 10.8274 3.18885 11.6757 3.54023C12.524 3.89161 13.2948 4.40664 13.9441 5.05591C14.5933 5.70517 15.1084 6.47597 15.4598 7.32428C15.8111 8.17258 15.992 9.0818 15.992 10C15.992 10.021 15.992 10.045 15.992 10.065C16.0162 12.3574 15.3665 14.6064 14.1234 16.5327C12.8804 18.459 11.0988 19.9776 8.99999 20.9ZM11 10C11 10.3956 10.8827 10.7822 10.6629 11.1111C10.4432 11.44 10.1308 11.6964 9.76535 11.8478C9.3999 11.9991 8.99777 12.0387 8.60981 11.9616C8.22184 11.8844 7.86548 11.6939 7.58577 11.4142C7.30607 11.1345 7.11559 10.7781 7.03842 10.3902C6.96125 10.0022 7.00085 9.60008 7.15223 9.23463C7.3036 8.86918 7.55995 8.55682 7.88885 8.33706C8.21775 8.1173 8.60443 8 8.99999 8C9.53042 8 10.0391 8.21071 10.4142 8.58578C10.7893 8.96086 11 9.46957 11 10Z" fill="" />
                                                </svg>{article.user.city}
                                            </p>
                                            <p>{countArticleUser} annonce(s) postée(s)</p>
                                            <Link to={`/profil/${article.user.username}`}>Voir les autres annonces</Link>
                                        </div>
                                        <div className="card-info card-info-article p-4 my-4">
                                            <div className="d-flex info-article">
                                                <h1 className="title-article">{article.title}</h1>
                                                <p className="price">{article.price + "€"}</p>
                                            </div>

                                            <div className="description-article">
                                                <p className="text">{showMore ? article.content : article.content.substring(0, 100) + "..."}</p>
                                                <p className="etat">{showMore ? "État : " + article.etat : ""}</p>
                                                <p className="date">{showMore ? "Ajouté " + formatDate(article.created_at) : ""}</p>
                                                <a className="link-showMore" onClick={() => setShowMore(!showMore)}>{showMore ? "Afficher moins" : "Lire la suite"}</a>
                                            </div>
                                        </div>
                                        {Fleamarkets.id !== "" &&
                                            <div className="card-info card-info-article p-4 my-4">
                                                <div className="info-article">
                                                    <h3 className="title-article">Info Brocante</h3>
                                                </div>
                                                <div className="description-article">
                                                    <p className="text">Cet article sera disponible en brocante au <strong>{Fleamarkets.title} de {Fleamarkets.city}</strong>, le <strong>{formatDateBrocante(Fleamarkets.event_date)}</strong> à <strong>{Fleamarkets.address}</strong> </p>
                                                </div>
                                            </div>
                                        }
                                        <div className="group-btn-action d-grid gap-3">
                                            {user_id !== "" && user_id !== article.user.id &&
                                                <>
                                                    {!DeleteReservation ?
                                                        <button onClick={() => { ShowReservation() }} className="btn px-3 py-2 btn-blue btn-reservation">
                                                            Réserver cet article
                                                            <img className="ps-3 py-1" alt="icon" src={icon_reservation} />
                                                        </button>
                                                        : ''}
                                                </>
                                            }

                                            {reservationVerif.reservation && reservationVerif.reservation["userVisitor"] && reservationVerif.reservation["userVisitor"]["id"] === user_id ?
                                                <>
                                                    {DeleteReservation2 ?
                                                        <button className="btn px-3 py-3 btn-blue btn-reservation"
                                                            onClick={() => setShowModalCancelReservation(true)}>
                                                            Annuler la réservation
                                                        </button>
                                                        : ''}
                                                </>
                                                :
                                                <>
                                                    {DeleteReservation2 ?
                                                        <button className="btn px-3 py-3 btn-blue btn-reservation" disabled>
                                                            Article déjà réservé
                                                        </button>
                                                        : ''}
                                                </>
                                            }

                                            {article.user.show_contact && user_id !== "" &&
                                                <>
                                                    {!DeleteReservation2 &&
                                                        <button onClick={() => { setShowModalContact(true) }} className="btn px-3 py-2 btn-blue btn-contact">
                                                            Contacter l’exposant
                                                            <img className="ps-3 py-1" alt="icon" src={icon_phone} />
                                                        </button>
                                                    }
                                                </>
                                            }

                                            {!DeleteReservation2 && user_id !== "" &&
                                                <button onClick={() => addFavorite()} className="btn btn-yellow btn-favorite">
                                                    Ajouter aux favoris
                                                    {isLike ?
                                                        <img className="ps-3 py-1" alt="icon" src={icon_heartfull} /> :
                                                        <img className="ps-3 py-1" alt="icon" src={icon_heart} />
                                                    }
                                                </button>
                                            }
                                        </div>

                                    </div>
                                </div>
                            </div>
                            {/* modal1 */}
                            <div className={`modal ${showReservation ? "d-block" : "d-none"}`} aria-labelledby="requestArticleSuppression1Label" aria-hidden="true">
                                <div className="modal-dialog modal-lg modal-dialog-centered">
                                    <div className="modal-content">
                                        <button type="button" onClick={() => setShowReservation(false)} className="btn-close cross-hide" aria-label="Close"></button>

                                        <div className="modal-header border-0">
                                            <p className="modal-title w-100 text-center" id="requestArticleSuppression1Label">Réservation d’article</p>
                                        </div>
                                        <div className="modal-body text-center border-0">
                                            <p>Vous êtes sur le point de réserver cet article.</p>
                                            <p>Celui-ci doit être récupéré à la brocante et au créneau horaire choisi ci-après.</p>
                                        </div>
                                        <p className="text-center" style={{
                                            fontSize: "14px"
                                        }}>PS: Chaque réservation doit être honoré !</p>
                                        {CurrentFlea != null && CurrentFlea["localisation"] != null ? <div className="reservation-info">
                                            <strong>
                                                {CurrentFlea["type"]} - {CurrentFlea["localisation"]["city"]}<br></br>
                                            </strong>
                                            <p className="reservation-date">{CurrentFleaDate}</p>
                                            <p className="reservation-adresse">{CurrentFlea["address"]}</p>
                                        </div> : ''}
                                        <div className="border-0 d-grid gap-2 group-btn-action">
                                            <button type="button" onClick={() => { setShowReservation(false); setShowReservation2(true) }} className="btn btn-action-1">Confirmer la réservation</button>
                                            <button type="button" onClick={() => setShowReservation(false)} className="btn btn-action-1">Annuler</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* modal2 */}
                            <div className={`modal ${showReservation2 ? "d-block" : "d-none"}`} aria-labelledby="requestArticleSuppression1Label" aria-hidden="true">
                                <div className="modal-dialog modal-lg modal-dialog-centered">
                                    <div className="reservation-content modal-content">
                                        <button type="button" onClick={() => setShowReservation2(false)} className="btn-close cross-hide" aria-label="Close"></button>

                                        <div className="">
                                            <div className="modal-header border-0">
                                                <p className="modal-title w-100 text-leftt" id="requestArticleSuppression1Label">Réservervation</p>
                                            </div>
                                            <div className="modal-body text-left border-0">
                                                <p>Dès lors que vous validez la réservation, vous acceptez que votre speudo et votre numéro de téléphone soient communiqués à l'exposant</p>
                                                <form onSubmit={CreateReservation}>
                                                    <label>Pseudo</label>
                                                    <input className="register-input mb-3" value={ReservationData.username} disabled style={{ background: "#ffffee" }} />
                                                    <label>Email</label>
                                                    <input className="register-input mb-3" value={ReservationData.mail} disabled style={{ background: "#ffffee" }} />
                                                    <label>Téléphone</label>
                                                    <input className="register-input mb-3" value={ReservationData.phone} disabled style={{ background: "#ffffee" }} />
                                                    <label>Choisissez un horaire de retrait*</label>
                                                    <select className="register-input form-select" id="select" required value={ReservationData.delivery_hour} onChange={(e) => { setReservationData({ ...ReservationData, delivery_hour: e.target.value }) }}>
                                                        <option value={""}>Choisissez un horaire</option>
                                                        <option key="1" value="7h-8h">
                                                            Entre 7h et 8h
                                                        </option>
                                                        <option key="2" value="8h-9h">
                                                            Entre 8h et 9h
                                                        </option>
                                                        <option key="3" value="9h-10h">
                                                            Entre 9h et 10h
                                                        </option>
                                                    </select>

                                                    <div className='acceptance mrg-top mb-3'>
                                                        <input className="register-input" type="checkbox"
                                                            id="acceptance" name="acceptance" required
                                                        />
                                                        <label htmlFor="acceptance">J’ai pris connaissance des mentions légales et politique de confidentialité</label>
                                                    </div>
                                                    {
                                                        isLoading ? (
                                                            <p className="reservation-next">
                                                                <CircularProgress style={{ color: "white" }} />
                                                            </p>
                                                        ) : (
                                                            <button className="reservation-next" type="submit">
                                                                Réserver
                                                            </button>
                                                        )
                                                    }
                                                </form>
                                            </div>
                                        </div>
                                        <div className="d-none d-lg-block">
                                            <img src={frame_bonhome} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* modal1 */}
                            <div className={`modal ${showReservation3 ? "d-block" : "d-none"}`} aria-labelledby="requestArticleSuppression1Label" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <button type="button" onClick={() => setShowReservation3(false)} className="btn-close cross-hide" aria-label="Close"></button>
                                        <div className="modal-header border-0">
                                            <p className="modal-title w-100 text-center" id="requestArticleSuppression1Label">
                                                Réservation terminée et validée !
                                            </p>
                                        </div>
                                        <div className="modal-body text-center border-0">
                                            <p>Il ne vous reste plus qu'à conclure votre deal.</p>
                                        </div>
                                        <div className="reservation-info">
                                            <strong>Attention ! Chaque réservation doit être honorée.</strong>
                                        </div>
                                        <div className="border-0 d-grid gap-2 group-btn-action mrg-top">
                                            <button type="button" onClick={() => {
                                                setShowReservation3(false)
                                                history(0)
                                            }} className="btn btn-action-1">Terminer</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* modal contact user */}
                            <div className={`modal ${showModalContact ? "d-block" : "d-none"}`} aria-labelledby="requestContactUser" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-centered">
                                    <div className="modal-content">
                                        <button type="button" onClick={() => setShowModalContact(false)} className="btn-close cross-hide" aria-label="Close"></button>
                                        <div className="modal-header border-0">
                                            <p className="modal-title w-100 text-center" id="requestContactUser">Information de contact</p>
                                        </div>
                                        <div className="modal-body reservation-info">
                                            <strong>Contact : {article.user.phone}</strong>
                                        </div>
                                        <div className="border-0 d-grid gap-2 group-btn-action mrg-top">
                                            <button type="button" onClick={() => setShowModalContact(false)} className="btn btn-action-1">Terminer</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* modal cancel reservation */}
                            <div className={`modal ${showModalCancelReservation ? "d-block" : "d-none"}`} aria-labelledby="requestCancelReservation" aria-hidden="true">
                                <div className="modal-dialog modal-lg modal-dialog-centered">
                                    <div className="modal-content">
                                        <button type="button" onClick={() => setShowModalCancelReservation(false)} className="btn-close cross-hide" aria-label="Close"></button>
                                        <div className="modal-header border-0">
                                            <p className="modal-title w-100 text-center" id="requestCancelReservation">
                                                Annuler ma réservation
                                            </p>
                                        </div>
                                        <div className="modal-body text-center">
                                            <p>Vous êtes sur le point d'annuler votre réservation</p>
                                            <p>Veuillez noter que cette action peut avoir un impact sur votre profil utilisateur et cela pourrait être pris en compte par les autres vendeurs lors de vos prochaines interactions sur notre plateforme</p>
                                        </div>
                                        <div className="border-0 d-grid gap-2 group-btn-action">
                                            {
                                                isLoading ? (
                                                    <p className="btn btn-action-1 px-4 py-2">
                                                        <CircularProgress color="inherit" />
                                                    </p>
                                                ) : (
                                                    <button type="button"
                                                        className="btn btn-action-1"
                                                        onClick={(e) => {
                                                            cancelReservation(e)
                                                        }}>
                                                        Confirmer l'annulation
                                                    </button>
                                                )
                                            }
                                            <button type="button" onClick={() => setShowModalCancelReservation(false)} className="btn btn-action-1">Annuler</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {isAuth &&
                                <SliderCard title={"Nous pensons que ces articles pourraient vous intéresser"} urlArg={`${article.category.id}/${limitSlider}`} />
                            }
                        </div>
                    </div >
                    <Footer />
                </>
            }
        </>
    );
}

