const API_KEY = "2678cc88-145a-4dd1-93fe-92686f42f598";
const BASE_URL = "https://holidayapi.com/v1/";

const btnRenderCountry = document.querySelector("#render-country-list");
const btnRenderLanguages = document.querySelector("#render-language-list");
const btnRenderHolidays = document.querySelector("#render-holiday");
const ulElementsList = document.querySelectorAll("ul");
const errorMsgList = document.querySelectorAll(".error-message");
let countriesList = [];
let languagesList = [];
let holidaysList = [];
let countryName = "";

const inputBox = document.querySelectorAll(".input-box");
const holidayCard = document.querySelector(".holiday-card");



const getCountries = async () => {
    try {
        let response = await fetch(`${BASE_URL}countries?pretty&key=${API_KEY}`);
        if (response.ok) {
            let data = await response.json();
            // console.log(data);
            return data["countries"]
        }
        return []
    } catch (error) {
        console.log(error.message);
        return []
    }
    
};

// Get the countries code and add to ul(1)
const initCountriesCode = async () => {
    errorMsgList[1].textContent = "Loading data ...";
    countriesList = await getCountries();
    // console.log(countriesList);
    if (countriesList.length === 0) {
        errorMsgList[1].textContent = "No supported codes";
        return 0
    }
    errorMsgList[1].textContent = "";
    ulElementsList[1].innerHTML = "";
    countriesList.forEach((item, index) => {
        let liElement = document.createElement("li");
        if ((index + 1)%2 !== 0) {
            liElement.innerHTML = `<div class="number odd-number">${index + 1}</div>
            <div class="result-contain">
                <div class="title">${item["name"]}</div>
                <div class="result">Code: ${item["code"]}</div>
            </div>`;
        }
        else {
            liElement.classList = "even";
            liElement.innerHTML = `<div class="number even-number">${index + 1}</div>
            <div class="result-contain">
                <div class="title">${item["name"]}</div>
                <div class="result">Code: ${item["code"]}</div>
            </div>`;
        }
        
        ulElementsList[1].appendChild(liElement);
    });
};

// Get the languague code and add to ul(2)
const getLanguageCode = async () => {
    try {
        let response = await fetch(`${BASE_URL}languages?pretty&key=${API_KEY}`);
        if (response.ok) {
            let data = await response.json();
            // console.log(data["languages"]);
            return data["languages"]
        }
        return []
    } catch (error) {
        console.log(error.message);
        return []
    }
};

const initLanguagesCode = async () => {
    errorMsgList[2].textContent = "Loading data...";
    languagesList = await getLanguageCode();
    if (languagesList.length === 0) {
        errorMsgList[2].textContent = "No supported code"
        return 0
    }
    ulElementsList[2].innerHTML = "";
    errorMsgList[2].textContent = "";
    languagesList.forEach((item, index) => {
        let liElement = document.createElement("li");
        if ((index + 1)%2 !== 0) {
            liElement.innerHTML = `<div class="number odd-number">${index + 1}</div>
            <div class="result-contain">
                <div class="title">${item["name"]}</div>
                <div class="result">Code: ${item["code"]}</div>
            </div>`;
        }
        else {
            liElement.classList = "even";
            liElement.innerHTML = `<div class="number even-number">${index + 1}</div>
            <div class="result-contain">
                <div class="title">${item["name"]}</div>
                <div class="result">Code: ${item["code"]}</div>
            </div>`;
        }
        ulElementsList[2].appendChild(liElement)
    });
};

const getVietNamasDefault = async () => {
    try {
        let response = await fetch(`${BASE_URL}holidays?pretty&key=${API_KEY}&country=VN&year=2022`);
        if (response.ok) {
            let data = await response.json();
            // console.log(data["holidays"]);
            holidayCard.textContent = "Holidays of Viet Nam";
            return data["holidays"]
        }
        return []
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

const getCountryHoliday = async (searchInput, yearInput, monthInput, dayInput, countrycodeInput, languageInput) => {
    let response;
    try {
        if (searchInput) response = await fetch(`${BASE_URL}holidays?pretty&key=${API_KEY}&${yearInput ? `&year=${inputBox[1].value}` : "year=2022"}&search=${inputBox[0].value}`);
        else response = await fetch(`${BASE_URL}holidays?pretty&key=${API_KEY}&${countrycodeInput ? `&country=${inputBox[4].value}` : "country=VN"}&${yearInput ? `&year=${inputBox[1].value}` : "year=2022"}${monthInput ? `&month=${inputBox[2].value}` : ""}${dayInput ? `&day=${inputBox[3].value}` : ""}${languageInput ? `&language=${inputBox[5].value}` : ""}`);
        
        if (response.ok) {
            let data = await response.json();
            // console.log(data["holidays"]);
            return data["holidays"]
        }
        return []
    } catch (error) {
        console.log(error.message);
        return []
    }
}

const getHolidayDate = async() => {
    errorMsgList[0].textContent = "Loading data...";
    let inputCheckedList = [true, true, true, true, true, true];
    inputBox.forEach((item, index) => {
        if (item.value.trim() === "") {
            inputCheckedList[index] = false;
        }
    });
    // console.log(inputCheckedList);
    if (!inputCheckedList.includes(true)) {
        holidaysList = await getVietNamasDefault();
    }
    else {
        holidaysList = await getCountryHoliday(inputCheckedList[0], inputCheckedList[1], inputCheckedList[2], inputCheckedList[3], inputCheckedList[4], inputCheckedList[5]);
    }
    
    if (holidaysList.length === 0) {
        ulElementsList[0].innerHTML = "";
        errorMsgList[0].textContent = "No holiday to display";
        return 0;
    }
    errorMsgList[0].textContent = "";
    ulElementsList[0].innerHTML = "";
    
    if (inputBox[4].value !== "") {
        countryName = countriesList.find((item) => item["code"] === inputBox[4].value.toUpperCase());
        holidayCard.textContent = `Holidays of ${countryName["name"]}`;
    }
    
    holidaysList.forEach((item, index) => {
        let liElement = document.createElement("li");
        if ((index + 1)%2 !== 0) {
            if (inputCheckedList[0]) {
                liElement.innerHTML = `<div class="number odd-number">${index + 1}</div>
                    <div class="result-contain">
                        <div class="title">${countriesList.find((element) => element["code"] === item["country"])["name"]}</div>
                        <div class="result">${item["weekday"]["date"]["name"]} - ${item["date"]}</div>
                    </div>`;
            }
            else {
                liElement.innerHTML = `<div class="number odd-number">${index + 1}</div>
                    <div class="result-contain">
                        <div class="title">${item["name"]}</div>
                        <div class="result">${item["weekday"]["date"]["name"]} - ${item["date"]}</div>
                    </div>`;
            }
            
        }
        else {
            if (inputCheckedList[0]) {
                liElement.classList = "even";
                liElement.innerHTML = `<div class="number even-number">${index + 1}</div>
                    <div class="result-contain">
                        <div class="title">${countriesList.find((element) => element["code"] === item["country"])["name"]}</div>
                        <div class="result">${item["weekday"]["date"]["name"]} - ${item["date"]}</div>
                    </div>`;
            }
            else {
                liElement.classList = "even";
                liElement.innerHTML = `<div class="number even-number">${index + 1}</div>
                    <div class="result-contain">
                        <div class="title">${item["name"]}</div>
                        <div class="result">${item["weekday"]["date"]["name"]} - ${item["date"]}</div>
                    </div>`;
            }
            
        }
        ulElementsList[0].appendChild(liElement)
    });
};


btnRenderCountry.addEventListener("click", initCountriesCode);

btnRenderLanguages.addEventListener("click", initLanguagesCode);

btnRenderHolidays.addEventListener("click", getHolidayDate);