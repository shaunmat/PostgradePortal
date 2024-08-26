const showEventPopup = async () => {
    const moduleOptions = moduleTitles.map((title) => `<option value="${title}">${title}</option>`).join('');
    const { value: formValues } = await Swal.fire({
        title: 'Add Event',
        html: `
            <input id="swal-input1" class="swal2-input" placeholder="Event Title">
            <input id="swal-input2" class="swal2-input" type="date" value="${newEvent.start}">
            <input id="swal-input3" class="swal2-input" type="date" value="${newEvent.end}">
            <select id="swal-input4" class="swal2-input">
                <option value="" disabled selected>Select a color</option>
                <option value="#378006" style="background-color: #378006; color: #378006;">● Green</option>
                <option value="#ff9f89" style="background-color: #ff9f89; color: #ff9f89;">● Pink</option>
                <option value="#1e90ff" style="background-color: #1e90ff; color: #1e90ff;">● Blue</option>
                <option value="#ff6347" style="background-color: #ff6347; color: #ff6347;">● Red</option>
                <option value="#ffa500" style="background-color: #ffa500; color: #ffa500;">● Orange</option>
            </select>
            <select id="swal-input5" class="swal2-input">
                <option value="" disabled selected>Select a module</option>
                ${moduleOptions}
            </select>
        `,
        focusConfirm: false,
        confirmButtonColor: '#343a40',
        preConfirm: () => {
            return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value,
                document.getElementById('swal-input3').value,
                document.getElementById('swal-input4').value,
                document.getElementById('swal-input5').value,
            ];
        }
    });

    if (formValues) {
        const [title, start, end, color, module] = formValues;
        const today = new Date().setHours(0, 0, 0);
        const startDate = new Date(start).setHours(0, 0, 0);
        if (startDate < today) {
            Swal.fire('The start date cannot be in the past', 'error');
            return;
        }

        const newEvent = { title, start: new Date(start), end: new Date(end), module, backgroundColor: color, borderColor: color, SupervisorID };
        try {
            const eventDocRef = doc(db, 'Events', SupervisorID);
            await updateDoc(eventDocRef, {
                events: arrayUnion(newEvent)
            });
            setEvents((prevEvents) => [...prevEvents, newEvent]);
            Swal.fire('Event Added', JSON.stringify(formValues));
        } catch (error) {
            console.error("Error adding event:", error);
            Swal.fire('Error', 'Failed to add event. Please try again', 'error');
        }
    }
};
