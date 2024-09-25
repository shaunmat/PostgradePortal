import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SendMessage } from './SendMessage';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../backend/config';
import '../../src/chat.css';

export const Modal = ({ isOpen, onClose, data, role }) => {
    if (!isOpen) return null;

    const defaultAvatar = "/path/to/default-avatar.png";
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();

    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('createdAt'), limit(50));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setMessages(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        });

        return () => unsubscribe();
    }, []);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
                    <motion.div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
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
                                        <img src={message.photoURL || defaultAvatar} alt="Avatar" />
                                        <p>{message.text}</p>
                                    </div>
                                ))}
                            </div>

                            <SendMessage scroll={scrollRef} />
                            <div ref={scrollRef}></div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
