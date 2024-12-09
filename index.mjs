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

app.get('/', (req, res) => {
    res.render('login'); 
});

app.post('/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let passwordHash = "";
    let sql = `SELECT *
               FROM admin
               WHERE username = ?`;
    const [rows] = await conn.query(sql, [username]);
    if (rows.length > 0) {
        passwordHash = rows[0].password;
    }
    let match = await bcrypt.compare(password, passwordHash);
    if (match) {
        req.session.fullName = rows[0].firstName + " " + rows[0].lastName;
        req.session.authenticated = true;
        return res.render('home');
    } else {
        return res.redirect("/");
    }
});

function isAuthenticated(req, res,next){
    if (req.session.authenticated){
        next();
    }else{
        res.redirect("/");
    }}

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/'); 
    });
});

app.get('/home', isAuthenticated, (req, res) => {
    res.render('home'); 
});

app.get('/mealplan', isAuthenticated, (req, res) => {
    res.render('mealplan')
 });

 app.get('/nutrition', isAuthenticated, (req, res) => {
    res.render('nutrition', {searched});
 });

 app.get('/meals', isAuthenticated,  async (req, res) => {
    let sql = `SELECT * FROM food`;
    const [rows] = await conn.query(sql);

    res.render('meals', {searched, rows});
 });

 app.get('/meals/edit', isAuthenticated, async (req, res) => {
    let mealId = req.query.meal_Id;
    console.log('meal Id =' + mealId);
    let sql = `SELECT *
                FROM food 
                WHERE meal_Id = ?`;
const [mealData] = await conn.query(sql, mealId);
res.render('home');
});

app.post('/meals/edit', isAuthenticated, async (req, res) => {
    let foodName = req.body.meal;
    let url = await fetch(`https://api.edamam.com/api/nutrition-data?app_id=${app_id}&app_key=${app_key}&nutrition-type=logging&ingr=${foodName}`);
    let nutrition = await url.json();

    let calories = nutrition.calories;
    console.log(calories);
    let mealId = req.body.mealId;
    console.log('mealid = ' + mealId);
    let meal = req.body.meal;
    console.log('meal = ' + meal);
    let time = req.body.time;
    console.log('time = ' + time);
    let date = req.body.date;
    console.log('date = ' + date);
    let sql = `UPDATE food
                SET calories = ?,
                    meal = ?,
                    time = ?,
                    date = ?
                WHERE meal_Id = ?`;
    let params = [calories, meal, time, date, mealId];

const [mealData] = await conn.query(sql, params);
res.render('editMeals', {mealData});
});


app.post('/meals/delete', isAuthenticated, async (req, res) => {
    let mealId = req.query.mealId;
    let sql = `DELETE FROM food 
                WHERE meal_Id = ?`;
const [mealData] = await conn.query(sql, mealId);
let sqlFood = `SELECT * FROM food`;
    const [rows] = await conn.query(sqlFood);
res.render('meals', {rows});
});

 app.post('/nutritionSearch', isAuthenticated, async (req, res) => {
    let foodName = req.body.foodName;
    console.log(foodName);
    let url = await fetch(`https://api.edamam.com/api/nutrition-data?app_id=${app_id}&app_key=${app_key}&nutrition-type=logging&ingr=${foodName}`);
    let nutrition = await url.json();

    searched = true;

    console.log(nutrition, nutrition.calories,nutrition.totalNutrients.FAT.quantity);
    res.render('nutrition', {nutrition, searched});
 });
 app.post('/updateFoodLog', isAuthenticated, async (req, res) => {
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
