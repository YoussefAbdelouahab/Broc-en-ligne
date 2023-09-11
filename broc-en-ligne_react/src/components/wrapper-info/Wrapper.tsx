import "./Wrapper.scss";

import illustration_homme from "../../assets/illustration/illustration-homme.png";
import illustration_femme from "../../assets/illustration/illustration-femme.png";


export default function Wrapper() {
    return (
        <>
            <div className="container mt-5">
                <div className="d-lg-flex d-grid">
                    <div className="col d-flex info-card card-left">
                        <div className="col-4 col-img">
                            <img src={illustration_homme} alt="" />
                        </div>
                        <div className="col content">
                            <h3>Exposant</h3>
                            <p>Cette plateforme vous permet de proposer gratuitement vos articles à un plus large public et de toucher plus de monde ! Rendez votre journée plus enrichissante.</p>
                        </div>
                    </div>
                    <div className="col d-flex info-card card-right">
                        <div className="col content">
                            <h3>Visiteur</h3>
                            <p>Découvrez à l’avance les articles des exposants partout en France. Réservez ceux qui vous intéressent et finissez votre deal en brocante.</p>
                        </div>
                        <div className="col-4 col-img">
                            <img src={illustration_femme} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}