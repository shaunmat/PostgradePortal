export const KanbanCard = ({ id, name, description, dueDate, status, onTaskCompletion }) => {

    // Define the module border outline colors
    const moduleBorderOutlineColors = [
        'border-[#00bfff]',  // Green
        'border-[#590098]',     // Blue
        'border-[#FF8503]',      // Purple
        'border-[#00ad43]'      // Orange
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending':
                return 'orange';
            case 'In Progress':
                return 'blue';
            case 'Complete':
                return 'green';
            case 'Not Started':
                return 'gray';
            default:
                return 'black';
        }
    };

    // Get the border color based on the module name
    const borderColor = moduleBorderOutlineColors[name] || 'border-gray-200'; // Default border color

    // console.log(`Module Name: ${name}, Border Color: ${borderColor}`); // Debugging line

    return (
        <div className={`max-w-sm h-72 mb-4 p-6 bg-white ${borderColor} dark:${borderColor} border-2 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-600  dark:hover:bg-gray-700 flex flex-col justify-between`}>
            <div>
                <h4 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">{name}</h4>
                <p className="font-normal text-sm mt-2 text-gray-700 dark:text-gray-400">{description}</p>
                <p className="font-normal text-sm mt-2 text-gray-700 dark:text-gray-400" style={{ color: getStatusColor(status) }}>Due Date: {new Date(dueDate * 1000).toLocaleDateString()}</p>
            </div>
            <div className="mt-2">
                <p className="font-normal text-sm text-gray-700 dark:text-gray-400">Status: {status}</p>
                <button
                    className="mt-2 px-2 py-2 bg-blue-500 text-white rounded-lg"
                    onClick={() => onTaskCompletion(id)}
                >
                    {status === "Pending" ? "Start Task" : status === "In Progress" ? "Complete Task" : "Revert to Pending"}
                </button>
            </div>
        </div>
    );
};
