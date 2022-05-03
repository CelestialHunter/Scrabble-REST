const PORT = process.env.PORT || 8080;
const HOST = '185.104.48.59';

const LOCALHOST = process.env.LOCALHOST;
const PASSWORD = process.env.PASSWORD;


const express = require('express');
const db = require('mysql');

var con = db.createConnection({
    host: LOCALHOST,
    user: "root",
    password: PASSWORD,
    database: "dexonline",
});

const app = express()

app.get('/', (req, res) => {
    res.json("Empty request");
    });

app.get('/:myLetters', (req, res) => {
    var myLetters = req.params.myLetters;
    // check if myLetters contains letters only
    if (!/^[a-zA-ZăîșțĂÎȘȚ]+$/.test(myLetters)) {
        res.json("Wrong request");
        return;
    }
    myLetters = myLetters.toLowerCase();

    // start connection
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");

        // querry the database
        con.query("SELECT DISTINCT(TRIM(getFirstWord(description))) FROM Entry WHERE isValid(getFirstWord(description), \"" + myLetters + "\");", function (err, result, fields) {
            if (err) throw err;
            //res.json(result);
            var words = [];
            // for( var i = 0; i < result.length; i++){
            //     words.push(result["getFirstWord(description)"]);
            // }
            Object.keys(result).forEach(function(key) {
                words.push(result[key]["(TRIM(getFirstWord(description)))"]);
            });
            res.json({words: words});
        });

    });    
    
    // end connection
    con.end(function(err) {
        if (err) throw err;
        console.log("Connection closed");
    });
});

app.listen(PORT, () => console.log("server running on PORT" + PORT));