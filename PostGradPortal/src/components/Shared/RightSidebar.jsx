import { useEffect, useState, useRef } from "react";
import { collection, onSnapshot, doc, getDoc } from "firebase/firestore";
import { HiBell, HiSearch } from "react-icons/hi";
import { db } from "../../backend/config"; // Firebase configuration
import { useAuth } from "../../backend/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export const RightSidebar = () => {
    const [notifications, setNotifications] = useState([]);
    const [newNotificationIDs, setNewNotificationIDs] = useState([]); // State to track new notification IDs
    const { UserData } = useAuth();
    const { isDarkMode } = useTheme();
    
    // Create a ref for the notification sound
    const notificationSoundRef = useRef(null);

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

            const researchId = UserData.CourseID[0]; // Use the first CourseID for now
            const assignmentsRef = collection(db, 'Module', researchId, 'Assignments');

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
                            message: `New assignment posted: ${assignmentData.AssignmentTitle || 'Untitled'}`,
                            timestamp: new Date(),
                        });
                        newIDs.push(assignmentID); // Add ID to new IDs
                        
                        // Play notification sound
                        console.log("Attempting to play notification sound...");
                        if (notificationSoundRef.current) {
                            try {
                                await notificationSoundRef.current.play();
                                console.log("Notification sound played successfully.");
                            } catch (err) {
                                console.error("Error playing notification sound:", err);
                            }
                        } else {
                            console.log("notificationSoundRef.current is null");
                        }
                    }

                    // If assignment due date is approaching
                    if (assignmentData.AssignmentDueDate && checkIfDueSoon(assignmentData.AssignmentDueDate.toDate())) {
                        newNotifications.push({
                            id: assignmentID,
                            type: "due",
                            message: `Assignment "${assignmentData.AssignmentTitle || 'Untitled'}" is due soon.`,
                            timestamp: new Date(),
                        });
                    }

                    // Check if assignment has been submitted
                    const studentRef = doc(db, `Module/${researchId}/Assignments/${assignmentID}/StudentID/${UserData.ID}`);
                    const studentSnap = await getDoc(studentRef);
                    if (studentSnap.exists() && studentSnap.data().submitted) {
                        newNotifications.push({
                            id: assignmentID,
                            type: "submitted",
                            message: `You have submitted: ${assignmentData.AssignmentTitle || 'Untitled'}`,
                            timestamp: new Date(),
                        });
                    }
                }

                // Combine new notifications with previous notifications
                setNotifications((prevNotifications) => {
                    const allNotifications = [...prevNotifications, ...newNotifications];
                    const uniqueNotifications = Array.from(new Map(allNotifications.map(item => [item.message, item])).values());
                    const updatedNotifications = uniqueNotifications.sort((a, b) => b.timestamp - a.timestamp).slice(0, 3);
                    setNewNotificationIDs(newIDs);
                    return updatedNotifications;
                });
            });

            return () => unsubscribe();
        };

        fetchNotifications();
    }, [UserData]);

    return (
        <aside id="right-sidebar" className={`fixed top-0 right-0 w-16 md:w-48 lg:w-72 h-screen transition-transform translate-x-full md:translate-x-0 right-sidebar ${isDarkMode ? 'dark' : ''}`}>
            <div className="h-full px-3 py-4 overflow-y-auto bg-transparent no-scrollbar dark:bg-gray-800">
                <header className="flex items-center justify-between mb-4">
                    <div className="relative flex items-center w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-xl">
                        <HiSearch className="absolute left-3 text-gray-600 dark:text-gray-400" />
                        <input type="text" placeholder="Search..." className="w-full h-full pl-10 pr-3 bg-transparent border-none dark:text-gray-300 dark:placeholder-gray-400 focus:ring-0" />
                    </div>
                </header>

                <div className="mb-4">
                    <div className="w-full min-h-96 bg-gray-200 rounded-xl dark:bg-gray-700 overflow-y-auto no-scrollbar">
                        <div className="flex items-center justify-between p-3.5 dark:border-gray-600">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-300">Notifications</h2>
                            <button className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" onClick={() => {
                                setNotifications([]);
                                setNewNotificationIDs([]);
                            }}>
                                Clear All
                            </button>
                        </div>

                        <hr className="border-0 h-0.5 bg-gray-300 dark:bg-gray-600" />

                        <div className="p-2 space-y-2">
                        <div className="p-2 space-y-2">
                            {notifications.length > 0 ? notifications.map((notification, index) => (
                                <div key={`${notification.id}-${notification.timestamp.getTime()}`} className="relative flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-xl">
                                    {newNotificationIDs.includes(notification.id) && (
                                        <span className="absolute top-1 right-1 block w-2 h-2 bg-red-600 rounded-full"></span>
                                    )}
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-300">{notification.message}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{notification.timestamp.toLocaleTimeString()}</p>
                                    </div>
                                    <button className="p-2 bg-gray-200 rounded-full dark:bg-gray-600">
                                        <HiBell />
                                    </button>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-500 dark:text-gray-400">No notifications</p>
                            )}
                        </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Audio element to play notification sound */}
            <audio ref={notificationSoundRef} src="/assets/audio/pop-up-bubble.mp3" preload="auto" />

            {/* Test button for sound */}
            <button onClick={() => {
                if (notificationSoundRef.current) {
                    console.log("Playing sound manually...");
                    notificationSoundRef.current.play().then(() => {
                        console.log("Manual sound play successful.");
                    }).catch((err) => {
                        console.error("Error playing sound manually:", err);
                    });
                } else {
                    console.log("notificationSoundRef.current is null");
                }
            }}>Test Sound</button>
        </aside>
    );
};
