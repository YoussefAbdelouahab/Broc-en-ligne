import Footer from "../../components/footer/Footer";
import Navbar from "../../components/header/navbar-principal/Navbar";
import "./About.scss"


export default function About() {
    return (
        <div className="about">
            <Navbar />
            <div className="about1">
                <div className="about-card card1">
                    <h2>Notre mission</h2>
                    <p>Broc en ligne réunit les férus et amateurs de brocantes et vide-greniers sur le web
                        pour leur permettre de vivre la meilleure expérience possible en physique.</p>
                </div>
            </div>
            <div className="about2">
                <div className="about-card card2">
                    <h2>Nos valeurs</h2>
                    <p>Vous aimez :<br></br>
                        Passer les dimanches à vous promener dans les

                        allées des exposants de brocantes et vide-greniers ? Chiner et négocier ?

                        Favoriser la seconde-main, au profit de votre
                        porte-monnaie et de la planète ? Faire vivre
                        l’économie circulaire en achetant des objets
                        d'occasion et en faisant un passage chez les
                        commerçants du coin ? Nous aussi !
                        <br></br><br></br>
                        Broc en ligne met à disposition une plateforme
                        où les exposants peuvent proposer leurs biens à
                        l'avance, avec photos et vidéos à l’appui. Les
                        visiteurs, eux, peuvent ainsi réserver les articles
                        qui les intéressent, se rendre sur place le jour "j"
                        pour conclure leur deal.</p>
                </div>
            </div>
            <div className="about3">
                <div className="about-card card3">
                    <h2>Notre histoire</h2>
                    <p>Broc en ligne est né grâce à Eric, passionné de
                        brocantes et vide-greniers. Comme beaucoup de
                        Français, ce goût pour l’occasion lui a été
                        transmis par ses parents qui, tous les dimanches,
                        l’emmenaient sillonner les brocantes aux quatre
                        coins de la France.
                        <br></br><br></br>
                        Bien que souvent ravi de ses expériences, un
                        problème récurrent venait parfois gâcher la fête :
                        il lui arrivait de repartir les mains vides, ou qu’il
                        procède à l’achat d’un appareil défectueux par
                        manque de visibilité ou de moyen de vérification.
                        <br></br><br></br>
                        Avec Broc en ligne, Eric a trouvé la solution. Il
                        assure aux exposants et visiteurs le bon déroulé
                        des transactions pour qu’ils puissent profiter
                        pleinement de leurs dimanches en brocante.</p>
                </div>
            </div>
            <Footer />
        </div>
    );
}