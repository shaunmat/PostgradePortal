import { useState, useEffect } from 'react';
import RegImage1 from '../assets/images/RegImage1.jpg';
import RegImage2 from '../assets/images/RegImage2.jpg';
import RegImage3 from '../assets/images/RegImage3.jpg';
import RegImage4 from '../assets/images/RegImage4.jpg';
import UserLogo from '../assets/images/Avatar.png';
import { CourseCard } from '../components/CourseCard';
import { Calendar } from '../components/FullCalendar';
import { UpcomingMilestones } from '../components/Milestones';
import { Footer } from '../components/Footer';
import { useAuth } from '../backend/authcontext';
import { collection, getDocs, query, where } from "firebase/firestore";
import { Timeline } from './ResearchCrs';

import { HiAcademicCap, HiDocument } from "react-icons/hi"
import { motion, AnimatePresence } from "framer-motion";
import { DataTable } from "simple-datatables";
import { auth , db } from "../backend/config"
import { SupervisorCount } from "../components/AdminComponents/SupervisorsCount"
import { Totals } from "../components/AdminComponents/Totals";
import { LineChart } from "../components/AdminComponents/LineChart";
import { BarChart } from "../components/AdminComponents/BarChart";
import Chart from "react-apexcharts";

export const Dashboard = () => {
    const [userName, setUserName] = useState('');
    const [userSurname, setUserSurname] = useState('');
    const [userTitle, setUserTitle] = useState('');
    const [userID, setUserID] = useState('');
    const [ProfilePicture, setProfilePicture] = useState('');
    const [UserLevel, setUserLevel] = useState('');
    const [CourseIDs, setCourseIDs] = useState([]);
    const { UserData, UserRole, Loading } = useAuth();
    const [modules, setModules] = useState([]);
    const [lastFetch, setLastFetch] = useState(Date.now()); // Track last fetch time
    const [showDropdown, setShowDropdown] = useState(false);
    const [StudentID, setStudentID] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [departmentName, setDepartmentName] = useState('');
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    }

    useEffect(() => {
        const cachedUserData = localStorage.getItem('userData');
        if (cachedUserData) {
            const user = JSON.parse(cachedUserData);
            setUserData(user);
            fetchModules(user.CourseID);
            console.log('cache data is working ')
        } else if (!Loading && UserData) {
            localStorage.setItem('userData', JSON.stringify(UserData)); // Cache user data
            setUserData(UserData);
            fetchModules(UserData.CourseID);
            console.log('cache data is not working ')

        }
        
        // Set up cache refresh every 30 minutes
        const intervalId = setInterval(() => {
            if (Date.now() - lastFetch > 30 * 60 * 1000 && UserData) {
                fetchModules(UserData.CourseID);
            }
        }, 30 * 60 * 1000); // 30 minutes in milliseconds

        return () => clearInterval(intervalId); // Clean up interval on unmount
    }, [Loading, UserData, UserRole, lastFetch]); // Add lastFetch to dependencies

    const setUserData = (user) => {
        setUserName(user.Name);
        setUserSurname(user.Surname);
        setUserTitle(user.Title);
        setUserID(user.ID);
        setCourseIDs(user.CourseID);
        setProfilePicture(user.ProfilePicture || UserLogo);
        setUserLevel(UserRole === 'Student' ? user.StudentType : UserRole);
    };

    const fetchModules = async (courseIDs) => {
        try {
            const fetchedModules = [];
            for (const courseID of courseIDs) {
                const moduleRef = collection(db, 'Module');
                const q = query(moduleRef, where('__name__', '==', courseID)); // Use '==' for exact match
                const querySnapshot = await getDocs(q);
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedModules.push({ id: doc.id, ...data });
                });
            }

            // Update state with the fetched modules and cache them
            setModules(fetchedModules);
            localStorage.setItem('modules', JSON.stringify(fetchedModules));
            setLastFetch(Date.now()); // Update last fetch time
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
    };

    useEffect(() => {
        const fetchDepartmentName = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Admin"));
                querySnapshot.forEach((doc) => {
                    const admin = doc.data();
                    if (admin.Department) {
                        setDepartmentName(admin.Department); // Setting department name
                        console.log('Running')
                    }
                    else {
                        console.log('not running ')
                        console.log(admin);
                    }
                });
            } catch (error) {
                console.error("Error fetching data from Firebase:", error);
            }
        };

        fetchDepartmentName();
    }, []);


    const pendingReviews = [
        { id: '1', title: 'Review of Thesis Proposal', description: 'Detailed review of the thesis proposal submitted by student A.' },
        { id: '2', title: 'Final Project Report', description: 'Evaluation of the final project report from student B.' },
        { id: '3', title: 'Research Paper Draft', description: 'Initial draft of research paper for student C.' },
        { id: '4', title: 'Project Presentation', description: 'Review of the project presentation slides from student D.' },
        { id: '5', title: 'Dissertation Chapter', description: 'Review of the dissertation chapter submitted by student E.' }
    ];

    const upcomingDeadlines = [
        { id: '1', title: 'Thesis Review', date: '2024-09-30' },
        { id: '2', title: 'Project Proposal', date: '2024-10-15' },
        { id: '3', title: 'Final Submission', date: '2024-10-25' },
    ];

    const images = [RegImage1, RegImage2, RegImage3, RegImage4];
    const borderColors = ['border-[#00ad43]', 'border-[#00bfff]', 'border-[#590098]', 'border-[#FF8503]'];

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 min-h-screen border-2 border-gray-200 rounded-lg dark:border-gray-700 dark:bg-gray-800">
                {UserRole === 'Student' ? (
                    <>
                        <section className="mb-6">
                            <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                                Welcome Back <span className="text-[#FF8503] dark:text-[#FF8503]">{userName} {userSurname}</span>
                            </h1>
                            <p className="mt-2 text-lg font-normal text-gray-700 dark:text-gray-400">
                                Here&#39;s what&#39;s happening with your studies today
                            </p>
                        </section>

                        <section className="mt-8">
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 tracking-wide">
                                Your Courses
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            {modules.map((module, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <CourseCard
                                    name={module.ModuleTitle}
                                    image={images[index % images.length]}
                                    description={module.ModuleDescription}
                                    borderColor={borderColors[index % borderColors.length]}
                                    />
                                </motion.div>
                                ))}
                            </div>
                        </section>

                        <section className="mt-10">
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 tracking-wide">
                                Your Schedule
                            </h2>
                            <div className="mt-6">
                                <Calendar />
                            </div>
                        </section>

                        <section className="mt-10">
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 tracking-wide">
                                Current Milestones
                            </h2>
                            <div className="mt-6">
                                <UpcomingMilestones />
                            </div>
                        </section>
                    </>
                ) : UserRole === 'Supervisor' ? (
                    <>
                        <section className="mb-6">
                            <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                                Welcome Back <span className="text-[#FF8503] dark:text-[#FF8503]">{userTitle} {userName} {userSurname}</span>
                            </h1>
                            <p className="mt-2 text-lg font-normal text-gray-700 dark:text-gray-400">
                                Here&#39;s your overview for today 
                            </p>
                        </section>

                        <section className="mt-8">
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 tracking-wide">
                                Supervised Courses
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                {modules.map((module, index) => (
                                    <CourseCard
                                        key={index}
                                        name={module.ModuleTitle}
                                        image={images[index % images.length]}
                                        description={module.ModuleDescription}
                                        borderColor={borderColors[index % borderColors.length]}
                                    />
                                ))}
                            </div>
                        </section>

                        <section className="mt-10">
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 tracking-wide">
                                Upcoming Meetings
                            </h2>
                            <div className="mt-6">
                                <Calendar />
                            </div>
                        </section>
                    </>
                ) : UserRole === 'Examiner' ? (
                    <>
                        <section className="mb-6">
                            <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                                Welcome Back <span className="text-[#FF8503] dark:text-[#FF8503]">{userName} {userSurname}</span>
                            </h1>
                            <p className="mt-2 text-lg font-normal text-gray-700 dark:text-gray-400">
                                Here’s your overview for today
                            </p>
                        </section>

                        <section className="mt-8">
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 tracking-wide">
                                Pending Reviews
                            </h2>
                            <ul className="mt-4">
                                {pendingReviews.map(review => (
                                    <li key={review.id} className="border-b py-2">
                                        <h3 className="text-lg font-semibold">{review.title}</h3>
                                        <p className="text-gray-600">{review.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="mt-10">
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 tracking-wide">
                                Upcoming Deadlines
                            </h2>
                            <ul className="mt-4">
                                {upcomingDeadlines.map(deadline => (
                                    <li key={deadline.id} className="border-b py-2">
                                        <h3 className="text-lg font-semibold">{deadline.title}</h3>
                                        <p className="text-gray-600">Due by: {deadline.date}</p>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </>
                ) : UserRole === 'Admin'?(
                    <>
                        <section className="mb-6">
                            <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                                Welcome Back <span className="text-[#FF8503] dark:text-[#FF8503]">{userName} {userSurname}</span>
                            </h1>
                            <p className="mt-2 text-lg font-normal text-gray-700 dark:text-gray-400">
                                Here's what's happening with your deparments projects this year.
                            </p>
                        </section>

                        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800 p-4">
                            <div className="flex items-center justify-between w-full">
                              <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-200">Total Students:</h2>
                            </div>
                            <div className="flex justify-center items-center rounded-xl h-14 p-5 bg-[#00ad43] dark:bg-[#00ad43] mt-4">
                              <span className="text-2xl font-bold font-thick text-white"><Totals Type="Student" /></span>
                            </div>
                          </div>
                        
                          <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800 p-4">
                            <div className="flex items-center justify-between w-full">
                              <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-200">Total Supervisors:</h2>
                            </div>
                            <div className="flex justify-center items-center rounded-xl h-14 p-5 bg-[#590098] dark:bg-[#590098] mt-4">
                              <span className="text-2xl font-bold font-thick text-white"><Totals Type="Supervisor" /></span>
                            </div>
                          </div>
                        
                          <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800 p-4">
                            <div className="flex items-center justify-between w-full">
                              <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-200">Total Projects:</h2>
                            </div>
                            <div className="flex justify-center items-center rounded-xl h-14 p-5 bg-[#FF8503] dark:bg-[#FF8503] mt-4">
                              <span className="text-2xl font-bold font-thick text-white"><Totals Type="Student" /></span>
                            </div>
                          </div>
                        </section>

                        <section className="flex flex-col rounded-xl bg-white dark:bg-gray-800 p-4">
                          <div className="flex items-center justify-between w-full">
                            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-200">
                              Students and Supervisors <span className="text-[#FF8503] dark:text-[#FF8503]">2024</span>
                            </h1><br />
                            {/* <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-200">Students and Supervisors 2024 representations </h2> */}
                            {/* <div className="relative inline-block text-left">
                              <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#FF8503]">
                                Last 30 days
                                <svg className="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                            </div> */}
                          </div>
                        </section>
                        
                        <section className="grid grid-cols-1 gap-4 mb-4">
                          <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800 border-2 p-2 border-[#FF8503]">
                            <div className="flex items-center justify-between w-full px-4 py-2">
                              <h1 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200">Students Vs. Supervisors overall 2024</h1>
                              {/* Dropdown */}
                            </div>
                        
                            <div className="p-2">
                              <LineChart width={500} height={400} />
                            </div>
                          </div>
                        
                          <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800 border-2 p-2 border-[#FF8503]">
                            <div className="flex items-center justify-between w-full px-4 py-2">
                              <h1 className="text-2xl mt-2 font-extrabold text-gray-800 dark:text-gray-200">Students Vs. Supervisors with Degrees 2024</h1>
                            </div>
                        
                            <div className="p-2">
                              <BarChart width={500} height={400} />
                            </div>
                          </div>
                        </section>
                        
                        <section className="mb-6 border-2 border-[#FF8503] rounded-lg p-4">
                        {/* Header */}
                          <div className="flex items-center justify-between w-full px-6 py-4">
                            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-200">
                              Supervisors Data <span className="text-[#FF8503] dark:text-[#FF8503]">2024</span>
                            </h1><br />
                            {/* <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-200">Students and Supervisors 2024 representations </h2> */}


                            {/* <a href="#" className="text-[#FF8503] dark:text-blue-500">View All</a> */}
                          </div>
                        
                          {/* Table */}
                          <SupervisorCount />
                        </section>
                    </>
                ):null}

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};
