import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";
import { useNavigate } from "react-router-dom";


const baseUrl: string = `${process.env.REACT_APP_API_URL}`;

function AlertError(props) {
    const { showAlertError, text } = props;
    return (
      <div className={`alert alert-danger ${showAlertError ? "d-block" : "d-none"}`} role="alert">
        {text}
      </div>
    )
  }

export default function AdminLogin() {
    const [user, setUser] = useState({
        mail: "",
        password: ""
    })

    //Afficher le mot de passe
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const navigate = useNavigate();

    const [showAlertError, setShowAlertError] = useState(false);
    const handleShowAlertError = () => {
        setShowAlertError(true);
    };

    function handleLogin(e) {
        e.preventDefault();
    
        axios.post(`${baseUrl}/admin/login`, { mail: user.mail, password: user.password })
          .then(function (response) {
            if (response.status === 200) {
              //Retirer le message d'erreur
              if (showAlertError === true) {
                setShowAlertError(false);
              }    
              //Crée un token
              localStorage.setItem("token", response.data.token);

              //Redirect
              navigate("/intranet/management/dashboard")
            }
          })
          .catch(function (error) {
            handleShowAlertError()
            console.log(error);
          });
      }
    return (
        <>
            <form  onSubmit={handleLogin}>
                <AlertError showAlertError={showAlertError} text={"Identifiant ou mot de passe incorrect"} />
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email :</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={e => setUser({ ...user, mail: e.target.value })}></input>
                </div>
                <div className="mb-3 col">
                    <label htmlFor="password" className="form-label">Mot de passe</label>
                    <div className="input-group mb-3">
                        <input type={showPassword ? 'text' : 'password'} className="form-control" id="password" aria-describedby="icon-eye"
                            value={user.password}
                            onChange={e => setUser({ ...user, password: e.target.value })} required />
                        <span className="input-group-text" id="icon-eye" onClick={handleClickShowPassword}>
                            {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}</span>
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Je me connecte</button>
            </form>
        </>
    );
}
