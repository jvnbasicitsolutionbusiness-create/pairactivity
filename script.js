/* =====================================================
   GOOGLE APPS SCRIPT API
===================================================== */

const API_URL =
    "https://script.google.com/macros/s/AKfycbyC0kBPRm8aK_wacD2b80S0lPjTsGSdyxJpa9-P9fRyL3iHHOWIH6jBpyVyD-geQtan/exec";


/* =====================================================
   DATA
===================================================== */

let students = [];

let editStudentID = null;


/* =====================================================
   INITIAL LOAD
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    loadStudents();

});


/* =====================================================
   READ FROM GOOGLE SHEETS
===================================================== */

async function loadStudents() {

    try {

        showMessage(
            "Loading student records...",
            "success"
        );


        const response = await fetch(
            API_URL + "?action=get",
            {
                method: "GET"
            }
        );


        if (!response.ok) {

            throw new Error(
                "Unable to connect to Google Apps Script."
            );

        }


        const result = await response.json();


        if (!result.success) {

            throw new Error(
                result.message || "Failed to load students."
            );

        }


        students = result.students || [];


        displayStudents();


        hideMessage();


    } catch (error) {

        console.error(
            "LOAD ERROR:",
            error
        );


        showMessage(
            "Unable to load data from Google Sheets. Check your Apps Script URL.",
            "error"
        );

    }

}


/* =====================================================
   CREATE
===================================================== */

async function addStudent() {


    const studentID =
        document
            .getElementById("studentID")
            .value
            .trim();


    const firstName =
        document
            .getElementById("firstName")
            .value
            .trim();


    const lastName =
        document
            .getElementById("lastName")
            .value
            .trim();


    const course =
        document
            .getElementById("course")
            .value
            .trim();


    const email =
        document
            .getElementById("email")
            .value
            .trim();


    const yearLevel =
        document
            .getElementById("yearLevel")
            .value;



    /* =========================
       VALIDATION
    ========================= */

    if (
        studentID === "" ||
        firstName === "" ||
        lastName === "" ||
        course === "" ||
        email === "" ||
        yearLevel === ""
    ) {

        showMessage(
            "Please fill in all fields.",
            "error"
        );

        return;

    }



    /* =========================
       DUPLICATE CHECK
    ========================= */

    const duplicate =
        students.some(
            student =>
                String(student.studentID)
                    .toLowerCase() ===
                studentID.toLowerCase()
        );


    if (duplicate) {

        showMessage(
            "Student ID already exists.",
            "error"
        );

        return;

    }



    /* =========================
       DATA OBJECT
    ========================= */

    const student = {

        action: "add",

        studentID: studentID,

        firstName: firstName,

        lastName: lastName,

        course: course,

        email: email,

        yearLevel: yearLevel

    };



    /* =========================
       SEND TO GOOGLE SHEETS
    ========================= */

    try {

        showMessage(
            "Saving student...",
            "success"
        );


        const result =
            await sendToAppsScript(student);


        if (!result.success) {

            throw new Error(
                result.message ||
                "Failed to add student."
            );

        }



        /* =========================
           SUCCESS
        ========================= */

        showMessage(
            "Student successfully added to Google Sheets.",
            "success"
        );


        clearForm();


        await loadStudents();


    } catch (error) {

        console.error(
            "ADD ERROR:",
            error
        );


        showMessage(
            "Failed to save student: " +
            error.message,
            "error"
        );

    }

}


/* =====================================================
   SEND DATA TO APPS SCRIPT
===================================================== */

async function sendToAppsScript(data) {

    const response =
        await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                },

                body: JSON.stringify(data)
            }
        );


    if (!response.ok) {

        throw new Error(
            "HTTP Error: " +
            response.status
        );

    }


    const result =
        await response.json();


    return result;

}


/* =====================================================
   READ / DISPLAY
===================================================== */

function displayStudents(
    studentList = students
) {


    const table =
        document.getElementById(
            "studentTable"
        );


    table.innerHTML = "";



    /* =========================
       EMPTY
    ========================= */

    if (
        !studentList ||
        studentList.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty">

                    No student records found.

                </td>

            </tr>

        `;

        return;

    }



    /* =========================
       DISPLAY RECORDS
    ========================= */

    studentList.forEach(
        function (student) {


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${escapeHTML(student.studentID)}
                </td>

                <td>
                    ${escapeHTML(student.firstName)}
                </td>

                <td>
                    ${escapeHTML(student.lastName)}
                </td>

                <td>
                    ${escapeHTML(student.course)}
                </td>

                <td>
                    ${escapeHTML(student.email)}
                </td>

                <td>
                    ${escapeHTML(student.yearLevel)}
                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editStudent('${escapeAttribute(student.studentID)}')">

                        Edit

                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteStudent('${escapeAttribute(student.studentID)}')">

                        Delete

                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


/* =====================================================
   EDIT - LOAD STUDENT
===================================================== */

function editStudent(studentID) {


    const student =
        students.find(
            function (item) {

                return String(item.studentID)
                    .toLowerCase() ===
                    String(studentID)
                        .toLowerCase();

            }
        );


    if (!student) {

        showMessage(
            "Student record not found.",
            "error"
        );

        return;

    }



    /* =========================
       LOAD DATA INTO FORM
    ========================= */

    document.getElementById(
        "studentID"
    ).value =
        student.studentID;


    document.getElementById(
        "firstName"
    ).value =
        student.firstName;


    document.getElementById(
        "lastName"
    ).value =
        student.lastName;


    document.getElementById(
        "course"
    ).value =
        student.course;


    document.getElementById(
        "email"
    ).value =
        student.email;


    document.getElementById(
        "yearLevel"
    ).value =
        student.yearLevel;



    /* =========================
       REMEMBER ORIGINAL ID
    ========================= */

    editStudentID =
        student.studentID;



    /* =========================
       CHANGE BUTTONS
    ========================= */

    document.getElementById(
        "addBtn"
    ).style.display =
        "none";


    document.getElementById(
        "updateBtn"
    ).style.display =
        "block";


    document.getElementById(
        "cancelBtn"
    ).style.display =
        "block";



    /* =========================
       SCROLL TOP
    ========================= */

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =====================================================
   UPDATE
===================================================== */

async function updateStudent() {


    if (
        editStudentID === null
    ) {

        showMessage(
            "No student selected for update.",
            "error"
        );

        return;

    }



    const studentID =
        document
            .getElementById("studentID")
            .value
            .trim();


    const firstName =
        document
            .getElementById("firstName")
            .value
            .trim();


    const lastName =
        document
            .getElementById("lastName")
            .value
            .trim();


    const course =
        document
            .getElementById("course")
            .value
            .trim();


    const email =
        document
            .getElementById("email")
            .value
            .trim();


    const yearLevel =
        document
            .getElementById("yearLevel")
            .value;



    /* =========================
       VALIDATION
    ========================= */

    if (
        studentID === "" ||
        firstName === "" ||
        lastName === "" ||
        course === "" ||
        email === "" ||
        yearLevel === ""
    ) {

        showMessage(
            "Please fill in all fields.",
            "error"
        );

        return;

    }



    /* =========================
       UPDATE OBJECT
    ========================= */

    const student = {

        action: "update",

        originalStudentID:
            editStudentID,

        studentID:
            studentID,

        firstName:
            firstName,

        lastName:
            lastName,

        course:
            course,

        email:
            email,

        yearLevel:
            yearLevel

    };



    /* =========================
       SEND UPDATE
    ========================= */

    try {

        showMessage(
            "Updating student...",
            "success"
        );


        const result =
            await sendToAppsScript(
                student
            );


        if (!result.success) {

            throw new Error(
                result.message ||
                "Update failed."
            );

        }



        /* =========================
           SUCCESS
        ========================= */

        showMessage(
            "Student successfully updated.",
            "success"
        );


        cancelEdit();


        await loadStudents();


    } catch (error) {

        console.error(
            "UPDATE ERROR:",
            error
        );


        showMessage(
            "Failed to update student: " +
            error.message,
            "error"
        );

    }

}


/* =====================================================
   DELETE
===================================================== */

async function deleteStudent(
    studentID
) {


    const confirmDelete =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmDelete) {

        return;

    }



    const data = {

        action: "delete",

        studentID:
            studentID

    };



    try {

        showMessage(
            "Deleting student...",
            "success"
        );


        const result =
            await sendToAppsScript(
                data
            );


        if (!result.success) {

            throw new Error(
                result.message ||
                "Delete failed."
            );

        }



        /* =========================
           SUCCESS
        ========================= */

        showMessage(
            "Student successfully deleted.",
            "success"
        );


        await loadStudents();


    } catch (error) {

        console.error(
            "DELETE ERROR:",
            error
        );


        showMessage(
            "Failed to delete student: " +
            error.message,
            "error"
        );

    }

}


/* =====================================================
   SEARCH
===================================================== */

function searchStudents() {


    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const searchValue =
        searchInput.value
            .trim()
            .toLowerCase();



    if (
        searchValue === ""
    ) {

        displayStudents();

        return;

    }



    const filteredStudents =
        students.filter(
            function (student) {


                return (

                    String(student.studentID)
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    String(student.firstName)
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    String(student.lastName)
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    String(student.course)
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    String(student.email)
                        .toLowerCase()
                        .includes(searchValue)

                    ||

                    String(student.yearLevel)
                        .toLowerCase()
                        .includes(searchValue)

                );

            }
        );



    displayStudents(
        filteredStudents
    );

}


/* =====================================================
   CLEAR FORM
===================================================== */

function clearForm() {


    document.getElementById(
        "studentID"
    ).value = "";


    document.getElementById(
        "firstName"
    ).value = "";


    document.getElementById(
        "lastName"
    ).value = "";


    document.getElementById(
        "course"
    ).value = "";


    document.getElementById(
        "email"
    ).value = "";


    document.getElementById(
        "yearLevel"
    ).value = "";

}


/* =====================================================
   CANCEL EDIT
===================================================== */

function cancelEdit() {


    editStudentID = null;


    clearForm();



    document.getElementById(
        "addBtn"
    ).style.display =
        "block";


    document.getElementById(
        "updateBtn"
    ).style.display =
        "none";


    document.getElementById(
        "cancelBtn"
    ).style.display =
        "none";

}


/* =====================================================
   MESSAGE
===================================================== */

function showMessage(
    text,
    type
) {


    const message =
        document.getElementById(
            "message"
        );


    message.textContent =
        text;


    message.className =
        "message " + type;


    message.style.display =
        "block";

}


/* =====================================================
   HIDE MESSAGE
===================================================== */

function hideMessage() {


    const message =
        document.getElementById(
            "message"
        );


    message.style.display =
        "none";

}


/* =====================================================
   HTML SECURITY
===================================================== */

function escapeHTML(value) {


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   ATTRIBUTE SECURITY
===================================================== */

function escapeAttribute(value) {


    return String(value)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");

}
