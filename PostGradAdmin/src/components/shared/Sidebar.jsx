import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
import Logo from '../../assets/images/UJ Logo.png';
import { HiLogout, HiFlag, HiChartPie, HiBell, HiSearch, HiAdjustments , HiChartBar , HiViewBoards, HiCollection, HiUser, HiDesktopComputer } from "react-icons/hi";


const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <HiChartPie className="w-6 h-6" /> },
    { path: "/analytics", label: "Analytics", icon: <HiChartBar  className="w-6 h-6" /> },
    { path: "/reports", label: "Report", icon: <HiViewBoards className="w-6 h-6" /> },
    { path: "/settings", label: "Settings", icon: <HiAdjustments  className="w-6 h-6" /> },
    { path: "/logout", label: "Log Out", icon: <HiLogout className="w-6 h-6" /> },
  ];


export const Sidebar = () => {
    const location = useLocation(); // Get the location
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(menuItems[0]);

    const handleItemClick = (item) => {
        setSelectedItem(item);
        navigate(item.path);
    };
    return (
        <>
        {/* <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="px-3 py-3 lg:px-5 lg:pl-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-start rtl:justify-end">
                        <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                            <span className="sr-only">Open sidebar</span>
                            <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                            </svg>
                        </button>

                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center ms-3">
                            <div>
                                <button type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                                    <span className="sr-only">Open user menu</span>
                                    <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
                                </button>
                            </div>
                            <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
                                <div className="px-4 py-3" role="none">
                                    <p className="text-sm text-gray-900 dark:text-white" role="none">
                                        Neil Sims
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                        neil.sims@flowbite.com
                                    </p>
                                </div>
                                <ul className="py-1" role="none">
                                    <li>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Dashboard</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Settings</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Earnings</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Sign out</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav> */}
        {/* <aside id="sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0  dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar" >
                <div className="h-full px-3 pb-4 overflow-y-auto bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('../../src/assets/images/sidebar-bg-1.jpg')] bg-cover bg-center bg-no-repeat dark:bg-gray-800">
                    <ul className="space-y-2 font-medium">
                        <li>
                        <a
                            href="/dashboard"
                            className={`flex items-center p-2 rounded-lg group ${
                            location.pathname === "/dashboard" 
                                ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white" 
                                : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        >
                            <HiChartPie className="w-6 h-6 text-gray-300 transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-gray-200" />
                            <span className="ms-3">Dashboard</span>
                        </a>
                        </li>

                    </ul>
                </div>
        </aside> */}
        {/* Navbar */}
        <nav className="fixed top-0 z-40 w-full h-14 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

        {/* Search bar on the far right */}
        <div className="absolute right-5 top-2 flex items-center">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <HiSearch className="w-6 h-6 text-gray-400" />
                </div>
                <input
                    type="search"
                    id="search"
                    className="block w-64 px-12 py-2 text-sm text-gray-900 bg-transparent rounded-xl border-1 border-gray-300 dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600"
                    placeholder="Search..."
                />
            </div>

            {/* Notification bell */}
            <div className="relative ms-4">
                <button type="button" className="flex items-center p-2 text-gray-400 dark:text-gray-400">
                    <HiBell className="w-6 h-6" />
                </button>
                <div className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-1 -mr-1 bg-red-500 rounded-full">
                    <p className="text-xs font-semibold text-white">5</p>
                </div>
            </div>

            {/* User profile */}
            <div className="relative ms-4">
                <button type="button" className="flex items-center p-2 text-gray-400 dark:text-gray-400">
                    <HiUser className="w-6 h-6" />
                </button>
                <div className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-1 -mr-1 bg-red-500 rounded-full">
                    <p className="text-xs font-semibold text-white">5</p>
                </div>
            </div>
        </div>


            </div>
        </nav>

        {/* Sidebar */}        
        <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
        <span className="sr-only">Open sidebar</span>
        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
        </button>

        <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 bg-[linear-gradient(rgba(0,0,0,0.3),rgba(0,0,0,0.3)),url('../../src/assets/images/sidebar-bg-6.jpg')] bg-cover bg-center bg-no-repeat">
          {/* Logo */}
          <div className="flex items-center justify-center mb-3">
            <a href="#" className="flex items-center p-2 group">
              <img src={Logo} className="w-auto h-25 me-3 sm:h-15" alt="UJ Logo" />
            </a>
          </div>

          {/* Dark Horizontal line */}
          <hr className="border-t-2 mb-5 border-gray-700 dark:border-gray-600" />
            <ul className="space-y-2 font-medium">
            <li>
                <a
                    href="/dashboard"
                    className={`flex items-center p-2 rounded-lg group ${
                    location.pathname === "/dashboard" 
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white" 
                        : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                >
                    <HiChartPie className="w-6 h-6 text-gray-300 transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-gray-200" />
                    <span className="ms-3">Dashboard</span>
                </a>
                </li>
                <li>
                <a
                    href="/analytics"
                    className={`flex items-center p-2 rounded-lg group ${
                    location.pathname === "/analytics" 
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white" 
                        : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                >
                    <HiChartBar className="w-6 h-6 text-gray-300 transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-gray-200" />
                    <span className="ms-3">Analytics</span>
                </a>
                </li>
                <li style={{display: "none"}} >
                <a
                    href="/reports"
                    className={`flex items-center p-2 rounded-lg group ${
                    location.pathname === "/reports" 
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white" 
                        : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                >
                    <HiViewBoards className="w-6 h-6 text-gray-300 transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-gray-200" />
                    <span className="ms-3">Reports</span>
                </a>
                </li>
                <li>
                <a
                    href="/settings"
                    className={`flex items-center p-2 rounded-lg group ${
                    location.pathname === "/settings" 
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white" 
                        : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                >
                    <HiAdjustments className="w-6 h-6 text-gray-300 transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-gray-200" />
                    <span className="ms-3">Settings</span>
                </a>
                </li>
                <li>
                <a
                    href="/logout"
                    className={`flex items-center p-2 rounded-lg group ${
                    location.pathname === "/logout" 
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white" 
                        : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                >
                    <HiLogout className="w-6 h-6 text-gray-300 transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-gray-200" />
                    <span className="ms-3">Log Out</span>
                </a>
                </li>
            </ul>
        </div>

        {/* Supervisor/Admin Profile Card */}
        <div className="absolute bottom-6 left-4 right-4 bg-white dark:bg-gray-900 rounded-lg shadow-md p-5">
            <div className="flex items-center space-x-3">
                <img
                    src="https://avatar.iran.liara.run/public/8" // You can replace this with a dynamic image URL
                    className="w-10 h-10 rounded-full"
                    alt="avatar"
                />
                <div className="text-sm">
                    <p className="text-gray-900 font-bold dark:text-gray-300">Ronny Mabokela</p>
                    <p className="text-gray-500 dark:text-gray-400">Supervisor</p>
                </div>
            </div>
        </div>
        </aside>
        </>

    )
}