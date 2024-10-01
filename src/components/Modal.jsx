import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendMessage } from './SendMessage';
import { db, auth } from '../backend/config'
import { doc,collection, query, orderBy, limit, onSnapshot,where } from 'firebase/firestore';
import { Input, Button } from '@material-ui/core'
import "../../src/chat.css"
export const Modal = ({ chatId,isOpen, onClose, data, role }) => {
    if (!isOpen) return null;

    const defaultAvatar = "/path/to/default-avatar.png"; // Default avatar path
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef(); // Reference for automatic scroll


    useEffect(() => {
        if (chatId && isOpen) {
            const chatRef = doc(db, 'chats', chatId);
            
            // const unsubscribe = onSnapshot(chatRef, (docSnap) => {
            //     if (docSnap.exists()) {
            //         const chatData=docSnap.data();
            //         const messagesQuery=query(
            //             collection(chatRef,'messages'),
            //             orderBy('createdAt','asc')
            //         );
            //         const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
            //             const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            //             setMessages(msgs);
            //         });
            //         return () => unsubscribeMessages();
            //     }else{
            //         setMessages([]);
            //     }
            // });
            
            // return () => unsubscribe();
            const messagesQuery = query(
                collection(chatRef, 'messages'),
                orderBy('createdAt', 'asc')
            );
            const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
                const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setMessages(msgs);
                console.log("Fetched messages:", msgs);
            });
            return () => unsubscribeMessages();


        }
    }, [chatId, isOpen]);

    return (
        <AnimatePresence>
        {isOpen && (
            <>
                {/* Background overlay */}
                <motion.div key="overlay" className="fixed inset-0 bg-black bg-opacity-50 z-40" />
                
                {/* Modal window */}
                <motion.div
                    key="modal-window"
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 w-full max-w-4xl h-[90vh]">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <img src={data?.ProfilePicture || defaultAvatar} alt="Profile" className="w-10 h-10 rounded-full mr-4" />
                                <div>
                                    <h3 className="text-lg font-bold">{role === 'Student' ? data?.SupervisorName : data?.StudentName}</h3>
                                    <p className="text-sm">{role === 'Student' ? `ID: ${data?.SupervisorID}` : `ID: ${data?.StudentID}`}</p>
                                </div>
                            </div>
                            <Button onClick={onClose} className="text-gray-600 hover:text-gray-900">X</Button> {/* Use Material UI's Button */}
                        </div>

                        <div className="msgs overflow-y-auto h-5/6">
                            {messages.map((message, index) => (
                                <div
                                    key={message.id} // Use message ID for uniqueness
                                    className={`msg ${message.sender === auth.currentUser.uid ? 'sent' : 'received'}`}
                                >
                                    <img
                                        className="w-8 h-8 rounded-full"
                                        src={message.photoURL || defaultAvatar}
                                        alt="Avatar"
                                    />
                                    <p>{message.text}</p>
                                    <span className="message-time">{new Date(message.createdAt?.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            ))}
                        </div>

                        <SendMessage chatId={chatId} scroll={scrollRef}  />
                        <div ref={scrollRef}></div>
                    </div>
                </motion.div>
            </>
        )}
    </AnimatePresence>
    );
};


