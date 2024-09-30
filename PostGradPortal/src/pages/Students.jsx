import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../backend/authcontext";
import { collection, getDocs, addDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { db } from "../backend/config";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import UserLogo from '../assets/images/Avatar.png';
import { HiPlus } from "react-icons/hi";
import { TaskModal } from "../components/TaskModal"; // Adjust the import path as needed

export const Students = () => {
    const { UserData, Loading } = useAuth();
    const [Assignments, setAssignments] = useState([]);
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
                    if(element == ModuleID){
                        let ProfilePicture = null
                        if(StudentData.ProfilePicture === ""){
                            ProfilePicture = UserLogo
                        } else {
                            ProfilePicture = StudentData.ProfilePicture
                        }
                        let MatchingCourse = UserData.CourseID
                        let StudentCourseIDs = StudentData.CourseID
                        let CourseHolder = [];
                        for (let x = 0; x < MatchingCourse.length; x++) {
                            StudentCourseIDs.forEach(Courses => {
                                if(MatchingCourse[x] === Courses){
                                    CourseHolder.push(Courses)
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
                        }
                        TempHolder.push(Student)
                    }
                });
            });
          });
        setStudentData(TempHolder)
    };

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 border-gray-200  rounded-lg dark:border-gray-700 dark:bg-gray-800">                {/* Header with Add Button */}
                <section className="mb-6 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                            Students
                        </h1>
                        <p className="text-lg font-normal mt-5 text-gray-700 dark:text-gray-400">
                            Here is a list of all the students you are a Supervisor of
                        </p>
                    </div>
                </section>

                <div className="flex flex-col gap-7">
                    {StudentData.length > 0 ? StudentData.map((Student, index) => (
                        // Pass both courseId and assignmentId in the Link
                        <Link 
                            to={`/Students/${Student.CourseID}`}
                            key={index} 
                            className="block w-full"
                        >
                            <motion.div 
                                className="border-2 rounded-lg overflow-hidden shadow-md p-4 w-full"
                                whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)" }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <img
                                    src={Student.ProfilePicture}
                                    className="w-20 h-20 rounded-full"
                                    alt="avatar"
                                />
                                <h2 className="text-xl font-bold">{Student.Name} {Student.Surname}</h2>
                                <p>{Student.StudentType}</p>
                                <h5>{Student.StudentID}</h5>
                            </motion.div>
                        </Link>
                    )) : (
                        <p>It looks like you have no Students as of yet.</p>
                    )}
                </div>
                {/* Task Modal */}
                <Footer />
            </div>
        </div>
    );
};
