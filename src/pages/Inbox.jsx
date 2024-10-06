import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { Modal } from "../components/Modal";
import { motion } from "framer-motion";
import avatar from "../assets/images/Avatar.png";
import { auth, db } from "../backend/config"; // Import your firebase config
import { getDocs, query, collection, where } from "firebase/firestore";
import { useAuth } from "../backend/authcontext";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, serverTimestamp } from "firebase/firestore";
export const Inbox = () => {
    const { CurrentUser, UserData } = useAuth();
    const [studentDetails, setStudentDetails] = useState([]);
    const [selectedLecturer, setSelectedLecturer] = useState(null);
    const [supervisorDetails, setSupervisorDetails] = useState([]);
    const [SupervisorID, setSupervisorID] = useState(null);
    const [StudentID, setStudentID] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courseOptions, setCourseOptions] = useState([]);
    const [role, setRole] = useState(null);
    const [filterCourseID, setFilterCourseID] = useState(null);
    const [selectedStudentType, setSelectedStudentType] = useState(null);
    const [chatId,setChatId]=useState(null);
    const [examinerDetails, setExaminerDetails] = useState(null);
    const [examinerName , setExaminerName] = useState(null);
    const [examinerSurname, setExaminerSurname] = useState(null);
    const [examinerID, setExaminerID] = useState(null);
    const [examinerTitle, setExaminerTitle] = useState(null);
    const [examinerProfilePicture, setExaminerProfilePicture] = useState(null);

    useEffect(() => {
        if(UserData){
            setExaminerName(UserData.ExaminerName);
            setExaminerSurname(UserData.ExaminerSurname);
            setExaminerID(UserData.ExaminerID);
            setExaminerTitle(UserData.Title);
            setExaminerProfilePicture(UserData.ProfilePicture);
        }

    }, [UserData]);



    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userId = user.email.substring(0, 9);
                console.log("Here is the userId", userId);
                try {
                    // Check if the user is a Supervisor
                    const supervisorDoc = await getDocs(query(collection(db, 'Supervisor'), where('ID', '==', Math.floor(userId))));
                    if (!supervisorDoc.empty) {
                        setRole('Supervisor');
                        setSupervisorID(userId);
                    } else {
                        // Check if the user is a Student
                        const studentDoc = await getDocs(query(collection(db, 'Student'), where('ID', '==', Math.floor(userId))));
                        if (!studentDoc.empty) {
                            setRole('Student');
                            setStudentID(userId);
                        } else {
                            // Check if the user is an Examiner
                            const examinerDoc = await getDocs(query(collection(db, 'Examiner'), where('ExaminerID', '==', userId)));
                            if (!examinerDoc.empty) {
                                setRole('Examiner');
                                const examinerData = examinerDoc.docs[0].data();
                                setExaminerDetails({
                                    ExaminerID: examinerData.ExaminerID,
                                    ExaminerName: examinerData.ExaminerName,
                                    ExaminerSurname: examinerData.ExaminerSurname,
                                    Title: examinerData.Title,
                                });
                            } else {
                                console.log("No matching records found in Supervisor, Student, or Examiner collections");
                            }
                        }
                    }
                } catch (error) {
                    console.error("Error querying Firestore:", error);
                }
            } else {
                // User is logged out
                setSupervisorID(null);
                setStudentID(null);
                setExaminerDetails(null);
                setRole(null);
                console.log("No user is logged in");
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchDetails = async () => {
            const studentdetsArray = [];
            const supervisorsArray = [];
            const courseIdArray = [];
            try {
                let q;
                if (role === 'Supervisor') {
                    q = query(collection(db, 'Student'), where('SupervisorID', 'array-contains', Math.floor(SupervisorID)));
                    const querySnapshot = await getDocs(q);
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        studentdetsArray.push({
                            ProfilePicture: data.ProfilePicture || avatar,
                            StudentID: data.ID,
                            StudentName: data.Name,
                            StudentSurname: data.Surname,
                            lastInteraction: "Just now",
                            StudentType: data.StudentType
                        });
                        courseIdArray.push({
                            CourseID: data.StudentType,
                            CourseName: data.CourseName
                        });
                    });
                } else if (role === 'Student' && StudentID) {
                    const studentDocs = await getDocs(query(collection(db, 'Student'), where('ID', '==', Math.floor(StudentID))));
                    if (!studentDocs.empty) {
                        const studentData = studentDocs.docs[0].data();
                        const supervisorIDs = studentData.SupervisorID;

                        const supervisorDocs = await getDocs(query(collection(db, 'Supervisor'), where('ID', 'in', supervisorIDs)));
                        supervisorDocs.forEach((doc) => {
                            const data = doc.data();
                            supervisorsArray.push({
                                SupervisorID: data.ID,
                                SupervisorName: data.Name,
                                SupervisorSurname: data.Surname,
                                SupervisorCourseName: data.CourseName,
                                ProfilePicture: data.ProfilePicture || avatar,
                                Title: data.Title
                            });
                        });
                    }
                } else if (role === 'Examiner' && examinerDetails) {
                    // Logic to fetch relevant students for examiner
                    const studentDocs = await getDocs(query(collection(db, 'Student'), where('ExaminerID', '==', examinerDetails.ExaminerID)));
                    studentDocs.forEach((doc) => {
                        const data = doc.data();
                        studentdetsArray.push({
                            ProfilePicture: data.ProfilePicture || avatar,
                            StudentID: data.ID,
                            StudentName: data.Name,
                            StudentSurname: data.Surname,
                            lastInteraction: "Just now",
                            StudentType: data.StudentType
                        });
                    });
                }

                setStudentDetails(studentdetsArray);
                setSupervisorDetails(supervisorsArray);
                setCourseOptions(courseIdArray);
            } catch (error) {
                console.error("Error fetching details:", error);
            }
        };
        

        fetchDetails();
    }, [StudentID, SupervisorID, role, examinerDetails]);



    // Function to create or get the chat document
    const createOrGetChat = async (user1, user2) => {
        // Create a consistent chat ID by ordering user IDs
        const chatId = user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
        const chatRef = doc(db, 'chats', chatId);

        const chatDoc = await getDoc(chatRef);
        if (!chatDoc.exists()) {
            // Create a new chat document
            await setDoc(chatRef, {
                users: [user1, user2],
                createdAt: serverTimestamp(),
            });
            console.log("New chat document created with ID:", chatId);
        } else {
            console.log("Chat document already exists with ID:", chatId);
        }

        return chatId;
    };

    const handleLecturerClick = async (lecturer) => {
        setSelectedLecturer(lecturer);

        const currentUserId = role === 'Supervisor' ? SupervisorID : StudentID;

        
        // Create or get chat between the current user and the selected lecturer
        const newchatId = await createOrGetChat(currentUserId, lecturer.SupervisorID);
        
        // You can now use this chatId to load or send messages
        setChatId(newchatId);
        setIsModalOpen(true);
    };

    const handleStudentClick = async (student) => {
        setSelectedStudent(student);
        const currentUserId = role === 'Supervisor' ? SupervisorID : StudentID;
        
        // Create or get chat between the current user and the selected student
        const newChatId = await createOrGetChat(currentUserId, student.StudentID);
        
        setChatId(newChatId);
        // You can now use this chatId to load or send messages
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setChatId(null); // Reset chatId when closing the modal
    };

    const handleFilterByStudentType = (studentType) => {
        setSelectedStudentType(studentType); // Set the selected student type

    };

    const filteredStudents = studentDetails.filter(student => {
        if (!selectedStudentType) return true;
        return student.StudentType == selectedStudentType;
    })
  
    const borderColors = ['border-[#00ad43]', 'border-[#00bfff]', 'border-[#590098]', 'border-[#FF8503]'];

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border min-h-screen border-gray-200 border-dashed rounded-lg dark:border-gray-700 dark:bg-gray-800">
                <section className="mb-2">
                    <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                        {role === 'Student' ? 'Your Inbox' : role === 'Supervisor' ? 'Supervisor Inbox' : 'Examiner Inbox'}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-2 mb-6">
                        {role === 'Student'
                            ? 'Here you can view all your messages and supervisors.'
                            : role === 'Supervisor'
                            ? 'Here you can view all your messages and students.'
                            : 'Here you can view all your messages and communicate with supervisors.'}
                    </p>
                </section>
    
                {/* Display content based on role */}
                {role === 'Student' ? (
                    <div className="flex flex-wrap gap-2 max-w-full">
                        {supervisorDetails &&
                            supervisorDetails.map((lecturer, index) => (
                                <motion.div
                                    key={lecturer.SupervisorID}
                                    className={`flex items-center p-4 mb-4 bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 w-full rounded-lg shadow-md ${borderColors[index % borderColors.length]} border-2`}
                                    onClick={() => handleLecturerClick(lecturer)}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <img
                                        src={lecturer.ProfilePicture}
                                        alt={lecturer.SupervisorName}
                                        className="w-12 h-12 mr-4 rounded-full"
                                    />
                                    <div className="flex flex-row flex-1 justify-items-center justify-between">
                                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                            {lecturer.Title} {lecturer.SupervisorName} {lecturer.SupervisorSurname}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Office Hours: 8:00 - 16:00
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Supervisor ID: {lecturer.SupervisorID}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                ) : role === 'Supervisor' ? (
                    <div className="flex flex-wrap gap-2 max-w-full">
                        {filteredStudents.map((student, index) => (
                            <motion.div
                                key={student.StudentID}
                                className={`flex items-center p-4 mb-4 bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 w-full rounded-lg shadow-md ${borderColors[index % borderColors.length]} border-2`}
                                onClick={() => handleStudentClick(student)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <img
                                    src={student.ProfilePicture}
                                    alt={student.StudentName}
                                    className="w-12 h-12 mr-4 rounded-full"
                                />
                                <div className="flex flex-row flex-1 justify-items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                        {student.StudentName} {student.StudentSurname}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Student Type: {student.StudentType}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Stu No.: {student.StudentID}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : role === 'Examiner' ? (
                    <div className="flex flex-wrap gap-2 max-w-full">
                        {/* Display all supervisors */}
                        {supervisorsArray.map((supervisor, index) => (
                            <motion.div
                                key={supervisor.SupervisorID}
                                className={`flex items-center p-4 mb-4 bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 w-full rounded-lg shadow-md ${borderColors[index % borderColors.length]} border-2`}
                                onClick={() => handleLecturerClick(supervisor)}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <img
                                    src={supervisor.ProfilePicture}
                                    alt={supervisor.SupervisorName}
                                    className="w-12 h-12 mr-4 rounded-full"
                                />
                                <div className="flex flex-row flex-1 justify-items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                        {supervisor.Title} {supervisor.SupervisorName} {supervisor.SupervisorSurname}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Office Hours: 8:00 - 16:00
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Supervisor ID: {supervisor.SupervisorID}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    console.log("There is nothing")
                )}
                <Footer />
            </div>
    
            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                data={role === 'Student' ? selectedLecturer : role === 'Supervisor' ? selectedStudent : examinerDetails}
                role={role}
                chatId={chatId}
            />
        </div>
    );
};    
