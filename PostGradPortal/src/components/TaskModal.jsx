import React from 'react';

export const TaskModal = ({ 
    isOpen, 
    onClose, 
    onSave, 
    setNewTaskName, 
    setNewTaskDescription, 
    setNewTaskDueDate 
}) => {
    if (!isOpen) return null;

    const handleSave = () => {
        onSave(); // Call the onSave function
        // Clear input values if necessary
        setNewTaskName('');
        setNewTaskDescription('');
        setNewTaskDueDate('');
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4">Add New Task</h2>

                <input 
                    type="text" 
                    placeholder="Task Name" 
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                    onChange={(e) => setNewTaskName(e.target.value)}
                />

                <textarea 
                    placeholder="Task Description" 
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                />

                {/* Date Input */}
                <input 
                    type="datetime-local" 
                    className="w-full p-2 mb-4 border border-gray-300 rounded"
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                />

                <div className="flex justify-end">
                    <button 
                        onClick={onClose} 
                        className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                    >
                        Close
                    </button>
                    <button 
                        onClick={handleSave} 
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};
