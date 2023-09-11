import UpdateArticleForm from "../../../components/form/Article/UpdateArticleForm";
import Navbar from "../../../components/header/navbar-principal/Navbar";

import "./UpdateArticle.scss";


export default function UpdateArticle() {
    return (
        <div className="UpdateArticle">
            <Navbar />
            <UpdateArticleForm />
        </div>
    );
}
