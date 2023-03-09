import React, { Component } from 'react';
import './AboutUs.css';

export class AboutUs extends Component {
    static displayName = AboutUs.name;
  
    render() {
      return (
        <div>
          <center><p className="welcome">Sveiki atvykę į nenaudojamų elektronikos prietaisų dovanojimo ir keitimo puslapį!</p></center>
          <center><p className="sentence1">Šios internetinės svetainės tikslas yra leisti žmonėms dovanoti, mainyti ar pageidauti elektronikos prietaisų.</p></center>
          <center><h1 className="question">Kuo ši svetainė ypatinga?</h1></center>
          <div className="options">
          <div className="firstOption">
          <center><img src="./images/wheel-dice.png" alt=""/></center>
          <center><h2 className="optionTitle">Loterija</h2></center>
          <center><p className="optionsSentence">Galimybė laimėti arba padovanoti elektroninį prietaisą loterijos būdu.</p></center>
          </div>
          <div className="secondOption">
          <center><img src="./images/think.png" alt=""/></center>
          <center><h2 className="optionTitle">Pagrindimas</h2></center>
          <center><p className="optionsSentence">Galimybė paskelbti klausimų forma, kurioje žmonės norintys šio daikto atsako į klausimus, kurie padėtų įtikinti skelbėją, kad jie turėtų gauti šį prietaisą. Skelbėjas savo nuožiūrą išrenka laimėtoją.</p></center>     
          </div>
          <div className="thirdOption">
          <center><img src="./images/exchange.png" alt=""/></center>
          <center><h2 className="optionTitle">Keitimas</h2></center>
          <center><p className="optionsSentence">Galimybė mainyti savo elektroninį prietaisą į kita elektroninį prietaisą.</p></center>     
          </div>
          </div>
        </div>
      );
    }
  }