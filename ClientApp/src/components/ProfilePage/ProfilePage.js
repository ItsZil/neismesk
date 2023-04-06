import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {

    /*
    const [user, setUser] = useState({});

    useEffect(() => {
        async function fetchUser() {
            const response = await fetch("ProfilePageEndpointasCia");
            const data = await response.json();
            setUser(data);
        }
        fetchUser();
    }, []);
    */

   // Šita informacija statinė ir vėliau ją reiktų ištrint bei atkomentuot viską aukščiau
    const [user, setUser] = useState({
        name: "John",
        surname: "Smith",
        email: "john.smith@example.com",
        address: "123 Main St, Anytown USA"
    });

    const [image, setImage] = useState([]);

    function checkFields() {
        if (user.name === '' || user.surname === '' || user.email === '') {
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

    /*
     sita reikia pakoreguoti, cia ostino, mums reikes tik 1 nuotraukos (ir nebutina aisku keisti)
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
        const newImageUrls = [];
        images.forEach(image => newImageUrls.push(URL.createObjectURL(image)));
        setImageUrls(newImageUrls);
    }, [images]);
    */

    const handleSave = () => {
        if (checkFields()) {
            try {
                const formData = new FormData();
                formData.append('name', user.name);
                formData.append('surname', user.surname);
                formData.append('email', user.email);
                formData.append('id', 1); // todo
                formData.append('fk_category', 2); // todo
                //formData.append('image', imageURLs)

                // TODO: check if avatar was changed?
                
                axios.post("", formData)
                    .then(response => {
                        if (response.status === 200) {
                            toast('Duomenys sėkmingai išsaugoti!', {
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

    return (
        <div className="profile">
            <div className="avatar-container">
                <img className="avatar" src="https://randomuser.me/api/portraits/men/75.jpg" alt="User avatar" />
                <input type="file" accept="image/png, image/jpeg" onChange={(e) => setImage([...e.target.files])}></input>
            </div>
            <div className="info">
                <p><strong>Vardas:</strong></p> <input type="name" id="name" value={user.name}></input>
                <p><strong>Pavardė:</strong></p> <input type="surname" id="surname" value={user.surname}></input>
                <p><strong>Email:</strong></p> <input type="email" id="email" value={user.email}></input>

                <hr></hr>
                <p><strong>Senas slaptažodis:</strong></p> <input type="password" id="old_password"></input>
                <p><strong>Naujas slaptažodis:</strong></p> <input type="password" id="new_password"></input>
                <button className="save-button" onClick={() => handleSave()} type='submit'>Save</button>
                
            </div>
        </div>
    );
};

export default ProfilePage;