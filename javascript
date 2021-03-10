`use strict`;

const userOutput = document.getElementById("userOutput");
let userId; // KEY TO GETING UPDATE METHOD TO WORK

var myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
    keyboard: false
})

function getUsers() {
    axios.get("http://localhost:8080/getUsers")
        .then(res => {
            userOutput.innerHTML = "";

            const users = res.data;

            users.forEach(user => {
                const newUser = renderUser(user);
                console.log("New User: ", newUser);
                userOutput.appendChild(newUser);
            });
        }).catch(err => console.error(err))
}

function renderUser(user) {

    const newRow = document.createElement("tr");

    const userName = document.createElement("td");
    userName.className = "tData";
    userName.innerText = user.name;

    const userAge = document.createElement("td");
    userAge.className = "tDataAge";
    userAge.innerText = user.dateOfBirth;

    const deleteButton = document.createElement("button");
    deleteButton.className = "btn btn-link";
    deleteButton.innerText = "delete";
    deleteButton.addEventListener("click", function () {
        deleteUser(user.id);
    })

    // UPDATE
    const updateButton = document.createElement("button");
    updateButton.className = "btn btn-primary";
    updateButton.innerText = "update";
    updateButton.addEventListener("click", function () {
        myModal.toggle();
        userId = user.id;
    })

    newRow.appendChild(userName);
    newRow.appendChild(userAge);
    newRow.appendChild(deleteButton);
    newRow.appendChild(updateButton);

    return newRow;

}

//Delete User
function deleteUser(id) {
    axios.delete("http://localhost:8080/removeUser/" + id)
        .then(() => getUsers())
        .catch(err => console.error(err))
}


//Update User
document.getElementById("userUpdateForm").addEventListener('submit', function (event) {
    event.preventDefault();
    const data = {
        name: this.userName.value,
        dateOfBirth: this.userBirthDate.value,
    };

    axios.put("http://localhost:8080/updateUser/" + userId, data, {

    }).then(() => {
        this.reset();
        myModal.toggle();
        getUsers();
    }).catch(err => console.error(err));
});


// find user 



//createUser
document.getElementById("userForm").addEventListener('submit', function (event) {
    event.preventDefault();

    console.log("this: ", this);
    console.log("this.name:", this.name);
    console.log("this.dateOfBirth:", this.dateOfBirth);

    const data = {
        name: this.userName.value,
        dateOfBirth: this.userBirthDate.value,
    };

    axios.post("http://localhost:8080/createUser", data, {
        headers: {
            "Content-Type": "application/json", // sending JSON
            "Accept": "application/json" // gimme JSON
        }
    }).then(() => {
        this.reset();
        this.name.focus();
        getUsers();
    })
        .catch(err => console.error(err));

});

getUsers();

