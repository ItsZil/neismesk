import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.css';


function HomePage() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        async function fetchItems() {
            const response = await axios.get('/api/device/getDevices');
            setItems(response.data);
        }

        fetchItems();
    }, []);
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
                        <button>Noriu!</button>
                    </li>
                ))}
                </ul>
            </section>
        </div>
    );
}

export default HomePage;

