import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router';
import './LoginPage/LoginPage.css'
import toast, { Toaster } from 'react-hot-toast';

export const TestAccessControl = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Variable that allows us to only render the page once it is true.
    const navigate = useNavigate();
    const requestOptions = {
        method: "GET"
    };

    useEffect(() => {
        // Endpoint to check if the user is logged in. Located in LoginController.cs
        fetch("api/user/isLoggedIn/1", requestOptions) // 1 is the minimum required role. 0 - client, 1 - admin.
            .then(response => {
                if (response.status == 200) { // 200 - Ok, we are logged in.
                    setIsLoggedIn(true);
                }
                else if (response.status === 401) { // 401 - Unauthorized, we are not logged in.
                    // Do not render the page and rediret to login.
                    toast('Not logged in or incorrect role, redirecting to login'); // Only for testing.
                    navigate("/login");
                }
                else { // 500 - Internal server error
                    toast('Unexpected response, check console logs');
                }
            })
    }, []);

    const testLogin = () => {
        fetch("api/user/isLoggedIn", requestOptions)
            .then(response => {
                if (response.status === 200) { // 200 - Ok
                    toast('Logged in');
                }
                else if (response.status === 401) { // 401 - Unauthorized
                    toast('Not logged in');
                }
                else { // 500 - Internal server error
                    toast('Unexpected response, check console logs');
                }
            })
    }

    const testLogout = () => {
        fetch("api/user/logout", requestOptions)
            .then(response => {
                if (response.status === 200) { // 200 - Ok
                    toast('Logged out');
                    navigate('/login')
                }
                else if (response.status === 401) { // 401 - Unauthorized
                    toast('Already logged out');
                }
                else { // 500 - Internal server error
                    toast('Unexpected response, check console logs');
                }
            })
    }

    // Check if the user is logged in. If they are, render the page.
    return isLoggedIn ? (
        <div className='outerBoxWrapper'>
            <Toaster />
            <div className='outerBox'>
                <div className='innerBox'>
                    <center>
                        <p style={{ color: "yellow" }}>Development buttons</p>
                        <p style={{ color: "yellow" }}>If you're here, you should already be logged in.</p>
                        <button className='loginButton' onClick={() => testLogin()} type='submit'>Test if logged in</button>
                        <button className='loginButton' onClick={() => testLogout()} type='submit'>Test logging out</button>
                        <i><small style={{ color: "yellow" }}>logout has [Authorize], so the endpoint won't be accessed if not logged in.</small></i>
                    </center>
                </div>
            </div>
        </div>
    ) : null; // null - don't render anything.
}