import "./Footer.scss"
import insta from "../../assets/insta.svg";
import fb from "../../assets/fb.svg";

export default function Footer() {
    return (
        <footer>
            <div className="footer-list">
                <ul>
                    <a href="/a-propos"><li>À propos</li></a>
                    <a href="/contact"><li>Contact </li></a>
                    <a href="/faq"><li>Questions fréquentes</li></a>
                    <a href="/#"><li>Cookies</li></a>
                </ul>
            </div>
            <div className="footer-socials">
                <a href="https://www.facebook.com/profile.php?id=100081643191647" target="_blank" rel="noreferrer">
                    <img src={fb} alt="fb" />
                </a>
                <a href="https://www.instagram.com/broc.enligne/?igshid=NTc4MTIwNjQ2YQ%3D%3D" target="_blank" rel="noreferrer">
                    <img src={insta} alt="insta" />
                </a>
            </div>
            <div className="footer-rgpd">
                <ul>
                    <a href="/rgpd"><li>Mentions légales et politique de confidentialité</li></a>
                    <a href="https://studio-cocy.fr" target="_blank" rel="noreferrer">
                        <li className="footer-cocy">Développé par l’agence COCY</li>
                    </a>
                </ul>
            </div>
        </footer>
    );
}       