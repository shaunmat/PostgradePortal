import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Swal from 'sweetalert2';
import { useAuth } from '../backend/AuthContext';
import { getDocs, query, collection, where, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { db, auth } from '../backend/config';

export const Calendar = () => {
    const { CurrentUser } = useAuth();
    const [SupervisorID, setSupervisorID] = useState(null);
    const [events, setEvents] = useState([]);
    const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', color: '' });
    const [moduleTitles, setModuleTitles] = useState([]);
    const [role, setRole] = useState(null);

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
          if (user) {
              const userId = user.email.substring(0, 9);
              const userDoc = await getDocs(query(collection(db, 'Supervisor'), where('SupervisorID', '==', Math.floor(userId))));
              
              let currentRole = null;
              if (!userDoc.empty) {
                  currentRole = 'Supervisor';
              } else {
                  const studentDoc = await getDocs(query(collection(db, 'Student'), where('StudentID', '==', userId)));
                  if (!studentDoc.empty) {
                      currentRole = 'Student';
                  }
              }
              setRole(currentRole);
  
              if (currentRole) {
                  fetchEvents(userId, currentRole); // Fetch events after determining the role
              }
          } else {
              setSupervisorID(null);
              setRole(null);
              setEvents([]); // Clear events on logout
          }
      });
      return () => unsubscribe();
  }, []);

    const fetchModules = async () => {
        try {
            let q = query(collection(db, 'Module'), where('SupervisorID', '==', Math.floor(SupervisorID)));
            const querySnapshot = await getDocs(q);
            const modulesArray = querySnapshot.docs.map(doc => doc.data().ModuleTitle);
            setModuleTitles(modulesArray);
        } catch (error) {
            console.error("Error fetching modules:", error);
        }
    };

    useEffect(() => {
        if (SupervisorID) {
            fetchModules();
        }
    }, [SupervisorID]);

    const fetchEvents = async (userId, userRole) => {
      try {
          if (!userRole || !userId) return; // Ensure both are defined
  
          let q;
          if (userRole === 'Supervisor') {
              q = query(collection(db, 'Events'), where('SupervisorID', '==', userId));
          } else if (userRole === 'Student') {
              q = query(collection(db, 'Events'), where('StudentID', '==', userId));
          }
  
          if (q) {
              const querySnapshot = await getDocs(q);
              const fetchedEvents = querySnapshot.docs.map(doc => {
                  const event = doc.data();
                  const eventEndDate = new Date(event.end);
                  return eventEndDate >= new Date() ? event : null;
              }).filter(event => event !== null);
              
              setEvents(fetchedEvents);
          }
      } catch (error) {
          console.error("Error fetching events:", error);
      }
      console.log("UserId:", userId, "Role:", userRole);
  };
 

  useEffect(() => {
    if (SupervisorID) {
        fetchModules();
    }
}, [SupervisorID]);

    const handleDateClick = (arg) => {
        setNewEvent({ ...newEvent, start: arg.dateStr, end: arg.dateStr });
    };

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
            const today = new Date().setHours(0, 0, 0);
            const startDate = new Date(start).setHours(0, 0, 0, 0);
            if (startDate < today) {
                Swal.fire('The start date cannot be in the past', 'error');
                return;
            }

            const newEvent = { title, start, end, module, backgroundColor: color, borderColor: color, SupervisorID };
            try {
                const eventDocRef = doc(db, 'Events', SupervisorID);
                await updateDoc(eventDocRef, {
                    events: arrayUnion(newEvent)
                });
                setEvents((prevEvents) => [...prevEvents, newEvent]);
                Swal.fire('Event Added', JSON.stringify(formValues));
            } catch (error) {
                console.error("Error adding event:", error);
                Swal.fire('Error', 'Failed to add event. Please try again', 'error');
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
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                initialView={"dayGridMonth"}
                weekends={false}
                headerToolbar={{
                    start: 'today prev,next',
                    center: 'title',
                    end: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                height={"90vh"}
                dateClick={handleDateClick}
                events={events}
            />
        </div>
    );
}

// import { useState,useEffect,useContext,createContext } from 'react';
// import FullCalendar from '@fullcalendar/react';5
// import dayGridPlugin from '@fullcalendar/daygrid' ;// a plugin!
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from "@fullcalendar/interaction" ;// needed for dayClick
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min';
// import Swal from 'sweetalert2';
// import {useAuth} from '../backend/AuthContext'
// import { getDocs, query, collection, where, addDoc,setDoc,doc, updateDoc,arrayUnion} from 'firebase/firestore'; // Import Firestore functions
// import { db, auth } from '../backend/config';
// import { onAuthStateChanged } from 'firebase/auth';

// export const Calendar = () => {
//     const { CurrentUser } = useAuth();
//     //const {CurrentUser}="Supervisor"
//     const [SupervisorID, setSupervisorID] = useState(null);
//     const [events, setEvents] = useState([]);
//     const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', color: '' });
//     const [existingEvents,setExistingEvents]=useState([]);
//     const [moduleTitles, setModuleTitles] = useState([]);
//     const [role,setRole]=useState(null);
//       useEffect(() => {
//         const unsubscribe = auth.onAuthStateChanged(async(user) => {
//           if (user) {
//         const userId=user.email.substring(0,9);
//             setSupervisorID(userId);
//             const userDoc=await getDocs(query(collection(db,'Supervisor'),where('SupervisorID','==',Math.floor(userId))));
//             if(!userDoc.empty){
//               setRole('Supervisor');
//             }else{
//               const studentDc=await getDocs(query(collection(db,'Student'),where('StudentID','==',userId)));
//               if(!studentDc.empty){
//                 setRole('Student');
//               }
//             }
//             fetchEvents(userId,role);
//             console.log(user.email.substring(0,9),"This the id at this present momment");
//           } else {
//             setSupervisorID(null);
//             setRole(null);
//             setEvents([]);
//           }
//         });
//         return () => unsubscribe();
//       }, [role]);
//       useEffect(() => {
//         const fetchModules = async () => {
//           try {
//             let q;
//             q=collection(db, 'Module');
//             q = query(q, where('SupervisorID', '==', Math.floor(SupervisorID)));
//             const querySnapshot = await getDocs(q);
//             const modulesArray = [];
//             querySnapshot.forEach((doc) => {
//               modulesArray.push(doc.data().ModuleTitle);
//             });
//             setModuleTitles(modulesArray);
//           } catch (error) {
//             console.error("Error fetching modules:", error);
//           }
//         };
//         useEffect(()=>{
//           if(SupervisorID){
//             fetchModules();
//           }
//         },[SupervisorID]);
//         // console.log(SupervisorID+"this is the id afterr");
//       }, [SupervisorID]);
//         const fetchEvents=async(userId,userRole)=>{
//             try{
//               let q;
//               if(userRole==='Supervisor'){
//                  q=query(collection(db,'Events'),where('SuperviorID','==',userId));
//               }
//               else if(userRole==='Student'){
//                   q = query(collection(db, 'Events'), where('StudentID', '==', userId));
//               }
//               const querySnapshot = await getDocs(q);
//               const fetchedEvents = querySnapshot.docs.map(doc=>{
//                 const event=doc.data();
//                 const eventEndDate=new Date(event.end);
//                 return eventEndDate >= new Date() ? event:null;
//               }).filter(event=>event!==null);
//               // setEvents(fetchedEvents);
//               // const today=new Date();
//               // querySnapshot.forEach((doc) => {
//               //   const event=doc.data();
//               //   const eventEndDate=new Date(event.end);
//               //   if(eventEndDate>=today){
//               //     fetchedEvents.push(event);
//               //   }
//                 //fetchedEvents.push(doc.data());
//               //});
//               //setEvents((prevEvents)=>[...prevEvents,...fetchedEvents]);
//               setEvents(fetchedEvents);
//             }
//             catch(error){
//               console.error("Error fetching  supervisors details",error);
//             }
//           };
//       const handleDateClick = (arg) => {
//         setNewEvent({ ...newEvent, start: arg.dateStr, end: arg.dateStr });
//       };

//       const showEventPopup = async () => {
//         const moduleOptions = moduleTitles.map((title) => `<option value="${title}">${title}</option>`).join('');
//         const { value: formValues } = await Swal.fire({
//           title: 'Add Event',
//           html: `
//             <input id="swal-input1" class="swal2-input" placeholder="Event Title">
//             <input id="swal-input2" class="swal2-input" type="date" value="${newEvent.start}">
//             <input id="swal-input3" class="swal2-input" type="date" value="${newEvent.end}">
//             <select id="swal-input4" class="swal2-input">
//               <option value="" disabled selected>Select a color</option>
//               <option value="#378006" style="background-color: #378006; color: #378006;">● Green</option>
//               <option value="#ff9f89" style="background-color: #ff9f89; color: #ff9f89;">● Pink</option>
//               <option value="#1e90ff" style="background-color: #1e90ff; color: #1e90ff;">● Blue</option>
//               <option value="#ff6347" style="background-color: #806CA5; color: #806CA5;">● Purple</option>
//               <option value="#ffa500" style="background-color: #ffa500; color: #ffa500;">● Orange</option>
//             </select>
//             <select id="swal-input5" class="swal2-input">
//               <option value="" disabled selected>Select a module</option>
//               ${moduleOptions}
//             </select>
//           `,
//           focusConfirm: false,
//           confirmButtonColor: '#343a40',
//           preConfirm: () => {
//             return [
//               document.getElementById('swal-input1').value,
//               document.getElementById('swal-input2').value,
//               document.getElementById('swal-input3').value,
//               document.getElementById('swal-input4').value,
//               document.getElementById('swal-input5').value,
//             ];
//           }
//         });
//         if (formValues) {
//           const [title, start, end, color, module] = formValues;
//           const today=new Date().setHours(0,0,0);
//           const startDate=new Date(start).setHours(0,0,0,0);
//           if(startDate<today){
//             Swal.fire('The start date cannot be in the past','error');
//             return;//And dont allow new date to be added
//           }
//           //const userId=CurrentUser.email.substring(0,9);
//           const newEvent = { title, start, end, module, backgroundColor: color, borderColor: color,SupervisorID};
//           try{
//             const eventDocRef=doc(db,'Events',SupervisorID);
//             await updateDoc(eventDocRef,{
//               events: arrayUnion(newEvent)
//             });
//             //await setDoc(doc(db,'Events',SupervisorID),newEvent);
//             setEvents((prevEvents)=>[...prevEvents,newEvent]);
//             Swal.fire('Event Added',JSON.stringify(formValues));
//           }
//           catch(error){
//             console.error("Error adding event:",error);
//             Swal.fire('Error','Failed to add event.Please try again','error')
//           }
    
//         }
//       };
//       const userType = CurrentUser?.email.startsWith('7') ? 'Supervisor' : '';

//     return (
//       <div>
//       {userType === 'Supervisor' && (
//         <button className="btn btn-primary" onClick={showEventPopup}>Add Event</button>
//       )}
//         <FullCalendar
//         plugins={[ dayGridPlugin, interactionPlugin,timeGridPlugin]}
//             initialView={"dayGridMonth"}
//             weekends={false}
//             headerToolbar={{
//               start:'today prev,next',
//               center:'title',
//               end:'dayGridMonth,timeGridWeek,timeGridDay'
//             }}
//             height={"90vh"}
//             dateClick={handleDateClick}
//             events={events}
//         />
//         </div>
//     )
// }

