import React, { useEffect, useState } from 'react';
import Happenning from "./hapenning";

const happen = {
    headinfo: ['BiggBoss', 'Chennai Flood', 'Rain', 'Tollywood', 'Astrology', 'Node js'],
    desc: ["who's the title winner", "minchaung cyclone", "next rains are:", "new Movie's are", "ISRO announced", "best for JS"]
}

function Search() {
    const [newsData, setnewsData] = useState([]);
    useEffect(() => {
        const getnews = async () => {
            try {
                const response = await fetch('http://localhost:5000/get');
                const data = await response.json();
                //const descr = data.map(({ username }) => username);
                setnewsData(data.articles.map(({ title, description }) => ({ title, description })));
            }
            catch (error) {
                console.log(error);
            }
        };
        getnews();
    }, [])
    return (
        <div className="container mt-4" id="third-tab">
            <div className="input-group">
                <input type="text" className="form-control" placeholder="Search" />
                <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button">
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </div>
            <div className="happening">
                <h2>What's Happenning</h2>
                <ul>
                    {newsData.map((item, i) => (
                        <li key={i}>
                            <Happenning info={item.title} desc={item.description} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
export default Search;