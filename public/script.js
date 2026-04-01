// Base API URL
const API = "http://localhost:3000";


// =======================
// REGISTER USER
// =======================
function register() {
    // Send POST request to backend
    fetch(API + "/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        // Send user data
        body: JSON.stringify({
            name: name.value,
            email: email.value,
            phone: phone.value,
            address: address.value,
            password: password.value
        })
    })
        .then(() => {
            alert("User created successfully");
            // Redirect to login page
            window.location.href = "/login.html";
        });
}


// =======================
// LOGIN USER
// =======================
function login() {
    fetch(API + "/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email.value,
            password: password.value
        })
    })
        .then(res => res.json())
        .then(data => {
            // Save token in browser (session simulation)
            localStorage.setItem("token", data.token);

            // Redirect to home page
            window.location.href = "/";
        });
}


// =======================
// GET LOGGED USER DATA
// =======================
function getUser() {
    const token = localStorage.getItem("token");

    return fetch(API + "/me", {
        headers: {
            // Send token for authentication
            Authorization: "Bearer " + token
        }
    })
        .then(res => res.json());
}


// =======================
// LOGOUT USER
// =======================
function logout() {
    // Remove token from storage
    localStorage.removeItem("token");

    // Reload page
    window.location.href = "/";
}


// =======================
// CREATE NEW RIDE
// =======================
function createRide() {
    const token = localStorage.getItem("token");

    fetch(API + "/rides", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token
        },
        body: JSON.stringify({
            from: from.value,
            to: to.value,
            time: time.value
        })
    })
        .then(() => {
            alert("Ride created");
            loadRides(); // Reload rides list
        });
}


// =======================
// LOAD ALL RIDES
// =======================
function loadRides() {
    fetch(API + "/rides")
        .then(res => res.json())
        .then(data => {
            // Render rides dynamically
            rideList.innerHTML = data.map(r => `
        <div class="ride-card">
          <h3>${r.from} → ${r.to}</h3>
          <p>${r.time}</p>
        </div>
      `).join("");
        });
}