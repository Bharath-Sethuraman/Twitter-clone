import React from "react";

function Top({ onForYouClick, onFollowingClick ,activeButton}) {
    const myStyle = {
        position: "absolute",
        bottom: 0,
        backgroundColor: "skyblue",
        height: "1vh",
        width: "100%",
        display:'flex',
        right:'0vw',
        borderRadius:'50px'
    }
    return (
        <div className="top">
            <button onClick={()=>onForYouClick("button1")}><span style={activeButton === "button1" ? myStyle : {}}></span>For You</button>
            <button onClick={()=>onFollowingClick("button2")}><span style={activeButton === "button2" ? myStyle : {}}></span>Following</button>
            <i className="fas fa-cogs"></i>
        </div>
    );
}

export default Top;