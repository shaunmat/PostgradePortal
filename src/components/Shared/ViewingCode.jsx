import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Swal from 'sweetalert2';
import { useAuth } from '../backend/authcontext';
import { getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
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
                setSupervisorID(userId);

                const userDoc = await getDoc(doc(db, 'Supervisor', userId));
                if (userDoc.exists()) {
                    setRole('Supervisor');
                } else {
                    const studentDoc = await getDoc(doc(db, 'Student', userId));
                    if (studentDoc.exists()) {
                        setRole('Student');
                    }
                }
            } else {
                setSupervisorID(null);
                setRole(null);
                setEvents([]); // Clear events on logout
            }
        });
        return () => unsubscribe();
    }, [role]);

    const fetchEvents = async (userId, role) => {
        try {
            const eventDocRef = doc(db, 'Events', userId);
            const eventDocSnap = await getDoc(eventDocRef);

            if (eventDocSnap.exists()) {
                const data = eventDocSnap.data();
                setEvents(data.events || []); // Set the events from the document
            } else {
                console.warn('No events found for the given userId');
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };

    useEffect(() => {
        if (SupervisorID && role) {
            fetchEvents(SupervisorID, role);
        }
    }, [SupervisorID, role]);

    const fetchModules = async () => {
        try {
            const q = doc(db, 'Module', SupervisorID);
            const querySnapshot = await getDoc(q);
            const modulesArray = querySnapshot.data().ModuleTitle || [];
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



// useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (user) => {
//         if (user) {
//             const userId = user.email.substring(0, 9);
//             setSupervisorID(userId);

//             const userDoc = await getDocs(query(collection(db, 'Supervisor'), where('SupervisorID', '==', Math.floor(userId))));
//             if (!userDoc.empty) {
//                 setRole('Supervisor');
//             } else {
//                 const studentDoc = await getDocs(query(collection(db, 'Student'), where('StudentID', '==', userId)));
//                 if (!studentDoc.empty) {
//                     setRole('Student');
//                 }
//             }
//         } else {
//             setSupervisorID(null);
//             setRole(null);
//             setEvents([]); // Clear events on logout
//         }
//     });
//     return () => unsubscribe();
// }, []);

// useEffect(() => {
//     if (SupervisorID && role) {
//         fetchEvents(SupervisorID, role);
//     } else {
//         console.log("SupervisorID or role is not set yet:", { SupervisorID, role });
//     }
// }, [SupervisorID, role]);

// const fetchEvents = async (userId, role) => {
//     console.log("Fetching events for userId:", userId, "and role:", role);
//     try {
//         let q;
//         if (role === 'Supervisor') {
//             q = query(collection(db, 'Events'), where('SupervisorID', '==', userId));
//         } else if (role === 'Student') {
//             q = query(collection(db, 'Events'), where('StudentID', '==', userId));
//         }
        
//         if (!q) {
//             console.error('Query is undefined');
//             return;
//         }

//         const querySnapshot = await getDocs(q);
//         if (querySnapshot.empty) {
//             console.warn('No events found for the given query');
//             return;
//         }

//         const fetchedEvents = querySnapshot.docs.map(doc => {
//             const event = doc.data();
//             const eventEndDate = new Date(event.end);
//             return eventEndDate >= new Date() ? event : null;
//         }).filter(event => event !== null);

//         setEvents(fetchedEvents);
//     } catch (error) {
//         console.error("Error fetching events:", error);
//     }
// };



// import { useState, useEffect } from 'react';
// import FullCalendar from '@fullcalendar/react';
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import interactionPlugin from '@fullcalendar/interaction';
// import Swal from 'sweetalert2';
// import { useAuth } from "../backend/authcontext";
// import { getDocs, query, collection, where } from 'firebase/firestore';
// import { db, auth } from '../backend/config';

// export const Calendar = () => {
//   const { CurrentUser } = useAuth();
//   const [userId, setUserId] = useState(null);
//   const [events, setEvents] = useState([]);
//   const [moduleTitles, setModuleTitles] = useState([]);
//   const [role, setRole] = useState(null);

//   // Fetch user details when the authentication state changes
//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (user) => {
//       if (user) {
//         const userId = user.email.substring(0, 9);
//         setUserId(userId);
        
//         // Determine if the user is a Supervisor or Student
//         const supervisorDoc = await getDocs(query(collection(db, 'Supervisor'), where('SupervisorID', '==', Math.floor(userId))));
//         if (!supervisorDoc.empty) {
//           setRole('Supervisor');
//         } else {
//           const studentDoc = await getDocs(query(collection(db, 'Student'), where('StudentID', '==', Math.floor(userId))));
//           if (!studentDoc.empty) {
//             setRole('Student');
//           }
//         }
//       } else {
//         setUserId(null);
//         setRole(null);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   // Fetch events only when userId and role are defined
//   useEffect(() => {
//     const fetchedEvents = async () => {
//       if (!userId || !role) {
//         console.error("User ID or role is not defined");
//         return;
//       }

//       try {
//         let q;
//         if (role === 'Supervisor') {
//           q = query(collection(db, 'Events'), where('SupervisorID', '==', userId));
//         } else if (role === 'Student') {
//           q = query(collection(db, 'Events'), where('StudentID', '==', userId));
//         }

//         if (!q) {
//           console.error("Query is undefined");
//           return;
//         }

//         const querySnapshot = await getDocs(q);
//         const eventsFetchedArray = [];
//         const today = new Date();

//         querySnapshot.forEach((doc) => {
//           const event = doc.data();
//           const eventEndDate = new Date(event.end);
//           if (eventEndDate >= today) {
//             eventsFetchedArray.push(event);
//           }
//         });

//         setEvents(eventsFetchedArray);
//       } catch (error) {
//         console.error("Error fetching events:", error);
//       }
//     };

//     fetchedEvents();
//   }, [userId, role]);

//   // Fetch modules when userId and role are defined
//   useEffect(() => {
//     const fetchModules = async () => {
//       if (!userId || role !== 'Supervisor') return;

//       try {
//         const q = query(collection(db, 'Module'), where('SupervisorID', '==', Math.floor(userId)));
//         const querySnapshot = await getDocs(q);
//         const modulesArray = [];

//         querySnapshot.forEach((doc) => {
//           modulesArray.push(doc.data().ModuleTitle);
//         });

//         setModuleTitles(modulesArray);
//       } catch (error) {
//         console.error("Error fetching modules:", error);
//       }
//     };

//     fetchModules();
//   }, [userId, role]);

//   const handleDateClick = (arg) => {
//     // Handle date click for new events
//   };

//   const showEventPopup = async () => {
//     // Show event popup logic
//   };

//   const userType = CurrentUser?.email.startsWith('7') ? 'Supervisor' : '';

//   return (
//     <div>
//       {userType === 'Supervisor' && (
//         <button className="btn btn-primary" onClick={showEventPopup}>Add Event</button>
//       )}
//       <FullCalendar
//         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//         initialView={"dayGridMonth"}
//         weekends={false}
//         headerToolbar={{
//           start: 'today prev,next',
//           center: 'title',
//           end: 'dayGridMonth,timeGridWeek,timeGridDay'
//         }}
//         height={"90vh"}
//         events={events}
//         dateClick={handleDateClick}
//       />
//     </div>
//   );
// };
