import React from "react";
import yourImage from '../images/old-twitter-logo.png';


function Home() {
    return (
        <div className="jumbotron centered">
        <div className="container">
          <img src={yourImage} alt="Twitter" id="tlogo"/>
          <h1 className="display-3">Twitter</h1>
          <p className="lead">Embrace the tweet life, one character at a time!</p>
          <hr />
          {/* <a className="btn btn-light btn-lg" href="/register" role="button">SignIn</a> */}
          <a className="btn btn-dark btn-lg" href="/login" role="button">SignIn</a>
      
        </div>
      </div>
    )
}
export default Home;