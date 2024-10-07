import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation
import Logo from '../../assets/images/UJ Logo.png';
import UserLogo from '../../assets/images/Avatar.png';
import { HiLogout, HiFlag, HiChartPie, HiAcademicCap, HiMail, HiUserGroup, HiBookOpen, HiViewBoards, HiCollection, HiChevronDown, HiDesktopComputer } from "react-icons/hi";
import { signOut } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../backend/config';
import { useAuth } from '../../backend/authcontext';

const variants = {
  visible: { opacity: 1, height: 'auto' },
  hidden: { opacity: 0, height: 0 },
};

const menuItems = [
  { path: "/milestones", label: "Milestones", icon: <HiFlag className="w-6 h-6" /> },
  { path: "/inbox", label: "Inbox", icon: <HiMail className="w-6 h-6" /> },
  { path: "/settings", label: "Settings", icon: <HiUserGroup className="w-6 h-6" /> },
];

const courseTypeIcons = {
  Honours: <HiAcademicCap className="w-6 h-6 text-gray-300" />,
  Masters: <HiBookOpen className="w-6 h-6 text-gray-300" />,
  PhD: <HiCollection className="w-6 h-6 text-gray-300" />,
};

const courseTypePaths = {
  Honours: "/courses/honours",
  Masters: "/courses/masters",
  PhD: "/courses/phd",
};

const lecturerItems = [
  { path: "/students", label: "Students", icon: <HiAcademicCap className="w-6 h-6" /> },
];

const StudentItems = [
  { path: "/courses/Research", label: "Research", icon: <HiAcademicCap className="w-6 h-6" /> },
];

export const SidebarComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userSurname, setUserSurname] = useState('');
  const [userID, setUserID] = useState('');
  const [ProfilePicture, setProfilePicture] = useState('');
  const [UserLevel, setUserLevel] = useState('');
  const [CourseIDs, setCourseIDs] = useState([]);
  const {UserData, UserRole, Loading } = useAuth();
  const [courseTypes, setCourseTypes] = useState([]);

  useEffect(() => {
    if (!Loading && UserData) {
      setUserName(UserData.Name)
      setUserSurname(UserData.Surname)
      setUserID(UserData.ID)
      setCourseIDs(UserData.CourseID)
      setProfilePicture(UserData.ProfilePicture || UserLogo);
      setUserLevel(UserRole === 'Student' ? UserData.StudentType : UserRole);

      const fetchCourseTypesData = async () => {
        const courseTypesArray = await fetchCourseTypes(UserData.CourseID);
        setCourseTypes(courseTypesArray);
      };
  
      fetchCourseTypesData();
    }
    fetchCourseTypes(CourseIDs);
  }, [Loading, UserData, UserRole, CourseIDs]);

  const fetchCourseTypes = async (CourseIDs) => {
    const typesSet = new Set();
  
    try {
      for (const courseID of CourseIDs) {
        const moduleRef = doc(db, 'Module', courseID); 
        const moduleSnap = await getDoc(moduleRef);
        
        if (moduleSnap.exists()) {
          const moduleData = moduleSnap.data();
          typesSet.add(moduleData.ModuleType);
        }
      }
    } catch (error) {
      console.error('Error fetching course types:', error);
    }
  
    return Array.from(typesSet);
  };

  const renderSupervisorDropdown = () => (
    <li>
      <button
        type="button"
        onClick={handleToggle}
        className={`flex items-center w-full overflow-y-auto p-2 text-lg text-white transition duration-75 rounded-lg group ${
          isOpen ? 'bg-gray-700 dark:bg-gray-600' : 'hover:bg-gray-700 dark:hover:bg-gray-600'
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
            {courseTypes.map((type) => (
              <li key={type}>
                <a
                  href={courseTypePaths[type] || "#"} // Use the corresponding path from courseTypePaths
                  className={`flex items-center w-full p-2 rounded-lg pl-11 group ${
                    'text-gray-300 hover:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600'
                  }`}
                  onClick={() => navigate(courseTypePaths[type] || "#")} // Use navigate function
                >
                  {courseTypeIcons[type] || <HiCollection className="w-6 h-6 text-gray-300" />}
                  <span className="ml-3">{type}</span>
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </li>
  );

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };

  return (
    <>
      <aside
        id="sidebar-multi-level-sidebar"
        className="fixed top-0 left-0 z-40 w-72 h-screen transition-transform -translate-x-full sm:translate-x-0 sidebar"  /* Fallback color and overlay */
        aria-label="Sidebar"      
      >
        <div
          className="h-full px-4 py-4 overflow-y-auto bg-cover bg-center bg-no-repeat dark:bg-gray-800"
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
            {UserRole === 'Supervisor' && renderSupervisorDropdown()}

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
            {UserRole === 'Supervisor' ? (
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
                {menuItems.map(({ path, label, icon }) => (
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
              <>
                {StudentItems.map(({ path, label, icon }) => (
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
                {menuItems.map(({ path, label, icon }) => (
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
          <div className="absolute bottom-6 left-4 right-4 bg-white dark:bg-gray-900 rounded-lg shadow-md p-5">
            <div className="flex items-center space-x-3">
              <img
                src={ProfilePicture}
                className="w-20 h-20 rounded-full"
                alt="avatar"
              />
              <div className="text-sm">
                <p className="font-bold text-lg text-gray-900 dark:text-white">{userName} {userSurname}</p>
                <p className="font-semibold text-gray-700 dark:text-Black">{UserLevel}</p>
                <p className="font-semibold text-gray-600 dark:text-gray-300">{userID}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};