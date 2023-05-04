import React, { useState } from 'react';
import './ForgotPasswordPage.css'
import toast, { Toaster } from 'react-hot-toast';


const ForgotPasswordPage = () => {

    const [email, setEmail] = useState('');

    const handleSubmit = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email
            }),
        };
        fetch("api/user/forgot-password", requestOptions)
            .then(response => {
                if (response.status === 200) {
                    toast('Nuoroda į slaptažodžio pakeitimą sėkmingai išsiųsta');
                }
                else if (response.status === 400) {
                    toast("Nerastas vartotojas su pateiktais duomenimis!", {
                        style: {
                            backgroundColor: 'red',
                            color: 'white',
                        },
                    });
                }
                else if (response.status === 401) {
                    toast("Klaida išsiunčiant pakeitimo žinutę. Bandykite dar kartą.", {
                        style: {
                            backgroundColor: 'red',
                            color: 'white',
                        },
                    });
                }
                else {
                    toast("Įvyko klaida, susisiekite su administratoriumi!", {
                        style: {
                            backgroundColor: 'red',
                            color: 'white',
                        },
                    });
                }

            })

    }
    return (
        <div className='outerBoxWrapper'>
            <div className='outerBox'>
                <div className='innerBox'>
                    <h2 className='boxLabel'>Įveskite savo el. pašto adresą, kurį naudojate prisijungimui prie šios svetainės</h2>
                    <input type='email' name='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Jūsų el. pašto adresas'></input>
                    <div className='submit'>
                        <button onClick='' className='submitForgotPasswordButton' onClick={() => handleSubmit()} type='submit'>Patvirtinti</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ForgotPasswordPage