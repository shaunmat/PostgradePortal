import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { KanbanCard } from '../components/KanbanCard';
import { Footer } from '../components/Footer';
import { HiPlus } from 'react-icons/hi';
import { TaskModal } from '../components/TaskModal';
import { getDoc, doc, updateDoc, collection, setDoc } from 'firebase/firestore';
import { auth, db } from '../backend/config';

export const Tasks = () => {
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskName, setNewTaskName] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [userRole, setUserRole] = useState('');

    const { id } = useParams();
    const courseId = id ? parseInt(id) : null;
    const UserID = auth.currentUser.email.substring(0, 9);
    const filteredTasks = courseId ? tasks.filter(task => task.courseId === courseId) : tasks;

    useEffect(() => {
        if (UserID) {
            let Role = "";
            if (UserID.startsWith('7')) {
                Role = "Supervisor";
            } else if (UserID.startsWith('2')) {
                Role = "Student";
            } else {
                alert("IDK something is tweaking");
            }
            setUserRole(Role);
        }
    }, [UserID]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const UserDocRef = doc(db, userRole, UserID);
                const UserDoc = await getDoc(UserDocRef);

                if (UserDoc.exists()) {
                    const kanban = UserDoc.data().Kanban;
                    let allTasks = [];
                    for (const [kanbanId, task] of Object.entries(kanban)) {
                        allTasks.push({
                            id: kanbanId,
                            courseId: task.ModuleName,
                            name: task.ModuleName,
                            description: task.TaskDescription,
                            dueDate: task.TaskCreation.seconds,
                            status: task.TaskStatus
                        });
                    }

                    setTasks(allTasks);
                    localStorage.setItem(`tasks_${UserID}`, JSON.stringify(allTasks)); // Cache tasks
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.error('Error fetching tasks: ', error);
            }
        };

        // Check localStorage for cached tasks
        const cachedTasks = localStorage.getItem(`tasks_${UserID}`);
        if (cachedTasks) {
            setTasks(JSON.parse(cachedTasks));
        } else {
            if (userRole && UserID) {
                fetchTasks();
            }
        }
    }, [userRole, UserID]);

    const handleTaskCompletion = async (taskId) => {
        try {
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            if (taskIndex === -1) return;

            let newStatus = tasks[taskIndex].status === "Pending" ? "In Progress" : 
                            tasks[taskIndex].status === "In Progress" ? "Complete" : "Pending";

            const taskDocRef = doc(db, userRole, UserID);
            const taskDoc = await getDoc(taskDocRef);

            if (taskDoc.exists()) {
                const kanban = taskDoc.data().Kanban;
                kanban[taskId].TaskStatus = newStatus;

                await updateDoc(taskDocRef, { Kanban: kanban });
                setTasks(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task));

                // Update localStorage after task status change
                localStorage.setItem(`tasks_${UserID}`, JSON.stringify(tasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task)));
            } else {
                console.error('Task document does not exist');
            }
            console.log("Status changed successfully");
        } catch (error) {
            console.error('Error updating task status: ', error);
        }
    };

    const addNewTask = async () => {
        try {
            const newTask = {
                TaskStatus: "Not Started",
                TaskCreation: {
                    seconds: new Date().getTime() / 1000, 
                    nanoseconds: 0
                },
                ModuleName: newTaskName,
                TaskDescription: newTaskDescription
            };

            const UserDocRef = doc(db, userRole, UserID);
            const UserDoc = await getDoc(UserDocRef);

            if (!UserDoc.exists()) {
                console.error('User document not found');
                return;
            }

            const kanban = UserDoc.data().Kanban || {};
            const newTaskRef = doc(collection(db, userRole, UserID, 'Kanban'));
            await setDoc(newTaskRef, newTask);
            kanban[newTaskRef.id] = newTask;
            await updateDoc(UserDocRef, { Kanban: kanban });

            const updatedTasks = [...tasks, {
                id: newTaskRef.id,
                courseId: newTask.ModuleName,
                name: newTask.ModuleName,
                description: newTask.TaskDescription,
                dueDate: newTask.TaskCreation.seconds,
                status: newTask.TaskStatus
            }];
            setTasks(updatedTasks);

            // Update localStorage after adding new task
            localStorage.setItem(`tasks_${UserID}`, JSON.stringify(updatedTasks));

            setIsModalOpen(false);
            setNewTaskName("");
            setNewTaskDescription("");
        } catch (error) {
            console.error('Error adding task: ', error);
        }
    };

    const pendingTasks = filteredTasks.filter(task => task.status === "Pending");
    const inProgressTasks = filteredTasks.filter(task => task.status === "In Progress");
    const completeTasks = filteredTasks.filter(task => task.status === "Complete");
    const notStartedTasks = filteredTasks.filter(task => task.status === "Not Started");

    return (
        <div className="tasks-container p-4 sm:ml-6 sm:mr-6 lg:ml-72 lg:mr-72">
            <div className="p-4 border-2 border-gray-200  rounded-lg dark:border-gray-700 dark:bg-gray-800">                <section className="mb-6">
                    <h1 className="text-3xl font-extrabold tracking-wider text-gray-800 dark:text-gray-200">
                        {userRole === 'student' ? "My Tasks" : "Tasks Assigned to You"}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                        {userRole === 'student' ? "Here are your current tasks and assignments." : "Here are the tasks assigned to you."}
                    </p>
                </section>

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

                <hr className="border-t-2 border-gray-200 dark:border-gray-700 mb-6" />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="task-column">
                        <h3 className='font-bold text-center mb-4'>Not Started</h3>
                        {notStartedTasks.length === 0 ? <p className='text-center'>No tasks found.</p> : notStartedTasks.map(task => (
                            <KanbanCard key={task.id} {...task} onTaskCompletion={handleTaskCompletion} />
                        ))}
                    </div>
                    <div className="task-column">
                        <h3 className='font-bold text-center mb-4'>Pending</h3>
                        {pendingTasks.length === 0 ? <p className='text-center'>No tasks found.</p> : pendingTasks.map(task => (
                            <KanbanCard key={task.id} {...task} onTaskCompletion={handleTaskCompletion} />
                        ))}
                    </div>
                    <div className="task-column">
                        <h3 className='font-bold text-center mb-4'>In Progress</h3>
                        {inProgressTasks.length === 0 ? <p className='text-center'>No tasks found.</p> : inProgressTasks.map(task => (
                            <KanbanCard key={task.id} {...task} onTaskCompletion={handleTaskCompletion} />
                        ))}
                    </div>
                    <div className="task-column">
                        <h3 className='font-bold text-center mb-4'>Complete</h3>
                        {completeTasks.length === 0 ? <p className='text-center'>No tasks found.</p> : completeTasks.map(task => (
                            <KanbanCard key={task.id} {...task} onTaskCompletion={handleTaskCompletion} />
                        ))}
                    </div>
                </div>

                <Footer />
            </div>
            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={addNewTask}
                setNewTaskName={setNewTaskName}
                setNewTaskDescription={setNewTaskDescription}
            />
        </div>
    );
};
