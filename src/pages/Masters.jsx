import { useEffect, useState } from "react";
import { useAuth } from "../backend/AuthContext";
import { collection, getDocs, addDoc, Timestamp, query, orderBy, doc, getDoc } from "firebase/firestore";
import { db } from "../backend/config";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import { HiPlus } from "react-icons/hi";
import { TaskModal } from "../components/TaskModal"; // Adjust the import path as needed

export const Masters = () => {
    const { UserData, Loading } = useAuth();
    const [Assignments, setAssignments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');
    const [newTaskCreationDate, setNewTaskCreationDate] = useState('');
    const [RelaventModule, setRelaventModule] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (!Loading && UserData) {
                if (UserData.CourseID.length > 1) {
                    const moduleID = await RelevantCourseCheck(UserData.CourseID);
                    if (moduleID) {
                        setRelaventModule(moduleID);
                        fetchAssignmentData(moduleID);
                    }
                } else {
                    setRelaventModule(UserData.CourseID[0]);
                    fetchAssignmentData(UserData.CourseID[0]);
                }
            }
        };

        fetchData();
    }, );

    const fetchAssignmentData = async (courseID) => {
        const courseTypesArray = await fetchResearchAssignments(courseID);
        setAssignments(courseTypesArray);
    };

    const RelevantCourseCheck = async (CourseIDs) => {
        try {
            for (const courseID of CourseIDs) {
                const moduleRef = doc(db, 'Module', courseID); 
                const moduleSnap = await getDoc(moduleRef);

                if (moduleSnap.exists()) {
                    const moduleData = moduleSnap.data();
                    if (moduleData.ModuleType === "Masters") {
                        return courseID; // Return the relevant courseID
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching course types:', error);
        }
        return null; // Return null if no relevant module found
    };

    const fetchResearchAssignments = async (courseID) => {
        const typesSet = [];

        try {
            const AssignmentRef = collection(db, 'Module', courseID, "Assignments");
            const q = query(AssignmentRef, orderBy("AssignmentCreation", "desc")); // Order by creation date, descending
            const AssignmentSnap = await getDocs(q);

            AssignmentSnap.forEach((docSnap) => {
                if (docSnap.exists()) {
                    const moduleData = docSnap.data();
                    typesSet.push(moduleData);
                }
            });
        } catch (error) {
            console.error('Error fetching assignments:', error);
        }

        return typesSet;
    };

    const handleSave = async () => {
        // Check if all required fields are filled
        if (!newTaskName || !newTaskDescription || !newTaskDueDate) {
            console.error("Please fill all fields.");
            return;
        }

        try {
            console.log(newTaskCreationDate)
            // Get current date and time for the creation date
            const creationDate = new Date();
            
            // Convert dates to Firestore Timestamp format
            const dueDate = new Date(newTaskDueDate); // Convert due date to Date object
            const creationTimestamp = Timestamp.fromDate(creationDate); // Convert to Firestore Timestamp
            
            // Use the relevant module for the collection path
            const courseID = RelaventModule;
    
            // Add the new assignment to Firestore
            await addDoc(collection(db, 'Module', courseID, "Assignments"), {
                AssignmentTitle: newTaskName,
                AssignmentDescription: newTaskDescription,
                AssignmentDueDate: Timestamp.fromDate(dueDate), // Convert to Firestore Timestamp
                AssignmentCreation: creationTimestamp,
            });
    
            // Close modal and reset state
            await fetchAssignmentData(courseID);
            setIsModalOpen(false);
            setNewTaskName("");
            setNewTaskDescription("");
            setNewTaskDueDate("");
        } catch (error) {
            console.error("Error adding new assignment:", error);
        }
    };

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 dark:bg-gray-800">
                {/* Header with Add Button */}
                <section className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                            Masters
                        </h1>
                        <p className="text-lg font-normal mt-5 text-gray-700 dark:text-gray-400">
                            Here are all the assignments you have posted.
                        </p>
                    </div>
                    <button 
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <HiPlus className="mr-2" />
                        Add New Assignment
                    </button>
                </section>

                <div className="flex flex-wrap gap-7">
                    {Assignments.length > 0 ? Assignments.map((assignment, index) => (
                        <motion.div 
                            key={index} 
                            className="border-2 rounded-lg overflow-hidden shadow-md p-4 w-full"
                            whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)" }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <h2 className="text-xl font-bold">{assignment.AssignmentTitle}</h2>
                            <p>{assignment.AssignmentDescription}</p>
                            <p>Due Date: {new Date(assignment.AssignmentDueDate.seconds * 1000).toLocaleString()}</p>
                            <p>Created On: {new Date(assignment.AssignmentCreation.seconds * 1000).toLocaleString()}</p>
                        </motion.div>
                    )) : (
                        <p>No assignments available.</p>
                    )}
                </div>

                {/* Task Modal */}
                <TaskModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSave={handleSave} 
                    setNewTaskName={setNewTaskName} 
                    setNewTaskDescription={setNewTaskDescription} 
                    setNewTaskDueDate={setNewTaskDueDate} 
                    setNewTaskCreationDate={setNewTaskCreationDate}
                />

                <Footer />
            </div>
        </div>
    );
};
