import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
        surnname: "Smith",
        age: 35,
        email: "john.smith@example.com",
        address: "123 Main St, Anytown USA"
    });

    return (
        <div className="profile">
            <div className="avatar-container">
                <img className="avatar" src="https://randomuser.me/api/portraits/men/75.jpg" alt="User avatar" />
            </div>
            <div className="info">
                <h1>{user.name} {user.surnname}</h1>
                <p><strong>Age:</strong> {user.age}</p> 
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Address:</strong> {user.address}</p>
                <Link to="/editpage">
                <button className="edit-button">Edit</button>
                </Link>
                
            </div>
        </div>
    );
};

export default ProfilePage;