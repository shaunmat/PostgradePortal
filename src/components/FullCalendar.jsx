import { useState,useEffect,useContext,createContext } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid' ;// a plugin!
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction" ;// needed for dayClick
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Swal from 'sweetalert2';
import {useAuth} from '../backend/AuthContext'
import { getDocs, query, collection, where, addDoc,setDoc,doc } from 'firebase/firestore'; // Import Firestore functions
import { db, auth } from '../backend/config';
import { onAuthStateChanged } from 'firebase/auth';

export const Calendar = () => {
    const { CurrentUser } = useAuth();
    //const {CurrentUser}="Supervisor"
    const [SupervisorID, setSupervisorID] = useState(null);
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', color: '' });
    const [moduleTitles, setModuleTitles] = useState([]);
    const [role,setRole]=useState(null);
      useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async(user) => {
          if (user) {
        const userId=user.email.substring(0,9);
            setSupervisorID(userId);
            const userDoc=await getDocs(query(collection(db,'Supervisor'),where('SupervisorID','==',Math.floor(userId))));
            if(!userDoc.empty){
              setRole('Supervisor');
            }else{
              const studentDc=await getDocs(query(collection(db,'Student'),where('StudentID','==',userId)));
              if(!studentDc.empty){
                setRole('Student');
              }
            }
            console.log(user.email.substring(0,9),"This the id at this present momment");
          } else {
            setSupervisorID(null);
            setRole(null);
          }
        });
        return () => unsubscribe();
      }, []);
      useEffect(() => {
        const fetchModules = async () => {
          try {
            let q;
            q=collection(db, 'Module');
            q = query(q, where('SupervisorID', '==', Math.floor(SupervisorID)));
            const querySnapshot = await getDocs(q);
            const modulesArray = [];
            querySnapshot.forEach((doc) => {
              modulesArray.push(doc.data().ModuleTitle);
            });
            setModuleTitles(modulesArray);
          } catch (error) {
            console.error("Error fetching modules:", error);
          }
        };
        fetchModules();
        // console.log(SupervisorID+"this is the id afterr");
      }, [SupervisorID]);
      const handleDateClick = (arg) => {
        setNewEvent({ ...newEvent, start: arg.dateStr, end: arg.dateStr });
      };
      const fetcheventsArray=[];
      useEffect(()=>{
        const fetchEvents=async()=>{
          if(!SupervisorID || !role)return;
          try{
            let q;
            if(role=='Supervisor'){
              q=collection(db,'Events');
              q=query(q,where)
            }
          }
          catch(error){
            console.error("Error fetching details",error)
          }
        }
      })

      const showEventPopup = async () => {
        const moduleOptions = moduleTitles.map((title) => `<option value="${title}">${title}</option>`).join('');
        const { value: formValues } = await Swal.fire({
          title: 'Add Event',
          html: `
            <input id="swal-input1" class="swal2-input" placeholder="Event Title">
            <input id="swal-input2" class="swal2-input" type="date" value="${newEvent.start}">
            <input id="swal-input3" class="swal2-input" type="date" value="${newEvent.end}">
            <select id="swal-input4" class="swal2-input">
              <option value="" disabled selected>Select a color</option>
              <option value="#378006" style="background-color: #378006; color: #378006;">● Green</option>
              <option value="#ff9f89" style="background-color: #ff9f89; color: #ff9f89;">● Pink</option>
              <option value="#1e90ff" style="background-color: #1e90ff; color: #1e90ff;">● Blue</option>
              <option value="#ff6347" style="background-color: #806CA5; color: #806CA5;">● Purple</option>
              <option value="#ffa500" style="background-color: #ffa500; color: #ffa500;">● Orange</option>
            </select>
            <select id="swal-input5" class="swal2-input">
              <option value="" disabled selected>Select a module</option>
              ${moduleOptions}
            </select>
          `,
          focusConfirm: false,
          confirmButtonColor: '#343a40',
          preConfirm: () => {

              // const title=document.getElementById('swak-input').value
              // const start = document.getElementById('swal-input2').value;
              // const end = document.getElementById('swal-input3').value;
              // const color = document.getElementById('swal-input4').value;
              // const module = document.getElementById('swal-input5').value;
      
            return [
              document.getElementById('swal-input1').value,
              document.getElementById('swal-input2').value,
              document.getElementById('swal-input3').value,
              document.getElementById('swal-input4').value,
              document.getElementById('swal-input5').value,
            ];
          }
        });
    
        if (formValues) {
          const [title, start, end, color, module] = formValues;
          const userId=CurrentUser.email.substring(0,9);
          const newEvent = { title, start, end, module, backgroundColor: color, borderColor: color,userId:userId};
          try{
            //await addDoc(collection(db,'Events'),newEvent);
            await setDoc(doc(db,'Events',SupervisorID),newEvent);
            setEvents([...events,newEvent]);
            Swal.fire('Event Added',JSON.stringify(formValues));
          }
          catch(error){
            console.error("Error adding event:",error);
            Swal.fire('Error','Failed to add event.Please try again','error')
          }
    
        }
      };
      const userType = CurrentUser?.email.startsWith('7') ? 'Supervisor' : '';

    return (
      <div>
      {userType === 'Supervisor' && (
        <button className="btn btn-primary" onClick={showEventPopup}>Add Event</button>
      )}
        <FullCalendar
        plugins={[ dayGridPlugin, interactionPlugin,timeGridPlugin]}
            initialView={"dayGridMonth"}
            weekends={false}
            headerToolbar={{
              start:'today prev,next',
              center:'title',
              end:'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            height={"90vh"}
            dateClick={handleDateClick}
            events={events}
        />
        </div>
    )
}

