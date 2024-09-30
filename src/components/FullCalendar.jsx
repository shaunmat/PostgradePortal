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
import '../index.css';

export const Calendar = () => {
    const { CurrentUser, UserData, Loading, UserRole } = useAuth();
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
                    await fetchModules(); // Fetch modules immediately after setting SupervisorID
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
    }, []);

    useEffect(() => {
        if (!Loading && UserData) {
            setSupervisorID(UserData.ID);
            setRole(UserRole === 'Student' ? UserData.StudentType : UserRole);
            setEvents([]); // Clear events when user data changes
        }
    }, [Loading, UserData, UserRole]);


    const fetchMeetingEvents = async (userId) => {
        console.log(`Fetching meetings for userId: ${userId}`); // Log the userId being fetched
        try {
            const eventDocRef = doc(db, 'Events', userId);
            const eventDocSnap = await getDoc(eventDocRef);
            
            if (eventDocSnap.exists()) {
                const data = eventDocSnap.data();
                
                // Extract meeting information from the document directly
                const event = {
                    title: data.subject,
                    start: `${data.date}T${data.time}:00`, // Construct start time
                    end: `${data.date}T${data.time}:00`,   // Adjust end time if necessary
                    backgroundColor: data.backgroundColor,
                    borderColor: data.borderColor,
                };
                
                setEvents([event]); // Wrap the event in an array since setEvents expects an array
                console.log('Fetched meetings:', [event]); // Log fetched events
            } else {
                console.warn('No meetings found for the given userId:', userId);
                setEvents([]); // Clear events if document doesn't exist
            }
        } catch (error) {
            console.error("Error fetching meeting:", error);
        }
    };

    
    const fetchEvents = async (userId) => {
        try {
            const eventDocRef = doc(db, 'Events', userId);
            const eventDocSnap = await getDoc(eventDocRef);
            
            if (eventDocSnap.exists()) {
                const data = eventDocSnap.data();
                const formattedEvents = (data.events || []).map(event => ({
                    title: event.title,
                    start: event.start,
                    end: event.end,
                    backgroundColor: event.backgroundColor,
                    borderColor: event.borderColor,
                }))
                setEvents(formattedEvents); 
            } else {
                console.warn('No events found for the given userId:', userId);
                setEvents([]); // Clear events if document doesn't exist
            }
        } catch (error) {
            console.error("Error fetching events:", error);
        }
    };
    
    useEffect(() => {
        if (SupervisorID) {
            fetchEvents(SupervisorID);
            fetchMeetingEvents(SupervisorID);
        }
    }, [SupervisorID]);

    const fetchModules = async () => {
        try {
            if (!SupervisorID) {
                console.warn('SupervisorID is undefined');
                return;
            }
    
            const moduleRef = doc(db, 'Module', SupervisorID.toString()); // Convert to string if necessary
            const moduleSnap = await getDoc(moduleRef);
    
            if (moduleSnap.exists()) {
                const moduleData = moduleSnap.data();
                const modulesArray = moduleData.ModuleTitle || []; // Adjust based on your Firestore structure
                setModuleTitles(modulesArray);
                console.log('Modules fetched:', modulesArray);
            } else {
                console.warn(`No module document found for SupervisorID: ${SupervisorID}`);
            }
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
        const moduleOptions = moduleTitles.length > 0
            ? moduleTitles.map((title) => `<option value="${title}">${title}</option>`).join('')
            : `<option value="" disabled>No modules available</option>`;

        const { value: formValues } = await Swal.fire({
            title: 'Add Event',
            html: `
                <input id="swal-input1" class="swal2-input custom-swal-input" placeholder="Event Title">
                <input id="swal-input2" class="swal2-input custom-swal-input" type="date" value="${newEvent.start}">
                <input id="swal-input3" class="swal2-input custom-swal-input" type="date" value="${newEvent.end}">
                <select id="swal-input4" class="swal2-input">
                    <option value="" disabled selected>Select a color</option>
                    <option value="#378006" style="background-color: #378006; color: #378006;">● Green</option>
                    <option value="#ff9f89" style="background-color: #ff9f89; color: #ff9f89;">● Pink</option>
                    <option value="#1e90ff" style="background-color: #1e90ff; color: #1e90ff;">● Blue</option>
                    <option value="#ff6347" style="background-color: #ff6347; color: #ff6347;">● Red</option>
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
        <div className="p-4">
            {userType === 'Supervisor' && (
                <div className="flex justify-end mb-4">
                    <button 
                        className="btn btn-primary py-2 px-4 rounded shadow-md hover:bg-blue-700 transition-colors" 
                        onClick={showEventPopup}
                    >
                        Add Event
                    </button>
                </div>
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
};
