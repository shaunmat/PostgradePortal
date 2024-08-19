import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
import Logo from '../../assets/images/UJ Logo.png';
import { HiLogout, HiFlag, HiChartPie, HiAcademicCap, HiMail, HiUserGroup, HiBookOpen, HiViewBoards, HiCollection, HiChevronDown, HiDesktopComputer } from "react-icons/hi";

const variants = {
  visible: { opacity: 1, height: 'auto' },
  hidden: { opacity: 0, height: 0 },
};

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: <HiChartPie className="w-6 h-6" /> },
  { path: "/tasks", label: "Tasks", icon: <HiViewBoards className="w-6 h-6" /> },
  { path: "/inbox", label: "Inbox", icon: <HiMail className="w-6 h-6" /> },
  { path: "/milestones", label: "Milestones", icon: <HiFlag className="w-6 h-6" /> },
  { path: "/settings", label: "Settings", icon: <HiUserGroup className="w-6 h-6" /> },
  // { path: "/logout", label: "Log Out", icon: <HiLogout className="w-6 h-6" /> },
];

const dropdownItems = [
  { path: "/courses/course", label: "Course", icon: <HiCollection className="w-6 h-6" /> },
  { path: "/courses/research", label: "Research", icon: <HiBookOpen className="w-6 h-6" /> },
];


const lecturerItems = [
  { path: "/students", label: "Students", icon: <HiAcademicCap className="w-6 h-6" /> },
];

export const SidebarComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation(); // Get the current location
  const navigate = useNavigate(); // Initialize navigate

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    // Perform logout actions such as clearing session or token
    // Example: localStorage.removeItem('token');

    // Redirect to login page
    navigate("/login");
  };

  const userType = 'lecturer'; // Replace with actual user type

  return (
    <>
      {/* <button
        data-drawer-target="sidebar-multi-level-sidebar"
        data-drawer-toggle="sidebar-multi-level-sidebar"
        aria-controls="sidebar-multi-level-sidebar"
        type="button"
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <span className="sr-only">Open sidebar</span>
        <HiMenu className="w-6 h-6" />
      </button> */}

      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed top-0 left-0 z-40 w-72 h-screen transition-transform -translate-x-full sm:translate-x-0 sidebar bg-[url('../../src/assets/images/student_side_dash.jpg')]"  /* Fallback color and overlay */
        aria-label="Sidebar"      
      >
        <div
          className="h-full px-4 py-4 overflow-y-auto bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('../../src/assets/images/student_side_dash_img.jpg')] bg-cover bg-center bg-no-repeat dark:bg-gray-800"
        >
          {/* Logo */}
          <div className="flex items-center justify-center mb-3">
            <a href="#" className="flex items-center p-2 group">
              <img src={Logo} className="w-auto h-25 me-3 sm:h-15" alt="UJ Logo" />
            </a>
          </div>

          {/* Dark Horizontal line */}
          <hr className="border-t-2 mb-2 border-gray-700 dark:border-gray-600" />


          {/* Sidebar Navigation */}


          <ul className="space-y-2 font-bold text-lg">
            {/* Dashboard Item */}
            <li>
              <a
                href="/dashboard"
                className={`flex items-center p-2 rounded-lg group ${
                  location.pathname === "/dashboard" 
                    ? 'bg-gray-700 dark:bg-gray-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                }`}
              >
                <HiChartPie className="w-6 h-6 text-gray-300 transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-gray-200" />
                <span className="ms-3">Dashboard</span>
              </a>
            </li>

            {/* Courses Dropdown */}
            <li>
              <button
                type="button"
                onClick={handleToggle}
                className={`flex items-center w-full overflow-y-auto p-2 text-lg text-white transition duration-75 rounded-lg group ${
                  location.pathname.includes('/courses') 
                    ? 'bg-gray-700 dark:bg-gray-600'
                    : 'hover:bg-gray-700 dark:hover:bg-gray-600'
                }`}
              >
                <HiDesktopComputer className="w-6 h-6 text-gray-300 transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-gray-200" />
                <span className="flex-1 ml-3 text-left rtl:text-right whitespace-nowrap">Courses</span>
                <HiChevronDown className="w-7 h-7 text-gray-300 transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-gray-200" />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.ul
                    id="dropdown-example"
                    className="py-2 space-y-2"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={variants}
                  >
                    {dropdownItems.map(({ path, label, icon }) => (
                      <li key={path}>
                        <a
                          href={path}
                          className={`flex items-center w-full p-2 rounded-lg pl-11 group ${
                            location.pathname === path
                              ? 'bg-gray-700 dark:bg-gray-600 text-white'
                              : 'text-gray-300 hover:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                          }`}
                        >
                          {icon}
                          <span className="ml-3">{label}</span>
                        </a>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>

            {/* Tasks Item */}
            <li>
              <a
                href="/tasks"
                className={`flex items-center p-2 rounded-lg group ${
                  location.pathname === "/tasks"
                    ? 'bg-gray-700 dark:bg-gray-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                }`}
              >
                <HiViewBoards className="w-6 h-6 text-gray-300 transition duration-75 dark:text-gray-400 group-hover:text-white dark:group-hover:text-gray-200" />
                <span className="ms-3">Tasks</span>
              </a>
            </li>

            {/* Conditionally Render Menu Items Based on User Type */}
            {userType === 'Lecturer' ? (
              <>
                {lecturerItems.map(({ path, label, icon }) => (
                  <li key={path}>
                    <a
                      href={path}
                      className={`flex items-center p-2 rounded-lg group ${
                        location.pathname === path
                          ? 'bg-gray-700 dark:bg-gray-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                      }`}
                    >
                      {icon}
                      <span className="ms-3">{label}</span>
                    </a>
                  </li>
                ))}
                {menuItems.slice(2, 3)
                .concat(menuItems.slice(4))
                .map(({ path, label, icon }) => (
                  <li key={path}>
                    <a
                      href={path}
                      className={`flex items-center p-2 rounded-lg group ${
                        location.pathname === path
                          ? 'bg-gray-700 dark:bg-gray-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                      }`}
                    >
                      {icon}
                      <span className="ms-3">{label}</span>
                    </a>
                  </li>
                ))}
              </>
            ) : (
              menuItems.slice(2).map(({ path, label, icon }) => (
                <li key={path}>
                  <a
                    href={path}
                    className={`flex items-center p-2 rounded-lg group ${
                      location.pathname === path
                        ? 'bg-gray-700 dark:bg-gray-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                    }`}
                  >
                    {icon}
                    <span className="ms-3">{label}</span>
                  </a>
                </li>
              ))
            )}



            {/* Dark Horizontal line */}
            {/* <hr className="border-t-2 mt-2 border-gray-700 dark:border-gray-600" /> */}
              <li>
              <a
                onClick={handleLogout}
                className={`flex items-center p-2 cursor-pointer rounded-lg group text-gray-300 hover:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600`}
              >
                <HiLogout className="w-6 h-6" />
                <span className="ms-3">Log Out</span>
              </a>
            </li>
          </ul>
          {
            userType === 'student' ? (
              <div className="absolute bottom-6 left-4 right-4 bg-white dark:bg-gray-900 rounded-lg shadow-md p-5">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://avatar.iran.liara.run/public/8"
                    className="w-10 h-10 rounded-full"
                    alt="avatar"
                  />
                  <div className="text-sm">
                    <p className="font-bold text-lg text-gray-900 dark:text-white">Shaun Matjila</p>
                    <p className="font-semibold text-gray-600 dark:text-gray-300">Student</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute bottom-6 left-4 right-4 bg-white dark:bg-gray-900 rounded-lg shadow-md p-5">
                <div className="flex items-center space-x-3">
                  <img
                    src="https://avatar.iran.liara.run/public/8"
                    className="w-10 h-10 rounded-full"
                    alt="avatar"
                  />
                  <div className="text-sm">
                    <p className="font-bold text-lg text-gray-900 dark:text-white">Dr. John Doe</p>
                    <p className="font-semibold text-gray-600 dark:text-gray-300">Lecturer</p>
                  </div>
                </div>
              </div>
            )
          }

        </div>
      </aside>
    </>
  );
};
