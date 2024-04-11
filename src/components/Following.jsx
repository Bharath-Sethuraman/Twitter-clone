import React from "react";
import profilePic from "../images/profile.png"
import firstImg from "../images/Twitter-X-Logo.jpg"
function Following(props) {
    //console.log(details.info[0]);
    return (
        <div className="tweets">
            <div className="profile-index">
                <img src={profilePic} alt="profile" className='proimg' />
                <div className="tw">
                    <h3>{props.name}</h3><p>@{props.name}</p>
                    <i className="fas fa-ellipsis-h"></i>
                </div>
            </div>
            <p>{props.desc}</p>
            <img src={firstImg} alt="Posts" />
            <div className="reaction">
                <i className="fas fa-comment"></i>
                <i className="fas fa-retweet"></i>
                <i className="fas fa-heart"></i>
                <i className="fas fa-poll"></i>
                <i className="fas fa-save"></i>
                <i className="fas fa-download"></i>
            </div>
            <hr />
        </div>
    )
}
export default Following;