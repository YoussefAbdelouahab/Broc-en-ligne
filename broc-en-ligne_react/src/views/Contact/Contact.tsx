import Navbar from "../../components/header/navbar-principal/Navbar"
import { useState } from "react";
import axios from "axios";
import Footer from "../../components/footer/Footer";

function Alert(props) {
    const { showAlert, text } = props;
    return (
        <div className={`alert alert-success ${showAlert ? "d-block" : "d-none"}`} role="alert">
            {text}
        </div>
    )
}

export default function Contact() {
    const [formData, setFormData] = useState({
        usermail: "",
        rubrique: "",
        raison: "",
        role: "",
        object: "",
        message: "",
    });
    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };

    const formComplet = formData.usermail && formData.rubrique && formData.raison && formData.role && formData.object && formData.message;

    function resetInput() {
        formData.usermail = "";
        formData.rubrique = "";
        formData.raison = "";
        formData.role = "";
        formData.object = "";
        formData.message = "";
    }

    function handleSubmitForm(e) {
        e.preventDefault();
        axios
            .post(`${process.env.REACT_APP_API_URL}/contact`, {
                usermail: formData.usermail,
                rubrique: formData.rubrique,
                raison: formData.raison,
                role: formData.role,
                object: formData.object,
                message: formData.message
            })
            .then(function (response) {
                handleShowAlert();
                resetInput();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <>
            <div className="container-fluid" style={{
                minHeight: "100vh",
                background: "#FFF7DA",
                padding: 0,
                margin: 0
            }}>
                <Navbar />
                <div className="container forgot-password" style={{
                    height: "100%",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "center",
                    padding: "0 25px"
                }}>
                    <form>
                        <h1 className="text-center mt-5 mb-5">Contactez-nous</h1>
                        <Alert showAlert={showAlert} text={"Votre demande à bien été pris en compte."} />
                        <div className="mb-3 col-12">
                            <label htmlFor="rubrique" className="form-label">Choisissez votre rubrique ci-dessous.*</label>
                            <select className="form-select" id="rubrique" value={formData.rubrique} onChange={(e) => { setFormData({ ...formData, rubrique: e.target.value }) }}>
                                <option value="" disabled>Veuillez séléctionner une rubrique</option>
                                <option value="deposer&gestionAnnonces">Déposer et gérer mes annonces</option>
                                <option value="recherche&annonces">Recherche et consultation d'annonces</option>
                                <option value="gestion&compte">Gestion de compte</option>
                                <option value="service&reservation">Service de réservation en ligne</option>
                                <option value="confiance&securite">Confiance et sécurité</option>
                                <option value="suggestions">Suggestions</option>
                                <option value="activite&suspecte">Activité suspecte</option>
                                <option value="autres">Autres</option>
                            </select>
                        </div>

                        <div className="mb-3 col-12">
                            <label htmlFor="email" className="form-label">Email*</label>
                            <input type="email" className="form-control" id="email" placeholder="Saisissez votre email" value={formData.usermail} onChange={(e) => { setFormData({ ...formData, usermail: e.target.value }) }} />
                        </div>

                        <div className="mb-3 col-12">
                            <label htmlFor="raison" className="form-label">Comment pouvons-nous vous aider ?*</label>
                            <select className="form-select" id="raison" value={formData.raison} onChange={(e) => { setFormData({ ...formData, raison: e.target.value }) }}>
                                <option value="" disabled>Veuillez séléctionner une raison</option>
                                <option value="question">J'ai une question</option>
                                <option value="probleme&technique">J’ai un problème technique</option>
                                <option value="autres">Autres</option>
                            </select>
                        </div>

                        <div className="mb-3 col-12">
                            <label htmlFor="role" className="form-label">Je suis *</label>
                            <select className="form-select" id="role" value={formData.role} onChange={(e) => { setFormData({ ...formData, role: e.target.value }) }}>
                                <option value="" disabled>Veuillez séléctionner votre rôle</option>
                                <option value="acheteur">Acheteur</option>
                                <option value="exposant">Exposant</option>
                                <option value="visiteur">Visiteur</option>
                            </select>
                        </div>

                        <div className="mb-3 col-12">
                            <label htmlFor="objet" className="form-label">Objet*</label>
                            <input type="text" className="form-control" id="objet" placeholder="Saisissez votre objet" value={formData.object} onChange={(e) => { setFormData({ ...formData, object: e.target.value }) }} />
                        </div>

                        <div className="mb-3 col-12">
                            <label htmlFor="description" className="form-label">Description*</label>
                            <textarea className="form-control" aria-label="With textarea" id="description" placeholder="Saisissez votre message"
                                style={{ height: 175, resize: "none" }}
                                value={formData.message} onChange={(e) => { setFormData({ ...formData, message: e.target.value }) }}
                            ></textarea>
                        </div>

                        <button type="submit" onClick={(e) => handleSubmitForm(e)} disabled={!formComplet} className="btn btn-submit px-4 py-2">Envoyer</button>

                        <div className={`alert alert-info mt-3`} role="alert">
                            Veuillez saisir les détails de votre demande. Un membre de notre équipe d’assistance répondra dans les plus brefs délais.
                        </div>
                    </form>
                </div>
                <Footer />
            </div >
        </>
    )
}
