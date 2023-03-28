const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const bookRoute = require("./routes/book");

// var cors = require("cors");

const password = process.env.MONGO_ATLAS_PW;
const MONGOB_URI = `mongodb+srv://mhpl:${password}@cluster0.xfapz.mongodb.net/bookDataBase?retryWrites=true&w=majority`;

mongoose.connect(MONGOB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected");
});

app.use(morgan("dev")); //for log the methods
//body-parser come default in express so there is no need to install body-parser
app.use(bodyparser.urlencoded({ extended: false })); // to make a urlencoded file in redable form so that we read it easily
app.use(bodyparser.json()); //to make a json file in redable form so that we read it easily
// app.use(cors(corsOptions));

// for CORS error
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("Access-Control-Allow-Headers", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Autorization"
  );

  if (req.method === "OPTIONS") {
    // res.header("Access-Control-Allow-Methods", "PUT,POST,PATCH,DELETE,GET");

    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Credentials", true);

    return res.status(200).json({});
  }

  next();
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/book", bookRoute);

//if the request are not go in any route
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// for above error or any error while getting data from database or anything happen.
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message: error.message,
  });
});

module.exports = app;
