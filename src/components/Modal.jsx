import { useState, useEffect, useRef} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatBubble } from './ChatBubble'; // Make sure to import the ChatBubble component
import { Popover } from './Popover';
import { SendMessage } from './SendMessage';
import {db,auth} from '../backend/config'

export const Modal = ({ isOpen, onClose, data, role }) => {
    if (!isOpen) return null;

    const defaultAvatar = "/path/to/default-avatar.png"; // Default avatar path
    const [messages, setMessages] = useState([
        // {
        //     sender: role === 'Student' ? 'Lecturer' : 'Student',
        //     avatar: data?.ProfilePicture || defaultAvatar,
        //     time: '10:30 AM',
        //     content: 'Hello, how can I help you today?',
        //     status: 'Delivered',
        // },
        // {
        //     sender: role === 'Student' ? 'Student' : 'Lecturer',
        //     avatar: data?.ProfilePicture || defaultAvatar,
        //     time: '10:31 AM',
        //     content: 'I have a question about the recent assignment.',
        //     status: '',
        // }
    ]);

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

                            {/* Chat content */}
                            <div className="space-y-4">
                                {messages.map((message, index) => (
                                    <ChatBubble key={index} message={message} isSent={message.sender === 'Student'} />
                                ))}
                            </div>

                            {/* Input field */}
                            {/* <div className="flex mt-4">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="flex-grow border rounded-lg p-2 mr-2"
                                    placeholder="Type a message"
                                />
                                <button onClick={handleSendMessage} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Send</button>
                            </div> */}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};


// export const Modal = ({ isOpen, onClose, lecturer, student }) => {
//     if (!isOpen) return null;

//     const defaultAvatar = "/path/to/default-avatar.png"; // Provide a path to a default avatar image

//     const [messages, setMessages] = useState([
//         {
//             sender: lecturer ? 'Lecturer' : 'Student',
//             avatar: lecturer?.ProfilePicture || defaultAvatar, // Use default avatar if ProfilePicture is undefined
//             time: '10:30 AM',
//             content: 'Hello, how can I help you today?',
//             status: 'Delivered',
//         },
//         {
//             sender: lecturer ? 'Student' : 'Lecturer',
//             avatar: student?.ProfilePicture || defaultAvatar, // Use default avatar if ProfilePicture is undefined
//             time: '10:31 AM',
//             content: 'I have a question about the recent assignment.',
//             status: '',
//         }
//     ]);

//     const [newMessage, setNewMessage] = useState('');

//     const handleSendMessage = () => {
//         if (newMessage.trim()) {
//             const newMsg = {
//                 sender: lecturer ? 'Lecturer' : 'Student',
//                 avatar: lecturer?.ProfilePicture || student?.ProfilePicture || defaultAvatar,
//                 time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//                 content: newMessage,
//                 status: '',
//             };
//             setMessages([...messages, newMsg]);
//             setNewMessage('');
//         }
//     };

//     return (
//         <AnimatePresence>
//             {isOpen && (
//                 <>
//                     <motion.div
//                         className="fixed inset-0 bg-black bg-opacity-50 z-40"
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         exit={{ opacity: 0 }}
//                         transition={{ duration: 0.3 }}
//                     />
//                     <motion.div
//                         className="fixed inset-0 z-50 flex items-center justify-center w-full p-4 overflow-x-hidden overflow-y-auto"
//                         initial={{ opacity: 0, scale: 0.8 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         exit={{ opacity: 0, scale: 0.8 }}
//                         transition={{ duration: 0.3 }}
//                     >
//                         <div className="relative w-full max-w-4xl max-h-full">
//                             <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
//                                 <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
//                                     <div className="flex items-center">
//                                         {lecturer && (
//                                             <Popover content={lecturer}>
//                                                 <img
//                                                     src={lecturer?.ProfilePicture || defaultAvatar}
//                                                     alt={lecturer?.SupervisorName || "Lecturer"}
//                                                     className="w-10 h-10 rounded-full mr-4"
//                                                 />
//                                             </Popover>
//                                         )}
//                                         {!lecturer && student && (
//                                             <img
//                                                 src={student?.ProfilePicture || defaultAvatar}
//                                                 alt={student?.StudentName || "Student"}
//                                                 className="w-10 h-10 rounded-full mr-4"
//                                             />
//                                         )}
//                                         <div>
//                                             <h3 className="text-xl font-medium text-gray-900 dark:text-white">
//                                                 {lecturer ? lecturer.SupervisorName : student.StudentName}
//                                             </h3>
//                                             {lecturer && (
//                                                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                                                     {lecturer.Title} | ID: {lecturer.SupervisorID}
//                                                 </p>
//                                             )}
//                                             {student && (
//                                                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                                                     {student.StudentID} | {student.StudentType}
//                                                 </p>
//                                             )}
//                                         </div>
//                                     </div>
//                                     <button
//                                         type="button"
//                                         onClick={onClose}
//                                         className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
//                                     >
//                                         <svg
//                                             className="w-3 h-3"
//                                             aria-hidden="true"
//                                             xmlns="http://www.w3.org/2000/svg"
//                                             fill="none"
//                                             viewBox="0 0 14 14"
//                                         >
//                                             <path
//                                                 stroke="currentColor"
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth="2"
//                                                 d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
//                                             />
//                                         </svg>
//                                         <span className="sr-only">Close modal</span>
//                                     </button>
//                                 </div>
//                                 <div className="p-4 md:p-5 space-y-4 max-h-96 overflow-y-auto">
//                                     {messages.map((message, index) => (
//                                         <ChatBubble key={index} message={message} isSent={message.sender === 'Student'} />
//                                     ))}
//                                 </div>
//                                 <div className="flex items-center p-4 md:p-5 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
//                                     <input
//                                         type="text"
//                                         value={newMessage}
//                                         onChange={(e) => setNewMessage(e.target.value)}
//                                         className="flex-grow p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white"
//                                         placeholder="Type a message"
//                                         onKeyPress={(e) => {
//                                             if (e.key === 'Enter') handleSendMessage();
//                                         }}
//                                     />
//                                     <button
//                                         type="button"
//                                         onClick={handleSendMessage}
//                                         className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//                                     >
//                                         Send
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     </motion.div>
//                 </>
//             )}
//         </AnimatePresence>
//     );
// };
