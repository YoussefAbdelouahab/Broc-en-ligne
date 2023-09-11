import "./Login.scss"
import Login_form from "../../../components/form/Login/Login-form"
import NavbarAuth from "../../../components/header/navbar-page-auth/NavbarAuth";

export default function Login() {
    return (
        <div className="login">
            <NavbarAuth />
            <Login_form />
        </div>
    );
}
