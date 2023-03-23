import React from 'react';
import './HomePage.css';


function HomePage() {
    return (
        <div className="home">
            <div class="give-container">
                <button type="submit">Dovanoti</button>
            </div>
            <div class="search-container">
                <input type="text" placeholder="Ieškoti..."/>
                    <select>
                        <option value="">Kategorijos</option>
                        <option value="category1">Stambi buitinė technika</option>
                        <option value="category2">Smulki buitinė techinka</option>
                        <option value="category3">Kompiuteriai</option>
                    </select>
                <button type="submit">Ieškoti</button>
            </div>
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