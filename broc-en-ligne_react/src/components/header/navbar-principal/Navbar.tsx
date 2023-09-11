import { Link, NavLink } from "react-router-dom";

import "./Navbar.scss"
import logo from "../../../assets/brand.svg";
import Button from "../../../utils/button/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import icon_user_profile from "../../../assets/icon/icon-user-profile.svg";
import icon_edit from "../../../assets/icon/icon-edit.svg";
import icon_logout from "../../../assets/icon/icon-logout.svg";
import jwt from "jwt-decode";
import { useState, useEffect } from "react";
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function Navbar() {
    const isAuth: boolean = !!localStorage.getItem("token");

    let user_id: string;
    let user_username: string;
    let user_role: string;

    if (isAuth) {
        const token = localStorage.getItem("token");
        const decodeToken = jwt(token);
        user_id = decodeToken["id"];
        user_username = decodeToken["username"];
        user_role = decodeToken["role"];
    }

    const [searchArticles, setSearchArticles] = useState({
        category: "",
        title: "",
    })
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/categories`)
            .then(res => {
                setCategories(res.data);
            });
    }, []);

    const navigate = useNavigate();
    function Logout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    const handleSumitSearch = (e) => {
        e.preventDefault();

        const queryParams = new URLSearchParams({
            category: searchArticles.category || "0",
            title: searchArticles.title,
            localisation: "0"
        });

        const url = `${process.env.REACT_APP_API_URL}/articles/search?${queryParams.toString()}`;

        axios
            .get(url)
            .then((res) => {
                const searchUrl = `/recherche-article?${queryParams.toString()}`;
                navigate(searchUrl);
                window.location.reload();
            })
            .catch((err) => {
                console.error(err);
            });
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg">
                <div className="container-lg container-fluid">

                    {/* logo */}
                    <Link className="navbar-brand pe-lg-4 pe-2" to="/">
                        <img alt="Broc en ligne" src={logo} />
                    </Link>

                    {/* menu burger */}
                    <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse navbar-element" id="navbarSupportedContent">
                        <div className="order-direction">
                            {/* form search */}
                            <div className="col col-xxl-6 d-none d-lg-block px-4 pt-1">
                                <form className="input-group search-bar-principal" onSubmit={handleSumitSearch}>
                                    {/* button dropdown category */}
                                    <select className="form-select btn-select-category" id="select" value={searchArticles.category} onChange={(e) => { setSearchArticles({ ...searchArticles, category: e.target.value }) }}>
                                        <option value={""}>Catégorie</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.title}
                                            </option>
                                        ))}
                                    </select>

                                    {/* input search */}
                                    <input className="form-control input-search" type="search" placeholder="Rechercher des articles" aria-label="Rechercher" onChange={(e) => setSearchArticles({ ...searchArticles, title: e.target.value })} />
                                    <button type="submit" className="input-group-text btn-search">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            className="bi bi-search" viewBox="0 0 16 16">
                                            <path
                                                d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                                        </svg>
                                    </button>
                                </form>
                            </div>
                            <div className="col-xxl"></div>

                            {/* button if login */}
                            {user_id ?
                                <>
                                    <div className="group-button d-grid gap-2 d-lg-flex">
                                        <div className="px-3 p-lg-0 py-4 ">
                                            <Button style="btn-yellow py-3 py-lg-2" text={"Déposer un article"} link="/article" />
                                        </div>
                                        <ul className="nav ul-navbar">
                                            {/* icon reserve */}
                                            <li>
                                                <Link className="nav-link" to="/article/reserve">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path opacity="0.5" d="M19 14C19.21 14.0001 19.4146 13.934 19.585 13.8112C19.7553 13.6885 19.8827 13.5152 19.949 13.316L21.949 7.316C21.9991 7.16567 22.0127 7.00559 21.9888 6.84895C21.9648 6.69232 21.904 6.54362 21.8113 6.41509C21.7187 6.28657 21.5968 6.18192 21.4557 6.10975C21.3146 6.03758 21.1585 5.99996 21 6H7V2C7 1.73478 6.89464 1.48043 6.70711 1.29289C6.51957 1.10536 6.26522 1 6 1H3C2.73478 1 2.48043 1.10536 2.29289 1.29289C2.10536 1.48043 2 1.73478 2 2C2 2.26522 2.10536 2.51957 2.29289 2.70711C2.48043 2.89464 2.73478 3 3 3H5V17C5 17.2652 5.10536 17.5196 5.29289 17.7071C5.48043 17.8946 5.73478 18 6 18H18C18.2652 18 18.5196 17.8946 18.7071 17.7071C18.8946 17.5196 19 17.2652 19 17C19 16.7348 18.8946 16.4804 18.7071 16.2929C18.5196 16.1054 18.2652 16 18 16H7V14H19ZM7 8H19.613L18.279 12H7V8ZM6.5 19C6.79667 19 7.08668 19.088 7.33336 19.2528C7.58003 19.4176 7.77229 19.6519 7.88582 19.926C7.99935 20.2001 8.02906 20.5017 7.97118 20.7926C7.9133 21.0836 7.77044 21.3509 7.56066 21.5607C7.35088 21.7704 7.08361 21.9133 6.79264 21.9712C6.50166 22.0291 6.20006 21.9993 5.92597 21.8858C5.65189 21.7723 5.41762 21.58 5.2528 21.3334C5.08797 21.0867 5 20.7967 5 20.5C5 20.1022 5.15804 19.7206 5.43934 19.4393C5.72064 19.158 6.10218 19 6.5 19ZM16.5 19C16.7967 19 17.0867 19.088 17.3334 19.2528C17.58 19.4176 17.7723 19.6519 17.8858 19.926C17.9993 20.2001 18.0291 20.5017 17.9712 20.7926C17.9133 21.0836 17.7704 21.3509 17.5607 21.5607C17.3509 21.7704 17.0836 21.9133 16.7926 21.9712C16.5017 22.0291 16.2001 21.9993 15.926 21.8858C15.6519 21.7723 15.4176 21.58 15.2528 21.3334C15.088 21.0867 15 20.7967 15 20.5C15 20.1022 15.158 19.7206 15.4393 19.4393C15.7206 19.158 16.1022 19 16.5 19Z" fill="black" />
                                                    </svg>
                                                    <p className="d-block d-lg-none">Mes réservations</p>
                                                </Link>
                                            </li>

                                            {/* icon heart */}
                                            <li>
                                                <Link className="nav-link" to="/article/favoris">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path opacity="0.5" d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.68998C2 5.59998 4.49 3.09998 7.56 3.09998C9.38 3.09998 10.99 3.97998 12 5.33998C13.01 3.97998 14.63 3.09998 16.44 3.09998C19.51 3.09998 22 5.59998 22 8.68998C22 15.69 15.52 19.82 12.62 20.81Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    <p className="d-block d-lg-none">Mes favoris</p>
                                                </Link>
                                            </li>

                                            {/* profile */}
                                            <div className="d-flex">
                                                <div className="dropdown mt-1">
                                                    <button className="btn dropdown-profile" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="22.5" height="22.5" fill="#797b7d" className="bi bi-person-circle icon-profile-mobile d-block d-lg-none" viewBox="0 0 16 16">
                                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                                                        </svg>
                                                        Profil
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="22.5" height="22.5" fill="#797b7d" className="bi bi-person-circle d-none d-lg-block" viewBox="0 0 16 16">
                                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                                            <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z" />
                                                        </svg>
                                                    </button>
                                                    <ul className="dropdown-menu dropdown-item-profile">
                                                        <li>
                                                            <a className="dropdown-item" href={`/profil/${user_username}`}>
                                                                <img src={icon_user_profile} />
                                                                Mon profil
                                                            </a>
                                                        </li>
                                                        {user_role === "ADMIN" &&
                                                            <li>
                                                                <a className="dropdown-item" href={`/intranet/dashboard`}>

                                                                    <AdminPanelSettingsIcon sx={{
                                                                        mr: 1.25,
                                                                        color: "#295da2"
                                                                    }} />
                                                                    Administration
                                                                </a>
                                                            </li>
                                                        }
                                                        <li>
                                                            <Link className="dropdown-item" to={`/parametres`}>
                                                                <img src={icon_edit} />
                                                                Mes paramètres
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <a className="dropdown-item" onClick={Logout}>
                                                                <img src={icon_logout} />
                                                                Déconnexion
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </ul>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="group-button d-grid gap-lg-2 gap-3 d-lg-flex justify-content-lg-end p-lg-0 m-lg-0 py-4 px-3 mt-2">
                                        <Button style="btn-blue py-3 py-lg-2" text={"Déposer un article"} link={"/connexion"} />
                                        <Button style="btn-yellow py-3 py-lg-2" text={"Inscription"} link={"/inscription"} />
                                        <Button style="btn-yellow py-3 py-lg-2" text={"Connexion"} link={"/connexion"} />
                                    </div>
                                </>
                            }
                        </div >
                    </div >
                </div >
            </nav >

            <div className="nav d-lg-none sub-nav">
                <div className="container-fluid py-3">
                    <form className="input-group search-bar-principal" onSubmit={handleSumitSearch}>

                        <select className="form-select btn-select-category" id="select" value={searchArticles.category} onChange={(e) => { setSearchArticles({ ...searchArticles, category: e.target.value }) }}>
                            <option value={""}>Catégorie</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.title}
                                </option>
                            ))}
                        </select>

                        <input className="form-control input-search" type="search" placeholder="Rechercher des articles" aria-label="Rechercher" onChange={(e) => setSearchArticles({ ...searchArticles, title: e.target.value })} />
                        <button type="submit" className="input-group-text btn-search">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                className="bi bi-search" viewBox="0 0 16 16">
                                <path
                                    d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
                            </svg>
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}