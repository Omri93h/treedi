// const express = require("express");
// const app = express();
// app.use(cors());
// app.use(express.json());

// const userAuthRoutes = require("./api/routes/authentication-route.js");
// app.use("/api/user-authentication", userAuthRoutes);

// app.get("/", (req, res) => {
//   res.send({ msg: "Hello World!" });
// });

// const port = process.env.PORT || 5001;
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

const app = require('./lib/express');
const logger = require('./lib/logger');
const port = process.env.PORT || 5001;

app.listen(port , () => logger.info(`Lisining to Server : ${port}`));