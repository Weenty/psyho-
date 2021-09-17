var util = require('util')
const express = require('express')
const fs = require('fs');
const nodemailer = require("nodemailer");
const app = express()
const { v4: uuidv4 } = require('uuid');
const urlencodedParser = express.urlencoded({ extended: false });
const mysql = require('mysql');
const winston = require('winston'),
  expressWinston = require('express-winston');
  const params = {
    host: "localhost",
    port: '3306', //3306  
    user: "root",
    database: "psyho", //m toxa
    password: "root", //NTI20201106_sqsw33179
  }
  let connection = mysql.createConnection(params);
  const query = util.promisify(connection.query).bind(connection);

async function ExQueary(query1) {
    const rows = await query(query1);
    console.log(rows);
return rows
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



app.use('/', express.static(__dirname + '/'));

let email = 0
let names = 0
let token = 0
let vopros = 0

app.get("/confirm", async function (request, response) {
  let medie = request.query.token 
  let query1 = "SELECT id from emails"
  let result1 = await ExQueary(query1)
  for (let i = 0; i < result1.length; i++) {
    console.log("medie")
    console.log(medie)
    console.log("result1[i].id")
    console.log(result1[i].id)
    if (medie == result1[i].id) {
      vopros = true
    }
    else {
      vopros = false
    }
  }
  if (vopros) {
    response.send('<h1>Вы успешно подтвердили почту, посетите нашего <a href=https://t.me/Toxa_Psyh_bot> бота</a> для удобного взаимодействия с нашими специалистами!</h1>')
    let query = "UPDATE emails SET status=1 WHERE id=" + "'" + medie + "'" +""
    response.redirect("https://t.me/Toxa_Psyh_bot")
    await ExQueary(query)
  }
  else {
    response.send('<h1>request error</h1>')
  }
})

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
    let id = token
    email = request.body.email
    names = request.body.names
    // let query="INSERT chlen(id, nazvanie, info) VALUES ("+ id + "," + nazvanie + ", " + info + ")"
    let query = "INSERT INTO emails(id, email, name, status) VALUES ("+ "'" + id + "'" + "," + "'" + email + "'" + ", " + "'" + names + "'" + ", " + 0 + ")"
    ExQueary(query)
    async function main() {
      fs.readFile('./master/simple.html', { encoding: 'utf-8' }, (err, data) => {
        var transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: 'findo3184@gmail.com',
              pass: 'i33a05an'
          }
          });
        let htmlFile1
        let htmlFile2
        htmlFile1 = fs.readFileSync('./master/simple1.html', { encoding: 'utf-8' })
        htmlFile2 = fs.readFileSync('./master/simple2.html', { encoding: 'utf-8' })
        
        let htmlFile = htmlFile1 + id + htmlFile2
        htmlFile = htmlFile.replace("#replaceWithLink#", "myOtherLinkTest")
        if (err) {
          console.warn("Error getting password reset template: " + err);
        } else {
          transporter.sendMail({
            from: 'findo3184@gmail.com',
              to: email,
              subject: 'Ваш психотерапевт',
              html: htmlFile
            });
        }
      });
    }
    main().catch(console.error);
  }
  catch {
    console.log(e)
  }
});

app.listen(3000)