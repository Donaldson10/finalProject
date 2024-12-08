import express, { json } from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import session from 'express-session';
import axios from 'axios';

//const { NutritionAnalysisClient } = require('edamam-api');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))

let authenticated = false;
let loggedIn = false;
let app_id = "b4286bf9";
let app_key = "121bef8466d607b575f1c797f0a7905a";

// setting up database connection pool
const pool = mysql.createPool({
    host: "yegord.tech",
    user: "yegordte_webuser",
    password: "cst-336",
    database: "yegordte_quotes",
    connectionLimit: 10,
    waitForConnections: true
});


const conn = await pool.getConnection();

//routes
app.get('/', (req, res) => {
   res.render('home')
});

app.get('/mealplan',(req, res) => {
    res.render('mealplan')
 });

 app.get('/nutrition', (req, res) => {
    res.render('nutrition');
 });

 app.post('/nutritionSearch', async (req, res) => {
    let foodName = req.body.foodName;
    console.log(foodName);
    /*const response = await axios.get(`https://api.edamam.com/api/nutrition-data?app_id=${app_id}&app_key=${app_key}&nutrition-type=logging&ingr=${foodName}`,
        (res) =>{
            console.log(JSON.stringify(res.calories));
        }
    );*/
    //let url = await fetch("https://api.edamam.com/api/nutrition-data?app_id=b4286bf9&app_key=121bef8466d607b575f1c797f0a7905a%09&nutrition-type=logging&ingr=apple");
    let url = await fetch(`https://api.edamam.com/api/nutrition-data?app_id=${app_id}&app_key=${app_key}&nutrition-type=logging&ingr=${foodName}`);
    //console.log(url);
    let facts = await url.json();
   /*const client = new NutritionAnalysisClient({
        appId: app_id,
        appKey: app_key
      });
    
      const results = await client.search({ query: foodName });*/
    console.log(facts, facts.calories);
    res.render('nutrition');
 });

app.get("/dbTest", async(req, res) => {
    let sql = "SELECT CURDATE()";
    const [rows] = await conn.query(sql);
    res.send(rows);
});//dbTest

app.listen(3000, ()=>{
    console.log("Express server running")
})


