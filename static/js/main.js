const { room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});
$("#RoomName").text(room);
const username = Cookies.get("username");

// Socket IO
const socket = io();

// Join Room
socket.emit("joinRoom", {
    username,
    room,
});

// Message from Server
socket.on("message", (msg) => {
    printMessage(msg);
    $("#chatMessages").scrollTop(document.getElementById("chatMessages").scrollHeight);
});

// Message Submit
$("#chatForm").on("submit", function (e) {
    e.preventDefault();
    const msg = $("#message").val();
    socket.emit("chatMessage", msg); // Emit Message
    $("#message").val("").focus(); // Clear the Input
});

// Get Room Users
socket.on("roomUsers", ({ room, users }) => {
    $("#RoomUsers").html("");
    $.each(users, (i, user) => {
        $("#RoomUsers").append(`<div class="text-muted">${user.username}</div>`);
    });
});

// Design
function printMessage(msg) {
    let el = "";
    if (msg.username == username) {
        el = `<div class="border p-2 rounded bg-secondary text-white mt-3 w-75 float-end">
        <small class="text-white">${msg.username} - ${msg.time}</small>
        <div>${msg.text}</div>
    </div>`;
    } else {
        el = `<div class="border p-2 rounded bg-light mt-3 w-75 float-start">
        <small class="text-muted">${msg.username} - ${msg.time}</small>
        <div>${msg.text}</div>
    </div>`;
    }

    $("#chatMessages").append(el);
}
