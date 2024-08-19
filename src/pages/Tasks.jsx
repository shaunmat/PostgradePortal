import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { KanbanCard } from '../components/KanbanCard';
import { Footer } from '../components/Footer';
import { HiPlus } from 'react-icons/hi';
import { TaskModal } from '../components/TaskModal';

export const Tasks = () => {
    // State to manage tasks and modal
    const [tasks, setTasks] = useState([
        { id: 1, courseId: 1, name: "Business Analysis", description: "Complete the business analysis document", dueDate: "2024-06-15", status: "Pending" },
        { id: 2, courseId: 1, name: "Software Development", description: "Design and develop the software application", dueDate: "2024-06-30", status: "In Progress" },
        { id: 3, courseId: 2, name: "Software Project", description: "Complete the software project documentation", dueDate: "2024-07-15", status: "Complete" },
        { id: 4, courseId: 2, name: "Software Testing", description: "Perform software testing and debugging", dueDate: "2024-07-30", status: "Pending" },
        { id: 5, courseId: 2, name: "Business Analysis", description: "Complete the business analysis document", dueDate: "2024-06-15", status: "Not Started" },
    ]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Sample user role state
    const [userRole, setUserRole] = useState('student'); // or 'lecturer'

    const { id } = useParams();
    const courseId = id ? parseInt(id) : null;
    const filteredTasks = courseId ? tasks.filter(task => task.courseId === courseId) : tasks;

    const handleTaskCompletion = (taskId) => {
        setTasks(tasks.map(task => {
            if (task.id === taskId) {
                let newStatus;
                if (task.status === "Pending") {
                    newStatus = "In Progress";
                } else if (task.status === "In Progress") {
                    newStatus = "Complete";
                } else {
                    newStatus = "Pending";
                }
                return { ...task, status: newStatus };
            }
            return task;
        }));
    };

    const addNewTask = (newTask) => {
        const newTaskWithId = { ...newTask, id: tasks.length + 1, courseId: courseId || 1 };
        setTasks([...tasks, newTaskWithId]);
    };

    const pendingTasks = filteredTasks.filter(task => task.status === "Pending");
    const inProgressTasks = filteredTasks.filter(task => task.status === "In Progress");
    const completeTasks = filteredTasks.filter(task => task.status === "Complete");
    const notStartedTasks = filteredTasks.filter(task => task.status === "Not Started");

    return (
        <div className="tasks-container p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 dark:bg-gray-800">
                <section className="mb-6">
                    <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                        {userRole === 'student' ? "My Tasks" : "Tasks Assigned to You"}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-6">
                        {userRole === 'student' ? "Here are your current tasks and assignments." : "Here are the tasks assigned to you."}
                    </p>
                </section>

                {userRole === 'lecturer' && (
                    <section className="mt-6 mb-6 flex justify-between items-center">
                        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                            All Tasks
                        </h1>
                        <div className="flex items-center">
                            <button 
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <HiPlus className="mr-2" />
                                Add New Task
                            </button>
                        </div>
                    </section>
                )}

                {/* Add horizontal line */}
                <hr className="border-t-2 border-gray-200 dark:border-gray-700 mb-6" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="task-column">
                        <h3 className='font-bold text-center mb-4'>Not Started</h3>
                        {notStartedTasks.length === 0 ? <p>No tasks found.</p> : notStartedTasks.map(task => (
                            <KanbanCard key={task.id} {...task} onTaskCompletion={handleTaskCompletion} />
                        ))}
                    </div>
                    <div className="task-column">
                        <h3 className='font-bold text-center mb-4'>Pending</h3>
                        {pendingTasks.length === 0 ? <p>No tasks found.</p> : pendingTasks.map(task => (
                            <KanbanCard key={task.id} {...task} onTaskCompletion={handleTaskCompletion} />
                        ))}
                    </div>
                    <div className="task-column">
                        <h3 className='font-bold text-center mb-4'>In Progress</h3>
                        {inProgressTasks.length === 0 ? <p>No tasks found.</p> : inProgressTasks.map(task => (
                            <KanbanCard key={task.id} {...task} onTaskCompletion={handleTaskCompletion} />
                        ))}
                    </div>
                    <div className="task-column">
                        <h3 className='font-bold text-center mb-4'>Complete</h3>
                        {completeTasks.length === 0 ? <p>No tasks found.</p> : completeTasks.map(task => (
                            <KanbanCard key={task.id} {...task} onTaskCompletion={handleTaskCompletion} />
                        ))}
                    </div>
                </div>

                <Footer />
            </div>
            {userRole === 'lecturer' && (
                <TaskModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={addNewTask}
                />
            )}
        </div>
    );
};
