import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Navigate, Route, Routes } from "react-router-dom";

import Home from "./views/Home/Home";
import Politiques from "./views/RPGD/Politiques";
import Profile from "./views/User/Profile/Profile";
import Login from "./views/User/Login/Login";
import Register from "./views/User/Register/Register";
import NotFound from "./views/ErrorPage/NotFound";
import Apropos from "./views/About/About";
import FleamarketResult from "./views/Fleamarket/FleamarketResult/FleamarketResult";
import Article from "./views/Article/GetArticle/Article";
import CreateArtcile from "./views/Article/CreateArticle/CreateArticle";
import FavoriteArticle from "./views/Article/FavoriteArticle/FavoriteArticle";
import ResultArticle from "./views/Article/ArticleResult/ResultArticle";
import UpdateArticle from "./views/Article/UpdateArticle/UpdateArticle";
import Settings from "./views/User/Settings/Settings";
import ForgotPassword from "./views/User/ForgotPassword/ForgotPassword";
import ResetPassword from "./views/User/ForgotPassword/ResetPassword";
import Contact from "./views/Contact/Contact";
import Fleamarket from "./views/Fleamarket/GetFleamarket/Fleamarket";
import UserFleamarket from "./views/Fleamarket/GetAllUserFleamarket/UserFleamarket";
import ReservedArticle from "./views/Article/ReservedArticle/ReserverdArticle";
import DashboardLayout from "./admin/layouts/dashboard/DashboardLayout";
import Faq from "./views/FAQ/Faq";
import { IsAuth, CheckAuth } from "./admin/auth/checkAuth";
//admin
import DashboardPage from "./admin/views/dashboard/DashboardPage";
import UserListPage from "./admin/views/users/UserListPage";
import ProductListPage from "./admin/views/products/ProductListPage";
import ProductNewPage from "./admin/views/products/ProductNewPage";
import CategoryListPage from "./admin/views/categories/CategoryListPage";
import CategoryNewPage from "./admin/views/categories/CategoryNewPage";
import UserNewPage from "./admin/views/users/UserNewPage";
import ReservationListPage from "./admin/views/reservations/ReservationListPage";
import BrocanteListPage from "./admin/views/brocantes/BrocanteListPage";
import FaqListPage from "./admin/views/faq/FaqListPage";
import FaqNewPage from "./admin/views/faq/FaqNewPage";



export default function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/rgpd" element={<Politiques />} />
                <Route path="/profil/:pseudo" element={<Profile />} />
                <Route path="/parametres" element={<IsAuth children={<Settings />} />} />
                <Route path="/connexion" element={<Login />} />
                <Route path="/inscription" element={<Register />} />
                <Route path="/article/:id" element={<Article />} />
                <Route path="/brocante/:id" element={<Fleamarket />} />
                <Route path="/brocante" element={<UserFleamarket />} />
                <Route path="/article/favoris" element={<IsAuth children={<FavoriteArticle />} />} />
                <Route path="/article/reserve" element={<IsAuth children={<ReservedArticle />} />} />
                <Route path="/article" element={<CreateArtcile />} />
                <Route path="/article/modifier/:id" element={<UpdateArticle />} />
                <Route path="/recherche-article" element={<ResultArticle />} />
                <Route path="/recherche-brocante" element={<FleamarketResult />} />
                {/* forgot/ reset password */}
                <Route path="/oublie-mdp" element={<ForgotPassword />} />
                <Route path="/reinitialiser-mdp" element={<ResetPassword />} />
                {/* footer */}
                <Route path="/a-propos" element={<Apropos />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/contact" element={<Contact />} />
                {/* page error */}
                <Route path="404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" />} />

                {/* admin routes */}
                <Route path="intranet" element={<CheckAuth children={<DashboardLayout />} />} >
                    <Route path="dashboard" element={<DashboardPage />} />
                    {/* user */}
                    <Route path="utilisateur">
                        <Route path="liste" element={<UserListPage />} />
                        <Route path="ajouter" element={<UserNewPage />} />
                    </Route>
                    {/* category */}
                    <Route path="categorie">
                        <Route path="liste" element={<CategoryListPage />} />
                        <Route path="ajouter" element={<CategoryNewPage />} />
                    </Route>
                    {/* product */}
                    <Route path="article">
                        <Route path="liste" element={<ProductListPage />} />
                        <Route path="ajouter" element={<ProductNewPage />} />
                    </Route>
                    {/* reservation */}
                    <Route path="reservation">
                        <Route path="liste" element={<ReservationListPage />} />
                    </Route>
                    {/* fleamarket */}
                    <Route path="brocante">
                        <Route path="liste" element={<BrocanteListPage />} />
                    </Route>
                    {/* fleamarket */}
                    <Route path="faq">
                        <Route path="liste" element={<FaqListPage />} />
                        <Route path="ajouter" element={<FaqNewPage />} />
                    </Route>
                </Route>
            </Routes>
        </>
    );

}
