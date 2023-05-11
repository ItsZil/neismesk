import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router';
import './RepairShopCreationPage.css'

const RepairShopCreationPage = () => {
    const [name, setName] = useState('');
    const [phone_number, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const navigate = useNavigate();


    function checkFields() {
        if (name === '' || phone_number === '' || email === '' || address === '' || city === '' ) {
            toast.error('Reikia užpildyti visus laukus!', {
                style: {
                    backgroundColor: 'red',
                    color: 'white',
                },
            });
            return false;
        }
        else {
            return true;
        }
    }

    const handleCreate = () => {
        if (checkFields()) {
            try {
                const formData = new FormData();
                formData.append('name', name);
                formData.append('phone_number', phone_number);
                formData.append('email', email);
                formData.append('address', address);
                formData.append('city', city);
                axios.post("api/repairshop/create", formData)
                    .then(response => {
                        if (response.status === 200) {
                            toast.success('Sėkmingai sukūrėtė reklamą!', {
                                style: {
                                    backgroundColor: 'rgb(14, 160, 14)',
                                    color: 'white',
                                },
                            });
                            navigate(`/`)
                        }
                        else {
                            toast.error("Įvyko klaida, susisiekite su administratoriumi!");
                        }
                    })
                    .catch(error => {                   
                            toast.error("Įvyko klaida, susisiekite su administratoriumi!");
                    })
            }
            catch (error) {
                toast.error("Įvyko klaida, susisiekite su administratoriumi!");
            }
        }
    }

    const handleCancel = () => {
        navigate("/");
    }

    return (
        <div className='itemOuterBox'>
            <Toaster />
            <div className='itemInnerBox'>
                <h2 className='itemBoxLabel'>Taisyklos reklamos sukūrimas</h2>
                <div className='itemInputWrapper'>
                    <input type='text' name='name' id='name' value={name} onChange={(e) => setName(e.target.value)} placeholder='Pavadinimas'></input>
                </div>
                <div className='itemInputWrapper'>
                    <input type='text' name='phone_number' id='phone_number' value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)} placeholder='Telefono numeris'></input>
                </div>
                <div className='itemInputWrapper'>
                    <input type='email' name='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='El. paštas'></input>
                </div>
                <div className='itemInputWrapper'>
                    <input type='text' name='address' id='address' value={address} onChange={(e) => setAddress(e.target.value)} placeholder='Adresas'></input>
                </div>
                <div className='itemInputWrapper'>
                    <input type='text' name='city' id='city' value={city} onChange={(e) => setCity(e.target.value)} placeholder='Miestas'></input>
                </div>
                <div style={{ display: 'flex', paddingTop: '20px' }}>
                    <div className='createButton'>
                        <button className='create' onClick={() => handleCreate()} type='submit'>Sukurti</button>
                    </div>
                    <div className='cancelButton'>
                        <button className='cancel' onClick={() => handleCancel()} type='button'>Atšaukti</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default RepairShopCreationPage