import React,{useState,useEffect }from 'react'
import {db,auth} from '../backend/config'
import { SendMessage } from './SendMessage';

export const ChatBubble = ({ message, isSent }) => {
    const [messages, setMessages] = useState([])
    useEffect(() => {
        db.collection('messages').orderBy('createdAt').limit(50).onSnapshot(snapshot => {
            setMessages(snapshot.docs.map(doc => doc.data()))
        })
    }, [])
    return (
        <div>
        <div className="msgs">
            {messages.map(({ id, text, photoURL, uid }) => (
                <div>
                    <div key={id} className={`msg ${uid === auth.currentUser.uid ? 'sent' : 'received'}`}>
                        <img src={photoURL} alt="User" className="w-8 h-8 rounded-full" />
                        <p>{text}</p>
                    </div>
                </div>
            ))}
        </div>
        <SendMessage scroll={scroll} />
        <div ref={scroll}></div>
    </div>
        // <div className={`flex items-start gap-2.5 ${isSent ? 'justify-end' : ''}`}>
        //     {!isSent && <img className="w-8 h-8 rounded-full" src={message.avatar} alt="User image" />}
        //     <div className={`flex flex-col w-full max-w-[320px] p-4 border bg-gray-100 dark:bg-gray-700 rounded-xl ${isSent ? 'rounded-br-none' : 'rounded-bl-none'}`}>
        //         <div className="flex items-center space-x-2 rtl:space-x-reverse">
        //             <span className="text-sm font-semibold text-gray-900 dark:text-white">{message.sender}</span>
        //             <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{message.time}</span>
        //         </div>
        //         <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{message.content}</p>
        //         {message.status && <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{message.status}</span>}
        //     </div>
        //     {isSent && <img className="w-8 h-8 rounded-full" src={message.avatar} alt="User image" />}
        // </div>
    );
};
