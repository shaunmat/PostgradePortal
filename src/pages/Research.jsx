import { Link } from "react-router-dom";
import { Card } from "../components/Card";
import { motion } from "framer-motion";
import { Footer } from "../components/Footer";
import RegImage1 from '../assets/images/RegImage1.jpg';
import RegImage2 from '../assets/images/RegImage2.jpg';
import RegImage3 from '../assets/images/RegImage3.jpg';
import RegImage4 from '../assets/images/RegImage4.jpg';

export const Research = () => {
    const subjects = [
        {
            routeId: 'courses/research/Thesis Writing',
            name: 'Thesis Writing',
            image: RegImage1,
            description: 'Learn the basics of Thesis Writing',
            lecturer: 'Dr. John Doe',
        },
        {
            routeId: 'courses/research/Research Methodology',
            name: 'Research Method',
            image: RegImage2,
            description: 'Learn the basics of Research Methodology',
            lecturer: 'Dr. Jane Doe',
        },
        {
            routeId: 'courses/research/Literature Review',
            name: 'Literature Review',
            image: RegImage3,
            description: 'Learn the basics of Literature Review',
            lecturer: 'Dr. John Doe'
        },
        {
            routeId: 'courses/research/Data Analysis',
            name: 'Data Analysis',
            image: RegImage4,
            description: 'Learn the basics of Data Analysis',
            lecturer: 'Dr. Jane Doe',
        }
    ];

    const borderColors = [
        'border-[#00ad43]', 
        'border-[#00bfff]', 
        'border-[#590098]', 
        'border-[#FF8503]'
    ];

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 dark:bg-gray-800">
                {/* Welcome Header */}
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
                    {subjects.map((subject, index) => (
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
                                    borderColor={borderColors[index]}
                                />
                                </motion.div>
                            </Link>
                    ))}
                </div>

                <Footer />
            </div>
        </div>
    );
}
