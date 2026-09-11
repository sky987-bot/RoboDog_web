/* =========================
   LOGGED-IN USER
========================= */

const savedUser = localStorage.getItem("user");

if (savedUser) {

    const user = JSON.parse(savedUser);

    document.getElementById("welcomeUser").textContent =
        "Welcome, " + user.name;

    document.getElementById("userName").textContent =
        user.name;

    document.getElementById("userEmail").textContent =
        user.email;

} else {

    // No user logged in
    window.location.href = "login.html";

}
const controlMessage = document.getElementById("controlMessage");

const forwardBtn = document.getElementById("forwardBtn");
const backwardBtn = document.getElementById("backwardBtn");
const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const stopBtn = document.getElementById("stopBtn");


// ===============================
// Robot Control Function
// ===============================

async function sendRobotCommand(command) {

    try {

        const response = await fetch(
            `http://127.0.0.1:5000/api/robot/${command}`,
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (response.ok) {

    controlMessage.textContent =
        data.message;

    console.log(
        "Robot Command:",
        data.command
    );

    // Update Current Command
    const currentCommand =
        document.getElementById("currentCommand");

    currentCommand.textContent =
        data.command;
        

} else {

            controlMessage.textContent =
                "Robot command failed";

        }

    } catch (error) {

        console.error(error);

        controlMessage.textContent =
            "Cannot connect to robot backend";

    }
}


// ===============================
// Robot Buttons
// ===============================

forwardBtn.addEventListener("click", function () {

    sendRobotCommand("forward");

});


backwardBtn.addEventListener("click", function () {

    sendRobotCommand("backward");

});


leftBtn.addEventListener("click", function () {

    sendRobotCommand("left");

});


rightBtn.addEventListener("click", function () {

    sendRobotCommand("right");

});


stopBtn.addEventListener("click", function () {

    sendRobotCommand("stop");

});


// ===============================
// Patrol
// ===============================

const startPatrolBtn =
    document.getElementById("startPatrolBtn");

const stopPatrolBtn =
    document.getElementById("stopPatrolBtn");

const patrolStatus =
    document.getElementById("patrolStatus");


// =====================================
// PATROL CONTROL
// =====================================

startPatrolBtn.addEventListener("click", async function () {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/robot/patrol/start",
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (response.ok) {

            patrolStatus.textContent =
                "Active";
                const now = new Date();

document.getElementById("patrolStarted").textContent =
    now.toLocaleTimeString();

            console.log(
                "Patrol Status:",
                data.patrol_status
            );

        } else {

            patrolStatus.textContent =
                "Failed to start";

        }

    } catch (error) {

        console.error(error);

        patrolStatus.textContent =
            "Backend connection failed";
    }

});


stopPatrolBtn.addEventListener("click", async function () {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/robot/patrol/stop",
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (response.ok) {

            patrolStatus.textContent =
                "Inactive";
             document.getElementById("patrolStarted").textContent =
    "Not Started";   

            console.log(
                "Patrol Status:",
                data.patrol_status
            );

        } else {

            patrolStatus.textContent =
                "Failed to stop";

        }

    } catch (error) {

        console.error(error);

        patrolStatus.textContent =
            "Backend connection failed";
    }

});


// ===============================
// Logout
// ===============================

const logoutBtn =
    document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", function () {

    localStorage.removeItem("user");

    window.location.href = "login.html";

});
// =====================================
// ROBOT STATUS
// =====================================

async function getRobotStatus() {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/robot/status"
        );

        const data = await response.json();


        if (response.ok) {

            // Robot connection status
            const robotConnection =
                document.getElementById("robotConnection");

            robotConnection.textContent =
                data.status;


            // Current robot command
            const currentCommand =
                document.getElementById("currentCommand");

            currentCommand.textContent =
                data.command;


            // Battery level
            const batteryLevel =
                document.getElementById("batteryLevel");

            batteryLevel.textContent =
                data.battery + "%";

        }

    } catch (error) {

        console.error(
            "Robot Status Error:",
            error
        );

        const robotConnection =
            document.getElementById("robotConnection");

        robotConnection.textContent =
            "Offline";

        const currentCommand =
            document.getElementById("currentCommand");

        currentCommand.textContent =
            "Unknown";

        const batteryLevel =
            document.getElementById("batteryLevel");

        batteryLevel.textContent =
            "Unknown";
    }
}

getRobotStatus();
// =====================================
// INTRUDER DETECTION STATUS
// =====================================

async function getIntruderStatus() {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/robot/intruder/status"
        );

        const data = await response.json();

        if (response.ok) {

            document.getElementById("intruderStatus").textContent =
                data.status;

            document.getElementById("intruderCount").textContent =
                data.count;

            document.getElementById("suspicionRate").textContent =
                data.suspicion_rate + "%";
        }

    } catch (error) {

        console.error(
            "Intruder Status Error:",
            error
        );

        document.getElementById("intruderStatus").textContent =
            "Offline";

        document.getElementById("intruderCount").textContent =
            "0";

        document.getElementById("suspicionRate").textContent =
            "0%";
    }
}


// Get intruder status when dashboard loads
getIntruderStatus();
// =====================================
// INTRUDER TEST CONTROL
// =====================================

const testIntruderBtn =
    document.getElementById("testIntruderBtn");

const resetIntruderBtn =
    document.getElementById("resetIntruderBtn");


// Test Intruder
testIntruderBtn.addEventListener("click", async function () {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/robot/intruder/test",
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (response.ok) {

            document.getElementById("intruderStatus").textContent =
                data.status;

            document.getElementById("intruderCount").textContent =
                data.count;

            document.getElementById("suspicionRate").textContent =
                data.suspicion_rate + "%";

        }

    } catch (error) {

        console.error("Intruder Test Error:", error);

    }

});


// Reset Intruder
resetIntruderBtn.addEventListener("click", async function () {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/robot/intruder/reset",
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (response.ok) {

            document.getElementById("intruderStatus").textContent =
                data.status;

            document.getElementById("intruderCount").textContent =
                data.count;

            document.getElementById("suspicionRate").textContent =
                data.suspicion_rate + "%";

        }

    } catch (error) {

        console.error("Intruder Reset Error:", error);

    }

});
// =====================================
// DISASTER DETECTION STATUS
// =====================================

async function getDisasterStatus() {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/robot/disaster/status"
        );

        const data = await response.json();

        if (response.ok) {

            document.getElementById("disasterDetectionStatus").textContent =
                data.status;

            document.getElementById("disasterType").textContent =
                data.type;

            document.getElementById("disasterConfidence").textContent =
                data.confidence + "%";
        }

    } catch (error) {

        console.error(
            "Disaster Status Error:",
            error
        );

        document.getElementById("disasterDetectionStatus").textContent =
            "Offline";

        document.getElementById("disasterType").textContent =
            "Unknown";

        document.getElementById("disasterConfidence").textContent =
            "0%";
    }
}


// Get disaster status when dashboard loads
getDisasterStatus();
// =====================================
// DISASTER TEST & RESET
// =====================================

const testDisasterBtn =
    document.getElementById("testDisasterBtn");

const resetDisasterBtn =
    document.getElementById("resetDisasterBtn");


// Test Disaster
testDisasterBtn.addEventListener("click", async function () {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/robot/disaster/test",
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (response.ok) {

            document.getElementById(
                "disasterDetectionStatus"
            ).textContent = data.status;

            document.getElementById(
                "disasterType"
            ).textContent = data.type;

            document.getElementById(
                "disasterConfidence"
            ).textContent = data.confidence + "%";

            document.getElementById(
                "disasterStatus"
            ).textContent = data.status;

            console.log("Disaster:", data);

        } else {

            console.error(
                "Disaster test failed"
            );

        }

    } catch (error) {

        console.error(
            "Disaster Test Error:",
            error
        );

    }

});


// Reset Disaster
resetDisasterBtn.addEventListener("click", async function () {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/robot/disaster/reset",
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (response.ok) {

            document.getElementById(
                "disasterDetectionStatus"
            ).textContent = data.status;

            document.getElementById(
                "disasterType"
            ).textContent = data.type;

            document.getElementById(
                "disasterConfidence"
            ).textContent = data.confidence + "%";

            document.getElementById(
                "disasterStatus"
            ).textContent = data.status;

        }

    } catch (error) {

        console.error(
            "Disaster Reset Error:",
            error
        );

    }

});
// =====================================
// ALERT COUNT
// =====================================

async function getAlertCount() {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/robot/alerts"
        );

        const data = await response.json();

        if (response.ok) {

            document.getElementById("alertCount").textContent =
                data.count;

        }

    } catch (error) {

        console.error(
            "Alert Error:",
            error
        );

        document.getElementById("alertCount").textContent =
            "0";
    }
}

getAlertCount();
// =====================================
// PATROL ROUTE
// =====================================

async function getPatrolRoute() {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/robot/patrol/route"
        );

        const data = await response.json();

        if (response.ok) {

            document.getElementById("patrolRoute").textContent =
                data.route.join(" → ");

        }

    } catch (error) {

        console.error(
            "Patrol Route Error:",
            error
        );

        document.getElementById("patrolRoute").textContent =
            "Unable to load route";
    }
}

getPatrolRoute();
// =====================================
// PATROL LOCATION
// =====================================

async function getPatrolLocation() {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/robot/patrol/location"
        );

        const data = await response.json();

        if (response.ok) {

            document.getElementById("currentStop").textContent =
                data.current_stop;

            document.getElementById("nextStop").textContent =
                data.next_stop;

            document.getElementById("patrolProgress").textContent =
                data.progress + "%";
        }

    } catch (error) {

        console.error(
            "Patrol Location Error:",
            error
        );

    }
}

getPatrolLocation();
// =====================================
// NEXT PATROL STOP
// =====================================

const nextStopBtn =
    document.getElementById("nextStopBtn");

nextStopBtn.addEventListener("click", async function () {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/robot/patrol/next",
            {
                method: "POST"
            }
        );

        const data = await response.json();

        if (response.ok) {

            document.getElementById("currentStop").textContent =
                data.current_stop;

            document.getElementById("nextStop").textContent =
                data.next_stop;

            document.getElementById("patrolProgress").textContent =
                data.progress + "%";
updateRobotLocation(data.current_stop);
            console.log("Patrol moved:", data);

        }

    } catch (error) {

        console.error(
            "Next Stop Error:",
            error
        );

    }

});
// =====================================
// PATROL MAP
// =====================================

const map = L.map("map").setView([22.5726, 88.3639], 16);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap contributors"
    }
).addTo(map);


// Patrol Locations
const mainGate = [22.5726, 88.3639];
const parkingArea = [22.5732, 88.3650];
const buildingA = [22.5740, 88.3642];
const buildingB = [22.5745, 88.3628];


// Markers
L.marker(mainGate)
    .addTo(map)
    .bindPopup("🏁 Main Gate");

L.marker(parkingArea)
    .addTo(map)
    .bindPopup("🅿️ Parking Area");

L.marker(buildingA)
    .addTo(map)
    .bindPopup("🏢 Building A");

L.marker(buildingB)
    .addTo(map)
    .bindPopup("🏢 Building B");


// Patrol Route
const route = [
    mainGate,
    parkingArea,
    buildingA,
    buildingB,
    mainGate
];

L.polyline(route).addTo(map);
// =====================================
// ROBODOG MAP MARKER
// =====================================

let robotMarker = L.marker(mainGate)
    .addTo(map)
    .bindPopup("🐕 RoboDog")
    .openPopup();


// Move RoboDog marker
function updateRobotLocation(stop) {

    if (stop === "Main Gate") {
        robotMarker.setLatLng(mainGate);
    }

    else if (stop === "Parking Area") {
        robotMarker.setLatLng(parkingArea);
    }

    else if (stop === "Building A") {
        robotMarker.setLatLng(buildingA);
    }

    else if (stop === "Building B") {
        robotMarker.setLatLng(buildingB);
    }

    map.panTo(robotMarker.getLatLng());
}
// =====================================
// ALERT HISTORY
// =====================================

async function getAlertHistory() {

    try {

        const response = await fetch(
            "http://127.0.0.1:5000/api/robot/alerts/history"
        );

        const data = await response.json();

        const alertHistory =
            document.getElementById("alertHistory");

        if (response.ok) {

            if (data.alerts.length === 0) {

                alertHistory.innerHTML =
                    "<p>No alerts yet.</p>";

                return;
            }

            alertHistory.innerHTML = "";

            data.alerts.forEach(function(alert) {

                const alertItem =
                    document.createElement("div");

                alertItem.innerHTML = `
                    <p>
                        🚨 <strong>${alert.type}</strong>
                        - ${alert.message}
                    </p>
                `;

                alertHistory.appendChild(alertItem);

            });

        }

    } catch (error) {

        console.error(
            "Alert History Error:",
            error
        );

        document.getElementById("alertHistory").innerHTML =
            "<p>Unable to load alert history.</p>";
    }
}

getAlertHistory();