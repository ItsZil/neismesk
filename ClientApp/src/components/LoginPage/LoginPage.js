import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './LoginPage.css'
import toast, { Toaster } from 'react-hot-toast';

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
        fetch("api/user/login", requestOptions)
            .then(response => {
                if (response.status === 200) {
                    // Hack to make the NavMenu update the user avatar.
                    window.location.reload();
                    window.location.href = "/";
                }
                else if (response.status === 404) {
                    toast("Prisijungimo duomenys neteisingi!", {
                        style: {
                            backgroundColor: 'red',
                            color: 'white',
                        },
                    });
                }
                else if (response.status === 401) {
                    toast("El. pašto adresas nepatvirtintas. Patikrinkite savo elektroninį paštą!", {
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

    const testLogin = () => {
        const requestOptions = {
            method: "GET"
        };

        fetch("api/user/isLoggedIn", requestOptions)
            .then(response => {
                if (response.status === 200) {
                    toast("Logged in");
                }
                else if (response.status === 401) {
                    toast("Not logged in", {
                        style: {
                            backgroundColor: 'red',
                            color: 'white',
                        },
                    });
                }
                else {
                    toast("Unexpected response, check console logs", {
                        style: {
                            backgroundColor: 'red',
                            color: 'white',
                        },
                    });
                }
            })
    }

    const testLogout = () => {
        const requestOptions = {
            method: "GET"
        };

        fetch("api/user/logout", requestOptions)
            .then(response => {
                if (response.status === 200) {
                    toast("Logged out");
                }
                else if (response.status === 401) {
                    toast("Already logged out", {
                        style: {
                            backgroundColor: 'red',
                            color: 'white',
                        },
                    });
                }
                else {
                    toast("Unexpected response, check console logs", {
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
            <Toaster />
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
                        <a href='\forgotpassword' className='forgotPasswordButton' >Pamiršau slaptažodį</a>
                    </div>
                    <hr></hr>
                    <div className='register'>
                        <p className='noAccount'>Neturite paskyros?</p>
                        <button className='registerButton'><a className='redirect' href='\registration'>Registruotis</a></button>
                    </div>
                </div>
            </div>

            <div className='outerBoxWrapper'>
                <div className='outerBox'>
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
            </div>
        </div>
    )
}