import React from "react";
import { useState, useEffect } from "react";
import Tweets from "./tweets";
import bookmarkIcon from "../images/Twitter-X-Logo.jpg";

function BookmarkTab(id, pic) {
    const [Utweet, setTweets] = useState([]);
    const [postCount, setPostCount] = useState(0);
    const bookmarks = [
        { id: 1, title: "Article 1", url: "https://example.com/article1" },
        { id: 2, title: "Article 2", url: "https://example.com/article2" },
        { id: 3, title: "Article 3", url: "https://example.com/article3" },
        { id: 4, title: "Article 4", url: "https://example.com/article4" },
    ];
    useEffect(() => {
        const updateTweets = async () => {
            try {
                const response = await fetch('http://localhost:5000/getTweets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ "userId": id.id }),

                });
                if (response.ok) {
                    const tweets = await response.json();
                    const descr = tweets.map(({ userId, userName, content, picture, contpics, likes, retweets, tweetId }) => ({ userId, userName, content, picture, contpics, likes, retweets, tweetId }));
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
        <div className="bookmark-tab contentntweets">
            <h2>Bookmarks</h2>
                {Utweet.map((item, i) => (
                    <ul>
                        <li key={i}>
                            {console.log(item)}
                            {item.likes || item.retweets || item.contpics ? (
                                <Tweets name={id.id} desc={item.content} picture={item.picture} tweetId={item.tweetId} userId={id.id} />
                            ) : null}
                        </li>
                    </ul>
                ))}
        </div>
    );
}

export default BookmarkTab;
