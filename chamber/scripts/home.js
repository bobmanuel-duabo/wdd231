const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#primary-nav");
const spotlights = document.querySelector("#spotlights");
const spotlightStatus = document.querySelector("#spotlight-status");

// Footer dates
document.querySelector("#currentyear").textContent =
    new Date().getFullYear();

document.querySelector("#lastModified").textContent =
    `Last Modification: ${document.lastModified}`;

// Mobile navigation
menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuButton.textContent = isOpen ? "✕" : "☰";
});

// Create spotlight cards
function displaySpotlights(members) {
    spotlights.replaceChildren();

    const membershipNames = {
        2: "Silver Member",
        3: "Gold Member"
    };

    members.forEach((member) => {
        const card = document.createElement("section");
        card.classList.add("member-card");

        const logo = document.createElement("img");
        logo.src = `images/${member.image}`;
        logo.alt = `${member.name} logo`;
        logo.width = 120;
        logo.height = 120;
        logo.loading = "lazy";

        const name = document.createElement("h3");
        name.textContent = member.name;

        const address = document.createElement("p");
        address.textContent = member.address;

        const phone = document.createElement("p");
        const phoneLink = document.createElement("a");
        phoneLink.href = `tel:${member.phone.replace(/\s/g, "")}`;
        phoneLink.textContent = member.phone;
        phone.appendChild(phoneLink);

        const website = document.createElement("a");
        website.href = member.website;
        website.textContent = "Visit Website";
        website.setAttribute(
            "aria-label",
            `Visit ${member.name} website`
        );

        const membership = document.createElement("p");
        membership.classList.add("membership");
        membership.textContent =
            membershipNames[member.membershipLevel];

        card.append(
            logo,
            name,
            address,
            phone,
            website,
            membership
        );

        spotlights.appendChild(card);
    });
}

// Fetch members and randomly select three eligible businesses
async function getSpotlights() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }

        const members = await response.json();

        const eligibleMembers = members.filter((member) =>
            Number(member.membershipLevel) === 2 ||
            Number(member.membershipLevel) === 3
        );

        // Fisher–Yates shuffle
        for (let i = eligibleMembers.length - 1; i > 0; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));

            [eligibleMembers[i], eligibleMembers[randomIndex]] =
                [eligibleMembers[randomIndex], eligibleMembers[i]];
        }

        displaySpotlights(eligibleMembers.slice(0, 3));
        spotlightStatus.textContent = "";
    } catch (error) {
        console.error("Spotlight error:", error);
        spotlightStatus.textContent =
            "Unable to load member spotlights. Please try again later.";
    }
}

getSpotlights();

// Port Harcourt weather
const apiKey = "dccab4cca97b6dbf9f446445301a8c49";
const latitude = 4.8156;
const longitude = 7.0498;

const currentWeather = document.querySelector("#current-weather");
const forecastContainer = document.querySelector("#forecast");
const weatherStatus = document.querySelector("#weather-status");

const weatherParameters =
    `lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;

async function fetchWeatherData(endpoint) {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/${endpoint}?${weatherParameters}`
    );

    if (!response.ok) {
        throw new Error(`Weather request failed: ${response.status}`);
    }

    return response.json();
}

async function loadCurrentWeather() {
    try {
        const data = await fetchWeatherData("weather");

        const temperature = document.createElement("p");
        temperature.classList.add("weather-temperature");
        temperature.textContent = `${Math.round(data.main.temp)}°C`;

        const description = document.createElement("p");
        description.classList.add("weather-description");
        description.textContent = data.weather[0].description;

        const source = document.createElement("a");
        source.href = "https://openweathermap.org/";
        source.textContent = "Weather data: OpenWeather";

        currentWeather.replaceChildren(
            temperature,
            description,
            source
        );

        weatherStatus.textContent = "";
    } catch (error) {
        console.error(error.message);
        weatherStatus.textContent =
            "Current weather is unavailable. Please try again later.";
    }
}

async function loadForecast() {
    try {
        const data = await fetchWeatherData("forecast");

        // Convert timestamps to the location's local date and hour.
        const localDate = (timestamp) =>
            new Date((timestamp + data.city.timezone) * 1000);

        const today = localDate(Math.floor(Date.now() / 1000))
            .toISOString().slice(0, 10);

        const dailyReadings = new Map();

        data.list.forEach((reading) => {
            const date = localDate(reading.dt);
            const dateKey = date.toISOString().slice(0, 10);

            if (dateKey <= today) {
                return;
            }

            // Choose the reading nearest 1 p.m. local time.
            const distance = Math.abs(date.getUTCHours() - 13);
            const existing = dailyReadings.get(dateKey);

            if (!existing || distance < existing.distance) {
                dailyReadings.set(dateKey, {
                    reading,
                    distance
                });
            }
        });

        forecastContainer.replaceChildren();

        [...dailyReadings.values()].slice(0, 3).forEach(({ reading }) => {
            const row = document.createElement("p");
            row.classList.add("forecast-day");

            const label = localDate(reading.dt).toLocaleDateString(
                "en-GB",
                {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    timeZone: "UTC"
                }
            );

            row.textContent =
                `${label}: ${Math.round(reading.main.temp)}°C` +
                " — around 1 p.m.";

            forecastContainer.appendChild(row);
        });
    } catch (error) {
        console.error(error.message);
        forecastContainer.textContent =
            "Forecast is unavailable. Please try again later.";
    }
}

loadCurrentWeather();
loadForecast();