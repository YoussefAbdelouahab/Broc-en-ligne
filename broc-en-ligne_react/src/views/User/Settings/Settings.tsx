import "./Settings.scss"
import Navbar from "../../../components/header/navbar-principal/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import jwt from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import Footer from "../../../components/footer/Footer";

const baseUrl: string = `${process.env.REACT_APP_API_URL}`;

function Alert(props) {
    const { showAlert, showAlertError, text, error } = props;

    if (error) {
        return (
            <div className={`alert alert-danger ${showAlertError ? "d-block" : "d-none"}`} role="alert">
                {text}
            </div>
        )
    }
    return (
        <div className={`alert alert-success ${showAlert ? "d-block" : "d-none"}`} role="alert">
            {text}
        </div>
    )
}

export default function Settings() {
    let user_id: string;
    const isAuth: boolean = !!localStorage.getItem("token");
    if (isAuth) {
        const token = localStorage.getItem("token");
        const decodeToken = jwt(token);
        user_id = decodeToken["id"];
    }

    const navigate = useNavigate();
    const [checkboxCheckDeleteUser, setCheckboxCheckDeleteUser] = useState(false);

    const [showAlert, setShowAlert] = useState(false);
    const handleShowAlert = () => {
        setShowAlert(true);
        setTimeout(() => {
            setShowAlert(false);
        }, 3000);
    };
    const [showAlertError, setShowAlertError] = useState(false);
    const handleShowAlertError = () => {
        setShowAlertError(true);
        setTimeout(() => {
            setShowAlertError(false);
        }, 3000);
    };

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const handleClickShowOldPassword = () => setShowOldPassword((show) => !show);
    const handleClickShowNewPassword = () => setShowNewPassword((show) => !show);

    const [user, setUser] = useState({
        firstname: "",
        lastname: "",
        username: "",
        genre: "",
        phone: "",
        mail: "",
        address: "",
        city: "",
        zip_code: "",
        show_contact: null,
        is_email_notification: null,
    })

    const [userPassword, setUserPassword] = useState({
        oldPassword: "",
        newPassword: ""
    })

    const [isCheckedShowContact, setIsCheckedShowContact] = useState(true);
    const [isCheckedEmailNotification, setIsCheckedEmailNotification] = useState(true);

    const formPasswordComplet = userPassword.oldPassword && userPassword.newPassword;

    useEffect(() => {
        axios.get(`${baseUrl}/user/${user_id}`)
            .then(res => {
                setUser(res.data)
            });

        // show contact
        if (user.show_contact === true) {
            setIsCheckedShowContact(isCheckedShowContact);
        }
        else {
            setIsCheckedShowContact(!isCheckedShowContact);
        }

        // notif preference
        if (user.is_email_notification === true) {
            setIsCheckedEmailNotification(isCheckedEmailNotification);
        }
        else {
            setIsCheckedEmailNotification(!isCheckedEmailNotification);
        }

    }, [user_id]);

    function handleUpdateUser(e) {
        e.preventDefault();

        axios.patch(`${baseUrl}/user/${user_id}`, user)
            .then((response) => {
                if (response.status === 200) {
                    localStorage.setItem("token", response.data.token);
                    handleShowAlert()
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function handleShowContact(e) {
        e.preventDefault();

        axios.patch(`${process.env.REACT_APP_API_URL}/user/${user_id}`, { show_contact: user.show_contact })
            .then((response) => {
                if (response.status === 200) {
                    handleShowAlert()
                }
            }).catch((error) => {
                console.log(error);
            });
    }

    function handleUpdatePassword(e) {
        e.preventDefault();

        axios.patch(`${baseUrl}/user/updatePassword/${user_id}`, userPassword)
            .then((response) => {
                if (response.status === 200) {
                    handleShowAlert()
                    setUserPassword({ oldPassword: "", newPassword: "" })
                }
            })
            .catch((error) => {
                console.log(error)
                handleShowAlertError()
            });
    }

    function handleNotificationPreference(e) {
        e.preventDefault();

        axios.patch(`${process.env.REACT_APP_API_URL}/user/${user_id}`, {
            is_email_notification: user.is_email_notification
        }).then((response) => {
            if (response.status === 200) {
                handleShowAlert()
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    function handleDeleteUser(e) {
        e.preventDefault();
        axios.delete(`${process.env.REACT_APP_API_URL}/user/${user_id}`)
            .then((response) => {
                if (response.status === 200) {
                    handleShowAlert()
                    setTimeout(() => {
                        localStorage.removeItem("token");
                        navigate("/");
                    }, 3000);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <>
            <div className="container-fluid settings-user">
                <Navbar />
                <div className="container py-5">
                    <h1 className="pb-5 px-3 px-lg-0">Mes paramètres</h1>
                    <div className="d-lg-flex px-3 px-lg-0">
                        <div className="nav flex-column nav-pills col-12 col-lg-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                            <button className="nav-link active text-start" id="info-user-tab" data-bs-toggle="pill" data-bs-target="#info-user" type="button" role="tab" aria-controls="info-user"
                                aria-selected="true">Informations du compte</button>
                            <button className="nav-link text-start" id="info-contact-tab" data-bs-toggle="pill" data-bs-target="#info-contact" type="button" role="tab" aria-controls="info-contact"
                                aria-selected="true">Confidentialité</button>
                            <button className="nav-link text-start" id="update-password-tab" data-bs-toggle="pill" data-bs-target="#update-password" type="button" role="tab" aria-controls="update-password"
                                aria-selected="false">Modifier mot de passe</button>
                            <button className="nav-link text-start" id="notification-preference-tab" data-bs-toggle="pill" data-bs-target="#notification-preference" type="button" role="tab" aria-controls="notification-preference"
                                aria-selected="false">Préference de notification</button>
                            <button className="nav-link text-start" id="delete-user-tab" data-bs-toggle="pill" data-bs-target="#delete-user" type="button" role="tab" aria-controls="delete-user"
                                aria-selected="false">Supprimer mon compte</button>
                        </div>

                        <div className="tab-content col-12 col-lg mt-5 mt-lg-0 px-lg-5" id="v-pills-tabContent">
                            {/* info user */}
                            <div className="tab-pane show active px-lg-5" id="info-user" aria-labelledby="info-user-tab">
                                <h3>Informations du compte</h3>
                                <form className="form-update" onSubmit={handleUpdateUser}>
                                    <Alert showAlert={showAlert} text={"Votre profil a été mis à jour avec succès."} />
                                    <div className="row">
                                        <div className="mb-3 col">
                                            <label htmlFor="lastname" className="form-label">Nom</label>
                                            <input type="text" className="form-control" id="lastname" value={user.lastname}
                                                onChange={e => setUser({ ...user, lastname: e.target.value })} />
                                        </div>
                                        <div className="mb-3 col">
                                            <label htmlFor="firstname" className="form-label">Prénom</label>
                                            <input type="text" className="form-control" id="firstname" value={user.firstname}
                                                onChange={e => setUser({ ...user, firstname: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="mb-3 col">
                                        <label htmlFor="username" className="form-label">Pseudo</label>
                                        <input type="text" className="form-control" id="username" value={user.username}
                                            onChange={e => setUser({ ...user, username: e.target.value })} />
                                    </div>

                                    <div className="mb-3 col">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" className="form-control" id="email" value={user.mail}
                                            onChange={e => setUser({ ...user, mail: e.target.value })} />
                                    </div>

                                    <div className="row ps-3 mt-4 mb-4">
                                        <label className="form-label ps-0">Genre</label>
                                        <div className="form-check col">
                                            <input className="form-check-input" type="radio" name="genre" id="masculin" value={"M"} checked={user.genre === "M"}
                                                onChange={e => setUser({ ...user, genre: e.target.value })} />
                                            <label className="form-check-label" htmlFor="masculin">
                                                Homme
                                            </label>
                                        </div>
                                        <div className="form-check col">
                                            <input className="form-check-input" type="radio" name="genre" id="feminin" value={"F"} checked={user.genre === "F"}
                                                onChange={e => setUser({ ...user, genre: e.target.value })} />
                                            <label className="form-check-label" htmlFor="feminin">
                                                Femme
                                            </label>
                                        </div>
                                        <div className="form-check col">
                                            <input className="form-check-input" type="radio" name="genre" id="autre" value={"Autre"} checked={user.genre === "Autre"}
                                                onChange={e => setUser({ ...user, genre: e.target.value })} />
                                            <label className="form-check-label" htmlFor="autre">
                                                Autre
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mb-3 col">
                                        <label htmlFor="phone" className="form-label">Téléphone</label>
                                        <input type="number" className="form-control" id="phone" value={user.phone}
                                            onChange={e => setUser({ ...user, phone: e.target.value })} />
                                    </div>

                                    <div className="mb-3 col">
                                        <label htmlFor="address" className="form-label">Adresse</label>
                                        <input type="text" className="form-control" id="address" value={user.address}
                                            onChange={e => setUser({ ...user, address: e.target.value })} />
                                    </div>

                                    <div className="row">
                                        <div className="mb-3 col">
                                            <label htmlFor="city" className="form-label">Ville</label>
                                            <input type="text" className="form-control" id="city" value={user.city}
                                                onChange={e => setUser({ ...user, city: e.target.value })} />
                                        </div>

                                        <div className="mb-5 col">
                                            <label htmlFor="zip-code" className="form-label">Code postal</label>
                                            <input type="number" className="form-control" id="zip-code" value={user.zip_code}
                                                onChange={e => setUser({ ...user, zip_code: e.target.value })} />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn btn-submit px-4 py-2">Enregistrer</button>
                                </form>
                            </div>

                            {/* confidentialité */}
                            <div className="tab-pane px-lg-5" id="info-contact" aria-labelledby="info-contact-tab">
                                <Alert showAlert={showAlert} text={"Vos changements ont bien été pris en compte."} />
                                <h3 className="mb-0">
                                    Confidentialité
                                </h3>
                                <h4 className="mb-0">
                                    Afficher mon numéro
                                </h4>
                                <p className="mb-4">
                                    En affichant votre numéro, les autres utilisateurs pourrons ainsi le voir sur votre profil ainsi que sur les pages de vos annonces.
                                </p>
                                <form onSubmit={handleShowContact}>
                                    <div className="form-check checkbox mb-5">
                                        <input className="form-check-input" type="checkbox" id="checkboxShowContact"
                                            checked={user.show_contact === true}
                                            onChange={(e) => setUser({ ...user, show_contact: e.target.checked })} />
                                        <label className="form-check-label" htmlFor="checkboxShowContact">
                                            J’accepte d'afficher mon numéro de téléphone.
                                        </label>
                                    </div>
                                    <button type="submit" className="btn btn-notification-preference px-4 py-2">Enregistrer</button>
                                </form>
                            </div>

                            {/* update password */}
                            <div className="tab-pane px-lg-5" id="update-password" aria-labelledby="update-password-tab">
                                <h3>Modifier le mot de passe</h3>
                                <form onSubmit={handleUpdatePassword}>
                                    <Alert showAlert={showAlert} text={"Votre mot de passe à bien été modifié."} />
                                    <Alert showAlertError={showAlertError} text={"Mot de passe actuel incorrect"} error={true} />
                                    <div className="mb-3 col">
                                        <label htmlFor="oldPassword" className="form-label">Mot de passe actuel*</label>
                                        <div className="input-group mb-3">
                                            <input type={showOldPassword ? 'text' : 'password'} className="form-control" id="oldPassword" aria-describedby="icon-eye"
                                                placeholder="Saisissez votre mot de passe actuel"
                                                value={userPassword.oldPassword}
                                                onChange={e => setUserPassword({ ...userPassword, oldPassword: e.target.value })} required />
                                            <span className="input-group-text" id="icon-eye" onClick={handleClickShowOldPassword}>
                                                {showOldPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}</span>
                                        </div>
                                    </div>

                                    <div className="mb-5 col">
                                        <label htmlFor="newpassword" className="form-label">Nouveau mot de passe*</label>
                                        <div className="input-group mb-3">
                                            <input type={showNewPassword ? 'text' : 'password'} className="form-control" id="newPassword" aria-describedby="icon-eye"
                                                placeholder="Saisissez votre nouveau mot de passe"
                                                value={userPassword.newPassword}
                                                onChange={e => setUserPassword({ ...userPassword, newPassword: e.target.value })} required />
                                            <span className="input-group-text" id="icon-eye" onClick={handleClickShowNewPassword}>
                                                {showNewPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}</span>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-notification-preference px-4 py-2" disabled={!formPasswordComplet}>Enregistrer</button>

                                </form>
                            </div>

                            {/* notification preference */}
                            <div className="tab-pane px-lg-5" id="notification-preference" aria-labelledby="notification-preference-tab">
                                <Alert showAlert={showAlert} text={"Vos préference de communication ont bien été pris en compte."} />
                                <h3 className="mb-0">
                                    Préférences de notification
                                </h3>
                                <h4 className="mb-0">
                                    Communication générale
                                </h4>
                                <p className="mb-4">
                                    Recevez les dernières infos sur les produits, les offres et vos avantages Membres.
                                </p>
                                <form onSubmit={handleNotificationPreference}>
                                    <div className="form-check checkbox mb-5">
                                        <input className="form-check-input" type="checkbox" id="checkboxNotificationPreference"
                                            checked={user.is_email_notification === true}
                                            onChange={(e) => setUser({ ...user, is_email_notification: e.target.checked })} />
                                        <label className="form-check-label" htmlFor="checkboxNotificationPreference">
                                            J’accepte de recevoir des e-mails.
                                        </label>
                                    </div>
                                    <button type="submit" className="btn btn-notification-preference px-4 py-2">Enregistrer</button>
                                </form>
                            </div>

                            {/* delete user */}
                            <div className="tab-pane px-lg-5" id="delete-user" aria-labelledby="delete-user-tab">
                                <div className="delete-user">
                                    <Alert showAlert={showAlert} text={"Votre compte à bien été supprimer vous allez être redirigé."} />
                                    <h3 className="mb-0">
                                        Êtes-vous sûr de vouloir supprimer votre compte sur Broc en ligne ?
                                    </h3>
                                    <h4 className="mb-3">
                                        En supprimant votre profil :
                                    </h4>
                                    <ul className="mb-3 list">
                                        <li>Vous n'aurez plus accès à votre profil.</li>
                                        <li>les données vous concernant seront totalement supprimées.</li>
                                    </ul>
                                    <form onSubmit={handleDeleteUser}>
                                        <div className="form-check checkbox mb-5">
                                            <input className="form-check-input" type="checkbox" id="checkboxDeleteUser" required onChange={(e) => setCheckboxCheckDeleteUser(e.target.checked)} />
                                            <label className="form-check-label" htmlFor="checkbox">
                                                J’accepte de vouloir supprimer mon compte.
                                            </label>
                                            <div className="form-text">Cette action est <strong>irréversible</strong> !</div>
                                        </div>
                                        <button type="submit" className="btn btn-delete px-4 py-2" disabled={!checkboxCheckDeleteUser} >Supprimer mon compte</button>
                                    </form>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}
