const {faker} = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app =express();
const path = require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method")); 
app.use(express.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'AbHAYchauhan6111',
  database: 'delta_app',   
});

let getRandomUser = () => {
  return [
     faker.string.uuid(),
    faker.internet.username(),
    faker.internet.email(),
    faker.internet.password(), 
  ];
};

//inserting data into the user table
// let q = "INSERT INTO user (id, username, email, password) VALUES ?";

// let data = [];
// for(let i=1;i<=100;i++){
//   data.push(getRandomUser()); // Generate 100 random users
// }

// connection.end();

//Home route to display the count of users in the database:
app.get("/", (req,res) => {
  let q = `SELECT count(*) FROM user`;
  try{
  connection.query(q, (err, results) => {
  if (err) throw err;
  let count = results[0]["count(*)"];
  // res.send(results[0]["count(*)"].toString());
  res.render("home.ejs", {count});
});
}
catch(err){
  console.log('Error executing query:', err);
  res.send("Some error occurred while fetching data");
}
});

// Show route to display all users in the database:
app.get("/user",(req,res) => {
  let q = `SELECT * FROM user`;
  try{
  connection.query(q, (err, users) => {
  if (err) throw err;
  // console.log(users);
  // res.send(users);
  res.render("showusers.ejs", {users});
});
}
catch(err){
  console.log('Error executing query:', err);
  res.send("Some error occurred while fetching data");
}
});

//Edit route:
app.get("/user/:id/edit", (req,res) => {
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try{
  connection.query(q, (err, results) => {
  if (err) throw err;
  let user = results[0];
  res.render("edit.ejs", {user});
});
}
catch(err){
  console.log('Error executing query:', err);
  res.send("Some error occurred while fetching data");
}
});
  
//Update route:
app.patch("/user/:id", (req,res) => {
  let {id} = req.params;
  let {password: formPass, username: newUsername} = req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try{
  connection.query(q, (err, results) => {
  if (err) throw err;
  let user = results[0];
  if(formPass != user.password){
    res.send("Wrong Password");
  }
  else{
    let q2 = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`;
    connection.query(q2,(err,result) => {
      if (err) throw err;
      // res.send(result);
      res.redirect("/user");
    });
  }
 
  // res.render("edit.ejs", {user});
});
}
catch(err){
  console.log('Error executing query:', err);
  res.send("Some error occurred while fetching data");
}
});

app.listen("8080", () => {
  console.log("Server is running on port 8080");
});

// try{
//   connection.query(q, [data], (err, results) => {
//   if (err) throw err;
//   console.log(results);
//   console.log(results.length);
//   console.log(results[0]);
//   console.log(results[1]);
// });
// }
// catch(err){
//   console.log('Error executing query:', err);
// }

