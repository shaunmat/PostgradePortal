
//import {Foooter} from "../components/Footer"
import {Footer} from '../../components/AdminComponents/Footer'
import { HiAcademicCap, HiDocument } from "react-icons/hi"
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DataTable } from "simple-datatables";
import {auth,db} from "../backend/config"
import {SupervisorCount} from "../../components/AdminComponents/SupervisorsCount"
import { getDocs, query, collection, where } from "firebase/firestore";
import { Totals } from "../../components/AdminComponents/Totals";
import { LineChart } from "../../components/AdminComponents/LineChart";
import { BarChart } from "../../components/AdminComponents/BarChart";
import Chart from "react-apexcharts";
export const AdminDashboard = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [StudentID, setStudentID] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);
    const [departmentName, setDepartmentName] = useState('');
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    }
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
    return (
        <div className="p-4 sm:ml-64 pt-16">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                <div className="flex flex-col justify-between mb-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-200">
                        Welcome Back <span className="text-[#FF8503] dark:text-[#FF8503]"> {departmentName}</span>
                    </h1>
                    <p className="mt-2 text-md text-gray-500 dark:text-gray-400">
                        Here's what's happening with your deparments projects this year:
                    </p>

                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                </div>

                <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800 p-4">
                    <div className="flex items-center justify-between w-full">
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-200">
                            Students and Supervisors Data <span className="text-[#FF8503] dark:text-[#FF8503]">2024</span>
                        </h1><br />
                        {/* <h2 className="text-xl font-extrabold text-gray-800 dark:text-gray-200">Students and Supervisors 2024 representations </h2> */}
                        <div className="relative inline-block text-left">
                            <button type="button" className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-[#FF8503]">
                                Last 30 days
                                <svg className="w-5 h-5 ml-2 -mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 mb-4">
                    <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800">
                        <div className="flex items-center justify-between w-full px-4 py-2">
                            <h1 className="text-xl font-extrabold text-gray-800 dark:text-gray-200">Students Vs. Supervisors overall 2024</h1>
                            {/* Dropdown */}
                        </div>

                        <div className="p-2" style={{ height: '500px' }}>
                            <LineChart width={1000} height={500} />
                        </div>
                    </div>

                    <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800">
                        <div className="flex items-center justify-between w-full px-4 py-2">
                            <h1 className="text-xl font-extrabold text-gray-800 dark:text-gray-200">Students Vs. Supervisors in Degrees 2024</h1>
                        </div>

                        <div className="p-2" style={{ height: '500px' }}>
                            <BarChart width={100000} height={10000} />
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
                    <SupervisorCount />
                </div>

                <Footer />
            </div>
        </div>





    )
}