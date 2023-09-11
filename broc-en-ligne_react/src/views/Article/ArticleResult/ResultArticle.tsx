import Navbar from "../../../components/header/navbar-principal/Navbar";
import Card from "../../../utils/card/Card";

import axios from "axios";
import { useEffect, useState } from "react";
import SearchMenu from "../../../components/search/searchMenu";
import "./ResultArticle.scss"
import Pagination from "../../../components/Pagination/Pagination"
import { useNavigate } from "react-router-dom";
import Footer from "../../../components/footer/Footer";
import { start } from "repl";
import { wrap } from "module";


export default function ResultArticle() {
    const location = new URL(window.location.href);
    const searchParams = new URLSearchParams(location.search)

    const [articles, setArticles] = useState([]);

    //paggination
    const TotalArticle = 16;
    const [TotalPage, setTotalPage] = useState(Number);
    const [CurrentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            const queryParams = new URLSearchParams({
                category: searchParams.get('category'),
                title: searchParams.get('title'),
                localisation: searchParams.get('localisation')
            });

            const url = `${process.env.REACT_APP_API_URL}/articles/search?${queryParams.toString()}`;

            try {
                const response = await axios.get(url);
                setArticles(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [location.search]);

    const indexOfLastArticle = CurrentPage * TotalArticle;
    const indexOfFirstArticle = indexOfLastArticle - TotalArticle;


    return (
        <>
            <Navbar />
            <div className="fleamarket-result-container" style={{
                minHeight: "100vh"
            }}>
                <div className="search-article-section p-5">
                    <SearchMenu isActive={true} />
                </div>
                <div className="container py-5 d-flex flex-column justify-content-center">
                    <h2 className="mb-5 ms-3">
                        Résultats pour&thinsp;
                        {searchParams.get("title")}
                    </h2>
                    <div className="d-flex flex-wrap justify-content-center gap-4">
                        {articles.length !== 0 ? (
                            <>
                                {articles.map((article) => (
                                    <Card
                                        key={article.id}
                                        id={article.id}
                                        name={article.title}
                                        image={article.file[0].url}
                                        price={article.price}
                                        username={article.user.username}
                                        city={article.user.userFleamarkets && article.user.userFleamarkets.length > 0 ? article.user.userFleamarkets[0].fleaMarket.localisation.city : ""}
                                        date_event={article.user.userFleamarkets && article.user.userFleamarkets.length > 0 ? article.user.userFleamarkets[0].fleaMarket.event_date : ""}
                                        status={article.status} />
                                ))}
                            </>
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
                                <h3>Désolé, nous n'avons pas d'annonces correspondantes !</h3>
                                <p>Est-il possible qu’une faute de frappe se soit glissée dans votre recherche ? N'hésitez pas à vérifier !</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="article-pagination mb-5">
                    {articles.length > 0 ? <Pagination ArticleLength={articles.length} setCurrentPage={setCurrentPage} setTotalPage={setTotalPage} CurrentPage={CurrentPage} TotalArticle={TotalArticle} TotalPage={TotalPage} /> : null}
                </div>
            </div>
            <Footer />
        </>
    );
}
