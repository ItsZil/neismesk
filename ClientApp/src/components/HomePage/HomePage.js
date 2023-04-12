import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.css';
import  { Link, useNavigate } from 'react-router-dom';


function HomePage() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        async function fetchItems() {
            const response = await axios.get('/api/device/getDevices');
            setItems(response.data);
        }

        fetchItems();
    }, []);
    const handleClick = (item) => {
    };
    const handleDelete = async (itemId) => {
        await axios.delete(`/api/device/delete/${itemId}`);
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
                        <Link to={`/items/${item.id}`}>
                        <button className='update' onClick={() => handleClick(item)} type='submit'>Redaguoti</button>
                        </Link>
                        <button className="wish">Noriu!</button>
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

