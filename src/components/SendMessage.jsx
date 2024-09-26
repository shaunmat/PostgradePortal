import React ,{useState,useEffect}from 'react'
import { db, auth } from '../backend/config'
import firebase from '../backend/config'
import { Input, Button } from '@material-ui/core'
import { collection, query, orderBy, limit, onSnapshot,addDoc,serverTimestamp,updateDoc} from 'firebase/firestore';
import "../chat.css"

export const SendMessage = ({scrollRef}) => {
    const [msg, setMsg] = useState('')

    async function sendMessage(chatId,message,e) {
        const chatRef=doc(db,'chats',chatId);
        e.preventDefault()
        const { uid, photoURL } = auth.currentUser

        if (msg.trim() === "") return;

        // await addDoc(collection(db, 'messages'), {
        //     text: msg,
        //     photoURL,
        //     uid,
        //     createdAt: serverTimestamp()
        // });
        await updateDoc(chatRef, {
            messages: arrayUnion({
                sender: CurrentUser.uid,
                content: message,
                timestamp: serverTimestamp(),
            })
        });
        setMsg('');
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
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
                        marginLeft:'10px',
                        maxWidth: '200px'}} 
                        type="submit">Send</Button>
                </div>
            </form>
        </div>
    )
  }
