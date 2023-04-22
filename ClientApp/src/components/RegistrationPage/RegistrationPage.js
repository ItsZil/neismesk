import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import './RegistrationPage.css'
import toast, { Toaster } from 'react-hot-toast';

const RegistrationPage = () => {

    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [matchMessage, setMatchMessage] = useState('');
    const navigate = useNavigate();

    const onChange = (e) => {
        let password = e.target.value;
        setPassword(password);
        if (password.length >= 8 && /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password)) {
            setMessage("");
        }
        else {
            setMessage("Slaptažodis turi turėti mažąsias, didžiąsias raides, skaičius, spec. simbolius ir būti bent 8 simbolių ilgio!");
        }
    }

    function checkFields() {
        if (password === confirmPassword) {
            if (name === '' || surname === '' || email === '') {
                setMessage('Reikia užpildyti visus laukus!');
                return false;
            }
            setMatchMessage("");
            setMessage("");
            return true;
        }
        else {
            setMatchMessage("Slaptažodiai turi sutapti!");
            return false;
        }
    }

    const handleSubmit = () => {
        if (checkFields()) {
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name,
                    surname: surname,
                    password: password,
                    email: email,
                }),
            };
            fetch("api/user/register", requestOptions)
                .then(response => {
                    if (response.status === 200) {
                        toast('Sėkmingai prisiregistravote!');
                        navigate("/login");
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
    }

    return (
        <div className='outerBoxWrapper'>
            <Toaster />
            <div className='outerBox'>
                <div className='innerBox'>
                    <h2 className='boxLabel'>Registracija</h2>
                    <div className='inputWrapper'>
                        <input type='text' name='name' id='name' value={name} onChange={(e) => setName(e.target.value)} placeholder='Vardas'></input>
                    </div>
                    <div className='inputWrapper'>
                        <input type='text' name='surname' id='surname' value={surname} onChange={(e) => setSurname(e.target.value)} placeholder='Pavardė'></input>
                    </div>
                    <div className='inputWrapper'>
                        <input type='email' name='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='El. paštas'></input>
                    </div>
                    <div className='inputWrapper'>
                        <input type="password" name='password' id='password' value={password} onChange={onChange} placeholder='Slaptažodis'></input>
                    </div>
                    <div className='inputWrapper'>
                        <input type="password" name='confirmPassword' id='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder='Pakartokite slaptažodį'></input>
                    </div>
                    <label className='warningText'>{message}</label>
                    <label className='warningText'>{matchMessage}</label>
                    <div className='registration'>
                        <button onClick={() => handleSubmit()} type='submit'>Registruotis</button>
                    </div>
                    <div className='returnToLogin'>
                        <a href="/" className='returnToLoginButton'>Grįžti į prisijungimą</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default RegistrationPage