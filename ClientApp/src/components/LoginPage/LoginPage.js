import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './LoginPage.css'

export const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                password: password,
                email: email
            }),
        };
        fetch("api/login/login", requestOptions)
            .then(response => {
                if (response.status === 200) {
                    alert('Sėkmingai prisijungėte!');
                }
                else if (response.status === 400) {
                    alert("Nerastas vartotojas su pateiktais duomenimis!");
                }
                else {
                    alert("Įvyko klaida, susisiekite su administratoriumi!");
                }
            })
    }

    const testLogin = () => {
        const requestOptions = {
            method: "GET"
        };
        
        fetch("api/login/isloggedin", requestOptions)
            .then(response => {
                if (response.status === 200) {
                    alert('Logged in');
                }
                else if (response.status === 401) {
                    alert('Not logged in');
                }
                else {
                    alert('Unexpected response, check console logs');
                }
            })
    }

    const testLogout = () => {
        const requestOptions = {
            method: "GET"
        };

        fetch("api/login/logout", requestOptions)
            .then(response => {
                if (response.status === 200) {
                    alert('Logged out');
                }
                else if (response.status === 401) {
                    alert('Already logged out');
                }
                else {
                    alert('Unexpected response, check console logs');
                }
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
                    <a href="#" className='forgotPasswordButton' >Pamiršau slaptažodį</a>
                </div>
                <hr></hr>
                <div className='register'>
                    <p className='noAccount'>Neturite paskyros?</p>
                    <button className='registerButton'><a className='redirect' href='\registration'>Registruotis</a></button>
                </div>
            </div>

            <div className='innerBox'>
                <center>
                    <p style={{ color: "yellow" }}>Development buttons</p>
                    <button className='loginButton' onClick={() => testLogin()} type='submit'>Test if logged in</button>
                    <button className='loginButton' onClick={() => navigate('/testaccesscontrol')} type='submit'>Enter restricted page</button>
                    <button className='loginButton' onClick={() => testLogout()} type='submit'>Test logging out</button>
                    <i><small style={{ color: "yellow" }}>logout has [Authorize], so the endpoint won't be accessed if not logged in.</small></i>
                </center>
            </div>
        </div>
    )
}