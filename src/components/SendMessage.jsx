import React, { useState, useEffect } from 'react'
import { db, auth } from '../backend/config'
import firebase from '../backend/config'
import { Input, Button } from '@material-ui/core'
//import { collection, query, orderBy, limit, onSnapshot,addDoc,serverTimestamp,updateDoc} from 'firebase/firestore';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import "../chat.css"

export const SendMessage = ({ chatId,scrollRef }) => {
    const [msg, setMsg] = useState('')
    

    async function sendMessage(e) {
        e.preventDefault();

        if (!chatId) {
            console.error("chatId is missing");
            return;
        }
        if (!auth.currentUser) {
            console.error("No authenticated user found.");
            return;
        }
        const { uid, photoURL } = auth.currentUser

        if (msg.trim() === "") return;
        try {
            const messagesRef = collection(db, 'chats', chatId, 'messages');
            await addDoc(messagesRef, {
                text: msg,
                sender: uid,
                photoURL:photoURL||'',
                uid,
                createdAt: serverTimestamp()
            }); 
            setMsg('');
            if (scrollRef.current) {
                scrollRef.current.scrollIntoView({ behavior: 'smooth' });
            }
            console.log("Message to be sent:", msg);
            console.log("Message added successfully");
        } catch (error) {
            console.error("Error sending message:", error);
            alert('Message failed to send. Try again.');
        }
        console.log("Message to be sent:", msg);
        // await addDoc(...);
        console.log("Message added successfully");

        // await addDoc(collection(db, 'messages'), {
        //     text: msg,
        //     photoURL,
        //     uid,
        //     createdAt: serverTimestamp()
        // });
        // await updateDoc(chatRef, {
        //     messages: arrayUnion({
        //         sender: CurrentUser.uid,
        //         content: message,
        //         timestamp: serverTimestamp(),
        //     })
        // });
        // setMsg('');
        // scrollRef.current.scrollIntoView({ behavior: 'smooth' });
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
