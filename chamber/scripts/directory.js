const membersContainer = document.querySelector("#members");
const statusMessage = document.querySelector("#status");
const gridButton = document.querySelector("#grid-button");
const listButton = document.querySelector("#list-button");
const menuButton = document.querySelector("#menu-button");
const navigation = document.querySelector("#primary-nav");

// Display the footer dates.
document.querySelector("#currentyear").textContent =
    new Date().getFullYear();

document.querySelector("#lastModified").textContent =
    `Last Modification: ${document.lastModified}`;

// Open and close the mobile navigation.
menuButton.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("open");

    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuButton.textContent = isOpen ? "✕" : "☰";
});

// Switch between grid and list layouts.
function setView(view) {
    membersContainer.classList.toggle("grid", view === "grid");
    membersContainer.classList.toggle("list", view === "list");

    gridButton.setAttribute("aria-pressed", String(view === "grid"));
    listButton.setAttribute("aria-pressed", String(view === "list"));
}

gridButton.addEventListener("click", () => setView("grid"));
listButton.addEventListener("click", () => setView("list"));

// Build a card for each business.
const displayMembers = (members) => {
    membersContainer.replaceChildren();

    const membershipNames = {
        1: "Member",
        2: "Silver Member",
        3: "Gold Member"
    };

    members.forEach((member) => {
        const card = document.createElement("section");
        card.classList.add("member-card");

        const image = document.createElement("img");
        image.setAttribute("src", `images/${member.image}`);
        image.setAttribute("alt", `${member.name} logo`);
        image.setAttribute("loading", "lazy");
        image.setAttribute("width", "120");
        image.setAttribute("height", "120");

        const name = document.createElement("h2");
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

        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(address);
        card.appendChild(phone);
        card.appendChild(website);
        card.appendChild(membership);

        membersContainer.appendChild(card);
    });
};

// Fetch the local JSON file and display its records.
async function getMembers() {
    try {
        const response = await fetch("data/members.json");

        if (!response.ok) {
            throw new Error(
                `Unable to load members: ${response.status}`
            );
        }

        const members = await response.json();

        displayMembers(members);
        statusMessage.textContent = "";
    } catch (error) {
        console.error("Directory error:", error);

        statusMessage.textContent =
            "Unable to load members. Please refresh the page.";
    }
}

getMembers();