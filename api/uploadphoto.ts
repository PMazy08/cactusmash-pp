import express from "express";
import path from "path";
import multer from "multer";
import mysql from "mysql";


export const conn = mysql.createPool({
    connectionLimit: 10,
    host: "sql6.freesqldatabase.com",
    database: "sql6689430",
    user: "sql6689430",
    password: "cSAzghWNsu",
  });
export const router = express.Router();

class FileMiddleware {
    filename = "";
    public readonly diskLoader = multer({
      storage: multer.diskStorage({
        destination: (_req, _file, cb) => {
          cb(null, path.join(__dirname, "../photos"));
        },
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 10000);
          this.filename = uniqueSuffix + "." + file.originalname.split(".").pop();
          cb(null, this.filename);
        },
      }),
      limits: {
        fileSize: 67108864, // 64 MByte
      },
    });
  }
  

  const fileUpload = new FileMiddleware();

  //inser photo by u_id
  router.post("/:u_id", fileUpload.diskLoader.single("file"), (req, res) => {
    let u_id:number = +req.params.u_id;
    let elo = 1200;

    // const servername = "https://cactusmash.onrender.com"
    const servername = "http://localhost:3000"

    const fileUrl = servername+"/photos/" + fileUpload.filename;
    let sql = "INSERT INTO `photos`(`u_id`, `filename`, `elo`) VALUES (?,?,?)";
    sql = mysql.format(sql, [
        u_id,
        fileUrl,
        elo
      ]);
        conn.query(sql, (err, result) => {
          if (err) throw err;
          res.status(201).json({ affected_row: result.affectedRows, last_idx: result.insertId });
        });
  });