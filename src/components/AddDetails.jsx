import React, { useState, useEffect } from "react";
import axios from "axios";
import coverImg from "../images/Twitter-X-Logo.jpg";
import profilePic from "../images/profile.png";
function AddDetails({ getVal,userId}) {
    const [user, setUser] = useState({});
    const [username , setUsername]= useState("");
    const [loc , setLocation] = useState("");
    const [dateOfBirth , setDOB ]= useState("");
    const [bio , setBio ]= useState("");

    const [opened, setopened] = useState(getVal);
    useEffect(() => {
        // Fetch user data based on userId from the backend
        const fetchUserData = async () => {
            try {
                const response = await fetch('http://localhost:5000/adddetails', {
                    credentials: 'include',
                });
                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        console.log(user);
    }, [user]);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };
    const addDetails = async (userId,username, location, dob, bio) => {
        try {
            // const userId = req.body.userId;
            // const location = req.body.location;
            // const dob = req.body.dob;
            // const formData = new FormData();
            // formData.append('userId', userId);
            // formData.append('location', location);
            // formData.append('dob', dob);
            //const response = await fetch('http://localhost:5000/updatePersonalInfo');
            const response = await fetch('http://localhost:5000/updatePersonalInfo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ "userId": userId, "location": location, "dob": dob ,"username":username , "bio":bio}),
            });
            if(response.ok){
                const userLike = await response.json();
                console.log(userLike);
            }
        } catch (error) {
            console.error('Error:', error);
        }

    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            addDetails(userId,username, loc, dateOfBirth, bio);
            alert('Profile updated successfully!'+ username +" "+ loc+""+dateOfBirth);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        }
    };
    function handleClick() {
        setopened(false);
    }
    return (
        <div>
            {
                opened ? (
                    <div className="overlay" >
                        <div className="modal-container">
                            <h2>Edit Profile</h2>
                            <form className="detailscontents" onSubmit={handleSubmit}>
                                <img src={coverImg} alt="proimg" className="picsedit" />
                                <img src={profilePic} alt="propic" className="picpro" />
                                <label htmlFor="username">Username:</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder={user.username}
                                    onChange={(e)=>{setUsername(e.target.value)}}
                                />

                                <label htmlFor="bio">Bio:</label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    placeholder={user.bio}
                                    onChange={(e)=>{setBio(e.target.value)}}
                                />

                                <label htmlFor="location">Location:</label>
                                <input
                                    id="location"
                                    name="location"
                                    placeholder={user.location}
                                    onChange={(e)=>{setLocation(e.target.value)}}
                                />
                                <label htmlFor="birthdate">Birth date:</label>
                                <input
                                    id="date"
                                    name="date"
                                    type="date"
                                    onChange={(e)=>{setDOB(e.target.value)}}
                                />

                                <button type="submit">Update Profile</button>
                            </form>
                            <button onClick={handleClick}>Close</button>
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}

export default AddDetails;