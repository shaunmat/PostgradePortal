export const WeeklyCalendar = () => {
    const moduleColors = {
        'Business Analysis': 'bg-[#00ad43] text-white', 
        'Software Development': 'bg-[#00bfff] text-white', 
        'Software Project': 'bg-[#590098] text-white', 
        'Software Testing': 'bg-[#FF8503] text-white'
    };

    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];

    const schedule = {
        Mon: [
            { time: '08:00', subject: 'Business Analysis', duration: 2 },
            { time: '10:00', subject: 'Software Development', duration: 1 },
            { time: '11:00', subject: 'Software Project', duration: 2 }
        ],
        Tue: [
            { time: '08:00', subject: 'Software Development', duration: 2 },
            { time: '10:00', subject: 'Software Testing', duration: 1 }
        ],
        Wed: [
            { time: '08:00', subject: 'Business Analysis', duration: 2 },
            { time: '10:00', subject: 'Software Development', duration: 1 },
            { time: '11:00', subject: 'Software Project', duration: 2 }
        ],
        Thu: [
            { time: '08:00', subject: 'Software Development', duration: 2 },
            { time: '10:00', subject: 'Software Testing', duration: 1 },
            { time: '13:00', subject: 'Business Analysis', duration: 1 }
        ],
        Fri: [
            { time: '08:00', subject: 'Business Analysis', duration: 2 },
            { time: '10:00', subject: 'Software Development', duration: 1 },
            { time: '11:00', subject: 'Software Project', duration: 2 },
        ]
    };

    const renderSchedule = (day, time) => {
        if (!schedule[day]) return null;
        const subjectEntry = schedule[day].find(entry => entry.time === time);
        if (subjectEntry) {
            const colorClass = moduleColors[subjectEntry.subject] || 'bg-gray-200';
            return (
                <td
                    key={time}
                    className={`border px-6 py-3 ${colorClass} rounded-xl text-md font-semibold text-center tracking-wider `}
                    colSpan={subjectEntry.duration}
                >
                    {subjectEntry.subject}
                </td>
            );
        } else if (
            schedule[day].some(
                entry => {
                    const startHour = parseInt(entry.time.split(':')[0], 10);
                    const currentHour = parseInt(time.split(':')[0], 10);
                    return currentHour > startHour && currentHour < startHour + entry.duration;
                }
            )
        ) {
            return null; // Skip rendering cell if it's part of a merged cell
        }
        return <td key={time} className="border px-6 py-3"></td>;
    };

    return (
        <div className="overflow-x-auto ">
            <table className="min-w-full max-w-screen-lg text-left text-base mx-auto">
                <thead>
                    <tr>
                        <th className="px-7 py-3"></th>
                        {times.map(time => (
                            <th key={time} className="px-6 py-3 text-lg text-center text-gray-500">{time}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {days.map(day => (
                        <tr key={day}>
                            <td className="px-6 py-3 text-lg font-bold text-gray-700">{day}</td>
                            {times.map(time => renderSchedule(day, time))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};