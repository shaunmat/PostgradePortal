import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "../components/Card";
import { Footer } from "../components/Footer";
import RegImage1 from '../assets/images/RegImage1.jpg';
import RegImage2 from '../assets/images/RegImage2.jpg';
import RegImage3 from '../assets/images/RegImage3.jpg';
import RegImage4 from '../assets/images/RegImage4.jpg';

export const Courses = () => {
    // Assuming the role is fetched from somewhere, hardcoding for this example
    const [userRole, setUserRole] = useState("lecturer"); // 'student' or 'lecturer'

    const subjects = [
        {
            routeId: 'courses/course/Business Analysis',
            name: 'Business Analysis',
            image: RegImage1,
            description: 'Learn the basics of Business Analysis',
            lecturer: 'Dr. John Doe'
        },
        {
            routeId: 'courses/course/Software Development',
            name: 'Software Dev',
            image: RegImage2,
            description: 'Learn the basics of Software Development',
            lecturer: 'Dr. Jane Doe',
        },
        {
            routeId: 'courses/course/Software Project',
            name: 'Software Project',
            image: RegImage3,
            description: 'Learn the basics of Software Project',
            lecturer: 'Dr. John Doe'
        },
        {
            routeId: 'courses/course/Software Testing',
            name: 'Software Testing',
            image: RegImage4,
            description: 'Learn the basics of Software Testing',
            lecturer: 'Dr. Jane Doe',
        },

        {
            routeId: 'courses/course/Software Testing',
            name: 'Software Testing',
            image: RegImage4,
            description: 'Learn the basics of Software Testing',
            lecturer: 'Dr. Jane Doe',
        },

        // Add more courses here for Dr. John Doe 
        {
            routeId: 'courses/course/Software Testing',
            name: 'Computer Interaction',
            image: RegImage4,
            description: 'Learn the basics of Human Computer Interaction',
            lecturer: 'Dr. John Doe',
        },
        {
            routeId: 'courses/course/Software Engineering',
            name: 'Software Engineering',
            image: RegImage4,
            description: 'Learn the basics of Software Engineering',
            lecturer: 'Dr. John Doe',
        },
        
    ]


    const borderColors = [
        'border-[#00ad43]', 
        'border-[#00bfff]', 
        'border-[#590098]', 
        'border-[#FF8503]'
    ];

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 border-gray-200  rounded-lg dark:border-gray-700 dark:bg-gray-800">                {/* Conditionally Render Header */}
                <section className="mb-6">
                    {userRole === "lecturer" ? (
                        <>
                            <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                                My Courses
                            </h1>
                            <p className="text-lg font-normal mt-5 text-gray-700 dark:text-gray-400">
                                Here are your current courses
                            </p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                                Courses You Manage
                            </h1>
                            <p className="text-lg font-normal mt-5 text-gray-700 dark:text-gray-400">
                                Here are the courses you manage
                            </p>
                        </>
                    )}
                </section>

                {/* Conditionally Render Courses */}
                <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
                    {subjects
                        .filter(subject => 
                            userRole === "lecturer" || subject.lecturer.includes("Dr. John Doe")
                        )
                        .map((subject, index) => (
                            <Link to={`/${subject.routeId}`} key={index} className="block">
                                <motion.div 
                                    className={`border-2 rounded-lg overflow-hidden shadow-md ${borderColors[index % borderColors.length]}`}
                                    whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)" }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <Card 
                                        name={subject.name} 
                                        image={subject.image} 
                                        description={subject.description} 
                                        lecturer={subject.lecturer} 
                                        borderColor={borderColors[index % borderColors.length]}
                                    />
                                </motion.div>
                            </Link>
                        ))
                    }
                </div>

                
            </div>
        </div>
    );
};
