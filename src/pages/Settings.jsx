import { Footer } from "../components/Footer"
import { useTheme } from "../context/ThemeContext"

export const Settings = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    return (
        <div className={`p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72 ${isDarkMode ? 'bg-gray-900' : ''}`}>
            <div className={`p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 dark:bg-gray-800 ${isDarkMode ? 'border-gray-700 dark:bg-gray-800' : ''}`}>
                <section className="mb-6 ">
                    <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">Settings</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-6">Customize your account settings</p>
                </section>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
                            onClick={toggleTheme}
                            className="inline-flex items-center px-4 py-2 mt-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            Change Theme
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    )
}