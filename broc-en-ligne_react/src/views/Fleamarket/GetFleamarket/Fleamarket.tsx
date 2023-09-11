import { Link, useNavigate } from "react-router-dom";

import Navbar from "../../../components/header/navbar-principal/Navbar";
import ApplyFleamarket from "../../../components/Modals/ApplyFleamarket/ApplyFleamarket";

import moment from 'moment';
import './Fleamarket.scss';
import 'moment/locale/fr';
import axios from "axios";
import { useEffect, useState } from "react";

import clockIcon from "../../../assets/icon/clock-icon.svg";
import arrow from "../../../assets/icon/arrow.svg";
import euroIcon from "../../../assets/icon/euro-icon.svg";
import exhibitorIcon from "../../../assets/icon/exhibitor-icon.svg";
import jwt from "jwt-decode";
import illustrationHomme from "../../../assets/illustration/illustration-homme2.svg";
import Footer from "../../../components/footer/Footer";


const baseUrl = `${process.env.REACT_APP_API_URL}`


export default function Fleamarket() {

    const url = window.location.href;
    const arrayUrl = url.split("/");
    const fleamarketId = arrayUrl[arrayUrl.length - 1];
    let user_id = "";
    const token = localStorage.getItem("token");
    if (token) {
        const decodedToken = jwt(token);
        user_id = decodedToken["id"];
    }
    let history = useNavigate();

    const [fleamarket, setfleamarket] = useState(null);
    const [alreadyApplied, setAlreadyApplied] = useState(null);

    useEffect(() => {
        axios.get(`${baseUrl}/market/${fleamarketId}`)
            .then(res => {
                console.log(res.data);
                setfleamarket(res.data);
            }).catch((err) => console.log(err));

        axios.post(`${baseUrl}/checkifapplied`, { userId: user_id, fleamarketId: fleamarketId })
            .then(res => {
                setAlreadyApplied(res.data)
                console.log(alreadyApplied)
            })
    }, []);

    const formatDate = (date) => {
        return moment(date, 'YYYY-MM-DD').format("dddd Do MMMM ");
    }

    return (
        <>
            <Navbar />
            {fleamarket &&
                <>
                    <div className="mt-5" style={{
                        margin: "auto",
                        width: "85%",
                        display: "flex",
                        justifyContent: "end"
                    }}>
                        <ApplyFleamarket fleamarketId={fleamarket.id} userId={user_id} />
                    </div>
                </>
            }
            {fleamarket &&
                <div className="container mt-3">
                    <a onClick={() => history(-1)} className="link-return"><img src={arrow} alt="" />Retour</a>
                    <div className="row fleamarket-infos-container mt-3">
                        <div className="fleamarket-container infos">
                            <div className="visitor-informations p-4 card">
                                <div className="infos-title-container">
                                    <div className="main-infos">
                                        <h2 className="title"> {fleamarket.title} <span>&nbsp;- {formatDate(fleamarket.event_date)}</span></h2>
                                    </div>
                                    <div className="adress-container">
                                        <p className="address"> {fleamarket.address} </p>
                                    </div>
                                </div>
                                <div className="visitor-infos-list">
                                    <ul className="info-list">
                                        {fleamarket.visitor_hours && <li><span className="img-container"><img src={clockIcon} alt="clock icon" /></span>{fleamarket.visitor_hours}</li>}
                                        {fleamarket.price && <li><span className="img-container"><img src={euroIcon} alt="clock icon" /></span>Entrée {fleamarket.price.toLowerCase()}</li>}
                                        {fleamarket.exhibitor_count && <li><span className="img-container"><img src={exhibitorIcon} alt="clock icon" /></span>{fleamarket.exhibitor_count} exposants</li>}
                                    </ul>
                                </div>
                            </div>
                            <div className="exhibitor-informations p-5 card">
                                <h2>Infos Exposant</h2>
                                {fleamarket.exhibitor_type &&
                                    <div className="type-exposant">
                                        <h6>Type d'exposants :</h6>
                                        <p>{fleamarket.exhibitor_type}</p>
                                    </div>
                                }
                                {fleamarket.exhibitor_hours &&
                                    < div className="horaire-exposant">
                                        <h6>Horaires exposants :</h6>
                                        <p>{fleamarket.exhibitor_hours}</p>
                                    </div>
                                }
                                {fleamarket.layout &&
                                    <div className="amenagement">
                                        <h6>Aménagement :</h6>
                                        <p> {fleamarket.layout} </p>
                                    </div>
                                }
                            </div>
                        </div>
                        {fleamarket.description &&
                            <div className="fleamarket-container">
                                <div className="fleamarket-description-container card">
                                    <div className="fleamarket-description p-5">
                                        <h2>Description</h2>
                                        <p>{fleamarket.description}</p>
                                    </div>
                                    <div className="fleamarket-illustration">
                                        <img src={illustrationHomme} alt="illustration-homme2" />
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </div >
            }
            <Footer />
        </>
    );
}


