export const Card = ({ name, image, description, lecturer, borderColor }) => {
    return (
        <div className={`max-w-sm max-h-svh bg-white border-2 rounded-lg shadow dark:bg-gray-800 ${borderColor} border-2 dark:border-gray-700`}>
            <img className="rounded-t-lg" src={image} alt={name} />
            <div className="p-5">
                <h5 className="mb-2 text-xl font-bold tracking-wider text-gray-900 dark:text-white">{name}</h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{lecturer}</p>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{description}</p>
            </div>
        </div>
    );
}