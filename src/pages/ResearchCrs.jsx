import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Footer } from '../components/Footer';
import BannerImage from '../assets/images/research_banner.jpg';

export const ResearchCourse = () => {
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
                    { topic: "Introduction to Software Engineering", subtopics: ["Software Development Life Cycle", "Agile Methodology", "Waterfall Model"] },
                    { topic: "Software Requirements", subtopics: ["Requirements Elicitation", "Requirements Analysis", "Requirements Specification"] },
                    { topic: "Software Design", subtopics: ["Design Principles", "Design Patterns", "UML Diagrams"] }
                ]
            };
            setCourseDetails(data);
        };
        fetchCourseDetails();
    }, [courseId]);

    if (!courseDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 dark:bg-gray-800">
                {/* Stretch Banner Image with Course Name */}
                <section className="max-h-80 flex items-center justify-center w-full overflow-hidden rounded-lg">
                    <img src={BannerImage} alt="Banner" className="w-full h-full object-cover" />
                    <h1 className="absolute text-4xl font-bold tracking-wider text-white dark:text-gray-200">
                         {courseDetails.name}
                    </h1>
                </section>

                {/* Course Details */}
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

                {/* Syllabus */}
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
                            </li>
                        ))}
                    </ul>
                </section>

                <Footer />
            </div>
        </div>
    );
};
