//@flow
const newsarticledao = require("../DAO/newsarticledao.js");
const runsqlfile = require("../DAO/runsqlfile.js");
let mysql = require("mysql");

let pool = mysql.createPool({
    connectionLimit: 1,
    host: "mysql",
    user: "root",
    password: "secret",
    database: "supertestdb",
    debug: false,
    multipleStatements: true
});

let newsArticleDao = new newsarticledao(pool);

beforeAll(done => {
    runsqlfile("./DAO/create_tables.sql", pool, () => {
        runsqlfile("./DAO/create_testdata.sql", pool, done);
    });
});

afterAll(() => {
    pool.end();
});

test("get one article from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.length).toBe(1);
        expect(data[0].header).toBe("header");
        done();
    }

    newsArticleDao.getArticle(1, callback);
});

test("get all articles from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.length).toBe(1);
        expect(data[0].header).toBe("header");
        done();
    }

    newsArticleDao.getAllArticles(callback);
});

test("get article from category from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.length).toBe(0);
        done();
    }

    newsArticleDao.getCategory("Entertainment", callback);
});

test("get id from article from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.length).toBe(1);
        expect(data[0].id).toBe(1);
        done();
    }

    newsArticleDao.getIdFromArticle("header", "Ola Nordmann" , callback);
});

test("get partial match from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.length).toBe(1);
        expect(data[0].header).toBe("header");
        done();
    }

    newsArticleDao.getIdFromArticle("h", callback);
});

test("add an article to db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.affectedRows).toBeGreaterThanOrEqual(1);
        done();
    }

    newsArticleDao.addArticle(
        { author: "Kari Nordmann", header: "newest", content: "testing", published: "16.11.19 14:44",
            picture: "https://secure.i.telegraph.co.uk/multimedia/archive/03597/POTD_chick_3597497k.jpg" ,
            category: "Entertainment", importance: 1, rating: 0},
        callback
    );
});



test("get newest articles from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.length).toBe(2);
        expect(data[0].header).toBe("newest");
        done();
    }

    newsArticleDao.getNewest(callback);
});

test("update an article in db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.affectedRows).toBe(1);
        done();
    }

    newsArticleDao.updateArticle({content: "change to article",
            picture: "https://images.unsplash.com/photo-1523895665936-7bfe172b757d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80", category: "Sport",
        id: 2}
        ,callback);
});


test("rate an article in db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.affectedRows).toBe(1);
        done();
    }

    newsArticleDao.rateArticle(1
        ,callback);
});


test("delete one article fr0m db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.affectedRows).toBe(1);
        done();
    }

    newsArticleDao.deleteArticle(2
        ,callback);
});




