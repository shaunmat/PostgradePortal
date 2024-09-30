import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, storage } from '../backend/config'; // Import your Firebase configuration
import { Footer } from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../backend/authcontext";

export const Settings = () => {
    const { UserData } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [showModal, setShowModal] = useState(false);
    const [profilePictureURL, setProfilePictureURL] = useState('');
    const [fileForUpload, setFileForUpload] = useState(null);

    const [isNotificationModalOpen, setNotificationModalOpen] = useState(false);

    const openNotificationModal = () => {
        setNotificationModalOpen(true);
    };

    const closeNotificationModal = () => {
        setNotificationModalOpen(false);
    };

    // Open/close modal
    const toggleModal = () => setShowModal(!showModal);

    // Handle file input change
    const handleFileChange = (event) => {
        setFileForUpload(event.target.files[0]);
    };

    // Upload image or set URL
    const updateProfilePicture = async () => {
        try {
            const ConvertedUserID = String(UserData.ID);

            if (!UserData || !UserData.ID) {
                throw new Error("User ID not available");
            }

            // Get the current profile picture URL from Firestore
            const studentDocRef = doc(db, 'Student', ConvertedUserID);
            const docSnapshot = await getDoc(studentDocRef);
            const currentProfilePictureURL = docSnapshot.data()?.ProfilePicture;
            console.log(currentProfilePictureURL)

            let downloadURL = profilePictureURL;

            if (fileForUpload) {
                const newPicRef = ref(storage, `ProfilePictures/${ConvertedUserID}`);
                const uploadTask = await uploadBytes(newPicRef, fileForUpload);
                downloadURL = await getDownloadURL(uploadTask.ref);
            }

            if (!downloadURL) {
                throw new Error("No valid URL for profile picture");
            }

            console.log(`Updating profile picture for user ${UserData.ID} with URL ${downloadURL}`);

            // Update the Firestore document with the new profile picture URL
            await updateDoc(studentDocRef, {
                ProfilePicture: downloadURL,
            });

            alert('Profile picture updated successfully!');
            toggleModal();  // Close modal after successful update
        } catch (error) {
            console.error('Error updating profile picture:', error.message);
            alert('Error updating profile picture. Please try again.');
        }
    };

    return (
        <div className={`p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72 ${isDarkMode ? 'bg-gray-900' : ''}`}>
            <div className={`p-4 border-2 h-screen border-gray-200  rounded-lg dark:border-gray-700 dark:bg-gray-800 ${isDarkMode ? 'border-gray-700 dark:bg-gray-800' : ''}`}>
                <section className="mb-6">
                    <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">Settings</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-6">Customize your account settings</p>
                </section>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="mb-10 pl-6 relative">
                        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Change User Image</h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Update your profile picture</time>
                        <p className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
                            Update your account profile picture 
                        </p>
                        <button
                            onClick={toggleModal}
                            className="inline-flex items-center px-4 py-2 mt-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            Update Profile
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
                            onClick={openNotificationModal}
                            className="inline-flex items-center px-4 py-2 mt-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            Manage Notifications
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
                    {showModal && (
                        <Modal
                            title="Update Profile Picture"
                            onClose={toggleModal}
                            onSave={updateProfilePicture}
                            profilePictureURL={profilePictureURL}
                            setProfilePictureURL={setProfilePictureURL}
                            handleFileChange={handleFileChange}
                        />
                    )}
                </div>
                <Footer />
            </div>
            {/* Modal component */}
            {isNotificationModalOpen && (
                <ManageNotificationsModal isOpen={isNotificationModalOpen} onClose={closeNotificationModal} />
            )}
        </div>
    );
};

const Modal = ({ title, onClose, onSave, profilePictureURL, setProfilePictureURL, handleFileChange }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative w-full max-w-md bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
            <h2 className="text-xl font-bold mb-4 dark:text-gray-200">{title}</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="profilePictureURL">
                    Enter URL for profile picture
                </label>
                <input
                    type="text"
                    id="profilePictureURL"
                    className="p-2 w-full border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Enter URL for profile picture"
                    value={profilePictureURL}
                    onChange={(e) => setProfilePictureURL(e.target.value)}
                />
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="fileUpload">
                    Upload Profile Picture
                </label>
                <input
                    type="file"
                    id="fileUpload"
                    className="border w-full rounded-lg dark:bg-gray-700 dark:border-gray-600"
                    onChange={handleFileChange}
                />
            </div>

            <div className="flex justify-end">
                <button onClick={onClose} className="px-3 py-2 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none">Cancel</button>
                <button onClick={onSave}  className="px-3 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg ml-2 hover:bg-blue-600 focus:outline-none">Save</button>
            </div>
        </div>
    </div>
);

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
