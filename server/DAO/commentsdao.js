//@flow
const dao = require("./dao.js");

module.exports = class CommentDao extends  dao {
    getAllComments(articleId: number, callback: function){
        super.query(
            "SELECT commentId, comment, nick FROM comments c JOIN nyhetssaker n on c.articleId = n.id WHERE c.articleId = ?",
            [articleId], callback
        );

    }

    addComment(json: {comment: string, articleId: number, nick: string}, callback: function){
        super.query(
            "INSERT INTO comments(comment, articleId, nick) VALUES (?,?,?)", [json.comment, json.articleId, json.nick], callback
        );
    }
};