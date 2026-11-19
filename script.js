// Beginner project: timers, callbacks, Fetch API and browser storage.
document.addEventListener('DOMContentLoaded', function () {
    const themeButton = document.getElementById('themeButton');
    const visitorName = document.getElementById('visitorName');
    const destinationSelect = document.getElementById('destinationSelect');

    // LOCAL STORAGE: remember the selected theme after reload.
    function setTheme(theme) {
        document.body.classList.toggle('dark', theme === 'dark');
        themeButton.textContent = theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode';
    }
    setTheme(localStorage.getItem('wanderGoTheme') || 'light');
    themeButton.addEventListener('click', function () {
        const theme = document.body.classList.contains('dark') ? 'light' : 'dark';
        localStorage.setItem('wanderGoTheme', theme);
        setTheme(theme);
    });

    // SESSION STORAGE: keep the visitor name for this browser session only.
    visitorName.value = sessionStorage.getItem('wanderGoVisitor') || '';
    visitorName.addEventListener('input', function () {
        sessionStorage.setItem('wanderGoVisitor', visitorName.value);
    });

    // setTimeout(): show the first offer after a short delay.
    const offers = ['Get 10% off your next mountain escape!', 'Weekend special: explore beautiful beaches.', 'Plan early and save on selected tour packages.'];
    let offerIndex = 0;
    setTimeout(function () {
        document.getElementById('offerText').textContent = offers[offerIndex];
    }, 1000);

    // setInterval(): rotate promotional offers every 7 seconds.
    setInterval(function () {
        offerIndex = (offerIndex + 1) % offers.length;
        document.getElementById('offerText').textContent = offers[offerIndex];
    }, 7000);

    // CALLBACKS: the second asynchronous task starts after the first finishes.
    function firstTask(callback) {
        setTimeout(function () { callback('Step 1 complete: Dashboard is ready.'); }, 700);
    }
    function secondTask(callback) {
        setTimeout(function () { callback('Step 2 complete: Remember your booking details.'); }, 700);
    }
    document.getElementById('callbackButton').addEventListener('click', function () {
        const output = document.getElementById('callbackMessage');
        output.textContent = 'Running tasks...';
        firstTask(function (firstMessage) {
            output.textContent = firstMessage;
            secondTask(function (secondMessage) {
                output.textContent = firstMessage + ' ' + secondMessage;
            });
        });
    });

    // FETCH API: load package data from the local JSON file.
    async function loadPackages() {
        const loading = document.getElementById('loading');
        const error = document.getElementById('error');
        loading.hidden = false;
        error.hidden = true;
        try {
            const response = await fetch('destinations.json');
            if (!response.ok) throw new Error('Could not retrieve destination data.');
            const places = await response.json();
            loading.hidden = true;

            places.forEach(function (place) {
                const option = document.createElement('option');
                option.value = place.name;
                option.textContent = place.name;
                destinationSelect.appendChild(option);
            });

            const savedPlace = localStorage.getItem('wanderGoDestination');
            if (savedPlace && places.some(place => place.name === savedPlace)) {
                destinationSelect.value = savedPlace;
            }
            displayPackages(places, destinationSelect.value);

            destinationSelect.addEventListener('change', function () {
                localStorage.setItem('wanderGoDestination', destinationSelect.value);
                displayPackages(places, destinationSelect.value);
            });
            document.getElementById('clearPreference').addEventListener('click', function () {
                localStorage.removeItem('wanderGoDestination');
                destinationSelect.value = 'all';
                displayPackages(places, 'all');
            });
        } catch (err) {
            loading.hidden = true;
            error.hidden = false;
            error.textContent = err.message + ' Please run the project using VS Code Live Server.';
        }
    }

    // Create webpage cards using the data received from JSON.
    function displayPackages(places, selected) {
        const list = document.getElementById('packageList');
        list.innerHTML = '';
        const filtered = selected === 'all' ? places : places.filter(place => place.name === selected);
        filtered.forEach(function (place) {
            const card = document.createElement('article');
            card.className = 'card';
            const img = document.createElement('img');
            img.src = place.image;
            img.alt = place.name;
            img.loading = 'lazy';
            const content = document.createElement('div');
            content.className = 'card-content';
            const title = document.createElement('h3');
            title.textContent = place.name;
            const description = document.createElement('p');
            description.textContent = place.description;
            const bottom = document.createElement('div');
            bottom.className = 'bottom';
            const price = document.createElement('span');
            price.className = 'price';
            price.textContent = place.price;
            const duration = document.createElement('span');
            duration.className = 'duration';
            duration.textContent = place.duration;
            bottom.append(price, duration);
            content.append(title, description, bottom);
            card.append(img, content);
            list.appendChild(card);
        });
        document.getElementById('resultCount').textContent = filtered.length + ' package(s) found';
    }

    loadPackages();
});
