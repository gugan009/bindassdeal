const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.json())
const dbPath = path.join(__dirname, 'user.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(9000, () => {
      console.log('Server Running at http://localhost:9000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}
initializeDBAndServer()


 app.post("/users/", async (request, response) => {
    const { username, name, password } = request.body
    console.log(username, name, password)
    const hashedPassword = await bcrypt.hash(password, 5);
    const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
    const dbUser = await db.get(selectUserQuery)
    if (dbUser === undefined) {
      const createUserQuery = `
        INSERT INTO
          user (username, name, password)
        VALUES
          (
            '${username}',
            '${name}',
            '${hashedPassword}'
          );`;
      const dbResponse = await db.run(createUserQuery)
      const newUserId = dbResponse.lastID
      response.send({msg: `Created new user with ${newUserId}`})
    } else {
      response.status(400)
      response.send({msg: "User already exists"})
    }
  });



  app.post("/login", async (request, response) => {
    const { username, password } = request.body;
    const selectUserQuery = `SELECT * FROM user WHERE username = '${username}'`;
    const dbUser = await db.get(selectUserQuery);
    if (dbUser === undefined) {
      response.status(400);
      response.send({msg: "Invalid User"});
    } else {
      const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
      if (isPasswordMatched === true) {
        const payload = {
          username: username,
        };
        const jwtToken = jwt.sign(payload, "TOKEN");
        response.send({ jwtToken });
      } else {
        response.status(400);
        response.send({msg: "Invalid Password"});
      }
    }
  });