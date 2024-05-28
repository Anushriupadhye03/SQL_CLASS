const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const { v4: uuidv4 } = require("uuid");

app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'Iamthankful&&3529'
  });

  let getRandomUser = () => {
    return [
      faker.datatype.uuid(),
      faker.internet.username(),
      faker.internet.email(),
      faker.internet.password(),
    ];
};
  
//Home route
app.get("/", (req, res) => {
  let q = `select count(*) from user`;
    try {
    connection.query(q, (err, result) => {
    if (err) throw err;
    let count = result[0]["count(*)"];
    res.render("home.ejs", {count});
    });
  } catch (err) {
    console.log(err);
    res.send("Some error occured");
  };
});  
// connection.end();

//Show route(users)
app.get("/user", (req, res) => {
let q = `SELECT * FROM USER;`

try {
  connection.query(q, (err, users) => {
  if (err) throw err;
  // console.log(users)
  res.render("showusers.ejs", {users});
  });
} catch (err) {
  console.log(err);
  res.send("Some error occured");
};
});

//Edit route
app.get("/user/:id/edit", (req, res) => {
  let {id} = req.params;
  let q = `SELECT *FROM user WHERE id = '${id}'`;
  
  try {
    connection.query(q, (err, result) => {
    if (err) throw err;
    let user = result[0];
    res.render("edit.ejs", {user});
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in DB");
  };
});

//Update route
app.patch("/user/:id", (req, res) => {
  let {id} = req.params;
  let {password: formPass, Username: newUsername} = req.body;
  let q = `SELECT *FROM user WHERE id = '${id}'`;
  
  try {
    connection.query(q, (err, result) => {
    if (err) throw err;
    let user = result[0];
    if (formPass != user.password) {
      res.send("wrong password!");
    } else {
      let q2 = `UPDATE user SET Username = '${newUsername}' WHERE id = '${id}'`;
      connection.query(q2, (err, result) => {
        if (err) throw err;
        res.redirect("/user");
      });
    }
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in DB");
  };
});

//create route
app.get("/user/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/user/new", (req, res) => {
  let {Username, email, password} = req.body;
  let id = uuidv4();
  //query to insert new user
  let q = `INSERT INTO user (id, USERNAME, email, password)  VALUES ('${id}', '${Username}', '${email}', '${password}')`;

  try {
    connection.query(q, (err, result) => {
    if (err) throw err;
    console.log("new user added");
    res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
    res.send("Some error in DB");
  };
});

//delete user
app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      res.render("delete.ejs", { user });
    });
  } catch (err) {
    res.send("some error with DB");
  }
});

app.delete("/user/:id/", (req, res) => {
  let { id } = req.params;
  let { password } = req.body;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];

      if (user.password != password) {
        res.send("WRONG Password entered!");
      } else {
        let q2 = `DELETE FROM user WHERE id='${id}'`; //Query to Delete
        connection.query(q2, (err, result) => {
          if (err) throw err;
          else {
            console.log(result);
            console.log("deleted!");
            res.redirect("/user");
          }
        });
      }
    });
  } catch (err) {
    res.send("some error with DB");
  }
});

app.listen("8080", () => {
  console.log("server is listening to port 8080");
});



// //Inserting new data
  // let q = "INSERT INTO user (id, username, email, password) VALUES ?";
  // // let users = [['123b', 'newuser_123b', 'abc@gmail.comb', 'abcb'], 
  // //           ['123c', 'newuser_123c', 'abc@gmail.comc', 'abcc']];

  // let data = [];
  // for (let i = 1; i <= 100; i++) {
  //   data.push(getRandomUser());  //100 fake users data
  // };
