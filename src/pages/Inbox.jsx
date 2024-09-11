import { useEffect, useState } from "react";
import { Footer } from "../components/Footer";
import { Modal } from "../components/Modal";
import { motion } from "framer-motion";
import avatar from "../assets/images/avatar.png";
import { auth, db } from "../backend/config"; // Import your firebase config
import { getDocs, query, collection, where } from "firebase/firestore";
import { useAuth } from "../backend/authcontext";

export const Inbox = () => {
    const { CurrentUser } = useAuth();
    const [studentDetails, setStudentDetails] = useState([]);
    const [selectedLecturer, setSelectedLecturer] = useState(null);
    const [supervisorDetails, setSupervisorDetails] = useState([]);
    const [SupervisorID, setSupervisorID] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courseOptions, setCourseOptions] = useState([]);
    const [role, setRole] = useState(null);
    const [filterCourseID, setFilterCourseID] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userId = user.email.substring(0, 9);
                setSupervisorID(userId);

                const userDoc = await getDocs(query(collection(db, 'Supervisor'), where('SupervisorID', '==', Math.floor(userId))));

                if (!userDoc.empty) {
                    setRole('Supervisor');
                } else {
                    const studentDoc = await getDocs(query(collection(db, 'Student'), where('StudentID', '==', userId)));
                    if (!studentDoc.empty) {
                        setRole('Student');
                    }
                }
            } else {
                setSupervisorID(null);
                setRole(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchModules = async () => {
            if (!SupervisorID || !role) return;
            try {
                let q;
                if (role === 'Supervisor') {
                    q = collection(db, 'Student');
                    if (filterCourseID) {
                        q = query(q, where('SupervisorID', 'array-contains', Math.floor(SupervisorID)), where('CourseID', '==', Math.floor(filterCourseID)));
                    } else {
                        q = query(q, where('SupervisorID', 'array-contains', Math.floor(SupervisorID)));
                    }
                } else if (role === 'Student') {
                    q = collection(db, 'Supervisor');
                    q = query(q, where('StudentID', '==', Math.floor(SupervisorID)));
                }

                const querySnapshot = await getDocs(q);
                const studentdetsArray = [];
                const supervisorsArray = [];
                const courseIdArray = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (role === 'Supervisor') {
                        studentdetsArray.push({
                            ProfilePicture: data.ProfilePicture,
                            StudentID: data.StudentID,
                            StudentName: data.StudentName,
                            StudentSurname: data.StudentSurname,
                            lastInteraction: "Just now"
                        });
                        courseIdArray.push({
                            CourseID: data.CourseID
                        });
                    } else if (role === 'Student') {
                        supervisorsArray.push({
                            ProfilePicture: data.ProfilePicture,
                            SupervisorID: data.SupervisorID,
                            SupervisorName: data.SupervisorName,
                            SupervisorSurname: data.SupervisorSurname,
                        });
                    }
                });

                setStudentDetails(studentdetsArray);
                setSupervisorDetails(supervisorsArray);
                setCourseOptions(courseIdArray);
            } catch (error) {
                console.error("Error fetching details:", error);
            }
        };

        fetchModules();
    }, [SupervisorID, role, filterCourseID]);

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

    const handleFilterByCourseID = (CourseID) => {
        setFilterCourseID(CourseID);
    };

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
                {/* Display lecturers */}
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
                                            {lecturer.SupervisorName}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Office Hours: 24hr
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {lecturer.CourseID}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                    </div>
                ) : role === 'Supervisor' ? (
                    <div className="flex flex-wrap gap-2 max-w-full">
                        <div className="course-filter mb-4">
                            <label>Filter by Course ID:</label>
                            <select onChange={(e) => handleFilterByCourseID(e.target.value)}>
                                <option value="">All courses</option>
                                {courseOptions.map((course, index) => (
                                    <option key={index} value={course.CourseID}>
                                        {course.CourseID}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {studentDetails.map((student, index) => (
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
                                <div className="flex flex-row flex-1 justify-items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                        {student.StudentName} {student.StudentSurname}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Course Id: {student.CourseID}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Stu No.: {student.StudentID}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : 
                console.log("There is nothing ")
            }
                <Footer />
            </div>

            {/* Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal} lecturer={selectedLecturer} student={selectedStudent} />
        </div>
    );
};
