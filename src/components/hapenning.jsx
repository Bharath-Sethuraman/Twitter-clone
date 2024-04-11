import React from 'react';

function Happenning(props) {
    
    return(
            <div className="newsfeed">
                <p>{props.info}<i className="fas fa-ellipsis-h"></i></p>
                <h4>{props.desc}</h4>
            </div>
    );    
}

export default Happenning;