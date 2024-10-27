const holidays = [
    // USA Holidays
    { name: "New Year's Day", month: 1, day: 1, country: "🇺🇸" },
    { name: "Martin Luther King Jr. Day", month: 1, day: function(year) { return getNthDayOfMonth(year, 1, 1, 3); }, country: "🇺🇸" },
    { name: "Groundhog Day", month: 2, day: 2, country: "🇺🇸" },
    { name: "Valentine's Day", month: 2, day: 14, country: "🇺🇸" },
    { name: "Presidents' Day", month: 2, day: function(year) { return getNthDayOfMonth(year, 1, 2, 3); }, country: "🇺🇸" },
    { name: "International Women's Day", month: 3, day: 8, country: "🇺🇸" },
    { name: "St. Patrick's Day", month: 3, day: 17, country: "🇺🇸" },
    { name: "April Fool's Day", month: 4, day: 1, country: "🇺🇸" },
    { name: "Earth Day", month: 4, day: 22, country: "🇺🇸" },
    { name: "May Day", month: 5, day: 1, country: "🇺🇸" },
    { name: "Mother's Day", month: 5, day: function(year) { return getNthDayOfMonth(year, 0, 5, 2); }, country: "🇺🇸" },
    { name: "Memorial Day", month: 5, day: function(year) { return getLastDayOfMonth(year, 5, 1); }, country: "🇺🇸" },
    { name: "Father's Day", month: 6, day: function(year) { return getNthDayOfMonth(year, 0, 6, 3); }, country: "🇺🇸" },
    { name: "Juneteenth", month: 6, day: 19, country: "🇺🇸" },
    { name: "Independence Day", month: 7, day: 4, country: "🇺🇸" },
    { name: "Labor Day", month: 9, day: function(year) { return getNthDayOfMonth(year, 1, 9, 1); }, country: "🇺🇸" },
    { name: "Patriot Day", month: 9, day: 11, country: "🇺🇸" },
    { name: "Halloween", month: 10, day: 31, country: "🇺🇸" },
    { name: "Veterans Day", month: 11, day: 11, country: "🇺🇸" },
    { name: "Thanksgiving", month: 11, day: function(year) { return getNthDayOfMonth(year, 4, 11, 4); }, country: "🇺🇸" },
    { name: "Christmas", month: 12, day: 25, country: "🇺🇸" },
    { name: "New Year's Eve", month: 12, day: 31, country: "🇺🇸" },

    // Thailand Holidays
    { name: "Chakri Memorial Day", month: 4, day: 6, country: "🇹🇭" },
    { name: "Songkran Festival", month: 4, day: 13, country: "🇹🇭" },
    { name: "Labor Day", month: 5, day: 1, country: "🇹🇭" },
    { name: "Coronation Day", month: 5, day: 4, country: "🇹🇭" },
    { name: "Queen Suthida's Birthday", month: 6, day: 3, country: "🇹🇭" },
    { name: "Queen Mother's Birthday", month: 8, day: 12, country: "🇹🇭" },
    { name: "King Bhumibol Memorial Day", month: 10, day: 13, country: "🇹🇭" },
    { name: "Chulalongkorn Day", month: 10, day: 23, country: "🇹🇭" },
    { name: "King Maha Vajiralongkorn's Birthday", month: 12, day: 5, country: "🇹🇭" },
    { name: "Constitution Day", month: 12, day: 10, country: "🇹🇭" },
    { name: "New Year's Eve", month: 12, day: 31, country: "🇹🇭" },
];

function getNthDayOfMonth(year, month, day, nth) {
    const date = new Date(year, month, day);
    while (date.getDay() !== nth) {
        date.setDate(date.getDate() + 1);
    }
    return date.getDate();
}

function getLastDayOfMonth(year, month, day) {
    const date = new Date(year, month + 1, 0);
    return date.getDate();
}

function getHolidayDate(holiday, year) {
    if (typeof holiday.day === 'function') {
        return new Date(year, holiday.month - 1, holiday.day(year));
    } else {
        return new Date(year, holiday.month - 1, holiday.day);
    }
}

function getDaysUntil(date) {
    const now = new Date();
    const timeDiff = date - now;
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
}

function formatTimeRemaining(targetDate) {
    const now = new Date();
    const timeDiff = targetDate - now;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return `${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
}

function getUpcomingHolidays() {
    const now = new Date();
    const currentYear = now.getFullYear();
    const nextYear = currentYear + 1;

    let upcomingHolidays = holidays.map(holiday => {
        let date = getHolidayDate(holiday, currentYear);
        if (date < now) {
            date = getHolidayDate(holiday, nextYear);
        }
        return {
            ...holiday,
            date,
            daysUntil: getDaysUntil(date)
        };
    });

    return upcomingHolidays.sort((a, b) => a.daysUntil - b.daysUntil);
}

function updateCountdowns() {
    const sortedHolidays = getUpcomingHolidays();
    const nextHoliday = sortedHolidays[0];

    // Update next holiday countdown
    document.getElementById('nextHolidayName').innerHTML = `${nextHoliday.name} ${nextHoliday.country}`;
    document.getElementById('countdown').innerHTML = formatTimeRemaining(nextHoliday.date);

    // Update all upcoming holidays countdowns
    sortedHolidays.forEach((holiday, index) => {
        const holidayElement = document.getElementById(`holiday-${index}`);
        if (holidayElement) {
            const countdownSpan = holidayElement.querySelector('.small-countdown');
            if (countdownSpan) {
                countdownSpan.innerHTML = formatTimeRemaining(holiday.date);
            }
        }
    });
}

function displayHolidays() {
    const sortedHolidays = getUpcomingHolidays();

    // Display upcoming holidays list
    const upcomingList = document.getElementById('upcomingList');
    upcomingList.innerHTML = '';

    sortedHolidays.forEach((holiday, index) => {
        const holidayItem = document.createElement('div');
        holidayItem.className = 'holiday-item';
        holidayItem.id = `holiday-${index}`;
        holidayItem.innerHTML = `
            <div class="holiday-info">
                <span class="country-tag">${holiday.country}</span>
                <span class="holiday-name">${holiday.name}</span>
            </div>
            <span class="small-countdown">${formatTimeRemaining(holiday.date)}</span>
        `;
        upcomingList.appendChild(holidayItem);
    });

    // Start the countdown updates
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
}

// Initial display
displayHolidays();