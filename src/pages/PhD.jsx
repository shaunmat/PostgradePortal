import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import { useAuth } from "../backend/authcontext";
import RegImage1 from '../assets/images/RegImage1.jpg';
import RegImage2 from '../assets/images/RegImage2.jpg';
import RegImage3 from '../assets/images/RegImage3.jpg';
import RegImage4 from '../assets/images/RegImage4.jpg';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../backend/config";
import { CourseCard } from "../components/CourseCard"; // Import CourseCard

export const PhD = () => {
    const { UserData, Loading } = useAuth();
    const [modules, setModules] = useState([]);

    const images = [
        RegImage2,
        RegImage1,
        RegImage3,
        RegImage4
    ];

    const borderColors = [
        'border-[#00bfff]', 
        'border-[#00ad43]', 
        'border-[#590098]', 
        'border-[#FF8503]'
    ];

    useEffect(() => {
        if (!Loading && UserData) {
            fetchModules(UserData.CourseID);
            // console.log(UserData.CourseID);
        }
    }, [Loading, UserData]);

    const fetchModules = async (courseIDs) => {
        const cacheKey = `modules-${courseIDs.join(',')}`;
        const cachedModules = localStorage.getItem(cacheKey);

        // Check if cached data exists and is valid
        if (cachedModules) {
            setModules(JSON.parse(cachedModules));
            return;
        }

        try {
            const fetchedModules = [];
            for (const courseID of courseIDs) {
                const moduleRef = collection(db, 'Module');
                const q = query(moduleRef, where('__name__', 'in', [courseID]));
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedModules.push({
                        id: doc.id,
                        ...data
                    });
                });
            }

            // Cache the fetched data
            localStorage.setItem(cacheKey, JSON.stringify(fetchedModules));
            setModules(fetchedModules);
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
    };

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 h-screen border-2 border-gray-200  rounded-lg dark:border-gray-700 dark:bg-gray-800">                {/* Welcome Header */}
                <section className="mb-6">
                    <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                        PhD Research
                    </h1>
                    <p className="text-lg font-normal mt-2 text-gray-700 dark:text-gray-400">
                        Here are all the courses you are supervising.
                    </p>
                </section>

                {/* Courses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                    {modules
                    .filter(module => module.ModuleType === 'PhD')
                    .map((module, index) => (
                        <Link to={`/phd/${module.id}`} key={module.id} className="block">
                            <motion.div
                                className={`border-2 rounded-lg overflow-hidden shadow-md ${borderColors[index % borderColors.length]}`}
                                whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)" }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <CourseCard
                                    key={index}
                                    name={module.ModuleTitle}
                                    image={images[index % images.length]}
                                    description={module.ModuleDescription}
                                    borderColor={borderColors[index % borderColors.length]}
                                />
                            </motion.div>
                        </Link>
                    ))}
                </div>

                <Footer />
            </div>
        </div>
    );
};