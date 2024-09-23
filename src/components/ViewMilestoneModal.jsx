import { AnimatePresence, motion } from 'framer-motion';

export const ViewMilestoneModal = ({ isOpen, onClose, milestone, feedback }) => {
    if (!isOpen || !milestone) return null;

    const moduleColors = {
        'Software Project': '#00bfff',
        'Software Testing': '#590098',
        'Business Analysis': '#FF8503',
        'Research Methodology': '#00ad43',
    };

    const outlineColor = moduleColors[milestone.module] || 'bg-gray-200';
    const assignmentFeedback = feedback[milestone.assignmentID]; // Check if this matches

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}  // Shorter duration for a quicker fade
                    className="fixed inset-0 z-50 overflow-y-auto bg-gray-800 bg-opacity-50 flex justify-center items-center"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="bg-white dark:bg-gray-800 w-11/12 md:max-w-lg mx-auto rounded-lg shadow-lg z-50 overflow-y-auto p-6"
                        style={{ border: `4px solid ${outlineColor}` }} // Inline style for border color
                    >
                        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 mb-4">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                                Assignment Details
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 dark:text-gray-300"
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
                        </div>
                        <div className="space-y-4">
                            <div className="text-gray-800 dark:text-gray-200">
                                <p className="font-bold">Assignment Title:</p>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">
                                    {milestone.title}
                                </p>
                            </div>
                            <div className="text-gray-800 dark:text-gray-200">
                                <p className="font-bold">Due Date:</p>
                                <p>{new Date(milestone.dueDate).toLocaleString()}</p> {/* Format the due date */}
                            </div>
                            <div className="text-gray-800 dark:text-gray-200">
                                <p className="font-bold">Description:</p>
                                <p>{milestone.description}</p>
                            </div>

                            {/* Feedback Section */}
                            <div className="mt-4 bg-green-100 p-4 rounded-lg">
                                <h4 className="font-extrabold text-lg mb-2">Feedback</h4>
                                <p className='text-sm font-medium mt-1'>
                                    <strong>Marks:</strong> {assignmentFeedback ? assignmentFeedback.marks : 'Not Available'}
                                </p>
                                <p className='text-sm font-medium mt-1'>
                                    <strong>Comments:</strong> {assignmentFeedback ? assignmentFeedback.comments : 'Not Available'}
                                </p>
                                {assignmentFeedback && assignmentFeedback.downloadURL && (
                                    <a
                                        href={assignmentFeedback.downloadURL}
                                        className="mt-2 inline-block text-blue-600"
                                        target="_blank" rel="noopener noreferrer"
                                    >
                                        Download Feedback
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
