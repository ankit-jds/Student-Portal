import { getDatabase, ref, set, get, child } from "firebase/database";
const functions = require("firebase-functions");

const express = require("express");
const app = express();

function writeData(data) {
    set(ref(db, 'timer/' + data.id), data);
}

function readData() {

    get(child(ref(db), 'timer/')).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot
        } else {
            console.log("No data available");
        }
    }).catch((error) => {
        console.log("error", error);
    });
}

app.get("/", (req, res) => {
  console.log(1231212);
  res.send("Hello");
  // res.sendFile('../public/index.html');
});

app.get("/api", (req,res) => {
    readData
  res.send("API are awesome...");
});

function timer(time){
    let date=new Date();
    setTimeout((date,time,name) => {
        data=`${name} set a timer at ${date} for ${time} and time is up...`
        writeData(data);
    }, 1000*time);
}

exports.app= functions.https.onRequest(app);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
