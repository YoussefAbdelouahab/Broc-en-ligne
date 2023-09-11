import Navbar from "../../../components/header/navbar-principal/Navbar";
import CreateArtcleForm from "../../../components/form/Article/CreateArticleForm"

import "./CreateArticle.scss"


export default function CreateArticle() {
    return (
        <div className="CreateArticle">
            <Navbar />
            <CreateArtcleForm />
        </div>
    );
}
