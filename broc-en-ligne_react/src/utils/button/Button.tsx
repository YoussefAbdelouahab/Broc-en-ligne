import { Link } from "react-router-dom";
import "./Button.scss"
import jwt from "jwt-decode"

export default function Button({ style, text, link, icon = null }) {
    const isAuth: boolean = !!localStorage.getItem("token");

    let user_id: number;

    if (isAuth) {
        const token = localStorage.getItem("token");
        const decodeToken = jwt(token);
        user_id = decodeToken["id"];
    }
    return (
        <>
            {user_id || link === "/inscription" ?
                <Link to={link} className={`btn px-3 py-2 ${style}`} type="button">{text}
                    {icon && <img className="ps-3 pb-1" alt="icon" src={icon} />}
                </Link>
                :
                <Link to={"/connexion"} className={`btn px-3 py-2 ${style}`} type="button">{text}
                    {icon && <img className="ps-3 pb-1" alt="icon" src={icon} />}
                </Link>
            }
        </>
    );
}