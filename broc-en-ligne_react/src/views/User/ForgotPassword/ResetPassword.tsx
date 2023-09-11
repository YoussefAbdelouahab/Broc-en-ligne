import { useState } from "react";
import NavbarAuth from "../../../components/header/navbar-page-auth/NavbarAuth";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";

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

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const queryParameters = new URLSearchParams(window.location.search)
    const token: string = queryParameters.get("token")
    const userId: string = queryParameters.get("id")
    const resetToken: string = localStorage.getItem("resetToken");

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlertError(false);
        setShowAlert(true);
    };
    const [showAlertError, setShowAlertError] = useState(false);
    const handleShowAlertError = () => {
        setShowAlert(false);
        setShowAlertError(true);
    };

    function handleResetPassword(e) {
        e.preventDefault();

        axios.patch(`${baseUrl}/resetPassword`, {
            resetToken,
            token,
            id: userId,
            password
        })
            .then((response) => {
                if (response.status === 200) {
                    setPassword("")
                    handleShowAlert()
                    localStorage.removeItem("resetToken")
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
            background: "#FFF7DA"
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
                    onSubmit={handleResetPassword}
                >
                    <Alert showAlert={showAlert} text={"Mot de passe rénitialisé, veuillez vous connecter."} />
                    <Alert showAlertError={showAlertError} text={"Liens invalide ou expiré."} error={true} />

                    <h1>RÉINITIALISER VOTRE MOT DE PASSE</h1>
                    <p className="mb-1">Veuillez saisir votre nouveau mot de passe ci-dessous.</p>
                    <p>Puis rendez-vous sur la page de connexion pour vous connecter apres avoir modifier votre mot de passe.</p>

                    <div className="mb-3 mt-3 col-12" style={{
                        textAlign: "start"
                    }}>
                        <label htmlFor="password" className="form-label">Nouveau mot de passe*</label>
                        <div className="input-group mb-3">
                            <input type={showPassword ? 'text' : 'password'} className="form-control" id="password" aria-describedby="icon-eye"
                                placeholder="Saisissez votre nouveau mot de passe"
                                value={password}
                                onChange={e => setPassword(e.target.value)} required />
                            <span className="input-group-text" id="icon-eye" onClick={handleClickShowPassword}>
                                {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}</span>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-submit px-4 py-2" disabled={!password}>Reinitialiser le mot de passe</button>
                </form>
            </div>
        </div>
    )
}
