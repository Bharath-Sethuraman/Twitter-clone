import React, { useState, useEffect } from "react";
import coverImg from "../images/Twitter-X-Logo.jpg";
// import profilePic from "../upimages/";
import Tweets from "./tweets";
import AddDetails from "./AddDetails";
import { useParams } from "react-router-dom";

function UserProfile(id , pic,props) {
    // const { id, pic } = props.location.data || {};
    const [isEditing, setIsEditing] = useState(false);
    const [Utweet, setTweets] = useState([]);
    const [postCount, setPostCount] = useState(0);
    const { username } = useParams(); 
    const handleFollow = () => {
        setIsEditing(!isEditing);
    };
    const myStyle = {
        position: "absolute",
        bottom: "-20px",
        backgroundColor: "red",
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

    const goBack = () => {
        window.history.back();
    }
    //console.log(id);
    useEffect(() => {
        const updateTweets = async () => {
            try {
                const response = await fetch('http://localhost:5000/getTweets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ "userId": username }),

                });
                if (response.ok) {
                    const tweets = await response.json();
                    const descr = tweets.map(({ userId, userName, content, picture, contpics, likes, tweetId }) => ({ userId, userName, content, picture, contpics, likes, tweetId }));
                    setPostCount(descr.length)
                    setTweets(descr);
                    console.log(tweets);

                } else {
                    console.error('Login Failed');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
        updateTweets();
    }, [])



    return (
        <div className="contentntweets profilepage">
            <div className="username">
                <button onClick={goBack}><i className="fa fa-chevron-left"></i></button>
                <div>
                    <h4>{username || "No name"}</h4>
                    <p>{postCount} posts</p>
                </div>
            </div>
            <div className="pics">
                <img src={coverImg} alt="" />
                <div className="propic">
                    <img src={Utweet.map(({picture})=>({picture}))} alt="" />
                    <button onClick={handleFollow}>Follow</button>
                    {console.log(Utweet.map(({picture})=>({picture})))}
                    {/* const descr = tweets.map(({ userId, userName, content, picture, contpics, likes, tweetId }) => ({ userId, userName, content, picture, contpics, likes, tweetId })); */}
                </div>
            </div>
            <div className="procontent">
                <h4>{username || "No name"}</h4>
                <p>@{username || "No name"}</p>
                <div className="proicon">
                    <i className="fas fa-map-marker">Madurai, India</i>
                    <i className="fa fa-birthday-cake">Born July 23, 2002</i>
                    <i className="fa fa-calendar">Joined December 2018</i>
                </div>
                <div className="probutton">
                    <p>38 Following</p>
                    <p>0 Followers</p>
                </div>
            </div>
            <div className="maincontent">
                <button onClick={() => handleButtonClick('button1')}><span style={buttonStates.button1 ? myStyle : {}}></span>Posts</button>
                <button onClick={() => handleButtonClick('button2')}><span style={buttonStates.button2 ? myStyle : {}}></span>Media</button>
                <button onClick={() => handleButtonClick('button3')}><span style={buttonStates.button3 ? myStyle : {}}></span>Likes</button>
            </div>
            <div className="procont">
                {buttonStates.button1 ? (
                    <ul>
                        {Utweet.map((item, i) => (
                            <li key={i}>
                                <Tweets name={username} desc={item.content} picture={item.picture} postimg={item.contpics} tweetId={item.tweetId} userId={id.id} uId={item.userId} />
                                {/* {console.log(item.content.length)} */}
                            </li>
                        ))}
                    </ul>
                )
                    : (buttonStates.button2 ? (
                        <ul>
                            {Utweet.map((item, i) => (
                                <li key={i}>
                                    {(item.contpics) ?
                                        < Tweets name={username} desc={item.content} picture={item.picture} postimg={item.contpics} tweetId={item.tweetId} userId={id.id} />
                                        : null}
                                </li>
                            ))}
                        </ul>
                    ) : (buttonStates.button3 ? (
                        <ul>
                            {Utweet.map((item, i) => (
                                <li key={i}>
                                    {console.log(item)}
                                    {item.likes ? (
                                        <Tweets name={username} desc={item.content} picture={item.picture} postimg={item.contpics} tweetId={item.tweetId} userId={id.id} />
                                    ) : null}
                                </li>
                            ))}
                        </ul>
                    ) : null))
                }
            </div>
        </div>
    )
}
export default UserProfile;