import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import session from 'express-session';

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
app_id = "098dd48f";
app_key = "5ddd89c02ee2b2c3a6274145ac587989";

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

    let nutrition = fetch("https://api.edamam.com/api/nutrition-" + app_id + "&app_key=" + app_key + "&nutrition-type=logging&ingr=" + foodName + "&");
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


