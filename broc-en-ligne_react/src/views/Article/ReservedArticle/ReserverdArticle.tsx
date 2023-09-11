import Navbar from "../../../components/header/navbar-principal/Navbar";
import Card from "../../../utils/card/Card";

import axios from "axios";
import { useEffect, useState } from "react";
import "../ArticleResult/ResultArticle.scss"
import Pagination from "../../../components/Pagination/Pagination"
import jwt from "jwt-decode";
import Button from "../../../utils/button/Button";
import Footer from "../../../components/footer/Footer";


export default function FavorisArticle() {
    const isAuth: Boolean = !!localStorage.getItem("token");
    let user_id: string = "";
    let user_username: string = "";
    if (isAuth) {
        const token = localStorage.getItem("token");
        const decodeToken = jwt(token);
        user_id = decodeToken["id"];
        user_username = decodeToken["username"];
    }

    const [articles, setArticles] = useState([]);

    //paggination
    const TotalArticle = 16;
    const [TotalPage, setTotalPage] = useState(Number);
    const [CurrentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/reservation/${user_id}`)
            .then((res) => {
                setArticles(res.data)
                console.log(res.data[0].fleamarket.event_date)
                console.log(res.data[0].fleamarket.localisation.city)
            });

    }, []);

    const indexOfLastArticle = CurrentPage * TotalArticle;
    const indexOfFirstArticle = indexOfLastArticle - TotalArticle;

    return (
        <div className="ResultArticle" style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
        }}>
            <Navbar />
            <div>
                <div className="container py-5 d-flex flex-column justify-content-center">
                    <h1 className="mb-5 ms-3">Mes produits réservés</h1>
                    <div className="d-flex flex-wrap justify-content-center gap-4">
                        {articles.length > 0
                            ?
                            <>
                                {
                                    articles.map((item) => (
                                        <>
                                            {item.article.map((article) => (
                                                <Card
                                                    key={article.article.id}
                                                    id={article.article.id}
                                                    name={article.article.title}
                                                    image={article.article.file[0].url}
                                                    price={article.article.price}
                                                    username={article.article.user.username}
                                                    city={article.fleamarket.localisation.city}
                                                    date_event={article.fleamarket.event_date}
                                                    status={article.article.status} />
                                            ))}
                                        </>
                                    ))
                                }
                            </>
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
                                <h3 className="mb-5">Vous n’avez pas encore d'article en favoris</h3>
                                <Button
                                    style="btn-yellow"
                                    text={"Rechercher des articles"}
                                    link={"/"}
                                />
                            </div>
                        }
                    </div>
                </div>
                <div className="article-pagination mb-5">
                    {articles.length > 0 &&
                        <Pagination
                            ArticleLength={articles.length}
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