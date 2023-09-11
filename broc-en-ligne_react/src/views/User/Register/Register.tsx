import Register_form from "../../../components/form/Register/Register-form";
import "./Register.scss"
import NavbarAuth from "../../../components/header/navbar-page-auth/NavbarAuth";
import Footer from "../../../components/footer/Footer";

export default function Register() {
    return (
        <div className="register">
            <NavbarAuth />
            <div className="register-form">
                <Register_form />
            </div>
        </div>
    );
}
