const courses = [
    {
        subject: "CSE",
        number: 110,
        title: "Introduction to Programming",
        credits: 2,
        completed: false
    },
    {
        subject: "WDD",
        number: 130,
        title: "Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        subject: "CSE",
        number: 111,
        title: "Programming with Functions",
        credits: 2,
        completed: true
    },
    {
        subject: "CSE",
        number: 210,
        title: "Programming with Classes",
        credits: 2,
        completed: false
    },
    {
        subject: "WDD",
        number: 131,
        title: "Dynamic Web Fundamentals",
        credits: 2,
        completed: true
    },
    {
        subject: "WDD",
        number: 231,
        title: "Web Frontend Development I",
        credits: 2,
        completed: false
    }
];

const courseContainer = document.querySelector("#course-container");
const creditTotal = document.querySelector("#credit-total");
const filterButtons = document.querySelectorAll(".filter-btn");

function displayCourses(courseList) {

    courseContainer.innerHTML = courseList.map(course => `
        <article class="course ${course.completed ? "completed" : ""}">
            <h3>${course.subject} ${course.number}</h3>
            <p>${course.title}</p>
            <p>${course.credits} Credits</p>
            <p class="status">
                ${course.completed ? "✓ Completed" : "Not Completed"}
            </p>
        </article>
    `).join("");

    const totalCredits = courseList.reduce(
        (total, course) => total + course.credits, 0
    );

    creditTotal.textContent =
        `Total Credits: ${totalCredits}`;
}

function filterCourses(subject) {

    const filteredCourses = subject === "ALL"
        ? courses
        : courses.filter(course => course.subject === subject);

    displayCourses(filteredCourses);

    filterButtons.forEach(button => {
        const isSelected = button.dataset.filter === subject;

        button.classList.toggle("selected", isSelected);
        button.setAttribute("aria-pressed", isSelected);
    });
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterCourses(button.dataset.filter);
    });
});

filterCourses("ALL");