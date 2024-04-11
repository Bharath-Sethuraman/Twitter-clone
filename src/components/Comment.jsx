import React, { useState, useEffect, useRef } from 'react';
import profilePic from "../images/profile.png";
import 'emoji-picker-element';
import insertText from 'insert-text-at-cursor';


function Comment({ postComment, name, uname, tId }) {
    const myStyle = {
        display: 'block',
        position: 'fixed',
        bottom: '-300px',
        left: 0,
        width: '100 %',
        backgroundColor: '#fff',
        padding: '20px',
        transition: 'bottom 8s ease - out'
    }
    const [isClicked, setClicked] = useState(false);
    const [textval, settextval] = useState('');
    const [comments, setComments] = useState([]);
    const emojiPickerRef = useRef(null);
    const inputRef = useRef(null);
    useEffect(() => {
        const handleEmojiClick = (event) => {
            const selectedEmoji = event.detail.unicode;
            const inputField = inputRef.current;
            insertText(inputField, selectedEmoji);
        };
        const emojiPicker = emojiPickerRef.current;
        emojiPicker.addEventListener('emoji-click', handleEmojiClick);
        return () => {
            emojiPicker.removeEventListener('emoji-click', handleEmojiClick);
        };
    }, []);
    useEffect(() => {
        const getComment = async () => {
            try {
                const response = await fetch('http://localhost:5000/post-comment');
                const data = await response.json();
                //const descr = data.comments.map(({ text }) => text);
                setComments(data);
                console.log(comments);
            }
            catch (error) {
                console.log(error);
            }
        };
        getComment();
    }, [])
    const postCommentToServer = async () => {
        try {
            const response = await fetch('http://localhost:5000/post-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment: textval, username: uname, tweetId: tId })
            });
            if (response.ok) {
                const data = await response.json();
                setComments([...comments, data.comment]);
                settextval('');
            } else {
                console.error('Failed to add comment:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding comment:', error.message);
        }
    };
    const gettextVal = () => {
        if (textval.trim() !== '') {
            setComments((prevComments) => [...prevComments, textval]);
            settextval('');
        }
    };
    return (
        <div className="comment">
            <div className="modal" tabIndex="-1" style={myStyle} >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-body">
                            <img src={profilePic} alt="" /><p>{name}</p>
                            <textarea className="form-control" id="exampleInput" placeholder={`Write a comment, ${uname}!`} value={textval} onChange={(e) => settextval(e.target.value)} ref={inputRef} />
                            <div>
                                <div className='input-symbol'>
                                    <button type='button' className="" ><i className='fas fa-poll'></i></button>
                                    <button type='button' className="" ><i className='fas fa-poll'></i></button>
                                    <button type='button' onClick={() => setClicked(!isClicked)}>
                                        <i className='fas fa-smile'></i>
                                    </button>
                                </div>
                                <div style={{ display: isClicked ? 'block' : 'none' }}>
                                    <emoji-picker ref={emojiPickerRef}></emoji-picker>
                                </div>
                                <div className="commentpost">
                                    <button type="button" className="btn btn-info custom-button" onClick={postCommentToServer}>Post</button>
                                    <button className="btn btn-secondary" onClick={() => {
                                        postComment(false);
                                        settextval("");
                                    }
                                    }>Close</button>
                                </div>
                                <div className='commentcontent'>
                                    <ul>
                                        {comments.map((comment, index) => {
                                            // Check if the comment's tweetId matches the current tweetId
                                            if (comment.tweet === tId) {
                                                return (
                                                    <li key={index}>
                                                        <div>
                                                            <div style={{ display: 'flex' }}>
                                                                <hr />
                                                                <img src={profilePic} alt="" />
                                                                <p>{comment.username}</p>
                                                            </div>
                                                            <h5>{comment.text}</h5>
                                                            <hr />
                                                        </div>
                                                    </li>
                                                );
                                            } else {
                                                return null; // Don't render the comment if it doesn't match the tweetId
                                            }
                                        })}
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comment;