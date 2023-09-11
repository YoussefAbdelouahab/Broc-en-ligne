import Card from "../../utils/card/Card";
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from "swiper";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import "./SliderCard.scss";

import axios from "axios";
import { useEffect, useState } from "react";
import CardSlide from "../../utils/card/CardSlide";

const BaseUrl: String = `${process.env.REACT_APP_API_URL}`;

export default function Slidercard({ title, urlArg }) {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        axios.get(`${BaseUrl}/articles/slider/${urlArg}`)
            .then(res => {
                setArticles(res.data);
            }).catch((err) => console.log(err));
    }, [urlArg]);

    return (
        <>
            <div className="container py-5">
                {articles.length > 0 ? (
                    <>
                        <h2 className="pt-3 pb-5">{title}</h2>
                        <Swiper
                            // install Swiper modules
                            modules={[Navigation, Pagination]}
                            slidesPerView={4}
                            spaceBetween={0}
                            breakpoints={{
                                0: {
                                    slidesPerView: 2
                                },
                                768: {
                                    slidesPerView: 3
                                },
                                1280: {
                                    slidesPerView: 4
                                }
                            }}
                            navigation
                            pagination={{ clickable: true }}
                            className='card-slider py-5'>
                            {articles.map((article) => (
                                <SwiperSlide key={article.id}>
                                    <CardSlide
                                        id={article.id}
                                        name={article.title}
                                        image={article.file[0].url}
                                        price={article.price}
                                        username={article.user.username}
                                        city={article.user.userFleamarkets && article.user.userFleamarkets.length > 0 ? article.user.userFleamarkets[0].fleaMarket.localisation.city : ""}
                                        date_event={article.user.userFleamarkets && article.user.userFleamarkets.length > 0 ? article.user.userFleamarkets[0].fleaMarket.event_date : ""}
                                        status={article.status} />
                                </SwiperSlide>
                            ))}

                        </Swiper>
                    </>
                ) : (
                    ""
                )}
            </div>
        </>
    );
}