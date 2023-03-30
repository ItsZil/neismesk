import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router';
import './ItemCreationPage.css'

const ItemCreationPage = () => {
    const [name, setName] = useState('');
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Pasirinkite kategoriją');
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("api/device/getCategories")
            .then(response => {
                setCategories(response.data);
            })
            .catch(error => {
                console.log(error);
                toast("Įvyko klaida, susisiekite su administratoriumi!");
            })
    }, []);

    useEffect(() => {
        if (images.length < 1) return;
        if (images.length > 6) {
            toast("Negalima įkelti daugiau nei 6 nuotraukų!", {
                style: {
                    backgroundColor: 'red',
                    color: 'white',
                },
            });
            return;
        }
    }, [images]);

    const getAllCategories = () => {
        try {
            return categories.map((category) => {
                return <option value={category.id}>{category.name}</option>;
            });
        }
        catch (error) {
            toast("Įvyko klaida, susisiekite su administratoriumi!");
            console.log(error);
        }
    }

    const getAllImages = () => {
        if (images.length > 0) {
            return images.map((image) => {
                const imageUrl = URL.createObjectURL(image);
                return <img src={imageUrl} style={{ maxWidth: '15%', height: 'auto', marginRight: '10px', border: '1px solid white' }}></img>;
            })
        }
    }

    function checkFields() {
        if (name === '' || description === '' || category === 'Pasirinkite kategoriją') {
            toast('Reikia užpildyti visus laukus!', {
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
                formData.append('description', description);
                formData.append('fk_category', category);
                formData.append('images', images)
                axios.post("api/device/create", formData)
                    .then(response => {
                        if (response.status === 200) {
                            toast('Sėkmingai sukūrėtė skelbimą!', {
                                style: {
                                    backgroundColor: 'rgb(14, 160, 14)',
                                    color: 'white',
                                },
                            });
                        }
                        else {
                            toast("Įvyko klaida, susisiekite su administratoriumi!");
                        }
                    })
            }
            catch (error) {
                toast("Įvyko klaida, susisiekite su administratoriumi!");
            }
        }
    }

    const handleCancel = () => {
        navigate("/index");
    }

    return (
        <div className='itemOuterBox'>
            <Toaster />
            <div className='itemInnerBox'>
                <h2 className='itemBoxLabel'>Skelbimo sukūrimas</h2>
                <div className='itemInputWrapper'>
                    <input type='file' name='images' multiple accept='image/*' onChange={(e) => setImages([...e.target.files])}></input>
                </div>
                <div className='itemInputWrapper'>
                    {getAllImages()}
                </div>
                <div className='itemInputWrapper'>
                    <input type='text' name='name' id='name' value={name} onChange={(e) => setName(e.target.value)} placeholder='Pavadinimas'></input>
                </div>
                <div className='itemInputWrapper'>
                    <textarea name='description' id='description' value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Aprašymas'></textarea>
                </div>
                <div className='itemInputWrapper'>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} >
                        <option>Pasirinkite kategoriją</option>
                        {getAllCategories()}
                    </select>
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
export default ItemCreationPage