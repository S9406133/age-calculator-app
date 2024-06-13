const inputSection = document.querySelector(".input-section");

const dayInput = document.getElementById("day-input");
const monthInput = document.getElementById("month-input");
const yearInput = document.getElementById("year-input");

const dayError = document.getElementById("day-error");
const monthError = document.getElementById("month-error");
const yearError = document.getElementById("year-error");

const daysOutput = document.getElementById("days-output");
const monthsOutput = document.getElementById("months-output");
const yearsOutput = document.getElementById("years-output");

const today = new Date();

let errors =
{
    day: "",
    month: "",
    year: "",
}

const requiredText = "This field is required";
const validText = "Must be a valid ";
const pastText = "Must be in the past";
const oldText = "Must be more recent";


function process() {
    clearOutputs();
    const day = dayInput.value;
    const month = monthInput.value;
    const year = yearInput.value;

    if (validate(day, month, year)) {
        showErrors();
        return;
    }

    calculate(parseInt(day), parseInt(month), parseInt(year));
}


function calculate(day, month, year) {
    let years = today.getFullYear() - year;
    let months = today.getMonth() - (month - 1);
    let days = today.getDate() - day;

    if (days < 0) {
        months -= 1;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }

    if (months < 0) {
        years -= 1;
        months += 12;
    }

    yearsOutput.innerText = years;
    monthsOutput.innerText = months;
    daysOutput.innerText = days;
}


function validate(dayText, monthText, yearText) {
    const inputs = [
        { value: dayText, name: "day" },
        { value: monthText, name: "month" },
        { value: yearText, name: "year" }
    ];

    let hasError = false;

    inputs.forEach(input => {
        if (input.value.length < 1) {
            errors[input.name] = requiredText;
            hasError = true;
        } else if (isNaN(parseInt(input.value))) {
            errors[input.name] = validText + input.name;
            hasError = true;
        }
    });

    const day = parseInt(dayText);
    const month = parseInt(monthText);
    const year = parseInt(yearText);

    if (year < 1000) {
        errors.year = oldText;
        hasError = true;
    }

    if (year > today.getFullYear()) {
        errors.year = pastText;
        hasError = true;
    }

    if (month < 1 || month > 12) {
        errors.month = validText + "month";
        hasError = true;
    }

    if (!hasError && !isValidDay(day, month, year)) {
        errors.day = validText + "day";
        hasError = true;
    }

    if (hasError) return hasError;

    let inputTime = new Date(year, month - 1, day).getTime();

    if (inputTime >= today.getTime()) {
        errors.year = pastText;
        hasError = true;
    }

    return hasError;
}


function isValidDay(day, month, year) {
    if (day < 1) return false;
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}


function showErrors() {
    inputSection.classList.add("error-status");
    dayError.innerText = errors.day;
    monthError.innerText = errors.month;
    yearError.innerText = errors.year;
}


function clearOutputs() {
    inputSection.classList.remove("error-status");
    errors.day = errors.month = errors.year = "";
    dayError.innerText = errors.day;
    monthError.innerText = errors.month;
    yearError.innerText = errors.year;

    yearsOutput.innerText = monthsOutput.innerText = daysOutput.innerText = "-";
}


document.getElementById("input-btn").addEventListener("click", () => process());