import React from 'react';
import Content from './content';
import Profile from './Profile';

function Displaycontent({ currentContent }) {
  return (
    <div className='contentntweets'>
      {currentContent === 'home' ? (
        <Content />
      ) : currentContent === 'profile' ? (
        <Profile />
      ) : null}
    </div>
  );
}

export default Displaycontent;
