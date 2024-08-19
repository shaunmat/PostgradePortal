import React, { useState } from 'react';

export const TaskModal = ({ isOpen, onClose, onSave }) => {
    const [newTask, setNewTask] = useState({
        name: "",
        description: "",
        dueDate: "",
        status: "Not Started",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewTask({
            ...newTask,
            [name]: value,
        });
    };

    const handleSave = () => {
        onSave(newTask);
        onClose();
        setNewTask({
            name: "",
            description: "",
            dueDate: "",
            status: "Not Started",
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg dark:bg-gray-700 p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Add New Task</h2>
                <form>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-200">Task Name</label>
                        <input
                            type="text"
                            name="name"
                            value={newTask.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-200">Description</label>
                        <textarea
                            name="description"
                            value={newTask.description}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 dark:text-gray-200">Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={newTask.dueDate}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-600 dark:border-gray-500"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleSave}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg mr-2"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
