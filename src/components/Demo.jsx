// index.js or App.js

import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import Foryou from './path-to/Foryou'; // Update the path accordingly

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id",
  measurementId: "your-measurement-id"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function Demo() {
  useEffect(() => {
    // You can use Firebase authentication state here
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in.
        console.log('User is signed in:', user);
      } else {
        // User is signed out.
        console.log('User is signed out');
      }
    });

    // Clean up the subscription on component unmount
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Foryou />
    </div>
  );
}

export default Demo;
