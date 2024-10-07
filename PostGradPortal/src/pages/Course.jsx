import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import BannerImage from '../assets/images/banner.jpg';
import { motion } from 'framer-motion';
import { LogoLoader } from '../components/LogoLoader';

// Dummy user role, replace with actual role fetching logic
const userRole = 'lecturer'; // or 'lecturer'

export const Course = () => {
    const { courseId } = useParams(); // Get the courseId from the URL
    const [courseDetails, setCourseDetails] = useState(null);

    useEffect(() => {
        // Fetch course details based on courseId
        const fetchCourseDetails = async () => {
            // Replace with actual fetch call
            const data = {
                id: courseId,
                name: 'Sample Course',
                instructor: 'Dr. John Doe',
                description: 'This course covers various aspects of software engineering...',
                syllabus: [
                    { routeId: 'chapter-1', topic: "Introduction to Software Engineering", subtopics: ["Software Development Life Cycle", "Agile Methodology", "Waterfall Model"] },
                    { routeId: 'chapter-2', topic: "Software Requirements", subtopics: ["Requirements Elicitation", "Requirements Analysis", "Requirements Specification"] },
                    { routeId: 'chapter-3', topic: "Software Design", subtopics: ["Design Principles", "Design Patterns", "UML Diagrams"] }
                ]
            };
            setCourseDetails(data);
        };
        fetchCourseDetails();
    }, [courseId]);

    if (!courseDetails) {
        return <LogoLoader />;
    }

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 border-gray-200  rounded-lg dark:border-gray-700 dark:bg-gray-800">                {/* Stretch Banner Image with Course Name */}
                <section className="max-h-80 flex items-center justify-center w-full overflow-hidden rounded-lg relative">
                    <img src={BannerImage} alt="Banner" className="w-full h-full object-cover" />
                    <h1 className="absolute text-4xl font-bold tracking-wider text-white dark:text-gray-200">
                        {courseDetails.name}
                    </h1>
                </section>

                {/* Course Details */}
                {userRole === 'student' && (
                    <section className="mt-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            Welcome to {courseDetails.name}
                        </h2>
                        <p className="mt-2 text-lg font-normal text-gray-700 dark:text-gray-400">
                            {courseDetails.description}
                        </p>
                        <p className="mt-2 text-lg font-normal text-gray-700 dark:text-gray-400">
                            Instructor: {courseDetails.instructor}
                        </p>
                    </section>
                )}

                {userRole === 'lecturer' && (
                    <section className="mt-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                            Course Overview for {courseDetails.name}
                        </h2>
                        <p className="mt-2 text-lg font-normal text-gray-700 dark:text-gray-400">
                            Course description and objectives
                        </p>
                        <p className="mt-2 text-lg font-normal text-gray-700 dark:text-gray-400">
                            Instructor: {courseDetails.instructor}
                        </p>
                    </section>
                )}

                {/* Syllabus for lecturer view which they can edit */}
                {userRole === 'lecturer' && (
                    <section className="mt-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Syllabus</h2>
                        <ul className="mt-4 space-y-4">
                            {courseDetails.syllabus.map((topic, index) => (
                                <li key={index} className="border p-4 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">{topic.topic}</h3>
                                    <ul className="mt-2 list-disc list-inside text-gray-700 dark:text-gray-400">
                                        {topic.subtopics.map((subtopic, subIndex) => (
                                            <li key={subIndex} className="ml-4">{subtopic}</li>
                                        ))}
                                    </ul>

                                    {/* Actions */}
                                    <div className="mt-4 flex items-center justify-between">
                                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
                                            Edit Topic
                                        </button>
                                        <button className="px-4 py-2 bg-red-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600">
                                            Hide Topic
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600">
                            Add Topic
                        </button>
                    </section>
                )}

                {/* Syllabus for students */}
                {userRole === 'student' && (
                    <section className="mt-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Syllabus</h2>
                        <ul className="mt-4 space-y-4">
                            {courseDetails.syllabus.map((topic, index) => (
                                <motion.li
                                    key={index}
                                    className="border p-4 rounded-lg shadow dark:bg-gray-900 dark:border-gray-700"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Link 
                                        to={`/courses/course/${courseId}/topic/${topic.routeId}`}
                                        key={index}
                                        className="text-xl no-underline font-semibold text-gray-800 dark:text-gray-200"
                                    >
                                        {topic.topic}
                                    </Link>
                                    <ul className="mt-2 list-disc list-inside text-gray-700 dark:text-gray-400">
                                        {topic.subtopics.map((subtopic, subIndex) => (
                                            <li key={subIndex} className="ml-4">{subtopic}</li>
                                        ))}
                                    </ul>
                                </motion.li>
                            ))}
                        </ul>
                    </section>
                )}

                <Footer />
            </div>
        </div>
    );
};
