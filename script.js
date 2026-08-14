/* =====================================================
   DATA
===================================================== */

let students =
    JSON.parse(localStorage.getItem("students")) || [];


let editIndex = -1;



/* =====================================================
   CREATE
===================================================== */

function addStudent() {

    const studentID =
        document.getElementById("studentID").value.trim();

    const firstName =
        document.getElementById("firstName").value.trim();

    const lastName =
        document.getElementById("lastName").value.trim();

    const course =
        document.getElementById("course").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const yearLevel =
        document.getElementById("yearLevel").value;


    // Check empty fields

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


    // Check duplicate Student ID

    const duplicate =
        students.some(
            student =>
                student.studentID.toLowerCase() ===
                studentID.toLowerCase()
        );


    if (duplicate) {

        showMessage(
            "Student ID already exists.",
            "error"
        );

        return;
    }


    // Create student object

    const student = {

        studentID: studentID,

        firstName: firstName,

        lastName: lastName,

        course: course,

        email: email,

        yearLevel: yearLevel

    };


    // Add student

    students.push(student);


    // Save

    saveData();


    // Refresh table

    displayStudents();


    // Clear form

    clearForm();


    showMessage(
        "Student successfully added.",
        "success"
    );

}



/* =====================================================
   READ
===================================================== */

function displayStudents(studentList = students) {

    const table =
        document.getElementById("studentTable");


    table.innerHTML = "";


    if (studentList.length === 0) {

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


    studentList.forEach(
        (student, index) => {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${student.studentID}
                </td>

                <td>
                    ${student.firstName}
                </td>

                <td>
                    ${student.lastName}
                </td>

                <td>
                    ${student.course}
                </td>

                <td>
                    ${student.email}
                </td>

                <td>
                    ${student.yearLevel}
                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="editStudent(${index})">

                        Edit

                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteStudent(${index})">

                        Delete

                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );

}



/* =====================================================
   UPDATE - LOAD DATA
===================================================== */

function editStudent(index) {

    const student =
        students[index];


    document.getElementById("studentID").value =
        student.studentID;


    document.getElementById("firstName").value =
        student.firstName;


    document.getElementById("lastName").value =
        student.lastName;


    document.getElementById("course").value =
        student.course;


    document.getElementById("email").value =
        student.email;


    document.getElementById("yearLevel").value =
        student.yearLevel;


    editIndex = index;


    document.getElementById("addBtn")
        .style.display = "none";


    document.getElementById("updateBtn")
        .style.display = "block";


    document.getElementById("cancelBtn")
        .style.display = "block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}



/* =====================================================
   UPDATE
===================================================== */

function updateStudent() {

    if (editIndex === -1) {
        return;
    }


    const studentID =
        document.getElementById("studentID").value.trim();

    const firstName =
        document.getElementById("firstName").value.trim();

    const lastName =
        document.getElementById("lastName").value.trim();

    const course =
        document.getElementById("course").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const yearLevel =
        document.getElementById("yearLevel").value;


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


    students[editIndex] = {

        studentID: studentID,

        firstName: firstName,

        lastName: lastName,

        course: course,

        email: email,

        yearLevel: yearLevel

    };


    saveData();


    displayStudents();


    cancelEdit();


    showMessage(
        "Student successfully updated.",
        "success"
    );

}



/* =====================================================
   DELETE
===================================================== */

function deleteStudent(index) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this student?"
        );


    if (!confirmDelete) {
        return;
    }


    students.splice(index, 1);


    saveData();


    displayStudents();


    showMessage(
        "Student successfully deleted.",
        "success"
    );

}



/* =====================================================
   SEARCH
===================================================== */

function searchStudents() {

    const searchValue =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();


    const filteredStudents =
        students.filter(student =>

            student.studentID
                .toLowerCase()
                .includes(searchValue)

            ||

            student.firstName
                .toLowerCase()
                .includes(searchValue)

            ||

            student.lastName
                .toLowerCase()
                .includes(searchValue)

            ||

            student.course
                .toLowerCase()
                .includes(searchValue)

            ||

            student.email
                .toLowerCase()
                .includes(searchValue)

            ||

            student.yearLevel
                .toLowerCase()
                .includes(searchValue)

        );


    displayStudents(filteredStudents);

}



/* =====================================================
   SAVE DATA
===================================================== */

function saveData() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );

}



/* =====================================================
   CLEAR FORM
===================================================== */

function clearForm() {

    document.getElementById("studentID").value = "";

    document.getElementById("firstName").value = "";

    document.getElementById("lastName").value = "";

    document.getElementById("course").value = "";

    document.getElementById("email").value = "";

    document.getElementById("yearLevel").value = "";

}



/* =====================================================
   CANCEL EDIT
===================================================== */

function cancelEdit() {

    editIndex = -1;


    clearForm();


    document.getElementById("addBtn")
        .style.display = "block";


    document.getElementById("updateBtn")
        .style.display = "none";


    document.getElementById("cancelBtn")
        .style.display = "none";

}



/* =====================================================
   MESSAGE
===================================================== */

function showMessage(text, type) {

    const message =
        document.getElementById("message");


    message.textContent = text;


    message.className =
        "message " + type;


    message.style.display = "block";


    setTimeout(() => {

        message.style.display = "none";

    }, 3000);

}



/* =====================================================
   INITIAL LOAD
===================================================== */

displayStudents();
