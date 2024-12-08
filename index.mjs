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
let searched = false;

// setting up database connection pool
const pool = mysql.createPool({
    host: "yegord.tech",
    user: "yegordte_webuser",
    password: "cst-336",
    database: "yegordte_foodLog",
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
    res.render('nutrition', {searched});
 });

 app.get('/meals', async (req, res) => {
    let sql = `SELECT * FROM food`;
    const [rows] = await conn.query(sql);

    res.render('meals', {searched, rows});
 });

 app.get('/meals/edit', async (req, res) => {
    let mealId = req.query.mealId;
    let sql = `SELECT *
                FROM food 
                WHERE meal_Id = ?`;
const [mealData] = await conn.query(sql, mealId);
res.render('editMeals', {mealData});
});

app.post('/meals/edit', async (req, res) => {
    let foodName = req.body.meal;
    let url = await fetch(`https://api.edamam.com/api/nutrition-data?app_id=${app_id}&app_key=${app_key}&nutrition-type=logging&ingr=${foodName}`);
    let nutrition = await url.json();

    let calories = nutrition.calories;
    let mealId = req.body.mealId;
    let meal = req.body.meal;
    let time = req.body.time;
    let date = req.body.date;
    let sql = `Update food
                SET calories = ?, 
                SET meal = ?,
                SET time = ?,
                SET date =?
                WHERE meal_Id = ?`;
    let params = [calories, meal, time, date, mealId];

const [mealData] = await conn.query(sql, mealId);
res.render('editMeals', {mealData});
});


app.post('/meals/delete', async (req, res) => {
    let mealId = req.query.mealId;
    let sql = `DELETE FROM food 
                WHERE meal_Id = ?`;
const [mealData] = await conn.query(sql, mealId);
let sqlFood = `SELECT * FROM food`;
    const [rows] = await conn.query(sqlFood);
res.render('meals', {rows});
});

 app.post('/nutritionSearch', async (req, res) => {
    let foodName = req.body.foodName;
    console.log(foodName);
    let url = await fetch(`https://api.edamam.com/api/nutrition-data?app_id=${app_id}&app_key=${app_key}&nutrition-type=logging&ingr=${foodName}`);
    let nutrition = await url.json();

    searched = true;

    console.log(nutrition, nutrition.calories,nutrition.totalNutrients.FAT.quantity);
    res.render('nutrition', {nutrition, searched});
 });
 app.post('/updateFoodLog', async (req, res) => {
    let calories = req.body.calories;
    let meal = req.body.meal;
    let time = req.body.time;
    let date = req.body.date;
    console.log(calories);
    console.log(meal);
    console.log(time);
    console.log(date);



    let sql = `INSERT INTO food
                (calories, meal, time, date)
                VALUES
                (?,?,?,?)`;
    let params = [calories, meal, time, date];
    const [rows] = await conn.query(sql, params);
    searched = false;
    res.render('nutrition',{searched})
 });

app.get("/dbTest", async(req, res) => {
    let sql = "SELECT CURDATE()";
    const [rows] = await conn.query(sql);
    res.send(rows);
});//dbTest

app.listen(3000, ()=>{
    console.log("Express server running")
})


