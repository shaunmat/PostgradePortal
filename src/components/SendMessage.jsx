import React ,{useState,useEffect}from 'react'
import { db, auth } from '../backend/config'
import firebase from '../backend/config'
import { Input, Button } from '@material-ui/core'
import { collection, query, orderBy, limit, onSnapshot,addDoc,serverTimestamp} from 'firebase/firestore';
import "../chat.css"

export const SendMessage = ({scroll}) => {
    const [msg, setMsg] = useState('')

    async function sendMessage(e) {
        e.preventDefault()
        const { uid, photoURL } = auth.currentUser

        await addDoc(collection(db, 'messages'), {
            text: msg,
            photoURL,
            uid,
            createdAt: serverTimestamp()
        });
        setMsg('');
        scroll.current.scrollIntoView({ behavior: 'smooth' });
    }
    return (
        <div>
            <form onSubmit={sendMessage}>
                <div className="sendMsg">
                    <Input style={{ width: '78%', fontSize: '15px', fontWeight: '550', marginLeft: '5px', marginBottom: '-3px' }} placeholder='Message...' type="text" value={msg} onChange={e => setMsg(e.target.value)} />
                    <Button style={{ width: '18%', fontSize: '15px', fontWeight: '550', margin: '4px 5% -13px 5%', maxWidth: '200px'}} type="submit">Send</Button>
                </div>
            </form>
        </div>
    )
  }
