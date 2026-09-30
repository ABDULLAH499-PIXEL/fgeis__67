// =============================
// STUDENT ATTENDANCE SYSTEM
// =============================

// Get students from browser
let students = JSON.parse(localStorage.getItem("attendanceStudents")) || [];


// Get HTML elements
const nameInput = document.getElementById("studentName");
const rollInput = document.getElementById("rollNumber");
const classInput = document.getElementById("studentClass");
const sectionInput = document.getElementById("studentSection");
const searchInput = document.getElementById("searchInput");
const dateInput = document.getElementById("attendanceDate");
const studentList = document.getElementById("studentList");
const emptyMessage = document.getElementById("emptyMessage");


// Set today's date
function setToday() {

    let today = new Date();

    let year = today.getFullYear();
    let month = String(today.getMonth() + 1).padStart(2, "0");
    let day = String(today.getDate()).padStart(2, "0");

    dateInput.value = year + "-" + month + "-" + day;
}


// Save students
function saveStudents() {
    localStorage.setItem("attendanceStudents", JSON.stringify(students));
}


// Add student
function addStudent() {

    let name = nameInput.value.trim();
    let roll = rollInput.value.trim();
    let className = classInput.value.trim();
    let section = sectionInput.value.trim();

    // Check empty fields
    if (name == "" || roll == "" || className == "" || section == "") {
        alert("Please fill all fields.");
        return;
    }


    // Check duplicate roll number
    for (let i = 0; i < students.length; i++) {

        if (students[i].roll.toLowerCase() == roll.toLowerCase()) {
            alert("This roll number already exists.");
            return;
        }
    }


    // Create student
    let student = {
        id: Date.now(),
        name: name,
        roll: roll,
        className: className,
        section : section,
        attendance: {}
    };


    // Add student
    students.push(student);

    // Save
    saveStudents();


    // Clear inputs
    nameInput.value = "";
    rollInput.value = "";
    classInput.value = "";
    sectionInput.value = "";


    // Show students
    showStudents();
}


// Mark attendance
function markAttendance(id, status) {

    let date = dateInput.value;

    if (date == "") {
        alert("Please select a date.");
        return;
    }


    // Find student
    for (let i = 0; i < students.length; i++) {

        if (students[i].id == id) {

            students[i].attendance[date] = status;

            break;
        }
    }


    // Save changes
    saveStudents();

    // Update table
    showStudents();
}


// Calculate percentage
function getPercentage(student) {

    let total = 0;
    let attended = 0;


    // Check every attendance record
    for (let date in student.attendance) {

        total++;

        if (
            student.attendance[date] == "Present" ||
            student.attendance[date] == "Late"
        ) {
            attended++;
        }
    }


    // No attendance
    if (total == 0) {
        return 0;
    }


    // Calculate percentage
    return Math.round((attended / total) * 100);
}


// Get status class
function statusClass(status) {

    if (status == "Present") {
        return "present-text";
    }

    if (status == "Absent") {
        return "absent-text";
    }

    if (status == "Late") {
        return "late-text";
    }

    return "not-marked-text";
}


// Show students
function showStudents() {

    let search = searchInput.value.toLowerCase();
    let date = dateInput.value;

    studentList.innerHTML = "";

    let found = false;


    // Check every student
    for (let i = 0; i < students.length; i++) {

        let student = students[i];


        // Search student
        if (
            !student.name.toLowerCase().includes(search) &&
            !student.roll.toLowerCase().includes(search) 
           
        ) {
            continue;
        }


        found = true;


        // Get today's status
        let status = student.attendance[date] || "Not Marked";


        // Create table row
        let row = document.createElement("tr");


        row.innerHTML = `
            <td>${student.name}</td>

            <td>${student.roll}</td>

            <td>${student.className}</td>

            <td>${student.section}</td>

            <td>

                <div class="status ${statusClass(status)}">
                    ${status}
                </div>

                <div class="attendance-buttons">

                    <button
                        class="present"
                        onclick="markAttendance(${student.id}, 'Present')">
                        Present
                    </button>

                    <button
                        class="absent"
                        onclick="markAttendance(${student.id}, 'Absent')">
                        Absent
                    </button>

                    <button
                        class="late"
                        onclick="markAttendance(${student.id}, 'Late')">
                        Late
                    </button>

                </div>

            </td>

            <td>
                <strong>${getPercentage(student)}%</strong>
            </td>

            <td>

                <button
                    class="delete"
                    onclick="deleteStudent(${student.id})">
                    Delete
                </button>

            </td>
        `;


        studentList.appendChild(row);
    }


    // Show/hide empty message
    if (found == false) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }
}


// Delete student
function deleteStudent(id) {

    if (confirm("Are you sure you want to delete this student?") == false) {
        return;
    }


    let newStudents = [];


    for (let i = 0; i < students.length; i++) {

        if (students[i].id != id) {
            newStudents.push(students[i]);
        }
    }


    students = newStudents;


    // Save
    saveStudents();

    // Update table
    showStudents();
}


// Add student button
document
    .getElementById("addStudentBtn")
    .addEventListener("click", addStudent);


// Search
searchInput.addEventListener("input", showStudents);


// Change date
dateInput.addEventListener("change", showStudents);


// Press Enter to add student
nameInput.addEventListener("keydown", function(event) {

    if (event.key == "Enter") {
        addStudent();
    }

});

rollInput.addEventListener("keydown", function(event) {

    if (event.key == "Enter") {
        addStudent();
    }

});

classInput.addEventListener("keydown", function(event) {

    if (event.key == "Enter") {
        addStudent();
    }

});


// Start website
setToday();
showStudents();