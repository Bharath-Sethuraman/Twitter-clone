import React, { useState, useEffect } from "react";
import UserProfile from "./UserProfile";
import axios from 'axios';
import { Routes, Route, Link } from 'react-router-dom';

import profilePic from "../images/profile.png";
import demo from "../upimages/1705846405511bhaimg.jpg";
import Comment from "./Comment";
import { useNavigate } from "react-router-dom";


function Tweets(props) {
    const [like, setLike] = useState(false);
    const [repost, setRepost] = useState(false);
    const [comment, postComment] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [repostCount, setRepostCount] = useState(0);
    const [alreadyLiked, setAlreadyLiked] = useState(false);
    const [alreadyTweeted, setAlreadyTweeted] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/updateLikes');
                const data = response.data;
                const tweetData = data.find(item => item.id === props.tweetId);
                if (tweetData && tweetData.likes) {
                    setLikesCount(tweetData.likes.length);
                    const liked = tweetData.likes.includes(props.userId);
                    setAlreadyLiked(liked);
                    const storedLike = localStorage.getItem(`like-${props.tweetId}`);
                    if (storedLike !== null) {
                        setLike(JSON.parse(storedLike));
                    } else {
                        setLike(liked);
                    }
                } else {
                    setLikesCount(0);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getData();
    }, []);

    useEffect(() => {
        localStorage.setItem(`like-${props.tweetId}`, JSON.stringify(like));
    }, [like, props.tweetId]);

    useEffect(() => {
        const getRepost = async () => {
            try {
                const response = await axios.get('http://localhost:5000/updateRepost');
                const data = response.data;
                const tweetData = data.find(item => item.id === props.tweetId);
                if (tweetData && tweetData.retweets) {
                    setRepostCount(tweetData.retweets.length);
                    const retweet = tweetData.retweets.includes(props.userId);
                    setAlreadyLiked(retweet);
                    const storedRepost = localStorage.getItem(`repost-${props.tweetId}`);
                    if (storedRepost !== null) {
                        setRepost(JSON.parse(storedRepost));
                    } else {
                        setRepost(retweet);
                    }
                } else {
                    setRepostCount(0);
                }
            } catch (error) {
                console.log(error);
            }
        };
        getRepost();
    }, []);

    useEffect(() => {
        localStorage.setItem(`repost-${props.tweetId}`, JSON.stringify(repost));
    }, [repost, props.tweetId]);
    const updateLike = async (id, username) => {
        try {
            const response = await fetch('http://localhost:5000/updateLikes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "tweetId": id, "username": username }),
            });

            if (response.ok) {
                const userLike = await response.json();
                setLikesCount(userLike.tweet.likes.length);
                setAlreadyLiked(userLike.tweet.likes.includes(props.userId));
            } else {
                console.error('Updating like failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    const updateRetweet = async (id, username) => {
        try {
            const response = await fetch('http://localhost:5000/updateRepost', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "tweetId": id, "username": username }),
            });

            if (response.ok) {
                const userLike = await response.json();
                setRepostCount(userLike.tweet.retweets.length);
                setAlreadyTweeted(userLike.tweet.retweets.includes(props.userId));
            } else {
                console.error('Updating like failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
    const likeStyle = alreadyLiked ? { color: 'red' } : {};

    const handleLikeClick = async () => {
        if (!like) {
            await updateLike(props.tweetId, props.userId);
        }
        setLike(!like);
    }
    const handleRepostClick = async () => {
        if (!repost) {
            await updateRetweet(props.tweetId, props.userId);
        }
        setRepost(!repost);
    }
    return (
        <div className="tweets">
            <div className="profile-index">
                <img
                    src={props.picture || profilePic}
                    alt="profile"
                    className='proimg'
                    type="button"
                    onClick={() => {
                        navigate(`/userprofile/${props.name}`);
                    }}
                />
                <div className="tw">
                    <h3>{props.name}</h3><p>@{props.name}</p>
                    <i className="fas fa-ellipsis-h"></i>
                </div>
            </div>
            <p>{props.desc}</p>
            {props.postimg && (
                <img
                    src={props.postimg.startsWith('http') ? props.postimg : require(`../upimages/${props.postimg}`)}
                    alt="Posts"
                />
            )}
            <div className="reaction">
                <i className="fas fa-comment" type="button" onClick={() => postComment(!comment)}></i>
                <i className="fas fa-retweet" id="likes" type="button" onClick={handleRepostClick} style={likeStyle}>{repostCount}</i>
                <i className="fas fa-heart" id="likes" type="button" onClick={handleLikeClick} style={likeStyle}>{likesCount}</i>
                <i className="fas fa-poll"></i>
                <i className="fas fa-save"></i>
                <i className="fas fa-download"></i>
            </div>
            <div className="postcomment" style={{ display: comment ? 'block' : 'none' }}>
                {console.log(props.userId)}
                <Comment postComment={() => postComment(false)} name={props.name} uname={props.userId} tId={props.tweetId} />
            </div>
            <hr />
        </div>
    )
}

export default Tweets;
