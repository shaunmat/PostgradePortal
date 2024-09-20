import { useState } from "react"
import { Footer } from "../components/Footer"
import { useTheme } from "../context/ThemeContext";
export const Settings = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    // State to control modal visibility
    const [isModalOpen, setModalOpen] = useState(false);
    const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);

    const openNotificationModal = () => {
        setNotificationModalOpen(true);
    };

    const closeNotificationModal = () => {
        setNotificationModalOpen(false);
    };

    // Function to open the modal
    const openModal = () => {
        setModalOpen(true);
    };

    // Function to close the modal
    const closeModal = () => {
        setModalOpen(false);
    };
    return (
        <div className={`p-4 sm:ml-64 pt-16 ${isDarkMode ? 'bg-gray-900' : ''}`}>
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                <section className="mb-4">
                    <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-200">Settings</h2>
                    <p className="text-md mt-2 text-gray-600 dark:text-gray-300">Update your account settings here.</p>
                </section>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3 mt-10">
                    <div className="mb-10 pl-6 relative">
                        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                            Change Password
                        </h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                            Update your password
                        </time>
                        <p className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
                            Secure your account by updating your password
                        </p>
                        <button
                            className="inline-flex items-center px-4 py-2 mt-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                            onClick={openModal} // Open the modal on button click
                        >
                            Change Password
                        </button>
                    </div>
                    <div className="mb-10 pl-6 relative">
                        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                            Account Details
                        </h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                            Update your account details
                        </time>
                        <p className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
                            Update your account details such as email address
                        </p>
                        <button
                            className="inline-flex items-center px-4 py-2 mt-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            Update Account
                        </button>
                    </div>
                    <div className="mb-10 pl-6 relative">
                        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                            Notifications
                        </h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                            Manage your notifications
                        </time>
                        <p className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
                            Manage your dashboard notification settings
                        </p>
                        <button
                            className="inline-flex items-center px-4 py-2 mt-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                            onClick={openNotificationModal} // Open the modal on button click
                        >
                            Manage Notifications
                        </button>
                    </div>

                    <div className="mb-10 pl-6 relative">
                        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                            Privacy
                        </h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                            Manage your privacy settings
                        </time>
                        <p className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
                            Manage your account privacy settings
                        </p>
                        <button
                            className="inline-flex items-center px-4 py-2 mt-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            Manage Privacy
                        </button>
                    </div>

                    <div className="mb-10 pl-6 relative">
                        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                            Theme
                        </h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                            Change your theme
                        </time>
                        <p className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
                            Change your dashboard theme to dark or light
                        </p>
                        <button
                            className="inline-flex items-center px-4 py-2 mt-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                            onClick={toggleTheme} // Toggle the theme on button click
                        >
                            Change Theme
                        </button>
                    </div>

                    <div className="mb-10 pl-6 relative">
                        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                            Delete Account
                        </h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                            Delete your account
                        </time>
                        <p className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
                            Delete your account permanently
                        </p>
                        <button
                            className="inline-flex items-center px-4 py-2 mt-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>

                <Footer />
            </div>
            {/* Modal component */}
            {isModalOpen && (
                <UpdateDetailsModal isOpen={isModalOpen} onClose={closeModal} />
            )}

            {/* Modal component */}
            {isNotificationModalOpen && (
                <ManageNotificationsModal isOpen={isNotificationModalOpen} onClose={closeNotificationModal} />
            )}
        </div>
    )
}


const UpdateDetailsModal = ({ isOpen, onClose }) => {
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50 ${
                isOpen ? "block" : "hidden"
            }`}
        >
            <div className="relative w-full max-w-md p-6 bg-white rounded-xl shadow-xl dark:bg-gray-800">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 dark:text-gray-300"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Update Account Details
                </h2>
                <form className="mt-4">
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="confirmPassword"
                            className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg focus:bg-blue-600 focus:outline-none"
                    >
                        Update Account
                    </button>
                </form>
            </div>
        </div>
    );
}


const ManageNotificationsModal = ({ isOpen, onClose }) => {
    // toggle buttons here in this modal
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50 ${
                isOpen ? "block" : "hidden"
            }`}
        >
            <div className="relative w-full max-w-md p-6 bg-white rounded-xl shadow-xl dark:bg-gray-800">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 dark:text-gray-300"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    Manage Notifications
                </h2>

                {/* General */}
                <div className="mt-4 mb-4">
                    <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                        General
                    </h3>

                    <div className="mt-2 mb-2">
                        {/* Receive email notifications */}
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                Receive email notifications
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                    Important updates and reminders via email
                                </p>
                            </p>
                            <label className="inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>

                        </div>

                        {/* Receive push notifications */}

                        <div className="flex items-center justify-between mt-2">
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                Receive push notifications
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                    Important updates and reminders via push notifications
                                </p>
                            </p>
                            <label className="inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    {/* Activity */}
                    <div className="mt-4 mb-4">
                        <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200">
                            Activity
                        </h3>

                        {/* Tasks and assignment deadlines */}
                        <div className="flex items-center justify-between mt-2 mb-2">
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                Tasks and assignment deadlines
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                    When a task or assignment is assigned to you and upcoming deadlines
                                </p>
                            </p>
                            <label className="inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* New messages */}
                        <div className="flex items-center justify-between mt-2">
                            <p className="text-sm text-gray-800 dark:text-gray-200">
                                New messages
                                <p className="text-xs text-gray-400 dark:text-gray-500">
                                    When you receive a new message
                                </p>
                            </p>
                            <label className="inline-flex items-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer" />
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Action buttons close and save */}
                <div className="flex justify-end mt-10">
                    <button
                        onClick={onClose}
                        className="px-3 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none"
                    >
                        Cancel
                    </button>
                    <button
                        className="px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg ml-2 hover:bg-blue-600 focus:outline-none"
                    >
                        Save
                    </button>
                </div>

            </div>
        </div>
    );
};

const ManagePrivacyModal = ({ isOpen, onClose }) => {

};