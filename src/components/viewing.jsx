import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../backend/config'; // Ensure correct imports

export const SendMessage = ({ chatId, scroll }) => {
    const [message, setMessage] = useState('');

    const sendMessage = async (e) => {
        e.preventDefault();
        if (message.trim() === '') return;

        try {
            const chatRef = collection(db, 'chats', chatId, 'messages');
            await addDoc(chatRef, {
                text: message,
                sender: auth.currentUser.uid,
                createdAt: serverTimestamp(),
                photoURL: auth.currentUser.photoURL || '/path/to/default-avatar.png'
            });
            setMessage('');
            scroll.current.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error sending message: ', error);
            alert('Message failed to send. Try again.');
        }
    };

    return (
        <form onSubmit={sendMessage}>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
            />
            <button type="submit">Send</button>
        </form>
    );
};
