import React, {useState } from 'react';
import './RegistrationPage.css'

export const RegistrationPage = () => {
        
        const [name, setName] = useState('');
        const [surname, setSurname] = useState('');
        const [email, setEmail] = useState('');
        const [password,setPassword] = useState('');
        const [confirmPassword,setConfirmPassword] = useState('');
        
        const handleSubmit  = () => {
            console.log(name,surname,email,password,confirmPassword);
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
            fetch("registracijosEndPointCia", requestOptions)
                .then((response) => response.text())
                .then((data) => {
                   
    
                })
        }

        return (
            <div className='outerBox'>
                <div className='innerBox'>
                    <h2 className='boxLabel'>Registracija</h2>
                    <div className='inputWrapper'>
                        <input type='text' name='name' id='name' value={name} onChange = {(e) => setName(e.target.value)} placeholder='Vardas'></input>
                    </div>
                    <div className='inputWrapper'>
                        <input type='text' name='surname' id='surname' value={surname} onChange = {(e) => setSurname(e.target.value)} placeholder='Pavardė'></input>
                    </div>
                    <div className='inputWrapper'>
                        <input type='text' name='email' id='email' value={email} onChange = {(e) => setEmail(e.target.value)} placeholder='El. paštas'></input>
                    </div>
                    <div className='inputWrapper'>
                        <input type="password" name='password' id='password' value={password} onChange = {(e) => setPassword(e.target.value)} placeholder='Slaptažodis'></input>
                    </div>
                    <div className='inputWrapper'>
                        <input type="password" name='confirmPassword' id='confirmPassword' value={confirmPassword} onChange = {(e) => setConfirmPassword(e.target.value)} placeholder='Pakartokite slaptažodį'></input>
                    </div>

                    <div className='registration'>
                        <button onClick={()=>handleSubmit()} type='submit'>Registruotis</button>
                    </div>
                    <div className='returnToLogin'>
                        <a href="/login" className='returnToLoginButton' >Grįžti į prisijungimą</a>
                    </div>
                </div>
            </div>
        )
}