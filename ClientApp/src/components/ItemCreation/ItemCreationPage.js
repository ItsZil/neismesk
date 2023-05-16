import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router';
import './ItemCreationPage.css'

const ItemCreationPage = () => {
    const [name, setName] = useState('');
    const [images, setImages] = useState([]);
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('Pasirinkite kategoriją');
    const [categories, setCategories] = useState([]);
    const [itemType, setType] = useState('Pasirinkite, kaip norite atiduoti');
    const [itemTypes, setItemTypes] = useState([]);
    const navigate = useNavigate();

    const questionArray = [
        {
            type: "text",
            id: 1,
            value: ""
        }
    ];
    const [questions, setQuestions] = useState(questionArray);
    const addInput = () => {
        setQuestions(s => {
            return [
                ...s,
                {
                    type: "text",
                    value: ""
                }
            ];
        });
    };

    const handleChange = e => {
        e.preventDefault();

        const index = e.target.id;
        setQuestions(s => {
            const newArr = s.slice();
            newArr[index].value = e.target.value;

            return newArr;
        });
    };

    useEffect(() => {
        Promise.all([
            axios.get("api/item/getCategories"),
            axios.get("api/item/getItemTypes")
        ])
            .then(([categoriesResponse, itemTypesResponse]) => {
                setCategories(categoriesResponse.data);
                setItemTypes(itemTypesResponse.data);
            })
            .catch(error => {
                console.log(error);
                toast.error("Įvyko klaida, susisiekite su administratoriumi!");
            });
    }, []);

    useEffect(() => {
        if (images.length < 1) return;
        if (images.length > 6) {
            toast.error("Negalima įkelti daugiau nei 6 nuotraukų!", {
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
            toast.error("Įvyko klaida, susisiekite su administratoriumi!");
            console.log(error);
        }
    }

    const getAllItemTypes = () => {
        try {
            return itemTypes.map((itemType) => {
                return <option value={itemType.id}>{itemType.name}</option>;
            });
        }
        catch (error) {
            toast.error("Įvyko klaida, susisiekite su administratoriumi!");
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
        if (name === '' || description === '' || location === '' || category === 'Pasirinkite kategoriją' || itemType === 'Pasirinkite, kaip norite atiduoti') {
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
                formData.append('description', description);
                formData.append('location', location);
                formData.append('category', category);
                formData.append('type', itemType);
                for (let i = 0; i < questions.length; i++) {
                    formData.append('questions', questions[i].value);
                }
                for (let i = 0; i < images.length; i++) {
                    formData.append('images', images[i]);
                }
                axios.post("api/item/create", formData)
                    .then(response => {
                        if (response.status === 200) {
                            toast.success('Sėkmingai sukūrėtė skelbimą!', {
                                style: {
                                    backgroundColor: 'rgb(14, 160, 14)',
                                    color: 'white',
                                },
                            });
                            navigate(`/skelbimas/${response.data}`)
                        }
                        else if (response.status === 401) {
                            toast.error('Turite būti prisijungęs!')
                            navigate('/prisijungti');
                        }
                        else {
                            toast.error("Įvyko klaida, susisiekite su administratoriumi!");
                        }
                    })
                    .catch(error => {
                        if (error.response.status === 401) {
                            toast.error('Turite būti prisijungęs!')
                            navigate('/prisijungti');
                        }
                        else {
                            toast.error("Įvyko klaida, susisiekite su administratoriumi!");
                        }
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
                    <input type='text' name='location' id='location' value={location} onChange={(e) => setLocation(e.target.value)} placeholder='Gyvenamoji vieta'></input>
                </div>
                <div className='itemInputWrapper'>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} >
                        <option>Pasirinkite kategoriją</option>
                        {getAllCategories()}
                    </select>
                </div>
                <div className='itemInputWrapper'>
                    <select value={itemType} onChange={(e) => setType(e.target.value)} >
                        <option>Pasirinkite, kaip norite atiduoti</option>
                        {getAllItemTypes()}
                    </select>
                </div>
                {itemType === '2' && (
                    <>
                        {questions.map((item, i) => {
                            return (
                                <div className='itemInputWrapper'>
                                    <input
                                        onChange={handleChange}
                                        value={item.value}
                                        id={i}
                                        type={item.type}
                                        placeholder='Įrašykite klausimą'
                                        className='questionInput'
                                    />
                                    <div className='addQuestion'>
                                        {questions.length - 1 === i && <button className='addQuestionButton' onClick={addInput}>+</button>}
                                    </div>
                                </div>
                            );
                        })}
                    </>
                )}
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