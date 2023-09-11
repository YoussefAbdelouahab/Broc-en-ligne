import Navbar from "../../../components/header/navbar-principal/Navbar";
import Footer from "../../../components/footer/Footer";

import Button from "../../../utils/button/Button";
import ArticleCard from "../../../utils/card/ArticleCard";

import icon_mail from "../../../assets/icon/mail.svg";
import icon_localisation from "../../../assets/icon/localisation.svg";
import icon_tel from "../../../assets/icon/tel.svg";
import image_no_product from "../../../assets/illustration/bg-profile-no-product.png";
import "./Profile.scss";
import axios from "axios";
import jwt from "jwt-decode";
import { useEffect, useState } from "react";
import moment from 'moment';
import 'moment/locale/fr';
import { Rating } from "@mui/material";

const baseUrl = `${process.env.REACT_APP_API_URL}`

export default function App() {
  const isAuth: Boolean = !!localStorage.getItem("token");
  let user_id: string = "";
  let user_username: string = "";
  if (isAuth) {
    const token = localStorage.getItem("token");
    const decodeToken = jwt(token);
    user_id = decodeToken["id"];
    user_username = decodeToken["username"];
  }

  const url = window.location.href;
  const arrayUrl = url.split("/");
  const url_user_username = arrayUrl[arrayUrl.length - 1];

  const [Isvalid, setIsvalid] = useState(false);

  const [Ischecked, setIschecked] = useState(true);

  const [user, setUser] = useState(null);
  const [fleamarkets, setFleamarkets] = useState(null);

  const [RateAvg, setRateAvg] = useState(null);
  const [countRate, setCountRate] = useState(null);
  const [RateModal, setRateModal] = useState(false);
  const [rateValue, setRateValue] = useState(0);
  const [NoRate, setNoRate] = useState(false);
  const [ErrorRate, setErrorRate] = useState("");

  useEffect(() => {
    function validateUser() {
      if (user_username === url_user_username) {
        setIsvalid(true)
      } else {
        setIsvalid(false);
      }
    }


    try {
      axios.get(`${baseUrl}/article/user/username/${url_user_username}`).then(res => {
        setUser(res.data[0]);
        axios.get(`${process.env.REACT_APP_API_URL}/market/user/${res.data[0].id}`).then(res => {
          setFleamarkets(res.data[0])
        })

      })
      axios.get(`${baseUrl}/rate/${url_user_username}`).then(res => {
        setRateAvg(Math.round(res.data.averageRate.averageRage * 100) / 100);
        setCountRate(res.data.count)
      })
    } catch (error) {
      console.log(error);
    }

    validateUser();
  }, []);

  function checkradio() {
    setIschecked(prevState => !prevState);
  }

  const formatDate = (date) => {
    return moment(date).locale("fr").format('LL');
  }

  function updateArticles(updatedArticles) {
    setUser((prevState) => {
      return { ...prevState, article: updatedArticles };
    });
  }

  async function handleDeleteClick(id) {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/article/${id}`);
      const updatedArticles = await user.article.filter((article) => article.id !== id);
      updateArticles(updatedArticles);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmitRate(e) {
    e.preventDefault();

    await axios.post(`${baseUrl}/rate/`, {
      score: rateValue,
      scoring_user: user_id,
      userId: user.id,
    }).then(res => {
      setRateModal(false);
      try {
        axios.get(`${process.env.REACT_APP_API_URL}/article/user/username/${url_user_username}`).then(res => {
          setUser(res.data[0]);
        })
        axios.get(`${process.env.REACT_APP_API_URL}/rate/${url_user_username}`).then(res => {
          setRateAvg(Math.round(res.data.averageRate.averageRage * 100) / 100);
          setCountRate(res.data.count)
        })
      } catch (error) {
        console.log(error);
      }
    }).catch((err) => {
      if (err.response.data.message) {
        setErrorRate("Vous avez déjà noté cet utilisateur");
      }
    });

  }

  const formatDateBrocante = (date) => {
    return moment(date).locale("fr").format('LL');
  }

  return (
    <>
      {user && (
        <>
          <Navbar />
          <div className="container py-5 px-3 profile">
            {/* Profile data section */}
            <div className="row d-flex justify-content-center">
              {/* profile card */}
              <div className={isAuth ? "col-lg-7 p-3" : "col-10 p-3"}>
                <div className="card-profile">
                  <div className="card-profile-header row">
                    <div className="avatar">
                      <p>{user.firstname.substr(0, 1).toUpperCase()}{user.lastname.substr(0, 1).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className="card-profile-content row p-4">
                    {/* Profile left box, left part of the mid part*/}
                    <div className="card-profile-info col-lg-7">
                      <h2>{user.username}</h2>
                      <p>
                        Inscrit depuis le {formatDate(user.created_at)}
                      </p>
                    </div>

                    <div className="card-profile-group-action col-lg-5">
                      {/* rating user */}
                      <div style={{
                        display: "flex",
                        justifyContent: "end",
                      }}>
                        <div onClick={() => setRateModal(true)} style={{
                          display: "flex",
                        }}>
                          <Rating className="pe-1" name="read-only" value={RateAvg} size="medium" readOnly />
                          <p>{countRate} notes</p>
                        </div>
                      </div>
                      {Isvalid &&
                        <div className="d-grid gap-2">
                          <Button
                            style="btn-yellow btn-add-article"
                            text={"Déposer un article"}
                            link={"/article"}
                          />
                        </div>
                      }
                    </div>

                  </div>
                </div>
              </div>

              {/* profile info */}
              {isAuth &&
                <div className="col-lg-5 p-3">
                  <div className="card-info p-4">
                    <h3 className="mb-3">À propos</h3>
                    <div className="card-info-icon card-info-mail">
                      <img src={icon_mail} alt="icon mail" className="icon_mail" />
                      <p>{user.mail}</p>
                    </div>

                    <div className="card-info-icon card-info-localisation">
                      <img src={icon_localisation} alt="icon localisation" />
                      <p>{user.city}, {user.zip_code}</p>
                    </div>

                    <div style={{ display: user.show_contact === true ? 'block' : 'none' }}>
                      <div className="card-info-icon card-info-contact" >
                        <img src={icon_tel} alt="icon phone" />
                        <p>{user.phone}</p>
                      </div>
                    </div>
                  </div>

                </div>
              }
            </div>
            <div className="row d-flex justify-content-center">
              {/* info brocante */}
              {Isvalid &&
                <div className="col-12 mt-3 mb-4">
                  <div className="container-brocante p-lg-5 py-5 px-4" style={{
                    display: "flex",
                    flexDirection: "column",
                    background: "#E5ECF650",
                    border: "1px solid #E5ECF6",
                    minHeight: "200px",
                    width: "100%",
                    borderRadius: "10px"
                  }}>
                    <div className="d-flex flex-lg-row flex-column align-items-center" >
                      <div className="col-lg-9 col-12 pe-4 pb-3 pb-lg-0">
                        <h3>Rendez visibles vos articles !</h3>
                        <p>Pour que vos articles soient visibles auprès des autres utilisateurs, il faut <strong>être inscrit dans une brocante.</strong></p>
                      </div>
                      <div className="col-lg-3 col-12 d-grid gap-3 px-2 px-sm-5 px-lg-0">
                        <Button
                          style="btn-blue w-100 btn-update-fleaMarket2 py-3"
                          text={"M'inscrire à une brocante"}
                          link={"/recherche-brocante?type=&localisation="}
                        />
                        <Button
                          style="btn-blue w-100 btn-update-fleaMarket2 py-3"
                          text={"Mes brocantes"}
                          link={"/brocante"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              }
              {fleamarkets &&
                <div className="col-12">
                  <div className="text-brocante p-lg-5 py-5 px-4" style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",
                    background: "#E5ECF650",
                    border: "1px solid #E5ECF6",
                    minHeight: "150px",
                    width: "100%",
                    borderRadius: "10px"
                  }}>
                    <h3>Précisions importantes sur l'événement à venir.</h3>
                    <p className="mt-2 mb-0">Ces articles seront disponibles en brocante au <strong>{fleamarkets.fleaMarket.title} de {fleamarkets.fleaMarket.localisation.city}</strong></p>
                    <p className="">Le <strong>{formatDateBrocante(fleamarkets.fleaMarket.event_date)}</strong> à <strong>{fleamarkets.fleaMarket.address}</strong>.
                    </p>
                  </div>
                </div>
              }
            </div>
            {/* Article section*/}
            <div className="row d-flex justify-content-center p-3">
              {/* Article box*/}
              {user.article.length < 1 ? (
                <>
                  {Isvalid ? (
                    <div className="mt-3 p-5" style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      background: "#FFF4CF50",
                      border: "1px solid #FFE483",
                      height: "200px",
                      width: "100%",
                      borderRadius: "10px"
                    }}>
                      <h3 className="mb-5">Vous n’avez pas d’annonces en ligne</h3>
                      <Button
                        style="btn-yellow"
                        text={"Déposer un article"}
                        link={"/article"}
                      />
                    </div>
                  ) : (
                    <div className="mt-3" style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center"

                    }}>
                      <h3 className="mb-5">{user.username} n’a pas d’annonce en ligne</h3>
                      <img className="mt-3" src={image_no_product} alt="pas de produit" style={{
                        width: "60%",
                        margin: "auto"
                      }} />
                    </div>
                  )}
                </>
              ) : (
                <div className={isAuth ? "col-lg article" : "col-10 article"}>
                  <div className="radio-article" onChange={() => checkradio()}>
                    {/* Radio button*/}
                    <input id="rad1" type="radio" name="rad" defaultChecked />
                    <label htmlFor="rad1"> Articles déposés ({user.article.length})</label>
                    <input id="rad2" type="radio" name="rad" />
                    <label htmlFor="rad2"> Articles réservés ({user.article.filter(article => article.status === 1).length})</label>
                  </div>

                  {Ischecked && <div className="article-scroll">
                    {user.article.map((article) => (
                      <ArticleCard
                        key={article.id}
                        id={article.id}
                        name={article.title}
                        image={article.file[0].url}
                        status={article.status}
                        price={article.price}
                        date={article.created_at}
                        user={user}
                        onDelete={() => handleDeleteClick(article.id)} />
                    ))}
                  </div>}

                  {!Ischecked && <div className="article-scroll">
                    {user.article.map((article) => article.status === 1 && (
                      <ArticleCard
                        key={article.id}
                        id={article.id}
                        name={article.title}
                        image={article.file[0].url}
                        status={article.status}
                        price={article.price}
                        date={article.created_at}
                        user={user}
                        setUser={setUser} />
                    ))}
                  </div>}
                </div>
              )}
            </div>
          </div >
          <Footer />
          {/* modal3 end reservation */}
          <div className={`modal ${RateModal ? "d-block" : "d-none"}`} aria-labelledby="requestArticleSuppression1Label" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <button type="button" onClick={() => setRateModal(false)} className="btn-close cross-hide" aria-label="Close"></button>
                <div className="modal-header border-0">
                  <p className="modal-title w-100 text-center" id="requestArticleSuppression1Label">Notation</p>
                </div>
                <form action="" onSubmit={handleSubmitRate}>

                  <div className="modal-body text-center border-0">
                    <p>Vous etes sur le point <br></br>de <strong>noter {user.username}</strong></p>
                    <Rating
                      name="simple-controlled"
                      value={rateValue}
                      onChange={(event, newValue) => {
                        setRateValue(newValue);
                      }}
                      size="large"
                    />
                  </div>
                  <div className="border-0 d-grid gap-2 group-btn-action mrg-top">
                    <button type="submit" className="btn btn-action-1">Terminer</button>
                    {ErrorRate.length != 0 ? <strong>{ErrorRate}</strong> : ''}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )
      }
    </>
  );
}
