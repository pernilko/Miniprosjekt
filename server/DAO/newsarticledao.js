//@flow
const Dao = require("./dao.js");

module.exports = class NewsArticleDao extends Dao {
    getAllArticles(callback: function){
        super.query(
          "SELECT * FROM nyhetssaker WHERE importance = 1 ORDER BY rating LIMIT 20", [], callback
        );
    }

    getNewest(callback: function) {
        super.query(
            "SELECT header, published FROM nyhetssaker WHERE importance=1 ORDER BY id DESC LIMIT 5",
            [],
            callback
        );
    }

    getArticle(id: number, callback: function){
        super.query(
            "SELECT * FROM nyhetssaker WHERE id = ?", [id], callback
        );
    }

    getIdFromArticle(header: string, author: string, callback: function){
        super.query(
            "SELECT id FROM nyhetssaker WHERE header = ? AND author = ?", [header, author], callback
        );
    }

    getPartialMatch(header: string, callback: function){
        super.query(
            "SELECT * FROM nyhetssaker WHERE  header LIKE ?",["%"+header+"%"], callback
        );
    }

    getCategory(category: string, callback: function){
        super.query(
          "SELECT * FROM nyhetssaker WHERE category = ?", [category], callback
        );
    }

    addArticle(json: {author: string, header: string, content: string, published: string, picture: string, category: string, importance: number}, callback: function){
        super.query(
          "INSERT INTO nyhetssaker(author, header, content, published, picture, category, importance, rating) VALUES (?,?,?,?,?,?,?,0)",
            [json.author, json.header, json.content, json.published, json.picture, json.category, json.importance], callback
        );
    }

    deleteArticle(id: number, callback: function){
        super.query(
            "DELETE FROM nyhetssaker WHERE id = ?", [id], callback
        );
    }


    updateArticle(json: {content: string, picture: string, category: string, id: number}, callback: function){
        super.query(
            "UPDATE nyhetssaker SET content=?, picture=?,category=? WHERE id = ?",
            [json.content, json.picture, json.category, json.id], callback
        );
    }

    rateArticle(id: number, callback: function){
        super.query(
            "UPDATE nyhetssaker SET rating = rating + 1 WHERE id = ?",
            [id], callback
        );
    }
};