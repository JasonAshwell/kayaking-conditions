// Date Picker Handler

class DatePicker {
    constructor() {
        this.dateInput = document.getElementById('date-input');
        this.timeInput = document.getElementById('time-input');
        this.init();
    }

    init() {
        // Set min date to today
        this.dateInput.min = getTodayDate();

        // Set max date to today + 6 days (API forecast limit)
        this.dateInput.max = getMaxDate(CONFIG.UI.maxForecastDays);

        // Set default value to today
        this.dateInput.value = getTodayDate();

        // Set default time to 09:00 (9 AM)
        this.timeInput.value = '09:00';

        // Event listener for date change
        this.dateInput.addEventListener('change', () => {
            this.validateDate();
        });
    }

    validateDate() {
        const selectedDate = this.dateInput.value;

        if (!selectedDate) {
            return false;
        }

        if (!isValidDate(selectedDate)) {
            showError('Please select a date within the next 7 days');
            this.dateInput.value = getTodayDate();
            return false;
        }

        clearError();
        return true;
    }

    getSelectedDate() {
        return this.dateInput.value;
    }

    getSelectedTime() {
        return this.timeInput.value || '09:00';
    }

    setDate(dateStr) {
        if (isValidDate(dateStr)) {
            this.dateInput.value = dateStr;
            return true;
        }
        return false;
    }

    setTime(timeStr) {
        this.timeInput.value = timeStr;
    }

    reset() {
        this.dateInput.value = getTodayDate();
        this.timeInput.value = '09:00';
    }
}

// Initialize date picker when DOM is loaded
let datePicker;
document.addEventListener('DOMContentLoaded', () => {
    datePicker = new DatePicker();
});
