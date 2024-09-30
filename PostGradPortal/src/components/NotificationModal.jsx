export const NotificationModal = ({ isOpen, onClose, notifications }) => {
    if (!isOpen) return null; // Do not render the modal if it's not open

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto bg-gray-900 bg-opacity-50 flex items-center justify-center"
            aria-hidden="true"
        >
            <div className="relative p-4 w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-700">
                <button
                    type="button"
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                    onClick={onClose}
                >
                    <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Notifications
                </h3>
                <ul className="mt-4 space-y-2">
                    {notifications.length === 0 ? (
                        <li className="text-gray-500 dark:text-gray-400">No notifications</li>
                    ) : (
                        notifications.map((notification, index) => (
                            <li key={index} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-md">
                                <p className="text-gray-900 dark:text-gray-300">{notification.message}</p>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};
