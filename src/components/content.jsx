import React, { useEffect, useState } from 'react';
import Foryou from './Foryou';
import Top from './top';
import Tweets from './tweets';
import Following from './Following';
import firstImg from "../images/Twitter-X-Logo.jpg";
import axios from 'axios';

const imageContext = require.context('../upimages', false, /\.(PNG|jpe?g|svg)$/);
const images = imageContext.keys().map(imageContext);
//console.log(images);



function Content(id, pic) {
    const [activeButton, setActiveButton] = useState("button1");
    const [inputValue, setInputValue] = useState("");
    const [gimage, setImage] = useState();
    const [tweetsData, setTweetsData] = useState([]);
    const [getNameData, setNameData] = useState([]);
    const handleButtonClick = (bName) => {
        setActiveButton(bName);
    }
    function getVal() {
        console.log(gimage);
        addDetails(id.id, inputValue, gimage);
        setInputValue("");
    }
    console.log(id.id);
    const [loading, setLoading] = useState(true);
    const addDetails = async (newname, newDesc, gimage) => {
        try {

            const formData = new FormData();
            formData.append('newname', newname);
            formData.append('newDesc', newDesc);
            formData.append('newimage', gimage);
            const response = await axios.post('http://localhost:5000/gval', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const data = response.json();
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        }

    };
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch('http://localhost:5000/gval');
                const data = await response.json();
                console.log(data);
                // const descr = data.map(({ username }) => username);
                // console.log(descr);
                // const infor = data.map(({ content }) => content);
                // const pictures = data.map(({picture}) => picture);
                setTweetsData(data);
                setNameData(data.map(({ personalInfo }) => personalInfo));
                setLoading(false);
            } catch (error) {
                console.log("Error", error);
                setLoading(false);
            }
        };
        getData();
    }, [])

    return (

        <div className='contentntweets'>
            <div>
                <Top
                    onForYouClick={() => handleButtonClick("button1")}
                    onFollowingClick={() => handleButtonClick("button2")}
                    activeButton={activeButton}
                />
                <div className='subcontents'>
                    <Foryou inputValue={inputValue} onChange={setInputValue} onClick={getVal} picture={id.pic} changeimage={setImage} />
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <ul>
                            {tweetsData.map((item, i) => (
                                <li key={i}>
                                    {/* const descr = data.map(({ username }) => username); */}
                                    {/* {console.log((getNameData[i])?getNameData[i].name:null)} */}
                                    {activeButton === "button2" ? (
                                        <Following name={(getNameData[i])?getNameData[i].name:item.username} desc={item.content} />
                                    ) : (activeButton === "button1" ? (
                                        <Tweets name={(getNameData[i])?getNameData[i].name:item.username} desc={item.content} picture={item.picture} postimg={item.contpics} tweetId={item.id} userId={id.id}/>
                                    ) : (null)
                                    )}
                                </li>
                            ))}
                        </ul>
                    )
                    }

                </div>
            </div>
        </div>
    )
}

export default Content;