import React from 'react';
import '../../../views/User/Register/Register.scss';

function Register_identity({ formData, setFormData }) {
    return (
        <div>
            <div className="tab">
                <label>Prénom*</label>
                <input className="register-input mb-3" type="text" placeholder="Écrivez votre prénom" value={formData.firstname} onChange={(e) => { setFormData({ ...formData, firstname: e.target.value }) }} />
                <label>Nom*</label>
                <input className="register-input mb-3" placeholder="Écrivez votre nom" value={formData.lastname} onChange={(e) => { setFormData({ ...formData, lastname: e.target.value }) }} />
                <label>Téléphone</label>
                <input className="register-input mb-3" type="number" placeholder="Écrivez votre numéro de téléphone" value={formData.phone} onChange={(e) => { setFormData({ ...formData, phone: e.target.value }) }} />
                <div className="register-radio">
                    <p>Genre</p>
                    <div className='register-radio-box form-check'>
                        <input className="form-check-input mb-3" id="rad1" type="radio" name="rad" value="F" checked={formData.genre === "F"} onChange={(e) => { setFormData({ ...formData, genre: e.target.value }) }} /><label htmlFor="rad1">Femme</label>
                        <input className="form-check-input mb-3" id="rad2" type="radio" name="rad" value="M" checked={formData.genre === "M"} onChange={(e) => { setFormData({ ...formData, genre: e.target.value }) }} /><label htmlFor="rad2">Homme</label>
                        <input className="form-check-input mb-3" id="rad3" type="radio" name="rad" value="Autre" checked={formData.genre === "Autre"} onChange={(e) => { setFormData({ ...formData, genre: e.target.value }) }} /><label htmlFor="rad3">Autre</label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register_identity;