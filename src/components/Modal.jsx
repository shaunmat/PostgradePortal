import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubble } from './ChatBubble'; // Make sure to import the ChatBubble component
import { Popover } from './Popover';

export const Modal = ({ isOpen, onClose, lecturer, student }) => {
    if (!isOpen) return null;

    const [messages, setMessages] = useState([
        // Sample messages. These should be adjusted based on your actual use case.
        {
            sender: 'Lecturer',
            avatar: lecturer ? lecturer.avatar : student.avatar,
            time: '10:30 AM',
            content: 'Hello, how can I help you today?',
            status: 'Delivered'
        },
        {
            sender: 'Student',
            avatar: lecturer ? lecturer.avatar : student.avatar,
            time: '10:31 AM',
            content: 'I have a question about the recent assignment.',
            status: ''
        }
        // Add more sample messages here
    ]);

    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            const newMsg = {
                sender:  lecturer  ? 'Lecturer' : 'Student',
                avatar: lecturer ? lecturer.avatar : student.avatar,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                content: newMessage,
                status: ''
            };
            setMessages([...messages, newMsg]);
            setNewMessage('');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="relative w-full max-w-2xl max-h-full">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                    <div className="flex items-center">
                                        {lecturer && (
                                            <Popover content={lecturer}>
                                                <img
                                                    src={lecturer.avatar}
                                                    alt={lecturer.name}
                                                    className="w-8 h-8 rounded-full mr-4"
                                                />
                                            </Popover>
                                        )}
                                        {!lecturer && student && (
                                            <img
                                                src={student.avatar}
                                                alt={student.name}
                                                className="w-8 h-8 rounded-full mr-4"
                                            />
                                        )}
                                        <div>
                                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                                {lecturer ? lecturer.name : student.name}
                                            </h3>
                                            {lecturer && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {lecturer.module}
                                                </p>
                                            )}
                                            {student && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {student.email}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <button type="button" onClick={onClose} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className="p-4 md:p-5 space-y-4 max-h-96 overflow-y-auto">
                                    {messages.map((message, index) => (
                                        <ChatBubble key={index} message={message} isSent={message.sender === 'Student'} />
                                    ))}
                                </div>
                                <div className="flex items-center p-4 md:p-5 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-grow p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                        placeholder="Type a message"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') handleSendMessage();
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSendMessage}
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                    >
                                        Send
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
