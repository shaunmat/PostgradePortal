import { useEffect, useState } from "react";
import { collection, onSnapshot, getDocs } from "firebase/firestore";
import { HiBell, HiSearch, HiAcademicCap } from "react-icons/hi";
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



export const RightSidebar = () => {
    const { researchId } = useParams();
    const [notifications, setNotifications] = useState([]);
    const [newNotificationIDs, setNewNotificationIDs] = useState([]); // State to track new notification IDs
    const { UserData, UserRole, Loading } = useAuth();
    const { isDarkMode } = useTheme();
    const [playSound, setPlaySound] = useState(false); 
    const [UserLevel, setUserLevel] = useState('');
    const [students, setStudents] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [meetingDate, setMeetingDate] = useState('');
    const [meetingTime, setMeetingTime] = useState('');
    const [emailStatus, setEmailStatus] = useState('');
    const [CourseParser, setCourseParser] = useState('');
    const navigate = useNavigate();

    // UserRole === 'supervisor' ? 'Supervisor' : 'Student'
    const [quote, setQuote] = useState({ text: '', author: '' });

    // Function to fetch a random quote
    const fetchQuote = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/quote');
            const data = await response.json();
            setQuote({ text: data[0].q, author: data[0].a });
        } catch (error) {
            console.error('Error fetching quote:', error);
        }
    };

    // Fetch quote on component mount
    useEffect(() => {
        fetchQuote();
    }, []);

    useEffect(() => {
        if (!Loading && UserData) {
            setUserLevel(UserRole === 'Student' ? UserData.StudentType : UserRole);

            // Fetch assigned students
            const fetchStudents = async () => {
                if (!UserData.CourseID || UserData.CourseID.length === 0) return;

                const courseId = UserData.CourseID[0]; // Use the first CourseID
                console.log('Fetching students for CourseID:', courseId); // Log CourseID

                const studentsRef = collection(db, 'Student'); // Reference to the Student collection
                
                const unsubscribe = onSnapshot(studentsRef, (snapshot) => {
                    const studentList = [];
                    snapshot.forEach(doc => {
                        const studentData = doc.data();
                        // Filter students by CourseID
                        if (studentData.CourseID && studentData.CourseID.includes(courseId)) {
                            studentList.push({
                                id: doc.id,
                                ...studentData,
                            });
                            setCourseParser(courseId)
                            console.log('Filtered Students:', studentList); // Log filtered student list
                        }
                    });

                    setStudents(studentList);
                });

                return () => unsubscribe();
            };

            fetchStudents(); // Call the fetchStudents function
        }
    }, [Loading, UserData, UserRole]);

    // Helper function to check if assignment is due soon
    const checkIfDueSoon = (dueDate) => {
        const now = new Date();
        const due = new Date(dueDate);
        const timeDifference = due - now;
        return timeDifference > 0 && timeDifference <= 3 * 24 * 60 * 60 * 1000; // Due in 3 days or less
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!UserData || !UserData.CourseID || UserData.CourseID.length === 0) return;
    
            // Array to hold promises for fetching notifications from all course IDs
            const fetchPromises = UserData.CourseID.map(async (courseId) => {
                const assignmentsRef = collection(db, 'Module', courseId, 'Assignments');
    
                return new Promise((resolve) => {
                    const unsubscribe = onSnapshot(assignmentsRef, async (snapshot) => {
                        const newNotifications = [];
                        const newIDs = []; // Track new notification IDs
    
                        for (const change of snapshot.docChanges()) {
                            const assignmentData = change.doc.data();
                            const assignmentID = change.doc.id;
    
                            // If an assignment is newly added (posted)
                            if (change.type === "added") {
                                newNotifications.push({
                                    id: assignmentID, // Store ID for tracking
                                    type: "new",
                                    message: `New milestone unlocked.`, // Include course info
                                    timestamp: new Date(),
                                });
                                newIDs.push(assignmentID); // Add ID to new IDs
                            }
    
                            // If assignment due date is approaching
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
    
                    // Unsubscribe when the component unmounts
                    return () => unsubscribe();
                });
            });
    
            // Fetch events notifications
            const fetchEventNotifications = async () => {
                // Create a reference to the Events collection
                const eventsRef = collection(db, 'Events');
    
                const newEventNotifications = [];
    
                // Log User Data for debugging
                console.log('User Data:', UserData.SupervisorID);
    
                // Loop through each SupervisorID to fetch events
                for (const supervisorID of UserData.SupervisorID) {
                    // Create a query to filter events for the current supervisor
                    const filterEvents = query(eventsRef, where('SupervisorID', '==', supervisorID));
                    
                    // Fetch filtered events
                    const snapshot = await getDocs(filterEvents); // Use the filtered query here
    
                    // Log the number of events fetched
                    // console.log(`Fetched ${snapshot.docs.length} event(s) for supervisor ID ${supervisorID}.`);
    
                    // Iterate through the filtered documents
                    snapshot.forEach(doc => {
                        const eventData = doc.data();
                        newEventNotifications.push({
                            id: doc.id,
                            type: 'event',
                            message: `Meeting scheduled with ${eventData.SupervisorSurname} on ${eventData.date} at ${eventData.time}.`,
                            timestamp: new Date(),
                        });
                    });
                }
    
                // Log the event notifications created
                console.log('Event notifications created:', newEventNotifications);
    
                return newEventNotifications;
            };
    
            // Wait for all notifications to be fetched
            const notificationsResults = await Promise.all(fetchPromises);
            const eventNotifications = await fetchEventNotifications();
    
            // Combine results
            const allNewNotifications = notificationsResults.flatMap(result => result.newNotifications).concat(eventNotifications);
            const allNewIDs = notificationsResults.flatMap(result => result.newIDs);
    
            // Combine new notifications with previous notifications
            setNotifications((prevNotifications) => {
                const combinedNotifications = [...prevNotifications, ...allNewNotifications];
                const uniqueNotifications = Array.from(new Map(combinedNotifications.map(item => [item.id, item])).values()); // Use ID for uniqueness
                const updatedNotifications = uniqueNotifications.sort((a, b) => b.timestamp - a.timestamp).slice(0, 3);
                setNewNotificationIDs(allNewIDs);
    
                // Trigger sound playback if there are new notifications
                if (allNewNotifications.length > 0) {
                    setPlaySound(true); // Set state to play sound for each new notification
                }
    
                return updatedNotifications;
            });
        };
    
        fetchNotifications();
    }, [UserData]);
    
        
    
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
    
            const data = await response.json();
            setEmailStatus('Email sent successfully');
    
            // Store scheduled meeting in Events collection
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
    
            // Add notification for the scheduled meeting
            const meetingNotification = {
                id: `meeting-${new Date().getTime()}`, // Unique ID for the notification
                type: 'new',
                message: `Meeting scheduled with ${UserData.Surname} on ${meetingDate} at ${meetingTime}.`,
                timestamp: new Date(),
            };
            setNotifications((prevNotifications) => {
                // Combine new notification with previous notifications
                const combinedNotifications = [...prevNotifications, meetingNotification];
                const uniqueNotifications = Array.from(new Map(combinedNotifications.map(item => [item.message, item])).values());
                const updatedNotifications = uniqueNotifications.sort((a, b) => b.timestamp - a.timestamp).slice(0, 3);
                return updatedNotifications;
            });
    
            setTimeout(() => {
                setEmailStatus('');
            }, 5000);
    
            toast.success('Email sent successfully');
    
        } catch (error) {
            console.error('Error sending email:', error.message);
        }
    };
    
    
    return (
        <aside id="right-sidebar" className={`fixed top-0 right-0 w-16 md:w-48 lg:w-72 h-screen transition-transform translate-x-full md:translate-x-0 right-sidebar ${isDarkMode ? 'dark' : ''}`}>
            <div className="h-full px-3 py-4 overflow-y-auto bg-transparent dark:bg-gray-800">
                {UserRole === 'Student' && (
                    <div className="mb-4">
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
                                {notifications.length > 0 ? notifications.map((notification, index) => {
                                    // Set border and icon background color based on notification type
                                    const borderColor = notification.type === 'new' 
                                        ? 'border-[#FF8503]' // Color for new notifications
                                        : notification.type === 'due' 
                                            ? 'border-[#590098]' // Color for due notifications
                                            : 'border-[#007BFF]'; // Color for meeting notifications (change this color as needed)

                                    const iconBgColor = notification.type === 'new' 
                                        ? 'bg-[#FF8503]' // Background color for new notifications
                                        : notification.type === 'due' 
                                            ? 'bg-[#590098]' // Background color for due notifications
                                            : 'bg-[#007BFF]'; // Background color for meeting notifications (change this color as needed)

                                    return (
                                        <div
                                            key={`${notification.id}-${notification.timestamp.getTime()}-${index}`} // Added index to ensure uniqueness
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
                                        </div>
                                    );
                                }) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                                )}

                                {/* Play notification sound */}
                                {playSound && (
                                    <ReactAudioPlayer
                                        src={notificationSound}
                                        autoPlay
                                        controls={false}
                                        onEnded={() => setPlaySound(false)} // Reset playSound state
                                    />
                                )}
                            </div>
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
                            <form onSubmit={handleSendEmail} className="mt-4">
                                <label htmlFor="supervisorSelect" className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">Select classmate:</label>
                                <Select
                                    className="mb-4 mt-2"
                                    id="supervisorSelect"
                                    required
                                    onChange={(e) => setSelectedStudentId(e.target.value)}
                                    value={selectedStudentId}
                                >
                                    <option disabled value="">Select a classmate</option>
                                    {students
                                        .filter(student => student.id !== UserData.ID) // Filter out the current user
                                        .map(student => (
                                            <option key={student.id} value={student.id}>
                                                {student.Name} {student.Surname}
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

                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-4"
                                >
                                    Schedule Meeting
                                </button>
                            </form>
                            {emailStatus && <p className="mt-2 text-sm text-green-500">{emailStatus}</p>} {/* Display email status message */}
                        </div>
                    </div>
                )}

                {/* Supervisor-specific content */}
                {UserRole === 'Supervisor' && (
                    <div className="overflow-y-auto bg-transparent no-scrollbar p-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-300">Supervisor Panel</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">This is content only visible to supervisors.</p>
                        {/* Add more supervisor-specific content here */}

                        <div className="students-list mt-4">
                            <h4 className="text-md font-bold text-gray-800 dark:text-gray-300">Assigned Students</h4>
                            <ul className="space-y-2 mt-4">
                            {students.length > 0 ? students.map((student, index) => {
                                // Combine StudentData.ID and CourseHolder[0] to form PassedData
                                const PassedData = student.ID + "," + CourseParser; // Assuming CourseHolder is available here

                                return (
                                    <li key={index} className="flex items-center space-x-2">
                                        <button
                                            className="p-2 mr-2 bg-gray-200 rounded-full dark:bg-gray-600"
                                            onClick={() => navigate(`/Students/${PassedData}`)} // Navigate on click with PassedData
                                        >
                                            {student.Profilepicture ? (
                                                <img
                                                    src={student.Profilepicture}
                                                    alt={`${student.Name}'s profile`}
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                            ) : (
                                                <HiAcademicCap className="w-6 h-6" />
                                            )}
                                        </button>
                                        <div>
                                            <h5 className="text-sm font-medium text-gray-800 dark:text-gray-300">
                                                {student.Name} {student.Surname}
                                            </h5>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{student.ID}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{student.StudentType}</p>
                                        </div>
                                    </li>
                                );
                            }) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No students assigned</p>
                            )}

                            </ul>
                        </div>

                        <div className="meeting-scheduler mt-6">
                            <h4 className="text-md font-bold text-gray-800 dark:text-gray-300">Schedule a Meeting</h4>
                            <form onSubmit={handleSendEmail} className="mt-4">
                                <label htmlFor="studentSelect" className="block text-sm font-medium mb-1 text-gray-800 dark:text-gray-300">Select Student:</label>
                                <Select
                                    className="mb-4 mt-2"
                                    id="studentSelect"
                                    required
                                    onChange={(e) => setSelectedStudentId(e.target.value)}
                                    value={selectedStudentId}
                                >
                                    <option value="">Select a Student</option>
                                    {students.map(student => (
                                        <option key={student.id} value={student.id}>{student.Name} {student.Surname} </option>
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

                                <button
                                    // onClick={handleSendEmail}
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mt-4"
                                >
                                    Schedule Meeting
                                </button>
                            </form>
                            {emailStatus && <p className="mt-2 text-sm text-green-500">{emailStatus}</p>} {/* Display email status message */}
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};
