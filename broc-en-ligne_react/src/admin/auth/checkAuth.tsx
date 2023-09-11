import { Navigate } from 'react-router-dom';
import jwt from "jwt-decode";

export function IsAuth({ children }) {
    const isAuth: Boolean = !!localStorage.getItem("token");
    if (isAuth) {
        return children;
    } else {
        return <Navigate to="/login" />;
    }
}

export function CheckAuth({ children }) {

    const isAuth: Boolean = !!localStorage.getItem("token");
    if (isAuth) {
        const token = localStorage.getItem("token");
        const decodeToken = jwt(token);
        const user_role = decodeToken["role"];
        if (user_role === 'ADMIN') {
            return children;
        } else {
            return <Navigate to="*" />;
        }
    } else {
        return <Navigate to="/login" />;
    }
}
