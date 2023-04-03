import React from 'react';
import './HomePage.css';


function HomePage() {
    return (
        <div className="home">
            <section className="product-list">
                <h3>Naujausi prietaisų skelbimai</h3>
                <ul className="ul">
                    <li className="li">
                        <img src="./images/phone.png" alt="" />
                        <h4>Samsung A8 telefonas</h4>
                        <p>Keitimas</p>
                        <button>Noriu!</button>
                    </li>
                    <li className="li">
                        <img src="./images/washing_machine.png" alt="" />
                        <h4>Skalbimo mašina Ultra max Pro</h4>
                        <p>Loterija</p>
                        <button>Noriu!</button>
                    </li>
                    <li className="li">
                        <img src="./images/headphones.png" alt=""  />
                        <h4>Ausinės "Razor Extreme"</h4>
                        <p>Klausimynas</p>
                        <button>Noriu!</button>
                    </li>
                    <li className="li">
                        <img src="./images/phone.png" alt="" />
                        <h4>Samsung A8 telefonas</h4>
                        <p>Keitimas</p>
                        <button>Noriu!</button>
                    </li>
                    <li className="li">
                        <img src="./images/washing_machine.png" alt="" />
                        <h4>Skalbimo mašina Ultra max Pro</h4>
                        <p>Loterija</p>
                        <button>Noriu!</button>
                    </li>
                    <li className="li">
                        <img src="./images/headphones.png" alt="" />
                        <h4>Ausinės "Razor Extreme"</h4>
                        <p>Klausimynas</p>
                        <button>Noriu!</button>
                    </li>
                    <li className="li">
                        <img src="./images/headphones.png" alt="" />
                        <h4>Ausinės "Razor Extreme"</h4>
                        <p>Klausimynas</p>
                        <button>Noriu!</button>
                    </li>
                </ul>
            </section>
        </div>
    );
}

export default HomePage;