import Navbar from "../../../components/header/navbar-principal/Navbar";
import FleamarketCard from "../../../utils/card/FleamarketCard/FleamarketCard";

import axios from "axios";
import { useEffect, useState } from "react";
import "./UserFleamarket.scss"
import Pagination from "../../../components/Pagination/Pagination"
import jwt from "jwt-decode";
import Button from "../../../utils/button/Button";
import Footer from "../../../components/footer/Footer";

export default function AllUserFleamarket() {
    const isAuth: Boolean = !!localStorage.getItem("token");
    let user_id: string = "";
    let user_username: string = "";
    if (isAuth) {
        const token = localStorage.getItem("token");
        const decodeToken = jwt(token);
        user_id = decodeToken["id"];
        user_username = decodeToken["username"];
    }

    const [Fleamarkets, setFleamarkets] = useState([]);

    //paggination
    const TotalArticle = 16;
    const [TotalPage, setTotalPage] = useState(Number);
    const [CurrentPage, setCurrentPage] = useState(1);
    const indexOfLastArticle = CurrentPage * TotalArticle;
    const indexOfFirstArticle = indexOfLastArticle - TotalArticle;

    useEffect(() => {
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/market/user/${user_id}`)
                .then((res) => {
                    res.data.forEach(element => {
                        setFleamarkets(oldArray => [...oldArray, element["fleaMarket"]]);
                    });
                });
        } catch {

        }

    }, []);
    return (
        <div className="ResultArticle" style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
        }}>
            <Navbar />
            <div>
                <div className="article-section">
                    <h1>Mes brocantes</h1>
                    {Fleamarkets.length > 0
                        ?
                        <div className="results">
                            <div className="fleamarket-listing">
                            {Fleamarkets?.map((item) => (
                                <>
                                    <FleamarketCard
                                        key={item.id}
                                        id={item.event_id}
                                        name={item.title}
                                        address={item.address}
                                        date={item.event_date}
                                        type={item.type}
                                        status={item.visitor_hours} />
                                </>
                            ))}
                            </div>
                        </div>
                        :
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
                            <h3 className="mb-5">Vous n'etes inscrit dans aucune brocante</h3>
                            <Button
                                style="btn-yellow"
                                text={"Rechercher des brocantes"}
                                link={"/"}
                            />
                        </div>
                    }
                </div>
                <div className="article-pagination pb-5">
                    {Fleamarkets.length > 0 &&
                        <Pagination
                            ArticleLength={Fleamarkets.length}
                            setCurrentPage={setCurrentPage}
                            setTotalPage={setTotalPage}
                            CurrentPage={CurrentPage}
                            TotalArticle={TotalArticle}
                            TotalPage={TotalPage}
                        />
                    }
                </div>
            </div>
            <Footer />
        </div>
    );
}


