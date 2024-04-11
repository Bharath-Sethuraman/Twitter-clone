import React from "react";
import profilePic from "../images/profile.png";

function NotificationTab() {
    const notifications = [
        { id: 1, message: "New follower: 13A-Bharath" },
        { id: 2, message: "You have a new message" },
        { id: 3, message: "Your tweet was retweeted" },
        { id: 4, message: "Someone mentioned you in a tweet" },
    ];

    return (
        <div className="notification-tab contentntweets">
            <h2>Notifications</h2>
            <ul>
                {notifications.map((notification) => (
                    <li key={notification.id}>
                        {/* <img src={(id.pic)?id.pic:profileimg} alt="profile" className='pro-img' /> */}
                        <img src={profilePic} alt="profile" className="pro-img" />
                        {notification.message}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NotificationTab;
