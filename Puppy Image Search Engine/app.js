/**
 * Nicholas Yu
 * CSE154 AD
 * May 29th, 2021
 * Node javascript file acting as a calling file as well
 * as the means of storing data into the database. Links
 * to server 8000.
 */
"use strict";

const express = require('express');
const multer = require('multer');
const app = express();

const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

const SERVER_ERROR = 500;
const INVALID_PARAM = 400;

/**
 * Get function that sends all of the data from all of the columns in
 * Yips table upon being called in a JSON format. If the user attaches
 * a query parameter of search, sends specific IDs containing the searched
 * letters.
 */
app.get("/yipper/yips", async function(req, res) {
  try {
    const db = await getDBConnection();
    let qry = "";

    if (req.query['search']) {
      qry += "SELECT id FROM yips WHERE yip LIKE '%" + req.query['search'] + "%'";
    } else {
      qry += "SELECT *\
              FROM yips ORDER BY DATETIME(date) DESC;";
    }
    let yips = await db.all(qry);
    await db.close();

    res.json({"yips": yips});
  } catch (err) {
    serverErrorHandle(res);
  }
});

/**
 * Get function that, upon being called, returns name, yip post, hashtag,
 * and a date related to the user name received as a parameter. The return
 * format is in JSON format.
 */
app.get("/yipper/user/:user", async function(req, res) {
  try {
    const db = await getDBConnection();
    let user = await db.all("SELECT name, yip, hashtag, date \
                            FROM yips WHERE name \
                            LIKE '" + req.params['user'] + "'\
                            ORDER BY DATETIME(date) DESC;");
    await db.close();

    if (user.length === 0) {
      res.type('text');
      res.status(INVALID_PARAM).send('Yikes. User does not exist.');
    } else {
      res.json(searchFind(user));
    }
  } catch (err) {
    serverErrorHandle(res);
  }
});

/**
 * Post function that, upon being called, received the ID of the liked post,
 * updates the like value within the Yips table, and returns the updated value
 * of likes to the client.
 */
app.post("/yipper/likes", async function(req, res) {
  try {
    if (req.body.id) {
      const db = await getDBConnection();
      let likes = await db.all("SELECT likes FROM yips WHERE id\
                                LIKE '" + req.body.id + "'");
      likes = parseInt(likes[0]['likes']) + 1;
      await db.run("UPDATE yips SET likes = " + likes + "\
                    WHERE id = '" + req.body.id + "'");
      await db.close();

      res.json(likes);
    } else {
      res.type('text');
      res.status(INVALID_PARAM).send('Missing one or more of the required params');
    }
  } catch (err) {
    serverErrorHandle(res);
  }
});

/**
 * Post function, when called, return a JSON format of the newly posted
 * Yip post. Receives the inputs from a form and updates the Yips table
 * with new information received as the data.
 */
app.post("/yipper/new", async function(req, res) {
  try {
    if (req.body.name && req.body.full) {
      const db = await getDBConnection();

      let str = req.body.full.split("#");

      let result = await db.run("INSERT INTO yips(name, yip, hashtag, likes) \
                                VALUES (?, ?, ?, 0)", [req.body.name, str[0], str[1]]);
      let date = await db.all("SELECT date, likes FROM yips WHERE id\
                                LIKE '" + result.lastID + "'");

      await db.close();

      res.json({
        "id": result.lastID,
        "name": req.body.name,
        "yip": str[0],
        "hashtag": str[1],
        "likes": date[0].likes,
        "date": date[0].date
      });
    } else {
      res.type('text');
      res.status(INVALID_PARAM);
      res.send('Missing one or more of the required params');
    }
  } catch (err) {
    serverErrorHandle(res);
  }
});

/**
 * Takes an array of yips items and processes it into item array mapping.
 * @param {array} yips - An array of yips with fields name, yip, hashtag and date.
 * @returns {object} - The formatted yips object.
 */
function searchFind(yips) {
  let result = [];

  for (let i = 0; i < yips.length; i++) {
    let post = {};

    post.name = yips[i]['name'];
    post.yip = yips[i]['yip'];
    post.hashtag = yips[i]['hashtag'];
    post.date = yips[i]['date'];

    result.push(post);
  }

  return result;
}

/**
 * opens the database file in a readable formate for this script to use.
 * @returns {Database} the database opened through sqlite.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: 'yipper.db',
    driver: sqlite3.Database
  });

  return db;
}

/**
 * displays the server side error sign via setting the status to 500 and outputting
 * the message.
 * @param {response} res - response to be sent to the cline
 */
function serverErrorHandle(res) {
  res.type('text');
  res.status(SERVER_ERROR).send('An error occurred on the server. Try again later.');
}

app.use(express.static('public'));
const PORT = process.env.PORT || 8000;
app.listen(PORT);
