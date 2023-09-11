import "./Hero.scss"
import hero from "../../assets/img-hero.jpg"
import Button from "../../utils/button/Button";

import SearchMenu from "../../components/search/searchMenu";
import icon_category from "../../assets/icon/icon-category.svg";
import icon_location from "../../assets/icon/icon-location.svg";
import icon_add_article from "../../assets/icon/icon-add-article.svg";


export default function Hero() {
    return (
        <>
            <section className="container-fluid hero">
                <div className="container py-lg-5 py-0">
                    <div className="banner-hero"
                        style={{ backgroundImage: `url(${hero})`, backgroundRepeat: "no-repeat", backgroundPosition: "center", backgroundSize: "cover" }}>
                        <h1>Broc en ligne</h1>
                        <p>Vivez les brocantes autrement</p>
                    </div>

                    <div className="search-section">
                        <ul className="nav nav-pills" id="pills-tab" role="tablist">
                            <li className="nav-item onglet-yellow" role="presentation">
                                <button className="nav-link active" id="pills-article-tab" data-bs-toggle="pill" data-bs-target="#pills-article" type="button" role="tab" aria-controls="pills-article" aria-selected="true">Je cherche un article</button>
                            </li>
                            <li className="nav-item" role="presentation">
                                <button className="nav-link" id="pills-brocante-tab" data-bs-toggle="pill" data-bs-target="#pills-brocante" type="button" role="tab" aria-controls="pills-brocante" aria-selected="false">Je cherche une brocante</button>
                            </li>
                        </ul>

                        <SearchMenu isActive={true} />
                    </div>

                </div>
                <div className="container d-flex mt-5">
                    <Button style="btn-blue btn-add" text={"Déposer un article"} link={"/article"} icon={icon_add_article} />
                </div>
            </section>
        </>
    );
}