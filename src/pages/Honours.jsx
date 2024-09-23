import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../backend/AuthContext";
import { collection, getDocs, addDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { db, storage } from "../backend/config";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import { HiPlus } from "react-icons/hi";
import { TaskModal } from "../components/TaskModal";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

export const Honours = () => {
    const { UserData, Loading } = useAuth();
    const [Assignments, setAssignments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskName, setNewTaskName] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');
    const [topics, setTopics] = useState([]);
    const [newTopicName, setNewTopicName] = useState('');
    const [newTopicDescription, setNewTopicDescription] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!Loading && UserData) {
            fetchAssignmentData();
            fetchTopics();
        }
    }, [Loading, UserData]);

    const fetchAssignmentData = async () => {
        localStorage.removeItem('assignments'); // Clear cache for fresh data
        const courseTypesArray = await fetchResearchAssignments(UserData.CourseID);
        setAssignments(courseTypesArray);
        localStorage.setItem('assignments', JSON.stringify(courseTypesArray)); // Cache data
    };

    const fetchResearchAssignments = async (CourseIDs) => {
        const typesSet = [];
        try {
            const promises = CourseIDs.map(async (courseID) => {
                const AssignmentRef = collection(db, 'Module', courseID, "Assignments");
                const q = query(AssignmentRef, orderBy("AssignmentCreation", "desc"));
                const AssignmentSnap = await getDocs(q);
                console.log(`Fetched ${AssignmentSnap.size} assignments for course ID: ${courseID}`);

                AssignmentSnap.forEach((docSnap) => {
                    if (docSnap.exists()) {
                        const moduleData = docSnap.data();
                        typesSet.push({
                            id: docSnap.id,
                            ...moduleData,
                        });
                    }
                });
            });

            await Promise.all(promises);
            console.log("Fetched Assignments:", typesSet); // Debug log
        } catch (error) {
            console.error('Error fetching course types:', error);
        }
        return typesSet;
    };

    const fetchTopics = async () => {
        const cachedTopics = localStorage.getItem('topics');
        if (cachedTopics) {
            setTopics(JSON.parse(cachedTopics));
        } else {
            try {
                const topicsRef = ref(storage, 'r_topics/topics.json');
                const url = await getDownloadURL(topicsRef);
                const response = await fetch(url);
                const topicsData = await response.json();
                setTopics(topicsData);
                localStorage.setItem('topics', JSON.stringify(topicsData)); // Cache data
            } catch (error) {
                console.error("Error fetching topics:", error);
                setTopics([]);
            }
        }
    };

    const handleAddTopic = async () => {
        if (!newTopicName || !newTopicDescription) {
            alert("Please fill in both the topic name and description.");
            return;
        }
        setLoading(true);
        try {
            const newTopic = {
                id: uuidv4(),
                topicName: newTopicName,
                description: newTopicDescription,
                isSelected: false,
                selectedBy: null
            };
            const updatedTopics = [...topics, newTopic];
            const updatedTopicsBlob = new Blob([JSON.stringify(updatedTopics)], { type: 'application/json' });
            const topicsRef = ref(storage, 'r_topics/topics.json');
            await uploadBytes(topicsRef, updatedTopicsBlob);
            setNewTopicName('');
            setNewTopicDescription('');
            setTopics(updatedTopics);
            localStorage.setItem('topics', JSON.stringify(updatedTopics)); // Update cache
            alert("Topic added successfully!");
        } catch (error) {
            console.error("Error adding topic:", error);
            alert("Error adding topic, please try again.");
        } finally {
            setLoading(false);
        }
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

            await fetchAssignmentData(); // Refresh assignment data
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
            <div className="p-4 border-2 border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800">
                <section className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                            Honours
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
                />

                <h2 className="text-2xl font-bold mt-6 text-gray-800 dark:text-gray-200">Add Research Topics</h2>

                <div className="mt-6">
                    <label className="block text-gray-800 dark:text-gray-200 font-bold">Topic Name:</label>
                    <input
                        type="text"
                        className="w-full p-2 mt-2 mb-4 border rounded"
                        value={newTopicName}
                        onChange={(e) => setNewTopicName(e.target.value)}
                    />

                    <label className="block text-gray-800 dark:text-gray-200 font-bold">Description:</label>
                    <textarea
                        className="w-full p-2 mt-2 mb-4 border rounded"
                        value={newTopicDescription}
                        onChange={(e) => setNewTopicDescription(e.target.value)}
                    ></textarea>

                    <button
                        onClick={handleAddTopic}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                        disabled={loading}
                    >
                        {loading ? 'Adding...' : 'Add Topic'}
                    </button>
                </div>

                <h2 className="text-2xl font-bold mt-6 text-gray-800 dark:text-gray-200">Existing Topics</h2>
                <ul className="mt-4 space-y-4">
                    {topics.length > 0 ? (
                        topics.map((topic, index) => (
                            <li key={index} className="p-4 border rounded shadow">
                                <h3 className="text-xl font-semibold">{topic.topicName}</h3>
                                <p>{topic.description}</p>
                                <p>Status: {topic.isSelected ? 'Selected' : 'Available'}</p>
                            </li>
                        ))
                    ) : (
                        <p>No topics available yet.</p>
                    )}
                </ul>

                <Footer />
            </div>
        </div>
    );
};
