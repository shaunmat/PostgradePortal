import { Footer } from "../components/Footer"
import { HiAcademicCap, HiDocument } from "react-icons/hi"
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DataTable } from "simple-datatables";
// import { LineChart } from "../components/LineChart"

import Chart from "react-apexcharts";

const LineChart = () => {
    const options = {
        chart: {
            id: "basic-line",
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
            labels: {
                style: {
                    fontWeight: 'bold',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontWeight: 'bold',
                },
            },
        },
        stroke: {
            curve: 'smooth',
        },
        dataLabels: {
            enabled: false,
        },
        grid: {
            show: true,
        },
        colors: ["#FF8503", "#FFC700"],
    };

    const series = [
        {
            name: "Students",
            data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
        },
        {
            name: "Supervisors",
            data: [20, 30, 25, 40, 39, 50, 60, 71, 85],
        },
    ];

    return (
        <Chart options={options} series={series} type="line" height="300" />
    );
};

const BarChart = () => {
    const options = {
        chart: {
            id: "basic-bar",
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
            labels: {
                style: {
                    fontWeight: 'bold',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontWeight: 'bold',
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        grid: {
            show: true,
        },
        colors: ["#FF8503", "#FFC700"],
    };

    const series = [
        {
            name: "Students",
            data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
        },
        {
            name: "Supervisors",
            data: [20, 30, 25, 40, 39, 50, 60, 71, 85],
        },
    ];

    return (
        <Chart options={options} series={series} type="bar" height="300" />
    );
}

// Create a table instance for displaying all supervisors and the number of students they are supervising
// const supervisorData = [
//     {
//         supervisor: "Mr. Ronny K.",
//         students: 20,

//     },
//     {
//         supervisor: "Ms. Tebogo M.",
//         students: 15,
//     },
//     {
//         supervisor: "Dr. Mpho M.",
//         students: 10,
//     },
//     {
//         supervisor: "Dr. Sipho M.",
//         students: 5,
//     },
//     {
//         supervisor: "Mr. Thabo M.",
//         students: 10,
//     },
//     {
//         supervisor: "Ms. Nthabiseng M.",
//         students: 15,
//     },
// ];



export const Dashboard = () => {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    }

    useEffect(() => {
        const customData = {
            headings: [
                "Supervisor",
                "Students",
            ],
            data: [
                ["Mr. Ronny K.", 20],
                ["Ms. Tebogo M.", 15],
                ["Dr. Mpho M.", 10],
                ["Dr. Sipho M.", 5],
                ["Mr. Thabo M.", 10],
                ["Ms. Nthabiseng M.", 15],
            ],
        };
    
        new DataTable("#supervisor-table", {
            data: customData
        });
    }, []);
        
        // const dataTable = new DataTable("#default-table", { data: customData });
    return (
        <div className="p-4 sm:ml-64 pt-16">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <div className="flex flex-col justify-between mb-4">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-200">
                    Welcome Back <span className="text-[#FF8503] dark:text-[#FF8503]">Mr. Ronny Mabokela</span>
                </h1>
                <p className="mt-2 text-md text-gray-500 dark:text-gray-400">
                    Here's what's happening with your projects today
                </p>
                
            </div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="relative flex items-center justify-between h-24 rounded-xl bg-white dark:bg-gray-800 px-4">
                    {/* Centered content (e.g., another icon) */}
                    <div className="flex justify-center items-center rounded-xl h-14 p-5 bg-[#FF8503] dark:bg-[#FF8503]">
                        <HiAcademicCap className="text-3xl text-white" />
                    </div>
                    {/* Number of students on the right side */}
                    <div className="flex flex-col items-end">
                        <span className="text-xl font-extrabold text-gray-800 dark:text-gray-200">Total Students</span>
                        <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">120</span>
                    </div>
                </div>

                <div className="relative flex items-center justify-between h-24 rounded-xl bg-white dark:bg-gray-800 px-4">
                    {/* Centered content (e.g., another icon) */}
                    <div className="flex justify-center items-center rounded-xl h-14 p-5 bg-[#00ad43] dark:bg-[#00ad43]">
                        <HiAcademicCap className="text-3xl text-white" />
                    </div>

                    {/* Number of students on the right side */}
                    <div className="flex flex-col items-end">
                        <span className="text-xl font-extrabold text-gray-800 dark:text-gray-200">Total Superviors</span>
                        <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">10</span>
                    </div>
                </div>

                <div className="relative flex items-center justify-between h-24 rounded-xl bg-white dark:bg-gray-800 px-4">
                    {/* Centered content (e.g., another icon) */}
                    <div className="flex justify-center items-center rounded-xl h-14 p-5 bg-[#590098] dark:bg-[#590098]">
                        <HiDocument className="text-3xl text-white" />
                    </div>

                    {/* Number of students on the right side */}
                    <div className="flex flex-col items-end">
                        <span className="text-xl font-extrabold text-gray-800 dark:text-gray-200">Total Projects</span>
                        <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">120</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-between w-full px-4 py-2">
                        <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-200">Students Vs. Supervisors</h2>
                        {/* Dropdown */}
                        <div className="relative inline-block text-left">
                            <div>
                                <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#FF8503]">
                                    Last 30 days
                                    <svg className="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </button>
                            </div>
                            {/* Dropdown panel, show/hide based on dropdown state */}
                            <AnimatePresence>
                                {showDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.1 }}
                                        className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                                    >
                                        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Last 30 days</a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Last 60 days</a>
                                            <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Last 90 days</a>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="p-2">
                        <LineChart />
                    </div>
                </div>

                <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800">
                    <div className="flex items-center justify-between w-full px-4 py-2">
                        <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-200">Students Vs. Supervisors</h2>
                    </div>

                    <div className="p-2">
                        <BarChart />
                    </div>
                </div>
            </div>
            <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800">
                {/* Header */}
                <div className="flex items-center justify-between w-full px-6 py-4">
                    <h2 className="text-2xl font-extrabold text-gray-800 dark:text-gray-200">Supervisors</h2>
                    <a href="#" className="text-[#FF8503] dark:text-blue-500">View All</a>
                </div>

                {/* Table */}
                <div className="p-6">
                    <table id="supervisor-table" className="table-auto w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Company</th>
                                <th className="px-4 py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="border px-4 py-2">Flowbite</td>
                                <td className="border px-4 py-2">Bergside</td>
                                <td className="border px-4 py-2">05/23/2023</td>
                            </tr>
                            <tr>
                                <td className="border px-4 py-2">Next.js</td>
                                <td className="border px-4 py-2">Vercel</td>
                                <td className="border px-4 py-2">03/12/2024</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            {/* <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">
                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                    </svg>
                    </p>
                </div>
                <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">
                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                    </svg>
                    </p>
                </div>
                
                <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">
                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                    </svg>
                    </p>
                </div>
                <div className="flex items-center justify-center rounded bg-gray-50 h-28 dark:bg-gray-800">
                    <p className="text-2xl text-gray-400 dark:text-gray-500">
                    <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                    </svg>
                    </p>
                </div>
            </div> */}
            <Footer />
        </div>
        </div>

    )
}