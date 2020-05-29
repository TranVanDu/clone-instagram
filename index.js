const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { MONGOURL } = require("./config/keys");
const PORT = process.env.PORT || 5000;

//DgM9iUCbSkTTqJES
// const customMiddleware = (rep, res, next) => {
//     console.log("middleware");
//     next();
// };

// app.use(customMiddleware);
// app.get("/", (req, res) => {
//     console.log("Home");
//     res.send("Hello");
// });

// app.get("/about", customMiddleware, (req, res) => {
//     console.log("About");
//     res.send("About");
// });

mongoose.connect(MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});
mongoose.connection.on("connected", () => {
    console.log("connected to mongo success");
});
mongoose.connection.on("error", (error) => {
    console.log("error connecting", error);
});

require("./models/user");
require("./models/post");

app.use(express.json());

app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
    const path = require("path");
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log("server is running on ", PORT);
});
