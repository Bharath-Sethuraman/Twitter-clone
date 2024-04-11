import React, { useState } from 'react';
import { Link,useParams } from 'react-router-dom';
function Sample(props) {
    const ll = props.id ?props.id.replace(/\s/g,''): "";
    return (
        <div>
            <li className="nav-item circle-icon"><a href="/home" className="nav-link"><i className={"fas fa-home"} />Home</a></li>
            <li className="nav-item circle-icon"> <a className="nav-link" href="/explore"> <i className={"fas fa-map-marker"} />Explore</a> </li>
            <li className="nav-item circle-icon"> <a className="nav-link" href="/notification" ><i className={"fas fa-bell"} />Notification</a></li>
            {/* <li className="nav-item circle-icon"> <a className="nav-link" href="/messages" ><i className={"fas fa-envelope"} />Messages</a></li> */}
            <li className="nav-item circle-icon"> <a className="nav-link" href="/bookmarks" ><i className={"fas fa-book"} />Bookmarks</a></li>
            {/* <li className="nav-item circle-icon"><Link to={`/profile/${ll}`} className="nav-link"><i className={"fas fa-male"} />Profile</Link></li> */}
            <li className="nav-item circle-icon"><a className="nav-link" href="/profile"><i className={"fas fa-male"} />Profile</a></li>
            <li className="nav-item circle-icon"> <a className="nav-link" href="/more"><i className={"fas fa-ellipsis-h"} ></i>More</a></li>
        </div>
    );
}

export default Sample;