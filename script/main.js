let baseUrl = "https://script.google.com/macros/s/AKfycbxjLquOsQQD4Qkif0VgfDnsPn5lc06B7XbDnDrYIkc4TqghYvDSqn_W5F_agK198YWeEQ/exec";
var AllData = [];
var filterdData = [];

function updateTable() {
    filterdData = [];
    let options = document.getElementById('filterBy').querySelectorAll('select');
    let inputs = document.getElementById('filterBy').querySelectorAll('input');
    AllData.forEach(data => {
        let f = true;
        options.forEach(option => {
            if (option.value != 'ALL' && option.value != data[option.id]) {
                f = false;
            }
        });
        inputs.forEach(input => {
            if (input.value != "" && !data[input.id].includes(input.value)) {
                console.log(input.value);
                f = false;
            }
        });
        if (f) filterdData.push(data);
    })
    populateList(filterdData);
}

function getAll() {
    const xhttp = new XMLHttpRequest();
    xhttp.onload = async function () {
        let res = JSON.parse(xhttp.responseText);
        AllData = getAlumniData(res[0].data);
        filterdData = AllData;
        initiateFilters();
        populateList(filterdData);
    }
    xhttp.open("GET", baseUrl);
    xhttp.send();
}

function populateList(alumniData) {
    console.log(alumniData);
    let cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = "";
    options = {}
    document.getElementById('filterBy').querySelectorAll('select').forEach(option => {
        options[option.id] = new Set();
    });
    alumniData.forEach((alumni) => {
        cardContainer.appendChild(populateCard(createCard(), alumni));
        for (key in options) {
            options[key].add(alumni[key]);
        }
    });
    populateOptions(options);
}

function populateOptions(optionData) {
    for (key in optionData) {
        populateThis(document.getElementById('filterBy').querySelector('#' + key), Array.from(optionData[key]).sort());
    }
}

function initiateFilters() {
    document.getElementById('filterBy').querySelectorAll('input').forEach(input => {
        input.value = '';
        input.addEventListener("input", updateTable);
    });
    document.getElementById('filterBy').querySelectorAll('select').forEach(option => {
        option.innerHTML = '<option value="ALL">All</option>';
    });
}

function populateThis(div, options) {
    if (div.value != 'ALL') return;
    div.addEventListener("change", updateTable);
    div.innerHTML = '<option value="ALL">All</option>';
    options.forEach(option => {
        let opt = document.createElement('option');
        opt.value = option;
        opt.innerHTML = option || "Null";
        div.appendChild(opt);
    });
}

function populateCard(card, data) {
    for (key in data) {
        if (card.querySelector("." + key) != null) {
            card.querySelector('.' + key).innerHTML = data[key];
        }
    }
    let detailsBtn = card.querySelector('.btn');
    detailsBtn.addEventListener("click", () => {
        populateAlumniDetails(data);
    });
    return card;
}

function populateAlumniDetails(data) {
    let detaisDiv = document.getElementById('detaisDiv');
    for (key in data) {
        if (detaisDiv.querySelector('.' + key) != null) {
            detaisDiv.querySelector('.' + key).innerHTML = data[key];
        }
    }
}

function createCard() {
    let card = document.createElement('div');
    card.classList.add('listItemCard');
    card.innerHTML = document.getElementById('cardDemo').innerHTML;
    return card;
}

function getAlumniData(data) {
    let ret = [];
    data.forEach(alumni => {
        ret.push(getAlumniObject(alumni));
    });
    return ret;
}

function getAlumniObject(alumniData) {
    let alumni = {};
    alumni['name'] = alumniData['Name'];
    alumni['intake'] = alumniData['Intake'];
    alumni['shift'] = alumniData['Shift'];
    alumni['id'] = alumniData['University ID'];
    alumni['graduation'] = alumniData['Graduation Year'];
    alumni['email'] = alumniData['Email Address'];
    alumni['profession'] = alumniData['Profession'];
    alumni['organisation'] = alumniData['Current Organization'];
    alumni['experience'] = alumniData['Experience'];
    alumni['social'] = alumniData['Social ID'];
    return alumni;
}

function resetFilter() {
    initiateFilters();
    populateList(AllData);
}


getAll();