import Chart from "react-apexcharts";
export const BarChart = () => {
    const options = {
        chart: {
            id: "basic-bar",
            toolbar: {
                show: false,
            },
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
            labels: {
                style: {
                    fontWeight: 'bold',
                },
            },
        },
        yaxis: {
            labels: {
                style: {
                    fontWeight: 'bold',
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        grid: {
            show: true,
        },
        colors: ["#FF8503", "#FFC700"],
    };

    const series = [
        {
            name: "Students",
            data: [30, 40, 35, 50, 49, 60, 70, 91, 125],
        },
        {
            name: "Supervisors",
            data: [20, 30, 25, 40, 39, 50, 60, 71, 85],
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Enrollment Overview</h2>
        <Chart options={options} series={series} type="bar" height="300" />
        </div>
    );
}