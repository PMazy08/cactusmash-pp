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

// get all photos
router.get("/", (req, res) => {
  conn.query(`SELECT id as phoId,  u_id as userId, filename, elo
              FROM photos 
              ORDER BY elo DESC`, (err, result, fields) => {
      if (err) {
          res.status(400).json(err);
      } else {
          // คำนวณ rank ด้วยการนับแถวลำดับ
          let rank = 1;
          result.forEach((row: any, index: number) => {
              row.rank = rank++;
          });
          res.json(result);
      }
  });
});



// get top-10 photos
router.get("/top10", (req, res) => {
  conn.query('SELECT users.id as userId, users.username, users.avatar, photos.id as phoId, photos.filename, photos.elo FROM photos JOIN users on photos.u_id = users.id ORDER BY photos.elo DESC LIMIT 10', (err, result, fields)=>{
    if(err){
        res.status(400).json(err);
    }else {
        res.json(result);
    }
  });
});


// get photos By u_id
router.get('/:id', (req, res) => {
    let id = +req.params.id;
    conn.query('select photos.id, photos.filename from photos where u_id = ?', [id], (err, result, fields)=>{
        if(err){
            res.status(400).json(err);
        }else {
            res.json(result);
        }
      });
});

// insert photo with u_ide


// update Elo
router.put("/elo/:newElo/:pho_id", (req, res) => {
  const id = +req.params.pho_id;
  const newElo = +req.params.newElo;
  const sql = "UPDATE photos SET elo = ? WHERE id = ?";
  conn.query(sql, [newElo, id], (err, result) => {
    if (err) {
      throw err;
    }
    res.status(201).json({ affected_row: result.affectedRows });
  });
});

// delete photo by phoId
router.delete("/:id", (req, res) => {
  let id = +req.params.id;

  // ลบแถวในตาราง photostate โดยไม่สนใจ foreign key
  conn.query("DELETE FROM photostate WHERE pho_id = ?", [id], (err, result) => {
    if (err) {
      console.error("Error deleting photostate:", err);
      res.status(500).json({ error: "An error occurred while deleting the photostate" });
      return;
    }

    // ตรวจสอบว่ามีแถวในตาราง photostate ที่ถูกลบหรือไม่
    if (result.affectedRows > 0) {
      // ลบแถวในตาราง photos เมื่อการลบแถวในตาราง photostate เสร็จสมบูรณ์
      conn.query("DELETE FROM photos WHERE id = ?", [id], (err, result) => {
        if (err) {
          console.error("Error deleting photo:", err);
          res.status(500).json({ error: "An error occurred while deleting the photo" });
          return;
        }

        // ตอบกลับเมื่อทั้งหมดถูกลบเรียบร้อย
        res.status(200).json({ affected_rows_photos: result.affectedRows });
      });
    } else {
      // ถ้าไม่มีแถวในตาราง photostate ที่ถูกลบ ให้ตรวจสอบการลบแถวในตาราง photos ต่อ
      conn.query("DELETE FROM photos WHERE id = ?", [id], (err, result) => {
        if (err) {
          console.error("Error deleting photo:", err);
          res.status(500).json({ error: "An error occurred while deleting the photo" });
          return;
        }
        
        // ตรวจสอบว่ามีแถวในตาราง photos ที่ถูกลบหรือไม่
        if (result.affectedRows > 0) {
          // ตอบกลับเมื่อถูกลบเรียบร้อย
          res.status(200).json({ affected_rows_photos: result.affectedRows });
        } else {
          // ถ้าไม่พบข้อมูลในทั้งสองตารางให้ตอบกลับว่าไม่พบข้อมูลที่ต้องการลบ
          res.status(404).json({ error: "Data not found for deletion" });
        }
      });
    }
  });
});
