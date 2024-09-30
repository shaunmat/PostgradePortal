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

export const Research = () => {
    const { UserData, Loading } = useAuth();
    const [modules, setModules] = useState([]);

    const images = [
        RegImage1,
        RegImage2,
        RegImage3,
        RegImage4
    ];

    const borderColors = [
        'border-[#00ad43]', 
        'border-[#00bfff]', 
        'border-[#590098]', 
        'border-[#FF8503]'
    ];

    useEffect(() => {
        if (!Loading && UserData) {
            fetchModules(UserData.CourseID);
        }
    }, [Loading, UserData]);

    const fetchModules = async (courseIDs) => {
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
            setModules(fetchedModules);
        } catch (error) {
            console.error('Error fetching modules:', error);
        }
    };

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 border-gray-200  rounded-lg dark:border-gray-700 dark:bg-gray-800">                {/* Welcome Header */}
                <section className="mb-6">
                    <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                        Research
                    </h1>
                    <p className="text-lg font-normal mt-5 text-gray-700 dark:text-gray-400">
                        Here are your current research courses
                    </p>
                </section>

                {/* Courses */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {modules.map((module, index) => (
                        <Link to={`/courses/research/${module.id}`} key={index} className="block">

                            <motion.div
                                className={`border-2 rounded-lg overflow-hidden shadow-md ${borderColors[index % borderColors.length]}`}
                                whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)" }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <div className="relative">
                                    <img 
                                        src={images[index % images.length]} 
                                        alt={module.ModuleTitle}
                                        className="w-full h-40 object-cover"
                                    />
                                    <div className="p-4">
                                        <h2 className="text-xl font-bold">{module.ModuleTitle}</h2>
                                        <p>{module.ModuleDescription}</p>
                                        {/*<p className="text-sm text-gray-600">Lecturer: {module.lecturer}</p>*/}
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
                <Footer />
            </div>
        </div>
    );
};
