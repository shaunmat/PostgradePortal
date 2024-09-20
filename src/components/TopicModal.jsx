import React, { useState } from "react";
import { motion } from "framer-motion";

export const TopicModal = ({ isOpen, onClose, onSave, setNewTopicName, setNewTopicDescription }) => {
    const [localTopicName, setLocalTopicName] = useState('');
    const [localTopicDescription, setLocalTopicDescription] = useState('');

    const handleSave = () => {
        // Update the parent state when saving
        setNewTopicName(localTopicName);
        setNewTopicDescription(localTopicDescription);
        onSave(); // Call onSave from parent
        // Reset the local state after saving
        setLocalTopicName('');
        setLocalTopicDescription('');
    };

    return isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white rounded-lg p-6 shadow-lg w-full max-w-lg"
            >
                <h2 className="text-2xl font-bold mb-4">Add New Topic</h2>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Topic Name</label>
                    <input
                        type="text"
                        value={localTopicName}
                        onChange={(e) => setLocalTopicName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter topic name"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Topic Description</label>
                    <textarea
                        value={localTopicDescription}
                        onChange={(e) => setLocalTopicDescription(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter topic description"
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                    >
                        Save Topic
                    </button>
                </div>
            </motion.div>
        </div>
    ) : null;
};
