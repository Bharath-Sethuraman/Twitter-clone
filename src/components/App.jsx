// App.jsx
import React, { useState, useEffect } from "react";
import NavBar from './Navbar';
import Content from "./content";
import Search from './Search';
import { Routes, Route } from 'react-router-dom';
import Profile from './Profile';
import UserProfile from "./UserProfile";
import Explore from "./Explore";
import Foryou from "./Foryou";
import Home from './home';
import Login from "./login";
import Signup from "./Signup";
import MessagePage from "./Message";
import { useNavigate } from "react-router-dom";
import NotificationTab from "./Notification";
import BookmarkTab from "./Bookmarks";
import SettingsTab from "./More";
function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [id, setId] = useState("");
    const [uid, setUid] = useState("");
    const [pic, setPic] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch('http://localhost:5000/check-auth', {
                    method: 'GET',
                    credentials: 'include', // Include credentials for cross-origin requests
                });

                if (response.ok) {
                    const result = await response.json();
                    setLoggedIn(result.loggedIn);
                    console.log('User is logged in:', result.loggedIn);
                    setId(result.user);
                    setPic(result.image);
                    setUid(result.id);
                } else {
                    console.error('Authentication check failed');
                }
            } catch (error) {
                console.log(error);
            }
        };
        checkAuth();
    }, []);
    return (
        <div>
            {loggedIn ? (
                <div>
                    <NavBar id={id} pic={pic} />
                    <div>
                        <Routes>
                            <Route path="/home" element={<Content id={id} pic={pic} />} />
                            <Route path="/profile" element={<Profile id={id} pic={pic} />} />
                            <Route path="/userprofile/:username" element={<UserProfile id={id} pic={pic} />} />
                            <Route path="/explore" element={<Explore />} />
                            <Route path="/compose" element={<Foryou postbox="true" />} />
                            <Route path="/messages" element={<MessagePage />} />
                            <Route path="/notification" element={<NotificationTab />} />
                            <Route path="/bookmarks" element={<BookmarkTab id={id} pic={pic}/>} />
                            <Route path="/more" element={<SettingsTab id={id} pic={pic}/>} />
                        </Routes>
                        <Search />
                    </div>
                </div>

            ) : (
                <div>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Signup />} />
                    </Routes>
                </div>
            )
            }
        </div>
    );
}

export default App;
