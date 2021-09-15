const express = require('express')
const fs = require('fs');
const nodemailer = require("nodemailer");
const app = express()
const { v4: uuidv4 } = require('uuid');
const urlencodedParser = express.urlencoded({ extended: false });
const mysql = require('mysql');
var winston = require('winston'),
  expressWinston = require('express-winston');


function ExQueary(query) {
  let conn = mysql.createConnection(params);
  conn.connect(function (err) {
    if (err) {
      console.error("ОШИБКА: " + err.message);
    }
    else {
      console.log("Подключение к серверу MySQL успешно установлено");
    }
  });
  conn.query(query, (err, result, field) => {
    if (!err) {
      resu = result
      console.log(resu)
    }
    else {
      console.error("ОШИБКА: " + err.message);
    }
    conn.end(err => {
      if (err) {
        console.error("ОШИБКА: " + err.message);
      }
      else {
        console.log('Произошло отключение от базы данных');
      }
    })
  });
}


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

function sleep(ms) {

  return new Promise(function (resolve) {

    setTimeout(resolve, ms);
  });
}


let resu
let email
let names
let token
let vopros

app.get("/confirm", function (request, response) {
  let medie = request.query.token
  let query1 = "SELECT id from emails"
  ExQueary(query1)
  console.log(resu)
  let result1 = resu
  for (let i = 0; i < result1.length; i++) {

    if (medie == result1[i].id) {
      vopros = true
    }
    else {
      vopros = false
    }
  }
  if (vopros) {
    response.send('<h1>Вы успешно подтвердили почту</h1>')
    let query = "INSERT INTO emails (status) VALUES('1')"
    ExQueary(query)
  }
  else {
    response.send('<h1>request error</h1>')
  }
})



app.get("/sendmessage", function (request, response) {
  async function main() {
    fs.readFile('./master/simple.html', { encoding: 'utf-8' }, (err, data) => {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'findo3184@gmail.com', // generated ethereal user
          pass: 'i33a05an', // generated ethereal password
        },
      });
      let htmlFile1
      let htmlFile2
      htmlFile1 = fs.readFileSync('./master/simple1.html', { encoding: 'utf-8' })
      htmlFile2 = fs.readFileSync('./master/simple2.html', { encoding: 'utf-8' })
      let htmlFile = htmlFile1 + uuidv4() + htmlFile2
      htmlFile = htmlFile.replace("#replaceWithLink#", "myOtherLinkTest")
      if (err) {
        console.warn("Error getting password reset template: " + err);
      } else {
        transporter.sendMail({
          from: '"Ваш психотерапевт"<flaky12r@mail.ru>',
          to: 'flaky12r@mail.ru',
          subject: "Ваш психотерапевт",
          html: htmlFile,
        });
      }
    });
  }
  main().catch(console.error);
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
      names: request.body.password
    })
    token = uuidv4()
    let id = "'" + token + "'";
    email = "'" + request.body.email + "'"
    names = "'" + request.body.names + "'"
    // let query="INSERT chlen(id, nazvanie, info) VALUES ("+ id + "," + nazvanie + ", " + info + ")"
    let query = "INSERT INTO emails(id, email, name, status) VALUES (" + id + "," + email + ", " + names + ", " + 0 + ")"
    ExQueary(query)
  }
  catch {
    console.log(e)
  }
});

app.listen(3000)