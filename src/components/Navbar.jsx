import React, { useState, useEffect, useRef } from 'react';
import yourImage from '../images/old-twitter-logo.png';
import profileimg from '../images/profile.png';
import Content from './content';
import Sample from "./sample";
import { Link } from 'react-router-dom';
var cc = 'home';
const NavBar = (id) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const setCurrentContentAndUpdateCC = (value) => {
        setCurrentContent(value);
    };

    
    const [currentContent, setCurrentContent] = useState('home');
    const currentContentRef = useRef(currentContent);
    useEffect(() => {
        cc = currentContent;
    }, [currentContent]);
    const [contClicked, setcontClicked] = useState(true);
    
    return (
        <div className='divide'>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container">
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                        onClick={toggleMenu}
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
                        <ul className="navbar-nav flex-column">
                            <li className="nav-item circle-icon"><img src={yourImage} alt="twitter-logo" id='tlogo' /></li>
                            <Sample id={id.id}
                                onClick={() => {
                                    setcontClicked(!contClicked);
                                    if (contClicked) {
                                        setCurrentContentAndUpdateCC('profile');
                                    } else {
                                        setCurrentContentAndUpdateCC('home');
                                    }
                                }}
                            />

                            <button type="button" className="btn btn-info custom-button" id='post-btn' ><a href="/compose" className="nav-link">Post</a></button>
                            <div className='profile-box'>
                                <img src={(id.pic)?id.pic:profileimg} alt="profile" className='pro-img' />
                                <div id='profile-attr'>
                                    <h5>{(id.id)?id.id.trim().slice(0,7):"No Name"}</h5>
                                    <p>{(id.id)?id.id.trim().slice(0,7):"No Profile"}</p>
                                </div>
                                <i className='fas fa-ellipsis-h' id='profile-attr'></i>
                            </div>
                        </ul>
                    </div>
                    {/* <div>
                        {postClicked?(<h1 className={myStyle}>BHarath</h1>):(null)}
                    </div> */}
                </div>
            </nav>
            <Content currentContentRef={currentContentRef} />
        </div>
    );
};
function gval() {
    return cc;
}
export function getValues() {
    try {

        const value1 = gval();
        if (value1 === 'home' || value1 === 'profile') {
            return value1;
        }
    } catch (error) {
        console.log(error);
    }
}
export default NavBar;
