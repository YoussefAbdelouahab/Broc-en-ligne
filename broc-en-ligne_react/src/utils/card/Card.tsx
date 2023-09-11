import { useState, useEffect } from "react";
import "./Card.scss"
import axios from "axios";
import jwt from "jwt-decode";
import icon_cross from "../../assets/icon/icon-cross.svg";
import moment from 'moment';
import 'moment/locale/fr';


export default function Card(props) {
    const isAuth: Boolean = !!localStorage.getItem("token");
    let user_id: string = "";
    let user_username: string = "";
    if (isAuth) {
        const token = localStorage.getItem("token");
        const decodeToken = jwt(token);
        user_id = decodeToken["id"];
        user_username = decodeToken["username"];
    }
    const ext = props.image.split(".").pop().toLowerCase(); // extraire l'extension de fichier

    const [isLike, setIsLike] = useState(false);

    useEffect(() => {
        try {
            axios.get(`${process.env.REACT_APP_API_URL}/favorite/verif?articleId=${props.id}&userId=${user_id}`).then(res => {
                if (res.data.ko) {
                    setIsLike(true);
                }
            })
        } catch (error) {
            console.log(error)
        }
    }, []);

    const handleClick = () => {
        if (isLike == false) {
            try {
                axios.post(`${process.env.REACT_APP_API_URL}/favorite/article/`, { articleId: props.id, userId: user_id }).then(res => {
                    setIsLike(!isLike);
                })
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                axios.delete(`${process.env.REACT_APP_API_URL}/favorite/delete?articleId=${props.id}&userId=${user_id}`).then(res => {
                    setIsLike(!isLike);
                })
            } catch (error) {
                console.log(error)
            }
        }

    };

    const formatDateBrocante = (date) => {
        return moment(date).locale("fr").format('LL');
    }

    return (
        <>
            <div className="card card-product col-5 col-md-3" style={{ position: "relative" }}>
                {props.status == 1 && (
                    <div className="py-2 tag-reserved">
                        Article déjà réservé
                    </div>
                )}
                {ext === 'mp4' || ext === 'mov' ? (
                    <video loop autoPlay muted className="card-img">
                        <source src={`${process.env.REACT_APP_MEDIA_URL}/${props.image}`} type="video/mp4" />
                        Votre navigateur ne support pas le tag video.
                    </video>
                ) : (
                    <img alt={props.image} src={`${process.env.REACT_APP_MEDIA_URL}/${props.image}`} className="card-img" />
                )}
                <div className="card-body">
                    <p className="card-text">Vendu par <span>{
                        props.username.length <= 12 ? props.username : props.username.substring(0, 12) + "..."
                    }</span>
                    </p>
                    <div className="d-flex">
                        <div className="col-10">
                            {props.city &&
                                <p className="card-date">{props.city}, le {formatDateBrocante(props.date_event)}</p>
                            }
                            <h5 className="card-title">{props.name.length <= 17 ? props.name : props.name.substring(0, 17) + "..."}</h5>
                            <p className="card-price">{props.price} €</p>
                        </div>
                        <div className="col col-heart">
                            <svg onClick={handleClick} className={(isLike ? "liked" : "")} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="1" d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z" stroke="#FFE483" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </div>
                    <a href={"/article/" + props.id} className="stretched-link"></a>
                </div>
            </div>
        </>
    );
}