import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';


function HomePage() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchItems() {
            const response = await axios.get('/api/item/getItems');
            setItems(response.data);
        }

        fetchItems();
    }, []);

    const handleWish = (itemId) => {
        navigate(`/skelbimas/${itemId}`);
    }

    const handleDelete = async (itemId) => {
        await axios.delete(`/api/item/delete/${itemId}`);
        setItems(items.filter((item) => item.id !== itemId));
    };

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
                        <button className="wish" onClick={() => handleWish(item.id)}>Noriu!</button>
                        <button className="delete" onClick={() => handleDelete(item.id)}>
                        Ištrinti
                        </button>
                    </li>
                ))}
                </ul>
            </section>
        </div>
    );
}

export default HomePage;

