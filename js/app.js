 function updateCalendar() {
    const calendarBody = document.querySelector('.table');
    //Get Current Date
    const currentDate = new Date(); 
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    let calendarHTML = `
        <thead>
            <tr>
                <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
            </tr>
        </thead>
        <tbody>
    `;

    let day = 1;
    for (let i = 0; i < 6; i++) {
        calendarHTML += '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay.getDay()) {
                calendarHTML += '<td></td>';
            } else if (day > lastDay.getDate()) {
                calendarHTML += '<td></td>';
            } else {
                calendarHTML += `<td${day === currentDate.getDate() ? ' class="today-date"' : ''}>${day}</td>`;
                day++;
            }
        }
        calendarHTML += '</tr>';
        if (day > lastDay.getDate()) break;
    }

    calendarHTML += '</tbody>';
    calendarBody.innerHTML = calendarHTML;
}

updateCalendar();