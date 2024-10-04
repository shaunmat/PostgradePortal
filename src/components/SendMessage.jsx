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
            <div className="flex items-center p-4 md:p-5 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
                    <input
                        type="text"
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        className="flex-grow p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        placeholder="Type a message"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') sendMessage(e);
                        }}
                    />
                    <button
                        type="submit"
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        disabled={msg.trim() === ""}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    )
}


