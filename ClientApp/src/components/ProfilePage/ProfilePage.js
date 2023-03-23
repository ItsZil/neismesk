import React, { useState } from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
    // Set up some basic information for the user
    const [userInfo, setUserInfo] = useState({
        name: "John Smith",
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
                <h1>{userInfo.name}</h1>
                <p><strong>Age:</strong> {userInfo.age}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Address:</strong> {userInfo.address}</p>
                <button className="edit-button">Edit</button>
            </div>
        </div>
    );
};

export default ProfilePage;