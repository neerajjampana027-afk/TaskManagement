/* =====================================================
   TASKFLOW
   AUTHENTICATION + TASK MANAGEMENT
===================================================== */


/* =====================================================
   GLOBAL DATA
===================================================== */

let registeredUsers =
    JSON.parse(localStorage.getItem("taskflowUsers")) || [];

let tasks =
    JSON.parse(localStorage.getItem("taskflowTasks")) || [];

let activities =
    JSON.parse(localStorage.getItem("taskflowActivities")) || [];

let currentUser =
    JSON.parse(localStorage.getItem("taskflowCurrentUser")) || null;


/* =====================================================
   QUOTES
===================================================== */

const quotes = [

    {
        text: "Success is the sum of small efforts, repeated day in and day out.",
        author: "Robert Collier"
    },

    {
        text: "The secret of getting ahead is getting started.",
        author: "Mark Twain"
    },

    {
        text: "It always seems impossible until it's done.",
        author: "Nelson Mandela"
    },

    {
        text: "Great things are done by a series of small things brought together.",
        author: "Vincent Van Gogh"
    },

    {
        text: "Don't watch the clock; do what it does. Keep going.",
        author: "Sam Levenson"
    },

    {
        text: "Your future is created by what you do today.",
        author: "Robert Kiyosaki"
    }

];


function loadQuote() {

    const quote =
        quotes[Math.floor(Math.random() * quotes.length)];

    document.getElementById("quoteText").textContent =
        quote.text;

    document.getElementById("quoteAuthor").textContent =
        "— " + quote.author;
}


/* =====================================================
   AUTHENTICATION
===================================================== */

function showSignIn() {

    document
        .getElementById("signInPage")
        .classList.remove("hidden");

    document
        .getElementById("signUpPage")
        .classList.add("hidden");

    clearAuthMessages();
}


function showSignUp() {

    document
        .getElementById("signInPage")
        .classList.add("hidden");

    document
        .getElementById("signUpPage")
        .classList.remove("hidden");

    clearAuthMessages();
}


function clearAuthMessages() {

    document
        .getElementById("authMessage")
        .className = "auth-message";

    document
        .getElementById("authMessage")
        .textContent = "";

    document
        .getElementById("signUpMessage")
        .className = "auth-message";

    document
        .getElementById("signUpMessage")
        .textContent = "";
}


function showAuthMessage(message, type, id = "authMessage") {

    const box =
        document.getElementById(id);

    box.textContent = message;

    box.className =
        "auth-message " + type;
}


/* =====================================================
   EMAIL VALIDATION
===================================================== */

function validEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* =====================================================
   PASSWORD VISIBILITY
===================================================== */

function togglePassword(id, button) {

    const input =
        document.getElementById(id);

    if (input.type === "password") {

        input.type = "text";

        button.textContent = "🙈";

    } else {

        input.type = "password";

        button.textContent = "👁";

    }

}


/* =====================================================
   PASSWORD STRENGTH
===================================================== */

function checkPasswordStrength() {

    const password =
        document.getElementById("signUpPassword").value;

    const bar =
        document.getElementById("passwordStrengthBar");

    const text =
        document.getElementById("strengthText");


    if (!password) {

        bar.style.width = "0%";

        text.textContent =
            "Password strength";

        return;
    }


    let score = 0;


    if (password.length >= 8)
        score++;

    if (/[A-Z]/.test(password))
        score++;

    if (/[a-z]/.test(password))
        score++;

    if (/[0-9]/.test(password))
        score++;

    if (/[^A-Za-z0-9]/.test(password))
        score++;


    if (score <= 2) {

        bar.style.width = "35%";

        text.textContent =
            "Weak password";

    }

    else if (score === 3 || score === 4) {

        bar.style.width = "70%";

        text.textContent =
            "Medium password";

    }

    else {

        bar.style.width = "100%";

        text.textContent =
            "Strong password";

    }

}


document
    .getElementById("signUpPassword")
    .addEventListener(
        "input",
        checkPasswordStrength
    );


/* =====================================================
   SIGN UP VALIDATION
===================================================== */

document
    .getElementById("signUpForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("signUpName")
                    .value.trim();


            const email =
                document
                    .getElementById("signUpEmail")
                    .value.trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("signUpPassword")
                    .value;


            const confirmPassword =
                document
                    .getElementById("signUpConfirmPassword")
                    .value;


            const terms =
                document
                    .getElementById("termsCheck")
                    .checked;


            clearSignUpErrors();


            let valid = true;


            /* NAME */

            if (name.length < 3) {

                showError(
                    "signUpName",
                    "signUpNameError",
                    "Please enter at least 3 characters."
                );

                valid = false;

            }


            /* EMAIL */

            if (!validEmail(email)) {

                showError(
                    "signUpEmail",
                    "signUpEmailError",
                    "Please enter a valid email address."
                );

                valid = false;

            }


            /* DUPLICATE EMAIL */

            if (
                registeredUsers.some(
                    user => user.email === email
                )
            ) {

                showError(
                    "signUpEmail",
                    "signUpEmailError",
                    "An account with this email already exists."
                );

                valid = false;

            }


            /* PASSWORD */

            if (
                password.length < 8 ||
                !/[A-Z]/.test(password) ||
                !/[0-9]/.test(password)
            ) {

                showError(
                    "signUpPassword",
                    "signUpPasswordError",
                    "Password must be 8+ characters with an uppercase letter and number."
                );

                valid = false;

            }


            /* CONFIRM PASSWORD */

            if (password !== confirmPassword) {

                showError(
                    "signUpConfirmPassword",
                    "signUpConfirmError",
                    "Passwords do not match."
                );

                valid = false;

            }


            /* TERMS */

            if (!terms) {

                document
                    .getElementById("termsError")
                    .textContent =
                    "Please accept the Terms & Conditions.";

                valid = false;

            }


            if (!valid) {

                return;

            }


            /* CREATE USER */

            const newUser = {

                id: Date.now(),

                name: name,

                email: email,

                password: password,

                createdAt:
                    new Date().toISOString()

            };


            registeredUsers.push(newUser);


            localStorage.setItem(
                "taskflowUsers",
                JSON.stringify(registeredUsers)
            );


            showAuthMessage(
                "Account created successfully! Redirecting to Sign In...",
                "success",
                "signUpMessage"
            );


            document
                .getElementById("signUpForm")
                .reset();


            setTimeout(
                () => {

                    showSignIn();

                    document
                        .getElementById("signInEmail")
                        .value = email;

                },
                1200
            );

        }
    );


/* =====================================================
   SIGN IN
===================================================== */

document
    .getElementById("signInForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("signInEmail")
                    .value.trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("signInPassword")
                    .value;


            clearSignInErrors();


            let valid = true;


            if (!validEmail(email)) {

                showError(
                    "signInEmail",
                    "signInEmailError",
                    "Enter a valid email address."
                );

                valid = false;

            }


            if (!password) {

                showError(
                    "signInPassword",
                    "signInPasswordError",
                    "Please enter your password."
                );

                valid = false;

            }


            if (!valid)
                return;


            const user =
                registeredUsers.find(
                    u =>
                        u.email === email &&
                        u.password === password
                );


            if (!user) {

                showAuthMessage(
                    "Incorrect email or password.",
                    "error"
                );

                return;

            }


            /* SAVE CURRENT USER */

            currentUser = {

                id: user.id,

                name: user.name,

                email: user.email

            };


            localStorage.setItem(
                "taskflowCurrentUser",
                JSON.stringify(currentUser)
            );


            if (
                document
                    .getElementById("rememberMe")
                    .checked
            ) {

                localStorage.setItem(
                    "taskflowRemember",
                    "true"
                );

            }


            /* SHOW APPLICATION */

            document
                .getElementById("authSection")
                .classList.add("hidden");


            document
                .getElementById("appSection")
                .classList.remove("hidden");


            updateUserName();

            loadQuote();

            renderTasks();

            renderActivities();

        }
    );


/* =====================================================
   ERROR FUNCTION
===================================================== */

function showError(
    inputId,
    errorId,
    message
) {

    document
        .getElementById(inputId)
        .classList.add("invalid");

    document
        .getElementById(errorId)
        .textContent = message;

}


function clearSignUpErrors() {

    const ids = [

        "signUpName",
        "signUpEmail",
        "signUpPassword",
        "signUpConfirmPassword"

    ];


    ids.forEach(id => {

        document
            .getElementById(id)
            .classList.remove("invalid");

    });


    document
        .getElementById("signUpNameError")
        .textContent = "";

    document
        .getElementById("signUpEmailError")
        .textContent = "";

    document
        .getElementById("signUpPasswordError")
        .textContent = "";

    document
        .getElementById("signUpConfirmError")
        .textContent = "";

    document
        .getElementById("termsError")
        .textContent = "";

}


function clearSignInErrors() {

    document
        .getElementById("signInEmail")
        .classList.remove("invalid");

    document
        .getElementById("signInPassword")
        .classList.remove("invalid");


    document
        .getElementById("signInEmailError")
        .textContent = "";

    document
        .getElementById("signInPasswordError")
        .textContent = "";

}


/* =====================================================
   FORGOT PASSWORD
===================================================== */

function forgotPassword() {

    const email =
        prompt(
            "Enter your registered email address:"
        );


    if (!email)
        return;


    const user =
        registeredUsers.find(
            u =>
                u.email ===
                email.trim().toLowerCase()
        );


    if (!user) {

        alert(
            "No account found with this email."
        );

        return;

    }


    alert(
        "Password reset feature is a demo.\n\n" +
        "In a real system, a reset link would be sent to your email."
    );

}


/* =====================================================
   UPDATE USER
===================================================== */

function updateUserName() {

    if (!currentUser)
        return;


    document
        .getElementById("userName")
        .textContent =
        currentUser.name.split(" ")[0];


    document
        .getElementById("sidebarUserName")
        .textContent =
        currentUser.name;


    document
        .getElementById("sidebarUserEmail")
        .textContent =
        currentUser.email;


    document
        .getElementById("userAvatar")
        .textContent =
        currentUser.name
            .charAt(0)
            .toUpperCase();

}


/* =====================================================
   LOGOUT
===================================================== */

function logout() {

    localStorage.removeItem(
        "taskflowCurrentUser"
    );

    localStorage.removeItem(
        "taskflowRemember"
    );


    currentUser = null;


    document
        .getElementById("appSection")
        .classList.add("hidden");


    document
        .getElementById("authSection")
        .classList.remove("hidden");


    document
        .getElementById("signInForm")
        .reset();


    showSignIn();

}


/* =====================================================
   TASK MODAL
===================================================== */

function openTaskModal(task = null) {

    document
        .getElementById("taskModal")
        .classList.remove("hidden");


    if (task) {

        document
            .getElementById("modalTitle")
            .textContent =
            "Edit Task";


        document
            .getElementById("taskId")
            .value =
            task.id;


        document
            .getElementById("taskTitle")
            .value =
            task.title;


        document
            .getElementById("taskDescription")
            .value =
            task.description || "";


        document
            .getElementById("taskCategory")
            .value =
            task.category;


        document
            .getElementById("taskPriority")
            .value =
            task.priority;


        document
            .getElementById("taskDeadline")
            .value =
            task.deadline || "";


        document
            .getElementById("taskHours")
            .value =
            task.hours || "";


        document
            .getElementById("taskTags")
            .value =
            (task.tags || []).join(", ");


        document
            .getElementById("taskChecklist")
            .value =
            (task.checklist || [])
                .map(item => item.text)
                .join("\n");

    }

    else {

        document
            .getElementById("modalTitle")
            .textContent =
            "Create New Task";


        document
            .getElementById("taskForm")
            .reset();


        document
            .getElementById("taskId")
            .value = "";

    }

}


function closeTaskModal() {

    document
        .getElementById("taskModal")
        .classList.add("hidden");

}


/* =====================================================
   CREATE / EDIT TASK
===================================================== */

document
    .getElementById("taskForm")
    .addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const id =
                document
                    .getElementById("taskId")
                    .value;


            const title =
                document
                    .getElementById("taskTitle")
                    .value.trim();


            if (!title) {

                alert(
                    "Please enter a task title."
                );

                return;

            }


            const description =
                document
                    .getElementById("taskDescription")
                    .value.trim();


            const category =
                document
                    .getElementById("taskCategory")
                    .value;


            const priority =
                document
                    .getElementById("taskPriority")
                    .value;


            const deadline =
                document
                    .getElementById("taskDeadline")
                    .value;


            const hours =
                document
                    .getElementById("taskHours")
                    .value;


            const tags =
                document
                    .getElementById("taskTags")
                    .value
                    .split(",")
                    .map(tag => tag.trim())
                    .filter(tag => tag);


            const checklistText =
                document
                    .getElementById("taskChecklist")
                    .value
                    .split("\n")
                    .map(item => item.trim())
                    .filter(item => item);


            let checklist =
                checklistText.map(
                    text => ({
                        text: text,
                        completed: false
                    })
                );


            /* EDIT EXISTING */

            if (id) {

                const index =
                    tasks.findIndex(
                        task =>
                            task.id == id
                    );


                if (index !== -1) {

                    const oldChecklist =
                        tasks[index].checklist || [];


                    checklist =
                        checklist.map(
                            item => {

                                const old =
                                    oldChecklist.find(
                                        x =>
                                            x.text ===
                                            item.text
                                    );

                                return {

                                    text: item.text,

                                    completed:
                                        old
                                            ? old.completed
                                            : false

                                };

                            }
                        );


                    tasks[index] = {

                        ...tasks[index],

                        title,

                        description,

                        category,

                        priority,

                        deadline,

                        hours,

                        tags,

                        checklist

                    };


                    addActivity(
                        "✏️",
                        `Updated task "${title}"`
                    );

                }

            }

            else {

                const newTask = {

                    id: Date.now(),

                    title,

                    description,

                    category,

                    priority,

                    deadline,

                    hours,

                    tags,

                    checklist,

                    status: "todo",

                    createdAt:
                        new Date().toISOString()

                };


                tasks.push(newTask);


                addActivity(
                    "➕",
                    `Created task "${title}"`
                );

            }


            saveTasks();

            closeTaskModal();

            renderTasks();

        }
    );


/* =====================================================
   SAVE TASKS
===================================================== */

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

}


/* =====================================================
   RENDER TASKS
===================================================== */

function renderTasks() {

    const todoList =
        document.getElementById("todoList");

    const progressList =
        document.getElementById("progressList");

    const completedList =
        document.getElementById("completedList");


    todoList.innerHTML = "";

    progressList.innerHTML = "";

    completedList.innerHTML = "";


    let filteredTasks =
        [...tasks];


    /* SEARCH */

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();


    if (search) {

        filteredTasks =
            filteredTasks.filter(
                task =>
                    task.title
                        .toLowerCase()
                        .includes(search) ||

                    task.description
                        .toLowerCase()
                        .includes(search) ||

                    task.category
                        .toLowerCase()
                        .includes(search) ||

                    (task.tags || [])
                        .some(
                            tag =>
                                tag
                                    .toLowerCase()
                                    .includes(search)
                        )
            );

    }


    /* PRIORITY */

    const priority =
        document
            .getElementById("priorityFilter")
            .value;


    if (priority !== "all") {

        filteredTasks =
            filteredTasks.filter(
                task =>
                    task.priority === priority
            );

    }


    /* SORT */

    const sort =
        document
            .getElementById("sortFilter")
            .value;


    if (sort === "newest") {

        filteredTasks.sort(
            (a, b) =>
                b.id - a.id
        );

    }


    if (sort === "oldest") {

        filteredTasks.sort(
            (a, b) =>
                a.id - b.id
        );

    }


    if (sort === "priority") {

        const order = {

            High: 1,

            Medium: 2,

            Low: 3

        };


        filteredTasks.sort(
            (a, b) =>
                order[a.priority] -
                order[b.priority]
        );

    }


    if (sort === "deadline") {

        filteredTasks.sort(
            (a, b) =>
                new Date(a.deadline || "9999-12-31") -
                new Date(b.deadline || "9999-12-31")
        );

    }


    /* RENDER */

    filteredTasks.forEach(
        task => {

            const card =
                createTaskCard(task);


            if (task.status === "todo") {

                todoList.appendChild(card);

            }

            else if (
                task.status === "progress"
            ) {

                progressList.appendChild(card);

            }

            else {

                completedList.appendChild(card);

            }

        }
    );


    if (!todoList.children.length)
        todoList.innerHTML =
            '<div class="empty-task">No tasks here</div>';


    if (!progressList.children.length)
        progressList.innerHTML =
            '<div class="empty-task">No tasks here</div>';


    if (!completedList.children.length)
        completedList.innerHTML =
            '<div class="empty-task">No tasks here</div>';


    updateDashboard();

}


/* =====================================================
   CREATE TASK CARD
===================================================== */

function createTaskCard(task) {

    const card =
        document.createElement("div");


    card.className =
        "task-card";


    card.draggable = true;


    card.dataset.id =
        task.id;


    card.addEventListener(
        "dragstart",
        dragStart
    );


    const priorityClass =
        "priority-" +
        task.priority.toLowerCase();


    let deadlineHTML = "";


    if (task.deadline) {

        const deadlineDate =
            new Date(
                task.deadline + "T23:59:59"
            );


        const today =
            new Date();


        const overdue =
            deadlineDate < today &&
            task.status !== "completed";


        deadlineHTML = `

            <div class="task-deadline ${overdue ? "overdue" : ""}">

                📅
                ${formatDate(task.deadline)}

                ${overdue ? " • OVERDUE" : ""}

            </div>

        `;

    }


    let tagsHTML = "";


    if (task.tags && task.tags.length) {

        tagsHTML = `

            <div class="task-tags">

                ${task.tags
                    .map(
                        tag =>
                            `<span class="tag">#${escapeHTML(tag)}</span>`
                    )
                    .join("")}

            </div>

        `;

    }


    let checklistHTML = "";


    if (
        task.checklist &&
        task.checklist.length
    ) {

        checklistHTML = `

            <div class="checklist">

                ${task.checklist
                    .map(
                        (item, index) => `

                        <label class="check-item ${
                            item.completed
                                ? "completed"
                                : ""
                        }">

                            <input
                                type="checkbox"
                                ${
                                    item.completed
                                        ? "checked"
                                        : ""
                                }
                                onchange="toggleChecklist(
                                    ${task.id},
                                    ${index}
                                )"
                            >

                            <span>
                                ${escapeHTML(item.text)}
                            </span>

                        </label>

                    `
                    )
                    .join("")}

            </div>

        `;

    }


    card.innerHTML = `

        <div class="task-title">
            ${escapeHTML(task.title)}
        </div>


        ${
            task.description
                ? `
                    <div class="task-description">
                        ${escapeHTML(task.description)}
                    </div>
                `
                : ""
        }


        <div class="task-meta">

            <span class="task-badge ${priorityClass}">
                ${task.priority}
            </span>

            <span class="task-badge">
                ${escapeHTML(task.category)}
            </span>

            ${
                task.hours
                    ? `
                        <span class="task-badge">
                            ⏱ ${task.hours}h
                        </span>
                    `
                    : ""
            }

        </div>


        ${tagsHTML}

        ${deadlineHTML}

        ${checklistHTML}


        <div class="task-actions">

            ${
                task.status !== "todo"
                    ? `
                        <button
                            class="task-action"
                            onclick="changeStatus(
                                ${task.id},
                                'todo'
                            )"
                        >
                            ← To Do
                        </button>
                    `
                    : ""
            }


            ${
                task.status !== "progress"
                    ? `
                        <button
                            class="task-action"
                            onclick="changeStatus(
                                ${task.id},
                                'progress'
                            )"
                        >
                            ${task.status === "todo" ? "Start" : "Progress"}
                        </button>
                    `
                    : ""
            }


            ${
                task.status !== "completed"
                    ? `
                        <button
                            class="task-action"
                            onclick="changeStatus(
                                ${task.id},
                                'completed'
                            )"
                        >
                            ✓ Done
                        </button>
                    `
                    : ""
            }


            <button
                class="task-action"
                onclick="editTask(${task.id})"
            >
                ✏️
            </button>


            <button
                class="task-action delete-action"
                onclick="deleteTask(${task.id})"
            >
                🗑
            </button>

        </div>

    `;


    return card;

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;

}


/* =====================================================
   DATE
===================================================== */

function formatDate(dateString) {

    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =====================================================
   CHANGE STATUS
===================================================== */

function changeStatus(id, status) {

    const task =
        tasks.find(
            task =>
                task.id === id
        );


    if (!task)
        return;


    const oldStatus =
        task.status;


    task.status =
        status;


    if (
        status === "completed" &&
        oldStatus !== "completed"
    ) {

        addActivity(
            "✅",
            `Completed task "${task.title}"`
        );

    }

    else if (
        status === "progress" &&
        oldStatus !== "progress"
    ) {

        addActivity(
            "⏳",
            `Started task "${task.title}"`
        );

    }


    saveTasks();

    renderTasks();

}


/* =====================================================
   EDIT TASK
===================================================== */

function editTask(id) {

    const task =
        tasks.find(
            task =>
                task.id === id
        );


    if (!task)
        return;


    openTaskModal(task);

}


/* =====================================================
   DELETE TASK
===================================================== */

function deleteTask(id) {

    const task =
        tasks.find(
            task =>
                task.id === id
        );


    if (!task)
        return;


    const confirmDelete =
        confirm(
            `Delete "${task.title}"?`
        );


    if (!confirmDelete)
        return;


    tasks =
        tasks.filter(
            task =>
                task.id !== id
        );


    addActivity(
        "🗑",
        `Deleted task "${task.title}"`
    );


    saveTasks();

    renderTasks();

}


/* =====================================================
   CHECKLIST
===================================================== */

function toggleChecklist(
    taskId,
    itemIndex
) {

    const task =
        tasks.find(
            task =>
                task.id === taskId
        );


    if (!task)
        return;


    task.checklist[itemIndex].completed =
        !task.checklist[itemIndex].completed;


    saveTasks();

    renderTasks();

}


/* =====================================================
   DRAG AND DROP
===================================================== */

let draggedTaskId = null;


function dragStart(event) {

    draggedTaskId =
        Number(
            event.currentTarget.dataset.id
        );


    event.currentTarget.classList.add(
        "dragging"
    );

}


function allowDrop(event) {

    event.preventDefault();

}


function dropTask(event, status) {

    event.preventDefault();


    if (!draggedTaskId)
        return;


    const task =
        tasks.find(
            task =>
                task.id === draggedTaskId
        );


    if (task) {

        task.status =
            status;


        addActivity(
            "🔄",
            `Moved "${task.title}"`
        );


        saveTasks();

        renderTasks();

    }


    draggedTaskId = null;

}


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task =>
                task.status === "completed"
        ).length;


    const progress =
        tasks.filter(
            task =>
                task.status === "progress"
        ).length;


    const today =
        new Date();


    const overdue =
        tasks.filter(
            task => {

                if (!task.deadline)
                    return false;


                return (
                    new Date(
                        task.deadline +
                        "T23:59:59"
                    ) < today &&
                    task.status !== "completed"
                );

            }
        ).length;


    const rate =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );


    document
        .getElementById("totalCount")
        .textContent =
        total;


    document
        .getElementById("completedCount")
        .textContent =
        completed;


    document
        .getElementById("progressCount")
        .textContent =
        progress;


    document
        .getElementById("overdueCount")
        .textContent =
        overdue;


    document
        .getElementById("completionRate")
        .textContent =
        rate + "%";


    document
        .getElementById("todoCount")
        .textContent =
        tasks.filter(
            task =>
                task.status === "todo"
        ).length;


    document
        .getElementById("progressColumnCount")
        .textContent =
        progress;


    document
        .getElementById("completedColumnCount")
        .textContent =
        completed;


    /* PRODUCTIVITY */

    const score =
        Math.min(
            100,
            Math.round(
                rate * 0.7 +
                Math.min(
                    completed * 5,
                    30
                )
            )
        );


    document
        .getElementById("productivityScore")
        .textContent =
        score;


    document
        .getElementById("goalProgress")
        .style.width =
        score + "%";


    document
        .getElementById("goalText")
        .textContent =
        completed === 0
            ? "Complete your first task to start your goal."
            : `${completed} task${completed > 1 ? "s" : ""} completed. Keep going!`;

}


/* =====================================================
   ACTIVITY
===================================================== */

function addActivity(
    icon,
    message
) {

    activities.unshift({

        id: Date.now(),

        icon,

        message,

        time:
            new Date().toISOString()

    });


    activities =
        activities.slice(0, 10);


    localStorage.setItem(
        "taskflowActivities",
        JSON.stringify(activities)
    );


    renderActivities();

}


function renderActivities() {

    const container =
        document.getElementById(
            "activityList"
        );


    if (!activities.length) {

        container.innerHTML =
            `<p class="empty-activity">
                No activity yet.
            </p>`;

        return;

    }


    container.innerHTML =
        activities
            .slice(0, 7)
            .map(
                activity => `

                <div class="activity-item">

                    <div class="activity-icon">
                        ${activity.icon}
                    </div>

                    <div>

                        <p>
                            ${escapeHTML(
                                activity.message
                            )}
                        </p>

                        <small>
                            ${timeAgo(
                                activity.time
                            )}
                        </small>

                    </div>

                </div>

            `
            )
            .join("");

}


/* =====================================================
   TIME AGO
===================================================== */

function timeAgo(time) {

    const seconds =
        Math.floor(
            (
                Date.now() -
                new Date(time).getTime()
            ) / 1000
        );


    if (seconds < 60)
        return "Just now";


    const minutes =
        Math.floor(seconds / 60);


    if (minutes < 60)
        return `${minutes} min ago`;


    const hours =
        Math.floor(minutes / 60);


    if (hours < 24)
        return `${hours} hr ago`;


    const days =
        Math.floor(hours / 24);


    return `${days} day${days > 1 ? "s" : ""} ago`;

}


/* =====================================================
   AUTO LOGIN
===================================================== */

window.addEventListener(
    "load",
    function() {

        const remember =
            localStorage.getItem(
                "taskflowRemember"
            );


        if (
            remember === "true" &&
            currentUser
        ) {

            document
                .getElementById("authSection")
                .classList.add("hidden");


            document
                .getElementById("appSection")
                .classList.remove("hidden");


            updateUserName();

            loadQuote();

            renderTasks();

            renderActivities();

        }

    }
);


/* =====================================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
===================================================== */

document
    .getElementById("taskModal")
    .addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                this
            ) {

                closeTaskModal();

            }

        }
    );


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key === "Escape"
        ) {

            closeTaskModal();

        }

    }
);