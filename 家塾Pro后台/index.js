const express = require("express");
const app = express();
const chat = require("./api/chat");

app.use(express.json({ extended: false }));

app.use("/api", chat);
require("./api/ws")


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running in port ${PORT}`));

