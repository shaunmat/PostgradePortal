import { useState, useEffect } from "react";
import { Footer } from "../components/Footer";
import { Modal } from "../components/Modal";
import { motion } from "framer-motion";
import avatar from "../assets/images/avatar.png";

export const Inbox = () => {
    const [selectedLecturer, setSelectedLecturer] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        if (role) {
            setUserRole(role);
        }
    }, []);

    const lecturers = [
        {
            id: 1,
            name: "Dr. John Doe",
            officeHours: "10:00 - 12:00",
            email: "johndoe@gmail.com",
            module: "Business Analysis",
            building: "Block A21",
            avatar: avatar,
        },
        {
            id: 2,
            name: "Prof. Jane Doe",
            officeHours: "14:00 - 16:00",
            email: "janedoe@gmail.com",
            module: "Software Dev",
            building: "Block B12",
            avatar: avatar,
        },
        {
            id: 3,
            name: "Mr. John Smith",
            officeHours: "08:00 - 10:00",
            email: "johnsmith@gmail.com",
            module: "Software Project",
            building: "Block C3",
            avatar: avatar,
        },
        {
            id: 4,
            name: "Mrs. Jane Smith",
            officeHours: "12:00 - 14:00",
            email: "janesmith@gmail.com",
            module: "Software Testing",
            building: "Block D5",
            avatar: avatar,
        },
    ];

    const students = [
        {
            id: 1,
            name: "Shaun Matjila",
            email: "shaunmatjila@student.uj.ac.za",
            module: "Business Analysis",
            avatar: avatar,
        },
        {
            id: 2,
            name: "Matthew Mole",
            email: "matthew@student.ac.za",
            module: "Software Dev",
            avatar: avatar,
        },
        {
            id: 3,
            name: "James Smith",
            email: "james@student.ac.za",
            module: "Software Project",
            avatar: avatar,
        },
    ];

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
        setSelectedLecturer(null);
        setSelectedStudent(null);
    };

    const borderColors = [
        "border-[#00ad43]",
        "border-[#00bfff]",
        "border-[#590098]",
        "border-[#FF8503]",
    ];

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 dark:bg-gray-800">
                <section className="mb-6">
                    <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                        {userRole === "student"
                            ? "Your Inbox"
                            : userRole === "examiner"
                            ? "Examiner Inbox"
                            : "Supervisor Inbox"}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mt-6">
                        {userRole === "student"
                            ? "Here you can view all your messages and supervisors."
                            : userRole === "examiner"
                            ? "Here you can view all your messages and lecturers."
                            : "Here you can view all your messages and students."}
                    </p>
                </section>

                {/* Display content based on role */}
                {userRole === "student" ? (
                    <div className="flex flex-wrap gap-2 max-w-full">
                        {lecturers.map((lecturer, index) => (
                            <motion.div
                                key={lecturer.id}
                                className={`flex items-center p-4 mb-4 bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 w-full rounded-lg shadow-md ${borderColors[index % borderColors.length]} border-2`}
                                onClick={() => handleLecturerClick(lecturer)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <img
                                    src={lecturer.avatar}
                                    alt={lecturer.name}
                                    className="w-12 h-12 mr-4 rounded-full"
                                />
                                <div className="flex flex-row flex-1 justify-items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                        {lecturer.name}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {lecturer.building}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Office Hours: {lecturer.officeHours}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {lecturer.module}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : userRole === "examiner" ? (
                    <div className="flex flex-wrap gap-2 max-w-full">
                        {lecturers.map((lecturer, index) => (
                            <motion.div
                                key={lecturer.id}
                                className={`flex items-center p-4 mb-4 bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 w-full rounded-lg shadow-md ${borderColors[index % borderColors.length]} border-2`}
                                onClick={() => handleLecturerClick(lecturer)}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <img
                                    src={lecturer.avatar}
                                    alt={lecturer.name}
                                    className="w-12 h-12 mr-4 rounded-full"
                                />
                                <div className="flex flex-row flex-1 justify-items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                        {lecturer.name}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {lecturer.building}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Office Hours: {lecturer.officeHours}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {lecturer.module}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2 max-w-full">
                        {students.map((student, index) => (
                            <motion.div
                                key={student.id}
                                onClick={() => handleStudentClick(student)}
                                className={`flex items-center p-4 mb-4 bg-white dark:bg-gray-900 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 w-full rounded-lg shadow-md ${borderColors[index % borderColors.length]} border-2`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <img
                                    src={student.avatar}
                                    alt={student.name}
                                    className="w-12 h-12 mr-4 rounded-full"
                                />
                                <div className="flex flex-row flex-1 justify-items-center justify-between">
                                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                                        {student.name}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {student.email}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {student.module}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
                <Footer />
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                lecturer={selectedLecturer}
                student={selectedStudent}
            />
        </div>
    );
};
