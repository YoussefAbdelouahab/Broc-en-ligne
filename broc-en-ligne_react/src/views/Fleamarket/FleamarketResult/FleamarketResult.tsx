import Navbar from "../../../components/header/navbar-principal/Navbar";
import FleamarketList from "../../../components/fleamarket-list/FleamarketList";
import { useEffect, useState } from "react";
import axios from "axios";

import './FleamarketResult.scss'
import SearchMenu from "../../../components/search/searchMenu";
import Footer from "../../../components/footer/Footer";

const baseUrl = `${process.env.REACT_APP_API_URL}`

export default function FleamarketResult() {

    const queryParameters = new URLSearchParams(window.location.search);
    const type = queryParameters.get("type");
    const localisation = queryParameters.get("localisation");

    const [fleamarkets, setFleamarkets] = useState([]);

    useEffect(() => {
        try {
            axios.get(`${baseUrl}/market/search?type=${type}&localisation=${localisation || 0}`)
                .then(res => {
                    console.log("brocante", res.data)
                    setFleamarkets(res.data);
                }).catch((err) => console.log(err));
        } catch (error) {
            console.log(error)
        }
    }, []);

    return (
        <>
            <Navbar />
            <div className="fleamarket-result-container p-5" style={{
                minHeight: "100vh"
            }}>
                <div className="search-article-section">
                    <SearchMenu isActive={false} />
                </div>
                <div className="result-infos">
                    <h2 className="result-title mb-5">
                        Résultats pour
                        {type ? type : " tous les évènements"}, {fleamarkets[0] && localisation ?
                            "dans le " + localisation : "dans toute la france"}
                    </h2>
                    <div className="results">
                        <div className="fleamarket-listing">
                            {fleamarkets[0] ? (
                                <FleamarketList fleamarkets={fleamarkets} />
                            ) : (
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
                                    <h3 className="text-center">Désolé, nous n'avons pas d'évènement correspondant !</h3>
                                    <p className="text-center">Il n'y a aucun événement correspondant à votre recherche. N'hésitez pas à essayez une autre recherche !</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div >
            <Footer />
        </>
    );
}