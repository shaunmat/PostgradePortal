import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2';
import { useAuth } from "../backend/authcontext";
import { getDocs, query, collection, where } from 'firebase/firestore';
import { db, auth } from '../backend/config';

export const Calendar = () => {
  const { CurrentUser } = useAuth();
  const [userId, setUserId] = useState(null);
  const [events, setEvents] = useState([]);
  const [moduleTitles, setModuleTitles] = useState([]);
  const [role, setRole] = useState(null);

  // Fetch user details when the authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userId = user.email.substring(0, 9);
        setUserId(userId);
        
        // Determine if the user is a Supervisor or Student
        const supervisorDoc = await getDocs(query(collection(db, 'Supervisor'), where('SupervisorID', '==', Math.floor(userId))));
        if (!supervisorDoc.empty) {
          setRole('Supervisor');
        } else {
          const studentDoc = await getDocs(query(collection(db, 'Student'), where('StudentID', '==', Math.floor(userId))));
          if (!studentDoc.empty) {
            setRole('Student');
          }
        }
      } else {
        setUserId(null);
        setRole(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch events only when userId and role are defined
  useEffect(() => {
    const fetchedEvents = async () => {
      if (!userId || !role) {
        console.error("User ID or role is not defined");
        return;
      }

      try {
        let q;
        if (role === 'Supervisor') {
          q = query(collection(db, 'Events'), where('SupervisorID', '==', userId));
        } else if (role === 'Student') {
          q = query(collection(db, 'Events'), where('StudentID', '==', userId));
        }

        if (!q) {
          console.error("Query is undefined");
          return;
        }

        const querySnapshot = await getDocs(q);
        const eventsFetchedArray = [];
        const today = new Date();

        querySnapshot.forEach((doc) => {
          const event = doc.data();
          const eventEndDate = new Date(event.end);
          if (eventEndDate >= today) {
            eventsFetchedArray.push(event);
          }
        });

        setEvents(eventsFetchedArray);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchedEvents();
  }, [userId, role]);

  // Fetch modules when userId and role are defined
  useEffect(() => {
    const fetchModules = async () => {
      if (!userId || role !== 'Supervisor') return;

      try {
        const q = query(collection(db, 'Module'), where('SupervisorID', '==', Math.floor(userId)));
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
  }, [userId, role]);

  const handleDateClick = (arg) => {
    // Handle date click for new events
  };

  const showEventPopup = async () => {
    // Show event popup logic
  };

  const userType = CurrentUser?.email.startsWith('7') ? 'Supervisor' : '';

  return (
    <div>
      {userType === 'Supervisor' && (
        <button className="btn btn-primary" onClick={showEventPopup}>Add Event</button>
      )}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        weekends={false}
        headerToolbar={{
          start: 'today prev,next',
          center: 'title',
          end: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        height={"90vh"}
        events={events}
        dateClick={handleDateClick}
      />
    </div>
  );
};
