import express from "express";
import mysql from 'mysql';

const router = express.Router();


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'fuck'
  });
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
  });

  console.log(connection)


//   app.post("/creatuser", function(req, res) {
//       const date = new Date();
//       console.log(date)
//       connection.query("INSERT INTO users (name,email,password,created_at) VALUES ("+ "'" + req.body.name + "'" + "," + "'" +  req.body.email + "'" + "," + "'" + req.body.password + "'" + "," + req.body.data + ")"),
//       function(error, results, fields) {
//           if(error) throw error;
//         console.log(JSON.stringnify(results.insertId));
          
          
//       }
//   })


router.post('/signin', async (req, res) => {
const date = new Date();

console.log(date)
const userInfo = connection.query("SELECT * FROM users " + "'" + req.body.email + "';"  ) 
const user = userInfo
    
})


export default router