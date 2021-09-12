const express = require('express')
const app = express()
const urlencodedParser = express.urlencoded({ extended: false });
const mysql = require('mysql');
var winston = require('winston'),
  expressWinston = require('express-winston');


app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());


app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  )
}));
const params = {
  host: "localhost",
  port: '3306', //3306  
  user: "root",
  database: "psyho", //m toxa
  password: "root", //NTI20201106_sqsw33179
}
let id = 0
let nazvanie
let info
let conn = mysql.createConnection(params);


conn.connect(function (err) {
  if (err) {
    return console.error("ОШИБКА: " + err.message);
  }
  else {
    console.log("Подключение к серверу MySQL успешно установлено");
  }
});



app.get("/", function (request, response) {
  try {
    response.sendFile(__dirname + "/index.html");
  }
  catch {
    console.log(e)
  }
});

app.post("/register", urlencodedParser, function (request, response) {
  try {

    console.log('request.body')
    console.log(request.body)
    if (!request.body) return response.sendStatus(400);
    response.send({
      email: request.body.email,
      password: request.body.password
    })
    nazvanie = "'" + request.body.email + "'"
    info = "'" + request.body.password + "'"
    // let query="INSERT chlen(id, nazvanie, info) VALUES ("+ id + "," + nazvanie + ", " + info + ")"
    let query = "INSERT INTO emails(id, email, info) VALUES (" + id + "," + nazvanie + ", " + info + ")"
    conn.query(query, (err, result, field) => {
      if (!err) {
      }
      else {
        console.log(err)
      }
    });
    conn.end(err => {
      if (err) {
        console.log(err);
        return err;
      }
      else {
        console.log('Произошло отключение от базы данных');
      }
    })
  }
  catch {
    console.log(e)
  }
});

app.listen(3000)