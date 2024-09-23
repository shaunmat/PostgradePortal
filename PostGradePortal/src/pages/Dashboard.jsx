import React, { useState } from 'react';
import RegImage1 from '../assets/images/RegImage1.jpg';
import RegImage2 from '../assets/images/RegImage2.jpg';
import RegImage3 from '../assets/images/RegImage3.jpg';
import RegImage4 from '../assets/images/RegImage4.jpg';
import { CourseCard } from '../components/CourseCard';
import { Calendar } from '../components/FullCalendar';
import { UpcomingMilestones } from '../components/Milestones';
import { Footer } from '../components/Footer';

export const Dashboard = () => {
    const [userRole, setUserRole] = useState('lecturer'); // Can be 'student' or 'lecturer'

    const subjects = [
        {
            name: 'Business Analysis',
            image: RegImage1,
            description: 'Learn the basics of Business Analysis',
        },
        {
            name: 'Software Development',
            image: RegImage2,
            description: 'Learn the basics of Software Development',
        },
        {
            name: 'Software Project',
            image: RegImage3,
            description: 'Learn the basics of Software Project',
        },
        {
            name: 'Software Testing',
            image: RegImage4,
            description: 'Learn the basics of Software Testing',
        }
    ];

    const borderColors = [
        'border-[#00ad43]', 
        'border-[#00bfff]', 
        'border-[#590098]', 
        'border-[#FF8503]'
    ];

    const progressColors = [
        'bg-[#00ad43]', 
        'bg-[#00bfff]', 
        'bg-[#590098]', 
        'bg-[#FF8503]'   
    ];

    return (
        <div className="p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 border-gray-200  rounded-lg dark:border-gray-700 dark:bg-gray-800">                {/* Conditional Content Based on Role */}
                {userRole === 'student' ? (
                    <>
                        {/* Welcome Header */}
                        <section className="mb-6">
                            <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                                Welcome Back Shaun
                            </h1>
                            <p className="mt-2 text-lg font-normal text-gray-700 dark:text-gray-400">
                                Here&rsquo;s what&rsquo;s happening with your studies today
                            </p>

                            <div className="flex items-center mt-4">
                                <div className="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full">
                                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 3a1 1 0 0 0-1 1v3.5a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1Zm0 7a1 1 0 0 0 1-1v-1.5a1 1 0 0 0-2 0V13a1 1 0 0 0 1 1Z"></path>
                                    </svg>
                                </div>
                                <p className="ml-2 text-sm font-normal text-gray-700 dark:text-gray-400">
                                    You have 3 new tasks to complete
                                </p>

                                <button className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                </button>
                            </div>

                            <div className="flex items-center mt-2">
                                <div className="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full">
                                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 3a1 1 0 0 0-1 1v3.5a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1Zm0 7a1 1 0 0 0 1-1v-1.5a1 1 0 0 0-2 0V13a1 1 0 0 0 1 1Z"></path>
                                    </svg>
                                </div>
                                <p className="ml-2 text-sm font-normal text-gray-700 dark:text-gray-400">
                                    You have 1 new message
                                </p>

                                <button className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                </button>
                            </div>

                            <div className="flex items-center mt-2">
                                <div className="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full">
                                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 3a1 1 0 0 0-1 1v3.5a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1Zm0 7a1 1 0 0 0 1-1v-1.5a1 1 0 0 0-2 0V13a1 1 0 0 0 1 1Z"></path>
                                    </svg>
                                </div>
                                <p className="ml-2 text-sm font-normal text-gray-700 dark:text-gray-400">
                                    You have 2 new milestones
                                </p>

                                <button className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="flex items-center mt-2">
                                <div className="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full">
                                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 3a1 1 0 0 0-1 1v3.5a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1Zm0 7a1 1 0 0 0 1-1v-1.5a1 1 0 0 0-2 0V13a1 1 0 0 0 1 1Z"></path>
                                    </svg>
                                </div>
                                <p className="ml-2 text-sm font-normal text-gray-700 dark:text-gray-400">
                                    You have 1 new lecture
                                </p>

                                {/* Add close button svg with ml for spacing */}
                                {/* <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg> */}

                                <button className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                    </svg>
                                </button>
                            </div>

                            {/* View full notification button */}
                            {/* <div className="mt-4">
                                <button className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                                    View all notifications
                                </button>
                            </div> */}
                

                        </section>

                        {/* My Courses */}
                        <section className="mt-8">
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 tracking-wide">
                                My Courses
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                {subjects.map((subject, index) => (
                                    <CourseCard
                                        key={index}
                                        name={subject.name}
                                        image={subject.image}
                                        description={subject.description}
                                        borderColor={borderColors[index % borderColors.length]}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* My Schedule */}
                        <section className="mt-10">
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 tracking-wide">
                                My Schedule
                            </h2>
                            <div className="mt-6">
                                <Calendar />
                            </div>
                        </section>

                        {/* Upcoming Milestones */}
                        <section className="mt-10">
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 tracking-wide">
                                Upcoming Milestones
                            </h2>

                            <div className="mt-6">
                                <UpcomingMilestones />
                            </div>
                        </section>
                    </>
                ) : (
                    <>
                        {/* Welcome Header for Lecturer */}
                        <section className="mb-6">
                            <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                                Welcome Back Dr. John Doe
                            </h1>
                            <p className="mt-2 text-lg font-normal text-gray-700 dark:text-gray-400">
                                Here&rsquo;s your overview for today
                            </p>

                            <div className="flex items-center mt-4">
                                <div className="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full">
                                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 3a1 1 0 0 0-1 1v3.5a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1Zm0 7a1 1 0 0 0 1-1v-1.5a1 1 0 0 0-2 0V13a1 1 0 0 0 1 1Z"></path>
                                    </svg>
                                </div>
                                <p className="ml-2 text-sm font-normal text-gray-700 dark:text-gray-400">
                                    You have 3 courses to manage
                                </p>
                            </div>

                            <div className="flex items-center mt-2">
                                <div className="flex items-center justify-center w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full">
                                    <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 3a1 1 0 0 0-1 1v3.5a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1Zm0 7a1 1 0 0 0 1-1v-1.5a1 1 0 0 0-2 0V13a1 1 0 0 0 1 1Z"></path>
                                    </svg>
                                </div>
                                <p className="ml-2 text-sm font-normal text-gray-700 dark:text-gray-400">
                                    You have 1 upcoming lecture
                                </p>
                            </div>
                        </section>

                        {/* Managed Courses */}
                        <section className="mt-8">
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 tracking-wide">
                                Managed Courses
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                                {subjects.map((subject, index) => (
                                    <CourseCard
                                        key={index}
                                        name={subject.name}
                                        image={subject.image}
                                        description={subject.description}
                                        progress={subject.progress}
                                        borderColor={borderColors[index % borderColors.length]}
                                        progressColor={progressColors[index % progressColors.length]}
                                    />
                                ))}
                            </div>
                        </section>

                        {/* Upcoming Lectures */}
                        <section className="mt-10">
                            <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200 tracking-wide">
                                Upcoming Lectures
                            </h2>

                            <div className="mt-6">
                                <Calendar />
                            </div>
                        </section>
                    </>
                )}

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};
