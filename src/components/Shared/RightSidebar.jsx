import { HiBell, HiSearch } from "react-icons/hi";
import { useState } from "react";

export const RightSidebar = () => {
    const [userRole, setUserRole] = useState("student"); // 'student' or 'lecturer'

    const [notifications, setNotifications] = useState([]);

    return (
        <aside id="right-sidebar" className="fixed top-0 right-0 w-16 md:w-48 lg:w-72 h-screen transition-transform translate-x-full md:translate-x-0 right-sidebar">
            <div className="h-full px-3 py-4 overflow-y-auto bg-transparent no-scrollbar dark:bg-gray-800">
                <header className="flex items-center justify-between mb-4">
                    <div className="relative flex items-center w-full h-10 bg-gray-200 dark:bg-gray-700 rounded-xl">
                        <HiSearch className="absolute left-3 text-gray-600 dark:text-gray-400" />
                        <input type="text" placeholder="Search..." className="w-full h-full pl-10 pr-3 bg-transparent border-none dark:text-gray-300 dark:placeholder-gray-400 focus:ring-0" />
                    </div>
                    {/* <button className="p-3 ml-4 bg-gray-200 rounded-xl dark:bg-gray-700">
                        <HiBell />
                    </button> */}
                </header>

                {/* Display Relevent content just below the header */}
                <div className="mb-4">
                    <div className="w-full h-80 bg-gray-200 rounded-xl dark:bg-gray-700 overflow-y-auto no-scrollbar">
                        {/* manage your notifications */}

                        <div className="flex items-center justify-between p-3  dark:border-gray-600">
                            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-300">Notifications</h2>
                            <button className="text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                Clear All
                            </button>
                        </div>

                        {/* add hr in the middle */}
                        <hr className="border-0 h-0.5 bg-gray-300 dark:bg-gray-600" />

                        <div className="p-2 space-y-2">
                            <div className="flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-xl">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-300">New Assignment</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Due in 3 days</p>
                                </div>
                                <button className="p-2 bg-gray-200 rounded-full dark:bg-gray-600">
                                    <HiBell />
                                </button>
                            </div>
                            <div className="flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-xl">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-300">New Assignment</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Due in 3 days</p>
                                </div>
                                <button className="p-2 bg-gray-200 rounded-full dark:bg-gray-600">
                                    <HiBell />
                                </button>
                            </div>
                            <div className="flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-xl">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-300">New Assignment</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Due in 3 days</p>
                                </div>
                                <button className="p-2 bg-gray-200 rounded-full dark:bg-gray-600">
                                    <HiBell />
                                </button>
                            </div>

                            <div className="flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-xl">
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-300">New Assignment</h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Due in 3 days</p>
                                </div>
                                <button className="p-2 bg-gray-200 rounded-full dark:bg-gray-600">
                                    <HiBell />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Homework progress section, conditional rendering based on userRole */}
                {userRole === 'Supervisior' ? (
                    <div className="mb-4" style={{display: 'none'}}>
                        <h2 className="text-xl font-bold text-gray-800 text-center mb-4 dark:text-gray-300 tracking-wider">Manage Assignment Progress</h2>
                        <div className="w-full h-0.5 mb-4 bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex flex-col items-center justify-center">

                        </div>                  
                    </div>
                ) : (
                    <div className="mb-4" style={{display: 'none'}}>
                        <h2 className="text-xl font-bold text-gray-800 mb-4 dark:text-gray-300">Assignment Progress</h2>
                        {/* <div className="w-full h-0.5 mb-4 bg-gray-300 dark:bg-gray-600"></div> */}
                        <hr className="border-0 h-0.5 mb-4 bg-gray-300 dark:bg-gray-600" />
                        <div className="flex flex-col items-center justify-center">

                        </div>                  
                    </div>
                )}
            </div>
        </aside>
    );
};
