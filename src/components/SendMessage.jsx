import React, { useState, useEffect } from 'react'
import { db, auth } from '../backend/config'
import firebase from '../backend/config'
import { Input, Button } from '@material-ui/core'
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import "../chat.css"

export const SendMessage = ({ chatId,scrollRef }) => {
    const [msg, setMsg] = useState('')
    

    async function sendMessage(e) {
        e.preventDefault();
        console.log("sendMessage invoked");

        if (!chatId) {
            console.error("chatId is missing");
            alert("Cannot send message: Chat session is not identified.");
            return;
        }
        console.log("chatId is present:", chatId);
        if (!auth.currentUser) {
            console.error("No authenticated user found.");
            alert("You must be logged in to send messages.");
            return;
        }
        const { uid, photoURL } = auth.currentUser
        console.log("Current user:", uid, photoURL);

        if (msg.trim() === "") return;
        try {
            console.log("Attempting to send message:", msg);
            const messagesRef = collection(db, 'chats', chatId, 'messages');
            await addDoc(messagesRef, {
                text: msg,
                sender: uid,
                photoURL:photoURL||'',
                uid,
                createdAt: serverTimestamp()
            }); 
            console.log("Message added to Firestore");
            console.log("Clearing input field");
            setMsg('');
            console.log("Input field cleared");
            if (scrollRef && scrollRef.current) {
                scrollRef.current.scrollIntoView({ behavior: 'smooth' });
            }else {
                console.warn("scrollRef is not defined");
            }

            console.log("Message to be sent:", msg);
            console.log("Message added successfully");
        } catch (error) {
            console.error("Error sending message:", error);
            alert('Message failed to send. Try again.');
        }
        console.log("Message to be sent:", msg);
        console.log("Message added successfully");
    }
    console.log("Fetched messages:", msg);
    
    return (
        <div>
            <form onSubmit={sendMessage}>
                <div className="sendMsg">
                    <Input style={{
                        width: '80%',
                        fontSize: '15px',
                        fontWeight: '550',
                        marginLeft: '5px',
                    }}
                        placeholder='Message...'
                        type="text"
                        value={msg}
                        onChange={e => setMsg(e.target.value)} />
                    <Button style={{
                        width: '20%',
                        fontSize: '15px',
                        fontWeight: '550',
                        marginLeft: '10px',
                        maxWidth: '200px'
                    }}
                        type="submit"
                        disabled={msg.trim() === ""} // Disable button if input is empty
                        >Send</Button>
                </div>
            </form>
        </div>
    )
}
