import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick

export const Calendar = () => {
    return (
        <FullCalendar
        plugins={[ dayGridPlugin, interactionPlugin ]}
            initialView="dayGridMonth"
            // weekends={false}
            events={
                [
                    { title: 'Business Analysis 3A', date: '2024-08-01' },
                    { title: 'Development Software 3B', date: '2024-08-02' }
                ]
            }

            dateClick={function(info) {
                // Add event to calendar when date is clicked
                const event = prompt('Enter event name');
                if (event) {
                    info.view.calendar.addEvent({
                        title: event,
                        start: info.dateStr,
                        allDay: true
                    });
                }
            }}

        />
    )
}

// function renderEventContent(eventInfo) {

//     return(
//       <>
//         <b>{eventInfo.timeText}</b>
//         <i>{eventInfo.event.title}</i>
//       </>
//     )
// }