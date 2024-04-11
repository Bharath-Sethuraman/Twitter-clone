import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [receiverId, setReceiverId] = useState(''); // Add state to store receiver's ID

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            // Fetch messages between the authenticated user (sender) and the selected receiver
            const response = await axios.get(`http://localhost:5000/messages/${receiverId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleMessageChange = (event) => {
        setMessage(event.target.value);
    };

    const handleMessageSend = async () => {
        if (message.trim() !== '') {
            try {
                // Send message to the server with sender's and receiver's IDs
                await axios.post('http://localhost:5000/send', {
                    sender: 'senderUserID', // Replace 'senderUserID' with the actual sender's user ID
                    receiver: receiverId,
                    text: message
                });
                setMessage('');
                fetchMessages(); // Fetch messages again after sending a new one
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    return (
        <div className='contentntweets'>
            <div className="container2">
                <h1>Simple Messaging App</h1>
                <div className="messages">
                    {messages.map((msg, index) => (
                        <div key={index} className="message">
                            <p>{msg.text}</p>
                            <small>{msg.timestamp}</small>
                        </div>
                    ))}
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={message}
                        onChange={handleMessageChange}
                    />
                    <button onClick={handleMessageSend}>Send</button>
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Receiver's user ID"
                        value={receiverId}
                        onChange={(event) => setReceiverId(event.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

export default App;
