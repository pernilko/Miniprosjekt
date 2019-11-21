//@flow
const commentsdao = require("../DAO/commentsdao.js");
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

let commentsDao = new commentsdao(pool);

beforeAll(done => {
    runsqlfile("./DAO/create_tables.sql", pool, () => {
        runsqlfile("./DAO/create_testdata.sql", pool, done);
    });
});

afterAll(() => {
    pool.end();
});

test("get all comments from one article from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.length).toBe(1);
        expect(data[0].comment).toBe("Cool comment");
        done();
    }

    commentsDao.getAllComments(1, callback);
});

test("get all comments from one article from db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.length).toBe(1);
        expect(data[0].comment).toBe("Cool comment");
        done();
    }

    commentsDao.getAllComments(1, callback);
});


test("add a comment to db", done => {
    function callback(status, data) {
        console.log(
            "Test callback: status=" + status + ", data=" + JSON.stringify(data)
        );
        expect(data.affectedRows).toBe(1);
        done();
    }

    commentsDao.addComment({comment: "New comment", articleId: 1, nick: "A" },
        callback);
});
