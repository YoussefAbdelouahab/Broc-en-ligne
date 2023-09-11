import React from 'react';

function Register_location({ formData, setFormData }) {
    return (
        <div>
            <div className="tab">
                <label>Adresse postale*</label>
                <input className="register-input mb-3" placeholder="Écrivez votre adresse postale" value={formData.address} onChange={(e) => { setFormData({ ...formData, address: e.target.value }) }} />
                <label>Ville*</label>
                <input className="register-input mb-3" placeholder="Écrivez votre région / ville" value={formData.city} onChange={(e) => { setFormData({ ...formData, city: e.target.value }) }} />
                <label>Code postal*</label>
                <input className="register-input mb-3" placeholder="Écrivez votre code postal" value={formData.zip_code} onChange={(e) => { setFormData({ ...formData, zip_code: e.target.value }) }} />
            </div>
        </div>
    )
}

export default Register_location;