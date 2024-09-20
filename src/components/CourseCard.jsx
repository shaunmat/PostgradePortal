export const CourseCard = ({ name, image, description, progress, borderColor, progressColor }) => {
    return (
        <div className={`max-w-sm h-80 bg-white border-2 rounded-lg shadow dark:bg-gray-800 ${borderColor} border-2 dark:border-gray-700`}>
            <img className="rounded-t-lg" src={image} alt={name} />
            <div className="p-4">
                <h4 className="mb-2 text-lg font-bold tracking-wider text-gray-900 dark:text-white">{name}</h4>
                <p className="mb-4 text-sm font-normal text-gray-700 dark:text-gray-400">{description}</p>
                
            </div>
        </div>
    );
};