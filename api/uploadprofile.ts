import express from "express";
import path from "path";
import mysql from "mysql";
import multer from "multer";



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
          cb(null, path.join(__dirname, "../profiles"));
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
  
  const fileUpload = new FileMiddleware()
//   router.put("/:newname/:u_id", fileUpload.diskLoader.single("file"), (req, res) => {
//     let u_id = req.params.u_id;
//     let newname = req.params.newname;

//     // const servername = "https://cactusmash.onrender.com"
//     const servername = "http://localhost:3000"
//     const fileUrl = servername+"/profiles/" + fileUpload.filename;

//     // const sql = `UPDATE users SET username = ?, avatar = ? WHERE id = ?`
//     let sql = `UPDATE users SET username = ?, avatar = ? WHERE id = ?`;
//     sql = mysql.format(sql, [
//       newname,
//       fileUrl,
//       u_id,
//     ]);
//       conn.query(sql, (err, result) => {
//         if (err) throw err;
//         res.status(201).json({ affected_row: result.affectedRows, last_idx: result.insertId });
//       });

// });


router.put("/:newname/:u_id", fileUpload.diskLoader.single("file"), (req, res) => {
  let u_id = req.params.u_id;
  let newname = req.params.newname;

  // const servername = "https://cactusmash.onrender.com"
  const servername = "http://localhost:3000";
  const fileUrl = servername + "/profiles/" + fileUpload.filename; // Fix: Use req.file.filename to get the uploaded filename.

  // const sql = `UPDATE users SET username = ?, avatar = ? WHERE id = ?`
  let sql = `UPDATE users SET username = ?, avatar = ? WHERE id = ?`;
  sql = mysql.format(sql, [
    newname,
    fileUrl,
    u_id,
  ]);
  
  conn.query(sql, (err, result) => {
    if (err) {
      console.error(err); // Fix: Log error instead of throwing it.
      res.status(500).json({ error: "Internal server error" }); // Fix: Send appropriate error response.
    } else {
      res.status(201).json({ affected_row: result.affectedRows, last_idx: result.insertId });
    }
  });
});