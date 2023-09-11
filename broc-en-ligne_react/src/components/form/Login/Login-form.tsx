import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

const baseUrl: string = `${process.env.REACT_APP_API_URL}`;

function AlertError(props) {
  const { showAlertError, text } = props;
  return (
    <div className={`alert alert-danger ${showAlertError ? "d-block" : "d-none"}`} role="alert">
      {text}
    </div>
  )
}

export default function Login_form() {

  const [user, setUser] = useState({
    mail: "",
    password: ""
  })

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const formComplet = user.mail && user.password;

  const navigate = useNavigate();
  const location = useLocation();
  const [urlPrecedente, setUrlPrecedente] = useState("");

  useEffect(() => {
    if (location.state && location.state.urlPrecedente) {
      setUrlPrecedente(location.state.urlPrecedente);
    }
  }, [location.state]);

  const [showAlertError, setShowAlertError] = useState(false);
  const handleShowAlertError = () => {
    setShowAlertError(true);
  };

  function handleLogin(e) {
    e.preventDefault();

    axios.post(`${baseUrl}/login`, { mail: user.mail.trim(), password: user.password.trim() })
      .then(function (response) {
        if (response.status === 200) {
          if (showAlertError === true) {
            setShowAlertError(false);
          }

          localStorage.setItem("token", response.data.token);

          if (urlPrecedente === "/inscription") {
            navigate("/")
          } else {
            navigate(-1)
          }

        }
      })
      .catch(function (error) {
        handleShowAlertError()
        console.log(error);
      });
  }

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <form className="col-lg-6 form-create-article" style={{
            background: "#FFFBEB",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
          }}
            onSubmit={handleLogin}>
            <div className="w-100">
              <h1 className="text-center pt-3 pb-5">Connexion</h1>
              <AlertError showAlertError={showAlertError} text={"Identifiant ou mot de passe incorrect"} />

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email*</label>
                <input type="text" className="form-control" id="email" placeholder="Saisissez votre email de connexion"
                  value={user.mail}
                  onChange={e => setUser({ ...user, mail: e.target.value })} required />
              </div>

              <div className="mb-3 col">
                <label htmlFor="password" className="form-label">Mot de passe*</label>
                <div className="input-group mb-3">
                  <input type={showPassword ? 'text' : 'password'} className="form-control" id="password" aria-describedby="icon-eye"
                    placeholder="Saisissez votre mot de passe de connexion"
                    value={user.password}
                    onChange={e => setUser({ ...user, password: e.target.value })} required />
                  <span className="input-group-text" id="icon-eye" onClick={handleClickShowPassword}>
                    {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}</span>
                </div>
              </div>

              <div className="mb-3 text-end">
                <Link className="link-mdp-forgot" to={"/oublie-mdp"}>Mot de passe oublié ?</Link>
              </div>

              <button type="submit" className="btn btn-submit px-4 py-2" disabled={!formComplet}>Se connecter</button>

              <div className="mt-3 text-center">
                <Link className="link-register" to={"/inscription"}>Vous n'avez pas de compte ? <span>S’inscrire</span></Link>
              </div>
            </div>
          </form>
          <div className="col-lg-6">
          </div>
        </div>
      </div>
    </>
  );
}