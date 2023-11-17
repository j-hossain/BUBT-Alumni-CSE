let baseUrl = "https://script.google.com/macros/s/AKfycbxjLquOsQQD4Qkif0VgfDnsPn5lc06B7XbDnDrYIkc4TqghYvDSqn_W5F_agK198YWeEQ/exec";
var AllData = [];

const reverseColumnMapping = {
    'name': 'Name',
    'intake': 'Intake',
    'shift': 'Shift',
    'id': 'University ID',
    'graduation': 'Graduation Year',
    'email': 'Email Address',
    'profession': 'Profession',
    'organisation': 'Current Organization',
    'experience': 'Experience',
    'social': 'Social ID'
};

const columnMapping = {
    'Name': 'name',
    'Intake': 'intake',
    'Shift': 'shift',
    'University ID': 'id',
    'Graduation Year': 'graduation',
    'Email Address': 'email',
    'Profession': 'profession',
    'Current Organization': 'organisation',
    'Experience': 'experience',
    'Social ID': 'social'
};

sortByCols = ['name', 'intake', 'id', 'graduation'];

function updateList() {
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
            if (input.value != "" && !data[input.id].toLowerCase().includes(input.value.toLowerCase())) {
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
        initiateFilters();
        initiateSort();
        populateList(AllData);
    }
    xhttp.open("GET", baseUrl);
    xhttp.send();
}

function populateList(alumniData) {
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

function initiateSort() {
    let sortOptions = document.getElementById('sortSelect');
    sortOptions.addEventListener("change", doSort);
    sortByCols.forEach(col => {
        let option = document.createElement('option');
        option.value = reverseColumnMapping[col];
        option.innerHTML = reverseColumnMapping[col];
        sortOptions.appendChild(option);
    })
    doSort();
}

function doSort() {
    let col = columnMapping[document.getElementById('sortSelect').value];
    if (col == undefined) return;
    console.log(col);
    AllData = AllData.sort((a, b) => {
        return b[col] < a[col] ? 1 : -1;
    })
    updateList();
}

function initiateFilters() {
    document.getElementById('filterBy').querySelectorAll('input').forEach(input => {
        input.value = '';
        input.addEventListener("input", updateList);
    });
    document.getElementById('filterBy').querySelectorAll('select').forEach(option => {
        option.innerHTML = '<option value="ALL">All</option>';
    });
}

function populateThis(div, options) {
    if (div.value != 'ALL') return;
    div.addEventListener("change", updateList);
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
    document.querySelector('.detailsSideBar').classList.remove('d-none');
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
    for (key in alumniData) {
        alumni[columnMapping[key]] = alumniData[key];
    }
    return alumni;
}

function closeDetails() {
    document.querySelector('.detailsSideBar').classList.add('d-none');
}

function resetFilter() {
    initiateFilters();
    populateList(AllData);
}


getAll();