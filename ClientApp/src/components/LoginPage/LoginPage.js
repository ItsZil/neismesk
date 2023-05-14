import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import './LoginPage.css'
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';

export const LoginPage = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserLogin = async () => {
            try {
                const response = await axios.get('api/user/isloggedin/0');
                if (response.status == 200)
                {
                  toast.error("Jūs jau esate prisijungęs!")
                  navigate('/');
                }
            } catch (error) {
              if (error.response.status === 401) {
                return true;
              }
              else
              {
                toast('Įvyko klaida, susisiekite su administratoriumi!');
              }
            }
        };
        fetchUserLogin();
      }, []);

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
                        <a href='\pamirsau-slaptazodi' className='forgotPasswordButton' >Pamiršau slaptažodį</a>
                    </div>
                    <hr></hr>
                    <div className='register'>
                        <p className='noAccount'>Neturite paskyros?</p>
                        <button className='registerButton'><a className='redirect' href='\registration'>Registruotis</a></button>
                    </div>
                </div>
            </div>
        </div>
    )
}