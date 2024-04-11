import React from "react";

function SettingsTab() {
    const handleLogout = () => {
        // Implement logout functionality here
        console.log("Logged out");
    };

    const handleSwitchAccount = () => {
        // Implement switching account functionality here
        console.log("Switched account");
    };

    return (
        <div className="settings-tab contentntweets">
            <h2>Settings</h2>
            <ul>
                <li>
                    <button onClick={handleLogout}>Logout</button>
                </li>
                <li>
                    <button onClick={handleSwitchAccount}>Another Account</button>
                </li>
            </ul>
        </div>
    );
}

export default SettingsTab;
