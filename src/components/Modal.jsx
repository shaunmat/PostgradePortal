import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubble } from './ChatBubble'; // Make sure to import the ChatBubble component
import { Popover } from './Popover';
import { SendMessage } from './SendMessage';
import { db, auth } from '../backend/config'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Input, Button } from '@material-ui/core'
import "../../src/chat.css"
export const Modal = ({ isOpen, onClose, data, role }) => {
    if (!isOpen) return null;

    const defaultAvatar = "/path/to/default-avatar.png"; // Default avatar path
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState(""); // State for new message input
    const scrollRef = useRef(); // Reference for automatic scroll
    useEffect(() => {
        // Constructing the Firestore query
        const q = query(
            collection(db, 'messages'),
            orderBy('createdAt'),
            limit(50)
        );

        // Fetching messages and updating state with snapshots
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => doc.data())); // Ensure data from Firestore is fetched correctly
        });

        // Cleanup the listener when the component is unmounted
        return () => unsubscribe();
    }, []); // Run this effect only once when the component mounts

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg = {
                sender: role === 'Student' ? 'Lecturer' : 'Student',
                avatar: data?.ProfilePicture || defaultAvatar,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                content: newMessage,
                status: '',
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Background overlay */}
                    <motion.div className="fixed inset-0 bg-black bg-opacity-50 z-40" />

                    {/* Modal window */}
                    <motion.div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <img src={data?.ProfilePicture || defaultAvatar} alt="Profile" className="w-10 h-10 rounded-full mr-4" />
                                    <div>
                                        <h3 className="text-lg font-bold">{role === 'Student' ? data?.SupervisorName : data?.StudentName}</h3>
                                        <p className="text-sm">{role === 'Student' ? `ID: ${data?.SupervisorID}` : `ID: ${data?.StudentID}`}</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="text-gray-600 hover:text-gray-900">X</button>
                            </div>
                            <div className="msgs">
                                {messages.map((message) => (
                                    <div key={message.id} className={`msg ${message.uid === auth.currentUser.uid ? 'sent' : 'received'}`}>
                                        <img className="w-8 h-8 rounded-full" src={message.photoURL || defaultAvatar} alt="Avatar"  />
                                        <p>{message.text}</p>
                                    </div>
                                ))}
                            </div>
                            <SendMessage scroll={scroll} />
                            <div ref={scroll}></div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};


