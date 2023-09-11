import Footer from "../../components/footer/Footer";
import Navbar from "../../components/header/navbar-principal/Navbar";
import bgErrorPage from "../../assets/illustration/bg-errorPage.png";
import jwt from "jwt-decode";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div
            className="container-fluid"
            style={{
                height: "125vh",
                padding: 0,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
            }}
        >
            <header>
                <Navbar />
            </header>
            <main
                style={{
                    height: "100%",
                    backgroundImage: `url(${bgErrorPage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "25px"
                }}
            >
                <h1 className="text-center">Impossible de trouver la page demandée.</h1>
                <p className="text-center">Veuillez nous excuser pour la gêne occasionnée.</p>
                <Link to={"/"} type="button" className="text-center" style={{
                    marginTop: "25px",
                    padding: "10px 25px",
                    borderRadius: "5px",
                    background: "#285DA2",
                    color: "white",
                    textDecoration: "none"
                }}>
                    Retourner à l'accueil
                </Link>
            </main>
            <Footer />
        </div>
    );
}
