const url =
    "https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json";

const cards = document.querySelector("#cards");
const statusMessage = document.querySelector("#status");

const displayProphets = (prophets) => {
    cards.replaceChildren();

    prophets.forEach((prophet) => {
        const card = document.createElement("section");
        const fullName = document.createElement("h2");
        const birthDate = document.createElement("p");
        const birthPlace = document.createElement("p");
        const portrait = document.createElement("img");

        fullName.textContent = `${prophet.name} ${prophet.lastname}`;
        birthDate.textContent = `Date of Birth: ${prophet.birthdate}`;
        birthPlace.textContent = `Place of Birth: ${prophet.birthplace}`;

        portrait.setAttribute("src", prophet.imageurl);
        portrait.setAttribute(
            "alt",
            `Portrait of ${prophet.name} ${prophet.lastname}`
        );
        portrait.setAttribute("loading", "lazy");
        portrait.setAttribute("width", "340");
        portrait.setAttribute("height", "440");

        card.appendChild(fullName);
        card.appendChild(birthDate);
        card.appendChild(birthPlace);
        card.appendChild(portrait);

        cards.appendChild(card);
    });
};

async function getProphetData() {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();

        console.table(data.prophets);
        displayProphets(data.prophets);
        statusMessage.textContent = "";
    } catch (error) {
        console.error("Could not load prophet information:", error);
        statusMessage.textContent =
            "Unable to load prophet information. Please try refreshing the page.";
    }
}

getProphetData();