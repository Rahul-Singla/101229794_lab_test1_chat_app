require("dotenv").config();
const cors = require("cors");
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/MainRoutes");
const authRouter = require("./routes/AuthRoutes");
const MessageModel = require("./models/MessageModel");
const cookieParser = require("cookie-parser");
const { formatMessage } = require("./functions/messages");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./functions/users");

// Express
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.use(express.static("static"));
app.set("views", path.join(__dirname, "/static/"));
app.set("view engine", "ejs");
app.use(mainRouter);
app.use(authRouter);

// MongoDB
const DB_URL = process.env.DB_URL;
mongoose.Promise = global.Promise;
mongoose
    .connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Successfully connected to the database mongoDB Atlas Server");
    })
    .catch((err) => {
        console.log("Could not connect to the database. Exiting now...", err);
        process.exit();
    });

// Socket IO
const http = require("http").createServer(app);
const io = require("socket.io")(http);
io.on("connection", (socket) => {
    // Listen for joinRoom
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);
        socket.join(user.room);
        let msg = `${user.username} has joined the Chat`;
        io.to(user.room).emit("message", formatMessage("ChatRoom", msg));
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });

        let message = new MessageModel({ from_user: "ChatRoom", room: user.room, message: msg, date_sent: new Date() });
        message.save();
    });

    // Listen for chatMessage
    socket.on("chatMessage", (msg) => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit("message", formatMessage(user.username, msg));

        let message = new MessageModel({ from_user: user.username, room: user.room, message: msg, date_sent: new Date() });
        message.save();
    });

    // Socket Disconnect
    socket.on("disconnect", () => {
        const user = userLeave(socket.id);
        let msg = `${user.username} has left the Chat`;
        io.to(user.room).emit("message", formatMessage("ChatRoom", msg));
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });

        let message = new MessageModel({ from_user: "Room", room: user.room, message: msg, date_sent: new Date() });
        message.save();
    });
});

// Server
http.listen(process.env.PORT || 3000, () => {
    console.log("Server running successfully");
});
