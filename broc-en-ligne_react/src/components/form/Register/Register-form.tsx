/* eslint-disable react/jsx-pascal-case */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Register_identity from "./Register-identity";
import Register_location from "./Register-location";
import Register_user from "./Register-user";

function Register_form() {
  //Variable which contain the steps
  const [step, setStep] = useState(0);
  const [isFinish, setFinish] = useState(0);
  let [ValidEMail, setValidEMail] = useState(false);
  let [ValidRequest, setValidRequest] = useState(false);
  let [ValidPhone, setValidPhone] = useState(false);
  let [ValidZip, setValidZip] = useState(false);
  // let [checkbox, setCheckbox] = useState(false);
  //Variable which contain form data
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    genre: "",
    phone: "",
    mail: "",
    password: "",
    address: "",
    city: "",
    zip_code: "",
    acceptance: false
  });

  //Function to display form deppending on step variable
  const StepDisplay = () => {
    if (step === 0) {
      return (
        <Register_identity formData={formData} setFormData={setFormData} />
      );
    } else if (step === 1) {
      return (
        <Register_location formData={formData} setFormData={setFormData} />
      );
    } else {
      return <Register_user formData={formData} setFormData={setFormData} />;
    }
  };

  //Function which check the format of the mail input
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const validatePhone = (phone) => {
    return String(phone).match(
      /^(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})$/
    );
  };
  const validateZip = (zip) => {
    return String(zip).match(/^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/);
  };

  const urlActuelle = "/inscription";

  //Variable to use navigate function
  const navigate = useNavigate();

  function Register() {

    if (!validatePhone(formData.phone)) {

      setValidZip(false);
      setValidPhone(true);
      setValidEMail(false);
      setValidRequest(false); // Hide request error message
      return 0;
    }
    if (!validateZip(formData.zip_code)) {

      setValidZip(true);
      setValidPhone(false);
      setValidEMail(false);
      setValidRequest(false); // Hide request error message
      return 0;
    }
    if (!validateEmail(formData.mail)) {

      setValidZip(false);
      setValidPhone(false);
      setValidEMail(true);
      setValidRequest(false); // Hide request error message
      return 0;
    }

    //If last button clicked
    if (step === 2) {
      //check if password and confirm password are same
      if (formData.password) {
        //Post request
        axios
          .post(`${process.env.REACT_APP_API_URL}/register`, {
            firstname: formData.firstname.trim(),
            lastname: formData.lastname.trim(),
            username: formData.username.trim(),
            genre: formData.genre.trim(),
            phone: formData.phone.trim(),
            mail: formData.mail.trim(),
            password: formData.password.trim(),
            address: formData.address.trim(),
            city: formData.city.trim(),
            zip_code: formData.zip_code.trim(),
          })
          .then(function (response) {
            console.log(response);
            navigate("/connexion", { state: { urlPrecedente: urlActuelle } });
          })
          .catch(function (error) {
            console.log(error);
            setValidEMail(false);
            setValidZip(false);
            setValidPhone(false);
            setValidRequest(true); //Show request error message
          });
      }
    }
  }

  const formComplet = formData.firstname && formData.lastname && formData.username && formData.genre && formData.phone && formData.mail && formData.password && formData.address && formData.city && formData.zip_code && formData.acceptance === true;

  return (
    <div className="register-form">
      {/* Register form */}
      <form id="regForm" action="">
        <h1 className="form-title">Inscription</h1>
        <div className="steps">
          {/* Change class dependding on step variable */}
          <span
            className={`step-circle ${step === 0 ? "active" : ""} ${isFinish === 0 || 1 ? "finish" : ""
              }`}
          >
            1
          </span>
          <span
            className={`step-circle ${step === 1 ? "active" : ""} ${isFinish === 1 ? "finish" : ""
              } ${isFinish === 2 ? "finish" : ""}`}
          >
            2
          </span>
          <span className={`step-circle ${step === 2 ? "finish" : ""} `}>
            3
          </span>
        </div>
        {StepDisplay()}
        {/* Change class dependding on step variable */}
        <div
          className={`register-navigation ${step === 0 ? "register-navigation" : "register-navigation2"
            } `}
        >
          <button
            style={{
              display: step === 0 ? "none" : "block", //display button only if first step
            }}
            className="register-back"
            type="button"
            disabled={step === 0}
            onClick={() => {
              setStep((currStep) => currStep - 1); // minus 1 to step variable
              setFinish((currFinish) => currFinish - 1); // minus 1 to finish variable
            }}
          >
            Retour
          </button>
          <button
            style={{
              display: step === 2 ? "none" : "block", //hide button only on last step
            }}
            className="register-next"
            type="button"
            onClick={() => {
              setStep((currStep) => currStep + 1); // plus 1 to step variable
              setFinish((currFinish) => currFinish + 1); // plus 1 to finish variable
            }}
          >
            Suivant
          </button>
          <button
            disabled={!formComplet}
            style={{
              display: step != 2 ? "none" : "block", //display button only on last step
            }}
            className="register-next"
            type="button"
            onClick={() => {
              Register();
            }}
          >
            Terminé
          </button>
        </div>
        <div className="mt-3 text-center">
          <Link className="link-register" to={"/connexion"}>Vous avez déjà un compte ? <span>Se connecter</span></Link>
        </div>
        <p
          className="validation"
          style={{
            display: !ValidPhone ? "none" : "block",
          }}
        >
          Le format du <strong>téléphone</strong> est inccorecte
        </p>
        <p
          className="validation"
          style={{
            display: !ValidZip ? "none" : "block",
          }}
        >
          Le format du <strong>code postal</strong> est inccorecte
        </p>
        <p
          className="validation"
          style={{
            display: !ValidEMail ? "none" : "block",
          }}
        >
          Le format du <strong>mail</strong> est inccorecte
        </p>
        <p
          className="validation"
          style={{
            display: !ValidRequest ? "none" : "block",
          }}
        >
          Email déjà existant
        </p>

      </form >
    </div >
  );
}

export default Register_form;
