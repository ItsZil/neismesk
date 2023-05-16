import React, { useState } from 'react';
import './ForgotPasswordPage.css'
import toast, { Toaster } from 'react-hot-toast';


const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        setIsSubmitting(true);

        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email
            }),
        };
        fetch("api/user/forgotPassword", requestOptions)
            .then(response => {
                setIsSubmitting(false);
                if (response.status === 200) {
                    toast.success('Nuoroda į slaptažodžio pakeitimą sėkmingai išsiųsta.');
                }
                else if (response.status === 404) {
                    toast.error("Nerastas vartotojas su pateiktais duomenimis!");
                }
                else if (response.status === 401) {
                    toast.error("Klaida išsiunčiant pakeitimo žinutę. Bandykite dar kartą.");
                }
                else {
                    toast.error("Įvyko klaida, susisiekite su administratoriumi!");
                }
            }
        );
    }

    return (
        <div className='outerBoxWrapper'>
            <Toaster></Toaster>
            <div className='outerBox'>
                <div className='innerBox'>
                    <h2 className='boxLabel'>Įveskite savo el. pašto adresą, kurį naudojate prisijungimui prie šios svetainės</h2>
                    <input type='email' name='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Jūsų el. pašto adresas'></input>
                    <div className='submit'>
                        <button onClick='' className='submitForgotPasswordButton' onClick={() => handleSubmit()} type='submit' disabled={isSubmitting}>Patvirtinti</button> {/* disable the button based on the isSubmitting state */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage