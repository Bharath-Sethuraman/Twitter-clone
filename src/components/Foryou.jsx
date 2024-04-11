import React, { useState, useEffect, useRef } from 'react';
import profileimg from '../images/profile.png';
import 'emoji-picker-element';
import insertText from 'insert-text-at-cursor';
import axios from "axios";


function Foryou({ inputValue, onChange, onClick, postbox, picture, changeimage }) {
    const [isClicked, setClicked] = useState(false);
    const [fileClicked, setfileClicked] = useState(false);
    const [image, setImage] = useState();
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
    const submitImage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", image);
        try {
            const result = await axios.post(
                "http://localhost:5000/upload-image",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );

            console.log(result.data.imageName);
        } catch (error) {
            console.error("Error uploading image:", error);
        }
    };
    const onInputChange = (e) => {
        e.preventDefault();
        console.log(e.target.files[0]);
        setImage(e.target.files[0]);
        changeimage(e.target.files[0]);
        console.log(image);
    }
    const handleClick = (event) => {
        if (fileClicked) {
            // If file is clicked, invoke the onClick handler with image data
            const formData = new FormData();
            formData.append("newimage", image);
            // Pass the required parameters to the onClick handler
            onClick(event, inputValue, formData);
            setfileClicked(false);
        } else {
            // If file is not clicked, invoke the onClick handler without image data
            onClick(event, inputValue);
        }
    }
    return (
        <div className={postbox ? 'contentntweets' : null}>
            {/* onSubmit={submitImage} */}
            <div className='postbox'>
                <div className='inputvalue'>
                    <img src={(picture) ? picture : profileimg} alt="profile" className='pro-img' />
                    {fileClicked ? (
                        <div className='exampleInput2'>
                            <textarea className="form-control" id="exampleInput" value={inputValue} onChange={(e) => onChange(e.target.value)} placeholder="What is Happenning?!" ref={inputRef} />
                            <input type="file" accept='image/*' onChange={onInputChange} />
                        </div>
                    ) : (
                        <div>
                            <textarea className="form-control" id="exampleInput" value={inputValue} onChange={(e) => onChange(e.target.value)} placeholder="What is Happenning?!" ref={inputRef} />
                        </div>
                    )
                    }
                </div>
                <div className='inputs'>
                    <div className='input-symbol'>
                        <button type='button' onClick={() => setfileClicked(!fileClicked)} ><i className='fas fa-image'></i></button>
                        <button type='button' className="" ><i className='fa'>GIF</i></button>
                        <button type='button' className="" ><i className='fas fa-poll'></i></button>
                        <button type='button' onClick={() => setClicked(!isClicked)}>
                            <i className='fas fa-smile'></i>
                        </button>
                        <button type='button' className="" ><i className='fas fa-calendar'></i></button>
                        <button type='button' className="" ><i className='fas fa-map-marker'></i></button>
                    </div>
                    <button className="btn btn-info custom-button" onClick={handleClick}>
                        {fileClicked ? "Submit" : "Post"}
                    </button>

                    <div style={{ display: isClicked ? 'block' : 'none' }}>
                        <emoji-picker ref={emojiPickerRef}></emoji-picker>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Foryou;