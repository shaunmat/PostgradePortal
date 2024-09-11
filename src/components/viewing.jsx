import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { Modal } from "../components/Modal";
import { motion } from "framer-motion";
import { auth, db } from "../backend/config";
import { getDocs, query, collection, where } from "firebase/firestore";
import { useAuth } from "../backend/authcontext";
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

export const Inbox = () => {
    const { CurrentUser } = useAuth();
    const [studentDetails, setStudentDetails] = useState([]);
    const [supervisorDetails, setSupervisorDetails] = useState([]);
    const [SupervisorID, setSupervisorID] = useState(null);
    const [StudentID, setStudentID] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedLecturer, setSelectedLecturer] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [role, setRole] = useState(null);
    const [filterCourseID, setFilterCourseID] = useState(null);
    const [selectedStudentType, setSelectedStudentType] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userId = user.email.substring(0, 9);  // Extract ID from email
                try {
                    const supervisorDoc = await getDocs(query(collection(db, 'Supervisor'), where('ID', '==', userId))); // Removed Math.floor
                    if (!supervisorDoc.empty) {
                        setRole('Supervisor');
                        setSupervisorID(userId);
                    } else {
                        const studentDoc = await getDocs(query(collection(db, 'Student'), where('ID', '==', userId))); // Fixed Match.floor typo
                        if (!studentDoc.empty) {
                            setRole('Student');
                            setStudentID(userId);
                        } else {
                            console.log("No matching records found in Supervisor or Student collections");
                        }
                    }
                } catch (error) {
                    console.error("Error querying Firestore:", error);
                }
            } else {
                setSupervisorID(null);
                setStudentID(null);
                setRole(null);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!SupervisorID && !StudentID && !role) return;

            try {
                let q;
                if (role === 'Supervisor' && SupervisorID) {
                    q = query(collection(db, 'Student'), where('SupervisorID', 'array-contains', SupervisorID)); // Removed Math.floor
                    const querySnapshot = await getDocs(q);
                    const studentdetsArray = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        studentdetsArray.push({
                            ProfilePicture: data.ProfilePicture,
                            StudentID: data.ID,
                            StudentName: data.Name,
                            StudentSurname: data.Surname,
                            lastInteraction: "Just now",
                            StudentType: data.StudentType
                        });
                    });
                    setStudentDetails(studentdetsArray);
                } else if (role === 'Student' && StudentID) {
                    const studentDocs = await getDocs(query(collection(db, 'Student'), where('ID', '==', StudentID)));
                    if (!studentDocs.empty) {
                        const studentData = studentDocs.docs[0].data();
                        const supervisorIDs = studentData.SupervisorID; // Retrieve SupervisorID array from student doc

                        // Query supervisor collection based on SupervisorIDs
                        const supervisorDocs = await getDocs(query(collection(db, 'Supervisor'), where('ID', 'in', supervisorIDs)));
                        const supervisorArray = [];
                        supervisorDocs.forEach((doc) => {
                            const data = doc.data();
                            supervisorArray.push({
                                SupervisorID: data.ID,
                                SupervisorName: data.Name,
                                SupervisorSurname: data.Surname,
                                ProfilePicture: data.ProfilePicture
                            });
                        });
                        setSupervisorDetails(supervisorArray);
                    }
                }
            } catch (error) {
                console.error("Error fetching details:", error);
            }
        };
        fetchDetails();
    }, [StudentID, role, SupervisorID, filterCourseID]);

    const handleLecturerClick = (lecturer) => {
        setSelectedLecturer(lecturer);
        setIsModalOpen(true);
    };

    const handleStudentClick = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleFilterByStudentType = (studentType) => {
        setSelectedStudentType(studentType);
    };

    const filteredStudents = studentDetails.filter(student => {
        if (!selectedStudentType) return true;
        return student.StudentType === selectedStudentType;
    });

    const borderColors = ['border-[#00ad43]', 'border-[#00bfff]', 'border-[#590098]', 'border-[#FF8503]'];

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 dark:bg-gray-800">
                <section className="mb-6">
                    <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                        {role === 'Student' ? 'Your Inbox' : 'Supervisor Inbox'}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-6">
                        {role === 'Student'
                            ? 'Here you can view all your messages and supervisors.'
                            : 'Here you can view all your messages and students.'}
                    </p>
                </section>

                {/* Display Supervisors */}
                {role === 'Student' ? (
                    <div className="flex flex-wrap gap-2 max-w-full">
                        {supervisorDetails.map((lecturer, index) => (
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
                                        {lecturer.SupervisorName}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">Supervisor ID: {lecturer.SupervisorID}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : role === 'Supervisor' ? (
                    <div className="flex flex-wrap gap-2 max-w-full">
                        <DropdownButton id="dropdown-basic-button" title="Student Courses" style={{ backgroundColor: 'orange', borderColor: 'orange' }}>
                            <Dropdown.Item onClick={() => handleFilterByStudentType('Honours')}>Honours</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleFilterByStudentType('Masters')}>Masters</Dropdown.Item>
                            <Dropdown.Item onClick={() => handleFilterByStudentType('PhD')}>PhD</Dropdown.Item>
                        </DropdownButton>

                        {filteredStudents.map((student, index) => (
                            <motion.div
                                key={student.StudentID}
                                className={`flex items-center p-4 mb-4 bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 w-full rounded-lg shadow-md ${borderColors[index % borderColors.length]} border-2`}
                                onClick={() => handleStudentClick(student)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <img
                                    src={student.ProfilePicture}
                                    alt={student.StudentName}
                                    className="w-12 h-12 mr-4 rounded-full"
                                />
                               
