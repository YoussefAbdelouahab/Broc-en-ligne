import { Link, NavLink } from "react-router-dom";

import "./NavbarAuth.scss"
import logo from "../../../assets/brand.svg";

export default function NavbarAuth() {
    return (
        <>
            <nav className="nav navAuth py-3 justify-content-center">
                <Link className="navbar-brand pe-md-5 pe-3" to="/">
                    <img alt="Broc en ligne" src={logo} />
                </Link>
                <ul className="nav ps-md-5 ps-0">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/">Accueil</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/a-propos">À propos</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/contact">Contact</NavLink>
                    </li>
                </ul>
            </nav>
        </>
    );
}