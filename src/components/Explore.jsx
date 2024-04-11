import React, { useState, useEffect } from "react";
import coverImg from "../images/Twitter-X-Logo.jpg";
import profilePic from "../images/profile.png";
import Tweets from "./tweets";

function Explore() {
    const myStyle = {
        position: "absolute",
        top: '20%',
        backgroundColor: "skyblue",
        height: "4px",
        width: "7%",
    }
    const [buttonStates, setButtonStates] = useState({
        button1: true,
        button2: false,
        button3: false,
    });

    const handleButtonClick = (bName) => {
        const updatedButtonStates = {
            button1: false,
            button2: false,
            button3: false,
        };
        updatedButtonStates[bName] = true;

        setButtonStates(updatedButtonStates);
    }
    const [newsData, setnewsData] = useState([]);
    useEffect(() => {
        const getnews = async () => {
            try {
                const response = await fetch('http://localhost:5000/get');
                const data = await response.json();
                //const descr = data.map(({ username }) => username);
                setnewsData(data.articles.map(({ title, author, urlToImage }) => ({ title, author, urlToImage })));
            }
            catch (error) {
                console.log(error);
            }
        };
        getnews();
    }, [])
    return (
        <div className="contentntweets explore">
            <div className="explore">
                <div className="input-group">
                    <input type="text" className="form-control" placeholder="Search" />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="button">
                            <i className="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="explorecontent">
                <button onClick={() => handleButtonClick('button1')}><span style={buttonStates.button1 ? myStyle : {}}></span>ForYou</button>
                <button onClick={() => handleButtonClick('button2')}><span style={buttonStates.button2 ? myStyle : {}}></span>Trending</button>
                <button onClick={() => handleButtonClick('button3')}><span style={buttonStates.button3 ? myStyle : {}}></span>News</button>
                <hr />
            </div>
            <div className="explorecont">
                {newsData.length > 0 && buttonStates.button1 ? (
                    newsData.map((item, i) => (
                        <Tweets key={i} name={"Twitter"} desc={item.title} postimg={item.urlToImage} />
                    ))
                ) : buttonStates.button2 ? (
                    <Tweets name="Athi" desc="Very Good" />
                ) : (
                    <Tweets name="Bhuvana" desc="Very Good" />
                )}
            </div>

        </div>
    );
}

export default Explore;