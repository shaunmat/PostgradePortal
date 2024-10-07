import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db, storage } from '../backend/config'; // Import your Firebase configuration
import { Footer } from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../backend/AuthContext";

export const Settings = () => {
    const { UserData } = useAuth();
    const { isDarkMode, toggleTheme } = useTheme();
    const [showModal, setShowModal] = useState(false);
    const [profilePictureURL, setProfilePictureURL] = useState('');
    const [fileForUpload, setFileForUpload] = useState(null);

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
            <div className={`p-4 border-2 border-gray-200  rounded-lg dark:border-gray-700 dark:bg-gray-800 ${isDarkMode ? 'border-gray-700 dark:bg-gray-800' : ''}`}>
                <section className="mb-6">
                    <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">Settings</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-6">Customize your account settings</p>
                </section>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="mb-10 pl-6 relative">
                        <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">Change User Image</h3>
                        <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">Update your profile picture</time>
                        <p className="mb-2 text-base font-normal text-gray-500 dark:text-gray-400">
                            Update your profile picture with either a link or a picture on your device
                        </p>
                        <button
                            onClick={toggleModal}
                            className="inline-flex items-center px-4 py-2 mt-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700"
                        >
                            Update Profile Picture
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
                    {/* Modal */}
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg dark:bg-gray-800">
                                <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Update Profile Picture</h2>
                                <h5>Good eay, either input a url for your image or select a file for yor image</h5>
                                <input
                                    type="text"
                                    className="mb-4 p-2 w-full border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    placeholder="Enter URL for profile picture"
                                    value={profilePictureURL}
                                    onChange={(e) => setProfilePictureURL(e.target.value)}
                                />
                                <input
                                    type="file"
                                    className="mb-4"
                                    onChange={handleFileChange}
                                />
                                <button
                                    onClick={updateProfilePicture}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={toggleModal}
                                    className="ml-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
                <Footer />
            </div>
        </div>
    );
};
