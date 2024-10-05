import { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, getDocs, updateDoc, getDoc } from "firebase/firestore";
import { HiBell, HiSearch, HiAcademicCap, HiCalendar, HiClock } from "react-icons/hi";
import { db } from "../../backend/config"; // Firebase configuration
import { useAuth } from "../../backend/authcontext";
import { useTheme } from "../../context/ThemeContext";
import ReactAudioPlayer from 'react-audio-player';
import notificationSound from '../../assets/pop-up-bubble.mp3'; // Import the audio file
import { useParams } from "react-router-dom";
import { Select } from "flowbite-react";
import { toast } from "react-toastify";
import { doc, setDoc } from 'firebase/firestore';
import { color } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { query, where } from "firebase/firestore";
import { motion } from "framer-motion";


export const RightSidebar = () => {
    const { researchId } = useParams();
    const [notifications, setNotifications] = useState([]);
    const [newNotificationIDs, setNewNotificationIDs] = useState([]); // State to track new notification IDs
    const { UserData, UserRole, Loading } = useAuth();
    const { isDarkMode } = useTheme();
    const [playSound, setPlaySound] = useState(false); 
    const [UserLevel, setUserLevel] = useState('');
    const [students, setStudents] = useState([]);
    const [studentName, setStudentName] = useState('');
    const [studentSurname, setStudentSurname] = useState('');
    const [studentEmail, setStudentEmail] = useState('');
    const [supervisors, setSupervisors] = useState([]);
    const [supervisorName, setSupervisorName] = useState('');
    const [supervisorSurname, setSupervisorSurname] = useState('');
    const [supervisorEmail, setSupervisorEmail] = useState('');
    const [supervisorTitle, setSupervisorTitle] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [supervisorId, setSupervisorId] = useState('');
    const [meetingDate, setMeetingDate] = useState('');
    const [meetingTime, setMeetingTime] = useState('');
    const [emailStatus, setEmailStatus] = useState('');
    const [reason, setReason] = useState('');
    // UserRole === 'supervisor' ? 'Supervisor' : 'Student'
    const [quote, setQuote] = useState({ text: '', author: '' });
    const [currentMeetingRequest, setCurrentMeetingRequest] = useState(null);
    const [meetingRequests, setMeetingRequests] = useState([]);
    const audioRef = useRef(null); // Create a ref for the audio player

    // Function to fetch a random quote
    // const fetchQuote = async () => {
    //     try {
    //         const response = await fetch('http://localhost:3000/api/quote');
    //         const data = await response.json();
    //         setQuote({ text: data[0].q, author: data[0].a });
    //     } catch (error) {
    //         console.error('Error fetching quote:', error);
    //     }
    // };

    // Fetch quote on component mount
    // useEffect(() => {
    //     fetchQuote();
    // }, []);

    useEffect(() => {
        if (!Loading && UserData) {
            setUserLevel(UserRole === 'Student' ? UserData.StudentType : UserRole);

            const fetchSupervisor = async () => {
                if (!UserData.SupervisorID || UserData.SupervisorID.length === 0) return;

                const supervisorRef = collection(db, 'Supervisor');
                const supervisorQuery = query(supervisorRef, where('ID', 'in', UserData.SupervisorID));

                const supervisorList = [];
                const snapshot = await getDocs(supervisorQuery);
                snapshot.forEach(doc => {
                    const supervisorData = doc.data();
                    supervisorList.push({
                        id: doc.id,
                        ...supervisorData,
                    });

                    // Set state variables for the first supervisor (or modify as needed)
                    setSupervisorName(supervisorData.Name);
                    setSupervisorSurname(supervisorData.Surname);
                    setSupervisorTitle(supervisorData.Title);

                    return supervisorList;
                });

                setSupervisors(supervisorList);
            }

            // Fetch assigned students
            const fetchStudents = async () => {
                if (!UserData.CourseID || UserData.CourseID.length === 0) return;
            
                const courseIds = UserData.CourseID; // Use all CourseIDs
            
                const studentsRef = collection(db, 'Student'); // Reference to the Student collection
            
                const unsubscribe = onSnapshot(studentsRef, (snapshot) => {
                    const studentList = [];
                    snapshot.forEach(doc => {
                        const studentData = doc.data();
                        // Filter students by CourseID
                        if (studentData.CourseID && studentData.ID !== UserData.ID) {
                            for (const courseId of courseIds) {
                                if (studentData.CourseID.includes(courseId)) {
                                    studentList.push({
                                        id: doc.id,
                                        ...studentData,
                                    });
                                    setStudentName(studentData.Name);
                                    setStudentSurname(studentData.Surname);    
                                    break; // Stop checking other courseIds once a match is found
                                }
                            }
                        }
                    });
            
                    setStudents(studentList);
                    console.log('Filtered Students:', studentList); // Log filtered student list
                });
                return () => unsubscribe();
            };

            fetchStudents(); // Call the fetchStudents function
            fetchSupervisor(); // Call the fetchSupervisor function
        }
    }, [Loading, UserData, UserRole]);


    const checkIfDueSoon = (dueDate) => {
        const now = new Date();
        const due = new Date(dueDate);
        const timeDifference = due - now;
        return timeDifference > 0 && timeDifference <= 3 * 24 * 60 * 60 * 1000; // Due in 3 days or less
    };

    const NOTIFICATION_TIMEOUT = 50000; // 5 seconds

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!UserData || !UserData.CourseID || UserData.CourseID.length === 0) return;


            const fetchPromises = UserData.CourseID.map(async (courseId) => {
                const assignmentsRef = collection(db, 'Module', courseId, 'Assignments');

                return new Promise((resolve) => {
                    const unsubscribe = onSnapshot(assignmentsRef, async (snapshot) => {
                        const newNotifications = [];
                        const newIDs = []; // Track new notification IDs

                        for (const change of snapshot.docChanges()) {
                            const assignmentData = change.doc.data();
                            const assignmentID = change.doc.id;


                            if (change.type === "added") {
                                newNotifications.push({
                                    id: assignmentID, // Store ID for tracking
                                    type: "new",
                                    message: `New milestone unlocked.`, // Include course info
                                    timestamp: new Date(),
                                });
                                newIDs.push(assignmentID); // Add ID to new IDs
                            }


                            if (assignmentData.AssignmentDueDate && checkIfDueSoon(assignmentData.AssignmentDueDate.toDate())) {
                                newNotifications.push({
                                    id: assignmentID,
                                    type: "due",
                                    message: `Milestone is due soon.`, // Include course info
                                    timestamp: new Date(),
                                });
                            }
                        }

                        resolve({ newNotifications, newIDs });
                    });


                    return () => unsubscribe();
                });
            });

            // Fetch events notifications
            const fetchEventNotifications = async () => {
                const eventsRef = collection(db, 'Events');
                const newEventNotifications = [];

                for (const supervisorID of UserData.SupervisorID) {
                    const filterEvents = query(eventsRef, where('SupervisorID', '==', supervisorID));
                    const snapshot = await getDocs(filterEvents);

                    snapshot.forEach(doc => {
                        const eventData = doc.data();
                        newEventNotifications.push({
                            id: doc.id,
                            type: 'event',
                            message: `Meeting scheduled with ${supervisorTitle} ${supervisorSurname} on ${eventData.date} at ${eventData.time}.`,
                            timestamp: new Date(),
                        });
                    });
                }

                return newEventNotifications;
            };

            // Wait for all notifications to be fetched
            const notificationsResults = await Promise.all(fetchPromises);
            const eventNotifications = await fetchEventNotifications();

            // Combine results
            const allNewNotifications = notificationsResults.flatMap(result => result.newNotifications).concat(eventNotifications);
            const allNewIDs = notificationsResults.flatMap(result => result.newIDs);


            setNotifications((prevNotifications) => {
                const combinedNotifications = [...prevNotifications, ...allNewNotifications];
                const uniqueNotifications = Array.from(new Map(combinedNotifications.map(item => [item.id, item])).values());
                const updatedNotifications = uniqueNotifications.sort((a, b) => b.timestamp - a.timestamp).slice(0, 3);
                setNewNotificationIDs(allNewIDs);
                    
                // Trigger sound playback if there are new notifications
                if (allNewNotifications.length > 0) {
                    audioRef.current.audioEl.current.pause(); // Pause current sound
                    audioRef.current.audioEl.current.currentTime = 0; // Reset to start
                    audioRef.current.audioEl.current.play(); // Pause current sound

                    allNewNotifications.forEach(notification => {
                        setTimeout(() => {
                            setNotifications((prevNotifications) => prevNotifications.filter(n => n.id !== notification.id));
                        }, NOTIFICATION_TIMEOUT);
                    });
                }


                return updatedNotifications;
            });
        };

        fetchNotifications();
    }, [UserData, db]);
        
    
    const handleSendEmail = async (e) => {
        e.preventDefault();
    
        if (!selectedStudentId || !meetingDate || !meetingTime) {
            console.error('Please fill all fields');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    supervisorId: UserData.ID,
                    studentId: selectedStudentId,
                    subject: 'Meeting Reminder',
                    meetingDate,
                    meetingTime,
                    supervisorTitle: UserData.Title,
                    supervisorSurname: UserData.Surname,
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error sending email');
            }
    
            // const data = await response.json();
            setEmailStatus('Email sent successfully');
    

            const meetingData = {
                SupervisorID: UserData.ID,
                studentId: selectedStudentId,
                date: meetingDate,
                time: meetingTime,
                subject: 'Scheduled Meeting',
                createdAt: new Date(),
                backgroundColor: '#378006', // Green color
                borderColor: '#378006', // Green color
            };
    
            await setDoc(doc(collection(db, 'Events'), `${UserData.ID}`), meetingData);
    
            // Clear form fields
            setSelectedStudentId('');
            setMeetingDate('');
            setMeetingTime('');
    

            const meetingNotification = {
                id: `meeting-${new Date().getTime()}`, // Unique ID for the notification
                type: 'new',
                message: `Meeting scheduled with ${supervisorSurname} ${supervisorSurname} on ${meetingDate} at ${meetingTime}.`,
                timestamp: new Date(),
            };
            setNotifications((prevNotifications) => {

                const combinedNotifications = [...prevNotifications, meetingNotification];
                const uniqueNotifications = Array.from(new Map(combinedNotifications.map(item => [item.message, item])).values());
                const updatedNotifications = uniqueNotifications.sort((a, b) => b.timestamp - a.timestamp).slice(0, 3);
                return updatedNotifications;
            });
    
            setTimeout(() => {
                setEmailStatus('');
                toast.success('Email sent successfully');
            }, 5000);
    
    
        } catch (error) {
            console.error('Error sending email:', error.message);
        }
    };


    const handleRequestMeeting = async (e) => {
        e.preventDefault();
        
        try {
            const newMeetingRequest = {
                studentId: UserData.ID, // Assuming UserData.ID contains the current user's ID
                supervisorId: supervisorId,
                meetingDate: meetingDate,
                meetingTime: meetingTime,
                reason: reason,
                status: "pending",
                createdAt: new Date().toISOString()
            };
    
            await setDoc(doc(collection(db, 'MeetingRequests'), `${supervisorId}`), newMeetingRequest);
            
            toast.success('Meeting request sent successfully');
            setEmailStatus("Meeting request sent successfully!");
            
        } catch (error) {
            console.error("Error requesting meeting:", error);
            setEmailStatus("Failed to send meeting request. Please try again.");
        }
    };

    useEffect(() => {
        const fetchMeetingRequests = async () => {
            if (!UserData || !UserData.ID) return;
    
            try {
                const meetingRequestsRef = collection(db, 'MeetingRequests');
                const querySnapshot = await getDocs(meetingRequestsRef);
    
                const fetchedMeetingRequests = [];
                querySnapshot.forEach(doc => {
                    const meetingRequestData = doc.data();
                    if (meetingRequestData.supervisorId === JSON.stringify(UserData.ID) && meetingRequestData.status === 'pending') {
                        fetchedMeetingRequests.push({
                            id: doc.id,
                            ...meetingRequestData,
                        });
                    }
                });
    
                // Play sound if there are new meeting requests
                if (fetchedMeetingRequests.length > 0 && audioRef.current) {
                    audioRef.current.audioEl.current.pause(); // Pause current sound
                    audioRef.current.audioEl.current.currentTime = 0; // Reset to start
                    audioRef.current.audioEl.current.play(); // Play the audio
                }
    
                setMeetingRequests(fetchedMeetingRequests);

            } catch (error) {
                console.error("Error fetching meeting requests:", error);
            }
        };
    
        fetchMeetingRequests();
    }, [UserData, db, meetingRequests]);

    const handleConfirmationEmail = async (studentId, meetingDate, meetingTime, status) => {
        if (!studentId || !meetingDate || !meetingTime) {
            console.error('Please fill all fields');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3000/confirm-meeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    supervisorId: UserData.ID,
                    studentId,
                    subject: 'Meeting Reminder',
                    meetingDate,
                    meetingTime,
                    supervisorTitle: UserData.Title,
                    supervisorSurname: UserData.Surname,
                    status, // Pass status to determine accepted or declined email
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error sending email');
            }
    
            // const data = await response.json();
            setEmailStatus('Email sent successfully');
    
            if (status === 'accepted') {
                const meetingData = {
                    SupervisorID: UserData.ID,
                    studentId,
                    date: meetingDate,
                    time: meetingTime,
                    subject: 'Scheduled Meeting',
                    createdAt: new Date(),
                    backgroundColor: '#378006', // Green color
                    borderColor: '#378006', // Green color
                };
    
                await setDoc(doc(collection(db, 'Events'), `${UserData.ID}`), meetingData);
            }
    
            const meetingNotification = {
                id: `meeting-${new Date().getTime()}`, // Unique ID for the notification
                type: 'new',
                message: status === 'accepted'
                    ? `Meeting request accepted for ${meetingDate} at ${meetingTime}.`
                    : `Meeting request was declined.`,
                timestamp: new Date(),
            };
            setNotifications((prevNotifications) => {
                const combinedNotifications = [...prevNotifications, meetingNotification];
                const uniqueNotifications = Array.from(new Map(combinedNotifications.map(item => [item.message, item])).values());
                const updatedNotifications = uniqueNotifications.sort((a, b) => b.timestamp - a.timestamp).slice(0, 3);
                return updatedNotifications;
            });

    
            setTimeout(() => {
                setEmailStatus('');
                toast.success('Email sent successfully');
            }, 5000);
        } catch (error) {
            console.error('Error sending email:', error.message);
        }
    };
    
    

    const handleResponse = async (requestId, response) => {
        console.log(`Meeting request ${requestId} was ${response}`);
    
        const meetingRequestRef = doc(db, 'MeetingRequests', requestId);
        try {
            // Update the status in Firestore
            await updateDoc(meetingRequestRef, { status: response });
            console.log(`Meeting request ${requestId} updated successfully to ${response}`);
    
            // Get the meeting request data
            const requestDoc = await getDoc(meetingRequestRef);
            const requestData = requestDoc.data();
    
            let notificationMessage;
            if (response === 'accepted') {
                notificationMessage = `Your meeting request with ${supervisorTitle} ${supervisorSurname} has been accepted for ${requestData.meetingDate} at ${requestData.meetingTime}.`;
    
                // Call handleConfirmationEmail for accepted meeting
                await handleConfirmationEmail(requestData.studentId, requestData.meetingDate, requestData.meetingTime, 'accepted');
                toast.success('Meeting request accepted successfully!');
            } else if (response === 'declined') {
                // Handling declined request
                notificationMessage = `Your meeting request with ${supervisorTitle} ${supervisorSurname} has been declined.`;
    
                // Call handleConfirmationEmail for declined meeting
                await handleConfirmationEmail(requestData.studentId, requestData.meetingDate, requestData.meetingTime, 'declined');
                console.log('Meeting request declined email sent'); // Add logging for declined emails
                toast.error('Meeting request declined successfully!');
            }
    
            // Add the notification to the notifications state
            setNotifications(prevNotifications => [
                ...prevNotifications,
                {
                    id: `notification-${new Date().getTime()}`,
                    type: response === 'accepted' ? 'meeting-accepted' : 'meeting-declined',
                    message: notificationMessage,
                    studentId: requestData.studentId,
                    timestamp: new Date(),
                },
            ]);
    
            console.log(`Notification for ${response} request sent to student`); // Add logging for notifications
    
            // Remove the meeting request from the sidebar after response
            setMeetingRequests(prevRequests => prevRequests.filter(req => req.id !== requestId));
        } catch (error) {
            console.error('Error updating meeting request:', error);
        }
    };
        
    return (
        <aside id="right-sidebar" className={`fixed top-0 right-0 w-16 md:w-48 lg:w-72 h-screen transition-transform translate-x-full md:translate-x-0 right-sidebar ${isDarkMode ? 'dark' : ''}`}>
            <div className="h-full px-3 py-4 overflow-y-auto bg-transparent dark:bg-gray-800">
                {UserRole === 'Student' && (
                    <div className="mb-4">
                        <h3 className="text-xl font-extrabold mb-2 text-gray-800 dark:text-gray-300">Student Panel</h3>
                        <div className="w-full min-h-80 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-y-auto no-scrollbar">
                            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                                <h2 className="text-md font-semibold text-gray-800 dark:text-gray-200">Notification Panel</h2>
                                <button
                                    className="text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                    onClick={() => {
                                        setNotifications([]);
                                        setNewNotificationIDs([]);
                                        setPlaySound(false); // Reset sound playback state
                                    }}
                                >
                                    Clear All
                                </button>
                            </div>
                            <div className="p-4 space-y-4">
                            {notifications.length > 0 ? (
                                notifications.map((notification, index) => {
                                    // Set border and icon background color based on notification type
                                    const borderColor = notification.type === 'new'
                                        ? 'border-[#FF8503]' // Color for new notifications
                                        : notification.type === 'due'
                                            ? 'border-[#590098]' // Color for due notifications
                                            : 'border-[#007BFF]'; // Color for meeting notifications

                                    const iconBgColor = notification.type === 'new'
                                        ? 'bg-[#FF8503]' // Background color for new notifications
                                        : notification.type === 'due'
                                            ? 'bg-[#590098]' // Background color for due notifications
                                            : 'bg-[#007BFF]'; // Background color for meeting notifications

                                    return (
                                        <motion.div
                                            key={`${notification.id}-${notification.timestamp.getTime()}-${index}`} // Added index to ensure uniqueness
                                            initial={{ opacity: 0, x: 100 }} // Initial state before the animation
                                            animate={{ opacity: 1, x: 0 }} // Animation for when the component is displayed
                                            exit={{ opacity: 0, x: 100 }} // Animation for when the component is removed
                                            transition={{ duration: 0, ease: 'easeInOut' }} // Define the transition properties
                                            className={`relative flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-l-4 ${borderColor} shadow-md transition duration-200 ease-in-out`} // Apply border color and shadow
                                        >
                                            {newNotificationIDs.includes(notification.id) && (
                                                <span className="absolute top-2 right-2 block w-3 h-3 bg-red-600 rounded-full"></span> // Notification indicator
                                            )}
                                            <div className="flex flex-col space-y-1">
                                                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200">{notification.message}</h3>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{notification.timestamp.toLocaleTimeString()}</p>
                                            </div>
                                            <div className={`p-2 rounded-full ${iconBgColor} text-white`}>
                                                <HiBell className="h-5 w-5" />
                                            </div>
                                        </motion.div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                            )}

                            </div>

                            <ReactAudioPlayer
                                ref={audioRef} // Set the ref here
                                src={notificationSound} // Set the audio file
                                controls={false} // No visible controls needed
                                volume={1} // Set the desired volume level
                            />

                        </div>

                        {/* Thought of the Day Section */}
                        <div className="mt-4 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                            <h2 className="text-md font-bold text-gray-800 dark:text-gray-200">Thought of the Day</h2>
                            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{quote.text}</p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">- {quote.author}</p>
                        </div>

                        {/* Set meetings with supervisors or peers */}
                        <div className="mt-4 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                            <h2 className="text-md font-bold text-gray-800 dark:text-gray-200">Schedule a Meeting</h2>
                            <form onSubmit={handleRequestMeeting} className="mt-4">

                                <label htmlFor="supervisorSelect" className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">Select supervisor:</label>
                                <Select
                                    className="mb-4 mt-2"
                                    id="supervisorSelect"
                                    required
                                    onChange={(e) => setSupervisorId(e.target.value)}
                                    value={supervisorId}
                                >
                                    <option disabled value="">Select a supervisor</option>
                                    {supervisors.map(supervisor => (
                                        <option key={supervisor.id} value={supervisor.id}>
                                            {supervisor.Title} {supervisor.Surname}
                                        </option>
                                    ))}
                                </Select>
                                

                                <label htmlFor="meetingDate" className="block mt-4 text-sm font-medium text-gray-800 dark:text-gray-300">Meeting Date:</label>
                                <input
                                    type="date"
                                    id="meetingDate"
                                    className="mb-2 mt-2 w-full p-2 border border-gray-300 rounded"
                                    value={meetingDate}
                                    onChange={(e) => setMeetingDate(e.target.value)}
                                    required
                                />

                                <label htmlFor="meetingTime" className="block mt-4 text-sm font-medium text-gray-800 dark:text-gray-300">Meeting Time:</label>
                                <input
                                    type="time"
                                    id="meetingTime"
                                    className="mb-2 mt-2 w-full p-2 border border-gray-300 rounded"
                                    value={meetingTime}
                                    onChange={(e) => setMeetingTime(e.target.value)}
                                    required
                                />

                                {/* Input field for reason of request */}
                                <label htmlFor="reason" className="block mt-4 text-sm font-medium text-gray-800 dark:text-gray-300">Reason for Meeting:</label>
                                <textarea
                                    id="reason"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    rows="2"
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    required
                                ></textarea>


                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-4"
                                >
                                    Request Meeting
                                </button>
                            </form>
                            {emailStatus && <p className="mt-2 text-sm text-green-500">{emailStatus}</p>} {/* Display email status message */}
                        </div>
                    </div>
                )}

                {/* Supervisor-specific content */}
                {UserRole === 'Supervisor' && (
                    <div className="overflow-y-auto bg-transparent no-scrollbar p-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
                        <h3 className="text-xl font-extrabold mb-2 text-gray-800 dark:text-gray-300">Supervisor Panel</h3>
                        
                        <div className="w-full min-h-80 bg-white dark:bg-gray-800 rounded-lg shadow-md no-scrollbar">
                            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                                <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Meeting Requests</h2>
                                <button
                                    className="text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                                    onClick={() => {
                                        setCurrentMeetingRequest([]); // Clear all meeting requests
                                    }}
                                >
                                    Clear All
                                </button>
                            </div>

                            <div className="p-3 space-y-1">
                            <ReactAudioPlayer
                                ref={audioRef} // Set the ref here
                                src={notificationSound} // Set the audio file
                                controls={false}
                                volume={1} // Set the desired volume level
                            />
                            {meetingRequests.length > 0 ? meetingRequests.map((request, index) => {
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: 100 }} // Start invisible and below the final position
                                        animate={{ opacity: 1, x: 0 }} // Fade in and slide up
                                        exit={{ opacity: 0, x: 100 }} // Fade out and slide up
                                        transition={{ duration: 0, ease: 'easeInOut' }} // Animation duration and easing
                                        className="flex flex-col p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-l-4 border-[#007BFF] shadow-md transition duration-200 ease-in-out" // Adjust border color as needed
                                    >
                                        {/* Meeting Details */}
                                        <div className="flex flex-col mb-4">
                                            <p className="text-sm mt-1 text-gray-800 dark:text-gray-300">
                                                <strong>Student ID:</strong> {request.studentId}
                                            </p>
                                            <div className="flex items-center text-sm mt-1 text-gray-500 dark:text-gray-400">
                                                Date: {request.meetingDate}
                                            </div>
                                            <div className="flex items-center text-sm mt-1 text-gray-500 dark:text-gray-400">
                                                Time: {request.meetingTime}
                                            </div>
                                            <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                                                Reason: {request.reason}
                                            </p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleResponse(request.id, 'accepted')} // Updated onClick to pass function properly
                                                className="bg-green-500 text-white font-bold px-2 py-2 rounded-lg shadow hover:bg-green-600 transition"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleResponse(request.id, 'declined')} // Updated onClick to pass function properly
                                                className="bg-red-500 text-white font-bold px-2 py-2 rounded-lg shadow hover:bg-red-600 transition"
                                            >
                                                Decline
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            }) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No meeting requests available</p>
                            )}
                            </div>
                        </div>


                        <div className="w-full min-h-80 mt-3 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-y-auto no-scrollbar">
                            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                                <h2 className="text-md font-bold text-gray-800 dark:text-gray-300">Assigned Students</h2>
                            </div>

                            <ul className="space-y-2 p-4">
                                {students.length > 0 ? (
                                    students.map((student, index) => (
                                        <li key={index} className="flex items-center space-x-4">
                                            <button className="p-2 mr-2 bg-gray-200 rounded-xl dark:bg-gray-600">
                                                <HiAcademicCap className="w-6 h-6" />
                                            </button>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800 dark:text-gray-300">
                                                    {student.Name} {student.Surname}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{student.ID}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">{student.StudentType}</p>
                                            </div>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-gray-500 dark:text-gray-400">No students assigned</li>
                                )}
                            </ul>
                        </div>

                        {/* Thought of the day */}
                        <div className="mt-4 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                            <h2 className="text-md font-bold text-gray-800 dark:text-gray-200">Thought of the Day</h2>
                            <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{quote.text}</p>
                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">- {quote.author}</p>
                        </div>

                        <div className="w-full min-h-80 mt-3 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-y-auto no-scrollbar">
                            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                                <h4 className="text-md font-bold text-gray-800 dark:text-gray-300">Schedule a Meeting</h4>
                            </div>

                            <div className="p-4">
                                <form onSubmit={handleSendEmail}>
                                    
                                    {/* Student Selection */}
                                    <label htmlFor="studentSelect" className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">Select Student:</label>
                                    <select
                                        id="studentSelect"
                                        className="mt-3 w-full p-2 border border-gray-300 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                        required
                                        onChange={(e) => setSelectedStudentId(e.target.value)}
                                        value={selectedStudentId}
                                    >
                                        <option value="">Select a Student</option>
                                        {students.map(student => (
                                            <option key={student.id} value={student.id}>{student.Name} {student.Surname}</option>
                                        ))}
                                    </select>

                                    {/* Meeting Date */}
                                    <label htmlFor="meetingDate" className="block mt-3 text-sm font-medium text-gray-800 dark:text-gray-300">Meeting Date:</label>
                                    <input
                                        type="date"
                                        id="meetingDate"
                                        className="mb-2 mt-2 w-full p-2 border border-gray-300 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                        value={meetingDate}
                                        onChange={(e) => setMeetingDate(e.target.value)}
                                        required
                                    />

                                    {/* Meeting Time */}
                                    <label htmlFor="meetingTime" className="block mt-3 text-sm font-medium text-gray-800 dark:text-gray-300">Meeting Time:</label>
                                    <input 
                                        type="time"
                                        id="meetingTime"
                                        className="mb-2 mt-2 w-full p-2 border border-gray-300 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                                        value={meetingTime}
                                        onChange={(e) => setMeetingTime(e.target.value)}
                                        required 
                                    />

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition mt-4 w-full"
                                    >
                                        Schedule Meeting
                                    </button>
                                </form>

                                {/* Email Status Message */}
                                {emailStatus && <p className="mt-2 text-sm text-green-500">{emailStatus}</p>}
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </aside>
    );
};
