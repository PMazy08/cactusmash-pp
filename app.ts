import express from "express";
import bodyParser from "body-parser";
import { router as index } from "./api/index";
import { router as user } from "./api/user";
import { router as photo } from "./api/photos";
import { router as photostate } from "./api/photostate";

import { router as uploadprofiles } from "./api/uploadprofile";
import { router as uploadphotos } from "./api/uploadphoto";
import cors from "cors";


export const app = express();

// app.use(bodyParser.text());

app.use(bodyParser.json());
app.use(
    cors({
      origin: "*",
    })
  );

// test 
app.use("/", index);

app.use("/users", user);

app.use("/photo", photo);

app.use("/uploadprofile", uploadprofiles);
app.use("/profiles", express.static("profiles"));

app.use("/uploadphoto", uploadphotos);
app.use("/photos", express.static("photos"));

app.use("/photostate", photostate);
