import { Footer } from "../components/Footer";
import Chart from "react-apexcharts";

export const Analytics = () => {
    return (
        <div className="p-4 sm:ml-64 pt-16">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
            <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white">Analytics</h1>
            <p className="text-gray-600 mt-2 dark:text-gray-300">
                View the analytics for students per supervisor
            </p>
            <div className="mt-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between"></div>
            </div>

            <Footer />
        </div>
        </div>
    )
};