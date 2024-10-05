import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../backend/authcontext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../backend/config";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import UserLogo from '../assets/images/Avatar.png';
import { HiPlus } from "react-icons/hi";
import { TaskModal } from "../components/TaskModal"; // Adjust the import path as needed

export const Students = () => {
    const { UserData, Loading } = useAuth();
    const [StudentData, setStudentData] = useState([]);

    useEffect(() => {
        if (!Loading && UserData) {
            fetchStudentData();
        }
    }, [Loading, UserData]);

    const fetchStudentData = async () => {
        const StudentsSnapshot = await getDocs(collection(db, 'Student'));
        const TempHolder = [];
        StudentsSnapshot.forEach(doc => {
            const StudentData = doc.data();
            UserData.CourseID.forEach(ModuleID => {
                StudentData.CourseID.forEach(element => {
                    if (element == ModuleID) {
                        let ProfilePicture = StudentData.ProfilePicture === "" ? UserLogo : StudentData.ProfilePicture;
                        let MatchingCourse = UserData.CourseID;
                        let StudentCourseIDs = StudentData.CourseID;
                        let CourseHolder = [];
                        for (let x = 0; x < MatchingCourse.length; x++) {
                            StudentCourseIDs.forEach(Courses => {
                                if (MatchingCourse[x] === Courses) {
                                    CourseHolder.push(Courses);
                                }
                            });
                        }
                        let PassedData = StudentData.ID + "," + CourseHolder[0];
                        const Student = {
                            Name: StudentData.Name,
                            Surname: StudentData.Surname,
                            ProfilePicture: ProfilePicture,
                            StudentType: StudentData.StudentType,
                            StudentID: StudentData.ID,
                            CourseID: PassedData
                        };
                        TempHolder.push(Student);
                    }
                });
            });
        });
        setStudentData(TempHolder);
    };

    // Array of dynamic border colors
    const borderColors = ['border-[#00ad43]', 'border-[#00bfff]', 'border-[#590098]', 'border-[#FF8503]'];

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 min-h-screen border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800">
                {/* Header with Add Button */}
                <section className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                            Students
                        </h1>
                        <p className="text-lg font-normal mt-2 text-gray-700 dark:text-gray-400">
                            Here is a list of all the students you are a supervisor of.
                        </p>
                    </div>
                </section>

                {/* Student Cards */}
                <div className="flex flex-col gap-7">
                    {StudentData.map((Student, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            // Dynamically apply a border color from the array using index
                            className={`flex items-center justify-between p-4 border-2 rounded-lg dark:border-gray-700 dark:bg-gray-700 ${borderColors[index % borderColors.length]}`}
                        >
                            <div className="flex items-center gap-4">
                                <img 
                                    src={Student.ProfilePicture} 
                                    alt="User" 
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                                        {Student.Name} {Student.Surname}
                                    </h2>
                                    <p className="text-sm text-gray-700 dark:text-gray-400">
                                        {Student.StudentType}
                                    </p>
                                </div>
                            </div>
                            <Link 
                                to={`/Students/${Student.CourseID}`} 
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            >
                                View
                            </Link>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
};
