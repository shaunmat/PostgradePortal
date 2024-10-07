import { useState,useEffect,useContext,createContext } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Swal from 'sweetalert2';
import {useAuth} from '../backend/AuthContext'
import { getDocs, query, collection, where } from 'firebase/firestore'; // Import Firestore functions
import { db, auth } from '../backend/config';
import { onAuthStateChanged } from 'firebase/auth';

export const Calendar = () => {
    const { CurrentUser } = useAuth();
    //const {CurrentUser}="Supervisor"
    const [SupervisorID, setSupervisorID] = useState(null);
    const [events, setEvents] = useState([
        { title: 'Software Testing', start: '2024-07-01', end: '2024-07-15', backgroundColor: '#378006', borderColor: '#378006' },
        { title: 'Research Paper Calendar', start: '2024-07-02', end: '2024-07-05', backgroundColor: '#ff9f89', borderColor: '#ff9f89' }
      ]);
      const [newEvent, setNewEvent] = useState({ title: '', start: '', end: '', color: '' });
      const [moduleTitles, setModuleTitles] = useState([]);
      useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            setSupervisorID(user.email.substring(0, 9));
            console.log(user.email.substring(0,9));
          } else {
            setSupervisorID(null);
          }
        });
    
        return () => unsubscribe();
      }, []);
      useEffect(() => {
        const fetchModules = async () => {
          if (!SupervisorID) return;
    
          try {
    
            const q = query(collection(db, 'Module'), where('SupervisorID', '==', Math.floor(SupervisorID)));
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
          preConfirm: () => {
            return [
              document.getElementById('swal-input1').value,
              document.getElementById('swal-input2').value,
              document.getElementById('swal-input3').value,
              document.getElementById('swal-input4').value,
              document.getElementById('swal-input5').value
            ];
          }
        });
    
        if (formValues) {
          const [title, start, end, color, module] = formValues;
          setEvents([...events, { title, start, end, module, backgroundColor: color, borderColor: color }]);
          Swal.fire('Event Added', JSON.stringify(formValues));
        }
      };
    
      const userType = CurrentUser?.email.startsWith('7') ? 'Supervisor' : '';

    return (
        <FullCalendar
        plugins={[ dayGridPlugin, interactionPlugin ]}
            initialView="dayGridMonth"
            // weekends={false}
            events={
                [
                    { title: 'Business Analysis 3A', date: '2024-08-01' },
                    { title: 'Development Software 3B', date: '2024-08-02' }
                ]
            }

            dateClick={function(info) {
                // Add event to calendar when date is clicked
                const event = prompt('Enter event name');
                if (event) {
                    info.view.calendar.addEvent({
                        title: event,
                        start: info.dateStr,
                        allDay: true
                    });
                }
            }}

        />
    )
}

