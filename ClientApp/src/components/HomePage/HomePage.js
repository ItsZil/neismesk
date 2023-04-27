import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import './HomePage.css';


function HomePage() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const [viewerId, setViewerId] = useState(null);



    useEffect(() => {
        const fetchViewerId = async () => {
            try {
                const response = await axios.get('api/user/getCurrentUserId');
                setViewerId(response.data);
            } catch (error) {
                //toast('Įvyko klaida, susisiekite su administratoriumi!');
                // TODO - an error still shows up in the console when logged out.
            }
        };
        fetchViewerId();
    }, []);


    useEffect(() => {
        async function fetchItems() {
            const response = await axios.get('/api/item/getItems');
            setItems(response.data);
        }

        fetchItems();
    }, []);

    const handleOpen = (itemId) => {
        navigate(`/skelbimas/${itemId}`);
    }

    const handleWish = (itemId) => {
        navigate(`/skelbimas/${itemId}`);
    }

    return (
        <div className="home">
            <section className="product-list">
                <h3>Naujausi prietaisų skelbimai</h3>
                <ul className="ul">
                {items.map(item => (
                    <li className="li" key={item.id}>
                        <img src="./images/phone.png" alt="{item.name}" />
                        <h4>{item.name}</h4>
                        <p>{item.description}</p>
                        {item.userId !== viewerId ? (
                        <button className="wish" onClick={() => handleWish(item.id)}>Noriu!</button>
                        ) : (
                            <button className="wish" onClick={() => handleWish(item.id)}>Peržiūrėti</button>
                        )}
                    </li>
                ))}
                </ul>
            </section>
        </div>
    );
}

export default HomePage;

