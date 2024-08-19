export const CourseCard = ({ name, image, description, progress, borderColor, progressColor }) => {
    return (
        <div className={`max-w-sm bg-white border-2 rounded-lg shadow dark:bg-gray-800 ${borderColor} border-2 dark:border-gray-700`}>
            <img className="rounded-t-lg" src={image} alt={name} />
            <div className="p-5">
                <h5 className="mb-2 text-xl font-bold tracking-wider text-gray-900 dark:text-white">{name}</h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{description}</p>
                <div className="flex items-center justify-between">
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{progress}% Complete</div>
                </div>
                <div className="flex items-center justify-between mt-4">
                    <div className="w-full flex space-x-1">
                        {[25, 50, 75, 100].map((threshold, stepIndex) => (
                            <div
                                key={stepIndex}
                                className={`flex-1 h-2 ${progress >= threshold ? progressColor : 'bg-gray-300 dark:bg-gray-600'} rounded-full ${stepIndex === 3 ? 'rounded-full' : ''}`}
                            ></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};