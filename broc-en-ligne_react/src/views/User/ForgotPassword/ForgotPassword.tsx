import { useState } from "react";
import NavbarAuth from "../../../components/header/navbar-page-auth/NavbarAuth";
import "./Password.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const baseUrl: string = `${process.env.REACT_APP_API_URL}`;

function Alert(props) {
    const { showAlert, showAlertError, text, error } = props;
    if (error) {
        return (
            <div className={`alert alert-danger w-100 ${showAlertError ? "d-block" : "d-none"}`} role="alert">
                {text}
            </div>
        )
    }
    return (
        <div className={`alert alert-success w-100 ${showAlert ? "d-block" : "d-none"}`} role="alert">
            {text}
        </div>
    )
}

export default function ForgotPassword() {

    const [mail, setMail] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
    };
    const [showAlertError, setShowAlertError] = useState(false);
    const handleShowAlertError = () => {
        setShowAlertError(true);
        setTimeout(() => {
            setShowAlertError(false);
        }, 4000);
    };

    const navigate = useNavigate();
    function handleRequestForgotPassword(e) {
        e.preventDefault();

        axios.post(`${baseUrl}/requestForgotPassword`, {
            mail: mail
        })
            .then((response) => {
                if (response.status === 200) {
                    handleShowAlert()
                    setMail("");
                    localStorage.setItem("resetToken", response.data.resetToken);
                }
            })
            .catch((error) => {
                console.log(error)
                handleShowAlertError()
            });
    }
    return (
        <div className="container-fluid" style={{
            height: "100vh",
            background: "#FFF7DA",
            margin: 0
        }}>
            <NavbarAuth />
            <div className="container forgot-password" style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <form style={{
                    display: "flex",
                    textAlign: "center",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center"
                }}
                    onSubmit={handleRequestForgotPassword}
                >
                    <Alert showAlert={showAlert} text={"Vérifier votre boite mail, un message vas vous être envoyé."} />
                    <Alert showAlertError={showAlertError} text={"Votre email n'a pas été trouvé."} error={true} />

                    <h1>MOT DE PASSE OUBLIÉ</h1>
                    <p>Veuillez saisir votre adresse e-mail ci-dessous. Nous vous enverrons un email pour réinitialiser votre mot de passe.
                    </p>

                    <div className="mb-3 col-12" style={{
                        textAlign: "start"
                    }}>
                        <label htmlFor="mail" className="form-label">Email</label>
                        <input type="email" className="form-control" id="mail" placeholder="Saisissez votre adresse email" value={mail} onChange={e => setMail(e.target.value)} />
                    </div>
                    <button type="submit" className="btn btn-submit px-4 py-2" disabled={!mail}>Envoyer</button>
                </form>
            </div>
        </div>
    )
}
