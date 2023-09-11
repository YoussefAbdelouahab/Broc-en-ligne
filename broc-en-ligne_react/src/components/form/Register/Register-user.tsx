import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useState } from "react";


function Register_user({ formData, setFormData }) {
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <div>
            <div className="tab">
                <label>Pseudo*</label>
                <input className="register-input mb-3" placeholder="Écrivez votre pseudo" value={formData.username} onChange={(e) => { setFormData({ ...formData, username: e.target.value }) }} />
                <label>Email*</label>
                <input className="register-input mb-3" placeholder="Écrivez votre email" value={formData.mail} onChange={(e) => {
                    setFormData({ ...formData, mail: e.target.value })
                }} />

                <label htmlFor="password" className="form-label">Mot de passe*</label>
                <div className="input-group mb-3">
                    <input type={showPassword ? 'text' : 'password'} className="form-control register-input" id="password" aria-describedby="icon-eye"
                        placeholder="Écrivez votre mot de passe"
                        value={formData.password}
                        onChange={(e) => { setFormData({ ...formData, password: e.target.value }) }} required />
                    <span className="input-group-text" id="icon-eye" onClick={handleClickShowPassword}>
                        {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}</span>
                </div>

                <div className='acceptance mb-5'>
                    <input className="form-check-input" type="checkbox" id="acceptance" required onChange={
                        (e) => setFormData({ ...formData, acceptance: e.target.checked })
                    } />
                    <label htmlFor="form-check-label acceptance-label">J’ai pris connaissance des mentions légales et politique de confidentialité</label>
                </div>
            </div>
        </div>
    )
}

export default Register_user;