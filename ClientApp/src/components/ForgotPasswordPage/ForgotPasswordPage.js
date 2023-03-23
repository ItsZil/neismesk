import React, {  } from 'react';
import './ForgotPasswordPage.css'

const ForgotPasswordPage = () => {

    return (
        <div className='outerBoxWrapper'>
            <div className='outerBox'>
                <div className='innerBox'>
                    <h2 className='boxLabel'>Įveskite savo el. pašto adresą, kurį naudojate prisijungimui prie šios svetainės</h2>
                    <input type="email" name='email' id='email' placeholder='Jūsų el. pašto adresas'></input>
                    <div className='submit'>
                        <button onClick='' className='submitForgotPasswordButton' type='submit'>Patvirtinti</button>
                    </div>
                </div>
            </div>
        </div>
    );
    }
    export default ForgotPasswordPage