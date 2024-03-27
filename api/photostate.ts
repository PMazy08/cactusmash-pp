import express from "express";
import mysql from "mysql";


export const conn = mysql.createPool({
    connectionLimit: 10,
    host: "sql6.freesqldatabase.com",
    database: "sql6689430",
    user: "sql6689430",
    password: "cSAzghWNsu",
  });

export const router = express.Router();


// get all 
router.get("/", (req, res) => {
    conn.query('SELECT * FROM photostate', (err, result, fields)=>{
      if(err){
          res.status(400).json(err);
      }else {
          res.json(result);
      }
    });
  });

//finde state
router.get("/:date/:pro_id", (req, res) => {
    const pro_id = +req.params.pro_id;
    const date = req.params.date;
    // const pro_id = 3;
    // const date = "2024-3-19";
    conn.query('SELECT * FROM photostate WHERE date = ? AND pho_id = ?', [date, pro_id], (err, result, fields) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.json(result);
        }
    });
});

//insert win
router.post("/win/:date/:pro_id/:score/:rank", (req, res) => {
    const pro_id = +req.params.pro_id;
    const date = req.params.date;
    const win = +req.params.score;
    const loss = 0;
    const rank = +req.params.rank;

    conn.query("INSERT INTO `photostate`(`pho_id`, `date`, `win_points`, `lose_points`, `rank`) VALUES (?,?,?,?,?)", [pro_id, date, win, loss, rank], (err, result, fields) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.json(result);
        }
    });
});

//insert loss
router.post("/loss/:date/:pro_id/:score/:rank", (req, res) => {
    const pro_id = req.params.pro_id;
    const date = req.params.date;
    const win = 0;
    const loss = req.params.score;
    const rank = req.params.rank;

    conn.query("INSERT INTO `photostate`(`pho_id`, `date`, `win_points`, `lose_points`, `rank`) VALUES (?,?,?,?,?)", [pro_id, date, win, loss, rank], (err, result, fields) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.json(result);
        }
    });
});

// update win
router.put("/upwin/:pro_id/:score/:rank/:date", (req, res) => {
    const pro_id = req.params.pro_id;
    const win = req.params.score;
    const rank = req.params.rank;
    const date = req.params.date;
    const sql = "UPDATE photostate SET win_points = win_points + ?, rank = ? WHERE pho_id = ? AND date = ?";
    conn.query(sql, [win, rank, pro_id, date], (err, result) => {
        if (err) {
            throw err;
        }
        res.status(201).json({ affected_row: result.affectedRows });
    });
});

  // update loss
  router.put("/uplose/:pro_id/:score/:rank/:date", (req, res) => {
    const pro_id = req.params.pro_id;
    const loss = req.params.score;
    const rank = req.params.rank;
    const date = req.params.date;
    const sql = "UPDATE photostate SET lose_points = lose_points + ?, rank = ? WHERE pho_id = ? AND date = ?";
    conn.query(sql, [loss, rank, pro_id, date], (err, result) => {
        if (err) {
            throw err;
        }
        res.status(201).json({ affected_row: result.affectedRows });
    });
});



// last 7 Day
router.get('/last7day/:date/:pho_id', (req, res) => {
    let id = req.params.pho_id;
    let date = req.params.date;
    conn.query(`SELECT id, pho_id, DATE_FORMAT(date, '%Y-%m-%d') AS date, win_points, lose_points
    FROM photostate
    WHERE pho_id = ? 
      AND date <= ?
    ORDER BY date DESC LIMIT 7;`, [id, date], (err, result, fields)=>{
        if(err){
            res.status(400).json(err);
        }else {
            res.json(result);
        }
      });
});

