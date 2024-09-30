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
import { db } from '../backend/config';

export const Dashboard = () => {
    const [userName, setUserName] = useState('');
    const [userSurname, setUserSurname] = useState('');
    const [userID, setUserID] = useState('');
    const [ProfilePicture, setProfilePicture] = useState('');
    const [UserLevel, setUserLevel] = useState('');
    const [CourseIDs, setCourseIDs] = useState([]);
    const { UserData, UserRole, Loading } = useAuth();
    const [modules, setModules] = useState([]);
    const [lastFetch, setLastFetch] = useState(Date.now()); // Track last fetch time

    useEffect(() => {
        const cachedUserData = localStorage.getItem('userData');
        if (cachedUserData) {
            const user = JSON.parse(cachedUserData);
            setUserData(user);
            fetchModules(user.CourseID);
        } else if (!Loading && UserData) {
            localStorage.setItem('userData', JSON.stringify(UserData)); // Cache user data
            setUserData(UserData);
            fetchModules(UserData.CourseID);
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
                                Your Schedule
                            </h2>
                            <div className="mt-6">
                                <Calendar />
                            </div>
                        </section>

                        <section className="mt-10">
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 tracking-wide">
                                Upcoming Milestones
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
                                Welcome Back <span className="text-[#FF8503] dark:text-[#FF8503]">Dr. {userName} {userSurname}</span>
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
                                Upcoming Lectures
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
                                Welcome Back <span className="text-[#FF8503] dark:text-[#FF8503]">Examiner {userName} {userSurname}</span>
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
                ) : null}

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};
