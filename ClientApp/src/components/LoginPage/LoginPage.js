import React, { useState } from 'react';
import './LoginPage.css'

export const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                password: password,
                email: email
            }),
        };
        fetch("LoginEndpointasCia", requestOptions)
            .then((response) => response.text())
            .then((data) => {
               
            })
    }



    return (
        <div className='outerBox'>
            <div className='innerBox'>
                <h2 className='boxLabel'>Prisijungimas</h2>
                <div className='inputWrapper'>
                    <input type='email' name='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='El. paštas'></input>
                </div>
                <div className='inputWrapper'>
                    <input type="password" name='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Slaptažodis'></input>
                </div>
                <div className='login'>
                    <button className='loginButton' onClick={() => handleSubmit()} type='submit'>Prisijungti</button>
                </div>
                <div className='forgotPassword'>
                    <a href="" className='forgotPasswordButton' >Pamiršau slaptažodį</a>
                </div>
                <hr></hr>
                <div className='register'>
                    <p className='noAccount'>Neturite paskyros?</p>
                    <button className='registerButton'><a className='redirect' href='\registration'>Registruotis</a></button>
                </div>
            </div>
        </div>
    )
}