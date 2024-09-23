import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../backend/AuthContext";
import { collection, getDocs, addDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { db } from "../backend/config";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import { HiPlus } from "react-icons/hi";
import { TaskModal } from "../components/TaskModal"; // Adjust the import path as needed

export const PhD = () => {
    const { UserData, Loading } = useAuth();
    const [Assignments, setAssignments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskCreationDate, setNewTaskCreationDate] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');

    useEffect(() => {
        if (!Loading && UserData) {
            const cachedData = JSON.parse(localStorage.getItem('phdAssignments'));
            const cacheTimestamp = JSON.parse(localStorage.getItem('phdAssignmentsTimestamp'));

            // Check if cache is available and is less than 10 minutes old
            const cacheIsValid = cacheTimestamp && (Date.now() - cacheTimestamp < 10 * 60 * 1000);

            if (cachedData && cacheIsValid) {
                setAssignments(cachedData);
            } else {
                fetchAssignmentData();
            }
        }
    }, [Loading, UserData]);

    const fetchAssignmentData = async () => {
        const courseTypesArray = await fetchResearchAssignments(UserData.CourseID);
        setAssignments(courseTypesArray);
        localStorage.setItem('phdAssignments', JSON.stringify(courseTypesArray));
        localStorage.setItem('phdAssignmentsTimestamp', JSON.stringify(Date.now()));
    };

    const fetchResearchAssignments = async (CourseIDs) => {
        const typesSet = [];

        try {
            for (const courseID of CourseIDs) {
                const AssignmentRef = collection(db, 'Module', courseID, "Assignments");
                const q = query(AssignmentRef, orderBy("AssignmentCreation", "desc")); // Order by creation date, descending
                const AssignmentSnap = await getDocs(q);

                AssignmentSnap.forEach((docSnap) => {
                    if (docSnap.exists()) {
                        const moduleData = docSnap.data();
                        typesSet.push({
                            id: docSnap.id, // Add the document ID
                            ...moduleData,
                        });
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching course types:', error);
        }

        return typesSet;
    };

    const handleSave = async () => {
        if (!newTaskName || !newTaskDescription || !newTaskDueDate) {
            console.error("Please fill all fields.");
            return;
        }
    
        try {
            const creationDate = new Date();
            const dueDate = new Date(newTaskDueDate);
            const creationTimestamp = Timestamp.fromDate(creationDate);
            const courseID = UserData.CourseID[0];
    
            await addDoc(collection(db, 'Module', courseID, "Assignments"), {
                AssignmentTitle: newTaskName,
                AssignmentDescription: newTaskDescription,
                AssignmentDueDate: Timestamp.fromDate(dueDate),
                AssignmentCreation: creationTimestamp,
            });
    
            await fetchAssignmentData();
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
            <div className="p-4 border-2 border-gray-200  rounded-lg dark:border-gray-700 dark:bg-gray-800">                <section className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                            PhD
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

                <div className="flex flex-col gap-7">
                    {Assignments.length > 0 ? Assignments.map((assignment, index) => (
                        <Link 
                            to={`/courses/${UserData.CourseID[0]}/assignments/${assignment.id}`}
                            key={index} 
                            className="block w-full"
                        >
                            <motion.div 
                                className="border-2 rounded-lg overflow-hidden shadow-md p-4 w-full"
                                whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)" }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <h2 className="text-xl font-bold">{assignment.AssignmentTitle}</h2>
                                <p>{assignment.AssignmentDescription}</p>
                                <p>Due Date: {new Date(assignment.AssignmentDueDate.seconds * 1000).toLocaleString()}</p>
                                <p>Created On: {new Date(assignment.AssignmentCreation.seconds * 1000).toLocaleString()}</p>
                            </motion.div>
                        </Link>
                    )) : (
                        <p>No assignments available.</p>
                    )}
                </div>
                
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
