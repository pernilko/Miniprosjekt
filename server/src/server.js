//@flow
//let express = require("express");
let mysql = require("mysql");
let app = express();
//let bodyParser: function = require("body-parser");
let server = app.listen(8080);
const NewsArticleDao = require( "../DAO/newsarticledao.js");
const CommentsDao = require("../DAO/commentsdao.js");

let pool = mysql.createPool({
    connectionLimit: 4,
    host: "mysql.stud.iie.ntnu.no",
    user: "pernilko",
    password: "UKZmPSsp",
    database: "pernilko",
    debug: false
});

let newsArticleDao = new NewsArticleDao(pool);
let commentsDao = new CommentsDao(pool);

//app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS, DELETE");
    next();
});


//Get all news articles with importance 1 (max 20)
app.get("/nyhetssak", (req, res) => {
    console.log("Got GET-request from client");
    newsArticleDao.getAllArticles((status,data) => {
        res.status(status);
        res.json(data);
    });
});
//Get all news articles by category
app.get("/nyhetssak/:category", (req, res) => {
    console.log("/nyhetssak/:category: Got GET-request from client ");
    newsArticleDao.getCategory(req.params.category, (status,data) => {
        res.status(status);
        res.json(data);
    });
});

//Get livefeed articles
app.get("/livefeed", (req, res) => {
    console.log("/livefeed: Got GET-request from client ");
    newsArticleDao.getNewest((status,data) => {
        res.status(status);
        res.json(data);
    });
});

//Get an article
app.get("/article/:id", (req, res) => {
    console.log("/article/:id: Got GET-request from client")
    newsArticleDao.getArticle(req.params.id, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Get id from article by header and author
app.get("/article/:header/:author", (req, res) => {
    console.log("/article/:header/:author: Got GET-request from client");
    newsArticleDao.getIdFromArticle(req.params.header,req.params.author, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Get partial match from header
app.get("/article/:header", (req, res) => {
    console.log("/article/:header: Got GET-request from client");
    newsArticleDao.getPartialMatch(req.params.header, (status, data) => {
        res.status(status);
        res.json(data);
    });
});

//Add new news article
app.post("/nyhetssak", (req, res) => {
    console.log("Got POST-request from client");
    newsArticleDao.addArticle(req.body, (status, data) => {
        res.status(status);
        res.json(data)
    });
});


//Update existing news article
app.put("/nyhetssak", (req, res) => {
    console.log("Got PUT-request from client");
    newsArticleDao.updateArticle(req.body, (status, data)=> {
        res.status(status);
        res.json(data);
    })
});


//Search news article
app.delete("/nyhetssak/:id", (req, res) => {
    pool.getConnection((err, connection: function) => {
        console.log("Connected to database");
        if (err) {
            res.json({ error: "Error connecting to db" });
        } else {
            console.log("JEG BRUKES" + req.params.id);
            connection.query(
                "DELETE FROM comments WHERE articleId = ?",
                [req.params.id],
                (err) => {
                    if (err) {
                        console.log(err);
                        res.json({ error: "error querying" });
                    } else {
                        newsArticleDao.deleteArticle(req.params.id, (status, data) => {
                            res.status(status);
                            res.json(data);
                        });
                    }
                }
            );
        }
    });
});

//Rate an article
app.put("/nyhetssak/:id", (req, res) =>{
    console.log("/rate: Got PUT-request from client");
    newsArticleDao.rateArticle(req.params.id, (status, data) => {
        res.status(status);
        res.json(data);
    });
});


//Get comments for an article
app.get("/comment/:id", (req, res) => {
    console.log("/comment/:id: Got GET-request from client ");
    commentsDao.getAllComments(req.params.id, (status,data) => {
        res.status(status);
        res.json(data);
    });
});

//Publish a comment
app.post("/comment/:id", (req, res) => {
    console.log("/comment/:id: Got POST-request from client");
    commentsDao.addComment(req.body, (status, data) => {
        res.status(status);
        res.json(data);
    });
});